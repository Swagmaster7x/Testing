/**
 * Equity: a hand's share of the pot if every card were dealt out, against known hands (exact, by
 * enumerating the board) or against ranges (Monte Carlo, from a seeded generator so the same
 * question always gets the same answer). Cards are numbers 0 to 51 (see cards.ts).
 */
import type { Rng } from '../../core/rng';
import type { Card } from './cards';
import { cardIndex, handClass, cardOf } from './cards';
import { evaluateIndices } from './evaluate';

/** Two hole cards, as card numbers. */
export type Combo = readonly [number, number];

export interface Range {
  readonly combos: readonly Combo[];
  /** One weight per combo, 0 to 1. */
  readonly weights: readonly number[];
}

/** All 1326 two-card combinations. */
export const ALL_COMBOS: readonly Combo[] = (() => {
  const out: Combo[] = [];
  for (let a = 0; a < 52; a++) for (let b = a + 1; b < 52; b++) out.push([b, a]);
  return out;
})();

export const comboClass = (c: Combo): string => handClass(cardOf(c[0]), cardOf(c[1]));
export const comboOf = (cards: readonly Card[]): Combo => [cardIndex(cards[0] as Card), cardIndex(cards[1] as Card)];

/** Every combo of a hand class ("AKs" has 4, "AKo" 12, "QQ" 6). */
export function combosOf(cls: string): Combo[] {
  return ALL_COMBOS.filter((c) => comboClass(c) === cls);
}

/** A range from weights per hand class (classes left out weigh 0). */
export function rangeOf(weights: ReadonlyMap<string, number>): Range {
  const combos: Combo[] = [];
  const w: number[] = [];
  for (const c of ALL_COMBOS) {
    const x = weights.get(comboClass(c)) ?? 0;
    if (x > 0) {
      combos.push(c);
      w.push(x);
    }
  }
  return { combos, weights: w };
}

export const ANY_HAND: Range = { combos: ALL_COMBOS, weights: ALL_COMBOS.map(() => 1) };

/** The combos of a range that do not use a dead card. */
export function withoutDead(range: Range, dead: ReadonlySet<number>): Range {
  const combos: Combo[] = [];
  const weights: number[] = [];
  range.combos.forEach((c, i) => {
    if (dead.has(c[0]) || dead.has(c[1])) return;
    const w = range.weights[i] ?? 0;
    if (w <= 0) return;
    combos.push(c);
    weights.push(w);
  });
  return { combos, weights };
}

const scratch: number[] = [0, 0, 0, 0, 0, 0, 0];

function value(hole: Combo, board: readonly number[]): number {
  scratch.length = 2 + board.length;
  scratch[0] = hole[0];
  scratch[1] = hole[1];
  for (let i = 0; i < board.length; i++) scratch[2 + i] = board[i] as number;
  return evaluateIndices(scratch);
}

/**
 * Exact shares of the pot for known hands, dealing every possible rest of the board. Ties split.
 * With five board cards to come this is 1.7 million boards: use it from the flop on.
 */
export function exactEquity(hands: readonly Combo[], board: readonly number[]): number[] {
  const dead = new Set<number>([...hands.flat(), ...board]);
  const deck: number[] = [];
  for (let c = 0; c < 52; c++) if (!dead.has(c)) deck.push(c);
  const need = 5 - board.length;
  const shares = hands.map(() => 0);
  let boards = 0;
  const full = [...board];
  const values = hands.map(() => 0);
  const score = () => {
    let best = -1;
    let tied = 0;
    for (let i = 0; i < hands.length; i++) {
      const v = value(hands[i] as Combo, full);
      values[i] = v;
      if (v > best) {
        best = v;
        tied = 1;
      } else if (v === best) tied++;
    }
    for (let i = 0; i < hands.length; i++) if (values[i] === best) shares[i] = (shares[i] ?? 0) + 1 / tied;
    boards++;
  };
  const choose = (from: number, left: number) => {
    if (left === 0) {
      score();
      return;
    }
    for (let i = from; i <= deck.length - left; i++) {
      full.push(deck[i] as number);
      choose(i + 1, left - 1);
      full.pop();
    }
  };
  choose(0, need);
  return shares.map((s) => (boards === 0 ? 0 : s / boards));
}

/** Draws a combo from a range by weight, avoiding used cards; null if none fits. */
function drawCombo(range: Range, total: number, used: Uint8Array, rng: Rng): Combo | null {
  for (let tries = 0; tries < 40; tries++) {
    let x = rng.next() * total;
    let i = 0;
    for (; i < range.weights.length - 1; i++) {
      x -= range.weights[i] ?? 0;
      if (x < 0) break;
    }
    const c = range.combos[i];
    if (c && !used[c[0]] && !used[c[1]]) return c;
  }
  // A narrow range blocked by the cards out: take any combo that still fits.
  const fits = range.combos.filter((c) => !used[c[0]] && !used[c[1]]);
  return fits.length > 0 ? (fits[rng.int(fits.length)] as Combo) : null;
}

/**
 * A hand's share of the pot against one range per opponent, by dealing `samples` random
 * opponent hands and boards. Ties split.
 */
export function rangeEquity(hero: Combo, board: readonly number[], villains: readonly Range[], samples: number, rng: Rng): number {
  const used = new Uint8Array(52);
  const totals = villains.map((r) => r.weights.reduce((a, b) => a + b, 0));
  const deck: number[] = [];
  const full: number[] = [];
  let share = 0;
  let counted = 0;
  for (let s = 0; s < samples; s++) {
    used.fill(0);
    used[hero[0]] = 1;
    used[hero[1]] = 1;
    for (const c of board) used[c] = 1;
    const hands: Combo[] = [];
    let ok = true;
    for (let v = 0; v < villains.length; v++) {
      const c = drawCombo(villains[v] as Range, totals[v] ?? 0, used, rng);
      if (!c) {
        ok = false;
        break;
      }
      used[c[0]] = 1;
      used[c[1]] = 1;
      hands.push(c);
    }
    if (!ok) continue;
    deck.length = 0;
    for (let c = 0; c < 52; c++) if (!used[c]) deck.push(c);
    full.length = 0;
    full.push(...board);
    for (let k = board.length; k < 5; k++) {
      const j = rng.int(deck.length);
      full.push(deck[j] as number);
      deck[j] = deck[deck.length - 1] as number;
      deck.pop();
    }
    const mine = value(hero, full);
    let best = 0;
    let tied = 0;
    for (const h of hands) {
      const v = value(h, full);
      if (v > best) {
        best = v;
        tied = 1;
      } else if (v === best) tied++;
    }
    if (mine > best) share += 1;
    else if (mine === best) share += 1 / (tied + 1);
    counted++;
  }
  return counted === 0 ? 0 : share / counted;
}
