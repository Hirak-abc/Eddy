import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    role: v.union(
      v.literal("OWNER"),
      v.literal("CUSTOMER"),
      v.literal("ADMIN"),
    ),
    displayName: v.string(),
    phone: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    status: v.union(
      v.literal("ACTIVE"),
      v.literal("INACTIVE"),
      v.literal("SUSPENDED"),
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Idempotent: a user document is unique per clerkId. Concurrent
    // GET /api/me calls (several mounted components can each trigger one)
    // can otherwise race between "lookup found nothing" and "insert", and
    // insert a second document for the same Clerk identity. Returning the
    // existing id keeps callers on the original document.
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (existing) {
      return existing._id;
    }
    return await ctx.db.insert("users", args);
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    data: v.object({
      email: v.optional(v.string()),
      role: v.optional(
        v.union(
          v.literal("OWNER"),
          v.literal("CUSTOMER"),
          v.literal("ADMIN"),
        ),
      ),
      displayName: v.optional(v.string()),
      phone: v.optional(v.string()),
      avatarUrl: v.optional(v.string()),
      status: v.optional(
        v.union(
          v.literal("ACTIVE"),
          v.literal("INACTIVE"),
          v.literal("SUSPENDED"),
        ),
      ),
      updatedAt: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    if (!user) {
      throw new Error("User not found");
    }
    await ctx.db.patch(user._id, args.data);
    return await ctx.db.get(user._id);
  },
});
