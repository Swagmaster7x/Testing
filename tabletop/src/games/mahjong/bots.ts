/**
 * Mahjong CPU players (PLAN.md 2.4): one bot family for every style, reading the active rules
 * file (its shapes, scoring hints, point table and who pays). Levels add knowledge in the order a
 * player learns it, and the weaker ones keep habits people really have:
 *
 *   1  a novice: keeps the hand no further from ready, but often throws a tile it needed, loves
 *      its honours and calls every set it can;
 *   2  a beginner: tiles from ready only, still fond of honours and terminals, calls everything;
 *   3  counts its useful tiles (acceptance), still holds honours too long, and has a rough sense
 *      of the minimum before calling;
 *   4  steers toward the style's scoring patterns and the minimum, and judges a ready hand by
 *      what it can actually win;
 *   5  weighs every discard by expected points (its chance to win times what the hand is worth,
 *      from the style's point table), looks one draw ahead at every promising discard, judges
 *      calls the same way, and counts what a dangerous tile could cost under the table's payments.
 *
 * A seat's play style (attacker, balanced, defender) comes from the table's public number: it
 * moves how readily a seat calls and how much it fears feeding a ready hand. Bots see only their
 * view; strength comes from knowledge and fixed look-ahead budgets, never from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { acceptance, bestReading, shanten } from './core/shanten';
import type { Meld } from './core/style';
import type { Kind } from './core/tiles';
import { codeOf, isHonour, isSuited, isTerminal, kindOf, PLAYING_KINDS, rankOf } from './core/tiles';
import { setsIn } from './core/engine';
import type { MahjongAction, MahjongView } from './rules';
import { actionText, mahjong } from './rules';
import type { DiscardEval, SeatPicture, Threats } from './strategy';
import { dangerOf, dealInCost, evaluateDiscards, expectedPoints, handShanten, picture, pointsFor, readThreats, readyInfo, safetyRanking, turnsLeft, valueEstimate, winChance, winPayout } from './strategy';

export const MAHJONG_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 400 },
  { level: 2, rating: 600 },
  { level: 3, rating: 800 },
  { level: 4, rating: 1000 },
  { level: 5, rating: 1250 },
];

export type PlayStyle = 'attacker' | 'balanced' | 'defender';
export const PLAY_STYLES: readonly PlayStyle[] = ['attacker', 'balanced', 'defender'];

/** A seat's style of play, fixed for the game by the table's public number. */
export function playStyleOf(table: number, seat: Seat): PlayStyle {
  return PLAY_STYLES[(table + seat) % 3] ?? 'balanced';
}

interface LevelParams {
  /** Weight of each useful tile left (acceptance); 0 counts tiles from ready alone. */
  readonly accept: number;
  /** Weight of steering toward value and the minimum. */
  readonly value: number;
  /** Judges a ready hand by what it can win under the minimum. */
  readonly readyCheck: boolean;
  /** A beginner's habit: reluctance to let honours and terminals go. */
  readonly honourLove: number;
  /** Chance of a human-looking slip among the top choices. */
  readonly slip: number;
  /** Knows the minimum when calling (1 roughly, 2 well). */
  readonly callSense: number;
  /** 0 judges by rules of thumb; 1 adds expected points (chance to win times worth, less the cost of feeding); 2 also looks one draw ahead. */
  readonly ev: number;
  /** How much expected points (and the expected cost of feeding) weigh against the rules of thumb. */
  readonly evWeight: number;
  readonly riskWeight: number;
  /** Calls judged by expected points rather than by rules of thumb. */
  readonly evCalls: boolean;
  /** How many discards the look ahead examines. */
  readonly lookWidth: number;
}

const THUMB = { ev: 0, evWeight: 0, riskWeight: 0, evCalls: false, lookWidth: 0 } as const;

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { ...THUMB, accept: 0, value: 0, readyCheck: false, honourLove: 400, slip: 0.45, callSense: 0 },
  2: { ...THUMB, accept: 0, value: 0, readyCheck: false, honourLove: 260, slip: 0.18, callSense: 0 },
  3: { ...THUMB, accept: 12, value: 0, readyCheck: false, honourLove: 120, slip: 0.1, callSense: 1 },
  4: { ...THUMB, accept: 12, value: 1, readyCheck: true, honourLove: 0, slip: 0.06, callSense: 2 },
  5: { accept: 12, value: 1, readyCheck: true, honourLove: 0, slip: 0, callSense: 2, ev: 2, evWeight: 50, riskWeight: 10, evCalls: true, lookWidth: 14 },
};

