/**
 * Golden cases for the Hong Kong rules file (docs/rules/mahjong-hk.md): every pattern in the faan
 * table, the stacking rules, the minimum, the limit, the point tables and the payments.
 */
import { describe, expect, it } from 'vitest';
import type { HandScore, Meld, StyleOptions, WinContext } from '../../src/games/mahjong/core/style';
import { parseKinds, tileId } from '../../src/games/mahjong/core/tiles';
import { basePoints, HK_DEFAULTS, hongKong, hkScoreAny } from '../../src/games/mahjong/styles/hong-kong';

/** Pattern tests run without flowers and without a minimum, so each pattern shows on its own. */
const PLAIN: StyleOptions = { ...HK_DEFAULTS, flowers: 'off', minFaan: 0 };

let copy = 0;
function meld(type: Meld['type'], tiles: string, concealed = false): Meld {
  const ids = parseKinds(tiles).map((k) => tileId(k, copy++ % 4));
  return { type, tiles: ids, claimed: concealed ? null : (ids[0] ?? null), from: concealed ? null : 3, concealed, added: false };
}

interface Spec {
  readonly hand: string;
  readonly tile: string;
  readonly melds?: readonly Meld[];
  readonly selfDrawn?: boolean;
  readonly bonus?: string;
  readonly seatWind?: number;
  readonly prevailing?: number;
  readonly flags?: Partial<WinContext>;
}

/** A win context: `hand` is the concealed tiles with the winning tile included. */
function ctx(p: Spec): WinContext {
  const tile = parseKinds(p.tile)[0] as number;
  return {
    seat: 1,
    tile,
    selfDrawn: p.selfDrawn ?? false,
    from: p.selfDrawn ? null : 0,
    concealed: parseKinds(p.hand),
    melds: p.melds ?? [],
    bonus: p.bonus ? parseKinds(p.bonus) : [],
    seatWind: p.seatWind ?? 1,
    prevailingWind: p.prevailing ?? 2,
    dealer: false,
    lastTile: false,
    lastDiscard: false,
    kongs: 0,
    robbed: false,
    heavenly: false,
    earthly: false,
    ...p.flags,
  };
}

function score(p: Spec, options: StyleOptions = PLAIN): HandScore {
  const s = hongKong.score(ctx(p), options);
  if (!s) throw new Error(`${p.hand} does not win`);
  return s;
}

const lines = (s: HandScore) => Object.fromEntries(s.lines.map((l) => [l.id, l.value]));

