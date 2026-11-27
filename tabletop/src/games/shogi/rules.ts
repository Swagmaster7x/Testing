/**
 * Shogi behind the game contract. The position core (core.ts) generates the moves; this module
 * keeps the game immutable and adds what depends on the game's history and options: repetition
 * (sennichite) and perpetual check, impasse (jishogi), the move limit and the result.
 * Rules as implemented: docs/rules/shogi.md.
 *
 * Seat 0 is Black (sente) and seat 1 White (gote). In a handicap game White gives the handicap
 * and moves first. Actions are stored in the app's canonical move form: "7776", "8822+", "P*55",
 * or "declare" for an impasse claim.
 */
import type { Codec, GameDef, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { BoardKind, Color, Position } from './core';
import {
  BASE,
  BISHOP,
  colorOfCode,
  deadRank,
  dropType,
  EMPTY,
  encodeDrop,
  HAND_LETTER,
  HAND_TYPES,
  inZone,
  isDrop,
  isPieceCode,
  isPromotion,
  KING,
  moveFrom,
  moveTo,
  movingOf,
  parseSfen,
  parseSquare,
  PAWN,
  positionProblems,
  ROOK,
  sfenBoardKind,
  squareIndex,
  squareName,
  typeOfCode,
  WALL,
} from './core';
import { DECLARE, moveFromCanonical, parseWestern, toCanonical, westernAll } from './notation';
import type { HandicapId, ImpasseRule, ShogiConfig } from './presets';
import { DECLARE_BLACK, DECLARE_PIECES, DECLARE_WHITE, handicapFor, IMPASSE_24, IMPASSE_BIG, IMPASSE_SMALL, REPETITIONS } from './presets';

export type { ShogiConfig } from './presets';

export type HandPiece = 'P' | 'L' | 'N' | 'S' | 'G' | 'B' | 'R';
/** Piece names used in events and labels. */
export type PieceName = 'pawn' | 'lance' | 'knight' | 'silver' | 'gold' | 'bishop' | 'rook' | 'king' | 'tokin' | 'promoted-lance' | 'promoted-knight' | 'promoted-silver' | 'horse' | 'dragon';
export const PIECE_NAMES: readonly PieceName[] = ['pawn', 'lance', 'knight', 'silver', 'gold', 'bishop', 'rook', 'king', 'tokin', 'promoted-lance', 'promoted-knight', 'promoted-silver', 'horse', 'dragon'];

export interface ShogiRules {
  readonly board: BoardKind;
  readonly impasse: ImpasseRule;
  /** Draw at this many moves; 0 for no limit. */
  readonly moveLimit: number;
  readonly handicap: HandicapId;
  /** Impasse points of the pieces White removed for a handicap; they count for White. */
  readonly handicapPoints: number;
  /** The seat that made the first move of the game (mini-shogi's repetition rule). */
  readonly first: Seat;
}

export type ShogiResult =
  | { readonly kind: 'checkmate' | 'no-moves' | 'perpetual-check' | 'impasse-declared' | 'try'; readonly winner: Seat }
  | { readonly kind: 'repetition'; readonly winner: Seat | null }
  | { readonly kind: 'impasse-count'; readonly winner: Seat | null; readonly points: readonly [number, number] }
  | { readonly kind: 'move-limit' };

export interface ShogiState {
  /** The position, with the number of the next move. */
  readonly sfen: string;
  readonly rules: ShogiRules;
  /** Repetition keys (board, side to move, hands) of every position of the game, oldest first. */
  readonly keys: readonly string[];
  /** For each position, whether the move that reached it gave check (false for the first). */
  readonly checks: readonly boolean[];
  readonly result: ShogiResult | null;
}

export type ShogiAction =
  | { readonly type: 'move'; readonly from: string; readonly to: string; readonly promote: boolean; readonly text: string }
  | { readonly type: 'drop'; readonly piece: HandPiece; readonly to: string; readonly text: string }
  | { readonly type: 'declare'; readonly text: string };

export type ShogiView = ShogiState;

export type ShogiEvent =
  | {
      readonly type: 'move';
      readonly seat: Seat;
      readonly from: string;
      readonly to: string;
      /** The piece as it stood before the move. */
      readonly piece: PieceName;
      readonly promoted: boolean;
      readonly captured?: PieceName;
      readonly text: string;
    }
  | { readonly type: 'drop'; readonly seat: Seat; readonly piece: PieceName; readonly to: string; readonly text: string }
  | { readonly type: 'check'; readonly seat: Seat }
  | { readonly type: 'declare'; readonly seat: Seat }
  | { readonly type: 'end'; readonly result: ShogiResult };

export const DEFAULT_IMPASSE: ImpasseRule = 'declare-27';

const POSITIONS = new Map<string, Position>();

/** A fresh, mutable copy of the position in an SFEN (parsed once and remembered). */
export function positionOf(sfen: string): Position {
  let p = POSITIONS.get(sfen);
  if (!p) {
    p = parseSfen(sfen);
    if (POSITIONS.size > 256) POSITIONS.clear();
    POSITIONS.set(sfen, p);
  }
  return p.clone();
}

export const seatOfColor = (color: Color): Seat => color;
export const sideToMove = (state: ShogiState): Seat => (state.sfen.split(' ')[1] === 'w' ? 1 : 0);

// ---------------------------------------------------------------------------------------------
// Impasse
// ---------------------------------------------------------------------------------------------

function piecePoints(type: number): number {
  const base = BASE[type] ?? PAWN;
  if (base === KING) return 0;
  return base === ROOK || base === BISHOP ? IMPASSE_BIG : IMPASSE_SMALL;
}

/** Impasse points of a side under the 24-point rule: every piece it owns, on the board and in hand. */
export function impassePoints(p: Position, color: Color, rules: Pick<ShogiRules, 'handicapPoints'>): number {
  let total = 0;
  for (const sq of p.geo.squares) {
    const code = p.board[sq]!;
    if (code !== EMPTY && colorOfCode(code) === color) total += piecePoints(typeOfCode(code));
  }
  for (let type = 0; type < HAND_TYPES; type++) total += p.handCount(color, type) * piecePoints(type);
  return total + (color === 1 ? rules.handicapPoints : 0);
}

/** Declaration points: only pieces inside the enemy camp and in hand (the king does not count). */
export function declarationPoints(p: Position, color: Color, rules: Pick<ShogiRules, 'handicapPoints'>): { points: number; pieces: number } {
  let points = 0;
  let pieces = 0;
  for (const sq of p.geo.squares) {
    const code = p.board[sq]!;
    if (code === EMPTY || colorOfCode(code) !== color || typeOfCode(code) === KING) continue;
    if (!inZone(p.geo, color, p.geo.rankOf[sq]!)) continue;
    points += piecePoints(typeOfCode(code));
    pieces++;
  }
  for (let type = 0; type < HAND_TYPES; type++) points += p.handCount(color, type) * piecePoints(type);
  return { points: points + (color === 1 ? rules.handicapPoints : 0), pieces };
}

function kingEntered(p: Position, color: Color): boolean {
  const king = p.kings[color]!;
  return king >= 0 && inZone(p.geo, color, p.geo.rankOf[king]!);
}

/** True when the side to move may call the impasse count or declare a win, by the rule in force. */
export function canDeclare(state: ShogiState, p: Position = positionOf(state.sfen)): boolean {
  const { rules } = state;
  if (state.result || rules.board !== 'standard') return false;
  if (rules.impasse !== 'points-24' && rules.impasse !== 'declare-27') return false;
  const side = p.side;
  if (p.inCheck()) return false;
  if (rules.impasse === 'points-24') return kingEntered(p, 0) && kingEntered(p, 1);
  if (!kingEntered(p, side)) return false;
  const { points, pieces } = declarationPoints(p, side, rules);
  return pieces >= DECLARE_PIECES && points >= (side === 0 ? DECLARE_BLACK : DECLARE_WHITE);
}

/** The try rule: the king has just reached the enemy king's starting square with both kings entered. */
function isTry(p: Position, mover: Color, to: number): boolean {
  if (typeOfCode(p.board[to]!) !== KING) return false;
  const geo = p.geo;
  const middle = Math.ceil(geo.files / 2);
  const target = squareIndex(geo, middle, mover === 0 ? 1 : geo.ranks);
  return to === target && kingEntered(p, (1 - mover) as Color);
}

// ---------------------------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------------------------

function defaultRules(board: BoardKind, first: Seat): ShogiRules {
  return { board, impasse: board === 'standard' ? DEFAULT_IMPASSE : 'none', moveLimit: 0, handicap: 'even', handicapPoints: 0, first };
}

/** The result of a position reached without history: checkmate or no legal move. */
function judgePosition(p: Position): ShogiResult | null {
  if (p.hasLegalMove()) return null;
  const winner = (1 - p.side);
  return p.inCheck() ? { kind: 'checkmate', winner } : { kind: 'no-moves', winner };
}

/** Reads an SFEN into a state, checking that the position could occur. */
export function stateFromSfen(sfen: string, rules?: Partial<ShogiRules>): ShogiState {
  const p = parseSfen(sfen);
  const problems = positionProblems(p);
  if (problems.length > 0) throw new Error(`Not a legal shogi position: ${problems.join('; ')}`);
  const normal = p.sfen();
  const board = p.geo.kind;
  const merged: ShogiRules = { ...defaultRules(board, p.side), ...rules, board };
  const full: ShogiRules = board === 'mini' ? { ...merged, impasse: 'none' } : merged;
  return { sfen: normal, rules: full, keys: [p.key()], checks: [false], result: judgePosition(p) };
}

function rulesFromConfig(config: ShogiConfig): { sfen: string; rules: Omit<ShogiRules, 'first' | 'board'> } {
  const board: BoardKind = config.position ? sfenBoardKind(config.position) : (config.board ?? 'standard');
  const handicapId = config.handicap ?? 'even';
  const handicap = handicapFor(board, handicapId) ?? handicapFor(board, 'even');
  if (!handicap) throw new Error(`No ${handicapId} handicap on the ${board} board`);
  const impasse: ImpasseRule = board === 'mini' ? 'none' : (config.impasse ?? DEFAULT_IMPASSE);
  return {
    sfen: config.position ?? handicap.sfen,
    rules: { impasse, moveLimit: Math.max(0, Math.floor(config.moveLimit ?? 0)), handicap: handicap.id, handicapPoints: board === 'standard' ? handicap.points : 0 },
  };
}

function setupState(config: ShogiConfig): ShogiState {
  const { sfen, rules } = rulesFromConfig(config);
  const p = parseSfen(sfen);
  return stateFromSfen(sfen, { ...rules, first: p.side });
}

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------

function actionOf(p: Position, m: number, text: string): ShogiAction {
  const geo = p.geo;
  if (isDrop(m)) return { type: 'drop', piece: HAND_LETTER[dropType(m)] as HandPiece, to: squareName(geo, moveTo(m)), text };
  return { type: 'move', from: squareName(geo, moveFrom(m)), to: squareName(geo, moveTo(m)), promote: isPromotion(m), text };
}

export function canonicalAction(a: Pick<ShogiAction, 'type'> & Partial<{ from: string; to: string; promote: boolean; piece: HandPiece }>): string {
  if (a.type === 'declare') return DECLARE;
  if (a.type === 'drop') return `${a.piece}*${a.to}`;
  return `${a.from}${a.to}${a.promote ? '+' : ''}`;
}

function parseCanonicalAction(text: string): ShogiAction {
  const canonical = toCanonical(text);
  if (canonical === null) throw new Error(`"${text}" is not a shogi move such as 7776, 8822+ or P*55`);
  if (canonical === DECLARE) return { type: 'declare', text: '' };
  const drop = /^([PLNSGBR])\*(\d\d)$/.exec(canonical);
  if (drop) return { type: 'drop', piece: drop[1] as HandPiece, to: drop[2] ?? '', text: '' };
  const m = /^(\d\d)(\d\d)(\+?)$/.exec(canonical);
  if (!m) throw new Error(`"${text}" is not a shogi move`);
  return { type: 'move', from: m[1] ?? '', to: m[2] ?? '', promote: m[3] === '+', text: '' };
}

/** The legal moves of the side to move as packed moves, with their actions. */
export function legalPairs(state: ShogiState): { p: Position; moves: number[]; actions: ShogiAction[] } {
  const p = positionOf(state.sfen);
  if (state.result) return { p, moves: [], actions: [] };
  const moves = p.legalMoves();
  const texts = westernAll(p, moves);
  const actions = moves.map((m, i) => actionOf(p, m, texts[i] ?? ''));
  if (canDeclare(state, p)) actions.push({ type: 'declare', text: state.rules.impasse === 'points-24' ? 'Impasse count' : 'Impasse declaration' });
  return { p, moves, actions };
}

/** The packed move for an action in a state, or null if it is not legal. */
export function packedMove(state: ShogiState, action: ShogiAction): number | null {
  if (action.type === 'declare') return null;
  const p = positionOf(state.sfen);
  return moveFromCanonical(p, p.legalMoves(), canonicalAction(action));
}

// ---------------------------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------------------------

/** Repetition after the newest position: null, or the result (draw, mini-shogi loss, perpetual check). */
function repetitionResult(keys: readonly string[], checks: readonly boolean[], rules: ShogiRules): ShogiResult | null {
  const last = keys[keys.length - 1];
  if (last === undefined) return null;
  let count = 0;
  let first = -1;
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === last) {
      count++;
      if (first < 0) first = i;
    }
  }
  if (count < REPETITIONS) return null;
  // Moves since the first time the position appeared: move j reached keys[j], played by the side
  // not to move in keys[j].
  const checking = [true, true];
  const moved = [false, false];
  for (let j = first + 1; j < keys.length; j++) {
    const mover = keys[j]?.split(' ')[1] === 'w' ? 0 : 1;
    moved[mover] = true;
    if (!checks[j]) checking[mover] = false;
  }
  const black = moved[0] && checking[0];
  const white = moved[1] && checking[1];
  if (black !== white) return { kind: 'perpetual-check', winner: black ? 1 : 0 };
  if (rules.board === 'mini') return { kind: 'repetition', winner: (1 - rules.first) };
  return { kind: 'repetition', winner: null };
}

