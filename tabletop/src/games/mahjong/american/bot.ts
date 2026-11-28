/**
 * The American CPU (milestone 14c): it plays from the card. Every decision weighs the hands on the
 * card the tiles could still become: how many tiles each still needs (jokers filling sets), what it
 * is worth, and how many tiles of each kind are still out of sight. Levels add knowledge in the
 * order a player learns it:
 *
 *   1  picks a hand after the Charleston and sticks to it, slips often, never exchanges a joker;
 *   2  follows the nearest hand each turn, but ignores what is out of sight;
 *   3  counts the tiles still to be found, keeps tiles that serve several near hands, exchanges
 *      jokers, and passes blind when it has fewer than three tiles to spare;
 *   4  also weighs value, holds back tiles a player with exposures may want, and votes in the
 *      Charleston by how far its hand is from anything.
 */
import type { Seat } from '../../../core/contract';
import type { Rng } from '../../../core/rng';
import type { MahjongAction } from '../core/engine';
import type { Kind } from '../core/tiles';
import { isSuited, JOKER, KIND_COUNT, kindOf, suitOf } from '../core/tiles';
import type { MahjongView } from '../rules';
import { cardOf, exposureOf } from '../styles/american';
import type { Exposure, Variant } from './card';
import { amCounts, amKind, cardVariants, distance, JOKERS } from './card';

export interface AmericanDecision {
  readonly action: MahjongAction;
  readonly tags: readonly string[];
}

/** What each level knows and does (exported so the ladder experiments can vary one thing at a time). */
export interface AmericanLevel {
  /** Chance of throwing the second-best tile. */
  readonly slip: number;
  /** Keeps to one of its three nearest hands (a novice), rather than the nearest each turn. */
  readonly fixed: boolean;
  /** Counts what is out of sight: a single or pair whose tiles are gone is out of reach. */
  readonly availability: boolean;
  /** Weight of keeping several near hands open. */
  readonly flexibility: number;
  /** Weight of a hand's points. */
  readonly value: number;
  /** Weight of the danger of feeding a player with exposures. */
  readonly danger: number;
  /** A tile still to find counts more the fewer copies are left (0: every tile alike). */
  readonly scarcity: number;
  readonly swap: boolean;
  /** Passes blind when it has fewer than three tiles to spare; offers tiles in the courtesy pass. */
  readonly blind: boolean;
  readonly courtesy: boolean;
  /** Votes for the second Charleston while its nearest hand is at least this far (0: at random). */
  readonly vote: number;
  /** An exposure must bring a hand this many tiles closer than not calling. */
  readonly callGain: number;
}

// Measured against level 3 (PROGRESS-M14c.md): scarcity 0.5 alone scores 0.623 over 200 games; with the
// weights on points (0.1) and on feeding exposures (6) as well, 0.595; those two without scarcity, 0.483 over 60.
const TOP: AmericanLevel = { slip: 0, fixed: false, availability: true, flexibility: 8, value: 0, danger: 0, scarcity: 0.5, swap: true, blind: true, courtesy: true, vote: 5, callGain: 1 };

export const AMERICAN_LEVELS: Readonly<Record<number, AmericanLevel>> = {
  1: { slip: 0.3, fixed: true, availability: false, flexibility: 0, value: 0, danger: 0, scarcity: 0, swap: false, blind: false, courtesy: false, vote: 0, callGain: 0 },
  2: { slip: 0.1, fixed: false, availability: false, flexibility: 0, value: 0, danger: 0, scarcity: 0, swap: true, blind: false, courtesy: true, vote: 4, callGain: 1 },
  3: { slip: 0, fixed: false, availability: true, flexibility: 8, value: 0, danger: 0, scarcity: 0, swap: true, blind: true, courtesy: true, vote: 4, callGain: 1 },
  4: TOP,
};

interface Picture {
  readonly params: AmericanLevel;
  readonly view: MahjongView;
  readonly seat: Seat;
  readonly variants: readonly Variant[];
  readonly counts: readonly number[];
  readonly jokers: number;
  readonly exposures: readonly Exposure[];
  /** Copies of each normalized kind not in sight (flowers as one kind). */
  readonly unseen: readonly number[];
  readonly level: number;
}

