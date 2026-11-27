/**
 * The Gin Rummy table: the other player's hand along the top, the stock and the discard pile in
 * the middle, your hand along the bottom arranged into its melds with the deadwood after them.
 * Tap the stock or the pile to draw; tap a card to lift it, again to discard it; Knock appears when
 * the lifted card leaves you able to knock. At the end of a hand both hands are laid down in melds.
 */
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import type { PlacedCard } from '../../../kits/cards/CardLayer';
import { CardLayer, useSize } from '../../../kits/cards/CardLayer';
import { FrenchCardBack, FrenchCardFace } from '../../../kits/cards/french';
import { t, tDynamic } from '../../../text';
import type { SurfaceProps, SeatNames } from '../../types';
import type { Card } from '../../classic/cards';
import { bestArrangement, deadwood, sortLow } from '../../classic/melds';
import { cardName, cardShort } from '../../classic/names';
import '../../classic/ui/classic.css';
import type { GinAction, GinEvent, GinState, HandResult } from '../rules';
import { knockLimit } from '../rules';

interface Display {
  readonly hands: Card[][];
  readonly discard: Card[];
  readonly stock: number;
  /** A finished hand to lay out, instead of the play. */
  readonly result: HandResult | null;
}

export function displayOf(state: GinState, pending: readonly GinEvent[]): Display {
  const hands = state.hands.map((h) => [...h]);
  const discard = [...state.discard];
  let stock = state.stock.length;
  let result: HandResult | null = state.over ? (state.results[state.results.length - 1] ?? null) : null;
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'deal':
        result = state.results[e.handNo - 1] ?? null;
        hands.forEach((h) => h.splice(0));
        discard.splice(0);
        stock = 0;
        break;
      case 'hand-end':
      case 'game-end':
        result = e.type === 'hand-end' ? e.result : result;
        break;
      case 'discard': {
        const i = discard.lastIndexOf(e.card);
        if (i >= 0) discard.splice(i, 1);
        hands[e.seat]?.push(e.card);
        break;
      }
      case 'draw': {
        const hand = hands[e.seat] ?? [];
        const i = hand.indexOf(e.card);
        if (i >= 0) hand.splice(i, 1);
        if (e.from === 'stock') stock++;
        else discard.push(e.card);
        break;
      }
      case 'offer':
        if (e.take) {
          const hand = hands[e.seat] ?? [];
          const i = hand.indexOf(e.card);
          if (i >= 0) hand.splice(i, 1);
          discard.push(e.card);
        }
        break;
      default:
        break;
    }
  }
  return { hands, discard, stock, result };
}

const face = (card: Card) => <FrenchCardFace card={card} />;
const BACK = <FrenchCardBack />;

/** A hand in its melds (best arrangement), then the deadwood. */
export function meldOrder(cards: readonly Card[]): { groups: Card[][]; dead: Card[] } {
  const a = bestArrangement(cards);
  return { groups: a.melds.map((m) => sortLow(m)), dead: sortLow(a.deadwood) };
}

function who(seat: Seat, me: Seat, names?: SeatNames): string {
  return seat === me ? t('gin.who.you') : (names?.(seat) ?? t('gin.who.cpu'));
}

