/**
 * The dominoes table. You sit at the bottom; in the partnership game your partner faces you, the
 * player after you (play goes counter-clockwise) sits on your right and the one before you on
 * your left. With three players the other two sit on your right and your left; with two, the
 * other player faces you and the boneyard lies on the left. The line runs through the middle and
 * bends at the edges; with a spinner (All Fives) it grows into a cross around the spinner. Its
 * open ends are marked.
 *
 * Tap a tile to lift it, then tap it again (or tap a marked end) to play it there. A tile that
 * fits more than one end waits for you to choose the end.
 *
 * When the ends score as you play, the count of the open ends sits by the table, and a play that
 * scores shows its points beside the tile as it lands.
 *
 * What is drawn lags the rules by the events still queued: a tile the rules have already played
 * stays in its hand until its event plays, then slides to the table. At the end of a hand every
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
import type { DominoesAction, DominoesEvent, DominoesState, End, Layout, Placed, Tile } from '../rules';
import { cantHave, drawing, endsCount, handPips, handSize, isTile, openEnds, pipsOf, seatCount, sideCount, sideOf, viewOf } from '../rules';
import { endName, seatName, tileLabel } from './names';
import './dominoes.css';

interface Display {
  readonly hands: Tile[][];
  readonly layout: Layout;
  readonly boneyard: Tile[];
  /** Showing a finished hand: every hand face up. */
  readonly ended: boolean;
}

const without = (list: readonly Placed[], tile: Tile) => list.filter((p) => p.tile !== tile);

