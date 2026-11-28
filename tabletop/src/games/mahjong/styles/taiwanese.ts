/**
 * Taiwanese (16-tile) mahjong: the fourth rules file on the shared engine
 * (docs/rules/mahjong-taiwanese.md). 144 tiles with flowers, hands of sixteen (five sets and a
 * pair), seat flowers, hands counted in tai, payments of a base stake plus a stake per tai, the
 * dealer's extra tai and its streak of kept deals, several winners on one discard, lik gu lik gu,
 * and the flower wins (eight flowers, seven robbing the eighth). Every disputed value is an option.
 */
import type { Seat } from '../../../core/contract';
import type { HandSet, WinShape } from '../core/arrange';
import { allKinds, winShapes } from '../core/arrange';
import { waitsOf } from '../core/shapes';
import type { HandEnd, HandScore, OptionSpec, ScoreLine, SettleInput, Style, StyleOptions, StyleRules, ValueHints, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { countsOfKinds, FLOWER_1, isDragon, isHonour, isSuited, isWind, SEASON_1, suitOf, WHITE, WIND_EAST } from '../core/tiles';

export const TW_OPTIONS: readonly OptionSpec[] = [
  { key: 'base', values: [100, 50, 30, 300] },
  { key: 'perTai', values: [20, 10, 50, 100] },
  { key: 'minTai', values: [0, 1, 2] },
  { key: 'length', values: ['east', 'east-south', 'full', 'hand'] },
  { key: 'dealerKeeps', values: ['win-or-draw', 'win'] },
  { key: 'multipleWinners', values: ['all', 'first'] },
  { key: 'concealedSelfDrawn', values: [3, 2] },
  { key: 'allHonours', values: [16, 8] },
  { key: 'pairsAndPung', values: ['on', 'off'] },
  { key: 'flowerWins', values: ['on', 'off'] },
  { key: 'robKong', values: ['on', 'off'] },
  { key: 'deadWall', values: [16, 0] },
];

export const TW_DEFAULTS: StyleOptions = Object.fromEntries(TW_OPTIONS.map((o) => [o.key, o.values[0] as string | number]));

export const TW_PRESETS: readonly { readonly id: string; readonly options: StyleOptions }[] = [
  { id: 'tw-common', options: TW_DEFAULTS },
  { id: 'tw-small', options: { ...TW_DEFAULTS, base: 30, perTai: 10 } },
  { id: 'tw-full', options: { ...TW_DEFAULTS, length: 'full' } },
  { id: 'tw-strict', options: { ...TW_DEFAULTS, multipleWinners: 'first', dealerKeeps: 'win', minTai: 1, concealedSelfDrawn: 2 } },
  { id: 'tw-hand', options: { ...TW_DEFAULTS, length: 'hand' } },
];

const num = (o: StyleOptions, key: string): number => {
  const v = o[key];
  return typeof v === 'number' ? v : Number(TW_DEFAULTS[key]);
};

const ROUNDS: Readonly<Record<string, number>> = { hand: 0, east: 1, 'east-south': 2, full: 4 };

function rules(o: StyleOptions): StyleRules {
  return {
    tiles: { honours: true, bonus: true, jokers: 0 },
    handSize: 16,
    deadWall: num(o, 'deadWall'),
    replaceBonus: true,
    calls: {
      chow: true,
      pung: true,
      kong: true,
      concealedKong: true,
      addedKong: true,
      robKong: o.robKong !== 'off',
      robConcealedWithOrphans: false,
      multipleWinners: o.multipleWinners !== 'first',
    },
    shapes: { sevenPairs: false, thirteenOrphans: false, pairsAndPung: o.pairsAndPung !== 'off' },
    rounds: ROUNDS[String(o.length)] ?? 1,
    // The dealer keeps the deal after draws too, so a round can run long.
    handsPerRound: 16,
    ...(o.flowerWins !== 'off' ? { flowerWins: { eight: true, robSeventh: true } } : {}),
  };
}

// Tai

/**
 * What each pattern is worth in tai, or the option that sets it. One table for the scorer, the
 * lessons, the drill and the reference card. The streak is worth this much for each hand kept.
 */
const TAI: Readonly<Record<string, number | string>> = {
  'tw-big-four-winds': 16,
  'tw-all-honours': 'allHonours',
  'tw-little-four-winds': 8,
  'tw-big-three-dragons': 8,
  'tw-full-flush': 8,
  'tw-five-concealed': 8,
  'tw-pairs-and-pung': 8,
  'tw-eight-flowers': 8,
  'tw-seven-flowers': 8,
  'tw-four-concealed': 5,
  'tw-little-three-dragons': 4,
  'tw-half-flush': 4,
  'tw-all-pungs': 4,
  'tw-three-concealed': 2,
  'tw-all-chows': 2,
  'tw-all-melded': 2,
  'tw-dragon-pung': 1,
  'tw-seat-wind': 1,
  'tw-round-wind': 1,
  'tw-concealed-self-drawn': 'concealedSelfDrawn',
  'tw-self-drawn': 1,
  'tw-concealed': 1,
  'tw-one-wait': 1,
  'tw-last-tile': 1,
  'tw-last-discard': 1,
  'tw-kong-replacement': 1,
  'tw-robbing-kong': 1,
  'tw-heavenly': 24,
  'tw-earthly': 16,
  'tw-human': 16,
  'tw-seat-flower': 1,
  'tw-flower-set': 2,
  'tw-dealer': 1,
  'tw-streak': 2,
};

/** Every pattern, by id, in the order of the table above. */
export const TW_PATTERNS: readonly string[] = Object.keys(TAI);

/** A pattern's tai under these options (the streak: for each hand kept). */
export function twTai(id: string, o: StyleOptions = TW_DEFAULTS): number {
  const v = TAI[id];
  if (v === undefined) return 0;
  return typeof v === 'number' ? v : num(o, v);
}

/** The extra tai a dealer pays (or a dealer's win collects) with a streak of `streak` kept deals: 1 + 2 × streak. */
export function dealerTai(streak: number): number {
  return twTai('tw-dealer') + twTai('tw-streak') * streak;
}

const isPungLike = (s: HandSet) => s.type === 'pung' || s.type === 'kong';

/** The bonus tiles' tai: each seat flower and season, or a set of four (which holds its seat flower). */
function flowerLines(ctx: WinContext, add: (id: string, times?: number) => void): void {
  for (const first of [FLOWER_1, SEASON_1]) {
    const held = [0, 1, 2, 3].filter((i) => ctx.bonus.includes(first + i));
    if (held.length === 4) add('tw-flower-set');
    else if (held.includes(ctx.seatWind)) add('tw-seat-flower');
  }
}

function scoreReading(shape: WinShape | null, ctx: WinContext, o: StyleOptions, uniqueWait: () => boolean): HandScore {
  const lines: ScoreLine[] = [];
  const add = (id: string, times = 1) => {
    if (times <= 0) return;
    const value = twTai(id, o) * times;
    const at = lines.findIndex((l) => l.id === id);
    const prev = lines[at];
    if (prev) lines[at] = { id, value: prev.value + value, times: (prev.times ?? 1) + times };
    else lines.push(times > 1 ? { id, value, times } : { id, value });
  };
  if (ctx.flowerWin) {
    // The flowers win by themselves; they are not counted again.
    add(ctx.flowerWin === 'eight' ? 'tw-eight-flowers' : 'tw-seven-flowers');
  } else if (shape) {
    const standard = shape.shape === 'standard';
    const pairs = shape.shape === 'pairs-and-pung';
    const sets = shape.sets;
    const pungs = sets.filter(isPungLike);
    const chows = sets.filter((s) => s.type === 'chow');
    const pair = shape.pair;
    const kinds = allKinds(ctx);
    const suits = new Set(kinds.filter(isSuited).map(suitOf));
    const honours = kinds.some(isHonour);

    // The hand.
    if (pairs) add('tw-pairs-and-pung');
    const winds = pungs.filter((s) => isWind(s.kind));
    const dragons = pungs.filter((s) => isDragon(s.kind)).length;
    const seat = WIND_EAST + ctx.seatWind;
    const round = WIND_EAST + ctx.prevailingWind;
    if (winds.length === 4) add('tw-big-four-winds');
    else if (winds.length === 3 && pair !== null && isWind(pair)) add('tw-little-four-winds');
    else {
      if (winds.some((s) => s.kind === seat)) add('tw-seat-wind');
      if (winds.some((s) => s.kind === round)) add('tw-round-wind');
    }
    if (dragons === 3) add('tw-big-three-dragons');
    else if (dragons === 2 && pair !== null && isDragon(pair)) add('tw-little-three-dragons');
    else add('tw-dragon-pung', dragons);
    if (kinds.every(isHonour)) add('tw-all-honours');
    else if (standard && pungs.length === 5) add('tw-all-pungs');
    if (suits.size === 1 && !honours) add('tw-full-flush');
    if (suits.size === 1 && honours) add('tw-half-flush');
    if (standard) {
      const concealed = pungs.filter((s) => s.concealed).length;
      if (concealed >= 5) add('tw-five-concealed');
      else if (concealed === 4) add('tw-four-concealed');
      else if (concealed === 3) add('tw-three-concealed');
    }

    // How it was won.
    const closed = ctx.melds.every((m) => m.concealed);
    const allMelded = standard && !ctx.selfDrawn && shape.winIn === -1 && ctx.melds.length === 5 && ctx.melds.every((m) => !m.concealed);
    const oneWait = standard && !allMelded && uniqueWait();
    if (ctx.heavenly) add('tw-heavenly');
    else if (ctx.firstDraw) add('tw-earthly');
    else if (ctx.earthly) add('tw-human');
    else {
      if (pairs) {
        if (ctx.selfDrawn) add('tw-self-drawn');
      } else if (closed && ctx.selfDrawn) add('tw-concealed-self-drawn');
      else {
        if (ctx.selfDrawn) add('tw-self-drawn');
        if (closed) add('tw-concealed');
      }
      if (allMelded) add('tw-all-melded');
      if (oneWait) add('tw-one-wait');
    }
    // All chows: five runs and a suit pair, no flowers, won on a discard, not on a one-tile wait.
    if (standard && chows.length === 5 && pair !== null && isSuited(pair) && ctx.bonus.length === 0 && !ctx.selfDrawn && !oneWait) add('tw-all-chows');
    if (ctx.selfDrawn && ctx.lastTile) add('tw-last-tile');
    if (!ctx.selfDrawn && ctx.lastDiscard) add('tw-last-discard');
    if (ctx.selfDrawn && ctx.kongs > 0) add('tw-kong-replacement');
    if (ctx.robbed) add('tw-robbing-kong');
    flowerLines(ctx, add);
  }
  // The dealer's tai, when the dealer wins (a dealer who pays adds them to its payment instead).
  if (ctx.dealer) {
    add('tw-dealer');
    add('tw-streak', ctx.counter ?? 0);
  }
  const total = lines.reduce((sum, l) => sum + l.value, 0);
  return { lines, raw: total, total, limit: false, unit: 'tai', base: total };
}

/** The best score of a complete hand (or a flower win), whatever the minimum; null when it is neither. */
export function twScoreAny(ctx: WinContext, o: StyleOptions): HandScore | null {
  if (ctx.flowerWin) return scoreReading(null, ctx, o, () => false);
  const r = rules(o);
  let waits: Kind[] | null = null;
  const uniqueWait = () => {
    if (waits === null) {
      const before = countsOfKinds(ctx.concealed);
      before[ctx.tile] = (before[ctx.tile] ?? 0) - 1;
      waits = waitsOf(before, ctx.melds.length, r.shapes, 5);
    }
    return waits.length === 1;
  };
  let best: HandScore | null = null;
  for (const shape of winShapes(ctx, r.shapes, 5)) {
    const s = scoreReading(shape, ctx, o, uniqueWait);
    if (!best || s.total > best.total || (s.total === best.total && s.lines.length < best.lines.length)) best = s;
  }
  return best;
}

function score(ctx: WinContext, o: StyleOptions): HandScore | null {
  const best = twScoreAny(ctx, o);
  if (!best || best.total < num(o, 'minTai')) return null;
  return best;
}

/**
 * Each payer pays the base and the stake for each tai: the discarder alone on a discard, the three
 * others on a self-draw. A dealer who pays a non-dealer's win adds 1 + 2 × streak tai.
 */
function settle(hand: SettleInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(hand.seats).fill(0);
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  const base = num(o, 'base');
  const perTai = num(o, 'perTai');
  for (const w of hand.wins) {
    const payers = w.from === null ? [0, 1, 2, 3].filter((s) => s < hand.seats && s !== w.seat) : [w.from];
    for (const p of payers) {
      const extra = p === hand.dealer && w.seat !== hand.dealer ? dealerTai(hand.counter ?? 0) : 0;
      pay(p, w.seat, base + perTai * (w.score.total + extra));
    }
  }
  return deltas;
}

function dealerKeeps(hand: HandEnd, o: StyleOptions): boolean {
  if (hand.winners.includes(hand.dealer)) return true;
  return hand.drawn && o.dealerKeeps !== 'win';
}

function hints(seat: { readonly seatWind: number; readonly prevailingWind: number; readonly bonus: readonly Kind[] }, o: StyleOptions): ValueHints {
  const pung = new Array<number>(34).fill(0);
  for (let k = WHITE; k <= WHITE + 2; k++) pung[k] = twTai('tw-dragon-pung');
  pung[WIND_EAST + seat.seatWind] = (pung[WIND_EAST + seat.seatWind] ?? 0) + twTai('tw-seat-wind');
  pung[WIND_EAST + seat.prevailingWind] = (pung[WIND_EAST + seat.prevailingWind] ?? 0) + twTai('tw-round-wind');
  let bonus = 0;
  flowerLines({ bonus: seat.bonus, seatWind: seat.seatWind } as WinContext, (id) => (bonus += twTai(id, o)));
  const limit = 32;
  // Payments are the base and a stake per tai: in tai, the base is worth base / perTai of them.
  const baseTai = num(o, 'base') / num(o, 'perTai');
  return {
    minimum: num(o, 'minTai'),
    pung,
    mixedSuit: twTai('tw-half-flush'),
    pureSuit: twTai('tw-full-flush'),
    allPungs: twTai('tw-all-pungs'),
    allChows: twTai('tw-all-chows'),
    concealed: twTai('tw-concealed'),
    selfDrawn: twTai('tw-self-drawn'),
    bonus,
    limit,
    points: Array.from({ length: limit + 1 }, (_, v) => baseTai + v),
    // A self-draw: each of three pays; a discard: the discarder pays it all.
    pay: { selfDrawn: 1, discarder: 1, others: 0 },
    // The feeder pays the whole hand, as at Riichi.
    riskScale: 0.3,
  };
}

export const taiwanese: Style = {
  id: 'taiwanese',
  hints,
  options: TW_OPTIONS,
  defaults: TW_DEFAULTS,
  presets: TW_PRESETS,
  rules,
  score,
  scoreAny: twScoreAny,
  settle,
  dealerKeeps,
  nextCounter: (hand, counter, o) => (dealerKeeps(hand, o) ? counter + 1 : 0),
};