export function GinSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, names }: SurfaceProps<GinState, GinAction, GinEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [lifted, setLifted] = useState<Card | null>(null);
  const me: Seat = mySeats[0] ?? 0;
  const them: Seat = me === 0 ? 1 : 0;
  const pending = anim.pending.map((p) => p.event);
  const d = displayOf(state, pending);
  const settled = anim.playing === null && pending.length === 0;
  const act = canAct && settled;
  const W = size.width;
  const H = size.height;
  const cardW = Math.max(30, Math.min(W / 11.5, (H * 0.28) / 1.5));
  const cardH = cardW * 1.5;
  const gap = Math.max(4, H * 0.015);
  const cx = W / 2;
  const midY = H * 0.47;
  const placed: PlacedCard[] = [];
  const has = (type: GinAction['type']) => legal.some((a) => a.type === type);
  const discards = new Set(legal.flatMap((a) => (a.type === 'discard' ? [a.card] : [])));
  const knocks = new Set(legal.flatMap((a) => (a.type === 'knock' ? [a.card] : [])));
  const top = d.discard[d.discard.length - 1];
  const showOpen = helps.openHand === true;
  const pickups = new Set(helps.pickups ? (state.known[them] ?? []) : []);

  if (d.result && d.result.kind !== 'dead') {
    // The same root element as the table, so its measured size carries over to the result.
    return (
      <div ref={ref} className="card-table gin-table gin-result" onPointerDown={(e) => e.target === e.currentTarget && onSkip()}>
        <ResultLayout result={d.result} me={me} names={names} cardW={cardW} W={W} H={H} />
      </div>
    );
  }

  // Your hand: melds first, a small gap between groups, then the deadwood.
  const mine = d.hands[me] ?? [];
  const order = meldOrder(mine);
  const groups = [...order.groups, ...(order.dead.length > 0 ? [order.dead] : [])];
  const groupGap = cardW * 0.25;
  const step = Math.min(cardW * 0.7, (W - cardW - gap * 2 - groupGap * Math.max(0, groups.length - 1)) / Math.max(1, mine.length - 1));
  const total = (mine.length - 1) * step + groupGap * Math.max(0, groups.length - 1);
  let x = cx - total / 2;
  groups.forEach((group, gi) => {
    group.forEach((card, i) => {
      const can = act && discards.has(card);
      placed.push({
        key: card,
        face: face(card),
        back: BACK,
        x,
        y: H - gap - cardH / 2,
        z: 100 + gi * 20 + i,
        label: cardName(card),
        interactive: can,
        selected: can && lifted === card,
        tone: card === state.taken ? 'hint' : null,
      });
      x += step;
    });
    x += groupGap - 0;
  });

  // The other hand along the top: face down, except cards known (picked up from the pile) with that help on.
  const theirs = sortLow(d.hands[them] ?? []);
  const small = cardW * 0.62;
  const tStep = Math.min(small * 0.45, (W * 0.6) / Math.max(1, theirs.length));
  theirs.forEach((card, i) => {
    const up = showOpen || pickups.has(card);
    placed.push({ key: up ? card : `back-${i}`, face: up ? face(card) : null, back: BACK, x: cx + (i - (theirs.length - 1) / 2) * tStep, y: gap + (small * 1.5) / 2, z: 20 + i, scale: small / cardW, label: up ? t('gin.their-known', { card: cardName(card) }) : undefined });
  });

  // The stock and the pile. The stock's top card (the one you tap) sits above the backs under it.
  const stockX = cx - cardW * 0.85;
  const pileX = cx + cardW * 0.85;
  const canStock = act && (has('stock') || false);
  const canPile = act && (has('pile') || has('take'));
  for (let i = 0; i < Math.min(5, d.stock); i++) {
    placed.push({ key: i === 0 ? 'stock' : `stock-${i}`, face: null, back: BACK, x: stockX - i * 0.6, y: midY - i * 0.6, z: i === 0 ? 36 : 30 + i, label: i === 0 ? t('gin.stock', { n: d.stock }) : undefined, interactive: i === 0 && canStock });
  }
  const shown = d.discard.slice(-4);
  shown.forEach((card, i) => {
    const isTop = i === shown.length - 1;
    placed.push({ key: card, face: face(card), back: BACK, x: pileX + (i - (shown.length - 1)) * cardW * 0.18, y: midY, z: 40 + i, label: isTop ? t('gin.pile.top', { card: cardName(card) }) : cardName(card), interactive: isTop && canPile, tone: isTop && canPile ? 'hint' : null });
  });

  const onCard = (key: string) => {
    if (key === 'stock') {
      onAction({ type: 'stock' });
      return;
    }
    if (key === top && (has('pile') || has('take'))) {
      onAction(has('take') ? { type: 'take' } : { type: 'pile' });
      return;
    }
    const card = key as Card;
    if (lifted === card) {
      setLifted(null);
      onAction({ type: 'discard', card });
    } else setLifted(card);
  };
  const liftedKnock = lifted && knocks.has(lifted) ? lifted : null;
  const after = liftedKnock ? deadwood(mine.filter((c) => c !== liftedKnock)) : null;
  const dw = deadwood(mine.length > 10 && lifted ? mine.filter((c) => c !== lifted) : mine);

  return (
    <div ref={ref} className="card-table gin-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null}>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={anim.playing ? anim.duration : 220} onCard={onCard} /> : null}
      <div className="seat-tag gin-tag" style={{ left: `${gap}px`, top: `${gap}px` }} data-turn={state.toAct === them && !state.over}>
        <b>{who(them, me, names)}</b>
        <span className="num">{t('gin.tag', { score: state.scores[them] ?? 0 })}</span>
      </div>
      <div className="seat-tag gin-tag" style={{ left: `${gap}px`, bottom: `${cardH + gap * 2}px` }} data-turn={state.toAct === me && !state.over}>
        <b>{who(me, me, names)}</b>
        <span className="num">{t('gin.tag', { score: state.scores[me] ?? 0 })}</span>
        {helps.deadwood ? <span className="num gin-deadwood">{t('gin.deadwood', { n: dw })}</span> : null}
      </div>
      {state.upcard && state.config.knock !== 'ten' ? <div className="trump-badge" style={{ left: `${stockX - cardW * 0.5}px`, top: `${midY + cardH * 0.55}px` }}>{t('gin.knock-limit', { n: knockLimit(state.config, state.upcard) })}</div> : null}
      {act ? (
        <div className="gin-actions">
          {state.phase === 'offer' && top ? (
            <>
              <button type="button" className="btn btn-small btn-primary" onClick={() => onAction({ type: 'take' })}>
                {t('gin.take', { card: cardShort(top) })}
              </button>
              <button type="button" className="btn btn-small" onClick={() => onAction({ type: 'pass' })}>
                {t('gin.pass')}
              </button>
            </>
          ) : null}
          {state.phase === 'draw' ? <p className="gin-note">{has('pile') ? t('gin.draw.note', { card: top ? cardShort(top) : '' }) : t('gin.draw.stock-only')}</p> : null}
          {state.phase === 'discard' && has('big-gin') ? (
            <button type="button" className="btn btn-small btn-primary" onClick={() => onAction({ type: 'big-gin' })}>
              {t('gin.big-gin')}
            </button>
          ) : null}
          {state.phase === 'discard' && liftedKnock ? (
            <button type="button" className="btn btn-small btn-primary" onClick={() => onAction({ type: 'knock', card: liftedKnock })}>
              {after === 0 ? t('gin.gin', { card: cardShort(liftedKnock) }) : t('gin.knock', { card: cardShort(liftedKnock), n: after ?? 0 })}
            </button>
          ) : null}
          {state.phase === 'discard' && !lifted ? <p className="gin-note">{knocks.size > 0 ? t('gin.discard.can-knock') : t('gin.discard.note')}</p> : null}
        </div>
      ) : null}
      {act && lifted && state.phase === 'discard' ? <p className="table-tip">{t('gin.tap-again')}</p> : null}
      {d.result?.kind === 'dead' && !settled ? (
        <div className="hand-over" role="status">
          {t('gin.dead')}
        </div>
      ) : null}
    </div>
  );
}

