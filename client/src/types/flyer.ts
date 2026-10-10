import type { ID } from './index';

// ── Flyer status lifecycle ───────────────────────────
export type FlyerStatus =
  | 'DRAFT'
  | 'GENERATING'
  | 'READY'
  | 'SCHEDULED'
  | 'PUBLISHING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'EXPIRED';

// ── Flyer ────────────────────────────────────────────
export interface Flyer {
  id: ID;
  businessId: ID;
  status: FlyerStatus;
  trendContext?: string;
  imageUrl?: string;
  hashtags: string[];
  couponCode?: string;
  couponExpiresAt?: string;
  versions: FlyerVersion[];
  selectedVersionId?: ID;
  scheduledAt?: string;
  publishedAt?: string;
  socialPostId?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Flyer version (generated option) ─────────────────
export interface FlyerVersion {
  id: ID;
  flyerId: ID;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  status?: string;
  createdAt: string;
}

// ── Flyer creation (manual) ──────────────────────────
export type FlyerCategory =
  | 'FESTIVAL'
  | 'DISCOUNT'
  | 'HIRING'
  | 'NEW_PRODUCT'
  | 'ANNOUNCEMENT'
  | 'CUSTOM';

export interface CreateFlyerInput {
  category: FlyerCategory;
  title: string;
  description?: string;
  imageId?: ID;
}
