/**
 * BoardKit star (PLAN.md 2.2): the six-pointed star of 121 holes for Chinese Checkers. A wooden
 * star with each start point tinted in its owner's colour, marbles in six colours that each carry
 * their own mark (a dot, a square, a triangle, a diamond, a plus, a cross) so they never rely on
 * colour alone, the last move's path, the holes a chosen marble can reach (with the number of hops
 * for a chain), coach marks and arrows, and a marble that slides along its chain from the
 * animation queue. The board turns so any point can sit at the bottom. Every hole is a labelled
 * button ("5e, empty", "5e, Red marble"), which screen readers and the tests use alike.
 */
import type { KeyboardEvent } from 'react';
import { HOLES, POINT_HOLES_OF, ROW_FROM, drawAt, parseHole } from '../../games/chinese-checkers/board';
import './star.css';

export type StarTone = 'hint' | 'threat' | 'info' | 'good';

export interface StarHole {
  /** The seat whose marble sits here, or null. */
  readonly seat: number | null;
  /** Read out and used by tests: "5e, Red marble". */
  readonly label: string;
}

export interface StarArrow {
  readonly from: number;
  readonly to: number;
  readonly tone: StarTone;
}

export interface StarMark {
  readonly hole: number;
  readonly tone: StarTone;
}

export interface StarBoardProps {
  /** 121 holes in board order. */
  readonly holes: readonly StarHole[];
  readonly label: string;
  /** The point turned to the bottom (0 to 5). */
  readonly bottom: number;
  /** Seat → colour index for the tint of each point that is someone's start: point → seat. */
  readonly pointSeats: ReadonlyMap<number, number>;
  readonly selected: number | null;
  /** Holes the selected marble can reach, with the hops it takes (0 for a step). */
  readonly targets: ReadonlyMap<number, number>;
  /** Holes that do something when tapped. */
  readonly playable: ReadonlySet<number>;
  /** The last move's holes: from, each landing. */
  readonly lastPath: readonly number[];
  readonly arrows: readonly StarArrow[];
  readonly marks: readonly StarMark[];
  /** A marble sliding along a path (from the animation queue). */
  readonly moving: { readonly seq: number; readonly path: readonly number[]; readonly seat: number; readonly ms: number } | null;
  readonly onHole: (hole: number) => void;
  /** Any touch of the board, to skip animations. */
  readonly onTouch: () => void;
  readonly dataPosition?: string;
}

const U = 100;
const MARBLE = 40;

/** Marble colours by seat: Red, Blue, Green, Yellow, Purple, White (light, base, dark), and the mark's ink. */
export const MARBLE_COLOURS: readonly { readonly light: string; readonly base: string; readonly dark: string; readonly ink: string }[] = [
  { light: '#ff9a8a', base: '#d7443a', dark: '#8c1d17', ink: '#fff4ea' },
  { light: '#9cc4ff', base: '#2f6fd6', dark: '#173b86', ink: '#f2f6ff' },
  { light: '#9be3b4', base: '#2d9a58', dark: '#155a31', ink: '#effbf2' },
  { light: '#fff2a8', base: '#e5bd2c', dark: '#9a7712', ink: '#2a1e05' },
  { light: '#d9b8ff', base: '#8a55c4', dark: '#4c2678', ink: '#f7efff' },
  { light: '#ffffff', base: '#e9e4d8', dark: '#a39b8a', ink: '#2a2118' },
];

/** The mark drawn on each seat's marbles, centred on (0, 0), for a marble of radius 40. */
export function MarbleMark({ seat, ink }: { seat: number; ink: string }) {
  switch (seat) {
    case 0:
      return <circle r={11} fill={ink} />;
    case 1:
      return <rect x={-10} y={-10} width={20} height={20} fill={ink} />;
    case 2:
      return <path d="M 0 -13 L 12 9 L -12 9 Z" fill={ink} />;
    case 3:
      return <path d="M 0 -14 L 13 0 L 0 14 L -13 0 Z" fill={ink} />;
    case 4:
      return <path d="M -4 -13 H 4 V -4 H 13 V 4 H 4 V 13 H -4 V 4 H -13 V -4 H -4 Z" fill={ink} />;
    default:
      return <path d="M -10 -10 L 10 10 M 10 -10 L -10 10" stroke={ink} strokeWidth={6} strokeLinecap="round" />;
  }
}

