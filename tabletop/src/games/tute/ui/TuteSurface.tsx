/**
 * The Tute table. You sit at the bottom. With four players your partner faces you, the player
 * after you (play goes to the right) sits on your right and the one before you on your left; the
 * trick is laid as a cross, each card in front of the seat that played it. With two players the
 * other player faces you and the stock lies on the left with the turned card across its foot.
 *
 * Cards everyone knows a seat holds (the dealer's turned card, a pair that was sung, a card taken
 * in an exchange) are shown face up in that seat's hand. On your turn every card of yours can be
 * pressed: the ones you may not play are dimmed, and pressing one says which obligation stops it.
 * Tap a card to lift it, tap it again to play it. Cantes, a tute and the exchange are buttons.
 *
 * What is drawn lags the rules by the events still queued: a card the rules have already moved
 * stays where it was until its event plays, then slides to its new place.
 */
import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import type { PlacedCard } from '../../../kits/cards/CardLayer';
import { CardLayer, useSize } from '../../../kits/cards/CardLayer';
import { CardBack, SpanishCardFace, SuitSign } from '../../../kits/cards/spanish';
import { t } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { Cante, Card, PlayedCard, Suit, TuteAction, TuteEvent, TuteState } from '../rules';
import { beats, explainCard, isCard, LAST_TEN, rankOf, seatCount, sideOf, sidePoints, strength, suitOf, swapCardFor, winningPlay } from '../rules';
import { canteName, cardName, illegalText, placeOf, seatName, suitName } from './names';
import './tute.css';

interface Display {
  readonly hands: Card[][];
  readonly stock: Card[];
  readonly turned: Card | null;
  readonly trick: PlayedCard[];
  readonly won: Card[][];
  readonly cantes: Cante[];
  readonly known: Card[][];
  /** Before a deal has played: the table is cleared. */
  readonly cleared: boolean;
}

/** The table as it looks before the queued events play. */
export function displayOf(state: TuteState, pending: readonly TuteEvent[]): Display {
  const d: Display = {
    hands: state.hands.map((h) => [...h]),
    stock: [...state.stock],
    turned: state.turned,
    trick: [...state.trick],
    won: state.won.map((w) => [...w]),
    cantes: [...state.cantes],
    known: state.known.map((k) => [...k]),
    cleared: false,
  };
  let turned = d.turned;
  let cleared = false;
  const players = seatCount(state.config);
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
        const pile = d.won[sideOf(e.winner, players)] ?? [];
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
        if (e.dealer === null) d.stock[d.stock.length - 1] = e.took;
        else {
          const dealt = d.hands[e.dealer] ?? [];
          const j = dealt.indexOf(e.gave);
          if (j >= 0) dealt.splice(j, 1, e.took);
        }
        turned = e.took;
        break;
      }
      case 'sing':
        d.cantes.pop();
        break;
      case 'deal':
        cleared = true;
        break;
      default:
        break;
    }
  }
  if (cleared) return { hands: d.hands.map(() => []), stock: [], turned: null, trick: [], won: [[], []], cantes: [], known: d.known.map(() => []), cleared: true };
  return { ...d, turned, cleared: false };
}

const SUIT_ORDER: readonly Suit[] = ['o', 'c', 'e', 'b'];

/** Your hand, trumps last, each suit strongest first. */
function sortHand(cards: readonly Card[], trumpSuit: Suit): Card[] {
  const order = (s: Suit) => (s === trumpSuit ? 9 : SUIT_ORDER.indexOf(s));
  return [...cards].sort((a, b) => order(suitOf(a)) - order(suitOf(b)) || strength(b) - strength(a));
}

const face = (card: Card, dim = false): ReactNode => (
  <span className="tute-face" data-dim={dim || undefined}>
    <SpanishCardFace rank={rankOf(card)} suit={suitOf(card)} />
  </span>
);
const BACK = <CardBack />;

export function TuteSeatMark({ seat }: { seat: Seat }) {
  const ours = seat % 2 === 0;
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2.5" fill={ours ? '#f6efdf' : '#2b4a3c'} stroke={ours ? '#b9ab8e' : '#c9a25a'} />
      {ours ? <SuitSign suit="c" x={12} y={12} scale={0.42} /> : <SuitSign suit="e" x={12} y={12} scale={0.42} />}
    </svg>
  );
}

