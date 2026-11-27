/**
 * The Go table: the intersections board above a strip with Pass (or Play, when moves are
 * confirmed), the marking buttons while counting, and the prisoners or the count.
 * Tap a point to play. With "Confirm moves" on, the first tap shows a ghost stone and a second
 * tap (or Play) places it. While counting, tap a stone to mark its chain dead or alive.
 */
import { useMemo, useState } from 'react';
import type { PointMark, StoneColor } from '../../../kits/board/IntersectionBoard';
import { IntersectionBoard } from '../../../kits/board/IntersectionBoard';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import { Board } from '../board';
import { COLUMNS, pointName, sgfName, sgfToXY, starPoints } from '../coords';
import type { GoAction, GoEvent, GoState } from '../rules';
import { countState, winnerOf } from '../rules';
import { readOverlay } from './overlay';
import './go.css';

const stoneOf = (ch: string | undefined): StoneColor | null => (ch === 'X' ? 'black' : ch === 'O' ? 'white' : null);

function pointOf(at: string, size: number): number {
  const xy = sgfToXY(at);
  return xy ? xy.y * size + xy.x : -1;
}

/** Liberty counts and chains in atari, worked out from the position. */
function chainFacts(state: GoState): { liberties: Map<number, number>; atari: Set<number> } {
  const board = Board.fromText(state.size, state.board);
  const liberties = new Map<number, number>();
  const atari = new Set<number>();
  const counted = new Map<number, number>();
  for (let p = 0; p < state.board.length; p++) {
    if (state.board[p] === '.') continue;
    const i = board.fromPoint(p);
    const h = board.head[i] as number;
    let n = counted.get(h);
    if (n === undefined) {
      n = board.liberties(h).length;
      counted.set(h, n);
    }
    liberties.set(p, n);
    if (n === 1) atari.add(p);
  }
  return { liberties, atari };
}

export function marginText(black: number, white: number): string {
  if (black === white) return t('go.result.tie');
  return black > white ? t('go.result.black', { n: black - white }) : t('go.result.white', { n: white - black });
}

