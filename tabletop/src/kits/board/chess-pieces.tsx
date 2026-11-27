/**
 * An original chess set drawn for Kibitz: plain, turned-wood shapes on a 100-unit square.
 * Each piece is a silhouette plus a few detail lines, so it reads at phone size.
 */
import type { ReactNode } from 'react';

export type PieceKind = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

const BASE = 'M24 82 H76 Q80 82 80 86 V88 Q80 92 76 92 H24 Q20 92 20 88 V86 Q20 82 24 82 Z';

const SHAPES: Record<PieceKind, { body: string[]; circles?: [number, number, number][]; details?: string[] }> = {
  p: {
    circles: [[50, 31, 11]],
    body: ['M37 47 Q37 44 40 44 H60 Q63 44 63 47 Q63 50 60 50 H40 Q37 50 37 47 Z', 'M41 50 H59 C59 61 64 71 70 82 H30 C36 71 41 61 41 50 Z', BASE],
  },
  r: {
    body: [
      'M28 18 H38 V26 H45 V18 H55 V26 H62 V18 H72 V36 L67 41 H33 L28 36 Z',
      'M33 41 H67 L64 76 H36 Z',
      'M31 76 H69 L72 82 H28 Z',
      BASE,
    ],
    details: ['M33 41 H67', 'M36 76 H64', 'M45 26 H55'],
  },
  b: {
    circles: [[50, 13, 5]],
    body: [
      'M50 18 C41 26 35 35 35 45 C35 53 41 58 50 58 C59 58 65 53 65 45 C65 35 59 26 50 18 Z',
      'M37 61 Q37 58 40 58 H60 Q63 58 63 61 Q63 64 60 64 H40 Q37 64 37 61 Z',
      'M42 64 H58 C59 71 63 77 68 82 H32 C37 77 41 71 42 64 Z',
      BASE,
    ],
    details: ['M56 31 L46 44'],
  },
  q: {
    circles: [
      [24, 29, 4],
      [37, 21, 4],
      [50, 16, 4],
      [63, 21, 4],
      [76, 29, 4],
    ],
    body: [
      'M24 30 L31 46 L37 22 L43 40 L50 18 L57 40 L63 22 L69 46 L76 30 L66 60 H34 Z',
      'M32 63 Q32 60 35 60 H65 Q68 60 68 63 Q68 66 65 66 H35 Q32 66 32 63 Z',
      'M36 66 H64 C64 72 67 77 72 82 H28 C33 77 36 72 36 66 Z',
      BASE,
    ],
    details: ['M34 60 H66'],
  },
  k: {
    body: [
      'M47 5 H53 V11 H59 V17 H53 V24 H47 V17 H41 V11 H47 Z',
      'M50 26 C62 26 70 34 70 44 C70 50 67 55 64 58 H36 C33 55 30 50 30 44 C30 34 38 26 50 26 Z',
      'M34 61 Q34 58 37 58 H63 Q66 58 66 61 Q66 64 63 64 H37 Q34 64 34 61 Z',
      'M37 64 H63 C63 71 66 77 71 82 H29 C34 77 37 71 37 64 Z',
      BASE,
    ],
    details: ['M50 30 V55', 'M38 42 C44 37 56 37 62 42'],
  },
  n: {
    body: [
      'M72 82 C73 66 74 52 70 38 C67 28 62 21 58 17 L58 8 L51 14 C44 15 38 19 33 26 C27 34 21 42 18 50 C17 54 19 58 23 59 C27 60 30 58 33 56 C36 55 40 55 42 57 C40 62 36 70 32 82 Z',
      BASE,
    ],
    circles: [],
    details: ['M65 28 C69 42 70 60 68 78', 'M33 56 C37 51 41 50 45 53'],
  },
};

const PALETTE: Record<PieceColor, { fill: string; stroke: string; detail: string }> = {
  w: { fill: '#f4ecdb', stroke: '#1d140c', detail: '#1d140c' },
  b: { fill: '#2a211b', stroke: '#0b0705', detail: '#d9c7a6' },
};

export function ChessPiece({ kind, color }: { kind: PieceKind; color: PieceColor }): ReactNode {
  const shape = SHAPES[kind];
  const c = PALETTE[color];
  return (
    <g strokeLinejoin="round" strokeLinecap="round">
      {shape.body.map((d, i) => (
        <path key={i} d={d} fill={c.fill} stroke={c.stroke} strokeWidth={3} />
      ))}
      {(shape.circles ?? []).map(([cx, cy, r], i) => (
        <circle key={`c${i}`} cx={cx} cy={cy} r={r} fill={c.fill} stroke={c.stroke} strokeWidth={3} />
      ))}
      {kind === 'n' ? (
        <>
          <circle cx={40} cy={31} r={2.8} fill={color === 'w' ? c.stroke : c.detail} />
          <circle cx={23.5} cy={52} r={1.6} fill={color === 'w' ? c.stroke : c.detail} />
        </>
      ) : null}
      {(shape.details ?? []).map((d, i) => (
        <path key={`d${i}`} d={d} fill="none" stroke={c.detail} strokeWidth={2} strokeOpacity={0.75} />
      ))}
    </g>
  );
}

export const PIECE_NAMES: Record<PieceKind, string> = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
