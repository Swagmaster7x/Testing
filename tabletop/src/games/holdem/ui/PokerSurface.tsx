/**
 * The poker table: up to six seats round an oval, you at the bottom, the board and the pot in the
 * middle, each seat's bet in front of it, and your bet controls in the bottom corner. Seats go
 * clockwise, so the next player (on your left) sits to the left of the screen. The same table plays
 * Omaha (four hole cards), Five-Card Draw (five, and the draw: tap the cards to throw away) and
 * Seven-Card Stud (each seat's face-down cards, then its face-up cards in a row).
 *
 * What is drawn lags the rules by the events still queued: `displayOf` starts from the state and
 * undoes the queued events one by one, last first, so each chip and card moves as its event plays.
 */
import type { CSSProperties } from 'react';
import type { Seat } from '../../../core/contract';
import type { PlacedCard } from '../../../kits/cards/CardLayer';
import { CardLayer, useSize } from '../../../kits/cards/CardLayer';
import { FrenchCardBack, FrenchCardFace } from '../../../kits/cards/french';
import type { BetOption } from '../../../kits/chips/ChipKit';
import { BetControls, ChipStack } from '../../../kits/chips/ChipKit';
import { t, tDynamic } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { Card } from '../cards';
import { useState } from 'react';
import { cardIndex } from '../cards';
import { readHand } from '../reading';
import type { HandResult, HoldemAction, HoldemEvent, HoldemState, LogKind } from '../rules';
import { bringInDue, potOf, raiseTargets, toCallOf } from '../rules';
import { highValue, lowName, lowValue } from '../showdown';
import { cardName, handName, handNameInline, seatName } from './names';
import './poker.css';

interface SeatShow {
  stack: number;
  bet: number;
  folded: boolean;
  /** Hole cards to draw: a card face up, or null for one face down. */
  cards: (Card | null)[];
  /** Stud: the cards dealt face up. */
  up: Card[];
  label: LogKind | null;
  /** Draw: how many cards the seat drew this hand, for its label. */
  drew: number | null;
  out: boolean;
  won: number;
}

export interface TableShow {
  board: Card[];
  /** Chips in the middle (not in front of anyone). */
  middle: number;
  button: Seat;
  handNo: number;
  seats: SeatShow[];
  /** The hand just finished, while its end is shown. */
  ended: HandResult | null;
}

const backs = (n: number): null[] => Array.from({ length: n }, () => null);

