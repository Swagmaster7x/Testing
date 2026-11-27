/** Small original drawings for each game, shown on the shelf and in the hub. */
import type { ReactNode } from 'react';

const CUT = '#173a2c';
const BRASS = '#d4ad66';
const DARK = '#15110c';

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

const chipNotches = Array.from({ length: 8 }, (_, i) => {
  const [x1, y1] = polar(16, 16, 8.3, i * 45 + 22.5);
  const [x2, y2] = polar(16, 16, 11.4, i * 45 + 22.5);
  return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={CUT} strokeWidth={2.6} />;
});

const starDots = [
  [16, 16] as [number, number],
  ...Array.from({ length: 6 }, (_, i) => polar(16, 16, 5.4, i * 60)),
  ...Array.from({ length: 6 }, (_, i) => polar(16, 16, 10.8, i * 60 + 30)),
].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.1} fill={i === 0 ? BRASS : 'currentColor'} />);

const GLYPHS: Record<string, ReactNode> = {
  chess: (
    <>
      <circle cx="16" cy="8.6" r="4.1" fill="currentColor" />
      <path d="M12.3 13.6h7.4l-1.2 1.7c.5 2.7 1.6 5.2 3.3 7.4H10.2c1.7-2.2 2.8-4.7 3.3-7.4z" fill="currentColor" />
      <rect x="8.6" y="23.4" width="14.8" height="3.6" rx="1.3" fill="currentColor" />
    </>
  ),
  brisca: (
    <>
      <path d="M9 5.5h14c0 5.4-2.7 9.3-7 9.9-4.3-.6-7-4.5-7-9.9z" fill="currentColor" />
      <rect x="14.9" y="15" width="2.2" height="6" fill="currentColor" />
      <path d="M10.4 26c.8-2.8 3-4.6 5.6-4.6s4.8 1.8 5.6 4.6z" fill="currentColor" />
      <path d="M11.4 8.2h9.2" stroke={BRASS} strokeWidth={1.6} strokeLinecap="round" />
    </>
  ),
  poker: (
    <>
      <circle cx="16" cy="16" r="11.4" fill="currentColor" />
      {chipNotches}
      <circle cx="16" cy="16" r="6.4" fill="none" stroke={CUT} strokeWidth={1.4} />
      <circle cx="16" cy="16" r="2.2" fill={BRASS} />
    </>
  ),
  go: (
    <>
      <path d="M5 9.5h22M5 16h22M5 22.5h22M9.5 5v22M16 5v22M22.5 5v22" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.2} />
      <circle cx="16" cy="16" r="5.1" fill={DARK} stroke="#000" strokeWidth={0.6} />
      <circle cx="14.4" cy="14.4" r="1.4" fill="#ffffff" fillOpacity={0.18} />
      <circle cx="22.5" cy="9.5" r="5.1" fill="currentColor" />
    </>
  ),
  'chinese-checkers': <>{starDots}</>,
  shogi: (
    <>
      <path d="M16 3.8l7.4 3.9 2.6 19H6l2.6-19z" fill={'#e6c99a'} />
      <path d="M12 13.5h8M16 10.5v12M12.5 18.5h7" stroke="#5a3e27" strokeWidth={1.7} strokeLinecap="round" />
    </>
  ),
  dominoes: (
    <>
      <rect x="10" y="3.5" width="12" height="25" rx="2.6" fill="currentColor" />
      <path d="M11.5 16h9" stroke={CUT} strokeWidth={1.2} />
      <circle cx="16" cy="9.75" r="1.7" fill={CUT} />
      <circle cx="13.1" cy="19.2" r="1.5" fill={CUT} />
      <circle cx="16" cy="22.25" r="1.5" fill={CUT} />
      <circle cx="18.9" cy="25.3" r="1.5" fill={CUT} />
    </>
  ),
  mahjong: (
    <>
      <rect x="8" y="3.5" width="16" height="25" rx="2.6" fill="currentColor" />
      <circle cx="16" cy="16" r="5.4" fill="none" stroke={CUT} strokeWidth={1.8} />
      <circle cx="16" cy="16" r="2.4" fill={BRASS} />
      <path d="M16 8.6v1.4M16 22v1.4M8.6 16h1.4M22 16h1.4" stroke={CUT} strokeWidth={1.2} strokeLinecap="round" />
    </>
  ),
  blackjack: (
    <>
      <rect x="5" y="5.5" width="13" height="19" rx="2" fill="currentColor" fillOpacity={0.55} transform="rotate(-10 11.5 15)" />
      <rect x="11.5" y="6.5" width="13" height="19" rx="2" fill="currentColor" stroke={CUT} strokeWidth={1.2} transform="rotate(8 18 16)" />
      <circle cx="23.2" cy="24.6" r="4.8" fill={BRASS} stroke={CUT} strokeWidth={1.2} />
      <circle cx="23.2" cy="24.6" r="2.2" fill="none" stroke={CUT} strokeWidth={1} />
    </>
  ),
  hearts: (
    <>
      <path d="M16 26.5C9 21.5 5 17.4 5 12.4 5 9 7.6 6.5 10.8 6.5c2.2 0 4 1.1 5.2 2.9 1.2-1.8 3-2.9 5.2-2.9C24.4 6.5 27 9 27 12.4c0 5-4 9.1-11 14.1z" fill="currentColor" />
      <path d="M9 12c.2-1.8 1.4-3 3.1-3.1" stroke={BRASS} strokeWidth={1.6} strokeLinecap="round" fill="none" />
    </>
  ),
  spades: (
    <>
      <path d="M16 4.5c-4.6 5-10 8.6-10 13.4 0 3 2.3 5.2 5.1 5.2 1.7 0 3.1-.7 4-2-.3 2.6-1.3 4.6-3.2 6.4h8.2c-1.9-1.8-2.9-3.8-3.2-6.4.9 1.3 2.3 2 4 2 2.8 0 5.1-2.2 5.1-5.2 0-4.8-5.4-8.4-10-13.4z" fill="currentColor" />
      <circle cx="16" cy="15.6" r="2" fill={BRASS} />
    </>
  ),
  'gin-rummy': (
    <>
      <rect x="5.5" y="8.5" width="11" height="16" rx="1.8" fill="currentColor" stroke={CUT} strokeWidth={1.2} transform="rotate(-16 11 24.5)" />
      <rect x="10.5" y="6.5" width="11" height="16" rx="1.8" fill="currentColor" stroke={CUT} strokeWidth={1.2} />
      <rect x="15.5" y="8.5" width="11" height="16" rx="1.8" fill="currentColor" stroke={CUT} strokeWidth={1.2} transform="rotate(16 21 24.5)" />
      <path d="M13.5 10.5h5" stroke={BRASS} strokeWidth={1.6} strokeLinecap="round" />
    </>
  ),
  tute: (
    <>
      <path d="M6.5 22.5L7.8 10.2l4.6 5.2L16 7.4l3.6 8 4.6-5.2 1.3 12.3z" fill="currentColor" />
      <rect x="6.5" y="23.6" width="19" height="3.2" rx="1.1" fill="currentColor" />
      <circle cx="16" cy="6.6" r="1.6" fill={BRASS} />
      <circle cx="7.7" cy="9.3" r="1.3" fill={BRASS} />
      <circle cx="24.3" cy="9.3" r="1.3" fill={BRASS} />
      <path d="M10 19.6h12" stroke={CUT} strokeWidth={1.3} strokeLinecap="round" />
    </>
  ),
  noughts: (
    <>
      <path d="M12.3 5v22M19.7 5v22M5 12.3h22M5 19.7h22" stroke="currentColor" strokeOpacity={0.5} strokeWidth={1.4} strokeLinecap="round" />
      <path d="M6.4 6.4l3.6 3.6M10 6.4l-3.6 3.6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <circle cx="16" cy="16" r="2.3" fill="none" stroke={BRASS} strokeWidth={1.8} />
      <path d="M22 22l3.6 3.6M25.6 22L22 25.6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
    </>
  ),
};

export function GameGlyph({ gameId, large = false }: { gameId: string; large?: boolean }) {
  return (
    <span className={large ? 'glyph glyph-lg' : 'glyph'} aria-hidden="true">
      <svg viewBox="0 0 32 32">{GLYPHS[gameId] ?? null}</svg>
    </span>
  );
}
