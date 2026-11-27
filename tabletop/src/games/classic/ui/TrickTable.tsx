/**
 * The four-seat trick table shared by Hearts and Spades (PLAN.md 1.4): your hand fanned along the
 * bottom, the player on your left at the left, across at the top, on your right at the right; the
 * trick in the middle, each card in front of the player who played it. Tap a card to lift it and
 * again to play it; in a pass, tap cards to choose them and confirm with the button.
 */
import type { CSSProperties, ReactNode } from 'react';
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import type { PlacedCard } from '../../../kits/cards/CardLayer';
import { CardLayer, useSize } from '../../../kits/cards/CardLayer';
import { FrenchCardBack, FrenchCardFace } from '../../../kits/cards/french';
import { t } from '../../../text';
import type { Card } from '../cards';
import { sortHand } from '../cards';
import { cardName } from '../names';
import type { Play } from '../tricks';
import './classic.css';

export interface SeatTag {
  readonly name: string;
  readonly detail: string;
  readonly turn: boolean;
}

export interface TrickTableProps {
  readonly hands: readonly (readonly Card[])[];
  readonly me: Seat;
  /** Show every hand face up (cards-up rounds and lessons). */
  readonly open: boolean;
  readonly trick: readonly Play[];
  readonly playable: ReadonlySet<Card>;
  readonly canAct: boolean;
  readonly onPlay: (card: Card) => void;
  readonly onSkip: () => void;
  readonly busy: boolean;
  readonly duration: number;
  /** Choosing several cards (the Hearts pass) instead of playing one. */
  readonly choose?: { readonly count: number; readonly selected: readonly Card[]; readonly onToggle: (card: Card) => void };
  readonly tag: (seat: Seat) => SeatTag;
  /** Rings a card in your hand (a hint, or "this wins"). */
  readonly tone?: (card: Card) => 'win' | 'hint' | null;
  /** Hide your own hand (a blind nil not yet chosen). */
  readonly hideMine?: boolean;
  /** Controls and banners drawn over the table. */
  readonly children?: ReactNode;
  /** The seat that led the trick shown, to mark it. */
  readonly highlight?: Seat | null;
}

const face = (card: Card) => <FrenchCardFace card={card} />;
const BACK = <FrenchCardBack />;

/** Where a seat sits relative to you: 0 bottom, 1 left, 2 top, 3 right. */
export const placeOf = (seat: Seat, me: Seat): number => (seat - me + 4) % 4;

export function TrickTable(p: TrickTableProps) {
  const [ref, size] = useSize<HTMLDivElement>();
  const [lifted, setLifted] = useState<Card | null>(null);
  const W = size.width;
  const H = size.height;
  const cardW = Math.max(30, Math.min(W / 9.5, (H * 0.3) / 1.5));
  const cardH = cardW * 1.5;
  const gap = Math.max(4, H * 0.015);
  const small = cardW * 0.62;
  const cx = W / 2;
  const cy = H * 0.44;
  const placed: PlacedCard[] = [];

  // Your hand along the bottom.
  const mine = sortHand(p.hands[p.me] ?? []);
  const step = Math.min(cardW * 0.66, (W - cardW - 2 * gap) / Math.max(1, mine.length - 1));
  const startX = cx - ((mine.length - 1) * step) / 2;
  const chosen = new Set(p.choose?.selected ?? []);
  mine.forEach((card, i) => {
    const can = p.canAct && p.playable.has(card);
    placed.push({
      key: p.hideMine ? `mine-${i}` : card,
      face: p.hideMine ? null : face(card),
      back: BACK,
      x: startX + i * step,
      y: H - gap - cardH / 2,
      z: 100 + i,
      label: p.hideMine ? t('classic.your-card-hidden') : cardName(card),
      interactive: can && !p.hideMine,
      selected: p.choose ? chosen.has(card) : can && lifted === card,
      tone: p.tone?.(card) ?? null,
    });
  });

  // The other three hands: face down (or up in an open round), small, along their edge.
  for (const seat of [0, 1, 2, 3]) {
    if (seat === p.me) continue;
    const where = placeOf(seat, p.me);
    const cards = sortHand(p.hands[seat] ?? []);
    const n = cards.length;
    const open = p.open;
    const along = open ? small * 0.42 : Math.min(small * 0.22, 9);
    cards.forEach((card, i) => {
      const off = (i - (n - 1) / 2) * along;
      let x: number;
      let y: number;
      let rotate = 0;
      if (where === 2) {
        x = cx + off;
        y = gap + (small * 1.5) / 2;
      } else {
        x = where === 1 ? gap + small * 0.75 : W - gap - small * 0.75;
        y = cy - cardH * 0.1 + off;
        rotate = open ? 0 : 90;
      }
      placed.push({ key: open ? card : `back-${seat}-${i}`, face: open ? face(card) : null, back: BACK, x, y, rotate, z: 20 + i, scale: small / cardW, label: open ? cardName(card) : undefined });
    });
  }

  // The trick, each card in front of its player.
  const tw = cardW * 0.9;
  const dx = Math.min(tw * 0.95, W * 0.11);
  const dy = Math.min(tw * 0.62, H * 0.12);
  p.trick.forEach((play, i) => {
    const where = placeOf(play.seat, p.me);
    const [ox, oy] = where === 0 ? [0, dy] : where === 1 ? [-dx, 0] : where === 2 ? [0, -dy] : [dx, 0];
    placed.push({ key: play.card, face: face(play.card), back: BACK, x: cx + ox, y: cy + oy, rotate: (where % 2 === 0 ? 1 : -1) * (i * 2 - 3), z: 200 + i, scale: tw / cardW, label: cardName(play.card) });
  });

  const onCard = (key: string) => {
    const card = key as Card;
    if (p.choose) {
      p.choose.onToggle(card);
      return;
    }
    if (lifted === card) {
      setLifted(null);
      p.onPlay(card);
    } else setLifted(card);
  };

  const tagStyle = (where: number): CSSProperties => {
    if (where === 0) return { left: '50%', bottom: `${cardH + gap * 2}px`, transform: 'translateX(-50%)' };
    if (where === 2) return { left: `${cx + small * 3.2}px`, top: `${gap}px` };
    if (where === 1) return { left: `${gap}px`, top: `${cy + small * 1.2}px` };
    return { right: `${gap}px`, top: `${cy + small * 1.2}px` };
  };

  return (
    <div ref={ref} className="card-table trick-table" onPointerDown={(e) => e.target === e.currentTarget && p.onSkip()} data-busy={p.busy}>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={p.duration} onCard={onCard} /> : null}
      {[0, 1, 2, 3].map((seat) => {
        const where = placeOf(seat, p.me);
        const tag = p.tag(seat);
        return (
          <div key={seat} className="seat-tag trick-seat" data-where={['bottom', 'left', 'top', 'right'][where]} data-turn={tag.turn} style={tagStyle(where)}>
            <b>{tag.name}</b>
            {tag.detail ? <span className="trick-seat-detail num">{tag.detail}</span> : null}
          </div>
        );
      })}
      {p.canAct && lifted && !p.choose && p.playable.has(lifted) ? <p className="table-tip">{t('classic.tap-again')}</p> : null}
      {p.children}
    </div>
  );
}
