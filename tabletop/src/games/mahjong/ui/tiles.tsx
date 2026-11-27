/**
 * Mahjong tile art, drawn for this app (PLAN.md 2.9): ivory faces with a green back showing at
 * the base, dots as coins, bamboo as jointed sticks, a bird for the one of bamboo, and the
 * Chinese characters traced from an open-licence font (glyphs.ts). Every face is a 60 by 80 box.
 * The learner overlay adds a small badge with the tile's number and suit letter, or its letters.
 */
import type { Kind } from '../core/tiles';
import { isBonus, isFlower, rankOf, suitOf, WHITE, GREEN, RED } from '../core/tiles';
import { GLYPHS } from './glyphs';

const INK = '#1f2340';
const RED_INK = '#b0281f';
const GREEN_INK = '#2c6a3a';
const BLUE_INK = '#1f4f8f';
const FACE = '#f7f1e3';
const EDGE = '#bfae8c';
const BACK = '#1f4d3d';

const NUMERALS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];
const WIND_GLYPHS = ['東', '南', '西', '北'];
const FLOWER_GLYPHS = ['梅', '蘭', '菊', '竹'];
const SEASON_GLYPHS = ['春', '夏', '秋', '冬'];

/** A traced character drawn into a box (x, y, size) in the face's units. */
function Glyph({ ch, x, y, size, fill }: { ch: string; x: number; y: number; size: number; fill: string }) {
  const d = GLYPHS[ch];
  if (!d) return null;
  return <path d={d} fill={fill} transform={`translate(${x} ${y}) scale(${size / 100})`} />;
}

/** A coin: a ring of colour round an ivory centre with a dot. */
function Coin({ cx, cy, r, colour, big = false }: { cx: number; cy: number; r: number; colour: string; big?: boolean }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={colour} />
      <circle cx={cx} cy={cy} r={r * 0.68} fill={FACE} />
      <circle cx={cx} cy={cy} r={r * (big ? 0.46 : 0.36)} fill={colour} />
      {big ? <circle cx={cx} cy={cy} r={r * 0.2} fill={FACE} /> : null}
    </g>
  );
}

const DOT_LAYOUT: Readonly<Record<number, readonly (readonly [number, number, string])[]>> = {
  2: [
    [30, 24, GREEN_INK],
    [30, 56, BLUE_INK],
  ],
  3: [
    [16, 18, BLUE_INK],
    [30, 40, RED_INK],
    [44, 62, GREEN_INK],
  ],
  4: [
    [18, 24, BLUE_INK],
    [42, 24, GREEN_INK],
    [18, 56, GREEN_INK],
    [42, 56, BLUE_INK],
  ],
  5: [
    [17, 19, BLUE_INK],
    [43, 19, GREEN_INK],
    [30, 40, RED_INK],
    [17, 61, GREEN_INK],
    [43, 61, BLUE_INK],
  ],
  6: [
    [19, 16, GREEN_INK],
    [41, 16, GREEN_INK],
    [19, 42, RED_INK],
    [41, 42, RED_INK],
    [19, 63, RED_INK],
    [41, 63, RED_INK],
  ],
  7: [
    [15, 13, GREEN_INK],
    [30, 21, GREEN_INK],
    [45, 29, GREEN_INK],
    [19, 47, RED_INK],
    [41, 47, RED_INK],
    [19, 65, RED_INK],
    [41, 65, RED_INK],
  ],
  8: [
    [19, 12, BLUE_INK],
    [41, 12, BLUE_INK],
    [19, 30, BLUE_INK],
    [41, 30, BLUE_INK],
    [19, 49, BLUE_INK],
    [41, 49, BLUE_INK],
    [19, 67, BLUE_INK],
    [41, 67, BLUE_INK],
  ],
  9: [
    [14, 16, BLUE_INK],
    [30, 16, BLUE_INK],
    [46, 16, BLUE_INK],
    [14, 40, RED_INK],
    [30, 40, RED_INK],
    [46, 40, RED_INK],
    [14, 64, GREEN_INK],
    [30, 64, GREEN_INK],
    [46, 64, GREEN_INK],
  ],
};

const DOT_RADIUS: Readonly<Record<number, number>> = { 2: 11, 3: 9.5, 4: 10, 5: 9, 6: 8.5, 7: 7.6, 8: 7.6, 9: 7.4 };

function Dots({ n, red = false }: { n: number; red?: boolean }) {
  if (n === 1) {
    return (
      <g>
        <circle cx={30} cy={40} r={22} fill={GREEN_INK} />
        <circle cx={30} cy={40} r={18.5} fill={FACE} />
        <circle cx={30} cy={40} r={15} fill={RED_INK} />
        <circle cx={30} cy={40} r={11.5} fill={FACE} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <circle key={a} cx={30 + Math.cos((a * Math.PI) / 180) * 7} cy={40 + Math.sin((a * Math.PI) / 180) * 7} r={2.1} fill={BLUE_INK} />
        ))}
        <circle cx={30} cy={40} r={3} fill={RED_INK} />
      </g>
    );
  }
  const r = DOT_RADIUS[n] ?? 8;
  return (
    <g>
      {(DOT_LAYOUT[n] ?? []).map(([cx, cy, colour], i) => (
        <Coin key={i} cx={cx} cy={cy} r={r} colour={red ? RED_INK : colour} />
      ))}
    </g>
  );
}

