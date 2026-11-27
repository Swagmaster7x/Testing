/** The chess board: tap a piece and a square, or drag; promotion picker; moves slide from the queue. */
import type { Square } from 'chess.js';
import { useMemo, useState } from 'react';
import { ChessPiece, PIECE_NAMES } from '../../../kits/board/chess-pieces';
import type { BoardSquare, MovingPiece } from '../../../kits/board/GridBoard';
import { GridBoard } from '../../../kits/board/GridBoard';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { ChessAction, ChessEvent, ChessState, PromotionPiece } from '../rules';
import { checkedKing, chessAt, colorOf, sideToMove } from '../rules';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'];
const PROMOTIONS: readonly PromotionPiece[] = ['q', 'r', 'b', 'n'];

export function ChessSurface({ state, mySeats, canAct, legal, lastAction, anim, onAction, onSkip, flipped, helps, overlay }: SurfaceProps<ChessState, ChessAction, ChessEvent>) {
  const [selected, setSelected] = useState<string | null>(null);
  const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const board = useMemo(() => chessAt(state.fen).board(), [state.fen]);
  const toMove = sideToMove(state.fen);
  const myColors = new Set(mySeats.map(colorOf));

  const squares: BoardSquare[] = [];
  board.forEach((row, r) => {
    row.forEach((p, f) => {
      const name = `${FILES[f]}${8 - r}`;
      const rank = 7 - r;
      squares.push({
        name,
        file: f,
        rank,
        light: (f + rank) % 2 === 1,
        piece: p ? <ChessPiece kind={p.type} color={p.color} /> : null,
        label: p ? `${name}, ${p.color === 'w' ? t('chess.white') : t('chess.black')} ${t(`chess.piece.${PIECE_NAMES[p.type]}` as never)}` : t('chess.square.empty', { square: name }),
      });
    });
  });

  const movable = new Set<string>();
  if (canAct && myColors.has(toMove)) for (const a of legal) movable.add(a.from);
  const active = selected && movable.has(selected) ? selected : null;
  const targets = new Map<string, 'move' | 'capture'>();
  if (active && helps.legal !== false) {
    const position = chessAt(state.fen);
    for (const a of legal) {
      if (a.from !== active) continue;
      targets.set(a.to, position.get(a.to) || a.san.includes('x') ? 'capture' : 'move');
    }
  }

  const attempt = (from: string, to: string) => {
    const options = legal.filter((a) => a.from === from && a.to === to);
    if (options.length === 0) {
      setSelected(movable.has(to) ? to : null);
      return;
    }
    setSelected(null);
    if (options.length > 1) {
      setPromotion({ from: from as Square, to: to as Square });
      return;
    }
    onAction(options[0] as ChessAction);
  };

  const onSquare = (square: string) => {
    if (promotion) return;
    if (active && square !== active) attempt(active, square);
    else setSelected(movable.has(square) && square !== active ? square : null);
  };

  const moving: MovingPiece[] = [];
  const playing = anim.playing;
  if (playing && playing.event.type === 'move') {
    moving.push({ seq: playing.seq, from: playing.event.from, to: playing.event.to, ms: anim.duration });
    if (playing.event.rook) moving.push({ seq: playing.seq, from: playing.event.rook.from, to: playing.event.rook.to, ms: anim.duration });
  }

  const promotionOverlay = promotion
    ? (() => {
        const file = FILES.indexOf(promotion.to[0] ?? 'a');
        const col = flipped ? 7 - file : file;
        const color = toMove;
        const fromTop = (promotion.to[1] === '8') !== flipped;
        return (
          <g className="promotion">
            <rect x={-14} y={-14} width={828} height={828} fill="#0b0805" fillOpacity={0.55} onPointerUp={() => setPromotion(null)} />
            {PROMOTIONS.map((piece, i) => {
              const y = fromTop ? i * 100 : 700 - i * 100;
              return (
                <g
                  key={piece}
                  transform={`translate(${col * 100} ${y})`}
                  role="button"
                  aria-label={t('chess.promote', { piece: t(`chess.piece.${PIECE_NAMES[piece]}` as never) })}
                  tabIndex={0}
                  onPointerUp={(e) => {
                    e.stopPropagation();
                    const chosen = legal.find((a) => a.from === promotion.from && a.to === promotion.to && a.promotion === piece);
                    setPromotion(null);
                    if (chosen) onAction(chosen);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') return;
                    const chosen = legal.find((a) => a.from === promotion.from && a.to === promotion.to && a.promotion === piece);
                    setPromotion(null);
                    if (chosen) onAction(chosen);
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <rect width={100} height={100} rx={12} fill="#f3ecdc" stroke="#c9a25a" strokeWidth={4} />
                  <ChessPiece kind={piece} color={color} />
                </g>
              );
            })}
          </g>
        );
      })()
    : null;

  return (
    <GridBoard
      files={8}
      ranks={8}
      squares={squares}
      flipped={flipped}
      label={t('chess.board')}
      fileNames={FILES}
      rankNames={RANKS}
      selected={active}
      targets={targets}
      lastMove={lastAction ? [lastAction.from, lastAction.to] : []}
      check={checkedKing(state.fen)}
      arrows={overlay.arrows}
      marks={overlay.marks}
      moving={moving}
      movable={movable}
      onSquare={onSquare}
      onDrop={(from, to) => {
        setSelected(null);
        attempt(from, to);
      }}
      onTouch={() => {
        if (anim.playing || anim.pending.length > 0) onSkip();
      }}
      overlay={promotionOverlay}
      dataPosition={state.fen}
    />
  );
}

export function ChessSeatMark({ seat }: { seat: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <ChessPiece kind="k" color={seat === 0 ? 'w' : 'b'} />
    </svg>
  );
}
