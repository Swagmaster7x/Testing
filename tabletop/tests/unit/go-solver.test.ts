// The Go solvers behind practice and the lesson linter, checked on known shapes and against brute force.
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import type { Color } from '../../src/games/go/board';
import { BLACK, Board, EMPTY, opponent, WHITE } from '../../src/games/go/board';
import { parsePoint } from '../../src/games/go/coords';
import { bensonAlive, captureDepth, captureSearch, forcedCapture, lifeSearch } from '../../src/games/go/solver';

function boardOf(rows: string[]): Board {
  return Board.fromText(rows.length, rows.join(''));
}

const at = (b: Board, name: string) => b.fromPoint(parsePoint(name, b.size) as number);

function after(b: Board, i: number, c: Color): Board {
  const nb = b.copy();
  if (i < 0) nb.pass();
  else nb.play(i, c);
  return nb;
}

/** Full minimax over every legal move and passing: is the target captured within `depth` plies? */
function brute(b: Board, target: number, defender: Color, attackerToMove: boolean, depth: number): boolean {
  if (b.color[target] !== defender) return true;
  if (depth === 0) return false;
  const c = attackerToMove ? opponent(defender) : defender;
  const moves = [-1];
  for (let k = 0; k < b.emptyCount; k++) {
    const i = b.empties[k] as number;
    if (b.isLegal(i, c, false)) moves.push(i);
  }
  return attackerToMove ? moves.some((m) => brute(after(b, m, c), target, defender, false, depth - 1)) : moves.every((m) => brute(after(b, m, c), target, defender, true, depth - 1));
}

describe('go capture search', () => {
  const E9 = '.........';
  const ladder = [E9, E9, E9, E9, E9, E9, '.XO......', '..XX.....', E9];

  it('reads a ladder to the edge and finds the one move that starts it', () => {
    const b = boardOf(ladder);
    const s = captureSearch(at(b, 'C3'), WHITE);
    expect(s.attack(b, 25)).toBe(true);
    expect(captureDepth(b, s, 25, true)).toBe(22);
    expect(s.defend(after(b, at(b, 'C4'), BLACK), 25)).toBe(true);
    expect(s.defend(after(b, at(b, 'D3'), BLACK), 25)).toBe(false);
    // Played elsewhere, White gets away.
    expect(s.defend(after(b, -1, BLACK), 25)).toBe(false);
  });

  it('sees a ladder breaker', () => {
    const rows = [...ladder];
    rows[2] = '......O..';
    const b = boardOf(rows);
    expect(captureSearch(at(b, 'C3'), WHITE).attack(b, 25)).toBe(false);
  });

  it('never claims a capture that full minimax does not find (5×5, three plies)', () => {
    const rng = createRng('brute');
    let checked = 0;
    let captures = 0;
    for (let n = 0; n < 160 && checked < 50; n++) {
      const b = new Board(5);
      for (let k = 0; k < 9; k++) {
        const i = b.index(rng.int(5), rng.int(5));
        if (b.color[i] === EMPTY) b.setStone(i, rng.next() < 0.5 ? BLACK : WHITE);
      }
      if (b.deadChains().length > 0) continue;
      for (let i = 0; i < b.cells; i++) {
        if (b.color[i] !== WHITE || b.head[i] !== i || b.liberties(i, 3).length > 2) continue;
        const s = captureSearch(i, WHITE);
        const solver = s.attack(b, 3);
        const exact = brute(b, i, WHITE, true, 3);
        if (solver) {
          captures++;
          expect(exact).toBe(true);
        }
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(20);
    expect(captures).toBeGreaterThan(3);
  });
});

describe('go life and death', () => {
  const E7 = '.......';
  const three = [E7, E7, E7, E7, 'OOOOO..', 'XXXXO..', '...XO..'];

  function problem(b: Board) {
    const region = new Set<number>();
    const stones: number[] = [];
    for (const name of ['A2', 'B2', 'C2', 'D2', 'D1', 'A1', 'B1', 'C1']) {
      const i = at(b, name);
      region.add(i);
      if (b.color[i] === BLACK) stones.push(i);
    }
    return { region, stones, defender: BLACK as Color };
  }

  it('straight three: whoever plays the middle first decides it', () => {
    const b = boardOf(three);
    const lives = (board: Board, toMove: Color) => lifeSearch(problem(b)).lives(board, toMove, 0, 20);
    expect(lives(b, BLACK)).toBe(true);
    expect(lives(b, WHITE)).toBe(false);
    expect(lives(after(b, at(b, 'B1'), BLACK), WHITE)).toBe(true);
    expect(lives(after(b, at(b, 'A1'), BLACK), WHITE)).toBe(false);
    expect(lives(after(b, at(b, 'B1'), WHITE), BLACK)).toBe(false);
  });

  it('Benson: two real eyes are alive whatever White does; one eye is not', () => {
    const two = boardOf([E7, E7, E7, E7, 'OOOOO..', 'XXXXO..', '.X.XO..']);
    expect(bensonAlive(two, BLACK).size).toBe(1);
    const one = boardOf(three);
    expect(bensonAlive(one, BLACK).size).toBe(0);
  });
});

describe('go Capture-Go search', () => {
  it('finds a double atari, and nothing where there is nothing', () => {
    const E7 = '.......';
    const b = boardOf([E7, E7, '..X.X..', '.XO.OX.', E7, E7, E7]);
    expect(forcedCapture(b, BLACK, 3, new Map())).toBe(true);
    expect(forcedCapture(b, BLACK, 1, new Map())).toBe(false);
    const quiet = boardOf([E7, E7, E7, '...X...', E7, E7, E7]);
    expect(forcedCapture(quiet, WHITE, 9, new Map())).toBe(false);
  });
});
