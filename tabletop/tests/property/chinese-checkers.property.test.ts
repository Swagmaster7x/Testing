// Chinese Checkers over random games (PLAN.md 2.10): under every preset and a few odd mixes of
// options, nothing crashes, every legal move applies, every seat keeps its marbles, records replay
// to the identical position, and every game ends: no deadlock.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Rng } from '../../src/core/rng';
import { HOLES } from '../../src/games/chinese-checkers/board';
import { seatCost } from '../../src/games/chinese-checkers/engine';
import type { CcAction, CcConfig, CcState } from '../../src/games/chinese-checkers/rules';
import { boardArray, chineseCheckers as cc, layoutOf, makeConfig, PRESETS, SEAT_LETTERS } from '../../src/games/chinese-checkers/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Every seat keeps exactly its marbles; finishers are listed once; the board has 121 holes. */
function invariant(s: CcState): void {
  if (s.board.length !== HOLES) throw new Error('the board lost a hole');
  for (let seat = 0; seat < s.players; seat++) {
    const n = [...s.board].filter((c) => c === SEAT_LETTERS[seat]).length;
    if (n !== s.marbles) throw new Error(`${SEAT_LETTERS[seat]} has ${n} marbles`);
  }
  if (new Set(s.done).size !== s.done.length) throw new Error('a seat finished twice');
  if (s.end === null && s.done.includes(s.toMove)) throw new Error('a finished seat is to move');
}

/** A player who mostly heads for home (the move that brings it nearest, most of the time), so games end by finishing. */
function forward(legal: readonly CcAction[], rng: Rng, s: CcState): CcAction {
  const r = rng.next();
  if (r < 0.15) return rng.pick(legal);
  const layout = layoutOf(s);
  const board = boardArray(s.board);
  const before = seatCost(board, s.toMove, layout);
  const gains = legal.map((a) => {
    if (a.type === 'pass') return 0;
    const b = Int8Array.from(board);
    b[a.to] = b[a.from] as number;
    b[a.from] = 0;
    return before - seatCost(b, s.toMove, layout);
  });
  const best = Math.max(...gains);
  if (r < 0.75) return rng.pick(legal.filter((_, i) => gains[i] === best));
  const ahead = legal.filter((_, i) => (gains[i] as number) > 0);
  return ahead.length > 0 ? rng.pick(ahead) : rng.pick(legal);
}

/** Every preset, where a player heading for home usually finishes, and odd mixes, which only have to end. */
const CONFIGS: readonly { name: string; config: CcConfig; finishes: boolean }[] = [
  ...Object.entries<CcConfig>(PRESETS).map(([name, config]) => ({ name, config, finishes: true })),
  { name: 'four, never stop in other points, frozen homes', config: makeConfig(4, 10, { stop: 'never', home: 'frozen' }), finishes: false },
  { name: 'six, long jumps, all your own, first home wins', config: makeConfig(6, 10, { jumps: 'long', finish: 'own', end: 'first' }), finishes: false },
  { name: 'three, free homes, turn limit 100', config: makeConfig(3, 10, { home: 'free', limit: 100 }), finishes: false },
];

describe('chinese checkers over random games', () => {
  for (const { name, config, finishes } of CONFIGS) {
    it(`keeps the contract and ends, under ${name}`, () => {
      let byLimit = 0;
      let games = 0;
      fc.assert(
        fc.property(fc.string({ minLength: 1, maxLength: 8 }), (seed) => {
          const game = playRandomGame(cc, config, `cc-${seed}`, { invariant, choose: forward, maxPlies: 2_000 });
          const outcome = cc.outcome(game.final);
          expect(outcome).not.toBeNull();
          expect(outcome?.results.map((r) => r.seat)).toEqual(cc.seats(game.final));
          if (game.final.end === 'limit') byLimit++;
          games++;
          checkReplay(cc, game);
        }),
        { numRuns: 6 },
      );
      // Under the presets a player who heads for home gets there: the turn limit is a backstop, not how games end.
      if (finishes) expect(byLimit).toBeLessThanOrEqual(games / 2);
    }, 180_000);
  }

  it('ends even when every move is chosen at random (at the turn limit at the latest)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.constantFrom(2, 3, 6), (seed, players) => {
        const config = makeConfig(players, 10, { limit: 100 });
        const game = playRandomGame(cc, config, `cc-random-${seed}`, { invariant, maxPlies: 700 });
        expect(cc.outcome(game.final)).not.toBeNull();
        expect(game.final.round).toBeLessThanOrEqual(101);
        checkReplay(cc, game);
      }),
      { numRuns: 4 },
    );
  }, 180_000);
});
