/**
 * The shogi table: the board in the middle, each player's pieces in hand beside it (the far
 * player's on the left, yours on the right, as stands sit at a real board). Tap a piece or a piece
 * in hand, then a square; drag also works on the board. A move that may promote asks; a move that
 * must promote says so; a refused move says why (two pawns, pawn-drop mate, dead pieces, check).
 */
import { useMemo, useState } from 'react';
import type { BoardArrow, BoardMark, BoardSquare, MovingPiece } from '../../../kits/board/GridBoard';
import { GridBoard } from '../../../kits/board/GridBoard';
import type { MessageKey } from '../../../text';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { HandPiece, IllegalReason, ShogiAction, ShogiEvent, ShogiState } from '../rules';
import { boardOf, checkedKing, explainIllegal, handOf, PIECE_NAMES, sideToMove } from '../rules';
import { useShogiLook } from './look';
import { PieceDefs, ShogiPiece } from './pieces';

export const HAND_ORDER: readonly HandPiece[] = ['R', 'B', 'G', 'S', 'N', 'L', 'P'];
export const HAND_TYPE: Readonly<Record<HandPiece, number>> = { P: 0, L: 1, N: 2, S: 3, G: 4, B: 5, R: 6 };
const STYLE_ORDER = ['kanji1', 'kanji2', 'symbols'] as const;

type Selection = { readonly sfen: string; readonly square: string } | { readonly sfen: string; readonly piece: HandPiece };

export const pieceWord = (type: number): string => t(`shogi.piece.${PIECE_NAMES[type] ?? 'pawn'}` as MessageKey);
export const sideWord = (seat: number): string => (seat === 0 ? t('shogi.black') : t('shogi.white'));

/** Splits a canonical move or a square-like overlay name into a board square or a piece in hand. */
function readSpot(name: string): { square: string | null; hand: HandPiece | null } {
  if (/^[1-9][1-9]$/.test(name)) return { square: name, hand: null };
  const drop = /^([PLNSGBR])\*/.exec(name);
  return { square: null, hand: drop ? (drop[1] as HandPiece) : null };
}