const STYLE_SHIFT: Readonly<Record<PlayStyle, number>> = { attacker: 0.2, balanced: 0, defender: -0.2 };
/** How much each style fears feeding a ready hand. */
const STYLE_FEAR: Readonly<Record<PlayStyle, number>> = { attacker: 0.6, balanced: 1, defender: 1.8 };

interface Decision {
  readonly action: MahjongAction;
  readonly tags: readonly string[];
}

// Discards

interface Scored {
  readonly e: DiscardEval;
  readonly score: number;
  readonly fold: boolean;
}

/** Expected points of keeping a hand one tile from ready, looking at every useful draw and the best ready hand it makes. */
function lookahead(p: SeatPicture, e: DiscardEval): number {
  const c = [...p.counts];
  c[e.kind] = (c[e.kind] ?? 0) - 1;
  const unseen = p.unseen.reduce((a, b) => a + b, 0);
  let copies = 0;
  let winnable = 0;
  let points = 0;
  for (const k of e.useful) {
    const n = p.unseen[k] ?? 0;
    if (n === 0) continue;
    c[k] = (c[k] ?? 0) + 1;
    let bestEv = -1;
    let bestWin = 0;
    let bestPts = 0;
    for (let j = 0; j < PLAYING_KINDS; j++) {
      if ((c[j] ?? 0) === 0) continue;
      c[j] = (c[j] ?? 0) - 1;
      if (shanten(c, p.melds.length, p.shapes) === 0) {
        const r = readyInfo(p, c);
        const live = r.waits.filter((w) => w.left > 0 && (w.ron !== null || w.tsumo !== null));
        const w = live.reduce((x, y) => x + y.left, 0);
        const pts = w > 0 ? live.reduce((sum, x) => sum + x.left * pointsFor(p.hints, Math.max(x.ron ?? 0, x.tsumo ?? 0)), 0) / w : 0;
        if (w * pts > bestEv) {
          bestEv = w * pts;
          bestWin = w;
          bestPts = pts;
        }
      }
      c[j] = (c[j] ?? 0) + 1;
    }
    c[k] = (c[k] ?? 0) - 1;
    copies += n;
    winnable += n * bestWin;
    points += n * bestPts;
  }
  if (copies === 0) return 0;
  return winChance(1, e.accept, winnable / copies, unseen, turnsLeft(p)) * (points / copies) * winPayout(p.hints);
}

/**
 * The rules of thumb, refined by expected points: the chance to win times what a win collects,
 * less what a tile is expected to cost by feeding a ready hand (which depends on who pays).
 */
function scoreByValue(p: SeatPicture, params: LevelParams, style: PlayStyle, threats: Threats | null): Scored[] {
  const plain = scoreDiscards(p, { ...params, ev: 0 }, style, null);
  const base = plain.map((x) => ({ x, ev: expectedPoints(p, x.e), risk: threats ? dealInCost(p, x.e.kind, threats) : 0 }));
  if (params.ev >= 2) {
    // Look one draw ahead for the most promising hands one tile from ready.
    const close = [...base].filter((y) => y.x.e.shanten === 1).sort((a, b) => b.ev - a.ev).slice(0, params.lookWidth);
    for (const y of close) y.ev = Math.max(y.ev * 0.5, lookahead(p, y.x.e));
  }
  const fastest = Math.min(...plain.map((y) => y.e.shanten));
  const bestEv = Math.max(...base.map((y) => y.ev));
  return base.map((y) => ({
    e: y.x.e,
    score: y.x.score + params.evWeight * y.ev - params.riskWeight * STYLE_FEAR[style] * y.risk,
    fold: y.x.e.shanten > fastest && y.ev < bestEv * 0.5 && y.risk < (base.find((z) => z.ev === bestEv)?.risk ?? 0),
  }));
}

