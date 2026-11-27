/** The Mahjong score calculator in Tools: the same scorer and payments as the table. */
import { describe, expect, it } from 'vitest';
import { calculate, EMPTY_INPUT, overused, setFits, tilesWanted } from '../../src/games/mahjong/calculator';
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
});
