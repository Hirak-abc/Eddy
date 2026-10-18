import { z } from 'zod';

export const createBusinessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().trim().min(2).max(80),
  address: z.string().trim().min(3).max(240),
});

export const createRedeemableOfferSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(300).optional(),
  coinsCost: z.number().int().min(50).max(100),
  settlementValuePaise: z.number().int().positive(),
});

export const businessIdSchema = z.object({
  businessId: z.string().min(1),
});
