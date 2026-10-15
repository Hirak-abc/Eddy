
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.optional(v.string()),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),

    role: v.union(
      v.literal("OWNER"),
      v.literal("CUSTOMER"),
      v.literal("ADMIN"),
    ),

    status: v.optional(
      v.union(
        v.literal("ACTIVE"),
        v.literal("PENDING"),
        v.literal("INACTIVE"),
        v.literal("SUSPENDED"),
        v.literal("DELETED"),
      ),
    ),

    createdAt: v.union(v.string(), v.number()),
    updatedAt: v.union(v.string(), v.number()),
  }).index("by_clerk_id", ["clerkId"]),

  qrScans: defineTable({
    customerId: v.string(),
    businessId: v.string(),
    scannedAt: v.string(),
    dateString: v.string(), // YYYY-MM-DD for daily limit counting
  }).index("by_customer_date", ["customerId", "dateString"]),

  socialAccounts: defineTable({
    clerkUserId: v.string(),
    businessId: v.optional(v.string()),
    platform: v.union(v.literal("FACEBOOK_PAGE"), v.literal("INSTAGRAM")),
    externalId: v.string(),
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    encryptedAccessToken: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
    autoPublish: v.boolean(),
    status: v.union(v.literal("ACTIVE"), v.literal("DISCONNECTED")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_clerk_id", ["clerkUserId"])
    .index("by_external_id", ["externalId"])
    .index("by_clerk_external", ["clerkUserId", "externalId"]),

  socialPosts: defineTable({
    clerkUserId: v.string(),
    accountIds: v.array(v.string()),
    imageUrl: v.string(),
    caption: v.optional(v.string()),
    mode: v.union(v.literal("NOW"), v.literal("SCHEDULED")),
    scheduledAt: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PUBLISHING"),
      v.literal("PUBLISHED"),
      v.literal("FAILED"),
      v.literal("CANCELLED"),
    ),
    externalResults: v.optional(
      v.array(
        v.object({
          accountId: v.string(),
          platform: v.union(
            v.literal("FACEBOOK_PAGE"),
            v.literal("INSTAGRAM"),
          ),
          postId: v.optional(v.string()),
          error: v.optional(v.string()),
        }),
      ),
    ),
    errorCode: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_status_scheduledAt", ["status", "scheduledAt"]),
});
