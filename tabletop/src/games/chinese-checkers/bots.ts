/**
 * Chinese Checkers CPU levels and coach (PLAN.md 2.4: greedy progress, then lookahead search).
 *
 * - Level 1 jumps as far forward as it can with whichever marble goes furthest, and now and then just
 *   steps a marble forward: the beginner's habit of racing the front marbles and leaving the back
 *   ones behind.
 * - Level 2 looks one move ahead with the whole position in mind (rows to go, marbles off to the side,
 *   stragglers), and still sometimes grabs the longest jump instead.
 * - Levels 3 to 6, two players: the shared principal-variation search (src/ai/pvs.ts) on CcPosition:
 *   level 3 looks two moves deep (yours and the reply), level 4 three deep but scores every move and
 *   now and then takes one that is nearly as good, level 5 three deep cleanly, level 6 five deep.
 *   (Four deep measured no stronger than three: 21 to 19 over 40 games; five deep beat four 19 to 1.)
 * - Levels 3 to 6, three or more players: a lookahead over the player's own next moves (the others
 *   held still), wider and deeper at each level. In a race with many players your own route matters
 *   most; the others mostly get in the way.
 * Strength comes from node budgets and widths, never time. A little seeded noise in the evaluation
 * keeps a level from playing the same game twice.
 */
import type { AdviseInput, BotChoice, BotInput, BotSet } from '../../ai/bot';
import type { PvsResult } from '../../ai/pvs';
import { isMateScore, PvsSearcher } from '../../ai/pvs';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { HOLES, holeCode, ROW_FROM } from './board';
import type { Layout, MoveRules } from './engine';
import { CcPosition, DECIDED, generateMoves, homeComplete, PASS, seatCost } from './engine';
import { CC_LEVELS } from './levels';
import { ideaOf, moveTags, rowsGained } from './tags';
import type { CcAction, CcState, CcView } from './rules';
import { actionOf, boardArray, chineseCheckers, layoutOf } from './rules';

export interface LevelParams {
  /** jumper (level 1), greedy (level 2) or search. */
  readonly mode: 'jumper' | 'greedy' | 'search';
  /** How often a planned mistake replaces the level's own choice. */
  readonly slip: number;
  /** Two players: search depth and node budget; every root move scored exactly when `exact`. */
  readonly depth: number;
  readonly nodes: number;
  readonly exact: boolean;
  /** A planned mistake picks a move scoring within this much of the best (hundredths of a row). */
  readonly window: number;
  /** Three or more players: how many first moves are looked at again, and how deep (own moves). */
  readonly beams: readonly number[];
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { mode: 'jumper', slip: 0.3, depth: 1, nodes: 0, exact: false, window: 0, beams: [] },
  2: { mode: 'greedy', slip: 0.12, depth: 1, nodes: 0, exact: false, window: 0, beams: [] },
  3: { mode: 'search', slip: 0, depth: 2, nodes: 20_000, exact: false, window: 0, beams: [6] },
  4: { mode: 'search', slip: 0.2, depth: 3, nodes: 20_000, exact: true, window: 120, beams: [16] },
  5: { mode: 'search', slip: 0, depth: 3, nodes: 30_000, exact: false, window: 0, beams: [40] },
  6: { mode: 'search', slip: 0, depth: 5, nodes: 250_000, exact: false, window: 0, beams: [40, 8] },
};

/** Search for the coach's hints, free play and the blunder check. */
export const COACH_LEVEL = 5;
/** Nodes per position when a game is reviewed (two players). */
export const REVIEW_NODES = 30_000;

const searcher = new PvsSearcher(17);
const buffers = Array.from({ length: 4 }, () => new Int32Array(1024));

// ---------------------------------------------------------------------------------------------
// Small helpers

function play(board: Int8Array, move: number): void {
  if (move === PASS) return;
  const from = move & 0xff;
  const to = (move >> 8) & 0xff;
  board[to] = board[from] as number;
  board[from] = 0;
}

function undo(board: Int8Array, move: number): void {
  if (move === PASS) return;
  const from = move & 0xff;
  const to = (move >> 8) & 0xff;
  board[from] = board[to] as number;
  board[to] = 0;
}

