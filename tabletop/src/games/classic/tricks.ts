/**
 * The shared trick-taking core for Hearts and Spades (PLAN.md M13): who wins a trick, which cards
 * follow suit, what a player is known to be void in, and dealing the cards a player cannot see in
 * a way that agrees with everything they saw (for `sample()` and the determinized bots).
 */
import type { Seat } from '../../core/contract';
import type { Rng } from '../../core/rng';
import type { Card, Suit } from './cards';
import { rankHigh, SUITS, suitOf } from './cards';

export interface Play {
  readonly seat: Seat;
  readonly card: Card;
}

/** The seat winning a (complete or partial) trick: the highest trump, else the highest card of the suit led. */
export function trickWinner(trick: readonly Play[], trump: Suit | null): Seat {
  const first = trick[0];
  if (!first) throw new Error('An empty trick has no winner');
  let best = first;
  for (let i = 1; i < trick.length; i++) {
    const p = trick[i] as Play;
    const bs = suitOf(best.card);
    const ps = suitOf(p.card);
    if (ps === bs) {
      if (rankHigh(p.card) > rankHigh(best.card)) best = p;
    } else if (trump !== null && ps === trump) {
      best = p;
    }
  }
  return best.seat;
}

/** The cards of a hand that may be played to a trick on follow-suit alone. */
export function following(hand: readonly Card[], trick: readonly Play[]): Card[] {
  const led = trick[0];
  if (!led) return [...hand];
  const suit = suitOf(led.card);
  const same = hand.filter((c) => suitOf(c) === suit);
  return same.length > 0 ? same : [...hand];
}

/** For each seat, the suits it has shown it holds none of (it did not follow them). */
export function voidsOf(seats: number, tricks: readonly (readonly Play[])[]): Set<Suit>[] {
  const out = Array.from({ length: seats }, () => new Set<Suit>());
  for (const trick of tricks) {
    const led = trick[0];
    if (!led) continue;
    const suit = suitOf(led.card);
    for (const p of trick.slice(1)) if (suitOf(p.card) !== suit) out[p.seat]?.add(suit);
  }
  return out;
}

/**
 * Deals `unknown` cards to seats so each seat ends with `need[seat]` new cards and never a card of a
 * suit in `voids[seat]`. Random, but always consistent when a consistent deal exists (falls back to
 * a deterministic fill by suit after a few random tries). Returns null if no deal exists.
 */
export function dealConsistent(unknown: readonly Card[], need: readonly number[], voids: readonly ReadonlySet<Suit>[], rng: Rng): Card[][] | null {
  const seats = need.length;
  const total = need.reduce((a, b) => a + b, 0);
  if (total !== unknown.length) throw new Error(`dealConsistent: ${unknown.length} cards for ${total} places`);
  const open = (seat: number, suit: Suit) => !(voids[seat]?.has(suit) ?? false);
  for (let tries = 0; tries < 24; tries++) {
    const left = [...need];
    const hands: Card[][] = Array.from({ length: seats }, () => []);
    // Most constrained cards first: those few seats may hold.
    const cards = rng.shuffle(unknown).sort((a, b) => countOpen(a) - countOpen(b));
    let ok = true;
    for (const card of cards) {
      const suit = suitOf(card);
      const choices: number[] = [];
      let weight = 0;
      for (let s = 0; s < seats; s++) {
        if ((left[s] ?? 0) > 0 && open(s, suit)) {
          choices.push(s);
          weight += left[s] ?? 0;
        }
      }
      if (choices.length === 0) {
        ok = false;
        break;
      }
      let r = rng.next() * weight;
      let pick = choices[0] as number;
      for (const s of choices) {
        r -= left[s] ?? 0;
        if (r < 0) {
          pick = s;
          break;
        }
      }
      (hands[pick] as Card[]).push(card);
      left[pick] = (left[pick] ?? 0) - 1;
    }
    if (ok) return hands;
  }
  return fillBySuit(unknown, need, voids, rng);

  function countOpen(card: Card): number {
    let n = 0;
    for (let s = 0; s < seats; s++) if ((need[s] ?? 0) > 0 && open(s, suitOf(card))) n++;
    return n;
  }
}

/** An exact fill: decide how many cards of each suit each seat gets with a small max-flow, then shuffle within. */
function fillBySuit(unknown: readonly Card[], need: readonly number[], voids: readonly ReadonlySet<Suit>[], rng: Rng): Card[][] | null {
  const seats = need.length;
  const bySuit = SUITS.map((s) => rng.shuffle(unknown.filter((c) => suitOf(c) === s)));
  // Nodes: source 0, suits 1..4, seats 5..5+seats-1, sink last.
  const n = 2 + SUITS.length + seats;
  const sink = n - 1;
  const cap = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  SUITS.forEach((suit, i) => {
    (cap[0] as number[])[1 + i] = (bySuit[i] as Card[]).length;
    for (let s = 0; s < seats; s++) if (!(voids[s]?.has(suit) ?? false)) (cap[1 + i] as number[])[5 + s] = 13;
  });
  for (let s = 0; s < seats; s++) (cap[5 + s] as number[])[sink] = need[s] ?? 0;
  const flow = Array.from({ length: n }, () => new Array<number>(n).fill(0));
  for (;;) {
    const prev = new Array<number>(n).fill(-1);
    prev[0] = 0;
    const queue = [0];
    while (queue.length > 0 && prev[sink] === -1) {
      const u = queue.shift() as number;
      for (let v = 0; v < n; v++) {
        if (prev[v] === -1 && ((cap[u] as number[])[v] as number) - ((flow[u] as number[])[v] as number) > 0) {
          prev[v] = u;
          queue.push(v);
        }
      }
    }
    if (prev[sink] === -1) break;
    let push = Infinity;
    for (let v = sink; v !== 0; v = prev[v] as number) {
      const u = prev[v] as number;
      push = Math.min(push, ((cap[u] as number[])[v] as number) - ((flow[u] as number[])[v] as number));
    }
    for (let v = sink; v !== 0; v = prev[v] as number) {
      const u = prev[v] as number;
      (flow[u] as number[])[v] = ((flow[u] as number[])[v] as number) + push;
      (flow[v] as number[])[u] = ((flow[v] as number[])[u] as number) - push;
    }
  }
  const delivered = (flow[0] as number[]).reduce((a, b) => a + Math.max(0, b), 0);
  if (delivered !== unknown.length) return null;
  const hands: Card[][] = Array.from({ length: seats }, () => []);
  SUITS.forEach((_, i) => {
    const pile = bySuit[i] as Card[];
    for (let s = 0; s < seats; s++) {
      const k = (flow[1 + i] as number[])[5 + s] as number;
      for (let j = 0; j < k; j++) (hands[s] as Card[]).push(pile.pop() as Card);
    }
  });
  return hands;
}
