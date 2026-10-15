import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    return user;
  },
});

export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(
      v.literal("OWNER"),
      v.literal("CUSTOMER"),
      v.literal("ADMIN")
    ),
    status: v.optional(
      v.union(
        v.literal("ACTIVE"),
        v.literal("PENDING"),
        v.literal("INACTIVE"),
        v.literal("SUSPENDED"),
        v.literal("DELETED")
      )
    ),
    createdAt: v.union(v.string(), v.number()),
    updatedAt: v.union(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      throw new Error(`User with clerkId ${args.clerkId} already exists.`);
    }

    const userId = await ctx.db.insert("users", args);
    return userId;
  },
});

export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    role: v.union(
      v.literal("OWNER"),
      v.literal("CUSTOMER"),
      v.literal("ADMIN")
    ),
    status: v.optional(
      v.union(
        v.literal("ACTIVE"),
        v.literal("PENDING"),
        v.literal("INACTIVE"),
        v.literal("SUSPENDED"),
        v.literal("DELETED")
      )
    ),
    updatedAt: v.union(v.string(), v.number()),
  },
  handler: async (ctx, args) => {
    const { clerkId, ...fieldsToUpdate } = args;
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) {
      throw new Error(`User with clerkId ${clerkId} not found.`);
    }

    await ctx.db.patch(user._id, fieldsToUpdate);
    return user._id;
  },
});
