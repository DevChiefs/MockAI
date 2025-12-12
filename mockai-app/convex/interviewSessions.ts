import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper function to verify auth token and get user
async function authenticateUser(ctx: any, token: string) {
  const session = await ctx.db
    .query("authSessions")
    .withIndex("by_token", (q: any) => q.eq("token", token))
    .first();

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (session.expiresAt < Date.now()) {
    await ctx.db.delete(session._id);
    return null;
  }

  const user = await ctx.db.get(session.userId);
  return user;
}

export const createSession = mutation({
  args: {
    token: v.string(),
    jobTitle: v.string(),
    resumeText: v.string(),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const user = await authenticateUser(ctx, args.token);
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Create interview session
    const sessionId = await ctx.db.insert("interviewSessions", {
      userId: user._id,
      jobTitle: args.jobTitle,
      resumeText: args.resumeText,
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return {
      success: true,
      sessionId,
    };
  },
});

export const getUserSessions = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const user = await authenticateUser(ctx, args.token);
    if (!user) {
      return [];
    }

    // Get all sessions for user, ordered by creation date (newest first)
    const sessions = await ctx.db
      .query("interviewSessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Sort by createdAt descending
    return sessions.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const getSession = query({
  args: {
    token: v.string(),
    sessionId: v.id("interviewSessions"),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const user = await authenticateUser(ctx, args.token);
    if (!user) {
      return null;
    }

    // Get session
    const session = await ctx.db.get(args.sessionId);

    // Verify session belongs to user
    if (!session || session.userId !== user._id) {
      return null;
    }

    return session;
  },
});

export const deleteSession = mutation({
  args: {
    token: v.string(),
    sessionId: v.id("interviewSessions"),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const user = await authenticateUser(ctx, args.token);
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get session
    const session = await ctx.db.get(args.sessionId);

    // Verify session belongs to user
    if (!session || session.userId !== user._id) {
      return {
        success: false,
        error: "Session not found or unauthorized",
      };
    }

    // Delete session
    await ctx.db.delete(args.sessionId);

    return {
      success: true,
    };
  },
});

export const updateSessionStatus = mutation({
  args: {
    token: v.string(),
    sessionId: v.id("interviewSessions"),
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed")
    ),
    vapiSessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Authenticate user
    const user = await authenticateUser(ctx, args.token);
    if (!user) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get session
    const session = await ctx.db.get(args.sessionId);

    // Verify session belongs to user
    if (!session || session.userId !== user._id) {
      return {
        success: false,
        error: "Session not found or unauthorized",
      };
    }

    // Update session
    await ctx.db.patch(args.sessionId, {
      status: args.status,
      vapiSessionId: args.vapiSessionId,
      updatedAt: Date.now(),
    });

    return {
      success: true,
    };
  },
});
