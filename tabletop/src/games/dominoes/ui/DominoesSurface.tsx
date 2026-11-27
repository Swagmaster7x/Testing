/**
 * The dominoes table. You sit at the bottom; in the partnership game your partner faces you, the
 * player after you (play goes counter-clockwise) sits on your right and the one before you on
 * your left. In the two-player games the other player faces you and the boneyard lies on the
 * left. The line runs through the middle and bends at the edges; its open ends are marked.
 *
 * Tap a tile to lift it, then tap it again (or tap a marked end) to play it there. A tile that
 * fits both ends waits for you to choose the end.
 *
 * What is drawn lags the rules by the events still queued: a tile the rules have already played
 * stays in its hand until its event plays, then slides to the line. At the end of a hand every
 * hand is shown until the next deal.
 */
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import { DominoBack, DominoFace } from '../../../kits/tiles/domino';
import type { PlacedTile } from '../../../kits/tiles/TileLayer';
import { TileLayer } from '../../../kits/tiles/TileLayer';
import { fitLine } from '../../../kits/tiles/line-layout';
import { useSize } from '../../../kits/cards/CardLayer';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { DominoesAction, DominoesEvent, DominoesState, End, Placed, Tile } from '../rules';
import { cantHave, endsOf, handPips, isTile, pipsOf, seatCount, viewOf } from '../rules';
import { endName, seatName, tileLabel } from './names';

interface Display {
  readonly hands: Tile[][];
  readonly chain: Placed[];
  readonly boneyard: Tile[];
  /** Showing a finished hand: every hand face up. */
  readonly ended: boolean;
}

/** The table as it looks before the queued events play. */
export function displayOf(state: DominoesState, pending: readonly DominoesEvent[]): Display {
  let hands = state.hands.map((h) => [...h]);
  let chain = [...state.chain];
  let boneyard = [...state.boneyard];
  let ended = state.over;
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'deal':
        if (e.previous) {
          hands = e.previous.hands.map((h) => [...h]);
          chain = [...e.previous.chain];
          boneyard = [...e.previous.boneyard];
          ended = true;
        }
        break;
      case 'hand-end':
        ended = false;
        break;
      case 'play': {
        chain = chain.filter((p) => p.tile !== e.tile);
        hands[e.seat]?.push(e.tile);
        break;
      }
      case 'draw': {
        const hand = hands[e.seat] ?? [];
        const i = hand.indexOf(e.tile);
        if (i >= 0) hand.splice(i, 1);
        boneyard = [e.tile, ...boneyard];
        break;
      }
      default:
        break;
    }
  }
  return { hands, chain, boneyard, ended };
}

const sortTiles = (tiles: readonly Tile[]) => [...tiles].sort((a, b) => Number(a[0]) - Number(b[0]) || Number(a[2]) - Number(b[2]));

const faceOf = (tile: Tile) => {
  const [a, b] = pipsOf(tile);
  return <DominoFace a={a} b={b} />;
};
const BACK = <DominoBack />;

export function DominoesSeatMark({ seat }: { seat: Seat }) {
  const mine = seat % 2 === 0;
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="7" y="2" width="10" height="20" rx="2" fill={mine ? '#f7f1e3' : '#23463a'} stroke={mine ? '#b8a98b' : '#c9a25a'} />
      <line x1="8.5" y1="12" x2="15.5" y2="12" stroke={mine ? '#b8a98b' : '#c9a25a'} />
      <circle cx="12" cy="7" r="1.6" fill={mine ? '#a8261d' : '#c9a25a'} />
      <circle cx="12" cy="17" r="1.6" fill={mine ? '#23408c' : '#c9a25a'} />
    </svg>
  );
}

/** Where each seat sits, counted from you: 0 bottom, 1 right, 2 top, 3 left (two players: 0 bottom, 1 top). */
function placeOf(seat: Seat, me: Seat, n: number): 'bottom' | 'right' | 'top' | 'left' {
  const rel = (seat - me + n) % n;
  if (n === 2) return rel === 0 ? 'bottom' : 'top';
  return (['bottom', 'right', 'top', 'left'] as const)[rel] ?? 'top';
}

