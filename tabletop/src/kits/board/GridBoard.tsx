/**
 * BoardKit grid (PLAN.md M1): a board of squares for Chess now and Shogi later. Tap a piece and
 * then a square, or drag. Shows the last move, legal targets, check, coach arrows and
 * coordinates, and can be flipped. Each square is a labelled button, which the tests use too.
 */
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { useRef, useState } from 'react';

export interface BoardSquare {
  /** The square's name, such as "e4". */
  readonly name: string;
  /** Column from the left and row from the bottom, as seen from the first player. */
  readonly file: number;
  readonly rank: number;
  readonly light: boolean;
  readonly piece: ReactNode | null;
  /** Read out by screen readers and used by tests: "e4, white knight". */
  readonly label: string;
}

export type ArrowTone = 'hint' | 'threat' | 'info';

export interface BoardArrow {
  readonly from: string;
  readonly to: string;
  readonly tone: ArrowTone;
}

export interface BoardMark {
  readonly square: string;
  readonly tone: ArrowTone;
}

export interface MovingPiece {
  readonly seq: number;
  readonly from: string;
  readonly to: string;
  readonly ms: number;
}

export interface GridBoardProps {
  readonly files: number;
  readonly ranks: number;
  readonly squares: readonly BoardSquare[];
  readonly flipped: boolean;
  readonly label: string;
  readonly fileNames: readonly string[];
  readonly rankNames: readonly string[];
  readonly selected: string | null;
  /** Squares the selected piece may go to; captures show as rings. */
  readonly targets: ReadonlyMap<string, 'move' | 'capture'>;
  readonly lastMove: readonly string[];
  readonly check: string | null;
  readonly arrows: readonly BoardArrow[];
  readonly marks: readonly BoardMark[];
  /** Pieces sliding into place from the animation queue. */
  readonly moving: readonly MovingPiece[];
  /** Squares whose piece the player may pick up. */
  readonly movable: ReadonlySet<string>;
  readonly onSquare: (square: string) => void;
  readonly onDrop: (from: string, to: string) => void;
  /** Called on any touch of the board, to skip animations. */
  readonly onTouch: () => void;
  readonly overlay?: ReactNode;
  /** Extra attributes for tests, such as the position in FEN. */
  readonly dataPosition?: string;
}

const UNIT = 100;
const TONE: Record<ArrowTone, string> = { hint: '#e8c77f', threat: '#e07a5c', info: '#9fc3e8' };

