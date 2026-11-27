/**
 * Hong Kong Old Style: the first rules file on the shared engine (docs/rules/mahjong-hk.md).
 * 144 tiles with flowers and seasons (136 without), 13-tile hands, chow, pung and kong, the common
 * faan table with a limit, a minimum to win, and the usual payment conventions. Every disputed
 * value or rule is an option; presets are named sets of options.
 */
import type { Seat } from '../../../core/contract';
import type { HandSet, WinShape } from '../core/arrange';
import { allKinds, winShapes } from '../core/arrange';
import type { HandScore, OptionSpec, ScoreLine, SettleInput, Style, StyleOptions, StyleRules, ValueHints, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { FLOWER_1, isDragon, isHonour, isSuited, isTerminal, isTerminalOrHonour, isWind, SEASON_1, suitOf, WIND_EAST } from '../core/tiles';

export const HK_OPTIONS: readonly OptionSpec[] = [
  { key: 'minFaan', values: [0, 1, 3] },
  { key: 'limit', values: [8, 10, 13] },
  { key: 'table', values: ['half-spicy', 'full-spicy', 'old-style'] },
  { key: 'discardPays', values: ['half-gun', 'full-gun'] },
  { key: 'flowers', values: ['on', 'off'] },
  { key: 'flowerSet', values: [1, 2, 3] },
  { key: 'noFlowers', values: [0, 1] },
  { key: 'sevenPairs', values: [0, 3, 4] },
  { key: 'fullFlush', values: [6, 7] },
  { key: 'smallDragons', values: [4, 5] },
  { key: 'greatDragons', values: [8, 'limit'] },
  { key: 'smallWinds', values: [6, 'limit'] },
  { key: 'namedHands', values: ['absorb', 'stack'] },
  { key: 'concealedSelfDrawn', values: [2, 3] },
  { key: 'multipleWinners', values: ['first', 'all'] },
  { key: 'robKong', values: ['off', 'on', 'orphans'] },
  { key: 'dealerKeeps', values: ['win-or-draw', 'win', 'never'] },
  { key: 'deadWall', values: [0, 14] },
  { key: 'length', values: ['hand', 'east', 'east-south', 'full'] },
];

export const HK_DEFAULTS: StyleOptions = {
  minFaan: 3,
  limit: 10,
  table: 'half-spicy',
  discardPays: 'half-gun',
  flowers: 'on',
  flowerSet: 2,
  noFlowers: 1,
  sevenPairs: 0,
  fullFlush: 7,
  smallDragons: 5,
  greatDragons: 8,
  smallWinds: 6,
  namedHands: 'absorb',
  concealedSelfDrawn: 2,
  multipleWinners: 'first',
  robKong: 'on',
  dealerKeeps: 'win-or-draw',
  deadWall: 0,
  length: 'east',
};

export const HK_PRESETS: readonly { readonly id: string; readonly options: StyleOptions }[] = [
  { id: 'hk-three', options: HK_DEFAULTS },
  { id: 'hk-one', options: { ...HK_DEFAULTS, minFaan: 1 } },
  { id: 'hk-chicken', options: { ...HK_DEFAULTS, minFaan: 0 } },
  { id: 'hk-full-gun', options: { ...HK_DEFAULTS, discardPays: 'full-gun' } },
  { id: 'hk-no-flowers', options: { ...HK_DEFAULTS, flowers: 'off' } },
  { id: 'hk-old-sheet', options: { ...HK_DEFAULTS, table: 'old-style', sevenPairs: 4, smallDragons: 4, fullFlush: 6 } },
];

/** Base points for each faan, 0 to 13, by table. */
export const POINT_TABLES: Readonly<Record<string, readonly number[]>> = {
  'half-spicy': [1, 2, 4, 8, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384],
  'full-spicy': [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192],
  'old-style': [1, 2, 4, 8, 16, 16, 16, 32, 32, 32, 64, 64, 64, 128],
};

export function basePoints(faan: number, table: string): number {
  const t = POINT_TABLES[table] ?? POINT_TABLES['half-spicy'] ?? [];
  return t[Math.max(0, Math.min(faan, t.length - 1))] ?? 1;
}

const num = (o: StyleOptions, key: string): number => {
  const v = o[key];
  return typeof v === 'number' ? v : Number(HK_DEFAULTS[key]);
};

const ROUNDS: Readonly<Record<string, number>> = { hand: 0, east: 1, 'east-south': 2, full: 4 };

function rules(o: StyleOptions): StyleRules {
  return {
    tiles: { honours: true, bonus: o.flowers === 'on', jokers: 0 },
    handSize: 13,
    deadWall: num(o, 'deadWall'),
    replaceBonus: true,
    calls: {
      chow: true,
      pung: true,
      kong: true,
      concealedKong: true,
      addedKong: true,
      robKong: o.robKong !== 'off',
      robConcealedWithOrphans: o.robKong === 'orphans',
      multipleWinners: o.multipleWinners === 'all',
    },
    shapes: { sevenPairs: num(o, 'sevenPairs') > 0, thirteenOrphans: true },
    rounds: ROUNDS[String(o.length)] ?? 1,
    handsPerRound: 8,
  };
}

// Patterns

/**
 * What each pattern scores: a number of faan, or the option that sets it. One table for the
 * scorer, the lessons and the drills, so they cannot disagree.
 */
const FAAN: Readonly<Record<string, number | string>> = {
  'all-chows': 1,
  'all-pungs': 3,
  'mixed-one-suit': 3,
  'pure-one-suit': 'fullFlush',
  'mixed-orphans': 1,
  'seven-pairs': 'sevenPairs',
  'great-dragons': 'greatDragons',
  'small-dragons': 'smallDragons',
  'small-winds': 'smallWinds',
  'dragon-pung': 1,
  'seat-wind': 1,
  'prevailing-wind': 1,
  'concealed-self-drawn': 3,
  'self-drawn': 1,
  concealed: 1,
  'robbing-kong': 1,
  'double-kong': 8,
  'win-by-kong': 1,
  'last-tile': 1,
  'last-discard': 1,
  'flower-set': 'flowerSet',
  'seat-flower': 1,
  'no-flowers': 'noFlowers',
};

/** The limit hands, by id. */
export const HK_LIMIT_HANDS: readonly string[] = ['thirteen-orphans', 'nine-gates', 'all-honours', 'all-terminals', 'four-concealed-pungs', 'all-kongs', 'great-winds', 'heavenly', 'earthly'];

/** The regular patterns, by id, in the order a score sheet lists them. */
export const HK_PATTERNS: readonly string[] = Object.keys(FAAN);

/** The faan a pattern scores under these options; a limit hand (or a value set to the limit) scores the limit. */
export function hkFaan(id: string, o: StyleOptions): number {
  const v = FAAN[id];
  if (v === undefined) return HK_LIMIT_HANDS.includes(id) ? num(o, 'limit') : 0;
  if (typeof v === 'number') return v;
  return o[v] === 'limit' ? num(o, 'limit') : num(o, v);
}


const isPungLike = (s: HandSet) => s.type === 'pung' || s.type === 'kong';

interface Reading {
  readonly shape: WinShape;
  readonly kinds: readonly Kind[];
  readonly suits: ReadonlySet<number>;
  readonly honours: boolean;
  readonly pungs: readonly HandSet[];
}

function readingOf(shape: WinShape, ctx: WinContext): Reading {
  const kinds = allKinds(ctx);
  const suits = new Set<number>(kinds.filter(isSuited).map(suitOf));
  return { shape, kinds, suits, honours: kinds.some(isHonour), pungs: shape.sets.filter(isPungLike) };
}

function isNineGates(ctx: WinContext): boolean {
  if (ctx.melds.length > 0 || ctx.concealed.length !== 14) return false;
  const suit = suitOf(ctx.concealed[0] ?? 99);
  if (suit > 2 || ctx.concealed.some((k) => suitOf(k) !== suit)) return false;
  const c = new Array<number>(9).fill(0);
  for (const k of ctx.concealed) c[k % 9] = (c[k % 9] ?? 0) + 1;
  if ((c[0] ?? 0) < 3 || (c[8] ?? 0) < 3) return false;
  for (let r = 1; r < 8; r++) if ((c[r] ?? 0) < 1) return false;
  return true;
}

/** The limit hands this reading makes, by id. */
function limitHands(r: Reading, ctx: WinContext, o: StyleOptions): string[] {
  const out: string[] = [];
  const { shape } = r;
  if (ctx.heavenly) out.push('heavenly');
  if (ctx.earthly) out.push('earthly');
  if (shape.shape === 'thirteen-orphans') out.push('thirteen-orphans');
  if (isNineGates(ctx)) out.push('nine-gates');
  if (r.kinds.every(isHonour)) out.push('all-honours');
  if (r.kinds.every(isTerminal)) out.push('all-terminals');
  if (shape.shape === 'standard') {
    if (shape.sets.length === 4 && shape.sets.every((s) => isPungLike(s) && s.concealed)) out.push('four-concealed-pungs');
    if (shape.sets.filter((s) => s.type === 'kong').length === 4) out.push('all-kongs');
    const windPungs = r.pungs.filter((s) => isWind(s.kind)).length;
    const dragonPungs = r.pungs.filter((s) => isDragon(s.kind)).length;
    if (windPungs === 4) out.push('great-winds');
    if (o.smallWinds === 'limit' && windPungs === 3 && shape.pair !== null && isWind(shape.pair)) out.push('small-winds');
    if (o.greatDragons === 'limit' && dragonPungs === 3) out.push('great-dragons');
  }
  return out;
}

function regularLines(r: Reading, ctx: WinContext, o: StyleOptions): ScoreLine[] {
  const lines: ScoreLine[] = [];
  const faan = (id: string) => hkFaan(id, o);
  const add = (id: string, value: number, times = 1) => {
    if (value > 0 && times > 0) lines.push(times > 1 ? { id, value: value * times, times } : { id, value });
  };
  const { shape } = r;
  const standard = shape.shape === 'standard';
  const absorb = o.namedHands !== 'stack';

  // How the hand is built.
  if (standard && shape.sets.every((s) => s.type === 'chow')) add('all-chows', faan('all-chows'));
  if (standard && shape.sets.every(isPungLike)) add('all-pungs', faan('all-pungs'));
  if (r.suits.size === 1 && r.honours) add('mixed-one-suit', faan('mixed-one-suit'));
  if (r.suits.size === 1 && !r.honours) add('pure-one-suit', faan('pure-one-suit'));
  if (r.kinds.every(isTerminalOrHonour)) add('mixed-orphans', faan('mixed-orphans'));
  if (shape.shape === 'seven-pairs') add('seven-pairs', faan('seven-pairs'));

  // Honour sets.
  const dragonPungs = r.pungs.filter((s) => isDragon(s.kind)).length;
  const windPungs = r.pungs.filter((s) => isWind(s.kind));
  const seatWind = WIND_EAST + ctx.seatWind;
  const prevailing = WIND_EAST + ctx.prevailingWind;
  const greatDragons = standard && dragonPungs === 3;
  const smallDragons = standard && dragonPungs === 2 && shape.pair !== null && isDragon(shape.pair);
  const smallWinds = standard && windPungs.length === 3 && shape.pair !== null && isWind(shape.pair);
  if (greatDragons) add('great-dragons', faan('great-dragons'));
  if (smallDragons) add('small-dragons', faan('small-dragons'));
  if (smallWinds) add('small-winds', faan('small-winds'));
  const dragonsAbsorbed = absorb && (greatDragons || smallDragons);
  if (!dragonsAbsorbed) add('dragon-pung', faan('dragon-pung'), dragonPungs);
  const windsAbsorbed = absorb && smallWinds;
  if (!windsAbsorbed) {
    if (windPungs.some((s) => s.kind === seatWind)) add('seat-wind', faan('seat-wind'));
    if (windPungs.some((s) => s.kind === prevailing)) add('prevailing-wind', faan('prevailing-wind'));
  }

  // How the hand is won.
  const concealed = ctx.melds.every((m) => m.concealed);
  if (concealed && ctx.selfDrawn && num(o, 'concealedSelfDrawn') === 3) add('concealed-self-drawn', faan('concealed-self-drawn'));
  else {
    if (ctx.selfDrawn) add('self-drawn', faan('self-drawn'));
    if (concealed) add('concealed', faan('concealed'));
  }
  if (ctx.robbed) add('robbing-kong', faan('robbing-kong'));
  if (ctx.selfDrawn && ctx.kongs >= 2) add('double-kong', faan('double-kong'));
  else if (ctx.selfDrawn && ctx.kongs === 1) add('win-by-kong', faan('win-by-kong'));
  if (ctx.selfDrawn && ctx.lastTile) add('last-tile', faan('last-tile'));
  if (!ctx.selfDrawn && ctx.lastDiscard) add('last-discard', faan('last-discard'));

  // Flowers.
  if (o.flowers === 'on') {
    const number = ctx.seatWind;
    for (const first of [FLOWER_1, SEASON_1]) {
      const held = [0, 1, 2, 3].filter((i) => ctx.bonus.includes(first + i));
      if (held.length === 4) add('flower-set', faan('flower-set'));
      else if (held.includes(number)) add('seat-flower', faan('seat-flower'));
    }
    if (ctx.bonus.length === 0) add('no-flowers', faan('no-flowers'));
  }
  return collapse(lines);
}

/** One line per pattern: a pattern found twice (a seat flower and a seat season) is counted twice. */
function collapse(lines: readonly ScoreLine[]): ScoreLine[] {
  const out: ScoreLine[] = [];
  for (const line of lines) {
    const i = out.findIndex((l) => l.id === line.id);
    const prev = out[i];
    if (i < 0 || !prev) out.push(line);
    else out[i] = { id: line.id, value: prev.value + line.value, times: (prev.times ?? 1) + (line.times ?? 1) };
  }
  return out;
}

function scoreReading(shape: WinShape, ctx: WinContext, o: StyleOptions): HandScore {
  const limit = num(o, 'limit');
  const r = readingOf(shape, ctx);
  const limits = limitHands(r, ctx, o);
  if (limits.length > 0) {
    return { lines: limits.map((id) => ({ id, value: limit })), raw: limit, total: limit, limit: true, unit: 'faan', base: basePoints(limit, String(o.table)) };
  }
  const lines = regularLines(r, ctx, o);
  const raw = lines.reduce((sum, l) => sum + l.value, 0);
  const total = Math.min(raw, limit);
  return { lines, raw, total, limit: raw >= limit, unit: 'faan', base: basePoints(total, String(o.table)) };
}

function better(a: HandScore, b: HandScore | null): boolean {
  if (!b) return true;
  if (a.total !== b.total) return a.total > b.total;
  if (a.raw !== b.raw) return a.raw > b.raw;
  return a.lines.length < b.lines.length;
}

/** The best score of a complete hand, whatever the minimum (null when it is not complete). */
export function hkScoreAny(ctx: WinContext, o: StyleOptions): HandScore | null {
  const r = rules(o);
  let best: HandScore | null = null;
  for (const shape of winShapes(ctx, r.shapes, 4)) {
    const s = scoreReading(shape, ctx, o);
    if (better(s, best)) best = s;
  }
  return best;
}

function score(ctx: WinContext, o: StyleOptions): HandScore | null {
  const best = hkScoreAny(ctx, o);
  if (!best || best.total < num(o, 'minFaan')) return null;
  return best;
}

function settle(hand: SettleInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(hand.seats).fill(0);
  const winners = new Set<Seat>(hand.wins.map((w) => w.seat));
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  for (const w of hand.wins) {
    const b = w.score.base;
    if (w.from === null) {
      for (let s = 0; s < hand.seats; s++) if (s !== w.seat) pay(s, w.seat, 2 * b);
    } else if (o.discardPays === 'full-gun') {
      pay(w.from, w.seat, 4 * b);
    } else {
      pay(w.from, w.seat, 2 * b);
      for (let s = 0; s < hand.seats; s++) if (s !== w.from && !winners.has(s)) pay(s, w.seat, b);
    }
  }
  return deltas;
}

function hints(seat: { readonly seatWind: number; readonly prevailingWind: number; readonly bonus: readonly Kind[] }, o: StyleOptions): ValueHints {
  const pung = new Array<number>(34).fill(0);
  for (let k = 31; k <= 33; k++) pung[k] = 1;
  pung[WIND_EAST + seat.seatWind] = (pung[WIND_EAST + seat.seatWind] ?? 0) + 1;
  pung[WIND_EAST + seat.prevailingWind] = (pung[WIND_EAST + seat.prevailingWind] ?? 0) + 1;
  let bonus = 0;
  if (o.flowers === 'on') {
    for (const first of [FLOWER_1, SEASON_1]) {
      const held = [0, 1, 2, 3].filter((i) => seat.bonus.includes(first + i));
      if (held.length === 4) bonus += num(o, 'flowerSet');
      else if (held.includes(seat.seatWind)) bonus += 1;
    }
    if (seat.bonus.length === 0) bonus += num(o, 'noFlowers');
  }
  return {
    minimum: num(o, 'minFaan'),
    pung,
    mixedSuit: 3,
    pureSuit: num(o, 'fullFlush'),
    allPungs: 3,
    allChows: 1,
    concealed: 1,
    selfDrawn: 1,
    bonus,
    limit: num(o, 'limit'),
    points: Array.from({ length: num(o, 'limit') + 1 }, (_, f) => basePoints(f, String(o.table))),
    pay: o.discardPays === 'full-gun' ? { selfDrawn: 2, discarder: 4, others: 0 } : { selfDrawn: 2, discarder: 2, others: 1 },
  };
}

export const hongKong: Style = {
  id: 'hong-kong',
  hints,
  options: HK_OPTIONS,
  defaults: HK_DEFAULTS,
  presets: HK_PRESETS,
  rules,
  score,
  scoreAny: hkScoreAny,
  settle,
  dealerKeeps(hand, o) {
    if (o.dealerKeeps === 'never') return false;
    if (hand.winners.includes(hand.dealer)) return true;
    return hand.drawn && o.dealerKeeps === 'win-or-draw';
  },
};
