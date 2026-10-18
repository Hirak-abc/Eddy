import { describe, expect, it } from 'vitest';
import {
  createRewardPool,
  isCurrentRewardPool,
  shuffleRewardPool,
} from '../../../convex/rewardPool';

describe('per-shop reward cycles', () => {
  it('contains exactly the approved 100 outcomes and expected reward value', () => {
    const pool = createRewardPool();
    const distribution = pool.reduce<Record<number, number>>((counts, reward) => {
      counts[reward] = (counts[reward] ?? 0) + 1;
      return counts;
    }, {});

    expect(pool).toHaveLength(100);
    expect(distribution).toEqual({ 2: 50, 3: 30, 4: 10, 5: 7, 10: 3 });
    expect(pool.reduce((sum, reward) => sum + reward, 0) / pool.length).toBe(2.95);
    expect(pool.filter((reward) => reward >= 2 && reward <= 5)).toHaveLength(97);
    expect(isCurrentRewardPool(pool)).toBe(true);
    expect(isCurrentRewardPool([...Array<number>(40).fill(2), ...Array<number>(60).fill(3)])).toBe(false);
  });

  it('shuffles slots without changing the exact cycle distribution', () => {
    const pool = shuffleRewardPool();
    const distribution = pool.reduce<Record<number, number>>((counts, reward) => {
      counts[reward] = (counts[reward] ?? 0) + 1;
      return counts;
    }, {});

    expect(pool).toHaveLength(100);
    expect(distribution).toEqual({ 2: 50, 3: 30, 4: 10, 5: 7, 10: 3 });
  });
});
