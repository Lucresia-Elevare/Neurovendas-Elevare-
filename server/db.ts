import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

import { creations, Creation, InsertCreation } from "../drizzle/schema";
import { desc } from "drizzle-orm";

/**
 * Cria uma nova criação do TextPop
 */
export async function createCreation(creation: InsertCreation): Promise<Creation> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(creations).values(creation);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(creations).where(eq(creations.id, insertedId)).limit(1);
  if (!inserted[0]) {
    throw new Error("Failed to retrieve inserted creation");
  }
  
  return inserted[0];
}

/**
 * Atualiza uma criação existente
 */
export async function updateCreation(id: number, updates: Partial<InsertCreation>): Promise<Creation> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(creations).set(updates).where(eq(creations.id, id));
  
  const updated = await db.select().from(creations).where(eq(creations.id, id)).limit(1);
  if (!updated[0]) {
    throw new Error("Creation not found after update");
  }
  
  return updated[0];
}

/**
 * Lista todas as criações de um usuário
 */
export async function getUserCreations(userId: number): Promise<Creation[]> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return db.select().from(creations).where(eq(creations.userId, userId)).orderBy(desc(creations.createdAt));
}

/**
 * Obtém uma criação por ID
 */
export async function getCreationById(id: number): Promise<Creation | undefined> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(creations).where(eq(creations.id, id)).limit(1);
  return result[0];
}

/**
 * Deleta uma criação
 */
export async function deleteCreation(id: number, userId: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(creations).where(eq(creations.id, id));
}
