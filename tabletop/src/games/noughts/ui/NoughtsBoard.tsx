/**
 * The noughts-and-crosses table: a walnut board drawn in SVG. Marks animate from the event
 * queue; the rules have already moved on, so a mark still waiting its turn is simply not drawn
 * yet. A tap anywhere on the board skips the animations.
 */
import type { CSSProperties, KeyboardEvent } from 'react';
import type { SurfaceProps } from '../../types';
import type { Cell, NoughtsAction, NoughtsEvent, NoughtsState } from '../rules';
import { cellName, markOf } from '../rules';
import { t } from '../../../text';

const SIZE = 300;
const MARGIN = 18;
const CELL = (SIZE - MARGIN * 2) / 3;

const center = (cell: number) => ({ x: MARGIN + (cell % 3) * CELL + CELL / 2, y: MARGIN + Math.floor(cell / 3) * CELL + CELL / 2 });

function Mark({ mark, cell, drawing }: { mark: Cell; cell: number; drawing: { seq: number; ms: number } | null }) {
  const { x, y } = center(cell);
  const style = drawing ? ({ '--dur': `${drawing.ms}ms` } as CSSProperties) : undefined;
  const className = drawing ? 'nc-mark drawing' : 'nc-mark';
  if (mark === 0) {
    const d = 23;
    return (
      <g className={className} style={style} key={drawing ? `x-${drawing.seq}` : 'x'}>
        <path className="shadow" d={`M${x - d + 2} ${y - d + 3}L${x + d + 2} ${y + d + 3}M${x + d + 2} ${y - d + 3}L${x - d + 2} ${y + d + 3}`} stroke="#140c06" strokeOpacity={0.4} strokeWidth={12} />
        <path className="s1" pathLength={1} d={`M${x - d} ${y - d}L${x + d} ${y + d}`} stroke="#f1e8d5" strokeWidth={12} />
        <path className="s2" pathLength={1} d={`M${x + d} ${y - d}L${x - d} ${y + d}`} stroke="#f1e8d5" strokeWidth={12} />
      </g>
    );
  }
  return (
    <g className={className} style={style} key={drawing ? `o-${drawing.seq}` : 'o'}>
      <circle className="shadow" cx={x + 2} cy={y + 3} r={25} stroke="#140c06" strokeOpacity={0.4} strokeWidth={11} />
      <circle className="s1" pathLength={1} cx={x} cy={y} r={25} stroke="#d6af63" strokeWidth={11} transform={`rotate(-90 ${x} ${y})`} />
    </g>
  );
}

