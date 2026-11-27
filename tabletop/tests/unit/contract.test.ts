import { describe, expect, it } from 'vitest';
import { findLegal, outcomePoints, resignationOutcome, sameAction } from '../../src/core/contract';
import type { Outcome } from '../../src/core/contract';
import { noughts } from '../../src/games/noughts/rules';

describe('outcome points', () => {
  it('gives 1 for a win, 0 for a loss and half each for a two-player draw', () => {
    const win: Outcome = { reason: 'line', results: [{ seat: 0, place: 1, score: 1 }, { seat: 1, place: 2, score: 0 }] };
    expect(outcomePoints(win, 0)).toBe(1);
    expect(outcomePoints(win, 1)).toBe(0);
    const draw: Outcome = { reason: 'board-full', results: [{ seat: 0, place: 1, score: 0.5 }, { seat: 1, place: 1, score: 0.5 }] };
    expect(outcomePoints(draw, 0)).toBe(0.5);
    expect(outcomePoints(draw, 1)).toBe(0.5);
  });

  it('shares places fairly in a four-seat game with a tie', () => {
    const o: Outcome = {
      reason: 'test',
      results: [
        { seat: 0, place: 1, score: 3 },
        { seat: 1, place: 2, score: 1 },
        { seat: 2, place: 2, score: 1 },
        { seat: 3, place: 4, score: 0 },
      ],
    };
    expect(outcomePoints(o, 0)).toBe(1);
    expect(outcomePoints(o, 1)).toBeCloseTo(0.5);
    expect(outcomePoints(o, 2)).toBeCloseTo(0.5);
    expect(outcomePoints(o, 3)).toBe(0);
  });

  it('counts partners as one side: a partnership win is a whole win for both', () => {
    const teams = [
      [0, 2],
      [1, 3],
    ];
    const win: Outcome = { reason: 'match', teams, results: [0, 1, 2, 3].map((seat) => ({ seat, place: seat % 2 === 0 ? 1 : 2, score: 0 })) };
    expect([0, 1, 2, 3].map((seat) => outcomePoints(win, seat))).toEqual([1, 0, 1, 0]);
    const tie: Outcome = { reason: 'tie', teams, results: [0, 1, 2, 3].map((seat) => ({ seat, place: 1, score: 0 })) };
    expect([0, 1, 2, 3].map((seat) => outcomePoints(tie, seat))).toEqual([0.5, 0.5, 0.5, 0.5]);
  });

  it('a resignation loses for the resigning seat\'s whole side', () => {
    const o = resignationOutcome([0, 1, 2, 3], 2, [
      [0, 2],
      [1, 3],
    ]);
    expect([0, 1, 2, 3].map((seat) => outcomePoints(o, seat))).toEqual([0, 1, 0, 1]);
  });

  it('refuses a seat that is not in the outcome', () => {
    expect(() => outcomePoints({ reason: 'x', results: [{ seat: 0, place: 1, score: 1 }, { seat: 1, place: 2, score: 0 }] }, 5)).toThrow();
  });

  it('makes everyone else the winner when a seat resigns', () => {
    const o = resignationOutcome([0, 1], 0);
    expect(o.reason).toBe('resigned');
    expect(outcomePoints(o, 1)).toBe(1);
    expect(outcomePoints(o, 0)).toBe(0);
  });
});

describe('legal action lookup', () => {
  it('compares actions by their JSON', () => {
    expect(sameAction(noughts, 4, 4)).toBe(true);
    expect(sameAction(noughts, 4, 5)).toBe(false);
  });

  it('finds only legal actions', () => {
    const start = noughts.setup({}, null as never);
    expect(findLegal(noughts, start, 0, 4)).toBe(4);
    expect(findLegal(noughts, start, 1, 4)).toBeNull();
    const after = noughts.apply(start, 4).state;
    expect(findLegal(noughts, after, 1, 4)).toBeNull();
  });
});
