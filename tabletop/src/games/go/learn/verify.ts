/**
 * The solver checks behind the Go lesson linter (docs/lessons.md). A "best" claim is checked by
 * an exact solver, chosen by the position:
 * - Capture-Go rules: the accepted moves must be exactly the moves that force a capture soonest
 *   (by captures and ataris only);
 * - a group shut in by the other colour in a small region: the accepted moves must be exactly the
 *   moves that make it live (defender to move) or kill it (attacker to move);
 * - chains with one or two liberties: each move is scored by the stones it wins or saves when the
 *   capture fights are read out; the accepted moves must score best, every other move at least a
 *   stone worse.
 * A claim no solver can check fails the lint: write it as "legal" instead.
 */
import { createRng } from '../../../core/rng';
import type { FreePlayStep } from '../../../teach/lesson';
import type { LessonVerifier } from '../../../teach/lint';
import { analysePosition } from '../bots';
import type { Color } from '../board';
import { Board, EMPTY, opponent } from '../board';
import { pointName } from '../coords';
import type { GoState } from '../rules';
import { boardOf, colorOf, go } from '../rules';
import { captureSearch, forcedCapture, lifeSearch } from '../solver';
import { goLessonGame } from './game';

/** Capture-Go: forced captures are searched this deep (a ladder across a small board fits). */
const MAX_PLIES = 21;
const CAPTURE_DEPTH = 25;

function after(b: Board, i: number, c: Color): Board {
  const nb = b.copy();
  nb.play(i, c);
  return nb;
}

function legalPoints(b: Board, c: Color): number[] {
  const out: number[] = [];
  for (let k = 0; k < b.emptyCount; k++) {
    const i = b.empties[k] as number;
    if (b.isLegal(i, c, false)) out.push(i);
  }
  return out.sort((x, y) => x - y);
}

const nameOf = (b: Board, i: number) => pointName(b.point(i), b.size);

// ---------------------------------------------------------------------------------------------
// Capture-Go

/** True when colour c playing i forces a capture within `plies` (its own moves counted at 1, 3, ...). */
function winsWithin(b: Board, i: number, c: Color, plies: number, memo: Map<string, boolean>): boolean {
  const opp = opponent(c);
  const nb = after(b, i, c);
  if ((nb.capturedBy[c - 1] as number) > (b.capturedBy[c - 1] as number)) return true;
  if (plies < 3) return false;
  // They must not be able to capture at once.
  for (let k = 0; k < nb.emptyCount; k++) {
    const p = nb.empties[k] as number;
    if (nb.capturesAt(p, opp) > 0 && nb.isLegal(p, opp, false)) return false;
  }
  const defences = new Set<number>();
  for (let p = 0; p < nb.cells; p++) if (nb.color[p] === opp && nb.head[p] === p && nb.inAtari(p)) defences.add(nb.atariLiberty(p));
  if (defences.size === 0) return false;
  for (const d of defences) {
    if (!nb.isLegal(d, opp, false)) continue;
    const db = after(nb, d, opp);
    if (!forcedCapture(db, c, plies - 2, memo)) return false;
  }
  return true;
}

