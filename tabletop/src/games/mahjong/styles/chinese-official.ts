/**
 * Chinese Official (Mahjong Competition Rules, MCR): the third rules file on the shared engine
 * (docs/rules/mahjong-chinese-official.md). 144 tiles with flowers, 13-tile hands, the 81 scoring
 * patterns with the rulebook's principles for combining them (non-repeat, non-separation,
 * non-identical, high versus low, account once), an eight-point minimum that flowers never count
 * toward, the knitted shapes, and the settlement: the winner collects the hand's value plus eight
 * from the discarder and eight from each other player, or the value plus eight from each when
 * self-drawn. The deal passes after every hand; a full game is sixteen hands.
 */
import type { Seat } from '../../../core/contract';
import type { HandSet, WinShape } from '../core/arrange';
import { allKinds, winShapes } from '../core/arrange';
import { KNITTED, waitsOf } from '../core/shapes';
import type { HandScore, OptionSpec, ScoreLine, SettleInput, Style, StyleOptions, StyleRules, ValueHints, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { countsOfKinds, GREEN, isDragon, isHonour, isSuited, isTerminal, isTerminalOrHonour, isWind, kindOf, PLAYING_KINDS, rankOf, suitOf, WHITE, WIND_EAST } from '../core/tiles';

export const CO_OPTIONS: readonly OptionSpec[] = [
  { key: 'minPoints', values: [8, 4, 0] },
  { key: 'flowers', values: ['on', 'off'] },
  { key: 'length', values: ['full', 'east-south', 'east', 'hand'] },
  { key: 'twoConcealedKongs', values: [6, 8] },
  { key: 'accountOnce', values: ['official', 'twice'] },
  { key: 'mixedKongs', values: ['two-melded', 'separate'] },
  { key: 'robKong', values: ['on', 'off'] },
];

export const CO_DEFAULTS: StyleOptions = Object.fromEntries(CO_OPTIONS.map((o) => [o.key, o.values[0] as string | number]));

export const CO_PRESETS: readonly { readonly id: string; readonly options: StyleOptions }[] = [
  { id: 'co-official', options: CO_DEFAULTS },
  { id: 'co-east', options: { ...CO_DEFAULTS, length: 'east' } },
  { id: 'co-no-flowers', options: { ...CO_DEFAULTS, flowers: 'off' } },
  { id: 'co-learner', options: { ...CO_DEFAULTS, minPoints: 4, length: 'east' } },
  { id: 'co-hand', options: { ...CO_DEFAULTS, length: 'hand' } },
];

/** What every other player pays the winner on top of the hand (the discarder pays it as well). */
export const CO_BASE = 8;
/** The value of a hand that scores nothing else. */
export const CO_CHICKEN = 8;

const num = (o: StyleOptions, key: string): number => {
  const v = o[key];
  return typeof v === 'number' ? v : Number(CO_DEFAULTS[key]);
};

const ROUNDS: Readonly<Record<string, number>> = { hand: 0, east: 1, 'east-south': 2, full: 4 };

function rules(o: StyleOptions): StyleRules {
  return {
    tiles: { honours: true, bonus: o.flowers !== 'off', jokers: 0 },
    handSize: 13,
    // No dead wall: play goes on to the last tile; replacements come from the back of the wall.
    deadWall: 0,
    replaceBonus: true,
    calls: {
      chow: true,
      pung: true,
      kong: true,
      concealedKong: true,
      addedKong: true,
      robKong: o.robKong !== 'off',
      robConcealedWithOrphans: false,
      multipleWinners: false,
    },
    shapes: { sevenPairs: true, thirteenOrphans: true, sevenPairsFours: true, knitted: true },
    rounds: ROUNDS[String(o.length)] ?? 4,
    handsPerRound: 4,
  };
}

// The patterns

/**
 * Every pattern's points, in the rulebook's order (highest first): one table for the scorer, the
 * lessons, the drills and the reference card. Two Concealed Kongs follows its option.
 */
export const CO_FAN: Readonly<Record<string, number>> = {
  'co-big-four-winds': 88,
  'co-big-three-dragons': 88,
  'co-all-green': 88,
  'co-nine-gates': 88,
  'co-four-kongs': 88,
  'co-seven-shifted-pairs': 88,
  'co-thirteen-orphans': 88,
  'co-all-terminals': 64,
  'co-little-four-winds': 64,
  'co-little-three-dragons': 64,
  'co-all-honours': 64,
  'co-four-concealed-pungs': 64,
  'co-pure-terminal-chows': 64,
  'co-quadruple-chow': 48,
  'co-four-pure-shifted-pungs': 48,
  'co-four-pure-shifted-chows': 32,
  'co-three-kongs': 32,
  'co-all-terminals-and-honours': 32,
  'co-seven-pairs': 24,
  'co-greater-honours-knitted': 24,
  'co-all-even-pungs': 24,
  'co-full-flush': 24,
  'co-pure-triple-chow': 24,
  'co-pure-shifted-pungs': 24,
  'co-upper-tiles': 24,
  'co-middle-tiles': 24,
  'co-lower-tiles': 24,
  'co-pure-straight': 16,
  'co-three-suited-terminal-chows': 16,
  'co-pure-shifted-chows': 16,
  'co-all-fives': 16,
  'co-triple-pung': 16,
  'co-three-concealed-pungs': 16,
  'co-lesser-honours-knitted': 12,
  'co-knitted-straight': 12,
  'co-upper-four': 12,
  'co-lower-four': 12,
  'co-big-three-winds': 12,
  'co-mixed-straight': 8,
  'co-reversible-tiles': 8,
  'co-mixed-triple-chow': 8,
  'co-mixed-shifted-pungs': 8,
  'co-chicken-hand': 8,
  'co-last-tile-draw': 8,
  'co-last-tile-claim': 8,
  'co-out-with-replacement': 8,
  'co-robbing-the-kong': 8,
  'co-two-concealed-kongs': 6,
  'co-all-pungs': 6,
  'co-half-flush': 6,
  'co-mixed-shifted-chows': 6,
  'co-all-types': 6,
  'co-melded-hand': 6,
  'co-two-dragon-pungs': 6,
  'co-outside-hand': 4,
  'co-fully-concealed': 4,
  'co-two-melded-kongs': 4,
  'co-last-tile': 4,
  'co-dragon-pung': 2,
  'co-prevalent-wind': 2,
  'co-seat-wind': 2,
  'co-concealed-hand': 2,
  'co-all-chows': 2,
  'co-tile-hog': 2,
  'co-mixed-double-pung': 2,
  'co-two-concealed-pungs': 2,
  'co-concealed-kong': 2,
  'co-all-simples': 2,
  'co-pure-double-chow': 1,
  'co-mixed-double-chow': 1,
  'co-short-straight': 1,
  'co-two-terminal-chows': 1,
  'co-pung-terminals-honours': 1,
  'co-melded-kong': 1,
  'co-one-voided-suit': 1,
  'co-no-honours': 1,
  'co-edge-wait': 1,
  'co-closed-wait': 1,
  'co-single-wait': 1,
  'co-self-drawn': 1,
  'co-flowers': 1,
};

/** The patterns in the rulebook's order, flowers last: 81 in all. */
export const CO_PATTERNS: readonly string[] = Object.keys(CO_FAN);

/** A pattern's points under these options. */
export function coFan(id: string, o: StyleOptions = CO_DEFAULTS): number {
  if (id === 'co-two-concealed-kongs') return num(o, 'twoConcealedKongs');
  return CO_FAN[id] ?? 0;
}

// Pungs of terminals or honours are counted in two parts, so that the wind patterns can leave out
// only their own winds.
const PTH_TERMINALS = '#pth-terminals';
const PTH_WINDS = '#pth-winds';
const PTH_BOTH = [PTH_TERMINALS, PTH_WINDS];
const CONCEALED = ['co-concealed-hand', 'co-fully-concealed'];

/**
 * The patterns each pattern leaves out (the rulebook's "not counted", with what they imply). A
 * pattern that leaves out Concealed Hand also leaves out Fully Concealed Hand: such a hand is closed
 * by definition and scores Self-Drawn when it is.
 */
export const CO_EXCLUDES: Readonly<Record<string, readonly string[]>> = {
  'co-big-four-winds': ['co-big-three-winds', 'co-little-four-winds', 'co-all-pungs', 'co-seat-wind', 'co-prevalent-wind', PTH_WINDS],
  'co-big-three-dragons': ['co-little-three-dragons', 'co-two-dragon-pungs', 'co-dragon-pung'],
  'co-nine-gates': ['co-full-flush', ...CONCEALED, PTH_TERMINALS, 'co-no-honours'],
  'co-four-kongs': ['co-three-kongs', 'co-two-melded-kongs', 'co-two-concealed-kongs', 'co-melded-kong', 'co-concealed-kong', 'co-all-pungs', 'co-single-wait'],
  'co-seven-shifted-pairs': ['co-seven-pairs', 'co-full-flush', ...CONCEALED, 'co-single-wait', 'co-no-honours'],
  'co-thirteen-orphans': ['co-all-terminals-and-honours', 'co-all-types', ...CONCEALED, 'co-single-wait'],
  'co-all-terminals': ['co-all-terminals-and-honours', 'co-outside-hand', 'co-all-pungs', ...PTH_BOTH, 'co-no-honours'],
  'co-little-four-winds': ['co-big-three-winds', PTH_WINDS],
  'co-little-three-dragons': ['co-two-dragon-pungs', 'co-dragon-pung'],
  'co-all-honours': ['co-all-terminals-and-honours', 'co-outside-hand', 'co-all-pungs', ...PTH_BOTH],
  'co-four-concealed-pungs': ['co-all-pungs', 'co-three-concealed-pungs', 'co-two-concealed-pungs', ...CONCEALED],
  'co-pure-terminal-chows': ['co-full-flush', 'co-all-chows', 'co-seven-pairs', 'co-pure-double-chow', 'co-two-terminal-chows', 'co-no-honours'],
  'co-quadruple-chow': ['co-pure-triple-chow', 'co-pure-shifted-pungs', 'co-pure-double-chow', 'co-tile-hog'],
  'co-four-pure-shifted-pungs': ['co-pure-triple-chow', 'co-pure-shifted-pungs', 'co-all-pungs'],
  'co-four-pure-shifted-chows': ['co-pure-shifted-chows', 'co-short-straight', 'co-two-terminal-chows'],
  'co-three-kongs': ['co-two-melded-kongs', 'co-two-concealed-kongs', 'co-melded-kong', 'co-concealed-kong'],
  'co-all-terminals-and-honours': ['co-all-pungs', 'co-outside-hand', ...PTH_BOTH],
  'co-seven-pairs': [...CONCEALED, 'co-single-wait'],
  'co-greater-honours-knitted': ['co-lesser-honours-knitted', 'co-all-types', ...CONCEALED, 'co-single-wait'],
  'co-all-even-pungs': ['co-all-pungs', 'co-all-simples', 'co-no-honours'],
  'co-full-flush': ['co-no-honours'],
  'co-pure-triple-chow': ['co-pure-shifted-pungs', 'co-pure-double-chow'],
  'co-pure-shifted-pungs': ['co-pure-triple-chow'],
  'co-upper-tiles': ['co-upper-four', 'co-no-honours'],
  'co-middle-tiles': ['co-all-simples', 'co-no-honours'],
  'co-lower-tiles': ['co-lower-four', 'co-no-honours'],
  'co-pure-straight': ['co-short-straight', 'co-two-terminal-chows'],
  'co-three-suited-terminal-chows': ['co-all-chows', 'co-mixed-double-chow', 'co-two-terminal-chows', 'co-no-honours'],
  'co-all-fives': ['co-all-simples', 'co-no-honours'],
  'co-triple-pung': ['co-mixed-double-pung'],
  'co-three-concealed-pungs': ['co-two-concealed-pungs'],
  'co-lesser-honours-knitted': ['co-all-types', ...CONCEALED, 'co-single-wait'],
  'co-upper-four': ['co-no-honours'],
  'co-lower-four': ['co-no-honours'],
  'co-big-three-winds': [PTH_WINDS],
  'co-reversible-tiles': ['co-one-voided-suit'],
  'co-mixed-triple-chow': ['co-mixed-double-chow'],
  'co-last-tile-draw': ['co-self-drawn'],
  'co-out-with-replacement': ['co-self-drawn'],
  'co-robbing-the-kong': ['co-last-tile'],
  'co-two-concealed-kongs': ['co-two-concealed-pungs', 'co-concealed-kong'],
  'co-melded-hand': ['co-single-wait'],
  'co-two-dragon-pungs': ['co-dragon-pung'],
  'co-fully-concealed': ['co-self-drawn'],
  'co-two-melded-kongs': ['co-melded-kong'],
  'co-all-simples': ['co-no-honours'],
};

const GREENS: ReadonlySet<Kind> = new Set([19, 20, 21, 23, 25, GREEN]);
/** Tiles that look the same upside down: 1 2 3 4 5 8 9 dots, 2 4 5 6 8 9 bamboo, the White dragon. */
const REVERSIBLE: ReadonlySet<Kind> = new Set([9, 10, 11, 12, 13, 16, 17, 19, 21, 22, 23, 25, 26, WHITE]);

/** A pattern found in a hand, before the principles decide whether it counts. */
interface Found {
  readonly id: string;
  readonly times: number;
}

const isPungLike = (s: HandSet) => s.type === 'pung' || s.type === 'kong';
const setKinds = (s: HandSet): Kind[] => (s.type === 'chow' ? [s.kind, s.kind + 1, s.kind + 2] : [s.kind]);

// Chows: patterns of four, three and two chows, under the principles

/** The patterns four chows make together (they use every chow), or null. */
function fourChows(starts: readonly Kind[], pair: Kind | null): string | null {
  const s = [...starts].sort((a, b) => a - b);
  const [a = 0, b = 0, c = 0, d = 0] = s;
  const oneSuit = s.every((k) => suitOf(k) === suitOf(a));
  if (a === d) return 'co-quadruple-chow';
  if (oneSuit) {
    for (const step of [1, 2]) if (b - a === step && c - b === step && d - c === step) return 'co-four-pure-shifted-chows';
    if (a === b && c === d && rankOf(a) === 1 && rankOf(c) === 7 && pair === suitOf(a) * 9 + 4) return 'co-pure-terminal-chows';
  }
  // Three-suited terminal chows: 123 and 789 in two suits, the pair of fives in the third.
  if (pair !== null && isSuited(pair) && rankOf(pair) === 5) {
    const others = [0, 1, 2].filter((x) => x !== suitOf(pair));
    const fits = others.every((suit) => s.includes(suit * 9) && s.includes(suit * 9 + 6)) && s.every((k) => suitOf(k) !== suitOf(pair));
    if (fits) return 'co-three-suited-terminal-chows';
  }
  return null;
}

/** The pattern three chows make together, or null. */
function threeChows(x: Kind, y: Kind, z: Kind): string | null {
  const s = [x, y, z].sort((p, q) => p - q);
  const [a = 0, b = 0, c = 0] = s;
  const suits = new Set(s.map(suitOf));
  const ranks = s.map(rankOf).sort((p, q) => p - q);
  if (suits.size === 1) {
    if (a === c) return 'co-pure-triple-chow';
    if (rankOf(a) === 1 && rankOf(b) === 4 && rankOf(c) === 7) return 'co-pure-straight';
    for (const step of [1, 2]) if (b - a === step && c - b === step) return 'co-pure-shifted-chows';
    return null;
  }
  if (suits.size === 3) {
    if (ranks[0] === ranks[2]) return 'co-mixed-triple-chow';
    if (ranks.join() === '1,4,7') return 'co-mixed-straight';
    if ((ranks[1] ?? 0) - (ranks[0] ?? 0) === 1 && (ranks[2] ?? 0) - (ranks[1] ?? 0) === 1) return 'co-mixed-shifted-chows';
  }
  return null;
}

/** The pattern two chows make, or null. */
function twoChows(a: Kind, b: Kind): string | null {
  const [p, q] = a <= b ? [a, b] : [b, a];
  if (p === q) return 'co-pure-double-chow';
  if (suitOf(p) === suitOf(q)) {
    if (q - p === 3) return 'co-short-straight';
    if (rankOf(p) === 1 && rankOf(q) === 7) return 'co-two-terminal-chows';
    return null;
  }
  return rankOf(p) === rankOf(q) ? 'co-mixed-double-chow' : null;
}

/**
 * The best choice of two-set patterns among `n` sets: `rel` lists each pair of sets and the pattern
 * they make. Account once: the chosen pairs may not close a loop (each set joins the others once),
 * or with `twice` each set takes part in at most two. Non-identical: two pairs sharing a set never
 * make the same pattern.
 */
function bestPairs(n: number, rel: readonly { i: number; j: number; id: string }[], twice: boolean, value: (id: string) => number): string[] {
  let best: string[] = [];
  let bestValue = 0;
  const m = rel.length;
  for (let mask = 1; mask < 1 << m; mask++) {
    const chosen = rel.filter((_, i) => (mask >> i) & 1);
    const uses = new Array<number>(n).fill(0);
    let ok = true;
    for (const r of chosen) {
      uses[r.i] = (uses[r.i] ?? 0) + 1;
      uses[r.j] = (uses[r.j] ?? 0) + 1;
    }
    // Non-identical: the same pattern twice with a shared set.
    for (let a = 0; a < chosen.length && ok; a++) {
      for (let b = a + 1; b < chosen.length && ok; b++) {
        const x = chosen[a];
        const y = chosen[b];
        if (x && y && x.id === y.id && (x.i === y.i || x.i === y.j || x.j === y.i || x.j === y.j)) ok = false;
      }
    }
    if (!ok) continue;
    if (twice) {
      if (uses.some((u) => u > 2)) continue;
    } else {
      // A forest: union-find over the sets.
      const parent = Array.from({ length: n }, (_, i) => i);
      const find = (i: number): number => (parent[i] === i ? i : (parent[i] = find(parent[i] ?? i)));
      for (const r of chosen) {
        const a = find(r.i);
        const b = find(r.j);
        if (a === b) {
          ok = false;
          break;
        }
        parent[a] = b;
      }
      if (!ok) continue;
    }
    const v = chosen.reduce((sum, r) => sum + value(r.id), 0);
    if (v > bestValue) {
      bestValue = v;
      best = chosen.map((r) => r.id);
    }
  }
  return best;
}

/**
 * The chow patterns of a reading under the principles: a pattern of four chows uses them all; else
 * the best pattern of three, after which the fourth chow joins one of them once; else the best
 * two-chow patterns that account once allows.
 */
function chowPatterns(starts: readonly Kind[], pair: Kind | null, twice: boolean): string[] {
  const n = starts.length;
  if (n < 2) return [];
  if (n === 4) {
    const four = fourChows(starts, pair);
    if (four) return [four];
  }
  const value = (id: string) => coFan(id);
  let best: string[] = [];
  let bestValue = -1;
  const consider = (ids: string[]) => {
    const v = ids.reduce((sum, id) => sum + value(id) * (excludedBy(ids, id) ? 0 : 1), 0);
    if (v > bestValue) {
      bestValue = v;
      best = ids;
    }
  };
  if (n >= 3) {
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        for (let c = b + 1; c < n; c++) {
          const three = threeChows(starts[a] ?? 0, starts[b] ?? 0, starts[c] ?? 0);
          if (!three) continue;
          const rest = [0, 1, 2, 3].filter((i) => i < n && i !== a && i !== b && i !== c);
          const ids = [three];
          // The fourth chow joins one chow of the three, once, for the best pattern left.
          const d = rest[0];
          if (d !== undefined) {
            const options = [a, b, c].map((i) => twoChows(starts[d] ?? 0, starts[i] ?? 0)).filter((id): id is string => id !== null && !(CO_EXCLUDES[three] ?? []).includes(id));
            const top = options.sort((p, q) => value(q) - value(p))[0];
            if (top) ids.push(top);
          }
          consider(ids);
        }
      }
    }
    if (best.length > 0) return best;
  }
  const rel: { i: number; j: number; id: string }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const id = twoChows(starts[i] ?? 0, starts[j] ?? 0);
      if (id) rel.push({ i, j, id });
    }
  }
  return bestPairs(n, rel, twice, value);
}

