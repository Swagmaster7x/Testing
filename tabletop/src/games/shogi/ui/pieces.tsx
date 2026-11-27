/**
 * Shogi pieces, drawn for Kibitz on a 100-unit square: the traditional five-sided wedge, pointing
 * at the opponent, a little smaller for lesser pieces. Three faces (one kanji, two kanji, or
 * international symbols with a letter) and optional learner marks that show where a piece moves.
 * Kanji outlines come from glyphs.ts (Shippori Mincho B1, OFL); everything else is original.
 */
import type { ReactNode } from 'react';
import { GLYPHS } from './glyphs';

export type PieceStyle = 'kanji1' | 'kanji2' | 'symbols';

// Types follow core.ts: P L N S G B R K, then +P +L +N +S +B +R.
const ONE_KANJI: readonly string[] = ['歩', '香', '桂', '銀', '金', '角', '飛', '玉', 'と', '杏', '圭', '全', '馬', '龍'];
const TWO_KANJI: readonly string[] = ['歩兵', '香車', '桂馬', '銀将', '金将', '角行', '飛車', '玉将', 'と金', '成香', '成桂', '成銀', '龍馬', '龍王'];
const LETTER: readonly string[] = ['P', 'L', 'N', 'S', 'G', 'B', 'R', 'K', 'P', 'L', 'N', 'S', 'B', 'R'];
/** Relative size of each piece, as in a real set. */
const SIZE: readonly number[] = [0.82, 0.85, 0.87, 0.9, 0.9, 0.94, 0.94, 0.98, 0.82, 0.85, 0.87, 0.9, 0.94, 0.94];

const INK = '#1c130b';
const RED = '#b0281c';

// Movement as seen by the piece's owner: [dx, dy] steps (dy < 0 is forward) and slide directions.
type Dir = readonly [number, number];
const GOLD_STEPS: readonly Dir[] = [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1]];
const STEPS: readonly (readonly Dir[])[] = [
  [[0, -1]],
  [],
  [],
  [[0, -1], [-1, -1], [1, -1], [-1, 1], [1, 1]],
  GOLD_STEPS,
  [],
  [],
  [[0, -1], [-1, -1], [1, -1], [-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1]],
  GOLD_STEPS,
  GOLD_STEPS,
  GOLD_STEPS,
  GOLD_STEPS,
  [[0, -1], [-1, 0], [1, 0], [0, 1]],
  [[-1, -1], [1, -1], [-1, 1], [1, 1]],
];
const DIAGONALS: readonly Dir[] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
const ORTHOGONALS: readonly Dir[] = [[0, -1], [-1, 0], [1, 0], [0, 1]];
const SLIDES: readonly (readonly Dir[])[] = [[], [[0, -1]], [], [], [], DIAGONALS, ORTHOGONALS, [], [], [], [], [], DIAGONALS, ORTHOGONALS];

export const isPromotedType = (type: number): boolean => type >= 8;

function pentagon(size: number): string {
  const w = 72 * size;
  const h = 88 * size;
  const top = 50 - h / 2;
  const bottom = 50 + h / 2;
  const shoulder = top + h * 0.24;
  return `M50 ${top} L${50 + w * 0.4} ${shoulder} L${50 + w / 2} ${bottom} L${50 - w / 2} ${bottom} L${50 - w * 0.4} ${shoulder} Z`;
}

