/**
 * How a seat sees its chances (PLAN.md 2.4), shared by the CPU, the coach and the review: tiles
 * from ready and useful tiles for every discard, the value a hand is heading for, what a ready
 * hand can win, and how dangerous each tile is to throw. Everything works from a view and reads
 * the style through its rules and value hints, so it serves every style.
 */
import type { Seat } from '../../core/contract';
import { isWinningShape, waitsOf } from './core/shapes';
import type { ShantenRules } from './core/shanten';
import { acceptance, shanten } from './core/shanten';
import type { HandScore, Meld, StyleRules, ValueHints, WinContext } from './core/style';
import type { Kind, TileId } from './core/tiles';
import { countsOf, isHonour, isSuited, kindOf, PLAYING_KINDS, rankOf, suitOf } from './core/tiles';
import { seatWind, setsIn } from './core/engine';
import type { MahjongView } from './rules';
import { engine } from './rules';

export interface SeatPicture {
  readonly view: MahjongView;
  readonly seat: Seat;
  readonly rules: StyleRules;
  readonly shapes: ShantenRules;
  readonly hints: ValueHints;
  /** The seat's concealed tiles, by kind. */
  readonly counts: readonly number[];
  readonly melds: readonly Meld[];
  /** No exposed sets (concealed kongs allowed). */
  readonly concealed: boolean;
  /** Copies of each kind this seat has not seen. */
  readonly unseen: readonly number[];
}

/** Copies of each kind a seat can see: its hand, every meld and every discard still lying. */
export function visibleCounts(v: Pick<MahjongView, 'hand' | 'melds' | 'discards'>): number[] {
  const ids: TileId[] = [...v.hand, ...v.melds.flatMap((list) => list.flatMap((m) => m.tiles)), ...v.discards.flatMap((list) => list.filter((d) => !d.claimed).map((d) => d.tile))];
  return countsOf(ids);
}

export function picture(view: MahjongView): SeatPicture {
  const rules = engine.rules(view.config);
  const style = engine.style(view.config);
  const seat = view.seat;
  const melds = view.melds[seat] ?? [];
  const seen = visibleCounts(view);
  return {
    view,
    seat,
    rules,
    shapes: { shapes: rules.shapes, sets: setsIn(rules) },
    hints: style.hints({ seatWind: seatWind(seat, view.dealer), prevailingWind: view.round % 4, bonus: (view.bonus[seat] ?? []).map(kindOf) }, view.config.options),
    counts: countsOf(view.hand),
    melds,
    concealed: melds.every((m) => m.concealed),
    unseen: seen.map((n) => Math.max(0, 4 - n)),
  };
}

// Value

/**
 * The value a hand is heading for, in the style's unit: what it holds now, and half-made patterns
 * at a discount. A rough guide for steering, never a score.
 */
export function valueEstimate(p: SeatPicture, counts: readonly number[], melds: readonly Meld[], concealed: boolean): number {
  const h = p.hints;
  let v = h.bonus + (concealed ? h.concealed : 0) + h.selfDrawn * 0.3;
  const meldKinds = new Map<Kind, number>();
  let chowMelds = 0;
  const suited = [0, 0, 0];
  let honours = 0;
  for (const m of melds) {
    const k = kindOf(m.tiles[0] as TileId);
    if (m.type === 'chow') chowMelds++;
    else meldKinds.set(k, 3);
    for (const t of m.tiles) {
      const kk = kindOf(t);
      if (isSuited(kk)) suited[suitOf(kk)] = (suited[suitOf(kk)] ?? 0) + 1;
      else if (isHonour(kk)) honours++;
    }
  }
  let pairs = 0;
  for (let k = 0; k < PLAYING_KINDS; k++) {
    const n = (counts[k] ?? 0) + (meldKinds.get(k) ?? 0);
    const value = h.pung[k] ?? 0;
    if (n >= 3) {
      v += value;
      pairs++;
    } else if (n === 2) {
      v += value * 0.45;
      pairs++;
    }
    const c = counts[k] ?? 0;
    if (isSuited(k)) suited[suitOf(k)] = (suited[suitOf(k)] ?? 0) + c;
    else if (isHonour(k)) honours += c;
  }
  const total = (suited[0] ?? 0) + (suited[1] ?? 0) + (suited[2] ?? 0);
  const top = Math.max(...suited);
  const others = total - top;
  if (total > 0) {
    const full = honours > 0 ? h.mixedSuit : h.pureSuit;
    v += full * ([1, 0.45, 0.22, 0.08][others] ?? 0);
  }
  if (chowMelds === 0) v += h.allPungs * (pairs >= 5 ? 0.7 : pairs >= 4 ? 0.3 : 0);
  return Math.min(v, h.limit);
}

