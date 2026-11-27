/**
 * The Spanish 40-card deck, drawn for this app (PLAN.md 2.9): oros, copas, espadas and bastos
 * with large corner indices. Each suit has its own shape and colour, and the frame line is broken
 * the traditional way (no break for oros, one for copas, two for espadas, three for bastos), so a
 * suit never depends on colour alone. Faces are SVG at 60 × 90 units.
 */
import type { ReactNode } from 'react';

export type SpanishSuit = 'o' | 'c' | 'e' | 'b';
export type SpanishRank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | 'S' | 'C' | 'R';

export const SUIT_COLOUR: Readonly<Record<SpanishSuit, string>> = {
  o: '#b8860b',
  c: '#b3352b',
  e: '#2f5d8c',
  b: '#3d7a3a',
};

/** The number printed on the card: Sota 10, Caballo 11, Rey 12. */
export const RANK_NUMBER: Readonly<Record<SpanishRank, string>> = { A: '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', S: '10', C: '11', R: '12' };

/** One suit sign, centred on (0, 0), about 20 units tall at scale 1. */
export function SuitSign({ suit, x = 0, y = 0, scale = 1 }: { suit: SpanishSuit; x?: number; y?: number; scale?: number }) {
  const colour = SUIT_COLOUR[suit];
  let body: ReactNode;
  switch (suit) {
    case 'o': // A gold coin with a rim and a sun at its centre.
      body = (
        <>
          <circle r="9" fill={colour} stroke="#7a5a0a" strokeWidth="1" />
          <circle r="6.4" fill="none" stroke="#f3dd8a" strokeWidth="1.1" />
          <circle r="2.4" fill="#f3dd8a" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <rect key={a} x="-0.6" y="-5.2" width="1.2" height="1.8" fill="#f3dd8a" transform={`rotate(${a})`} />
          ))}
        </>
      );
      break;
    case 'c': // A goblet: bowl, knot, stem and foot.
      body = (
        <>
          <path d="M-8 -9 H8 C8 -2 4 1 0 1 C-4 1 -8 -2 -8 -9 Z" fill={colour} stroke="#6e1c16" strokeWidth="0.9" />
          <path d="M-6.5 -7.5 H6.5" stroke="#f0c7bf" strokeWidth="1" />
          <circle cy="2.6" r="1.8" fill={colour} stroke="#6e1c16" strokeWidth="0.7" />
          <rect x="-1" y="3.6" width="2" height="3" fill={colour} />
          <path d="M-5.5 9.5 C-5 7 -2.5 6.4 0 6.4 C2.5 6.4 5 7 5.5 9.5 Z" fill={colour} stroke="#6e1c16" strokeWidth="0.9" />
        </>
      );
      break;
    case 'e': // A straight sword: blade, cross-guard, grip and pommel.
      body = (
        <>
          <path d="M0 -11 L2 -7 V4 H-2 V-7 Z" fill="#c9d6e3" stroke={colour} strokeWidth="0.9" />
          <path d="M0 -8 V3.5" stroke={colour} strokeWidth="0.6" />
          <rect x="-6.5" y="4" width="13" height="2.2" rx="1" fill={colour} />
          <rect x="-1.2" y="6.2" width="2.4" height="3.6" fill="#6b4a2b" />
          <circle cy="10.8" r="1.6" fill={colour} />
        </>
      );
      break;
    case 'b': // A knotted cudgel, wider at the head.
      body = (
        <>
          <path d="M-2.4 10.5 L-4.6 -6.5 C-4.6 -10.5 4.6 -10.5 4.6 -6.5 L2.4 10.5 Z" fill="#8a5a2e" stroke={colour} strokeWidth="1.1" />
          <circle cx="-2.6" cy="-4" r="1.3" fill={colour} />
          <circle cx="2.2" cy="-1" r="1.3" fill={colour} />
          <circle cx="-1.6" cy="3" r="1.1" fill={colour} />
          <circle cx="1.4" cy="6.5" r="1" fill={colour} />
          <path d="M-3 -8.5 L3 -8.5" stroke="#c99a62" strokeWidth="0.8" />
        </>
      );
      break;
  }
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>{body}</g>;
}

/** The frame with the traditional breaks that name the suit. */
function Pinta({ suit }: { suit: SpanishSuit }) {
  const breaks = { o: 0, c: 1, e: 2, b: 3 }[suit];
  const colour = SUIT_COLOUR[suit];
  const top = 9;
  const bottom = 81;
  // The breaks sit on the top and bottom edges of the frame.
  const segments: [number, number][] = [];
  if (breaks === 0) segments.push([6, 54]);
  else {
    const gap = 3;
    const span = 48 - breaks * gap;
    const piece = span / (breaks + 1);
    let x = 6;
    for (let i = 0; i <= breaks; i++) {
      segments.push([x, x + piece]);
      x += piece + gap;
    }
  }
  return (
    <g stroke={colour} strokeWidth="1.1" fill="none">
      <path d={`M6 ${top} V${bottom} M54 ${top} V${bottom}`} />
      {segments.map(([a, b]) => (
        <path key={`t${a}`} d={`M${a} ${top} H${b} M${a} ${bottom} H${b}`} />
      ))}
    </g>
  );
}

