/** Card and suit names for the classic card games, through the text catalogue. */
import { tDynamic } from '../../text';
import type { Card, Suit } from './cards';

export function suitName(suit: Suit): string {
  return tDynamic(`classic.suit.${suit}`);
}

/** "Queen of spades", "10 of hearts": the label tests and screen readers use. */
export function cardName(card: Card): string {
  return tDynamic('classic.card', { rank: tDynamic(`classic.rank.${card[0]}`), suit: suitName(card[1] as Suit) });
}

const SYMBOL: Readonly<Record<Suit, string>> = { s: '♠', h: '♥', d: '♦', c: '♣' };

/** "Q♠", "10♥": short names for logs and counters. */
export function cardShort(card: Card): string {
  return `${card[0] === 'T' ? '10' : card[0]}${SYMBOL[card[1] as Suit]}`;
}

export function suitSymbol(suit: Suit): string {
  return SYMBOL[suit];
}

/** A list of short names: "Q♠ A♥ K♥". */
export function cardsShort(cards: readonly Card[]): string {
  return cards.map(cardShort).join(' ');
}