/** One marble centred on (0, 0). */
export function Marble({ seat, r = MARBLE }: { seat: number; r?: number }) {
  const c = MARBLE_COLOURS[seat % MARBLE_COLOURS.length] as (typeof MARBLE_COLOURS)[number];
  const scale = r / MARBLE;
  return (
    <g className="sb-marble">
      <circle cx={3} cy={5} r={r} fill="#000" opacity={0.3} />
      <circle r={r} fill={`url(#sb-marble-${seat})`} stroke={c.dark} strokeWidth={2} />
      <ellipse cx={-r * 0.32} cy={-r * 0.38} rx={r * 0.32} ry={r * 0.2} fill="#fff" opacity={0.35} />
      <g transform={scale !== 1 ? `scale(${scale})` : undefined}>
        <MarbleMark seat={seat} ink={c.ink} />
      </g>
    </g>
  );
}

export function MarbleGradients() {
  return (
    <>
      {MARBLE_COLOURS.map((c, seat) => (
        <radialGradient key={seat} id={`sb-marble-${seat}`} cx="0.36" cy="0.32" r="0.78">
          <stop offset="0" stopColor={c.light} />
          <stop offset="0.55" stopColor={c.base} />
          <stop offset="1" stopColor={c.dark} />
        </radialGradient>
      ))}
    </>
  );
}

/** The star's outline through the hole centres: each tip, then the inner corner after it, clockwise from the bottom. */
const OUTLINE = ['1a', '5e', '5a', '9a', '13a', '13e', '17a', '13i', '13m', '9i', '5m', '5i'].map(parseHole);

/** Each point's tip and the two ends of its base row, for the tint. */
const POINT_CORNERS: readonly (readonly number[])[] = POINT_HOLES_OF.map((holes, p) => {
  const tip = holes.find((h) => ROW_FROM[p * HOLES + h] === 1) as number;
  const base = holes.filter((h) => ROW_FROM[p * HOLES + h] === 4);
  return [tip, base[0] as number, base[base.length - 1] as number];
});

const TONE: Record<StarTone, string> = { hint: '#f0cf84', threat: '#e8775a', info: '#a6c9ef', good: '#a3c98a' };

