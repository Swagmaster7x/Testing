/**
 * The French 52-card pack for the classic card games (Blackjack, Hearts, Spades, Gin Rummy). Cards
 * are written as in the poker module: rank then suit, "As" the ace of spades, "Td" the ten of
 * diamonds, "2c" the two of clubs. In trick games the ace is high (rankValue 12); Gin Rummy
 * counts the ace low (see melds.ts).
 */
import type { Card, Rank, Suit } from '../holdem/cards';
import { DECK, isCard, RANKS, SUITS } from '../holdem/cards';
import type { Rng } from '../../core/rng';

export type { Card, Rank, Suit };
export { DECK, isCard, RANKS, SUITS };

export const suitOf = (card: Card): Suit => card[1] as Suit;
export const rankOf = (card: Card): Rank => card[0] as Rank;
/** 0 for a two, 12 for an ace (ace high, as in trick games). */
export const rankHigh = (card: Card): number => RANKS.indexOf(card[0] as Rank);

/** The order suits are shown in a hand: alternating colours, spades first. */
export const SHOW_SUITS: readonly Suit[] = ['s', 'h', 'c', 'd'];

/** A hand sorted for showing: by suit in alternating colours, high cards first within a suit. */
export function sortHand(cards: readonly Card[], order: readonly Suit[] = SHOW_SUITS, aceLow = false): Card[] {
  const rank = (c: Card) => (aceLow && c[0] === 'A' ? -1 : rankHigh(c));
  return [...cards].sort((a, b) => order.indexOf(suitOf(a)) - order.indexOf(suitOf(b)) || rank(b) - rank(a));
}

/** A shuffled pack dealt out one card at a time, starting with `first`, `size` cards to each of `players`. */
export function dealHands(rng: Rng, players: number, size: number, first = 0): { hands: Card[][]; rest: Card[] } {
  const pack = rng.shuffle(DECK);
  const hands: Card[][] = Array.from({ length: players }, () => []);
  for (let i = 0; i < players * size; i++) (hands[(first + i) % players] as Card[]).push(pack[i] as Card);
  return { hands, rest: pack.slice(players * size) };
}

/** Checks that a list of cards is a set of distinct real cards. */
export function readCards(json: unknown, what: string): Card[] {
  if (!Array.isArray(json) || !json.every((c) => typeof c === 'string' && isCard(c))) throw new Error(`${what} is damaged`);
  return json;
}

/** Cards in canonical order (for comparing lists of cards and writing them down). */
export function canonical(cards: readonly Card[]): Card[] {
  return [...cards].sort((a, b) => DECK.indexOf(a) - DECK.indexOf(b));
}

/** Throws unless the cards are the whole pack, each once. */
export function checkWholePack(cards: readonly Card[], what: string): void {
  if (cards.length !== DECK.length || new Set(cards).size !== DECK.length) {
    throw new Error(`${what}: ${cards.length} cards (${new Set(cards).size} different), not the ${DECK.length} of the pack`);
  }
}