const excludedBy = (ids: readonly string[], id: string): boolean => ids.some((x) => x !== id && (CO_EXCLUDES[x] ?? []).includes(id));

/** The pung patterns of a reading (suited pungs and kongs, by kind) under the same principles. */
function pungPatterns(kinds: readonly Kind[], twice: boolean): string[] {
  const suited = kinds.filter(isSuited);
  const n = suited.length;
  if (n < 2) return [];
  const sorted = [...suited].sort((a, b) => a - b);
  if (n === 4 && sorted.every((k) => suitOf(k) === suitOf(sorted[0] ?? 0)) && sorted.every((k, i) => i === 0 || k - (sorted[i - 1] ?? 0) === 1)) return ['co-four-pure-shifted-pungs'];
  const three = (x: Kind, y: Kind, z: Kind): string | null => {
    const s = [x, y, z].sort((p, q) => p - q);
    const suits = new Set(s.map(suitOf));
    const ranks = s.map(rankOf).sort((p, q) => p - q);
    const consecutive = (ranks[1] ?? 0) - (ranks[0] ?? 0) === 1 && (ranks[2] ?? 0) - (ranks[1] ?? 0) === 1;
    if (suits.size === 1 && consecutive) return 'co-pure-shifted-pungs';
    if (suits.size === 3 && ranks[0] === ranks[2]) return 'co-triple-pung';
    if (suits.size === 3 && consecutive) return 'co-mixed-shifted-pungs';
    return null;
  };
  const two = (x: Kind, y: Kind): string | null => (suitOf(x) !== suitOf(y) && rankOf(x) === rankOf(y) ? 'co-mixed-double-pung' : null);
  let best: string[] = [];
  let bestValue = -1;
  if (n >= 3) {
    for (let a = 0; a < n; a++) {
      for (let b = a + 1; b < n; b++) {
        for (let c = b + 1; c < n; c++) {
          const id = three(suited[a] ?? 0, suited[b] ?? 0, suited[c] ?? 0);
          if (!id) continue;
          const ids = [id];
          const d = [0, 1, 2, 3].find((i) => i < n && i !== a && i !== b && i !== c);
          if (d !== undefined && !(CO_EXCLUDES[id] ?? []).includes('co-mixed-double-pung') && [a, b, c].some((i) => two(suited[d] ?? 0, suited[i] ?? 0))) ids.push('co-mixed-double-pung');
          const v = ids.reduce((sum, x) => sum + coFan(x), 0);
          if (v > bestValue) {
            bestValue = v;
            best = ids;
          }
        }
      }
    }
    if (best.length > 0) return best;
  }
  const rel: { i: number; j: number; id: string }[] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (two(suited[i] ?? 0, suited[j] ?? 0)) rel.push({ i, j, id: 'co-mixed-double-pung' });
  return bestPairs(n, rel, twice, (id) => coFan(id));
}

