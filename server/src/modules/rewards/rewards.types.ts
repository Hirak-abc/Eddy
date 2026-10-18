export interface SpinResult {
  spinId: string;
  rewardType: 'COINS';
  rewardValue: string | number;
  coinsAwarded: number;
  coinsCredited: number;
  coinsOverflow: number;
  walletBalance: number;
  cycleNumber: number;
  slotIndex: number;
  idempotentReplay: boolean;
  message: string;
}

export interface StreakResult {
  currentStreak: number;
  bonusCoinsEarned: number;
  lastActiveDate: string | null;
  daysUntilNextBonus: number;
}