/** The moves that force a capture soonest, and how soon (plies), or null. */
export function fastestCaptures(state: GoState): { moves: number[]; plies: number; board: Board } | null {
  const board = boardOf(state);
  const c = colorOf(state.toMove);
  const memo = new Map<string, boolean>();
  for (let plies = 1; plies <= MAX_PLIES; plies += 2) {
    const moves = legalPoints(board, c).filter((i) => winsWithin(board, i, c, plies, memo));
    if (moves.length > 0) return { moves, plies, board };
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Life and death in a closed region

interface Enclosure {
  readonly region: Set<number>;
  readonly stones: number[];
  readonly defender: Color;
}

/** A group of one colour shut in by the other in a small region, if the position has exactly one. */
export function findEnclosure(b: Board): Enclosure | null {
  const found: Enclosure[] = [];
  for (const defender of [1, 2] as Color[]) {
    const attacker = opponent(defender);
    const seen = new Set<number>();
    for (let i = 0; i < b.cells; i++) {
      if (b.color[i] !== defender || seen.has(i)) continue;
      const region = new Set<number>();
      const stack = [i];
      region.add(i);
      while (stack.length > 0) {
        const p = stack.pop() as number;
        for (let d = 0; d < 4; d++) {
          const n = p + (b.dirs[d] as number);
          const c = b.color[n];
          if (c === 3 || c === attacker || region.has(n)) continue;
          region.add(n);
          stack.push(n);
        }
      }
      for (const p of region) seen.add(p);
      if (region.size > 18) continue;
      const stones = [...region].filter((p) => b.color[p] === defender);
      if (stones.length < 2) continue;
      // The wall must be safe: each chain around the region has two liberties outside it.
      let safe = true;
      for (const p of region) {
        for (let d = 0; d < 4; d++) {
          const n = p + (b.dirs[d] as number);
          if (b.color[n] !== attacker) continue;
          if (b.liberties(b.head[n] as number).filter((l) => !region.has(l)).length < 2) safe = false;
        }
      }
      if (safe) found.push({ region, stones, defender });
    }
  }
  return found.length === 1 ? (found[0] as Enclosure) : null;
}

export function lifeWinners(state: GoState, enclosure: Enclosure): { moves: number[]; passWins: boolean; board: Board; proved: boolean } {
  const board = boardOf(state);
  const toMove = colorOf(state.toMove);
  const goal = toMove === enclosure.defender ? 'live' : 'kill';
  const empties = [...enclosure.region].filter((p) => board.color[p] === EMPTY).length;
  const depth = empties * 2 + 8;
  let proved = true;
  const solve = (b: Board, next: Color) => {
    const s = lifeSearch({ region: enclosure.region, stones: enclosure.stones, defender: enclosure.defender }, { nodeLimit: 500_000 });
    const lives = s.lives(b, next, 0, depth);
    if (lives && s.cut) proved = false;
    return lives;
  };
  const wins = (lives: boolean) => (goal === 'live' ? lives : !lives);
  const moves: number[] = [];
  for (const i of [...enclosure.region].sort((x, y) => x - y)) {
    if (board.color[i] !== EMPTY || !board.isLegal(i, toMove, false)) continue;
    if (wins(solve(after(board, i, toMove), opponent(toMove)))) moves.push(i);
  }
  const passed = board.copy();
  passed.pass();
  const passWins = wins(solve(passed, opponent(toMove)));
  return { moves, passWins, board, proved };
}

// ---------------------------------------------------------------------------------------------
// Capture fights

/** Stones won (positive) or lost (negative) by each move, once the fights over weak chains are read out. */
export function fightScores(state: GoState): { scores: Map<number, number>; board: Board; weak: number } {
  const board = boardOf(state);
  const me = colorOf(state.toMove);
  const them = opponent(me);
  const weak: { head: number; color: Color; size: number }[] = [];
  for (let i = 0; i < board.cells; i++) {
    const c = board.color[i];
    if ((c !== 1 && c !== 2) || board.head[i] !== i) continue;
    if (board.liberties(i, 3).length <= 2) weak.push({ head: i, color: c, size: board.stones[i] as number });
  }
  const scores = new Map<number, number>();
  for (const m of legalPoints(board, me)) {
    const nb = after(board, m, me);
    let score = (nb.capturedBy[me - 1] as number) - (board.capturedBy[me - 1] as number);
    for (const w of weak) {
      if (nb.color[w.head] !== w.color) continue; // captured by this move, counted above
      const s = captureSearch(nb.head[w.head] as number, w.color, { escape: 3 });
      if (w.color === them) {
        // Their chain: can they still save it, moving next?
        if (s.defend(nb, CAPTURE_DEPTH) === true) score += w.size;
      } else if (s.attack(nb, CAPTURE_DEPTH) === true) {
        // Our chain: can they capture it, moving next?
        score -= w.size;
      }
    }
    scores.set(m, score);
  }
  return { scores, board, weak: weak.length };
}

// ---------------------------------------------------------------------------------------------

function sameSet(a: readonly number[], b: readonly number[]): boolean {
  return a.length === b.length && a.every((x) => b.includes(x));
}

function acceptedPoints(state: GoState, board: Board, accept: readonly string[]): (number | null)[] {
  return accept.map((m) => {
    const canonical = goLessonGame.canonical(state, m);
    if (!canonical || canonical === 'pass' || canonical.length !== 2) return null;
    return board.index(canonical.charCodeAt(0) - 97, canonical.charCodeAt(1) - 97);
  });
}

export function goPositionProblems(state: GoState): string[] {
  const problems: string[] = [];
  const board = Board.fromText(state.size, state.board);
  if (board.deadChains().length > 0) problems.push('a chain has no liberties');
  if (state.phase === 'over') problems.push('the game is already over');
  return problems;
}

export function goVerifier(): LessonVerifier<GoState> {
  return {
    positionProblems: goPositionProblems,

    // eslint-disable-next-line @typescript-eslint/require-await -- the interface is async for engines
    async checkBest(state, accept) {
      const names = (b: Board, list: readonly number[]) => list.map((i) => nameOf(b, i)).join(' ') || 'none';
      if (state.rules.captureTarget > 0) {
        const fastest = fastestCaptures(state);
        if (!fastest) return [`claim "best": no move forces a capture within ${MAX_PLIES} plies`];
        const accepted = acceptedPoints(state, fastest.board, accept);
        if (accepted.some((p) => p === null) || !sameSet(accepted as number[], fastest.moves)) {
          return [`claim "best": the fastest captures (${fastest.plies} plies) are ${names(fastest.board, fastest.moves)}, not ${accept.join('/')}`];
        }
        return [];
      }
      const board = boardOf(state);
      const enclosure = findEnclosure(board);
      if (enclosure) {
        const r = lifeWinners(state, enclosure);
        if (!r.proved) return ['claim "best": the life-and-death search did not finish'];
        if (r.passWins) return ['claim "best": passing works too, so no move is needed'];
        const accepted = acceptedPoints(state, r.board, accept);
        if (accepted.some((p) => p === null) || !sameSet(accepted as number[], r.moves)) return [`claim "best": the moves that work are ${names(r.board, r.moves)}, not ${accept.join('/')}`];
        return [];
      }
      const fight = fightScores(state);
      if (fight.weak === 0) return ['claim "best": no solver can check this position (no fight, no closed group); use "legal"'];
      const accepted = acceptedPoints(state, fight.board, accept);
      if (accepted.some((p) => p === null)) return [`claim "best": ${accept.join('/')} is not a stone move`];
      const best = Math.max(...fight.scores.values());
      const problems: string[] = [];
      for (const p of accepted as number[]) if ((fight.scores.get(p) ?? -Infinity) < best) problems.push(`claim "best": ${nameOf(fight.board, p)} scores ${fight.scores.get(p) ?? '?'}, the best scores ${best}`);
      const rivals = [...fight.scores].filter(([m, v]) => !(accepted as number[]).includes(m) && v > best - 1);
      if (rivals.length > 0) problems.push(`claim "best": ${names(fight.board, rivals.map(([m]) => m))} do as well; accept them or change the position`);
      return problems;
    },

    // eslint-disable-next-line @typescript-eslint/require-await -- the interface is async for engines
    async freePlayMove(state: GoState, role: 'student' | 'opponent', _step: FreePlayStep) {
      const seat = go.turn(state) ?? 0;
      if (state.rules.captureTarget > 0) {
        const board = boardOf(state);
        const c = colorOf(state.toMove);
        if (role === 'student') {
          const fastest = fastestCaptures(state);
          if (fastest) return nameOf(fastest.board, fastest.moves[0] as number);
        } else {
          // The defence that holds out longest (or stops the capture altogether).
          let best: { move: number; plies: number } | null = null;
          for (const m of legalPoints(board, c)) {
            const nb = after(board, m, c);
            if ((nb.capturedBy[c - 1] as number) > (board.capturedBy[c - 1] as number)) return nameOf(board, m);
            const next: GoState = go.apply(state, go.legal(state, seat).find((a) => a.type === 'play' && a.name === nameOf(board, m)) ?? { type: 'pass' }).state;
            const fastest = next.phase === 'over' ? null : fastestCaptures(next);
            const plies = fastest ? fastest.plies : Infinity;
            if (!best || plies > best.plies) best = { move: m, plies };
            if (plies === Infinity) break;
          }
          if (best) return nameOf(board, best.move);
        }
      }
      const a = analysePosition(state, 3_000, createRng(`lint/${goLessonGame.notation(state)}`));
      const top = a.result.children[0];
      return !top || top.move === a.board.cells ? 'pass' : nameOf(a.board, top.move);
    },
  };
}