// A reading

/** Every pattern a reading of the hand makes, before the principles leave some out. */
function patternsOf(shape: WinShape, ctx: WinContext, o: StyleOptions, uniqueWait: () => boolean): Found[] {
  const found: Found[] = [];
  const add = (id: string, times = 1) => {
    if (times > 0) found.push({ id, times });
  };
  const kinds = allKinds(ctx);
  const counts = countsOfKinds(kinds);
  const suits = new Set(kinds.filter(isSuited).map(suitOf));
  const honours = kinds.some(isHonour);
  const standard = shape.shape === 'standard';
  const knit = shape.shape === 'knitted-straight';
  const sets = standard || knit ? shape.sets : [];
  const chows = sets.filter((s) => s.type === 'chow');
  const pungs = sets.filter(isPungLike);
  const pair = shape.pair;
  const closed = ctx.melds.every((m) => m.concealed);
  const twice = o.accountOnce === 'twice';

  // Shapes of their own.
  if (shape.shape === 'thirteen-orphans') add('co-thirteen-orphans');
  if (shape.shape === 'seven-pairs') {
    const p = [...shape.pairs].sort((a, b) => a - b);
    const shifted = new Set(p).size === 7 && p.every((k) => isSuited(k) && suitOf(k) === suitOf(p[0] ?? 0)) && (p[6] ?? 0) - (p[0] ?? 0) === 6;
    if (shifted) add('co-seven-shifted-pairs');
    add('co-seven-pairs');
  }
  if (shape.shape === 'honours-knitted') {
    const honourKinds = kinds.filter(isHonour).length;
    add(honourKinds === 7 ? 'co-greater-honours-knitted' : 'co-lesser-honours-knitted');
    if ((shape.knitted ?? []).every((k) => (counts[k] ?? 0) > 0)) add('co-knitted-straight');
  }
  if (knit) add('co-knitted-straight');
  if (closed && ctx.melds.length === 0 && ctx.concealed.length === 14 && suits.size === 1 && !honours) {
    // Nine gates: 1112345678999 of one suit waiting, and any tile of that suit.
    const suit = suitOf(ctx.concealed[0] ?? 0);
    const before = Array.from({ length: 9 }, (_, r) => counts[suit * 9 + r] ?? 0);
    before[rankOf(ctx.tile) - 1] = (before[rankOf(ctx.tile) - 1] ?? 0) - 1;
    if (before.join() === '3,1,1,1,1,1,1,1,3') add('co-nine-gates');
  }

  // The whole hand.
  if (kinds.every((k) => GREENS.has(k))) add('co-all-green');
  if (kinds.every(isTerminal)) add('co-all-terminals');
  if (kinds.every(isHonour)) add('co-all-honours');
  if (kinds.every(isTerminalOrHonour)) add('co-all-terminals-and-honours');
  if (suits.size === 1 && !honours) add('co-full-flush');
  if (suits.size === 1 && honours) add('co-half-flush');
  if (suits.size === 2) add('co-one-voided-suit');
  if (!honours) add('co-no-honours');
  if (kinds.every((k) => isSuited(k) && !isTerminal(k))) add('co-all-simples');
  const within = (lo: number, hi: number) => kinds.every((k) => isSuited(k) && rankOf(k) >= lo && rankOf(k) <= hi);
  if (within(7, 9)) add('co-upper-tiles');
  if (within(4, 6)) add('co-middle-tiles');
  if (within(1, 3)) add('co-lower-tiles');
  if (within(6, 9)) add('co-upper-four');
  if (within(1, 4)) add('co-lower-four');
  if (kinds.every((k) => REVERSIBLE.has(k))) add('co-reversible-tiles');
  if (suits.size === 3 && kinds.some(isWind) && kinds.some(isDragon)) add('co-all-types');
  // Each four alike not made into a kong.
  let hogs = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) if ((counts[k] ?? 0) === 4 && !ctx.melds.some((m) => m.type === 'kong' && kindOf(m.tiles[0] ?? '1m.0') === k)) hogs++;
  add('co-tile-hog', hogs);

  // Sets.
  if (standard) {
    if (pungs.length === 4) add('co-all-pungs');
    if (chows.length === 4 && pair !== null && isSuited(pair)) add('co-all-chows');
    const groups = [...sets.map(setKinds), pair === null ? [] : [pair]];
    if (groups.every((g) => g.some(isTerminalOrHonour))) add('co-outside-hand');
    if (groups.every((g) => g.some((k) => isSuited(k) && rankOf(k) === 5))) add('co-all-fives');
    if (pungs.length === 4 && pungs.every((s) => isSuited(s.kind) && rankOf(s.kind) % 2 === 0) && pair !== null && isSuited(pair) && rankOf(pair) % 2 === 0) add('co-all-even-pungs');
  }
  if (knit && chows.length === 1 && pair !== null && isSuited(pair)) add('co-all-chows');
  for (const id of chowPatterns(chows.map((s) => s.kind), pair, twice)) add(id);
  for (const id of pungPatterns(pungs.map((s) => s.kind), twice)) add(id);

  // Honour pungs.
  const dragons = pungs.filter((s) => isDragon(s.kind)).length;
  const winds = pungs.filter((s) => isWind(s.kind));
  const seat = WIND_EAST + ctx.seatWind;
  const round = WIND_EAST + ctx.prevailingWind;
  if (dragons === 3) add('co-big-three-dragons');
  if (dragons === 2 && pair !== null && isDragon(pair)) add('co-little-three-dragons');
  if (dragons === 2) add('co-two-dragon-pungs');
  add('co-dragon-pung', dragons);
  if (winds.length === 4) add('co-big-four-winds');
  if (winds.length === 3 && pair !== null && isWind(pair)) add('co-little-four-winds');
  if (winds.length === 3) add('co-big-three-winds');
  if (winds.some((s) => s.kind === seat)) add('co-seat-wind');
  if (winds.some((s) => s.kind === round)) add('co-prevalent-wind');
  add(PTH_TERMINALS, pungs.filter((s) => isTerminal(s.kind)).length);
  add(PTH_WINDS, winds.filter((s) => s.kind !== seat && s.kind !== round).length);

  // Kongs and concealed pungs.
  const kongs = pungs.filter((s) => s.type === 'kong');
  const hidden = kongs.filter((s) => s.concealed).length;
  const open = kongs.length - hidden;
  if (kongs.length === 4) add('co-four-kongs');
  else if (kongs.length === 3) add('co-three-kongs');
  else if (kongs.length === 2) {
    if (hidden === 2) add('co-two-concealed-kongs');
    else if (open === 2 || o.mixedKongs !== 'separate') add('co-two-melded-kongs');
    else {
      add('co-melded-kong');
      add('co-concealed-kong');
    }
  } else if (kongs.length === 1) add(hidden === 1 ? 'co-concealed-kong' : 'co-melded-kong');
  const concealedPungs = pungs.filter((s) => s.concealed).length;
  if (concealedPungs === 4) add('co-four-concealed-pungs');
  else if (concealedPungs === 3) add('co-three-concealed-pungs');
  else if (concealedPungs === 2) add('co-two-concealed-pungs');

  // How it was won.
  if (ctx.selfDrawn) add('co-self-drawn');
  if (closed) add(ctx.selfDrawn ? 'co-fully-concealed' : 'co-concealed-hand');
  if (!ctx.selfDrawn && standard && shape.winIn === -1 && ctx.melds.length === 4 && ctx.melds.every((m) => !m.concealed && !m.added)) add('co-melded-hand');
  if (ctx.selfDrawn && ctx.lastTile) add('co-last-tile-draw');
  if (!ctx.selfDrawn && ctx.lastDiscard) add('co-last-tile-claim');
  if (ctx.selfDrawn && ctx.kongs > 0) add('co-out-with-replacement');
  if (ctx.robbed) add('co-robbing-the-kong');
  if ((ctx.shown ?? 0) >= 3) add('co-last-tile');
  // The waits: only when one kind of tile, and only that, could win the hand.
  if ((standard || knit) && shape.winIn !== -3) {
    const set = shape.winIn >= 0 ? shape.sets[shape.winIn] : undefined;
    let wait: string | null = null;
    if (shape.winIn === -1) wait = 'co-single-wait';
    else if (set && set.type === 'chow' && !set.melded) {
      if (ctx.tile === set.kind + 1) wait = 'co-closed-wait';
      else if ((rankOf(set.kind) === 1 && ctx.tile === set.kind + 2) || (rankOf(set.kind) === 7 && ctx.tile === set.kind)) wait = 'co-edge-wait';
    }
    if (wait && uniqueWait()) add(wait);
  }
  return found;
}

