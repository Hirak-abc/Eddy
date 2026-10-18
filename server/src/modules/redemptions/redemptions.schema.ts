import { z } from 'zod';

export const requestRedemptionSchema = z.object({
  offerId: z.string().min(1),
  idempotencyKey: z.string().uuid(),
});

export const reviewRedemptionSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
});

export const redemptionIdSchema = z.object({
  redemptionId: z.string().min(1),
});
