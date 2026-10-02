import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * Regression tests for the role hand-off rules in identity.repository.
 *
 * The application role lives in Convex and is the authorization source. These
 * tests pin the two rules that were previously broken:
 *  1. An existing user's role is never overwritten (no role is even requested
 *     on a returning sign-in, and a signup role hint must not apply).
 *  2. ADMIN can never be created from client input.
 */

const getByClerkId = vi.fn();
const createUser = vi.fn();

vi.mock('../integrations/convex', () => ({
  convexClient: {
    query: async (_api: unknown, args: unknown) => getByClerkId(args),
    mutation: async (_api: unknown, args: unknown) => createUser(args),
  },
}));

vi.mock('../integrations/clerk', () => ({
  getClerkProfile: async () => ({
    email: 'person@example.com',
    displayName: 'Person',
    firstName: 'Person',
    lastName: '',
    avatarUrl: undefined,
    phone: undefined,
  }),
}));

// Imported once, after the mocks are registered. `vi.resetModules()` cannot be
// used here: it would give the repository a fresh module graph in which the
// factories above are no longer applied, so the real ConvexHttpClient would
// be constructed and the tests would hit the network.
import { IDENTITY_REPOSITORY } from '../modules/identity/identity.repository';

const repo = IDENTITY_REPOSITORY;

describe('IDENTITY_REPOSITORY.findOrCreateByClerkId', () => {
  beforeEach(() => {
    getByClerkId.mockReset();
    createUser.mockReset();
  });

  it('returns the existing user without touching the role, even when a signup role is supplied', async () => {
    const existing = { _id: 'u1', clerkId: 'user_existing', role: 'OWNER' };
    getByClerkId.mockResolvedValue(existing);
    const result = await repo.findOrCreateByClerkId('user_existing', undefined, 'CUSTOMER');

    expect(result).toBe(existing);
    expect(result.role).toBe('OWNER');
    expect(createUser).not.toHaveBeenCalled();
  });

  it('creates a CUSTOMER when no role is requested', async () => {
    getByClerkId.mockResolvedValue(null);
    createUser.mockResolvedValue('u_new');
    await repo.findOrCreateByClerkId('user_new');

    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({ clerkId: 'user_new', role: 'CUSTOMER', status: 'ACTIVE' })
    );
  });

  it('creates an OWNER when the validated signup role is OWNER', async () => {
    getByClerkId.mockResolvedValue(null);
    createUser.mockResolvedValue('u_new');
    await repo.findOrCreateByClerkId('user_new', undefined, 'OWNER');

    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({ clerkId: 'user_new', role: 'OWNER' })
    );
  });

  it('falls back to CUSTOMER for any role value that is not OWNER', async () => {
    getByClerkId.mockResolvedValue(null);
    createUser.mockResolvedValue('u_new');
    // ADMIN never reaches here (signupRoleSchema rejects it at the boundary),
    // but the repository must not be the thing that assigns it.
    await repo.findOrCreateByClerkId('user_new', undefined, 'ADMIN' as 'OWNER');

    expect(createUser).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'CUSTOMER' })
    );
  });
});
