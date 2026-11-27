/**
 * Tiles from ready (shanten) and tile acceptance, checked against the `syanten` package (a test
 * oracle only, never shipped) and against a second, plain search of our own.
 *
 * `syanten` reads each suit greedily (most complete sets first), so on a few hands in a hundred
 * it misses a better reading and reports one more than the true number. The tests require our
 * number never to be higher than its, equal on nearly every hand, and on each hand where they
 * differ, a reading that really reaches our number.
 */
import syanten from 'syanten';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { acceptance, bestReading, discardChoices, shanten, shantenOrphans, shantenSevenPairs, shantenStandard } from '../../src/games/mahjong/core/shanten';
import { countsOfKinds, parseKinds, PLAYING_KINDS } from '../../src/games/mahjong/core/tiles';

const toArr = (c: readonly number[]) => [c.slice(0, 9), c.slice(9, 18), c.slice(18, 27), c.slice(27, 34)] as unknown as syanten.HaiArr;
const counts = (text: string) => countsOfKinds(parseKinds(text));
const STANDARD = { shapes: { sevenPairs: false, thirteenOrphans: false }, sets: 4 };
const ALL = { shapes: { sevenPairs: true, thirteenOrphans: true }, sets: 4 };

function randomHand(rng: ReturnType<typeof createRng>, size: number): number[] {
  const pool: number[] = [];
  for (let k = 0; k < PLAYING_KINDS; k++) for (let i = 0; i < 4; i++) pool.push(k);
  const c = new Array<number>(PLAYING_KINDS).fill(0);
  for (const k of rng.shuffle(pool).slice(0, size)) c[k] = (c[k] ?? 0) + 1;
  return c;
}

/** The reading uses exactly the hand's tiles and is worth the number it claims. */
function checkReading(c: readonly number[], need: number, value: number): void {
  const r = bestReading(c, need);
  expect(r.shanten).toBe(value);
  const used = new Array<number>(PLAYING_KINDS).fill(0);
  for (const s of r.sets) for (const k of s.type === 'pung' ? [s.kind, s.kind, s.kind] : [s.kind, s.kind + 1, s.kind + 2]) used[k] = (used[k] ?? 0) + 1;
  for (const [a, b] of r.partials) {
    used[a] = (used[a] ?? 0) + 1;
    used[b] = (used[b] ?? 0) + 1;
  }
  if (r.pair !== null) used[r.pair] = (used[r.pair] ?? 0) + 2;
  for (const k of r.loose) used[k] = (used[k] ?? 0) + 1;
  expect(used).toEqual([...c]);
  const sets = r.sets.length;
  expect(2 * need - 2 * sets - Math.min(r.partials.length, need - sets) - (r.pair === null ? 0 : 1)).toBe(value);
}

describe('shanten: known hands', () => {
  it('a complete hand is -1, a ready hand 0', () => {
    expect(shantenStandard(counts('123m 456m 789m 123p 55p'), 4)).toBe(-1);
    expect(shantenStandard(counts('123m 456m 789m 123p 5p'), 4)).toBe(0);
    expect(shantenStandard(counts('123m 456m 789m 13p 5s'), 4)).toBe(1);
  });

  it('melds reduce the sets still to make', () => {
    expect(shantenStandard(counts('123m 5p'), 1)).toBe(0);
    expect(shantenStandard(counts('55p'), 0)).toBe(-1);
  });

  it('nine gates is ready on every tile of its suit', () => {
    const c = counts('1112345678999m');
    const a = acceptance(c, 0, STANDARD);
    expect(a.shanten).toBe(0);
    expect(a.kinds).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
    // Four of each, less those held: 36 - 13.
    expect(a.count).toBe(23);
  });

  it('seven pairs and thirteen orphans count their own way', () => {
    expect(shantenSevenPairs(counts('11m 22m 33p 44p 55s 66s E'))).toBe(0);
    expect(shantenOrphans(counts('19m 19p 19s E S W N Wd Gd 5m'))).toBe(1);
    expect(shanten(counts('11m 22m 33p 44p 55s 66s E'), 0, ALL)).toBe(0);
    expect(shanten(counts('11m 22m 33p 44p 55s 66s E'), 0, STANDARD)).toBeGreaterThan(0);
  });

  it('acceptance counts only the copies not seen', () => {
    const c = counts('123m 456m 789m 123p 5p');
    expect(acceptance(c, 0, STANDARD).count).toBe(3);
    const unseen = new Array<number>(PLAYING_KINDS).fill(4);
    unseen[13] = 1;
    expect(acceptance(c, 0, STANDARD, unseen).count).toBe(1);
  });

  it('the best discards keep the hand closest to ready, then accept the most tiles', () => {
    const choices = discardChoices(counts('123m 456m 789m 13p 5s E'), 0, STANDARD);
    expect(choices[0]?.shanten).toBe(1);
    expect([31 - 4, 22]).toContain(choices[0]?.kind);
    expect(choices[choices.length - 1]?.shanten).toBeGreaterThanOrEqual(choices[0]?.shanten ?? 0);
  });
});