function Glyph({ ch, x, y, size, color }: { ch: string; x: number; y: number; size: number; color: string }) {
  const d = GLYPHS[ch];
  if (!d) return null;
  const s = size / 100;
  return <path d={d} fill={color} transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`} />;
}

/** A movement diagram: dots for steps, lines for slides, as on the international face. */
function Diagram({ type, cx, cy, scale, color }: { type: number; cx: number; cy: number; scale: number; color: string }) {
  const step = 12 * scale;
  return (
    <g>
      {(SLIDES[type] ?? []).map(([dx, dy], i) => (
        <line key={`s${i}`} x1={cx} y1={cy} x2={cx + dx * step * 1.9} y2={cy + dy * step * 1.9} stroke={color} strokeWidth={5 * scale} strokeLinecap="round" />
      ))}
      {(STEPS[type] ?? []).map(([dx, dy], i) => (
        <circle key={`d${i}`} cx={cx + dx * step} cy={cy + dy * step} r={4.6 * scale} fill={color} />
      ))}
      {type === 2 ? (
        <>
          <circle cx={cx - step} cy={cy - 2 * step} r={4.6 * scale} fill={color} />
          <circle cx={cx + step} cy={cy - 2 * step} r={4.6 * scale} fill={color} />
        </>
      ) : null}
      {type === 1 || type === 6 || type === 5 || type === 12 || type === 13 ? null : <circle cx={cx} cy={cy} r={2.6 * scale} fill={color} opacity={0.55} />}
    </g>
  );
}

/** Learner marks: small ticks at the piece's edge for each direction it can move. */
function Marks({ type, size }: { type: number; size: number }) {
  const r = 36 * size;
  const cx = 50;
  const cy = 54;
  const out: ReactNode[] = [];
  (STEPS[type] ?? []).forEach(([dx, dy], i) => {
    const len = Math.hypot(dx, dy);
    out.push(<circle key={`m${i}`} cx={cx + (dx / len) * r} cy={cy + (dy / len) * r * 0.92} r={3.4} fill="#2e6f9e" />);
  });
  (SLIDES[type] ?? []).forEach(([dx, dy], i) => {
    const len = Math.hypot(dx, dy);
    const x = cx + (dx / len) * r;
    const y = cy + (dy / len) * r * 0.92;
    out.push(<line key={`l${i}`} x1={x - (dx / len) * 6} y1={y - (dy / len) * 6} x2={x + (dx / len) * 4} y2={y + (dy / len) * 4} stroke="#2e6f9e" strokeWidth={4} strokeLinecap="round" />);
  });
  if (type === 2) {
    out.push(<circle key="k1" cx={cx - 17} cy={cy - r * 0.95} r={3.4} fill="#2e6f9e" />, <circle key="k2" cx={cx + 17} cy={cy - r * 0.95} r={3.4} fill="#2e6f9e" />);
  }
  return <g>{out}</g>;
}

export interface ShogiPieceProps {
  readonly type: number;
  /** The seat that owns it: 0 Black, 1 White. */
  readonly seat: number;
  /** True when the piece points down the screen (the far side's pieces). */
  readonly down: boolean;
  readonly style: PieceStyle;
  readonly marks: boolean;
}

export function ShogiPiece({ type, seat, down, style, marks }: ShogiPieceProps): ReactNode {
  const size = SIZE[type] ?? 0.9;
  const promoted = isPromotedType(type);
  const color = promoted ? RED : INK;
  let face: ReactNode;
  if (style === 'symbols') {
    face = (
      <g>
        <Diagram type={type} cx={50} cy={46} scale={size} color={color} />
        <text x={50} y={50 + 36 * size} textAnchor="middle" fontSize={22 * size} fontWeight={700} fill={color} fontFamily="Inter Variable, Inter, system-ui, sans-serif">
          {promoted ? `+${LETTER[type]}` : LETTER[type]}
        </text>
      </g>
    );
  } else if (style === 'kanji2') {
    const word = type === 7 && seat === 1 ? '王将' : (TWO_KANJI[type] ?? '');
    const g = 34 * size;
    face = (
      <g>
        <Glyph ch={word[0] ?? ''} x={50} y={52 - g * 0.5} size={g} color={color} />
        <Glyph ch={word[1] ?? ''} x={50} y={52 + g * 0.5} size={g} color={color} />
      </g>
    );
  } else {
    const ch = type === 7 && seat === 1 ? '王' : (ONE_KANJI[type] ?? '');
    face = <Glyph ch={ch} x={50} y={56} size={54 * size} color={color} />;
  }
  return (
    <g transform={down ? 'rotate(180 50 50)' : undefined}>
      <path d={pentagon(size)} fill="url(#shogi-wood)" stroke="#5e4022" strokeWidth={2.4} strokeLinejoin="round" />
      <path d={pentagon(size)} fill="none" stroke="#fff6dc" strokeOpacity={0.45} strokeWidth={1} transform="translate(0 1.2)" />
      {face}
      {marks ? <Marks type={type} size={size} /> : null}
    </g>
  );
}

/** The wood gradient pieces use; put once inside each SVG that draws pieces. */
export function PieceDefs() {
  return (
    <defs>
      <linearGradient id="shogi-wood" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stopColor="#f6e2b4" />
        <stop offset="1" stopColor="#e2bf7c" />
      </linearGradient>
    </defs>
  );
}
