/**
 * Endpoint de callback OAuth do Canva
 * 
 * Rota: GET /api/canva/callback?code=...&state=...
 * 
 * Fluxo:
 * 1. Usuária clica "Conectar Canva"
 * 2. Redireciona para Canva OAuth
 * 3. Canva redireciona de volta para este endpoint
 * 4. Troca código por tokens
 * 5. Salva tokens no banco
 * 6. Redireciona para página de sucesso
 */

import type { Request, Response } from "express";
import { exchangeCodeForTokens } from "../_core/canvaApi";
import { getDb } from "../db";

export async function handleCanvaCallback(req: Request, res: Response) {
  try {
    const { code, state, error } = req.query;

    // Verificar erro do Canva
    if (error) {
      console.error("Canva OAuth error:", error);
      return res.redirect(`/gerador-materiais?canva_error=${error}`);
    }

    // Validar parâmetros
    if (!code || typeof code !== "string") {
      return res.status(400).send("Missing authorization code");
    }

    if (!state || typeof state !== "string") {
      return res.status(400).send("Missing state parameter");
    }

    // Decodificar state (contém userId)
    let userId: number;
    try {
      const decoded = JSON.parse(Buffer.from(state, "base64").toString());
      userId = decoded.userId;
    } catch (error) {
      return res.status(400).send("Invalid state parameter");
    }

    // Trocar código por tokens
    const tokens = await exchangeCodeForTokens(code);

    // Salvar no banco
    const db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }

    const { canvaTokens } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");

    // Verificar se já existe token para este usuário
    const [existingToken] = await db.select().from(canvaTokens)
      .where(eq(canvaTokens.userId, userId))
      .limit(1);

    const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

    if (existingToken) {
      // Atualizar token existente
      await db.update(canvaTokens)
        .set({
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || existingToken.refreshToken,
          expiresAt,
          scope: tokens.scope,
        })
        .where(eq(canvaTokens.userId, userId));
    } else {
      // Inserir novo token
      await db.insert(canvaTokens).values({
        userId,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiresAt,
        scope: tokens.scope,
      });
    }

    // Redirecionar para página de sucesso
    res.redirect("/gerador-materiais?canva_connected=true");
  } catch (error) {
    console.error("Canva callback error:", error);
    res.redirect(`/gerador-materiais?canva_error=${encodeURIComponent(String(error))}`);
  }
}
