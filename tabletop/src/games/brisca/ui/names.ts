/** Card, suit and seat names in the interface: the Spanish card names, as players use them. */
import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { SeatNames } from '../../types';
import type { Card, Suit } from '../rules';
import { rankOf, suitOf } from '../rules';

export function suitName(suit: Suit): string {
  return tDynamic(`brisca.suit.${suit}`);
}

export function cardName(card: Card): string {
  return tDynamic('brisca.card', { rank: tDynamic(`brisca.rank.${rankOf(card)}`), suit: suitName(suitOf(card)) });
}

/** A seat as seen from `me`: you, the CPU (two players), or right, partner, left; a person's name at a pass-and-play table. */
export function seatName(seat: Seat, me: Seat, n: number, names?: SeatNames): string {
  const rel = (seat - me + n) % n;
  if (rel === 0) return t('brisca.who.you');
  const person = names?.(seat);
  if (person) return person;
  if (n === 2) return t('brisca.who.cpu');
  return t(rel === 1 ? 'brisca.who.right' : rel === 2 ? 'brisca.who.partner' : 'brisca.who.left');
}
