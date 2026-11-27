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
 * Bots see only their view. Strength comes from the number of sampled deals, never from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { DominoesAction, DominoesView, Pip, Tile } from './rules';
import { actionText, cantHave, dominoes, endsOf, hasNumber, isDouble, pipsOf, sampleState, seatCount, sideOf, tilePips, TILES, unseenTiles } from './rules';
import type { Sim } from './sim';
import { cloneSim, DRAW, fromState, liveTiles, moveOf, moveRight, moveTile, NUM_MASK, PASS, playToEnd, popcount, simApply, solveMargin, TILE_A, TILE_B, TILE_PIPS, tileIndex } from './sim';

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

/** How close (in points) the search may rate a conventional play to the best and still choose it. */
const CONVENTION_MARGIN = 1;

// What the view tells a seat

/** The legal moves as the view sees them (the same list the rules give for the true state). */
export function viewLegal(v: DominoesView): DominoesAction[] {
  if (v.over || v.turn !== v.seat) return [];
  const ends = endsOf(v.chain);
  if (!ends) {
    if (v.mustLead) return v.hand.includes(v.mustLead) ? [{ type: 'play', tile: v.mustLead }] : [];
    return v.hand.map((tile) => ({ type: 'play', tile }));
  }
  const out: DominoesAction[] = [];
  for (const tile of v.hand) {
    if (hasNumber(tile, ends[0])) out.push({ type: 'play', tile, end: 'left' });
    if (hasNumber(tile, ends[1])) out.push({ type: 'play', tile, end: 'right' });
  }
  if (out.length > 0) return out;
  const drawable = v.config.mode === 'draw' && v.boneyardCount > (v.config.drawLimit === 'leave-two' ? 2 : 0);
  return [{ type: drawable ? 'draw' : 'pass' }];
}

/** The numbers a seat has shown as its own: the tile it led this hand (both numbers, or the double's). */
export function shownSuits(v: Pick<DominoesView, 'moves'>, seat: number): Set<number> {
  const out = new Set<number>();
  const lead = v.moves[0];
  if (lead && lead.seat === seat && lead.type === 'play' && lead.tile) for (const x of pipsOf(lead.tile)) out.add(x);
  return out;
}

