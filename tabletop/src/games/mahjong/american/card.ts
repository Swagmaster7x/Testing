/**
 * The American hands card (docs/rules/mahjong-american.md, "The card"): a small text format for a
 * card of hands, its parser and validator, and the pattern matching every American rule needs.
 *
 * A card is lines of text:
 *
 *   title: My card                     the card's name (optional)
 *   ## Evens                           a section heading
 *   FFF 2222a 44b 666c 88a = 25 X      a hand: groups, "=", its points, X (exposed allowed) or C (concealed)
 *   1111a 1111b 111c FFF = 25 X shift  "shift": the numbers may move up or down together
 *   # anything                         a comment
 *
 * A group is tiles written as on the card, with the suit as a lower-case letter at its end (a, b or
 * c: three different suits; none means a). Repeating one symbol makes a set (a pair, pung, kong,
 * quint or sextet); different symbols in one group are singles ("2026a", "NEWS"). Symbols: 1 to 9
 * (a number of the group's suit), 0 (the white dragon, as a zero), F (a flower), E S W N (winds),
 * D (the dragon of the group's suit: red with characters, green with bamboo, white with dots), R and
 * G (the red and the green dragon). Jokers may stand in for tiles of a set of three or more, never
 * in a single or a pair.
 */
import type { Kind } from '../core/tiles';
import { FLOWER_1, GREEN, isBonus, JOKER, KIND_COUNT, RED, WHITE, WIND_EAST } from '../core/tiles';

/** Tiles a complete American hand holds. */
export const HAND_TILES = 14;
/** The jokers in a set (the usual count). */
export const JOKERS = 8;

export interface CardGroup {
  /** The symbols as written, one per tile. */
  readonly symbols: string;
  /** The suit letter as an index: 0 for a, 1 for b, 2 for c. */
  readonly suit: number;
}

export interface CardHand {
  /** "h1", "h2", ... in card order. */
  readonly id: string;
  readonly section: string;
  /** The groups as written. */
  readonly text: string;
  readonly groups: readonly CardGroup[];
  readonly points: number;
  /** C: no exposures (it may still win on a discard). */
  readonly concealed: boolean;
  /** The numbers may move up or down together. */
  readonly shift: boolean;
  /** The line it was written on (1-based). */
  readonly line: number;
}

export interface Card {
  readonly title: string;
  readonly hands: readonly CardHand[];
}

export type CardErrorCode = 'syntax' | 'group' | 'points' | 'mark' | 'tiles' | 'too-many' | 'empty' | 'word';

export interface CardError {
  readonly line: number;
  readonly code: CardErrorCode;
  /** The text at fault (a group, a word) or a number, for the message. */
  readonly detail: string;
}

const GROUP = /^([0-9FESWNDRG]+)([abc])?$/;