/** A finished hand: both players' melds and deadwood, the layoffs, and the score. */
function ResultLayout({ result, me, names, cardW, W, H }: { result: HandResult; me: Seat; names?: SeatNames; cardW: number; W: number; H: number }) {
  const knocker = result.knocker ?? 0;
  const defender = knocker === 0 ? 1 : 0;
  const w = Math.min(cardW * 0.82, W / 15);
  const placed: PlacedCard[] = [];
  const laid = new Set(result.laid.map((x) => x.card));
  const row = (melds: readonly (readonly Card[])[], dead: readonly Card[], y: number, keyPrefix: string, extra: readonly Card[] = []) => {
    const groups = [...melds.map((m) => [...m]), ...(extra.length > 0 ? [[...extra]] : []), ...(dead.length > 0 ? [[...dead]] : [])];
    const count = groups.reduce((a, g) => a + g.length, 0);
    const step = Math.min(w * 0.62, (W * 0.92) / Math.max(1, count + groups.length * 0.6));
    const gapW = step * 0.6;
    let x = W / 2 - (count * step + (groups.length - 1) * gapW) / 2 + step / 2;
    groups.forEach((g, gi) => {
      const isDead = gi === groups.length - 1 && dead.length > 0;
      g.forEach((card, i) => {
        placed.push({ key: `${keyPrefix}-${card}`, face: face(card), back: BACK, x, y, z: 10 + gi * 20 + i, scale: w / cardW, label: cardName(card), tone: laid.has(card) ? 'hint' : isDead ? null : 'win' });
        x += step;
      });
      x += gapW;
    });
  };
  const knockerY = H * 0.3;
  const defenderY = H * 0.72;
  row(result.knockerMelds, result.knockerDeadwood, knockerY, 'k');
  row(result.defenderMelds, result.defenderDeadwood, defenderY, 'd', result.laid.map((x) => x.card));
  const name = (seat: Seat) => (seat === me ? t('gin.who.you') : (names?.(seat) ?? t('gin.who.cpu')));
  const title = tDynamic(`gin.result.${result.kind}`, { who: name(result.winner ?? knocker), n: result.points });
  return (
    <>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={0} /> : null}
      <p className="gin-result-title" role="status">
        {title}
        {result.doubled ? ` ${t('gin.result.doubled')}` : ''}
      </p>
      <p className="gin-result-line" style={{ top: `${knockerY - w * 0.75 - 6}px` }}>
        {t(result.kind === 'gin' || result.kind === 'big-gin' ? 'gin.result.ginner' : 'gin.result.knocker', { who: name(knocker), n: result.knockerCount })}
      </p>
      <p className="gin-result-line" style={{ top: `${defenderY - w * 0.75 - 6}px` }}>
        {t(result.laid.length > 0 ? 'gin.result.defender.laid' : 'gin.result.defender', { who: name(defender), n: result.defenderCount, k: result.laid.length })}
      </p>
    </>
  );
}
