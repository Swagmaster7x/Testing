/** Names of cards, hands and seats, from the text catalogue. */
import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { Card } from '../cards';
import { handNameParts } from '../evaluate';

export const rankWord = (rank: string): string => tDynamic(`poker.rank.${rank}`);
const rankPlural = (rank: string): string => tDynamic(`poker.ranks.${rank}`);

/** "Ace of hearts". */
export function cardName(card: Card): string {
  return t('poker.card', { rank: rankWord(card.charAt(0)), suit: tDynamic(`poker.suit.${card.charAt(1)}`) });
}

/** "Two pair, kings and nines", "Flush, ace high", "Royal flush". */
export function handName(value: number): string {
  const { category, ranks } = handNameParts(value);
  const [a = '2', b = '2'] = ranks;
  switch (category) {
    case 'high-card':
      return t('poker.hand.high-card', { a: rankWord(a) });
    case 'pair':
      return t('poker.hand.pair', { a: rankPlural(a) });
    case 'two-pair':
      return t('poker.hand.two-pair', { a: rankPlural(a), b: rankPlural(b) });
    case 'trips':
      return t('poker.hand.trips', { a: rankPlural(a) });
    case 'straight':
      return t('poker.hand.straight', { a: rankWord(a) });
    case 'flush':
      return t('poker.hand.flush', { a: rankWord(a) });
    case 'full-house':
      return t('poker.hand.full-house', { a: rankPlural(a), b: rankPlural(b) });
    case 'quads':
      return t('poker.hand.quads', { a: rankPlural(a) });
    case 'straight-flush':
      return a === 'A' ? t('poker.hand.royal-flush') : t('poker.hand.straight-flush', { a: rankWord(a) });
  }
}

/** The players' names round the table; a person's own seat is "You". */
export const NAMES: readonly string[] = ['Ana', 'Beto', 'Carmen', 'Diego', 'Elisa', 'Félix'];

/** A seat's name: "You", a person's name at a pass-and-play table, or the CPU player's name. */
export function seatName(seat: Seat, me: Seat | null, names?: (seat: Seat) => string | null): string {
  if (seat === me) return t('poker.seat.you');
  return names?.(seat) ?? NAMES[seat] ?? `#${seat + 1}`;
}

/** A hand's name inside a sentence: "two pair, kings and nines". */
export function handNameInline(value: number): string {
  const name = handName(value);
  return name.charAt(0).toLowerCase() + name.slice(1);
}
