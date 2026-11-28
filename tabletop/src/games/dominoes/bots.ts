/**
 * Dominoes CPU players (PLAN.md 2.4): heuristics with inference from passes for levels 1 to 3,
 * determinized Monte Carlo for levels 4 to 6 (deal the unseen tiles many times in ways that agree
 * with every pass, play each candidate out, keep the one that scores best on average), and exact
 * search once few tiles are left in a sampled deal.
 *
 * The partner conventions the lessons teach are the level 3 heuristic, and every level from 3 up
 * follows them: lead from your strongest number (its double if you hold it), play to your
 * partner's number and do not cover it, cover the opponents' number, and leave ends the next
 * opponent has shown they cannot play. Levels 4 to 6 keep the conventional play whenever the
 * search finds it within a point of the best, so a CPU partner stays easy to read.
 *
 * When the ends score as you play (All Fives), every level values a play that makes the ends a
 * multiple of five: level 1 takes any score it sees, level 2 weighs it against its options, and
 * level 3 also counts what the play leaves the next player to score. The search levels see the
 * points in their rollouts.
 *
 * Bots see only their view. Strength comes from the number of sampled deals, never from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { DominoesAction, DominoesView, End, Layout, Pip, Tile } from './rules';
import { actionText, cantHave, dominoes, drawing, endsCount, endsOf, fitsLayout, fivesScore, hasNumber, isDouble, openEnds, pipsOf, placeOn, sampleState, seatCount, setPips, sideOf, tilePips, tilesOfSet, topOf, TOTAL_PIPS, unseenTiles } from './rules';
import type { Sim } from './sim';
import { cloneSim, DRAW, endCode, fromState, liveTiles, marginOf, moveOf, PASS, peek, playToEnd, popcount, simApply, solveMargin, tileIndex } from './sim';

export const DOMINOES_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 600 },
  { level: 2, rating: 850 },
  { level: 3, rating: 1100 },
  { level: 4, rating: 1350 },
  { level: 5, rating: 1550 },
  { level: 6, rating: 1750 },
];

interface LevelParams {
  /** Sampled deals for determinized search; 0 plays by heuristics alone. */
  readonly samples: number;
  /** The heuristic used on its own at low levels. */
  readonly policy: 1 | 2 | 3;
  /** Solve exactly once a sampled deal has this many tiles or fewer left in play (in hands, or still to draw). */
  readonly exactAt: number;
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { samples: 0, policy: 1, exactAt: -1 },
  2: { samples: 0, policy: 2, exactAt: -1 },
  3: { samples: 0, policy: 3, exactAt: -1 },
  4: { samples: 16, policy: 3, exactAt: 6 },
  5: { samples: 120, policy: 3, exactAt: 9 },
  6: { samples: 400, policy: 3, exactAt: 12 },
};

/**
 * Level 4 with the double nine searches more deals: with 16 it lost to level 3 (0.44 in Cuban
 * matches to 500); with 40 it won 0.57 over 200 matches, and level 5 still beat it 0.63.
 */
const NINE_LEVEL4_SAMPLES = 40;

/** How close (in points, with the double six) the search may rate a conventional play to the best and still choose it. */
const CONVENTION_MARGIN = 1;

/** The convention margin for a set: a point with the double six, scaled up with the pips in the set (about three with the double nine). */
function conventionMargin(v: Pick<DominoesView, 'config'>): number {
  return (CONVENTION_MARGIN * setPips(v.config.set)) / TOTAL_PIPS;
}

// What the view tells a seat

/** The legal moves as the view sees them (the same list the rules give for the true state). */
export function viewLegal(v: DominoesView): DominoesAction[] {
  if (v.over || v.turn !== v.seat) return [];
  if (v.chain.length === 0) {
    if (v.mustLead) return v.hand.includes(v.mustLead) ? [{ type: 'play', tile: v.mustLead }] : [];
    return v.hand.map((tile) => ({ type: 'play', tile }));
  }
  const ends = openEnds(v);
  const out: DominoesAction[] = [];
  for (const tile of v.hand) for (const e of ends) if (hasNumber(tile, e.value)) out.push({ type: 'play', tile, end: e.end });
  if (out.length > 0) return out;
  const keep = v.config.drawLimit === 'leave-two' ? 2 : v.config.drawLimit === 'leave-one' ? 1 : 0;
  const drawable = drawing(v.config) && v.boneyardCount > keep;
  return [{ type: drawable ? 'draw' : 'pass' }];
}