describe('Hong Kong faan: how the hand is built', () => {
  it('all chows: four chows and a pair', () => {
    const s = score({ hand: '123m 456m 789p 234s 55s', tile: '5s', melds: [] });
    expect(lines(s)).toEqual({ 'all-chows': 1, concealed: 1 });
    expect(s.total).toBe(2);
  });

  it('all pungs: four pungs or kongs and a pair (exposed sets: no concealed bonus)', () => {
    const s = score({ hand: '222m 555p 33p', tile: '3p', melds: [meld('pung', '777s'), meld('kong', '8888m')] });
    expect(lines(s)).toEqual({ 'all-pungs': 3 });
  });

  it('mixed one suit: one suit with honours', () => {
    const s = score({ hand: '123m 456m 789m NNN 55m', tile: '5m', seatWind: 1, prevailing: 2 });
    expect(lines(s)).toEqual({ 'mixed-one-suit': 3, concealed: 1 });
  });

  it('pure one suit: 7 by default, 6 with the option', () => {
    const p: Spec = { hand: '123p 456p 789p 111p 55p', tile: '5p' };
    expect(lines(score(p))).toEqual({ 'pure-one-suit': 7, concealed: 1 });
    expect(lines(score(p, { ...PLAIN, fullFlush: 6 }))['pure-one-suit']).toBe(6);
  });

  it('mixed orphans adds to all pungs', () => {
    const s = score({ hand: 'EEE NNN 99s', tile: '9s', melds: [meld('pung', '111m'), meld('pung', '999p')], seatWind: 1, prevailing: 2 });
    expect(lines(s)).toEqual({ 'all-pungs': 3, 'mixed-orphans': 1 });
    expect(s.total).toBe(4);
  });

  it('seven pairs wins only with the option, and adds the concealed bonus', () => {
    const p: Spec = { hand: '11m 33m 55p 77p 99s EE RdRd', tile: 'Rd' };
    expect(hongKong.score(ctx(p), PLAIN)).toBeNull();
    const s = score(p, { ...PLAIN, sevenPairs: 4 });
    expect(lines(s)).toEqual({ 'seven-pairs': 4, concealed: 1 });
    expect(lines(score(p, { ...PLAIN, sevenPairs: 3 }))['seven-pairs']).toBe(3);
  });

  it('a hand is read the way that scores most: 111222333m as pungs, not chows', () => {
    const s = score({ hand: '111222333m 99s', tile: '9s', selfDrawn: true, melds: [meld('pung', '777p')] });
    expect(lines(s)).toEqual({ 'all-pungs': 3, 'self-drawn': 1 });
    // Fully concealed, the same tiles are four concealed pungs: a limit hand.
    expect(score({ hand: '111222333m 777p 99s', tile: '9s', selfDrawn: true }).lines).toEqual([{ id: 'four-concealed-pungs', value: 10 }]);
  });

  it('a chicken hand scores nothing, and wins only without a minimum', () => {
    const p: Spec = { hand: '123m 456p 99s', tile: '9s', melds: [meld('chow', '789p'), meld('pung', '555s')] };
    const s = score(p);
    expect(s.lines).toEqual([]);
    expect(s.total).toBe(0);
    expect(s.base).toBe(1);
    expect(hongKong.score(ctx(p), { ...PLAIN, minFaan: 1 })).toBeNull();
  });
});

describe('Hong Kong faan: honour sets', () => {
  it('a dragon pung or kong scores 1 each', () => {
    expect(lines(score({ hand: '123m 456p RdRdRd 55s', tile: '5s', melds: [meld('chow', '789s')] }))).toEqual({ 'dragon-pung': 1 });
    const two = score({ hand: '123m RdRdRd 55s', tile: '5s', melds: [meld('chow', '789s'), meld('kong', 'GdGdGdGd')] });
    expect(two.lines.find((l) => l.id === 'dragon-pung')).toEqual({ id: 'dragon-pung', value: 2, times: 2 });
  });

  it('seat wind and prevailing wind: 1 each, 2 for East in the East round', () => {
    const base: Spec = { hand: '123m 456p SSS 55s', tile: '5s', melds: [meld('chow', '789s')] };
    expect(lines(score({ ...base, seatWind: 1, prevailing: 2 }))).toEqual({ 'seat-wind': 1 });
    expect(lines(score({ ...base, seatWind: 3, prevailing: 1 }))).toEqual({ 'prevailing-wind': 1 });
    expect(lines(score({ ...base, hand: '123m 456p EEE 55s', seatWind: 0, prevailing: 0 }))).toEqual({ 'seat-wind': 1, 'prevailing-wind': 1 });
  });

  it('small three dragons absorbs its two dragon pungs (or stacks them)', () => {
    const p: Spec = { hand: 'RdRdRd GdGdGd WdWd', tile: 'Wd', melds: [meld('chow', '123m'), meld('chow', '456m')] };
    expect(lines(score(p))).toEqual({ 'small-dragons': 5, 'mixed-one-suit': 3 });
    expect(lines(score(p, { ...PLAIN, smallDragons: 4 }))['small-dragons']).toBe(4);
    expect(lines(score(p, { ...PLAIN, namedHands: 'stack' }))).toEqual({ 'small-dragons': 5, 'mixed-one-suit': 3, 'dragon-pung': 2 });
  });

  it('great three dragons: 8, or the limit with the option', () => {
    const p: Spec = { hand: 'RdRdRd WdWdWd 55m', tile: '5m', melds: [meld('pung', 'GdGdGd'), meld('chow', '123m')] };
    expect(lines(score(p))).toEqual({ 'great-dragons': 8, 'mixed-one-suit': 3 });
    const capped = score(p);
    expect(capped.raw).toBe(11);
    expect(capped.total).toBe(10);
    expect(capped.limit).toBe(true);
    const limit = score(p, { ...PLAIN, greatDragons: 'limit' });
    expect(limit.lines).toEqual([{ id: 'great-dragons', value: 10 }]);
  });

  it('small four winds absorbs its seat and prevailing wind pungs (or stacks them)', () => {
    const p: Spec = { hand: 'EEE SSS NN', tile: 'N', melds: [meld('pung', 'WWW'), meld('chow', '123m')], seatWind: 1, prevailing: 0 };
    expect(lines(score(p))).toEqual({ 'small-winds': 6, 'mixed-one-suit': 3 });
    expect(lines(score(p, { ...PLAIN, namedHands: 'stack' }))).toEqual({ 'small-winds': 6, 'mixed-one-suit': 3, 'seat-wind': 1, 'prevailing-wind': 1 });
    expect(score(p, { ...PLAIN, smallWinds: 'limit' }).lines).toEqual([{ id: 'small-winds', value: 10 }]);
  });
});

