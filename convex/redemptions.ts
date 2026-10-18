import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { MutationCtx } from './_generated/server';
import { requireUser } from './auth';
import type { Id } from './_generated/dataModel';

const MIN_REDEMPTION_COINS = 50;
const MAX_REDEMPTION_COINS = 100;
const REQUEST_EXPIRY_MS = 24 * 60 * 60 * 1000;
const COIN_VALUE_PAISE = 100;

const releaseReservation = async (
  ctx: MutationCtx,
  redemption: {
    _id: Id<'redemptions'>;
    customerId: string;
    businessId: string;
    coinsCost: number;
  },
  status: 'REJECTED' | 'CANCELLED' | 'EXPIRED',
) => {
  const wallet = await ctx.db
    .query('wallets')
    .withIndex('by_customer', (q) => q.eq('customerId', redemption.customerId))
    .unique();
  if (!wallet || (wallet.reservedBalance ?? 0) < redemption.coinsCost) {
    throw new Error('WALLET_RESERVATION_INCONSISTENT');
  }

  const timestamp = new Date().toISOString();
  await ctx.db.patch(wallet._id, {
    balance: wallet.balance + redemption.coinsCost,
    reservedBalance: (wallet.reservedBalance ?? 0) - redemption.coinsCost,
    updatedAt: timestamp,
  });
  await ctx.db.patch(redemption._id, {
    status,
    reviewedAt: timestamp,
  });
  await ctx.db.insert('walletTransactions', {
    customerId: redemption.customerId,
    businessId: redemption.businessId,
    type: `REDEMPTION_${status}`,
    amount: redemption.coinsCost,
    redemptionId: String(redemption._id),
    createdAt: timestamp,
  });
};

export const requestRedemption = mutation({
  args: {
    businessId: v.id('businesses'),
    coinsCost: v.number(),
    idempotencyKey: v.string(),
  },
  handler: async (ctx, args) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const existing = await ctx.db
      .query('redemptions')
      .withIndex('by_customer_idempotency', (q) =>
        q.eq('customerId', customer.id).eq('idempotencyKey', args.idempotencyKey)
      )
      .unique();
    if (existing) {
      if (existing.businessId !== String(args.businessId) || existing.coinsCost !== args.coinsCost) {
        throw new Error('IDEMPOTENCY_KEY_REUSED');
      }
      return { redemptionId: existing._id, reference: existing.reference, status: existing.status };
    }

    if (
      !Number.isInteger(args.coinsCost) ||
      args.coinsCost < MIN_REDEMPTION_COINS ||
      args.coinsCost > MAX_REDEMPTION_COINS
    ) {
      throw new Error('INVALID_REDEMPTION_COST');
    }

    const business = await ctx.db.get(args.businessId);
    if (!business || !business.qrEnabled) {
      throw new Error('BUSINESS_NOT_FOUND');
    }
    const wallet = await ctx.db
      .query('wallets')
      .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
      .unique();
    if (!wallet || wallet.balance < args.coinsCost) {
      throw new Error('INSUFFICIENT_COINS');
    }

    const now = Date.now();
    const timestamp = new Date(now).toISOString();
    const reference = `ER-${globalThis.crypto.randomUUID()}`;
    const redemptionId = await ctx.db.insert('redemptions', {
      reference,
      customerId: customer.id,
      idempotencyKey: args.idempotencyKey,
      businessId: String(business._id),
      ownerId: business.ownerId,
      offerName: 'Coin redemption',
      coinsCost: args.coinsCost,
      settlementValuePaise: args.coinsCost * COIN_VALUE_PAISE,
      status: 'REQUESTED',
      requestedAt: timestamp,
      expiresAt: new Date(now + REQUEST_EXPIRY_MS).toISOString(),
    });

    await ctx.db.patch(wallet._id, {
      balance: wallet.balance - args.coinsCost,
      reservedBalance: (wallet.reservedBalance ?? 0) + args.coinsCost,
      updatedAt: timestamp,
    });
    await ctx.db.insert('walletTransactions', {
      customerId: customer.id,
      businessId: String(business._id),
      type: 'REDEMPTION_RESERVED',
      amount: -args.coinsCost,
      redemptionId: String(redemptionId),
      idempotencyKey: args.idempotencyKey,
      createdAt: timestamp,
    });

    return { redemptionId, reference, status: 'REQUESTED' as const };
  },
});

