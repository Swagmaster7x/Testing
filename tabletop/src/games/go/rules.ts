/**
 * Go behind the game contract. Rules as implemented, with every option, preset and source:
 * docs/rules/go.md.
 *
 * Seat 0 plays Black and moves first (after any handicap stones); seat 1 plays White. A game
 * runs through these phases:
 * - handicap: Black places free handicap stones one at a time (free placement only);
 * - play: stones and passes; two passes in a row end play (under AGA rules White passes last);
 * - scoring: the seat to act marks dead stones chain by chain, then says it is done; when the
 *   other seat agrees to the same marking the game is counted. Either seat may instead play on.
 *   Rules without marking (Tromp-Taylor) count at once, every stone alive;
 * - over.
 * Capture-Go ends at the first capture (or the agreed number of stones).
 *
 * Positions are compared for superko by a 64-bit hash of the board.
 */
import type { Codec, GameDef, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Color } from './board';
import { BLACK, Board, hashHex, opponent, WHITE } from './board';
import { handicapPoints, maxHandicap, parsePoint, pointName, sgfName, sgfToXY } from './coords';
import type { Count, HandicapCompensation, Scoring } from './score';
import { countBoard } from './score';

export type KoRule = 'positional' | 'situational' | 'simple';

export interface GoRules {
  readonly scoring: Scoring;
  /** Points White receives for moving second. */
  readonly komi: number;
  /** positional and situational superko, or the simple ko rule with "no result" on a long cycle. */
  readonly ko: KoRule;
  /** Suicide of two or more stones allowed (a lone stone may never take its own last liberty). */
  readonly suicide: boolean;
  readonly handicapPlacement: 'fixed' | 'free';
  readonly compensation: HandicapCompensation;
  /** Eyes of groups in seki: counted, or neutral (Japanese). */
  readonly seki: 'count' | 'neutral';
  /** Dead stones are marked and agreed after two passes; without it every stone left counts. */
  readonly marking: boolean;
  /** A pass hands the opponent one prisoner (AGA). */
  readonly passStones: boolean;
  /** Play ends only when White makes the last of the passes (AGA). */
  readonly whitePassesLast: boolean;
  /** Capture-Go: the first to capture this many stones wins. 0 for ordinary Go. */
  readonly captureTarget: number;
}

export type GoPresetId = 'chinese' | 'japanese' | 'aga' | 'new-zealand' | 'tromp-taylor' | 'capture';

export const PRESET_IDS: readonly GoPresetId[] = ['chinese', 'japanese', 'aga', 'new-zealand', 'tromp-taylor', 'capture'];

const BASE: GoRules = {
  scoring: 'area',
  komi: 7.5,
  ko: 'positional',
  suicide: false,
  handicapPlacement: 'free',
  compensation: 'n',
  seki: 'count',
  marking: true,
  passStones: false,
  whitePassesLast: false,
  captureTarget: 0,
};

export const PRESETS: Readonly<Record<GoPresetId, GoRules>> = {
  chinese: BASE,
  japanese: { ...BASE, scoring: 'territory', komi: 6.5, ko: 'simple', handicapPlacement: 'fixed', compensation: 'none', seki: 'neutral' },
  aga: { ...BASE, ko: 'situational', handicapPlacement: 'fixed', compensation: 'n-1', passStones: true, whitePassesLast: true },
  'new-zealand': { ...BASE, komi: 7, ko: 'situational', suicide: true, compensation: 'none' },
  'tromp-taylor': { ...BASE, suicide: true, compensation: 'none', marking: false },
  capture: { ...BASE, komi: 0, handicapPlacement: 'fixed', compensation: 'none', marking: false, captureTarget: 1 },
};

/** Komi in a handicap game: half a point, so White wins a tie. */
export const HANDICAP_KOMI = 0.5;
export const BOARD_SIZES: readonly number[] = [9, 13, 19];
export const CAPTURE_TARGETS: readonly number[] = [1, 3, 5];

/** The preset's rules for a game with this many handicap stones. */
export function presetRules(preset: GoPresetId, handicap: number): GoRules {
  const rules = PRESETS[preset];
  return handicap >= 2 && rules.captureTarget === 0 ? { ...rules, komi: HANDICAP_KOMI } : rules;
}

export interface GoConfig {
  readonly size: number;
  readonly preset: GoPresetId;
  /** The rules in force: the preset's, with any changes made at the table. */
  readonly rules: GoRules;
  /** 0 for an even game, or 2 to 9 handicap stones. */
  readonly handicap: number;
  /** A starting position in the text notation (lessons, problems, "play on from here"). */
  readonly position?: string;
}

export const DEFAULT_CONFIG: GoConfig = { size: 9, preset: 'chinese', rules: PRESETS.chinese, handicap: 0 };

