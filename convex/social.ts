import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const platformValidator = v.union(
  v.literal("FACEBOOK_PAGE"),
  v.literal("INSTAGRAM"),
);

const postStatusValidator = v.union(
  v.literal("PENDING"),
  v.literal("PUBLISHING"),
  v.literal("PUBLISHED"),
  v.literal("FAILED"),
  v.literal("CANCELLED"),
);

export const listAccountsByClerkId = query({
  args: { clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const accounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();

    const active = accounts.filter((account) => account.status === "ACTIVE");
    const facebookPages = active.filter(
      (account) => account.platform === "FACEBOOK_PAGE",
    );
    const selectedFacebookPage =
      facebookPages.find((account) => account.isSelected) ?? facebookPages[0];

    return active.map(({ encryptedAccessToken: _token, ...safe }) => ({
      ...safe,
      isSelected:
        safe.platform === "FACEBOOK_PAGE" &&
        safe._id === selectedFacebookPage?._id,
      id: safe._id,
    }));
  },
});

export const getAccountById = query({
  args: { id: v.id("socialAccounts") },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.id);
    if (!account) return null;
    return { ...account, id: account._id };
  },
});

export const getAccountsByIds = query({
  args: { ids: v.array(v.string()) },
  handler: async (ctx, args) => {
    const accounts = [];
    for (const id of args.ids) {
      try {
        const account = await ctx.db.get(id as never);
        if (account && "clerkUserId" in account) {
          accounts.push({ ...account, id: account._id });
        }
      } catch {
        // Skip malformed ids.
      }
    }
    return accounts;
  },
});

export const upsertAccount = mutation({
  args: {
    clerkUserId: v.string(),
    businessId: v.optional(v.string()),
    platform: platformValidator,
    externalId: v.string(),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    encryptedAccessToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
    autoPublish: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("ACTIVE"), v.literal("DISCONNECTED"))),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("socialAccounts")
      .withIndex("by_clerk_external", (q) =>
        q.eq("clerkUserId", args.clerkUserId).eq("externalId", args.externalId),
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        platform: args.platform,
        businessId: args.businessId ?? existing.businessId,
        name: args.name ?? existing.name,
        username: args.username ?? existing.username,
        encryptedAccessToken:
          args.encryptedAccessToken ?? existing.encryptedAccessToken,
        tokenExpiresAt: args.tokenExpiresAt ?? existing.tokenExpiresAt,
        autoPublish: args.autoPublish ?? existing.autoPublish,
        status: args.status ?? "ACTIVE",
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("socialAccounts", {
      clerkUserId: args.clerkUserId,
      businessId: args.businessId,
      platform: args.platform,
      externalId: args.externalId,
      name: args.name,
      username: args.username,
      encryptedAccessToken: args.encryptedAccessToken,
      tokenExpiresAt: args.tokenExpiresAt,
      autoPublish: args.autoPublish ?? true,
      status: args.status ?? "ACTIVE",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateAccount = mutation({
  args: {
    id: v.id("socialAccounts"),
    clerkUserId: v.string(),
    autoPublish: v.optional(v.boolean()),
    status: v.optional(v.union(v.literal("ACTIVE"), v.literal("DISCONNECTED"))),
    encryptedAccessToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const account = await ctx.db.get(args.id);
    if (!account || account.clerkUserId !== args.clerkUserId) {
      throw new Error("SOCIAL_ACCOUNT_NOT_FOUND");
    }
    await ctx.db.patch(args.id, {
      ...(args.autoPublish !== undefined
        ? { autoPublish: args.autoPublish }
        : {}),
      ...(args.status !== undefined ? { status: args.status } : {}),
      ...(args.encryptedAccessToken !== undefined
        ? { encryptedAccessToken: args.encryptedAccessToken }
        : {}),
      updatedAt: new Date().toISOString(),
    });
    return args.id;
  },
});

export const selectFacebookAccount = mutation({
  args: {
    id: v.id("socialAccounts"),
    clerkUserId: v.string(),
  },
  handler: async (ctx, args) => {
    const target = await ctx.db.get(args.id);
    if (
      !target ||
      target.clerkUserId !== args.clerkUserId ||
      target.platform !== "FACEBOOK_PAGE" ||
      target.status !== "ACTIVE"
    ) {
      throw new Error("SOCIAL_ACCOUNT_NOT_FOUND");
    }

    const accounts = await ctx.db
      .query("socialAccounts")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUserId", args.clerkUserId))
      .collect();
    const now = new Date().toISOString();
    for (const account of accounts) {
      if (account.platform === "FACEBOOK_PAGE") {
        await ctx.db.patch(account._id, {
          isSelected: account._id === args.id,
          updatedAt: now,
        });
      }
    }
    return args.id;
  },
});

export const createPost = mutation({
  args: {
    clerkUserId: v.string(),
    flyerId: v.optional(v.string()),
    accountIds: v.array(v.string()),
    imageUrl: v.string(),
    caption: v.optional(v.string()),
    mode: v.union(v.literal("NOW"), v.literal("SCHEDULED")),
    scheduledAt: v.string(),
    status: v.optional(postStatusValidator),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("socialPosts", {
      clerkUserId: args.clerkUserId,
      flyerId: args.flyerId,
      accountIds: args.accountIds,
      imageUrl: args.imageUrl,
      caption: args.caption,
      mode: args.mode,
      scheduledAt: args.scheduledAt,
      status: args.status ?? "PENDING",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const getPostById = query({
  args: { id: v.id("socialPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;
    return { ...post, id: post._id };
  },
});

export const claimDuePosts = mutation({
  args: { nowIso: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const pending = await ctx.db
      .query("socialPosts")
      .withIndex("by_status_scheduledAt", (q) => q.eq("status", "PENDING"))
      .collect();

    const due = pending
      .filter((post) => post.scheduledAt <= args.nowIso)
      .slice(0, limit);

    const now = new Date().toISOString();
    const claimed = [];
    for (const post of due) {
      await ctx.db.patch(post._id, { status: "PUBLISHING", updatedAt: now });
      claimed.push({ ...post, id: post._id, status: "PUBLISHING" as const });
    }
    return claimed;
  },
});

export const markPostResult = mutation({
  args: {
    id: v.id("socialPosts"),
    status: postStatusValidator,
    externalResults: v.optional(
      v.array(
        v.object({
          accountId: v.string(),
          platform: platformValidator,
          postId: v.optional(v.string()),
          error: v.optional(v.string()),
        }),
      ),
    ),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new Error("SOCIAL_POST_NOT_FOUND");
    }
    await ctx.db.patch(args.id, {
      status: args.status,
      externalResults: args.externalResults,
      errorCode: args.errorCode,
      errorMessage: args.errorMessage,
      updatedAt: new Date().toISOString(),
    });
    return args.id;
  },
});

export const cancelPost = mutation({
  args: { id: v.id("socialPosts"), clerkUserId: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post || post.clerkUserId !== args.clerkUserId) {
      throw new Error("SOCIAL_POST_NOT_FOUND");
    }
    if (post.status !== "PENDING") {
      throw new Error("SOCIAL_POST_NOT_CANCELLABLE");
    }
    await ctx.db.patch(args.id, {
      status: "CANCELLED",
      updatedAt: new Date().toISOString(),
    });
    return args.id;
  },
});
