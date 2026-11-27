/** Card, suit and seat names in the interface: Spanish card names, as players use them. */
import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { SeatNames } from '../../types';
import type { Card, IllegalReason, Suit } from '../rules';
import { rankOf, suitOf } from '../rules';

export function suitName(suit: Suit): string {
  return tDynamic(`tute.suit.${suit}`);
}

export function cardName(card: Card): string {
  return tDynamic('tute.card', { rank: tDynamic(`tute.rank.${rankOf(card)}`), suit: suitName(suitOf(card)) });
}

/** Where a seat sits, counted from me: you, right (plays after you), partner (opposite), left; with two players the other faces you. */
export type Place = 'bottom' | 'right' | 'top' | 'left';

export function placeOf(seat: Seat, me: Seat, players: number): Place {
  const rel = (seat - me + players) % players;
  if (players === 2) return rel === 0 ? 'bottom' : 'top';
  return (['bottom', 'right', 'top', 'left'] as const)[rel] ?? 'top';
}

/** A seat's name as seen from `me`: you, partner, right, left (the CPU with two players), or another person's name. */
export function seatName(seat: Seat, me: Seat, players: number, names?: SeatNames): string {
  const rel = (seat - me + players) % players;
  if (rel === 0) return t('tute.seat.you');
  const person = names?.(seat);
  if (person) return person;
  if (players === 2) return t('tute.seat.cpu');
  return t(rel === 1 ? 'tute.seat.right' : rel === 2 ? 'tute.seat.partner' : 'tute.seat.left');
}

/** The subject of a log line. */
export function whoName(seat: Seat, me: Seat, players: number, names?: SeatNames): string {
  const rel = (seat - me + players) % players;
  if (rel === 0) return t('tute.who.you');
  const person = names?.(seat);
  if (person) return person;
  if (players === 2) return t('tute.who.cpu');
  return t(rel === 1 ? 'tute.who.right' : rel === 2 ? 'tute.who.partner' : 'tute.who.left');
}

/** Why a card is refused, in words: the obligation that stops it. */
export function illegalText(reason: IllegalReason, led: Card | null, winning: Card | null, trumpSuit: Suit): string {
  const suit = led ? suitName(suitOf(led)) : '';
  switch (reason) {
    case 'follow':
      return t('tute.illegal.follow', { suit });
    case 'beat':
      return t('tute.illegal.beat', { card: winning ? cardName(winning) : '' });
    case 'trump':
      return t('tute.illegal.trump', { suit: suitName(trumpSuit) });
    case 'overtrump':
      return t('tute.illegal.overtrump', { card: winning ? cardName(winning) : '' });
    case 'trump-led':
      return t('tute.illegal.trump-led', { suit: suitName(trumpSuit) });
  }
}

/** "the 40", "the 20 in copas". */
export function canteName(suit: Suit, trumpSuit: Suit): string {
  return suit === trumpSuit ? t('tute.cante.forty') : t('tute.cante.twenty', { suit: suitName(suit) });
}
