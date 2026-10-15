import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const recordScan = mutation({
  args: {
    customerId: v.string(),
    businessId: v.string(),
    scannedAt: v.string(),
    dateString: v.string(),
  },
  handler: async (ctx, args) => {
    // Check scans today for customer
    const existingScans = await ctx.db
      .query("qrScans")
      .withIndex("by_customer_date", (q) =>
        q.eq("customerId", args.customerId).eq("dateString", args.dateString)
      )
      .collect();

    if (existingScans.length >= 100) {
      throw new Error("DAILY_SCAN_LIMIT_REACHED: Maximum 100 scans per customer per day.");
    }

    const scanId = await ctx.db.insert("qrScans", {
      customerId: args.customerId,
      businessId: args.businessId,
      scannedAt: args.scannedAt,
      dateString: args.dateString,
    });

    return { scanId, scansCountToday: existingScans.length + 1 };
  },
});

export const getScansCountToday = query({
  args: {
    customerId: v.string(),
    dateString: v.string(),
  },
  handler: async (ctx, args) => {
    const existingScans = await ctx.db
      .query("qrScans")
      .withIndex("by_customer_date", (q) =>
        q.eq("customerId", args.customerId).eq("dateString", args.dateString)
      )
      .collect();

    return existingScans.length;
  },
});
