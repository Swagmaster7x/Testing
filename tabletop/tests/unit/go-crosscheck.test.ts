// Cross-check (PLAN.md 2.10): our Go rules against a second implementation, @sabaki/go-board.
// Under the simple ko rule with suicide forbidden (the Japanese preset) both must agree on every
// legal point, every capture and every prisoner count, move by move, over random games.
import GoBoard from '@sabaki/go-board';
import { describe, expect, it } from 'vitest';
import { findLegal } from '../../src/core/contract';
import { createRng } from '../../src/core/rng';
import { handicapPoints } from '../../src/games/go/coords';
import type { GoState } from '../../src/games/go/rules';
import { go, legalPoints, makeConfig } from '../../src/games/go/rules';

type Sign = 0 | 1 | -1;

function signMap(state: GoState): Sign[][] {
  const rows: Sign[][] = [];
  for (let y = 0; y < state.size; y++) {
    const row: Sign[] = [];
    for (let x = 0; x < state.size; x++) {
      const c = state.board[y * state.size + x];
      row.push(c === 'X' ? 1 : c === 'O' ? -1 : 0);
    }
    rows.push(row);
  }
  return rows;
}

function sabakiLegal(board: GoBoard, sign: Sign, size: number): number[] {
  const out: number[] = [];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (board.get([x, y]) !== 0) continue;
      const a = board.analyzeMove(sign, [x, y]);
      if (!a.ko && !a.suicide) out.push(y * size + x);
    }
  }
  return out;
}

describe('go rules against @sabaki/go-board', () => {
  for (const size of [9, 13]) {
    it(`agrees on legality, captures and prisoners over random ${size}×${size} games`, () => {
      let compared = 0;
      for (let game = 0; game < (size === 9 ? 12 : 5); game++) {
        const rng = createRng(`cross-${size}-${game}`);
        let state = go.setup(makeConfig(size, 'japanese'), rng);
        let board = new GoBoard(signMap(state));
        for (let ply = 0; ply < 260 && state.phase === 'play'; ply++) {
          const seat = go.turn(state) as number;
          const sign: Sign = seat === 0 ? 1 : -1;
          const mine = legalPoints(state);
          expect(mine).toEqual(sabakiLegal(board, sign, size));
          compared++;
          // Mostly stones, sometimes a pass, never two passes in a row (play goes on).
          if (mine.length === 0 || (rng.next() < 0.04 && state.passes === 0)) {
            state = go.apply(state, { type: 'pass' }).state;
            continue;
          }
          const p = rng.pick(mine);
          const x = p % size;
          const y = Math.floor(p / size);
          const action = findLegal(go, state, seat, go.codec.action.fromJSON(`${String.fromCharCode(97 + x)}${String.fromCharCode(97 + y)}`));
          if (!action) throw new Error('a legal point was not a legal action');
          state = go.apply(state, action).state;
          board = board.makeMove(sign, [x, y], { preventSuicide: true, preventKo: true });
          expect(signMap(state)).toEqual(board.signMap);
          expect(state.prisoners).toEqual([board.getCaptures(1), board.getCaptures(-1)]);
        }
      }
      expect(compared).toBeGreaterThan(500);
    }, 120_000);
  }

  it('places fixed handicap stones where @sabaki/go-board does', () => {
    for (const size of [9, 13, 19]) {
      for (let n = 2; n <= 9; n++) {
        const theirs = GoBoard.fromDimensions(size)
          .getHandicapPlacement(n)
          .map(([x, y]) => y * size + x)
          .sort((a, b) => a - b);
        expect([...handicapPoints(size, n)].sort((a, b) => a - b), `${size}×${size}, ${n} stones`).toEqual(theirs);
      }
    }
  });
});
