/**
 * Hands for the drills, built to order from a random stream: complete hands of four sets and a
 * pair steered toward a pattern, hands a few tiles away from complete, and a table where one
 * player has called three sets. Every hand becomes a lesson position through `lessonState`, so
 * every tile is in one place and every hand the right size; the drills then check what they ask
 * with the same calculators the coach and the scorer use.
 */
import type { Seat } from '../../../core/contract';
import type { MeldSpec } from '../rules';
import type { Kind } from '../core/tiles';
import { codeOf, PLAYING_KINDS, SUIT_KINDS } from '../core/tiles';

export type Random = () => number;

export const pick = <T>(random: Random, list: readonly T[]): T => list[Math.floor(random() * list.length)] as T;

export function shuffle<T>(random: Random, list: readonly T[]): T[] {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j] as T, out[i] as T];
  }
  return out;
}

export interface Knobs {
  /** Suited sets come from this suit only (null: any suit). */
  readonly suit: number | null;
  /** The chance a set (or the pair) is of honours. */
  readonly honour: number;
  /** The chance a suited set is a pung rather than a chow. */
  readonly pung: number;
}

export interface HandSet {
  readonly type: 'chow' | 'pung';
  /** The pung's kind, or the run's lowest kind. */
  readonly kind: Kind;
}

export interface Complete {
  readonly sets: readonly HandSet[];
  readonly pair: Kind;
}

export const setKinds = (s: HandSet): Kind[] => (s.type === 'pung' ? [s.kind, s.kind, s.kind] : [s.kind, s.kind + 1, s.kind + 2]);

/** A complete hand of four sets and a pair, or null when the knobs leave no room. */
export function buildComplete(random: Random, knobs: Knobs): Complete | null {
  const counts = new Array<number>(PLAYING_KINDS).fill(0);
  const room = (kinds: readonly Kind[]) => {
    const c = [...counts];
    for (const k of kinds) if ((c[k] = (c[k] ?? 0) + 1) > 4) return false;
    return true;
  };
  const take = (kinds: readonly Kind[]) => {
    for (const k of kinds) counts[k] = (counts[k] ?? 0) + 1;
  };
  const suitOf = () => knobs.suit ?? Math.floor(random() * 3);
  const sets: HandSet[] = [];
  for (let i = 0; i < 4; i++) {
    let done = false;
    for (let t = 0; t < 40 && !done; t++) {
      let s: HandSet;
      if (random() < knobs.honour) s = { type: 'pung', kind: SUIT_KINDS + Math.floor(random() * 7) };
      else if (random() < knobs.pung) s = { type: 'pung', kind: suitOf() * 9 + Math.floor(random() * 9) };
      else s = { type: 'chow', kind: suitOf() * 9 + Math.floor(random() * 7) };
      if (room(setKinds(s))) {
        take(setKinds(s));
        sets.push(s);
        done = true;
      }
    }
    if (!done) return null;
  }
  for (let t = 0; t < 40; t++) {
    const pair = random() < knobs.honour ? SUIT_KINDS + Math.floor(random() * 7) : suitOf() * 9 + Math.floor(random() * 9);
    if (room([pair, pair])) return { sets, pair };
  }
  return null;
}

/** The kinds of a complete hand, sets then pair. */
export function completeKinds(c: Complete): Kind[] {
  return [...c.sets.flatMap(setKinds), c.pair, c.pair];
}

/** A meld for a called set: a chow from the player on your left, a pung from anyone. */
export function calledMeld(random: Random, s: HandSet): MeldSpec {
  const tiles = setKinds(s).map(codeOf).join(' ');
  return s.type === 'chow' ? { type: 'chow', tiles, from: 3 } : { type: 'pung', tiles, from: (1 + Math.floor(random() * 3)) };
}

export const codes = (kinds: readonly Kind[]): string => kinds.map(codeOf).join(' ');

/** Up to `n` random tiles of the 34 kinds, from what is left of `used` (counts by kind). */
export function randomTiles(random: Random, n: number, used: number[], allow: (k: Kind) => boolean = () => true): Kind[] {
  const pool: Kind[] = [];
  for (let k = 0; k < PLAYING_KINDS; k++) if (allow(k)) for (let i = used[k] ?? 0; i < 4; i++) pool.push(k);
  const out = shuffle(random, pool).slice(0, n);
  for (const k of out) used[k] = (used[k] ?? 0) + 1;
  return out;
}

/** "The player on your right", and so on. */
export function playerPhrase(seat: Seat): string {
  return ['You', 'The player on your right', 'The player across', 'The player on your left'][seat % 4] ?? 'A player';
}
