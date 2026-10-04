import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/**
 * Regression test for the /api/me 401.
 *
 * The installed @clerk/backend exports `verifyToken` as
 * `withLegacyReturn(verifyToken2)`, which THROWS on failure and resolves with
 * the raw JwtPayload on success. It does not resolve to `{ data, errors }`.
 * The previous implementation read `.data` off the resolved value, which was
 * therefore always `undefined`, so `sub` was never a string and every
 * authenticated request failed with 401 — leaving Convex `users` empty.
 */
vi.mock('@clerk/backend', () => ({
  createClerkClient: () => ({}),
  verifyToken: vi.fn(),
}));

vi.mock('../../config/env', () => ({
  config: { CLERK_SECRET_KEY: 'sk_test_placeholder' },
}));

describe('verifyClerkSessionToken', () => {
  let verifyTokenMock: ReturnType<typeof vi.fn>;
  let verifyClerkSessionToken: (token: string) => Promise<string>;

  beforeEach(async () => {
    vi.resetModules();
    verifyTokenMock = vi.fn();
    vi.doMock('@clerk/backend', () => ({
      createClerkClient: () => ({}),
      verifyToken: verifyTokenMock,
    }));
    const mod = await import('../integrations/clerk');
    verifyClerkSessionToken = mod.verifyClerkSessionToken;
  });

  afterEach(() => {
    vi.doUnmock('@clerk/backend');
  });

  it('returns sub from the raw payload the legacy wrapper resolves', async () => {
    verifyTokenMock.mockResolvedValue({ sub: 'user_abc123', nbf: 1, exp: 2 });

    await expect(verifyClerkSessionToken('a.b.c')).resolves.toBe('user_abc123');
  });

  it('rejects when verifyToken throws a TokenVerificationError', async () => {
    const err = Object.assign(new Error('Invalid JWT form.'), {
      errors: [{ code: 'token_invalid', message: 'Invalid JWT form.' }],
    });
    verifyTokenMock.mockRejectedValue(err);

    await expect(verifyClerkSessionToken('bad')).rejects.toThrow(
      'Clerk token verification failed'
    );
  });

  it('rejects when the resolved payload has no usable sub', async () => {
    verifyTokenMock.mockResolvedValue(undefined);
    await expect(verifyClerkSessionToken('a.b.c')).rejects.toThrow(
      'Clerk token verification returned no payload'
    );

    verifyTokenMock.mockResolvedValue({ sub: '' });
    await expect(verifyClerkSessionToken('a.b.c')).rejects.toThrow(
      'Clerk token verification returned no payload'
    );
  });
});
