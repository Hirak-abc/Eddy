import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { mockVerifyToken, mockConvexQuery } = vi.hoisted(() => ({
  mockVerifyToken: vi.fn(),
  mockConvexQuery: vi.fn(),
}));

vi.mock('@clerk/backend', () => ({ verifyToken: mockVerifyToken }));
vi.mock('../config/env', () => ({ config: { CLERK_SECRET_KEY: 'test-secret' } }));
vi.mock('../integrations/convex/client', () => ({
  createAuthenticatedConvexClient: () => ({ query: mockConvexQuery }),
}));

import { authenticate } from '../middleware/auth.middleware';

const app = express();
app.get('/protected', authenticate, (_req, res) => res.sendStatus(200));

describe('authenticate dependency failures', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyToken.mockResolvedValue({ sub: 'user_owner_1' });
  });

  it('returns 503 and logs a redacted Convex diagnostic with the request ID', async () => {
    const errorMessage =
      'Bearer session-token sk_test_sensitive eyJhbGci.eyJzdWI.abc ' +
      'https://example.test/?token=query-secret';
    mockConvexQuery.mockRejectedValue(new Error(errorMessage));
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      const response = await request(app)
        .get('/protected')
        .set('Authorization', 'Bearer session-token')
        .set('x-request-id', 'owner-login:attempt-1');

      expect(response.status).toBe(503);
      expect(response.headers['x-request-id']).toBe('owner-login:attempt-1');
      expect(response.body.error.code).toBe('EXTERNAL_API_ERROR');
      expect(log).toHaveBeenCalledOnce();

      const diagnostic = JSON.parse(log.mock.calls[0][0] as string);
      expect(diagnostic).toMatchObject({
        event: 'authentication_dependency_failure',
        dependency: 'convex_role_lookup',
        requestId: 'owner-login:attempt-1',
        errorClass: 'Error',
      });
      expect(diagnostic.errorMessage).not.toContain('session-token');
      expect(diagnostic.errorMessage).not.toContain('sk_test_sensitive');
      expect(diagnostic.errorMessage).not.toContain('query-secret');
    } finally {
      log.mockRestore();
    }
  });

  it('uses the authenticated user lookup for a customer role', async () => {
    mockConvexQuery.mockResolvedValueOnce({ role: 'CUSTOMER', status: 'ACTIVE' });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer session-token');

    expect(response.status).toBe(200);
    const [functionReference, args] = mockConvexQuery.mock.calls[0];
    expect(Reflect.ownKeys(functionReference).map((key) => Reflect.get(functionReference, key)))
      .toContain('users:getUserByClerkId');
    expect(args).toEqual({ clerkId: 'user_owner_1' });
  });
});
