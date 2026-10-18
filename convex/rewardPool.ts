export const createRewardPool = () => [
  ...Array<number>(50).fill(2),
  ...Array<number>(30).fill(3),
  ...Array<number>(10).fill(4),
  ...Array<number>(7).fill(5),
  ...Array<number>(3).fill(10),
];

export const isCurrentRewardPool = (pool: number[]) => {
  const counts = pool.reduce<Record<number, number>>((result, reward) => {
    result[reward] = (result[reward] ?? 0) + 1;
    return result;
  }, {});
  return (
    pool.length === 100 &&
    counts[2] === 50 &&
    counts[3] === 30 &&
    counts[4] === 10 &&
    counts[5] === 7 &&
    counts[10] === 3 &&
    Object.keys(counts).length === 5
  );
};

const secureRandomIndex = (upperBound: number) => {
  const range = 0x1_0000_0000;
  const limit = Math.floor(range / upperBound) * upperBound;
  const random = new Uint32Array(1);

  do {
    globalThis.crypto.getRandomValues(random);
  } while (random[0] >= limit);

  return random[0] % upperBound;
};

export const shuffleRewardPool = () => {
  const slots = createRewardPool();
  for (let index = slots.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomIndex(index + 1);
    [slots[index], slots[swapIndex]] = [slots[swapIndex], slots[index]];
  }
  return slots;
};
