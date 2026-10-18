import { config } from '../../config/env';
import type { SocialAccountRecord } from './social.types';

export const ENV_FACEBOOK_ACCOUNT_ID = 'env:facebook-page';
export const ENV_INSTAGRAM_ACCOUNT_ID = 'env:instagram';

const envValue = (key: keyof typeof config): string | undefined =>
  process.env[key] || (config[key] as string | undefined);

export const getEnvFallbackAccounts = (
  clerkUserId: string,
): SocialAccountRecord[] => {
  const now = new Date().toISOString();
  const accounts: SocialAccountRecord[] = [];

  const pageId = envValue('META_PAGE_ID');
  const pageToken = envValue('META_PAGE_ACCESS_TOKEN');
  const pageName = envValue('META_PAGE_NAME');
  const igUserId = envValue('META_IG_USER_ID');
  const igToken = envValue('META_IG_ACCESS_TOKEN');
  const igUsername = envValue('META_IG_USERNAME');

  if (pageId && pageToken) {
    accounts.push({
      id: ENV_FACEBOOK_ACCOUNT_ID,
      clerkUserId,
      platform: 'FACEBOOK_PAGE',
      externalId: pageId,
      name: pageName || 'EddyOfficial',
      encryptedAccessToken: 'env:META_PAGE_ACCESS_TOKEN',
      autoPublish: true,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });
  }

  if (igUserId && igToken) {
    accounts.push({
      id: ENV_INSTAGRAM_ACCOUNT_ID,
      clerkUserId,
      platform: 'INSTAGRAM',
      externalId: igUserId,
      name: pageName || 'EddyOfficial',
      username: igUsername || 'eddyofficial_01',
      encryptedAccessToken: 'env:META_IG_ACCESS_TOKEN',
      autoPublish: true,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    });
  }

  return accounts;
};
