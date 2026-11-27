/**
 * The French 52-card deck, drawn for this app (PLAN.md 2.9). Faces are made to be read small, as
 * a poker table needs: a large rank and suit in the top corner and a large suit sign below. Each
 * suit has its own shape, so colour is never the only clue, and the four-colour deck (a setting:
 * spades black, hearts red, diamonds blue, clubs green) tells them apart at a glance. The colours
 * come from CSS variables (cards.css), so the setting changes every card at once.
 * Faces are SVG at 60 × 90 units, like the Spanish deck.
 */
import type { Card, Rank, Suit } from '../../games/holdem/cards';

/** A suit sign, centred on (0, 0), about 20 units tall at scale 1. */
export function FrenchSuit({ suit, x = 0, y = 0, scale = 1 }: { suit: Suit; x?: number; y?: number; scale?: number }) {
  let d: string;
  switch (suit) {
    case 'h':
      d = 'M0 9.5 C-3 6.5 -10 1.5 -10 -3.6 C-10 -7.6 -7 -10 -4.2 -10 C-2 -10 -0.6 -8.6 0 -7 C0.6 -8.6 2 -10 4.2 -10 C7 -10 10 -7.6 10 -3.6 C10 1.5 3 6.5 0 9.5 Z';
      break;
    case 'd':
      d = 'M0 -10.5 L8 0 L0 10.5 L-8 0 Z';
      break;
    case 's':
      d = 'M0 -10.5 C3 -6.5 10 -2.4 10 2.4 C10 5.6 7.6 7.4 5 7.4 C3.3 7.4 1.8 6.6 1 5.4 C1.3 7.6 2.4 9.4 4 10.5 H-4 C-2.4 9.4 -1.3 7.6 -1 5.4 C-1.8 6.6 -3.3 7.4 -5 7.4 C-7.6 7.4 -10 5.6 -10 2.4 C-10 -2.4 -3 -6.5 0 -10.5 Z';
      break;
    default:
      d =
        'M0 -10.5 A4.6 4.6 0 0 1 4 -3.6 A4.6 4.6 0 1 1 1.6 5 C1.8 7.4 2.8 9.3 4.2 10.5 H-4.2 C-2.8 9.3 -1.8 7.4 -1.6 5 A4.6 4.6 0 1 1 -4 -3.6 A4.6 4.6 0 0 1 0 -10.5 Z';
  }
  return <path d={d} className={`suit-${suit}`} transform={`translate(${x} ${y}) scale(${scale})`} />;
}

const RANK_TEXT: Readonly<Record<Rank, string>> = { '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', T: '10', J: 'J', Q: 'Q', K: 'K', A: 'A' };

/** An original emblem for the court cards: a cap for the jack, a tiara for the queen, a crown for the king. */
function Court({ rank, suit }: { rank: 'J' | 'Q' | 'K'; suit: Suit }) {
  const band = rank === 'K' ? 'M15 39 L18 27 L24 34 L30 24 L36 34 L42 27 L45 39 Z' : rank === 'Q' ? 'M16 39 C18 31 22 28 24 33 C26 27 34 27 36 33 C38 28 42 31 44 39 Z' : 'M17 39 C17 30 43 30 43 39 Z';
  return (
    <g>
      <path d={band} className={`suit-${suit}`} opacity="0.9" />
      <rect x="15" y="39" width="30" height="4" rx="1.5" className={`suit-${suit}`} opacity="0.6" />
      <FrenchSuit suit={suit} x={30} y={60} scale={1.25} />
    </g>
  );
}

export function FrenchCardFace({ card }: { card: Card }) {
  const rank = card[0] as Rank;
  const suit = card[1] as Suit;
  const text = RANK_TEXT[rank];
  const court = rank === 'J' || rank === 'Q' || rank === 'K';
  return (
    <svg viewBox="0 0 60 90" className="card-svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="59" height="89" rx="5" fill="#fbf8f1" stroke="#b9ab8e" />
      <text x={text.length > 1 ? 15 : 13} y="27" textAnchor="middle" fontSize={text.length > 1 ? 23 : 27} fontWeight="800" fontFamily="var(--font-sans)" letterSpacing={text.length > 1 ? -2 : 0} className={`suit-${suit}`}>
        {text}
      </text>
      <FrenchSuit suit={suit} x={13} y={42} scale={0.78} />
      {court ? <Court rank={rank} suit={suit} /> : <FrenchSuit suit={suit} x={38} y={62} scale={rank === 'A' ? 1.55 : 1.3} />}
    </svg>
  );
}

export function FrenchCardBack() {
  return (
    <svg viewBox="0 0 60 90" className="card-svg" aria-hidden="true">
      <rect x="0.5" y="0.5" width="59" height="89" rx="5" fill="#7a2730" stroke="#3d1218" />
      <rect x="5" y="5" width="50" height="80" rx="3" fill="none" stroke="#e7c27a" strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <path key={row} d={`M8 ${14 + row * 12} L18 ${8 + row * 12} L30 ${14 + row * 12} L42 ${8 + row * 12} L52 ${14 + row * 12}`} fill="none" stroke="#e7c27a" strokeWidth="0.8" opacity="0.55" />
      ))}
      <circle cx="30" cy="45" r="6" fill="#e7c27a" opacity="0.8" />
    </svg>
  );
}

/** A small card for logs and charts: rank and suit sign, in the deck's colours. */
export function MiniCard({ card }: { card: Card }) {
  const suit = card[1] as Suit;
  return (
    <span className="mini-card" aria-hidden="true">
      <span className={`suit-text-${suit}`}>{RANK_TEXT[card[0] as Rank]}</span>
      <svg viewBox="-11 -11 22 22" width="0.8em" height="0.8em">
        <FrenchSuit suit={suit} />
      </svg>
    </span>
  );
}