export function DominoesSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, overlay }: SurfaceProps<DominoesState, DominoesAction, DominoesEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [selected, setSelected] = useState<Tile | null>(null);
  const n = seatCount(state.config);
  const me: Seat = mySeats[0] ?? 0;
  const pending = anim.pending.map((p) => p.event);
  const playing = anim.playing?.event ?? null;
  const d = displayOf(state, playing ? [playing, ...pending] : pending);
  const shown = playing?.type === 'hand-end' || playing?.type === 'bonus' ? { ...d, ended: true } : d;
  const W = size.width;
  const H = size.height;
  const gap = Math.max(4, Math.min(W, H) * 0.015);
  // Your own tiles as big as the table allows: seven of them fit across with room to spare.
  const handUnit = Math.max(13, Math.min(H * 0.1, W / 9.5, 32));
  const small = Math.max(8, Math.min(handUnit * 0.56, 15));
  const labelH = 16;
  // Side strips leave room for the seat labels above the tiles.
  const sideW = n === 4 ? Math.max(small * 2 + gap * 2, 62) : 0;
  const yardW = state.config.mode === 'partnership' ? 0 : Math.max(7, small * 0.72) * 4 + 3 + gap * 2;
  const topH = small * 2 + gap * 2 + labelH;
  const bottomH = handUnit * 2 + gap * 2 + labelH;
  const area = { x: Math.max(sideW, yardW) + gap, y: topH, w: W - Math.max(sideW, yardW) - sideW - gap * 2, h: H - topH - bottomH };
  const fitted = fitLine(
    d.chain.map((p) => ({ tile: p.tile, left: p.left, right: p.right, n: p.n })),
    Math.max(40, area.w),
    Math.max(30, area.h),
    Math.min(26, Math.max(9, area.h / 5)),
  );
  const cx = area.x + area.w / 2 + fitted.dx;
  const cy = area.y + area.h / 2 + fitted.dy;
  const u = fitted.unit;
  const open = helps.openHand === true || shown.ended;
  // While a finished hand is on show, the tiles are the old hand's: nothing to play yet.
  const acting = canAct && !shown.ended;
  const playable = new Map<Tile, End[]>();
  for (const a of legal) {
    if (a.type !== 'play') continue;
    playable.set(a.tile, [...(playable.get(a.tile) ?? []), ...(a.end ? [a.end] : [])]);
  }
  const ends = endsOf(d.chain);
  const lastN = d.chain.reduce((m, p) => Math.max(m, p.n), -1);
  const hintTile = overlay.marks.find((m) => isTile(m.square))?.square ?? null;
  const placed: PlacedTile[] = [];

  // The line.
  const byTile = new Map(fitted.layout.tiles.map((lt) => [lt.tile, lt]));
  for (const p of d.chain) {
    const lt = byTile.get(p.tile);
    if (!lt) continue;
    placed.push({ key: p.tile, face: faceOf(p.tile), back: BACK, x: cx + lt.x * u, y: cy + lt.y * u, rotate: lt.rotate, unit: u, z: 10 + p.n, label: tileLabel(p.tile), tone: p.n === lastN && !shown.ended ? 'last' : null });
  }

  // Hands.
  for (let seat = 0; seat < n; seat++) {
    const where = placeOf(seat, me, n);
    const tiles = seat === me ? sortTiles(d.hands[seat] ?? []) : (d.hands[seat] ?? []);
    const faceUp = seat === me || open;
    tiles.forEach((tile, i) => {
      const k = tiles.length;
      if (where === 'bottom') {
        const spacing = handUnit * 1.18;
        const can = acting && playable.has(tile);
        placed.push({
          key: tile,
          face: faceOf(tile),
          back: BACK,
          x: W / 2 + (i - (k - 1) / 2) * spacing,
          y: H - gap - handUnit - labelH,
          rotate: 90,
          unit: handUnit,
          z: 100 + i,
          label: tileLabel(tile),
          interactive: can,
          selected: can && selected === tile,
          tone: hintTile === tile ? 'hint' : null,
          dim: acting && !can && legal.some((a) => a.type === 'play'),
        });
      } else if (where === 'top') {
        const unit = faceUp ? Math.max(small, handUnit * 0.7) : small;
        const spacing = unit * 1.15;
        placed.push({ key: tile, face: faceUp ? faceOf(tile) : null, back: BACK, x: W / 2 + (i - (k - 1) / 2) * spacing, y: gap + labelH + unit, rotate: 90, unit, z: 100 + i, label: faceUp ? tileLabel(tile) : undefined });
      } else {
        const unit = small;
        const spacing = unit * 1.2;
        const x = where === 'left' ? gap + unit : W - gap - unit;
        placed.push({ key: tile, face: faceUp ? faceOf(tile) : null, back: BACK, x, y: H / 2 - 4 + (i - (k - 1) / 2) * spacing, rotate: 0, unit, z: 100 + i, label: faceUp ? tileLabel(tile) : undefined });
      }
    });
  }

  // The boneyard (Draw game) or the tiles left out (Block game), face down in two stacks on the left.
  const yardUnit = Math.max(7, small * 0.72);
  d.boneyard.forEach((tile, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    placed.push({ key: tile, face: helps.openHand && state.config.mode === 'block' ? faceOf(tile) : null, back: BACK, x: gap + yardUnit + col * (yardUnit * 2 + 3), y: area.y + yardUnit / 2 + row * (yardUnit + 3), rotate: 0, unit: yardUnit, z: 5 + i });
  });

  const choose = (tile: Tile, end: End | undefined) => {
    setSelected(null);
    onAction(end ? { type: 'play', tile, end } : { type: 'play', tile });
  };
  const onTile = (key: string) => {
    if (!isTile(key)) return;
    const fits = playable.get(key);
    if (!fits) return;
    if (selected !== key) {
      setSelected(key);
      return;
    }
    // A second tap plays it where it fits, unless it fits both ends.
    if (!ends) choose(key, undefined);
    else if (fits.length === 1) choose(key, fits[0]);
  };
  const sel = selected && playable.has(selected) ? selected : null;
  const selFits = sel ? (playable.get(sel) ?? []) : [];
  const only = legal.length === 1 ? legal[0] : null;
  const duration = anim.playing ? Math.min(anim.duration, 420) : 240;

  // Open ends: a dashed outline where the next tile goes; a button while a lifted tile fits there.
  const endSpots = fitted.layout.ends;
  const endMarks = endSpots
    ? (['left', 'right'] as const).map((end, i) => {
        const spot = endSpots[i as 0 | 1];
        const usable = sel !== null && selFits.includes(end) && acting;
        const flat = spot.rotate === 0 || spot.rotate === 180;
        const w = (flat ? 2 : 1) * u;
        const h = (flat ? 1 : 2) * u;
        const style = { left: `${cx + spot.x * u - w / 2}px`, top: `${cy + spot.y * u - h / 2}px`, width: `${w}px`, height: `${h}px` };
        return usable ? (
          <button key={end} type="button" className="line-end" data-usable="true" style={style} aria-label={t('dominoes.play-on', { tile: tileLabel(sel), end: endName(end, spot.value) })} onClick={() => choose(sel, end)}>
            <span className="num">{spot.value}</span>
          </button>
        ) : (
          <span key={end} className="line-end" style={style} aria-hidden="true">
            <span className="num">{spot.value}</span>
          </span>
        );
      })
    : null;

  // Seat labels, the turn, passes, and what each seat cannot have.
  const view = viewOf(state, me);
  const turnSeat = anim.playing || anim.pending.length > 0 ? null : state.over ? null : state.turn;
  const passing = playing?.type === 'pass' ? playing.seat : null;
  const tipShown = acting && selected !== null && playable.has(selected);
  const labels = Array.from({ length: n }, (_, seat) => {
    const where = placeOf(seat, me, n);
    if (where === 'bottom' && tipShown) return null;
    const lacks = helps.cantHave && seat !== me ? [...cantHave(view, seat)].sort() : [];
    const pips = shown.ended ? handPips(d.hands[seat] ?? []) : null;
    const style =
      where === 'bottom'
        ? { left: '50%', bottom: `${gap / 2}px`, transform: 'translateX(-50%)' }
        : where === 'top'
          ? { left: '50%', top: `${gap / 2}px`, transform: 'translateX(-50%)' }
          : where === 'left'
            ? { left: `${gap / 2}px`, bottom: `${H - (H / 2 - 4 - ((d.hands[seat]?.length ?? 0) / 2) * small * 1.2) + 4}px`, maxWidth: `${sideW - gap / 2}px` }
            : { right: `${gap / 2}px`, bottom: `${H - (H / 2 - 4 - ((d.hands[seat]?.length ?? 0) / 2) * small * 1.2) + 4}px`, maxWidth: `${sideW - gap / 2}px` };
    return (
      <div key={seat} className="seat-tag" data-where={where} data-side={where === 'left' || where === 'right'} data-turn={turnSeat === seat} style={style}>
        <span>{seatName(seat, me, n)}</span>
        {pips !== null ? <span className="num seat-pips">{t('dominoes.pips', { n: pips })}</span> : null}
        {lacks.length > 0 ? <span className="seat-lacks">{t('dominoes.lacks', { list: lacks.join(' · ') })}</span> : null}
        {passing === seat ? (
          <span className="seat-pass" role="status">
            {t('dominoes.pass-bubble')}
          </span>
        ) : null}
      </div>
    );
  });

  const handEnd = playing?.type === 'hand-end' ? playing.result : null;
  const side = me % 2;

  return (
    <div ref={ref} className="card-table domino-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null}>
      {W > 0 ? <TileLayer tiles={placed} duration={duration} onTile={onTile} /> : null}
      {W > 0 ? endMarks : null}
      {!ends && acting && W > 0 ? (
        <span className="line-end" style={{ left: `${area.x + area.w / 2 - u}px`, top: `${area.y + area.h / 2 - u / 2}px`, width: `${2 * u}px`, height: `${u}px` }} aria-hidden="true" />
      ) : null}
      {labels}
      {state.config.mode !== 'partnership' ? (
        <div className="yard-tag num" style={{ left: `${gap}px`, top: `${area.y - labelH}px` }}>
          {state.config.mode === 'draw' ? t('dominoes.boneyard', { n: d.boneyard.length }) : t('dominoes.sleeping', { n: d.boneyard.length })}
        </div>
      ) : null}
      {acting && only && only.type !== 'play' ? (
        <button
          type="button"
          className="btn btn-small knock-btn"
          style={{ left: `${Math.min(W - 90, W / 2 + ((d.hands[me]?.length ?? 0) / 2) * handUnit * 1.18 + gap * 2 + 60)}px`, top: `${H - gap - handUnit - labelH - 16}px` }}
          onClick={() => onAction(only)}
        >
          {only.type === 'pass' ? t('dominoes.pass') : t('dominoes.draw')}
        </button>
      ) : null}
      {acting && sel ? (
        // In the slot under your hand where your name sits, so it never covers the line.
        <p className="table-tip">{ends && selFits.length > 1 ? t('dominoes.choose-end') : t('dominoes.tap-again')}</p>
      ) : null}
      {handEnd ? (
        <div className="hand-over domino-hand-over" role="status">
          {handEnd.winner === null
            ? t('dominoes.hand.tie')
            : t(handEnd.winner === side ? (handEnd.reason === 'domino' ? 'dominoes.hand.we-domino' : 'dominoes.hand.we-block') : handEnd.reason === 'domino' ? 'dominoes.hand.they-domino' : 'dominoes.hand.they-block', {
                n: handEnd.points[handEnd.winner] ?? 0,
              })}
        </div>
      ) : null}
    </div>
  );
}
