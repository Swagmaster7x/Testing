/**
 * The mahjong table (PLAN.md 1.4, milestone 9). You sit at the bottom; play passes to the right,
 * so the next player is on your right, the one after across from you, the last on your left.
 * Each player's discards lie in front of them round the middle, where the round and the wall
 * are shown. Hidden hands, melds and flowers sit at the edges; your own hand runs along the
 * bottom with your melds beside it.
 *
 * Tap a tile to lift it, tap it again to discard it. When a discard can be called, a prompt above
 * your hand says what each call takes. At the end of a hand every hand is shown, with the
 * winner's faan line by line and the payments (with "Score hands for me" off, you count the faan
 * first).
 *
 * What is drawn lags the rules by the events still queued (as on every table): a discard the
 * rules have made stays in the hand until its event plays, then slides to the discards.
 */
import type { CSSProperties } from 'react';
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import { useSize } from '../../../kits/cards/CardLayer';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { Discard, HandResult, MahjongAction, MahjongEvent, MahjongState } from '../core/engine';
import { seatWind } from '../core/engine';
import type { Meld } from '../core/style';
import type { Kind, TileId } from '../core/tiles';
import { codeOf, kindOf, sortTiles } from '../core/tiles';
import { evaluateDiscards, picture } from '../strategy';
import { viewOf } from '../rules';
import { kindName, patternName, relative, runName, seatName, tileName, whoName, windName } from './names';
import { TileBack, TileFace } from './tiles';
import './mahjong.css';

// What the table shows, lagging the rules by the queued events

interface Display {
  readonly hands: TileId[][];
  readonly melds: Meld[][];
  readonly discards: Discard[][];
  readonly bonus: TileId[][];
  readonly wall: number;
  readonly drawn: TileId | null;
}

export function displayOf(state: MahjongState, pending: readonly MahjongEvent[]): Display {
  const hands = state.hands.map((h) => [...h]);
  const melds = state.melds.map((m) => [...m]);
  const discards = state.discards.map((d) => [...d]);
  const bonus = state.bonus.map((b) => [...b]);
  let wall = state.wall.length;
  let drawn = state.drawn;
  const take = (list: TileId[], tile: TileId) => {
    const i = list.lastIndexOf(tile);
    if (i >= 0) list.splice(i, 1);
  };
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'deal':
        return { hands, melds, discards, bonus, wall, drawn };
      case 'draw':
        take(hands[e.seat] as TileId[], e.tile);
        wall++;
        if (drawn === e.tile) drawn = null;
        break;
      case 'bonus':
        take(bonus[e.seat] as TileId[], e.tile);
        (hands[e.seat] as TileId[]).push(e.tile);
        break;
      case 'discard': {
        const list = discards[e.seat] as Discard[];
        const i = list.findIndex((d) => d.tile === e.tile);
        if (i >= 0) list.splice(i, 1);
        (hands[e.seat] as TileId[]).push(e.tile);
        drawn = e.tile;
        break;
      }
      case 'call': {
        const list = melds[e.seat] as Meld[];
        const i = list.findIndex((m) => m.tiles.includes(e.tile));
        if (i >= 0) list.splice(i, 1);
        for (const tile of e.meld.tiles) if (tile !== e.tile) (hands[e.seat] as TileId[]).push(tile);
        const from = discards[e.from] as Discard[];
        const j = from.findIndex((d) => d.tile === e.tile);
        if (j >= 0) from[j] = { tile: e.tile, claimed: false };
        break;
      }
      case 'kong': {
        const list = melds[e.seat] as Meld[];
        const i = list.findIndex((m) => m.tiles.includes(e.meld.tiles[0] as TileId));
        if (e.added && i >= 0) {
          const m = list[i] as Meld;
          const added = e.meld.tiles[e.meld.tiles.length - 1] as TileId;
          list[i] = { ...m, type: 'pung', tiles: m.tiles.filter((x) => x !== added), added: false };
          (hands[e.seat] as TileId[]).push(added);
        } else if (i >= 0) {
          list.splice(i, 1);
          (hands[e.seat] as TileId[]).push(...e.meld.tiles);
        }
        break;
      }
      case 'win':
        if (e.win.from !== null && !e.win.robbed) {
          take(hands[e.win.seat] as TileId[], e.win.tile);
          const from = discards[e.win.from] as Discard[];
          const j = from.findIndex((d) => d.tile === e.win.tile);
          if (j >= 0) from[j] = { tile: e.win.tile, claimed: false };
        }
        break;
      default:
        break;
    }
  }
  return { hands, melds, discards, bonus, wall, drawn };
}