/** The table as it looks before the queued events play. */
export function displayOf(state: DominoesState, pending: readonly DominoesEvent[]): Display {
  let hands = state.hands.map((h) => [...h]);
  let layout: Layout = { chain: state.chain, spinner: state.spinner, up: state.up, down: state.down };
  let boneyard = [...state.boneyard];
  let ended = state.over;
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'deal':
        if (e.previous) {
          hands = e.previous.hands.map((h) => [...h]);
          layout = e.previous.layout;
          boneyard = [...e.previous.boneyard];
          ended = true;
        }
        break;
      case 'hand-end':
        ended = false;
        break;
      case 'play': {
        layout = { chain: without(layout.chain, e.tile), spinner: e.spinner ? null : layout.spinner, up: without(layout.up, e.tile), down: without(layout.down, e.tile) };
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
  return { hands, layout, boneyard, ended };
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

type Where = 'bottom' | 'right' | 'top' | 'left';

/** Where each seat sits, counted from you: 0 bottom, 1 right, 2 top, 3 left (three players: right and left; two: the top). */
function placeOf(seat: Seat, me: Seat, n: number): Where {
  const rel = (seat - me + n) % n;
  if (n === 2) return rel === 0 ? 'bottom' : 'top';
  if (n === 3) return (['bottom', 'right', 'left'] as const)[rel] ?? 'right';
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
  // Your own tiles as big as the table allows: a full hand fits across with room to spare.
  const most = Math.max(7, handSize(state.config), d.hands[me]?.length ?? 0);
  const handUnit = Math.max(12, Math.min(H * 0.1, W / (most * 1.18 + 1.24), 32));
  const sideMost = Math.max(7, ...d.hands.filter((_, s) => placeOf(s, me, n) === 'left' || placeOf(s, me, n) === 'right').map((h) => h.length));
  // Side hands stand in a column: small enough for the longest hand to fit between the top and the bottom rows.
  const small = Math.max(7, Math.min(handUnit * 0.56, 15, (H * 0.62) / (sideMost * 1.2)));
  const labelH = 16;
  const sides = n >= 3;
  // Side strips leave room for the seat labels above the tiles.
  const sideW = sides ? Math.max(small * 2 + gap * 2, 62) : 0;
  const yardStacks = n === 2 && state.config.mode !== 'partnership';
  const yardW = yardStacks ? Math.max(7, small * 0.72) * 4 + 3 + gap * 2 : 0;
  const topH = n === 3 ? labelH + gap * 2 : small * 2 + gap * 2 + labelH;
  const bottomH = handUnit * 2 + gap * 2 + labelH;
  const area = { x: Math.max(sideW, yardW) + gap, y: topH, w: W - Math.max(sideW, yardW) - sideW - gap * 2, h: H - topH - bottomH };
  const placedLine = (p: Placed) => ({ tile: p.tile, left: p.left, right: p.right, n: p.n });
  const fitted = fitLine(
    d.layout.chain.map(placedLine),
    Math.max(40, area.w),
    Math.max(30, area.h),
    Math.min(26, Math.max(9, area.h / 5)),
    7,
    d.layout.spinner ? { spinner: d.layout.spinner, up: d.layout.up.map(placedLine), down: d.layout.down.map(placedLine) } : null,
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
  const ends = openEnds(d.layout);
  const onTable = [...d.layout.chain, ...d.layout.up, ...d.layout.down];
  const lastN = onTable.reduce((m, p) => Math.max(m, p.n), -1);
  const hintTile = overlay.marks.find((m) => isTile(m.square))?.square ?? null;
  const placed: PlacedTile[] = [];

  // The layout.
  const byTile = new Map(fitted.layout.tiles.map((lt) => [lt.tile, lt]));
  for (const p of onTable) {
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
        const unit = faceUp ? Math.max(small, Math.min(handUnit * 0.7, (W * 0.8) / (k * 1.15))) : small;
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

  // The boneyard (two-player Draw game) or the tiles left out (Block game), face down in two stacks on the left.
  const yardUnit = Math.max(7, small * 0.72);
  if (yardStacks) {
    d.boneyard.forEach((tile, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      placed.push({ key: tile, face: helps.openHand && !drawing(state.config) ? faceOf(tile) : null, back: BACK, x: gap + yardUnit + col * (yardUnit * 2 + 3), y: area.y + yardUnit / 2 + row * (yardUnit + 3), rotate: 0, unit: yardUnit, z: 5 + i });
    });
  }

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
    // A second tap plays it where it fits, unless it fits more than one end.
    if (ends.length === 0) choose(key, undefined);
    else if (fits.length === 1) choose(key, fits[0]);
  };
  const sel = selected && playable.has(selected) ? selected : null;
  const selFits = sel ? (playable.get(sel) ?? []) : [];
  const only = legal.length === 1 ? legal[0] : null;
  const duration = anim.playing ? Math.min(anim.duration, 420) : 240;

  // Open ends: a dashed outline where the next tile goes; a button while a lifted tile fits there.
  const spotOf = new Map(fitted.layout.ends.map((spot) => [spot.end, spot]));
  const endMarks = ends.map(({ end, value }) => {
    const spot = spotOf.get(end);
    if (!spot) return null;
    const usable = sel !== null && selFits.includes(end) && acting;
    const flat = spot.rotate === 0 || spot.rotate === 180;
    const w = (flat ? 2 : 1) * u;
    const h = (flat ? 1 : 2) * u;
    const style = { left: `${cx + spot.x * u - w / 2}px`, top: `${cy + spot.y * u - h / 2}px`, width: `${w}px`, height: `${h}px` };
    return usable ? (
      <button key={end} type="button" className="line-end" data-usable="true" style={style} aria-label={t('dominoes.play-on', { tile: tileLabel(sel), end: endName(end, value) })} onClick={() => choose(sel, end)}>
        <span className="num">{value}</span>
      </button>
    ) : (
      <span key={end} className="line-end" style={style} aria-hidden="true">
        <span className="num">{value}</span>
      </span>
    );
  });

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
    const columnTop = H / 2 - 4 - ((d.hands[seat]?.length ?? 0) / 2) * small * 1.2;
    const style =
      where === 'bottom'
        ? { left: '50%', bottom: `${gap / 2}px`, transform: 'translateX(-50%)' }
        : where === 'top'
          ? { left: '50%', top: `${gap / 2}px`, transform: 'translateX(-50%)' }
          : where === 'left'
            ? { left: `${gap / 2}px`, bottom: `${H - columnTop + 4}px`, maxWidth: `${sideW - gap / 2}px` }
            : { right: `${gap / 2}px`, bottom: `${H - columnTop + 4}px`, maxWidth: `${sideW - gap / 2}px` };
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
  const side = sideOf(me, n);
  const fives = state.config.fives === 'on';
  // The points a play scores, beside the tile as it lands.
  const scoredPlay = playing?.type === 'play' && (playing.scored ?? 0) > 0 ? playing : null;
  const scoredSpot = scoredPlay ? byTile.get(scoredPlay.tile) : undefined;
  const handOverText = (): string => {
    if (!handEnd) return '';
    if (handEnd.reason === 'target') return t(handEnd.winner === side ? 'dominoes.hand.we-target' : 'dominoes.hand.they-target', { n: handEnd.points[handEnd.winner ?? 0] ?? 0 });
    if (handEnd.winner === null) return handEnd.split ? t('dominoes.hand.split', { n: handEnd.points[handEnd.split[0] ?? 0] ?? 0 }) : t('dominoes.hand.tie');
    const n2 = handEnd.points[handEnd.winner] ?? 0;
    if (sideCount(n) > 2 && handEnd.winner !== side) return t(handEnd.reason === 'domino' ? 'dominoes.hand.other-domino' : 'dominoes.hand.other-block', { who: seatName(handEnd.winner, me, n), n: n2 });
    return t(handEnd.winner === side ? (handEnd.reason === 'domino' ? 'dominoes.hand.we-domino' : 'dominoes.hand.we-block') : handEnd.reason === 'domino' ? 'dominoes.hand.they-domino' : 'dominoes.hand.they-block', { n: n2 });
  };
  const yardLabel = drawing(state.config) ? t('dominoes.boneyard', { n: d.boneyard.length }) : d.boneyard.length > 0 ? t('dominoes.sleeping', { n: d.boneyard.length }) : null;

  return (
    <div ref={ref} className="card-table domino-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null}>
      {W > 0 ? <TileLayer tiles={placed} duration={duration} onTile={onTile} /> : null}
      {W > 0 ? endMarks : null}
      {ends.length === 0 && acting && W > 0 ? (
        <span className="line-end" style={{ left: `${area.x + area.w / 2 - u}px`, top: `${area.y + area.h / 2 - u / 2}px`, width: `${2 * u}px`, height: `${u}px` }} aria-hidden="true" />
      ) : null}
      {labels}
      {yardLabel ? (
        <div className="yard-tag num" style={yardStacks ? { left: `${gap}px`, top: `${area.y - labelH}px` } : { left: `${sideW + gap}px`, top: `${gap / 2}px` }}>
          {yardLabel}
        </div>
      ) : null}
      {fives && ends.length > 0 ? (
        <div className="count-tag num" data-scores={endsCount(d.layout) % 5 === 0 && endsCount(d.layout) > 0} style={{ right: `${sideW + gap}px`, top: `${n === 2 ? area.y - labelH : gap / 2}px` }} aria-label={t('dominoes.count.label', { n: endsCount(d.layout) })}>
          {t('dominoes.count', { n: endsCount(d.layout) })}
        </div>
      ) : null}
      {scoredPlay && scoredSpot && W > 0 ? (
        <div className="score-pop num" role="status" style={{ left: `${cx + scoredSpot.x * u}px`, top: `${cy + scoredSpot.y * u - u * 1.4}px` }}>
          {t('dominoes.scored', { n: scoredPlay.scored ?? 0 })}
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
        <p className="table-tip">{ends.length > 0 && selFits.length > 1 ? t('dominoes.choose-end') : t('dominoes.tap-again')}</p>
      ) : null}
      {handEnd ? (
        <div className="hand-over domino-hand-over" role="status">
          {handOverText()}
        </div>
      ) : null}
    </div>
  );
}