/** The context of a possible win, from a seat's own tiles (no special timing). */
export function possibleWin(p: SeatPicture, counts: readonly number[], tile: Kind, selfDrawn: boolean): WinContext {
  const concealed: Kind[] = [];
  counts.forEach((n, k) => {
    for (let i = 0; i < n; i++) concealed.push(k);
  });
  return {
    seat: p.seat,
    tile,
    selfDrawn,
    from: selfDrawn ? null : (p.seat + 1) % 4,
    concealed,
    melds: p.melds,
    bonus: (p.view.bonus[p.seat] ?? []).map(kindOf),
    seatWind: seatWind(p.seat, p.view.dealer),
    prevailingWind: p.view.round % 4,
    dealer: p.seat === p.view.dealer,
    lastTile: false,
    lastDiscard: false,
    kongs: 0,
    robbed: false,
    heavenly: false,
    earthly: false,
  };
}

export interface Wait {
  readonly kind: Kind;
  /** Copies not seen. */
  readonly left: number;
  /** The hand's value on a discard win and on a self-draw, or null when it may not win that way. */
  readonly ron: number | null;
  readonly tsumo: number | null;
}

export interface Ready {
  readonly waits: readonly Wait[];
  /** Copies left of the waits that can win at least one way. */
  readonly winnable: number;
  readonly best: number;
}

/** What a ready hand (3k+1 concealed tiles) can win, and how much. */
export function readyInfo(p: SeatPicture, counts: readonly number[], melds: readonly Meld[] = p.melds): Ready {
  const style = engine.style(p.view.config);
  const sets = setsIn(p.rules);
  const waits: Wait[] = [];
  const pp: SeatPicture = melds === p.melds ? p : { ...p, melds };
  for (const k of waitsOf(counts, melds.length, p.rules.shapes, sets)) {
    const c = [...counts];
    c[k] = (c[k] ?? 0) + 1;
    const score = (selfDrawn: boolean): number | null => {
      const s: HandScore | null = style.score(possibleWin(pp, c, k, selfDrawn), p.view.config.options);
      return s ? s.total : null;
    };
    waits.push({ kind: k, left: p.unseen[k] ?? 0, ron: score(false), tsumo: score(true) });
  }
  const winnable = waits.filter((w) => w.ron !== null || w.tsumo !== null).reduce((n, w) => n + w.left, 0);
  const best = Math.max(0, ...waits.map((w) => Math.max(w.ron ?? 0, w.tsumo ?? 0)));
  return { waits, winnable, best };
}

// Expected value

/** Base points for a value, which may be fractional; a hand short of the minimum is worth little. */
export function pointsFor(h: ValueHints, value: number): number {
  const at = (f: number) => h.points[Math.max(0, Math.min(h.limit, f))] ?? 1;
  if (value < h.minimum) return at(h.minimum) * 0.5 * Math.max(0.05, value / Math.max(1, h.minimum)) ** 2;
  const v = Math.min(value, h.limit);
  const lo = Math.floor(v);
  return at(lo) + (at(Math.ceil(v)) - at(lo)) * (v - lo);
}

/** What a win collects, in base points per base point of the hand: half self-drawn, half on a discard. */
export function winPayout(h: ValueHints): number {
  return 0.5 * 3 * h.pay.selfDrawn + 0.5 * (h.pay.discarder + 2 * h.pay.others);
}

/**
 * The chance to win within `turns`, starting `shanten` from ready with `accept` useful tiles now,
 * or `winnable` winning tiles when ready, out of `unseen` tiles. Each turn shows about two and a
 * half tiles a ready hand can win on (its draw and the discards it may call) and about one and a
 * half that can move it forward.
 */