function movesOf(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, depth = 0): number[] {
  const buffer = buffers[depth] as Int32Array;
  const n = generateMoves(board, seat, layout, rules, buffer);
  return Array.from(buffer.subarray(0, n));
}

/** The seat's cost after a move (lower is better); -Infinity when the move completes its home. */
function costAfter(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, move: number): number {
  play(board, move);
  const cost = homeComplete(board, seat, layout, rules.finish) ? -Infinity : seatCost(board, seat, layout);
  undo(board, move);
  return cost;
}

/** A small seeded wobble per move (a quarter of a row at most), so a level does not repeat one game. */
function wobble(rng: Rng): number {
  return Math.round((rng.next() * 2 - 1) * 25);
}

const pickBest = <T,>(items: readonly T[], score: (item: T) => number, rng: Rng): T => {
  let best = -Infinity;
  let top: T[] = [];
  for (const item of items) {
    const s = score(item);
    if (s > best) {
      best = s;
      top = [item];
    } else if (s === best) top.push(item);
  }
  return rng.pick(top);
};

// ---------------------------------------------------------------------------------------------
// Levels 1 and 2

/**
 * Level 1: the longest jump forward with whichever marble goes furthest, the leading marbles first
 * (a finishing move before anything); now and then just a step forward with one of the front
 * marbles. Racing the front marbles and leaving the back ones behind is the beginner's habit.
 */
function jumperMove(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, moves: readonly number[], slip: number, rng: Rng): number {
  const finishing = moves.find((m) => costAfter(board, seat, layout, rules, m) === -Infinity);
  if (finishing !== undefined) return finishing;
  const point = layout.points[seat] as number;
  const rowOf = (m: number) => ROW_FROM[point * HOLES + (m & 0xff)] as number;
  const gains = moves.map((m) => rowsGained(layout, seat, m));
  if (rng.next() < slip) {
    const forward = moves.filter((_, i) => (gains[i] as number) >= 1);
    const rows = [...new Set(forward.map(rowOf))].sort((a, b) => b - a);
    const front = forward.filter((m) => rows.slice(0, 2).includes(rowOf(m)));
    if (front.length > 0) return rng.pick(front);
  }
  const best = Math.max(...gains);
  if (best > 0) {
    const longest = moves.filter((_, i) => gains[i] === best);
    const lead = Math.max(...longest.map(rowOf));
    return rng.pick(longest.filter((m) => rowOf(m) === lead));
  }
  // Nothing goes forward (the end of the game): fall back on the whole position.
  return greedyMove(board, seat, layout, rules, moves, 0, rng);
}

/** Level 2: the move that leaves the position best for us, one move ahead. */
function greedyMove(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, moves: readonly number[], slip: number, rng: Rng): number {
  if (slip > 0 && rng.next() < slip) return jumperMove(board, seat, layout, rules, moves, 0, rng);
  return pickBest(moves, (m) => -costAfter(board, seat, layout, rules, m), rng);
}

// ---------------------------------------------------------------------------------------------
// Two players: the search

export interface SearchAnswer {
  readonly move: number;
  readonly score: number;
  readonly result: PvsResult;
}

export function searchPosition(view: CcState, depth: number, nodes: number, exact: boolean, salt: number): SearchAnswer {
  const position = new CcPosition(boardArray(view.board), view.toMove, layoutOf(view), view.rules);
  position.noise = salt;
  const result = searcher.search(position, { maxDepth: depth, nodes, exactRoot: exact, quiescence: 0 });
  return { move: result.best, score: result.score, result };
}

function searchMove(view: CcState, params: LevelParams, rng: Rng): { move: number; nodes: number } {
  const salt = (Math.floor(rng.next() * 0x7fffffff) | 1) >>> 0;
  const answer = searchPosition(view, params.depth, params.nodes, params.exact, salt);
  if (params.slip > 0 && params.exact && rng.next() < params.slip) {
    const near = answer.result.scored.filter((s) => !isMateScore(s.score) && Math.abs(s.score) < DECIDED / 2 && s.score >= answer.score - params.window);
    if (near.length > 1) return { move: rng.pick(near).move, nodes: answer.result.nodes };
  }
  return { move: answer.move, nodes: answer.result.nodes };
}