function scoreDiscards(p: SeatPicture, params: LevelParams, style: PlayStyle, threats: Threats | null): Scored[] {
  if (params.ev > 0) return scoreByValue(p, params, style, threats);
  const evals = evaluateDiscards(p, threats);
  const sh = (e: DiscardEval) => (params.readyCheck && e.ready && e.ready.winnable === 0 ? e.shanten + 1 : e.shanten);
  return evals.map((e) => {
    let score = -1000 * sh(e) + params.accept * (e.ready && params.readyCheck ? e.ready.winnable * 1.5 : e.accept);
    if (params.value > 0) {
      const deficit = Math.max(0, p.hints.minimum - e.value);
      score += params.value * (e.value * 14 - deficit * 90);
      if (e.ready && params.readyCheck) score += e.ready.best * 6;
    }
    if (params.honourLove > 0 && (isHonour(e.kind) || isTerminal(e.kind))) score -= params.honourLove;
    return { e, score, fold: false };
  });
}

function pick<T extends { score: number }>(list: readonly T[], slip: number, rng: Rng): T {
  const sorted = [...list].sort((a, b) => b.score - a.score);
  if (slip > 0 && sorted.length > 1 && rng.next() < slip) {
    // A slip: one of the next two choices a person might also have liked.
    const near = sorted.slice(1, 3);
    return rng.pick(near);
  }
  const top = sorted[0] as T;
  const ties = sorted.filter((x) => x.score >= top.score - 1e-9);
  return rng.pick(ties);
}

function discardTags(p: SeatPicture, chosen: Scored, all: readonly Scored[]): string[] {
  const tags: string[] = [];
  const k = chosen.e.kind;
  if (chosen.fold) tags.push('mj-fold');
  if (chosen.e.danger <= 0.15 && all.some((x) => x.e.danger > 0.5)) tags.push('mj-safe');
  if (chosen.e.ready) tags.push('mj-ready');
  const sameSpeed = all.filter((x) => x.e.shanten === chosen.e.shanten);
  if (!chosen.fold && sameSpeed.every((x) => x.e.accept <= chosen.e.accept) && !chosen.e.ready) tags.push('mj-efficient');
  const c = p.counts;
  const isolated = (c[k] ?? 0) === 1 && (isHonour(k) || ![-2, -1, 1, 2].some((d) => isSuited(k + d) && Math.floor((k + d) / 9) === Math.floor(k / 9) && rankOf(k) + d >= 1 && rankOf(k) + d <= 9 && (c[k + d] ?? 0) > 0));
  if (isolated) tags.push('mj-isolated');
  if (!chosen.fold && p.hints.minimum > 0 && chosen.e.value >= p.hints.minimum && all.some((x) => x.e.shanten === chosen.e.shanten && x.e.value < p.hints.minimum)) tags.push('mj-value');
  return tags;
}

function chooseDiscard(p: SeatPicture, params: LevelParams, style: PlayStyle, rng: Rng): Decision {
  const threats = params.riskWeight > 0 ? readThreats(p.view) : null;
  const scored = scoreDiscards(p, params, style, threats);
  const chosen = pick(scored, params.slip, rng);
  return { action: { type: 'discard', tile: chosen.e.kind }, tags: discardTags(p, chosen, scored) };
}

// Kongs on your own turn

function kongDecision(p: SeatPicture, options: readonly MahjongAction[], params: LevelParams): Decision | null {
  const kongs = options.filter((a): a is { type: 'kong'; tile: Kind } => a.type === 'kong' && a.tile !== undefined);
  if (kongs.length === 0) return null;
  const now = handShanten(p);
  for (const a of kongs) {
    const c = [...p.counts];
    const concealedKong = (c[a.tile] ?? 0) === 4;
    c[a.tile] = (c[a.tile] ?? 0) - (concealedKong ? 4 : 1);
    const melds = p.melds.length + (concealedKong ? 1 : 0);
    const after = shanten(c, melds, p.shapes);
    if (params.honourLove > 0 || after <= now) return { action: a, tags: ['mj-kong'] };
  }
  return null;
}

// Calls on a discard

function fakeMeld(type: Meld['type'], kinds: readonly Kind[]): Meld {
  return { type, tiles: kinds.map((k, i) => `${codeOf(k)}.${i}`), claimed: null, from: null, concealed: false, added: false };
}