export const reviewRedemption = mutation({
  args: {
    redemptionId: v.id('redemptions'),
    decision: v.union(v.literal('APPROVED'), v.literal('REJECTED')),
  },
  handler: async (ctx, args) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const redemption = await ctx.db.get(args.redemptionId);
    if (!redemption) {
      throw new Error('REDEMPTION_NOT_FOUND');
    }
    const ownedBusinesses = owner.role === 'ADMIN'
      ? []
      : await ctx.db
        .query('businesses')
        .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
        .collect();
    if (
      owner.role !== 'ADMIN' &&
      !ownedBusinesses.some((business) => String(business._id) === redemption.businessId)
    ) {
      throw new Error('FORBIDDEN');
    }
    const settlementOwnerId = owner.role === 'ADMIN' ? redemption.ownerId : owner.id;
    if (redemption.status !== 'REQUESTED') {
      throw new Error('REDEMPTION_ALREADY_REVIEWED');
    }

    if (Date.parse(redemption.expiresAt) <= Date.now()) {
      await releaseReservation(ctx, redemption, 'EXPIRED');
      return { redemptionId: args.redemptionId, status: 'EXPIRED' as const };
    }

    if (args.decision === 'REJECTED') {
      await releaseReservation(ctx, redemption, 'REJECTED');
      return { redemptionId: args.redemptionId, status: 'REJECTED' as const };
    }

    const wallet = await ctx.db
      .query('wallets')
      .withIndex('by_customer', (q) => q.eq('customerId', redemption.customerId))
      .unique();
    if (!wallet || (wallet.reservedBalance ?? 0) < redemption.coinsCost) {
      throw new Error('WALLET_RESERVATION_INCONSISTENT');
    }

    const timestamp = new Date().toISOString();
    await ctx.db.patch(wallet._id, {
      reservedBalance: (wallet.reservedBalance ?? 0) - redemption.coinsCost,
      spentBalance: (wallet.spentBalance ?? 0) + redemption.coinsCost,
      updatedAt: timestamp,
    });
    await ctx.db.patch(redemption._id, {
      status: 'APPROVED',
      reviewedAt: timestamp,
      ownerId: settlementOwnerId,
    });
    await ctx.db.insert('walletTransactions', {
      customerId: redemption.customerId,
      businessId: redemption.businessId,
      type: 'REDEMPTION_APPROVED',
      amount: 0,
      redemptionId: String(redemption._id),
      createdAt: timestamp,
    });
    const ownerWallet = await ctx.db
      .query('ownerWallets')
      .withIndex('by_owner', (q) => q.eq('ownerId', settlementOwnerId))
      .unique();
    if (ownerWallet) {
      await ctx.db.patch(ownerWallet._id, {
        balancePaise: ownerWallet.balancePaise + redemption.settlementValuePaise,
        lifetimeCreditsPaise: ownerWallet.lifetimeCreditsPaise + redemption.settlementValuePaise,
        updatedAt: timestamp,
      });
    } else {
      await ctx.db.insert('ownerWallets', {
        ownerId: settlementOwnerId,
        balancePaise: redemption.settlementValuePaise,
        lifetimeCreditsPaise: redemption.settlementValuePaise,
        updatedAt: timestamp,
      });
    }
    await ctx.db.insert('ownerWalletTransactions', {
      ownerId: settlementOwnerId,
      redemptionId: String(redemption._id),
      reference: redemption.reference,
      amountPaise: redemption.settlementValuePaise,
      type: 'COIN_REDEMPTION_CREDIT',
      createdAt: timestamp,
    });

    return { redemptionId: args.redemptionId, status: 'APPROVED' as const };
  },
});

export const cancelRedemption = mutation({
  args: { redemptionId: v.id('redemptions') },
  handler: async (ctx, args) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const redemption = await ctx.db.get(args.redemptionId);
    if (!redemption || redemption.customerId !== customer.id) {
      throw new Error('REDEMPTION_NOT_FOUND');
    }
    if (redemption.status !== 'REQUESTED') {
      throw new Error('REDEMPTION_CANNOT_BE_CANCELLED');
    }

    await releaseReservation(ctx, redemption, 'CANCELLED');
    return { redemptionId: args.redemptionId, status: 'CANCELLED' as const };
  },
});

export const listCustomerRedemptions = query({
  args: {},
  handler: async (ctx) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    return await ctx.db
      .query('redemptions')
      .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
      .order('desc')
      .take(100);
  },
});

export const listOwnerRedemptions = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    if (owner.role === 'ADMIN') {
      return await ctx.db
        .query('redemptions')
        .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
        .order('desc')
        .take(100);
    }

    const businesses = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .collect();
    const redemptionsByBusiness = await Promise.all(
      businesses.map((business) =>
        ctx.db
          .query('redemptions')
          .withIndex('by_business', (q) => q.eq('businessId', String(business._id)))
          .order('desc')
          .take(100)
      ),
    );

    return redemptionsByBusiness
      .flat()
      .sort((left, right) => Date.parse(right.requestedAt) - Date.parse(left.requestedAt))
      .slice(0, 100);
  },
});

export const expirePendingRedemptions = mutation({
  args: {},
  handler: async (ctx) => {
    await requireUser(ctx, ['CUSTOMER', 'OWNER', 'ADMIN']);
    const timestamp = new Date().toISOString();
    const expired = await ctx.db
      .query('redemptions')
      .withIndex('by_status_expiry', (q) =>
        q.eq('status', 'REQUESTED').lt('expiresAt', timestamp)
      )
      .take(100);

    for (const redemption of expired) {
      await releaseReservation(ctx, redemption, 'EXPIRED');
    }
    return expired.length;
  },
});