/** A bamboo stick standing at (x, y) as its centre, `h` tall. */
function Stick({ x, y, h, colour, w = 7 }: { x: number; y: number; h: number; colour: string; w?: number }) {
  const top = y - h / 2;
  return (
    <g>
      <rect x={x - w / 2} y={top} width={w} height={h} rx={w / 2} fill={colour} />
      <rect x={x - w * 0.14} y={top + 1.5} width={w * 0.28} height={h - 3} rx={w * 0.14} fill={FACE} opacity={0.55} />
      <line x1={x - w / 2} y1={y} x2={x + w / 2} y2={y} stroke={FACE} strokeWidth={1.4} />
      <line x1={x - w / 2} y1={top + h * 0.18} x2={x + w / 2} y2={top + h * 0.18} stroke={FACE} strokeWidth={1} opacity={0.8} />
      <line x1={x - w / 2} y1={top + h * 0.82} x2={x + w / 2} y2={top + h * 0.82} stroke={FACE} strokeWidth={1} opacity={0.8} />
    </g>
  );
}

type StickPlace = readonly [number, number, string];
const G = GREEN_INK;
const R = RED_INK;
const B = BLUE_INK;

const BAMBOO_LAYOUT: Readonly<Record<number, { readonly h: number; readonly w?: number; readonly sticks: readonly StickPlace[] }>> = {
  2: {
    h: 26,
    sticks: [
      [30, 24, G],
      [30, 56, B],
    ],
  },
  3: {
    h: 26,
    sticks: [
      [30, 23, G],
      [19, 57, B],
      [41, 57, B],
    ],
  },
  4: {
    h: 26,
    sticks: [
      [19, 23, B],
      [41, 23, G],
      [19, 57, G],
      [41, 57, B],
    ],
  },
  5: {
    h: 26,
    sticks: [
      [16, 23, G],
      [44, 23, B],
      [30, 40, R],
      [16, 57, B],
      [44, 57, G],
    ],
  },
  6: {
    h: 26,
    sticks: [
      [15, 23, G],
      [30, 23, G],
      [45, 23, G],
      [15, 57, B],
      [30, 57, B],
      [45, 57, B],
    ],
  },
  7: {
    h: 19,
    sticks: [
      [30, 15, R],
      [15, 40, G],
      [30, 40, G],
      [45, 40, G],
      [15, 64, G],
      [30, 64, G],
      [45, 64, G],
    ],
  },
  8: {
    h: 26,
    w: 6,
    sticks: [
      [12, 23, G],
      [24, 23, G],
      [36, 23, G],
      [48, 23, G],
      [12, 57, B],
      [24, 57, B],
      [36, 57, B],
      [48, 57, B],
    ],
  },
  9: {
    h: 19,
    sticks: [
      [15, 16, G],
      [30, 16, R],
      [45, 16, B],
      [15, 40, G],
      [30, 40, R],
      [45, 40, B],
      [15, 64, G],
      [30, 64, R],
      [45, 64, B],
    ],
  },
};

/** The one of bamboo: a small bird on a stem, drawn for this app. */
function Bird() {
  return (
    <g>
      <path d="M30 70 C29 60 31 52 30 46" stroke={GREEN_INK} strokeWidth={2.4} fill="none" strokeLinecap="round" />
      <path d="M30 60 C24 58 20 60 17 64 C22 64 26 63 30 60 Z" fill={GREEN_INK} />
      <path d="M30 54 C36 51 40 52 44 55 C39 57 34 57 30 54 Z" fill={GREEN_INK} />
      <path d="M16 30 C9 26 6 36 12 42 C14 36 17 33 21 32 Z" fill={BLUE_INK} />
      <ellipse cx={29} cy={36} rx={13} ry={9.5} fill={GREEN_INK} />
      <path d="M22 33 C27 29 34 29 38 33 C33 35 27 36 22 33 Z" fill={BLUE_INK} opacity={0.85} />
      <circle cx={40} cy={26} r={6.5} fill={GREEN_INK} />
      <circle cx={41.6} cy={24.8} r={1.6} fill={FACE} />
      <circle cx={41.8} cy={24.9} r={0.8} fill={INK} />
      <path d="M46 26 L52 28 L46 29 Z" fill={RED_INK} />
      <path d="M37 20 C38 15 42 13 45 15 C42 16 40 18 39.5 21 Z" fill={RED_INK} />
      <path d="M25 44 L23 49 M31 45 L31 50" stroke={RED_INK} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

function Bamboo({ n, red = false }: { n: number; red?: boolean }) {
  if (n === 1) return <Bird />;
  const layout = BAMBOO_LAYOUT[n];
  if (!layout) return null;
  return (
    <g>
      {layout.sticks.map(([x, y, colour], i) => (
        <Stick key={i} x={x} y={y} h={layout.h} colour={red ? RED_INK : colour} w={layout.w} />
      ))}
    </g>
  );
}

/** A five-petalled flower, the mark on the flower and season tiles. */
function Blossom({ x, y, r, colour }: { x: number; y: number; r: number; colour: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x + Math.cos(((a - 90) * Math.PI) / 180) * r * 0.55} cy={y + Math.sin(((a - 90) * Math.PI) / 180) * r * 0.55} r={r * 0.45} fill={colour} />
      ))}
      <circle cx={x} cy={y} r={r * 0.3} fill="#e0a92c" />
    </g>
  );
}

