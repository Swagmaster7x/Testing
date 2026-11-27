/**
 * Melds and deadwood for Gin Rummy (docs/rules/gin-rummy.md), shared with the bots and the coach.
 * The ace is low: A 2 3 … 10 J Q K. A meld is a set (three or four of a rank) or a run (three or
 * more in sequence in one suit). Deadwood is what no meld uses; its count is the sum of the card
 * values (ace 1, pictures 10).
 *
 * Inside, a hand is four 13-bit masks, one per suit (bit r is rank r, the ace at bit 0), so the
 * search over melds is a few bit operations; it runs thousands of times a second in the bots.
 */
import type { Card, Suit } from './cards';
import { RANKS, SUITS } from './cards';

const RANK_LETTERS = ['A', ...RANKS.slice(0, 12)] as const; // A 2 3 4 5 6 7 8 9 T J Q K

/** 0 for an ace up to 12 for a king. */
export function ginRank(card: Card): number {
  return card[0] === 'A' ? 0 : RANKS.indexOf(card[0] as (typeof RANKS)[number]) + 1;
}

const VALUE_BY_RANK = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];

/** The deadwood value of a card: ace 1, two to ten their number, pictures 10. */
export function cardValue(card: Card): number {
  return VALUE_BY_RANK[ginRank(card)] as number;
}

export function deadwoodValue(cards: readonly Card[]): number {
  let n = 0;
  for (const c of cards) n += cardValue(c);
  return n;
}

const SUIT_INDEX: Readonly<Record<Suit, number>> = { c: 0, d: 1, h: 2, s: 3 };

export function cardAt(suit: number, rank: number): Card {
  return `${RANK_LETTERS[rank] as string}${SUITS[suit] as Suit}` as Card;
}

/** Four suit masks for a list of cards. */
export function masksOf(cards: readonly Card[]): number[] {
  const m = [0, 0, 0, 0];
  for (const c of cards) {
    const s = SUIT_INDEX[c[1] as Suit];
    m[s] = (m[s] as number) | (1 << ginRank(c));
  }
  return m;
}

interface Meld {
  readonly m0: number;
  readonly m1: number;
  readonly m2: number;
  readonly m3: number;
  readonly value: number;
  /** For runs: the suit and its ends; for sets: suit -1 and the rank in lo. */
  readonly suit: number;
  readonly lo: number;
  readonly hi: number;
}

function maskValue(mask: number): number {
  let v = 0;
  for (let r = 0; r < 13; r++) if (mask & (1 << r)) v += VALUE_BY_RANK[r] as number;
  return v;
}

/** Every meld that can be made from these masks. */
function candidates(m: readonly number[]): Meld[] {
  const out: Meld[] = [];
  for (let s = 0; s < 4; s++) {
    const bits = m[s] as number;
    for (let lo = 0; lo <= 10; lo++) {
      if (!(bits & (1 << lo))) continue;
      let mask = 1 << lo;
      for (let hi = lo + 1; hi < 13 && bits & (1 << hi); hi++) {
        mask |= 1 << hi;
        if (hi - lo >= 2) {
          const parts = [0, 0, 0, 0];
          parts[s] = mask;
          out.push({ m0: parts[0] as number, m1: parts[1] as number, m2: parts[2] as number, m3: parts[3] as number, value: maskValue(mask), suit: s, lo, hi });
        }
      }
    }
  }
  for (let r = 0; r < 13; r++) {
    const bit = 1 << r;
    const has = [0, 1, 2, 3].filter((s) => (m[s] as number) & bit);
    if (has.length < 3) continue;
    const value = (VALUE_BY_RANK[r] as number) * 3;
    const subsets = has.length === 4 ? [has, ...has.map((skip) => has.filter((s) => s !== skip))] : [has];
    for (const set of subsets) {
      const parts = [0, 0, 0, 0];
      for (const s of set) parts[s] = bit;
      out.push({ m0: parts[0] as number, m1: parts[1] as number, m2: parts[2] as number, m3: parts[3] as number, value: set.length === 4 ? value + (VALUE_BY_RANK[r] as number) : value, suit: -1, lo: r, hi: r });
    }
  }
  return out;
}

function totalValue(m: readonly number[]): number {
  return maskValue(m[0] as number) + maskValue(m[1] as number) + maskValue(m[2] as number) + maskValue(m[3] as number);
}

/** The least deadwood count of a hand given as suit masks. */
export function deadwoodOfMasks(m: readonly number[]): number {
  const melds = candidates(m);
  const total = totalValue(m);
  if (melds.length === 0) return total;
  let best = 0;
  const search = (i: number, u0: number, u1: number, u2: number, u3: number, value: number) => {
    if (value > best) best = value;
    for (let j = i; j < melds.length; j++) {
      const x = melds[j] as Meld;
      if (x.m0 & u0 || x.m1 & u1 || x.m2 & u2 || x.m3 & u3) continue;
      search(j + 1, u0 | x.m0, u1 | x.m1, u2 | x.m2, u3 | x.m3, value + x.value);
    }
  };
  search(0, 0, 0, 0, 0, 0);
  return total - best;
}

/** The least deadwood count of a hand. */
export function deadwood(cards: readonly Card[]): number {
  return deadwoodOfMasks(masksOf(cards));
}

