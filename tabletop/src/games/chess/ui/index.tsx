import { isJsonObject } from '../../../core/json';
import type { Outcome, Seat } from '../../../core/contract';
import { ChessPiece } from '../../../kits/board/chess-pieces';
import { t, tDynamic } from '../../../text';
import type { CoachWarning, GameUi, ReferenceSection } from '../../types';
import { NO_OVERLAY } from '../../types';
import { CHESS_LEVELS } from '../levels';
import { readPgn, writePgn } from '../pgn';
import type { ChessAction, ChessConfig, ChessEvent, ChessState, ChessView, PieceType } from '../rules';
import { chess, chessAt, material, uciOf } from '../rules';
import { ChessCoachPanel } from './CoachPanel';
import { ChessSeatMark, ChessSurface } from './ChessSurface';
import { analyseChessGame } from '../review';

const ORDER: readonly Exclude<PieceType, 'k'>[] = ['q', 'r', 'b', 'n', 'p'];

function countPieces(fen: string, color: 'w' | 'b'): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const row of chessAt(fen).board()) for (const p of row) if (p && p.color === color) counts[p.type] = (counts[p.type] ?? 0) + 1;
  return counts;
}

/** Pieces the other side has lost since the start of this game, shown under the player who took them. */
function captured(startFen: string, fen: string, seat: Seat): Exclude<PieceType, 'k'>[] {
  const theirColor = seat === 0 ? 'b' : 'w';
  const before = countPieces(startFen, theirColor);
  const now = countPieces(fen, theirColor);
  const out: Exclude<PieceType, 'k'>[] = [];
  for (const type of ORDER) for (let i = 0; i < Math.max(0, (before[type] ?? 0) - (now[type] ?? 0)); i++) out.push(type);
  return out;
}

function CapturedPieces({ state, start, seat }: { state: ChessState; start: ChessState; seat: Seat }) {
  const pieces = captured(start.fen, state.fen, seat);
  const m = material(state.fen);
  const lead = seat === 0 ? m.w - m.b : m.b - m.w;
  if (pieces.length === 0 && lead <= 0) return null;
  return (
    <span className="captured" aria-label={t('chess.captured', { n: pieces.length })}>
      {pieces.map((p, i) => (
        <svg key={i} viewBox="0 0 100 100" className="captured-piece" aria-hidden="true">
          <ChessPiece kind={p} color={seat === 0 ? 'b' : 'w'} />
        </svg>
      ))}
      {lead > 0 ? <span className="num lead">+{lead}</span> : null}
    </span>
  );
}

const PIECE_KEY: Record<string, string> = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn', k: 'king' };

/** The words of a blunder warning: what the move does wrong, and the reply that shows it. */
function warningText(reason: string, mateIn: number, replySan: string): string {
  let main: string;
  if (reason === 'allows-mate') main = t('coach.warn.allows-mate', { n: mateIn });
  else if (reason.startsWith('hangs-')) main = t('coach.warn.hangs', { piece: tDynamic(`chess.piece.${PIECE_KEY[reason.slice(6)] ?? 'pawn'}`) });
  else main = t('coach.warn.loses-ground');
  return replySan ? `${main} ${t('coach.warn.reply', { move: replySan })}` : main;
}

function onlyKing(fen: string, color: 'w' | 'b'): boolean {
  return chessAt(fen)
    .board()
    .flat()
    .every((p) => !p || p.color !== color || p.type === 'k');
}

function loneMinor(fen: string, color: 'w' | 'b'): boolean {
  const pieces = chessAt(fen)
    .board()
    .flat()
    .filter((p) => p && p.color === color && p.type !== 'k');
  return pieces.length === 1 && (pieces[0]?.type === 'n' || pieces[0]?.type === 'b');
}