export type Phase = 'handicap' | 'play' | 'scoring' | 'over';

export type GoResult =
  | { readonly kind: 'score'; readonly black: number; readonly white: number }
  | { readonly kind: 'capture'; readonly winner: Seat }
  /** Capture-Go ended by two passes: more prisoners wins. */
  | { readonly kind: 'captures'; readonly black: number; readonly white: number }
  | { readonly kind: 'no-result' };

export interface GoState {
  readonly size: number;
  readonly preset: GoPresetId;
  readonly rules: GoRules;
  /** One character per point, row by row from the top: '.', 'X' (Black) or 'O' (White). */
  readonly board: string;
  /** Seat to play in the handicap and play phases. */
  readonly toMove: Seat;
  readonly phase: Phase;
  /** Free handicap stones still to place. */
  readonly placeLeft: number;
  /** Handicap stones in this game. */
  readonly handicap: number;
  /** The point the side to move may not take back at once (simple ko), or -1. */
  readonly ko: number;
  /** Passes in a row, and who made the last one. */
  readonly passes: number;
  readonly lastPasser: Seat | null;
  /** Prisoners taken by Black and by White during play, pass stones included. */
  readonly prisoners: readonly [number, number];
  /** Every position so far: 16 hex digits of board hash, then the side to move ('b' or 'w'). */
  readonly history: readonly string[];
  /** Moves made in this game (stones, passes and handicap placements). */
  readonly moveNumber: number;
  /** Scoring: points of stones marked dead, ascending. */
  readonly dead: readonly number[];
  /** Scoring: the seat that has accepted the current marking. */
  readonly agreed: Seat | null;
  /** Scoring: the seat to act. */
  readonly scorer: Seat;
  readonly result: GoResult | null;
}

export type GoView = GoState;

export type GoAction =
  | { readonly type: 'play'; readonly at: string; readonly name: string }
  | { readonly type: 'pass' }
  | { readonly type: 'mark'; readonly at: string; readonly name: string }
  | { readonly type: 'done' }
  | { readonly type: 'resume' };

export type GoEvent =
  | { readonly type: 'place'; readonly seat: Seat; readonly at: string; readonly name: string; readonly captured: readonly string[]; readonly handicap: boolean }
  | { readonly type: 'pass'; readonly seat: Seat }
  | { readonly type: 'atari'; readonly seat: Seat; readonly stones: readonly string[] }
  | { readonly type: 'scoring'; readonly scorer: Seat }
  | { readonly type: 'mark'; readonly seat: Seat; readonly stones: readonly string[]; readonly dead: boolean }
  | { readonly type: 'agree'; readonly seat: Seat }
  | { readonly type: 'resume'; readonly seat: Seat }
  | { readonly type: 'end'; readonly result: GoResult };

export const colorOf = (seat: Seat): Color => (seat === 0 ? BLACK : WHITE);
export const seatOfColor = (c: Color): Seat => (c === BLACK ? 0 : 1);
const otherSeat = (seat: Seat): Seat => (seat === 0 ? 1 : 0);

/** A pair of per-seat numbers with `n` added to one seat's. */
function addTo(pair: readonly [number, number], seat: Seat, n: number): [number, number] {
  return seat === 0 ? [pair[0] + n, pair[1]] : [pair[0], pair[1] + n];
}

const ofSeat = (pair: readonly [number, number], seat: Seat): number => (seat === 0 ? pair[0] : pair[1]);
const sideChar = (seat: Seat) => (seat === 0 ? 'b' : 'w');

// ---------------------------------------------------------------------------------------------
// Positions

export function boardOf(state: GoState): Board {
  const b = Board.fromText(state.size, state.board);
  if (state.ko >= 0) b.ko = b.fromPoint(state.ko);
  return b;
}

function positionKey(board: Board, toMove: Seat): string {
  return `${hashHex(board.hashHi, board.hashLo)}${sideChar(toMove)}`;
}

function keyOf(hi: number, lo: number, toMove: Seat): string {
  return `${hashHex(hi, lo)}${sideChar(toMove)}`;
}

/** Superko: would this position (with `toMove` to play) repeat one from the history? */
function repeats(rules: GoRules, history: readonly string[], key: string): boolean {
  if (rules.ko === 'simple') return false;
  if (rules.ko === 'situational') return history.includes(key);
  const board = key.slice(0, 16);
  return history.some((h) => h.startsWith(board));
}

interface NewGame {
  readonly size: number;
  readonly preset: GoPresetId;
  readonly rules: GoRules;
  readonly handicap: number;
}

