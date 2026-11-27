/** PGN in and out, through chess.js. */
import { Chess } from 'chess.js';
import type { Outcome } from '../../core/contract';
import type { Json } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay } from '../../core/replay';
import type { ChessConfig } from './rules';
import { chess, START_FEN, uciOf } from './rules';

function resultTag(outcome: Outcome | null): string {
  if (!outcome) return '*';
  const white = outcome.results.find((r) => r.seat === 0);
  const black = outcome.results.find((r) => r.seat === 1);
  if (!white || !black) return '*';
  if (white.place < black.place) return '1-0';
  if (black.place < white.place) return '0-1';
  return '1/2-1/2';
}

function pgnDate(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/** Writes a record as PGN. `names` are the White and Black player names. */
export function writePgn(record: GameRecord, names: readonly string[]): string {
  const config = chess.codec.config.fromJSON(record.config);
  const start = config.fen ?? START_FEN;
  const board = new Chess(start);
  board.setHeader('Event', 'Kibitz game');
  board.setHeader('Site', 'Kibitz');
  board.setHeader('Date', pgnDate(record.createdAt));
  board.setHeader('White', names[0] ?? 'White');
  board.setHeader('Black', names[1] ?? 'Black');
  board.setHeader('Result', resultTag(record.outcome));
  if (config.fen) {
    board.setHeader('SetUp', '1');
    board.setHeader('FEN', start);
  }
  if (record.ending?.kind === 'resigned') board.setHeader('Termination', 'resignation');
  if (record.ending?.kind === 'timeout') board.setHeader('Termination', 'time forfeit');
  for (const step of replay(chess, record).steps) {
    board.move({ from: step.action.from, to: step.action.to, ...(step.action.promotion ? { promotion: step.action.promotion } : {}) });
  }
  const text = board.pgn({ maxWidth: 80 });
  // chess.js leaves the result off when the game is not over on the board (resignation, time).
  return text.trimEnd().endsWith(resultTag(record.outcome)) ? `${text}\n` : `${text} ${resultTag(record.outcome)}\n`;
}

/** Reads a PGN game into a config, its moves and its result. Throws on anything it cannot read. */
export function readPgn(text: string): { config: ChessConfig; actions: readonly Json[]; outcome: Outcome | null; names: readonly string[] } {
  const board = new Chess();
  try {
    board.loadPgn(text);
  } catch (err) {
    throw new Error(`This is not a game in PGN: ${(err as Error).message}`, { cause: err });
  }
  const headers = board.getHeaders();
  const fen = headers.FEN && headers.SetUp === '1' ? headers.FEN : undefined;
  const moves = board.history({ verbose: true });
  const config: ChessConfig = fen ? { fen } : {};
  const actions = moves.map((m) => uciOf({ from: m.from, to: m.to, ...(m.promotion ? { promotion: m.promotion as 'q' | 'r' | 'b' | 'n' } : {}) }));
  const result = headers.Result ?? '*';
  const outcome: Outcome | null =
    result === '1-0'
      ? { reason: 'pgn', results: [{ seat: 0, place: 1, score: 1 }, { seat: 1, place: 2, score: 0 }] }
      : result === '0-1'
        ? { reason: 'pgn', results: [{ seat: 1, place: 1, score: 1 }, { seat: 0, place: 2, score: 0 }] }
        : result === '1/2-1/2'
          ? { reason: 'pgn', results: [{ seat: 0, place: 1, score: 0.5 }, { seat: 1, place: 1, score: 0.5 }] }
          : null;
  return { config, actions, outcome, names: [headers.White ?? 'White', headers.Black ?? 'Black'] };
}
