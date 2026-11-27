/**
 * Riichi (Japanese) mahjong: the second rules file on the shared engine
 * (docs/rules/mahjong-riichi.md). 136 tiles with red fives, riichi with a stake, furiten, dora
 * indicators with ura and kong dora, yaku required to win, han and fu, the payment table with
 * counters (honba) and riichi sticks, an East-South game with repeats, drawn-hand payments,
 * nagashi mangan and abortive draws. Every rule that tables disagree on is an option.
 */
import type { Seat } from '../../../core/contract';
import type { HandSet, WinShape } from '../core/arrange';
import { allKinds, winShapes } from '../core/arrange';
import type { DrawInput, GameStanding, HandEnd, HandScore, OptionSpec, ScoreLine, SettleInput, Style, StyleOptions, StyleRules, ValueHints, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { GREEN, isDragon, isHonour, isSuited, isTerminal, isTerminalOrHonour, isWind, kindOf, rankOf, RED, suitOf, WHITE, WIND_EAST } from '../core/tiles';

export const RIICHI_OPTIONS: readonly OptionSpec[] = [
  { key: 'red', values: [3, 0] },
  { key: 'openTanyao', values: ['on', 'off'] },
  { key: 'start', values: [25000, 30000] },
  { key: 'length', values: ['east-south', 'east', 'hand'] },
  { key: 'extension', values: ['west', 'off'] },
  { key: 'bust', values: ['on', 'off'] },
  { key: 'multipleRon', values: ['double', 'head-bump', 'triple'] },
  { key: 'aborts', values: ['on', 'off'] },
  { key: 'nagashi', values: ['on', 'off'] },
  { key: 'kiriage', values: ['off', 'on'] },
  { key: 'kazoe', values: ['yakuman', 'sanbaiman'] },
  { key: 'doubleYakuman', values: ['on', 'off'] },
  { key: 'kuikae', values: ['forbidden', 'allowed'] },
  { key: 'agariYame', values: ['on', 'off'] },
  { key: 'tenpaiRenchan', values: ['on', 'off'] },
  { key: 'kanDora', values: ['late', 'immediate'] },
  { key: 'ura', values: ['on', 'off'] },
  { key: 'ippatsu', values: ['on', 'off'] },
  { key: 'doubleWindFu', values: [4, 2] },
];

export const RIICHI_DEFAULTS: StyleOptions = Object.fromEntries(RIICHI_OPTIONS.map((o) => [o.key, o.values[0] as string | number]));

export const RIICHI_PRESETS: readonly { readonly id: string; readonly options: StyleOptions }[] = [
  { id: 'riichi-online', options: RIICHI_DEFAULTS },
  { id: 'riichi-east', options: { ...RIICHI_DEFAULTS, length: 'east' } },
  { id: 'riichi-classic', options: { ...RIICHI_DEFAULTS, red: 0, openTanyao: 'off', doubleYakuman: 'off', kiriage: 'on' } },
  { id: 'riichi-hand', options: { ...RIICHI_DEFAULTS, length: 'hand' } },
];

/** Points a winner needs (the "return") before an extended game may end. */
export const RIICHI_TARGET = 30000;
/** Each counter on the table adds this to a win. */
export const COUNTER_VALUE = 300;
/** The stake a riichi puts on the table, and the payment pool at an exhaustive draw. */
export const STAKE = 1000;
export const NOTEN_POOL = 3000;

const on = (o: StyleOptions, key: string): boolean => (o[key] ?? RIICHI_DEFAULTS[key]) === 'on';
const num = (o: StyleOptions, key: string): number => {
  const v = o[key];
  return typeof v === 'number' ? v : Number(RIICHI_DEFAULTS[key]);
};

const ROUNDS: Readonly<Record<string, number>> = { hand: 0, east: 1, 'east-south': 2 };

function rules(o: StyleOptions): StyleRules {
  const ron = String(o.multipleRon ?? 'double');
  return {
    tiles: { honours: true, bonus: false, jokers: 0, red: num(o, 'red') > 0 ? 1 : 0 },
    handSize: 13,
    // Four replacement tiles; the ten indicator tiles are set aside separately.
    deadWall: 4,
    replaceBonus: false,
    calls: {
      chow: true,
      pung: true,
      kong: true,
      concealedKong: true,
      addedKong: true,
      robKong: true,
      robConcealedWithOrphans: true,
      multipleWinners: ron !== 'head-bump',
      ...(ron === 'double' ? { maxWinners: 2 } : {}),
      furiten: true,
      noSwapCall: o.kuikae !== 'allowed',
    },
    shapes: { sevenPairs: true, thirteenOrphans: true },
    rounds: ROUNDS[String(o.length)] ?? 2,
    handsPerRound: 24,
    indicators: 5,
    kongIndicator: o.kanDora === 'immediate' ? 'immediate' : 'late',
    startScore: num(o, 'start'),
    ready: { stake: STAKE, minScore: STAKE, minLeft: 4 },
    ...(on(o, 'aborts') ? { aborts: { nineTerminals: true, fourWinds: true, fourReady: true, fourKongs: true } } : {}),
  };
}

// Dora

/** The dora an indicator points to: the next tile of its suit (9 to 1), wind (North to East) or dragon. */
export function doraOf(indicator: Kind): Kind {
  if (isSuited(indicator)) return suitOf(indicator) * 9 + (rankOf(indicator) % 9);
  if (isWind(indicator)) return WIND_EAST + ((indicator - WIND_EAST + 1) % 4);
  return WHITE + ((indicator - WHITE + 1) % 3);
}

/** A red five: copy 0 of a 5. */
export const isRed = (id: string): boolean => {
  const k = kindOf(id);
  return k < 27 && k % 9 === 4 && id.endsWith('.0');
};

// Readings

const isPungLike = (s: HandSet) => s.type === 'pung' || s.type === 'kong';
const GREENS: ReadonlySet<Kind> = new Set([19, 20, 21, 23, 25, GREEN]);

interface Reading {
  readonly shape: WinShape;
  readonly kinds: readonly Kind[];
  readonly closed: boolean;
  readonly pungs: readonly HandSet[];
  readonly chows: readonly HandSet[];
}

/** The kinds in a set. */
const setKinds = (s: HandSet): Kind[] => (s.type === 'chow' ? [s.kind, s.kind + 1, s.kind + 2] : [s.kind]);

function readingOf(shape: WinShape, ctx: WinContext): Reading {
  return {
    shape,
    kinds: allKinds(ctx),
    closed: ctx.melds.every((m) => m.concealed),
    pungs: shape.sets.filter(isPungLike),
    chows: shape.sets.filter((s) => s.type === 'chow'),
  };
}

/** The wait the winning tile completed in a reading: two-sided, closed, edge, pair or a pung. */
export function waitKind(shape: WinShape, tile: Kind): 'ryanmen' | 'kanchan' | 'penchan' | 'tanki' | 'shanpon' | 'special' {
  if (shape.shape !== 'standard') return 'special';
  if (shape.winIn === -1) return 'tanki';
  const set = shape.sets[shape.winIn];
  if (!set || set.type !== 'chow') return 'shanpon';
  if (tile === set.kind + 1) return 'kanchan';
  if ((tile === set.kind + 2 && rankOf(set.kind) === 1) || (tile === set.kind && rankOf(set.kind) === 7)) return 'penchan';
  return 'ryanmen';
}

// Limit hands (yakuman)

function yakuman(r: Reading, ctx: WinContext, o: StyleOptions): ScoreLine[] {
  const out: ScoreLine[] = [];
  const double = on(o, 'doubleYakuman') ? 2 : 1;
  const { shape } = r;
  const counts = new Array<number>(34).fill(0);
  for (const k of ctx.concealed) counts[k] = (counts[k] ?? 0) + 1;
  if (shape.shape === 'thirteen-orphans') {
    // The thirteen-way wait: the winning tile made the pair.
    out.push((counts[ctx.tile] ?? 0) === 2 ? { id: 'kokushi-13', value: double } : { id: 'kokushi', value: 1 });
  }
  if (shape.shape === 'standard') {
    const concealedPungs = r.pungs.filter((s) => s.concealed).length;
    if (concealedPungs === 4) out.push(shape.winIn === -1 ? { id: 'suuankou-tanki', value: double } : { id: 'suuankou', value: 1 });
    const dragons = r.pungs.filter((s) => isDragon(s.kind)).length;
    if (dragons === 3) out.push({ id: 'daisangen', value: 1 });
    const winds = r.pungs.filter((s) => isWind(s.kind)).length;
    if (winds === 4) out.push({ id: 'daisuushii', value: double });
    else if (winds === 3 && shape.pair !== null && isWind(shape.pair)) out.push({ id: 'shousuushii', value: 1 });
    if (r.pungs.filter((s) => s.type === 'kong').length === 4) out.push({ id: 'suukantsu', value: 1 });
  }
  if (r.kinds.every(isHonour)) out.push({ id: 'tsuuiisou', value: 1 });
  if (r.kinds.every(isTerminal)) out.push({ id: 'chinroutou', value: 1 });
  if (r.kinds.every((k) => GREENS.has(k))) out.push({ id: 'ryuuiisou', value: 1 });
  // Nine gates: closed, one suit, 1112345678999 plus one.
  if (r.closed && ctx.melds.length === 0 && ctx.concealed.length === 14) {
    const suit = suitOf(ctx.concealed[0] ?? 99);
    if (suit < 3 && ctx.concealed.every((k) => suitOf(k) === suit)) {
      const c = Array.from({ length: 9 }, (_, i) => counts[suit * 9 + i] ?? 0);
      const base = [3, 1, 1, 1, 1, 1, 1, 1, 3];
      if (c.every((n, i) => n >= (base[i] ?? 0))) {
        const before = [...c];
        before[rankOf(ctx.tile) - 1] = (before[rankOf(ctx.tile) - 1] ?? 0) - 1;
        out.push(before.every((n, i) => n === base[i]) ? { id: 'chuuren-pure', value: double } : { id: 'chuuren', value: 1 });
      }
    }
  }
  if (ctx.heavenly) out.push({ id: 'tenhou', value: 1 });
  if (ctx.firstDraw) out.push({ id: 'chiihou', value: 1 });
  return out;
}

// Regular yaku

/** Each regular yaku's han: closed, then open (0 where it needs a closed hand). Lessons quote this table. */
export const YAKU_HAN: Readonly<Record<string, readonly [number, number]>> = {
  riichi: [1, 0],
  'double-riichi': [2, 0],
  ippatsu: [1, 0],
  'menzen-tsumo': [1, 0],
  haitei: [1, 1],
  houtei: [1, 1],
  rinshan: [1, 1],
  chankan: [1, 1],
  pinfu: [1, 0],
  tanyao: [1, 1],
  chiitoitsu: [2, 0],
  ryanpeikou: [3, 0],
  iipeikou: [1, 0],
  'yakuhai-white': [1, 1],
  'yakuhai-green': [1, 1],
  'yakuhai-red': [1, 1],
  'seat-wind': [1, 1],
  'prevailing-wind': [1, 1],
  ittsu: [2, 1],
  sanshoku: [2, 1],
  'sanshoku-pungs': [2, 2],
  sankantsu: [2, 2],
  toitoi: [2, 2],
  sanankou: [2, 2],
  shousangen: [2, 2],
  junchan: [3, 2],
  chanta: [2, 1],
  honroutou: [2, 2],
  chinitsu: [6, 5],
  honitsu: [3, 2],
};

/** The fu a hand's parts add (docs/rules/mahjong-riichi.md, "Fu"). Lessons quote this table. */
export const FU = {
  base: 20,
  closedRon: 10,
  selfDrawn: 2,
  /** A pung of simples in the open; terminals and honours double it, concealed doubles it, a kong is four times. */
  pung: 2,
  valuePair: 2,
  wait: 2,
  sevenPairs: 25,
  openMinimum: 30,
  pinfuSelfDrawn: 20,
  pinfuRon: 30,
} as const;

function regularYaku(r: Reading, ctx: WinContext, o: StyleOptions): ScoreLine[] {
  const lines: ScoreLine[] = [];
  const add = (id: string) => {
    const [closedHan, openHan] = YAKU_HAN[id] ?? [0, 0];
    const han = r.closed ? closedHan : openHan;
    if (han > 0) lines.push({ id, value: han });
  };
  const { shape } = r;
  const standard = shape.shape === 'standard';
  const seatWind = WIND_EAST + ctx.seatWind;
  const roundWind = WIND_EAST + ctx.prevailingWind;
  const isValue = (k: Kind) => isDragon(k) || k === seatWind || k === roundWind;

  // Riichi and how the hand was won.
  if ((ctx.ready ?? 0) === 2) add('double-riichi');
  else if ((ctx.ready ?? 0) === 1) add('riichi');
  if ((ctx.ready ?? 0) > 0 && ctx.oneShot && on(o, 'ippatsu')) add('ippatsu');
  if (ctx.selfDrawn) add('menzen-tsumo');
  if (ctx.selfDrawn && ctx.lastTile && ctx.kongs === 0) add('haitei');
  if (!ctx.selfDrawn && ctx.lastDiscard) add('houtei');
  if (ctx.selfDrawn && ctx.kongs > 0) add('rinshan');
  if (ctx.robbed) add('chankan');

  // The hand's shape.
  const pinfu = standard && r.closed && r.chows.length === 4 && shape.pair !== null && !isValue(shape.pair) && waitKind(shape, ctx.tile) === 'ryanmen';
  if (pinfu) add('pinfu');
  if (r.kinds.every((k) => !isTerminalOrHonour(k)) && (r.closed || on(o, 'openTanyao'))) add('tanyao');
  if (shape.shape === 'seven-pairs') add('chiitoitsu');
  if (standard) {
    const chowKinds = r.chows.map((s) => s.kind).sort((a, b) => a - b);
    const twins = new Map<Kind, number>();
    for (const k of chowKinds) twins.set(k, (twins.get(k) ?? 0) + 1);
    const pairsOfRuns = [...twins.values()].reduce((n, c) => n + Math.floor(c / 2), 0);
    if (pairsOfRuns === 2) add('ryanpeikou');
    else if (pairsOfRuns === 1) add('iipeikou');
    // Value pungs.
    for (const s of r.pungs) {
      if (s.kind === WHITE) add('yakuhai-white');
      if (s.kind === GREEN) add('yakuhai-green');
      if (s.kind === RED) add('yakuhai-red');
      if (s.kind === seatWind) add('seat-wind');
      if (s.kind === roundWind) add('prevailing-wind');
    }
    // Straights and three-colour sets.
    for (let suit = 0; suit < 3; suit++) {
      const b = suit * 9;
      if (chowKinds.includes(b) && chowKinds.includes(b + 3) && chowKinds.includes(b + 6)) {
        add('ittsu');
        break;
      }
    }
    for (let rank = 0; rank < 7; rank++) {
      if ([0, 1, 2].every((suit) => chowKinds.includes(suit * 9 + rank))) {
        add('sanshoku');
        break;
      }
    }
    const pungKinds = r.pungs.map((s) => s.kind);
    for (let rank = 0; rank < 9; rank++) {
      if ([0, 1, 2].every((suit) => pungKinds.includes(suit * 9 + rank))) {
        add('sanshoku-pungs');
        break;
      }
    }
    if (r.pungs.filter((s) => s.type === 'kong').length === 3) add('sankantsu');
    if (r.pungs.length === 4) add('toitoi');
    if (r.pungs.filter((s) => s.concealed).length === 3) add('sanankou');
    const dragons = r.pungs.filter((s) => isDragon(s.kind)).length;
    if (dragons === 2 && shape.pair !== null && isDragon(shape.pair)) add('shousangen');
    // Terminals in every set and the pair, with at least one run.
    const groups: Kind[][] = [...shape.sets.map(setKinds), shape.pair === null ? [] : [shape.pair]];
    const everyHas = (test: (k: Kind) => boolean) => groups.every((g) => g.some(test));
    if (r.chows.length > 0 && everyHas(isTerminal)) add('junchan');
    else if (r.chows.length > 0 && everyHas(isTerminalOrHonour)) add('chanta');
  }
  if (r.kinds.every(isTerminalOrHonour) && !r.kinds.every(isHonour) && !r.kinds.every(isTerminal)) add('honroutou');
  // One suit.
  const suits = new Set(r.kinds.filter(isSuited).map(suitOf));
  const honours = r.kinds.some(isHonour);
  if (suits.size === 1 && !honours) add('chinitsu');
  else if (suits.size === 1 && honours) add('honitsu');
  return lines;
}

// Fu

function fuOf(r: Reading, ctx: WinContext, o: StyleOptions, pinfu: boolean): number {
  const { shape } = r;
  if (shape.shape === 'seven-pairs') return FU.sevenPairs;
  if (shape.shape !== 'standard') return FU.openMinimum;
  if (pinfu) return ctx.selfDrawn ? FU.pinfuSelfDrawn : FU.pinfuRon;
  let fu: number = FU.base;
  if (r.closed && !ctx.selfDrawn) fu += FU.closedRon;
  if (ctx.selfDrawn) fu += FU.selfDrawn;
  for (const s of shape.sets) {
    if (!isPungLike(s)) continue;
    let f = isTerminalOrHonour(s.kind) ? FU.pung * 2 : FU.pung;
    if (s.concealed) f *= 2;
    if (s.type === 'kong') f *= 4;
    fu += f;
  }
  const pair = shape.pair;
  if (pair !== null) {
    const seatWind = WIND_EAST + ctx.seatWind;
    const roundWind = WIND_EAST + ctx.prevailingWind;
    if (isDragon(pair)) fu += FU.valuePair;
    if (pair === seatWind && pair === roundWind) fu += num(o, 'doubleWindFu');
    else if (pair === seatWind || pair === roundWind) fu += FU.valuePair;
  }
  const wait = waitKind(shape, ctx.tile);
  if (wait === 'kanchan' || wait === 'penchan' || wait === 'tanki') fu += FU.wait;
  fu = Math.ceil(fu / 10) * 10;
  if (!r.closed && fu === FU.base) fu = FU.openMinimum;
  return fu;
}

// Points

const BANDS: readonly { readonly han: number; readonly base: number; readonly name: string }[] = [
  { han: 13, base: 8000, name: 'kazoe' },
  { han: 11, base: 6000, name: 'sanbaiman' },
  { han: 8, base: 4000, name: 'baiman' },
  { han: 6, base: 3000, name: 'haneman' },
  { han: 5, base: 2000, name: 'mangan' },
];

/** Base points for han and fu under the options: the doubling rule, then the bands above mangan. */
export function basePoints(han: number, fu: number, o: StyleOptions = RIICHI_DEFAULTS): { base: number; band: string | undefined } {
  for (const b of BANDS) {
    if (han >= b.han) {
      if (b.name === 'kazoe' && o.kazoe === 'sanbaiman') return { base: 6000, band: 'sanbaiman' };
      return { base: b.base, band: b.name };
    }
  }
  const raw = fu * 2 ** (han + 2);
  if (raw >= 2000) return { base: 2000, band: 'mangan' };
  if (on(o, 'kiriage') && ((han === 4 && fu === 30) || (han === 3 && fu === 60))) return { base: 2000, band: 'mangan' };
  return { base: raw, band: undefined };
}

export const ceil100 = (n: number): number => Math.ceil(n / 100) * 100;

/** What a win collects before counters and stakes: on a discard, and on a self-draw from the dealer and from each other player. */
export function payments(base: number, dealer: boolean): { ron: number; tsumoDealer: number; tsumoOther: number } {
  if (dealer) return { ron: ceil100(base * 6), tsumoDealer: 0, tsumoOther: ceil100(base * 2) };
  return { ron: ceil100(base * 4), tsumoDealer: ceil100(base * 2), tsumoOther: ceil100(base) };
}

function doraLines(ctx: WinContext, o: StyleOptions): ScoreLine[] {
  const lines: ScoreLine[] = [];
  const kinds = allKinds(ctx);
  // Each concealed or melded tile, by kind; a kong's four count.
  const count = (dora: Kind) => kinds.filter((k) => k === dora).length;
  let dora = 0;
  for (const ind of ctx.indicators ?? []) dora += count(doraOf(ind));
  if (dora > 0) lines.push({ id: 'dora', value: dora, ...(dora > 1 ? { times: dora } : {}) });
  if (num(o, 'red') > 0) {
    const red = (ctx.tiles ?? []).filter(isRed).length;
    if (red > 0) lines.push({ id: 'aka-dora', value: red, ...(red > 1 ? { times: red } : {}) });
  }
  if ((ctx.ready ?? 0) > 0 && on(o, 'ura')) {
    let ura = 0;
    for (const ind of ctx.underIndicators ?? []) ura += count(doraOf(ind));
    if (ura > 0) lines.push({ id: 'ura-dora', value: ura, ...(ura > 1 ? { times: ura } : {}) });
  }
  return lines;
}

interface Scored {
  readonly score: HandScore;
  /** At least one yaku (dora are not yaku). */
  readonly yaku: boolean;
}

function scoreReading(shape: WinShape, ctx: WinContext, o: StyleOptions): Scored {
  const r = readingOf(shape, ctx);
  const limits = yakuman(r, ctx, o);
  if (limits.length > 0) {
    const multiple = limits.reduce((n, l) => n + l.value, 0);
    return {
      yaku: true,
      score: { lines: limits, raw: 13 * multiple, total: 13 * multiple, limit: true, unit: 'han', base: 8000 * multiple, yakuman: multiple, band: multiple > 1 ? 'double-yakuman' : 'yakuman' },
    };
  }
  const yaku = regularYaku(r, ctx, o);
  const pinfu = yaku.some((l) => l.id === 'pinfu');
  const fu = fuOf(r, ctx, o, pinfu);
  const lines = yaku.length > 0 ? [...yaku, ...doraLines(ctx, o)] : [];
  const han = lines.reduce((n, l) => n + l.value, 0);
  const { base, band } = han > 0 ? basePoints(han, fu, o) : { base: 0, band: undefined };
  return { yaku: yaku.length > 0, score: { lines, raw: han, total: han, limit: band !== undefined, unit: 'han', base, fu, ...(band ? { band } : {}) } };
}

function better(a: Scored, b: Scored | null): boolean {
  if (!b) return true;
  if (a.yaku !== b.yaku) return a.yaku;
  if (a.score.base !== b.score.base) return a.score.base > b.score.base;
  if (a.score.total !== b.score.total) return a.score.total > b.score.total;
  return (a.score.fu ?? 0) > (b.score.fu ?? 0);
}

/** The best score of a complete hand, with or without a yaku (null when it is not complete). */
export function riichiScoreAny(ctx: WinContext, o: StyleOptions): HandScore | null {
  const best = bestReading(ctx, o);
  return best ? best.score : null;
}

function bestReading(ctx: WinContext, o: StyleOptions): Scored | null {
  const shapes = rules(o).shapes;
  let best: Scored | null = null;
  for (const shape of winShapes(ctx, shapes, 4)) {
    const s = scoreReading(shape, ctx, o);
    if (better(s, best)) best = s;
  }
  return best;
}

/** The hand's score, or null when it has no yaku. */
function score(ctx: WinContext, o: StyleOptions): HandScore | null {
  const best = bestReading(ctx, o);
  return best && best.yaku ? best.score : null;
}

function settle(hand: SettleInput, o: StyleOptions): number[] {
  void o;
  const deltas = new Array<number>(hand.seats).fill(0);
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  const counter = hand.counter ?? 0;
  hand.wins.forEach((w, i) => {
    // Counters and stakes go to the first winner in turn after the thrower.
    const c = i === 0 ? counter : 0;
    const dealer = w.seat === hand.dealer;
    const p = payments(w.score.base, dealer);
    if (w.from === null) {
      for (let s = 0; s < hand.seats; s++) {
        if (s === w.seat) continue;
        pay(s, w.seat, (s === hand.dealer ? p.tsumoDealer : p.tsumoOther) + (c * COUNTER_VALUE) / (hand.seats - 1));
      }
    } else pay(w.from, w.seat, p.ron + c * COUNTER_VALUE);
    if (i === 0 && (hand.stakes ?? 0) > 0) deltas[w.seat] = (deltas[w.seat] ?? 0) + (hand.stakes ?? 0) * STAKE;
  });
  return deltas;
}

function settleDraw(hand: DrawInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(hand.seats).fill(0);
  if (hand.reason !== 'exhausted') return deltas;
  if (on(o, 'nagashi') && hand.allTerminalDiscards.length > 0) {
    // Paid as a self-drawn mangan, for each player who made it.
    for (const seat of hand.allTerminalDiscards) {
      const p = payments(2000, seat === hand.dealer);
      for (let s = 0; s < hand.seats; s++) {
        if (s === seat) continue;
        const amount = s === hand.dealer ? p.tsumoDealer : p.tsumoOther;
        deltas[s] = (deltas[s] ?? 0) - amount;
        deltas[seat] = (deltas[seat] ?? 0) + amount;
      }
    }
    return deltas;
  }
  const ready = hand.ready.filter(Boolean).length;
  if (ready === 0 || ready === hand.seats) return deltas;
  hand.ready.forEach((r, s) => (deltas[s] = r ? NOTEN_POOL / ready : -NOTEN_POOL / (hand.seats - ready)));
  return deltas;
}

function dealerKeeps(hand: HandEnd, o: StyleOptions): boolean {
  if (hand.winners.includes(hand.dealer)) return true;
  if (!hand.drawn) return false;
  if (hand.abortive) return true;
  return on(o, 'tenpaiRenchan') && (hand.ready?.[hand.dealer] ?? false);
}

function nextCounter(hand: HandEnd, counter: number): number {
  if (hand.winners.length > 0 && !hand.winners.includes(hand.dealer)) return 0;
  return counter + 1;
}

function gameOver(st: GameStanding, o: StyleOptions): boolean | null {
  if (on(o, 'bust') && st.scores.some((x) => x < 0)) return true;
  const top = Math.max(...st.scores);
  const extension = o.extension !== 'off';
  if (st.round >= st.rounds) {
    // The extension: the first hand that ends with someone at the target ends it, or its round's end.
    return top >= RIICHI_TARGET || st.nextRound > st.rounds;
  }
  const allLast = st.round === st.rounds - 1 && st.passes === 3;
  if (allLast && st.dealerKeeps && on(o, 'agariYame') && (st.scores[st.dealer] ?? 0) === top && (!extension || top >= RIICHI_TARGET)) return true;
  if (st.nextRound >= st.rounds) return !(extension && top < RIICHI_TARGET);
  return false;
}

/**
 * Base points at about 30 fu for each han, as the CPU's rough guide to value, in hundreds: the
 * CPU weighs expected points against its rules of thumb on the scale of the Hong Kong table (a few
 * points to a hundred or so), so the same weights serve both styles.
 */
function guidePoints(o: StyleOptions): number[] {
  return Array.from({ length: 14 }, (_, han) => (han === 0 ? 0 : basePoints(han, 30, o).base / 100));
}

function hints(seat: { readonly seatWind: number; readonly prevailingWind: number; readonly bonus: readonly Kind[]; readonly indicators?: readonly Kind[] }, o: StyleOptions): ValueHints {
  const pung = new Array<number>(34).fill(0);
  for (let k = WHITE; k <= RED; k++) pung[k] = 1;
  pung[WIND_EAST + seat.seatWind] = (pung[WIND_EAST + seat.seatWind] ?? 0) + 1;
  pung[WIND_EAST + seat.prevailingWind] = (pung[WIND_EAST + seat.prevailingWind] ?? 0) + 1;
  return {
    minimum: 1,
    pung,
    mixedSuit: 2.5,
    pureSuit: 5.5,
    allPungs: 2,
    allChows: 1,
    concealed: 1,
    selfDrawn: 1,
    bonus: 0,
    limit: 13,
    points: guidePoints(o),
    // A self-draw: about four bases shared by three players; a discard: four bases from the thrower.
    pay: { selfDrawn: 4 / 3, discarder: 4, others: 0 },
    allSimples: 1,
    allSimplesOpen: on(o, 'openTanyao') ? 1 : 0,
    readyDeclaration: 1,
    bonusKinds: (seat.indicators ?? []).map(doraOf),
    // The feeder pays the whole hand: a third of the Hong Kong weight on that cost measured best (PROGRESS-M11.md).
    riskScale: 0.3,
  };
}

export const riichi: Style = {
  id: 'riichi',
  hints,
  options: RIICHI_OPTIONS,
  defaults: RIICHI_DEFAULTS,
  presets: RIICHI_PRESETS,
  rules,
  score,
  scoreAny: riichiScoreAny,
  settle,
  settleDraw,
  dealerKeeps,
  nextCounter,
  gameOver,
};
