import { z } from "zod";

export const claimCouponBodySchema = z.object({
  code: z.string().trim().min(1).max(32),
});

export const couponIdParamsSchema = z.object({
  id: z.string().min(1),
});

export const approveCouponBodySchema = z.object({
  billAmount: z.coerce.number().finite().positive().max(1_000_000_000),
});