describe('shanten against the syanten package', () => {
  it('never higher, equal on nearly every hand, and every difference backed by a real reading', () => {
    const rng = createRng('oracle');
    let equal = 0;
    let total = 0;
    const sizes = [14, 13, 11, 10, 8, 7, 5, 4, 2, 1];
    for (let i = 0; i < 3000; i++) {
      const size = sizes[i % sizes.length] as number;
      const c = randomHand(rng, size);
      const need = 4 - Math.floor((14 - size) / 3);
      const ours = shantenStandard(c, need);
      const theirs = syanten.syanten(toArr(c));
      total++;
      expect(ours).toBeLessThanOrEqual(theirs);
      if (ours === theirs) equal++;
      else checkReading(c, need, ours);
    }
    expect(equal / total).toBeGreaterThan(0.99);
  }, 120_000);

  it('a second, plain search finds the same number', () => {
    const rng = createRng('plain');
    for (let i = 0; i < 300; i++) {
      const size = [14, 13, 11, 8][i % 4] as number;
      const c = randomHand(rng, size);
      const need = 4 - Math.floor((14 - size) / 3);
      expect(bestReading(c, need).shanten).toBe(shantenStandard(c, need));
    }
  }, 60_000);

  it('seven pairs and thirteen orphans agree exactly', () => {
    const rng = createRng('special');
    for (let i = 0; i < 2000; i++) {
      const c = randomHand(rng, i % 2 === 0 ? 13 : 14);
      expect(shantenSevenPairs(c)).toBe(syanten.syanten7(toArr(c)));
      expect(shantenOrphans(c)).toBe(syanten.syanten13(toArr(c)));
    }
  }, 60_000);

  it('acceptance agrees with syanten on every hand where the shanten numbers agree', () => {
    const rng = createRng('accept');
    let compared = 0;
    let same = 0;
    for (let i = 0; i < 260; i++) {
      const c = randomHand(rng, 13);
      const ours = acceptance(c, 0, STANDARD);
      if (syanten.syanten(toArr(c)) !== ours.shanten) continue;
      const theirs: number[] = [];
      let agree = true;
      for (let k = 0; k < PLAYING_KINDS; k++) {
        if ((c[k] ?? 0) >= 4) continue;
        const h = [...c];
        h[k] = (h[k] ?? 0) + 1;
        const s = syanten.syanten(toArr(h));
        if (s !== shantenStandard(h, 4)) agree = false;
        if (s < ours.shanten) theirs.push(k);
      }
      if (!agree) continue;
      compared++;
      expect(ours.kinds).toEqual(theirs);
      // Every tile syanten's own acceptance (hairi) names with a copy left, we name too. (It never
      // tries an honour the hand does not hold, so it can name fewer; it also tries a fifth copy.)
      const hairi = syanten.hairi(toArr(c)) as { wait?: Record<string, number> };
      const named = Object.entries(hairi.wait ?? {})
        .filter(([, left]) => left > 0)
        .map(([code]) => 'mpsz'.indexOf(code[1] ?? '') * 9 + Number(code[0]) - 1);
      for (const k of named) expect(ours.kinds).toContain(k);
      if (named.length === ours.kinds.length) same++;
    }
    expect(compared).toBeGreaterThan(200);
    expect(same / compared).toBeGreaterThan(0.95);
  }, 120_000);
});
