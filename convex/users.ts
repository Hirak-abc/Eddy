import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.clerkId) {
      throw new Error('FORBIDDEN');
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    return user;
  },
});

export const getCurrentUserRole = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('UNAUTHORIZED');
    }
    const user = await ctx.db
      .query('users')
      .withIndex('by_clerk_id', (q) => q.eq('clerkId', identity.subject))
      .unique();
    if (!user) {
      return { role: null, status: null };
    }
    if (user.status === 'SUSPENDED' || user.status === 'DELETED' || user.status === 'INACTIVE') {
      return { role: null, status: user.status };
    }
    return { role: user.role, status: user.status ?? 'ACTIVE' };
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.clerkId) {
      throw new Error('FORBIDDEN');
    }
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
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.subject !== args.clerkId) {
      throw new Error('FORBIDDEN');
    }
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
