/** Card and suit names in the interface: the Spanish names, as players use them. */
import { tDynamic } from '../../../text';
import type { Card, Suit } from '../rules';
import { rankOf, suitOf } from '../rules';

export function suitName(suit: Suit): string {
  return tDynamic(`brisca.suit.${suit}`);
}

export function cardName(card: Card): string {
  return tDynamic('brisca.card', { rank: tDynamic(`brisca.rank.${rankOf(card)}`), suit: suitName(suitOf(card)) });
}
