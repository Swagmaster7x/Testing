import { describe, expect, it } from 'vitest';
import { createRng, randomSeed } from '../../src/core/rng';

describe('seeded random numbers', () => {
  it('gives the same sequence for the same seed', () => {
    const a = createRng('table-1');
    const b = createRng('table-1');
    const seqA = Array.from({ length: 50 }, () => a.next());
    const seqB = Array.from({ length: 50 }, () => b.next());
    expect(seqA).toEqual(seqB);
  });

  it('gives different sequences for different seeds', () => {
    const a = Array.from({ length: 8 }, createRng('a').next);
    const b = Array.from({ length: 8 }, createRng('b').next);
    expect(a).not.toEqual(b);
  });

  it('stays in range', () => {
    const rng = createRng('range');
    for (let i = 0; i < 5000; i++) {
      const x = rng.next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      const n = rng.int(7);
      expect(Number.isInteger(n) && n >= 0 && n < 7).toBe(true);
    }
  });

  it('is roughly uniform', () => {
    const rng = createRng('uniform');
    const counts = new Array<number>(10).fill(0);
    const draws = 100_000;
    for (let i = 0; i < draws; i++) counts[rng.int(10)]!++;
    for (const c of counts) expect(Math.abs(c - draws / 10)).toBeLessThan(draws / 10 * 0.05);
  });

  it('shuffles into a permutation without touching the input', () => {
    const input = Array.from({ length: 40 }, (_, i) => i);
    const copy = input.slice();
    const out = createRng('deck').shuffle(input);
    expect(input).toEqual(copy);
    expect(out.slice().sort((x, y) => x - y)).toEqual(input);
    expect(out).not.toEqual(input);
    expect(createRng('deck').shuffle(input)).toEqual(out);
  });

  it('forks streams that depend only on the seed and the label', () => {
    const a = createRng('game');
    a.next();
    a.next();
    const fromUsed = a.fork('deal').next();
    const fromFresh = createRng('game').fork('deal').next();
    expect(fromUsed).toBe(fromFresh);
    expect(createRng('game').fork('deal').next()).not.toBe(createRng('game').fork('bots').next());
  });

  it('refuses bad arguments', () => {
    const rng = createRng('x');
    expect(() => rng.int(0)).toThrow();
    expect(() => rng.int(2.5)).toThrow();
    expect(() => rng.pick([])).toThrow();
  });

  it('makes fresh seeds that differ', () => {
    const seeds = new Set(Array.from({ length: 20 }, randomSeed));
    expect(seeds.size).toBe(20);
    for (const s of seeds) expect(s).toMatch(/^[0-9a-f]{16}$/);
  });
});