function freshState(game: NewGame): GoState {
  const { size, rules, handicap } = game;
  const board = new Board(size);
  const free = handicap >= 2 && rules.handicapPlacement === 'free' && rules.captureTarget === 0;
  if (handicap >= 2 && !free) for (const p of handicapPoints(size, handicap)) board.setStone(board.fromPoint(p), BLACK);
  const toMove: Seat = handicap >= 2 && !free ? 1 : 0;
  return {
    size,
    preset: game.preset,
    rules,
    board: board.toText(),
    toMove,
    phase: free ? 'handicap' : 'play',
    placeLeft: free ? handicap : 0,
    handicap: handicap >= 2 ? handicap : 0,
    ko: -1,
    passes: 0,
    lastPasser: null,
    prisoners: [0, 0],
    history: [positionKey(board, toMove)],
    moveNumber: 0,
    dead: [],
    agreed: null,
    scorer: 0,
    result: null,
  };
}

// ---------------------------------------------------------------------------------------------
// Counting

/** The count of a position with these stones marked dead. */
export function countState(state: GoState, dead: readonly number[] = state.dead): Count {
  const { rules } = state;
  return countBoard(state.size, state.board, dead, state.prisoners, { scoring: rules.scoring, komi: rules.komi, compensation: rules.compensation, seki: rules.seki }, state.handicap);
}

/** The winning seat of a result, or null for a tie or no result. */
export function winnerOf(result: GoResult): Seat | null {
  switch (result.kind) {
    case 'capture':
      return result.winner;
    case 'no-result':
      return null;
    default:
      return result.black > result.white ? 0 : result.white > result.black ? 1 : null;
  }
}

function scoreResult(state: GoState, dead: readonly number[]): GoResult {
  const count = countState(state, dead);
  return { kind: 'score', black: count.black, white: count.white };
}

// ---------------------------------------------------------------------------------------------
// Moves

function playAction(p: number, size: number): GoAction {
  return { type: 'play', at: sgfName(p, size), name: pointName(p, size) };
}

function markAction(p: number, size: number): GoAction {
  return { type: 'mark', at: sgfName(p, size), name: pointName(p, size) };
}

/** Points the side to move may play now (stones only), as outside point numbers. */
export function legalPoints(state: GoState): number[] {
  if (state.phase !== 'play' && state.phase !== 'handicap') return [];
  const board = boardOf(state);
  const c = colorOf(state.toMove);
  const next = otherSeat(state.toMove);
  const out: number[] = [];
  for (let p = 0; p < state.size * state.size; p++) {
    const i = board.fromPoint(p);
    if (state.phase === 'handicap') {
      if (board.color[i] === 0) out.push(p);
      continue;
    }
    if (!board.isLegal(i, c, state.rules.suicide)) continue;
    if (state.rules.ko !== 'simple') {
      const [hi, lo] = board.hashAfter(i, c);
      if (repeats(state.rules, state.history, keyOf(hi, lo, next))) continue;
    }
    out.push(p);
  }
  return out;
}

function pointOfAction(state: GoState, at: string): number | null {
  const xy = sgfToXY(at);
  if (!xy || xy.x >= state.size || xy.y >= state.size) return null;
  return xy.y * state.size + xy.x;
}

function chainPoints(board: Board, p: number): number[] {
  const i = board.fromPoint(p);
  return board.chain(board.head[i] as number).map((s) => board.point(s)).sort((a, b) => a - b);
}

function names(points: readonly number[], size: number): string[] {
  return points.map((p) => sgfName(p, size));
}

function finish(state: GoState, result: GoResult, events: GoEvent[]): GoState {
  events.push({ type: 'end', result });
  return { ...state, phase: 'over', result };
}

