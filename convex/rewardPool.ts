export const createRewardPool = () => [
  ...Array<number>(40).fill(2),
  ...Array<number>(20).fill(3),
  ...Array<number>(10).fill(4),
  ...Array<number>(10).fill(5),
  ...Array<number>(20).fill(10),
];

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
