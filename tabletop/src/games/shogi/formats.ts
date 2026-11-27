/**
 * Shogi game files: KIF, KI2, CSA and JKF through tsshogi (MIT) for the standard board, and USI
 * ("position sfen ... moves ...") for both boards. Mini-shogi games, which the standard formats
 * cannot hold, are written in KIF's move form with a 5五将棋 header and the start as SFEN, and read
 * back by the app's own reader. SFEN positions themselves are the state codec (rules.ts).
 */
import {
  Color as TsColor,
  detectRecordFormat,
  exportCSA,
  exportKIF,
  getBlackPlayerName,
  getWhitePlayerName,
  importCSA,
  importJKFString,
  importKI2,
  importKIF,
  Position as TsPosition,
  Record as TsRecord,
  RecordFormatType,
  RecordMetadataKey,
  specialMove,
  SpecialMoveType,
} from 'tsshogi';
import type { Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay } from '../../core/replay';
import { createRng } from '../../core/rng';
import { parseSfen, START_SFEN } from './core';
import { canonicalToUsi, DECLARE, japaneseMove, moveFromCanonical, toCanonical } from './notation';
import type { ShogiConfig } from './presets';
import { HANDICAPS } from './presets';
import type { ShogiState } from './rules';
import { canonicalAction, shogi } from './rules';

export class ShogiFileError extends Error {}

function startOf(record: GameRecord): ShogiState {
  return shogi.setup(shogi.codec.config.fromJSON(record.config), createRng(record.seed));
}

/** The game's moves in the canonical form, without impasse claims. */
function movesOf(record: GameRecord): { moves: string[]; declared: boolean } {
  const moves: string[] = [];
  let declared = false;
  for (const a of record.actions) {
    if (a === DECLARE) declared = true;
    else if (typeof a === 'string') moves.push(a);
  }
  return { moves, declared };
}

/** The special move that ends a game, by the record's outcome. */
function endingOf(record: GameRecord, final: ShogiState): SpecialMoveType | null {
  if (record.ending?.kind === 'resigned') return SpecialMoveType.RESIGN;
  if (record.ending?.kind === 'timeout') return SpecialMoveType.TIMEOUT;
  const r = final.result;
  if (!r) return record.status === 'finished' ? null : SpecialMoveType.INTERRUPT;
  switch (r.kind) {
    case 'checkmate':
    case 'no-moves':
      return SpecialMoveType.MATE;
    case 'repetition':
      return r.winner === null ? SpecialMoveType.REPETITION_DRAW : SpecialMoveType.FOUL_LOSE;
    case 'perpetual-check':
      return SpecialMoveType.FOUL_WIN;
    case 'impasse-count':
      return SpecialMoveType.IMPASS;
    case 'impasse-declared':
      return SpecialMoveType.ENTERING_OF_KING;
    case 'try':
      return SpecialMoveType.TRY;
    case 'move-limit':
      return SpecialMoveType.MAX_MOVES;
  }
}

function tsRecord(record: GameRecord, names: readonly string[]): TsRecord {
  const start = startOf(record);
  const position = TsPosition.newBySFEN(start.sfen);
  if (!position) throw new ShogiFileError('This position cannot be written as KIF');
  const ts = new TsRecord(position);
  ts.metadata.setStandardMetadata(RecordMetadataKey.BLACK_NAME, names[0] ?? '');
  ts.metadata.setStandardMetadata(RecordMetadataKey.WHITE_NAME, names[1] ?? '');
  ts.metadata.setStandardMetadata(RecordMetadataKey.START_DATETIME, new Date(record.createdAt).toISOString().slice(0, 19).replace('T', ' '));
  for (const m of movesOf(record).moves) {
    const move = ts.position.createMoveByUSI(canonicalToUsi(m));
    if (!move || !ts.append(move)) throw new ShogiFileError(`Move ${m} could not be written`);
  }
  const final = replay(shogi, record).state;
  const ending = endingOf(record, final);
  if (ending) ts.append(specialMove(ending));
  return ts;
}

/** KIF (UTF-8). Standard games through tsshogi; mini-shogi in the same move form. */
export function writeKif(record: GameRecord, names: readonly string[]): string {
  const start = startOf(record);
  if (start.rules.board === 'standard') return exportKIF(tsRecord(record, names));
  return writeMiniKif(record, names, start);
}

/** CSA holds the 9×9 board only. */
export function canWriteCsa(record: GameRecord): boolean {
  return startOf(record).rules.board === 'standard';
}

