import { z } from 'zod';

// ── Identity ─────────────────────────────────────────
export const updateProfileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  phone: z.string().max(15).optional(),
});

export const emailAuthSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .refine(
      (pwd) => /[a-zA-Z]/.test(pwd) || /[0-9]/.test(pwd),
      'Password must contain at least one letter or number'
    ),
});

export const phoneAuthSchema = z.object({
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
});

// ── Business ─────────────────────────────────────────
export const createBusinessSchema = z.object({
  name: z.string().min(2, 'Business name is required').max(200),
  category: z.string().min(1, 'Category is required'),
  location: z.string().min(2, 'Location is required'),
  phone: z.string().min(10, 'Valid phone required').max(15).optional(),
  email: z.string().email('Valid email required').optional(),
  description: z.string().max(500).optional(),
});

export const updateBusinessSchema = createBusinessSchema.partial();

// ── Coupon ───────────────────────────────────────────
export const redeemCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required'),
});

// ── Wallet ───────────────────────────────────────────
export const redeemCoinsSchema = z.object({
  amount: z.number().int().min(50, 'Minimum 50 coins').max(100, 'Maximum 100 coins'),
});

// ── Review ───────────────────────────────────────────
export const submitReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export type EmailAuthInput = z.infer<typeof emailAuthSchema>;
export type PhoneAuthInput = z.infer<typeof phoneAuthSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type RedeemCouponInput = z.infer<typeof redeemCouponSchema>;
export type RedeemCoinsInput = z.infer<typeof redeemCoinsSchema>;
export type SubmitReviewInput = z.infer<typeof submitReviewSchema>;