function applyStone(state: GoState, p: number, events: GoEvent[]): GoState {
  const board = boardOf(state);
  const mover = state.toMove;
  const c = colorOf(mover);
  const i = board.fromPoint(p);
  if (state.phase === 'handicap') {
    if (board.color[i] !== 0) throw new Error(`${pointName(p, state.size)} is taken`);
    board.setStone(i, BLACK);
    const placeLeft = state.placeLeft - 1;
    const toMove: Seat = placeLeft > 0 ? 0 : 1;
    events.push({ type: 'place', seat: 0, at: sgfName(p, state.size), name: pointName(p, state.size), captured: [], handicap: true });
    return {
      ...state,
      board: board.toText(),
      placeLeft,
      toMove,
      phase: placeLeft > 0 ? 'handicap' : 'play',
      history: [...state.history, positionKey(board, toMove)],
      moveNumber: state.moveNumber + 1,
    };
  }
  if (!board.isLegal(i, c, state.rules.suicide)) throw new Error(`${pointName(p, state.size)} is not a legal move`);
  const before = board.copy();
  board.play(i, c);
  const next = otherSeat(mover);
  const key = positionKey(board, next);
  if (repeats(state.rules, state.history, key)) throw new Error(`${pointName(p, state.size)} would repeat an earlier position (superko)`);
  const taken = ofSeat(board.capturedBy, mover);
  const lost = ofSeat(board.capturedBy, next);
  const capturedPoints: number[] = [];
  if (taken > 0 || lost > 0) {
    for (let q = 0; q < state.size * state.size; q++) {
      const bi = before.fromPoint(q);
      if (before.color[bi] !== 0 && board.color[bi] === 0) capturedPoints.push(q);
    }
  }
  const prisoners = addTo(addTo(state.prisoners, mover, taken), next, lost);
  events.push({ type: 'place', seat: mover, at: sgfName(p, state.size), name: pointName(p, state.size), captured: names(capturedPoints, state.size), handicap: false });
  // Opponent chains next to the stone that are now in atari: the game "calls atari".
  const seen = new Set<number>();
  for (let d = 0; d < 4; d++) {
    const nb = i + (board.dirs[d] as number);
    if (board.color[nb] !== opponent(c)) continue;
    const h = board.head[nb] as number;
    if (seen.has(h) || !board.inAtari(h)) continue;
    seen.add(h);
    events.push({ type: 'atari', seat: next, stones: names(chainPoints(board, board.point(h)), state.size) });
  }
  const after: GoState = {
    ...state,
    board: board.toText(),
    toMove: next,
    ko: board.ko >= 0 ? board.point(board.ko) : -1,
    passes: 0,
    lastPasser: null,
    prisoners,
    history: [...state.history, key],
    moveNumber: state.moveNumber + 1,
  };
  const target = state.rules.captureTarget;
  if (target > 0 && (ofSeat(prisoners, mover) >= target || ofSeat(prisoners, next) >= target)) {
    return finish(after, { kind: 'capture', winner: ofSeat(prisoners, mover) >= target ? mover : next }, events);
  }
  // The simple ko rule cannot stop a long cycle; the third time a position comes round, the game has no result.
  if (state.rules.ko === 'simple' && after.history.filter((h) => h === key).length >= 3) return finish(after, { kind: 'no-result' }, events);
  return after;
}

function applyPass(state: GoState, events: GoEvent[]): GoState {
  const mover = state.toMove;
  const next = otherSeat(mover);
  const prisoners = state.rules.passStones ? addTo(state.prisoners, next, 1) : state.prisoners;
  const board = boardOf(state);
  board.ko = -1;
  events.push({ type: 'pass', seat: mover });
  const passes = state.passes + 1;
  const after: GoState = {
    ...state,
    toMove: next,
    ko: -1,
    passes,
    lastPasser: mover,
    prisoners,
    history: [...state.history, positionKey(board, next)],
    moveNumber: state.moveNumber + 1,
  };
  const ends = passes >= 2 && (!state.rules.whitePassesLast || mover === 1);
  if (!ends) return after;
  if (state.rules.captureTarget > 0) return finish(after, { kind: 'captures', black: prisoners[0], white: prisoners[1] }, events);
  if (!state.rules.marking) return finish(after, scoreResult(after, []), events);
  events.push({ type: 'scoring', scorer: next });
  return { ...after, phase: 'scoring', dead: [], agreed: null, scorer: next };
}

function applyMark(state: GoState, p: number, events: GoEvent[]): GoState {
  const board = boardOf(state);
  if (board.color[board.fromPoint(p)] === 0) throw new Error('Only stones can be marked dead');
  const chain = chainPoints(board, p);
  const dead = new Set(state.dead);
  const nowDead = !chain.every((q) => dead.has(q));
  for (const q of chain) {
    if (nowDead) dead.add(q);
    else dead.delete(q);
  }
  events.push({ type: 'mark', seat: state.scorer, stones: names(chain, state.size), dead: nowDead });
  return { ...state, dead: [...dead].sort((a, b) => a - b), agreed: null };
}

function applyDone(state: GoState, events: GoEvent[]): GoState {
  const seat = state.scorer;
  events.push({ type: 'agree', seat });
  if (state.agreed === otherSeat(seat)) return finish(state, scoreResult(state, state.dead), events);
  return { ...state, agreed: seat, scorer: otherSeat(seat) };
}

function applyResume(state: GoState, events: GoEvent[]): GoState {
  const seat = state.scorer;
  events.push({ type: 'resume', seat });
  // Play goes on as if the last pass had not ended it: the player after the last passer moves.
  const toMove = state.lastPasser === null ? otherSeat(seat) : otherSeat(state.lastPasser);
  return { ...state, phase: 'play', toMove, passes: 0, dead: [], agreed: null, scorer: 0 };
}