export const chessUi: GameUi<ChessState, ChessAction, ChessConfig, ChessView, ChessEvent> = {
  def: chess,
  levels: CHESS_LEVELS,
  levelBlurb: (level) => tDynamic(`chess.level.${level}`),
  layout: 'board',
  Surface: ChessSurface,
  SeatMark: ChessSeatMark,
  SeatExtra: CapturedPieces,
  sides: [
    { id: 'white', label: 'chess.side.white', seat: 0 },
    { id: 'black', label: 'chess.side.black', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => (seat === 0 ? t('chess.white.title') : t('chess.black.title')),
  movePrefix: () => '',
  eventDuration: (event) => (event.type === 'move' ? 230 : 0),
  describeEvent(event) {
    switch (event.type) {
      case 'move':
        return event.san;
      case 'check':
        return t('chess.log.check');
      case 'end':
        return tDynamic(`chess.log.end.${event.result.kind}`);
    }
  },
  counters(state) {
    const m = material(state.fen);
    const halfmoves = Number(state.fen.split(' ')[4] ?? 0);
    return [
      { label: t('chess.counter.material'), value: `${m.w} · ${m.b}` },
      { label: t('chess.counter.fifty'), value: `${Math.floor(halfmoves / 2)} / 50` },
    ];
  },
  sound: (event) => (event.type === 'move' ? (event.captured ? 'capture' : 'place') : event.type === 'end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    return [
      { title: 'ref.chess.moves', items: [t('ref.chess.moves.1'), t('ref.chess.moves.2'), t('ref.chess.moves.3'), t('ref.chess.moves.4'), t('ref.chess.moves.5'), t('ref.chess.moves.6')] },
      { title: 'ref.chess.special', items: [t('ref.chess.special.1'), t('ref.chess.special.2'), t('ref.chess.special.3')] },
      { title: 'ref.chess.end', items: [t('ref.chess.end.1'), t('ref.chess.end.2'), t('ref.chess.end.3'), t('ref.chess.end.4')] },
      { title: 'ref.chess.values', items: [t('ref.chess.values.1'), t('ref.chess.values.2')] },
      { title: 'ref.chess.notation', items: [t('ref.chess.notation.1'), t('ref.chess.notation.2'), t('ref.chess.notation.3')] },
      { title: 'ref.chess.terms', items: [t('ref.chess.terms.1'), t('ref.chess.terms.2'), t('ref.chess.terms.3'), t('ref.chess.terms.4')] },
      { title: 'ref.chess.levels', items: CHESS_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('chess.rating', { n: l.rating })}): ${tDynamic(`chess.level.${l.level}`)}`) },
    ];
  },
  flipForSeat: (seat) => seat === 1,
  coach: {
    helps: [
      { id: 'legal', label: 'coach.help.legal', on: true, training: false },
      { id: 'blunder', label: 'coach.help.blunder', on: false, training: true },
      { id: 'threats', label: 'coach.help.threats', on: false, training: true },
      { id: 'eval', label: 'coach.help.eval', on: false, training: true },
    ],
    Panel: ChessCoachPanel,
    async checkMove(ask, before, action): Promise<CoachWarning | null> {
      // Asked about the position before the move: the move has already been made on the board.
      const answer = await ask({ type: 'check-move', move: uciOf(action) }, before);
      if (!isJsonObject(answer) || answer.warn !== true) return null;
      const reply = isJsonObject(answer.reply) ? answer.reply : null;
      const replySan = typeof reply?.san === 'string' ? reply.san : '';
      const replyUci = typeof reply?.uci === 'string' ? reply.uci : '';
      return {
        text: warningText(typeof answer.reason === 'string' ? answer.reason : '', typeof answer.mateIn === 'number' ? answer.mateIn : 0, replySan),
        overlay: replyUci ? { arrows: [{ from: replyUci.slice(0, 2), to: replyUci.slice(2, 4), tone: 'threat' }], marks: [] } : NO_OVERLAY,
      };
    },
  },
  clocks: [
    { id: 'none', label: 'clock.none', initialMs: 0, incrementMs: 0 },
    { id: '5', label: 'clock.5', initialMs: 5 * 60_000, incrementMs: 0 },
    { id: '10', label: 'clock.10', initialMs: 10 * 60_000, incrementMs: 0 },
    { id: '15+10', label: 'clock.15-10', initialMs: 15 * 60_000, incrementMs: 10_000 },
  ],
  timeoutOutcome(state, seat): Outcome {
    const other = seat === 0 ? 1 : 0;
    const otherColor = other === 0 ? 'w' : 'b';
    const mineColor = seat === 0 ? 'w' : 'b';
    // FIDE: the flag falls, but if the other side cannot possibly mate it is a draw.
    if (onlyKing(state.fen, otherColor) || (loneMinor(state.fen, otherColor) && onlyKing(state.fen, mineColor))) {
      return { reason: 'timeout-draw', results: [{ seat: 0, place: 1, score: 0.5 }, { seat: 1, place: 1, score: 0.5 }] };
    }
    return { reason: 'timeout', results: [{ seat: other, place: 1, score: 1 }, { seat, place: 2, score: 0 }] };
  },
  exportRecord: { extension: 'pgn', mime: 'application/x-chess-pgn', write: writePgn },
  review: { analyse: analyseChessGame, configAt: (state) => ({ fen: state.fen }) },
  moveSquares: (action) => ({ from: action.from, to: action.to }),
  importRecord: { accept: '.pgn,application/x-chess-pgn,application/vnd.chess-pgn,text/plain', read: readPgn },
};