interface CallPlan {
  readonly action: MahjongAction;
  readonly shanten: number;
  readonly value: number;
  readonly valuePung: boolean;
}

function planCall(p: SeatPicture, a: MahjongAction, tile: Kind): CallPlan | null {
  if (a.type !== 'pung' && a.type !== 'chow' && a.type !== 'kong') return null;
  const used = a.type === 'chow' ? [a.start, a.start + 1, a.start + 2].filter((x) => x !== tile) : new Array<Kind>(a.type === 'kong' ? 3 : 2).fill(tile);
  const c = [...p.counts];
  for (const k of used) c[k] = (c[k] ?? 0) - 1;
  const meldKinds = a.type === 'chow' ? [a.start, a.start + 1, a.start + 2] : new Array<Kind>(a.type === 'kong' ? 4 : 3).fill(tile);
  const melds = [...p.melds, fakeMeld(a.type, meldKinds)];
  let sh: number;
  let value: number;
  if (a.type === 'kong') {
    sh = shanten(c, melds.length, p.shapes);
    value = valueEstimate(p, c, melds, false);
  } else {
    // After a pung or chow the caller discards at once: judge the best discard.
    sh = 99;
    value = 0;
    for (let k = 0; k < PLAYING_KINDS; k++) {
      if ((c[k] ?? 0) === 0) continue;
      c[k] = (c[k] ?? 0) - 1;
      const s = shanten(c, melds.length, p.shapes);
      const v = valueEstimate(p, c, melds, false);
      if (s < sh || (s === sh && v > value)) {
        sh = s;
        value = v;
      }
      c[k] = (c[k] ?? 0) + 1;
    }
  }
  return { action: a, shanten: sh, value, valuePung: a.type !== 'chow' && (p.hints.pung[tile] ?? 0) > 0 };
}

/** Expected points of a concealed part of 3k+1 tiles beside `melds`. */
function holdingValue(p: SeatPicture, counts: readonly number[], melds: readonly Meld[], concealed: boolean): number {
  const a = acceptance(counts, melds.length, p.shapes, p.unseen);
  const pp = melds === p.melds ? p : { ...p, melds };
  return expectedPoints(pp, { shanten: a.shanten, accept: a.count, value: valueEstimate(p, counts, melds, concealed), ready: a.shanten === 0 ? readyInfo(pp, counts, melds) : null });
}

/** Calls judged by expected points: the best hand after the call against the hand kept as it is. */
function claimByValue(p: SeatPicture, options: readonly MahjongAction[], style: PlayStyle): Decision {
  const claim = p.view.claim;
  const pass: Decision = { action: { type: 'pass' }, tags: [] };
  if (!claim) return pass;
  const tile = kindOf(claim.tile);
  const keep = holdingValue(p, p.counts, p.melds, p.concealed);
  const threats = readThreats(p.view);
  let best: { action: MahjongAction; ev: number; valuePung: boolean } | null = null;
  for (const a of options) {
    if (a.type !== 'pung' && a.type !== 'chow' && a.type !== 'kong') continue;
    const used = a.type === 'chow' ? [a.start, a.start + 1, a.start + 2].filter((x) => x !== tile) : new Array<Kind>(a.type === 'kong' ? 3 : 2).fill(tile);
    const c = [...p.counts];
    for (const k of used) c[k] = (c[k] ?? 0) - 1;
    const meldKinds = a.type === 'chow' ? [a.start, a.start + 1, a.start + 2] : new Array<Kind>(a.type === 'kong' ? 4 : 3).fill(tile);
    const melds = [...p.melds, fakeMeld(a.type, meldKinds)];
    let ev: number;
    if (a.type === 'kong') ev = holdingValue(p, c, melds, false);
    else {
      ev = -Infinity;
      for (let k = 0; k < PLAYING_KINDS; k++) {
        if ((c[k] ?? 0) === 0) continue;
        c[k] = (c[k] ?? 0) - 1;
        ev = Math.max(ev, holdingValue(p, c, melds, false) - dealInCost(p, k, threats));
        c[k] = (c[k] ?? 0) + 1;
      }
    }
    if (!best || ev > best.ev) best = { action: a, ev, valuePung: a.type !== 'chow' && (p.hints.pung[tile] ?? 0) > 0 };
  }
  const margin = 1.08 - STYLE_SHIFT[style] * 0.4;
  if (best && best.ev > keep * margin + 0.01) return { action: best.action, tags: [best.valuePung ? 'mj-call-value' : 'mj-call-speed'] };
  return { action: { type: 'pass' }, tags: best && p.concealed ? ['mj-pass-concealed'] : [] };
}

