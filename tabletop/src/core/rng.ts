/**
 * Seeded random numbers. Every random choice in a game comes from a seed stored with the game,
 * so a record of config, seed and actions always replays to the same position.
 *
 * The generator is sfc32 (Chris Doty-Humphrey's small fast counter generator), seeded from the
 * seed string through FNV-1a and splitmix32. It is fast, has a long period and passes the usual
 * statistical batteries; it is not for cryptography.
 */

export interface Rng {
  /** The seed this stream was made from. */
  readonly seed: string;
  /** A float in [0, 1). */
  readonly next: () => number;
  /** An integer in [0, maxExclusive). */
  readonly int: (maxExclusive: number) => number;
  /** One element of a non-empty list. */
  readonly pick: <T>(items: readonly T[]) => T;
  /** A shuffled copy of a list (Fisher-Yates). */
  readonly shuffle: <T>(items: readonly T[]) => T[];
  /** An independent stream for a named purpose. It depends only on this seed and the label. */
  readonly fork: (label: string) => Rng;
}

function fnv1a(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function splitmix32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x9e3779b9) >>> 0;
    let z = state;
    z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
    z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
    return (z ^ (z >>> 15)) >>> 0;
  };
}

export function createRng(seed: string): Rng {
  const mix = splitmix32(fnv1a(seed));
  let a = mix();
  let b = mix();
  let c = mix();
  let d = mix();

  const nextUint32 = (): number => {
    const t = (((a + b) >>> 0) + d) >>> 0;
    d = (d + 1) >>> 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) >>> 0;
    c = ((c << 21) | (c >>> 11)) >>> 0;
    c = (c + t) >>> 0;
    return t;
  };
  // Discard the first outputs so similar seeds diverge at once.
  for (let i = 0; i < 12; i++) nextUint32();

  const rng: Rng = {
    seed,
    next: () => nextUint32() / 4294967296,
    int(maxExclusive) {
      if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
        throw new RangeError(`int() needs a positive integer, got ${maxExclusive}`);
      }
      return Math.floor((nextUint32() / 4294967296) * maxExclusive);
    },
    pick(items) {
      if (items.length === 0) throw new RangeError('pick() needs a non-empty list');
      return items[rng.int(items.length)] as (typeof items)[number];
    },
    shuffle(items) {
      const out = items.slice();
      for (let i = out.length - 1; i > 0; i--) {
        const j = rng.int(i + 1);
        const tmp = out[i] as (typeof out)[number];
        out[i] = out[j] as (typeof out)[number];
        out[j] = tmp;
      }
      return out;
    },
    fork: (label) => createRng(`${seed}/${label}`),
  };
  return rng;
}

/** A fresh seed for a new game. This is the only place randomness enters from outside. */
export function randomSeed(): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}
