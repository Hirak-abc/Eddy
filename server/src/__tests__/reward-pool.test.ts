import { describe, expect, it } from 'vitest';
import { createRewardPool, shuffleRewardPool } from '../../../convex/rewardPool';

describe('per-shop reward cycles', () => {
  it('contains exactly the approved 100 outcomes and expected reward value', () => {
    const pool = createRewardPool();
    const distribution = pool.reduce<Record<number, number>>((counts, reward) => {
      counts[reward] = (counts[reward] ?? 0) + 1;
      return counts;
    }, {});

    expect(pool).toHaveLength(100);
    expect(distribution).toEqual({ 2: 40, 3: 20, 4: 10, 5: 10, 10: 20 });
    expect(pool.reduce((sum, reward) => sum + reward, 0) / pool.length).toBe(4.3);
    expect(pool.filter((reward) => reward >= 2 && reward <= 5)).toHaveLength(80);
  });

  it('shuffles slots without changing the exact cycle distribution', () => {
    const pool = shuffleRewardPool();
    const distribution = pool.reduce<Record<number, number>>((counts, reward) => {
      counts[reward] = (counts[reward] ?? 0) + 1;
      return counts;
    }, {});

    expect(pool).toHaveLength(100);
    expect(distribution).toEqual({ 2: 40, 3: 20, 4: 10, 5: 10, 10: 20 });
  });
});