// Tiles on the table

const BW = 60;
const BH = 80;

interface Placed {
  readonly key: string;
  /** The kind shown face up, or null for a tile face down. */
  readonly kind: Kind | null;
  /** Centre, in pixels. */
  readonly x: number;
  readonly y: number;
  /** Width in pixels (the tile is four thirds as tall). */
  readonly w: number;
  readonly z: number;
  /** Degrees: 90 for a tile lying on its side. */
  readonly rotate?: number;
  readonly label?: string;
  readonly interactive?: boolean;
  readonly selected?: boolean;
  readonly tone?: 'hint' | 'last' | 'win' | null;
  readonly dim?: boolean;
  /** A small number shown above the tile (the efficiency helper). */
  readonly note?: string;
}

function TileLayer({ tiles, duration, learner, onTile }: { tiles: readonly Placed[]; duration: number; learner: boolean; onTile: (key: string) => void }) {
  return (
    <>
      {tiles.map((p) => {
        const scale = p.w / BW;
        const lift = p.selected ? p.w * 0.32 : 0;
        const style = {
          width: `${BW}px`,
          height: `${BH}px`,
          zIndex: p.z,
          transform: `translate(${p.x - BW / 2}px, ${p.y - BH / 2 - lift}px) rotate(${p.rotate ?? 0}deg) scale(${scale})`,
          transitionDuration: `${duration}ms`,
        };
        const inner = p.kind === null ? <TileBack /> : <TileFace kind={p.kind} learner={learner} />;
        const note = p.note ? <span className="mj-note num">{p.note}</span> : null;
        if (p.interactive) {
          return (
            <button key={p.key} type="button" className="mj-tile" data-selected={p.selected === true} data-tone={p.tone ?? undefined} data-dim={p.dim === true} aria-label={p.label} aria-pressed={p.selected === true} style={style} onClick={() => onTile(p.key)}>
              {inner}
              {note}
            </button>
          );
        }
        return (
          <div key={p.key} className="mj-tile" data-tone={p.tone ?? undefined} data-dim={p.dim === true} role={p.label ? 'img' : undefined} aria-label={p.label} aria-hidden={p.label ? undefined : true} style={style}>
            {inner}
            {note}
          </div>
        );
      })}
    </>
  );
}

/** A small tile drawn inline (prompts, the result panel, the coach). */
export function MiniTile({ kind, learner = true, width = 22 }: { kind: Kind | null; learner?: boolean; width?: number }) {
  return (
    <span className="mj-mini" style={{ width: `${width}px`, height: `${(width * 4) / 3}px` }} aria-hidden="true">
      {kind === null ? <TileBack /> : <TileFace kind={kind} learner={learner} />}
    </span>
  );
}

export function MahjongSeatMark({ seat }: { seat: Seat }) {
  const colours = ['#c9a25a', '#8fb3a3', '#c27c6b', '#9aa6c9'];
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="5" y="2.5" width="14" height="19" rx="3" fill="#f7f1e3" stroke="#bfae8c" />
      <rect x="5" y="17.5" width="14" height="4" rx="2" fill="#1f4d3d" />
      <circle cx="12" cy="10" r="4" fill={colours[seat] ?? '#c9a25a'} />
    </svg>
  );
}

// The prompt when you may call a discard, and the buttons on your own turn

function callTiles(action: MahjongAction, tile: Kind): Kind[] {
  if (action.type === 'chow') return [action.start, action.start + 1, action.start + 2];
  if (action.type === 'pung') return [tile, tile, tile];
  if (action.type === 'kong') return [tile, tile, tile, tile];
  return [tile];
}