export function writeCsa(record: GameRecord, names: readonly string[]): string {
  if (!canWriteCsa(record)) throw new ShogiFileError('CSA files hold the 9×9 board only');
  return exportCSA(tsRecord(record, names));
}

/**
 * USI: "position sfen <start> moves 7g7f 3c3d ...", for either board. The standard start is
 * written "startpos" unless `sfen` asks for the SFEN itself (the "Save as SFEN" file).
 */
export function writeUsi(record: GameRecord, sfen = false): string {
  const start = startOf(record);
  const { moves } = movesOf(record);
  const head = start.sfen === START_SFEN.standard && !sfen ? 'position startpos' : `position sfen ${start.sfen}`;
  return moves.length > 0 ? `${head} moves ${moves.map(canonicalToUsi).join(' ')}` : head;
}

const RANK_KANJI = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
const FULL = '０１２３４５６７８９';

function writeMiniKif(record: GameRecord, names: readonly string[], start: ShogiState): string {
  const lines = ['# KIF (Kibitz): mini-shogi', '手合割：５五将棋', `先手：${names[0] ?? ''}`, `後手：${names[1] ?? ''}`, `#SFEN ${start.sfen}`, '手数----指手---------消費時間--'];
  let state = start;
  let lastTo: number | null = null;
  let ply = 0;
  for (const m of movesOf(record).moves) {
    const p = parseSfen(state.sfen);
    const legal = p.legalMoves();
    const packed = moveFromCanonical(p, legal, m);
    if (packed === null) throw new ShogiFileError(`Move ${m} is not legal`);
    ply++;
    lines.push(`${String(ply).padStart(4)} ${japaneseMove(p, packed, legal, lastTo)}`);
    lastTo = packed & 0xff;
    const action = shogi.codec.action.fromText(m, state);
    state = shogi.apply(state, action).state;
  }
  if (record.ending?.kind === 'resigned') lines.push(`${String(ply + 1).padStart(4)} 投了`);
  else if (state.result?.kind === 'checkmate') lines.push(`${String(ply + 1).padStart(4)} 詰み`);
  else if (state.result?.kind === 'repetition') lines.push(`${String(ply + 1).padStart(4)} 千日手`);
  return `${lines.join('\n')}\n`;
}

const KIF_PIECE_LETTER: Readonly<Record<string, string>> = { 歩: 'P', 香: 'L', 桂: 'N', 銀: 'S', 金: 'G', 角: 'B', 飛: 'R', 玉: 'K', 王: 'K', と: 'P', 馬: 'B', 龍: 'R', 竜: 'R' };

/** Reads the app's own mini-shogi KIF (moves carry their origin square in brackets). */
function readMiniKif(text: string): { config: ShogiConfig; actions: string[] } {
  const sfen = /#SFEN\s+(.+)/.exec(text)?.[1]?.trim() ?? START_SFEN.mini;
  const actions: string[] = [];
  let lastDest = '';
  for (const line of text.split(/\r?\n/)) {
    const m = /^\s*\d+\s+(\S+)/.exec(line);
    if (!m) continue;
    const token = m[1] ?? '';
    if (/^(投了|詰み|千日手|中断|持将棋)/.test(token)) break;
    let rest = token;
    let dest: string;
    if (rest.startsWith('同')) {
      dest = lastDest;
      rest = rest.slice(1).replace(/^[\s\u3000]+/, '');
    } else {
      const file = FULL.indexOf(rest[0] ?? '') >= 0 ? FULL.indexOf(rest[0] ?? '') : Number(rest[0]);
      const rank = RANK_KANJI.indexOf(rest[1] ?? '');
      if (!(file >= 1) || rank < 1) throw new ShogiFileError(`Cannot read the move "${token}"`);
      dest = `${file}${rank}`;
      rest = rest.slice(2);
    }
    lastDest = dest;
    const origin = /\((\d)(\d)\)/.exec(rest);
    if (rest.includes('打') || !origin) {
      const letter = KIF_PIECE_LETTER[rest[0] ?? ''];
      if (!letter) throw new ShogiFileError(`Cannot read the drop "${token}"`);
      actions.push(`${letter}*${dest}`);
    } else {
      // "角成" promotes, "角不成" declines, "成銀" is a promoted silver moving.
      const name = rest.split('(')[0] ?? '';
      const promote = name.endsWith('成') && !name.endsWith('不成') && !['成香', '成桂', '成銀'].includes(name);
      actions.push(`${origin[1]}${origin[2]}${dest}${promote ? '+' : ''}`);
    }
  }
  return { config: configForStart(sfen), actions };
}