describe('Hong Kong faan: how the hand is won', () => {
  const open: Spec = { hand: '123m 456p 55s', tile: '5s', melds: [meld('chow', '789s'), meld('pung', 'RdRdRd')] };

  it('self-drawn: 1', () => {
    expect(lines(score({ ...open, selfDrawn: true }))).toEqual({ 'dragon-pung': 1, 'self-drawn': 1 });
  });

  it('concealed: 1 on a discard; with a self-draw 2, or 3 under the option', () => {
    const closed: Spec = { hand: '123m 456p 789s RdRdRd 55s', tile: '5s' };
    expect(lines(score(closed))).toEqual({ 'dragon-pung': 1, concealed: 1 });
    expect(lines(score({ ...closed, selfDrawn: true }))).toEqual({ 'dragon-pung': 1, 'self-drawn': 1, concealed: 1 });
    expect(lines(score({ ...closed, selfDrawn: true }, { ...PLAIN, concealedSelfDrawn: 3 }))).toEqual({ 'dragon-pung': 1, 'concealed-self-drawn': 3 });
  });

  it('a concealed kong keeps the hand concealed', () => {
    expect(lines(score({ hand: '123m 456p 789s 55s', tile: '5s', melds: [meld('kong', 'RdRdRdRd', true)] }))).toEqual({ 'dragon-pung': 1, concealed: 1 });
  });

  it('robbing a kong: 1', () => {
    expect(lines(score({ ...open, flags: { robbed: true } }))).toEqual({ 'dragon-pung': 1, 'robbing-kong': 1 });
  });

  it('win by a kong: 1 (and self-drawn); a double kong: 8', () => {
    expect(lines(score({ ...open, selfDrawn: true, flags: { kongs: 1 } }))).toEqual({ 'dragon-pung': 1, 'self-drawn': 1, 'win-by-kong': 1 });
    expect(lines(score({ ...open, selfDrawn: true, flags: { kongs: 2 } }))).toEqual({ 'dragon-pung': 1, 'self-drawn': 1, 'double-kong': 8 });
  });

  it('the last tile (self-drawn) and the last discard: 1 each', () => {
    expect(lines(score({ ...open, selfDrawn: true, flags: { lastTile: true } }))).toEqual({ 'dragon-pung': 1, 'self-drawn': 1, 'last-tile': 1 });
    expect(lines(score({ ...open, flags: { lastDiscard: true } }))).toEqual({ 'dragon-pung': 1, 'last-discard': 1 });
  });
});

