/**
 * BoardKit intersections (PLAN.md 2.2): a board where stones go on the points where lines cross,
 * for Go now. Star points, coordinates, the last move, a ghost stone for a move waiting to be
 * confirmed, coach marks, territory shading, numbers on stones (liberty counts), atari rings,
 * and stones that drop in and fade out from the animation queue. Every point is a labelled
 * button ("D4, empty"), which screen readers and the tests use alike.
 */
import type { CSSProperties, KeyboardEvent } from 'react';
import './intersections.css';

export type StoneColor = 'black' | 'white';
export type PointTone = 'hint' | 'threat' | 'info' | 'good';

export interface IntersectionPoint {
  /** Column from the left and row from the top, from 0. */
  readonly x: number;
  readonly y: number;
  readonly stone: StoneColor | null;
  /** Read out and used by tests: "D4, black stone". */
  readonly label: string;
}

export interface PointMark {
  /** Index of the point (y * size + x). */
  readonly point: number;
  readonly tone: PointTone;
  /** A ring on the point, a dot, or a soft square over the area around it. */
  readonly shape: 'ring' | 'dot' | 'area' | 'cross';
}

export interface IntersectionBoardProps {
  readonly size: number;
  /** size × size points, row by row from the top. */
  readonly points: readonly IntersectionPoint[];
  readonly label: string;
  /** Column names from the left and row names from the top. */
  readonly columns: readonly string[];
  readonly rows: readonly string[];
  readonly stars: readonly number[];
  readonly lastMove: number | null;
  /** A stone drawn faintly: a move waiting to be confirmed. */
  readonly ghost: { readonly point: number; readonly color: StoneColor } | null;
  readonly marks: readonly PointMark[];
  /** Per point: 1 Black's, 2 White's, 0 nobody's (counting and the territory estimate). */
  readonly owners: readonly number[] | null;
  /** Per point, how sure the shading is, 0 to 1 (the estimate fades where it is unsure). */
  readonly strength?: readonly number[] | null;
  /** Stones drawn as dead: faded, with a cross. */
  readonly dead: ReadonlySet<number>;
  /** Small text on points, such as liberty counts. */
  readonly numbers: ReadonlyMap<number, string>;
  /** Stones in atari, ringed. */
  readonly atari: ReadonlySet<number>;
  /** Points that do something when tapped. */
  readonly playable: ReadonlySet<number>;
  readonly onPoint: (point: number) => void;
  /** Any touch of the board, to skip animations. */
  readonly onTouch: () => void;
  /** A stone being put down, and stones being taken off, from the animation queue. */
  readonly placing: { readonly point: number; readonly seq: number; readonly ms: number } | null;
  readonly removing: { readonly points: readonly number[]; readonly color: StoneColor; readonly seq: number; readonly ms: number } | null;
  readonly dataPosition?: string;
}

const U = 100;
/** Margins above and to the right; the coordinates sit left and below, clear of the edge stones (radius 47). */
const MT = 54;
const MR = 54;

/**
 * The coordinates' font and the left and bottom margins that hold them. Bigger boards get bigger
 * letters (in board units), so that on a phone they stay about the same size on the screen.
 */
function coordinateLayout(size: number): { readonly font: number; readonly margin: number } {
  if (size >= 17) return { font: 64, margin: 150 };
  if (size >= 12) return { font: 44, margin: 118 };
  return { font: 32, margin: 108 };
}
const TONE: Record<PointTone, string> = { hint: '#e8c77f', threat: '#e07a5c', info: '#9fc3e8', good: '#9cba84' };

function Stone({ color, cx, cy, className, style }: { color: StoneColor; cx: number; cy: number; className?: string; style?: CSSProperties }) {
  return (
    <g className={className} style={style}>
      <circle cx={cx + 3} cy={cy + 5} r={46} fill="#000" opacity={0.28} />
      <circle cx={cx} cy={cy} r={47} fill={color === 'black' ? 'url(#ib-black)' : 'url(#ib-white)'} stroke={color === 'black' ? '#000' : '#9c9486'} strokeWidth={color === 'black' ? 1 : 1.5} />
    </g>
  );
}