/** The table as it looks before the queued events play. */
export function displayOf(state: HoldemState, pending: readonly HoldemEvent[], me: Seat, open: boolean): TableShow {
  const ended = state.over ? state.lastHand : null;
  const shown = (seat: Seat) => (ended ? (ended.shown[seat] ?? null) : null);
  const seats: SeatShow[] = state.players.map((p, i) => {
    const visible = i === me || open || shown(i) !== null;
    const last = [...state.log].reverse().find((e) => e.seat === i && e.street === state.street && e.kind !== 'ante');
    return {
      stack: p.stack,
      bet: p.bet,
      folded: p.folded,
      cards: p.hole.length === 0 || p.folded ? [] : visible ? [...p.hole] : backs(p.hole.length),
      up: p.folded ? [] : [...p.up],
      label: last?.kind ?? null,
      drew: last?.kind === 'draw' ? (last.drew ?? 0) : null,
      out: p.out,
      won: 0,
    };
  });
  /** A seat's hole cards as drawn: face up for you (as `own`) or with the cards up, otherwise backs. */
  const holeOf = (seat: Seat, own: readonly Card[]): (Card | null)[] => (seat === me ? [...own] : open ? [...(state.players[seat]?.hole ?? [])] : backs(state.players[seat]?.hole.length ?? 2));
  const d: TableShow = { board: [...state.board], middle: potOf(state) - state.players.reduce((a, p) => a + p.bet, 0), button: state.button, handNo: state.handNo, seats, ended };
  let mine: readonly Card[] = state.players[me]?.hole ?? [];
  const at = (seat: Seat): SeatShow => d.seats[seat] as SeatShow;
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'post': {
        const s = at(e.seat);
        s.stack += e.amount;
        if (e.kind === 'ante') d.middle -= e.amount;
        else s.bet -= e.amount;
        s.label = null;
        break;
      }
      case 'hole':
        for (const seat of e.seats) {
          at(seat).cards = [];
          at(seat).up = [];
        }
        break;
      case 'up':
        for (const { seat } of e.cards) at(seat).up.pop();
        break;
      case 'down':
        for (const seat of e.seats) at(seat).cards.pop();
        break;
      case 'drew': {
        const s = at(e.seat);
        if (e.seat === me) {
          mine = e.before;
          s.cards = [...e.before];
        }
        s.label = null;
        s.drew = null;
        break;
      }
      case 'deal': {
        // Back to the end of the last hand: its board, the hands shown, the chips just won.
        const prev = e.previous;
        d.board = prev ? [...prev.board] : [];
        d.button = prev?.button ?? d.button;
        d.middle = 0;
        d.handNo = e.handNo - 1;
        d.ended = prev;
        mine = e.holes[me] ?? [];
        d.seats.forEach((s, i) => {
          const held = e.holes[i] ?? [];
          const showed = prev?.shown[i] ?? null;
          const stayed = prev ? prev.order.includes(i) || (prev.reason === 'fold' && prev.pots.some((pot) => pot.winners.includes(i))) : false;
          s.bet = 0;
          s.label = null;
          s.drew = null;
          s.up = [];
          s.won = prev ? prev.pots.reduce((sum, pot) => sum + pot.winners.reduce((w, seat, k) => w + (seat === i ? (pot.shares[k] ?? 0) : 0), 0), 0) : 0;
          if (showed) s.cards = [...showed];
          else if (stayed && held.length > 0) s.cards = i === me || open ? [...held] : backs(held.length);
          else s.cards = [];
          s.folded = held.length > 0 && !stayed;
        });
        break;
      }
      case 'act': {
        const s = at(e.seat);
        s.stack += e.amount;
        s.bet -= e.amount;
        s.label = null;
        if (e.kind === 'fold') {
          s.folded = false;
          s.cards = holeOf(e.seat, mine);
          s.up = [...(state.players[e.seat]?.up ?? [])];
        }
        break;
      }
      case 'collect':
        e.bets.forEach((b, i) => {
          at(i).bet += b;
          d.middle -= b;
        });
        break;
      case 'board':
        d.board.splice(d.board.length - e.cards.length);
        break;
      case 'show':
        if (e.seat !== me && !open) at(e.seat).cards = holeOf(e.seat, mine);
        break;
      case 'muck':
        at(e.seat).cards = holeOf(e.seat, mine);
        at(e.seat).up = [...(state.players[e.seat]?.up ?? [])];
        break;
      case 'return':
        at(e.seat).stack -= e.amount;
        d.middle += e.amount;
        break;
      case 'win':
        at(e.seat).stack -= e.amount;
        at(e.seat).won -= e.amount;
        d.middle += e.amount;
        break;
      case 'rebuy':
        at(e.seat).stack -= e.amount;
        break;
      case 'hand-end':
        d.ended = null;
        break;
      case 'bust':
        at(e.seat).out = false;
        break;
      default:
        break;
    }
  }
  return d;
}

/** Where each seat sits, as fractions of the table, by its place counted clockwise from you. */
function seatSpots(n: number): readonly (readonly [number, number])[] {
  if (n === 2) return [
    [0.5, 0.86],
    [0.5, 0.12],
  ];
  return [
    [0.5, 0.86],
    [0.13, 0.63],
    [0.16, 0.17],
    [0.5, 0.1],
    [0.84, 0.17],
    [0.87, 0.63],
  ];
}

const face = (card: Card) => <FrenchCardFace card={card} />;
const BACK = <FrenchCardBack />;

export function PokerSeatMark({ seat }: { seat: Seat }) {
  const colours = ['#e7c27a', '#c0392b', '#1d63b8', '#2b7a35', '#7d4fa8', '#d9822b'];
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill={colours[seat % colours.length]} stroke="rgb(0 0 0 / 0.5)" />
      <circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff" strokeWidth="1.6" strokeDasharray="2.2 2.2" />
    </svg>
  );
}

