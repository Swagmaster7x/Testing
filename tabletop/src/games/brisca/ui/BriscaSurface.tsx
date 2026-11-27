/**
 * The Brisca table: the CPU's hand along the top, the stock with the turned trump card on the
 * left, the trick in the middle, each side's won tricks on the right, your hand along the bottom.
 * Tap a card to lift it, tap it again to play it.
 *
 * Four players: your partner across the top, the player on your right (who plays after you) on the
 * right, the one on your left on the left; the stock in the top left corner, your side's tricks
 * bottom right and theirs top right; each card of the trick in front of the player who played it.
 * With señas on, a Señas button opens the signs you may make, and your partner's signs show by
 * their name.
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
import { t, tDynamic } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { BriscaAction, BriscaEvent, BriscaState, Card, PlayedCard, Sign, Suit } from '../rules';
import { partnerOf, rankOf, sideOf, sidePiles, suitOf, swapCardFor, trickWinner } from '../rules';
import { cardName, seatName, suitName } from './names';
import { SignFace } from './senas';

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

export function BriscaSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, names, overlay }: SurfaceProps<BriscaState, BriscaAction, BriscaEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [selected, setSelected] = useState<Card | null>(null);
  const [signing, setSigning] = useState(false);
  const me: Seat = mySeats[0] ?? 0;
  const n = state.hands.length;
  const four = n === 4;
  const them: Seat = (me + 1) % n;
  const pending = anim.pending.map((p) => p.event);
  const d = displayOf(state, pending);
  const playing = anim.playing?.event ?? null;
  const W = size.width;
  const H = size.height;
  const cardH = Math.max(48, Math.min(H * (four ? 0.245 : 0.27), W * 0.21 * 1.5));
  const cardW = cardH / 1.5;
  const gap = Math.max(6, H * 0.02);
  const midY = H / 2;
  const stockX = four ? gap + cardH * 0.62 + cardW * 0.62 : gap + cardW * 0.75;
  const stockY = four ? gap + cardH * 0.5 : midY;
  const pileX = W - gap - cardW * 0.6;
  const cx = four ? W / 2 : (stockX + cardW * 0.6 + pileX - cardW * 0.6) / 2;
  /** Where a seat sits, counted from you: 0 you, 1 your right, 2 across, 3 your left. */
  const rel = (seat: Seat) => (seat - me + n) % n;
  const playable = new Set(legal.flatMap((a) => (a.type === 'play' && !a.call ? [a.card] : [])));
  const callable = legal.some((a) => a.type === 'play' && a.call);
  const swap = legal.find((a) => a.type === 'swap');
  const led = d.trick[0];
  const beats = (card: Card) => led !== undefined && led.seat !== me && trickWinner([...d.trick, { seat: me, card }], state.trumpSuit, state.config) === me;
  const open = helps.openHand === true;
  const placed: PlacedCard[] = [];

  // The stock, face down, with the turned card across its foot.
  d.stock.forEach((card, i) => {
    const isTurned = d.turned === card && i === d.stock.length - 1;
    if (isTurned) {
      placed.push({ key: card, face: face(card), back: BACK, x: stockX + cardW * 0.42, y: stockY, rotate: 90, z: 1, scale: four ? 0.86 : 1, label: t('brisca.turned', { suit: suitName(suitOf(card)), card: cardName(card) }) });
    } else {
      const depth = Math.min(i, 5) * 0.6;
      placed.push({ key: card, face: null, back: BACK, x: stockX - depth, y: stockY - depth, z: 10 + (d.stock.length - i), scale: four ? 0.86 : 1, label: i === 0 ? t('brisca.stock', { n: d.stock.length - (d.turned ? 1 : 0) }) : undefined });
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
  /** The other hands: across the top with two players; with four, each by its seat. */
  d.hands.forEach((hand, seat) => {
    const r = rel(seat);
    if (r === 0) return;
    hand.forEach((card, i, all) => {
      const label = open ? t('brisca.their-card.up', { card: cardName(card) }) : t('brisca.their-card.of', { who: seatName(seat, me, n, names) });
      const key = open ? card : `back-${seat}-${i}`;
      const f = open ? face(card) : null;
      if (!four || r === 2) {
        const scale = four ? 0.64 : 0.82;
        const x = cx + (i - (all.length - 1) / 2) * spread * scale;
        placed.push({ key, face: f, back: BACK, x, y: gap + cardH * (four ? 0.34 : 0.42), z: 100 + i, scale, label: four ? label : open ? label : t('brisca.their-card') });
        return;
      }
      // Right and left: a column of cards turned sideways at the edge of the table.
      const x = r === 1 ? W - gap - cardH * 0.34 : gap + cardH * 0.34;
      const y = midY + (i - (all.length - 1) / 2) * cardW * 0.62;
      placed.push({ key, face: f, back: BACK, x, y, rotate: r === 1 ? -90 : 90, z: 100 + i, scale: 0.64, label });
    });
  });

  // The trick. With two players the leader's card first, the reply overlapping it; with four, each
  // card in front of the player who played it.
  d.trick.forEach((p, i) => {
    if (four) {
      const r = rel(p.seat);
      const dx = r === 1 ? cardW * 0.72 : r === 3 ? -cardW * 0.72 : 0;
      const dy = r === 0 ? cardH * 0.3 : r === 2 ? -cardH * 0.3 : 0;
      placed.push({ key: p.card, face: face(p.card), back: BACK, x: cx + dx, y: midY + dy, rotate: (r % 2 === 1 ? 6 : -3) * (i % 2 === 0 ? 1 : -1), z: 200 + i, scale: 0.92, label: cardName(p.card) });
      return;
    }
    placed.push({ key: p.card, face: face(p.card), back: BACK, x: cx + (i === 0 ? -cardW * 0.34 : cardW * 0.34), y: midY + (i === 0 ? -4 : 6), rotate: i === 0 ? -4 : 5, z: 200 + i, label: cardName(p.card) });
  });

  // Won tricks, face down: yours below the middle, the CPU's above (with four, a side's tricks
  // together in the right-hand corners). With cards up, they are fanned face up.
  const pileOf = (side: number): Card[] => d.won.flatMap((w, seat) => (sideOf(seat) === side ? w : []));
  const tricksOf = (side: number): number => state.tricksWon.reduce((a, k, seat) => a + (sideOf(seat) === side ? k : 0), 0);
  ([me, them] as const).forEach((seat) => {
    const pile = pileOf(sideOf(seat));
    const y = four ? (seat === me ? H - gap - cardH * 0.42 : gap + cardH * 0.42) : seat === me ? midY + cardH * 0.56 : midY - cardH * 0.56;
    const pileAt = four ? W - gap - cardH * 0.62 - cardW * 0.7 : pileX;
    if (helps.openPiles && pile.length > 0) {
      const step = Math.min(cardW * 0.42, (pileAt - cx - cardW * 0.2) / Math.max(1, pile.length - 1));
      pile.forEach((card, i) => {
        placed.push({ key: card, face: face(card), back: BACK, x: pileAt - (pile.length - 1 - i) * step, y, scale: 0.72, z: 60 + i, label: cardName(card) });
      });
      return;
    }
    pile.forEach((card, i) => {
      const depth = Math.min(i, 5) * 0.5;
      const label = seat === me ? t(four ? 'brisca.pile.us' : 'brisca.pile.you', { n: tricksOf(sideOf(seat)) }) : t('brisca.pile.them', { n: tricksOf(sideOf(seat)) });
      placed.push({ key: card, face: null, back: BACK, x: pileAt - depth, y: y - depth, rotate: 90, scale: four ? 0.66 : 0.78, z: 50 + i, label: i === pile.length - 1 ? label : undefined });
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
  const signs = legal.flatMap((a) => (a.type === 'sign' ? [a.sign] : []));
  // Lessons and drills that quiz the signs draw them without their names.
  const quiz = overlay.marks.some((m) => m.square === 'hide-sign-names');
  const signed = state.signals.filter((x) => four && x.seat === partnerOf(me) && sideOf(x.seat) === sideOf(me));
  const sidePoints = sidePiles({ won: d.won, config: state.config }).points;
  /** Name plates for the other three at a four-player table. */
  const tagAt = (seat: Seat): { left: string; top: string } => {
    const r = rel(seat);
    if (r === 2) return { left: `${cx}px`, top: `${gap + cardH * 0.68 + 12}px` };
    return { left: `${r === 1 ? W - gap - cardH * 0.34 : gap + cardH * 0.34}px`, top: `${midY - cardW * 1.15}px` };
  };

  return (
    <div ref={ref} className="card-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null}>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={duration} onCard={onCard} /> : null}
      {four
        ? d.hands.map((_, seat) =>
            rel(seat) === 0 ? null : (
              <div key={seat} className="brisca-seat-tag" data-acting={state.trick.length < n && (state.leader + state.trick.length) % n === seat && !state.over} style={tagAt(seat)}>
                {seatName(seat, me, n, names)}
                {rel(seat) === 2 && signed.length > 0 ? (
                  <span className="brisca-signed" aria-label={quiz ? t('brisca.signed.quiz') : t('brisca.signed', { cards: signed.map((x) => tDynamic(`brisca.sign.${x.sign}`)).join(', ') })}>
                    {signed.map((x) => (
                      <span key={x.sign} className="brisca-signed-one">
                        <SignFace sign={x.sign} size={quiz ? 40 : 22} />
                        {quiz ? null : tDynamic(`brisca.sign.short.${x.sign}`)}
                      </span>
                    ))}
                  </span>
                ) : null}
              </div>
            ),
          )
        : null}
      <div className="trump-badge" style={{ left: `${stockX - cardW * 0.5}px`, top: `${stockY + cardH * (four ? 0.5 : 0.56)}px` }} aria-label={t('brisca.trumps', { suit: suitName(trumpSuit) })}>
        <svg viewBox="-12 -12 24 24" width="18" height="18" aria-hidden="true">
          <SuitSign suit={trumpSuit} scale={0.9} />
        </svg>
        <span>{suitName(trumpSuit)}</span>
      </div>
      {helps.counts ? (
        <div className="pile-points num" style={four ? { right: `${gap}px`, top: `${midY - 10}px` } : { left: `${pileX - cardW * 0.7}px`, top: `${midY - 10}px` }}>
          {t(four ? 'brisca.points.sides' : 'brisca.points.both', { a: sidePoints[sideOf(me)] ?? 0, b: sidePoints[sideOf(them)] ?? 0 })}
        </div>
      ) : null}
      {swap && swapCard ? (
        <button type="button" className="btn btn-small swap-btn" style={four ? { left: `${cx}px`, top: `${H - cardH - gap - 30}px`, transform: 'translateX(-50%)' } : { left: `${stockX - cardW * 0.5}px`, top: `${midY - cardH * 0.9}px` }} onClick={() => onAction(swap)}>
          {t('brisca.swap', { card: cardName(swapCard) })}
        </button>
      ) : null}
      {callable && selected === `A${trumpSuit}` ? (
        <button type="button" className="btn btn-small call-btn" style={{ left: `${cx - cardW}px`, top: `${H - cardH - gap * 3 - 34}px` }} onClick={() => onAction({ type: 'play', card: `A${trumpSuit}` as Card, call: true })}>
          {t('brisca.call')}
        </button>
      ) : null}
      {canAct && signs.length > 0 ? (
        <div className="brisca-signs">
          {signing ? (
            <div className="brisca-sign-tray" role="group" aria-label={t('brisca.signs')}>
              {signs.map((sign: Sign) => (
                <button key={sign} type="button" className="btn btn-small brisca-sign-btn" onClick={() => (setSigning(false), onAction({ type: 'sign', sign }))} aria-label={t('brisca.sign.make', { card: tDynamic(`brisca.sign.${sign}`) })}>
                  <SignFace sign={sign} size={quiz ? 40 : 30} />
                  {quiz ? null : <span>{tDynamic(`brisca.sign.short.${sign}`)}</span>}
                </button>
              ))}
            </div>
          ) : null}
          <button type="button" className="btn btn-small" aria-expanded={signing} onClick={() => setSigning(!signing)}>
            {t('brisca.signs')}
          </button>
        </div>
      ) : null}
      {canAct && selected ? <p className="table-tip">{t('brisca.tap-again')}</p> : null}
      {handOver ? (
        <div className="hand-over" role="status">
          {t(four ? 'brisca.hand-over.sides' : 'brisca.hand-over', { a: handOver.points[sideOf(me)] ?? 0, b: handOver.points[sideOf(them)] ?? 0 })}
        </div>
      ) : null}
    </div>
  );
}

function isCardKey(key: string): key is Card {
  return /^[A234567SCR][oceb]$/.test(key);
}