export function GridBoard(props: GridBoardProps) {
  const { files, ranks, squares, flipped, label, fileNames, rankNames, selected, targets, lastMove, check, arrows, marks, moving, movable, onSquare, onDrop, onTouch, overlay, dataPosition } = props;
  const svg = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<{ from: string; x: number; y: number; moved: boolean; startX: number; startY: number; pointer: number } | null>(null);

  const place = (file: number, rank: number) => ({
    x: (flipped ? files - 1 - file : file) * UNIT,
    y: (flipped ? rank : ranks - 1 - rank) * UNIT,
  });
  const byName = new Map(squares.map((s) => [s.name, s]));
  const centre = (name: string) => {
    const s = byName.get(name);
    if (!s) return { x: 0, y: 0 };
    const p = place(s.file, s.rank);
    return { x: p.x + UNIT / 2, y: p.y + UNIT / 2 };
  };

  const toBoard = (event: ReactPointerEvent) => {
    const el = svg.current;
    const matrix = el?.getScreenCTM();
    if (!el || !matrix) return null;
    const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
    return { x: pt.x, y: pt.y };
  };
  const squareAt = (x: number, y: number): string | null => {
    const col = Math.floor(x / UNIT);
    const row = Math.floor(y / UNIT);
    if (col < 0 || row < 0 || col >= files || row >= ranks) return null;
    const file = flipped ? files - 1 - col : col;
    const rank = flipped ? row : ranks - 1 - row;
    return squares.find((s) => s.file === file && s.rank === rank)?.name ?? null;
  };

  const onPointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    onTouch();
    const p = toBoard(event);
    if (!p) return;
    const square = squareAt(p.x, p.y);
    if (!square) return;
    if (movable.has(square)) {
      svg.current?.setPointerCapture(event.pointerId);
      setDrag({ from: square, x: p.x, y: p.y, moved: false, startX: event.clientX, startY: event.clientY, pointer: event.pointerId });
    }
  };
  const onPointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!drag || drag.pointer !== event.pointerId) return;
    const p = toBoard(event);
    if (!p) return;
    const moved = drag.moved || Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY) > 6;
    setDrag({ ...drag, x: p.x, y: p.y, moved });
  };
  const onPointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    const p = toBoard(event);
    const square = p ? squareAt(p.x, p.y) : null;
    if (drag && drag.moved) {
      setDrag(null);
      if (square && square !== drag.from) onDrop(drag.from, square);
      return;
    }
    setDrag(null);
    if (square) onSquare(square);
  };
  const onKey = (event: KeyboardEvent, square: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTouch();
      onSquare(square);
    }
  };

  const movingTo = new Map(moving.map((m) => [m.to, m]));

  return (
    <svg
      ref={svg}
      className="grid-board"
      viewBox={`-14 -14 ${files * UNIT + 28} ${ranks * UNIT + 28}`}
      role="group"
      aria-label={label}
      data-position={dataPosition}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
    >
      <defs>
        <radialGradient id="gb-check">
          <stop offset="0" stopColor="#e0563b" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#e0563b" stopOpacity="0.45" />
          <stop offset="1" stopColor="#e0563b" stopOpacity="0" />
        </radialGradient>
        {(['hint', 'threat', 'info'] as const).map((tone) => (
          <marker key={tone} id={`gb-head-${tone}`} viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto-start-reverse">
            <path d="M0 0 L10 5 L0 10 Z" fill={TONE[tone]} />
          </marker>
        ))}
      </defs>
      <rect x={-14} y={-14} width={files * UNIT + 28} height={ranks * UNIT + 28} rx={14} fill="#3a2717" />
      <rect x={-6} y={-6} width={files * UNIT + 12} height={ranks * UNIT + 12} rx={6} fill="#24180e" />
      {squares.map((s) => {
        const p = place(s.file, s.rank);
        return <rect key={s.name} x={p.x} y={p.y} width={UNIT} height={UNIT} className={s.light ? 'sq sq-light' : 'sq sq-dark'} />;
      })}
      {lastMove.map((name) => {
        const s = byName.get(name);
        if (!s) return null;
        const p = place(s.file, s.rank);
        return <rect key={`last-${name}`} x={p.x} y={p.y} width={UNIT} height={UNIT} className="sq-last" />;
      })}
      {marks.map((m, i) => {
        const s = byName.get(m.square);
        if (!s) return null;
        const p = place(s.file, s.rank);
        return <rect key={`mark-${i}`} x={p.x + 4} y={p.y + 4} width={UNIT - 8} height={UNIT - 8} rx={8} fill="none" stroke={TONE[m.tone]} strokeWidth={7} />;
      })}
      {selected
        ? (() => {
            const s = byName.get(selected);
            if (!s) return null;
            const p = place(s.file, s.rank);
            return <rect x={p.x} y={p.y} width={UNIT} height={UNIT} className="sq-selected" />;
          })()
        : null}
      {check
        ? (() => {
            const s = byName.get(check);
            if (!s) return null;
            const p = place(s.file, s.rank);
            return <rect x={p.x} y={p.y} width={UNIT} height={UNIT} fill="url(#gb-check)" />;
          })()
        : null}
      {/* Coordinates, drawn inside the edge squares */}
      {fileNames.map((f, i) => {
        const p = place(i, 0);
        const light = squares.find((s) => s.file === i && s.rank === (flipped ? ranks - 1 : 0))?.light;
        const y = (ranks - 1) * UNIT;
        return (
          <text key={`f${f}`} x={p.x + UNIT - 7} y={y + UNIT - 7} textAnchor="end" className={light ? 'coord coord-on-light' : 'coord coord-on-dark'}>
            {f}
          </text>
        );
      })}
      {rankNames.map((r, i) => {
        const p = place(flipped ? files - 1 : 0, i);
        const light = squares.find((s) => s.rank === i && s.file === (flipped ? files - 1 : 0))?.light;
        return (
          <text key={`r${r}`} x={7} y={p.y + 22} className={light ? 'coord coord-on-light' : 'coord coord-on-dark'}>
            {r}
          </text>
        );
      })}
      {squares.map((s) => {
        if (!s.piece || (drag?.moved && drag.from === s.name)) return null;
        const p = place(s.file, s.rank);
        const slide = movingTo.get(s.name);
        if (slide) {
          const from = centre(slide.from);
          const to = centre(slide.to);
          const style = { '--dx': `${from.x - to.x}px`, '--dy': `${from.y - to.y}px`, '--dur': `${slide.ms}ms` } as CSSProperties;
          return (
            <g key={`p-${s.name}-${slide.seq}`} transform={`translate(${p.x} ${p.y})`}>
              <g className="piece-slide" style={style}>
                {s.piece}
              </g>
            </g>
          );
        }
        return (
          <g key={`p-${s.name}`} transform={`translate(${p.x} ${p.y})`} className="piece">
            {s.piece}
          </g>
        );
      })}
      {[...targets].map(([name, kind]) => {
        const c = centre(name);
        return kind === 'capture' ? (
          <circle key={`t-${name}`} cx={c.x} cy={c.y} r={44} fill="none" stroke="#1b120a" strokeOpacity={0.32} strokeWidth={8} />
        ) : (
          <circle key={`t-${name}`} cx={c.x} cy={c.y} r={14} fill="#1b120a" fillOpacity={0.3} />
        );
      })}
      {arrows.map((a, i) => {
        const from = centre(a.from);
        const to = centre(a.to);
        const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
        const shorten = 24 / len;
        return (
          <line
            key={`a-${i}`}
            x1={from.x}
            y1={from.y}
            x2={to.x - (to.x - from.x) * shorten}
            y2={to.y - (to.y - from.y) * shorten}
            stroke={TONE[a.tone]}
            strokeOpacity={0.88}
            strokeWidth={14}
            strokeLinecap="round"
            markerEnd={`url(#gb-head-${a.tone})`}
            pointerEvents="none"
          />
        );
      })}
      {drag?.moved
        ? (() => {
            const s = byName.get(drag.from);
            return s?.piece ? (
              <g transform={`translate(${drag.x - UNIT / 2} ${drag.y - UNIT / 2}) scale(1.08)`} pointerEvents="none" className="piece-dragged">
                {s.piece}
              </g>
            ) : null;
          })()
        : null}
      {squares.map((s) => {
        const p = place(s.file, s.rank);
        const active = movable.has(s.name) || targets.has(s.name) || selected === s.name;
        return (
          <rect
            key={`hit-${s.name}`}
            x={p.x}
            y={p.y}
            width={UNIT}
            height={UNIT}
            className="sq-hit"
            role="button"
            aria-label={s.label}
            aria-pressed={selected === s.name}
            tabIndex={active ? 0 : -1}
            onKeyDown={(e) => onKey(e, s.name)}
          />
        );
      })}
      {overlay}
    </svg>
  );
}
