import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { requireUser } from './auth';

const MAX_DAILY_SCANS_PER_CUSTOMER = 100;
const BUSINESS_TIME_ZONE = 'Asia/Kolkata';

const getBusinessLocalDateString = (date: Date) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
};

const getBusinessDayRange = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const start = Date.UTC(year, month - 1, day) - (5 * 60 + 30) * 60 * 1000;
  return {
    start: new Date(start).toISOString(),
    end: new Date(start + 24 * 60 * 60 * 1000).toISOString(),
  };
};

const getBusinessLocalDateDaysAgo = (date: Date, daysAgo: number) => {
  const [year, month, day] = getBusinessLocalDateString(date).split('-').map(Number);
  const startOfLocalDate = Date.UTC(year, month - 1, day) - daysAgo * 24 * 60 * 60 * 1000;
  return new Date(startOfLocalDate).toISOString().slice(0, 10);
};

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

export const getOwnerScansCountToday = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER']);
    const date = getBusinessLocalDateString(new Date());
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();

    if (!business) {
      return { scansToday: 0, date };
    }

    const { start, end } = getBusinessDayRange(date);
    const scansToday = await ctx.db
      .query('qrScans')
      .withIndex('by_business_scanned_at', (q) =>
        q.eq('businessId', String(business._id)).gte('scannedAt', start).lt('scannedAt', end)
      )
      .collect();

    return {
      scansToday: scansToday.length,
      date,
    };
  },
});

export const getOwnerRepeatRate = query({
  args: {},
  handler: async (ctx) => {
    const owner = await requireUser(ctx, ['OWNER']);
    const business = await ctx.db
      .query('businesses')
      .withIndex('by_owner', (q) => q.eq('ownerId', owner.id))
      .unique();

    if (!business) {
      return { repeatCustomerRate: 0, repeatCustomers: 0, uniqueCustomers: 0 };
    }

    const now = new Date();
    const startDate = getBusinessLocalDateDaysAgo(now, 29);
    const endDate = getBusinessLocalDateDaysAgo(now, -1);
    const { start } = getBusinessDayRange(startDate);
    const { start: end } = getBusinessDayRange(endDate);
    const scans = await ctx.db
      .query('qrScans')
      .withIndex('by_business_scanned_at', (q) =>
        q.eq('businessId', String(business._id)).gte('scannedAt', start).lt('scannedAt', end)
      )
      .collect();

    const scansPerCustomer = new Map<string, number>();
    for (const scan of scans) {
      scansPerCustomer.set(scan.customerId, (scansPerCustomer.get(scan.customerId) ?? 0) + 1);
    }

    const uniqueCustomers = scansPerCustomer.size;
    const repeatCustomers = [...scansPerCustomer.values()].filter((count) => count >= 2).length;

    return {
      repeatCustomerRate: uniqueCustomers === 0
        ? 0
        : Math.round((repeatCustomers / uniqueCustomers) * 100),
      repeatCustomers,
      uniqueCustomers,
    };
  },
});