function impasseCount(p: Position, rules: ShogiRules): ShogiResult {
  const points: [number, number] = [impassePoints(p, 0, rules), impassePoints(p, 1, rules)];
  const short0 = points[0] < IMPASSE_24;
  const short1 = points[1] < IMPASSE_24;
  const winner: Seat | null = short0 && !short1 ? 1 : short1 && !short0 ? 0 : null;
  return { kind: 'impasse-count', winner, points };
}

function apply(state: ShogiState, action: ShogiAction): { state: ShogiState; events: ShogiEvent[] } {
  if (state.result) throw new Error('The game is over');
  const p = positionOf(state.sfen);
  const seat = p.side as Seat;
  if (action.type === 'declare') {
    if (!canDeclare(state, p)) throw new Error('An impasse claim is not allowed here');
    const result: ShogiResult = state.rules.impasse === 'points-24' ? impasseCount(p, state.rules) : { kind: 'impasse-declared', winner: seat };
    return { state: { ...state, result }, events: [{ type: 'declare', seat }, { type: 'end', result }] };
  }
  const legal = p.legalMoves();
  const m = moveFromCanonical(p, legal, canonicalAction(action));
  if (m === null) throw new Error(`${canonicalAction(action)} is not legal here`);
  const text = westernAll(p, legal)[legal.indexOf(m)] ?? canonicalAction(action);
  const geo = p.geo;
  const movingType = typeOfCode(movingOf(m));
  const capturedCode = isDrop(m) ? EMPTY : p.board[moveTo(m)]!;
  const event: ShogiEvent = isDrop(m)
    ? { type: 'drop', seat, piece: PIECE_NAMES[dropType(m)]!, to: squareName(geo, moveTo(m)), text }
    : {
        type: 'move',
        seat,
        from: squareName(geo, moveFrom(m)),
        to: squareName(geo, moveTo(m)),
        piece: PIECE_NAMES[movingType]!,
        promoted: isPromotion(m),
        text,
        ...(capturedCode !== EMPTY ? { captured: PIECE_NAMES[typeOfCode(capturedCode)]! } : {}),
      };
  p.make(m);
  const check = p.inCheck();
  const keys = [...state.keys, p.key()];
  const checks = [...state.checks, check];
  let result: ShogiResult | null = judgePosition(p);
  if (!result) result = repetitionResult(keys, checks, state.rules);
  if (!result && state.rules.impasse === 'try' && state.rules.board === 'standard' && isTry(p, seat as Color, moveTo(m))) result = { kind: 'try', winner: seat };
  if (!result && state.rules.moveLimit > 0 && p.moveNumber - 1 >= state.rules.moveLimit) result = { kind: 'move-limit' };
  const events: ShogiEvent[] = [event];
  if (check && result?.kind !== 'checkmate') events.push({ type: 'check', seat: p.side });
  if (result) events.push({ type: 'end', result });
  return { state: { sfen: p.sfen(), rules: state.rules, keys, checks, result }, events };
}

