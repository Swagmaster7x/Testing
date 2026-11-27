/**
 * The Chinese Checkers table: the star above a strip that says what to do (and holds Pass when no
 * marble can move). Tap a marble, then tap any hole it can reach: a step, or the end of a hop chain.
 * Every reachable hole is shown at once, chains with their number of hops, so a long chain is one
 * tap instead of a tap on every landing (the rules only care where a move starts and ends). The
 * marble then slides along the shortest chain to that hole. The board turns so the player at this
 * device sits at the bottom.
 */
import { useMemo, useState } from 'react';
import type { StarArrow, StarHole, StarMark } from '../../../kits/board/StarBoard';
import { Marble, MarbleGradients, StarBoard } from '../../../kits/board/StarBoard';
import { t, tDynamic } from '../../../text';
import type { SurfaceProps } from '../../types';
import { holeName, NEIGHBOUR, parseHole } from '../board';
import { movePath } from '../engine';
import type { CcAction, CcEvent, CcState } from '../rules';
import { boardArray, layoutOf, placesOf, SEAT_LETTERS } from '../rules';
import './cc.css';

export const seatColour = (seat: number): string => tDynamic(`cc.seat.${seat}`);

function isStep(from: number, to: number): boolean {
  for (let d = 0; d < 6; d++) if (NEIGHBOUR[from * 6 + d] === to) return true;
  return false;
}

/** The holes of a move already played: worked out on the board as it was before the move. */
export function playedPath(state: CcState, action: CcAction | null): number[] {
  if (!action || action.type === 'pass' || state.board[action.to] === '.') return [];
  const board = boardArray(state.board);
  const seat = board[action.to] as number;
  board[action.from] = seat;
  board[action.to] = 0;
  return movePath(board, seat - 1, layoutOf(state), state.rules, action.from, action.to) ?? [action.from, action.to];
}

const hole = (name: string): number => parseHole(name);

export function CcSurface({ state, mySeats, canAct, legal, lastAction, anim, onAction, onSkip, helps, overlay }: SurfaceProps<CcState, CcAction, CcEvent>) {
  const [selected, setSelected] = useState<{ key: string; hole: number } | null>(null);
  const layout = layoutOf(state);
  const viewer = mySeats[0] ?? 0;
  const bottom = layout.points[Math.min(viewer, state.players - 1)] ?? 0;
  const key = `${state.board}/${state.toMove}/${state.round}`;

  const { byFrom, pass } = useMemo(() => {
    const map = new Map<number, Map<number, CcAction>>();
    let passAction: CcAction | null = null;
    for (const a of legal) {
      if (a.type === 'pass') {
        passAction = a;
        continue;
      }
      let to = map.get(a.from);
      if (!to) {
        to = new Map();
        map.set(a.from, to);
      }
      to.set(a.to, a);
    }
    return { byFrom: map, pass: passAction };
  }, [legal]);

  const movable = canAct ? new Set(byFrom.keys()) : new Set<number>();
  const active = selected && selected.key === key && movable.has(selected.hole) ? selected.hole : null;
  const destinations = useMemo(() => (active !== null ? (byFrom.get(active) ?? new Map<number, CcAction>()) : new Map<number, CcAction>()), [active, byFrom]);

  const targets = useMemo(() => {
    const out = new Map<number, number>();
    if (active === null || helps.reach === false) return out;
    const board = boardArray(state.board);
    for (const to of destinations.keys()) {
      if (isStep(active, to)) out.set(to, 0);
      else out.set(to, Math.max(1, (movePath(board, state.toMove, layout, state.rules, active, to)?.length ?? 2) - 1));
    }
    return out;
  }, [active, destinations, helps.reach, state, layout]);

  const playable = new Set<number>(movable);
  for (const to of destinations.keys()) playable.add(to);

  const onHole = (h: number) => {
    if (active !== null) {
      const action = destinations.get(h);
      if (action) {
        setSelected(null);
        onAction(action);
        return;
      }
    }
    if (movable.has(h) && h !== active) setSelected({ key, hole: h });
    else setSelected(null);
  };

  const holes: StarHole[] = useMemo(
    () =>
      Array.from(state.board, (ch, h) => {
        const seat = ch === '.' ? null : SEAT_LETTERS.indexOf(ch);
        const name = holeName(h);
        return { seat, label: seat === null ? t('cc.hole.empty', { hole: name }) : t('cc.hole.marble', { hole: name, colour: seatColour(seat) }) };
      }),
    [state.board],
  );

  const pointSeats = new Map<number, number>();
  layout.points.forEach((point, seat) => pointSeats.set(point, seat));

  const event = anim.playing?.event;
  const moving = event?.type === 'move' && anim.playing ? { seq: anim.playing.seq, path: event.path, seat: event.seat, ms: anim.duration } : null;
  const lastPath = event?.type === 'move' ? [] : playedPath(state, lastAction);

  const arrows: StarArrow[] = overlay.arrows.flatMap((a) => {
    const from = hole(a.from);
    const to = hole(a.to || a.from);
    return from >= 0 && to >= 0 ? [{ from, to, tone: a.tone }] : [];
  });
  const marks: StarMark[] = overlay.marks.flatMap((m) => {
    const h = hole(m.square);
    return h >= 0 ? [{ hole: h, tone: m.tone }] : [];
  });

  let text: string;
  if (state.end !== null) {
    const places = placesOf(state);
    const winners = places.flatMap((p, seat) => (p === 1 ? [seatColour(seat)] : []));
    text = winners.length === 1 ? t('cc.strip.won', { colour: winners[0] ?? '' }) : t('cc.strip.shared', { colours: winners.join(', ') });
  } else if (canAct && pass) text = t('cc.strip.pass');
  else if (canAct && active !== null) text = destinations.size > 0 ? t('cc.strip.choose') : t('cc.strip.stuck');
  else if (canAct) text = t('cc.strip.pick', { colour: seatColour(state.toMove) });
  else text = t('cc.strip.turn', { colour: seatColour(state.toMove) });

  return (
    <div className="cc-surface">
      <div className="cc-board">
        <StarBoard
          holes={holes}
          label={t('cc.board')}
          bottom={bottom}
          pointSeats={pointSeats}
          selected={active}
          targets={targets}
          playable={canAct ? playable : new Set()}
          lastPath={lastPath}
          arrows={arrows}
          marks={marks}
          moving={moving}
          onHole={onHole}
          onTouch={() => {
            if (anim.playing || anim.pending.length > 0) onSkip();
          }}
          dataPosition={state.board}
        />
      </div>
      <div className="cc-strip" aria-live="polite">
        <span className="cc-strip-text">{text}</span>
        {canAct && pass ? (
          <button type="button" className="btn btn-small btn-primary" onClick={() => onAction(pass)}>
            {t('cc.pass')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function CcSeatMark({ seat }: { seat: number }) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true">
      <defs>
        <MarbleGradients />
      </defs>
      <Marble seat={seat} r={44} />
    </svg>
  );
}
