import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";

/**
 * QuickCreate Router
 * 
 * Handles backend operations for the QuickCreate flow.
 * This router implements the "decision machine" architecture where
 * each post is created through a guided 4-step process with NeuroVendas
 * sales frameworks embedded.
 */
export const quickCreateRouter = router({
  /**
   * Create a new QuickCreate post
   * Called when user completes the 4-step flow and clicks "Publish"
   */
  createPost: protectedProcedure
    .input(
      z.object({
        presetId: z.string().min(1, "Preset ID is required"),
        caption: z.string().min(20, "Caption must be at least 20 characters").max(2200, "Caption too long"),
        hashtags: z.string().optional(),
        imageUrls: z.array(z.string().url()).min(1, "At least one image required").max(3, "Maximum 3 images allowed"),
        imageKeys: z.array(z.string()).min(1).max(3),
        engagementScore: z.number().min(0).max(100).optional(),
        scoreBreakdown: z.object({
          text: z.number(),
          visual: z.number(),
          cta: z.number(),
          hashtags: z.number(),
          timing: z.number(),
        }).optional(),
        sessionId: z.string().optional(),
        creationTimeMs: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const { quickCreatePosts } = await import("../../drizzle/schema");
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Validate preset exists
      const { neuroPresets } = await import("@shared/neuroPresets");
      const preset = neuroPresets.find(p => p.id === input.presetId);
      if (!preset) {
        throw new Error(`Invalid preset ID: ${input.presetId}`);
      }
      
      // Validate image arrays match
      if (input.imageUrls.length !== input.imageKeys.length) {
        throw new Error("Image URLs and keys must have the same length");
      }
      
      // Create post
      const result = await db.insert(quickCreatePosts).values({
        userId: ctx.user.id,
        presetId: input.presetId,
        caption: input.caption,
        hashtags: input.hashtags || null,
        imageUrls: JSON.stringify(input.imageUrls),
        imageKeys: JSON.stringify(input.imageKeys),
        engagementScore: input.engagementScore || null,
        scoreBreakdown: input.scoreBreakdown ? JSON.stringify(input.scoreBreakdown) : null,
        status: "draft",
        sessionId: input.sessionId || null,
        creationTimeMs: input.creationTimeMs || null,
      });
      
      // Track analytics event
      const { track } = await import("../../client/src/lib/analytics");
      track('post_published', {
        postId: Number((result as any).insertId),
        presetId: input.presetId,
        engagementScore: input.engagementScore || 0,
        creationTimeMs: input.creationTimeMs || 0,
        imageCount: input.imageUrls.length,
      });
      
      return {
        success: true,
        postId: Number((result as any).insertId),
      };
    }),
  
  /**
   * Schedule a post for future publishing
   */
  schedulePost: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        scheduledFor: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const { quickCreatePosts } = await import("../../drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify ownership
      const [post] = await db
        .select()
        .from(quickCreatePosts)
        .where(
          and(
            eq(quickCreatePosts.id, input.postId),
            eq(quickCreatePosts.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (!post) {
        throw new Error("Post not found or unauthorized");
      }
      
      if (post.status === "published") {
        throw new Error("Cannot schedule an already published post");
      }
      
      // Update status
      await db
        .update(quickCreatePosts)
        .set({
          status: "scheduled",
          scheduledFor: input.scheduledFor,
        })
        .where(eq(quickCreatePosts.id, input.postId));
      
      return { success: true };
    }),
  
  /**
   * Publish a post immediately to Instagram
   */
  publishNow: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const { quickCreatePosts } = await import("../../drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Get post
      const [post] = await db
        .select()
        .from(quickCreatePosts)
        .where(
          and(
            eq(quickCreatePosts.id, input.postId),
            eq(quickCreatePosts.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (!post) {
        throw new Error("Post not found or unauthorized");
      }
      
      if (post.status === "published") {
        throw new Error("Post already published");
      }
      
      // Parse image URLs
      const imageUrls: string[] = JSON.parse(post.imageUrls);
      
      // Integrate with Instagram API
      try {
        const { getUserInstagramConnection, publishToInstagram } = await import("../instagram");
        
        const connection = await getUserInstagramConnection(ctx.user.id);
        if (!connection) {
          throw new Error("Instagram account not connected");
        }
        
        // Publish single image or carousel
        let result;
        if (imageUrls.length === 1) {
          result = await publishToInstagram({
            accessToken: connection.accessToken,
            instagramUserId: connection.instagramUserId,
            imageUrl: imageUrls[0],
            caption: post.caption + (post.hashtags ? `\n\n${post.hashtags}` : ""),
          });
        } else {
          const { publishCarouselToInstagram } = await import("../instagram");
          result = await publishCarouselToInstagram({
            accessToken: connection.accessToken,
            instagramUserId: connection.instagramUserId,
            imageUrls,
            caption: post.caption + (post.hashtags ? `\n\n${post.hashtags}` : ""),
          });
        }
        
        if (result.success && result.postId) {
          // Update post status
          await db
            .update(quickCreatePosts)
            .set({
              status: "published",
              publishedAt: new Date(),
              instagramPostId: result.postId,
            })
            .where(eq(quickCreatePosts.id, input.postId));
          
          return {
            success: true,
            instagramPostId: result.postId,
          };
        } else {
          // Mark as failed
          await db
            .update(quickCreatePosts)
            .set({
              status: "failed",
            })
            .where(eq(quickCreatePosts.id, input.postId));
          
          throw new Error(result.error || "Failed to publish to Instagram");
        }
      } catch (error) {
        // Mark as failed
        await db
          .update(quickCreatePosts)
          .set({
            status: "failed",
          })
          .where(eq(quickCreatePosts.id, input.postId));
        
        throw error;
      }
    }),
  
  /**
   * List user's QuickCreate posts
   */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(["draft", "scheduled", "published", "failed"]).optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const { quickCreatePosts } = await import("../../drizzle/schema");
      const { eq, and, desc } = await import("drizzle-orm");
      
      const db = await getDb();
      if (!db) return [];
      
      let query = db
        .select()
        .from(quickCreatePosts)
        .where(eq(quickCreatePosts.userId, ctx.user.id));
      
      if (input.status) {
        query = query.where(
          and(
            eq(quickCreatePosts.userId, ctx.user.id),
            eq(quickCreatePosts.status, input.status)
          )
        ) as any;
      }
      
      const posts = await query
        .orderBy(desc(quickCreatePosts.createdAt))
        .limit(input.limit);
      
      // Parse JSON fields and add preset details
      const { neuroPresets } = await import("@shared/neuroPresets");
      
      return posts.map(post => {
        const preset = neuroPresets.find(p => p.id === post.presetId);
        
        return {
          ...post,
          imageUrls: JSON.parse(post.imageUrls),
          imageKeys: JSON.parse(post.imageKeys),
          scoreBreakdown: post.scoreBreakdown ? JSON.parse(post.scoreBreakdown) : null,
          preset: preset ? {
            id: preset.id,
            name: preset.name,
            goal: preset.goal,
          } : null,
        };
      });
    }),
  
  /**
   * Get a single post by ID
   */
  get: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const { quickCreatePosts } = await import("../../drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [post] = await db
        .select()
        .from(quickCreatePosts)
        .where(
          and(
            eq(quickCreatePosts.id, input.postId),
            eq(quickCreatePosts.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (!post) {
        throw new Error("Post not found or unauthorized");
      }
      
      // Parse JSON fields and add preset details
      const { neuroPresets } = await import("@shared/neuroPresets");
      const preset = neuroPresets.find(p => p.id === post.presetId);
      
      return {
        ...post,
        imageUrls: JSON.parse(post.imageUrls),
        imageKeys: JSON.parse(post.imageKeys),
        scoreBreakdown: post.scoreBreakdown ? JSON.parse(post.scoreBreakdown) : null,
        preset: preset || null,
      };
    }),
  
  /**
   * Delete a draft post
   */
  delete: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { getDb } = await import("../db");
      const { quickCreatePosts } = await import("../../drizzle/schema");
      const { eq, and } = await import("drizzle-orm");
      
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      // Verify ownership and status
      const [post] = await db
        .select()
        .from(quickCreatePosts)
        .where(
          and(
            eq(quickCreatePosts.id, input.postId),
            eq(quickCreatePosts.userId, ctx.user.id)
          )
        )
        .limit(1);
      
      if (!post) {
        throw new Error("Post not found or unauthorized");
      }
      
      if (post.status === "published") {
        throw new Error("Cannot delete published posts");
      }
      
      // Delete
      await db
        .delete(quickCreatePosts)
        .where(eq(quickCreatePosts.id, input.postId));
      
      return { success: true };
    }),
  
  /**
   * Generate AI caption using OpenAI
   * Uses preset-specific NeuroVendas frameworks
   */
  generateCaption: protectedProcedure
    .input(
      z.object({
        presetId: z.string().min(1),
        userContext: z.string().optional(),
        imageDescriptions: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { generateCaption } = await import("../_core/aiCaptionGenerator");
      
      const result = await generateCaption({
        presetId: input.presetId,
        userContext: input.userContext,
        imageDescriptions: input.imageDescriptions,
      });
      
      return result;
    }),
  
  /**
   * Analyze content for engagement score
   * Returns detailed breakdown and actionable suggestions
   */
  analyzeContent: protectedProcedure
    .input(
      z.object({
        presetId: z.string().min(1),
        caption: z.string().min(1),
        imageUrls: z.array(z.string().url()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { calculateEngagementScore } = await import("../_core/engagementScorer");
      
      const analysis = await calculateEngagementScore({
        caption: input.caption,
        imageCount: input.imageUrls?.length || 0,
        presetId: input.presetId,
      });
      
      return analysis;
    }),
  
  /**
   * Apply AI suggestion to caption
   * Tracks suggestion acceptance for analytics
   */
  applySuggestion: protectedProcedure
    .input(
      z.object({
        caption: z.string(),
        suggestionType: z.enum(['text', 'visual', 'cta', 'hashtags', 'timing']),
        suggestionAction: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Apply suggestion logic based on type
      let updatedCaption = input.caption;
      
      switch (input.suggestionType) {
        case 'cta':
          // Move CTA to beginning or make it more prominent
          if (input.suggestionAction.includes('Move CTA')) {
            const ctaMatch = updatedCaption.match(/(📞|📲|💬|📩|🔗|👉).*?(agenda|agende|link|bio|comente|compartilhe)/i);
            if (ctaMatch) {
              const cta = ctaMatch[0];
              updatedCaption = updatedCaption.replace(cta, '').trim();
              updatedCaption = `${cta}\n\n${updatedCaption}`;
            }
          }
          break;
        
        case 'hashtags':
          // Add suggested hashtag
          const hashtagMatch = input.suggestionAction.match(/#\w+/);
          if (hashtagMatch && !updatedCaption.includes(hashtagMatch[0])) {
            updatedCaption += ` ${hashtagMatch[0]}`;
          }
          break;
        
        case 'text':
          // Add emoji or improve hook
          if (input.suggestionAction.includes('emoji') && !updatedCaption.match(/[\u{1F300}-\u{1F9FF}]/u)) {
            updatedCaption = `✨ ${updatedCaption}`;
          }
          break;
      }
      
      // Recalculate score
      const { calculateEngagementScore } = await import("../_core/engagementScorer");
      const newScore = await calculateEngagementScore({
        caption: updatedCaption,
        imageCount: 1, // Assume at least 1 image
        presetId: '', // Not needed for score calculation
      });
      
      return {
        updatedCaption,
        newScore: newScore.total,
      };
    }),
});