interface Note {
  readonly key: string;
  readonly text: string;
}

export function TuteSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, overlay, names }: SurfaceProps<TuteState, TuteAction, TuteEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [selected, setSelected] = useState<Card | null>(null);
  const [note, setNote] = useState<Note | null>(null);
  const players = seatCount(state.config);
  const me: Seat = mySeats[0] ?? 0;
  const pending = anim.pending.map((p) => p.event);
  const playing = anim.playing?.event ?? null;
  const d = displayOf(state, pending);
  const W = size.width;
  const H = size.height;
  const four = players === 4;
  // Card size: your hand of ten (or eight) must fit across, and the table needs room above it.
  const cardH = Math.max(46, Math.min(150, H * (four ? 0.25 : 0.27), (W / (four ? 7.4 : 6.2)) * 1.5));
  const cardW = cardH / 1.5;
  const gap = Math.max(5, H * 0.018);
  const small = four ? 0.5 : 0.72;
  const open = helps.openHand === true;
  const decisionKey = `${state.handNo}/${state.tricks.length}/${state.trick.length}/${state.cantes.length}`;
  const shownNote = note && note.key === decisionKey ? note : null;
  const playable = new Set(legal.flatMap((a) => (a.type === 'play' ? [a.card] : [])));
  const sings = legal.flatMap((a) => (a.type === 'sing' ? [a.suit] : []));
  const tutes = legal.flatMap((a) => (a.type === 'tute' ? [a.kind] : []));
  const swap = legal.find((a) => a.type === 'swap');
  const myTurn = canAct && legal.length > 0 && !d.cleared;
  const showLegal = helps.legal !== false;
  const hintCard = overlay.marks.find((m) => isCard(m.square))?.square ?? null;
  const placed: PlacedCard[] = [];

  // Regions: your hand along the bottom, the others round the edge, the trick in the middle.
  const handY = H - gap - cardH / 2;
  const topY = gap + 14 + (cardH * small) / 2;
  const sideW = four ? cardW * small + gap * 2 + 8 : 0;
  const stockX = four ? 0 : gap + cardW * 0.75;
  const pileX = W - gap - cardW * 0.62;
  const cx = four ? W / 2 : (stockX + cardW * 0.6 + pileX - cardW * 0.6) / 2;
  const cy = four ? (topY + (cardH * small) / 2 + (H - cardH - gap * 2)) / 2 : H * 0.47;

  // The stock (two players), face down, with the turned card across its foot.
  d.stock.forEach((card, i) => {
    const isTurned = d.turned === card && i === d.stock.length - 1;
    if (isTurned) placed.push({ key: card, face: face(card), back: BACK, x: stockX + cardW * 0.42, y: cy, rotate: 90, z: 1, label: t('tute.turned.stock', { card: cardName(card) }) });
    else {
      const depth = Math.min(i, 5) * 0.6;
      placed.push({ key: card, face: null, back: BACK, x: stockX - depth, y: cy - depth, z: 10 + (d.stock.length - i), label: i === 0 ? t('tute.stock', { n: d.stock.length - (d.turned ? 1 : 0) }) : undefined });
    }
  });

  // Hands. `stackEdge` keeps where each other seat's cards begin, for its name tag.
  const stackEdge: number[] = [];
  for (let seat = 0; seat < players; seat++) {
    const where = placeOf(seat, me, players);
    const known = new Set(d.known[seat] ?? []);
    const raw = d.hands[seat] ?? [];
    if (where === 'bottom') {
      const cards = sortHand(raw, state.trumpSuit);
      const spacing = Math.min(cardW * 1.04, (W - 2 * gap - cardW) / Math.max(1, cards.length - 1));
      cards.forEach((card, i) => {
        const allowed = playable.has(card);
        placed.push({
          key: card,
          face: face(card, myTurn && showLegal && !allowed && playable.size > 0),
          back: BACK,
          x: W / 2 + (i - (cards.length - 1) / 2) * spacing,
          y: handY,
          z: 100 + i,
          label: cardName(card),
          interactive: myTurn && playable.size > 0,
          selected: myTurn && selected === card && allowed,
          tone: hintCard === card ? 'hint' : helps.whatBeats && myTurn && allowed && beatsTrick(card) ? 'win' : null,
        });
      });
      continue;
    }
    // Known cards first, face up and spread so they can be read; the rest face down and close.
    const cards = [...raw.filter((c) => known.has(c)), ...raw.filter((c) => !known.has(c))];
    const k = cards.length;
    const across = where === 'top';
    const unit = across ? cardW * small : cardH * small;
    const steps = cards.slice(0, -1).map((c) => unit * (open || known.has(c) ? (across ? 0.62 : 0.6) : across ? 0.3 : 0.2));
    const room = across ? W * 0.5 : H * 0.4;
    const total = steps.reduce((a, b) => a + b, 0);
    const fit = total > room ? room / total : 1;
    let at = -(total * fit) / 2;
    stackEdge[seat] = (across ? topY : cy) - (total * fit) / 2 - unit / 2;
    cards.forEach((card, i) => {
      const up = open || known.has(card);
      const label = up ? t(known.has(card) ? 'tute.their-card.known' : 'tute.their-card.up', { who: seatName(seat, me, players, names), card: cardName(card) }) : i === 0 ? t('tute.their-cards', { who: seatName(seat, me, players, names), n: k }) : undefined;
      const key = up ? card : `${seat}-back-${i}`;
      if (across) placed.push({ key, face: up ? face(card) : null, back: BACK, x: W / 2 + at, y: topY, z: 100 + i, scale: small, label });
      else {
        const x = where === 'left' ? gap + (cardW * small) / 2 + 2 : W - gap - (cardW * small) / 2 - 2;
        placed.push({ key, face: up ? face(card) : null, back: BACK, x, y: cy + at, z: 100 + i, scale: small, label });
      }
      at += (steps[i] ?? 0) * fit;
    });
  }

  // The trick: a cross with four players, two overlapping cards with two.
  const spot = (seat: Seat): { x: number; y: number; r: number } => {
    const where = placeOf(seat, me, players);
    if (!four) return where === 'bottom' ? { x: cx + cardW * 0.34, y: cy + 6, r: 5 } : { x: cx - cardW * 0.34, y: cy - 4, r: -4 };
    const dy = Math.min(cardH * 0.4, Math.max(cardH * 0.26, (handY - cardH / 2 - topY - (cardH * small) / 2 - cardH * 0.84) / 2));
    const dx = cardW * 0.82;
    return where === 'bottom' ? { x: cx, y: cy + dy, r: 2 } : where === 'top' ? { x: cx, y: cy - dy, r: -2 } : where === 'right' ? { x: cx + dx, y: cy, r: 6 } : { x: cx - dx, y: cy, r: -6 };
  };
  d.trick.forEach((p, i) => {
    const at = spot(p.seat);
    placed.push({ key: p.card, face: face(p.card), back: BACK, x: at.x, y: at.y, rotate: at.r, scale: four ? 0.86 : 1, z: 200 + i, label: t('tute.played', { who: seatName(p.seat, me, players, names), card: cardName(p.card) }) });
  });

  // Won tricks, face down by side: ours below the middle on the right, theirs above, each with its count.
  const pileTags: { side: number; x: number; y: number; text: string }[] = [];
  const mySide = sideOf(me, players);
  [mySide, 1 - mySide].forEach((side) => {
    const pile = d.won[side] ?? [];
    const y = side === mySide ? cy + cardH * 0.5 : cy - cardH * 0.5;
    const x = four ? W - sideW - gap - cardW * 0.55 : pileX;
    const tricks = pile.length / players;
    const tag = t(side === mySide ? 'tute.pile.us' : 'tute.pile.them', { n: tricks });
    if (helps.openPiles && pile.length > 0) {
      // Face up for counting: a grid across the middle of the table, ours below and theirs above.
      const top = topY + (cardH * small) / 2 + 18;
      const bottom = (d.hands[me]?.length ?? 0) > 0 ? handY - cardH / 2 - 8 : H - gap;
      const mid = (top + bottom) / 2;
      const left = (four ? sideW + gap : stockX + cardW) + 34;
      const right = W - (four ? sideW + gap : gap) - 34;
      const s = Math.min(0.62, ((bottom - top) / 2 - 16) / (cardH * 1.1));
      const cw = cardW * s;
      const ch = cardH * s;
      const step = cw * 0.6;
      const perRow = Math.max(1, Math.floor((right - left - cw) / step) + 1);
      const rows = Math.ceil(pile.length / perRow);
      const rowStep = Math.min(ch * 0.5, rows > 1 ? (mid - top - 16 - ch) / (rows - 1) : ch);
      const blockTop = side === mySide ? mid + 16 : top + 14;
      pile.forEach((card, i) => {
        const row = Math.floor(i / perRow);
        const inRow = Math.min(perRow, pile.length - row * perRow);
        const col = i % perRow;
        placed.push({ key: card, face: face(card), back: BACK, x: (left + right) / 2 + (col - (inRow - 1) / 2) * step, y: blockTop + ch / 2 + row * rowStep, scale: s, z: 60 + i, label: cardName(card) });
      });
      pileTags.push({ side, x: (left + right) / 2, y: blockTop - 16, text: tag });
      return;
    }
    if (pile.length > 0) pileTags.push({ side, x, y: y + cardW * 0.3 + 2, text: tag });
    pile.forEach((card, i) => {
      const depth = Math.min(i, 5) * 0.5;
      placed.push({ key: card, face: null, back: BACK, x: x - depth, y: y - depth, rotate: 90, scale: 0.52, z: 50 + i, label: i === pile.length - 1 ? t(side === mySide ? 'tute.pile.us' : 'tute.pile.them', { n: tricks }) : undefined });
    });
  });

  function beatsTrick(card: Card): boolean {
    if (d.trick.length === 0) return false;
    return beats(card, winningPlay(d.trick, state.trumpSuit).card, state.trumpSuit);
  }

  const onCard = (key: string) => {
    if (!isCard(key) || !myTurn) return;
    const card = key;
    if (!playable.has(card)) {
      const reason = explainCard(state, card);
      setSelected(null);
      if (reason) {
        const led = state.trick[0]?.card ?? null;
        const winning = state.trick.length > 0 ? winningPlay(state.trick, state.trumpSuit).card : null;
        setNote({ key: decisionKey, text: illegalText(reason, led, winning, state.trumpSuit) });
      }
      return;
    }
    setNote(null);
    if (selected === card) {
      setSelected(null);
      onAction({ type: 'play', card });
    } else setSelected(card);
  };

  const duration = anim.playing ? Math.min(anim.duration, 520) : 220;
  const handOver = playing?.type === 'hand-end' ? playing.result : null;
  const singing = playing?.type === 'sing' ? playing : null;
  const declaring = playing?.type === 'tute' ? playing : null;
  const swapCard = d.turned ? swapCardFor(d.turned, state.config) : null;
  const turnSeat = anim.playing || anim.pending.length > 0 || state.over ? null : (state.leader + state.trick.length) % players;

  // Seat tags: name, dealer, the turn, and a bubble while a cante or tute plays.
  const noteShown = shownNote !== null || (myTurn && selected !== null && playable.has(selected));
  const tags = Array.from({ length: players }, (_, seat) => {
    const where = placeOf(seat, me, players);
    // Your own tag makes way for a note above your hand.
    if (where === 'bottom' && noteShown) return null;
    const style =
      where === 'bottom'
        ? { left: `${gap}px`, bottom: `${cardH + gap * 1.6}px` }
        : where === 'top'
          ? { left: '50%', top: `${gap / 2}px`, transform: 'translateX(-50%)' }
          : where === 'left'
            ? { left: `${gap / 2}px`, top: `${Math.max(gap, (stackEdge[seat] ?? cy) - 22)}px` }
            : { right: `${gap / 2}px`, top: `${Math.max(gap, (stackEdge[seat] ?? cy) - 22)}px` };
    const bubble = singing?.seat === seat ? canteName(singing.suit, state.trumpSuit) : declaring?.seat === seat ? t('tute.tute-bubble') : null;
    return (
      <div key={seat} className="seat-tag tute-seat" data-where={where} data-turn={turnSeat === seat} style={style}>
        <span>{seatName(seat, me, players, names)}</span>
        {seat === state.dealer ? <span className="tute-dealer">{t('tute.dealer-mark')}</span> : null}
        {bubble ? (
          <span className="seat-pass" role="status">
            {bubble}
          </span>
        ) : null}
      </div>
    );
  });

  const result = handOver;
  const us = mySide;
  const resultText = result
    ? result.vuelta
      ? t('tute.hand.vuelta', { a: (result.carried[us] ?? 0) + (result.points[us] ?? 0), b: (result.carried[1 - us] ?? 0) + (result.points[1 - us] ?? 0) })
      : result.tute !== null
        ? t(sideOf(result.tute, players) === us ? 'tute.hand.tute.us' : 'tute.hand.tute.them', { who: seatName(result.tute, me, players, names) })
        : result.winner === null
          ? t('tute.hand.tie', { a: result.points[us] ?? 0, b: result.points[1 - us] ?? 0 })
          : t(result.winner === us ? (four ? 'tute.hand.we' : 'tute.hand.you') : four ? 'tute.hand.they' : 'tute.hand.cpu', {
              a: (result.carried[us] ?? 0) + (result.points[us] ?? 0),
              b: (result.carried[1 - us] ?? 0) + (result.points[1 - us] ?? 0),
            })
    : null;

  const buttonsY = H - cardH - gap * 2 - 30;
  const trumpSuit: Suit = state.trumpSuit;

  return (
    <div ref={ref} className="card-table tute-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null} data-players={players}>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={duration} onCard={onCard} /> : null}
      {W > 0 ? tags : null}
      {W > 0
        ? pileTags.map((p) => (
            <span key={p.side} className="yard-tag tute-pile-tag" style={{ left: `${p.x}px`, top: `${p.y}px` }} aria-hidden="true">
              {p.text}
            </span>
          ))
        : null}
      {d.cleared ? null : (
        <div className="trump-badge tute-trumps" style={!four && d.stock.length > 0 ? { left: `${stockX - cardW * 0.5}px`, top: `${cy - cardH * 0.5 - 30}px` } : { left: `${gap}px`, top: `${gap / 2}px` }} aria-label={t('tute.trumps', { suit: suitName(trumpSuit) })}>
          <svg viewBox="-12 -12 24 24" width="18" height="18" aria-hidden="true">
            <SuitSign suit={trumpSuit} scale={0.9} />
          </svg>
          <span>{suitName(trumpSuit)}</span>
        </div>
      )}
      {helps.counts ? (
        <div className="pile-points num tute-points" style={four ? { left: `${gap}px`, top: `${gap / 2 + 30}px` } : { right: `${gap}px`, top: `${gap / 2}px` }} aria-label={t('tute.counter.points')}>
          {t('tute.points.both', { a: sidePoints(state, us), b: sidePoints(state, 1 - us) })}
        </div>
      ) : null}
      {myTurn && (sings.length > 0 || tutes.length > 0 || (swap && swapCard)) ? (
        <div className="tute-actions" style={{ left: `${gap}px`, top: `${buttonsY}px` }}>
          {tutes.map((kind) => (
            <button key={kind} type="button" className="btn btn-small btn-primary" onClick={() => onAction({ type: 'tute', kind })}>
              {t(kind === 'R' ? 'tute.declare.kings' : 'tute.declare.knights')}
            </button>
          ))}
          {sings.map((suit) => (
            <button key={suit} type="button" className="btn btn-small btn-primary" onClick={() => onAction({ type: 'sing', suit })}>
              {t('tute.sing', { cante: canteName(suit, trumpSuit) })}
            </button>
          ))}
          {swap && swapCard ? (
            <button type="button" className="btn btn-small" onClick={() => onAction(swap)}>
              {t('tute.swap', { card: cardName(swapCard) })}
            </button>
          ) : null}
        </div>
      ) : null}
      {shownNote ? (
        <p className="table-tip tute-refused" role="alert" style={{ bottom: `${cardH + gap * 1.8}px` }}>
          {shownNote.text}
        </p>
      ) : myTurn && selected && playable.has(selected) ? (
        <p className="table-tip" style={{ bottom: `${cardH + gap * 1.8}px` }}>{t('tute.tap-again')}</p>
      ) : null}
      {resultText ? (
        <div className="hand-over tute-hand-over" role="status">
          {resultText}
          {result && !result.vuelta && result.tute === null ? (
            <span className="tute-hand-detail num">
              {t('tute.hand.detail', { cards: (result.points[us] ?? 0) - (result.cantes[us] ?? 0) - (result.lastTrick === us ? LAST_TEN : 0), cantes: result.cantes[us] ?? 0 })}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
