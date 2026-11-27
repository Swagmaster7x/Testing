/**
 * The Brisca table: the CPU's hand along the top, the stock with the turned trump card on the
 * left, the trick in the middle, each side's won tricks on the right, your hand along the bottom.
 * Tap a card to lift it, tap it again to play it.
 *
 * What is drawn lags the rules by the events still queued: a card that the rules have already
 * moved stays where it was until its event plays, then slides to its new place.
 */
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import type { PlacedCard } from '../../../kits/cards/CardLayer';
import { CardLayer, useSize } from '../../../kits/cards/CardLayer';
import { CardBack, SpanishCardFace, SuitSign } from '../../../kits/cards/spanish';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { BriscaAction, BriscaEvent, BriscaState, Card, PlayedCard, Suit } from '../rules';
import { pointsOf, rankOf, suitOf, swapCardFor, trickWinner } from '../rules';
import { cardName, suitName } from './names';

interface Display {
  readonly hands: Card[][];
  readonly stock: Card[];
  readonly turned: Card | null;
  readonly trick: PlayedCard[];
  readonly won: Card[][];
}

/** The table as it looks before the queued events play. */
export function displayOf(state: BriscaState, pending: readonly BriscaEvent[]): Display {
  const d: Display = {
    hands: state.hands.map((h) => [...h]),
    stock: [...state.stock],
    turned: state.turned,
    trick: [...state.trick],
    won: state.won.map((w) => [...w]),
  };
  let turned = d.turned;
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'draw': {
        const hand = d.hands[e.seat] ?? [];
        const i = hand.indexOf(e.card);
        if (i >= 0) hand.splice(i, 1);
        d.stock.unshift(e.card);
        if (e.turned) turned = e.card;
        break;
      }
      case 'trick': {
        const pile = d.won[e.winner] ?? [];
        for (const p of e.plays) {
          const i = pile.indexOf(p.card);
          if (i >= 0) pile.splice(i, 1);
        }
        d.trick.splice(0, d.trick.length, ...e.plays);
        break;
      }
      case 'play': {
        const i = d.trick.findIndex((p) => p.card === e.card);
        if (i >= 0) d.trick.splice(i, 1);
        d.hands[e.seat]?.push(e.card);
        break;
      }
      case 'swap': {
        const hand = d.hands[e.seat] ?? [];
        const i = hand.indexOf(e.took);
        if (i >= 0) hand.splice(i, 1, e.gave);
        d.stock[d.stock.length - 1] = e.took;
        turned = e.took;
        break;
      }
      case 'deal': {
        // Before the deal, every card waits in the stock.
        d.stock.unshift(...d.hands.flat(), ...d.trick.map((p) => p.card), ...d.won.flat());
        d.hands.forEach((h) => h.splice(0));
        d.won.forEach((w) => w.splice(0));
        d.trick.splice(0);
        turned = null;
        break;
      }
      default:
        break;
    }
  }
  return { ...d, turned };
}

const face = (card: Card): ReactNode => <SpanishCardFace rank={rankOf(card)} suit={suitOf(card)} />;
const BACK = <CardBack />;

export function BriscaSeatMark({ seat }: { seat: Seat }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2.5" fill={seat === 0 ? '#f6efdf' : '#2b4a3c'} stroke={seat === 0 ? '#b9ab8e' : '#c9a25a'} />
      {seat === 0 ? <SuitSign suit="o" x={12} y={12} scale={0.42} /> : <path d="M12 6 L17 12 L12 18 L7 12 Z" fill="none" stroke="#c9a25a" />}
    </svg>
  );
}