export function GoSurface({ state, mySeats, canAct, legal, lastAction, anim, onAction, onSkip, helps, overlay }: SurfaceProps<GoState, GoAction, GoEvent>) {
  const size = state.size;
  const [pending, setPending] = useState<{ key: string; point: number } | null>(null);
  const positionKey = `${state.history.length}:${state.history[state.history.length - 1] ?? ''}`;
  const pendingHere = pending && pending.key === positionKey ? pending.point : null;
  const scoring = state.phase === 'scoring';
  const counted = state.phase === 'over' && state.result?.kind === 'score';
  const dead = useMemo(() => new Set(scoring || counted ? state.dead : []), [scoring, counted, state.dead]);
  const facts = useMemo(() => chainFacts(state), [state]);
  const count = useMemo(() => (scoring || counted ? countState(state) : null), [scoring, counted, state]);
  const read = useMemo(() => readOverlay(overlay, size), [overlay, size]);

  const plays = new Map<number, GoAction>();
  const marksByPoint = new Map<number, GoAction>();
  let pass: GoAction | null = null;
  let done: GoAction | null = null;
  let resume: GoAction | null = null;
  if (canAct) {
    for (const a of legal) {
      if (a.type === 'play') plays.set(pointOf(a.at, size), a);
      else if (a.type === 'mark') marksByPoint.set(pointOf(a.at, size), a);
      else if (a.type === 'pass') pass = a;
      else if (a.type === 'done') done = a;
      else resume = a;
    }
  }
  const playable = new Set<number>(scoring ? marksByPoint.keys() : plays.keys());
  const confirm = helps.confirm === true && !scoring;
  const toMove: StoneColor = state.toMove === 0 ? 'black' : 'white';

  const onPoint = (p: number) => {
    if (scoring) {
      const a = marksByPoint.get(p);
      if (a) onAction(a);
      return;
    }
    const a = plays.get(p);
    if (!a) return;
    if (confirm && pendingHere !== p) {
      setPending({ key: positionKey, point: p });
      return;
    }
    setPending(null);
    onAction(a);
  };

  const points = useMemo(
    () =>
      Array.from({ length: size * size }, (_, p) => {
        const stone = stoneOf(state.board[p]);
        const name = pointName(p, size);
        const isDead = dead.has(p);
        const label = !stone ? t('go.point.empty', { point: name }) : isDead ? t(stone === 'black' ? 'go.point.black.dead' : 'go.point.white.dead', { point: name }) : t(stone === 'black' ? 'go.point.black' : 'go.point.white', { point: name });
        return { x: p % size, y: Math.floor(p / size), stone, label };
      }),
    [state.board, size, dead],
  );

  // The coach's helps: liberty counts on every chain, rings on chains in atari.
  const numbers = new Map<number, string>();
  if (helps.liberties && !scoring && state.phase !== 'over') for (const [p, n] of facts.liberties) numbers.set(p, String(n));
  const atari = helps.atari && !scoring && state.phase !== 'over' ? facts.atari : new Set<number>();

  const marks: PointMark[] = [...read.marks];
  for (const p of read.suggestedDead) if (scoring && !dead.has(p)) marks.push({ point: p, tone: 'threat', shape: 'cross' });
  if (state.ko >= 0 && state.phase === 'play' && helps.liberties) marks.push({ point: state.ko, tone: 'threat', shape: 'dot' });

  const owners = count ? Array.from(count.owner) : read.owners;
  const strength = count ? null : read.strength;

  const event = anim.playing?.event;
  const placing = event?.type === 'place' && anim.playing ? { point: pointOf(event.at, size), seq: anim.playing.seq, ms: anim.duration } : null;
  const takenColor: StoneColor = event?.type === 'place' && event.seat === 0 ? 'white' : 'black';
  const removing =
    event?.type === 'place' && event.captured.length > 0 && anim.playing
      ? { points: event.captured.map((at) => pointOf(at, size)), color: takenColor, seq: anim.playing.seq, ms: anim.duration }
      : null;

  const last = lastAction?.type === 'play' ? pointOf(lastAction.at, size) : state.last >= 0 && state.phase !== 'scoring' ? state.last : null;

  // Suggested dead stones that differ from the current marking, as mark actions.
  const suggestionDiff: GoAction[] = [];
  if (scoring && canAct && read.suggestedDead.length > 0) {
    const want = new Set(read.suggestedDead);
    const board = Board.fromText(size, state.board);
    const seen = new Set<number>();
    for (let p = 0; p < state.board.length; p++) {
      if (state.board[p] === '.' || seen.has(p)) continue;
      const i = board.fromPoint(p);
      const chain = board.chain(board.head[i] as number).map((s) => board.point(s));
      for (const q of chain) seen.add(q);
      if (want.has(p) !== dead.has(p)) {
        const a = marksByPoint.get(p);
        if (a) suggestionDiff.push(a);
      }
    }
  }

  let text: string;
  if (state.phase === 'handicap') text = t('go.strip.place', { n: state.handicap - state.placeLeft + 1, total: state.handicap });
  else if (scoring && count) {
    const tally = helps.count === false ? '' : ` ${t('go.strip.score', { black: count.black, white: count.white })}`;
    text = `${canAct ? t('go.strip.mark') : t('go.strip.wait')}${tally}`;
  } else if (state.phase === 'over' && state.result) {
    const r = state.result;
    text =
      r.kind === 'score'
        ? `${marginText(r.black, r.white)} (${t('go.strip.score', { black: r.black, white: r.white })})`
        : r.kind === 'no-result'
          ? t('go.result.none')
          : winnerOf(r) === null
            ? t('go.result.tie')
            : winnerOf(r) === 0
              ? t('go.result.black-captures')
              : t('go.result.white-captures');
  } else if (pendingHere !== null) text = t('go.strip.confirm', { point: pointName(pendingHere, size) });
  else if (helps.atari && canAct && [...facts.atari].some((p) => (state.board[p] === 'X') === (state.toMove === 0))) text = t('go.strip.atari');
  else if (state.passes === 1 && state.phase === 'play') text = t('go.strip.passed');
  else text = t('go.strip.prisoners', { black: state.prisoners[0], white: state.prisoners[1] });

  return (
    <div className="go-surface">
      <div className="go-board">
        <IntersectionBoard
          size={size}
          points={points}
          label={t('go.board', { size })}
          columns={[...COLUMNS.slice(0, size)]}
          rows={Array.from({ length: size }, (_, y) => String(size - y))}
          stars={starPoints(size)}
          lastMove={last}
          ghost={pendingHere !== null && mySeats.includes(state.toMove) ? { point: pendingHere, color: toMove } : null}
          marks={marks}
          owners={owners}
          strength={strength}
          dead={dead}
          numbers={numbers}
          atari={atari}
          playable={playable}
          onPoint={onPoint}
          onTouch={() => {
            if (anim.playing || anim.pending.length > 0) onSkip();
          }}
          placing={placing}
          removing={removing}
          dataPosition={state.board}
        />
      </div>
      <div className="go-strip" aria-live="polite">
        <span className="go-strip-text">{text}</span>
        {scoring && canAct && suggestionDiff.length > 0 ? (
          <button type="button" className="btn btn-small" onClick={() => suggestionDiff.forEach((a) => onAction(a))}>
            {t('go.suggest.use')}
          </button>
        ) : null}
        {scoring && resume ? (
          <button type="button" className="btn btn-small" onClick={() => onAction(resume)}>
            {t('go.resume')}
          </button>
        ) : null}
        {scoring && done ? (
          <button type="button" className="btn btn-small btn-primary" onClick={() => onAction(done)}>
            {t('go.done')}
          </button>
        ) : null}
        {!scoring && pendingHere !== null && plays.get(pendingHere) ? (
          <button
            type="button"
            className="btn btn-small btn-primary"
            onClick={() => {
              const a = plays.get(pendingHere);
              setPending(null);
              if (a) onAction(a);
            }}
          >
            {t('go.confirm', { point: pointName(pendingHere, size) })}
          </button>
        ) : null}
        {!scoring && state.phase === 'play' ? (
          <button
            type="button"
            className="btn btn-small"
            disabled={!pass}
            onClick={() => {
              setPending(null);
              if (pass) onAction(pass);
            }}
          >
            {t('go.pass')}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function GoSeatMark({ seat }: { seat: number }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <radialGradient id={`go-seat-${seat}`} cx="0.36" cy="0.32" r="0.75">
          <stop offset="0" stopColor={seat === 0 ? '#5d5a55' : '#ffffff'} />
          <stop offset="1" stopColor={seat === 0 ? '#0b0a09' : '#cfc6b4'} />
        </radialGradient>
      </defs>
      <circle cx={50} cy={50} r={44} fill={`url(#go-seat-${seat})`} stroke={seat === 0 ? '#000' : '#9c9486'} strokeWidth={2} />
    </svg>
  );
}

/** Prisoners under each player, and the count once the game has been counted. */
export function GoSeatExtra({ state, seat }: { state: GoState; start: GoState; seat: number }) {
  const prisoners = seat === 0 ? state.prisoners[0] : state.prisoners[1];
  const r = state.result;
  const score = r && r.kind === 'score' ? (seat === 0 ? r.black : r.white) : null;
  return (
    <span className="go-prisoners num">
      {score !== null ? t('go.seat.score', { n: score }) : t('go.seat.prisoners', { n: prisoners })}
    </span>
  );
}

export { sgfName };
