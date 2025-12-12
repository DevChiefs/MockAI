import { v } from "convex/values";
import {
  mutation,
  query,
  action,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

// Simple password hashing (in production, use bcrypt or similar)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Generate a random session token
function generateToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const signUp = action({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    | { success: false; error: string }
    | { success: true; token: string; userId: string }
  > => {
    // Check if user already exists using internal mutation
    const existingUser = await ctx.runQuery(internal.auth.checkExistingUser, {
      email: args.email,
    });

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Validate password
    if (args.password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    // Hash password
    const passwordHash = await hashPassword(args.password);

    // Create user via internal mutation
    const result = await ctx.runMutation(internal.auth.createUserInternal, {
      email: args.email,
      passwordHash,
      name: args.name,
    });

    // Send Discord webhook notification (non-blocking)
    try {
      await fetch(
        "https://discord.com/api/webhooks/1448864797939470460/miRHTnXpb6JX58hZ4lrZMzN_CVvVlDxxLde-T5gmHRMOCZr3Rk8ne-Kv2njU8xAtRO2Y",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: `New user ${args.name || "Unknown"} with email ${args.email} has signed up!`,
            embeds: [
              {
                title: "New User Sign Up",
                description: `New user ${args.name || "Unknown"} with email ${args.email} has signed up!`,
                color: 0x2563eb,
                fields: [
                  {
                    name: "User Name",
                    value: args.name || "Not provided",
                  },
                  {
                    name: "Email",
                    value: args.email,
                  },
                  {
                    name: "Timestamp",
                    value: new Date().toLocaleString(),
                  },
                ],
              },
            ],
          }),
        }
      );
    } catch (error) {
      // Log error but don't block signup
      console.error("Failed to send Discord notification:", error);
    }

    return { success: true, token: result.token, userId: result.userId };
  },
});

// Internal query to check if user exists
export const checkExistingUser = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user !== null;
  },
});

// Internal mutation to create user and session
export const createUserInternal = internalMutation({
  args: {
    email: v.string(),
    passwordHash: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (
    ctx,
    args
  ): Promise<{
    success: boolean;
    token: string;
    userId: string;
  }> => {
    // Create user
    const userId = await ctx.db.insert("users", {
      email: args.email,
      passwordHash: args.passwordHash,
      name: args.name,
      createdAt: Date.now(),
    });

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.db.insert("authSessions", {
      userId,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { success: true, token, userId: userId as string };
  },
});

export const signIn = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Verify password
    const passwordHash = await hashPassword(args.password);
    if (passwordHash !== user.passwordHash) {
      return {
        success: false,
        error: "Invalid email or password",
      };
    }

    // Create session
    const token = generateToken();
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

    await ctx.db.insert("authSessions", {
      userId: user._id,
      token,
      expiresAt,
      createdAt: Date.now(),
    });

    return { success: true, token, userId: user._id };
  },
});

export const signOut = mutation({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (session) {
      await ctx.db.delete(session._id);
    }

    return { success: true };
  },
});

export const getCurrentUser = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Find session
    const session = await ctx.db
      .query("authSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!session) {
      return null;
    }

    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      // Note: Can't delete in a query, client should handle re-auth
      return null;
    }

    // Get user
    const user = await ctx.db.get(session.userId);

    if (!user) {
      return null;
    }

    return {
      _id: user._id,
      email: user.email,
      name: user.name,
    };
  },
});
