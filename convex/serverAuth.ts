export const assertServerSecret = (provided: string): void => {
  const expected = process.env.EDDY_CONVEX_SECRET;
  if (!expected || provided !== expected) {
    throw new Error("UNAUTHORIZED");
  }
};
