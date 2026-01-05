import { int, mysqlEnum, mysqlTable, real, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Criações do TextPop - composições visuais para Instagram
 */
export const creations = mysqlTable("creations", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Conteúdo
  text: text("text").notNull(),
  
  // Formato: square (1:1), portrait (4:5), story (9:16)
  format: mysqlEnum("format", ["square", "portrait", "story"]).notNull().default("portrait"),
  
  // Modelo: classic, bold, fade, highlight
  model: mysqlEnum("model", ["classic", "bold", "fade", "highlight"]).notNull().default("classic"),
  
  // Imagem de fundo (opcional)
  backgroundImageUrl: text("backgroundImageUrl"),
  backgroundImageKey: text("backgroundImageKey"),
  
  // Formatação de texto
  fontSize: int("fontSize").notNull().default(100), // Percentual
  font: varchar("font", { length: 32 }).notNull().default("Inter"), // Oswald, Serif, Mono, Inter
  textColor: mysqlEnum("textColor", ["white", "black"]).notNull().default("white"),
  textOutline: int("textOutline").notNull().default(0), // 0 = desligado, 1 = ligado
  
  // Alinhamento
  alignHorizontal: mysqlEnum("alignHorizontal", ["left", "center", "right"]).notNull().default("center"),
  alignVertical: mysqlEnum("alignVertical", ["top", "middle", "bottom"]).notNull().default("middle"),
  
  // Efeitos de imagem
  fadeOverlay: int("fadeOverlay").notNull().default(50), // Percentual 0-100
  blur: int("blur").notNull().default(0), // Pixels
  brightness: int("brightness").notNull().default(100), // Percentual
  contrast: int("contrast").notNull().default(100), // Percentual
  
  // Elementos gráficos adicionados
  graphicElements: text("graphicElements"), // JSON array de elementos {id, x, y, width, height, rotation}
  
  // Tags para busca e organização
  tags: text("tags"), // JSON array de strings ["promoção", "antes-depois"]
  
  // URL da imagem exportada
   exportedImageUrl: text("exportedImageUrl"),
  exportedImageKey: text("exportedImageKey"),
  templateId: varchar("templateId", { length: 64 }),
  version: int("version").default(1).notNull(),
  parentVersionId: int("parentVersionId"), // ID da versão anterior (para histórico)
  versionNumber: int("versionNumber").default(1).notNull(), // Número da versão
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Creation = typeof creations.$inferSelect;
export type InsertCreation = typeof creations.$inferInsert;

/**
 * Tabela para agendamento de posts
 */
export const scheduledPosts = mysqlTable("scheduled_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  creationId: int("creationId").notNull(),
  
  // Data e hora agendadas
  scheduledFor: timestamp("scheduledFor").notNull(),
  
  // Status do agendamento
  status: mysqlEnum("status", ["pending", "published", "failed", "cancelled"]).default("pending").notNull(),
  
  // Metadados do post
  caption: text("caption"),
  hashtags: text("hashtags"),
  
  // Informações de publicação
  publishedAt: timestamp("publishedAt"),
  errorMessage: text("errorMessage"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScheduledPost = typeof scheduledPosts.$inferSelect;
export type InsertScheduledPost = typeof scheduledPosts.$inferInsert;

/**
 * Templates personalizados salvos pelo usuário
 */
export const userTemplates = mysqlTable("user_templates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Configurações do template
  format: mysqlEnum("format", ["square", "portrait", "story"]).notNull(),
  model: mysqlEnum("model", ["classic", "bold", "fade", "highlight"]).notNull(),
  font: varchar("font", { length: 50 }).notNull(),
  fontSize: int("fontSize").notNull(),
  textColor: varchar("textColor", { length: 50 }).notNull(),
  horizontalAlign: varchar("horizontalAlign", { length: 20 }).notNull(),
  verticalAlign: varchar("verticalAlign", { length: 20 }).notNull(),
  textOutline: int("textOutline").notNull().default(0),
  
  // Efeitos de imagem
  fadeOverlay: int("fadeOverlay").notNull().default(50),
  blur: int("blur").notNull().default(0),
  brightness: int("brightness").notNull().default(100),
  contrast: int("contrast").notNull().default(100),
  
  // Imagem de preview (thumbnail)
  previewUrl: text("previewUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserTemplate = typeof userTemplates.$inferSelect;
export type InsertUserTemplate = typeof userTemplates.$inferInsert;

// Tabela de conexões do Instagram
export const instagramConnections = mysqlTable("instagram_connections", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  instagramUserId: varchar("instagramUserId", { length: 128 }).notNull(),
  instagramUsername: varchar("instagramUsername", { length: 128 }),
  accessToken: text("accessToken").notNull(), // Token de acesso de longa duração
  tokenExpiresAt: timestamp("tokenExpiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InstagramConnection = typeof instagramConnections.$inferSelect;
export type InsertInstagramConnection = typeof instagramConnections.$inferInsert;

// Tabela de publicações no Instagram
export const instagramPublications = mysqlTable("instagram_publications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  creationId: int("creationId").notNull(),
  instagramPostId: varchar("instagramPostId", { length: 128 }),
  status: mysqlEnum("status", ["pending", "published", "failed"]).notNull().default("pending"),
  scheduledFor: timestamp("scheduledFor"),
  publishedAt: timestamp("publishedAt"),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type InstagramPublication = typeof instagramPublications.$inferSelect;
export type InsertInstagramPublication = typeof instagramPublications.$inferInsert;

/**
 * Tabela para analytics de engajamento
 */
export const postAnalytics = mysqlTable("post_analytics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  creationId: int("creationId").notNull(),
  
  // Métricas de engajamento
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  shares: int("shares").default(0),
  saves: int("saves").default(0),
  reach: int("reach").default(0),
  impressions: int("impressions").default(0),
  
  // Metadados
  publishedAt: timestamp("publishedAt").notNull(),
  dayOfWeek: int("dayOfWeek").notNull(), // 0-6 (domingo-sábado)
  hourOfDay: int("hourOfDay").notNull(), // 0-23
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PostAnalytics = typeof postAnalytics.$inferSelect;
export type InsertPostAnalytics = typeof postAnalytics.$inferInsert;

/**
 * Tabela de créditos dos usuários para serviços premium (remove.bg, etc)
 */
export const userCredits = mysqlTable("user_credits", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  balance: int("balance").notNull().default(0), // Saldo atual de créditos
  totalPurchased: int("totalPurchased").notNull().default(0), // Total de créditos comprados
  totalUsed: int("totalUsed").notNull().default(0), // Total de créditos usados
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserCredits = typeof userCredits.$inferSelect;
export type InsertUserCredits = typeof userCredits.$inferInsert;

/**
 * Tabela de histórico de transações de créditos
 */
export const creditTransactions = mysqlTable("credit_transactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["purchase", "usage", "refund", "bonus"]).notNull(),
  amount: int("amount").notNull(), // Positivo para compra/bonus, negativo para uso
  description: text("description").notNull(),
  relatedService: varchar("relatedService", { length: 64 }), // "remove_bg", "ai_generation", etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CreditTransaction = typeof creditTransactions.$inferSelect;
export type InsertCreditTransaction = typeof creditTransactions.$inferInsert;

/**
 * Tabela de favoritos de elementos gráficos dos usuários
 */
export const userFavorites = mysqlTable("user_favorites", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  elementId: varchar("elementId", { length: 64 }).notNull(), // ID do elemento gráfico
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = typeof userFavorites.$inferInsert;

/**
 * Tabela para elementos gráficos
 */
export const graphicElements = mysqlTable("graphic_elements", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informações do elemento
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["sticker", "icon", "frame", "product", "seal", "decorative"]).notNull(),
  subcategory: varchar("subcategory", { length: 100 }),
  
  // URL da imagem
  imageUrl: text("imageUrl").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  
  // Metadados
  tags: text("tags"), // JSON array de tags
  isPremium: int("isPremium").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type GraphicElement = typeof graphicElements.$inferSelect;
export type InsertGraphicElement = typeof graphicElements.$inferInsert;

/**
 * Tabela de paletas de cores favoritas dos usuários
 */
export const userFavoritePalettes = mysqlTable("user_favorite_palettes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Identificador único da paleta (ex: "rose-gold", "spa-green")
  paletteId: varchar("paletteId", { length: 100 }).notNull(),
  
  // Nome da paleta para exibição
  paletteName: varchar("paletteName", { length: 255 }).notNull(),
  
  // Cores da paleta (JSON array)
  colors: text("colors").notNull(), // ["#hex1", "#hex2", ...]
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UserFavoritePalette = typeof userFavoritePalettes.$inferSelect;
export type InsertUserFavoritePalette = typeof userFavoritePalettes.$inferInsert;


/**
 * Tabela de publicações recorrentes (posts que se repetem automaticamente)
 */
export const recurringPosts = mysqlTable("recurring_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  creationId: int("creationId").notNull(), // Criação que será publicada
  
  // Configuração de recorrência
  frequency: mysqlEnum("frequency", ["daily", "weekly", "monthly"]).notNull(),
  dayOfWeek: int("dayOfWeek"), // 0-6 (Domingo-Sábado) para weekly
  dayOfMonth: int("dayOfMonth"), // 1-31 para monthly
  time: varchar("time", { length: 5 }).notNull(), // HH:MM formato 24h
  
  // Status
  isActive: int("isActive").default(1).notNull(), // 1 = ativo, 0 = pausado
  
  // Metadados
  title: varchar("title", { length: 255 }).notNull(), // Ex: "Dica de Segunda"
  lastExecutedAt: timestamp("lastExecutedAt"),
  nextExecutionAt: timestamp("nextExecutionAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type RecurringPost = typeof recurringPosts.$inferSelect;
export type InsertRecurringPost = typeof recurringPosts.$inferInsert;


/**
 * Tabela de campanhas de posts (séries conectadas)
 */
export const postCampaigns = mysqlTable("post_campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Informações da campanha
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  duration: int("duration").notNull(), // Duração em dias
  startDate: timestamp("startDate").notNull(),
  
  // Status
  isActive: int("isActive").default(1).notNull(), // 1 = ativo, 0 = pausado
  
  // IDs das criações que fazem parte da campanha (JSON array)
  creationIds: text("creationIds").notNull(), // ["1", "2", "3"]
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PostCampaign = typeof postCampaigns.$inferSelect;
export type InsertPostCampaign = typeof postCampaigns.$inferInsert;

/**
 * Tabela de regras de auto-repost
 */
export const autoRepostRules = mysqlTable("auto_repost_rules", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Configuração da regra
  title: varchar("title", { length: 255 }).notNull(),
  minEngagement: int("minEngagement").notNull(), // Engajamento mínimo (curtidas + comentários + compartilhamentos)
  intervalDays: int("intervalDays").notNull(), // Intervalo em dias entre reposts
  
  // Status
  isActive: int("isActive").default(1).notNull(),
  
  // Última execução
  lastExecutedAt: timestamp("lastExecutedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AutoRepostRule = typeof autoRepostRules.$inferSelect;
export type InsertAutoRepostRule = typeof autoRepostRules.$inferInsert;

// Tabela de concorrentes para análise comparativa
export const competitors = mysqlTable("competitors", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  followers: int("followers"),
  avgEngagement: real("avg_engagement"), // Taxa de engajamento média
  postsPerWeek: real("posts_per_week"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * Tabela para histórico de hashtags sugeridas
 */
export const hashtagSuggestions = mysqlTable("hashtag_suggestions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  creationId: int("creation_id"),
  text: text("text").notNull(), // Texto analisado
  hashtags: text("hashtags").notNull(), // JSON array de hashtags
  category: mysqlEnum("category", ["reach", "niche", "trending"]),
  createdAt: timestamp("created_at").defaultNow(),
});

// Biblioteca de CTAs
export const ctaLibrary = mysqlTable("cta_library", {
  id: int("id").primaryKey().autoincrement(),
  text: text("text").notNull(),
  category: varchar("category", { length: 50 }).notNull(), // vendas, engajamento, educacao
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Integração com Canva
export const canvaConnections = mysqlTable("canva_connections", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// Materiais gerados (apresentações, eBooks, etc)
export const generatedMaterials = mysqlTable("generated_materials", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  type: mysqlEnum("type", ["presentation", "ebook"]).notNull(),
  title: text("title").notNull(),
  theme: text("theme").notNull(), // Tema fornecido pelo usuário
  tone: varchar("tone", { length: 50 }).notNull(), // profissional, casual, motivacional
  audience: text("audience"), // Público-alvo
  slideCount: int("slide_count"), // Para apresentações
  chapterCount: int("chapter_count"), // Para eBooks
  content: text("content").notNull(), // Conteúdo em markdown
  slidesVersionId: text("slides_version_id"), // ID da versão do Manus Slides
  pdfUrl: text("pdf_url"), // URL do PDF exportado
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type GeneratedMaterial = typeof generatedMaterials.$inferSelect;
export type InsertGeneratedMaterial = typeof generatedMaterials.$inferInsert;

// Tokens OAuth do Canva
export const canvaTokens = mysqlTable("canva_tokens", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().unique(),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at").notNull(),
  scope: text("scope"), // Escopos concedidos
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type CanvaToken = typeof canvaTokens.$inferSelect;
export type InsertCanvaToken = typeof canvaTokens.$inferInsert;

// Designs criados no Canva
export const canvaDesigns = mysqlTable("canva_designs", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  canvaDesignId: text("canva_design_id").notNull(), // ID do design no Canva
  type: mysqlEnum("type", ["carousel", "video"]).notNull(),
  title: text("title").notNull(),
  theme: text("theme").notNull(),
  tone: varchar("tone", { length: 50 }).notNull(),
  slideCount: int("slide_count"), // Para carrosséis
  duration: int("duration"), // Para vídeos (em segundos)
  thumbnailUrl: text("thumbnail_url"), // URL da thumbnail
  editUrl: text("edit_url"), // URL para editar no Canva
  exportUrl: text("export_url"), // URL do arquivo exportado (PNG/MP4)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export type CanvaDesign = typeof canvaDesigns.$inferSelect;
export type InsertCanvaDesign = typeof canvaDesigns.$inferInsert;

/**
 * QuickCreate Posts - Posts created through the guided QuickCreate flow
 */
export const quickCreatePosts = mysqlTable("quick_create_posts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // NeuroPreset relationship
  presetId: varchar("presetId", { length: 64 }).notNull(),
  
  // Content
  caption: text("caption").notNull(),
  hashtags: text("hashtags"),
  
  // Images (Before/After support) - stored as JSON arrays
  imageUrls: text("imageUrls").notNull(), // JSON array of URLs
  imageKeys: text("imageKeys").notNull(), // JSON array of S3 keys
  
  // Engagement scoring
  engagementScore: int("engagementScore"),
  scoreBreakdown: text("scoreBreakdown"), // JSON with text/visual/cta/hashtags/timing breakdown
  
  // Status and publishing
  status: mysqlEnum("status", ["draft", "scheduled", "published", "failed"]).default("draft").notNull(),
  scheduledFor: timestamp("scheduledFor"),
  publishedAt: timestamp("publishedAt"),
  instagramPostId: varchar("instagramPostId", { length: 128 }),
  
  // Session tracking for analytics
  sessionId: varchar("sessionId", { length: 64 }),
  creationTimeMs: int("creationTimeMs"), // Time taken to create in milliseconds
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuickCreatePost = typeof quickCreatePosts.$inferSelect;
export type InsertQuickCreatePost = typeof quickCreatePosts.$inferInsert;