/** The principles applied: patterns in the rulebook's order, each left out when a counted one excludes it. */
function counted(found: readonly Found[]): Found[] {
  const order = (id: string) => {
    const at = CO_PATTERNS.indexOf(id === PTH_TERMINALS || id === PTH_WINDS ? 'co-pung-terminals-honours' : id);
    return at < 0 ? CO_PATTERNS.length : at;
  };
  const sorted = [...found].sort((a, b) => order(a.id) - order(b.id));
  const out: Found[] = [];
  const excluded = new Set<string>();
  for (const f of sorted) {
    if (excluded.has(f.id)) continue;
    out.push(f);
    for (const x of CO_EXCLUDES[f.id] ?? []) excluded.add(x);
  }
  return out;
}

function scoreReading(shape: WinShape, ctx: WinContext, o: StyleOptions, uniqueWait: () => boolean): HandScore {
  const kept = counted(patternsOf(shape, ctx, o, uniqueWait));
  const lines: ScoreLine[] = [];
  const push = (id: string, times: number) => {
    const value = coFan(id, o) * times;
    const at = lines.findIndex((l) => l.id === id);
    const prev = lines[at];
    if (prev) lines[at] = { id, value: prev.value + value, times: (prev.times ?? 1) + times };
    else lines.push(times > 1 ? { id, value, times } : { id, value });
  };
  for (const f of kept) push(f.id === PTH_TERMINALS || f.id === PTH_WINDS ? 'co-pung-terminals-honours' : f.id, f.times);
  if (lines.length === 0) push('co-chicken-hand', 1);
  const flowers = o.flowers !== 'off' ? ctx.bonus.length : 0;
  if (flowers > 0) push('co-flowers', flowers);
  const total = lines.reduce((sum, l) => sum + l.value, 0);
  return { lines, raw: total, total, limit: false, unit: 'mcr', base: total };
}