/** Pip positions for 1 to 7, inside the frame. */
const PIPS: Readonly<Record<string, readonly [number, number][]>> = {
  A: [[30, 45]],
  '2': [[30, 28], [30, 62]],
  '3': [[30, 24], [30, 45], [30, 66]],
  '4': [[21, 28], [39, 28], [21, 62], [39, 62]],
  '5': [[21, 26], [39, 26], [30, 45], [21, 64], [39, 64]],
  '6': [[21, 24], [39, 24], [21, 45], [39, 45], [21, 66], [39, 66]],
  '7': [[21, 22], [39, 22], [30, 34], [21, 46], [39, 46], [21, 68], [39, 68]],
};

/** An original, simple figure for the Sota (page), Caballo (knight) and Rey (king). */
function Figure({ rank, suit }: { rank: 'S' | 'C' | 'R'; suit: SpanishSuit }) {
  const colour = SUIT_COLOUR[suit];
  const robe = rank === 'R' ? '#7b3f6e' : rank === 'C' ? '#4b6b8a' : '#8a6a3a';
  return (
    <g>
      {rank === 'C' ? (
        // A horse's head and neck behind the rider.
        <path d="M17 70 C14 58 16 47 24 42 C21 39 20 35 23 33 L29 36 C33 37 35 41 34 46 L31 70 Z" fill="#c4a27a" stroke="#5b4026" strokeWidth="0.8" />
      ) : null}
      <circle cx="34" cy={rank === 'C' ? 26 : 25} r="6" fill="#f0d9bd" stroke="#5b4026" strokeWidth="0.8" />
      {rank === 'R' ? <path d="M27.5 20 L29 14 L31.5 18 L34 13 L36.5 18 L39 14 L40.5 20 Z" fill="#d9b13b" stroke="#7a5a0a" strokeWidth="0.7" /> : null}
      {rank === 'S' ? <path d="M28 21 C29 16 39 16 40 21 Z" fill={colour} /> : null}
      <path d={`M25 ${rank === 'C' ? 33 : 32} C25 31 43 31 43 ${rank === 'C' ? 33 : 32} L46 70 H22 Z`} fill={robe} stroke="#3b2a1a" strokeWidth="0.8" />
      <path d="M27 44 H41" stroke="#e8d2a2" strokeWidth="1.2" />
      <SuitSign suit={suit} x={rank === 'R' ? 22 : 44} y={52} scale={0.55} />
    </g>
  );
}

function Index({ rank, suit, flip = false }: { rank: SpanishRank; suit: SpanishSuit; flip?: boolean }) {
  return (
    <g transform={flip ? 'rotate(180 30 45)' : undefined}>
      <text x="9.5" y="20" textAnchor="middle" fontSize="12.5" fontWeight="800" fontFamily="var(--font-sans)" fill={SUIT_COLOUR[suit]}>
        {RANK_NUMBER[rank]}
      </text>
      <SuitSign suit={suit} x={9.5} y={29} scale={0.32} />
    </g>
  );
}

export function SpanishCardFace({ rank, suit }: { rank: SpanishRank; suit: SpanishSuit }) {
  return (
    <svg viewBox="0 0 60 90" className="card-svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="59" height="89" rx="5" fill="#f6efdf" stroke="#b9ab8e" />
      <Pinta suit={suit} />
      <Index rank={rank} suit={suit} />
      <Index rank={rank} suit={suit} flip />
      {rank === 'S' || rank === 'C' || rank === 'R' ? (
        <Figure rank={rank} suit={suit} />
      ) : (
        (PIPS[rank] ?? []).map(([x, y], i) => <SuitSign key={i} suit={suit} x={x} y={y} scale={rank === 'A' ? 1.35 : 0.6} />)
      )}
    </svg>
  );
}

export function CardBack() {
  return (
    <svg viewBox="0 0 60 90" className="card-svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="59" height="89" rx="5" fill="#2b4a3c" stroke="#16261f" />
      <rect x="5" y="5" width="50" height="80" rx="3" fill="none" stroke="#c9a25a" strokeWidth="1" />
      <path d="M30 14 L46 45 L30 76 L14 45 Z" fill="none" stroke="#c9a25a" strokeWidth="1" />
      <path d="M30 24 L41 45 L30 66 L19 45 Z" fill="#c9a25a" opacity="0.35" />
      <circle cx="30" cy="45" r="4" fill="#c9a25a" />
    </svg>
  );
}
