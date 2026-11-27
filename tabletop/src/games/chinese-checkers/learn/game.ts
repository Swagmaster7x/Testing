/**
 * Chinese Checkers for the lesson runner: positions in the position notation
 * (docs/rules/chinese-checkers.md, "Notation"), moves as hole names ("4b-5f", "3a-5e-7e") or stored
 * codes ("fnfm"), canonical form the stored code. Numbers for lesson text are computed here from
 * the rules module: the board, rows to go, marbles home, how far a marble can reach.
 */
import { findLegal } from '../../../core/contract';
import { createRng } from '../../../core/rng';
import type { LessonGame } from '../../../teach/runner';
import { HOLE_NAME_PATTERN, HOLES, holeName, POINT_HOLES, ROW_FROM } from '../board';
import { generateMoves, homeComplete, layoutFor, marblesHome, PASS, PLAYER_COUNTS } from '../engine';
import type { CcAction, CcState } from '../rules';
import { boardArray, chineseCheckers, DEFAULT_CONFIG, layoutOf, legalMoves, MARBLE_COUNTS, positionText, rowsLeft, SEAT_LETTERS, TURN_LIMITS } from '../rules';
import { fastestFinish, longestMoves } from '../solver';

function parse(state: CcState, move: string): CcAction | null {
  const seat = chineseCheckers.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(chineseCheckers, state, seat, chineseCheckers.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

const layout10 = layoutFor(2, 10);
const startRows = rowsLeft(chineseCheckers.setup(DEFAULT_CONFIG, createRng('lessons')))[0] ?? 0;

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  holes: HOLES,
  point: POINT_HOLES,
  middle: HOLES - 6 * POINT_HOLES,
  fifteen: MARBLE_COUNTS[1] ?? 15,
  points: 6,
  directions: 6,
  'players:min': PLAYER_COUNTS[0] ?? 2,
  'players:max': PLAYER_COUNTS[PLAYER_COUNTS.length - 1] ?? 6,
  'row:first': 1,
  'row:tip': 17,
  'row:base': layout10.rowBase,
  'rows:start': startRows,
  'limit:default': DEFAULT_CONFIG.rules.limit,
  'limit:short': TURN_LIMITS[0] ?? 100,
  'marbles:four': 4 * POINT_HOLES,
  'marbles:six': 6 * POINT_HOLES,
};

const scratch = new Int32Array(1024);

export const ccLessonGame: LessonGame<CcState> = {
  position: (text) => chineseCheckers.codec.state.fromText(text),
  notation: positionText,
  play(state, move) {
    const action = parse(state, move);
    return action ? chineseCheckers.apply(state, action).state : null;
  },
  canonical(state, move) {
    const action = parse(state, move);
    return action ? (chineseCheckers.codec.action.toJSON(action) as string) : null;
  },
  goalMet(goal, before, after, move) {
    const mover = before.toMove;
    if (goal === 'win') return after.done[0] === mover;
    // "mate" is how problems accept any finish on the last move of a line: the move completes the home.
    if (goal === 'mate') {
      const action = parse(before, move);
      return action !== null && action.type === 'move' && after.done.includes(mover) && !before.done.includes(mover);
    }
    return false;
  },
  over: (state) => chineseCheckers.turn(state) === null,
  toMove: (state) => chineseCheckers.turn(state),
  moves: (state) => (chineseCheckers.turn(state) === null ? [] : legalMoves(state).map((m) => chineseCheckers.codec.action.toJSON(m === PASS ? { type: 'pass' } : { type: 'move', from: m & 0xff, to: (m >> 8) & 0xff }) as string)),
  computed(state) {
    const out: Record<string, number | string> = { ...FIXED };
    const board = boardArray(state.board);
    const layout = layoutOf(state);
    out.players = state.players;
    out.marbles = state.marbles;
    out['marbles:all'] = state.players * state.marbles;
    out.limit = state.rules.limit;
    out.round = state.round;
    const rows = rowsLeft(state);
    for (let seat = 0; seat < state.players; seat++) {
      const letter = SEAT_LETTERS[seat] as string;
      out[`rows:${letter}`] = rows[seat] as number;
      out[`home:${letter}`] = marblesHome(board, seat, layout);
      out[`empty:${letter}`] = (layout.homeHoles[seat] as readonly number[]).filter((h) => board[h] === 0).length;
    }
    const seat = chineseCheckers.turn(state);
    if (seat === null) return out;
    out['rows:mover'] = rows[seat] as number;
    const n = generateMoves(board, seat, layout, state.rules, scratch);
    out.moves = scratch[0] === PASS ? 0 : n;
    // How many holes each of the mover's marbles can reach, by hole name ("reach:5e").
    const reach = new Map<number, number>();
    for (let i = 0; i < n; i++) {
      const m = scratch[i] as number;
      if (m === PASS) continue;
      reach.set(m & 0xff, (reach.get(m & 0xff) ?? 0) + 1);
    }
    for (let h = 0; h < HOLES; h++) if (board[h] === seat + 1) out[`reach:${holeName(h)}`] = reach.get(h) ?? 0;
    const longest = longestMoves(board, seat, layout, state.rules);
    out['gain:best'] = Math.max(0, longest.gain);
    // Rows of each of the mover's marbles counted from its start (row 1 at the tip).
    const point = layout.points[seat] as number;
    for (let h = 0; h < HOLES; h++) if (board[h] === seat + 1) out[`row:${holeName(h)}`] = ROW_FROM[point * HOLES + h] as number;
    // The fewest moves to finish, worked out only near the end (it is a search).
    if (!homeComplete(board, seat, layout, state.rules.finish) && (layout.homeHoles[seat] as readonly number[]).filter((h) => board[h] === 0).length <= 3) {
      const finish = fastestFinish(board, seat, layout, state.rules, 4);
      if (finish) out.finish = finish.length;
    }
    return out;
  },
  stripNotation: (text) => text.replace(/\b(?:1[0-7]|[1-9])[a-m](?:-(?:1[0-7]|[1-9])[a-m])+\b/g, ' ').replace(HOLE_NAME_PATTERN, ' '),
};