/** The hand's points without its flowers: what the minimum is measured against. */
export function withoutFlowers(score: HandScore): number {
  return score.total - (score.lines.find((l) => l.id === 'co-flowers')?.value ?? 0);
}

/** The best score of a complete hand, whatever the minimum (null when it is not complete). */
export function coScoreAny(ctx: WinContext, o: StyleOptions): HandScore | null {
  const r = rules(o);
  let waits: Kind[] | null = null;
  const uniqueWait = () => {
    if (waits === null) {
      const before = countsOfKinds(ctx.concealed);
      before[ctx.tile] = (before[ctx.tile] ?? 0) - 1;
      waits = waitsOf(before, ctx.melds.length, r.shapes, 4);
    }
    return waits.length === 1;
  };
  let best: HandScore | null = null;
  for (const shape of winShapes(ctx, r.shapes, 4)) {
    const s = scoreReading(shape, ctx, o, uniqueWait);
    if (!best || s.total > best.total || (s.total === best.total && s.lines.length < best.lines.length)) best = s;
  }
  return best;
}

function score(ctx: WinContext, o: StyleOptions): HandScore | null {
  const best = coScoreAny(ctx, o);
  if (!best || withoutFlowers(best) < num(o, 'minPoints')) return null;
  return best;
}

/** The winner of an x-point hand collects 8 + x from the discarder and 8 from each other player, or 8 + x from each when self-drawn. */
function settle(hand: SettleInput, o: StyleOptions): number[] {
  void o;
  const deltas = new Array<number>(hand.seats).fill(0);
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  for (const w of hand.wins) {
    const x = w.score.base;
    for (let s = 0; s < hand.seats; s++) {
      if (s === w.seat) continue;
      pay(s, w.seat, w.from === null || s === w.from ? CO_BASE + x : CO_BASE);
    }
  }
  return deltas;
}