describe('Hong Kong faan: flowers', () => {
  const FLOWERS: StyleOptions = { ...HK_DEFAULTS, minFaan: 0 };
  const open: Spec = { hand: '123m 456p 55s', tile: '5s', melds: [meld('chow', '789s'), meld('chow', '234p')], seatWind: 1 };

  it('a seat flower and a seat season: 1 each (South is number 2)', () => {
    expect(lines(score({ ...open, bonus: 'F2 F3' }, FLOWERS))).toEqual({ 'all-chows': 1, 'seat-flower': 1 });
    const both = score({ ...open, bonus: 'F2 S2 F4' }, FLOWERS);
    expect(both.lines.find((l) => l.id === 'seat-flower')).toEqual({ id: 'seat-flower', value: 2, times: 2 });
  });

  it('a full set of four: 2 by default (1 or 3 by option), in place of the seat flower in it', () => {
    expect(lines(score({ ...open, bonus: 'F1 F2 F3 F4' }, FLOWERS))).toEqual({ 'all-chows': 1, 'flower-set': 2 });
    expect(lines(score({ ...open, bonus: 'F1 F2 F3 F4' }, { ...FLOWERS, flowerSet: 3 }))['flower-set']).toBe(3);
    expect(lines(score({ ...open, bonus: 'S1 S2 S3 S4 F2' }, { ...FLOWERS, flowerSet: 1 }))).toEqual({ 'all-chows': 1, 'flower-set': 1, 'seat-flower': 1 });
  });

  it('no flowers: 1, or 0 by option; nothing when the game has no flowers', () => {
    expect(lines(score(open, FLOWERS))).toEqual({ 'all-chows': 1, 'no-flowers': 1 });
    expect(lines(score(open, { ...FLOWERS, noFlowers: 0 }))).toEqual({ 'all-chows': 1 });
    expect(lines(score(open, PLAIN))).toEqual({ 'all-chows': 1 });
  });
});

describe('Hong Kong limit hands', () => {
  const limit = (p: Spec, options: StyleOptions = PLAIN) => {
    const s = score(p, options);
    expect(s.limit).toBe(true);
    expect(s.total).toBe(options.limit);
    return s.lines.map((l) => l.id);
  };

  it('thirteen orphans', () => {
    expect(limit({ hand: '19m 19p 19s E S W N Wd Gd Rd Rd', tile: 'Rd' })).toEqual(['thirteen-orphans']);
  });
  it('nine gates', () => {
    expect(limit({ hand: '1112345678999m 5m', tile: '5m', selfDrawn: true })).toEqual(['nine-gates']);
  });
  it('all honours', () => {
    expect(limit({ hand: 'EEE SSS RdRdRd GdGd', tile: 'Gd', melds: [meld('pung', 'NNN')] })).toEqual(['all-honours']);
  });
  it('all terminals', () => {
    expect(limit({ hand: '111m 999m 111p 999p 11s', tile: '1s' })).toEqual(['all-terminals', 'four-concealed-pungs']);
  });
  it('four concealed pungs: self-drawn, or a discard that completes the pair, but not a discard that completes a pung', () => {
    expect(limit({ hand: '222m 444p 666s RdRdRd 88s', tile: '6s', selfDrawn: true })).toContain('four-concealed-pungs');
    expect(limit({ hand: '222m 444p 666s RdRdRd 88s', tile: '8s' })).toContain('four-concealed-pungs');
    const s = score({ hand: '222m 444p 666s RdRdRd 88s', tile: '6s' });
    expect(s.lines.map((l) => l.id)).not.toContain('four-concealed-pungs');
    expect(lines(s)).toEqual({ 'all-pungs': 3, 'dragon-pung': 1, concealed: 1 });
  });
  it('all kongs', () => {
    expect(limit({ hand: '55p', tile: '5p', melds: [meld('kong', '2222m'), meld('kong', '3333s'), meld('kong', '4444s', true), meld('kong', '6666p')] })).toContain('all-kongs');
  });
  it('great four winds', () => {
    expect(limit({ hand: 'EEE SSS WWW 55m', tile: '5m', melds: [meld('pung', 'NNN')] })).toContain('great-winds');
  });
  it('heavenly and earthly hands', () => {
    expect(limit({ hand: '123m 456p 789s 234s 55s', tile: '5s', selfDrawn: true, flags: { heavenly: true, dealer: true } })).toEqual(['heavenly']);
    expect(limit({ hand: '123m 456p 789s 234s 55s', tile: '5s', flags: { earthly: true } })).toEqual(['earthly']);
  });
  it('a limit hand adds nothing else (flowers, winds) and the limit follows the option', () => {
    expect(score({ hand: 'EEE SSS RdRdRd GdGd', tile: 'Gd', melds: [meld('pung', 'NNN')], bonus: 'F2 S2' }, { ...HK_DEFAULTS, limit: 13 }).total).toBe(13);
    expect(score({ hand: '19m 19p 19s E S W N Wd Gd Rd Rd', tile: 'Rd' }, { ...PLAIN, limit: 8 }).total).toBe(8);
  });
});