// ---------------------------------------------------------------------------------------------
// Text notation: "<rows> <b|w> [rules=...] [hc=..] [place=..] [ko=..] [cap=..] [pass=..] [phase=..] [dead=..] [end=..]"

const RULE_KEYS: readonly (keyof GoRules)[] = ['scoring', 'komi', 'ko', 'suicide', 'handicapPlacement', 'compensation', 'seki', 'marking', 'passStones', 'whitePassesLast', 'captureTarget'];

function ruleToken(key: keyof GoRules, value: GoRules[keyof GoRules]): string {
  return `${key}:${typeof value === 'boolean' ? (value ? 'yes' : 'no') : String(value)}`;
}

/** Reads one rule value from text or JSON, checking it. */
function ruleValue(key: keyof GoRules, raw: string | number | boolean): GoRules[keyof GoRules] {
  const text = String(raw);
  const yesNo = () => {
    if (raw === true || text === 'yes') return true;
    if (raw === false || text === 'no') return false;
    throw new Error(`${key} must be yes or no`);
  };
  const oneOf = <T extends string>(options: readonly T[]): T => {
    if (!(options as readonly string[]).includes(text)) throw new Error(`${key} must be one of ${options.join(', ')}`);
    return text as T;
  };
  switch (key) {
    case 'scoring':
      return oneOf(['area', 'territory'] as const);
    case 'komi': {
      const v = Number(text);
      if (!Number.isFinite(v) || Math.abs(v) > 100 || Math.round(v * 2) !== v * 2) throw new Error('komi must be a whole or half number');
      return v;
    }
    case 'ko':
      return oneOf(['positional', 'situational', 'simple'] as const);
    case 'handicapPlacement':
      return oneOf(['fixed', 'free'] as const);
    case 'compensation':
      return oneOf(['none', 'n', 'n-1'] as const);
    case 'seki':
      return oneOf(['count', 'neutral'] as const);
    case 'captureTarget': {
      const v = Number(text);
      if (!Number.isInteger(v) || v < 0 || v > 100) throw new Error('captureTarget must be a whole number from 0');
      return v;
    }
    default:
      return yesNo();
  }
}

function rulesText(preset: GoPresetId, rules: GoRules, handicap: number): string | null {
  const base = presetRules(preset, handicap);
  const changes = RULE_KEYS.filter((k) => rules[k] !== base[k]).map((k) => ruleToken(k, rules[k]));
  if (preset === 'chinese' && changes.length === 0) return null;
  return [preset, ...changes].join(',');
}

function parseRules(text: string, handicap: number): { preset: GoPresetId; rules: GoRules } {
  const [name = '', ...changes] = text.split(',');
  if (!(PRESET_IDS as readonly string[]).includes(name)) throw new Error(`Unknown rules "${name}"`);
  const preset = name as GoPresetId;
  const rules: Record<string, unknown> = { ...presetRules(preset, handicap) };
  for (const change of changes) {
    const [key = '', value = ''] = change.split(':');
    if (!(RULE_KEYS as readonly string[]).includes(key)) throw new Error(`Unknown rule "${key}"`);
    rules[key] = ruleValue(key as keyof GoRules, value);
  }
  return { preset, rules: rules as unknown as GoRules };
}

export function positionText(s: GoState): string {
  const rows: string[] = [];
  for (let y = 0; y < s.size; y++) rows.push(s.board.slice(y * s.size, (y + 1) * s.size));
  const parts = [rows.join('/'), sideChar(s.toMove)];
  const rules = rulesText(s.preset, s.rules, s.handicap);
  if (rules) parts.push(`rules=${rules}`);
  if (s.handicap > 0) parts.push(`hc=${s.handicap}`);
  if (s.placeLeft > 0) parts.push(`place=${s.placeLeft}`);
  if (s.ko >= 0) parts.push(`ko=${sgfName(s.ko, s.size)}`);
  if (s.prisoners[0] > 0 || s.prisoners[1] > 0) parts.push(`cap=${s.prisoners[0]},${s.prisoners[1]}`);
  if (s.passes > 0) parts.push(`pass=${s.passes},${sideChar(s.lastPasser ?? 0)}`);
  if (s.phase === 'scoring') parts.push(`phase=scoring,${sideChar(s.scorer)}${s.agreed !== null ? `,${sideChar(s.agreed)}` : ''}`);
  if (s.dead.length > 0) parts.push(`dead=${s.dead.map((p) => sgfName(p, s.size)).join('')}`);
  if (s.result) {
    const r = s.result;
    parts.push(`end=${r.kind === 'capture' ? `capture,${sideChar(r.winner)}` : r.kind}`);
  }
  return parts.join(' ');
}

