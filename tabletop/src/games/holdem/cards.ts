/**
 * The 52-card pack for Hold'em. A card is written rank then suit: "Ah" is the ace of hearts,
 * "Td" the ten of diamonds, "2c" the two of clubs. Inside the evaluator a card is a number from 0
 * to 51: rank * 4 + suit, with ranks 0 (two) to 12 (ace) and suits clubs, diamonds, hearts, spades.
 */
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
export type Suit = 'c' | 'd' | 'h' | 's';
export type Card = `${Rank}${Suit}`;

export const RANKS: readonly Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];
export const SUITS: readonly Suit[] = ['c', 'd', 'h', 's'];
export const DECK: readonly Card[] = RANKS.flatMap((r) => SUITS.map((s): Card => `${r}${s}`));

const INDEX = new Map<Card, number>(DECK.map((c, i) => [c, i]));

export function isCard(text: string): text is Card {
  return /^[2-9TJQKA][cdhs]$/.test(text);
}

export function cardIndex(card: Card): number {
  const i = INDEX.get(card);
  if (i === undefined) throw new Error(`Not a card: ${card}`);
  return i;
}

export function cardOf(index: number): Card {
  const c = DECK[index];
  if (!c) throw new Error(`No card ${index}`);
  return c;
}

/** 0 for a two, 12 for an ace. */
export const rankValue = (card: Card): number => RANKS.indexOf(card[0] as Rank);
export const suitOf = (card: Card): Suit => card[1] as Suit;

/** "AKs", "QJo", "77": the starting-hand class of two hole cards, higher rank first. */
export function handClass(a: Card, b: Card): string {
  const ra = rankValue(a);
  const rb = rankValue(b);
  const hi = RANKS[Math.max(ra, rb)] as string;
  const lo = RANKS[Math.min(ra, rb)] as string;
  if (ra === rb) return `${hi}${lo}`;
  return `${hi}${lo}${suitOf(a) === suitOf(b) ? 's' : 'o'}`;
}

/** All 169 starting-hand classes, as a 13 by 13 grid: pairs on the diagonal, suited above, offsuit below. */
export const HAND_CLASSES: readonly string[] = (() => {
  const out: string[] = [];
  for (let i = 12; i >= 0; i--) {
    for (let j = 12; j >= 0; j--) {
      const a = RANKS[i] as string;
      const b = RANKS[j] as string;
      if (i === j) out.push(`${a}${b}`);
      else if (j < i) out.push(`${a}${b}s`);
      else out.push(`${b}${a}o`);
    }
  }
  return out;
})();