function outcomeOf(state: ShogiState): Outcome | null {
  const r = state.result;
  if (!r) return null;
  const reason = r.kind === 'checkmate' ? 'checkmate' : r.kind === 'impasse-count' ? (r.winner === null ? 'shogi-impasse-draw' : 'shogi-impasse-24') : r.kind === 'repetition' && r.winner !== null ? 'shogi-repetition-loss' : `shogi-${r.kind}`;
  const winner = 'winner' in r ? r.winner : null;
  if (winner === null) {
    return { reason, results: [{ seat: 0, place: 1, score: 0.5 }, { seat: 1, place: 1, score: 0.5 }] };
  }
  return { reason, results: [{ seat: winner, place: 1, score: 1 }, { seat: (1 - winner), place: 2, score: 0 }] };
}

// ---------------------------------------------------------------------------------------------
// Codecs
// ---------------------------------------------------------------------------------------------

const IMPASSE_VALUES: readonly ImpasseRule[] = ['none', 'points-24', 'declare-27', 'try'];
const HANDICAP_VALUES: readonly HandicapId[] = ['even', 'lance', 'bishop', 'rook', 'rook-lance', 'two', 'four', 'six', 'eight', 'ten'];

function readRules(json: Json | undefined, fallback: ShogiRules): ShogiRules {
  if (!isJsonObject(json)) return fallback;
  return {
    board: fallback.board,
    impasse: fallback.board === 'mini' ? 'none' : IMPASSE_VALUES.includes(json.impasse as ImpasseRule) ? (json.impasse as ImpasseRule) : fallback.impasse,
    moveLimit: typeof json.moveLimit === 'number' && json.moveLimit >= 0 ? Math.floor(json.moveLimit) : fallback.moveLimit,
    handicap: HANDICAP_VALUES.includes(json.handicap as HandicapId) ? (json.handicap as HandicapId) : fallback.handicap,
    handicapPoints: typeof json.handicapPoints === 'number' && json.handicapPoints >= 0 ? json.handicapPoints : fallback.handicapPoints,
    first: json.first === 1 ? 1 : json.first === 0 ? 0 : fallback.first,
  };
}

