import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireUser } from './auth';
import type { Id } from './_generated/dataModel';

export const getOwnerSettlementSummary = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const receivables = await ctx.db
      .query('ownerReceivables')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .collect();
    const batches = await ctx.db
      .query('settlementBatches')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .order('desc')
      .take(100);
    const now = Date.now();
    const approvedTotalPaise = receivables.reduce((sum, receivable) =>
      receivable.status === 'REVERSED' ? sum : sum + receivable.amountPaise, 0);
    const pendingPaise = receivables.reduce((sum, receivable) =>
      receivable.status === 'PENDING' || receivable.status === 'ELIGIBLE'
        ? sum + receivable.amountPaise : sum, 0);
    const eligiblePaise = receivables.reduce((sum, receivable) =>
      (receivable.status === 'PENDING' || receivable.status === 'ELIGIBLE')
        && Date.parse(receivable.eligibleAt) <= now
        ? sum + receivable.amountPaise : sum, 0);
    const processingPaise = receivables.reduce((sum, receivable) =>
      receivable.status === 'PROCESSING' ? sum + receivable.amountPaise : sum, 0);
    const paidPaise = receivables.reduce((sum, receivable) =>
      receivable.status === 'PAID' ? sum + receivable.amountPaise : sum, 0);
    const upcomingDates = receivables
      .filter((receivable) => receivable.status === 'PENDING' || receivable.status === 'ELIGIBLE')
      .map((receivable) => receivable.eligibleAt)
      .filter((eligibleAt) => Date.parse(eligibleAt) > now)
      .sort();

    return {
      approvedTotalPaise,
      pendingPaise,
      eligiblePaise,
      processingPaise,
      paidPaise,
      nextSettlementAt: upcomingDates[0] ?? null,
      receivables,
      batches,
    };
  },
});

export const createSettlementBatch = mutation({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER', 'ADMIN']);
    const now = Date.now();
    const timestamp = new Date(now).toISOString();
    const receivables = await ctx.db
      .query('ownerReceivables')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .collect();
    const eligible = receivables.filter((receivable) =>
      (receivable.status === 'PENDING' || receivable.status === 'ELIGIBLE')
      && Date.parse(receivable.eligibleAt) <= now
      && receivable.amountPaise > 0
    );

    if (!eligible.length) {
      throw new Error('NO_ELIGIBLE_SETTLEMENTS');
    }

    const reference = `ES-${globalThis.crypto.randomUUID()}`;
    const totalPaise = eligible.reduce((sum, receivable) => sum + receivable.amountPaise, 0);
    const batchId = await ctx.db.insert('settlementBatches', {
      reference,
      ownerId: owner.id,
      status: 'PENDING',
      totalPaise,
      redemptionIds: eligible.map((receivable) => receivable.redemptionId),
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    for (const receivable of eligible) {
      await ctx.db.patch(receivable._id, {
        status: 'PROCESSING',
        updatedAt: timestamp,
      });
      await ctx.db.insert('settlementLedger', {
        batchId: String(batchId),
        ownerId: owner.id,
        redemptionId: receivable.redemptionId,
        amountPaise: receivable.amountPaise,
        event: 'ALLOCATED',
        createdAt: timestamp,
      });
    }

    await ctx.db.insert('settlementAudit', {
      batchId: String(batchId),
      actorId: owner.id,
      event: 'BATCH_CREATED',
      createdAt: timestamp,
    });

    return { batchId, reference, totalPaise, status: 'PENDING' as const };
  },
});

export const recordSettlementOutcome = mutation({
  args: {
    batchId: v.id('settlementBatches'),
    outcome: v.union(v.literal('PAID'), v.literal('FAILED')),
    paymentReference: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireUser(ctx, ['ADMIN']);
    if (args.outcome === 'PAID' && !args.paymentReference?.trim()) {
      throw new Error('PAYMENT_REFERENCE_REQUIRED');
    }

    const batch = await ctx.db.get(args.batchId);
    if (!batch) {
      throw new Error('SETTLEMENT_NOT_FOUND');
    }
    if (batch.status !== 'PENDING' && batch.status !== 'PROCESSING') {
      throw new Error('SETTLEMENT_ALREADY_FINAL');
    }

    const timestamp = new Date().toISOString();
    const status = args.outcome;
    await ctx.db.patch(batch._id, {
      status,
      updatedAt: timestamp,
      ...(status === 'PAID'
        ? { paidAt: timestamp, paymentReference: args.paymentReference!.trim() }
        : {}),
    });

    for (const redemptionId of batch.redemptionIds) {
      const receivable = await ctx.db
        .query('ownerReceivables')
        .withIndex('by_redemption', (q) => q.eq('redemptionId', redemptionId))
        .unique();
      if (!receivable || receivable.status !== 'PROCESSING') {
        throw new Error('SETTLEMENT_ALLOCATION_INCONSISTENT');
      }

      await ctx.db.patch(receivable._id, {
        status: status === 'PAID'
          ? 'PAID'
          : Date.parse(receivable.eligibleAt) <= Date.now() ? 'ELIGIBLE' : 'PENDING',
        updatedAt: timestamp,
        ...(status === 'PAID'
          ? { paidAt: timestamp, paymentReference: args.paymentReference!.trim() }
          : {}),
      });
      await ctx.db.insert('settlementLedger', {
        batchId: String(batch._id),
        ownerId: batch.ownerId,
        redemptionId,
        amountPaise: receivable.amountPaise,
        event: status,
        createdAt: timestamp,
      });
    }

    await ctx.db.insert('settlementAudit', {
      batchId: String(batch._id),
      actorId: admin.id,
      event: `BATCH_${status}`,
      note: args.note,
      createdAt: timestamp,
    });

    return { batchId: args.batchId, status };
  },
});

export const reversePaidSettlement = mutation({
  args: {
    batchId: v.id('settlementBatches'),
    note: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await requireUser(ctx, ['ADMIN']);
    const batch = await ctx.db.get(args.batchId);
    if (!batch || batch.status !== 'PAID') {
      throw new Error('PAID_SETTLEMENT_NOT_FOUND');
    }
    const timestamp = new Date().toISOString();
    await ctx.db.patch(batch._id, { status: 'REVERSED', updatedAt: timestamp });

    for (const redemptionId of batch.redemptionIds) {
      const receivable = await ctx.db
        .query('ownerReceivables')
        .withIndex('by_redemption', (q) => q.eq('redemptionId', redemptionId))
        .unique();
      if (!receivable || receivable.status !== 'PAID') {
        throw new Error('SETTLEMENT_ALLOCATION_INCONSISTENT');
      }

      await ctx.db.patch(receivable._id, { status: 'REVERSED', updatedAt: timestamp });
      await ctx.db.insert('settlementLedger', {
        batchId: String(batch._id),
        ownerId: batch.ownerId,
        redemptionId,
        amountPaise: receivable.amountPaise,
        event: 'REVERSED',
        createdAt: timestamp,
      });
    }

    await ctx.db.insert('settlementAudit', {
      batchId: String(batch._id),
      actorId: admin.id,
      event: 'BATCH_REVERSED',
      note: args.note,
      createdAt: timestamp,
    });
    return { batchId: args.batchId, status: 'REVERSED' as const };
  },
});
