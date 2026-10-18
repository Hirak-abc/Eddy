export interface MetaSignedRequestPayload {
  user_id?: string;
  algorithm?: string;
  issued_at?: number;
  [key: string]: unknown;
}

export type DataDeletionStatus = 'received' | 'in_progress' | 'completed';

export interface DataDeletionRequest {
  confirmationCode: string;
  metaUserId: string | null;
  status: DataDeletionStatus;
  receivedAt: string;
  statusUrl: string;
}

export type SocialPlatform = 'FACEBOOK_PAGE' | 'INSTAGRAM';
export type SocialAccountStatus = 'ACTIVE' | 'DISCONNECTED';
export type SocialPostMode = 'NOW' | 'SCHEDULED';
export type SocialPostStatus =
  | 'PENDING'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'CANCELLED';

export interface SocialAccountRecord {
  id: string;
  clerkUserId: string;
  businessId?: string;
  platform: SocialPlatform;
  externalId: string;
  name?: string;
  username?: string;
  encryptedAccessToken?: string;
  tokenExpiresAt?: number;
  autoPublish: boolean;
  status: SocialAccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccountPublic {
  id: string;
  platform: SocialPlatform;
  externalId: string;
  name?: string;
  username?: string;
  tokenExpiresAt?: number;
  autoPublish: boolean;
  status: SocialAccountStatus;
}

export interface SocialPostResult {
  accountId: string;
  platform: SocialPlatform;
  postId?: string;
  error?: string;
}

export interface SocialPostRecord {
  id: string;
  clerkUserId: string;
  flyerId?: string;
  accountIds: string[];
  imageUrl: string;
  caption?: string;
  mode: SocialPostMode;
  scheduledAt: string;
  status: SocialPostStatus;
  externalResults?: SocialPostResult[];
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}