const NATURAL: Readonly<Record<number, number>> = { 34: 8 };

function picture(view: MahjongView, level: number): Picture {
  const seat = view.seat;
  const jokerCount = view.config.options.jokers === 10 ? 10 : JOKERS;
  const variants = cardVariants(cardOf(view.config.options), jokerCount);
  const mine = amCounts(view.hand.map(kindOf));
  const seen = new Array<number>(KIND_COUNT).fill(0);
  const see = (k: Kind) => (seen[amKind(k)] = (seen[amKind(k)] ?? 0) + 1);
  for (const t of view.hand) see(kindOf(t));
  for (const list of view.melds) for (const m of list) for (const t of m.tiles) see(kindOf(t));
  for (const list of view.discards) for (const d of list) if (!d.claimed) see(kindOf(d.tile));
  const unseen = seen.map((n, k) => Math.max(0, (NATURAL[k] ?? (k === JOKER ? jokerCount : 4)) - n));
  const params = AMERICAN_LEVELS[level] ?? TOP;
  return { params, view, seat, variants, counts: mine.counts, jokers: mine.jokers, exposures: (view.melds[seat] ?? []).map(exposureOf), unseen, level };
}

/** The nearest hands for these tiles: each variant's distance, best first (unreachable ones left out). */
function ranked(p: Picture, counts: readonly number[], jokers: number, exposures: readonly Exposure[]): { v: Variant; d: number }[] {
  const out: { v: Variant; d: number }[] = [];
  const unseen = p.params.availability ? p.unseen : undefined;
  for (const v of p.variants) {
    let d = distance(v, counts, jokers, exposures, unseen);
    if (p.params.scarcity > 0 && Number.isFinite(d)) d += p.params.scarcity * scarce(v, counts, p.unseen);
    if (Number.isFinite(d)) out.push({ v, d });
  }
  return out.sort((a, b) => a.d - b.d || b.v.hand.points - a.v.hand.points);
}

/**
 * How good a set of tiles is: fewer tiles needed above all, then (from level 3) several hands
 * within reach, then (level 4) value.
 */
function worth(p: Picture, counts: readonly number[], jokers: number, exposures: readonly Exposure[]): number {
  const r = ranked(p, counts, jokers, exposures);
  const best = r[0];
  if (!best) return -1000;
  let w = -100 * best.d;
  if (p.params.flexibility > 0) w += p.params.flexibility * r.filter((x) => x.d <= best.d + 1).length ** 0.5;
  if (p.params.value > 0) w += p.params.value * best.v.hand.points;
  return w;
}

/** How hard the missing natural tiles of a variant are to find: for each, one over the copies still unseen. */
function scarce(v: Variant, counts: readonly number[], unseen: readonly number[]): number {
  let s = 0;
  for (let k = 0; k < KIND_COUNT; k++) {
    const need = (v.strict[k] ?? 0) - (counts[k] ?? 0);
    if (need > 0) s += need / Math.max(1, unseen[k] ?? 0);
  }
  return s;
}

const without = (counts: readonly number[], k: Kind, n = 1): number[] => {
  const c = [...counts];
  c[k] = (c[k] ?? 0) - n;
  return c;
};

/** The danger of throwing a kind (level 4): a player with exposures may want more of those suits and numbers. */
function danger(p: Picture, k: Kind): number {
  let d = 0;
  for (let s = 0; s < 4; s++) {
    if (s === p.seat || p.view.dead[s]) continue;
    const melds = p.view.melds[s] ?? [];
    if (melds.length < 2) continue;
    for (const m of melds) {
      const e = exposureOf(m);
      if (e.kind === k) d += 1.5;
      else if (isSuited(k) && isSuited(e.kind) && suitOf(k) === suitOf(e.kind)) d += 0.4;
    }
    d *= melds.length >= 3 ? 2 : 1;
  }
  return d;
}