/** Reads a USI line, for either board. */
function readUsi(text: string): { config: ShogiConfig; actions: string[] } {
  const line = text.trim().replace(/^position\s+/, '');
  const [where = '', movesPart = ''] = line.split(/\s+moves\s+/);
  const sfen = where.startsWith('startpos') ? START_SFEN.standard : where.replace(/^sfen\s+/, '').trim();
  const actions = movesPart
    .split(/\s+/)
    .filter(Boolean)
    .map((m) => {
      const c = toCanonical(m);
      if (c === null) throw new ShogiFileError(`"${m}" is not a USI move`);
      return c;
    });
  return { config: configForStart(sfen), actions };
}

/** The config for a starting SFEN: a named handicap when it is one, otherwise the position. */
function configForStart(sfen: string): ShogiConfig {
  const normal = shogi.codec.state.fromText(sfen).sfen;
  const known = HANDICAPS.find((h) => h.sfen === normal);
  if (known) return known.board === 'standard' ? (known.id === 'even' ? {} : { handicap: known.id }) : known.id === 'even' ? { board: 'mini' } : { board: 'mini', handicap: known.id };
  return { position: normal };
}

export interface ReadGame {
  readonly config: ShogiConfig;
  readonly actions: readonly Json[];
  readonly outcome: Outcome | null;
  readonly names: readonly string[];
}

/** Reads a game file of any supported format. Throws ShogiFileError with a plain message. */
export function readGameFile(text: string, messages: { encoding: string; unknown: string }): ReadGame {
  if (text.includes('�')) throw new ShogiFileError(messages.encoding);
  const trimmed = text.trim();
  // A USI line, or a bare SFEN (which tsshogi would not know on the 5×5 board).
  if (/^(position\s+)?(startpos|sfen)\b/.test(trimmed) || /^[1-9A-Za-z+/]+ [bw] [-0-9A-Za-z]+( \d+)?$/.test(trimmed)) {
    const read = readUsi(trimmed);
    return { ...read, outcome: null, names: [] };
  }
  if (trimmed.includes('５五将棋')) {
    const read = readMiniKif(trimmed);
    return { ...read, outcome: null, names: [/先手：(.*)/.exec(trimmed)?.[1]?.trim() ?? '', /後手：(.*)/.exec(trimmed)?.[1]?.trim() ?? ''] };
  }
  let ts: TsRecord | Error;
  switch (detectRecordFormat(trimmed)) {
    case RecordFormatType.KIF:
      ts = importKIF(trimmed);
      break;
    case RecordFormatType.KI2:
      ts = importKI2(trimmed);
      break;
    case RecordFormatType.CSA:
      ts = importCSA(trimmed);
      break;
    case RecordFormatType.JKF:
      ts = importJKFString(trimmed);
      break;
    case RecordFormatType.USI:
    case RecordFormatType.SFEN: {
      const read = readUsi(trimmed);
      return { ...read, outcome: null, names: [] };
    }
    default:
      throw new ShogiFileError(messages.unknown);
  }
  if (ts instanceof Error) throw new ShogiFileError(ts.message);
  // An empty record is only a game file if it says so in its header.
  if (ts.moves.length <= 1 && !/手合割|開始局面|先手|後手|^P[I1-9]|^V2|^N[+-]/m.test(trimmed)) throw new ShogiFileError(messages.unknown);
  const config = configForStart(ts.initialPosition.sfen);
  const actions: string[] = [];
  let outcome: Outcome | null = null;
  ts.goto(0);
  for (const node of ts.moves.slice(1)) {
    const move = node.move;
    if ('usi' in move && typeof move.usi === 'string') {
      const c = toCanonical(move.usi);
      if (c === null) throw new ShogiFileError(`Cannot read move ${move.usi}`);
      actions.push(c);
      continue;
    }
    if ('type' in move && move.type === SpecialMoveType.RESIGN) {
      // The side to move resigned.
      const loser: Seat = node.nextColor === TsColor.BLACK ? 0 : 1;
      const winner: Seat = loser === 0 ? 1 : 0;
      outcome = { reason: 'resigned', results: [{ seat: winner, place: 1, score: 1 }, { seat: loser, place: 2, score: 0 }] };
    } else if (!outcome) {
      outcome = { reason: 'shogi-file', results: [{ seat: 0, place: 1, score: 0.5 }, { seat: 1, place: 1, score: 0.5 }] };
    }
    break;
  }
  return { config, actions, outcome, names: [getBlackPlayerName(ts.metadata) ?? '', getWhitePlayerName(ts.metadata) ?? ''] };
}

export { canonicalAction };
