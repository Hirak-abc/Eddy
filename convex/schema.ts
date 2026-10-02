import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
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
  }).index("by_clerk_id", ["clerkId"]),
});
