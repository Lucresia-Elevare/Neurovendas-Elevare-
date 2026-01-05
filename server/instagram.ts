import { getDb } from "./db";
import { instagramConnections, instagramPublications } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Helpers para integração com Instagram Graph API
 */

// Obter conexão do Instagram do usuário
export async function getUserInstagramConnection(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const connections = await db
    .select()
    .from(instagramConnections)
    .where(eq(instagramConnections.userId, userId))
    .limit(1);

  return connections[0] || null;
}

// Salvar ou atualizar conexão do Instagram
export async function upsertInstagramConnection(data: {
  userId: number;
  instagramUserId: string;
  instagramUsername?: string;
  accessToken: string;
  tokenExpiresAt: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await getUserInstagramConnection(data.userId);

  if (existing) {
    await db
      .update(instagramConnections)
      .set({
        instagramUserId: data.instagramUserId,
        instagramUsername: data.instagramUsername,
        accessToken: data.accessToken,
        tokenExpiresAt: data.tokenExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(instagramConnections.userId, data.userId));
  } else {
    await db.insert(instagramConnections).values(data);
  }
}

// Criar publicação no Instagram
export async function createInstagramPublication(data: {
  userId: number;
  creationId: number;
  scheduledFor?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(instagramPublications).values({
    userId: data.userId,
    creationId: data.creationId,
    status: "pending",
    scheduledFor: data.scheduledFor,
  });

  return result;
}

// Atualizar status da publicação
export async function updatePublicationStatus(
  publicationId: number,
  status: "pending" | "published" | "failed",
  data?: {
    instagramPostId?: string;
    publishedAt?: Date;
    errorMessage?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(instagramPublications)
    .set({
      status,
      instagramPostId: data?.instagramPostId,
      publishedAt: data?.publishedAt,
      errorMessage: data?.errorMessage,
      updatedAt: new Date(),
    })
    .where(eq(instagramPublications.id, publicationId));
}

// Listar publicações do usuário
export async function getUserPublications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(instagramPublications)
    .where(eq(instagramPublications.userId, userId))
    .orderBy(instagramPublications.createdAt);
}

/**
 * Publicar imagem no Instagram usando Graph API
 */
export async function publishToInstagram(params: {
  accessToken: string;
  instagramUserId: string;
  imageUrl: string;
  caption?: string;
}) {
  const { accessToken, instagramUserId, imageUrl, caption } = params;

  try {
    // Passo 1: Criar container de mídia
    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramUserId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption: caption || "",
          access_token: accessToken,
        }),
      }
    );

    if (!containerResponse.ok) {
      const error = await containerResponse.json();
      throw new Error(`Failed to create media container: ${JSON.stringify(error)}`);
    }

    const containerData = await containerResponse.json();
    const creationId = containerData.id;

    // Passo 2: Publicar o container
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramUserId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: creationId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      throw new Error(`Failed to publish media: ${JSON.stringify(error)}`);
    }

    const publishData = await publishResponse.json();
    return {
      success: true,
      postId: publishData.id,
    };
  } catch (error) {
    console.error("Error publishing to Instagram:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Publicar carrossel no Instagram
 */
export async function publishCarouselToInstagram(params: {
  accessToken: string;
  instagramUserId: string;
  imageUrls: string[];
  caption?: string;
}) {
  const { accessToken, instagramUserId, imageUrls, caption } = params;

  try {
    // Passo 1: Criar containers para cada imagem
    const containerIds: string[] = [];

    for (const imageUrl of imageUrls) {
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${instagramUserId}/media`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: imageUrl,
            is_carousel_item: true,
            access_token: accessToken,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Failed to create carousel item: ${JSON.stringify(error)}`);
      }

      const data = await response.json();
      containerIds.push(data.id);
    }

    // Passo 2: Criar container do carrossel
    const carouselResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramUserId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          media_type: "CAROUSEL",
          children: containerIds,
          caption: caption || "",
          access_token: accessToken,
        }),
      }
    );

    if (!carouselResponse.ok) {
      const error = await carouselResponse.json();
      throw new Error(`Failed to create carousel container: ${JSON.stringify(error)}`);
    }

    const carouselData = await carouselResponse.json();
    const carouselId = carouselData.id;

    // Passo 3: Publicar o carrossel
    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramUserId}/media_publish`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creation_id: carouselId,
          access_token: accessToken,
        }),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json();
      throw new Error(`Failed to publish carousel: ${JSON.stringify(error)}`);
    }

    const publishData = await publishResponse.json();
    return {
      success: true,
      postId: publishData.id,
    };
  } catch (error) {
    console.error("Error publishing carousel to Instagram:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Trocar código de autorização por token de acesso
 */
export async function exchangeCodeForToken(code: string, redirectUri: string) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Instagram credentials not configured");
  }

  try {
    // Trocar código por token de curta duração
    const response = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
        code,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to exchange code: ${JSON.stringify(error)}`);
    }

    const data = await response.json();
    const shortLivedToken = data.access_token;
    const userId = data.user_id;

    // Trocar por token de longa duração
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v18.0/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortLivedToken}`
    );

    if (!longLivedResponse.ok) {
      const error = await longLivedResponse.json();
      throw new Error(`Failed to get long-lived token: ${JSON.stringify(error)}`);
    }

    const longLivedData = await longLivedResponse.json();

    // Obter informações do usuário
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/${userId}?fields=username&access_token=${longLivedData.access_token}`
    );

    const userData = userResponse.ok ? await userResponse.json() : {};

    return {
      accessToken: longLivedData.access_token,
      expiresIn: longLivedData.expires_in, // Geralmente 60 dias
      userId,
      username: userData.username,
    };
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
}
