import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  creations: router({
    // Listar todas as criações do usuário
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCreations } = await import("./db");
      return getUserCreations(ctx.user.id);
    }),

    // Obter uma criação específica
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const { getCreationById } = await import("./db");
        return getCreationById(input.id);
      }),

    // Criar nova criação
    create: protectedProcedure
      .input(
        z.object({
          text: z.string(),
          format: z.enum(["square", "portrait", "story"]),
          model: z.enum(["classic", "bold", "fade", "highlight"]),
          backgroundImageUrl: z.string().optional(),
          backgroundImageKey: z.string().optional(),
          fontSize: z.number().default(100),
          font: z.string().default("Inter"),
          textColor: z.enum(["white", "black"]).default("white"),
          textOutline: z.number().default(0),
          alignHorizontal: z.enum(["left", "center", "right"]).default("center"),
          alignVertical: z.enum(["top", "middle", "bottom"]).default("middle"),
          fadeOverlay: z.number().default(50),
          blur: z.number().default(0),
          brightness: z.number().default(100),
          contrast: z.number().default(100),
          exportedImageUrl: z.string().optional(),
          exportedImageKey: z.string().optional(),
          tags: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createCreation } = await import("./db");
        return createCreation({
          ...input,
          userId: ctx.user.id,
        });
      }),

    // Atualizar criação existente
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          text: z.string().optional(),
          format: z.enum(["square", "portrait", "story"]).optional(),
          model: z.enum(["classic", "bold", "fade", "highlight"]).optional(),
          backgroundImageUrl: z.string().optional(),
          backgroundImageKey: z.string().optional(),
          fontSize: z.number().optional(),
          font: z.string().optional(),
          textColor: z.enum(["white", "black"]).optional(),
          textOutline: z.number().optional(),
          alignHorizontal: z.enum(["left", "center", "right"]).optional(),
          alignVertical: z.enum(["top", "middle", "bottom"]).optional(),
          fadeOverlay: z.number().optional(),
          blur: z.number().optional(),
          brightness: z.number().optional(),
          contrast: z.number().optional(),
          exportedImageUrl: z.string().optional(),
          exportedImageKey: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { updateCreation } = await import("./db");
        const { id, ...updates } = input;
        return updateCreation(id, updates);
      }),

    // Deletar criação
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteCreation } = await import("./db");
        await deleteCreation(input.id, ctx.user.id);
        return { success: true };
      }),
      
    // Duplicar criação
    duplicate: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getCreationById, createCreation } = await import("./db");
        const original = await getCreationById(input.id);
        
        if (!original) {
          throw new Error("Criação não encontrada");
        }
        
        // Criar cópia sem o ID e com userId do usuário atual
        const { id, createdAt, updatedAt, ...creationData } = original;
        return createCreation({
          ...creationData,
          userId: ctx.user.id,
        });
      }),

    // Listar versões de uma criação
    listVersions: protectedProcedure
      .input(z.object({ creationId: z.number() }))
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const { creations } = await import("../drizzle/schema");
        const { eq, or } = await import("drizzle-orm");
        
        const db = await getDb();
        if (!db) return [];
        
        // Buscar todas as versões relacionadas
        const allVersions = await db
          .select()
          .from(creations)
          .where(
            or(
              eq(creations.id, input.creationId),
              eq(creations.parentVersionId, input.creationId)
            )
          )
          .orderBy(creations.versionNumber);
        
        return allVersions.reverse(); // Mais recente primeiro
      }),

    // Restaurar versão anterior
    restoreVersion: protectedProcedure
      .input(z.object({ versionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getCreationById, createCreation } = await import("./db");
        const versionToRestore = await getCreationById(input.versionId);
        
        if (!versionToRestore) {
          throw new Error("Versão não encontrada");
        }
        
        // Criar nova versão baseada na versão restaurada
        const { id, createdAt, updatedAt, versionNumber, ...versionData } = versionToRestore;
        return createCreation({
          ...versionData,
          userId: ctx.user.id,
          parentVersionId: input.versionId,
          versionNumber: (versionNumber || 1) + 1,
        });
      }),
  }),

  // Upload de imagem para S3
  upload: router({
    // Gerar URL assinada para upload direto do cliente
    getUploadUrl: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          contentType: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { nanoid } = await import("nanoid");
        const { storagePut } = await import("./storage");
        
        const fileKey = `users/${ctx.user.id}/backgrounds/${nanoid()}-${input.filename}`;
        
        return {
          fileKey,
          uploadUrl: fileKey, // Cliente fará upload via procedure uploadImage
        };
      }),

    // Upload de imagem (recebe base64 ou buffer)
    uploadImage: protectedProcedure
      .input(
        z.object({
          fileKey: z.string(),
          data: z.string(), // base64
          contentType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const { storagePut } = await import("./storage");
        
        // Converter base64 para buffer
        const base64Data = input.data.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, "base64");
        
        const result = await storagePut(input.fileKey, buffer, input.contentType);
        
        return {
          url: result.url,
          key: result.key,
        };
      }),
  }),

  // IA - Geração de imagens e sugestões
  ai: router({
    // Gerar imagem com IA
    generateImage: protectedProcedure
      .input(
        z.object({
          prompt: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { generateImage } = await import("./_core/imageGeneration");
        const { storagePut } = await import("./storage");
        const { nanoid } = await import("nanoid");
        
        // Gerar imagem com IA
        const result = await generateImage({
          prompt: input.prompt,
        });
        
        if (!result.url) {
          throw new Error("Failed to generate image");
        }
        
        // Baixar imagem gerada e fazer upload para nosso S3
        const response = await fetch(result.url);
        const buffer = Buffer.from(await response.arrayBuffer());
        
        const fileKey = `users/${ctx.user.id}/ai-generated/${nanoid()}.png`;
        const uploaded = await storagePut(fileKey, buffer, "image/png");
        
        return {
          url: uploaded.url,
          key: uploaded.key,
        };
      }),

    // Gerar sugestões de legendas
    generateCaptions: protectedProcedure
      .input(
        z.object({
          text: z.string(),
          imageContext: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const prompt = `Você é um especialista em marketing de mídia social. Gere 3 sugestões de legendas criativas e envolventes para um post do Instagram.

Contexto:
${input.text ? `Texto na imagem: "${input.text}"` : ""}
${input.imageContext ? `Descrição da imagem: ${input.imageContext}` : ""}

Retorne apenas as 3 legendas, uma por linha, sem numeração ou marcação.`;
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um especialista em marketing de mídia social especializado em Instagram." },
            { role: "user", content: prompt },
          ],
        });
        
        const content = response.choices[0]?.message?.content || "";
        const captions = typeof content === 'string' 
          ? content.split("\n").filter((line: string) => line.trim().length > 0)
          : [];
        
        return { captions };
      }),
    
    removeBackground: protectedProcedure
      .input(
        z.object({
          imageUrl: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Verificar se usuário tem créditos suficientes
        const { getUserCredits, useCredits } = await import("./credits");
        const credits = await getUserCredits(ctx.user.id);
        
        if (!credits || credits.balance < 1) {
          throw new Error("Créditos insuficientes. Compre mais créditos para usar esta funcionalidade.");
        }
        
        // Integração com remove.bg API
        const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
        
        if (!REMOVE_BG_API_KEY) {
          throw new Error("Remove.bg API key não configurada. Configure a chave em Settings > Secrets no painel de gerenciamento.");
        }
        
        try {
          const FormData = (await import("form-data")).default;
          const axios = (await import("axios")).default;
          
          const formData = new FormData();
          formData.append("image_url", input.imageUrl);
          formData.append("size", "auto");
          formData.append("format", "png");
          
          const response = await axios.post(
            "https://api.remove.bg/v1.0/removebg",
            formData,
            {
              headers: {
                "X-Api-Key": REMOVE_BG_API_KEY,
                ...formData.getHeaders(),
              },
              responseType: "arraybuffer",
            }
          );
          
          // Fazer upload da imagem processada para S3
          const { storagePut } = await import("./storage");
          const { nanoid } = await import("nanoid");
          
          const fileKey = `${ctx.user.id}-nobg/${nanoid()}.png`;
          const result = await storagePut(
            fileKey,
            Buffer.from(response.data),
            "image/png"
          );
          
          // Descontar crédito do usuário
          await useCredits(
            ctx.user.id,
            1,
            "remove_bg",
            "Remoção de fundo de imagem"
          );
          
          return { 
            url: result.url,
            message: "Fundo removido com sucesso",
            creditsUsed: 1,
            remainingCredits: credits.balance - 1
          };
        } catch (error: any) {
          if (error.response?.status === 402) {
            throw new Error("Créditos insuficientes na conta remove.bg. Adicione mais créditos em https://remove.bg");
          }
          if (error.response?.status === 403) {
            throw new Error("API key inválida. Verifique sua chave em Settings > Secrets.");
          }
          throw new Error(`Erro ao remover fundo: ${error.message}`);
        }
      }),
  }),
  
  templates: router({
    list: publicProcedure.query(async () => {
      const { estheticsTemplates } = await import("@shared/templates");
      return estheticsTemplates;
    }),
    
    getByCategory: publicProcedure
      .input(z.object({ category: z.enum(["antes-depois", "promocao", "depoimento", "procedimento", "dica", "resultado"]) }))
      .query(async ({ input }) => {
        const { getTemplatesByCategory } = await import("@shared/templates");
        return getTemplatesByCategory(input.category);
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        const { getTemplateById } = await import("@shared/templates");
        return getTemplateById(input.id);
      }),
  }),
  
  schedule: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { scheduledPosts } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      return db.select().from(scheduledPosts).where(eq(scheduledPosts.userId, ctx.user.id));
    }),
    
    create: protectedProcedure
      .input(
        z.object({
          creationId: z.number(),
          scheduledFor: z.date(),
          caption: z.string().optional(),
          hashtags: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { scheduledPosts } = await import("../drizzle/schema");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.insert(scheduledPosts).values({
          userId: ctx.user.id,
          creationId: input.creationId,
          scheduledFor: input.scheduledFor,
          caption: input.caption,
          hashtags: input.hashtags,
          status: "pending",
        });
        
        return { success: true };
      }),
    
    cancel: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { scheduledPosts } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        await db.update(scheduledPosts)
          .set({ status: "cancelled" })
          .where(
            and(
              eq(scheduledPosts.id, input.id),
              eq(scheduledPosts.userId, ctx.user.id)
            )
          );
        
        return { success: true };
      }),
  }),
  
  credits: router({
    // Obter saldo de créditos
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCredits } = await import("./credits");
      return getUserCredits(ctx.user.id);
    }),
    
    // Obter histórico de transações
    getTransactions: protectedProcedure
      .input(z.object({ limit: z.number().optional().default(50) }))
      .query(async ({ ctx, input }) => {
        const { getCreditTransactions } = await import("./credits");
        return getCreditTransactions(ctx.user.id, input.limit);
      }),
    
    // Comprar créditos (integração Stripe)
    purchase: protectedProcedure
      .input(z.object({
        package: z.enum(["small", "medium", "large"]), // 10, 50, 100 créditos
      }))
      .mutation(async ({ ctx, input }) => {
        const { addCredits } = await import("./credits");
        
        const packages = {
          small: { credits: 10, price: 9.90 },
          medium: { credits: 50, price: 39.90 },
          large: { credits: 100, price: 69.90 },
        };
        
        const pkg = packages[input.package];
        
        // TODO: Integrar Stripe para pagamento real
        // Por enquanto, adicionar créditos diretamente (simulação)
        await addCredits(
          ctx.user.id,
          pkg.credits,
          "purchase",
          `Compra de pacote ${input.package} (${pkg.credits} créditos)`
        );
        
        return { success: true, credits: pkg.credits };
      }),
  }),
  
  favorites: router({
    // Listar favoritos do usuário
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserFavorites } = await import("./credits");
      return getUserFavorites(ctx.user.id);
    }),
    
    // Adicionar aos favoritos
    add: protectedProcedure
      .input(z.object({ elementId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { addFavorite } = await import("./credits");
        return addFavorite(ctx.user.id, input.elementId);
      }),
    
    // Remover dos favoritos
    remove: protectedProcedure
      .input(z.object({ elementId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { removeFavorite } = await import("./credits");
        return removeFavorite(ctx.user.id, input.elementId);
      }),
    
    // Verificar se é favorito
    check: protectedProcedure
      .input(z.object({ elementId: z.string() }))
      .query(async ({ ctx, input }) => {
        const { isFavorite } = await import("./credits");
        return isFavorite(ctx.user.id, input.elementId);
      }),
  }),
  
  analytics: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { postAnalytics } = await import("../drizzle/schema");
      const { eq, desc } = await import("drizzle-orm");
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      return db.select().from(postAnalytics)
        .where(eq(postAnalytics.userId, ctx.user.id))
        .orderBy(desc(postAnalytics.publishedAt));
    }),
    
    create: protectedProcedure
      .input(
        z.object({
          creationId: z.number(),
          likes: z.number().default(0),
          comments: z.number().default(0),
          shares: z.number().default(0),
          saves: z.number().default(0),
          reach: z.number().default(0),
          impressions: z.number().default(0),
          publishedAt: z.date(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { postAnalytics } = await import("../drizzle/schema");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const publishedDate = new Date(input.publishedAt);
        const dayOfWeek = publishedDate.getDay();
        const hourOfDay = publishedDate.getHours();
        
        await db.insert(postAnalytics).values({
          userId: ctx.user.id,
          creationId: input.creationId,
          likes: input.likes,
          comments: input.comments,
          shares: input.shares,
          saves: input.saves,
          reach: input.reach,
          impressions: input.impressions,
          publishedAt: input.publishedAt,
          dayOfWeek,
          hourOfDay,
        });
        
        return { success: true };
      }),
    
    insights: protectedProcedure.query(async ({ ctx }) => {
      const { postAnalytics } = await import("../drizzle/schema");
      const { eq, sql } = await import("drizzle-orm");
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return { bestHours: [] };
      
      // Calcular melhores horários
      const bestHours = await db
        .select({
          dayOfWeek: postAnalytics.dayOfWeek,
          hour: postAnalytics.hourOfDay,
          avgEngagement: sql<number>`AVG((${postAnalytics.likes} + ${postAnalytics.comments} + ${postAnalytics.shares} + ${postAnalytics.saves}) * 100.0 / NULLIF(${postAnalytics.reach}, 0))`,
          count: sql<number>`COUNT(*)`,
        })
        .from(postAnalytics)
        .where(eq(postAnalytics.userId, ctx.user.id))
        .groupBy(postAnalytics.dayOfWeek, postAnalytics.hourOfDay)
        .orderBy(sql`avgEngagement DESC`)
        .limit(10);
      
      return { bestHours };
    }),
    
    getBestTimes: protectedProcedure.query(async ({ ctx }) => {
      const { postAnalytics } = await import("../drizzle/schema");
      const { eq, sql } = await import("drizzle-orm");
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      // Calcular média de engajamento por hora do dia
      const results = await db.select({
        hour: postAnalytics.hourOfDay,
        avgEngagement: sql<number>`AVG((${postAnalytics.likes} + ${postAnalytics.comments} * 2 + ${postAnalytics.shares} * 3 + ${postAnalytics.saves} * 2) * 100.0 / GREATEST(${postAnalytics.reach}, 1))`,
        postCount: sql<number>`COUNT(*)`,
      })
      .from(postAnalytics)
      .where(eq(postAnalytics.userId, ctx.user.id))
      .groupBy(postAnalytics.hourOfDay)
      .orderBy(sql`AVG((${postAnalytics.likes} + ${postAnalytics.comments} * 2 + ${postAnalytics.shares} * 3 + ${postAnalytics.saves} * 2) * 100.0 / GREATEST(${postAnalytics.reach}, 1)) DESC`)
      .limit(5);
      
      return results.map(r => ({
        hour: Number(r.hour) || 0,
        avgEngagement: Number(r.avgEngagement) || 0,
        postCount: Number(r.postCount) || 0,
      }));
    }),
  }),
  
  userTemplates: router({
    // Listar templates do usuário
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserTemplates } = await import("./userTemplates");
      return getUserTemplates(ctx.user.id);
    }),
    
    // Criar novo template
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          format: z.enum(["square", "portrait", "story"]),
          model: z.enum(["classic", "bold", "fade", "highlight"]),
          font: z.string(),
          fontSize: z.number(),
          textColor: z.string(),
          horizontalAlign: z.string(),
          verticalAlign: z.string(),
          textOutline: z.number(),
          fadeOverlay: z.number(),
          blur: z.number(),
          brightness: z.number(),
          contrast: z.number(),
          previewUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { createUserTemplate } = await import("./userTemplates");
        return createUserTemplate({
          userId: ctx.user.id,
          ...input,
        });
      }),
    
    // Obter template específico
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getUserTemplate } = await import("./userTemplates");
        return getUserTemplate(ctx.user.id, input.id);
      }),
    
    // Atualizar template
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          previewUrl: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        const { updateUserTemplate } = await import("./userTemplates");
        return updateUserTemplate(ctx.user.id, id, data);
      }),
    
    // Deletar template
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteUserTemplate } = await import("./userTemplates");
        return deleteUserTemplate(ctx.user.id, input.id);
      }),
  }),

  // Instagram integration
  instagram: router({
    // Obter conexão do Instagram do usuário
    getConnection: protectedProcedure.query(async ({ ctx }) => {
      const { getUserInstagramConnection } = await import("./instagram");
      return getUserInstagramConnection(ctx.user.id);
    }),

    // Obter URL de autorização do Instagram
    getAuthUrl: protectedProcedure.query(() => {
      const appId = process.env.INSTAGRAM_APP_ID;
      const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

      if (!appId || !redirectUri) {
        throw new Error("Instagram credentials not configured");
      }

      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${appId}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=user_profile,user_media&response_type=code`;

      return { authUrl };
    }),

    // Conectar conta do Instagram (após callback OAuth)
    connect: protectedProcedure
      .input(
        z.object({
          code: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { exchangeCodeForToken, upsertInstagramConnection } = await import(
          "./instagram"
        );

        const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;
        if (!redirectUri) {
          throw new Error("Instagram redirect URI not configured");
        }

        // Trocar código por token
        const tokenData = await exchangeCodeForToken(input.code, redirectUri);

        // Salvar conexão no banco
        const expiresAt = new Date();
        expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expiresIn);

        await upsertInstagramConnection({
          userId: ctx.user.id,
          instagramUserId: tokenData.userId,
          instagramUsername: tokenData.username,
          accessToken: tokenData.accessToken,
          tokenExpiresAt: expiresAt,
        });

        return {
          success: true,
          username: tokenData.username,
        };
      }),

    // Publicar post simples no Instagram
    publishPost: protectedProcedure
      .input(
        z.object({
          creationId: z.number(),
          caption: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const {
          getUserInstagramConnection,
          publishToInstagram,
          createInstagramPublication,
          updatePublicationStatus,
        } = await import("./instagram");
        const { getCreationById } = await import("./db");

        // Verificar conexão do Instagram
        const connection = await getUserInstagramConnection(ctx.user.id);
        if (!connection) {
          throw new Error("Instagram account not connected");
        }

        // Obter criação
        const creation = await getCreationById(input.creationId);
        if (!creation || !creation.exportedImageUrl) {
          throw new Error("Creation not found or not exported");
        }

        // Criar registro de publicação
        const publicationResult = await createInstagramPublication({
          userId: ctx.user.id,
          creationId: input.creationId,
        });

        const publicationId = 1; // TODO: Get actual ID from result

        try {
          // Publicar no Instagram
          const result = await publishToInstagram({
            accessToken: connection.accessToken,
            instagramUserId: connection.instagramUserId,
            imageUrl: creation.exportedImageUrl,
            caption: input.caption,
          });

          if (result.success && result.postId) {
            await updatePublicationStatus(publicationId, "published", {
              instagramPostId: result.postId,
              publishedAt: new Date(),
            });

            return {
              success: true,
              postId: result.postId,
            };
          } else {
            await updatePublicationStatus(publicationId, "failed", {
              errorMessage: result.error,
            });

            throw new Error(result.error || "Failed to publish");
          }
        } catch (error) {
          await updatePublicationStatus(publicationId, "failed", {
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          });
          throw error;
        }
      }),

    // Publicar carrossel no Instagram
    publishCarousel: protectedProcedure
      .input(
        z.object({
          creationIds: z.array(z.number()),
          caption: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const {
          getUserInstagramConnection,
          publishCarouselToInstagram,
          createInstagramPublication,
          updatePublicationStatus,
        } = await import("./instagram");
        const { getCreationById } = await import("./db");

        // Verificar conexão do Instagram
        const connection = await getUserInstagramConnection(ctx.user.id);
        if (!connection) {
          throw new Error("Instagram account not connected");
        }

        // Obter URLs das imagens
        const imageUrls: string[] = [];
        for (const creationId of input.creationIds) {
          const creation = await getCreationById(creationId);
          if (creation && creation.exportedImageUrl) {
            imageUrls.push(creation.exportedImageUrl);
          }
        }

        if (imageUrls.length === 0) {
          throw new Error("No valid images found");
        }

        // Criar registro de publicação (usar primeira criação como referência)
        const publicationResult = await createInstagramPublication({
          userId: ctx.user.id,
          creationId: input.creationIds[0],
        });

        const publicationId = 1; // TODO: Get actual ID from result

        try {
          // Publicar carrossel no Instagram
          const result = await publishCarouselToInstagram({
            accessToken: connection.accessToken,
            instagramUserId: connection.instagramUserId,
            imageUrls,
            caption: input.caption,
          });

          if (result.success && result.postId) {
            await updatePublicationStatus(publicationId, "published", {
              instagramPostId: result.postId,
              publishedAt: new Date(),
            });

            return {
              success: true,
              postId: result.postId,
            };
          } else {
            await updatePublicationStatus(publicationId, "failed", {
              errorMessage: result.error,
            });

            throw new Error(result.error || "Failed to publish carousel");
          }
        } catch (error) {
          await updatePublicationStatus(publicationId, "failed", {
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          });
          throw error;
        }
      }),

    // Listar publicações do usuário
    listPublications: protectedProcedure.query(async ({ ctx }) => {
      const { getUserPublications } = await import("./instagram");
      return getUserPublications(ctx.user.id);
    }),
  }),

  // Router de paletas favoritas
  favoritePalettes: router({
    // Listar paletas favoritas do usuário
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      const { userFavoritePalettes } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const favorites = await db.select()
        .from(userFavoritePalettes)
        .where(eq(userFavoritePalettes.userId, Number(ctx.user.id)));
      
      return favorites.map((fav: any) => ({
        id: fav.id,
        paletteId: fav.paletteId,
        paletteName: fav.paletteName,
        colors: JSON.parse(fav.colors),
        createdAt: fav.createdAt,
      }));
    }),

    // Adicionar paleta aos favoritos
    add: protectedProcedure
      .input(z.object({
        paletteId: z.string(),
        paletteName: z.string(),
        colors: z.array(z.string()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { userFavoritePalettes } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Verificar se já existe
        const existing = await db.select()
          .from(userFavoritePalettes)
          .where(
            and(
              eq(userFavoritePalettes.userId, Number(ctx.user.id)),
              eq(userFavoritePalettes.paletteId, input.paletteId)
            )
          );
        
        if (existing.length > 0) {
          return { success: false, message: "Paleta já está nos favoritos" };
        }
        
        await db.insert(userFavoritePalettes).values({
          userId: Number(ctx.user.id),
          paletteId: input.paletteId,
          paletteName: input.paletteName,
          colors: JSON.stringify(input.colors),
        });
        
        return { success: true };
      }),

    // Remover paleta dos favoritos
    remove: protectedProcedure
      .input(z.object({ paletteId: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { userFavoritePalettes } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(userFavoritePalettes)
          .where(
            and(
              eq(userFavoritePalettes.userId, Number(ctx.user.id)),
              eq(userFavoritePalettes.paletteId, input.paletteId)
            )
          );
        
        return { success: true };
      }),

    // Verificar se paleta está nos favoritos
    isFavorite: protectedProcedure
      .input(z.object({ paletteId: z.string() }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return false;
        
        const { userFavoritePalettes } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        const result = await db.select()
          .from(userFavoritePalettes)
          .where(
            and(
              eq(userFavoritePalettes.userId, Number(ctx.user.id)),
              eq(userFavoritePalettes.paletteId, input.paletteId)
            )
          );
        
        return result.length > 0;
      }),
  }),

  // Router de publicações recorrentes
  recurring: router({
    // Criar publicação recorrente
    create: protectedProcedure
      .input(z.object({
        creationId: z.number(),
        title: z.string(),
        frequency: z.enum(["daily", "weekly", "monthly"]),
        dayOfWeek: z.number().optional(), // 0-6
        dayOfMonth: z.number().optional(), // 1-31
        time: z.string(), // HH:MM
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { recurringPosts } = await import("../drizzle/schema");
        
        // Calcular próxima execução
        const now = new Date();
        const [hours, minutes] = input.time.split(":").map(Number);
        const nextExecution = new Date();
        nextExecution.setHours(hours, minutes, 0, 0);
        
        if (input.frequency === "daily") {
          if (nextExecution < now) {
            nextExecution.setDate(nextExecution.getDate() + 1);
          }
        } else if (input.frequency === "weekly" && input.dayOfWeek !== undefined) {
          nextExecution.setDate(nextExecution.getDate() + ((input.dayOfWeek - nextExecution.getDay() + 7) % 7));
          if (nextExecution < now) {
            nextExecution.setDate(nextExecution.getDate() + 7);
          }
        } else if (input.frequency === "monthly" && input.dayOfMonth !== undefined) {
          nextExecution.setDate(input.dayOfMonth);
          if (nextExecution < now) {
            nextExecution.setMonth(nextExecution.getMonth() + 1);
          }
        }
        
        await db.insert(recurringPosts).values({
          userId: Number(ctx.user.id),
          creationId: input.creationId,
          title: input.title,
          frequency: input.frequency,
          dayOfWeek: input.dayOfWeek,
          dayOfMonth: input.dayOfMonth,
          time: input.time,
          isActive: 1,
          nextExecutionAt: nextExecution,
        });
        
        return { success: true };
      }),

    // Listar publicações recorrentes
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      const { recurringPosts, creations } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const posts = await db.select()
        .from(recurringPosts)
        .leftJoin(creations, eq(recurringPosts.creationId, creations.id))
        .where(eq(recurringPosts.userId, Number(ctx.user.id)));
      
      return posts.map(p => ({
        id: p.recurring_posts.id,
        title: p.recurring_posts.title,
        frequency: p.recurring_posts.frequency,
        dayOfWeek: p.recurring_posts.dayOfWeek,
        dayOfMonth: p.recurring_posts.dayOfMonth,
        time: p.recurring_posts.time,
        isActive: p.recurring_posts.isActive,
        nextExecutionAt: p.recurring_posts.nextExecutionAt,
        creation: p.creations ? {
          id: p.creations.id,
          text: p.creations.text,
          imageUrl: p.creations.backgroundImageUrl,
        } : null,
      }));
    }),

    // Pausar/Retomar publicação recorrente
    toggle: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { recurringPosts } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Buscar post atual
        const posts = await db.select()
          .from(recurringPosts)
          .where(
            and(
              eq(recurringPosts.id, input.id),
              eq(recurringPosts.userId, Number(ctx.user.id))
            )
          );
        
        if (posts.length === 0) {
          throw new Error("Publicação não encontrada");
        }
        
        const newStatus = posts[0].isActive === 1 ? 0 : 1;
        
        await db.update(recurringPosts)
          .set({ isActive: newStatus })
          .where(eq(recurringPosts.id, input.id));
        
        return { success: true, isActive: newStatus };
      }),

    // Deletar publicação recorrente
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { recurringPosts } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(recurringPosts)
          .where(
            and(
              eq(recurringPosts.id, input.id),
              eq(recurringPosts.userId, Number(ctx.user.id))
            )
          );
        
        return { success: true };
      }),
  }),

  // Análise de concorrentes
  competitors: router({
    add: protectedProcedure
      .input(z.object({ username: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { competitors } = await import("../drizzle/schema");
        
        // Simular dados (em produção, buscar da API do Instagram)
        const mockData = {
          displayName: input.username,
          followers: Math.floor(Math.random() * 50000) + 5000,
          avgEngagement: Math.random() * 10 + 1,
          postsPerWeek: Math.random() * 7 + 1,
        };
        
        await db.insert(competitors).values({
          userId: Number(ctx.user.id),
          username: input.username,
          displayName: mockData.displayName,
          followers: mockData.followers,
          avgEngagement: mockData.avgEngagement,
          postsPerWeek: mockData.postsPerWeek,
        });
        
        return { success: true };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      const { competitors } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      return await db.select()
        .from(competitors)
        .where(eq(competitors.userId, Number(ctx.user.id)));
    }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { competitors } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(competitors)
          .where(
            and(
              eq(competitors.id, input.id),
              eq(competitors.userId, Number(ctx.user.id))
            )
          );
        
        return { success: true };
      }),

    getComparison: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return { user: null, competitors: [] };
      
      const { competitors, postAnalytics } = await import("../drizzle/schema");
      const { eq, avg, count } = await import("drizzle-orm");
      
      // Buscar métricas do usuário
      const userMetrics = await db.select({
        avgLikes: avg(postAnalytics.likes),
        avgComments: avg(postAnalytics.comments),
        totalPosts: count(postAnalytics.id),
      })
        .from(postAnalytics)
        .where(eq(postAnalytics.userId, Number(ctx.user.id)));
      
      const userAvgEngagement = userMetrics[0] ? 
        (Number(userMetrics[0].avgLikes) || 0) + (Number(userMetrics[0].avgComments) || 0) : 0;
      
      // Buscar concorrentes
      const competitorsList = await db.select()
        .from(competitors)
        .where(eq(competitors.userId, Number(ctx.user.id)));
      
      return {
        user: {
          name: "Você",
          avgEngagement: userAvgEngagement,
          totalPosts: Number(userMetrics[0]?.totalPosts) || 0,
        },
        competitors: competitorsList.map(c => ({
          id: c.id,
          name: c.displayName || c.username,
          username: c.username,
          followers: c.followers || 0,
          avgEngagement: c.avgEngagement || 0,
          postsPerWeek: c.postsPerWeek || 0,
        })),
      };
    }),
  }),

  // Notificações de posts agendados
  notifications: router({
    getUpcoming: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      const { scheduledPosts, creations } = await import("../drizzle/schema");
      const { eq, and, gte, lte } = await import("drizzle-orm");
      
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      const upcoming = await db.select({
        id: scheduledPosts.id,
        scheduledFor: scheduledPosts.scheduledFor,
        caption: scheduledPosts.caption,
        creationId: scheduledPosts.creationId,
        text: creations.text,
        format: creations.format,
      })
        .from(scheduledPosts)
        .innerJoin(creations, eq(scheduledPosts.creationId, creations.id))
        .where(
          and(
            eq(scheduledPosts.userId, Number(ctx.user.id)),
            eq(scheduledPosts.status, "pending"),
            gte(scheduledPosts.scheduledFor, now),
            lte(scheduledPosts.scheduledFor, oneHourLater)
          )
        );
      
      return upcoming;
    }),

    getCount: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return 0;
      
      const { scheduledPosts } = await import("../drizzle/schema");
      const { eq, and, gte, lte } = await import("drizzle-orm");
      
      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
      
      const result = await db.select()
        .from(scheduledPosts)
        .where(
          and(
            eq(scheduledPosts.userId, Number(ctx.user.id)),
            eq(scheduledPosts.status, "pending"),
            gte(scheduledPosts.scheduledFor, now),
            lte(scheduledPosts.scheduledFor, oneHourLater)
          )
        );
      
      return result.length;
    }),
  }),

  // Conversão automática para stories
  storyConversion: router({
    convertToStory: protectedProcedure
      .input(z.object({ creationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { creations } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Buscar criação original
        const original = await db.select()
          .from(creations)
          .where(
            and(
              eq(creations.id, input.creationId),
              eq(creations.userId, Number(ctx.user.id))
            )
          );
        
        if (original.length === 0) {
          throw new Error("Criação não encontrada");
        }
        
        // Criar nova criação no formato story (9:16)
        const orig = original[0];
        const result = await db.insert(creations).values({
          userId: orig.userId,
          text: orig.text,
          format: "story",
          model: orig.model,
          font: orig.font,
          fontSize: orig.fontSize,
          textColor: orig.textColor,
          textOutline: orig.textOutline,
          alignHorizontal: orig.alignHorizontal,
          alignVertical: orig.alignVertical,
          fadeOverlay: orig.fadeOverlay,
          blur: orig.blur,
          brightness: orig.brightness,
          contrast: orig.contrast,
          backgroundImageUrl: orig.backgroundImageUrl,
          backgroundImageKey: orig.backgroundImageKey,
        });
        
        return { success: true };
      }),

    convertBatch: protectedProcedure
      .input(z.object({ creationIds: z.array(z.number()) }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { creations } = await import("../drizzle/schema");
        const { eq, and, inArray } = await import("drizzle-orm");
        
        const originals = await db.select()
          .from(creations)
          .where(
            and(
              inArray(creations.id, input.creationIds),
              eq(creations.userId, Number(ctx.user.id))
            )
          );
        
        const converted = [];
        
        for (const orig of originals) {
          const result = await db.insert(creations).values({
            userId: orig.userId,
            text: orig.text,
            format: "story",
            model: orig.model,
            font: orig.font,
            fontSize: orig.fontSize,
            textColor: orig.textColor,
            textOutline: orig.textOutline,
            alignHorizontal: orig.alignHorizontal,
            alignVertical: orig.alignVertical,
            fadeOverlay: orig.fadeOverlay,
            blur: orig.blur,
            brightness: orig.brightness,
            contrast: orig.contrast,
            backgroundImageUrl: orig.backgroundImageUrl,
            backgroundImageKey: orig.backgroundImageKey,
          });
          
          // ID não disponível no resultado
        }
        
        return { success: true, count: originals.length };
      }),
  }),

  // Geração em massa via CSV
  bulkGenerate: router({
    fromCSV: protectedProcedure
      .input(z.object({
        csvData: z.array(z.object({
          text: z.string(),
          format: z.enum(["square", "portrait", "story"]).optional(),
          model: z.enum(["classic", "bold", "fade", "highlight"]).optional(),
          font: z.enum(["Oswald", "Serif", "Mono", "Inter"]).optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { creations } = await import("../drizzle/schema");
        
        const created = [];
        
        for (const row of input.csvData) {
          const result = await db.insert(creations).values({
            userId: Number(ctx.user.id),
            text: row.text,
            format: row.format || "portrait",
            model: row.model || "classic",
            font: row.font || "Oswald",
            fontSize: 48,
            textColor: "white",
            textOutline: 0,
            alignHorizontal: "center",
            alignVertical: "middle",
            fadeOverlay: 50,
            blur: 0,
            brightness: 100,
            contrast: 100,
          });
          
          // ID não disponível no resultado
        }
        
        return { success: true, count: input.csvData.length };
      }),
  }),

  // Router de auto-repost
  autoRepost: router({
    // Criar regra de auto-repost
    createRule: protectedProcedure
      .input(z.object({
        title: z.string(),
        minEngagement: z.number().min(1),
        intervalDays: z.number().min(1).max(365),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { autoRepostRules } = await import("../drizzle/schema");
        
        await db.insert(autoRepostRules).values({
          userId: Number(ctx.user.id),
          title: input.title,
          minEngagement: input.minEngagement,
          intervalDays: input.intervalDays,
          isActive: 1,
        });
        
        return { success: true };
      }),

    // Listar regras
    listRules: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      const { autoRepostRules } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      return await db.select()
        .from(autoRepostRules)
        .where(eq(autoRepostRules.userId, Number(ctx.user.id)));
    }),

    // Buscar posts elegíveis para repost
    getEligiblePosts: protectedProcedure
      .input(z.object({ ruleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return [];
        
        const { autoRepostRules, instagramPublications, postAnalytics, creations } = await import("../drizzle/schema");
        const { eq, and, gte, sql } = await import("drizzle-orm");
        
        // Buscar regra
        const rules = await db.select()
          .from(autoRepostRules)
          .where(
            and(
              eq(autoRepostRules.id, input.ruleId),
              eq(autoRepostRules.userId, Number(ctx.user.id))
            )
          );
        
        if (rules.length === 0) return [];
        
        const rule = rules[0];
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - rule.intervalDays);
        
        // Buscar publicações antigas com analytics
        const publications = await db.select({
          publicationId: instagramPublications.id,
          creationId: instagramPublications.creationId,
          publishedAt: instagramPublications.publishedAt,
          text: creations.text,
          format: creations.format,
          likes: postAnalytics.likes,
          comments: postAnalytics.comments,
          shares: postAnalytics.shares,
        })
          .from(instagramPublications)
          .innerJoin(creations, eq(instagramPublications.creationId, creations.id))
          .leftJoin(postAnalytics, eq(postAnalytics.creationId, instagramPublications.creationId))
          .where(
            and(
              eq(instagramPublications.userId, Number(ctx.user.id)),
              eq(instagramPublications.status, "published")
            )
          );
        
        // Filtrar por engajamento e data
        const eligible = publications.filter(p => {
          const engagement = (p.likes || 0) + (p.comments || 0) + (p.shares || 0);
          const publishDate = p.publishedAt ? new Date(p.publishedAt) : new Date();
          return engagement >= rule.minEngagement && publishDate <= cutoffDate;
        });
        
        // Ordenar por engajamento (maior primeiro)
        eligible.sort((a, b) => {
          const engA = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
          const engB = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
          return engB - engA;
        });
        
        return eligible.slice(0, 10); // Retornar top 10
      }),

    // Executar repost
    executeRepost: protectedProcedure
      .input(z.object({ creationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { scheduledPosts, creations } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Buscar criação
        const creation = await db.select()
          .from(creations)
          .where(
            and(
              eq(creations.id, input.creationId),
              eq(creations.userId, Number(ctx.user.id))
            )
          );
        
        if (creation.length === 0) {
          throw new Error("Criação não encontrada");
        }
        
        // Agendar para próxima semana
        const scheduledDate = new Date();
        scheduledDate.setDate(scheduledDate.getDate() + 7);
        
        await db.insert(scheduledPosts).values({
          userId: Number(ctx.user.id),
          creationId: input.creationId,
          scheduledFor: scheduledDate,
          caption: `[REPOST] ${creation[0].text}`,
          status: "pending",
        });
        
        return { success: true, scheduledFor: scheduledDate };
      }),

    // Toggle regra
    toggleRule: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { autoRepostRules } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        const rules = await db.select()
          .from(autoRepostRules)
          .where(
            and(
              eq(autoRepostRules.id, input.id),
              eq(autoRepostRules.userId, Number(ctx.user.id))
            )
          );
        
        if (rules.length === 0) throw new Error("Regra não encontrada");
        
        const newStatus = rules[0].isActive === 1 ? 0 : 1;
        
        await db.update(autoRepostRules)
          .set({ isActive: newStatus })
          .where(eq(autoRepostRules.id, input.id));
        
        return { success: true, isActive: newStatus };
      }),

    // Deletar regra
    deleteRule: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { autoRepostRules } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(autoRepostRules)
          .where(
            and(
              eq(autoRepostRules.id, input.id),
              eq(autoRepostRules.userId, Number(ctx.user.id))
            )
          );
        
        return { success: true };
      }),
  }),

  // Router de campanhas de posts
  campaigns: router({
    // Criar campanha
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        duration: z.number().min(1).max(90), // 1-90 dias
        startDate: z.date(),
        creationIds: z.array(z.number()),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { postCampaigns } = await import("../drizzle/schema");
        
        await db.insert(postCampaigns).values({
          userId: Number(ctx.user.id),
          title: input.title,
          description: input.description || "",
          duration: input.duration,
          startDate: input.startDate,
          creationIds: JSON.stringify(input.creationIds),
          isActive: 1,
        });
        
        return { success: true };
      }),

    // Listar campanhas
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getDb } = await import("./db");
      const db = await getDb();
      if (!db) return [];
      
      const { postCampaigns } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const campaigns = await db.select()
        .from(postCampaigns)
        .where(eq(postCampaigns.userId, Number(ctx.user.id)));
      
      return campaigns.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        duration: c.duration,
        startDate: c.startDate,
        isActive: c.isActive,
        creationIds: JSON.parse(c.creationIds),
        createdAt: c.createdAt,
      }));
    }),

    // Pausar/Retomar campanha
    toggle: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { postCampaigns } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        const campaigns = await db.select()
          .from(postCampaigns)
          .where(
            and(
              eq(postCampaigns.id, input.id),
              eq(postCampaigns.userId, Number(ctx.user.id))
            )
          );
        
        if (campaigns.length === 0) {
          throw new Error("Campanha não encontrada");
        }
        
        const newStatus = campaigns[0].isActive === 1 ? 0 : 1;
        
        await db.update(postCampaigns)
          .set({ isActive: newStatus })
          .where(eq(postCampaigns.id, input.id));
        
        return { success: true, isActive: newStatus };
      }),

    // Deletar campanha
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { postCampaigns } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(postCampaigns)
          .where(
            and(
              eq(postCampaigns.id, input.id),
              eq(postCampaigns.userId, Number(ctx.user.id))
            )
          );
        
        return { success: true };
      }),
  }),

  // Router de performance de templates
  templatePerformance: router({
    // Obter performance de todos os templates
    getAll: protectedProcedure
      .input(z.object({
        period: z.enum(["7", "30", "90"]).default("30"), // dias
      }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return [];
        
        const { userTemplates, creations, postAnalytics } = await import("../drizzle/schema");
        const { eq, and, gte, sql } = await import("drizzle-orm");
        
        // Data limite baseada no período
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - Number(input.period));
        
        // Buscar templates do usuário
        const templates = await db.select()
          .from(userTemplates)
          .where(eq(userTemplates.userId, Number(ctx.user.id)));
        
        // Para cada template, calcular métricas
        const performance = [];
        
        for (const template of templates) {
          // Buscar criações que usaram este template (baseado em settings similares)
          const templateCreations = await db.select()
            .from(creations)
            .where(
              and(
                eq(creations.userId, Number(ctx.user.id)),
                eq(creations.model, template.model),
                eq(creations.font, template.font)
              )
            );
          
          if (templateCreations.length === 0) continue;
          
          const creationIds = templateCreations.map(c => c.id);
          
          // Buscar analytics dessas criações
          const analytics = await db.select({
            totalLikes: sql<number>`COALESCE(SUM(${postAnalytics.likes}), 0)`,
            totalComments: sql<number>`COALESCE(SUM(${postAnalytics.comments}), 0)`,
            totalShares: sql<number>`COALESCE(SUM(${postAnalytics.shares}), 0)`,
            totalReach: sql<number>`COALESCE(SUM(${postAnalytics.reach}), 0)`,
            count: sql<number>`COUNT(*)`,
          })
          .from(postAnalytics)
          .where(
            and(
              eq(postAnalytics.userId, Number(ctx.user.id)),
              gte(postAnalytics.createdAt, daysAgo)
            )
          );
          
          const stats = analytics[0];
          const postCount = templateCreations.length;
          
          performance.push({
            templateId: template.id,
            templateName: template.name,
            thumbnailUrl: template.previewUrl,
            postCount,
            avgLikes: postCount > 0 ? Number(stats.totalLikes) / postCount : 0,
            avgComments: postCount > 0 ? Number(stats.totalComments) / postCount : 0,
            avgShares: postCount > 0 ? Number(stats.totalShares) / postCount : 0,
            avgReach: postCount > 0 ? Number(stats.totalReach) / postCount : 0,
            totalEngagement: Number(stats.totalLikes) + Number(stats.totalComments) + Number(stats.totalShares),
            settings: {
              model: template.model,
              font: template.font,
              fontSize: template.fontSize,
              textColor: template.textColor,
            },
          });
        }
        
        // Ordenar por engajamento total
        return performance.sort((a, b) => b.totalEngagement - a.totalEngagement);
      }),
  }),

  // Router de geração de variações com IA
  variations: router({
    // Gerar variações de uma criação
    generate: protectedProcedure
      .input(z.object({ creationId: z.number() }))
      .mutation(async ({ input }) => {
        const { getCreationById } = await import("./db");
        const creation = await getCreationById(input.creationId);
        
        if (!creation) {
          throw new Error("Criação não encontrada");
        }

        // Importar paletas de cores
        const { COLOR_PALETTES } = await import("../shared/colorPalettes");
        
        // Definir opções de variação
        const fonts: Array<"Oswald" | "Serif" | "Mono" | "Inter"> = ["Oswald", "Serif", "Mono", "Inter"];
        const models: Array<"classic" | "bold" | "fade" | "highlight"> = ["classic", "bold", "fade", "highlight"];
        const alignments: Array<"left" | "center" | "right"> = ["left", "center", "right"];
        
        // Selecionar 8 paletas aleatórias
        const shuffledPalettes = [...COLOR_PALETTES].sort(() => Math.random() - 0.5).slice(0, 8);
        
        // Gerar 10 variações
        const variations = [];
        
        for (let i = 0; i < 10; i++) {
          const palette = shuffledPalettes[i % shuffledPalettes.length];
          const font = fonts[i % fonts.length];
          const model = models[i % models.length];
          const alignH = alignments[i % alignments.length];
          
          variations.push({
            id: i + 1,
            text: creation.text,
            format: creation.format,
            model,
            font,
            fontSize: creation.fontSize,
            textColor: creation.textColor,
            textOutline: creation.textOutline,
            alignHorizontal: alignH,
            alignVertical: creation.alignVertical,
            fadeOverlay: creation.fadeOverlay,
            blur: creation.blur,
            brightness: creation.brightness,
            contrast: creation.contrast,
            backgroundImageUrl: creation.backgroundImageUrl,
            backgroundImageKey: creation.backgroundImageKey,
            palette: {
              id: palette.id,
              name: palette.name,
              colors: palette.colors,
            },
          });
        }
        
        return variations;
      }),
  }),

  // Edição em lote
  batchEdit: router({
    update: protectedProcedure
      .input(z.object({
        creationIds: z.array(z.number()),
        updates: z.object({
          font: z.enum(["Oswald", "Serif", "Mono", "Inter"]).optional(),
          textColor: z.enum(["white", "black"]).optional(),
          model: z.enum(["classic", "bold", "fade", "highlight"]).optional(),
          alignHorizontal: z.enum(["left", "center", "right"]).optional(),
          alignVertical: z.enum(["top", "middle", "bottom"]).optional(),
        }),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { creations } = await import("../drizzle/schema");
        const { eq, and, inArray } = await import("drizzle-orm");
        
        // Construir objeto de atualização apenas com campos definidos
        const updateData: any = {};
        if (input.updates.font) updateData.font = input.updates.font;
        if (input.updates.textColor) updateData.textColor = input.updates.textColor;
        if (input.updates.model) updateData.model = input.updates.model;
        if (input.updates.alignHorizontal) updateData.alignHorizontal = input.updates.alignHorizontal;
        if (input.updates.alignVertical) updateData.alignVertical = input.updates.alignVertical;
        
        if (Object.keys(updateData).length === 0) {
          throw new Error("Nenhuma atualização fornecida");
        }
        
        // Atualizar apenas criações do usuário
        await db.update(creations)
          .set(updateData)
          .where(
            and(
              inArray(creations.id, input.creationIds),
              eq(creations.userId, Number(ctx.user.id))
            )
          );
        
        return { success: true, count: input.creationIds.length };
      }),
  }),

  // Análise de sentimento
  sentiment: router({
    analyze: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Voc\u00ea \u00e9 um especialista em an\u00e1lise de tom e sentimento de textos para redes sociais. Analise o texto e retorne um JSON."
            },
            {
              role: "user",
              content: `Analise o tom deste texto para Instagram:\n\n"${input.text}"\n\nRetorne um JSON com:\n- tone: profissional, casual, motivacional ou urgente\n- confidence: 0-100\n- suggestions: array de 3 sugest\u00f5es de ajuste`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "sentiment_analysis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  tone: {
                    type: "string",
                    enum: ["profissional", "casual", "motivacional", "urgente"],
                    description: "Tom identificado no texto"
                  },
                  confidence: {
                    type: "number",
                    description: "Confian\u00e7a da an\u00e1lise (0-100)"
                  },
                  suggestions: {
                    type: "array",
                    items: {
                      type: "string",
                      description: "Sugest\u00e3o de ajuste"
                    },
                    description: "Sugest\u00f5es para melhorar o texto"
                  }
                },
                required: ["tone", "confidence", "suggestions"],
                additionalProperties: false
              }
            }
          }
        });
        
        const content = response.choices[0].message.content;
        if (!content || typeof content !== "string") throw new Error("No response from LLM");
        
        const result = JSON.parse(content as string);
        return result;
      }),
  }),

  // Biblioteca de CTAs
  ctas: router({
    list: protectedProcedure
      .input(z.object({ category: z.enum(["vendas", "engajamento", "educacao"]).optional() }))
      .query(async ({ input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return [];
        
        const { ctaLibrary } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        if (input.category) {
          return await db.select().from(ctaLibrary).where(eq(ctaLibrary.category, input.category));
        }
        
        return await db.select().from(ctaLibrary);
      }),

    seed: protectedProcedure
      .mutation(async () => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { ctaLibrary } = await import("../drizzle/schema");
        
        const ctas = [
          // Vendas
          { text: "\u2728 Agende sua consulta agora! Link na bio.", category: "vendas" },
          { text: "\ud83d\udcde Entre em contato pelo WhatsApp e garanta sua vaga!", category: "vendas" },
          { text: "\ud83c\udf81 Promo\u00e7\u00e3o exclusiva! Clique no link e aproveite.", category: "vendas" },
          { text: "\ud83d\uded2 Compre agora com desconto especial!", category: "vendas" },
          { text: "\ud83d\udcb3 Parcelamos em at\u00e9 12x sem juros. Saiba mais!", category: "vendas" },
          { text: "\u23f0 Vagas limitadas! Garanta a sua hoje.", category: "vendas" },
          { text: "\ud83d\udccd Visite nossa cl\u00ednica e conhe\u00e7a nossos servi\u00e7os.", category: "vendas" },
          { text: "\ud83d\udce9 Mande DM para mais informa\u00e7\u00f5es e or\u00e7amento.", category: "vendas" },
          { text: "\ud83d\udc49 Clique no link da bio e agende sua avalia\u00e7\u00e3o gratuita!", category: "vendas" },
          { text: "\ud83c\udf1f N\u00e3o perca essa oportunidade! Oferta v\u00e1lida at\u00e9 amanh\u00e3.", category: "vendas" },
          
          // Engajamento
          { text: "\ud83d\udc4d Curta se voc\u00ea concorda!", category: "engajamento" },
          { text: "\ud83d\udcac Comenta aqui embaixo: qual \u00e9 a sua d\u00favida?", category: "engajamento" },
          { text: "\ud83e\udd14 E voc\u00ea, o que acha? Conta pra gente!", category: "engajamento" },
          { text: "\u2764\ufe0f Marca aquela amiga que precisa ver isso!", category: "engajamento" },
          { text: "\ud83d\udcf2 Salva esse post para n\u00e3o esquecer!", category: "engajamento" },
          { text: "\ud83d\ude4b\u200d\u2640\ufe0f Quem a\u00ed j\u00e1 passou por isso? Levanta a m\u00e3o!", category: "engajamento" },
          { text: "\ud83d\udde3\ufe0f Compartilha nos stories e marca a gente!", category: "engajamento" },
          { text: "\ud83d\udc40 Fica de olho que tem mais novidade vindo!", category: "engajamento" },
          { text: "\u2753 Qual dessas op\u00e7\u00f5es voc\u00ea prefere? Vota aqui!", category: "engajamento" },
          { text: "\ud83c\udf89 Duplo toque se voc\u00ea amou!", category: "engajamento" },
          
          // Educa\u00e7\u00e3o
          { text: "\ud83d\udca1 Dica importante: salve esse post!", category: "educacao" },
          { text: "\ud83d\udcda Quer saber mais? Confira nosso blog!", category: "educacao" },
          { text: "\ud83c\udfaf Dica de especialista: siga essas 3 etapas.", category: "educacao" },
          { text: "\ud83d\udd0d Fique atento aos sinais e cuide da sua sa\u00fade!", category: "educacao" },
          { text: "\u2705 Anota a\u00ed essas dicas valiosas!", category: "educacao" },
          { text: "\ud83d\udccc Informa\u00e7\u00e3o que voc\u00ea precisa saber!", category: "educacao" },
          { text: "\ud83e\udde0 Conhecimento \u00e9 poder! Compartilhe essa informa\u00e7\u00e3o.", category: "educacao" },
          { text: "\ud83d\udcdd Guarde esse checklist para consultar depois.", category: "educacao" },
          { text: "\ud83d\udc69\u200d\u2695\ufe0f Consulte sempre um profissional qualificado!", category: "educacao" },
          { text: "\ud83d\udcac Tem d\u00favidas? Deixa nos coment\u00e1rios que a gente responde!", category: "educacao" },
        ];
        
        // Inserir apenas se a tabela estiver vazia
        const existing = await db.select().from(ctaLibrary).limit(1);
        if (existing.length === 0) {
          await db.insert(ctaLibrary).values(ctas);
        }
        
        return { success: true, count: ctas.length };
      }),
  }),

  // Calendário de conteúdo
  calendar: router({
    reschedule: protectedProcedure
      .input(z.object({
        scheduledPostId: z.number(),
        newDate: z.date(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { scheduledPosts } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Atualizar apenas posts do usuário
        await db.update(scheduledPosts)
          .set({ scheduledFor: input.newDate })
          .where(
            and(
              eq(scheduledPosts.id, input.scheduledPostId),
              eq(scheduledPosts.userId, Number(ctx.user.id))
            )
          );
        
        return { success: true };
      }),

    getMonthPosts: protectedProcedure
      .input(z.object({
        year: z.number(),
        month: z.number(), // 1-12
      }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return [];
        
        const { scheduledPosts, creations } = await import("../drizzle/schema");
        const { eq, and, gte, lte } = await import("drizzle-orm");
        
        // Primeiro e último dia do mês
        const startDate = new Date(input.year, input.month - 1, 1);
        const endDate = new Date(input.year, input.month, 0, 23, 59, 59);
        
        const posts = await db.select({
          id: scheduledPosts.id,
          scheduledFor: scheduledPosts.scheduledFor,
          creationId: scheduledPosts.creationId,
          text: creations.text,
          format: creations.format,
          exportedImageUrl: creations.exportedImageUrl,
        })
        .from(scheduledPosts)
        .leftJoin(creations, eq(scheduledPosts.creationId, creations.id))
        .where(
          and(
            eq(scheduledPosts.userId, Number(ctx.user.id)),
            gte(scheduledPosts.scheduledFor, startDate),
            lte(scheduledPosts.scheduledFor, endDate)
          )
        );
        
        return posts;
      }),
  }),

  // Biblioteca de hashtags inteligente
  hashtags: router({
    generate: protectedProcedure
      .input(z.object({ text: z.string(), creationId: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        // Usar IA para gerar hashtags
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "Você é um especialista em marketing digital e Instagram. Sua tarefa é analisar o texto de um post e sugerir 30 hashtags relevantes em português brasileiro, categorizadas em: alcance (hashtags populares com alto volume), nicho (específicas do segmento), e trending (tendências atuais). Retorne apenas um JSON válido.",
            },
            {
              role: "user",
              content: `Analise este texto e sugira 30 hashtags categorizadas:\n\n${input.text}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "hashtag_suggestions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  reach: {
                    type: "array",
                    description: "10 hashtags de alto alcance",
                    items: { type: "string" },
                  },
                  niche: {
                    type: "array",
                    description: "10 hashtags de nicho específico",
                    items: { type: "string" },
                  },
                  trending: {
                    type: "array",
                    description: "10 hashtags em tendência",
                    items: { type: "string" },
                  },
                },
                required: ["reach", "niche", "trending"],
                additionalProperties: false,
              },
            },
          },
        });
        
        const content = response.choices[0].message.content;
        const result = JSON.parse(typeof content === 'string' ? content : "{}");
        
        // Salvar no histórico
        const { getDb } = await import("./db");
        const db = await getDb();
        if (db) {
          const { hashtagSuggestions } = await import("../drizzle/schema");
          
          await db.insert(hashtagSuggestions).values({
            userId: Number(ctx.user.id),
            creationId: input.creationId,
            text: input.text,
            hashtags: JSON.stringify(result),
          });
        }
        
        return result;
      }),

    getHistory: protectedProcedure
      .input(z.object({ limit: z.number().default(10) }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return [];
        
        const { hashtagSuggestions } = await import("../drizzle/schema");
        const { eq, desc } = await import("drizzle-orm");
        
        const history = await db.select()
          .from(hashtagSuggestions)
          .where(eq(hashtagSuggestions.userId, Number(ctx.user.id)))
          .orderBy(desc(hashtagSuggestions.createdAt))
          .limit(input.limit);
        
        return history.map(h => ({
          id: h.id,
          text: h.text,
          hashtags: JSON.parse(h.hashtags || "{}"),
          createdAt: h.createdAt,
        }));
      }),
  }),

  // Inteligência Artificial Avançada
  aiAdvanced: router({
    // 1. Análise de Tendências
    analyzeTrends: protectedProcedure
      .query(async () => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um especialista em tendências do Instagram para clínicas de estética." },
            { role: "user", content: "Liste as 10 principais tendências de posts virais no Instagram para clínicas de estética em 2025. Para cada tendência, inclua: título, descrição, cores dominantes, estilo de fonte, tipo de layout." }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "trends",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  trends: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        colors: { type: "array", items: { type: "string" } },
                        fontStyle: { type: "string" },
                        layoutType: { type: "string" },
                      },
                      required: ["title", "description", "colors", "fontStyle", "layoutType"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["trends"],
                additionalProperties: false,
              },
            },
          },
        });
        
        const data = JSON.parse(response.choices[0].message.content as string);
        return data.trends;
      }),

    // 2. Otimização de Texto
    optimizeText: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um especialista em copywriting para Instagram de clínicas de estética." },
            { role: "user", content: `Otimize esta legenda para aumentar engajamento: "${input.text}". Adicione hashtags relevantes, CTAs estratégicos e emojis contextuais. Mantenha o tom original.` }
          ],
        });
        
        return { optimized: response.choices[0].message.content };
      }),

    // 3. Previsão de Engajamento
    predictEngagement: protectedProcedure
      .input(z.object({ text: z.string(), hasImage: z.boolean() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um analista de engajamento do Instagram." },
            { role: "user", content: `Analise esta legenda e preveja o engajamento: "${input.text}". Tem imagem: ${input.hasImage}. Retorne score 0-100 e breakdown por fatores (texto, visual, hashtags, CTA, timing).` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "engagement",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  score: { type: "number" },
                  breakdown: {
                    type: "object",
                    properties: {
                      text: { type: "number" },
                      visual: { type: "number" },
                      hashtags: { type: "number" },
                      cta: { type: "number" },
                      timing: { type: "number" },
                    },
                    required: ["text", "visual", "hashtags", "cta", "timing"],
                    additionalProperties: false,
                  },
                  suggestions: { type: "array", items: { type: "string" } },
                },
                required: ["score", "breakdown", "suggestions"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 4. Reconhecimento de Conteúdo
    recognizeContent: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você classifica tipos de posts do Instagram." },
            { role: "user", content: `Classifique este post: "${input.text}". Tipos: produto, antes_depois, depoimento, educativo, promocional. Sugira template ideal.` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  confidence: { type: "number" },
                  suggestedTemplate: { type: "string" },
                  reason: { type: "string" },
                },
                required: ["type", "confidence", "suggestedTemplate", "reason"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 5. Geração de Legendas
    generateCaption: protectedProcedure
      .input(z.object({ imageDescription: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você cria legendas profissionais para Instagram de clínicas de estética." },
            { role: "user", content: `Crie 3 legendas (curta, média, longa) para esta imagem: "${input.imageDescription}". Inclua hashtags e emojis.` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "captions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  short: { type: "string" },
                  medium: { type: "string" },
                  long: { type: "string" },
                },
                required: ["short", "medium", "long"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 6. Sugestões em Tempo Real
    realtimeSuggestions: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você dá sugestões de melhoria em tempo real." },
            { role: "user", content: `Analise este texto em progressão: "${input.text}". Dê 3 sugestões rápidas de melhoria.` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "suggestions",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  suggestions: { type: "array", items: { type: "string" } },
                },
                required: ["suggestions"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 7. Corretor Ortográfico
    spellCheck: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um corretor ortográfico de português BR." },
            { role: "user", content: `Corrija erros ortográficos neste texto: "${input.text}". Retorne texto corrigido e lista de erros encontrados.` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "spellcheck",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  corrected: { type: "string" },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        word: { type: "string" },
                        suggestion: { type: "string" },
                        position: { type: "number" },
                      },
                      required: ["word", "suggestion", "position"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["corrected", "errors"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 8. Análise de Tom
    analyzeTone: protectedProcedure
      .input(z.object({ text: z.string(), previousPosts: z.array(z.string()) }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você analisa consistência de tom de voz." },
            { role: "user", content: `Analise o tom deste post: "${input.text}". Compare com posts anteriores: ${JSON.stringify(input.previousPosts)}. Detecte desvios e sugira ajustes.` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "tone",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  currentTone: { type: "string" },
                  averageTone: { type: "string" },
                  consistency: { type: "number" },
                  deviations: { type: "array", items: { type: "string" } },
                  adjustments: { type: "array", items: { type: "string" } },
                },
                required: ["currentTone", "averageTone", "consistency", "deviations", "adjustments"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 9. Sugestões de Emojis
    suggestEmojis: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você sugere emojis relevantes para textos." },
            { role: "user", content: `Sugira 10 emojis relevantes para este texto: "${input.text}". Categorize por tipo (emoção, objeto, ação).` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "emojis",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  emojis: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        emoji: { type: "string" },
                        category: { type: "string" },
                        reason: { type: "string" },
                      },
                      required: ["emoji", "category", "reason"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["emojis"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),

    // 10. Variações de Legenda
    generateVariations: protectedProcedure
      .input(z.object({ text: z.string() }))
      .mutation(async ({ input }) => {
        const { invokeLLM } = await import("./_core/llm");
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você cria variações de legendas mantendo a mensagem principal." },
            { role: "user", content: `Crie 5 variações desta legenda: "${input.text}". Tons: profissional, casual, motivacional, urgente, educativo.` }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "variations",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  variations: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        tone: { type: "string" },
                        text: { type: "string" },
                      },
                      required: ["tone", "text"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["variations"],
                additionalProperties: false,
              },
            },
          },
        });
        
        return JSON.parse(response.choices[0].message.content as string);
      }),
  }),

  // Integração com Canva
  canva: router({
    getConnection: protectedProcedure
      .query(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) return null;
        
        const { canvaConnections } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [connection] = await db.select().from(canvaConnections).where(eq(canvaConnections.userId, ctx.user.id)).limit(1);
        
        if (!connection) return null;
        
        return {
          id: connection.id,
          connected: true,
          expiresAt: connection.expiresAt,
        };
      }),

    getAuthUrl: protectedProcedure
      .query(async () => {
        const clientId = process.env.CANVA_CLIENT_ID;
        if (!clientId) throw new Error("CANVA_CLIENT_ID not configured");
        
        const redirectUri = `${process.env.VITE_APP_URL || "http://localhost:3000"}/api/canva/callback`;
        const scope = "design:read design:content:read";
        
        return {
          url: `https://www.canva.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_type=code`
        };
      }),

    listDesigns: protectedProcedure
      .query(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaConnections } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [connection] = await db.select().from(canvaConnections).where(eq(canvaConnections.userId, ctx.user.id)).limit(1);
        
        if (!connection) throw new Error("Canva not connected");
        
        // Chamar API do Canva
        const response = await fetch("https://api.canva.com/rest/v1/designs", {
          headers: {
            "Authorization": `Bearer ${connection.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          throw new Error(`Canva API error: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.items || [];
      }),

    importDesign: protectedProcedure
      .input(z.object({
        designId: z.string(),
        title: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaConnections, creations } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [connection] = await db.select().from(canvaConnections).where(eq(canvaConnections.userId, ctx.user.id)).limit(1);
        
        if (!connection) throw new Error("Canva not connected");
        
        // Buscar URL de export do design
        const exportResponse = await fetch(`https://api.canva.com/rest/v1/designs/${input.designId}/export`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${connection.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            format: "png",
          }),
        });
        
        if (!exportResponse.ok) {
          throw new Error(`Canva export error: ${exportResponse.statusText}`);
        }
        
        const exportData = await exportResponse.json();
        const imageUrl = exportData.url;
        
        // Download da imagem
        const imageResponse = await fetch(imageUrl);
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        
        // Upload para S3
        const { storagePut } = await import("./storage");
        const fileKey = `${ctx.user.id}-canva/${input.designId}-${Date.now()}.png`;
        const { url: s3Url } = await storagePut(fileKey, imageBuffer, "image/png");
        
        // Criar criação no banco
        await db.insert(creations).values({
          userId: ctx.user.id,
          text: input.title,
          format: "portrait",
          model: "classic",
          backgroundImageUrl: s3Url,
          backgroundImageKey: fileKey,
          fontSize: 100,
          font: "Inter",
          textColor: "white",
          textOutline: 0,
          alignHorizontal: "center",
          alignVertical: "middle",
          fadeOverlay: 50,
          blur: 0,
          brightness: 100,
          contrast: 100,
        });
        
        return { success: true, url: s3Url };
      }),

    disconnect: protectedProcedure
      .mutation(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaConnections } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.delete(canvaConnections).where(eq(canvaConnections.userId, ctx.user.id));
        
        return { success: true };
      }),
  }),

  // Gerador de Materiais (Apresentações e eBooks)
  materials: router({
    generatePresentation: protectedProcedure
      .input(z.object({
        theme: z.string().min(5, "Tema deve ter pelo menos 5 caracteres"),
        tone: z.enum(["profissional", "casual", "motivacional", "educativo"]),
        slideCount: z.number().min(5).max(30),
        audience: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { generatedMaterials } = await import("../drizzle/schema");
        
        // Gerar conteúdo dos slides com LucresIA
        const prompt = `Você é a LucresIA, especialista em criar apresentações para clínicas de estética.

Crie uma apresentação profissional sobre: "${input.theme}"

Requis itos:
- Tom: ${input.tone}
- Número de slides: ${input.slideCount}
${input.audience ? `- Público-alvo: ${input.audience}` : ""}

Estrutura:
1. Slide de título
2. Introdução/Contexto
3. ${input.slideCount - 4} slides de conteúdo (problemas, soluções, benefícios, dados)
4. Conclusão
5. Call-to-action

Formato de saída (Markdown):
# [Título do Slide]

- Ponto 1
- Ponto 2
- Ponto 3

---

Regras:
- Cada slide deve ter 1 título (H1) e 3-5 pontos
- Use dados e estatísticas quando relevante
- Seja objetivo e visual
- Use linguagem adequada ao tom escolhido
- Separe slides com ---`;
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é a LucresIA, especialista em criar conteúdo para clínicas de estética. Gere apresentações profissionais em markdown." },
            { role: "user", content: prompt },
          ],
        });
        
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0].message.content);
        
        // Salvar no banco
        const [material] = await db.insert(generatedMaterials).values({
          userId: ctx.user.id,
          type: "presentation",
          title: input.theme,
          theme: input.theme,
          tone: input.tone,
          audience: input.audience || null,
          slideCount: input.slideCount,
          chapterCount: null,
          content,
          slidesVersionId: null,
          pdfUrl: null,
        }).$returningId();
        
        return {
          id: material.id,
          content,
          slideCount: input.slideCount,
        };
      }),

    generateEbook: protectedProcedure
      .input(z.object({
        theme: z.string().min(5, "Tema deve ter pelo menos 5 caracteres"),
        tone: z.enum(["profissional", "casual", "motivacional", "educativo"]),
        chapterCount: z.number().min(3).max(10),
        audience: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { invokeLLM } = await import("./_core/llm");
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { generatedMaterials } = await import("../drizzle/schema");
        
        // Gerar conteúdo do eBook com LucresIA
        const prompt = `Você é a LucresIA, especialista em criar conteúdo para clínicas de estética.

Crie um eBook profissional sobre: "${input.theme}"

Requisitos:
- Tom: ${input.tone}
- Número de capítulos: ${input.chapterCount}
${input.audience ? `- Público-alvo: ${input.audience}` : ""}

Estrutura:
1. Introdução (contextualização e importância do tema)
2. ${input.chapterCount} capítulos com conteúdo denso
3. Conclusão (resumo e próximos passos)

Formato de saída (Markdown):
# Título do eBook

## Introdução

[Texto da introdução com 2-3 parágrafos]

## Capítulo 1: [Título]

[Conteúdo do capítulo com 3-5 parágrafos]

### Seção 1.1: [Subtítulo]

[Conteúdo]

Regras:
- Cada capítulo deve ter 500-800 palavras
- Use subtítulos (H3) para organizar o conteúdo
- Inclua dados, exemplos práticos e dicas acionáveis
- Seja informativo e educativo
- Use linguagem adequada ao tom escolhido`;
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é a LucresIA, especialista em criar conteúdo para clínicas de estética. Gere eBooks profissionais em markdown." },
            { role: "user", content: prompt },
          ],
        });
        
        const content = typeof response.choices[0].message.content === 'string' 
          ? response.choices[0].message.content 
          : JSON.stringify(response.choices[0].message.content);
        
        // Salvar no banco
        const [material] = await db.insert(generatedMaterials).values({
          userId: ctx.user.id,
          type: "ebook",
          title: input.theme,
          theme: input.theme,
          tone: input.tone,
          audience: input.audience || null,
          slideCount: null,
          chapterCount: input.chapterCount,
          content,
          slidesVersionId: null,
          pdfUrl: null,
        }).$returningId();
        
        return {
          id: material.id,
          content,
          chapterCount: input.chapterCount,
        };
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { generatedMaterials } = await import("../drizzle/schema");
        const { eq, desc } = await import("drizzle-orm");
        
        const materials = await db.select().from(generatedMaterials)
          .where(eq(generatedMaterials.userId, ctx.user.id))
          .orderBy(desc(generatedMaterials.createdAt));
        
        return materials;
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { generatedMaterials } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        const [material] = await db.select().from(generatedMaterials)
          .where(and(
            eq(generatedMaterials.id, input.id),
            eq(generatedMaterials.userId, ctx.user.id)
          ))
          .limit(1);
        
        if (!material) throw new Error("Material not found");
        
        return material;
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { generatedMaterials } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(generatedMaterials)
          .where(and(
            eq(generatedMaterials.id, input.id),
            eq(generatedMaterials.userId, ctx.user.id)
          ));
        
        return { success: true };
      }),

    exportToPdf: protectedProcedure
      .input(z.object({ 
        id: z.number(),
        format: z.enum(["pdf", "ppt"]).default("pdf"),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const { exec } = await import("child_process");
        const { promisify } = await import("util");
        const execAsync = promisify(exec);
        const fs = await import("fs/promises");
        const path = await import("path");
        
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { generatedMaterials } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Buscar material
        const [material] = await db.select().from(generatedMaterials)
          .where(and(
            eq(generatedMaterials.id, input.id),
            eq(generatedMaterials.userId, ctx.user.id)
          ))
          .limit(1);
        
        if (!material) throw new Error("Material not found");
        
        // Criar arquivo markdown temporário
        const tempDir = "/tmp";
        const mdPath = path.join(tempDir, `material-${material.id}.md`);
        await fs.writeFile(mdPath, material.content, "utf-8");
        
        // Exportar usando manus-md-to-pdf
        const outputPath = path.join(tempDir, `material-${material.id}.${input.format}`);
        
        try {
          if (input.format === "pdf") {
            await execAsync(`manus-md-to-pdf "${mdPath}" "${outputPath}"`);
          } else {
            // Para PPT, primeiro gerar PDF e depois converter (ou usar outra ferramenta)
            await execAsync(`manus-md-to-pdf "${mdPath}" "${outputPath.replace('.ppt', '.pdf')}"`);
          }
          
          // Ler arquivo gerado
          const fileBuffer = await fs.readFile(input.format === "pdf" ? outputPath : outputPath.replace('.ppt', '.pdf'));
          
          // Upload para S3
          const { storagePut } = await import("./storage");
          const fileKey = `${ctx.user.id}-materials/${material.id}-${Date.now()}.${input.format}`;
          const { url: pdfUrl } = await storagePut(fileKey, fileBuffer, input.format === "pdf" ? "application/pdf" : "application/vnd.ms-powerpoint");
          
          // Atualizar material com URL do PDF
          await db.update(generatedMaterials)
            .set({ pdfUrl })
            .where(eq(generatedMaterials.id, material.id));
          
          // Limpar arquivos temporários
          await fs.unlink(mdPath).catch(() => {});
          await fs.unlink(outputPath).catch(() => {});
          
          return { success: true, url: pdfUrl };
        } catch (error) {
          // Limpar arquivos em caso de erro
          await fs.unlink(mdPath).catch(() => {});
          await fs.unlink(outputPath).catch(() => {});
          throw new Error(`Erro ao exportar: ${error}`);
        }
      }),
  }),

  // Integração com Canva API
  canvaIntegration: router({
    // Verifica status da conexão
    getStatus: protectedProcedure
      .query(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaTokens } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [token] = await db.select().from(canvaTokens)
          .where(eq(canvaTokens.userId, ctx.user.id))
          .limit(1);
        
        if (!token) {
          return { connected: false };
        }
        
        // Verificar se token expirou
        const now = new Date();
        if (token.expiresAt && token.expiresAt < now) {
          return { connected: false, expired: true };
        }
        
        return { connected: true, expiresAt: token.expiresAt };
      }),

    // Inicia OAuth flow
    connect: protectedProcedure
      .mutation(async ({ ctx }) => {
        const { getCanvaAuthUrl } = await import("./_core/canvaApi");
        const authUrl = getCanvaAuthUrl(ctx.user.id);
        return { authUrl };
      }),

    // Desconecta (revoga token)
    disconnect: protectedProcedure
      .mutation(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaTokens } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const [token] = await db.select().from(canvaTokens)
          .where(eq(canvaTokens.userId, ctx.user.id))
          .limit(1);
        
        if (token) {
          // Revogar token no Canva
          const { revokeToken } = await import("./_core/canvaApi");
          try {
            await revokeToken(token.accessToken);
          } catch (error) {
            console.error("Failed to revoke token:", error);
          }
          
          // Deletar do banco
          await db.delete(canvaTokens)
            .where(eq(canvaTokens.userId, ctx.user.id));
        }
        
        return { success: true };
      }),

    // Gera post carrossel (10 slides)
    generateCarousel: protectedProcedure
      .input(z.object({
        theme: z.string(),
        tone: z.enum(["profissional", "casual", "motivacional", "educativo"]),
        slideCount: z.number().min(5).max(15).default(10),
        audience: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaTokens, canvaDesigns } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar token
        const [token] = await db.select().from(canvaTokens)
          .where(eq(canvaTokens.userId, ctx.user.id))
          .limit(1);
        
        if (!token) {
          throw new Error("Canva not connected. Please connect first.");
        }
        
        // Verificar se token expirou e renovar se necessário
        let accessToken = token.accessToken;
        const now = new Date();
        if (token.expiresAt && token.expiresAt < now && token.refreshToken) {
          const { refreshAccessToken } = await import("./_core/canvaApi");
          const newTokens = await refreshAccessToken(token.refreshToken);
          accessToken = newTokens.access_token;
          
          // Atualizar no banco
          await db.update(canvaTokens)
            .set({
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token || token.refreshToken,
              expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
            })
            .where(eq(canvaTokens.userId, ctx.user.id));
        }
        
        // Criar design no Canva
        const { createDesign } = await import("./_core/canvaApi");
        const design = await createDesign(accessToken, {
          title: `Carrossel: ${input.theme}`,
          designType: "Carousel",
          width: 1080,
          height: 1080,
        });
        
        // Salvar no banco
        const result = await db.insert(canvaDesigns).values({
          userId: ctx.user.id,
          canvaDesignId: design.id,
          type: "carousel",
          title: `Carrossel: ${input.theme}`,
          theme: input.theme,
          tone: input.tone,
          slideCount: input.slideCount,
          thumbnailUrl: design.thumbnail.url,
          editUrl: design.urls.edit_url,
        });
        
        const savedDesignId = Number((result as any).insertId);
        
        return {
          id: savedDesignId,
          canvaDesignId: design.id,
          editUrl: design.urls.edit_url,
          thumbnailUrl: design.thumbnail.url,
        };
      }),

    // Gera vídeo curto (15-30s)
    generateVideo: protectedProcedure
      .input(z.object({
        theme: z.string(),
        tone: z.enum(["profissional", "casual", "motivacional", "educativo"]),
        duration: z.number().min(15).max(60).default(30),
        audience: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaTokens, canvaDesigns } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // Buscar token
        const [token] = await db.select().from(canvaTokens)
          .where(eq(canvaTokens.userId, ctx.user.id))
          .limit(1);
        
        if (!token) {
          throw new Error("Canva not connected. Please connect first.");
        }
        
        // Verificar se token expirou e renovar se necessário
        let accessToken = token.accessToken;
        const now = new Date();
        if (token.expiresAt && token.expiresAt < now && token.refreshToken) {
          const { refreshAccessToken } = await import("./_core/canvaApi");
          const newTokens = await refreshAccessToken(token.refreshToken);
          accessToken = newTokens.access_token;
          
          // Atualizar no banco
          await db.update(canvaTokens)
            .set({
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token || token.refreshToken,
              expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
            })
            .where(eq(canvaTokens.userId, ctx.user.id));
        }
        
        // Criar design no Canva
        const { createDesign } = await import("./_core/canvaApi");
        const design = await createDesign(accessToken, {
          title: `Vídeo: ${input.theme}`,
          designType: "Video",
          width: 1080,
          height: 1920, // Formato vertical (Stories/Reels)
        });
        
        // Salvar no banco
        const result = await db.insert(canvaDesigns).values({
          userId: ctx.user.id,
          canvaDesignId: design.id,
          type: "video",
          title: `Vídeo: ${input.theme}`,
          theme: input.theme,
          tone: input.tone,
          duration: input.duration,
          thumbnailUrl: design.thumbnail.url,
          editUrl: design.urls.edit_url,
        });
        
        const savedDesignId = Number((result as any).insertId);
        
        return {
          id: savedDesignId,
          canvaDesignId: design.id,
          editUrl: design.urls.edit_url,
          thumbnailUrl: design.thumbnail.url,
        };
      }),

    // Lista designs criados
    listDesigns: protectedProcedure
      .query(async ({ ctx }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaDesigns } = await import("../drizzle/schema");
        const { eq, desc } = await import("drizzle-orm");
        
        const designs = await db.select().from(canvaDesigns)
          .where(eq(canvaDesigns.userId, ctx.user.id))
          .orderBy(desc(canvaDesigns.createdAt));
        
        return designs;
      }),

    // Exporta design
    exportDesign: protectedProcedure
      .input(z.object({
        id: z.number(),
        format: z.enum(["png", "mp4"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaTokens, canvaDesigns } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Buscar design
        const [design] = await db.select().from(canvaDesigns)
          .where(and(
            eq(canvaDesigns.id, input.id),
            eq(canvaDesigns.userId, ctx.user.id)
          ))
          .limit(1);
        
        if (!design) {
          throw new Error("Design not found");
        }
        
        // Buscar token
        const [token] = await db.select().from(canvaTokens)
          .where(eq(canvaTokens.userId, ctx.user.id))
          .limit(1);
        
        if (!token) {
          throw new Error("Canva not connected");
        }
        
        // Exportar design
        const { exportDesign } = await import("./_core/canvaApi");
        const exportUrl = await exportDesign(token.accessToken, design.canvaDesignId, input.format);
        
        // Atualizar no banco
        await db.update(canvaDesigns)
          .set({ exportUrl })
          .where(eq(canvaDesigns.id, design.id));
        
        return { success: true, url: exportUrl };
      }),

    // Deleta design
    deleteDesign: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { getDb } = await import("./db");
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        
        const { canvaDesigns } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(canvaDesigns)
          .where(and(
            eq(canvaDesigns.id, input.id),
            eq(canvaDesigns.userId, ctx.user.id)
          ));
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