/** The bet presets: in big blinds before the flop, in parts of the pot after it. */
function presetsFor(state: HoldemState, seat: Seat, min: number, max: number): BetOption[] {
  const p = state.players[seat];
  if (!p) return [];
  const bb = state.blinds.bb;
  const pot = potOf(state);
  const owe = toCallOf(state, seat);
  const out: BetOption[] = [{ to: min, label: t('poker.preset.min') }];
  const opened = state.log.some((e) => e.street === state.street && (e.kind === 'raise' || e.kind === 'bet' || e.kind === 'bring-in' || e.kind === 'complete'));
  if (state.street === 'preflop' && !opened) {
    for (const x of [2.5, 3, 4]) out.push({ to: x * bb, label: t('poker.preset.bb', { n: x }) });
  } else if (state.street === 'preflop') {
    out.push({ to: state.currentBet * 3, label: t('poker.preset.times', { n: 3 }) });
  }
  for (const [f, key] of [
    [1 / 3, 'poker.preset.third'],
    [1 / 2, 'poker.preset.half'],
    [2 / 3, 'poker.preset.two-thirds'],
    [1, 'poker.preset.pot'],
  ] as const) {
    if (state.street === 'preflop' && f < 1) continue;
    if (state.config.betting === 'pot-limit' && f === 1) continue;
    out.push({ to: Math.round(state.currentBet + f * (pot + owe)), label: t(key) });
  }
  out.push({ to: max, label: max >= p.bet + p.stack ? t('poker.preset.all-in') : t('poker.preset.pot') });
  // Keep the presets that make sense here, each once, in order of size.
  const seen = new Set<number>();
  return out
    .map((o) => ({ ...o, to: Math.max(min, Math.min(max, o.to)) }))
    .filter((o) => (seen.has(o.to) ? false : (seen.add(o.to), true)))
    .sort((a, b) => a.to - b.to);
}

