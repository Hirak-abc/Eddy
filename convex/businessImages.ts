import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const slotValidator = v.union(
  v.literal("shop"),
  v.literal("product"),
  v.literal("item"),
);

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => await ctx.storage.generateUploadUrl(),
});

export const getStorageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => await ctx.storage.getUrl(args.storageId),
});

export const listByOwner = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const images = await ctx.db
      .query("businessImages")
      .withIndex("by_owner_slot", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();

    return await Promise.all(
      images.map(async (image) => ({
        slot: image.slot,
        storageKey: image.storageId,
        url: await ctx.storage.getUrl(image.storageId),
        uploadedAt: image.uploadedAt,
      })),
    );
  },
});

export const saveForOwner = mutation({
  args: {
    clerkUserId: v.string(),
    slot: slotValidator,
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const uploadedAt = new Date().toISOString();
    const existing = await ctx.db
      .query("businessImages")
      .withIndex("by_owner_slot", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("slot", args.slot),
      )
      .first();

    if (existing) {
      await ctx.storage.delete(existing.storageId);
      await ctx.db.patch(existing._id, {
        storageId: args.storageId,
        uploadedAt,
      });
    } else {
      await ctx.db.insert("businessImages", {
        clerkUserId: args.clerkUserId,
        slot: args.slot,
        storageId: args.storageId,
        uploadedAt,
      });
    }

    return {
      storageKey: args.storageId,
      url: await ctx.storage.getUrl(args.storageId),
      uploadedAt,
    };
  },
});

export const deleteForOwner = mutation({
  args: {
    clerkUserId: v.string(),
    slot: slotValidator,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("businessImages")
      .withIndex("by_owner_slot", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("slot", args.slot),
      )
      .first();

    if (existing) {
      await ctx.storage.delete(existing.storageId);
      await ctx.db.delete(existing._id);
    }
  },
});