/** Reads a card; errors name the line and what is wrong. A card with any error is not used. */
export function parseCard(text: string): { card: Card | null; errors: CardError[] } {
  const errors: CardError[] = [];
  const hands: CardHand[] = [];
  let title = '';
  let section = '';
  text.split(/\r?\n/).forEach((raw, i) => {
    const line = i + 1;
    const s = raw.trim();
    if (s === '' || s.startsWith('#') && !s.startsWith('##')) return;
    if (/^title\s*:/i.test(s)) {
      title = s.replace(/^title\s*:/i, '').trim();
      return;
    }
    if (s.startsWith('##') || (s.startsWith('[') && s.endsWith(']'))) {
      section = s.replace(/^##\s*/, '').replace(/^\[|\]$/g, '').trim();
      return;
    }
    const [left, right, ...more] = s.split('=');
    if (left === undefined || right === undefined || more.length > 0) {
      errors.push({ line, code: 'syntax', detail: s });
      return;
    }
    const groups: CardGroup[] = [];
    for (const word of left.trim().split(/\s+/).filter(Boolean)) {
      const m = GROUP.exec(word);
      if (!m) {
        errors.push({ line, code: 'group', detail: word });
        return;
      }
      groups.push({ symbols: m[1] ?? '', suit: 'abc'.indexOf(m[2] ?? 'a') });
    }
    const words = right.trim().split(/\s+/).filter(Boolean);
    const points = Number(words[0]);
    if (!Number.isInteger(points) || points < 1 || points > 999) {
      errors.push({ line, code: 'points', detail: words[0] ?? '' });
      return;
    }
    const mark = (words[1] ?? '').toUpperCase();
    if (mark !== 'X' && mark !== 'C') {
      errors.push({ line, code: 'mark', detail: words[1] ?? '' });
      return;
    }
    const extra = words.slice(2).map((w) => w.toLowerCase());
    const bad = extra.find((w) => w !== 'shift');
    if (bad !== undefined) {
      errors.push({ line, code: 'word', detail: bad });
      return;
    }
    const hand: CardHand = { id: `h${hands.length + 1}`, section, text: left.trim(), groups, points, concealed: mark === 'C', shift: extra.includes('shift'), line };
    const size = groups.reduce((n, g) => n + g.symbols.length, 0);
    if (size !== HAND_TILES) {
      errors.push({ line, code: 'tiles', detail: String(size) });
      return;
    }
    if (variants(hand).length === 0) {
      errors.push({ line, code: 'too-many', detail: hand.text });
      return;
    }
    hands.push(hand);
  });
  if (hands.length === 0 && errors.length === 0) errors.push({ line: 0, code: 'empty', detail: '' });
  return { card: errors.length === 0 ? { title, hands } : null, errors };
}

// Kinds

/** All flowers count as one kind in American hands. */
export function amKind(k: Kind): Kind {
  return isBonus(k) ? FLOWER_1 : k;
}

/** The dragon matched to a suit: red with characters, green with bamboo, white with dots. */
export const SUIT_DRAGON: readonly Kind[] = [RED, WHITE, GREEN];

function kindOfSymbol(symbol: string, suit: number, shift: number): Kind | null {
  if (symbol >= '1' && symbol <= '9') {
    const n = Number(symbol) + shift;
    return n >= 1 && n <= 9 ? suit * 9 + n - 1 : null;
  }
  switch (symbol) {
    case '0':
      return WHITE;
    case 'F':
      return FLOWER_1;
    case 'E':
      return WIND_EAST;
    case 'S':
      return WIND_EAST + 1;
    case 'W':
      return WIND_EAST + 2;
    case 'N':
      return WIND_EAST + 3;
    case 'D':
      return SUIT_DRAGON[suit] ?? null;
    case 'R':
      return RED;
    case 'G':
      return GREEN;
    default:
      return null;
  }
}

/** A group as tiles: one kind and how many, and whether jokers may stand in (a set of three or more). */
export interface VariantGroup {
  readonly kind: Kind;
  readonly size: number;
  readonly flex: boolean;
}

/** One way to read a hand: its suits and numbers fixed. */
export interface Variant {
  readonly hand: CardHand;
  readonly groups: readonly VariantGroup[];
  /** Tiles needed of each kind in singles and pairs (no jokers), and in sets (jokers allowed). */
  readonly strict: readonly number[];
  readonly flex: readonly number[];
}

const PERMS: readonly (readonly number[])[] = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

/** Natural copies of a kind in the set. */
function copies(k: Kind): number {
  if (k === FLOWER_1) return 8;
  return k === JOKER ? 0 : 4;
}

const variantCache = new Map<string, Variant[]>();

/** Every reading of a hand (suits a, b, c as three different suits; the numbers shifted when allowed) that the tiles allow. */
export function variants(hand: CardHand, jokers = JOKERS): Variant[] {
  const key = `${hand.text}|${hand.shift}|${jokers}`;
  const hit = variantCache.get(key);
  if (hit) return hit.map((v) => ({ ...v, hand }));
  const out: Variant[] = [];
  const seen = new Set<string>();
  const shifts = hand.shift ? [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8] : [0];
  for (const perm of PERMS) {
    for (const shift of shifts) {
      const groups: VariantGroup[] = [];
      let ok = true;
      for (const g of hand.groups) {
        const suit = perm[g.suit] ?? 0;
        const same = g.symbols.split('').every((c) => c === g.symbols[0]);
        const kinds = g.symbols.split('').map((c) => kindOfSymbol(c, suit, shift));
        if (kinds.some((k) => k === null)) {
          ok = false;
          break;
        }
        if (same) groups.push({ kind: kinds[0] as Kind, size: g.symbols.length, flex: g.symbols.length >= 3 });
        else for (const k of kinds) groups.push({ kind: k as Kind, size: 1, flex: false });
      }
      if (!ok) continue;
      const strict = new Array<number>(KIND_COUNT).fill(0);
      const flex = new Array<number>(KIND_COUNT).fill(0);
      for (const g of groups) {
        if (g.flex) flex[g.kind] = (flex[g.kind] ?? 0) + g.size;
        else strict[g.kind] = (strict[g.kind] ?? 0) + g.size;
      }
      // Natural tiles must be there for every single and pair; jokers make up sets beyond four.
      let jokersNeeded = 0;
      for (let k = 0; k < KIND_COUNT; k++) {
        if ((strict[k] ?? 0) > copies(k)) ok = false;
        jokersNeeded += Math.max(0, (strict[k] ?? 0) + (flex[k] ?? 0) - copies(k));
      }
      if (!ok || jokersNeeded > jokers) continue;
      const sig = groups.map((g) => `${g.kind}x${g.size}`).sort().join(',');
      if (seen.has(sig)) continue;
      seen.add(sig);
      out.push({ hand, groups, strict, flex });
    }
  }
  variantCache.set(key, out);
  return out;
}

// Matching

/** A set laid down: the kind it is of (flowers as one kind), how many tiles, how many of them jokers. */
export interface Exposure {
  readonly kind: Kind;
  readonly size: number;
  readonly jokers: number;
}

/** The groups left once each exposure takes a set of its kind and size (null when one fits none). */
export function fitExposures(v: Variant, exposures: readonly Exposure[]): VariantGroup[] | null {
  const left = [...v.groups];
  for (const e of exposures) {
    const i = left.findIndex((g) => g.flex && g.kind === e.kind && g.size === e.size);
    if (i < 0) return null;
    left.splice(i, 1);
  }
  return left;
}

/** Concealed tiles as counts of normalized kinds (flowers as one), and the jokers among them. */
export function amCounts(kinds: readonly Kind[]): { counts: number[]; jokers: number } {
  const counts = new Array<number>(KIND_COUNT).fill(0);
  let jokers = 0;
  for (const k of kinds) {
    if (k === JOKER) jokers++;
    else counts[amKind(k)] = (counts[amKind(k)] ?? 0) + 1;
  }
  return { counts, jokers };
}

function needs(groups: readonly VariantGroup[]): { strict: number[]; flex: number[]; size: number } {
  const strict = new Array<number>(KIND_COUNT).fill(0);
  const flex = new Array<number>(KIND_COUNT).fill(0);
  let size = 0;
  for (const g of groups) {
    size += g.size;
    if (g.flex) flex[g.kind] = (flex[g.kind] ?? 0) + g.size;
    else strict[g.kind] = (strict[g.kind] ?? 0) + g.size;
  }
  return { strict, flex, size };
}

/** True when the concealed tiles (and jokers) exactly complete the variant beside the exposures. */
export function completes(v: Variant, counts: readonly number[], jokers: number, exposures: readonly Exposure[]): boolean {
  if (v.hand.concealed && exposures.length > 0) return false;
  const left = fitExposures(v, exposures);
  if (!left) return false;
  const n = needs(left);
  const held = counts.reduce((a, b) => a + b, 0) + jokers;
  if (held !== n.size) return false;
  let fill = 0;
  for (let k = 0; k < KIND_COUNT; k++) {
    const h = counts[k] ?? 0;
    const s = n.strict[k] ?? 0;
    const f = n.flex[k] ?? 0;
    if (h < s || h > s + f) return false;
    fill += s + f - h;
  }
  return fill === jokers;
}

/**
 * How many tiles the concealed part still needs for a variant (jokers filling sets), or Infinity
 * when the exposures do not fit it, or a single or pair needs more tiles than are left to find.
 */
export function distance(v: Variant, counts: readonly number[], jokers: number, exposures: readonly Exposure[], unseen?: readonly number[]): number {
  if (v.hand.concealed && exposures.length > 0) return Infinity;
  const left = fitExposures(v, exposures);
  if (!left) return Infinity;
  const n = needs(left);
  let missingStrict = 0;
  let missingFlex = 0;
  for (let k = 0; k < KIND_COUNT; k++) {
    const h = counts[k] ?? 0;
    const s = n.strict[k] ?? 0;
    const f = n.flex[k] ?? 0;
    if (s > h) {
      if (unseen && s - h > (unseen[k] ?? 0)) return Infinity;
      missingStrict += s - h;
    }
    missingFlex += Math.max(0, f - Math.max(0, h - s));
  }
  return missingStrict + Math.max(0, missingFlex - jokers);
}

/** A hand's groups as tiles, read with suit a as characters, b as dots and c as bamboo (and no shift): how the card shows it. */
export function groupKinds(hand: CardHand): Kind[][] {
  return hand.groups.map((g) => g.symbols.split('').map((c) => kindOfSymbol(c, g.suit, 0) ?? JOKER));
}

/** Every variant of every hand on the card. */
export function cardVariants(card: Card, jokers = JOKERS): Variant[] {
  return card.hands.flatMap((h) => variants(h, jokers));
}

/** A hand with at least one set can be made without jokers for the jokerless bonus; singles-and-pairs hands cannot. */
export function takesJokers(hand: CardHand): boolean {
  return hand.groups.some((g) => g.symbols.length >= 3 && g.symbols.split('').every((c) => c === g.symbols[0]));
}
