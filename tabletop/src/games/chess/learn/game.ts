/** Chess for the lesson runner: positions in FEN, moves in from-to form or standard notation. */
import { findLegal } from '../../../core/contract';
import type { LessonGame } from '../../../teach/runner';
import type { ChessState } from '../rules';
import { chess, chessAt, FIFTY_MOVE_RULE, material, PIECE_VALUE, REPETITIONS_FOR_DRAW, SQUARES, START_FEN, uciOf } from '../rules';

function parse(state: ChessState, move: string) {
  const seat = chess.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(chess, state, seat, chess.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

const start = chessAt(START_FEN);
const startCounts: Record<string, number> = {};
for (const row of start.board()) for (const p of row) if (p && p.color === 'w') startCounts[p.type] = (startCounts[p.type] ?? 0) + 1;

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'board:squares': SQUARES.length,
  'board:files': Math.round(Math.sqrt(SQUARES.length)),
  'pieces:each': Object.values(startCounts).reduce((a, b) => a + b, 0),
  'pawns:each': startCounts.p ?? 0,
  'value:p': PIECE_VALUE.p,
  'value:n': PIECE_VALUE.n,
  'value:b': PIECE_VALUE.b,
  'value:r': PIECE_VALUE.r,
  'value:q': PIECE_VALUE.q,
  'value:rook-for-knight': PIECE_VALUE.r - PIECE_VALUE.n,
  'value:queen-for-rook': PIECE_VALUE.q - PIECE_VALUE.r,
  'rule:fifty': FIFTY_MOVE_RULE,
  'rule:repetition': REPETITIONS_FOR_DRAW,
};

export const chessLessonGame: LessonGame<ChessState> = {
  position: (fen) => chess.codec.state.fromText(fen),
  notation: (state) => state.fen,
  play(state, move) {
    const action = parse(state, move);
    return action ? chess.apply(state, action).state : null;
  },
  canonical(state, move) {
    const action = parse(state, move);
    return action ? uciOf(action) : null;
  },
  goalMet(goal, before, after, move) {
    const mover = before.fen.split(' ')[1] === 'w' ? 0 : 1;
    if (goal === 'mate') return after.result?.kind === 'checkmate' && after.result.winner === mover;
    if (goal === 'promote') return /^[a-h][1-8][a-h][1-8][qrbn]$/.test(chessLessonGame.canonical(before, move) ?? '');
    const a = material(after.fen);
    const b = material(before.fen);
    const lead = (m: { w: number; b: number }) => (mover === 0 ? m.w - m.b : m.b - m.w);
    return lead(a) - lead(b) >= 3;
  },
  toMove: (state) => chess.turn(state),
  over: (state) => state.result !== null,
  moves(state) {
    const seat = chess.turn(state);
    return seat === null ? [] : chess.legal(state, seat).map(uciOf);
  },
  computed(state) {
    const board = chessAt(state.fen);
    const out: Record<string, number> = { ...FIXED };
    const m = material(state.fen);
    out['material:white'] = m.w;
    out['material:black'] = m.b;
    out['material:diff'] = Math.abs(m.w - m.b);
    out['moves:legal'] = board.moves().length;
    for (const sq of SQUARES) {
      const piece = board.get(sq);
      if (!piece) continue;
      // Moves for the piece on a square, counted as if it were that side's turn.
      const parts = state.fen.split(' ');
      parts[1] = piece.color;
      parts[3] = '-';
      try {
        out[`moves:${sq}`] = chessAt(parts.join(' ')).moves({ square: sq }).length;
      } catch {
        out[`moves:${sq}`] = 0;
      }
      out[`attackers:${sq}`] = board.attackers(sq, piece.color === 'w' ? 'b' : 'w').length;
      out[`defenders:${sq}`] = board.attackers(sq, piece.color).length;
    }
    return out;
  },
};