function meldCards(x: Meld): Card[] {
  const out: Card[] = [];
  const parts = [x.m0, x.m1, x.m2, x.m3];
  for (let s = 0; s < 4; s++) for (let r = 0; r < 13; r++) if ((parts[s] as number) & (1 << r)) out.push(cardAt(s, r));
  return out;
}

export interface Arrangement {
  readonly melds: readonly (readonly Card[])[];
  readonly deadwood: readonly Card[];
  readonly count: number;
}

/** Every way to choose disjoint melds from a hand (the empty choice too), each with its deadwood. */
export function arrangements(cards: readonly Card[]): Arrangement[] {
  const m = masksOf(cards);
  const melds = candidates(m);
  const out: Arrangement[] = [];
  const chosen: Meld[] = [];
  const search = (i: number, u0: number, u1: number, u2: number, u3: number) => {
    const used = [u0, u1, u2, u3];
    const rest = cards.filter((c) => !((used[SUIT_INDEX[c[1] as Suit]] as number) & (1 << ginRank(c))));
    out.push({ melds: chosen.map(meldCards), deadwood: sortLow(rest), count: deadwoodValue(rest) });
    for (let j = i; j < melds.length; j++) {
      const x = melds[j] as Meld;
      if (x.m0 & u0 || x.m1 & u1 || x.m2 & u2 || x.m3 & u3) continue;
      chosen.push(x);
      search(j + 1, u0 | x.m0, u1 | x.m1, u2 | x.m2, u3 | x.m3);
      chosen.pop();
    }
  };
  search(0, 0, 0, 0, 0);
  return out;
}

/** The arrangement with the least deadwood (ties: the one with fewer, larger melds, then the first found). */
export function bestArrangement(cards: readonly Card[]): Arrangement {
  let best: Arrangement | null = null;
  for (const a of arrangements(cards)) {
    if (!best || a.count < best.count || (a.count === best.count && a.melds.length < best.melds.length)) best = a;
  }
  return best as Arrangement;
}

/** Cards sorted ace low, by suit then rank (for showing deadwood). */
export function sortLow(cards: readonly Card[]): Card[] {
  return [...cards].sort((a, b) => SUIT_INDEX[a[1] as Suit] - SUIT_INDEX[b[1] as Suit] || ginRank(a) - ginRank(b));
}

/** True when the cards form one meld. */
export function isMeld(cards: readonly Card[]): boolean {
  if (cards.length < 3) return false;
  const ranks = cards.map(ginRank);
  if (ranks.every((r) => r === ranks[0])) return new Set(cards.map((c) => c[1])).size === cards.length;
  if (!cards.every((c) => c[1] === cards[0]?.[1])) return false;
  const sorted = [...ranks].sort((a, b) => a - b);
  return sorted.every((r, i) => i === 0 || r === (sorted[i - 1] as number) + 1);
}

export interface Layoff {
  /** The defender's cards laid off, each with the index of the knocker's meld it went on. */
  readonly laid: readonly { readonly card: Card; readonly meld: number }[];
  readonly rest: readonly Card[];
}

/**
 * Lays off as many of `cards` as possible on the knocker's melds: the fourth card of a set, and
 * cards extending a run at either end (a laid-off card may itself be extended). Run extensions are
 * tried first, since they can open further layoffs.
 */
export function layOff(knockerMelds: readonly (readonly Card[])[], cards: readonly Card[]): Layoff {
  const runs = knockerMelds.map((meld) => {
    const ranks = meld.map(ginRank);
    const isSet = ranks.every((r) => r === ranks[0]);
    return { isSet, suit: meld[0]?.[1] as Suit, rank: ranks[0] as number, lo: Math.min(...ranks), hi: Math.max(...ranks), size: meld.length };
  });
  let rest = [...cards];
  const laid: { card: Card; meld: number }[] = [];
  for (let changed = true; changed; ) {
    changed = false;
    for (const [i, run] of runs.entries()) {
      if (run.isSet) continue;
      for (const card of [...rest]) {
        if (card[1] !== run.suit) continue;
        const r = ginRank(card);
        if (r === run.lo - 1 || r === run.hi + 1) {
          if (r < run.lo) run.lo = r;
          else run.hi = r;
          laid.push({ card, meld: i });
          rest = rest.filter((c) => c !== card);
          changed = true;
        }
      }
    }
    for (const [i, set] of runs.entries()) {
      if (!set.isSet || set.size >= 4) continue;
      const card = rest.find((c) => ginRank(c) === set.rank);
      if (card) {
        set.size++;
        laid.push({ card, meld: i });
        rest = rest.filter((c) => c !== card);
        changed = true;
      }
    }
  }
  return { laid, rest };
}

export interface DefenderShow extends Arrangement {
  readonly laid: readonly { readonly card: Card; readonly meld: number }[];
}

/** The defender's best showing against a knock: own melds and layoffs together, least deadwood. */
export function defenderBest(cards: readonly Card[], knockerMelds: readonly (readonly Card[])[], allowLayoff: boolean): DefenderShow {
  let best: DefenderShow | null = null;
  for (const a of arrangements(cards)) {
    const off = allowLayoff ? layOff(knockerMelds, a.deadwood) : { laid: [], rest: a.deadwood };
    const count = deadwoodValue(off.rest);
    if (!best || count < best.count || (count === best.count && off.laid.length < best.laid.length)) {
      best = { melds: a.melds, deadwood: sortLow(off.rest), count, laid: off.laid };
    }
  }
  return best as DefenderShow;
}
