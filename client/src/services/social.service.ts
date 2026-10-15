import { api } from './api';

export type SocialPlatform = 'FACEBOOK_PAGE' | 'INSTAGRAM';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  externalId: string;
  name?: string;
  username?: string;
  tokenExpiresAt?: number;
  autoPublish: boolean;
  status: 'ACTIVE' | 'DISCONNECTED';
}

export interface SocialPost {
  id: string;
  accountIds: string[];
  imageUrl: string;
  caption?: string;
  mode: 'NOW' | 'SCHEDULED';
  scheduledAt: string;
  status: 'PENDING' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
  errorMessage?: string;
}

export const socialService = {
  getConnectUrl: () =>
    api.get<{ authorizationUrl: string }>('/social/meta/connect'),

  listAccounts: () => api.get<{ accounts: SocialAccount[] }>('/social/accounts'),

  updateAutoPublish: (id: string, autoPublish: boolean) =>
    api.patch<{ account: SocialAccount }>(`/social/accounts/${id}`, {
      autoPublish,
    }),

  disconnect: (id: string) =>
    api.delete<{ disconnected: boolean }>(`/social/accounts/${id}`),

  publishNow: (body: {
    imageUrl: string;
    caption?: string;
    accountIds?: string[];
  }) => api.post<{ post: SocialPost }>('/social/posts/publish', body),

  schedule: (body: {
    imageUrl: string;
    caption?: string;
    accountIds?: string[];
    scheduledAt?: string;
  }) => api.post<{ post: SocialPost }>('/social/posts/schedule', body),

  cancel: (id: string) =>
    api.post<{ cancelled: boolean }>(`/social/posts/${id}/cancel`),
};

export const tokenDaysRemaining = (tokenExpiresAt?: number): number | null => {
  if (!tokenExpiresAt) return null;
  return Math.max(0, Math.round((tokenExpiresAt - Date.now()) / 86_400_000));
};
