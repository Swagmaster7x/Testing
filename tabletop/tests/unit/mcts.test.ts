// The shared Monte Carlo tree search (src/ai/mcts.ts) on a toy game with a known answer.
import { describe, expect, it } from 'vitest';
import type { MctsGame, MoveLog } from '../../src/ai/mcts';
import { mcts } from '../../src/ai/mcts';
import type { Rng } from '../../src/core/rng';
import { createRng } from '../../src/core/rng';

/** Nim with one heap: take one, two or three; whoever takes the last stone wins. */
interface Heap {
  readonly left: number;
  readonly toMove: number;
}

function nim(withPrior = false): MctsGame<Heap> {
  return {
    moveSpace: 4,
    players: 2,
    toMove: (s) => s.toMove,
    moves: (s) => [1, 2, 3].filter((m) => m <= s.left),
    play: (s, m) => ({ left: s.left - m, toMove: 1 - s.toMove }),
    terminal: (s) => (s.left === 0 ? (s.toMove === 0 ? [0, 1] : [1, 0]) : null),
    fork: (s) => ({ ...s }),
    rollout(s: Heap, rng: Rng, log: MoveLog) {
      let { left, toMove } = s;
      while (left > 0) {
        const m = 1 + rng.int(Math.min(3, left));
        log.record(toMove, m);
        left -= m;
        toMove = 1 - toMove;
      }
      // The player who just moved took the last stone.
      return toMove === 0 ? [0, 1] : [1, 0];
    },
    ...(withPrior ? { prior: (_s: Heap, m: number) => ({ visits: 5, value: m === 3 ? 0.9 : 0.4 }) } : {}),
  };
}

describe('mcts', () => {
  it('finds the winning move: leave a multiple of four', () => {
    for (const [left, best] of [[5, 1], [6, 2], [7, 3], [9, 1], [10, 2]] as const) {
      const r = mcts(nim(), { left, toMove: 0 }, { playouts: 3000 }, createRng(`nim-${left}`));
      expect(r.best, `heap of ${left}`).toBe(best);
    }
  });

  it('knows a lost position is lost and a won one is won', () => {
    const lost = mcts(nim(), { left: 8, toMove: 0 }, { playouts: 3000 }, createRng('lost'));
    const won = mcts(nim(), { left: 7, toMove: 0 }, { playouts: 3000 }, createRng('won'));
    expect(won.value).toBeGreaterThan(lost.value);
    expect(won.children[0]?.value).toBeGreaterThan(0.8);
  });

  it('is repeatable from the same seed and counts every playout', () => {
    const a = mcts(nim(), { left: 13, toMove: 1 }, { playouts: 800, raveEquivalence: 300 }, createRng('same'));
    const b = mcts(nim(), { left: 13, toMove: 1 }, { playouts: 800, raveEquivalence: 300 }, createRng('same'));
    expect(a).toEqual(b);
    expect(a.children.reduce((sum, c) => sum + c.visits, 0)).toBe(800);
    expect(a.playouts).toBe(800);
  });

  it('uses priors: a favoured move is tried first, RAVE adds statistics for moves played later', () => {
    const r = mcts(nim(true), { left: 7, toMove: 0 }, { playouts: 50, raveEquivalence: 300 }, createRng('prior'));
    expect(r.best).toBe(3);
    expect(r.children.every((c) => c.raveVisits >= 5)).toBe(true);
  });

  it('refuses a finished position', () => {
    expect(() => mcts(nim(), { left: 0, toMove: 0 }, { playouts: 10 }, createRng('done'))).toThrow();
  });
});
