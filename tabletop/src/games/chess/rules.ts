/**
 * Chess behind the game contract, with chess.js doing the move generation.
 * Rules as implemented: docs/rules/chess.md.
 *
 * Seat 0 plays White and seat 1 plays Black. Draws by threefold repetition, the fifty-move rule
 * and insufficient material are applied automatically, as in online play.
 */
import { Chess, validateFen } from 'chess.js';
import type { Square } from 'chess.js';
import type { Codec, GameDef, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PromotionPiece = 'q' | 'r' | 'b' | 'n';
export type ChessColor = 'w' | 'b';

export type ChessResult =
  | { readonly kind: 'checkmate'; readonly winner: Seat }
  | { readonly kind: 'stalemate' | 'threefold' | 'fifty-move' | 'insufficient' };

export interface ChessState {
  readonly fen: string;
  /** Position keys since the last capture or pawn move, oldest first, for repetition. */
  readonly keys: readonly string[];
  readonly result: ChessResult | null;
}

export interface ChessAction {
  readonly from: Square;
  readonly to: Square;
  readonly promotion?: PromotionPiece;
  /** Standard algebraic notation, filled in for every legal action. */
  readonly san: string;
}

export interface ChessConfig {
  /** A starting position other than the usual one (lessons, problems, set-ups). */
  readonly fen?: string;
}

export type ChessView = ChessState;

export type ChessEvent =
  | {
      readonly type: 'move';
      readonly seat: Seat;
      readonly from: Square;
      readonly to: Square;
      readonly piece: PieceType;
      readonly captured?: PieceType;
      readonly promotion?: PromotionPiece;
      /** For castling, the rook's move as well. */
      readonly rook?: { readonly from: Square; readonly to: Square };
      /** For en passant, the square of the pawn that was taken. */
      readonly taken?: Square;
      readonly san: string;
    }
  | { readonly type: 'check'; readonly seat: Seat }
  | { readonly type: 'end'; readonly result: ChessResult };

export const seatOf = (color: ChessColor): Seat => (color === 'w' ? 0 : 1);
export const colorOf = (seat: Seat): ChessColor => (seat === 0 ? 'w' : 'b');

/** The part of a FEN that decides repetition: board, side to move, castling and en passant. */
export function positionKey(fen: string): string {
  return fen.split(' ').slice(0, 4).join(' ');
}

export function sideToMove(fen: string): ChessColor {
  return fen.split(' ')[1] === 'b' ? 'b' : 'w';
}

function load(fen: string): Chess {
  return new Chess(fen);
}

/** The draw rules, as numbers the lessons can quote. */
export const FIFTY_MOVE_RULE = 50;
export const REPETITIONS_FOR_DRAW = 3;

function judge(chess: Chess, keys: readonly string[]): ChessResult | null {
  if (chess.isCheckmate()) return { kind: 'checkmate', winner: seatOf(chess.turn() === 'w' ? 'b' : 'w') };
  if (chess.isStalemate()) return { kind: 'stalemate' };
  if (chess.isInsufficientMaterial()) return { kind: 'insufficient' };
  const key = keys[keys.length - 1];
  if (key !== undefined && keys.filter((k) => k === key).length >= REPETITIONS_FOR_DRAW) return { kind: 'threefold' };
  if (Number(chess.fen().split(' ')[4]) >= FIFTY_MOVE_RULE * 2) return { kind: 'fifty-move' };
  return null;
}

function stateFromFen(fen: string): ChessState {
  const check = validateFen(fen);
  if (!check.ok) throw new Error(`Not a legal position: ${check.error ?? fen}`);
  const chess = load(fen);
  const normal = chess.fen();
  const keys = [positionKey(normal)];
  return { fen: normal, keys, result: judge(chess, keys) };
}

const SQUARE = /^[a-h][1-8]$/;

function parseUci(text: string): Omit<ChessAction, 'san'> {
  const m = /^([a-h][1-8])([a-h][1-8])([qrbn])?$/.exec(text.trim().toLowerCase());
  if (!m) throw new Error(`"${text}" is not a move in from-to form, such as e2e4`);
  const base = { from: m[1] as Square, to: m[2] as Square };
  return m[3] ? { ...base, promotion: m[3] as PromotionPiece } : base;
}

export function uciOf(a: Pick<ChessAction, 'from' | 'to' | 'promotion'>): string {
  return `${a.from}${a.to}${a.promotion ?? ''}`;
}

const stateCodec: Codec<ChessState> = {
  toJSON: (s) => ({ fen: s.fen, keys: [...s.keys] }),
  fromJSON(json: Json) {
    if (!isJsonObject(json) || typeof json.fen !== 'string') throw new Error('Not a chess position');
    const base = stateFromFen(json.fen);
    const keys = Array.isArray(json.keys) && json.keys.every((k) => typeof k === 'string') && json.keys.length > 0 ? (json.keys) : base.keys;
    if (keys[keys.length - 1] !== positionKey(base.fen)) throw new Error('The repetition history does not end at this position');
    return { fen: base.fen, keys, result: judge(load(base.fen), keys) };
  },
  toText: (s) => s.fen,
  fromText: (text) => stateFromFen(text.trim()),
};

const actionCodec: Codec<ChessAction> = {
  toJSON: (a) => uciOf(a),
  fromJSON(json: Json) {
    if (typeof json !== 'string') throw new Error('A chess move is stored as text, such as e2e4');
    return { ...parseUci(json), san: '' };
  },
  toText: (a) => a.san || uciOf(a),
  fromText(text, context) {
    // From-to form is all lower case; standard notation uses capitals for pieces (B6d7 is a bishop).
    if (/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(text.trim())) return { ...parseUci(text), san: '' };
    // Standard algebraic notation needs the position it is played in.
    if (!context || typeof (context as ChessState).fen !== 'string') throw new Error(`"${text}" needs a position to be read`);
    const want = text.trim().replace(/[+#!?]+$/, '');
    const found = load((context as ChessState).fen)
      .moves({ verbose: true })
      .find((m) => m.san.replace(/[+#]+$/, '') === want);
    if (!found) throw new Error(`"${text}" is not a legal move here`);
    return toAction(found);
  },
};

const configCodec: JsonCodec<ChessConfig> = {
  toJSON(c) {
    const out: { [key: string]: Json } = {};
    if (c.fen) out.fen = c.fen;
    return out;
  },
  fromJSON(json: Json) {
    if (isJsonObject(json) && typeof json.fen === 'string') {
      stateFromFen(json.fen);
      return { fen: json.fen };
    }
    return {};
  },
};

function toAction(move: { from: string; to: string; promotion?: string; san: string }): ChessAction {
  const base = { from: move.from as Square, to: move.to as Square, san: move.san };
  return move.promotion ? { ...base, promotion: move.promotion as PromotionPiece } : base;
}

export const chess: GameDef<ChessState, ChessAction, ChessConfig, ChessView, ChessEvent> = {
  id: 'chess',
  rulesVersion: 1,
  defaultConfig: {},

  setup: (config) => stateFromFen(config.fen ?? START_FEN),

  seats: () => [0, 1],

  turn: (s) => (s.result ? null : seatOf(sideToMove(s.fen))),

  legal(s, seat) {
    if (chess.turn(s) !== seat) return [];
    return load(s.fen)
      .moves({ verbose: true })
      .map((m) => toAction(m));
  },

  apply(s, action) {
    const seat = chess.turn(s);
    if (seat === null) throw new Error('The game is over');
    if (!SQUARE.test(action.from) || !SQUARE.test(action.to)) throw new Error('A move needs two squares');
    const board = load(s.fen);
    let move;
    try {
      move = board.move(action.promotion ? { from: action.from, to: action.to, promotion: action.promotion } : { from: action.from, to: action.to });
    } catch {
      throw new Error(`${uciOf(action)} is not legal here`);
    }
    const fen = board.fen();
    const irreversible = move.piece === 'p' || move.isCapture();
    const keys = irreversible ? [positionKey(fen)] : [...s.keys, positionKey(fen)];
    const result = judge(board, keys);
    const event: ChessEvent = {
      type: 'move',
      seat,
      from: move.from,
      to: move.to,
      piece: move.piece,
      san: move.san,
      ...(move.captured ? { captured: move.captured } : {}),
      ...(move.promotion ? { promotion: move.promotion as PromotionPiece } : {}),
      ...(move.isKingsideCastle() ? { rook: castleRook(move.color, 'k') } : move.isQueensideCastle() ? { rook: castleRook(move.color, 'q') } : {}),
      ...(move.isEnPassant() ? { taken: `${move.to[0]}${move.from[1]}` as Square } : {}),
    };
    const events: ChessEvent[] = [event];
    if (board.inCheck() && !board.isCheckmate()) events.push({ type: 'check', seat: seatOf(board.turn()) });
    if (result) events.push({ type: 'end', result });
    return { state: { fen, keys, result }, events };
  },

  outcome(s): Outcome | null {
    if (!s.result) return null;
    if (s.result.kind === 'checkmate') {
      const winner = s.result.winner;
      return {
        reason: 'checkmate',
        results: [
          { seat: winner, place: 1, score: 1 },
          { seat: winner === 0 ? 1 : 0, place: 2, score: 0 },
        ],
      };
    }
    return {
      reason: s.result.kind,
      results: [
        { seat: 0, place: 1, score: 0.5 },
        { seat: 1, place: 1, score: 0.5 },
      ],
    };
  },

  view: (s) => s,
  sample: (view) => view,

  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

function castleRook(color: ChessColor, side: 'k' | 'q'): { from: Square; to: Square } {
  const rank = color === 'w' ? '1' : '8';
  return side === 'k' ? { from: `h${rank}` as Square, to: `f${rank}` as Square } : { from: `a${rank}` as Square, to: `d${rank}` as Square };
}

/** Piece on a square, as chess.js sees it. */
export function pieceAt(fen: string, square: Square): { color: ChessColor; type: PieceType } | null {
  const p = load(fen).get(square);
  return p ? { color: p.color, type: p.type } : null;
}

/** The square of the king of the side to move when it is in check. */
export function checkedKing(fen: string): Square | null {
  const board = load(fen);
  if (!board.inCheck()) return null;
  return board.findPiece({ color: board.turn(), type: 'k' })[0] ?? null;
}

export const PIECE_VALUE: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

/** Material for each side in pawns, using the usual 1-3-3-5-9 values. */
export function material(fen: string): { w: number; b: number } {
  const out = { w: 0, b: 0 };
  for (const row of load(fen).board()) {
    for (const p of row) if (p) out[p.color] += PIECE_VALUE[p.type];
  }
  return out;
}

/** All 64 squares from a8 to h1, row by row as seen from White. */
export const SQUARES: readonly Square[] = (() => {
  const out: Square[] = [];
  for (let r = 8; r >= 1; r--) for (const f of 'abcdefgh') out.push(`${f}${r}` as Square);
  return out;
})();

export { load as chessAt };
