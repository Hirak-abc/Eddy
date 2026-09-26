// ── Primitives ───────────────────────────────────────
export type ID = string;

// ── Roles ────────────────────────────────────────────
export type UserRole = 'OWNER' | 'CUSTOMER' | 'ADMIN';

// ── User ─────────────────────────────────────────────
export interface User {
  id: ID;
  clerkId: string;
  role: UserRole;
  email: string;
  displayName: string;
  phone?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}

// ── Business ─────────────────────────────────────────
export interface Business {
  id: ID;
  ownerId: ID;
  name: string;
  category: string;
  location: string;
  phone?: string;
  email?: string;
  description?: string;
  images: BusinessImages;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  autoPublish: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessImages {
  shop?: StoredImage;
  product?: StoredImage;
  item?: StoredImage;
}

export interface StoredImage {
  storageKey: string;
  url: string;
  uploadedAt: string;
}

// ── Subscription ─────────────────────────────────────
export interface Subscription {
  id: ID;
  businessId: ID;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  plan: string;
  priceInr: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
}

// ── Social account ───────────────────────────────────
export interface SocialAccount {
  id: ID;
  businessId: ID;
  platform: 'INSTAGRAM' | 'FACEBOOK';
  accountName: string;
  status: 'CONNECTED' | 'EXPIRED' | 'DISCONNECTED';
  connectedAt: string;
}

// Re-export domain types
export type { Flyer, FlyerStatus, FlyerVersion } from './flyer';
export type { Reward, RewardClaim, RewardType, SpinResult } from './rewards';
export type {
  CustomerWallet,
  OwnerWallet,
  WalletTransaction,
  TransactionType,
  TransactionStatus,
} from './wallet';
