import { makeFunctionReference } from 'convex/server';
import type { GenericId } from 'convex/values';
import { createAuthenticatedConvexClient } from '../../integrations/convex/client';
import type { SpinResult, StreakResult } from './rewards.types';

type StoredSpin = Omit<SpinResult, 'message'>;

const recordSpin = makeFunctionReference<'mutation', { scanId: GenericId<'qrScans'> }, StoredSpin>(
  'rewards:recordSpin',
);
const getStreak = makeFunctionReference<
  'query',
  Record<string, never>,
  Omit<StreakResult, 'daysUntilNextBonus'>
>('rewards:getStreak');

export const REWARDS_REPOSITORY = {
  recordSpin: (scanId: string, token: string) =>
    createAuthenticatedConvexClient(token).mutation(recordSpin, {
      scanId: scanId as GenericId<'qrScans'>,
    }),

  getStreakData: (token: string) =>
    createAuthenticatedConvexClient(token).query(getStreak, {}),
};