/** The tile to throw: the one whose loss hurts least; never a joker while anything else will do. */
function chooseDiscard(p: Picture, rng: Rng, fixed: Variant | null): AmericanDecision {
  const options = p.view.options.filter((a): a is { type: 'discard'; tile: Kind } => a.type === 'discard');
  const scored = options.map((a) => {
    const k = amKind(a.tile);
    let w: number;
    if (a.tile === JOKER) w = worth(p, p.counts, p.jokers - 1, p.exposures) - 50;
    else if (fixed) w = -100 * distance(fixed, without(p.counts, k), p.jokers, p.exposures);
    else w = worth(p, without(p.counts, k), p.jokers, p.exposures);
    if (p.params.danger > 0) w -= p.params.danger * danger(p, k);
    return { a, w };
  });
  scored.sort((x, y) => y.w - x.w);
  const slip = p.params.slip;
  const chosen = slip > 0 && scored.length > 1 && rng.next() < slip ? (scored[1] ?? scored[0]) : scored[0];
  return { action: chosen?.a ?? (p.view.options[0] as MahjongAction), tags: [] };
}

/** Tiles to pass: the ones whose loss hurts least, one at a time (never a joker: the engine refuses them). */
function passTiles(p: Picture, count: number): { kind: Kind; loss: number }[] {
  let counts = [...p.counts];
  const out: { kind: Kind; loss: number }[] = [];
  const hand = p.view.hand.map(kindOf).filter((k) => k !== JOKER);
  for (let i = 0; i < count; i++) {
    const now = worth(p, counts, p.jokers, p.exposures);
    let best: { kind: Kind; loss: number; raw: Kind } | null = null;
    for (const raw of new Set(hand)) {
      const k = amKind(raw);
      if ((counts[k] ?? 0) <= 0) continue;
      const loss = now - worth(p, without(counts, k), p.jokers, p.exposures);
      if (!best || loss < best.loss) best = { kind: k, loss, raw };
    }
    if (!best) break;
    out.push({ kind: best.raw, loss: best.loss });
    counts = without(counts, best.kind);
    hand.splice(hand.indexOf(best.raw), 1);
  }
  return out;
}

function choosePass(p: Picture, rng: Rng): AmericanDecision {
  const options = p.view.options;
  if (options.some((a) => a.type === 'vote')) {
    // Go on with the second Charleston while the hand is far from anything.
    const best = ranked(p, p.counts, p.jokers, p.exposures)[0];
    const yes = p.params.vote === 0 ? rng.next() < 0.5 : (best?.d ?? 99) >= p.params.vote;
    return { action: { type: 'vote', yes }, tags: [] };
  }
  const passes = options.filter((a): a is { type: 'pass-tiles'; tiles: readonly Kind[]; blind: number } => a.type === 'pass-tiles');
  const round = passes.length > 0 ? Math.max(...passes.map((a) => a.tiles.length + a.blind)) : 3;
  const courtesy = passes.some((a) => a.tiles.length === 0 && a.blind === 0);
  const blindAllowed = passes.some((a) => a.blind > 0);
  const picks = passTiles(p, round);
  let own = picks;
  if (courtesy) own = p.params.courtesy ? picks.filter((x) => x.loss <= 0) : [];
  else if (blindAllowed && p.params.blind) own = picks.filter((x, i) => i === 0 || x.loss <= 0);
  const kinds = own.map((x) => x.kind).sort((a, b) => a - b).join('.');
  const blind = courtesy ? 0 : round - own.length;
  const found = passes.find((a) => [...a.tiles].sort((x, y) => x - y).join('.') === kinds && a.blind === blind) ?? passes.find((a) => a.blind === 0 && a.tiles.length === (courtesy ? 0 : round));
  return { action: found ?? (options[0] as MahjongAction), tags: [] };
}

function chooseClaim(p: Picture): AmericanDecision {
  const options = p.view.options;
  if (options.some((a) => a.type === 'win')) return { action: { type: 'win' }, tags: ['mj-win'] };
  const claim = p.view.claim;
  const pass: AmericanDecision = { action: { type: 'pass' }, tags: [] };
  if (!claim) return pass;
  const k = amKind(kindOf(claim.tile));
  const nowBest = ranked(p, p.counts, p.jokers, p.exposures)[0]?.d ?? 99;
  let best: { a: MahjongAction; d: number; jokers: number } | null = null;
  for (const a of options) {
    if (a.type !== 'expose') continue;
    const naturals = a.size - 1 - a.jokers;
    const counts = without(p.counts, k, naturals);
    const exposures = [...p.exposures, { kind: k, size: a.size, jokers: a.jokers }];
    const d = ranked(p, counts, p.jokers - a.jokers, exposures)[0]?.d ?? 99;
    if (!best || d < best.d || (d === best.d && a.jokers < best.jokers)) best = { a, d, jokers: a.jokers };
  }
  // The call must bring a hand on the card closer (the called tile is one tile nearer by itself).
  const need = p.params.callGain;
  if (best && best.d <= nowBest - need && best.d < 99) return { action: best.a, tags: ['mj-call-speed'] };
  return pass;
}

