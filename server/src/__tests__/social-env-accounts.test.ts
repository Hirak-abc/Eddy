import { describe, expect, it, vi } from 'vitest';

vi.mock('../config/env', () => ({
  config: {
    NODE_ENV: 'test',
    META_PAGE_ID: '1309637365564643',
    META_PAGE_NAME: 'EddyOfficial',
    META_PAGE_ACCESS_TOKEN: 'page-token',
    META_IG_USER_ID: '28750070454658176',
    META_IG_USERNAME: 'eddyofficial_01',
    META_IG_ACCESS_TOKEN: 'IGtoken',
  },
}));

import { getEnvFallbackAccounts } from '../modules/social/social.env-accounts';

describe('getEnvFallbackAccounts', () => {
  it('returns EddyOfficial page and Instagram login accounts from env tokens', () => {
    const accounts = getEnvFallbackAccounts('user_123');
    expect(accounts).toHaveLength(2);
    expect(accounts[0]).toMatchObject({
      id: 'env:facebook-page',
      platform: 'FACEBOOK_PAGE',
      externalId: '1309637365564643',
      name: 'EddyOfficial',
    });
    expect(accounts[1]).toMatchObject({
      id: 'env:instagram',
      platform: 'INSTAGRAM',
      externalId: '28750070454658176',
      username: 'eddyofficial_01',
    });
  });
});