/** Patterns as the tiles they need, for the CPU to steer by: mixed triple chows, the straights and the knitted straights. */
function goals(): { kinds: Kind[]; value: number }[] {
  const out: { kinds: Kind[]; value: number }[] = [];
  for (let r = 0; r < 7; r++) out.push({ kinds: [0, 1, 2].flatMap((suit) => [suit * 9 + r, suit * 9 + r + 1, suit * 9 + r + 2]), value: coFan('co-mixed-triple-chow') });
  for (const [a, b, c] of [
    [0, 1, 2],
    [0, 2, 1],
    [1, 0, 2],
    [1, 2, 0],
    [2, 0, 1],
    [2, 1, 0],
  ] as const) {
    out.push({ kinds: [a * 9, a * 9 + 1, a * 9 + 2, b * 9 + 3, b * 9 + 4, b * 9 + 5, c * 9 + 6, c * 9 + 7, c * 9 + 8], value: coFan('co-mixed-straight') });
  }
  for (let suit = 0; suit < 3; suit++) out.push({ kinds: Array.from({ length: 9 }, (_, r) => suit * 9 + r), value: coFan('co-pure-straight') });
  for (const set of KNITTED) out.push({ kinds: [...set], value: coFan('co-knitted-straight') });
  return out;
}

const GOALS = goals();

