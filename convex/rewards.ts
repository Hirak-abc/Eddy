import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireUser } from './auth';
import { shuffleRewardPool } from './rewardPool';
import type { Id } from './_generated/dataModel';

const MAX_CUSTOMER_BALANCE_COINS = 100;

export const recordSpin = mutation({
  args: {
    scanId: v.id('qrScans'),
  },
  handler: async (ctx, args) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const scan = await ctx.db.get(args.scanId);

    if (!scan || scan.customerId !== customer.id) {
      throw new Error('INVALID_SCAN');
    }

    const previousSpin = await ctx.db
      .query('spins')
      .withIndex('by_scan', (q) => q.eq('scanId', args.scanId))
      .unique();

    if (previousSpin) {
      const wallet = await ctx.db
        .query('wallets')
        .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
        .unique();
      return {
        spinId: previousSpin._id,
        rewardType: previousSpin.rewardType,
        rewardValue: previousSpin.rewardValue,
        coinsAwarded: previousSpin.coinsAwarded,
        coinsCredited: previousSpin.coinsCredited ?? previousSpin.coinsAwarded,
        coinsOverflow: previousSpin.coinsOverflow ?? 0,
        walletBalance: wallet?.balance ?? 0,
        cycleNumber: previousSpin.cycleNumber ?? 0,
        slotIndex: previousSpin.slotIndex ?? 0,
        idempotentReplay: true,
      };
    }

    const business = await ctx.db.get(scan.businessId as Id<'businesses'>);
    if (!business || !business.qrEnabled) {
      throw new Error('INVALID_QR');
    }

    let cycleNumber = business.rewardCycleNumber;
    let rewardSlots = business.rewardSlots;
    let slotIndex = business.rewardSlotIndex;

    if (slotIndex >= rewardSlots.length) {
      cycleNumber += 1;
      rewardSlots = shuffleRewardPool();
      slotIndex = 0;
    }

    const coinsAwarded = rewardSlots[slotIndex];
    const wallet = await ctx.db
      .query('wallets')
      .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
      .unique();
    const reservedBalance = wallet?.reservedBalance ?? 0;
    const currentBalance = wallet?.balance ?? 0;
    const availableCapacity = Math.max(
      0,
      MAX_CUSTOMER_BALANCE_COINS - currentBalance - reservedBalance,
    );
    const coinsCredited = Math.min(coinsAwarded, availableCapacity);
    const coinsOverflow = coinsAwarded - coinsCredited;
    const timestamp = new Date().toISOString();

    const spinId = await ctx.db.insert('spins', {
      customerId: customer.id,
      businessId: scan.businessId,
      scanId: args.scanId,
      idempotencyKey: String(args.scanId),
      rewardType: 'COINS',
      rewardValue: String(coinsAwarded),
      coinsAwarded,
      coinsCredited,
      coinsOverflow,
      cycleNumber,
      slotIndex,
      timestamp,
    });

    await ctx.db.patch(business._id, {
      rewardCycleNumber: cycleNumber,
      rewardSlots,
      rewardSlotIndex: slotIndex + 1,
      updatedAt: timestamp,
    });

    if (coinsCredited > 0) {
      const nextBalance = currentBalance + coinsCredited;
      if (wallet) {
        await ctx.db.patch(wallet._id, {
          balance: nextBalance,
          updatedAt: timestamp,
        });
      } else {
        await ctx.db.insert('wallets', {
          customerId: customer.id,
          balance: nextBalance,
          reservedBalance: 0,
          spentBalance: 0,
          updatedAt: timestamp,
        });
      }

      await ctx.db.insert('walletTransactions', {
        customerId: customer.id,
        businessId: scan.businessId,
        type: 'QR_SPIN_REWARD',
        amount: coinsCredited,
        scanId: String(args.scanId),
        idempotencyKey: String(args.scanId),
        createdAt: timestamp,
      });
    }

    return {
      spinId,
      rewardType: 'COINS',
      rewardValue: String(coinsAwarded),
      coinsAwarded,
      coinsCredited,
      coinsOverflow,
      walletBalance: currentBalance + coinsCredited,
      cycleNumber,
      slotIndex,
      idempotentReplay: false,
    };
  },
});

export const getStreak = query({
  args: {},
  handler: async (ctx) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const streakRecord = await ctx.db
      .query('streaks')
      .withIndex('by_customer', (q) => q.eq('customerId', customer.id))
      .unique();

    if (!streakRecord) {
      return { currentStreak: 0, bonusCoinsEarned: 0, lastActiveDate: null };
    }
    return streakRecord;
  },
});
