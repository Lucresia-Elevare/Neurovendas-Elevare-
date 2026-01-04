import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
