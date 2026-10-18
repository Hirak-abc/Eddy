import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertServerSecret } from "./serverAuth";

export const claimCode = mutation({
  args: {
    codeHash: v.string(),
    customerClerkId: v.string(),
    customerName: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db
      .query("flyers")
      .withIndex("by_coupon_hash", (q) => q.eq("couponCodeHash", args.codeHash))
      .first();
    if (!flyer || !flyer.couponDiscountPercent || !flyer.couponExpiresAt) {
      throw new Error("COUPON_CODE_INVALID");
    }
    if (Date.parse(flyer.couponExpiresAt) <= Date.now()) {
      throw new Error("COUPON_EXPIRED");
    }
    if (flyer.couponClaimedBy) throw new Error("COUPON_ALREADY_CLAIMED");

    const now = new Date().toISOString();
    await ctx.db.patch(flyer._id, {
      couponClaimedBy: args.customerClerkId,
      couponClaimedByName: args.customerName,
      couponClaimedAt: now,
      couponRequestStatus: "CLAIMED",
      updatedAt: now,
    });
    return {
      id: flyer._id,
      businessId: flyer.businessId,
      businessName: flyer.businessName,
      title: flyer.title,
      discountPercent: flyer.couponDiscountPercent,
      expiresAt: flyer.couponExpiresAt,
      status: "CLAIMED" as const,
    };
  },
});

export const listMine = query({
  args: { customerClerkId: v.string(), serverSecret: v.string() },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyers = await ctx.db
      .query("flyers")
      .withIndex("by_claimed_customer", (q) =>
        q.eq("couponClaimedBy", args.customerClerkId),
      )
      .collect();
    return flyers
      .filter(
        (flyer) =>
          flyer.couponRequestStatus !== "APPROVED" &&
          (flyer.couponExpiresAt
            ? Date.parse(flyer.couponExpiresAt) > Date.now()
            : false),
      )
      .map((flyer) => ({
        id: flyer._id,
        businessId: flyer.businessId,
        businessName: flyer.businessName,
        title: flyer.title,
        discountPercent: flyer.couponDiscountPercent,
        expiresAt: flyer.couponExpiresAt,
        status: flyer.couponRequestStatus,
      }));
  },
});

export const requestUse = mutation({
  args: {
    id: v.id("flyers"),
    customerClerkId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.couponClaimedBy !== args.customerClerkId) {
      throw new Error("CUSTOMER_COUPON_NOT_FOUND");
    }
    if (flyer.couponExpiresAt && Date.parse(flyer.couponExpiresAt) <= Date.now()) {
      throw new Error("COUPON_EXPIRED");
    }
    if (
      flyer.couponRequestStatus !== "CLAIMED" &&
      flyer.couponRequestStatus !== "REJECTED"
    ) {
      throw new Error("COUPON_REQUEST_NOT_ALLOWED");
    }
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      couponRequestStatus: "REQUESTED",
      couponRequestedAt: now,
      updatedAt: now,
    });
    return { id: args.id, status: "REQUESTED" as const };
  },
});

export const listOwnerRequests = query({
  args: { ownerClerkId: v.string(), serverSecret: v.string() },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyers = await ctx.db
      .query("flyers")
      .withIndex("by_owner_created", (q) =>
        q.eq("ownerClerkId", args.ownerClerkId),
      )
      .collect();
    return flyers
      .filter((flyer) => flyer.couponRequestStatus === "REQUESTED")
      .map((flyer) => ({
        id: flyer._id,
        businessId: flyer.businessId,
        businessName: flyer.businessName,
        title: flyer.title,
        customerClerkId: flyer.couponClaimedBy,
        customerName: flyer.couponClaimedByName,
        discountPercent: flyer.couponDiscountPercent,
        requestedAt: flyer.couponRequestedAt,
      }));
  },
});

export const approveRequest = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    billAmount: v.number(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) {
      throw new Error("OWNER_COUPON_REQUEST_NOT_FOUND");
    }
    if (
      flyer.couponRequestStatus !== "REQUESTED" ||
      !flyer.couponClaimedBy ||
      !flyer.couponDiscountPercent
    ) {
      throw new Error("COUPON_REQUEST_NOT_PENDING");
    }
    if (!Number.isFinite(args.billAmount) || args.billAmount <= 0) {
      throw new Error("INVALID_BILL_AMOUNT");
    }
    const discountAmount =
      Math.round(
        args.billAmount * (flyer.couponDiscountPercent / 100) * 100,
      ) / 100;
    const now = new Date().toISOString();
    await ctx.db.patch(args.id, {
      couponRequestStatus: "APPROVED",
      couponBillAmount: args.billAmount,
      couponDiscountAmount: discountAmount,
      updatedAt: now,
    });
    await ctx.db.insert("couponTransactions", {
      ownerClerkId: args.ownerClerkId,
      customerClerkId: flyer.couponClaimedBy,
      flyerId: args.id,
      billAmount: args.billAmount,
      discountPercent: flyer.couponDiscountPercent,
      discountAmount,
      createdAt: now,
    });
    return {
      id: args.id,
      discountAmount,
      discountPercent: flyer.couponDiscountPercent,
    };
  },
});

export const rejectRequest = mutation({
  args: {
    id: v.id("flyers"),
    ownerClerkId: v.string(),
    serverSecret: v.string(),
  },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const flyer = await ctx.db.get(args.id);
    if (!flyer || flyer.ownerClerkId !== args.ownerClerkId) {
      throw new Error("OWNER_COUPON_REQUEST_NOT_FOUND");
    }
    if (flyer.couponRequestStatus !== "REQUESTED") {
      throw new Error("COUPON_REQUEST_NOT_PENDING");
    }
    await ctx.db.patch(args.id, {
      couponRequestStatus: "REJECTED",
      updatedAt: new Date().toISOString(),
    });
    return { id: args.id, status: "REJECTED" as const };
  },
});

export const ownerBalance = query({
  args: { ownerClerkId: v.string(), serverSecret: v.string() },
  handler: async (ctx, args) => {
    assertServerSecret(args.serverSecret);
    const transactions = await ctx.db
      .query("couponTransactions")
      .withIndex("by_owner", (q) => q.eq("ownerClerkId", args.ownerClerkId))
      .collect();
    return {
      balance: transactions.reduce(
        (total, transaction) => total + transaction.discountAmount,
        0,
      ),
      transactions: transactions.map((transaction) => ({
        ...transaction,
        id: transaction._id,
      })),
    };
  },
});