export function winChance(shanten0: number, accept: number, winnable: number | null, unseen: number, turns: number): number {
  if (shanten0 < 0) return 1;
  const u = Math.max(12, unseen);
  const rate = (copies: number, looks: number) => 1 - (1 - Math.min(0.9, Math.max(0, copies) / u)) ** looks;
  const win = rate(winnable ?? 5, 2.4);
  let dist = new Array<number>(shanten0 + 1).fill(0);
  dist[shanten0] = 1;
  let won = 0;
  for (let t = 0; t < turns; t++) {
    const next = new Array<number>(shanten0 + 1).fill(0);
    for (let k = 0; k <= shanten0; k++) {
      const p = dist[k] ?? 0;
      if (p === 0) continue;
      if (k === 0) {
        won += p * win;
        next[0] = (next[0] ?? 0) + p * (1 - win);
      } else {
        const a = rate(k === shanten0 ? accept : Math.max(8, accept * 0.75), 1.4);
        next[k - 1] = (next[k - 1] ?? 0) + p * a;
        next[k] = (next[k] ?? 0) + p * (1 - a);
      }
    }
    dist = next;
  }
  return won;
}

/** How many turns a hand can count on: a quarter of the wall, but someone else usually wins within about eight. */
export let HORIZON = 8;
export function setHorizon(n: number): void {
  HORIZON = n;
}
export function turnsLeft(p: SeatPicture): number {
  return Math.max(1, Math.min(HORIZON, Math.floor((p.view.wall - p.rules.deadWall) / 4)));
}

/** The expected points of a hand: its chance to win times what a win would collect. */
export function expectedPoints(p: SeatPicture, e: Pick<DiscardEval, 'shanten' | 'accept' | 'value' | 'ready'>): number {
  const unseen = p.unseen.reduce((a, b) => a + b, 0);
  const turns = turnsLeft(p);
  let points: number;
  let chance: number;
  if (e.ready) {
    const live = e.ready.waits.filter((w) => w.left > 0 && (w.ron !== null || w.tsumo !== null));
    const copies = live.reduce((n, w) => n + w.left, 0);
    if (copies === 0) {
      // Ready but unable to win: as good as one step back.
      chance = winChance(1, Math.max(4, e.accept), null, unseen, turns);
      points = pointsFor(p.hints, e.value);
    } else {
      chance = winChance(0, 0, copies, unseen, turns);
      points = live.reduce((sum, w) => sum + w.left * 0.5 * (pointsFor(p.hints, w.ron ?? w.tsumo ?? 0) + pointsFor(p.hints, w.tsumo ?? w.ron ?? 0)), 0) / copies;
    }
  } else {
    chance = winChance(e.shanten, e.accept, null, unseen, turns);
    points = pointsFor(p.hints, e.value);
  }
  return chance * points * winPayout(p.hints);
}

/** What throwing a kind is expected to cost: each seat's readiness times the tile's danger times the extra a feeder pays. */
export function dealInCost(p: SeatPicture, kind: Kind, threats: Threats): number {
  const extra = Math.max(0.5, p.hints.pay.discarder - p.hints.pay.others);
  const typical = pointsFor(p.hints, p.hints.minimum + 1);
  let cost = 0;
  for (const t of threats) cost += t.level * 0.35 * tileDanger(p, kind, t) * extra * typical;
  return cost;
}

// Discards

export interface DiscardEval {
  readonly kind: Kind;
  readonly shanten: number;
  /** Unseen copies of the tiles that would bring the hand closer. */
  readonly accept: number;
  readonly useful: readonly Kind[];
  readonly value: number;
  /** For a ready hand: its waits and what they can win. */
  readonly ready: Ready | null;
  readonly danger: number;
}

/** Every discard from a hand of 3k+2 concealed tiles, judged on speed, value and danger. */
export function evaluateDiscards(p: SeatPicture, threat: Threats | null = null): DiscardEval[] {
  const out: DiscardEval[] = [];
  const c = [...p.counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) === 0) continue;
    c[k] = (c[k] ?? 0) - 1;
    const a = acceptance(c, p.melds.length, p.shapes, p.unseen);
    const ready = a.shanten === 0 ? readyInfo(p, c) : null;
    out.push({ kind: k, shanten: a.shanten, accept: a.count, useful: a.kinds, value: valueEstimate(p, c, p.melds, p.concealed), ready, danger: threat ? dangerOf(p, k, threat) : 0 });
    c[k] = (c[k] ?? 0) + 1;
  }
  return out;
}

