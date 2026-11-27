/**
 * Chinese Checkers behind the game contract. Rules as implemented, with every option, preset and
 * source: docs/rules/chinese-checkers.md.
 *
 * Seats go clockwise from Red at the bottom. A move is a step or a hop chain of one marble (the
 * generator in engine.ts, shared with the CPU). A player whose home is complete finishes and takes
 * no more turns; the others play on for the next places, or the game stops at the first finisher.
 * A seat with no move passes. The game also ends when every player still in it passes in a row, or
 * at the turn limit; players who have not finished are then placed by rows to go.
 *
 * The game has no hidden information: a view is the whole state.
 */
import type { Codec, GameDef, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import { HOLES, holeCode, holeName, parseHole, parseHoleCode, ROW_LENGTHS } from './board';
import type { FinishRule, HomeRule, Jumps, Layout, MoveRules, Stopping } from './engine';
import { generateMoves, homeComplete, layoutFor, marblesHome, movePath, PASS, PLAYER_COUNTS, rowsToGo } from './engine';

export type Ending = 'places' | 'first';

export interface CcRules extends MoveRules {
  /** Play on for places, or stop when the first player finishes. */
  readonly end: Ending;
  /** Turns each before the game ends (an app rule, so every game ends). */
  readonly limit: number;
}

export const TURN_LIMITS: readonly number[] = [100, 150, 200, 300];
export const MARBLE_COUNTS: readonly number[] = [10, 15];

export const DEFAULT_RULES: CcRules = { jumps: 'adjacent', stop: 'anywhere', home: 'stay', finish: 'filled', end: 'places', limit: 200 };

export interface CcConfig {
  readonly players: number;
  readonly marbles: number;
  readonly rules: CcRules;
  /** A starting position in the text notation (lessons, problems, "play on from here"). */
  readonly position?: string;
}

export const DEFAULT_CONFIG: CcConfig = { players: 2, marbles: 10, rules: DEFAULT_RULES };

export type CcPresetId = 'two' | 'three' | 'four' | 'six' | 'fifteen' | 'fast' | 'closed';

export const PRESET_IDS: readonly CcPresetId[] = ['two', 'three', 'four', 'six', 'fifteen', 'fast', 'closed'];

export const PRESETS: Readonly<Record<CcPresetId, CcConfig>> = {
  two: DEFAULT_CONFIG,
  three: { players: 3, marbles: 10, rules: DEFAULT_RULES },
  four: { players: 4, marbles: 10, rules: DEFAULT_RULES },
  six: { players: 6, marbles: 10, rules: DEFAULT_RULES },
  fifteen: { players: 2, marbles: 15, rules: DEFAULT_RULES },
  fast: { players: 2, marbles: 10, rules: { ...DEFAULT_RULES, jumps: 'long', stop: 'pass-through' } },
  closed: { players: 2, marbles: 10, rules: { ...DEFAULT_RULES, stop: 'pass-through', home: 'free' } },
};

export type EndReason = 'home' | 'first' | 'limit' | 'blocked';

export interface CcState {
  readonly players: number;
  readonly marbles: number;
  readonly rules: CcRules;
  /** One character a hole in index order (top tip first): '.' or a seat's letter. */
  readonly board: string;
  /** The seat to move (unused once the game is over). */
  readonly toMove: Seat;
  /** The round being played, from 1: each player still in takes one turn a round. */
  readonly round: number;
  /** Passes in a row. */
  readonly passes: number;
  /** Seats that have finished, in order. */
  readonly done: readonly Seat[];
  readonly end: EndReason | null;
}

export type CcView = CcState;

export type CcAction = { readonly type: 'move'; readonly from: number; readonly to: number } | { readonly type: 'pass' };

export type CcEvent =
  | { readonly type: 'move'; readonly seat: Seat; readonly from: number; readonly to: number; readonly path: readonly number[] }
  | { readonly type: 'pass'; readonly seat: Seat }
  | { readonly type: 'finish'; readonly seat: Seat; readonly place: number }
  | { readonly type: 'end'; readonly reason: EndReason; readonly places: readonly number[] };

/** Seat letters in positions: Red, Blue, Green, Yellow, Purple, White. */
export const SEAT_LETTERS = 'RBGYPW';

const scratch = new Int32Array(1024);

// ---------------------------------------------------------------------------------------------
// Boards

export function layoutOf(s: { readonly players: number; readonly marbles: number }): Layout {
  return layoutFor(s.players, s.marbles);
}

export function boardArray(board: string): Int8Array {
  const out = new Int8Array(HOLES);
  for (let h = 0; h < HOLES; h++) {
    const ch = board[h] as string;
    out[h] = ch === '.' ? 0 : SEAT_LETTERS.indexOf(ch) + 1;
  }
  return out;
}

export function boardString(board: Int8Array): string {
  let out = '';
  for (let h = 0; h < HOLES; h++) {
    const v = board[h] as number;
    out += v === 0 ? '.' : (SEAT_LETTERS[v - 1] as string);
  }
  return out;
}

/** The starting board: every seat's marbles in its start. */
export function startBoard(players: number, marbles: number): string {
  const layout = layoutFor(players, marbles);
  const board = new Int8Array(HOLES);
  layout.startHoles.forEach((holes, seat) => {
    for (const h of holes) board[h] = seat + 1;
  });
  return boardString(board);
}

function freshState(config: CcConfig): CcState {
  return { players: config.players, marbles: config.marbles, rules: config.rules, board: startBoard(config.players, config.marbles), toMove: 0, round: 1, passes: 0, done: [], end: null };
}

// ---------------------------------------------------------------------------------------------
// Moves

/** Every legal move of the seat to move, packed (PASS alone when it has none). */
export function legalMoves(s: CcState): number[] {
  if (s.end !== null) return [];
  const n = generateMoves(boardArray(s.board), s.toMove, layoutOf(s), s.rules, scratch);
  return Array.from(scratch.subarray(0, n));
}

export function actionOf(move: number): CcAction {
  return move === PASS ? { type: 'pass' } : { type: 'move', from: move & 0xff, to: (move >> 8) & 0xff };
}

export function packAction(a: CcAction): number {
  return a.type === 'pass' ? PASS : a.from | (a.to << 8);
}

/** The holes a move passes through (from, each landing), for drawing and animation. */
export function pathOf(s: CcState, a: CcAction): number[] {
  if (a.type === 'pass') return [];
  return movePath(boardArray(s.board), s.toMove, layoutOf(s), s.rules, a.from, a.to) ?? [a.from, a.to];
}

/** Rows to go for every seat (docs/rules/chinese-checkers.md, rule 12). */
export function rowsLeft(s: CcState): number[] {
  const board = boardArray(s.board);
  const layout = layoutOf(s);
  return Array.from({ length: s.players }, (_, seat) => rowsToGo(board, seat, layout));
}

/** Places once the game is over: finishers in order, then the rest by rows to go, equal counts sharing. */
export function placesOf(s: CcState): number[] {
  const rows = rowsLeft(s);
  const places: number[] = [];
  for (let seat = 0; seat < s.players; seat++) {
    const finished = s.done.indexOf(seat);
    if (finished >= 0) {
      places.push(finished + 1);
      continue;
    }
    let ahead = 0;
    for (let other = 0; other < s.players; other++) if (other !== seat && !s.done.includes(other) && (rows[other] as number) < (rows[seat] as number)) ahead++;
    places.push(s.done.length + 1 + ahead);
  }
  return places;
}

function nextSeat(s: CcState, seat: Seat, done: readonly Seat[]): Seat {
  for (let k = 1; k <= s.players; k++) {
    const t = (seat + k) % s.players;
    if (!done.includes(t)) return t;
  }
  return seat;
}

function applyMove(s: CcState, action: CcAction): { state: CcState; events: CcEvent[] } {
  const seat = s.toMove;
  const move = packAction(action);
  if (!legalMoves(s).includes(move)) throw new Error(action.type === 'pass' ? 'You may pass only when no marble can move' : `${holeName(action.from)}-${holeName(action.to)} is not a legal move`);
  const layout = layoutOf(s);
  const board = boardArray(s.board);
  const events: CcEvent[] = [];
  let passes = 0;
  if (action.type === 'move') {
    const path = movePath(board, seat, layout, s.rules, action.from, action.to) ?? [action.from, action.to];
    board[action.to] = board[action.from] as number;
    board[action.from] = 0;
    events.push({ type: 'move', seat, from: action.from, to: action.to, path });
  } else {
    passes = s.passes + 1;
    events.push({ type: 'pass', seat });
  }
  // The mover finishes first; a move can also complete someone else's home (a marble filling its last hole).
  const done = [...s.done];
  for (let k = 0; k < s.players; k++) {
    const t = (seat + k) % s.players;
    if (!done.includes(t) && homeComplete(board, t, layout, s.rules.finish)) {
      done.push(t);
      events.push({ type: 'finish', seat: t, place: done.length });
    }
  }
  const left = s.players - done.length;
  let end: EndReason | null = null;
  let toMove = seat;
  let round = s.round;
  if (s.rules.end === 'first' && done.length > 0) end = 'first';
  else if (left <= 1) end = 'home';
  else if (passes >= left) end = 'blocked';
  else {
    toMove = nextSeat(s, seat, done);
    if (toMove <= seat) round++;
    if (round > s.rules.limit) end = 'limit';
  }
  const next: CcState = { ...s, board: boardString(board), toMove, round, passes, done, end };
  if (end !== null) events.push({ type: 'end', reason: end, places: placesOf(next) });
  return { state: next, events };
}

// ---------------------------------------------------------------------------------------------
// Text notation

const RULE_TOKENS: readonly { key: keyof CcRules; values: readonly (string | number)[] }[] = [
  { key: 'jumps', values: ['adjacent', 'long'] },
  { key: 'stop', values: ['anywhere', 'pass-through', 'never'] },
  { key: 'home', values: ['stay', 'free', 'frozen'] },
  { key: 'finish', values: ['filled', 'own'] },
  { key: 'end', values: ['places', 'first'] },
  { key: 'limit', values: TURN_LIMITS },
];

function rulesText(rules: CcRules): string | null {
  const changes = RULE_TOKENS.filter((t) => rules[t.key] !== DEFAULT_RULES[t.key]).map((t) => `${t.key}:${String(rules[t.key])}`);
  return changes.length > 0 ? changes.join(',') : null;
}

function ruleValue(key: string, raw: Json | undefined): string | number {
  const token = RULE_TOKENS.find((t) => t.key === key);
  if (!token) throw new Error(`Unknown rule "${key}"`);
  if (typeof raw !== 'string' && typeof raw !== 'number') throw new Error(`${key} must be one of ${token.values.join(', ')}`);
  const value = token.key === 'limit' ? Number(raw) : String(raw);
  if (!token.values.includes(value)) throw new Error(`${key} must be one of ${token.values.join(', ')}`);
  return value;
}

function parseRules(text: string): CcRules {
  const rules: Record<string, string | number> = { ...DEFAULT_RULES };
  for (const change of text.split(',')) {
    const [key = '', value = ''] = change.split(':');
    rules[key] = ruleValue(key, value);
  }
  return rules as unknown as CcRules;
}

function letterOf(seat: Seat): string {
  return SEAT_LETTERS[seat] as string;
}

export function positionText(s: CcState): string {
  const rows: string[] = [];
  let at = 0;
  // ROW_LENGTHS reads the same from the top as from the bottom.
  for (const length of ROW_LENGTHS) {
    rows.push(s.board.slice(at, at + length));
    at += length;
  }
  const parts = [rows.join('/'), s.end !== null ? '-' : letterOf(s.toMove).toLowerCase()];
  if (s.players !== 2) parts.push(`n=${s.players}`);
  if (s.marbles !== 10) parts.push(`m=${s.marbles}`);
  const rules = rulesText(s.rules);
  if (rules) parts.push(`rules=${rules}`);
  if (s.round > 1) parts.push(`round=${s.round}`);
  if (s.passes > 0) parts.push(`pass=${s.passes}`);
  if (s.done.length > 0) parts.push(`done=${s.done.map(letterOf).join('')}`);
  if (s.end !== null) parts.push(`end=${s.end}`);
  return parts.join(' ');
}

export function parsePosition(text: string): CcState {
  const [rowsText = '', side = '', ...fields] = text.trim().split(/\s+/);
  const rows = rowsText.split('/');
  if (rows.length !== ROW_LENGTHS.length) throw new Error(`A position needs ${ROW_LENGTHS.length} rows separated by "/"`);
  rows.forEach((row, i) => {
    if (row.length !== ROW_LENGTHS[i]) throw new Error(`Row ${ROW_LENGTHS.length - i} needs ${ROW_LENGTHS[i] as number} holes, not ${row.length}`);
  });
  const board = rows.join('');
  const values = new Map<string, string>();
  for (const f of fields) {
    const eq = f.indexOf('=');
    if (eq < 0) throw new Error(`"${f}" should look like key=value`);
    const key = f.slice(0, eq);
    if (values.has(key)) throw new Error(`"${key}" is given twice`);
    values.set(key, f.slice(eq + 1));
  }
  for (const key of values.keys()) if (!['n', 'm', 'rules', 'round', 'pass', 'done', 'end'].includes(key)) throw new Error(`Unknown field "${key}"`);
  const whole = (key: string, fallback: number, min: number) => {
    const raw = values.get(key);
    if (raw === undefined) return fallback;
    const v = Number(raw);
    if (!Number.isInteger(v) || v < min) throw new Error(`${key} must be a whole number from ${min}`);
    return v;
  };
  const players = whole('n', 2, 2);
  if (!PLAYER_COUNTS.includes(players)) throw new Error('n is 2, 3, 4 or 6 players');
  const marbles = whole('m', 10, 10);
  if (!MARBLE_COUNTS.includes(marbles)) throw new Error('m is 10 or 15 marbles');
  if (marbles === 15 && players !== 2) throw new Error('Fifteen marbles are for two players only');
  const rules = values.has('rules') ? parseRules(values.get('rules') as string) : DEFAULT_RULES;
  const counts = new Array<number>(players).fill(0);
  for (const ch of board) {
    if (ch === '.') continue;
    const seat = SEAT_LETTERS.indexOf(ch);
    if (seat < 0 || seat >= players) throw new Error(`"${ch}" is not a seat in a game of ${players}`);
    counts[seat] = (counts[seat] as number) + 1;
  }
  counts.forEach((n, seat) => {
    if (n !== marbles) throw new Error(`${letterOf(seat)} has ${n} marbles, not ${marbles}`);
  });
  const seatOf = (ch: string, what: string): Seat => {
    const seat = SEAT_LETTERS.indexOf(ch.toUpperCase());
    if (seat < 0 || seat >= players || ch.length !== 1) throw new Error(`${what} must be a seat's letter`);
    return seat;
  };
  const done: Seat[] = [];
  for (const ch of values.get('done') ?? '') {
    const seat = seatOf(ch, 'done');
    if (done.includes(seat)) throw new Error('A seat finishes only once');
    done.push(seat);
  }
  const endText = values.get('end');
  if (endText !== undefined && !['home', 'first', 'limit', 'blocked'].includes(endText)) throw new Error(`Unknown end "${endText}"`);
  const end = (endText ?? null) as EndReason | null;
  if ((side === '-') !== (end !== null)) throw new Error('The side to move is "-" exactly when the game is over');
  const toMove = side === '-' ? 0 : seatOf(side, 'The side to move');
  if (end === null && done.includes(toMove)) throw new Error('The side to move has already finished');
  const state: CcState = { players, marbles, rules, board, toMove, round: whole('round', 1, 1), passes: whole('pass', 0, 0), done, end };
  if (end === null) {
    const layout = layoutOf(state);
    const array = boardArray(board);
    for (let seat = 0; seat < players; seat++) {
      if (!done.includes(seat) && homeComplete(array, seat, layout, rules.finish)) throw new Error(`${letterOf(seat)}'s home is already complete`);
    }
  }
  return state;
}

// ---------------------------------------------------------------------------------------------
// Codecs

const stateCodec: Codec<CcState> = {
  toJSON: (s) => ({ position: positionText(s) }),
  fromJSON(json: Json) {
    if (!isJsonObject(json) || typeof json.position !== 'string') throw new Error('Not a Chinese Checkers position');
    return parsePosition(json.position);
  },
  toText: positionText,
  fromText: (text) => parsePosition(text),
};

function actionFromText(text: string): CcAction {
  const t = text.trim().toLowerCase();
  if (t === 'pass') return { type: 'pass' };
  if (/^[a-q]{4}$/.test(t)) {
    const from = parseHoleCode(t.slice(0, 2));
    const to = parseHoleCode(t.slice(2, 4));
    if (from < 0 || to < 0) throw new Error(`"${text}" is not a move on the star`);
    return { type: 'move', from, to };
  }
  const holes = t.split(/[-–x×\s]+/).filter((p) => p.length > 0);
  if (holes.length < 2) throw new Error(`"${text}" should look like 4b-5f`);
  const from = parseHole(holes[0] as string);
  const to = parseHole(holes[holes.length - 1] as string);
  if (from < 0 || to < 0) throw new Error(`"${text}" names a hole that is not on the star`);
  return { type: 'move', from, to };
}

const actionCodec: Codec<CcAction> = {
  toJSON: (a) => (a.type === 'pass' ? 'pass' : `${holeCode(a.from)}${holeCode(a.to)}`),
  fromJSON(json: Json) {
    if (typeof json !== 'string' || !/^(pass|[a-q]{4})$/.test(json)) throw new Error('A Chinese Checkers move is stored as four letters, such as "hpip", or "pass"');
    return actionFromText(json);
  },
  toText: (a) => (a.type === 'pass' ? 'pass' : `${holeName(a.from)}-${holeName(a.to)}`),
  fromText: (text) => actionFromText(text),
};

function rulesJson(rules: CcRules): Json | null {
  const out: { [key: string]: Json } = {};
  for (const t of RULE_TOKENS) if (rules[t.key] !== DEFAULT_RULES[t.key]) out[t.key] = rules[t.key];
  return Object.keys(out).length > 0 ? out : null;
}

/** A config with every option checked (fifteen marbles only for two players). */
export function makeConfig(players: number, marbles = 10, changes: Partial<CcRules> = {}): CcConfig {
  if (!PLAYER_COUNTS.includes(players)) throw new Error('Chinese Checkers is played by 2, 3, 4 or 6');
  if (!MARBLE_COUNTS.includes(marbles) || (marbles === 15 && players !== 2)) throw new Error('Fifteen marbles are for two players only');
  return { players, marbles, rules: { ...DEFAULT_RULES, ...changes } };
}

const configCodec: JsonCodec<CcConfig> = {
  toJSON(c) {
    const out: { [key: string]: Json } = { players: c.players };
    if (c.marbles !== 10) out.marbles = c.marbles;
    const rules = rulesJson(c.rules);
    if (rules) out.rules = rules;
    if (c.position) out.position = c.position;
    return out;
  },
  fromJSON(json: Json) {
    if (!isJsonObject(json)) return DEFAULT_CONFIG;
    if (typeof json.position === 'string') {
      const s = parsePosition(json.position);
      return { players: s.players, marbles: s.marbles, rules: s.rules, position: positionText(s) };
    }
    const players = Number(json.players ?? 2);
    const marbles = Number(json.marbles ?? 10);
    const changes: Record<string, string | number> = {};
    if (isJsonObject(json.rules)) for (const [k, v] of Object.entries(json.rules)) changes[k] = ruleValue(k, v);
    return makeConfig(players, marbles, changes);
  },
};

// ---------------------------------------------------------------------------------------------
// The contract

export const chineseCheckers: GameDef<CcState, CcAction, CcConfig, CcView, CcEvent> = {
  id: 'chinese-checkers',
  rulesVersion: 1,
  defaultConfig: DEFAULT_CONFIG,

  setup(config) {
    if (config.position) return parsePosition(config.position);
    return freshState(makeConfig(config.players, config.marbles, config.rules));
  },

  seats: (s) => Array.from({ length: s.players }, (_, i) => i),

  turn: (s) => (s.end !== null ? null : s.toMove),

  legal(s, seat) {
    if (s.end !== null || s.toMove !== seat) return [];
    return legalMoves(s).map(actionOf);
  },

  apply(s, action) {
    if (s.end !== null) throw new Error('The game is over');
    return applyMove(s, action);
  },

  outcome(s): Outcome | null {
    if (s.end === null) return null;
    const places = placesOf(s);
    const board = boardArray(s.board);
    const layout = layoutOf(s);
    return {
      reason: `cc-${s.end}`,
      results: places.map((place, seat) => ({ seat, place, score: marblesHome(board, seat, layout) })),
    };
  },

  view: (s) => s,
  sample: (view) => view,

  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** The options for a new game that starts from this position (play on from here, lessons). */
export function configAt(state: CcState): CcConfig {
  const fresh: CcState = state.end !== null ? { ...state, end: null, toMove: state.toMove, passes: 0 } : state;
  return { players: state.players, marbles: state.marbles, rules: state.rules, position: positionText(fresh) };
}

export type { FinishRule, HomeRule, Jumps, Stopping };
