import { describe, expect, it, vi } from 'vitest';

vi.mock('../config/env', () => ({
  config: {
    META_IG_USER_ID: 'instagram-account-id',
    META_IG_USERNAME: 'eddyofficial_01',
    META_IG_ACCESS_TOKEN: 'test-instagram-token',
  },
}));

import { getEnvFallbackAccounts } from '../modules/social/social.env-accounts';

describe('getEnvFallbackAccounts', () => {
  it('provides the configured Eddy Instagram account without a Facebook fallback', () => {
    const accounts = getEnvFallbackAccounts('owner-1');

    expect(accounts).toHaveLength(1);
    expect(accounts[0]).toMatchObject({
      id: 'env:instagram',
      clerkUserId: 'owner-1',
      platform: 'INSTAGRAM',
      externalId: 'instagram-account-id',
      username: 'eddyofficial_01',
      encryptedAccessToken: 'env:META_IG_ACCESS_TOKEN',
      status: 'ACTIVE',
    });
  });
});