describe('Hong Kong: the minimum, the limit and the point tables', () => {
  const two: Spec = { hand: '123m 456m 789p 234s 55s', tile: '5s' };
  it('a hand below the minimum is not a win; at the minimum it is', () => {
    expect(hongKong.score(ctx(two), { ...PLAIN, minFaan: 3 })).toBeNull();
    expect(hongKong.score(ctx({ ...two, selfDrawn: true }), { ...PLAIN, minFaan: 3 })?.total).toBe(3);
    expect(hkScoreAny(ctx(two), { ...PLAIN, minFaan: 3 })?.total).toBe(2);
  });

  it('a total above the limit is capped and paid at the limit', () => {
    const s = score({ hand: '123p 456p 789p 111p 55p', tile: '5p', selfDrawn: true, flags: { lastTile: true } }, { ...PLAIN, limit: 8 });
    expect(s.raw).toBe(10);
    expect(s.total).toBe(8);
    expect(s.base).toBe(64);
  });

  it('the three point tables', () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => basePoints(f, 'half-spicy'))).toEqual([1, 2, 4, 8, 16, 24, 32, 48, 64, 96, 128]);
    expect([0, 3, 5, 8, 10, 13].map((f) => basePoints(f, 'full-spicy'))).toEqual([1, 8, 32, 256, 1024, 8192]);
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => basePoints(f, 'old-style'))).toEqual([1, 2, 4, 8, 16, 16, 16, 32, 32, 32, 64]);
  });
});

describe('Hong Kong payments', () => {
  const win = (seat: number, from: number | null, base: number, robbed = false) => ({ seat, from, tile: '5s.0', robbed, score: { lines: [], raw: 0, total: 0, limit: false, unit: 'faan', base } });
  const settle = (wins: ReturnType<typeof win>[], o: StyleOptions = HK_DEFAULTS) => hongKong.settle({ wins, dealer: 0, seats: 4 }, o);

  it('self-drawn: each of the others pays 2B', () => {
    expect(settle([win(1, null, 8)])).toEqual([-16, 48, -16, -16]);
  });
  it('half-gun: the discarder pays 2B, the others B', () => {
    expect(settle([win(1, 2, 8)])).toEqual([-8, 32, -16, -8]);
  });
  it('full-gun: the discarder pays 4B alone', () => {
    expect(settle([win(1, 2, 8)], { ...HK_DEFAULTS, discardPays: 'full-gun' })).toEqual([0, 32, -32, 0]);
  });
  it('robbing a kong is paid as a discard by the player who added', () => {
    expect(settle([win(3, 0, 4, true)])).toEqual([-8, -4, -4, 16]);
  });
  it('two winners on one discard are each paid, never by each other', () => {
    expect(settle([win(1, 0, 8), win(3, 0, 4)])).toEqual([-24, 24, -12, 12]);
    expect(settle([win(1, 0, 8), win(3, 0, 4)], { ...HK_DEFAULTS, discardPays: 'full-gun' })).toEqual([-48, 32, 0, 16]);
  });
  it('the dealer pays and receives the same; payments add up to zero', () => {
    for (const d of [settle([win(0, null, 16)]), settle([win(0, 1, 16)]), settle([win(2, 0, 16)])]) expect(d.reduce((a, b) => a + b, 0)).toBe(0);
    expect(settle([win(0, null, 16)])).toEqual([96, -32, -32, -32]);
  });
});
