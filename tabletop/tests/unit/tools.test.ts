/** The table tools: scorepads and the blind timer. */
import { describe, expect, it } from 'vitest';
import { clockText, DEFAULT_TIMER, jump, pause, position, schedule, start, STOPPED } from '../../src/tools/blinds';
import type { Pad } from '../../src/tools/scorepad';
import { addEntry, briscaHandWinner, checkPad, leaderOf, newPad, payments, totals, undoEntry, winnerOf } from '../../src/tools/scorepad';

const add = (pad: Pad, ...entries: Parameters<typeof addEntry>[1][]) => entries.reduce((p, e) => addEntry(p, e, 2), pad);

describe('scorepads', () => {
  it('dominoes: the winner of each hand scores; the first to the target wins', () => {
    let pad = newPad('dominoes', 'd', 1);
    expect(pad.target).toBe(200);
    pad = add(pad, { type: 'score', side: 0, points: 85 }, { type: 'score', side: 1, points: 120 }, { type: 'score', side: 0, points: 90 });
    expect(totals(pad)).toEqual([175, 120]);
    expect(winnerOf(pad)).toBeNull();
    expect(leaderOf(pad)).toBe(0);
    pad = add(pad, { type: 'score', side: 0, points: 30 });
    expect(winnerOf(pad)).toBe(0);
    expect(totals(undoEntry(pad, 3))).toEqual([175, 120]);
    expect(() => addEntry(pad, { type: 'score', side: 2, points: 5 }, 3)).toThrow();
    expect(() => addEntry(pad, { type: 'score', side: 0, points: -5 }, 3)).toThrow();
  });

  it('brisca: 61 of 120 wins a hand, 60–60 is a tie; hands won count to the target', () => {
    expect(briscaHandWinner(61)).toBe(0);
    expect(briscaHandWinner(59)).toBe(1);
    expect(briscaHandWinner(60)).toBeNull();
    let pad = add(newPad('brisca', 'b', 1), { type: 'hand', first: 70 }, { type: 'hand', first: 60 }, { type: 'hand', first: 30 }, { type: 'hand', first: 100 });
    expect(totals(pad)).toEqual([2, 1]);
    pad = add(pad, { type: 'hand', first: 64 });
    expect(winnerOf(pad)).toBe(0);
    expect(() => addEntry(pad, { type: 'hand', first: 121 }, 3)).toThrow();
  });

  it('mahjong: the discarder pays, or everyone (self-drawn), or everyone with the discarder paying double', () => {
    let pad = newPad('mahjong', 'm', 1);
    expect(totals(pad)).toEqual([25_000, 25_000, 25_000, 25_000]);
    pad = add(pad, { type: 'win', winner: 0, from: 2, amount: 8000, mode: 'discarder' });
    expect(totals(pad)).toEqual([33_000, 25_000, 17_000, 25_000]);
    pad = add(pad, { type: 'win', winner: 1, from: null, amount: 1000, mode: 'discarder' });
    expect(totals(pad)).toEqual([32_000, 28_000, 16_000, 24_000]);
    expect(payments({ type: 'win', winner: 3, from: 1, amount: 16, mode: 'half-gun' }, 4)).toEqual([
      [0, 16],
      [1, 32],
      [2, 16],
    ]);
    // Money is only moved, never made.
    expect(totals(pad).reduce((a, b) => a + b, 0)).toBe(100_000);
    expect(() => addEntry(pad, { type: 'win', winner: 1, from: 1, amount: 5, mode: 'discarder' }, 3)).toThrow();
    expect(winnerOf(pad)).toBeNull();
  });

  it('tally: rounds for everyone; the most points, or with low-wins the fewest, when someone reaches the target', () => {
    let pad = { ...newPad('tally', 't', 1), target: 100, lowWins: true };
    pad = add(pad, { type: 'round', points: [20, 5, 13] }, { type: 'round', points: [40, 30, 9] }, { type: 'round', points: [45, 2, 26] });
    expect(totals(pad)).toEqual([105, 37, 48]);
    expect(winnerOf(pad)).toBe(1);
    expect(leaderOf(pad)).toBe(1);
    expect(winnerOf({ ...pad, lowWins: false })).toBe(0);
    expect(() => addEntry(pad, { type: 'round', points: [1, 2] }, 3)).toThrow();
  });

  it('checks stored pads by replaying them', () => {
    const pad = add(newPad('dominoes', 'd', 1), { type: 'score', side: 1, points: 25 });
    expect(checkPad(JSON.parse(JSON.stringify(pad)))).toEqual(pad);
    expect(() => checkPad({ ...pad, entries: [{ type: 'hand', first: 50 }] })).toThrow();
    expect(() => checkPad({ ...pad, kind: 'bingo' })).toThrow();
  });
});

describe('the blind timer', () => {
  it('builds the usual schedule from the first big blind, with antes from a chosen level', () => {
    const levels = schedule({ minutes: 15, startBb: 2, anteFrom: 5 });
    expect(levels.slice(0, 6)).toEqual([
      { sb: 1, bb: 2, ante: 0 },
      { sb: 2, bb: 4, ante: 0 },
      { sb: 3, bb: 6, ante: 0 },
      { sb: 4, bb: 8, ante: 0 },
      { sb: 6, bb: 12, ante: 1 },
      { sb: 8, bb: 16, ante: 2 },
    ]);
    const big = schedule({ minutes: 20, startBb: 100, anteFrom: 0 });
    expect(big[2]).toEqual({ sb: 150, bb: 300, ante: 0 });
    expect(big.every((l, i) => i === 0 || l.bb > (big[i - 1]?.bb ?? 0))).toBe(true);
  });

  it('keeps time from when it started, pauses, and moves between levels by hand', () => {
    const s = DEFAULT_TIMER;
    const n = schedule(s).length;
    let c = start(STOPPED, 0);
    expect(position(c, s, 14 * 60_000, n)).toMatchObject({ level: 0, left: 60_000 });
    expect(position(c, s, 16 * 60_000, n)).toMatchObject({ level: 1, left: 14 * 60_000 });
    c = pause(c, 16 * 60_000);
    // Paused: time stands still.
    expect(position(c, s, 99 * 60_000, n)).toMatchObject({ level: 1, left: 14 * 60_000 });
    c = jump(c, s, 99 * 60_000, n, 1);
    expect(position(c, s, 99 * 60_000, n)).toMatchObject({ level: 2, left: 15 * 60_000 });
    c = jump(c, s, 99 * 60_000, n, -1);
    c = jump(c, s, 99 * 60_000, n, -1);
    expect(position(c, s, 99 * 60_000, n)).toMatchObject({ level: 0, left: 15 * 60_000 });
    c = jump(c, s, 0, n, -1);
    expect(position(c, s, 0, n).level).toBe(0);
    expect(clockText(14 * 60_000 + 59_001)).toBe('15:00');
    expect(clockText(61_000)).toBe('1:01');
  });
});