function chooseClaim(p: SeatPicture, options: readonly MahjongAction[], params: LevelParams, style: PlayStyle): Decision {
  if (options.some((a) => a.type === 'win')) return { action: { type: 'win' }, tags: ['mj-win'] };
  if (params.evCalls) return claimByValue(p, options, style);
  const pass: Decision = { action: { type: 'pass' }, tags: [] };
  const claim = p.view.claim;
  if (!claim) return pass;
  const tile = kindOf(claim.tile);
  const now = shanten(p.counts, p.melds.length, p.shapes);
  const valueNow = valueEstimate(p, p.counts, p.melds, p.concealed);
  const plans = options.map((a) => planCall(p, a, tile)).filter((x): x is CallPlan => x !== null);
  if (plans.length === 0) return pass;
  const shift = STYLE_SHIFT[style];
  const good = plans.filter((plan) => {
    const faster = plan.shanten < now || (plan.action.type === 'kong' && plan.shanten <= now);
    if (!faster) return false;
    if (params.callSense === 0) return true;
    const minimum = p.hints.minimum;
    if (params.callSense === 1) return plan.valuePung || plan.value >= minimum - 1 + (style === 'defender' ? 0.5 : 0);
    // Knows the minimum well: the hand must still be able to win, and a call that throws away a
    // well-valued concealed hand for little speed is declined.
    if (plan.value < minimum - 0.25 - shift && !plan.valuePung) return false;
    if (p.concealed && plan.action.type === 'chow' && plan.shanten > 0 && valueNow >= minimum + 1.5 && style !== 'attacker') return false;
    return true;
  });
  if (good.length === 0) return { action: { type: 'pass' }, tags: plans.length > 0 && p.concealed ? ['mj-pass-concealed'] : [] };
  const best = [...good].sort((a, b) => a.shanten - b.shanten || b.value - a.value)[0] as CallPlan;
  return { action: best.action, tags: [best.valuePung ? 'mj-call-value' : 'mj-call-speed'] };
}

// The bot