/** The number a hand holds most of (ties: the heavier tiles), and its tiles. */
export function strongestNumber(hand: readonly Tile[]): { number: Pip; count: number } {
  let best: { number: Pip; count: number; pips: number } = { number: 0, count: -1, pips: -1 };
  for (const x of [0, 1, 2, 3, 4, 5, 6] as Pip[]) {
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

function endsAfter(ends: readonly [Pip, Pip] | null, tile: Tile, end: 'left' | 'right' | undefined): readonly [number, number] {
  const [a, b] = pipsOf(tile);
  if (!ends) return [a, b];
  if (end === 'right') return [ends[0], ends[1] === a ? b : a];
  return [ends[0] === a ? b : a, ends[1]];
}

/**
 * Level 3's weights, tuned over thousands of paired matches against level 2. Covering the
 * opponents' lead number, or avoiding it, cost more than it won, so those weights are zero; the
 * partner conventions and "control" (ends in numbers you hold and few others can) both pay.
 */
export const TUNE = { weight: 0.6, double: 5, options: 2, shut: 9, half: 2, coverPartner: 6, toPartner: 4, partnerPass: 4, coverOpp: 0, toOpp: 0, closeOut: 6, block: 1, control: 2, nextStrong: 0 };

/** A play's score under each heuristic. Higher is better. */
export function heuristicScore(v: DominoesView, action: DominoesAction, policy: 1 | 2 | 3, reading: Reading = readTable(v)): number {
  if (action.type !== 'play') return 0;
  const tile = action.tile;
  const ends = endsOf(v.chain);
  const rest = v.hand.filter((t) => t !== tile);
  if (rest.length === 0) return 1000;
  const after = endsAfter(ends, tile, action.end);
  const weight = tilePips(tile);
  if (policy === 1) return weight + (isDouble(tile) ? 0.5 : 0);
  const options = rest.filter((t) => hasNumber(t, after[0]) || hasNumber(t, after[1])).length;
  // Level 2 keeps its options but does not yet read the passes.
  if (policy === 2) return 0.6 * weight + (isDouble(tile) ? 5 : 0) + 2 * options;
  let score = TUNE.weight * weight + (isDouble(tile) ? TUNE.double : 0) + TUNE.options * options;
  const opp = reading.cant[reading.nextOpp] ?? new Set<number>();
  const shut = opp.has(after[0]) && opp.has(after[1]);
  // Level 3: the conventions.
  if (shut) score += TUNE.shut;
  else if (opp.has(after[0]) || opp.has(after[1])) score += TUNE.half;
  if (ends) {
    const covered = action.end === 'right' ? ends[1] : ends[0];
    const outer = action.end === 'right' ? after[1] : after[0];
    if (reading.partner >= 0) {
      if (reading.partnerSuits.has(covered) && !after.includes(covered)) score -= TUNE.coverPartner;
      if (reading.partnerSuits.has(outer)) score += TUNE.toPartner;
      const pc = reading.cant[reading.partner] ?? new Set<number>();
      if (pc.has(after[0]) && pc.has(after[1])) score -= TUNE.partnerPass;
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
      if (strong.has(after[0]) || strong.has(after[1])) score -= TUNE.nextStrong;
    }
    // Someone about to go out: shut the ends they cannot play.
    for (let s = 0; s < reading.n; s++) {
      if (sideOf(s, reading.n) === sideOf(reading.me, reading.n) || (reading.counts[s] ?? 0) > 1) continue;
      const c = reading.cant[s] ?? new Set<number>();
      if (c.has(after[0]) && c.has(after[1])) score += TUNE.closeOut;
    }
    // A play that blocks the hand now: good when our side surely holds fewer pips.
    if (v.config.mode === 'partnership' && blocksNow(v, tile, after)) score += TUNE.block * blockValue(rest, reading);
  }
  return score;
}

/** True when, after this play, no tile with either end number is left anywhere but the line. */
function blocksNow(v: DominoesView, tile: Tile, after: readonly [number, number]): boolean {
  const inLine = new Set<Tile>([...v.chain.map((p) => p.tile), tile]);
  return TILES.every((t) => !(hasNumber(t, after[0]) || hasNumber(t, after[1])) || inLine.has(t));
}

/** About how good a block is for us: our pips against the average for the hands we cannot see. */
function blockValue(rest: readonly Tile[], reading: Reading): number {
  const mine = rest.reduce((s, t) => s + tilePips(t), 0);
  const unseenPips = reading.unseen.filter((t) => !rest.includes(t)).reduce((s, t) => s + tilePips(t), 0);
  const others = reading.counts.reduce((s, c, seat) => (seat === reading.me ? s : s + c), 0);
  const perTile = others > 0 ? unseenPips / others : 0;
  const ours = mine + (reading.partner >= 0 ? (reading.counts[reading.partner] ?? 0) * perTile : 0);
  const theirs = reading.counts.reduce((s, c, seat) => (sideOf(seat, reading.n) !== sideOf(reading.me, reading.n) ? s + c * perTile : s), 0);
  return ours < theirs - 6 ? 15 : ours > theirs + 6 ? -15 : 0;
}

/** Heuristic play. Level 1 lays its heaviest tile, level 2 keeps its options, level 3 plays the conventions. */
export function heuristic(v: DominoesView, policy: 1 | 2 | 3, rng: Rng): DominoesAction {
  const legal = viewLegal(v);
  if (legal.length <= 1) return legal[0] as DominoesAction;
  if (!endsOf(v.chain) && policy >= 2) {
    const lead = policy === 3 ? conventionalLead(v.hand) : [...v.hand].sort((a, b) => tilePips(b) - tilePips(a))[0];
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
export const ROLLOUT = { control: 1.5 };

/** The play the rollouts use for every seat inside a sampled deal (where every hand is known). */
function rolloutPick(s: Sim, legal: number[], rng: Rng): number {
  const n = s.rules.n;
  const me = s.turn;
  const hand = s.hands[me] ?? 0;
  const next = s.hands[(me + 1) % n] ?? 0;
  const partner = n === 4 ? (s.hands[(me + 2) % 4] ?? 0) : 0;
  let best = legal[0] as number;
  let bestScore = -Infinity;
  for (const move of legal) {
    const t = moveTile(move);
    const a = TILE_A[t] as number;
    const b = TILE_B[t] as number;
    let l = s.left;
    let r = s.right;
    if (l < 0) {
      l = a;
      r = b;
    } else if (moveRight(move)) r = r === a ? b : a;
    else l = l === a ? b : a;
    const restHand = hand & ~(1 << t);
    if (restHand === 0) return move;
    const open = (NUM_MASK[l] ?? 0) | (NUM_MASK[r] ?? 0);
    let score = 0.6 * (TILE_PIPS[t] ?? 0) + (a === b ? 5 : 0) + 2 * popcount(restHand & open);
    if ((next & open) === 0) score += 7;
    if (n === 4 && (partner & open) !== 0) score += 2;
    if (ROLLOUT.control) {
      // Control: ends in numbers our side holds more of than theirs.
      const ours = popcount((restHand | partner) & open);
      const theirs = popcount((next | (n === 4 ? (s.hands[(me + 3) % 4] ?? 0) : 0)) & open);
      score += ROLLOUT.control * (ours - theirs);
    }
    score += rng.next() * 0.5;
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }
  return best;
}

function margin(s: Sim, side: number): number {
  return (s.pts[side as 0 | 1] ?? 0) - (s.pts[(1 - side) as 0 | 1] ?? 0);
}

function encode(action: DominoesAction): number {
  if (action.type === 'pass') return PASS;
  if (action.type === 'draw') return DRAW;
  return moveOf(tileIndex(action.tile), action.end === 'right');
}

/** Expected margin (our side's hand points less theirs) of each legal action, over sampled deals. */
export function evaluateActions(v: DominoesView, samples: number, exactAt: number, rng: Rng): { action: DominoesAction; margin: number }[] {
  const legal = viewLegal(v);
  const side = sideOf(v.seat, seatCount(v.config));
  if (legal.length <= 1) return legal.map((action) => ({ action, margin: 0 }));
  // The same tile on either end, when both ends show its number, is the same play.
  const keyOf = (a: DominoesAction) => {
    if (a.type !== 'play') return a.type;
    const after = endsAfter(endsOf(v.chain), a.tile, a.end);
    return `${a.tile}:${Math.min(...after)}-${Math.max(...after)}`;
  };
  const keys = legal.map(keyOf);
  const unique = [...new Set(keys)];
  const totals = new Map<string, number>(unique.map((k) => [k, 0]));
  const moves = new Map<string, number>(unique.map((k) => [k, encode(legal[keys.indexOf(k)] as DominoesAction)]));
  const pick = (sim: Sim, l: number[]) => rolloutPick(sim, l, rng);
  for (let i = 0; i < samples; i++) {
    const world = fromState(sampleState(v, rng));
    for (const k of unique) {
      const child = cloneSim(world);
      simApply(child, moves.get(k) as number);
      let value: number;
      if (child.done) value = margin(child, side);
      else if (liveTiles(child) <= exactAt) value = solveMargin(child, side);
      else {
        playToEnd(child, pick);
        value = margin(child, side);
      }
      totals.set(k, (totals.get(k) ?? 0) + value);
    }
  }
  return legal.map((action, j) => ({ action, margin: samples > 0 ? (totals.get(keys[j] as string) ?? 0) / samples : 0 }));
}

/** Reason tags for a play, from the view before it. */
export function tagsFor(v: DominoesView, action: DominoesAction): string[] {
  if (action.type !== 'play') return [];
  const tile = action.tile;
  const ends = endsOf(v.chain);
  if (v.hand.length === 1) return ['dom-domino'];
  if (!ends) {
    const { number } = strongestNumber(v.hand);
    return hasNumber(tile, number) ? ['dom-leads-strength'] : [];
  }
  const reading = readTable(v);
  const after = endsAfter(ends, tile, action.end);
  const tags: string[] = [];
  const opp = reading.cant[reading.nextOpp] ?? new Set<number>();
  if (opp.has(after[0]) && opp.has(after[1])) tags.push('dom-makes-pass');
  const covered = action.end === 'right' ? ends[1] : ends[0];
  const outer = action.end === 'right' ? after[1] : after[0];
  if (reading.partner >= 0 && reading.partnerSuits.has(covered) && !after.includes(covered)) tags.push('dom-covers-partner');
  else if (reading.partner >= 0 && reading.partnerSuits.has(outer)) tags.push('dom-plays-to-partner');
  if (reading.oppSuits.has(covered) && !after.includes(covered)) tags.push('dom-covers-opponent');
  if (isDouble(tile)) tags.push('dom-double');
  else if (tilePips(tile) >= 9) tags.push('dom-heavy');
  if (v.config.mode === 'partnership' && blocksNow(v, tile, after)) tags.push('dom-blocks');
  return tags;
}

function bestOf(scored: readonly { action: DominoesAction; margin: number }[], preferred: DominoesAction | null, rng: Rng): DominoesAction {
  const top = Math.max(...scored.map((x) => x.margin));
  if (preferred) {
    const p = scored.find((x) => actionText(x.action) === actionText(preferred));
    if (p && p.margin >= top - CONVENTION_MARGIN) return p.action;
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
  if (!endsOf(v.chain)) return heuristic(v, 3, rng);
  const conventional = heuristic(v, 3, rng);
  return bestOf(evaluateActions(v, params.samples, params.exactAt, rng), conventional, rng);
}

/** Coach answers: a hint, the best move for free play, and every move's value for review. */
function advise(v: DominoesView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(1, Math.min(300, Math.round(query.samples))) : 60;
  switch (query.type) {
    case 'hint':
    case 'best': {
      const legal = viewLegal(v);
      const action = legal.length === 1 ? (legal[0] as DominoesAction) : bestOf(evaluateActions(v, samples, 8, rng), heuristic(v, 3, rng), rng);
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