// ---------------------------------------------------------------------------------------------
// Three or more players: own-move lookahead

/**
 * The best cost the seat can reach in `beams.length + 1` of its own moves, the others held still.
 * Each level of the lookahead keeps only the `beams[i]` most promising moves.
 */
function lookahead(board: Int8Array, seat: number, layout: Layout, rules: MoveRules, beams: readonly number[], depth: number, rng: Rng | null): { move: number; value: number } {
  const moves = movesOf(board, seat, layout, rules, depth);
  const scored = moves.map((m) => ({ m, cost: costAfter(board, seat, layout, rules, m) + (rng ? wobble(rng) : 0) }));
  const finishing = scored.find((s) => s.cost === -Infinity);
  if (finishing) return { move: finishing.m, value: -Infinity };
  scored.sort((a, b) => a.cost - b.cost);
  const beam = beams[depth];
  if (beam === undefined || beam <= 0) return { move: (scored[0] as { m: number }).m, value: (scored[0] as { cost: number }).cost };
  let best = { move: (scored[0] as { m: number }).m, value: Infinity };
  for (const { m, cost } of scored.slice(0, beam)) {
    play(board, m);
    const deeper = lookahead(board, seat, layout, rules, beams, depth + 1, null);
    undo(board, m);
    // The second move is less sure (the others move in between), so the first move's own gain counts too.
    const value = deeper.value === -Infinity ? cost - 1 : 0.4 * cost + 0.6 * deeper.value;
    if (value < best.value) best = { move: m, value };
  }
  return best;
}

// ---------------------------------------------------------------------------------------------
// Choosing