export function BriscaSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps }: SurfaceProps<BriscaState, BriscaAction, BriscaEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [selected, setSelected] = useState<Card | null>(null);
  const me: Seat = mySeats[0] ?? 0;
  const them: Seat = me === 0 ? 1 : 0;
  const pending = anim.pending.map((p) => p.event);
  const d = displayOf(state, pending);
  const playing = anim.playing?.event ?? null;
  const W = size.width;
  const H = size.height;
  const cardH = Math.max(48, Math.min(H * 0.27, W * 0.21 * 1.5));
  const cardW = cardH / 1.5;
  const gap = Math.max(6, H * 0.02);
  const midY = H / 2;
  const stockX = gap + cardW * 0.75;
  const pileX = W - gap - cardW * 0.6;
  const cx = (stockX + cardW * 0.6 + pileX - cardW * 0.6) / 2;
  const playable = new Set(legal.flatMap((a) => (a.type === 'play' && !a.call ? [a.card] : [])));
  const callable = legal.some((a) => a.type === 'play' && a.call);
  const swap = legal.find((a) => a.type === 'swap');
  const led = d.trick[0];
  const beats = (card: Card) => led !== undefined && led.seat !== me && trickWinner([led, { seat: me, card }], state.trumpSuit, state.config) === me;
  const open = helps.openHand === true;
  const placed: PlacedCard[] = [];

  // The stock, face down, with the turned card across its foot.
  d.stock.forEach((card, i) => {
    const isTurned = d.turned === card && i === d.stock.length - 1;
    if (isTurned) {
      placed.push({ key: card, face: face(card), back: BACK, x: stockX + cardW * 0.42, y: midY, rotate: 90, z: 1, label: t('brisca.turned', { suit: suitName(suitOf(card)), card: cardName(card) }) });
    } else {
      const depth = Math.min(i, 5) * 0.6;
      placed.push({ key: card, face: null, back: BACK, x: stockX - depth, y: midY - depth, z: 10 + (d.stock.length - i), label: i === 0 ? t('brisca.stock', { n: d.stock.length - (d.turned ? 1 : 0) }) : undefined });
    }
  });

  // Hands.
  const spread = cardW * 1.1;
  (d.hands[me] ?? []).forEach((card, i, all) => {
    const x = cx + (i - (all.length - 1) / 2) * spread;
    const can = canAct && playable.has(card);
    placed.push({
      key: card,
      face: face(card),
      back: BACK,
      x,
      y: H - gap - cardH / 2,
      z: 100 + i,
      label: cardName(card),
      interactive: can,
      selected: can && selected === card,
      tone: helps.whatBeats && can && beats(card) ? 'win' : null,
    });
  });
  (d.hands[them] ?? []).forEach((card, i, all) => {
    const x = cx + (i - (all.length - 1) / 2) * spread * 0.82;
    placed.push({ key: open ? card : `them-${i}`, face: open ? face(card) : null, back: BACK, x, y: gap + cardH * 0.42, z: 100 + i, scale: 0.82, label: open ? t('brisca.their-card.up', { card: cardName(card) }) : t('brisca.their-card') });
  });

  // The trick: the leader's card first, the reply overlapping it.
  d.trick.forEach((p, i) => {
    placed.push({ key: p.card, face: face(p.card), back: BACK, x: cx + (i === 0 ? -cardW * 0.34 : cardW * 0.34), y: midY + (i === 0 ? -4 : 6), rotate: i === 0 ? -4 : 5, z: 200 + i, label: cardName(p.card) });
  });

  // Won tricks, face down: yours below the middle, the CPU's above. With cards up, they are fanned face up.
  ([me, them] as const).forEach((seat) => {
    const pile = d.won[seat] ?? [];
    const y = seat === me ? midY + cardH * 0.56 : midY - cardH * 0.56;
    if (helps.openPiles && pile.length > 0) {
      const step = Math.min(cardW * 0.42, (pileX - cx - cardW * 0.2) / Math.max(1, pile.length - 1));
      pile.forEach((card, i) => {
        placed.push({ key: card, face: face(card), back: BACK, x: pileX - (pile.length - 1 - i) * step, y, scale: 0.72, z: 60 + i, label: cardName(card) });
      });
      return;
    }
    pile.forEach((card, i) => {
      const depth = Math.min(i, 5) * 0.5;
      placed.push({ key: card, face: null, back: BACK, x: pileX - depth, y: y - depth, rotate: 90, scale: 0.78, z: 50 + i, label: i === pile.length - 1 ? (seat === me ? t('brisca.pile.you', { n: state.tricksWon[seat] ?? 0 }) : t('brisca.pile.them', { n: state.tricksWon[seat] ?? 0 })) : undefined });
    });
  });

  const onCard = (key: string) => {
    if (!isCardKey(key)) return;
    const card = key;
    if (selected === card) {
      setSelected(null);
      onAction({ type: 'play', card });
    } else setSelected(card);
  };
  const duration = anim.playing ? anim.duration : 220;
  const handOver = playing?.type === 'hand-end' ? playing : null;
  const trumpSuit: Suit = state.trumpSuit;
  const swapCard = state.turned ? swapCardFor(state.turned, state.config) : null;

  return (
    <div ref={ref} className="card-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null}>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={duration} onCard={onCard} /> : null}
      <div className="trump-badge" style={{ left: `${stockX - cardW * 0.5}px`, top: `${midY + cardH * 0.56}px` }} aria-label={t('brisca.trumps', { suit: suitName(trumpSuit) })}>
        <svg viewBox="-12 -12 24 24" width="18" height="18" aria-hidden="true">
          <SuitSign suit={trumpSuit} scale={0.9} />
        </svg>
        <span>{suitName(trumpSuit)}</span>
      </div>
      {helps.counts ? (
        <div className="pile-points num" style={{ left: `${pileX - cardW * 0.7}px`, top: `${midY - 10}px` }}>
          {t('brisca.points.both', { a: pointsOf(d.won[me] ?? [], state.config), b: pointsOf(d.won[them] ?? [], state.config) })}
        </div>
      ) : null}
      {swap && swapCard ? (
        <button type="button" className="btn btn-small swap-btn" style={{ left: `${stockX - cardW * 0.5}px`, top: `${midY - cardH * 0.9}px` }} onClick={() => onAction(swap)}>
          {t('brisca.swap', { card: cardName(swapCard) })}
        </button>
      ) : null}
      {callable && selected === `A${trumpSuit}` ? (
        <button type="button" className="btn btn-small call-btn" style={{ left: `${cx - cardW}px`, top: `${H - cardH - gap * 3 - 34}px` }} onClick={() => onAction({ type: 'play', card: `A${trumpSuit}` as Card, call: true })}>
          {t('brisca.call')}
        </button>
      ) : null}
      {canAct && selected ? <p className="table-tip">{t('brisca.tap-again')}</p> : null}
      {handOver ? (
        <div className="hand-over" role="status">
          {t('brisca.hand-over', { a: handOver.points[me] ?? 0, b: handOver.points[them] ?? 0 })}
        </div>
      ) : null}
    </div>
  );
}

function isCardKey(key: string): key is Card {
  return /^[A234567SCR][oceb]$/.test(key);
}

