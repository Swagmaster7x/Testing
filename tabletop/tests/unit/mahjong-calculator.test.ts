/** The Mahjong score calculator in Tools: the same scorer and payments as the table. */
import { describe, expect, it } from 'vitest';
import { calculate, calculateCardHand, contextOf, EMPTY_INPUT, fivesIn, overused, redPlaces, setFits, tilesWanted } from '../../src/games/mahjong/calculator';
import { STYLES } from '../../src/games/mahjong/rules';
import { HK_DEFAULTS, hongKong } from '../../src/games/mahjong/styles/hong-kong';

const m = (n: number) => n - 1;
const p = (n: number) => 8 + n;
const s = (n: number) => 17 + n;
const EAST = 27;
const RED = 33;
const PLUM = 34;
const ALL_CHOWS = [m(1), m(2), m(3), m(4), m(5), m(6), p(7), p(8), p(9), s(2), s(3), s(4), s(5), s(5)];

describe('the Mahjong calculator', () => {
  it('scores a concealed all-chows hand won by self-draw, and each player pays twice the base', () => {
    const r = calculate(hongKong, HK_DEFAULTS, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13 });
    expect(r.score?.lines.map((l) => l.id)).toEqual(['all-chows', 'self-drawn', 'concealed', 'no-flowers']);
    expect(r.score?.total).toBe(4);
    expect(r.payments).toEqual([96, -32, -32, -32]);
  });

  it('on a discard under half-gun, the discarder pays double; a seat flower counts', () => {
    const r = calculate(hongKong, HK_DEFAULTS, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13, from: 2, bonus: [PLUM] });
    expect(r.score?.total).toBe(3);
    expect(r.payments).toEqual([32, -8, -16, -8]);
  });

  it('counts laid-down sets, and tells a hand below the minimum from one that is no hand at all', () => {
    const hand = [m(1), m(1), m(1), m(2), m(3), m(4), m(6), m(7), m(8), EAST, EAST];
    const r = calculate(hongKong, HK_DEFAULTS, { ...EMPTY_INPUT, hand, winning: 10, sets: [{ type: 'pung', kind: RED, concealed: false }], from: 1 });
    expect(r.score?.lines.map((l) => l.id)).toEqual(['mixed-one-suit', 'dragon-pung', 'no-flowers']);
    expect(r.payments).toEqual([96, -48, -24, -24]);
    // A plain hand on a discard, with a flower that is not the seat's: one faan short of three.
    const low = calculate(hongKong, HK_DEFAULTS, { ...EMPTY_INPUT, hand: [m(1), m(2), m(3), m(4), m(5), m(6), p(7), p(8), p(9), s(2), s(3), s(4), m(9), m(9)], winning: 13, from: 1, sets: [], bonus: [PLUM + 1] });
    expect(low.belowMinimum).toBe(true);
    expect(low.payments).toEqual([]);
    const junk = calculate(hongKong, HK_DEFAULTS, { ...EMPTY_INPUT, hand: [m(1), m(3), m(5), m(7), m(9), p(1), p(3), p(5), p(7), p(9), s(1), s(3), s(5), s(7)], winning: 13 });
    expect(junk.score).toBeNull();
    expect(junk.belowMinimum).toBe(false);
  });

  it('counts the tiles still wanted and refuses a fifth copy or a chow from an 8', () => {
    expect(tilesWanted({ ...EMPTY_INPUT, hand: ALL_CHOWS.slice(0, 10) }, 13)).toBe(4);
    expect(tilesWanted({ ...EMPTY_INPUT, hand: ALL_CHOWS.slice(0, 7), sets: [{ type: 'kong', kind: RED, concealed: true }] }, 13)).toBe(4);
    expect(overused({ ...EMPTY_INPUT, hand: [RED, RED], sets: [{ type: 'pung', kind: RED, concealed: false }] })).toBe(RED);
    expect(setFits('chow', m(8))).toBe(false);
    expect(setFits('chow', s(7))).toBe(true);
    expect(setFits('pung', EAST)).toBe(true);
  });

  describe('Riichi', () => {
    const riichi = STYLES['riichi']!;
    // South (seat wind 1), on a discard from across.
    const base = { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13, from: 2 as const, seatWind: 1 };

    it('a riichi ron of 1 han 30 fu is 1,000 from the discarder, with the concealed-ron fu', () => {
      const r = calculate(riichi, riichi.defaults, { ...base, ready: 1 });
      expect(r.score?.lines.map((l) => l.id)).toContain('riichi');
      expect(r.payments).toEqual([1300, 0, -1300, 0]);
    });

    it('riichi, ippatsu, a dora and a red five make mangan', () => {
      const r = calculate(riichi, riichi.defaults, { ...base, ready: 1, oneShot: true, indicators: [m(4)], redFives: 1 });
      expect(r.score?.total).toBe(4);
      expect(r.payments).toEqual([8000, 0, -8000, 0]);
    });

    it('ura indicators count only after a riichi; double riichi is two han', () => {
      const plain = calculate(riichi, riichi.defaults, { ...base, ready: 0, underIndicators: [s(4)], oneShot: true });
      expect(plain.score).toBeNull();
      const r = calculate(riichi, riichi.defaults, { ...base, ready: 2, underIndicators: [s(4)] });
      expect(r.score?.total).toBe(4);
      expect(r.payments).toEqual([8000, 0, -8000, 0]);
    });

    it('offers one red five per suit present, and marks the sets’ fives first', () => {
      // 5 characters, and two 5 bamboo: at most two red fives.
      expect(fivesIn({ ...EMPTY_INPUT, hand: ALL_CHOWS })).toBe(2);
      const withSet = { ...EMPTY_INPUT, hand: [s(5)], sets: [{ type: 'chow' as const, kind: p(3), concealed: false }, { type: 'pung' as const, kind: s(5), concealed: false }], redFives: 3 };
      expect(fivesIn(withSet)).toBe(2);
      const reds = redPlaces(withSet);
      expect(reds.sets).toEqual([[false, false, true], [true, false, false]]);
      expect(reds.hand).toEqual([false]);
      // Every tile keeps its own id, and the red ones are copy 0.
      const ids = contextOf(withSet).tiles ?? [];
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('a Chinese Official hand', () => {
    const co = STYLES['chinese-official']!;

    it('self-drawn, the all-chows hand just reaches eight points, and each player pays 8 + 8', () => {
      const r = calculate(co, co.defaults, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13 });
      expect(r.score?.lines.map((l) => l.id)).toEqual(['co-fully-concealed', 'co-all-chows', 'co-short-straight', 'co-no-honours']);
      expect(r.score?.total).toBe(8);
      expect(r.payments).toEqual([48, -16, -16, -16]);
    });

    it('on a discard it is short of eight; the last tile of its kind lifts it to ten', () => {
      const short = calculate(co, co.defaults, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13, from: 2 });
      expect(short.belowMinimum).toBe(true);
      expect(short.score?.total).toBe(6);
      const last = calculate(co, co.defaults, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13, from: 2, lastOfKind: true });
      expect(last.score?.total).toBe(10);
      expect(last.payments).toEqual([34, -8, -18, -8]);
    });

    it('flowers add to what is paid but never toward the minimum', () => {
      const r = calculate(co, co.defaults, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13, from: 2, bonus: [PLUM, PLUM + 1, PLUM + 2] });
      expect(r.score?.total).toBe(9);
      expect(r.belowMinimum).toBe(true);
    });
  });

  describe('a Taiwanese hand of sixteen tiles and the winning one', () => {
    const tw = STYLES['taiwanese']!;
    // 1-2-3 and 4-5-6 characters, 7-8-9 dots, 2-3-4 and 5-6-7 bamboo, a pair of 9 dots; the 4 bamboo won it.
    const hand = [m(1), m(2), m(3), m(4), m(5), m(6), p(7), p(8), p(9), s(2), s(3), s(4), s(5), s(6), s(7), p(9), p(9)];
    const base = { ...EMPTY_INPUT, hand, winning: 11 };

    it('wants seventeen tiles (and one more for each kong)', () => {
      expect(tilesWanted({ ...EMPTY_INPUT, hand: hand.slice(0, 13) }, tw.rules(tw.defaults).handSize)).toBe(4);
      expect(tilesWanted(base, 16)).toBe(0);
      expect(tilesWanted({ ...EMPTY_INPUT, hand: hand.slice(0, 11), sets: [{ type: 'kong', kind: RED, concealed: true }] }, 16)).toBe(3);
    });

    it('East self-drawn: concealed and self-drawn and the dealer, base + tai × 20 from each', () => {
      const r = calculate(tw, tw.defaults, base);
      expect(r.score?.lines.map((l) => l.id)).toEqual(['tw-concealed-self-drawn', 'tw-dealer']);
      expect(r.payments).toEqual([540, -180, -180, -180]);
    });

    it('South wins on the dealer’s discard: the dealer pays its streak too', () => {
      const r = calculate(tw, tw.defaults, { ...base, seatWind: 1, from: 3, streak: 2 });
      expect(r.score?.total).toBe(3);
      expect(r.payments).toEqual([260, 0, 0, -260]);
    });
  });

  describe('Sichuan', () => {
    const sichuan = STYLES['sichuan']!;
    // Characters and dots only.
    const TWO_SUITS = [m(1), m(2), m(3), m(4), m(5), m(6), p(7), p(8), p(9), p(2), p(3), p(4), m(5), m(5)];

    it('a basic hand on a discard: 1 point from the thrower alone', () => {
      const r = calculate(sichuan, sichuan.defaults, { ...EMPTY_INPUT, hand: TWO_SUITS, winning: 13, from: 2 });
      expect(r.score?.total).toBe(0);
      expect(r.payments).toEqual([1, 0, -1, 0]);
    });

    it('self-drawn: each of the three pays the points and 1 more', () => {
      const r = calculate(sichuan, sichuan.defaults, { ...EMPTY_INPUT, hand: TWO_SUITS, winning: 13 });
      expect(r.payments).toEqual([6, -2, -2, -2]);
    });

    it('one suit with a kong: 2 fan and a root, 8 points; on a kong’s throw, 4 fan, capped at 16', () => {
      const hand = [m(1), m(2), m(3), m(4), m(5), m(6), m(6), m(7), m(8), m(5), m(5)];
      const r = calculate(sichuan, sichuan.defaults, { ...EMPTY_INPUT, hand, winning: 10, from: 1, sets: [{ type: 'kong', kind: m(9), concealed: true }] });
      expect(r.score?.lines.map((l) => l.id)).toEqual(['sc-pure-suit', 'sc-root']);
      expect(r.payments).toEqual([8, -8, 0, 0]);
      const k = calculate(sichuan, sichuan.defaults, { ...EMPTY_INPUT, hand, winning: 10, from: 1, kongDiscard: true, sets: [{ type: 'kong', kind: m(9), concealed: true }] });
      expect(k.score?.total).toBe(4);
      expect(k.payments).toEqual([16, -16, 0, 0]);
    });

    it('a hand of three suits is no Sichuan hand', () => {
      const r = calculate(sichuan, sichuan.defaults, { ...EMPTY_INPUT, hand: ALL_CHOWS, winning: 13 });
      expect(r.score).toBeNull();
      expect(r.belowMinimum).toBe(false);
    });
  });

  describe('American', () => {
    const american = STYLES['american']!;

    it('a 25-point hand on a discard: the thrower pays 50, the other two 25', () => {
      const r = calculateCardHand(american, american.defaults, 25, false, 2);
      expect(r.value).toBe(25);
      expect(r.payments).toEqual([100, -25, -50, -25]);
    });

    it('self-picked: everyone pays double; jokerless doubles the value', () => {
      expect(calculateCardHand(american, american.defaults, 25, false, null).payments).toEqual([150, -50, -50, -50]);
      const j = calculateCardHand(american, american.defaults, 25, true, 1);
      expect(j.value).toBe(50);
      expect(j.payments).toEqual([200, -100, -50, -50]);
    });

    it('the flat table: everyone pays the value; with no jokerless bonus the value stands', () => {
      const flat = { ...american.defaults, payment: 'flat', jokerless: 'off' };
      const r = calculateCardHand(american, flat, 30, true, 3);
      expect(r.value).toBe(30);
      expect(r.payments).toEqual([90, -30, -30, -30]);
    });
  });
});
