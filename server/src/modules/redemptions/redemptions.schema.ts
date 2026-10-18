import { z } from 'zod';

export const requestRedemptionSchema = z.object({
  businessId: z.string().min(1),
  coinsCost: z.number().int().min(50).max(100),
  idempotencyKey: z.string().uuid(),
});

export const reviewRedemptionSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
});

export const redemptionIdSchema = z.object({
  redemptionId: z.string().min(1),
});
