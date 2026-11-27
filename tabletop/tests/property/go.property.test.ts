import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { Board } from '../../src/games/go/board';
import type { Rng } from '../../src/core/rng';
import type { GoAction, GoConfig, GoState } from '../../src/games/go/rules';
import { go, makeConfig } from '../../src/games/go/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** No chain without a liberty is ever left on the board; marks and prisoners make sense. */
function invariant(s: GoState): void {
  const board = Board.fromText(s.size, s.board);
  if (board.deadChains().length > 0) throw new Error('a chain with no liberty is on the board');
  if (s.prisoners[0] < 0 || s.prisoners[1] < 0) throw new Error('negative prisoners');
  if (s.ko >= 0 && s.board[s.ko] !== '.') throw new Error('the ko point is taken');
  for (const p of s.dead) if (s.board[p] === '.') throw new Error('an empty point is marked dead');
  if ((s.phase === 'play' || s.phase === 'handicap') && s.dead.length > 0) throw new Error('dead marks during play');
  // Stones are conserved: every stone on the board was placed and never captured.
  const stones = [...s.board].filter((c) => c !== '.').length;
  if (stones > s.moveNumber + (s.handicap > 0 && s.rules.handicapPlacement === 'fixed' ? s.handicap : 0)) throw new Error('more stones than moves');
}

/** A random player that passes now and then and agrees to the marking often, so games end. */
function choose(legal: readonly GoAction[], rng: Rng, s: GoState): GoAction {
  const find = (type: GoAction['type']) => legal.find((a) => a.type === type);
  if (s.phase === 'scoring') {
    const r = rng.next();
    const done = find('done');
    const resume = find('resume');
    if (r < 0.55 && done) return done;
    if (r < 0.62 && resume) return resume;
    const marks = legal.filter((a) => a.type === 'mark');
    return marks.length > 0 ? rng.pick(marks) : (done ?? rng.pick(legal));
  }
  const pass = find('pass');
  const stones = legal.filter((a) => a.type === 'play');
  const late = s.moveNumber > (s.size * s.size) / 2;
  if (pass && (stones.length === 0 || rng.next() < (late ? 0.15 : 0.02))) return pass;
  return stones.length > 0 ? rng.pick(stones) : rng.pick(legal);
}

const CONFIGS: readonly GoConfig[] = [
  makeConfig(5, 'chinese'),
  makeConfig(7, 'japanese'),
  makeConfig(9, 'aga'),
  makeConfig(5, 'new-zealand'),
  makeConfig(7, 'tromp-taylor'),
  makeConfig(9, 'capture'),
  makeConfig(9, 'chinese', 3),
  makeConfig(9, 'japanese', 2),
];

describe('go over random games', () => {
  for (const config of CONFIGS) {
    it(`keeps the contract to the end under ${config.preset} on ${config.size}×${config.size}${config.handicap ? ` with ${config.handicap} stones` : ''}`, () => {
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 8 }), (seed) => {
          const game = playRandomGame(go, config, `go-${seed}`, { invariant, maxPlies: 4000, choose });
          expect(go.outcome(game.final)).not.toBeNull();
          checkReplay(go, game);
        }),
        { numRuns: 8 },
      );
    }, 120_000);
  }
});