function hints(seat: { readonly seatWind: number; readonly prevailingWind: number; readonly bonus: readonly Kind[] }, o: StyleOptions): ValueHints {
  const pung = new Array<number>(34).fill(0);
  for (let k = 0; k < 27; k++) if (isTerminal(k)) pung[k] = coFan('co-pung-terminals-honours');
  for (let k = WIND_EAST; k < WIND_EAST + 4; k++) pung[k] = coFan('co-pung-terminals-honours');
  for (let k = WHITE; k <= WHITE + 2; k++) pung[k] = coFan('co-dragon-pung');
  const seatWind = WIND_EAST + seat.seatWind;
  const round = WIND_EAST + seat.prevailingWind;
  pung[seatWind] = coFan('co-seat-wind') + (seatWind === round ? coFan('co-prevalent-wind') : 0);
  if (round !== seatWind) pung[round] = coFan('co-prevalent-wind');
  const limit = 88;
  return {
    minimum: num(o, 'minPoints'),
    pung,
    mixedSuit: coFan('co-half-flush'),
    pureSuit: coFan('co-full-flush'),
    allPungs: coFan('co-all-pungs'),
    allChows: coFan('co-all-chows'),
    concealed: coFan('co-concealed-hand'),
    selfDrawn: coFan('co-self-drawn'),
    bonus: 0,
    limit,
    // Each payer pays the base on top of the hand.
    points: Array.from({ length: limit + 1 }, (_, v) => CO_BASE + v),
    // The discarder pays 8 + x and the other two 8 each: about half as much as the discarder.
    pay: { selfDrawn: 1, discarder: 1, others: 0.5 },
    allSimples: coFan('co-all-simples'),
    allSimplesOpen: coFan('co-all-simples'),
    goals: GOALS,
  };
}

export const chineseOfficial: Style = {
  id: 'chinese-official',
  hints,
  options: CO_OPTIONS,
  defaults: CO_DEFAULTS,
  presets: CO_PRESETS,
  rules,
  score,
  scoreAny: coScoreAny,
  settle,
  // The deal passes after every hand, won or drawn.
  dealerKeeps: () => false,
};