function readResult(json: Json | undefined): ShogiResult | null {
  if (!isJsonObject(json)) return null;
  const seat = (v: Json | undefined): Seat | null => (v === 0 || v === 1 ? v : null);
  switch (json.kind) {
    case 'checkmate':
    case 'no-moves':
    case 'perpetual-check':
    case 'impasse-declared':
    case 'try': {
      const winner = seat(json.winner);
      if (winner === null) throw new Error('A shogi result needs a winner');
      return { kind: json.kind, winner };
    }
    case 'repetition':
      return { kind: 'repetition', winner: seat(json.winner) };
    case 'impasse-count': {
      const points = Array.isArray(json.points) && json.points.length === 2 && json.points.every((n) => typeof n === 'number') ? (json.points as [number, number]) : [0, 0];
      return { kind: 'impasse-count', winner: seat(json.winner), points: [points[0] ?? 0, points[1] ?? 0] };
    }
    case 'move-limit':
      return { kind: 'move-limit' };
    default:
      throw new Error('Unknown shogi result');
  }
}

const stateCodec: Codec<ShogiState> = {
  toJSON: (s) => ({
    sfen: s.sfen,
    rules: { ...s.rules },
    keys: [...s.keys],
    checks: s.checks.map((c) => (c ? 1 : 0)).join(''),
    result: s.result ? (JSON.parse(JSON.stringify(s.result)) as Json) : null,
  }),
  fromJSON(json: Json) {
    if (!isJsonObject(json) || typeof json.sfen !== 'string') throw new Error('Not a shogi position');
    const base = stateFromSfen(json.sfen);
    const rules = readRules(json.rules, base.rules);
    const keys = Array.isArray(json.keys) && json.keys.length > 0 && json.keys.every((k) => typeof k === 'string') ? (json.keys) : base.keys;
    if (keys[keys.length - 1] !== base.keys[0]) throw new Error('The repetition history does not end at this position');
    const flags = typeof json.checks === 'string' && json.checks.length === keys.length ? [...json.checks].map((c) => c === '1') : keys.map(() => false);
    const stored = readResult(json.result);
    return { sfen: base.sfen, rules, keys, checks: flags, result: stored ?? base.result };
  },
  toText: (s) => s.sfen,
  fromText: (text) => stateFromSfen(text.trim()),
};

