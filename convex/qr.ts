import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireUser } from './auth';

const MAX_DAILY_SCANS_PER_CUSTOMER = 100;

export const recordScan = mutation({
  args: {
    qrToken: v.string(),
  },
  handler: async (ctx, args) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const scannedAt = new Date().toISOString();
    const dateString = scannedAt.slice(0, 10);
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_qr_token', (q) => q.eq('qrToken', args.qrToken))
      .unique();

    if (!business || !business.qrEnabled) {
      throw new Error('INVALID_QR');
    }

    const scansToday = await ctx.db
      .query('qrScans')
      .withIndex('by_customer_date', (q) =>
        q.eq('customerId', customer.id).eq('dateString', dateString)
      )
      .collect();

    if (scansToday.length >= MAX_DAILY_SCANS_PER_CUSTOMER) {
      throw new Error('DAILY_SCAN_LIMIT_REACHED');
    }

    const scanId = await ctx.db.insert('qrScans', {
      customerId: customer.id,
      businessId: business._id,
      scannedAt,
      dateString,
    });

    return {
      scanId,
      businessId: business._id,
      businessName: business.name,
      category: business.category,
      address: business.address,
      scansToday: scansToday.length + 1,
      scansLeft: MAX_DAILY_SCANS_PER_CUSTOMER - scansToday.length - 1,
    };
  },
});

export const getScansCountToday = query({
  args: {},
  handler: async (ctx) => {
    const customer = await requireUser(ctx, ['CUSTOMER']);
    const dateString = new Date().toISOString().slice(0, 10);
    const scansToday = await ctx.db
      .query('qrScans')
      .withIndex('by_customer_date', (q) =>
        q.eq('customerId', customer.id).eq('dateString', dateString)
      )
      .collect();

    return {
      scansToday: scansToday.length,
      scansLeft: Math.max(0, MAX_DAILY_SCANS_PER_CUSTOMER - scansToday.length),
    };
  },
});
