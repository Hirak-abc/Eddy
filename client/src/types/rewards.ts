import type { ID } from './index';

// ── Reward types ─────────────────────────────────────
export type RewardType = 'COINS' | 'DISCOUNT' | 'FREE_ITEM' | 'OTHER';

// ── Reward ───────────────────────────────────────────
export interface Reward {
  id: ID;
  businessId: ID;
  type: RewardType;
  label: string;
  value: number; // coins count, discount %, etc.
  probability: number; // 0-1
}

// ── Reward claim ─────────────────────────────────────
export interface RewardClaim {
  id: ID;
  customerId: ID;
  businessId: ID;
  rewardId: ID;
  type: RewardType;
  value: number;
  label: string;
  claimedAt: string;
}

// ── Spin result ──────────────────────────────────────
export interface SpinResult {
  reward: RewardClaim;
  remainingSpinsToday: number;
}

// ── Streak ───────────────────────────────────────────
export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  nextMilestone: number;
  totalBonusEarned: number;
}
