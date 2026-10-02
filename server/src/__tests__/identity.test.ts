import { describe, it, expect } from 'vitest';
import { signupRoleSchema } from '../modules/identity/identity.schema';

describe('signupRoleSchema', () => {
  it('accepts OWNER', () => {
    const result = signupRoleSchema.safeParse('OWNER');
    expect(result.success).toBe(true);
    expect(result.data).toBe('OWNER');
  });

  it('accepts CUSTOMER', () => {
    const result = signupRoleSchema.safeParse('CUSTOMER');
    expect(result.success).toBe(true);
    expect(result.data).toBe('CUSTOMER');
  });

  it('rejects ADMIN with 400-level failure (safeParse returns false)', () => {
    const result = signupRoleSchema.safeParse('ADMIN');
    expect(result.success).toBe(false);
  });

  it('rejects invalid role', () => {
    const result = signupRoleSchema.safeParse('SUPERUSER');
    expect(result.success).toBe(false);
  });

  it('allows undefined (optional)', () => {
    const result = signupRoleSchema.safeParse(undefined);
    expect(result.success).toBe(true);
    expect(result.data).toBeUndefined();
  });
});
