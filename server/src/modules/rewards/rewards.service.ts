import { REWARDS_REPOSITORY } from './rewards.repository';
import type { SpinResult, StreakResult } from './rewards.types';

export const REWARDS_SERVICE = {
  spinWheel: async (scanId: string, token: string): Promise<SpinResult> => {
    const result = await REWARDS_REPOSITORY.recordSpin(scanId, token);
    const message = result.coinsOverflow > 0
      ? `You won ${result.coinsAwarded} Coins. ${result.coinsCredited} were credited; ${result.coinsOverflow} could not be credited because your wallet is at its 100-Coin limit.`
      : result.coinsCredited > 0
        ? `You won ${result.coinsAwarded} Eddy Coins. ${result.coinsCredited} were added to your wallet.`
        : 'Your wallet is at its 100-Coin limit. This spin was recorded, but no Coins were credited.';
    return { ...result, message };
  },

  getStreak: async (token: string): Promise<StreakResult> => {
    const streakData = await REWARDS_REPOSITORY.getStreakData(token);
    return {
      currentStreak: streakData.currentStreak,
      bonusCoinsEarned: streakData.bonusCoinsEarned,
      lastActiveDate: streakData.lastActiveDate,
      daysUntilNextBonus: 10 - (streakData.currentStreak % 10),
    };
  },
};
