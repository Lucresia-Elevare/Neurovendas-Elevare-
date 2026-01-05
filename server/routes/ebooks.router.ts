import { z } from "zod";
import { TRPCError, initTRPC } from "@trpc/server";
import { nanoid } from "nanoid";
import { eq, and, desc, like, or } from "drizzle-orm";
import { db } from "../db.ts";
import { projects, generatedContent, users } from "../../drizzle/schema.ts";
import {
  generateContentSchema,
  generatePDFSchema,
  saveProjectSchema,
  getProjectsSchema,
  deleteProjectSchema,
} from "../../shared/ebookSchema.ts";
import { generateEbookContent } from "../_core/llm.ts";
import { parseHTML } from "../_core/htmlParser.ts";
import { renderEbookHTML } from "../_core/ebookRenderer.ts";
import { generatePDFFromHTML } from "../_core/htmlToPdf.ts";
import { storagePut } from "../storage.ts";

// Initialize tRPC
const t = initTRPC.context<{ userId?: string }>().create();

const publicProcedure = t.procedure;
const protectedProcedure = t.procedure.use(async (opts) => {
  const { ctx } = opts;
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return opts.next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});

export const ebooksRouter = t.router({
  // Generate structured content using LLM
  generateStructuredContent: protectedProcedure
    .input(generateContentSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { theme, targetAudience, objective } = input;

        // Generate content using LLM
        const generatedHTML = await generateEbookContent({
          theme,
          targetAudience,
          objective,
        });

        // Parse the HTML
        const parsed = parseHTML(generatedHTML);

        // Create structured data
        const structuredData = {
          theme,
          targetAudience,
          objective,
          content: parsed.html,
          metadata: {
            wordCount: parsed.wordCount,
            headings: parsed.headings,
            generatedAt: new Date().toISOString(),
          },
        };

        return {
          content: parsed.html,
          structuredData,
          wordCount: parsed.wordCount,
          headings: parsed.headings,
        };
      } catch (error) {
        console.error("Error generating content:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate content",
        });
      }
    }),

  // Generate PDF from structured content
  generatePDFFromStructured: protectedProcedure
    .input(generatePDFSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { content, template, assetType = "ebook", projectId } = input;

        // Render HTML with template
        const html = renderEbookHTML({
          title: "E-book Neurovendas",
          content,
          template,
        });

        // Generate PDF
        const pdfBuffer = await generatePDFFromHTML(html);

        // Upload to S3
        const key = `ebooks/${ctx.userId}/${nanoid()}.pdf`;
        const pdfUrl = await storagePut(key, pdfBuffer, "application/pdf");

        // If projectId provided, update the project with PDF URL
        if (projectId) {
          // Update project status
          await db
            .update(projects)
            .set({
              status: "completed",
              assetType, // Save assetType
              updatedAt: new Date(),
            })
            .where(and(eq(projects.id, projectId), eq(projects.userId, ctx.userId)));

          // Save or update generated content
          const existingContent = await db
            .select()
            .from(generatedContent)
            .where(eq(generatedContent.projectId, projectId))
            .limit(1);

          if (existingContent.length > 0) {
            await db
              .update(generatedContent)
              .set({
                pdfUrl,
                content,
              })
              .where(eq(generatedContent.id, existingContent[0].id));
          } else {
            await db.insert(generatedContent).values({
              id: nanoid(),
              projectId,
              content,
              pdfUrl,
              createdAt: new Date(),
            });
          }
        }

        return {
          pdfUrl,
          success: true,
        };
      } catch (error) {
        console.error("Error generating PDF:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate PDF",
        });
      }
    }),

  // Save or update project
  saveProject: protectedProcedure
    .input(saveProjectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const projectId = input.id || nanoid();

        const projectData = {
          id: projectId,
          userId: ctx.userId,
          title: input.title,
          description: input.description || null,
          theme: input.theme || null,
          targetAudience: input.targetAudience || null,
          objective: input.objective || null,
          assetType: input.assetType || "ebook",
          status: input.status || "draft",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        // Check if project exists
        if (input.id) {
          const existing = await db
            .select()
            .from(projects)
            .where(and(eq(projects.id, input.id), eq(projects.userId, ctx.userId)))
            .limit(1);

          if (existing.length > 0) {
            // Update existing
            await db
              .update(projects)
              .set({
                ...projectData,
                createdAt: existing[0].createdAt, // Keep original creation date
              })
              .where(eq(projects.id, input.id));
          } else {
            // Insert new
            await db.insert(projects).values(projectData);
          }
        } else {
          // Insert new
          await db.insert(projects).values(projectData);
        }

        return {
          id: projectId,
          success: true,
        };
      } catch (error) {
        console.error("Error saving project:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save project",
        });
      }
    }),

  // Get all projects for user
  getProjects: protectedProcedure
    .input(getProjectsSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { search, status, limit, offset } = input;

        let query = db
          .select()
          .from(projects)
          .where(eq(projects.userId, ctx.userId))
          .orderBy(desc(projects.updatedAt))
          .limit(limit)
          .offset(offset);

        // Apply filters
        const conditions = [eq(projects.userId, ctx.userId)];
        
        if (search) {
          conditions.push(
            or(
              like(projects.title, `%${search}%`),
              like(projects.description, `%${search}%`)
            ) as any
          );
        }

        if (status) {
          conditions.push(eq(projects.status, status));
        }

        const results = await db
          .select()
          .from(projects)
          .where(and(...conditions))
          .orderBy(desc(projects.updatedAt))
          .limit(limit)
          .offset(offset);

        return {
          projects: results,
          total: results.length,
        };
      } catch (error) {
        console.error("Error getting projects:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get projects",
        });
      }
    }),

  // Get single project by ID
  getProjectById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const project = await db
          .select()
          .from(projects)
          .where(and(eq(projects.id, input.id), eq(projects.userId, ctx.userId)))
          .limit(1);

        if (project.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        // Get generated content
        const content = await db
          .select()
          .from(generatedContent)
          .where(eq(generatedContent.projectId, input.id))
          .limit(1);

        return {
          ...project[0],
          generatedContent: content[0] || null,
        };
      } catch (error) {
        console.error("Error getting project:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to get project",
        });
      }
    }),

  // Delete project (with cascade delete)
  deleteProject: protectedProcedure
    .input(deleteProjectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = input;

        // Verify ownership
        const project = await db
          .select()
          .from(projects)
          .where(and(eq(projects.id, id), eq(projects.userId, ctx.userId)))
          .limit(1);

        if (project.length === 0) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Project not found",
          });
        }

        // Delete project (cascade will handle related records)
        await db.delete(projects).where(eq(projects.id, id));

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error deleting project:", error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete project",
        });
      }
    }),
});

export type EbooksRouter = typeof ebooksRouter;