const seatFrom = (ch: string | undefined, what: string): Seat => {
  if (ch === 'b') return 0;
  if (ch === 'w') return 1;
  throw new Error(`${what} must be b or w`);
};

export function parsePosition(text: string): GoState {
  const [rowsText = '', side, ...fields] = text.trim().split(/\s+/);
  const rows = rowsText.split('/');
  const size = rows.length;
  if (size < 2 || size > 25) throw new Error('A position needs 2 to 25 rows separated by "/"');
  if (rows.some((r) => r.length !== size)) throw new Error(`Every row of a ${size}×${size} board needs ${size} points`);
  const boardText = rows.join('').toUpperCase();
  const board = Board.fromText(size, boardText);
  if (board.deadChains().length > 0) throw new Error('A chain on this board has no liberties');
  const toMove = seatFrom(side, 'The side to move');
  const values = new Map<string, string>();
  for (const f of fields) {
    const eq = f.indexOf('=');
    if (eq < 0) throw new Error(`"${f}" should look like key=value`);
    const key = f.slice(0, eq);
    if (values.has(key)) throw new Error(`"${key}" is given twice`);
    values.set(key, f.slice(eq + 1));
  }
  const known = ['rules', 'hc', 'place', 'ko', 'cap', 'pass', 'phase', 'dead', 'end'];
  for (const key of values.keys()) if (!known.includes(key)) throw new Error(`Unknown field "${key}"`);
  const int = (key: string, value: string) => {
    const v = Number(value);
    if (!Number.isInteger(v) || v < 0) throw new Error(`${key} must be a whole number`);
    return v;
  };
  const handicap = values.has('hc') ? int('hc', values.get('hc') as string) : 0;
  if (handicap === 1 || handicap > 9) throw new Error('hc is 2 to 9 handicap stones');
  const { preset, rules } = values.has('rules') ? parseRules(values.get('rules') as string, handicap) : { preset: 'chinese' as const, rules: presetRules('chinese', handicap) };
  const placeLeft = values.has('place') ? int('place', values.get('place') as string) : 0;
  let ko = -1;
  if (values.has('ko')) {
    const p = parsePoint(values.get('ko') as string, size);
    if (p === null || boardText[p] !== '.') throw new Error('The ko point must be an empty point on the board');
    ko = p;
  }
  let prisoners: [number, number] = [0, 0];
  if (values.has('cap')) {
    const [b = '', w = ''] = (values.get('cap') as string).split(',');
    prisoners = [int('cap', b), int('cap', w)];
  }
  let passes = 0;
  let lastPasser: Seat | null = null;
  if (values.has('pass')) {
    const [n = '', who] = (values.get('pass') as string).split(',');
    passes = int('pass', n);
    lastPasser = seatFrom(who, 'The last passer');
  }
  let phase: Phase = placeLeft > 0 ? 'handicap' : 'play';
  let scorer: Seat = 0;
  let agreed: Seat | null = null;
  if (values.has('phase')) {
    const [name, who, agree] = (values.get('phase') as string).split(',');
    if (name !== 'scoring') throw new Error('phase can only be scoring');
    phase = 'scoring';
    scorer = seatFrom(who, 'The scorer');
    agreed = agree === undefined ? null : seatFrom(agree, 'The seat that agreed');
  }
  const dead: number[] = [];
  if (values.has('dead')) {
    const list = values.get('dead') as string;
    if (list.length % 2 !== 0) throw new Error('dead is a run of two-letter points');
    for (let k = 0; k < list.length; k += 2) {
      const p = parsePoint(list.slice(k, k + 2), size);
      if (p === null || boardText[p] === '.') throw new Error('Only stones can be marked dead');
      dead.push(p);
    }
    dead.sort((a, b) => a - b);
  }
  const base: GoState = {
    size,
    preset,
    rules,
    board: boardText,
    toMove,
    phase,
    placeLeft,
    handicap,
    ko,
    passes,
    lastPasser,
    prisoners,
    history: [positionKey(board, toMove)],
    moveNumber: 0,
    dead,
    agreed,
    scorer,
    result: null,
  };
  if (!values.has('end')) return base;
  const [kind, who] = (values.get('end') as string).split(',');
  let result: GoResult;
  if (kind === 'score') result = scoreResult(base, dead);
  else if (kind === 'captures') result = { kind: 'captures', black: prisoners[0], white: prisoners[1] };
  else if (kind === 'capture') result = { kind: 'capture', winner: seatFrom(who, 'The winner') };
  else if (kind === 'no-result') result = { kind: 'no-result' };
  else throw new Error(`Unknown end "${kind ?? ''}"`);
  return { ...base, phase: 'over', result };
}

// ---------------------------------------------------------------------------------------------
// Codecs

