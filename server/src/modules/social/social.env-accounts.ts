import { config } from '../../config/env';
import type { SocialAccountRecord } from './social.types';

export const ENV_INSTAGRAM_ACCOUNT_ID = 'env:instagram';

export const getEnvFallbackAccounts = (
  clerkUserId: string,
): SocialAccountRecord[] => {
  const userId = config.META_IG_USER_ID;
  const accessToken = config.META_IG_ACCESS_TOKEN;
  if (!userId || !accessToken) return [];

  const now = new Date().toISOString();
  return [
    {
      id: ENV_INSTAGRAM_ACCOUNT_ID,
      clerkUserId,
      platform: 'INSTAGRAM',
      externalId: userId,
      name: config.META_IG_USERNAME || 'EddyOfficial',
      username: config.META_IG_USERNAME || 'eddyofficial_01',
      encryptedAccessToken: 'env:META_IG_ACCESS_TOKEN',
      autoPublish: true,
      status: 'ACTIVE',
      createdAt: now,
      updatedAt: now,
    },
  ];
};