/** The numbers a seat has shown as its own: the tile it led this hand (both numbers, or the double's). */
export function shownSuits(v: Pick<DominoesView, 'moves'>, seat: number): Set<number> {
  const out = new Set<number>();
  const lead = v.moves[0];
  if (lead && lead.seat === seat && lead.type === 'play' && lead.tile) for (const x of pipsOf(lead.tile)) out.add(x);
  return out;
}

const ALL_NUMBERS: readonly Pip[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** The number a hand holds most of (ties: the heavier tiles), and its tiles. */
export function strongestNumber(hand: readonly Tile[]): { number: Pip; count: number } {
  let best: { number: Pip; count: number; pips: number } = { number: 0, count: -1, pips: -1 };
  for (const x of ALL_NUMBERS) {
    const tiles = hand.filter((t) => hasNumber(t, x));
    const pips = tiles.reduce((s, t) => s + tilePips(t), 0);
    if (tiles.length > best.count || (tiles.length === best.count && pips > best.pips)) best = { number: x, count: tiles.length, pips };
  }
  return { number: best.number, count: best.count };
}

/** The conventional lead: the double of your strongest number if you hold it, else that number's heaviest tile. */
export function conventionalLead(hand: readonly Tile[]): Tile {
  const { number } = strongestNumber(hand);
  const tiles = hand.filter((t) => hasNumber(t, number));
  const double = tiles.find(isDouble);
  if (double) return double;
  return [...tiles].sort((a, b) => tilePips(b) - tilePips(a))[0] ?? (hand[0] as Tile);
}

interface Reading {
  readonly n: number;
  readonly me: number;
  readonly partner: number;
  readonly nextOpp: number;
  readonly cant: readonly Set<number>[];
  readonly partnerSuits: Set<number>;
  readonly oppSuits: Set<number>;
  readonly unseen: readonly Tile[];
  readonly counts: readonly number[];
}

function readTable(v: DominoesView): Reading {
  const n = seatCount(v.config);
  const me = v.seat;
  const partner = n === 4 ? (me + 2) % 4 : -1;
  const oppSuits = new Set<number>();
  for (let s = 0; s < n; s++) if (sideOf(s, n) !== sideOf(me, n)) for (const x of shownSuits(v, s)) oppSuits.add(x);
  return {
    n,
    me,
    partner,
    nextOpp: (me + 1) % n,
    cant: Array.from({ length: n }, (_, s) => cantHave(v, s)),
    partnerSuits: partner >= 0 ? shownSuits(v, partner) : new Set(),
    oppSuits,
    unseen: unseenTiles(v),
    counts: v.handCounts,
  };
}

/** The layout after a play. */
export function layoutAfter(v: Pick<DominoesView, 'config'> & Layout, tile: Tile, end: End | undefined): Layout {
  return placeOn(v, tile, v.chain.length === 0 ? null : (end ?? 'left'), 0, 0, v.config.spinner === 'first-double');
}

/**
 * What the open ends will show after a play, the number the tile covered and the one it shows on
 * that end, and (with a spinner or scoring as you play) the whole layout after it.
 */
function afterPlay(v: DominoesView, tile: Tile, end: End | undefined): { after: number[]; covered: number; outer: number; layout: Layout | null } {
  if (v.config.spinner !== 'first-double' && v.config.fives !== 'on') {
    // A plain line: only its two ends change.
    const [a, b] = pipsOf(tile);
    const ends = endsOf(v.chain);
    if (!ends) return { after: [a, b], covered: -1, outer: -1, layout: null };
    if (end === 'right') {
      const outer = ends[1] === a ? b : a;
      return { after: [ends[0], outer], covered: ends[1], outer, layout: null };
    }
    const outer = ends[0] === a ? b : a;
    return { after: [outer, ends[1]], covered: ends[0], outer, layout: null };
  }
  const before = openEnds(v);
  const layout = layoutAfter(v, tile, end);
  const ends = openEnds(layout);
  const after = ends.map((e) => e.value);
  if (before.length === 0) return { after, covered: -1, outer: -1, layout };
  const where = end ?? 'left';
  const covered = before.find((e) => e.end === where)?.value ?? -1;
  const outer = ends.find((e) => e.end === where)?.value ?? -1;
  return { after, covered, outer, layout };
}

/** Points a play makes on the ends when they score as you play. */
export function playScore(v: Pick<DominoesView, 'config'> & Layout, tile: Tile, end: End | undefined): number {
  if (v.config.fives !== 'on') return 0;
  return fivesScore(endsCount(layoutAfter(v, tile, end)));
}

/** About how much the next player could score from a layout: each unseen tile they may hold, its best score, weighed by the chance they hold it. */
function scoringDanger(v: DominoesView, layout: Layout, reading: Reading, rest: readonly Tile[]): number {
  const lacks = reading.cant[reading.nextOpp] ?? new Set<number>();
  const pool = reading.unseen.filter((t) => !rest.includes(t));
  if (pool.length === 0) return 0;
  const chance = Math.min(1, (reading.counts[reading.nextOpp] ?? 0) / pool.length);
  let sum = 0;
  const after = { ...layout, config: v.config };
  for (const t of pool) {
    if ([...lacks].some((x) => hasNumber(t, x))) continue;
    let best = 0;
    for (const end of fitsLayout(t, layout)) best = Math.max(best, playScore(after, t, end));
    sum += best;
  }
  return chance * sum;
}

/**
 * Level 3's weights, tuned over thousands of paired matches against level 2. Covering the
 * opponents' lead number, or avoiding it, cost more than it won, so those weights are zero; the
 * partner conventions and "control" (ends in numbers you hold and few others can) both pay.
 */
export const TUNE = { weight: 0.6, double: 5, options: 2, shut: 9, half: 2, coverPartner: 6, toPartner: 4, partnerPass: 4, coverOpp: 0, toOpp: 0, closeOut: 6, block: 1, control: 2, nextStrong: 0 };
/** Scoring as you play: what a point made now is worth to each heuristic, and (level 3) what a point left to the next player costs. */
export const FIVES_TUNE = { take1: 2, take2: 1.5, take3: 1.6, danger: 0.5 };
/** With the double nine (Cuban), a blocked hand goes to the lightest single hand: levels 2 and 3 weigh a tile's pips this much more. */
export const NINE_TUNE = { weightScale: 3.5 };

/** A play's score under each heuristic. Higher is better. */
export function heuristicScore(v: DominoesView, action: DominoesAction, policy: 1 | 2 | 3, reading: Reading = readTable(v)): number {
  if (action.type !== 'play') return 0;
  const tile = action.tile;
  const ends = endsOf(v.chain);
  const rest = v.hand.filter((t) => t !== tile);
  if (rest.length === 0) return 1000;
  const { after, covered, outer, layout } = afterPlay(v, tile, action.end);
  const weight = tilePips(tile);
  const gain = v.config.fives === 'on' && layout ? fivesScore(endsCount(layout)) : 0;
  if (policy === 1) return weight + (isDouble(tile) ? 0.5 : 0) + FIVES_TUNE.take1 * gain;
  const scale = v.config.set === 'double-nine' ? NINE_TUNE.weightScale : 1;
  const fits = (t: Tile) => after.some((x) => hasNumber(t, x));
  const options = rest.filter(fits).length;
  // Level 2 keeps its options but does not yet read the passes.
  if (policy === 2) return 0.6 * scale * weight + (isDouble(tile) ? 5 : 0) + 2 * options + FIVES_TUNE.take2 * gain;
  let score = TUNE.weight * scale * weight + (isDouble(tile) ? TUNE.double : 0) + TUNE.options * options;
  if (v.config.fives === 'on' && layout) score += FIVES_TUNE.take3 * gain - FIVES_TUNE.danger * scoringDanger(v, layout, reading, rest);
  const opp = reading.cant[reading.nextOpp] ?? new Set<number>();
  const shut = after.every((x) => opp.has(x));
  // Level 3: the conventions.
  if (shut) score += TUNE.shut;
  else if (after.some((x) => opp.has(x))) score += TUNE.half;
  if (ends) {
    if (reading.partner >= 0) {
      if (reading.partnerSuits.has(covered) && !after.includes(covered)) score -= TUNE.coverPartner;
      if (reading.partnerSuits.has(outer)) score += TUNE.toPartner;
      const pc = reading.cant[reading.partner] ?? new Set<number>();
      if (after.every((x) => pc.has(x))) score -= TUNE.partnerPass;
    }
    if (reading.oppSuits.has(covered) && !after.includes(covered)) score += TUNE.coverOpp;
    if (reading.oppSuits.has(outer)) score -= TUNE.toOpp;
    // Numbers we hold and few others can: the more of them out of sight, the less control.
    if (TUNE.control) {
      const mineOuter = rest.filter((t) => hasNumber(t, outer)).length;
      const unseenOuter = reading.unseen.filter((t) => hasNumber(t, outer) && !rest.includes(t)).length;
      score += TUNE.control * (mineOuter - unseenOuter / 3);
    }
    if (TUNE.nextStrong) {
      const strong = shownSuits(v, reading.nextOpp);
      if (after.some((x) => strong.has(x))) score -= TUNE.nextStrong;
    }
    // Someone about to go out: shut the ends they cannot play.
    for (let s = 0; s < reading.n; s++) {
      if (sideOf(s, reading.n) === sideOf(reading.me, reading.n) || (reading.counts[s] ?? 0) > 1) continue;
      const c = reading.cant[s] ?? new Set<number>();
      if (after.every((x) => c.has(x))) score += TUNE.closeOut;
    }
    // A play that blocks the hand now: good when our side surely holds fewer pips.
    if (reading.partner >= 0 && blocksNow(v, tile, after)) score += TUNE.block * blockValue(rest, reading);
  }
  return score;
}

/** True when, after this play, no tile with an open number is left anywhere but the table. */
function blocksNow(v: DominoesView, tile: Tile, after: readonly number[]): boolean {
  const onTable = new Set<Tile>([...v.chain.map((p) => p.tile), ...v.up.map((p) => p.tile), ...v.down.map((p) => p.tile), tile]);
  return tilesOfSet(v.config.set).every((t) => !after.some((x) => hasNumber(t, x)) || onTable.has(t));
}

/** About how good a block is for us: our pips against the average for the hands we cannot see. */
function blockValue(rest: readonly Tile[], reading: Reading): number {
  const mine = rest.reduce((s, t) => s + tilePips(t), 0);
  const pool = reading.unseen.filter((t) => !rest.includes(t));
  const unseenPips = pool.reduce((s, t) => s + tilePips(t), 0);
  const perTile = pool.length > 0 ? unseenPips / pool.length : 0;
  const ours = mine + (reading.partner >= 0 ? (reading.counts[reading.partner] ?? 0) * perTile : 0);
  const theirs = reading.counts.reduce((s, c, seat) => (sideOf(seat, reading.n) !== sideOf(reading.me, reading.n) ? s + c * perTile : s), 0);
  return ours < theirs - 6 ? 15 : ours > theirs + 6 ? -15 : 0;
}

/** Heuristic play. Level 1 lays its heaviest tile, level 2 keeps its options, level 3 plays the conventions. */
export function heuristic(v: DominoesView, policy: 1 | 2 | 3, rng: Rng): DominoesAction {
  const legal = viewLegal(v);
  if (legal.length <= 1) return legal[0] as DominoesAction;
  if (v.chain.length === 0 && policy >= 2) {
    // Scoring as you play, a lead that scores comes first (the 5-5, the 4-6); then the usual lead.
    const scoring = v.config.fives === 'on' ? [...v.hand].sort((a, b) => playScore(v, b, undefined) - playScore(v, a, undefined) || tilePips(b) - tilePips(a))[0] : undefined;
    const lead = scoring && playScore(v, scoring, undefined) > 0 ? scoring : policy === 3 ? conventionalLead(v.hand) : [...v.hand].sort((a, b) => tilePips(b) - tilePips(a))[0];
    const found = legal.find((a) => a.type === 'play' && a.tile === lead);
    if (found) return found;
  }
  const reading = readTable(v);
  const scored = legal.map((action) => ({ action, score: heuristicScore(v, action, policy, reading) + rng.next() * 0.01 }));
  scored.sort((a, b) => b.score - a.score);
  return (scored[0] as { action: DominoesAction }).action;
}

// Search

/** Rollout weights (see rolloutPick); control 1.5 beat 0 by 0.675 to 0.625 against level 3. */
export const ROLLOUT = { control: 1.5, fives: 1, weight: 0.6, double: 5 };

/** The play the rollouts use for every seat inside a sampled deal (where every hand is known). */
function rolloutPick(s: Sim, legal: number[], rng: Rng): number {
  const n = s.rules.n;
  const t = s.t;
  const me = s.turn;
  const handLo = s.lo[me] ?? 0;
  const handHi = s.hi[me] ?? 0;
  const nextLo = s.lo[(me + 1) % n] ?? 0;
  const nextHi = s.hi[(me + 1) % n] ?? 0;
  const partnerLo = n === 4 ? (s.lo[(me + 2) % 4] ?? 0) : 0;
  const partnerHi = n === 4 ? (s.hi[(me + 2) % 4] ?? 0) : 0;
  const prevLo = n === 4 ? (s.lo[(me + 3) % 4] ?? 0) : 0;
  const prevHi = n === 4 ? (s.hi[(me + 3) % 4] ?? 0) : 0;
  let best = legal[0] as number;
  let bestScore = -Infinity;
  for (const move of legal) {
    const tile = move >> 2;
    const p = peek(s, move);
    const restLo = tile < 32 ? handLo & ~(1 << tile) : handLo;
    const restHi = tile < 32 ? handHi : handHi & ~(1 << (tile - 32));
    if (restLo === 0 && restHi === 0) return move;
    let openLo = (t.numLo[p.l] ?? 0) | (t.numLo[p.r] ?? 0);
    let openHi = (t.numHi[p.l] ?? 0) | (t.numHi[p.r] ?? 0);
    if (p.uv >= 0) {
      openLo |= t.numLo[p.uv] ?? 0;
      openHi |= t.numHi[p.uv] ?? 0;
    }
    if (p.dv >= 0) {
      openLo |= t.numLo[p.dv] ?? 0;
      openHi |= t.numHi[p.dv] ?? 0;
    }
    const a = t.a[tile] as number;
    const b = t.b[tile] as number;
    let score = ROLLOUT.weight * (t.pips[tile] ?? 0) + (a === b ? ROLLOUT.double : 0) + 2 * (popcount(restLo & openLo) + popcount(restHi & openHi));
    if ((nextLo & openLo) === 0 && (nextHi & openHi) === 0) score += 7;
    if (n === 4 && ((partnerLo & openLo) !== 0 || (partnerHi & openHi) !== 0)) score += 2;
    if (ROLLOUT.control) {
      // Control: ends in numbers our side holds more of than theirs.
      const ours = popcount((restLo | partnerLo) & openLo) + popcount((restHi | partnerHi) & openHi);
      const theirs = popcount((nextLo | prevLo) & openLo) + popcount((nextHi | prevHi) & openHi);
      score += ROLLOUT.control * (ours - theirs);
    }
    if (s.rules.fives) score += ROLLOUT.fives * fivesScore(p.count);
    score += rng.next() * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

function encode(action: DominoesAction, v: Pick<DominoesView, 'config'>): number {
  if (action.type === 'pass') return PASS;
  if (action.type === 'draw') return DRAW;
  return moveOf(tileIndex(action.tile, v.config.set), endCode(action.end));
}

/** Expected margin (our side's hand points less theirs) of each legal action, over sampled deals. */
export function evaluateActions(v: DominoesView, samples: number, exactAt: number, rng: Rng): { action: DominoesAction; margin: number }[] {
  return evaluateDetailed(v, samples, exactAt, rng).map(({ action, margin }) => ({ action, margin }));
}

/** As evaluateActions, with each action's value in every sampled deal (the same deals for every action). */
function evaluateDetailed(v: DominoesView, samples: number, exactAt: number, rng: Rng): { action: DominoesAction; margin: number; values: readonly number[] }[] {
  const legal = viewLegal(v);
  const side = sideOf(v.seat, seatCount(v.config));
  if (legal.length <= 1) return legal.map((action) => ({ action, margin: 0, values: [] }));
  // The same tile on either end, when both ends show its number, is the same play in a line game.
  const plain = v.config.spinner !== 'first-double' && v.config.fives !== 'on';
  const keyOf = (a: DominoesAction) => {
    if (a.type !== 'play') return a.type;
    if (!plain) return actionText(a);
    const after = openEnds(layoutAfter(v, a.tile, a.end)).map((e) => e.value);
    return `${a.tile}:${Math.min(...after)}-${Math.max(...after)}`;
  };
  const keys = legal.map(keyOf);
  const unique = [...new Set(keys)];
  const totals = new Map<string, number>(unique.map((k) => [k, 0]));
  const values = new Map<string, number[]>(unique.map((k) => [k, []]));
  const moves = new Map<string, number>(unique.map((k) => [k, encode(legal[keys.indexOf(k)] as DominoesAction, v)]));
  const pick = (sim: Sim, l: number[]) => rolloutPick(sim, l, rng);
  for (let i = 0; i < samples; i++) {
    const world = fromState(sampleState(v, rng));
    for (const k of unique) {
      const child = cloneSim(world);
      simApply(child, moves.get(k) as number);
      let value: number;
      if (child.done) value = marginOf(child.pts, side);
      else if (liveTiles(child) <= exactAt) value = solveMargin(child, side);
      else {
        playToEnd(child, pick);
        value = marginOf(child.pts, side);
      }
      totals.set(k, (totals.get(k) ?? 0) + value);
      values.get(k)?.push(value);
    }
  }
  return legal.map((action, j) => ({ action, margin: samples > 0 ? (totals.get(keys[j] as string) ?? 0) / samples : 0, values: values.get(keys[j] as string) ?? [] }));
}

/** How many standard errors a play must beat the conventional one by, on the same deals, before the search leaves the convention (double nine). */
export const NOISE = { z: 2 };

/**
 * The search's choice with the double nine, where hands are worth three times as much and the
 * samples are noisier: the conventional play stands unless another play beats it, on the same
 * sampled deals, by more than the convention margin and by more than `NOISE.z` standard errors of
 * the difference. (Measured in Cuban paired matches: level 4 against level 3 went from 0.33 to
 * 0.56. With the double six the old rule stays; in All Fives it measured no better.)
 */
function bestOfPaired(scored: readonly { action: DominoesAction; margin: number; values: readonly number[] }[], preferred: DominoesAction, rng: Rng, within: number): DominoesAction {
  const conv = scored.find((x) => actionText(x.action) === actionText(preferred));
  if (!conv || conv.values.length < 2) return bestOf(scored, preferred, rng, within);
  const n = conv.values.length;
  const clear = scored.filter((x) => {
    const d = x.values.map((value, i) => value - (conv.values[i] ?? 0));
    const mean = d.reduce((a, b) => a + b, 0) / n;
    const sd = Math.sqrt(d.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (n - 1));
    return mean > Math.max(within, (NOISE.z * sd) / Math.sqrt(n));
  });
  if (clear.length === 0) return conv.action;
  return bestOf(clear, null, rng);
}



/** Reason tags for a play, from the view before it. */
export function tagsFor(v: DominoesView, action: DominoesAction): string[] {
  if (action.type !== 'play') return [];
  const tile = action.tile;
  const ends = endsOf(v.chain);
  if (v.hand.length === 1) return ['dom-domino'];
  const scores = playScore(v, tile, action.end) > 0 ? ['dom-scores'] : [];
  if (!ends) {
    const { number } = strongestNumber(v.hand);
    return [...scores, ...(hasNumber(tile, number) ? ['dom-leads-strength'] : [])];
  }
  const reading = readTable(v);
  const { after, covered, outer } = afterPlay(v, tile, action.end);
  const tags: string[] = [...scores];
  const opp = reading.cant[reading.nextOpp] ?? new Set<number>();
  if (after.every((x) => opp.has(x))) tags.push('dom-makes-pass');
  if (reading.partner >= 0 && reading.partnerSuits.has(covered) && !after.includes(covered)) tags.push('dom-covers-partner');
  else if (reading.partner >= 0 && reading.partnerSuits.has(outer)) tags.push('dom-plays-to-partner');
  if (reading.oppSuits.has(covered) && !after.includes(covered)) tags.push('dom-covers-opponent');
  if (isDouble(tile)) tags.push('dom-double');
  else if (tilePips(tile) >= topOf(v.config.set) + 3) tags.push('dom-heavy');
  if (reading.partner >= 0 && blocksNow(v, tile, after)) tags.push('dom-blocks');
  return tags;
}

function bestOf(scored: readonly { action: DominoesAction; margin: number }[], preferred: DominoesAction | null, rng: Rng, within = CONVENTION_MARGIN): DominoesAction {
  const top = Math.max(...scored.map((x) => x.margin));
  if (preferred) {
    const p = scored.find((x) => actionText(x.action) === actionText(preferred));
    if (p && p.margin >= top - within) return p.action;
  }
  const best = scored.filter((x) => x.margin >= top - 1e-9);
  return rng.pick(best).action;
}

export function chooseAction(v: DominoesView, level: number, rng: Rng): DominoesAction {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Dominoes has no level ${level}`);
  const legal = viewLegal(v);
  if (legal.length === 1) return legal[0] as DominoesAction;
  if (params.samples === 0) return heuristic(v, params.policy, rng);
  // The lead follows the convention, so a partner can read it.
  if (v.chain.length === 0) return heuristic(v, 3, rng);
  const conventional = heuristic(v, 3, rng);
  if (v.config.set === 'double-nine') {
    const samples = level === 4 ? NINE_LEVEL4_SAMPLES : params.samples;
    return bestOfPaired(evaluateDetailed(v, samples, params.exactAt, rng), conventional, rng, conventionMargin(v));
  }
  return bestOf(evaluateActions(v, params.samples, params.exactAt, rng), conventional, rng, conventionMargin(v));
}

/** Coach answers: a hint, the best move for free play, and every move's value for review. */
function advise(v: DominoesView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(1, Math.min(300, Math.round(query.samples))) : 60;
  switch (query.type) {
    case 'hint':
    case 'best': {
      const legal = viewLegal(v);
      const action = legal.length === 1 ? (legal[0] as DominoesAction) : bestOf(evaluateActions(v, samples, 8, rng), heuristic(v, 3, rng), rng, conventionMargin(v));
      return { action: actionText(action), tags: tagsFor(v, action) };
    }
    case 'analyse': {
      const scored = evaluateActions(v, samples, 8, rng);
      return { moves: scored.map((x) => ({ action: actionText(x.action), margin: Math.round(x.margin * 10) / 10, tags: tagsFor(v, x.action) })) };
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const dominoesBots: BotSet<DominoesView, DominoesAction> = {
  gameId: 'dominoes',
  levels: DOMINOES_LEVELS,
  choose({ view, level, rng }: BotInput<DominoesView>): BotChoice<DominoesAction> {
    const action = chooseAction(view, level, rng);
    return { action, tags: tagsFor(view, action), nodes: LEVEL_PARAMS[level]?.samples ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => dominoes.codec.action.toJSON(action),
};
