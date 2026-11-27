/**
 * The poker table: up to six seats round an oval, you at the bottom, the board and the pot in the
 * middle, each seat's bet in front of it, and your bet controls in the bottom corner. Seats go
 * clockwise, so the next player (on your left) sits to the left of the screen.
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
import { cardIndex } from '../cards';
import { readHand } from '../reading';
import type { HandResult, HoldemAction, HoldemEvent, HoldemState, LogKind } from '../rules';
import { potOf, raiseRange, toCallOf } from '../rules';
import { cardName, handName, seatName } from './names';
import './poker.css';

interface SeatShow {
  stack: number;
  bet: number;
  folded: boolean;
  /** Hole cards to draw: a card face up, or null for one face down. */
  cards: (Card | null)[];
  label: LogKind | null;
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
      label: last?.kind ?? null,
      out: p.out,
      won: 0,
    };
  });
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
        for (const seat of e.seats) at(seat).cards = [];
        break;
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
          s.cards = e.seat === me || open ? [...(e.seat === me ? mine : (state.players[e.seat]?.hole ?? []))] : backs(2);
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
        if (e.seat !== me && !open) at(e.seat).cards = backs(2);
        break;
      case 'muck':
        at(e.seat).cards = e.seat === me || open ? [...(e.seat === me ? mine : (state.players[e.seat]?.hole ?? []))] : backs(2);
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
    [0.11, 0.63],
    [0.15, 0.17],
    [0.5, 0.1],
    [0.85, 0.17],
    [0.89, 0.63],
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
  const opened = state.log.some((e) => e.street === state.street && (e.kind === 'raise' || e.kind === 'bet'));
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
    out.push({ to: Math.round(state.currentBet + f * (pot + owe)), label: t(key) });
  }
  out.push({ to: max, label: t('poker.preset.all-in') });
  // Keep the presets that make sense here, each once, in order of size.
  const seen = new Set<number>();
  return out
    .map((o) => ({ ...o, to: Math.max(min, Math.min(max, o.to)) }))
    .filter((o) => (seen.has(o.to) ? false : (seen.add(o.to), true)))
    .sort((a, b) => a.to - b.to);
}