export function IntersectionBoard(props: IntersectionBoardProps) {
  const { size, points, label, columns, rows, stars, lastMove, ghost, marks, owners, strength, dead, numbers, atari, playable, onPoint, onTouch, placing, removing, dataPosition } = props;
  const span = (size - 1) * U;
  const at = (p: number) => ({ x: (p % size) * U, y: Math.floor(p / size) * U });
  const font = size >= 17 ? 30 : size >= 12 ? 34 : 38;
  const coords = coordinateLayout(size);
  const ML = coords.margin;
  const MB = coords.margin;
  const onKey = (event: KeyboardEvent, p: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTouch();
      onPoint(p);
    }
  };
  const lines = [];
  for (let k = 0; k < size; k++) {
    lines.push(<line key={`h${k}`} x1={0} y1={k * U} x2={span} y2={k * U} />);
    lines.push(<line key={`v${k}`} x1={k * U} y1={0} x2={k * U} y2={span} />);
  }
  const removingSet = new Set(removing?.points ?? []);

  return (
    <svg className="ib" viewBox={`${-ML} ${-MT} ${span + ML + MR} ${span + MT + MB}`} role="group" aria-label={label} data-position={dataPosition} data-size={size} onPointerDown={onTouch}>
      <defs>
        <radialGradient id="ib-black" cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor="#5d5a55" />
          <stop offset="0.45" stopColor="#25231f" />
          <stop offset="1" stopColor="#0b0a09" />
        </radialGradient>
        <radialGradient id="ib-white" cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#efe9dc" />
          <stop offset="1" stopColor="#cfc6b4" />
        </radialGradient>
        <linearGradient id="ib-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2b977" />
          <stop offset="0.55" stopColor="#d6a862" />
          <stop offset="1" stopColor="#c99a55" />
        </linearGradient>
      </defs>
      <rect x={-ML} y={-MT} width={span + ML + MR} height={span + MT + MB} rx={18} fill="url(#ib-wood)" />
      <g className="ib-lines">{lines}</g>
      {stars.map((p) => {
        // Under a territory square the star point would show through as a smudge.
        if (owners?.[p]) return null;
        const c = at(p);
        return <circle key={`s${p}`} cx={c.x} cy={c.y} r={size >= 17 ? 9 : 11} className="ib-star" />;
      })}
      {columns.map((name, x) => (
        <text key={`c${name}`} className="ib-coord" aria-hidden="true" x={x * U} y={span + MB - Math.round(coords.font * 0.75)} fontSize={coords.font} textAnchor="middle" dominantBaseline="middle">
          {name}
        </text>
      ))}
      {rows.map((name, y) => (
        <text key={`r${name}`} className="ib-coord" aria-hidden="true" x={-ML + Math.round(coords.font * 0.75) + 10} y={y * U + 2} fontSize={coords.font} textAnchor="middle" dominantBaseline="middle">
          {name}
        </text>
      ))}
      {marks
        .filter((m) => m.shape === 'area')
        .map((m, i) => {
          const c = at(m.point);
          return <rect key={`area${i}`} x={c.x - 1.5 * U} y={c.y - 1.5 * U} width={3 * U} height={3 * U} rx={40} className="ib-area" fill={TONE[m.tone]} />;
        })}
      {points.map((pt, p) => {
        const c = at(p);
        const isDead = dead.has(p);
        if (!pt.stone || removingSet.has(p)) return null;
        const dropping = placing !== null && placing.point === p;
        const style = placing !== null && placing.point === p ? ({ '--dur': `${placing.ms}ms` } as CSSProperties) : undefined;
        return <Stone key={placing !== null && dropping ? `st${p}-${placing.seq}` : `st${p}`} color={pt.stone} cx={c.x} cy={c.y} className={`ib-stone${dropping ? ' ib-drop' : ''}${isDead ? ' ib-dead' : ''}`} style={style} />;
      })}
      {removing
        ? removing.points.map((p) => {
            const c = at(p);
            return <Stone key={`rm${p}-${removing.seq}`} color={removing.color} cx={c.x} cy={c.y} className="ib-stone ib-fade" style={{ '--dur': `${removing.ms}ms` } as CSSProperties} />;
          })
        : null}
      {owners
        ? owners.map((o, p) => {
            if (!o) return null;
            const pt = points[p];
            if (pt?.stone && !dead.has(p)) return null;
            const c = at(p);
            const s = Math.max(0.25, Math.min(1, strength?.[p] ?? 1));
            // On a dead stone the square is smaller, so the stone underneath still shows.
            const half = dead.has(p) ? 15 : 17 * s + 6;
            return <rect key={`own${p}`} x={c.x - half} y={c.y - half} width={half * 2} height={half * 2} rx={4} className={o === 1 ? 'ib-own-black' : 'ib-own-white'} opacity={0.35 + 0.6 * s} />;
          })
        : null}
      {[...dead].map((p) => {
        // With the count shown, the owner's square marks a dead stone; without it, a cross does.
        if (owners) return null;
        const c = at(p);
        const black = points[p]?.stone === 'black';
        return <path key={`x${p}`} d={`M ${c.x - 20} ${c.y - 20} L ${c.x + 20} ${c.y + 20} M ${c.x + 20} ${c.y - 20} L ${c.x - 20} ${c.y + 20}`} className={black ? 'ib-cross-on-black' : 'ib-cross-on-white'} />;
      })}
      {[...atari].map((p) => {
        const c = at(p);
        return <circle key={`at${p}`} cx={c.x} cy={c.y} r={44} className="ib-atari" />;
      })}
      {lastMove !== null && points[lastMove]?.stone && !numbers.has(lastMove) ? (
        <circle cx={at(lastMove).x} cy={at(lastMove).y} r={17} className={points[lastMove]?.stone === 'black' ? 'ib-last-on-black' : 'ib-last-on-white'} />
      ) : null}
      {[...numbers].map(([p, text]) => {
        const c = at(p);
        const stone = points[p]?.stone;
        return (
          <text key={`n${p}`} x={c.x} y={c.y + 2} fontSize={font} textAnchor="middle" dominantBaseline="middle" className={p === lastMove ? 'ib-num-last' : stone === 'black' ? 'ib-num-on-black' : stone === 'white' ? 'ib-num-on-white' : 'ib-num-on-board'}>
            {text}
          </text>
        );
      })}
      {ghost ? <Stone color={ghost.color} cx={at(ghost.point).x} cy={at(ghost.point).y} className="ib-stone ib-ghost" /> : null}
      {marks
        .filter((m) => m.shape !== 'area')
        .map((m, i) => {
          const c = at(m.point);
          if (m.shape === 'dot') return <circle key={`m${i}`} cx={c.x} cy={c.y} r={16} fill={TONE[m.tone]} className="ib-mark" />;
          if (m.shape === 'cross') return <path key={`m${i}`} d={`M ${c.x - 18} ${c.y - 18} L ${c.x + 18} ${c.y + 18} M ${c.x + 18} ${c.y - 18} L ${c.x - 18} ${c.y + 18}`} stroke={TONE[m.tone]} strokeWidth={9} strokeLinecap="round" className="ib-mark" />;
          return <circle key={`m${i}`} cx={c.x} cy={c.y} r={40} fill="none" stroke={TONE[m.tone]} strokeWidth={9} className="ib-mark" />;
        })}
      {points.map((pt, p) => {
        const c = at(p);
        const active = playable.has(p);
        return (
          <rect
            key={`hit${p}`}
            x={c.x - U / 2}
            y={c.y - U / 2}
            width={U}
            height={U}
            className="ib-hit"
            role="button"
            aria-label={pt.label}
            aria-disabled={!active}
            tabIndex={active ? 0 : -1}
            onClick={() => active && onPoint(p)}
            onKeyDown={(e) => onKey(e, p)}
          />
        );
      })}
    </svg>
  );
}
