import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertServerSecret } from "./serverAuth";

const languageValidator = v.union(
  v.literal("HINDI"),
  v.literal("ENGLISH"),
  v.literal("HINGLISH"),
);

const kindValidator = v.union(v.literal("AUTOMATIC"), v.literal("CUSTOM"));

export const listByOwner = query({
  args: { ownerClerkId: v.string(), serverSecret: v.string() },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyers = await ctx.db
      .query("flyers")
      .withIndex("by_owner_created", (q) =>
        q.eq("ownerClerkId", args.ownerClerkId),
      )
      .order("desc")
      .collect();
    return flyers.map(({ couponCodeHash: _hash, ...flyer }) => ({
      ...flyer,
      id: flyer._id,
    }));
  },
});

export const getById = query({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) return null;
    const { couponCodeHash: _hash, ...safe } = flyer;
    return { ...safe, id: safe._id };
  },
});

export const createQueued = mutation({
  args: {
    ownerClerkId: v.string(),
    businessId: v.string(),
    businessName: v.string(),
    businessCategory: v.string(),
    businessLocation: v.string(),
    kind: kindValidator,
    title: v.string(),
    topic: v.string(),
    language: languageValidator,
    sourceImageUrl: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const now = new Date();
    const cooldownStart = new Date(
      now.getTime() - 72 * 60 * 60 * 1000,
    ).toISOString();
    const recentFlyers = await ctx.db
      .query("flyers")
      .withIndex("by_owner_created", (q) =>
        q.eq("ownerClerkId", args.ownerClerkId).gt("createdAt", cooldownStart),
      )
      .first();
    if (recentFlyers) {
      throw new Error("FLYER_GENERATION_COOLDOWN");
    }

    const nowIso = now.toISOString();
    const { serverSecret: _secret, ...flyerInput } = args;
    const id = await ctx.db.insert("flyers", {
      ...flyerInput,
      status: "QUEUED",
      hashtags: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    });
    return String(id);
  },
});

export const rescheduleScheduledFlyer = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    scheduledAt: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (
      !flyer ||
      flyer.ownerClerkId !== args.ownerClerkId ||
      flyer.status !== "SCHEDULED" ||
      !flyer.socialPostId
    ) {
      throw new Error("FLYER_NOT_RESCHEDULABLE");
    }
    if (Date.parse(args.scheduledAt) <= Date.now()) {
      throw new Error("FLYER_SCHEDULE_TIME_INVALID");
    }
    const post = await ctx.db.get(flyer.socialPostId as never);
    if (
      !post ||
      !("status" in post) ||
      post.status !== "PENDING" ||
      !("clerkUserId" in post) ||
      post.clerkUserId !== args.ownerClerkId ||
      !("flyerId" in post) ||
      post.flyerId !== String(flyer._id)
    ) {
      throw new Error("FLYER_NOT_RESCHEDULABLE");
    }
    const now = new Date().toISOString();
    await ctx.db.patch(post._id, { scheduledAt: args.scheduledAt, updatedAt: now });
    await ctx.db.patch(flyer._id, {
      scheduledAt: args.scheduledAt,
      updatedAt: now,
    });
    return { id: String(post._id), scheduledAt: args.scheduledAt };
  },
});

export const cancelScheduledFlyer = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (
      !flyer ||
      flyer.ownerClerkId !== args.ownerClerkId ||
      flyer.status !== "SCHEDULED" ||
      !flyer.socialPostId
    ) {
      throw new Error("FLYER_NOT_CANCELLABLE");
    }
    const post = await ctx.db.get(flyer.socialPostId as never);
    if (
      !post ||
      !("status" in post) ||
      post.status !== "PENDING" ||
      !("clerkUserId" in post) ||
      post.clerkUserId !== args.ownerClerkId ||
      !("flyerId" in post) ||
      post.flyerId !== String(flyer._id)
    ) {
      throw new Error("FLYER_NOT_CANCELLABLE");
    }
    const now = new Date().toISOString();
    await ctx.db.patch(post._id, { status: "CANCELLED", updatedAt: now });
    await ctx.db.patch(flyer._id, {
      status: "READY",
      scheduledAt: undefined,
      socialPostId: undefined,
      errorMessage: undefined,
      updatedAt: now,
    });
  },
});

export const claimQueued = mutation({
  args: { limit: v.optional(v.number()), serverSecret: v.string() },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const limit = Math.min(Math.max(args.limit ?? 5, 1), 20);
    const batch = await ctx.db
      .query("flyers")
      .withIndex("by_status_created", (q) => q.eq("status", "QUEUED"))
      .take(limit);
    const now = new Date().toISOString();
    for (const flyer of batch) {
      await ctx.db.patch(flyer._id, { status: "GENERATING", updatedAt: now });
    }
    return batch.map((flyer) => ({
      ...flyer,
      id: flyer._id,
      status: "GENERATING" as const,
    }));
  },
});

export const markGenerated = mutation({
  args: {
    id: v.id("flyers"),
    title: v.string(),
    topic: v.string(),
    imageUrl: v.string(),
    caption: v.string(),
    hashtags: v.array(v.string()),
    couponCodeHash: v.string(),
    couponDiscountPercent: v.number(),
    couponExpiresAt: v.string(),
    scheduledAt: v.optional(v.string()),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.status !== "GENERATING") {
      throw new Error("FLYER_NOT_GENERATING");
    }
    const duplicate = await ctx.db
      .query("flyers")
      .withIndex("by_coupon_hash", (q) =>
        q.eq("couponCodeHash", args.couponCodeHash),
      )
      .first();
    if (duplicate) throw new Error("COUPON_CODE_COLLISION");

    await ctx.db.patch(args.id, {
      imageUrl: args.imageUrl,
      title: args.title,
      topic: args.topic,
      caption: args.caption,
      hashtags: args.hashtags,
      couponCodeHash: args.couponCodeHash,
      couponDiscountPercent: args.couponDiscountPercent,
      couponExpiresAt: args.couponExpiresAt,
      scheduledAt: args.scheduledAt,
      couponRequestStatus: undefined,
      status: "READY",
      errorMessage: undefined,
      updatedAt: new Date().toISOString(),
    });
    return String(args.id);
  },
});

export const markFailed = mutation({
  args: {
    id: v.id("flyers"),
    errorMessage: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer) throw new Error("FLYER_NOT_FOUND");
    await ctx.db.patch(args.id, {
      status: "FAILED",
      errorMessage: args.errorMessage,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const setPublicationError = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    errorMessage: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) {
      throw new Error("FLYER_NOT_FOUND");
    }
    await ctx.db.patch(args.id, {
      errorMessage: args.errorMessage,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const markScheduled = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    scheduledAt: v.string(),
    socialPostId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) {
      throw new Error("FLYER_NOT_FOUND");
    }
    if (flyer.status !== "READY") throw new Error("FLYER_NOT_READY");
    await ctx.db.patch(args.id, {
      status: "SCHEDULED",
      scheduledAt: args.scheduledAt,
      socialPostId: args.socialPostId,
      errorMessage: undefined,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const markPublished = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) {
      throw new Error("FLYER_NOT_FOUND");
    }
    await ctx.db.patch(args.id, {
      status: "PUBLISHED",
      errorMessage: undefined,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const deleteFlyer = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) {
      throw new Error("FLYER_NOT_FOUND");
    }
    if (flyer.status !== "READY" && flyer.status !== "FAILED") {
      throw new Error("FLYER_NOT_DELETABLE");
    }
    await ctx.db.delete(args.id);
  },
});