export function decide(view: MahjongView, level: number, rng: Rng): Decision {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Mahjong has no level ${level}`);
  const options = view.options;
  if (options.length === 0) throw new Error('Mahjong: nothing to do');
  if (options.length === 1) return { action: options[0] as MahjongAction, tags: options[0]?.type === 'win' ? ['mj-win'] : [] };
  const style = playStyleOf(view.table, view.seat);
  const p = picture(view);
  if (view.phase === 'claim' || view.phase === 'rob') return chooseClaim(p, options, params, style);
  if (options.some((a) => a.type === 'win')) return { action: { type: 'win' }, tags: ['mj-win'] };
  const kong = kongDecision(p, options, params);
  if (kong) return kong;
  return chooseDiscard(p, params, style, rng);
}

// Coach answers

function efficiencyAnswer(view: MahjongView): Json {
  const p = picture(view);
  const total = p.counts.reduce((a, b) => a + b, 0);
  const need = setsIn(p.rules) - p.melds.length;
  const reading = bestReading(p.counts, need);
  const readingJson = { sets: reading.sets.length, partials: reading.partials.length, pair: reading.pair !== null };
  if (total % 3 === 2) {
    const evals = evaluateDiscards(p).sort((a, b) => a.shanten - b.shanten || b.accept - a.accept || a.kind - b.kind);
    return {
      shanten: handShanten(p),
      reading: readingJson,
      discards: evals.map((e) => ({ tile: codeOf(e.kind), shanten: e.shanten, accept: e.accept, useful: e.useful.map(codeOf), ...(e.ready ? { winnable: e.ready.winnable, waits: e.ready.waits.map((w) => ({ tile: codeOf(w.kind), left: w.left, ron: w.ron, tsumo: w.tsumo })) } : {}) })),
    };
  }
  const now = shanten(p.counts, p.melds.length, p.shapes);
  const ready = now === 0 ? readyInfo(p, p.counts) : null;
  const useful: string[] = [];
  let count = 0;
  const c = [...p.counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) >= 4) continue;
    c[k] = (c[k] ?? 0) + 1;
    if (shanten(c, p.melds.length, p.shapes) < now) {
      useful.push(codeOf(k));
      count += p.unseen[k] ?? 0;
    }
    c[k] = (c[k] ?? 0) - 1;
  }
  return { shanten: now, reading: readingJson, accept: count, useful, ...(ready ? { winnable: ready.winnable, waits: ready.waits.map((w) => ({ tile: codeOf(w.kind), left: w.left, ron: w.ron, tsumo: w.tsumo })) } : {}) };
}

function safetyAnswer(view: MahjongView): Json {
  const p = picture(view);
  const threats = readThreats(view);
  return {
    threats: threats.map((t) => ({ seat: t.seat, level: Math.round(t.level * 100) / 100, suit: t.suit })),
    tiles: safetyRanking(p, threats).map((x) => ({ tile: codeOf(x.kind), danger: Math.round(x.danger * 100) / 100 })),
  };
}

/** Every option a seat had, with the top level's judgement of each, for the review. */
function analyseAnswer(view: MahjongView, rng: Rng): Json {
  const p = picture(view);
  const params = LEVEL_PARAMS[5] as LevelParams;
  const style: PlayStyle = 'balanced';
  if (view.phase === 'act' && view.options.some((a) => a.type === 'discard')) {
    const threats = readThreats(view);
    const scored = scoreDiscards(p, params, style, threats);
    const top = Math.max(...scored.map((x) => x.score));
    const bestAccept = Math.max(...scored.filter((x) => x.e.shanten === Math.min(...scored.map((y) => y.e.shanten))).map((x) => x.e.accept));
    return {
      kind: 'discard',
      fold: scored[0]?.fold ?? false,
      best: codeOf(([...scored].sort((a, b) => b.score - a.score)[0] as Scored).e.kind),
      moves: scored.map((x) => ({
        action: codeOf(x.e.kind),
        score: Math.round(x.score),
        loss: Math.round((top - x.score) * 10) / 10,
        shanten: x.e.shanten,
        accept: x.e.accept,
        bestAccept,
        danger: Math.round(x.e.danger * 100) / 100,
        value: Math.round(x.e.value * 10) / 10,
        winnable: x.e.ready?.winnable ?? null,
        tags: discardTags(p, x, scored),
      })),
    };
  }
  const decision = decide(view, 5, rng);
  return { kind: view.phase, best: actionText(decision.action), tags: [...decision.tags], moves: view.options.map((a) => ({ action: actionText(a) })) };
}

function advise(view: MahjongView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  switch (query.type) {
    case 'hint':
    case 'best': {
      const d = decide(view, 5, rng);
      return { action: actionText(d.action), tags: [...d.tags] };
    }
    case 'efficiency':
      return efficiencyAnswer(view);
    case 'safety':
      return safetyAnswer(view);
    case 'analyse':
      return analyseAnswer(view, rng);
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

/**
 * Reasons a CPU seat may show at the table: only those everyone can see for themselves. "Ready
 * to win", "folding" or "a lone tile" would tell the others what is in a hidden hand.
 */
const PUBLIC_TAGS: ReadonlySet<string> = new Set(['mj-win', 'mj-kong', 'mj-call-value', 'mj-call-speed']);

export const mahjongBots: BotSet<MahjongView, MahjongAction> = {
  gameId: 'mahjong',
  levels: MAHJONG_LEVELS,
  choose({ view, level, rng }: BotInput<MahjongView>): BotChoice<MahjongAction> {
    const d = decide(view, level, rng);
    return { action: d.action, tags: d.tags.filter((tag) => PUBLIC_TAGS.has(tag)), nodes: LEVEL_PARAMS[level]?.lookWidth ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => mahjong.codec.action.toJSON(action),
};

/** Danger of a kind for a view (re-exported for the coach panel's tests). */
export function dangerFor(view: MahjongView, kind: Kind): number {
  return dangerOf(picture(view), kind, readThreats(view));
}