function chooseMove(view: CcState, level: number, rng: Rng): { move: number; nodes: number } {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Chinese Checkers has no level ${level}`);
  return chooseWith(view, params, rng);
}

/** A move chosen with explicit level settings (levels, and experiments when tuning them). */
export function chooseWith(view: CcState, params: LevelParams, rng: Rng): { move: number; nodes: number } {
  const board = boardArray(view.board);
  const layout = layoutOf(view);
  const seat = view.toMove;
  const moves = movesOf(board, seat, layout, view.rules);
  if (moves.length === 1) return { move: moves[0] as number, nodes: 1 };
  if (params.mode === 'jumper') return { move: jumperMove(board, seat, layout, view.rules, moves, params.slip, rng), nodes: moves.length };
  if (params.mode === 'greedy') return { move: greedyMove(board, seat, layout, view.rules, moves, params.slip, rng), nodes: moves.length };
  if (view.players === 2) return searchMove(view, params, rng);
  return { move: lookahead(board, seat, layout, view.rules, params.beams, 0, rng).move, nodes: moves.length };
}

function legalAction(view: CcState, move: number): CcAction {
  const action = actionOf(move);
  const found = chineseCheckers.legal(view, view.toMove).find((a) => chineseCheckers.codec.action.toJSON(a) === chineseCheckers.codec.action.toJSON(action));
  if (!found) throw new Error(`The CPU chose ${chineseCheckers.codec.action.toText(action)}, which is not legal here`);
  return found;
}

// ---------------------------------------------------------------------------------------------
// Coach

/** Winning chances (0 to 100) for a search score in hundredths of a row: a lead of four rows is about three in four. */
export function chanceOf(score: number): number {
  if (isMateScore(score) || Math.abs(score) >= DECIDED) return score > 0 ? 100 : 0;
  return 100 / (1 + Math.exp(-score / 350));
}

function moveJson(move: number): Record<string, Json> {
  const action = actionOf(move);
  if (action.type === 'pass') return { move: 'pass', name: 'pass', from: '', to: '' };
  return { move: chineseCheckers.codec.action.toJSON(action), name: chineseCheckers.codec.action.toText(action), from: holeCode(action.from), to: holeCode(action.to) };
}

/** Each listed move's value for the side to move, best first (two players: searched; more: lookahead). */
export function rankMoves(view: CcState, nodes: number, top: number): { move: number; value: number }[] {
  const board = boardArray(view.board);
  const layout = layoutOf(view);
  if (view.players === 2) {
    const answer = searchPosition(view, 3, nodes, true, 0);
    return answer.result.scored.slice(0, top).map((s) => ({ move: s.move, value: chanceOf(s.score) }));
  }
  // More players: each move scored by the lookahead from the position it leaves.
  const seat = view.toMove;
  const moves = movesOf(board, seat, layout, view.rules);
  const values = moves.map((m) => {
    const first = costAfter(board, seat, layout, view.rules, m);
    if (first === -Infinity) return { move: m, cost: -Infinity };
    play(board, m);
    const next = lookahead(board, seat, layout, view.rules, [], 1, null);
    undo(board, m);
    return { move: m, cost: next.value === -Infinity ? first - 1 : 0.4 * first + 0.6 * next.value };
  });
  values.sort((a, b) => a.cost - b.cost);
  // Values are relative to the best move (50): with several players there is no single opponent to measure against.
  const best = values[0]?.cost ?? 0;
  return values.slice(0, top).map((v) => ({ move: v.move, value: best === -Infinity ? (v.cost === -Infinity ? 100 : 0) : chanceOf(best - v.cost) }));
}

function advise(view: CcView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  if (view.end !== null) return { move: null };
  switch (query.type) {
    case 'hint':
    case 'best': {
      const { move } = chooseMove(view, COACH_LEVEL, rng);
      const json = moveJson(move);
      if (query.type === 'best') return { action: json.move ?? 'pass' };
      return { ...json, idea: ideaOf(view, actionOf(move)) };
    }
    case 'eval': {
      if (view.players !== 2) return { value: 50 };
      const answer = searchPosition(view, 3, 20_000, false, 0);
      return { value: Math.round(chanceOf(answer.score) * 10) / 10 };
    }
    case 'analyse': {
      // Values for the best few moves, and for the move played when it is named: game review.
      const nodes = typeof query.nodes === 'number' ? Math.min(200_000, Math.max(2_000, query.nodes)) : REVIEW_NODES;
      const ranked = rankMoves(view, nodes, 999);
      const round1 = (v: number) => Math.round(v * 10) / 10;
      const named = typeof query.move === 'string' ? ranked.find((r) => moveJson(r.move).move === query.move) : undefined;
      return {
        value: round1(ranked[0]?.value ?? 50),
        lines: ranked.slice(0, 4).map((r) => ({ ...moveJson(r.move), value: round1(r.value) })),
        played: named ? { ...moveJson(named.move), value: round1(named.value) } : null,
      };
    }
    case 'check-move': {
      const text = typeof query.move === 'string' ? query.move : '';
      const action = chineseCheckers.legal(view, view.toMove).find((a) => chineseCheckers.codec.action.toJSON(a) === text);
      if (!action) throw new Error(`${text} is not legal here`);
      if (action.type === 'pass') return { warn: false, loss: 0 };
      const board = boardArray(view.board);
      const layout = layoutOf(view);
      const seat = view.toMove;
      const played = action.from | (action.to << 8);
      const { move: best } = chooseMove(view, COACH_LEVEL, rng);
      if (best === played) return { warn: false, loss: 0 };
      const mine = costAfter(board, seat, layout, view.rules, played);
      const theirs = costAfter(board, seat, layout, view.rules, best);
      const loss = theirs === -Infinity ? 100 : Math.max(0, mine - theirs);
      // Warn when the move gives away two rows or more against the best one.
      const lost = rowsGained(layout, seat, played) < rowsGained(layout, seat, best);
      return { warn: loss >= 200, loss: Math.round(loss), reason: theirs === -Infinity ? 'misses-finish' : lost ? 'slower' : 'leaves-behind', better: moveJson(best) };
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const ccBots: BotSet<CcView, CcAction> = {
  gameId: 'chinese-checkers',
  levels: CC_LEVELS,
  choose({ view, seat, level, rng }: BotInput<CcView>): BotChoice<CcAction> {
    if (chineseCheckers.turn(view) !== seat) throw new Error('It is not the CPU’s turn');
    const { move, nodes } = chooseMove(view, level, rng);
    const action = legalAction(view, move);
    return { action, tags: moveTags(view, action), nodes };
  },
  advise: ({ view, query, rng }: AdviseInput<CcView>) => advise(view, query, rng),
  encode: (action) => chineseCheckers.codec.action.toJSON(action),
};
