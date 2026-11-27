import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { replay } from '../../src/core/replay';
import { createRng } from '../../src/core/rng';
import { noughtsBots } from '../../src/games/noughts/bots';
import type { NoughtsState } from '../../src/games/noughts/rules';
import { noughts } from '../../src/games/noughts/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Marks are conserved: X has as many marks as O or one more, and the count matches the moves. */
function conservation(s: NoughtsState): void {
  const x = s.cells.filter((c) => c === 0).length;
  const o = s.cells.filter((c) => c === 1).length;
  if (x - o !== 0 && x - o !== 1) throw new Error(`X ${x}, O ${o}`);
  if (s.toMove !== (x === o ? 0 : 1)) throw new Error('wrong side to move');
}

describe('noughts and crosses over random games', () => {
  it('keeps the contract: no crash, legal actions apply, codecs round-trip, it ends', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 12 }), (seed) => {
        const game = playRandomGame(noughts, noughts.defaultConfig, seed, { invariant: conservation, maxPlies: 9 });
        expect(game.actions.length).toBeGreaterThanOrEqual(5);
        expect(game.actions.length).toBeLessThanOrEqual(9);
        expect(noughts.outcome(game.final)).not.toBeNull();
      }),
      { numRuns: 400 },
    );
  });

  it('replays every record to the identical final state', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 12 }), (seed) => {
        checkReplay(noughts, playRandomGame(noughts, noughts.defaultConfig, seed));
      }),
      { numRuns: 300 },
    );
  });

  it('replays every prefix of a record to the state seen during play', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 12 }), (seed) => {
        const game = playRandomGame(noughts, noughts.defaultConfig, seed);
        game.states.forEach((state, ply) => {
          expect(replay(noughts, game.record, ply).state).toEqual(state);
        });
      }),
      { numRuns: 100 },
    );
  });

  it('outcome scores add up: 1 for a win, half each for a draw', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 12 }), (seed) => {
        const { final } = playRandomGame(noughts, noughts.defaultConfig, seed);
        const outcome = noughts.outcome(final);
        expect(outcome).not.toBeNull();
        const total = outcome?.results.reduce((sum, r) => sum + r.score, 0);
        expect(total).toBeCloseTo(1);
      }),
      { numRuns: 200 },
    );
  });

  it('bots at every level only ever choose legal moves, from any reachable position', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 12 }), fc.integer({ min: 1, max: 3 }), (seed, level) => {
        const { states } = playRandomGame(noughts, noughts.defaultConfig, seed);
        for (const state of states) {
          const seat = noughts.turn(state);
          if (seat === null) continue;
          const choice = noughtsBots.choose({ view: noughts.view(state, seat), seat, level, rng: createRng(seed) });
          expect(noughts.legal(state, seat)).toContain(choice.action);
        }
      }),
      { numRuns: 60 },
    );
  });
});
