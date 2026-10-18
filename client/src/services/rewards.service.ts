import { api } from './api';

export interface SpinResponse {
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

export interface StreakResponse {
  currentStreak: number;
  bonusCoinsEarned: number;
  lastActiveDate: string | null;
  daysUntilNextBonus: number;
}

export const rewardsService = {
  spinWheel: async (scanId: string) => {
    return await api.post<SpinResponse>('/rewards/spin', { scanId });
  },

  getStreak: async () => {
    return await api.get<StreakResponse>('/rewards/streak');
  },
};