function ClaimPrompt({ state, me, legal, learner, onAction }: { state: MahjongState; me: Seat; legal: readonly MahjongAction[]; learner: boolean; onAction: (a: MahjongAction) => void }) {
  const claim = state.claim;
  if (!claim) return null;
  const tile = kindOf(claim.tile);
  const rob = claim.kind === 'rob';
  return (
    <div className="mj-prompt" role="group" aria-label={t(rob ? 'mahjong.claim.rob' : 'mahjong.claim.title', { who: whoName(claim.from, me), tile: kindName(tile) })}>
      <p className="mj-prompt-title">
        {t(rob ? 'mahjong.claim.rob' : 'mahjong.claim.title', { who: whoName(claim.from, me), tile: kindName(tile) })}
        <MiniTile kind={tile} learner={learner} width={20} />
      </p>
      <div className="mj-prompt-row">
        {legal.map((a) => {
          if (a.type === 'pass') return null;
          const label = a.type === 'win' ? t(rob ? 'mahjong.claim.rob-win' : 'mahjong.claim.win') : a.type === 'chow' ? `${t('mahjong.claim.chow')} ${runName(a.start)}` : t(a.type === 'pung' ? 'mahjong.claim.pung' : 'mahjong.claim.kong');
          const detail = a.type === 'win' ? t('mahjong.claim.win.detail') : a.type === 'chow' ? t('mahjong.claim.chow.detail') : t(a.type === 'pung' ? 'mahjong.claim.pung.detail' : 'mahjong.claim.kong.detail');
          return (
            <button key={a.type === 'chow' ? `chow${a.start}` : a.type} type="button" className="btn btn-small mj-call" data-call={a.type} aria-label={label} title={detail} onClick={() => onAction(a)}>
              <span className="mj-call-label">{label}</span>
              <span className="mj-call-tiles">
                {callTiles(a, tile).map((k, i) => (
                  <span key={i} className="mj-call-tile" data-claimed={k === tile && (a.type !== 'chow' || i === callTiles(a, tile).indexOf(tile))}>
                    <MiniTile kind={k} learner={learner} width={16} />
                  </span>
                ))}
              </span>
            </button>
          );
        })}
        <button type="button" className="btn btn-small btn-quiet mj-call" data-call="pass" onClick={() => onAction({ type: 'pass' })}>
          {t('mahjong.claim.pass')}
        </button>
      </div>
    </div>
  );
}

function OwnTurnButtons({ legal, counts, onAction }: { legal: readonly MahjongAction[]; counts: readonly number[]; onAction: (a: MahjongAction) => void }) {
  const win = legal.find((a) => a.type === 'win');
  const kongs = legal.filter((a): a is { type: 'kong'; tile: Kind } => a.type === 'kong' && a.tile !== undefined);
  if (!win && kongs.length === 0) return null;
  return (
    <div className="mj-own">
      {win ? (
        <button type="button" className="btn btn-small btn-primary" onClick={() => onAction(win)}>
          {t('mahjong.act.win')}
        </button>
      ) : null}
      {kongs.map((a) => (
        <button key={a.tile} type="button" className="btn btn-small" title={t((counts[a.tile] ?? 0) === 4 ? 'mahjong.act.kong.concealed' : 'mahjong.act.kong.added')} onClick={() => onAction(a)}>
          {t('mahjong.act.kong', { tile: kindName(a.tile) })}
        </button>
      ))}
    </div>
  );
}

// The end of a hand

/**
 * With "Score hands for me" off, a won hand asks you for its faan before the sheet shows, as you
 * would count it at a real table.
 */
function CountYourself({ faan, onDone }: { faan: number; onDone: (guess: number | null) => void }) {
  const [entry, setEntry] = useState('');
  const guess = entry.trim() === '' ? null : Number(entry);
  return (
    <form
      className="mj-count"
      onSubmit={(e) => {
        e.preventDefault();
        if (guess !== null && Number.isFinite(guess)) onDone(guess);
      }}
    >
      <span className="mj-count-ask">{t('mahjong.self.ask')}</span>
      <input className="mj-count-input num" type="number" inputMode="numeric" min={0} max={99} aria-label={t('mahjong.self.label')} value={entry} onChange={(e) => setEntry(e.target.value)} />
      <button type="submit" className="btn btn-primary btn-small" disabled={guess === null || !Number.isFinite(guess)}>
        {t('mahjong.self.check')}
      </button>
      <button type="button" className="btn btn-small btn-quiet" onClick={() => onDone(null)} data-faan={faan}>
        {t('mahjong.self.reveal')}
      </button>
    </form>
  );
}