/** The short code shown by the learner overlay: "3C", "5D", "7B", "E", "Rd", "F1", "S1". */
export function learnerCode(kind: Kind): string {
  const suit = suitOf(kind);
  if (suit < 3) return `${rankOf(kind)}${'CDB'[suit] ?? ''}`;
  if (isBonus(kind)) return `${isFlower(kind) ? 'F' : 'S'}${rankOf(kind)}`;
  if (kind === WHITE) return 'Wd';
  if (kind === GREEN) return 'Gd';
  if (kind === RED) return 'Rd';
  return ['E', 'S', 'W', 'N'][kind - 27] ?? '';
}

function Art({ kind, red = false }: { kind: Kind; red?: boolean }) {
  const suit = suitOf(kind);
  const n = rankOf(kind);
  if (suit === 0) {
    return (
      <g>
        <Glyph ch={NUMERALS[n - 1] ?? ''} x={13} y={5} size={34} fill={red ? RED_INK : INK} />
        <Glyph ch="萬" x={11} y={36} size={38} fill={RED_INK} />
      </g>
    );
  }
  if (suit === 1) return <Dots n={n} red={red} />;
  if (suit === 2) return <Bamboo n={n} red={red} />;
  if (kind >= 27 && kind <= 30) return <Glyph ch={WIND_GLYPHS[kind - 27] ?? ''} x={6} y={16} size={48} fill={INK} />;
  if (kind === RED) return <Glyph ch="中" x={5} y={15} size={50} fill={RED_INK} />;
  if (kind === GREEN) return <Glyph ch="發" x={5} y={15} size={50} fill={GREEN_INK} />;
  if (kind === WHITE) {
    return (
      <g fill="none" stroke={BLUE_INK}>
        <rect x={11} y={13} width={38} height={54} rx={3} strokeWidth={3.2} />
        <rect x={17} y={19} width={26} height={42} rx={2} strokeWidth={1.6} />
      </g>
    );
  }
  if (isBonus(kind)) {
    const flower = isFlower(kind);
    const colour = flower ? '#8a2f5f' : '#1f5f7a';
    const glyph = (flower ? FLOWER_GLYPHS : SEASON_GLYPHS)[n - 1] ?? '';
    return (
      <g>
        <Blossom x={16} y={17} r={9} colour={flower ? '#c2557f' : '#4f93b5'} />
        <text x={47} y={23} textAnchor="middle" fontSize={17} fontWeight={700} fill={colour} fontFamily="Inter Variable, Inter, sans-serif">
          {n}
        </text>
        <Glyph ch={glyph} x={11} y={32} size={38} fill={colour} />
      </g>
    );
  }
  return null;
}

/** The face of a tile, filling its box. `learner` adds the number and letters badge; `red` draws a red five. */
export function TileFace({ kind, learner = false, red = false }: { kind: Kind; learner?: boolean; red?: boolean }) {
  const code = learnerCode(kind);
  return (
    <svg className="mj-svg" viewBox="0 0 60 80" preserveAspectRatio="none" aria-hidden="true">
      <rect x={0.8} y={0.8} width={58.4} height={78.4} rx={7} fill={BACK} />
      <rect x={0.8} y={0.8} width={58.4} height={74.4} rx={7} fill={FACE} stroke={EDGE} strokeWidth={1.4} />
      <Art kind={kind} red={red} />
      {learner ? (
        <g>
          <path d="M1.5 52 H58.5 V68 Q58.5 74.5 52 74.5 H8 Q1.5 74.5 1.5 68 Z" fill={red ? RED_INK : INK} opacity={0.86} />
          <text x={30} y={70} textAnchor="middle" fontSize={21} fontWeight={750} fill="#fff" fontFamily="Inter Variable, Inter, sans-serif" letterSpacing={0.5}>
            {code}
          </text>
        </g>
      ) : null}
    </svg>
  );
}

export function TileBack() {
  return (
    <svg className="mj-svg" viewBox="0 0 60 80" preserveAspectRatio="none" aria-hidden="true">
      <rect x={0.8} y={0.8} width={58.4} height={78.4} rx={7} fill={FACE} />
      <rect x={0.8} y={0.8} width={58.4} height={75.4} rx={7} fill={BACK} stroke="#163a2e" strokeWidth={1.4} />
      <rect x={8} y={8} width={44} height={61} rx={4} fill="none" stroke="#c9a25a" strokeOpacity={0.45} strokeWidth={1.6} />
      <path d="M30 26 L38 38.5 L30 51 L22 38.5 Z" fill="#c9a25a" fillOpacity={0.6} />
    </svg>
  );
}