export function PokerSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps }: SurfaceProps<HoldemState, HoldemAction, HoldemEvent>) {
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

  // The board.
  d.board.forEach((card, i) => {
    placed.push({ key: card, face: face(card), back: BACK, x: cx + (i - 2) * (boardW + 5), y: boardY, z: 20 + i, label: cardName(card) });
  });

  // Hole cards: yours large at the bottom, the others small by their seats.
  const myW = Math.max(34, Math.min(W * 0.085, H * 0.17));
  d.seats.forEach((s, seat) => {
    const [fx, fy] = spotOf(seat);
    const mineSeat = seat === me;
    const w = mineSeat ? myW : boardW * 0.62;
    // Others' cards sit just outside their name plate: below it at the top of the table, above it elsewhere.
    const plate = 19;
    const cardH = w * 1.5;
    const otherY = fy < 0.3 ? fy * H + plate + cardH * 0.38 : fy * H - plate - cardH * 0.38;
    s.cards.forEach((card, i) => {
      const x = fx * W + (i - 0.5) * w * (mineSeat ? 1.04 : 0.62) + (mineSeat ? -W * 0.15 : 0);
      const y = mineSeat ? fy * H - H * 0.06 : otherY;
      const key = card ?? `back-${seat}-${i}-${d.handNo}`;
      placed.push({ key, face: card ? face(card) : null, back: BACK, x, y, z: 40 + seat * 3 + i, rotate: mineSeat ? (i === 0 ? -4 : 4) : i === 0 ? -6 : 6, scale: mineSeat ? myW / boardW : w / boardW, label: card ? (mineSeat ? t('poker.your-card', { card: cardName(card) }) : cardName(card)) : undefined });
    });
  });

  const raise = canAct ? raiseRange(state, me) : null;
  const owe = canAct ? toCallOf(state, me) : 0;
  const myPlayer = state.players[me];
  const pick = (type: HoldemAction['type']) => legal.find((a) => a.type === type);
  const handOver = playing?.type === 'hand-end' ? playing.result : null;
  const mineNow = myPlayer && myPlayer.hole.length === 2 && !myPlayer.folded && pending.every((e) => e.type !== 'deal') ? myPlayer.hole : null;
  const reading = helps.handName && mineNow && state.board.length >= 3 ? readHand([cardIndex(mineNow[0] as Card), cardIndex(mineNow[1] as Card)], state.board.map(cardIndex)) : null;
  const duration = anim.playing ? anim.duration : 220;

  return (
    <div ref={ref} className="card-table poker-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null} data-seats={n}>
      <div className="poker-felt" aria-hidden="true" />
      {W > 0 ? <CardLayer cards={placed} cardWidth={boardW} duration={duration} /> : null}
      {d.seats.map((s, seat) => {
        const [fx, fy] = spotOf(seat);
        const style: CSSProperties = { left: `${fx * 100}%`, top: `${fy * 100}%` };
        const toward = (k: number) => ({ left: `${(fx + (0.5 - fx) * k) * 100}%`, top: `${(fy + (0.46 - fy) * k) * 100}%` });
        const acting = state.toAct === seat && !state.over && anim.playing === null;
        const value = d.ended?.values[seat] ?? null;
        const showdown = value === null ? null : handName(value);
        return (
          <div key={seat} className="poker-seat-wrap">
            <div className="poker-seat" style={style} data-me={seat === me} data-acting={acting} data-folded={s.folded} data-out={s.out} data-won={s.won > 0} aria-label={t('poker.seat.label', { name: seatName(seat, me), stack: s.stack })}>
              <span className="poker-name">
                {seatName(seat, me)}
                {seat === d.button ? <span className="dealer-button" aria-label={t('poker.button')}>D</span> : null}
              </span>
              <span className="poker-stack num">{s.out ? t('poker.out') : s.stack}</span>
              {s.label && !s.out ? <span className="poker-action" data-kind={s.label}>{s.stack === 0 && s.label !== 'fold' && s.label !== 'check' ? t('poker.act.all-in') : tDynamic(`poker.act.${s.label}`)}</span> : null}
              {showdown ? <span className="poker-hand-name">{showdown}</span> : null}
              {s.won > 0 ? <span className="poker-won num">+{s.won}</span> : null}
            </div>
            {s.bet > 0 ? (
              <div className="poker-bet" style={toward(0.42)}>
                <ChipStack amount={s.bet} label={t('poker.bet-of', { name: seatName(seat, me), n: s.bet })} />
              </div>
            ) : null}
          </div>
        );
      })}
      {d.middle > 0 ? (
        <div className="poker-pot" style={{ left: '50%', top: `${((boardY + boardH * 0.62) / Math.max(1, H)) * 100}%` }}>
          <ChipStack amount={d.middle} label={t('poker.pot', { n: d.middle })} />
          <span className="poker-pot-label">{t('poker.pot', { n: d.middle })}</span>
        </div>
      ) : null}
      {reading ? (
        <div className="poker-reading" style={{ left: `${(spotOf(me)[0] - 0.15) * 100}%` }}>
          {tDynamic(`poker.detail.${reading.detail ?? reading.category}`)}
          {reading.draws.map((x) => ` · ${tDynamic(`poker.draw.${x}`)}`).join('')}
        </div>
      ) : null}
      {canAct && myPlayer ? (
        <BetControls
          key={`${state.handNo}/${state.log.length}`}
          canFold={pick('fold') !== undefined}
          toCall={owe}
          stack={myPlayer.stack}
          raise={raise}
          unit={state.blinds.unit}
          opening={state.currentBet === 0}
          presets={raise ? presetsFor(state, me, raise.min, raise.max) : []}
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
      {canAct && helps.potOdds && owe > 0 ? <p className="poker-odds">{t('poker.odds', { call: Math.min(owe, myPlayer?.stack ?? owe), pot: potOf(state), need: Math.round((100 * Math.min(owe, myPlayer?.stack ?? owe)) / (potOf(state) + Math.min(owe, myPlayer?.stack ?? owe))) })}</p> : null}
      {handOver ? (
        <div className="hand-over poker-hand-over" role="status">
          {handOver.pots.map((pot, k) => (
            <p key={k}>{t(pot.winners.length > 1 ? 'poker.split' : k === 0 ? 'poker.wins' : 'poker.wins.side', { name: pot.winners.map((s) => seatName(s, me)).join(' & '), n: pot.amount, hand: pot.winners[0] !== undefined && handOver.values[pot.winners[0]] !== null ? handName(handOver.values[pot.winners[0]] as number) : t('poker.no-showdown') })}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
