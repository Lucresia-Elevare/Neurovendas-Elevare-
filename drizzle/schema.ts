import { mysqlTable, varchar, text, datetime, int, mysqlEnum } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
});

export const projects = mysqlTable("projects", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  theme: text("theme"),
  targetAudience: text("target_audience"),
  objective: text("objective"),
  assetType: mysqlEnum("asset_type", ["ebook", "cover", "audiobook"]).default("ebook"),
  status: mysqlEnum("status", ["draft", "generating", "completed", "error"]).default("draft"),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  updatedAt: datetime("updated_at").notNull().$defaultFn(() => new Date()),
});

export const generatedContent = mysqlTable("generated_content", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 }).notNull().references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  structuredData: text("structured_data"), // JSON string
  pdfUrl: text("pdf_url"),
  coverUrl: text("cover_url"),
  audioUrl: text("audio_url"),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
});

export const contentVersions = mysqlTable("content_versions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  projectId: varchar("project_id", { length: 255 }).notNull().references(() => projects.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  versionNumber: int("version_number").notNull(),
  createdAt: datetime("created_at").notNull().$defaultFn(() => new Date()),
  createdBy: varchar("created_by", { length: 255 }).notNull().references(() => users.id),
});
