
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
});
