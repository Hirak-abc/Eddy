import { describe, expect, it } from 'vitest';
import { requestRedemptionSchema } from '../modules/redemptions/redemptions.schema';

describe('requestRedemptionSchema', () => {
  const idempotencyKey = 'aa9eab2c-6c4d-4552-bf2a-02f4a74e79e8';

  it('accepts an integer coin amount at or above the minimum', () => {
    expect(requestRedemptionSchema.safeParse({
      businessId: 'business_1',
      coinsCost: 50,
      idempotencyKey,
    }).success).toBe(true);
    expect(requestRedemptionSchema.safeParse({
      businessId: 'business_1',
      coinsCost: 75,
      idempotencyKey,
    }).success).toBe(true);
    expect(requestRedemptionSchema.safeParse({
      businessId: 'business_1',
      coinsCost: 100,
      idempotencyKey,
    }).success).toBe(true);
  });

  it('rejects amounts outside 50-100 and fractional coin amounts', () => {
    expect(requestRedemptionSchema.safeParse({
      businessId: 'business_1',
      coinsCost: 49,
      idempotencyKey,
    }).success).toBe(false);
    expect(requestRedemptionSchema.safeParse({
      businessId: 'business_1',
      coinsCost: 101,
      idempotencyKey,
    }).success).toBe(false);
    expect(requestRedemptionSchema.safeParse({
      businessId: 'business_1',
      coinsCost: 50.5,
      idempotencyKey,
    }).success).toBe(false);
  });
});