function ResultPanel({ result, me, learner, canNext, over, onNext, selfScore }: { result: HandResult; me: Seat; learner: boolean; canNext: boolean; over: boolean; onNext: () => void; selfScore: boolean }) {
  const wins = result.wins;
  // Counting yourself: the guess for the first winner's faan, once given (undefined before).
  const [counted, setCounted] = useState<number | null | undefined>(undefined);
  const asking = selfScore && wins.length > 0 && counted === undefined;
  const first = wins[0];
  return (
    <div className="mj-result" role="status" aria-label={t('mahjong.result.payments')}>
      {wins.length === 0 ? <h2>{t('mahjong.result.draw')}</h2> : null}
      {wins.map((w) => {
        const how = w.from === null ? t('mahjong.result.self') : w.robbed ? t('mahjong.result.robbed', { from: whoName(w.from, me) }) : t('mahjong.result.discard', { from: whoName(w.from, me) });
        const hand = result.hands[w.seat] ?? [];
        const concealed = sortTiles(hand.includes(w.tile) ? hand : [...hand, w.tile]);
        return (
          <div key={w.seat} className="mj-result-win">
            <h2>{w.seat === me ? t('mahjong.result.win.you', { how }) : t('mahjong.result.win', { who: seatName(w.seat, me), how })}</h2>
            <div className="mj-result-hand" aria-label={concealed.map(tileName).join(', ')}>
              {concealed.map((id) => (
                <span key={id} className="mj-result-tile" data-win={id === w.tile}>
                  <MiniTile kind={kindOf(id)} learner={learner} width={19} />
                </span>
              ))}
              {(result.melds[w.seat] ?? []).map((m, i) => (
                <span key={i} className="mj-result-meld">
                  {m.tiles.map((id) => (
                    <MiniTile key={id} kind={m.concealed && m.tiles.indexOf(id) % 3 === 0 ? null : kindOf(id)} learner={learner} width={16} />
                  ))}
                </span>
              ))}
              {(result.bonus[w.seat] ?? []).length > 0 ? (
                <span className="mj-result-meld">
                  {(result.bonus[w.seat] ?? []).map((id) => (
                    <MiniTile key={id} kind={kindOf(id)} learner={learner} width={14} />
                  ))}
                </span>
              ) : null}
            </div>
            {asking && w === first ? <CountYourself faan={w.score.total} onDone={setCounted} /> : null}
            {selfScore && w === first && counted !== undefined && counted !== null ? (
              <p className="mj-count-verdict" data-right={counted === w.score.total}>
                {counted === w.score.total ? t('mahjong.self.right', { n: w.score.total }) : t('mahjong.self.wrong', { guess: counted, n: w.score.total })}
              </p>
            ) : null}
            {asking ? null : (
            <ul className="mj-faan">
              {w.score.lines.length === 0 ? <li>{t('mahjong.result.chicken')}</li> : null}
              {w.score.lines.map((l) => (
                <li key={l.id}>
                  <span>
                    {patternName(l.id)}
                    {l.times && l.times > 1 ? ` ×${l.times}` : ''}
                  </span>
                  <span className="num">{l.value}</span>
                </li>
              ))}
              <li className="mj-faan-total">
                <span>{t(w.score.limit ? 'mahjong.result.total.limit' : 'mahjong.result.total', { n: w.score.total })}</span>
                <span className="num">{t('mahjong.result.base', { n: w.score.base })}</span>
              </li>
            </ul>
            )}
          </div>
        );
      })}
      {asking ? null : (
        <div className="mj-pay">
          <span className="mj-pay-title">{over ? t('mahjong.result.game-over') : t('mahjong.result.payments')}</span>
          {result.deltas.map((d, seat) => (
            <span key={seat} className="num" data-sign={d > 0 ? 'up' : d < 0 ? 'down' : 'none'}>
              {seatName(seat, me)} {d > 0 ? `+${d}` : d}
            </span>
          ))}
        </div>
      )}
      {canNext && !asking ? (
        <button type="button" className="btn btn-primary btn-small mj-next" onClick={onNext}>
          {t('mahjong.next')}
        </button>
      ) : null}
    </div>
  );
}