const stateCodec: Codec<GoState> = {
  toJSON: (s) => ({ position: positionText(s), history: [...s.history], moves: s.moveNumber }),
  fromJSON(json: Json) {
    if (!isJsonObject(json) || typeof json.position !== 'string') throw new Error('Not a Go position');
    const base = parsePosition(json.position);
    const history = Array.isArray(json.history) && json.history.length > 0 && json.history.every((h) => typeof h === 'string' && /^[0-9a-f]{16}[bw]$/.test(h)) ? (json.history as string[]) : base.history;
    if (history[history.length - 1]?.slice(0, 16) !== base.history[0]?.slice(0, 16)) throw new Error('The position history does not end at this position');
    const moves = typeof json.moves === 'number' && Number.isInteger(json.moves) && json.moves >= 0 ? json.moves : 0;
    return { ...base, history, moveNumber: moves };
  },
  toText: positionText,
  fromText: (text) => parsePosition(text),
};

function actionFromText(text: string, state?: GoState): GoAction {
  const t = text.trim();
  const lower = t.toLowerCase();
  if (lower === 'pass') return { type: 'pass' };
  if (lower === 'done') return { type: 'done' };
  if (lower === 'resume') return { type: 'resume' };
  const mark = /^(?:mark|dead)\s+(\S+)$/i.exec(t);
  const where = mark ? (mark[1] as string) : t;
  let at: string;
  let name = '';
  if (/^[a-z]{2}$/.test(where)) {
    at = where;
    if (state) {
      const p = parsePoint(where, state.size);
      if (p === null) throw new Error(`"${where}" is not on this board`);
      name = pointName(p, state.size);
    }
  } else {
    if (!state) throw new Error(`"${t}" needs a board to be read`);
    const p = parsePoint(where, state.size);
    if (p === null) throw new Error(`"${t}" is not a point on this board`);
    at = sgfName(p, state.size);
    name = pointName(p, state.size);
  }
  return mark ? { type: 'mark', at, name } : { type: 'play', at, name };
}

const actionCodec: Codec<GoAction> = {
  toJSON(a) {
    switch (a.type) {
      case 'play':
        return a.at;
      case 'mark':
        return `mark ${a.at}`;
      default:
        return a.type;
    }
  },
  fromJSON(json: Json) {
    if (typeof json !== 'string') throw new Error('A Go move is stored as text, such as "dd" or "pass"');
    if (!/^(pass|done|resume|[a-y]{2}|mark [a-y]{2})$/.test(json)) throw new Error(`"${json}" is not a Go move`);
    return actionFromText(json);
  },
  toText(a) {
    switch (a.type) {
      case 'play':
        return a.name || a.at;
      case 'mark':
        return `dead ${a.name || a.at}`;
      default:
        return a.type;
    }
  },
  fromText: (text, context) => actionFromText(text, context && typeof (context as GoState).board === 'string' ? (context as GoState) : undefined),
};

/** The rules in force as JSON: only what differs from the preset is written. */
function rulesJson(config: GoConfig): Json | null {
  const base = presetRules(config.preset, config.handicap);
  const out: { [key: string]: Json } = {};
  for (const k of RULE_KEYS) if (config.rules[k] !== base[k]) out[k] = config.rules[k];
  return Object.keys(out).length > 0 ? out : null;
}

const configCodec: JsonCodec<GoConfig> = {
  toJSON(c) {
    const out: { [key: string]: Json } = { size: c.size, preset: c.preset };
    if (c.handicap > 0) out.handicap = c.handicap;
    const changes = rulesJson(c);
    if (changes) out.rules = changes;
    if (c.position) out.position = c.position;
    return out;
  },
  fromJSON(json: Json) {
    if (!isJsonObject(json)) return DEFAULT_CONFIG;
    if (typeof json.position === 'string') {
      const s = parsePosition(json.position);
      return { size: s.size, preset: s.preset, rules: s.rules, handicap: s.handicap, position: json.position };
    }
    const size = Number(json.size ?? DEFAULT_CONFIG.size);
    if (!Number.isInteger(size) || size < 2 || size > 25) throw new Error(`A Go board of size ${JSON.stringify(json.size ?? null)} is not supported`);
    const preset = typeof json.preset === 'string' && (PRESET_IDS as readonly string[]).includes(json.preset) ? (json.preset as GoPresetId) : DEFAULT_CONFIG.preset;
    const handicap = Number(json.handicap ?? 0);
    if (!Number.isInteger(handicap) || handicap === 1 || handicap < 0 || handicap > maxHandicap(size)) throw new Error(`${JSON.stringify(json.handicap ?? null)} handicap stones do not fit a ${size}×${size} board`);
    const rules: Record<string, unknown> = { ...presetRules(preset, handicap) };
    if (isJsonObject(json.rules)) {
      for (const [k, v] of Object.entries(json.rules)) {
        if (!(RULE_KEYS as readonly string[]).includes(k) || (typeof v !== 'string' && typeof v !== 'number' && typeof v !== 'boolean')) throw new Error(`Unknown rule "${k}"`);
        rules[k] = ruleValue(k as keyof GoRules, v);
      }
    }
    return { size, preset, rules: rules as unknown as GoRules, handicap };
  },
};

