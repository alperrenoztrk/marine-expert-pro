/* Seedable random helpers (deterministic when seed provided). */

export type Rng = () => number; // [0, 1)

// Mulberry32 PRNG: fast, simple, deterministic.
// Seed is coerced to uint32.
export const createSeededRng = (seed: number): Rng => {
  let t = (seed >>> 0) || 1;
  return () => {
    t += 0x6D2B79F5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

export const shuffleArray = <T,>(items: readonly T[], rng: Rng = Math.random): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const pickRandomUnique = <T,>(
  items: readonly T[],
  count: number,
  rng: Rng = Math.random
): T[] => {
  const n = Math.max(0, Math.min(count, items.length));
  if (n === items.length) return shuffleArray(items, rng);
  return shuffleArray(items, rng).slice(0, n);
};

