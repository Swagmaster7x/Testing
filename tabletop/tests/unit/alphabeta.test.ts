import { describe, expect, it } from 'vitest';
import type { SearchSpace } from '../../src/ai/alphabeta';
import { isDecided, search, WIN } from '../../src/ai/alphabeta';
import { createRng } from '../../src/core/rng';
import { noughtsSpace, solve } from '../../src/games/noughts/bots';
import { noughts, parseCell } from '../../src/games/noughts/rules';

const pos = (text: string) => noughts.codec.state.fromText(text);

/** Take 1 or 2 from a pile; whoever takes the last one wins. Multiples of 3 lose. */
const nim: SearchSpace<{ pile: number }, number> = {
  moves: (s) => [1, 2].filter((n) => n <= s.pile),
  play: (s, n) => ({ pile: s.pile - n }),
  result: (s) => (s.pile === 0 ? -1 : null),
  evaluate: () => 0,
  key: (s) => String(s.pile),
};

describe('alpha-beta search', () => {
  it('finds a win in one', () => {
    const r = search(noughtsSpace, pos('xx./oo./... x'), { maxDepth: 9, nodeBudget: 100_000 });
    expect(r.best.move).toBe(parseCell('c3'));
    expect(r.best.score).toBe(WIN - 1);
  });

  it('blocks a loss in one when it looks two moves ahead', () => {
    const r = search(noughtsSpace, pos('oo./.x./..x x'), { maxDepth: 2, nodeBudget: 10_000 });
    expect(r.best.move).toBe(parseCell('c3'));
  });

  it('prefers the quickest win', () => {
    // X can win now at c3 or later; the immediate win must score higher.
    const r = search(noughtsSpace, pos('xx./o../o.. x'), { maxDepth: 9, nodeBudget: 100_000 });
    expect(r.best.move).toBe(parseCell('c3'));
    expect(r.scored[0]?.score).toBeGreaterThan(r.scored[1]?.score ?? -Infinity);
  });

  it('agrees with an exact solver on the value of every reachable position it searches', () => {
    const rng = createRng('positions');
    for (let game = 0; game < 40; game++) {
      let s = noughts.setup({}, rng);
      while (noughts.turn(s) !== null) {
        const r = search(noughtsSpace, s, { maxDepth: 9, nodeBudget: 1_000_000 });
        const sign = r.best.score > 0 ? 1 : r.best.score < 0 ? -1 : 0;
        expect(sign).toBe(solve(s));
        // Once a forced win is found the search stops, so the other moves' scores are only
        // estimates unless they are decided. Otherwise it searched to the end and every score is exact.
        const stoppedEarly = r.best.score > 0 && isDecided(r.best.score);
        for (const scored of r.scored) {
          if (stoppedEarly && !isDecided(scored.score)) continue;
          const value = 0 - solve(noughtsSpace.play(s, scored.move));
          expect(Math.sign(scored.score)).toBe(Math.sign(value));
        }
        s = noughts.apply(s, rng.pick(noughts.legal(s, s.toMove))).state;
      }
    }
  });

  it('knows the empty board is a draw', () => {
    const r = search(noughtsSpace, noughts.setup({}, createRng('e')), { maxDepth: 9, nodeBudget: 1_000_000 });
    expect(r.best.score).toBe(0);
    expect(r.complete).toBe(true);
  });

  it('solves a take-away game with a different shape', () => {
    for (let pile = 1; pile <= 14; pile++) {
      const r = search(nim, { pile }, { maxDepth: 20, nodeBudget: 1_000_000 });
      if (pile % 3 === 0) expect(r.best.score).toBeLessThan(0);
      else {
        expect(isDecided(r.best.score)).toBe(true);
        expect(r.best.score).toBeGreaterThan(0);
        expect((pile - r.best.move) % 3).toBe(0);
      }
    }
  });

  it('stops at the node budget and keeps the deepest finished depth', () => {
    const r = search(noughtsSpace, noughts.setup({}, createRng('e')), { maxDepth: 9, nodeBudget: 50 });
    expect(r.complete).toBe(false);
    expect(r.depth).toBeGreaterThanOrEqual(1);
    expect(r.depth).toBeLessThan(9);
    expect(r.scored).toHaveLength(9);
  });

  it('always finishes depth one, whatever the budget', () => {
    const r = search(noughtsSpace, noughts.setup({}, createRng('e')), { maxDepth: 3, nodeBudget: 1 });
    expect(r.depth).toBe(1);
    expect(r.scored).toHaveLength(9);
  });

  it('breaks ties with the random stream it is given, repeatably', () => {
    const start = noughts.setup({}, createRng('e'));
    const pickA = search(noughtsSpace, start, { maxDepth: 1, nodeBudget: 100 }, createRng('t1')).best.move;
    const pickB = search(noughtsSpace, start, { maxDepth: 1, nodeBudget: 100 }, createRng('t1')).best.move;
    expect(pickA).toBe(pickB);
    expect(pickA).toBe(parseCell('b2')); // the centre is worth the most at depth one
  });

  it('refuses a position with no moves', () => {
    expect(() => search(nim, { pile: 0 }, { maxDepth: 3, nodeBudget: 10 })).toThrow();
  });
});
