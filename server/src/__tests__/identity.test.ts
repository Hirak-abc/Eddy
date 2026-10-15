process.env.CLERK_SECRET_KEY = 'sk_test_dummy';

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../config/env', () => ({
  config: {
    PORT: 5001,
    NODE_ENV: 'test',
    CLIENT_URL: 'http://localhost:5173',
    CLERK_SECRET_KEY: 'sk_test_dummy',
    CLERK_PUBLISHABLE_KEY: 'pk_test_dummy',
    CONVEX_URL: 'https://test.convex.cloud',
    XAI_API_KEY: 'test',
    META_APP_ID: 'test',
    META_APP_SECRET: 'test',
    META_REDIRECT_URI: 'http://test',
    RAZORPAY_KEY_ID: 'test',
    RAZORPAY_KEY_SECRET: 'test',
    RAZORPAY_WEBHOOK_SECRET: 'test',
    R2_ACCOUNT_ID: 'test',
    R2_ACCESS_KEY_ID: 'test',
    R2_SECRET_ACCESS_KEY: 'test',
    R2_BUCKET_NAME: 'test',
    R2_PUBLIC_URL: 'http://test',
    GA_MEASUREMENT_ID: 'test',
  },
  parsedConfig: {
    PORT: 5001,
    NODE_ENV: 'test',
    CLIENT_URL: 'http://localhost:5173',
    CLERK_SECRET_KEY: 'sk_test_dummy',
    CONVEX_URL: 'https://test.convex.cloud',
  },
}));

vi.mock('@clerk/backend', () => ({
  createClient: () => ({}),
  createClerkClient: () => ({
    users: {
      updateUserMetadata: async (_id: string, meta: any) => ({
        id: _id,
        publicMetadata: meta.publicMetadata,
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User',
        imageUrl: 'https://example.com/avatar.jpg',
      }),
    },
  }),
}));

const mockConvexQuery = vi.hoisted(() => vi.fn());
const mockConvexMutation = vi.hoisted(() => vi.fn());

vi.mock('../integrations/convex/client', () => ({
  convexClient: {
    query: mockConvexQuery,
    mutation: mockConvexMutation,
  },
}));

vi.mock('../integrations/clerk/client', () => ({
  clerkClient: {
    users: {
      updateUserMetadata: async (_id: string, meta: any) => ({
        id: _id,
        publicMetadata: meta.publicMetadata,
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User',
        imageUrl: 'https://example.com/avatar.jpg',
      }),
    },
  },
}));

import { IDENTITY_REPOSITORY } from '../modules/identity/identity.repository';

describe('IDENTITY_REPOSITORY.setRole Convex Synchronization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('sync creates Convex user for new customer', async () => {
    mockConvexQuery.mockResolvedValueOnce(null);
    mockConvexMutation.mockResolvedValueOnce('doc_1');
    const r = await IDENTITY_REPOSITORY.setRole('user_test123', 'CUSTOMER');
    expect(r.role).toBe('CUSTOMER');
  });

  it('sync updates existing user', async () => {
    mockConvexQuery.mockResolvedValueOnce({ _id: 'd', clerkId: 'user_test123' });
    mockConvexMutation.mockResolvedValueOnce('d');
    const r = await IDENTITY_REPOSITORY.setRole('user_test123', 'OWNER');
    expect(r.role).toBe('OWNER');
  });

  it('fails closed on Convex error', async () => {
    mockConvexQuery.mockResolvedValueOnce(null); // user missing: hits mutation
    mockConvexMutation.mockRejectedValueOnce(new Error('convex down'));
    await expect(IDENTITY_REPOSITORY.setRole('user_test123', 'CUSTOMER'))
      .rejects.toThrow('Failed to synchronize');
  });
});