export function PokerSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, reveal, names }: SurfaceProps<HoldemState, HoldemAction, HoldemEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const me: Seat = mySeats[0] ?? 0;
  const open = helps.openHand === true;
  const pending = anim.pending.map((p) => p.event);
  const d = displayOf(state, pending, me, open);
  const playing = anim.playing?.event ?? null;
  const W = size.width;
  const H = size.height;
  const n = state.players.length;
  const spots = seatSpots(n);
  const spotOf = (seat: Seat) => spots[(seat - me + n) % n] ?? [0.5, 0.5];
  const boardW = Math.max(26, Math.min(W * 0.068, H * 0.13));
  const boardH = boardW * 1.5;
  const cx = W / 2;
  const boardY = H * 0.43;
  const placed: PlacedCard[] = [];
  const settledNow = anim.playing === null && pending.length === 0;
  // Draw: the cards picked to throw away, until the draw is made.
  const [picked, setPicked] = useState<{ key: string; cards: Card[] }>({ key: '', cards: [] });
  const drawKey = `${state.handNo}/${state.log.length}`;
  const chosen = picked.key === drawKey ? picked.cards : [];
  const toggle = (key: string) => {
    const card = key as Card;
    if (!state.players[me]?.hole.includes(card)) return;
    const next = chosen.includes(card) ? chosen.filter((c) => c !== card) : chosen.length < state.config.maxDraw ? [...chosen, card] : chosen;
    setPicked({ key: drawKey, cards: next });
  };

  // The board.
  d.board.forEach((card, i) => {
    placed.push({ key: card, face: face(card), back: BACK, x: cx + (i - 2) * (boardW + 5), y: boardY, z: 20 + i, label: cardName(card) });
  });

  // Hole cards: yours large at the bottom, the others small by their seats. In Stud each seat's
  // face-up cards follow its face-down ones in a row, a little apart.
  const myW = Math.max(34, Math.min(W * 0.085, H * 0.17));
  const drawing = canAct && state.street === 'draw';
  d.seats.forEach((s, seat) => {
    const [fx, fy] = spotOf(seat);
    const mineSeat = seat === me;
    const row = [...s.cards.map((card) => ({ card, up: false })), ...s.up.map((card) => ({ card: card, up: true }))];
    const count = row.length;
    if (count === 0) return;
    const gap = s.up.length > 0 && s.cards.length > 0 ? 0.35 : 0;
    // Others' cards are small face down; face up (cards up, or shown) they are drawn larger to be read.
    const faceUp = row.some((c) => c.card !== null);
    const w = mineSeat ? (count <= 4 ? myW : myW * 0.9) : boardW * (faceUp ? (count > 2 ? 0.72 : 0.8) : 0.62);
    const step = w * (mineSeat ? (count <= 2 ? 1.04 : count <= 4 ? 0.66 : 0.58) : count <= 2 ? 0.62 : faceUp ? 0.56 : 0.42);
    const span = step * (count - 1) + gap * w;
    // Others' cards sit just outside their name plate: below it at the top of the table, above it elsewhere.
    const plate = 19;
    const cardH = w * 1.5;
    const otherY = fy < 0.3 ? fy * H + plate + cardH * 0.38 : fy * H - plate - cardH * 0.38;
    // Yours end left of your name plate (more than two tuck a little under it) and spread leftwards,
    // over the labels of the seat beside you: your cards matter more.
    const last = count <= 2 ? fx * W - W * 0.15 + 0.52 * w : fx * W - 22 - w / 2;
    const left = mineSeat ? last - span : fx * W - span / 2;
    row.forEach(({ card, up }, i) => {
      const x = left + i * step + (up ? gap * w : 0);
      const y = mineSeat ? fy * H - H * 0.06 : otherY;
      const key = card ?? `back-${seat}-${i}-${d.handNo}`;
      const tilt = count === 2 ? (i === 0 ? -1 : 1) * (mineSeat ? 4 : 6) : up ? 0 : (i - (s.cards.length - 1) / 2) * (mineSeat ? 2.5 : 3);
      const label = card ? (mineSeat ? t(up ? 'poker.your-up-card' : 'poker.your-card', { card: cardName(card) }) : cardName(card)) : undefined;
      const pickable = mineSeat && drawing && card !== null && settledNow;
      placed.push({ key, face: card ? face(card) : null, back: BACK, x, y, z: mineSeat ? 150 + i : 40 + seat * 8 + i, rotate: tilt, scale: w / boardW, label, interactive: pickable, selected: pickable && chosen.includes(card) });
    });
  });

  // The controls wait until every queued event has played, so they never belong to a hand still being shown.
  const settled = settledNow;
  const game = state.config.game;
  const hasBoard = game === 'holdem' || game === 'omaha';
  const targets = canAct ? raiseTargets(state, me) : null;
  const raise = targets ? { min: targets.min, max: targets.max } : null;
  const owe = canAct ? toCallOf(state, me) : 0;
  const myPlayer = state.players[me];
  const pick = (type: HoldemAction['type']) => legal.find((a) => a.type === type);
  const handOver = playing?.type === 'hand-end' ? playing.result : null;
  const mineNow = myPlayer && myPlayer.hole.length > 0 && !myPlayer.folded && pending.length === 0 ? myPlayer.hole : null;
  const reading = helps.handName && game === 'holdem' && mineNow && !d.ended && !state.over && state.board.length >= 3 ? readHand([cardIndex(mineNow[0] as Card), cardIndex(mineNow[1] as Card)], state.board.map(cardIndex)) : null;
  // The variants: the hand made so far (and the low, in high-low).
  const variantReading = (() => {
    if (!helps.handName || game === 'holdem' || !mineNow || !myPlayer || d.ended || state.over) return null;
    const total = mineNow.length + myPlayer.up.length + state.board.length;
    if (game === 'omaha' ? state.board.length < 3 : total < 5) return null;
    const high = handName(highValue(game, mineNow, myPlayer.up, state.board));
    const low = state.config.split === 'high-low' ? lowValue(game, mineNow, myPlayer.up, state.board) : null;
    return low === null ? high : `${high} · ${t('poker.low-hand', { hand: lowName(low) })}`;
  })();
  const bringIn = canAct && bringInDue(state) ? legal.filter((a): a is { type: 'raise'; to: number } => a.type === 'raise') : null;
  const duration = anim.playing ? anim.duration : 220;

  return (
    <div ref={ref} className="card-table poker-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null} data-seats={n}>
      <div className="poker-felt" aria-hidden="true" />
      {W > 0 ? <CardLayer cards={placed} cardWidth={boardW} duration={duration} onCard={toggle} /> : null}
      {d.seats.map((s, seat) => {
        const [fx, fy] = spotOf(seat);
        const style: CSSProperties = { left: `${fx * 100}%`, top: `${fy * 100}%` };
        const toward = (k: number) => ({ left: `${(fx + (0.5 - fx) * k) * 100}%`, top: `${(fy + (0.46 - fy) * k) * 100}%` });
        const acting = state.toAct === seat && !state.over && anim.playing === null;
        const value = d.ended?.values[seat] ?? null;
        const showdown = value === null ? null : handName(value);
        return (
          <div key={seat} className="poker-seat-wrap">
            <div className="poker-seat" style={style} data-me={seat === me} data-acting={acting} data-folded={s.folded} data-out={s.out} data-won={s.won > 0} aria-label={t('poker.seat.label', { name: seatName(seat, me, names), stack: s.stack })}>
              <span className="poker-name">
                {seatName(seat, me, names)}
                {seat === d.button ? <span className="dealer-button" aria-label={t('poker.button')}>D</span> : null}
              </span>
              <span className="poker-stack num">{s.out ? t('poker.out') : s.stack}</span>
              {s.label && !s.out && !showdown && !reveal?.[seat] ? <span className="poker-action" data-kind={s.label} data-place={fy < 0.3 ? 'above' : 'below'}>{s.label === 'draw' ? (s.drew ? t('poker.act.drew', { n: s.drew }) : t('poker.act.stand-pat')) : s.stack === 0 && s.label !== 'fold' && s.label !== 'check' ? t('poker.act.all-in') : tDynamic(`poker.act.${s.label}`)}</span> : null}
              {showdown ? <span className="poker-hand-name" data-place={fy < 0.3 ? 'above' : 'below'}>{showdown}</span> : null}
              {reveal?.[seat] && !showdown ? <span className="poker-style">{reveal[seat]}</span> : null}
              {s.won > 0 ? <span className="poker-won num">+{s.won}</span> : null}
            </div>
            {s.bet > 0 ? (
              <div className="poker-bet" style={toward(fy < 0.3 ? 0.55 : 0.42)}>
                <ChipStack amount={s.bet} label={t('poker.bet-of', { name: seatName(seat, me, names), n: s.bet })} />
              </div>
            ) : null}
          </div>
        );
      })}
      {d.middle > 0 ? (
        <div className="poker-pot" style={{ left: '50%', top: `${((hasBoard ? boardY + boardH * 0.62 : boardY) / Math.max(1, H)) * 100}%` }}>
          <ChipStack amount={d.middle} label={t('poker.pot', { n: d.middle })} />
          <span className="poker-pot-label">{t('poker.pot', { n: d.middle })}</span>
        </div>
      ) : null}
      {variantReading ? (
        <div className="poker-reading" style={{ left: `${(spotOf(me)[0] - 0.15) * 100}%` }}>
          {variantReading}
        </div>
      ) : null}
      {reading ? (
        <div className="poker-reading" style={{ left: `${(spotOf(me)[0] - 0.15) * 100}%` }}>
          {tDynamic(`poker.detail.${reading.detail ?? reading.category}`)}
          {reading.draws.map((x) => ` · ${tDynamic(`poker.draw.${x}`)}`).join('')}
        </div>
      ) : null}
      {canAct && settled && myPlayer && drawing ? (
        <div className="bet-controls poker-draw">
          <p className="poker-draw-hint">{t('poker.draw.hint', { n: state.config.maxDraw })}</p>
          <div className="bet-row bet-main">
            <button type="button" className="btn btn-small btn-primary bet-draw" onClick={() => onAction({ type: 'draw', discard: chosen })}>
              {chosen.length === 0 ? t('poker.draw.stand-pat') : t('poker.draw.go', { n: chosen.length })}
            </button>
          </div>
        </div>
      ) : null}
      {canAct && settled && myPlayer && bringIn ? (
        <div className="bet-controls">
          <div className="bet-row bet-main">
            {bringIn.map((a, k) => (
              <button key={a.to} type="button" className={`btn btn-small ${k === 0 ? 'bet-bring-in' : 'btn-primary bet-complete'}`} onClick={() => onAction(a)}>
                {k === 0 ? t('poker.bring-in', { n: a.to }) : t('poker.complete', { n: a.to })}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {canAct && settled && myPlayer && !drawing && !bringIn ? (
        <BetControls
          key={`${state.handNo}/${state.log.length}`}
          canFold={pick('fold') !== undefined}
          toCall={owe}
          stack={myPlayer.stack}
          raise={raise}
          unit={state.blinds.unit}
          opening={state.currentBet === 0}
          presets={raise ? presetsFor(state, me, raise.min, raise.max) : []}
          allInAt={myPlayer.bet + myPlayer.stack}
          fixed={targets?.fixed ?? undefined}
          onFold={() => onAction({ type: 'fold' })}
          onCall={() => onAction(owe > 0 ? { type: 'call' } : { type: 'check' })}
          onRaise={(to) => onAction({ type: 'raise', to })}
          text={{
            fold: t('poker.fold'),
            check: t('poker.check'),
            call: (x) => t('poker.call', { n: x }),
            allInCall: (x) => t('poker.call.all-in', { n: x }),
            bet: (x) => t('poker.bet', { n: x }),
            raise: (x) => t('poker.raise', { n: x }),
            allIn: (x) => t('poker.all-in', { n: x }),
            size: t('poker.size'),
            cancel: t('poker.cancel'),
          }}
        />
      ) : null}
      {canAct && settled && helps.potOdds && owe > 0 ? <p className="poker-odds">{t('poker.odds', { call: Math.min(owe, myPlayer?.stack ?? owe), pot: potOf(state), need: Math.round((100 * Math.min(owe, myPlayer?.stack ?? owe)) / (potOf(state) + Math.min(owe, myPlayer?.stack ?? owe))) })}</p> : null}
      {handOver ? (
        <div className="hand-over poker-hand-over" role="status" style={{ top: `${Math.max(4, boardY - boardH / 2 - 6)}px` }}>
          {handOver.pots.map((pot, k) => {
            if (pot.lowWinners && pot.lowWinners.length > 0) {
              // High-low: a line for each half.
              const lowHalf = Math.floor(pot.amount / state.blinds.unit / 2) * state.blinds.unit;
              const top = Math.max(...pot.eligible.map((x) => handOver.values[x] ?? -1));
              const highs = pot.eligible.filter((x) => (handOver.values[x] ?? -1) === top);
              const lowSeat = pot.lowWinners[0] as Seat;
              const lowOf = handOver.lows?.[lowSeat] ?? null;
              const half = (who: readonly Seat[], n: number, hand: string, mineKey: 'poker.wins.high.you' | 'poker.wins.low.you', otherKey: 'poker.wins.high' | 'poker.wins.low') =>
                who.length === 1 && who[0] === me ? t(mineKey, { n, hand }) : t(otherKey, { name: who.map((x) => seatName(x, me, names)).join(' & '), n, hand });
              return (
                <div key={k}>
                  <p>{half(highs, pot.amount - lowHalf, top < 0 ? t('poker.no-showdown') : handNameInline(top), 'poker.wins.high.you', 'poker.wins.high')}</p>
                  <p>{half(pot.lowWinners, lowHalf, lowOf === null ? '' : lowName(lowOf), 'poker.wins.low.you', 'poker.wins.low')}</p>
                </div>
              );
            }
            const first = pot.winners[0];
            const value = first === undefined ? null : (handOver.values[first] ?? null);
            const you = pot.winners.length === 1 && first === me;
            const key = pot.winners.length > 1 ? (pot.winners.includes(me) ? 'poker.split.you' : 'poker.split') : k === 0 ? (you ? 'poker.wins.you' : 'poker.wins') : you ? 'poker.wins.side.you' : 'poker.wins.side';
            const name = pot.winners.map((s) => seatName(s, me, names)).join(' & ');
            return (
              <p key={k}>
                {tDynamic(key, { name, n: pot.amount, hand: value === null ? t('poker.no-showdown') : handNameInline(value) })}
                {pot.lowWinners && handOver.reason === 'showdown' && k === 0 ? ` · ${t('poker.no-low')}` : ''}
              </p>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
