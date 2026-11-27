import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { ChessState } from '../../src/games/chess/rules';
import { chess, chessAt } from '../../src/games/chess/rules';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Pieces are conserved: never more than 16 a side, kings always one each. */
function conservation(s: ChessState): void {
  const counts = { w: 0, b: 0, wk: 0, bk: 0 };
  for (const row of chessAt(s.fen).board()) {
    for (const p of row) {
      if (!p) continue;
      counts[p.color]++;
      if (p.type === 'k') counts[`${p.color}k`]++;
    }
  }
  if (counts.w > 16 || counts.b > 16 || counts.wk !== 1 || counts.bk !== 1) throw new Error(`bad material in ${s.fen}`);
}

describe('chess over random games', () => {
  it('keeps the contract to the end of every game: legal moves apply, codecs round-trip, it ends', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), (seed) => {
        const game = playRandomGame(chess, chess.defaultConfig, `chess-${seed}`, { invariant: conservation, maxPlies: 1200 });
        expect(chess.outcome(game.final)).not.toBeNull();
        checkReplay(chess, game);
      }),
      { numRuns: 6 },
    );
  }, 120_000);
});
