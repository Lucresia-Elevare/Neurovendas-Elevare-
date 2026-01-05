import { eq, desc, and } from "drizzle-orm";
import { getDb } from "./db";
import { userCredits, creditTransactions, userFavorites } from "../drizzle/schema";
import type { InsertCreditTransaction, InsertUserFavorite } from "../drizzle/schema";

/**
 * Obter saldo de créditos do usuário
 */
export async function getUserCredits(userId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db.select().from(userCredits).where(eq(userCredits.userId, userId)).limit(1);
  
  if (result.length === 0) {
    // Criar registro inicial com 10 créditos de bônus
    await db.insert(userCredits).values({
      userId,
      balance: 10,
      totalPurchased: 10,
      totalUsed: 0,
    });
    
    await db.insert(creditTransactions).values({
      userId,
      type: "bonus",
      amount: 10,
      description: "Bônus de boas-vindas",
    });
    
    return { balance: 10, totalPurchased: 10, totalUsed: 0 };
  }
  
  return result[0];
}

/**
 * Adicionar créditos (compra ou bônus)
 */
export async function addCredits(
  userId: number,
  amount: number,
  type: "purchase" | "bonus",
  description: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Atualizar saldo
  const current = await getUserCredits(userId);
  if (!current) throw new Error("User credits not found");
  
  await db
    .update(userCredits)
    .set({
      balance: current.balance + amount,
      totalPurchased: current.totalPurchased + amount,
    })
    .where(eq(userCredits.userId, userId));
  
  // Registrar transação
  await db.insert(creditTransactions).values({
    userId,
    type,
    amount,
    description,
  });
  
  return { success: true, newBalance: current.balance + amount };
}

/**
 * Usar créditos (remove.bg, etc)
 */
export async function useCredits(
  userId: number,
  amount: number,
  service: string,
  description: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const current = await getUserCredits(userId);
  if (!current) throw new Error("User credits not found");
  
  if (current.balance < amount) {
    throw new Error("Créditos insuficientes");
  }
  
  // Atualizar saldo
  await db
    .update(userCredits)
    .set({
      balance: current.balance - amount,
      totalUsed: current.totalUsed + amount,
    })
    .where(eq(userCredits.userId, userId));
  
  // Registrar transação
  await db.insert(creditTransactions).values({
    userId,
    type: "usage",
    amount: -amount,
    description,
    relatedService: service,
  });
  
  return { success: true, newBalance: current.balance - amount };
}

/**
 * Obter histórico de transações
 */
export async function getCreditTransactions(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, userId))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(limit);
  
  return result;
}

/**
 * Adicionar elemento aos favoritos
 */
export async function addFavorite(userId: number, elementId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Verificar se já existe
  const existing = await db
    .select()
    .from(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.elementId, elementId)))
    .limit(1);
  
  if (existing.length > 0) {
    return { success: true, alreadyExists: true };
  }
  
  await db.insert(userFavorites).values({
    userId,
    elementId,
  });
  
  return { success: true, alreadyExists: false };
}

/**
 * Remover elemento dos favoritos
 */
export async function removeFavorite(userId: number, elementId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db
    .delete(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.elementId, elementId)));
  
  return { success: true };
}

/**
 * Obter favoritos do usuário
 */
export async function getUserFavorites(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const result = await db
    .select()
    .from(userFavorites)
    .where(eq(userFavorites.userId, userId))
    .orderBy(desc(userFavorites.createdAt));
  
  return result.map((f) => f.elementId);
}

/**
 * Verificar se elemento é favorito
 */
export async function isFavorite(userId: number, elementId: string) {
  const db = await getDb();
  if (!db) return false;
  
  const result = await db
    .select()
    .from(userFavorites)
    .where(and(eq(userFavorites.userId, userId), eq(userFavorites.elementId, elementId)))
    .limit(1);
  
  return result.length > 0;
}
