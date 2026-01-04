import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { userTemplates, type InsertUserTemplate } from "../drizzle/schema";

/**
 * Criar um novo template personalizado
 */
export async function createUserTemplate(data: InsertUserTemplate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userTemplates).values(data);
  return result;
}

/**
 * Listar templates do usuário
 */
export async function getUserTemplates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const templates = await db
    .select()
    .from(userTemplates)
    .where(eq(userTemplates.userId, userId))
    .orderBy(userTemplates.createdAt);
  
  return templates;
}

/**
 * Obter um template específico
 */
export async function getUserTemplate(userId: number, templateId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(userTemplates)
    .where(
      and(
        eq(userTemplates.id, templateId),
        eq(userTemplates.userId, userId)
      )
    )
    .limit(1);
  
  return result[0] || null;
}

/**
 * Atualizar um template
 */
export async function updateUserTemplate(
  userId: number,
  templateId: number,
  data: Partial<InsertUserTemplate>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .update(userTemplates)
    .set(data)
    .where(
      and(
        eq(userTemplates.id, templateId),
        eq(userTemplates.userId, userId)
      )
    );
}

/**
 * Deletar um template
 */
export async function deleteUserTemplate(userId: number, templateId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(userTemplates)
    .where(
      and(
        eq(userTemplates.id, templateId),
        eq(userTemplates.userId, userId)
      )
    );
}
