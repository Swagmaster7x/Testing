/**
 * Sichuan Bloody ("blood battle", 血战到底): the third rules file on the shared engine
 * (docs/rules/mahjong-sichuan.md). 108 tiles (suits only), no chows, a void suit declared by every
 * player (thrown first, never called, never in a winning hand), the hand going on after a win until
 * three players have won or the wall is empty, kongs paid at once, the checks at the end for players
 * not ready and for flower pigs, and the fan table with its cap. Every rule tables disagree on is an
 * option.
 */
import type { Seat } from '../../../core/contract';
import type { WinShape } from '../core/arrange';
import { allKinds, winShapes } from '../core/arrange';
import { waitsOf } from '../core/shapes';
import type { DrawInput, GameStanding, HandScore, KongInput, OptionSpec, PassRound, ScoreLine, SettleInput, Style, StyleOptions, StyleRules, ValueHints, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { countsOf, isSuited, isTerminal, kindOf, rankOf, suitOf } from '../core/tiles';

export const SICHUAN_OPTIONS: readonly OptionSpec[] = [
  { key: 'cap', values: [4, 3, 5, 6] },
  { key: 'selfDraw', values: ['base', 'fan', 'none'] },
  { key: 'exchange', values: ['off', 'random', 'right', 'left', 'across'] },
  { key: 'kongPay', values: ['standard', 'off'] },
  { key: 'kongShoot', values: ['transfer', 'return', 'keep'] },
  { key: 'refund', values: ['on', 'off'] },
  { key: 'checks', values: ['on', 'off'] },
  { key: 'pig', values: ['cap', 16] },
  { key: 'multipleWin', values: ['all', 'first'] },
  { key: 'extras', values: ['on', 'off'] },
  { key: 'bonusFan', values: ['on', 'off'] },
  { key: 'heavenly', values: ['cap', 'off'] },
  { key: 'length', values: ['four', 'hand', 'eight', 'sixteen'] },
];

export const SICHUAN_DEFAULTS: StyleOptions = Object.fromEntries(SICHUAN_OPTIONS.map((o) => [o.key, o.values[0] as string | number]));

export const SICHUAN_PRESETS: readonly { readonly id: string; readonly options: StyleOptions }[] = [
  { id: 'sichuan-chengdu', options: SICHUAN_DEFAULTS },
  { id: 'sichuan-online', options: { ...SICHUAN_DEFAULTS, exchange: 'random', selfDraw: 'fan' } },
  { id: 'sichuan-plain', options: { ...SICHUAN_DEFAULTS, cap: 3, extras: 'off', selfDraw: 'none' } },
  { id: 'sichuan-high', options: { ...SICHUAN_DEFAULTS, cap: 6 } },
  { id: 'sichuan-hand', options: { ...SICHUAN_DEFAULTS, length: 'hand' } },
];

/** What each kong costs when paid at once ("wind and rain"): exposed from the discarder, added and concealed from each player still in. */
export const KONG_PAY = { exposed: 2, added: 1, concealed: 2 } as const;
/** The fixed sum a flower pig pays each player, when the table does not charge the cap. */
export const PIG_FIXED = 16;

const HANDS: Readonly<Record<string, number>> = { hand: 1, four: 4, eight: 8, sixteen: 16 };
const DIRS: Readonly<Record<string, PassRound['dir']>> = { random: 0, right: 1, across: 2, left: 3 };

const on = (o: StyleOptions, key: string): boolean => (o[key] ?? SICHUAN_DEFAULTS[key]) === 'on';
const num = (o: StyleOptions, key: string): number => {
  const v = o[key];
  return typeof v === 'number' ? v : Number(SICHUAN_DEFAULTS[key]);
};

function rules(o: StyleOptions): StyleRules {
  const length = String(o.length ?? 'four');
  const exchange = String(o.exchange ?? 'off');
  return {
    tiles: { honours: false, bonus: false, jokers: 0 },
    handSize: 13,
    deadWall: 0,
    replaceBonus: false,
    calls: {
      chow: false,
      pung: true,
      kong: true,
      concealedKong: true,
      addedKong: true,
      robKong: true,
      robConcealedWithOrphans: false,
      multipleWinners: o.multipleWin !== 'first',
    },
    shapes: { sevenPairs: true, thirteenOrphans: false, sevenPairsFour: true },
    rounds: length === 'hand' ? 0 : 1,
    handsPerRound: HANDS[length] ?? 4,
    declareVoid: true,
    playOn: { winners: 3 },
    ...(exchange !== 'off' ? { passes: { rounds: [{ dir: DIRS[exchange] ?? 0, count: 3, sameSuit: true }] } } : {}),
  };
}

// Fan

/**
 * Each pattern's fan. One table for the scorer, the lessons and the drills, so they cannot
 * disagree. Patterns add up; the total is capped.
 */
export const SICHUAN_FAN: Readonly<Record<string, number>> = {
  'sc-all-pungs': 1,
  'sc-pure-suit': 2,
  'sc-seven-pairs': 2,
  'sc-root': 1,
  'sc-terminals': 2,
  'sc-golden-hook': 1,
  'sc-two-five-eight': 2,
  'sc-kong-flower': 1,
  'sc-kong-discard': 1,
  'sc-robbing-kong': 1,
  'sc-last-tile': 1,
  'sc-last-discard': 1,
  'sc-self-drawn': 1,
};

/** The patterns that count only with `extras: on`, and those only with `bonusFan: on`. */
export const SICHUAN_EXTRAS: readonly string[] = ['sc-terminals', 'sc-golden-hook', 'sc-two-five-eight'];
export const SICHUAN_BONUS: readonly string[] = ['sc-kong-flower', 'sc-kong-discard', 'sc-robbing-kong', 'sc-last-tile', 'sc-last-discard'];

/** Base points for a fan total: two to its power, capped. */
export function sichuanPoints(fan: number, o: StyleOptions = SICHUAN_DEFAULTS): number {
  return 2 ** Math.max(0, Math.min(fan, num(o, 'cap')));
}

/** Four of the same tile anywhere in the hand: each is a root (gen). */
export function rootsOf(kinds: readonly Kind[]): number {
  const c = new Map<Kind, number>();
  for (const k of kinds) c.set(k, (c.get(k) ?? 0) + 1);
  return [...c.values()].filter((n) => n >= 4).length;
}

const isTwoFiveEight = (k: Kind): boolean => isSuited(k) && [2, 5, 8].includes(rankOf(k));
const setKinds = (s: { type: string; kind: Kind }): Kind[] => (s.type === 'chow' ? [s.kind, s.kind + 1, s.kind + 2] : [s.kind]);

/** True when the hand holds a tile of its void suit, or tiles of all three suits. */
export function breaksVoid(ctx: Pick<WinContext, 'concealed' | 'melds' | 'voidSuit'>): boolean {
  const kinds = [...ctx.concealed, ...ctx.melds.flatMap((m) => m.tiles.map(kindOf))];
  const suits = new Set(kinds.filter(isSuited).map(suitOf));
  if (suits.size > 2) return true;
  const v = ctx.voidSuit;
  return v !== null && v !== undefined && suits.has(v);
}

function scoreReading(shape: WinShape, ctx: WinContext, o: StyleOptions): HandScore {
  const cap = num(o, 'cap');
  const lines: ScoreLine[] = [];
  const add = (id: string, times = 1) => {
    const value = SICHUAN_FAN[id] ?? 0;
    if (times > 0) lines.push(times > 1 ? { id, value: value * times, times } : { id, value });
  };
  const kinds = allKinds(ctx);
  const standard = shape.shape === 'standard';
  const sevenPairs = shape.shape === 'seven-pairs';
  const allPungs = standard && shape.sets.every((s) => s.type !== 'chow');
  const extras = on(o, 'extras');
  if (o.heavenly !== 'off') {
    if (ctx.heavenly) lines.push({ id: 'sc-heavenly', value: cap });
    else if (ctx.firstDraw || ctx.earthly) lines.push({ id: 'sc-earthly', value: cap });
    if (lines.length > 0) return { lines, raw: cap, total: cap, limit: true, unit: 'fan', base: sichuanPoints(cap, o) };
  }
  if (allPungs) add('sc-all-pungs');
  if (new Set(kinds.map(suitOf)).size === 1) add('sc-pure-suit');
  if (sevenPairs) add('sc-seven-pairs');
  if (extras && standard) {
    const groups = [...shape.sets.map(setKinds), shape.pair === null ? [] : [shape.pair]];
    if (groups.every((g) => g.some(isTerminal))) add('sc-terminals');
    if (allPungs && ctx.melds.length === 4 && shape.winIn === -1) add('sc-golden-hook');
    if (allPungs && kinds.every(isTwoFiveEight)) add('sc-two-five-eight');
  }
  if (extras && sevenPairs && kinds.every(isTwoFiveEight)) add('sc-two-five-eight');
  add('sc-root', rootsOf(kinds));
  if (on(o, 'bonusFan')) {
    if (ctx.selfDrawn && ctx.kongs > 0) add('sc-kong-flower');
    if (!ctx.selfDrawn && ctx.kongDiscard) add('sc-kong-discard');
    if (ctx.robbed) add('sc-robbing-kong');
    if (ctx.selfDrawn && ctx.lastTile) add('sc-last-tile');
    if (!ctx.selfDrawn && ctx.lastDiscard) add('sc-last-discard');
  }
  if (o.selfDraw === 'fan' && ctx.selfDrawn) add('sc-self-drawn');
  const raw = lines.reduce((n, l) => n + l.value, 0);
  const total = Math.min(raw, cap);
  return { lines, raw, total, limit: raw >= cap, unit: 'fan', base: sichuanPoints(total, o) };
}

/** The best score of a complete hand, whatever its suits (null when it is not complete), for teaching. */
export function sichuanScoreAny(ctx: WinContext, o: StyleOptions): HandScore | null {
  let best: HandScore | null = null;
  for (const shape of winShapes(ctx, rules(o).shapes, 4)) {
    const s = scoreReading(shape, ctx, o);
    if (!best || s.total > best.total || (s.total === best.total && s.raw > best.raw)) best = s;
  }
  return best;
}

/** The hand's score, or null when it is not complete or keeps its void suit (or three suits). */
function score(ctx: WinContext, o: StyleOptions): HandScore | null {
  if (breaksVoid(ctx)) return null;
  return sichuanScoreAny(ctx, o);
}

function settle(hand: SettleInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(hand.seats).fill(0);
  const out = hand.out ?? new Array<boolean>(hand.seats).fill(false);
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  for (const w of hand.wins) {
    const b = w.score.base;
    if (w.from === null) {
      const extra = o.selfDraw === 'base' ? 1 : 0;
      for (let s = 0; s < hand.seats; s++) if (s !== w.seat && !out[s]) pay(s, w.seat, b + extra);
    } else pay(w.from, w.seat, b);
  }
  // A kong whose next throw is won on: its money goes to the winner, or back to those who paid it.
  const first = hand.wins[0];
  if (hand.kongDiscard && first && first.from !== null && o.kongShoot !== 'keep') {
    const thrower = first.from;
    const kong = [...(hand.ledger ?? [])].reverse().find((p) => p.reason.startsWith('kong-') && p.seat === thrower);
    if (kong) {
      if (o.kongShoot === 'return') kong.deltas.forEach((d, s) => (deltas[s] = (deltas[s] ?? 0) - d));
      else pay(thrower, first.seat, kong.deltas[thrower] ?? 0);
    }
  }
  return deltas;
}

function kongPayment(k: KongInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(k.seats).fill(0);
  if (o.kongPay === 'off') return deltas;
  const pay = (from: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[k.seat] = (deltas[k.seat] ?? 0) + amount;
  };
  if (k.kind === 'exposed') {
    if (k.from !== null) pay(k.from, KONG_PAY.exposed);
  } else {
    for (let s = 0; s < k.seats; s++) if (s !== k.seat && !k.out[s]) pay(s, KONG_PAY[k.kind]);
  }
  return deltas;
}

/** A won-on-a-discard context for a seat's tiles plus one more, to price a ready hand at the end. */
function readyContext(hand: DrawInput, seat: Seat, tile: Kind): WinContext {
  const concealed = [...(hand.hands?.[seat] ?? []).map(kindOf), tile];
  return {
    seat,
    tile,
    selfDrawn: false,
    from: (seat + 1) % hand.seats,
    concealed,
    melds: hand.melds?.[seat] ?? [],
    bonus: [],
    seatWind: 0,
    prevailingWind: 0,
    dealer: seat === hand.dealer,
    lastTile: false,
    lastDiscard: false,
    kongs: 0,
    robbed: false,
    heavenly: false,
    earthly: false,
    voidSuit: hand.voids?.[seat] ?? null,
  };
}

/** The most a seat's hand could win on a discard (0 when it is not ready). */
export function bestReadyValue(hand: DrawInput, seat: Seat, o: StyleOptions): number {
  const tiles = hand.hands?.[seat] ?? [];
  const melds = hand.melds?.[seat] ?? [];
  let best = 0;
  for (const k of waitsOf(countsOf(tiles), melds.length, rules(o).shapes, 4)) {
    const s = score(readyContext(hand, seat, k), o);
    if (s) best = Math.max(best, s.base);
  }
  return best;
}

/** Each seat's standing when the wall ran out: won, ready, not ready, or a flower pig (still holding three suits). */
function seatStatus(hand: DrawInput, o: StyleOptions): string[] {
  return Array.from({ length: hand.seats }, (_, seat) => {
    if (hand.out?.[seat]) return 'won';
    const tiles = (hand.hands?.[seat] ?? []).map(kindOf);
    const melded = (hand.melds?.[seat] ?? []).flatMap((m) => m.tiles.map(kindOf));
    const suits = new Set([...tiles, ...melded].filter(isSuited).map(suitOf));
    const v = hand.voids?.[seat];
    if (suits.size > 2 || (v !== null && v !== undefined && suits.has(v))) return 'pig';
    return bestReadyValue(hand, seat, o) > 0 ? 'ready' : 'not-ready';
  });
}

/** The end of the hand when the wall ran out: kong money returned by players not ready, then the checks. */
function settleDraw(hand: DrawInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(hand.seats).fill(0);
  if (hand.reason !== 'exhausted') return deltas;
  const status = seatStatus(hand, o);
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  if (on(o, 'refund')) {
    for (const p of hand.ledger ?? []) {
      if (!p.reason.startsWith('kong-') || (status[p.seat] !== 'not-ready' && status[p.seat] !== 'pig')) continue;
      p.deltas.forEach((d, s) => (deltas[s] = (deltas[s] ?? 0) - d));
    }
  }
  if (on(o, 'checks')) {
    const pigValue = o.pig === 16 ? PIG_FIXED : sichuanPoints(num(o, 'cap'), o);
    status.forEach((st, seat) => {
      if (st === 'pig') status.forEach((other, to) => other !== 'pig' && other !== 'won' && to !== seat && pay(seat, to, pigValue));
      if (st === 'not-ready') status.forEach((other, to) => other === 'ready' && pay(seat, to, bestReadyValue(hand, to, o)));
    });
  }
  return deltas;
}

function gameOver(st: GameStanding, o: StyleOptions): boolean | null {
  return st.hands >= (HANDS[String(o.length ?? 'four')] ?? 4);
}

function hints(seat: { readonly voidSuit?: number | null }, o: StyleOptions): ValueHints {
  const cap = num(o, 'cap');
  const v = seat.voidSuit;
  return {
    minimum: 0,
    pung: new Array<number>(34).fill(0),
    mixedSuit: 2,
    pureSuit: 2,
    allPungs: 1,
    allChows: 0,
    concealed: 0,
    selfDrawn: o.selfDraw === 'fan' ? 1 : 0,
    bonus: 0,
    limit: cap,
    points: Array.from({ length: cap + 1 }, (_, f) => sichuanPoints(f, o)),
    // A self-draw is paid by everyone still in; a discard by the thrower alone.
    pay: { selfDrawn: 1, discarder: 1, others: 0 },
    // The blood battle is a race: the first winners collect from everyone still in, so speed counts
    // for more than fan (measured on the ladder, PROGRESS-M14c.md).
    valueSteer: 0.3,
    callsBySpeed: true,
    ...(v !== null && v !== undefined ? { dead: Array.from({ length: 9 }, (_, r) => v * 9 + r) } : {}),
  };
}

export const sichuan: Style = {
  id: 'sichuan',
  hints,
  options: SICHUAN_OPTIONS,
  defaults: SICHUAN_DEFAULTS,
  presets: SICHUAN_PRESETS,
  rules,
  score,
  scoreAny: sichuanScoreAny,
  settle,
  settleDraw,
  seatStatus,
  kongPayment,
  dealerKeeps: () => false,
  gameOver,
};
