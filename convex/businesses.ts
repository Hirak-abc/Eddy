import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireUser } from './auth';
import { shuffleRewardPool } from './rewardPool';

export const createOwnedBusiness = mutation({
  args: {
    name: v.string(),
    category: v.string(),
    address: v.string(),
    qrToken: v.string(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const existing = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();

    if (existing) {
      throw new Error('BUSINESS_ALREADY_EXISTS');
    }

    const businessId = await ctx.db.insert('businesses', {
      ownerId: owner.id,
      name: args.name,
      category: args.category,
      address: args.address,
      qrToken: args.qrToken,
      qrEnabled: true,
      verificationStatus: 'VERIFIED',
      rewardCycleNumber: 1,
      rewardSlots: shuffleRewardPool(),
      rewardSlotIndex: 0,
      createdAt: args.timestamp,
      updatedAt: args.timestamp,
    });

    const business = await ctx.db.get(businessId);
    if (!business) {
      throw new Error('BUSINESS_CREATE_FAILED');
    }
    return business;
  },
});

export const activateLegacyOwnedQr = mutation({
  args: { timestamp: v.string() },
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();
    if (!business) {
      throw new Error('BUSINESS_NOT_FOUND');
    }
    if (business.verificationStatus === 'VERIFIED' || business.qrEnabled) {
      return business;
    }

    await ctx.db.patch(business._id, {
      qrEnabled: true,
      verificationStatus: 'VERIFIED',
      updatedAt: args.timestamp,
    });
    return {
      ...business,
      qrEnabled: true,
      verificationStatus: 'VERIFIED' as const,
      updatedAt: args.timestamp,
    };
  },
});

export const getOwnedBusiness = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    return await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();
  },
});

export const disableOwnedQr = mutation({
  args: { timestamp: v.string() },
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();
    if (!business) {
      throw new Error('BUSINESS_NOT_FOUND');
    }
    await ctx.db.patch(business._id, {
      qrEnabled: false,
      updatedAt: args.timestamp,
    });
    return { businessId: business._id, qrEnabled: false };
  },
});

export const resolveQr = query({
  args: { qrToken: v.string() },
  handler: async (ctx, args) => {
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_qr_token', (q) => q.eq('qrToken', args.qrToken))
      .unique();

    if (!business || !business.qrEnabled) {
      return null;
    }

    return {
      businessId: business._id,
      name: business.name,
      category: business.category,
      address: business.address,
    };
  },
});

export const createOffer = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    coinsCost: v.number(),
    settlementValuePaise: v.number(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();

    if (!business || !business.qrEnabled) {
      throw new Error('BUSINESS_NOT_FOUND');
    }
    if (!Number.isInteger(args.coinsCost) || args.coinsCost < 50 || args.coinsCost > 100) {
      throw new Error('INVALID_REDEMPTION_COST');
    }
    if (!Number.isInteger(args.settlementValuePaise) || args.settlementValuePaise <= 0) {
      throw new Error('INVALID_SETTLEMENT_VALUE');
    }

    const offerId = await ctx.db.insert('redeemableOffers', {
      businessId: business._id,
      ownerId: owner.id,
      name: args.name,
      description: args.description,
      coinsCost: args.coinsCost,
      settlementValuePaise: args.settlementValuePaise,
      active: true,
      createdAt: args.timestamp,
      updatedAt: args.timestamp,
    });

    return { offerId };
  },
});

export const listBusinessOffers = query({
  args: { businessId: v.string() },
  handler: async (ctx, args) => {
    await requireUser(ctx, ['CUSTOMER', 'OWNER', 'ADMIN']);
    const offers = await ctx.db
      .query('redeemableOffers')
      .withIndex('by_business', (q) => q.eq('businessId', args.businessId))
      .collect();
    return offers.filter((offer) => offer.active);
  },
});

export const listActiveBusinesses = query({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx, ['CUSTOMER']);
    const businesses = await ctx.db.query('businesses').collect();
    return businesses
      .filter((business) => business.qrEnabled)
      .map((business) => ({
        businessId: business._id,
        name: business.name,
        category: business.category,
        address: business.address,
      }));
  },
});

export const listOwnedOffers = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();
    if (!business) {
      return [];
    }
    return await ctx.db
      .query('redeemableOffers')
      .withIndex('by_business', (q) => q.eq('businessId', business._id))
      .collect();
  },
});
