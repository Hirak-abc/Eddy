
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

  businesses: defineTable({
    ownerId: v.string(),
    name: v.string(),
    category: v.string(),
    address: v.string(),
    qrToken: v.string(),
    qrEnabled: v.boolean(),
    // Retained to read existing records; QR access is controlled only by qrEnabled.
    verificationStatus: v.union(
      v.literal("PENDING"),
      v.literal("VERIFIED"),
      v.literal("REJECTED"),
    ),
    rewardCycleNumber: v.number(),
    rewardSlots: v.array(v.number()),
    rewardSlotIndex: v.number(),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_qr_token", ["qrToken"]),

  redeemableOffers: defineTable({
    businessId: v.string(),
    ownerId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    coinsCost: v.number(),
    settlementValuePaise: v.number(),
    active: v.boolean(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_business", ["businessId"]),

  qrScans: defineTable({
    customerId: v.string(),
    businessId: v.string(),
    scannedAt: v.string(),
    dateString: v.string(), // YYYY-MM-DD for daily limit counting
  })
    .index("by_customer_date", ["customerId", "dateString"])
    .index("by_business", ["businessId"]),

  wallets: defineTable({
    customerId: v.string(),
    balance: v.number(),
    reservedBalance: v.optional(v.number()),
    spentBalance: v.optional(v.number()),
    updatedAt: v.string(),
  }).index("by_customer", ["customerId"]),

  ownerWallets: defineTable({
    ownerId: v.string(),
    balancePaise: v.number(),
    lifetimeCreditsPaise: v.number(),
    updatedAt: v.string(),
  }).index("by_owner", ["ownerId"]),

  ownerWalletTransactions: defineTable({
    ownerId: v.string(),
    redemptionId: v.string(),
    reference: v.string(),
    amountPaise: v.number(),
    type: v.string(),
    createdAt: v.string(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_redemption", ["redemptionId"]),

  walletTransactions: defineTable({
    customerId: v.string(),
    businessId: v.string(),
    type: v.string(),
    amount: v.number(),
    scanId: v.optional(v.string()),
    redemptionId: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_customer", ["customerId"])
    .index("by_scan", ["scanId"])
    .index("by_redemption", ["redemptionId"]),

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
    flyerId: v.optional(v.string()),
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

  businessImages: defineTable({
    clerkUserId: v.string(),
    slot: v.union(
      v.literal("shop"),
      v.literal("product"),
      v.literal("item"),
    ),
    storageId: v.id("_storage"),
    uploadedAt: v.string(),
  }).index("by_owner_slot", ["clerkUserId", "slot"]),

  flyers: defineTable({
    ownerClerkId: v.string(),
    businessId: v.string(),
    businessName: v.string(),
    businessCategory: v.string(),
    businessLocation: v.string(),
    kind: v.union(v.literal("AUTOMATIC"), v.literal("CUSTOM")),
    status: v.union(
      v.literal("QUEUED"),
      v.literal("GENERATING"),
      v.literal("READY"),
      v.literal("SCHEDULED"),
      v.literal("PUBLISHED"),
      v.literal("FAILED"),
    ),
    title: v.string(),
    topic: v.string(),
    language: v.union(
      v.literal("HINDI"),
      v.literal("ENGLISH"),
      v.literal("HINGLISH"),
    ),
    sourceImageUrl: v.string(),
    imageUrl: v.optional(v.string()),
    caption: v.optional(v.string()),
    hashtags: v.array(v.string()),
    couponCodeHash: v.optional(v.string()),
    couponDiscountPercent: v.optional(v.number()),
    couponExpiresAt: v.optional(v.string()),
    couponClaimedBy: v.optional(v.string()),
    couponClaimedByName: v.optional(v.string()),
    couponClaimedAt: v.optional(v.string()),
    couponRequestStatus: v.optional(
      v.union(
        v.literal("CLAIMED"),
        v.literal("REQUESTED"),
        v.literal("REJECTED"),
        v.literal("APPROVED"),
      ),
    ),
    couponRequestedAt: v.optional(v.string()),
    couponBillAmount: v.optional(v.number()),
    couponDiscountAmount: v.optional(v.number()),
    scheduledAt: v.optional(v.string()),
    socialPostId: v.optional(v.string()),
    errorMessage: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_owner_created", ["ownerClerkId", "createdAt"])
    .index("by_status_created", ["status", "createdAt"])
    .index("by_coupon_hash", ["couponCodeHash"])
    .index("by_claimed_customer", ["couponClaimedBy"]),

  couponTransactions: defineTable({
    ownerClerkId: v.string(),
    customerClerkId: v.string(),
    flyerId: v.id("flyers"),
    billAmount: v.number(),
    discountPercent: v.number(),
    discountAmount: v.number(),
    createdAt: v.string(),
  })
    .index("by_owner", ["ownerClerkId"])
    .index("by_customer", ["customerClerkId"]),
  spins: defineTable({
    customerId: v.string(),
    businessId: v.string(),
    scanId: v.optional(v.string()),
    idempotencyKey: v.optional(v.string()),
    rewardType: v.string(),
    rewardValue: v.string(),
    coinsAwarded: v.number(),
    coinsCredited: v.optional(v.number()),
    coinsOverflow: v.optional(v.number()),
    cycleNumber: v.optional(v.number()),
    slotIndex: v.optional(v.number()),
    timestamp: v.string(),
  })
    .index("by_customer", ["customerId"])
    .index("by_scan", ["scanId"])
    .index("by_idempotency", ["customerId", "idempotencyKey"]),

  redemptions: defineTable({
    reference: v.string(),
    customerId: v.string(),
    idempotencyKey: v.string(),
    businessId: v.string(),
    ownerId: v.string(),
    offerId: v.optional(v.string()),
    offerName: v.string(),
    coinsCost: v.number(),
    settlementValuePaise: v.number(),
    status: v.union(
      v.literal("REQUESTED"),
      v.literal("APPROVED"),
      v.literal("REJECTED"),
      v.literal("EXPIRED"),
      v.literal("CANCELLED"),
      v.literal("REFUNDED"),
      v.literal("DISPUTED"),
    ),
    requestedAt: v.string(),
    reviewedAt: v.optional(v.string()),
    expiresAt: v.string(),
  })
    .index("by_customer", ["customerId"])
    .index("by_customer_idempotency", ["customerId", "idempotencyKey"])
    .index("by_owner", ["ownerId"])
    .index("by_business", ["businessId"])
    .index("by_offer", ["offerId"])
    .index("by_status_expiry", ["status", "expiresAt"]),

  ownerReceivables: defineTable({
    redemptionId: v.string(),
    reference: v.string(),
    ownerId: v.string(),
    businessId: v.string(),
    customerId: v.string(),
    amountPaise: v.number(),
    eligibleAt: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("ELIGIBLE"),
      v.literal("PROCESSING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REVERSED"),
    ),
    createdAt: v.string(),
    updatedAt: v.string(),
    paidAt: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_redemption", ["redemptionId"])
    .index("by_status_eligible", ["status", "eligibleAt"]),

  settlementBatches: defineTable({
    reference: v.string(),
    ownerId: v.string(),
    status: v.union(
      v.literal("PENDING"),
      v.literal("PROCESSING"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REVERSED"),
    ),
    totalPaise: v.number(),
    redemptionIds: v.array(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    paidAt: v.optional(v.string()),
    paymentReference: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_reference", ["reference"]),

  settlementLedger: defineTable({
    batchId: v.string(),
    ownerId: v.string(),
    redemptionId: v.string(),
    amountPaise: v.number(),
    event: v.union(
      v.literal("ALLOCATED"),
      v.literal("PAID"),
      v.literal("FAILED"),
      v.literal("REVERSED"),
    ),
    createdAt: v.string(),
  })
    .index("by_redemption", ["redemptionId"])
    .index("by_batch", ["batchId"]),

  settlementAudit: defineTable({
    batchId: v.string(),
    actorId: v.string(),
    event: v.string(),
    note: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_batch", ["batchId"]),

  streaks: defineTable({
    customerId: v.string(),
    currentStreak: v.number(),
    bonusCoinsEarned: v.number(),
    lastActiveDate: v.union(v.string(), v.null()),
  }).index("by_customer", ["customerId"]),
});