const actionCodec: Codec<ShogiAction> = {
  toJSON: (a) => canonicalAction(a),
  fromJSON(json: Json) {
    if (typeof json !== 'string') throw new Error('A shogi move is stored as text, such as 7776');
    return parseCanonicalAction(json);
  },
  toText: (a) => a.text || canonicalAction(a),
  fromText(text, context) {
    const trimmed = text.trim();
    if (toCanonical(trimmed) !== null) {
      const action = parseCanonicalAction(trimmed);
      if (!context) return action;
      const { actions } = legalPairs(context as ShogiState);
      return actions.find((a) => canonicalAction(a) === canonicalAction(action)) ?? action;
    }
    if (!context || typeof (context as ShogiState).sfen !== 'string') throw new Error(`"${text}" needs a position to be read`);
    const state = context as ShogiState;
    const { p, moves, actions } = legalPairs(state);
    const byText = actions.find((a) => a.text === trimmed);
    if (byText) return byText;
    const m = parseWestern(p, moves, trimmed);
    if (m === null) throw new Error(`"${text}" is not a legal move here`);
    return actions[moves.indexOf(m)] as ShogiAction;
  },
};

const configCodec: JsonCodec<ShogiConfig> = {
  toJSON(c) {
    const out: { [key: string]: Json } = {};
    const position = c.position;
    const board = position ? sfenBoardKind(position) : (c.board ?? 'standard');
    if (!position && board !== 'standard') out.board = board;
    if (c.handicap && c.handicap !== 'even') out.handicap = c.handicap;
    if (board === 'standard' && c.impasse && c.impasse !== DEFAULT_IMPASSE) out.impasse = c.impasse;
    if (c.moveLimit && c.moveLimit > 0) out.moveLimit = Math.floor(c.moveLimit);
    if (position) out.position = position;
    return out;
  },
  fromJSON(json: Json) {
    if (!isJsonObject(json)) return {};
    const position = typeof json.position === 'string' ? json.position : typeof json.fen === 'string' ? json.fen : undefined;
    const config: { -readonly [K in keyof ShogiConfig]: ShogiConfig[K] } = {};
    if (json.board === 'mini' || json.board === 'standard') config.board = json.board;
    if (HANDICAP_VALUES.includes(json.handicap as HandicapId)) config.handicap = json.handicap as HandicapId;
    if (IMPASSE_VALUES.includes(json.impasse as ImpasseRule)) config.impasse = json.impasse as ImpasseRule;
    if (typeof json.moveLimit === 'number' && json.moveLimit > 0) config.moveLimit = Math.floor(json.moveLimit);
    if (position) {
      const state = stateFromSfen(position);
      config.position = state.sfen;
      delete config.board;
    }
    const board = config.position ? sfenBoardKind(config.position) : (config.board ?? 'standard');
    if (config.handicap && !handicapFor(board, config.handicap)) delete config.handicap;
    return config;
  },
};