export function StarBoard(props: StarBoardProps) {
  const { holes, label, bottom, pointSeats, selected, targets, playable, lastPath, arrows, marks, moving, onHole, onTouch, dataPosition } = props;
  const at = (h: number) => {
    const p = drawAt(h, bottom);
    return { x: p.x * U, y: p.y * U };
  };
  const points = (list: readonly number[]) =>
    list
      .map((h) => {
        const p = at(h);
        return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
      })
      .join(' ');
  const onKey = (event: KeyboardEvent, h: number) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onTouch();
      onHole(h);
    }
  };
  const movingTo = moving ? (moving.path[moving.path.length - 1] ?? -1) : -1;
  const pathD = (path: readonly number[]) =>
    path
      .map((h, i) => {
        const p = at(h);
        return `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      })
      .join(' ');

  return (
    <svg className="sb" viewBox="-700 -782 1400 1564" role="group" aria-label={label} data-position={dataPosition} data-bottom={bottom} onPointerDown={onTouch}>
      <defs>
        <MarbleGradients />
        <linearGradient id="sb-wood" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c08a4e" />
          <stop offset="0.5" stopColor="#a8723b" />
          <stop offset="1" stopColor="#8d5c2c" />
        </linearGradient>
      </defs>
      <polygon points={points(OUTLINE)} className="sb-edge" />
      <polygon points={points(OUTLINE)} className="sb-wood" fill="url(#sb-wood)" stroke="url(#sb-wood)" />
      {[...pointSeats].map(([point, seat]) => {
        const c = MARBLE_COLOURS[seat % MARBLE_COLOURS.length] as (typeof MARBLE_COLOURS)[number];
        return <polygon key={`tint${point}`} points={points(POINT_CORNERS[point] as readonly number[])} className="sb-tint" fill={c.base} stroke={c.base} />;
      })}
      {Array.from({ length: HOLES }, (_, h) => {
        const p = at(h);
        return <circle key={`hole${h}`} cx={p.x} cy={p.y} r={15} className="sb-hole" />;
      })}
      {lastPath.length >= 2 ? <path d={pathD(lastPath)} className="sb-last-path" /> : null}
      {lastPath.length >= 2 ? <circle cx={at(lastPath[0] as number).x} cy={at(lastPath[0] as number).y} r={22} className="sb-last-from" /> : null}
      {marks.map((m, i) => {
        const p = at(m.hole);
        return <circle key={`mark${i}`} cx={p.x} cy={p.y} r={52} fill="none" stroke={TONE[m.tone]} strokeWidth={10} className="sb-mark" />;
      })}
      {holes.map((hole, h) => {
        if (hole.seat === null || h === movingTo) return null;
        const p = at(h);
        return (
          <g key={`m${h}`} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            <Marble seat={hole.seat} />
          </g>
        );
      })}
      {lastPath.length >= 2 && holes[lastPath[lastPath.length - 1] as number]?.seat !== null && !moving ? (
        <circle cx={at(lastPath[lastPath.length - 1] as number).x} cy={at(lastPath[lastPath.length - 1] as number).y} r={47} className="sb-last-to" />
      ) : null}
      {selected !== null ? <circle cx={at(selected).x} cy={at(selected).y} r={49} className="sb-selected" /> : null}
      {[...targets].map(([h, hops]) => {
        const p = at(h);
        return (
          <g key={`t${h}`} className="sb-target" transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            {hops >= 2 ? (
              <>
                <circle r={27} className="sb-target-chain" />
                <text y={2} textAnchor="middle" dominantBaseline="middle" className="sb-target-text">
                  {hops}
                </text>
              </>
            ) : (
              <circle r={hops === 1 ? 19 : 15} className={hops === 1 ? 'sb-target-hop' : 'sb-target-step'} />
            )}
          </g>
        );
      })}
      {arrows.map((a, i) => {
        const from = at(a.from);
        const to = at(a.to);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        const ux = dx / len;
        const uy = dy / len;
        const tipX = to.x - ux * 30;
        const tipY = to.y - uy * 30;
        const head = `M ${tipX - ux * 34 - uy * 22} ${tipY - uy * 34 + ux * 22} L ${tipX} ${tipY} L ${tipX - ux * 34 + uy * 22} ${tipY - uy * 34 - ux * 22}`;
        return (
          <g key={`a${i}`} className="sb-arrow" stroke={TONE[a.tone]}>
            {a.from === a.to ? (
              <circle cx={to.x} cy={to.y} r={54} fill="none" strokeWidth={12} />
            ) : (
              <>
                <line x1={from.x + ux * 30} y1={from.y + uy * 30} x2={tipX} y2={tipY} strokeWidth={14} strokeLinecap="round" />
                <path d={head} fill="none" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </g>
        );
      })}
      {moving && moving.path.length >= 2 ? (
        <g key={`move${moving.seq}`} className="sb-moving">
          <Marble seat={moving.seat} />
          <animateMotion dur={`${Math.max(1, moving.ms)}ms`} fill="freeze" path={pathD(moving.path)} calcMode="linear" />
        </g>
      ) : null}
      {holes.map((hole, h) => {
        const p = at(h);
        const active = playable.has(h);
        return (
          <circle
            key={`hit${h}`}
            cx={p.x}
            cy={p.y}
            r={50}
            className="sb-hit"
            role="button"
            aria-label={hole.label}
            aria-disabled={!active}
            aria-pressed={selected === h ? true : undefined}
            tabIndex={active ? 0 : -1}
            onClick={() => active && onHole(h)}
            onKeyDown={(e) => onKey(e, h)}
          />
        );
      })}
    </svg>
  );
}