// The table

type Where = 'bottom' | 'right' | 'top' | 'left';
const WHERE: readonly Where[] = ['bottom', 'right', 'top', 'left'];

export function MahjongSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, overlay }: SurfaceProps<MahjongState, MahjongAction, MahjongEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [selected, setSelected] = useState<TileId | null>(null);
  const me: Seat = mySeats[0] ?? 0;
  const learner = helps.learner !== false;
  const pending = anim.pending.map((p) => p.event);
  const playing = anim.playing?.event ?? null;
  const d = displayOf(state, playing ? [playing, ...pending] : pending);
  const busy = anim.playing !== null || anim.pending.length > 0;
  const ended = state.phase === 'scored' && !busy;
  const showAll = helps.openHand === true || state.phase === 'scored';
  const W = size.width;
  const H = size.height;
  const acting = canAct && !busy;
  const myTurn = acting && state.phase === 'act' && state.turn === me;
  const claiming = acting && (state.phase === 'claim' || state.phase === 'rob');

  // Sizes: your hand as large as the width allows; everything else scaled from the space left.
  const myHand = sortTiles((d.hands[me] ?? []).filter((x) => x !== d.drawn || state.turn !== me));
  const myDrawn = d.drawn !== null && (d.hands[me] ?? []).includes(d.drawn) && state.turn === me ? d.drawn : null;
  const myMelds = d.melds[me] ?? [];
  const meldTiles = myMelds.reduce((n, m) => n + m.tiles.length, 0);
  const myBonus = d.bonus[me] ?? [];
  const units = myHand.length + (myDrawn ? 1.35 : 0) + meldTiles * 0.72 + myMelds.length * 0.3 + myBonus.length * 0.6 + 1;
  const hw = Math.max(20, Math.min(70, (W - 8) / Math.max(10, units), H * 0.135));
  const hh = (hw * 4) / 3;
  const bottomH = hh + hw * 0.4 + 6;
  const bw = Math.max(9, Math.min(28, hw * 0.48, (H - bottomH) / 21));
  const bh = (bw * 4) / 3;
  const topH = bh + 8;
  const sideW = bh + bw + 12;
  const area = { x: sideW, y: topH, w: Math.max(60, W - 2 * sideW), h: Math.max(60, H - topH - bottomH) };
  const maxDiscards = Math.max(1, ...d.discards.map((list) => list.filter((x) => !x.claimed).length));
  const rowsTB = Math.max(3, Math.ceil(maxDiscards / 8));
  const colsLR = Math.max(4, Math.ceil(maxDiscards / 6));
  const dw = Math.max(9, Math.min(44, (area.h / (2 * rowsTB + 1.25)) * 0.75, area.w / (8 + 2 * colsLR + 0.6)));
  const dh = (dw * 4) / 3;
  const cx = area.x + area.w / 2;
  const cy = area.y + area.h / 2;
  const boxW = 8 * dw;
  const boxH = dh * 1.25;
  // Held upright the box is narrow: the round and the tip take their short forms.
  const narrow = boxW < 210;

  const placed: Placed[] = [];
  // The latest discard, once it lies in the discards on the table.
  const lastDiscard = state.lastDiscard !== null && d.discards.some((list) => list.some((x) => x.tile === state.lastDiscard && !x.claimed)) ? state.lastDiscard : null;

  // Discards lie in front of each player, starting next to the middle and running to the player's
  // right (counter-clockwise round the table): rows of eight above and below it, columns of six beside it.
  for (let seat = 0; seat < 4; seat++) {
    const where = WHERE[relative(seat, me)] as Where;
    const list = (d.discards[seat] ?? []).filter((x) => !x.claimed);
    list.forEach((x, i) => {
      let px: number;
      let py: number;
      if (where === 'bottom' || where === 'top') {
        const row = Math.floor(i / 8);
        const col = where === 'bottom' ? i % 8 : 7 - (i % 8);
        px = cx - boxW / 2 + dw * (col + 0.5);
        py = where === 'bottom' ? cy + boxH / 2 + dh * (row + 0.5) + 2 : cy - boxH / 2 - dh * (row + 0.5) - 2;
      } else {
        const col = Math.floor(i / 6);
        const row = where === 'left' ? i % 6 : 5 - (i % 6);
        px = where === 'right' ? cx + boxW / 2 + dw * (col + 0.5) + 3 : cx - boxW / 2 - dw * (col + 0.5) - 3;
        py = cy - 3 * dh + dh * (row + 0.5);
      }
      placed.push({ key: x.tile, kind: kindOf(x.tile), x: px, y: py, w: dw * 0.96, z: 10 + i, label: tileName(x.tile), tone: x.tile === lastDiscard ? 'last' : null });
    });
  }

  // Other players: hidden tiles along the edge, melds and flowers beside them.
  let topRight = 0;
  for (let seat = 0; seat < 4; seat++) {
    if (seat === me) continue;
    const where = WHERE[relative(seat, me)] as Where;
    const hand = d.hands[seat] ?? [];
    const open = showAll;
    const melds = d.melds[seat] ?? [];
    const bonus = d.bonus[seat] ?? [];
    const mw = bw * 1.0;
    if (where === 'top') {
      const total = hand.length * bw + melds.reduce((n, m) => n + m.tiles.length * mw + bw * 0.4, 0) + bonus.length * mw * 0.8 + bw;
      topRight = cx + total / 2;
      let x = topRight;
      const y = 4 + bh / 2;
      // From your view the player across lays tiles right to left.
      hand.forEach((tile, i) => placed.push({ key: tile, kind: open ? kindOf(tile) : null, x: x - bw * (i + 0.5), y, w: bw * 0.96, z: 200 + i, label: open ? tileName(tile) : undefined }));
      x -= hand.length * bw + bw * 0.6;
      for (const m of melds) {
        m.tiles.forEach((tile, i) => placed.push({ key: tile, kind: m.concealed && (i === 0 || i === 3) ? null : kindOf(tile), x: x - mw * (i + 0.5), y, w: mw * 0.96, z: 220 + i, label: tileName(tile) }));
        x -= m.tiles.length * mw + bw * 0.4;
      }
      bonus.forEach((tile, i) => placed.push({ key: tile, kind: kindOf(tile), x: x - mw * 0.8 * (i + 0.5), y: y + 2, w: mw * 0.78, z: 240 + i, label: tileName(tile) }));
    } else {
      const sideX = where === 'left' ? 4 + bh / 2 : W - 4 - bh / 2;
      const span = hand.length * bw;
      // Hidden tiles stand in a column at the edge (shown lying down, as seen from your seat).
      hand.forEach((tile, i) => {
        const y = where === 'left' ? cy - span / 2 + bw * (i + 0.5) : cy + span / 2 - bw * (i + 0.5);
        placed.push({ key: tile, kind: open ? kindOf(tile) : null, x: sideX, y, w: bw * 0.96, z: 200 + i, rotate: where === 'left' ? 90 : -90, label: open ? tileName(tile) : undefined });
      });
      // Melds and flowers in a column just inside it, upright so they read easily.
      const items: { tile: TileId; kind: Kind | null; gapBefore: boolean }[] = [];
      melds.forEach((m) => m.tiles.forEach((tile, i) => items.push({ tile, kind: m.concealed && (i === 0 || i === 3) ? null : kindOf(tile), gapBefore: i === 0 && items.length > 0 })));
      bonus.forEach((tile, i) => items.push({ tile, kind: kindOf(tile), gapBefore: i === 0 && items.length > 0 }));
      // Kept between the seat tags above and below the column, and as large as that allows: a
      // player's called sets are what the others read to judge how close they are.
      const step = Math.min(bw * 1.6, (area.h - 30) / Math.max(1, items.length + melds.length * 0.3));
      const iw = step * 0.72;
      const innerX = where === 'left' ? 4 + bh + 4 + iw / 2 : W - 4 - bh - 4 - iw / 2;
      const colH = items.length * step + items.filter((x) => x.gapBefore).length * step * 0.3;
      let y = where === 'left' ? cy - colH / 2 : cy + colH / 2;
      items.forEach((item, i) => {
        if (item.gapBefore) y += (where === 'left' ? 1 : -1) * step * 0.3;
        placed.push({ key: item.tile, kind: item.kind, x: innerX, y: y + ((where === 'left' ? 1 : -1) * step) / 2, w: iw, z: 230 + i, label: tileName(item.tile) });
        y += (where === 'left' ? 1 : -1) * step;
      });
    }
  }

  // Your hand along the bottom: flowers, the hand (the drawn tile apart), your melds.
  const playable = new Set<Kind>(myTurn ? legal.filter((a) => a.type === 'discard').map((a) => (a as { tile: Kind }).tile) : []);
  const efficiency = helps.efficiency === true && myTurn && playable.size > 0 ? efficiencyNotes(state, me) : null;
  const hintKinds = new Set(overlay.marks.map((m) => m.square));
  const bonusW = hw * 0.6;
  const mmw = hw * 0.72;
  const rowW = myBonus.length * bonusW + (myBonus.length ? hw * 0.4 : 0) + myHand.length * hw + (myDrawn ? hw * 1.35 : 0) + meldTiles * mmw + myMelds.length * hw * 0.3;
  let x = Math.max(4, W / 2 - rowW / 2);
  const handY = H - 4 - hh / 2;
  myBonus.forEach((tile, i) => placed.push({ key: tile, kind: kindOf(tile), x: x + bonusW * (i + 0.5), y: handY + hh / 2 - (bonusW * 4) / 6, w: bonusW * 0.94, z: 300 + i, label: tileName(tile) }));
  x += myBonus.length * bonusW + (myBonus.length ? hw * 0.4 : 0);
  const mine = (tile: TileId, i: number, px: number) => {
    const kind = kindOf(tile);
    const can = playable.has(kind);
    const note = efficiency?.get(kind);
    placed.push({
      key: tile,
      kind,
      x: px,
      y: handY,
      w: hw * 0.96,
      z: 320 + i,
      label: tileName(tile),
      interactive: can,
      selected: can && selected === tile,
      tone: hintKinds.has(codeOf(kind)) || note?.best ? 'hint' : null,
      ...(note ? { note: note.text } : {}),
    });
  };
  myHand.forEach((tile, i) => mine(tile, i, x + hw * (i + 0.5)));
  x += myHand.length * hw;
  if (myDrawn) {
    mine(myDrawn, myHand.length, x + hw * 0.35 + hw * 0.5);
    x += hw * 1.35;
  }
  x += hw * 0.3;
  myMelds.forEach((m) => {
    m.tiles.forEach((tile, i) => placed.push({ key: tile, kind: m.concealed && (i === 0 || i === 3) ? null : kindOf(tile), x: x + mmw * (i + 0.5), y: handY + (hh - (mmw * 4) / 3) / 2, w: mmw * 0.96, z: 360 + i, label: tileName(tile) }));
    x += m.tiles.length * mmw + hw * 0.3;
  });

  const onTile = (key: string) => {
    if (!myTurn) return;
    const kind = kindOf(key);
    if (!playable.has(kind)) return;
    if (selected !== key) {
      setSelected(key);
      return;
    }
    setSelected(null);
    onAction({ type: 'discard', tile: kind });
  };

  const duration = anim.playing ? Math.min(anim.duration, 420) : 240;
  const result = state.phase === 'scored' ? state.results[state.results.length - 1] : null;
  const showResult = result && (ended || playing?.type === 'hand-end' || playing?.type === 'game-end');
  const view = viewOf(state, me);
  const turnSeat = !busy && state.phase === 'act' ? state.turn : null;

  // Seat tags: name, wind, dealer, score. On a narrow table the tag across would cover that
  // player's rack, so it moves just below it (a rough width from its text is enough).
  const tagWidth = (seat: number) => `${seatName(seat, me)} ${windName(seatWind(seat, state.dealer))} ${state.scores[seat] ?? 0}`.length * 6.5 + 26 + (seat === state.dealer ? 52 : 0);
  const acrossLow = topRight + 6 > W - sideW - 4 - tagWidth((me + 2) % 4);
  const tags = [0, 1, 2, 3].map((seat) => {
    const where = WHERE[relative(seat, me)] as Where;
    const wind = windName(seatWind(seat, state.dealer));
    const style =
      where === 'bottom'
        ? { left: `${sideW + 4}px`, bottom: `${hh + hw * 0.55 + 8}px` }
        : where === 'top'
          ? { right: `${sideW + 4}px`, top: acrossLow ? `${topH + 2}px` : '2px' }
          : where === 'left'
            ? { left: `${bh + bw + 14}px`, top: `${topH + 2}px` }
            : { right: `${bh + bw + 14}px`, bottom: `${bottomH + 2}px` };
    return (
      <div key={seat} className="mj-seat" data-where={where} data-turn={turnSeat === seat} style={style}>
        <span>{seatName(seat, me)}</span>
        <span className="mj-seat-wind">{wind}</span>
        {seat === state.dealer ? <span className="mj-dealer" title={t('mahjong.dealer')}>{t('mahjong.dealer')}</span> : null}
        <span className="num mj-seat-score">{state.scores[seat] ?? 0}</span>
      </div>
    );
  });

  return (
    <div ref={ref} className="card-table mj-table" style={{ '--mj-hand': `${hh + 6}px` } as CSSProperties} onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null}>
      {W > 0 ? (
        <div className="mj-centre" style={{ left: `${cx - boxW / 2}px`, top: `${cy - boxH / 2}px`, width: `${boxW}px`, height: `${boxH}px` }}>
          <span className="mj-centre-round">
            {narrow ? t('mahjong.round-short', { wind: windName(state.round), n: state.handNo + 1 }) : `${t('mahjong.round', { wind: windName(state.round) })} · ${t('mahjong.hand-no', { n: state.handNo + 1 })}`} · <span className="num">{t('mahjong.wall', { n: d.wall })}</span>
          </span>
          {myTurn && !claiming ? (
            <span className="mj-centre-tip">
              {selected && playable.has(kindOf(selected)) ? t(narrow ? 'mahjong.tap-again-short' : 'mahjong.tap-again') : state.claimed ? t('mahjong.after-call') : t(narrow ? 'mahjong.your-discard-short' : 'mahjong.your-discard')}
            </span>
          ) : null}
        </div>
      ) : null}
      {W > 0 ? <TileLayer tiles={placed} duration={duration} learner={learner} onTile={onTile} /> : null}
      {W > 0 ? tags : null}
      {claiming ? <ClaimPrompt state={state} me={me} legal={legal} learner={learner} onAction={onAction} /> : null}
      {myTurn ? <OwnTurnButtons legal={legal} counts={view.hand.reduce<number[]>((c, id) => { c[kindOf(id)] = (c[kindOf(id)] ?? 0) + 1; return c; }, new Array<number>(34).fill(0))} onAction={onAction} /> : null}
      {showResult && result ? <ResultPanel key={state.results.length} result={result} me={me} learner={learner} canNext={acting && legal.some((a) => a.type === 'next')} over={state.over} onNext={() => onAction({ type: 'next' })} selfScore={helps.autoScore === false} /> : null}
    </div>
  );
}

/** For each kind you may discard: the useful tiles left after it, marked best when it keeps the hand fastest. */
function efficiencyNotes(state: MahjongState, me: Seat): Map<Kind, { text: string; best: boolean }> {
  const p = picture(viewOf(state, me));
  const evals = evaluateDiscards(p);
  const fastest = Math.min(...evals.map((e) => e.shanten));
  const most = Math.max(...evals.filter((e) => e.shanten === fastest).map((e) => e.accept));
  const out = new Map<Kind, { text: string; best: boolean }>();
  for (const e of evals) out.set(e.kind, { text: e.shanten === fastest ? String(e.accept) : '–', best: e.shanten === fastest && e.accept === most });
  return out;
}