/** The hand's shanten now (3k+2 tiles: after its best discard; 3k+1 tiles: as it is). */
export function handShanten(p: SeatPicture): number {
  const n = p.counts.reduce((a, b) => a + b, 0);
  if (n % 3 === 1) return shanten(p.counts, p.melds.length, p.shapes);
  if (isWinningShape(p.counts, p.melds.length, p.rules.shapes, setsIn(p.rules))) return -1;
  let best = 99;
  const c = [...p.counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) === 0) continue;
    c[k] = (c[k] ?? 0) - 1;
    best = Math.min(best, shanten(c, p.melds.length, p.shapes));
    c[k] = (c[k] ?? 0) + 1;
  }
  return best;
}

// Danger

export interface Threat {
  readonly seat: Seat;
  /** 0 (no sign of a ready hand) to 1 (surely ready). */
  readonly level: number;
  /** The suit their sets point to (a one-suit hand), or null. */
  readonly suit: number | null;
  /** Kinds they threw away. */
  readonly threw: ReadonlySet<Kind>;
}

export type Threats = readonly Threat[];

/** How likely each other seat is to be ready, from what everyone can see. */
export function readThreats(view: MahjongView): Threats {
  const out: Threat[] = [];
  for (let s = 0; s < 4; s++) {
    if (s === view.seat) continue;
    const melds = (view.melds[s] ?? []).filter((m) => !m.concealed);
    const kongs = (view.melds[s] ?? []).filter((m) => m.concealed).length;
    const thrown = (view.discards[s] ?? []).length;
    let level = [0.08, 0.22, 0.45, 0.75, 0.95][Math.min(4, melds.length)] ?? 0.95;
    level += thrown >= 14 ? 0.3 : thrown >= 10 ? 0.2 : thrown >= 7 ? 0.1 : 0;
    level += kongs * 0.05;
    let suit: number | null = null;
    if (melds.length >= 2) {
      const suits = new Set(melds.flatMap((m) => m.tiles.map(kindOf).filter(isSuited).map(suitOf)));
      if (suits.size === 1) suit = [...suits][0] ?? null;
    }
    if (suit !== null) level += 0.15;
    out.push({ seat: s, level: Math.min(1, level), suit, threw: new Set((view.discards[s] ?? []).map((d) => kindOf(d.tile))) });
  }
  return out;
}

/** How dangerous one kind is against one seat, before weighing how ready that seat is (0 to about 1.5). */
export function tileDanger(p: SeatPicture, kind: Kind, t: Threat): number {
  const left = p.unseen[kind] ?? 0;
  let d: number;
  if (isHonour(kind)) d = [0, 0.3, 0.55, 0.65, 0.7][left] ?? 0.7;
  else {
    const r = rankOf(kind);
    d = r === 1 || r === 9 ? 0.6 : r === 2 || r === 8 ? 0.85 : 1;
    // Neighbours all out of sight make runs through this tile less likely.
    if (left === 0) d *= 0.6;
  }
  if (t.threw.has(kind)) d *= 0.25;
  else if (isSuited(kind)) {
    const r = rankOf(kind);
    const suji = (r > 3 && t.threw.has(kind - 3)) || (r < 7 && t.threw.has(kind + 3));
    if (suji) d *= 0.65;
  }
  if (t.suit !== null) {
    if (isSuited(kind)) d *= suitOf(kind) === t.suit ? 1.5 : 0.3;
    else d *= 1.1;
  }
  return d;
}

/** A tile's danger against the whole table: each seat's danger weighed by how ready it looks. */
export function dangerOf(p: SeatPicture, kind: Kind, threats: Threats): number {
  let sum = 0;
  for (const t of threats) sum += t.level * tileDanger(p, kind, t);
  return sum;
}

/** The kinds in a hand from safest to most dangerous, with each one's danger. */
export function safetyRanking(p: SeatPicture, threats: Threats = readThreats(p.view)): { kind: Kind; danger: number }[] {
  const kinds = [...new Set(p.view.hand.map(kindOf))];
  return kinds.map((kind) => ({ kind, danger: dangerOf(p, kind, threats) })).sort((a, b) => a.danger - b.danger || a.kind - b.kind);
}