export const shogi: GameDef<ShogiState, ShogiAction, ShogiConfig, ShogiView, ShogiEvent> = {
  id: 'shogi',
  rulesVersion: 1,
  defaultConfig: {},
  setup: (config) => setupState(config),
  seats: () => [0, 1],
  turn: (s) => (s.result ? null : sideToMove(s)),
  legal(s, seat) {
    if (s.result || sideToMove(s) !== seat) return [];
    return legalPairs(s).actions;
  },
  apply,
  outcome: outcomeOf,
  view: (s) => s,
  sample: (view) => view,
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

// ---------------------------------------------------------------------------------------------
// Helpers for the table, lessons and tests
// ---------------------------------------------------------------------------------------------

export type IllegalReason = 'nifu' | 'pawn-drop-mate' | 'dead-drop' | 'self-check' | 'occupied' | 'cannot-reach' | 'own-piece' | 'not-yours' | 'none-in-hand' | 'game-over';

/** Why a move a person tried is not allowed, or null when some legal move matches it. */
export function explainIllegal(state: ShogiState, attempt: { readonly from: string; readonly to: string } | { readonly drop: HandPiece; readonly to: string }): IllegalReason | null {
  if (state.result) return 'game-over';
  const p = positionOf(state.sfen);
  const geo = p.geo;
  const to = parseSquare(geo, attempt.to);
  if (to < 0) return 'cannot-reach';
  const legal = p.legalMoves();
  const side = p.side;
  if ('drop' in attempt) {
    const type = HAND_LETTER.indexOf(attempt.drop);
    if (legal.some((m) => isDrop(m) && dropType(m) === type && moveTo(m) === to)) return null;
    if (p.handCount(side, type) === 0) return 'none-in-hand';
    if (p.board[to] !== EMPTY) return 'occupied';
    if (deadRank(geo, side, type, geo.rankOf[to]!)) return 'dead-drop';
    if (type === PAWN && p.pawns[side * 10 + geo.fileOf[to]!]! > 0) return 'nifu';
    if (type === PAWN && p.isPawnDropMate(encodeDrop(type, to, side))) return 'pawn-drop-mate';
    return 'self-check';
  }
  const from = parseSquare(geo, attempt.from);
  if (from < 0) return 'cannot-reach';
  const code = p.board[from]!;
  if (!isPieceCode(code) || code === WALL) return 'cannot-reach';
  if (colorOfCode(code) !== side) return 'not-yours';
  if (legal.some((m) => !isDrop(m) && moveFrom(m) === from && moveTo(m) === to)) return null;
  const target = p.board[to]!;
  if (target !== EMPTY && colorOfCode(target) === side) return 'own-piece';
  if (!p.pieceAttacks(code, from, to)) return 'cannot-reach';
  return 'self-check';
}

/** The square of the side to move's king when it is in check. */
export function checkedKing(state: ShogiState): string | null {
  const p = positionOf(state.sfen);
  if (!p.inCheck()) return null;
  const king = p.kings[p.side]!;
  return king >= 0 ? squareName(p.geo, king) : null;
}

export interface SquareContent {
  readonly square: string;
  readonly file: number;
  readonly rank: number;
  readonly piece: { readonly seat: Seat; readonly type: number; readonly name: PieceName } | null;
}

/** Every square of the board, rank 1 first, file high to low (SFEN order). */
export function boardOf(state: ShogiState): SquareContent[] {
  const p = positionOf(state.sfen);
  return p.geo.squares.map((sq) => {
    const code = p.board[sq]!;
    const file = p.geo.fileOf[sq]!;
    const rank = p.geo.rankOf[sq]!;
    return {
      square: `${file}${rank}`,
      file,
      rank,
      piece: code === EMPTY ? null : { seat: colorOfCode(code), type: typeOfCode(code), name: PIECE_NAMES[typeOfCode(code)]! },
    };
  });
}

/** Pieces in hand for a seat, in the order P L N S G B R, with counts (zero counts left out). */
export function handOf(state: ShogiState, seat: Seat): { piece: HandPiece; count: number }[] {
  const p = positionOf(state.sfen);
  const out: { piece: HandPiece; count: number }[] = [];
  for (let type = 0; type < HAND_TYPES; type++) {
    const count = p.handCount(seat as Color, type);
    if (count > 0) out.push({ piece: HAND_LETTER[type] as HandPiece, count });
  }
  return out;
}

/** Material in the usual teaching values (pawn 1 ... rook 10), on the board and in hand. */
export const TEACHING_VALUE: readonly number[] = [1, 3, 4, 5, 6, 8, 10, 0, 7, 6, 6, 6, 10, 12];

export function material(state: ShogiState): [number, number] {
  const p = positionOf(state.sfen);
  const out: [number, number] = [0, 0];
  for (const sq of p.geo.squares) {
    const code = p.board[sq]!;
    if (code !== EMPTY) out[colorOfCode(code)] += TEACHING_VALUE[typeOfCode(code)] ?? 0;
  }
  for (const color of [0, 1] as const) for (let type = 0; type < HAND_TYPES; type++) out[color] += p.handCount(color, type) * (TEACHING_VALUE[type] ?? 0);
  return out;
}

/** How many times the current position has occurred so far in the game. */
export function repetitionCount(state: ShogiState): number {
  const last = state.keys[state.keys.length - 1];
  return state.keys.filter((k) => k === last).length;
}

/** Checks in a row by the side that just moved (for the perpetual-check counter). */
export function checksInARow(state: ShogiState): number {
  let n = 0;
  for (let i = state.checks.length - 1; i >= 1; i -= 2) {
    if (!state.checks[i]) break;
    n++;
  }
  return n;
}

export function promotionZone(state: ShogiState): number {
  return positionOf(state.sfen).geo.zone;
}