export function NoughtsBoard({ state, canAct, legal, lastAction, anim, onAction, onSkip }: SurfaceProps<NoughtsState, NoughtsAction, NoughtsEvent>) {
  const waiting = new Set<number>();
  let lineWaiting = false;
  for (const item of anim.pending) {
    if (item.event.type === 'placed') waiting.add(item.event.cell);
    if (item.event.type === 'line') lineWaiting = true;
  }
  const playing = anim.playing;
  const drawingCell = playing?.event.type === 'placed' ? playing.event.cell : null;
  const drawingLine = playing?.event.type === 'line';
  const busy = playing !== null || anim.pending.length > 0;
  const isLegal = (cell: number) => canAct && legal.includes(cell);

  const onKey = (e: KeyboardEvent, cell: number) => {
    if ((e.key === 'Enter' || e.key === ' ') && isLegal(cell)) {
      e.preventDefault();
      onAction(cell);
    }
  };

  const line = state.line;
  const lineEnds = line
    ? (() => {
        const a = center(line[0] as number);
        const b = center(line[2] as number);
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const len = Math.hypot(dx, dy);
        const ext = 26 / len;
        return { x1: a.x - dx * ext, y1: a.y - dy * ext, x2: b.x + dx * ext, y2: b.y + dy * ext };
      })()
    : null;

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      role="group"
      aria-label={t('noughts.board')}
      onPointerDown={() => {
        if (busy) onSkip();
      }}
    >
      <defs>
        <linearGradient id="nc-walnut" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#74502f" />
          <stop offset="0.55" stopColor="#5d3f26" />
          <stop offset="1" stopColor="#4a311c" />
        </linearGradient>
        <radialGradient id="nc-sheen" cx="0.35" cy="0.25" r="0.9">
          <stop offset="0" stopColor="#ffe9c8" stopOpacity="0.14" />
          <stop offset="1" stopColor="#ffe9c8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="2" y="5" width={SIZE - 4} height={SIZE - 4} rx="16" fill="#000" opacity="0.35" />
      <rect x="1" y="1" width={SIZE - 2} height={SIZE - 4} rx="16" fill="url(#nc-walnut)" />
      <g stroke="#2b1a0d" strokeOpacity="0.16" strokeWidth="1.3" fill="none">
        <path d="M8 46c60-14 110 10 170-4s90 6 116-2" />
        <path d="M6 118c70 10 120-16 190-2s70-8 98 4" />
        <path d="M8 186c50-10 100 12 160 0s96-14 124-2" />
        <path d="M6 252c64 12 130-10 190 0s72 6 98-6" />
      </g>
      <rect x="1" y="1" width={SIZE - 2} height={SIZE - 4} rx="16" fill="url(#nc-sheen)" />
      <rect x="4" y="4" width={SIZE - 8} height={SIZE - 10} rx="13" fill="none" stroke="#ffe2b8" strokeOpacity="0.09" />

      {[1, 2].map((i) => {
        const p = MARGIN + i * CELL;
        return (
          <g key={i} strokeLinecap="round">
            <path d={`M${p} ${MARGIN + 10}V${SIZE - MARGIN - 10}M${MARGIN + 10} ${p}H${SIZE - MARGIN - 10}`} stroke="#2a190c" strokeWidth="5" />
            <path d={`M${p + 2.2} ${MARGIN + 12}V${SIZE - MARGIN - 8}M${MARGIN + 12} ${p + 2.2}H${SIZE - MARGIN - 8}`} stroke="#ffdcae" strokeOpacity="0.14" strokeWidth="1.4" />
          </g>
        );
      })}

      {lastAction !== null && !waiting.has(lastAction) ? (
        <rect
          x={MARGIN + (lastAction % 3) * CELL + 7}
          y={MARGIN + Math.floor(lastAction / 3) * CELL + 7}
          width={CELL - 14}
          height={CELL - 14}
          rx="10"
          fill="#e2c27f"
          fillOpacity="0.13"
        />
      ) : null}

      {state.cells.map((mark, cell) =>
        mark === null || waiting.has(cell) ? null : (
          <Mark key={cell} mark={mark} cell={cell} drawing={drawingCell === cell && playing ? { seq: playing.seq, ms: anim.duration } : null} />
        ),
      )}

      {lineEnds && line && !lineWaiting ? (
        <line
          className={drawingLine ? 'nc-line drawing' : 'nc-line'}
          style={drawingLine ? ({ '--dur': `${anim.duration}ms` } as CSSProperties) : undefined}
          pathLength={1}
          {...lineEnds}
          stroke="#fff6e4"
          strokeOpacity="0.9"
          strokeWidth="7"
        />
      ) : null}

      {state.cells.map((mark, cell) => {
        const legalHere = isLegal(cell);
        // Labels always tell the true position, even while a mark is still waiting to be drawn.
        const label = mark === null ? t('noughts.square.empty', { square: cellName(cell) }) : t('noughts.square.mark', { square: cellName(cell), mark: markOf(mark) });
        return (
          <rect
            key={`hit-${cell}`}
            className={legalHere ? 'nc-cell legal' : 'nc-cell'}
            x={MARGIN + (cell % 3) * CELL + 3}
            y={MARGIN + Math.floor(cell / 3) * CELL + 3}
            width={CELL - 6}
            height={CELL - 6}
            rx="10"
            role="button"
            aria-label={label}
            aria-disabled={!legalHere}
            tabIndex={legalHere ? 0 : -1}
            onClick={() => {
              if (legalHere) onAction(cell);
            }}
            onKeyDown={(e) => onKey(e, cell)}
          />
        );
      })}
    </svg>
  );
}

export function NoughtsSeatMark({ seat }: { seat: number }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {seat === 0 ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="#f1e8d5" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      ) : (
        <circle cx="12" cy="12" r="6.6" stroke="#d6af63" strokeWidth="3.2" fill="none" />
      )}
    </svg>
  );
}
