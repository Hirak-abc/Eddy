import type { ID } from './index';

// ── Transaction type ─────────────────────────────────
export type TransactionType =
  | 'COIN_REWARD'
  | 'COIN_REDEMPTION'
  | 'DISCOUNT_REDEMPTION'
  | 'STREAK_BONUS'
  | 'FOLLOW_REWARD'
  | 'COUPON_REDEMPTION';

// ── Transaction status ───────────────────────────────
export type TransactionStatus =
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED'
  | 'FAILED';

// ── Customer wallet ──────────────────────────────────
export interface CustomerWallet {
  id: ID;
  customerId: ID;
  balance: number; // coin count
  lifetimeEarned: number;
  lifetimeRedeemed: number;
  updatedAt: string;
}

// ── Owner wallet ─────────────────────────────────────
export interface OwnerWallet {
  id: ID;
  businessId: ID;
  balanceInr: number;
  lifetimeCreditsInr: number;
  updatedAt: string;
}

// ── Wallet transaction ───────────────────────────────
export interface WalletTransaction {
  id: ID;
  type: TransactionType;
  customerId: ID;
  businessId: ID;
  amount: number;
  coinAmount: number;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  approvedAt?: string;
}