export function ShogiSurface({ state, mySeats, canAct, legal, lastAction, anim, onAction, onSkip, flipped, helps, overlay }: SurfaceProps<ShogiState, ShogiAction, ShogiEvent>) {
  const { look, setStyle } = useShogiLook();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [promotion, setPromotion] = useState<{ sfen: string; from: string; to: string } | null>(null);
  /** A note about the last attempt; `sfen` null keeps it until the next tap (forced promotion). */
  const [note, setNote] = useState<{ sfen: string | null; text: string; tone: 'bad' | 'info' } | null>(null);
  const size = state.rules.board === 'mini' ? 5 : 9;
  const toMove = sideToMove(state);
  const mine = canAct && mySeats.includes(toMove) && state.result === null;
  const squares = useMemo(() => boardOf(state), [state]);
  const contents = useMemo(() => new Map(squares.map((s) => [s.square, s])), [squares]);
  const hands = useMemo(() => [handOf(state, 0), handOf(state, 1)] as const, [state]);
  const selected = selection && selection.sfen === state.sfen && mine ? selection : null;
  const pending = promotion && promotion.sfen === state.sfen && mine ? promotion : null;
  const shownNote = note && (note.sfen === null || note.sfen === state.sfen) ? note : null;
  const bottomSeat = flipped ? 1 : 0;
  const topSeat = 1 - bottomSeat;

  const ownAt = (square: string) => {
    const piece = contents.get(square)?.piece;
    return piece !== null && piece !== undefined && piece.seat === toMove;
  };

  const select = (next: Selection | null) => {
    setSelection(next);
    setNote(null);
  };

  const explain = (attempt: { from: string; to: string } | { drop: HandPiece; to: string }) => {
    const reason: IllegalReason | null = explainIllegal(state, attempt);
    if (!reason) return;
    const from = 'from' in attempt ? contents.get(attempt.from)?.piece : null;
    const text =
      reason === 'nifu'
        ? t('shogi.illegal.nifu', { file: attempt.to[0] ?? '' })
        : reason === 'cannot-reach'
          ? t('shogi.illegal.cannot-reach', { piece: from ? pieceWord(from.type) : '' })
          : t(`shogi.illegal.${reason}` as MessageKey);
    setNote({ sfen: state.sfen, text, tone: 'bad' });
  };

  const attempt = (from: string, to: string) => {
    const options = legal.filter((a): a is Extract<ShogiAction, { type: 'move' }> => a.type === 'move' && a.from === from && a.to === to);
    setSelection(null);
    if (options.length === 0) {
      explain({ from, to });
      return;
    }
    if (options.length > 1) {
      setNote(null);
      setPromotion({ sfen: state.sfen, from, to });
      return;
    }
    const only = options[0] as ShogiAction;
    const piece = contents.get(from)?.piece;
    if (only.type === 'move' && only.promote && piece) setNote({ sfen: null, text: t('shogi.promote.forced', { piece: pieceWord(piece.type) }), tone: 'info' });
    else setNote(null);
    onAction(only);
  };

  const onSquare = (square: string) => {
    if (pending || !mine) return;
    if (selected && 'piece' in selected) {
      const drop = legal.find((a) => a.type === 'drop' && a.piece === selected.piece && a.to === square);
      if (drop) {
        select(null);
        onAction(drop);
        return;
      }
      if (ownAt(square)) {
        select({ sfen: state.sfen, square });
        return;
      }
      setSelection(null);
      explain({ drop: selected.piece, to: square });
      return;
    }
    if (selected && 'square' in selected) {
      if (square === selected.square) {
        select(null);
        return;
      }
      if (ownAt(square)) {
        select({ sfen: state.sfen, square });
        return;
      }
      attempt(selected.square, square);
      return;
    }
    if (ownAt(square)) select({ sfen: state.sfen, square });
    else if (contents.get(square)?.piece) setNote({ sfen: state.sfen, text: t('shogi.illegal.not-yours'), tone: 'bad' });
  };

  const onHand = (piece: HandPiece) => {
    if (pending || !mine) return;
    if (selected && 'piece' in selected && selected.piece === piece) select(null);
    else select({ sfen: state.sfen, piece });
  };

  // Legal targets for the selection, shown as dots when the legal-moves help is on.
  const targets = new Map<string, 'move' | 'capture'>();
  if (selected && helps.legal !== false) {
    for (const a of legal) {
      if ('square' in selected && a.type === 'move' && a.from === selected.square) targets.set(a.to, contents.get(a.to)?.piece ? 'capture' : 'move');
      if ('piece' in selected && a.type === 'drop' && a.piece === selected.piece) targets.set(a.to, 'move');
    }
  }
  const movable = new Set<string>();
  if (mine) for (const a of legal) if (a.type === 'move') movable.add(a.from);

  // Coach and lesson overlays may name a piece in hand ("G*" or "G*55"): mark it, and its square.
  const arrows: BoardArrow[] = [];
  const marks: BoardMark[] = [...overlay.marks.filter((m) => readSpot(m.square).square !== null)];
  const handMarks = new Set<HandPiece>();
  for (const m of overlay.marks) {
    const spot = readSpot(m.square);
    if (spot.hand) handMarks.add(spot.hand);
  }
  for (const a of overlay.arrows) {
    const from = readSpot(a.from);
    if (from.square) arrows.push(a);
    else {
      if (from.hand) handMarks.add(from.hand);
      if (readSpot(a.to).square) marks.push({ square: a.to, tone: a.tone });
    }
  }

  const boardSquares: BoardSquare[] = squares.map((s) => ({
    name: s.square,
    file: size - s.file,
    rank: size - s.rank,
    light: true,
    piece: s.piece ? <ShogiPiece type={s.piece.type} seat={s.piece.seat} down={(s.piece.seat === 0) === flipped} style={look.style} marks={look.marks} /> : null,
    label: s.piece ? t('shogi.square.piece', { square: s.square, side: sideWord(s.piece.seat), piece: pieceWord(s.piece.type) }) : t('shogi.square.empty', { square: s.square }),
  }));

  const moving: MovingPiece[] = [];
  const playing = anim.playing;
  if (playing && playing.event.type === 'move') moving.push({ seq: playing.seq, from: playing.event.from, to: playing.event.to, ms: anim.duration });

  const last = lastAction ? (lastAction.type === 'move' ? [lastAction.from, lastAction.to] : lastAction.type === 'drop' ? [lastAction.to] : []) : [];
  const names = Array.from({ length: size }, (_, i) => String(size - i));
  const declare = mine ? legal.find((a) => a.type === 'declare') : undefined;

  const promotionOverlay = pending
    ? (() => {
        const piece = contents.get(pending.from)?.piece;
        if (!piece) return null;
        const file = Number(pending.to[0]);
        const rank = Number(pending.to[1]);
        const col = flipped ? file - 1 : size - file;
        const row = flipped ? size - rank : rank - 1;
        // Two choices, stacked towards the middle of the board.
        const down = row < size / 2;
        const y0 = down ? row * 100 : (row - 1) * 100;
        const choose = (promote: boolean) => {
          const chosen = legal.find((a) => a.type === 'move' && a.from === pending.from && a.to === pending.to && a.promote === promote);
          setPromotion(null);
          if (chosen) onAction(chosen);
        };
        const promotedType = [8, 9, 10, 11, -1, 12, 13][piece.type] ?? piece.type;
        const options = [
          { promote: true, type: promotedType, label: t('shogi.promote') },
          { promote: false, type: piece.type, label: t('shogi.promote.no') },
        ];
        return (
          <g className="promotion">
            <rect x={-14} y={-14} width={size * 100 + 28} height={size * 100 + 28} fill="#0b0805" fillOpacity={0.55} onPointerUp={(e) => {
              e.stopPropagation();
              setPromotion(null);
            }} />
            {options.map((o, i) => (
              <g
                key={String(o.promote)}
                transform={`translate(${col * 100} ${y0 + i * 100})`}
                role="button"
                aria-label={o.label}
                tabIndex={0}
                style={{ cursor: 'pointer' }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  choose(o.promote);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    choose(o.promote);
                  }
                }}
              >
                <rect width={100} height={100} rx={12} fill="#f3ecdc" stroke="#c9a25a" strokeWidth={4} />
                <ShogiPiece type={o.type} seat={piece.seat} down={false} style={look.style} marks={false} />
              </g>
            ))}
          </g>
        );
      })()
    : null;

  const hand = (seat: number, side: 'top' | 'bottom') => {
    const list = hands[seat as 0 | 1];
    const active = mine && seat === toMove;
    const byPiece = new Map(list.map((h) => [h.piece, h.count]));
    const shown = HAND_ORDER.filter((p) => (byPiece.get(p) ?? 0) > 0);
    return (
      <div className="shogi-hand" data-side={side} role="group" aria-label={t('shogi.hand.label', { side: seat === 0 ? t('shogi.sente') : t('shogi.gote') })}>
        {side === 'bottom' ? (
          <button
            type="button"
            className="shogi-look"
            aria-label={t('shogi.look.cycle', { style: t(`shogi.look.${look.style}`) })}
            onClick={() => setStyle(STYLE_ORDER[(STYLE_ORDER.indexOf(look.style) + 1) % STYLE_ORDER.length] ?? 'kanji1')}
          >
            {look.style === 'symbols' ? 'P' : look.style === 'kanji2' ? '歩兵' : '歩'}
          </button>
        ) : null}
        {shown.length === 0 ? <span className="shogi-hand-empty">{t('shogi.hand.none')}</span> : null}
        {shown.map((piece) => {
          const count = byPiece.get(piece) ?? 0;
          const type = HAND_TYPE[piece];
          const pressed = selected !== null && 'piece' in selected && selected.piece === piece && seat === toMove;
          return (
            <button
              key={piece}
              type="button"
              className="shogi-hand-piece"
              data-marked={handMarks.has(piece) && seat === toMove}
              aria-label={t('shogi.hand.item', { piece: pieceWord(type), n: count })}
              aria-pressed={pressed}
              aria-disabled={!active}
              onClick={() => (active ? onHand(piece) : undefined)}
            >
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <PieceDefs />
                <ShogiPiece type={type} seat={seat} down={side === 'top'} style={look.style} marks={false} />
              </svg>
              {count > 1 ? <span className="count num">{count}</span> : null}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="shogi-surface" data-board={state.rules.board}>
      {hand(topSeat, 'top')}
      <div className="shogi-board">
        <GridBoard
          files={size}
          ranks={size}
          squares={boardSquares}
          flipped={flipped}
          label={t('shogi.board')}
          fileNames={names}
          rankNames={names}
          selected={selected && 'square' in selected ? selected.square : null}
          targets={targets}
          lastMove={last}
          check={checkedKing(state)}
          arrows={arrows}
          marks={marks}
          moving={moving}
          movable={movable}
          onSquare={onSquare}
          onDrop={(from, to) => {
            if (!mine || pending) return;
            attempt(from, to);
          }}
          onTouch={() => {
            if (anim.playing || anim.pending.length > 0) onSkip();
          }}
          overlay={
            <>
              <PieceDefs />
              {promotionOverlay}
            </>
          }
          dataPosition={state.sfen}
        />
        {declare ? (
          <button type="button" className="btn btn-small btn-primary shogi-declare" onClick={() => onAction(declare)}>
            {t(`shogi.declare.${state.rules.impasse}` as MessageKey)}
          </button>
        ) : null}
        {shownNote ? (
          <p className="shogi-note" data-tone={shownNote.tone} role="status">
            {shownNote.text}
          </p>
        ) : null}
      </div>
      {hand(bottomSeat, 'bottom')}
    </div>
  );
}

export function ShogiSeatMark({ seat }: { seat: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <PieceDefs />
      <ShogiPiece type={7} seat={seat} down={false} style="kanji1" marks={false} />
    </svg>
  );
}