// ---------------------------------------------------------------------------------------------
// The contract

export const go: GameDef<GoState, GoAction, GoConfig, GoView, GoEvent> = {
  id: 'go',
  rulesVersion: 1,
  defaultConfig: DEFAULT_CONFIG,

  setup(config) {
    if (config.position) return parsePosition(config.position);
    if (config.handicap > maxHandicap(config.size)) throw new Error('Too many handicap stones for this board');
    return freshState({ size: config.size, preset: config.preset, rules: config.rules, handicap: config.handicap });
  },

  seats: () => [0, 1],

  turn(s) {
    if (s.phase === 'over') return null;
    return s.phase === 'scoring' ? s.scorer : s.toMove;
  },

  legal(s, seat) {
    if (go.turn(s) !== seat) return [];
    if (s.phase === 'scoring') {
      const out: GoAction[] = [];
      for (let p = 0; p < s.board.length; p++) if (s.board[p] !== '.') out.push(markAction(p, s.size));
      out.push({ type: 'done' }, { type: 'resume' });
      return out;
    }
    const out: GoAction[] = legalPoints(s).map((p) => playAction(p, s.size));
    if (s.phase === 'play') out.push({ type: 'pass' });
    return out;
  },

  apply(s, action) {
    const seat = go.turn(s);
    if (seat === null) throw new Error('The game is over');
    const events: GoEvent[] = [];
    let state: GoState;
    switch (action.type) {
      case 'play': {
        if (s.phase !== 'play' && s.phase !== 'handicap') throw new Error('Stones are placed only during play');
        const p = pointOfAction(s, action.at);
        if (p === null) throw new Error(`${action.at} is not on this board`);
        state = applyStone(s, p, events);
        break;
      }
      case 'pass':
        if (s.phase !== 'play') throw new Error('You can pass only during play');
        state = applyPass(s, events);
        break;
      case 'mark': {
        if (s.phase !== 'scoring') throw new Error('Stones are marked only while scoring');
        const p = pointOfAction(s, action.at);
        if (p === null) throw new Error(`${action.at} is not on this board`);
        state = applyMark(s, p, events);
        break;
      }
      case 'done':
        if (s.phase !== 'scoring') throw new Error('Nothing to agree to yet');
        state = applyDone(s, events);
        break;
      case 'resume':
        if (s.phase !== 'scoring') throw new Error('Play has not stopped');
        state = applyResume(s, events);
        break;
      default:
        throw new Error('Unknown Go move');
    }
    return { state, events };
  },

  outcome(s): Outcome | null {
    const r = s.result;
    if (!r) return null;
    if (r.kind === 'no-result') {
      return { reason: 'go-no-result', results: [{ seat: 0, place: 1, score: 0 }, { seat: 1, place: 1, score: 0 }] };
    }
    const winner = winnerOf(r);
    const black = r.kind === 'capture' ? s.prisoners[0] : r.black;
    const white = r.kind === 'capture' ? s.prisoners[1] : r.white;
    const reason = r.kind === 'capture' ? 'go-capture' : r.kind === 'captures' ? 'go-captures' : s.rules.scoring === 'area' ? 'go-area' : 'go-territory';
    return {
      reason,
      results: [
        { seat: 0, place: winner === 1 ? 2 : 1, score: black },
        { seat: 1, place: winner === 0 ? 2 : 1, score: white },
      ],
    };
  },

  view: (s) => s,
  sample: (view) => view,

  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

/** The options for a new game that starts from a position (play on from here, lessons). */
export function configAt(state: GoState): GoConfig {
  const fresh: GoState = { ...state, phase: state.phase === 'over' || state.phase === 'scoring' ? 'play' : state.phase, dead: [], agreed: null, scorer: 0, result: null, passes: 0, lastPasser: null };
  return { size: state.size, preset: state.preset, rules: state.rules, handicap: state.handicap, position: positionText(fresh) };
}

/** A fresh game's options: a preset on a board, with optional handicap and changes. */
export function makeConfig(size: number, preset: GoPresetId, handicap = 0, changes: Partial<GoRules> = {}): GoConfig {
  return { size, preset, handicap, rules: { ...presetRules(preset, handicap), ...changes } };
}

export { pointName, sgfName, parsePoint };
