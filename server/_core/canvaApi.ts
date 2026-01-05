/**
 * Canva API Integration Helper
 * 
 * Documentação: https://www.canva.com/developers/docs/connect-api/
 * 
 * Funcionalidades:
 * - OAuth 2.0 flow (authorize + callback + refresh)
 * - Criação de designs (carrossel, vídeo)
 * - Exportação de designs (PNG, MP4)
 * - Gerenciamento de templates
 */

import { ENV } from "./env";

const CANVA_API_BASE = "https://api.canva.com/rest/v1";
const CANVA_OAUTH_BASE = "https://www.canva.com/api/oauth";

interface CanvaTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number; // segundos
  token_type: string;
  scope: string;
}

interface CanvaDesignResponse {
  id: string;
  title: string;
  thumbnail: {
    url: string;
  };
  urls: {
    edit_url: string;
    view_url: string;
  };
}

interface CanvaExportResponse {
  job: {
    id: string;
    status: "in_progress" | "success" | "failed";
  };
}

interface CanvaExportStatusResponse {
  job: {
    id: string;
    status: "in_progress" | "success" | "failed";
    result?: {
      url: string;
    };
  };
}

/**
 * Gera URL de autorização OAuth do Canva
 */
export function getCanvaAuthUrl(userId: number): string {
  const clientId = ENV.canvaClientId;
  if (!clientId) {
    throw new Error("CANVA_CLIENT_ID not configured");
  }

  const redirectUri = `${ENV.appUrl || "http://localhost:3000"}/api/canva/callback`;
  const state = Buffer.from(JSON.stringify({ userId })).toString("base64");
  const scope = "design:content:read design:content:write design:meta:read asset:read asset:write";

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
    scope,
  });

  return `${CANVA_OAUTH_BASE}/authorize?${params.toString()}`;
}

/**
 * Troca código de autorização por tokens de acesso
 */
export async function exchangeCodeForTokens(code: string): Promise<CanvaTokenResponse> {
  const clientId = ENV.canvaClientId;
  const clientSecret = ENV.canvaClientSecret;

  if (!clientId || !clientSecret) {
    throw new Error("Canva credentials not configured");
  }

  const redirectUri = `${ENV.appUrl || "http://localhost:3000"}/api/canva/callback`;

  const response = await fetch(`${CANVA_OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  return response.json();
}

/**
 * Atualiza token de acesso usando refresh token
 */
export async function refreshAccessToken(refreshToken: string): Promise<CanvaTokenResponse> {
  const clientId = ENV.canvaClientId;
  const clientSecret = ENV.canvaClientSecret;

  if (!clientId || !clientSecret) {
    throw new Error("Canva credentials not configured");
  }

  const response = await fetch(`${CANVA_OAUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh token: ${error}`);
  }

  return response.json();
}

/**
 * Revoga token de acesso
 */
export async function revokeToken(accessToken: string): Promise<void> {
  const clientId = ENV.canvaClientId;
  const clientSecret = ENV.canvaClientSecret;

  if (!clientId || !clientSecret) {
    throw new Error("Canva credentials not configured");
  }

  const response = await fetch(`${CANVA_OAUTH_BASE}/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      token: accessToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to revoke token: ${error}`);
  }
}

/**
 * Cria um design no Canva a partir de template
 */
export async function createDesign(
  accessToken: string,
  options: {
    title: string;
    designType: "Carousel" | "Video";
    width?: number;
    height?: number;
  }
): Promise<CanvaDesignResponse> {
  const response = await fetch(`${CANVA_API_BASE}/designs`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      asset_type: options.designType.toLowerCase(),
      title: options.title,
      width_px: options.width || 1080,
      height_px: options.height || 1080,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create design: ${error}`);
  }

  return response.json();
}

/**
 * Adiciona conteúdo ao design (texto, imagens)
 */
export async function addContentToDesign(
  accessToken: string,
  designId: string,
  content: {
    type: "text" | "image";
    text?: string;
    imageUrl?: string;
    position: { x: number; y: number };
    size: { width: number; height: number };
  }[]
): Promise<void> {
  const response = await fetch(`${CANVA_API_BASE}/designs/${designId}/content`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ elements: content }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to add content: ${error}`);
  }
}

/**
 * Exporta design como PNG ou MP4
 */
export async function exportDesign(
  accessToken: string,
  designId: string,
  format: "png" | "mp4"
): Promise<string> {
  // Iniciar export job
  const exportResponse = await fetch(`${CANVA_API_BASE}/designs/${designId}/export`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      format,
      quality: "high",
    }),
  });

  if (!exportResponse.ok) {
    const error = await exportResponse.text();
    throw new Error(`Failed to start export: ${error}`);
  }

  const exportData: CanvaExportResponse = await exportResponse.json();
  const jobId = exportData.job.id;

  // Polling: aguardar conclusão do export
  let attempts = 0;
  const maxAttempts = 30; // 30 tentativas = 1 minuto (2s cada)

  while (attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Aguardar 2 segundos

    const statusResponse = await fetch(`${CANVA_API_BASE}/export/${jobId}`, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error("Failed to check export status");
    }

    const statusData: CanvaExportStatusResponse = await statusResponse.json();

    if (statusData.job.status === "success" && statusData.job.result?.url) {
      return statusData.job.result.url;
    }

    if (statusData.job.status === "failed") {
      throw new Error("Export failed");
    }

    attempts++;
  }

  throw new Error("Export timeout");
}

/**
 * Lista designs do usuário
 */
export async function listDesigns(
  accessToken: string,
  options?: {
    limit?: number;
    offset?: number;
  }
): Promise<{ designs: CanvaDesignResponse[]; has_more: boolean }> {
  const params = new URLSearchParams({
    limit: String(options?.limit || 20),
    offset: String(options?.offset || 0),
  });

  const response = await fetch(`${CANVA_API_BASE}/designs?${params.toString()}`, {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to list designs: ${error}`);
  }

  return response.json();
}