/** Joker exchanges that leave the hand no worse (a joker is worth at least the tile it replaces in a set). */
function chooseSwap(p: Picture): AmericanDecision | null {
  if (!p.params.swap) return null;
  const now = worth(p, p.counts, p.jokers, p.exposures);
  for (const a of p.view.options) {
    if (a.type !== 'swap') continue;
    const m = p.view.melds[a.seat]?.[a.meld];
    if (!m) continue;
    const k = exposureOf(m).kind;
    const after = worth(p, without(p.counts, k), p.jokers + 1, p.exposures);
    if (after >= now) return { action: a, tags: ['mj-swap'] };
  }
  return null;
}

/** Level 1's hand, picked once the Charleston is over and kept. */
function fixedTarget(p: Picture): Variant | null {
  if (!p.params.fixed) return null;
  const r = ranked(p, p.counts, p.jokers, p.exposures);
  // The same hand for the whole deal: the nearest at the first throw, found again from the seat's discards so far.
  const seedKey = `${p.view.handNo}/${p.seat}`;
  let h = 0;
  for (const c of seedKey) h = (h * 31 + c.charCodeAt(0)) % 9973;
  const near = r.slice(0, 3);
  return near[h % Math.max(1, near.length)]?.v ?? null;
}

export function americanDecide(view: MahjongView, level: number, rng: Rng): AmericanDecision {
  const options = view.options;
  if (options.length === 1) return { action: options[0] as MahjongAction, tags: options[0]?.type === 'win' ? ['mj-win'] : [] };
  const p = picture(view, level);
  if (view.phase === 'pass') return choosePass(p, rng);
  if (view.phase === 'claim' || view.phase === 'rob') return chooseClaim(p);
  if (options.some((a) => a.type === 'win')) return { action: { type: 'win' }, tags: ['mj-win'] };
  const swap = chooseSwap(p);
  if (swap) return swap;
  return chooseDiscard(p, rng, fixedTarget(p));
}

/** Every throw open to a seat with how good the tiles left are (higher is better) and how far the nearest hand then is, for the review. */
export function discardWorths(view: MahjongView, level = 4): { kind: Kind; worth: number; distance: number }[] {
  const p = picture(view, level);
  return view.options
    .filter((a): a is { type: 'discard'; tile: Kind } => a.type === 'discard')
    .map((a) => {
      const k = amKind(a.tile);
      const counts = a.tile === JOKER ? p.counts : without(p.counts, k);
      const jokers = a.tile === JOKER ? p.jokers - 1 : p.jokers;
      const r = ranked(p, counts, jokers, p.exposures);
      return { kind: a.tile, worth: worth(p, counts, jokers, p.exposures) - (a.tile === JOKER ? 50 : 0), distance: r[0]?.d ?? 99 };
    });
}

/** The hands within reach for a view, for the coach: each card hand's nearest reading and how many tiles it needs. */
export function handsInReach(view: MahjongView, limit = 5): { id: string; text: string; section: string; points: number; concealed: boolean; need: number }[] {
  const p = picture(view, 3);
  const seen = new Set<string>();
  const out: { id: string; text: string; section: string; points: number; concealed: boolean; need: number }[] = [];
  for (const { v, d } of ranked(p, p.counts, p.jokers, p.exposures)) {
    if (seen.has(v.hand.id)) continue;
    seen.add(v.hand.id);
    out.push({ id: v.hand.id, text: v.hand.text, section: v.hand.section, points: v.hand.points, concealed: v.hand.concealed, need: d });
    if (out.length >= limit) break;
  }
  return out;
}
