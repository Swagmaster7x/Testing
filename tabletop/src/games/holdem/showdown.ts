/**
 * What a hand is worth at the showdown in each game on the poker engine
 * (docs/rules/poker-variants.md): the best five of the cards in Hold'em, Draw and Stud; exactly
 * two hole cards with exactly three board cards in Omaha; and the eight-or-better low for the
 * high-low games. Also the hand a Stud player shows, which sets the order of play.
 */
import type { Card } from './cards';
import { cardIndex } from './cards';
import { evaluateIndices } from './evaluate';
import type { PokerGame } from './rules';

/** Card numbers' ranks: 0 for a two up to 12 for an ace. */
const rank = (c: number) => c >> 2;

function combos<T>(items: readonly T[], k: number): T[][] {
  const out: T[][] = [];
  const pick = (from: number, chosen: T[]) => {
    if (chosen.length === k) {
      out.push([...chosen]);
      return;
    }
    for (let i = from; i <= items.length - (k - chosen.length); i++) {
      chosen.push(items[i] as T);
      pick(i + 1, chosen);
      chosen.pop();
    }
  };
  pick(0, []);
  return out;
}

const TWO_OF_FOUR_PLUS = new Map<string, number[][][]>();

/** Omaha's ways to make a hand: every two of the hole cards with every three of the board. */
function omahaHands(hole: readonly number[], board: readonly number[]): number[][] {
  const key = `${hole.length}/${board.length}`;
  let shapes = TWO_OF_FOUR_PLUS.get(key);
  if (!shapes) {
    const h = combos([...hole.keys()], 2);
    const b = combos([...board.keys()], 3);
    shapes = h.flatMap((hi) => b.map((bi) => [hi, bi]));
    TWO_OF_FOUR_PLUS.set(key, shapes);
  }
  return shapes.map(([hi = [], bi = []]) => [...hi.map((i) => hole[i] as number), ...bi.map((i) => board[i] as number)]);
}

/** The high value of a hand (higher is better), from card numbers. */
export function highValueOf(game: PokerGame, hole: readonly number[], up: readonly number[], board: readonly number[]): number {
  if (game === 'omaha') {
    if (board.length < 3) return evaluateIndices([...hole]);
    let best = -1;
    for (const five of omahaHands(hole, board)) best = Math.max(best, evaluateIndices(five));
    return best;
  }
  return evaluateIndices([...hole, ...up, ...board]);
}

/** Ace-to-five ranks: an ace is 1, a two 2, ... an eight 8; above eight does not count. */
const lowRank = (c: number) => (rank(c) === 12 ? 1 : rank(c) + 2);

/** The low value of five cards, or null unless they are five different ranks of eight or lower. Lower is better. */
function lowOfFive(five: readonly number[]): number | null {
  const ranks = five.map(lowRank);
  if (ranks.some((r) => r > 8)) return null;
  if (new Set(ranks).size !== 5) return null;
  ranks.sort((a, b) => b - a);
  return ranks.reduce((v, r) => v * 16 + r, 0);
}

/** The eight-or-better low value of a hand, or null when it has none. Lower is better. */
export function lowValueOf(game: PokerGame, hole: readonly number[], up: readonly number[], board: readonly number[]): number | null {
  if (game === 'omaha') {
    if (board.length < 3) return null;
    let best: number | null = null;
    for (const five of omahaHands(hole, board)) {
      const v = lowOfFive(five);
      if (v !== null && (best === null || v < best)) best = v;
    }
    return best;
  }
  // Any five: the five lowest different ranks of eight or lower.
  const ranks = [...new Set([...hole, ...up, ...board].map(lowRank).filter((r) => r <= 8))].sort((a, b) => a - b);
  if (ranks.length < 5) return null;
  return ranks
    .slice(0, 5)
    .sort((a, b) => b - a)
    .reduce((v, r) => v * 16 + r, 0);
}

/** "8-6-4-2-A" for a low value. */
export function lowName(value: number): string {
  const out: string[] = [];
  let v = value;
  for (let i = 0; i < 5; i++) {
    out.unshift(String(v % 16));
    v = Math.floor(v / 16);
  }
  return out.map((r) => (r === '1' ? 'A' : r)).join('-');
}

export const highValue = (game: PokerGame, hole: readonly Card[], up: readonly Card[], board: readonly Card[]): number => highValueOf(game, hole.map(cardIndex), up.map(cardIndex), board.map(cardIndex));
export const lowValue = (game: PokerGame, hole: readonly Card[], up: readonly Card[], board: readonly Card[]): number | null => lowValueOf(game, hole.map(cardIndex), up.map(cardIndex), board.map(cardIndex));

/**
 * Stud: the strength of the cards a player shows, for who acts first. Pairs, trips, two pair and
 * four of a kind count; straights and flushes do not; ties go to the higher card, then its suit
 * (clubs lowest, spades highest).
 */
export function showingValue(up: readonly Card[]): number {
  const cards = up.map(cardIndex);
  const counts = new Map<number, number>();
  for (const c of cards) counts.set(rank(c), (counts.get(rank(c)) ?? 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const [first = [0, 0], second = [0, 0]] = groups;
  let category = 0;
  if (first[1] === 4) category = 5;
  else if (first[1] === 3) category = 3;
  else if (first[1] === 2 && second[1] === 2) category = 2;
  else if (first[1] === 2) category = 1;
  // The ranks in order of importance, then the suit of the highest card.
  const ordered = groups.map(([r]) => r);
  const top = Math.max(...cards.filter((c) => rank(c) === ordered[0]));
  let v = category;
  for (let i = 0; i < 4; i++) v = v * 16 + (ordered[i] ?? 0);
  return v * 4 + (top & 3);
}

/** Stud's bring-in: the lowest up card, by rank then suit (clubs lowest). Returns the card number to compare (lower brings it in). */
export const bringInValue = (card: Card): number => cardIndex(card);
