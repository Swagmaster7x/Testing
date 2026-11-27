/**
 * Domino tile art, drawn here (PLAN.md 2.9: original vector art). A tile is drawn lying flat,
 * twice as wide as it is tall, low number on the left; the table turns it to lie as it must.
 * Pips follow the usual patterns, and each number has its own colour as on many double-six and
 * double-nine sets; the count is always readable without the colour. Seven to nine (the double
 * nine) build on the six: a middle pip for seven, two middles for eight, a three-by-three for nine.
 */

/** Pip centres in a unit square, for 0 to 9. */
const SPOTS: Readonly<Record<number, readonly (readonly [number, number])[]>> = {
  0: [],
  1: [[0.5, 0.5]],
  2: [
    [0.27, 0.27],
    [0.73, 0.73],
  ],
  3: [
    [0.25, 0.25],
    [0.5, 0.5],
    [0.75, 0.75],
  ],
  4: [
    [0.27, 0.27],
    [0.73, 0.27],
    [0.27, 0.73],
    [0.73, 0.73],
  ],
  5: [
    [0.25, 0.25],
    [0.75, 0.25],
    [0.5, 0.5],
    [0.25, 0.75],
    [0.75, 0.75],
  ],
  6: [
    [0.25, 0.22],
    [0.5, 0.22],
    [0.75, 0.22],
    [0.25, 0.78],
    [0.5, 0.78],
    [0.75, 0.78],
  ],
  7: [
    [0.2, 0.2],
    [0.5, 0.2],
    [0.8, 0.2],
    [0.5, 0.5],
    [0.2, 0.8],
    [0.5, 0.8],
    [0.8, 0.8],
  ],
  8: [
    [0.2, 0.2],
    [0.5, 0.2],
    [0.8, 0.2],
    [0.2, 0.5],
    [0.8, 0.5],
    [0.2, 0.8],
    [0.5, 0.8],
    [0.8, 0.8],
  ],
  9: [
    [0.2, 0.2],
    [0.5, 0.2],
    [0.8, 0.2],
    [0.2, 0.5],
    [0.5, 0.5],
    [0.8, 0.5],
    [0.2, 0.8],
    [0.5, 0.8],
    [0.8, 0.8],
  ],
};

/** One colour per number, all dark enough to read on the ivory face. */
export const PIP_COLOURS: readonly string[] = ['#000', '#17667e', '#2c6e2f', '#a8261d', '#6e4219', '#23408c', '#5a2a82', '#7a5800', '#8a1c5c', '#333'];

/** Pip size: smaller as the pips crowd. */
const RADIUS = (n: number) => (n >= 7 ? 7.6 : n === 6 ? 8.6 : 9.4);

function Half({ n, x }: { n: number; x: number }) {
  return (
    <g>
      {(SPOTS[n] ?? []).map(([px, py], i) => (
        <circle key={i} cx={x + 8 + px * 84} cy={8 + py * 84} r={RADIUS(n)} fill={PIP_COLOURS[n] ?? '#000'} />
      ))}
    </g>
  );
}

/** The face of tile a-b, lying flat: a on the left, b on the right. */
export function DominoFace({ a, b }: { a: number; b: number }) {
  return (
    <svg className="domino-svg" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <rect x="2" y="2" width="196" height="96" rx="13" fill="var(--domino-face, #f7f1e3)" stroke="var(--domino-edge, #b8a98b)" strokeWidth="3" />
      <line x1="100" y1="14" x2="100" y2="86" stroke="var(--domino-edge, #b8a98b)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="100" cy="50" r="4.5" fill="var(--domino-edge, #b8a98b)" />
      <Half n={a} x={0} />
      <Half n={b} x={100} />
    </svg>
  );
}

export function DominoBack() {
  return (
    <svg className="domino-svg" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true">
      <rect x="2" y="2" width="196" height="96" rx="13" fill="var(--domino-back, #23463a)" stroke="var(--domino-back-edge, #c9a25a)" strokeWidth="3" />
      <rect x="14" y="14" width="172" height="72" rx="8" fill="none" stroke="var(--domino-back-edge, #c9a25a)" strokeOpacity="0.45" strokeWidth="2" />
      <path d="M100 30 L116 50 L100 70 L84 50 Z" fill="var(--domino-back-edge, #c9a25a)" fillOpacity="0.7" />
    </svg>
  );
}

/** A small tile for the seat panel and lessons: one number on each half. */
export function DominoMark({ a, b, size = 24 }: { a: number; b: number; size?: number }) {
  return (
    <span className="domino-mark" style={{ width: `${size}px`, height: `${size / 2}px` }}>
      <DominoFace a={a} b={b} />
    </span>
  );
}
