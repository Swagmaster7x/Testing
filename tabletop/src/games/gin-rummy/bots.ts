/**
 * Gin Rummy CPU players (PLAN.md 2.4). The levels differ the way players do, measured head to head
 * over hundreds of games:
 *
 * 1. Throws the card that leaves the least deadwood, takes a discard only for a meld, knocks the
 *    moment it can.
 * 2. Also keeps pairs and near-runs, and does not feed you cards next to the ones you picked up;
 *    still knocks the moment it can.
 * 3. Plays as level 2 but holds out for gin until the stock runs low (knocking early against a
 *    player who keeps their hand together gets undercut, and gin scores far more).
 * 4. The generic determinized bot (src/ai/determinized.ts) on top: for each discard it deals the
 *    stock and the other hand with `sample` many times, draws its next two stock cards in each deal,
 *    and keeps the discard that gets it to a knock (or gin) soonest; it holds out for gin a little
 *    longer still.
 *
 * Bots see only their view. Strength comes from the number of sampled deals, never from time.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import { bestScored } from '../../ai/determinized';
import type { Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { Card } from '../classic/cards';
import { cardValue, deadwood, deadwoodOfMasks, ginRank, masksOf } from '../classic/melds';
import type { GinAction, GinState, GinView } from './rules';
import { actionText, canKnockWith, ginRummy, HAND_SIZE, knockLimit, unseenCards, viewLegal } from './rules';

export const GIN_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 700 },
  { level: 2, rating: 950 },
  { level: 3, rating: 1200 },
  { level: 4, rating: 1450 },
];

interface LevelParams {
  /** Sampled deals for the discard plan; 0 plays by the rules of thumb alone. */
  readonly samples: number;
  readonly policy: 1 | 2;
  readonly knock: KnockStyle;
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { samples: 0, policy: 1, knock: 'asap' },
  2: { samples: 0, policy: 2, knock: 'asap' },
  3: { samples: 0, policy: 2, knock: 'gin' },
  4: { samples: 30, policy: 2, knock: 'gin8' },
};

/** What a player knows: their hand, the pile, the cards the other took from it, the stock size. */
interface Seen {
  readonly hand: readonly Card[];
  readonly discard: readonly Card[];
  readonly theirs: readonly Card[];
  readonly stockCount: number;
  readonly limit: number;
  readonly taken: Card | null;
}

function seenOf(s: Pick<GinState, 'hands' | 'discard' | 'known' | 'upcard' | 'config' | 'taken'> & { stockCount?: number; stock?: readonly Card[] }, seat: Seat): Seen {
  return {
    hand: s.hands[seat] ?? [],
    discard: s.discard,
    theirs: s.known[seat === 0 ? 1 : 0] ?? [],
    stockCount: s.stockCount ?? s.stock?.length ?? 0,
    limit: knockLimit(s.config, s.upcard),
    taken: s.taken,
  };
}

/** How much a card is worth keeping for future melds: pairs and near-runs it belongs to. */
function potential(card: Card, hand: readonly Card[]): number {
  const r = ginRank(card);
  let p = 0;
  for (const c of hand) {
    if (c === card) continue;
    if (ginRank(c) === r) p += 1;
    else if (c[1] === card[1] && Math.abs(ginRank(c) - r) === 1) p += 1;
    else if (c[1] === card[1] && Math.abs(ginRank(c) - r) === 2) p += 0.5;
  }
  return p;
}

/** How likely a discard is to help the other player, from the cards they picked up. */
function danger(card: Card, theirs: readonly Card[]): number {
  let d = 0;
  for (const c of theirs) {
    if (ginRank(c) === ginRank(card)) d += 2;
    if (c[1] === card[1] && Math.abs(ginRank(c) - ginRank(card)) <= 2) d += 2;
  }
  return d;
}

/** The discard a heuristic player chooses from eleven cards, and the deadwood it leaves. */
export function heuristicDiscard(seen: Seen, policy: 1 | 2): { card: Card; left: number } {
  let best: { card: Card; score: number; left: number } | null = null;
  for (const card of seen.hand) {
    if (card === seen.taken) continue;
    const rest = seen.hand.filter((c) => c !== card);
    const left = deadwood(rest);
    let score = left * 10 - cardValue(card);
    if (policy === 2) {
      // Keep combinations that may become melds; do not hand the other player a card they collect.
      score += potential(card, rest) * 4 + danger(card, seen.theirs) * 6;
    }
    if (!best || score < best.score) best = { card, score, left };
  }
  return { card: (best as { card: Card }).card, left: (best as { left: number }).left };
}

/** True when taking the top discard helps enough. */
function wantsPile(seen: Seen, policy: 1 | 2): boolean {
  const top = seen.discard[seen.discard.length - 1];
  if (!top) return false;
  const now = deadwood(seen.hand);
  const withIt = heuristicDiscard({ ...seen, hand: [...seen.hand, top], taken: top }, policy).left;
  // Level 1 takes a card only when it melds at once; level 2 also when it cuts deadwood a lot.
  if (policy === 1) return withIt + cardValue(top) <= now - 1 && meldsWith(top, seen.hand);
  return withIt < now - 3 || (meldsWith(top, seen.hand) && withIt < now);
}

function meldsWith(card: Card, hand: readonly Card[]): boolean {
  const masks = masksOf([...hand, card]);
  const without = deadwoodOfMasks(masksOf(hand));
  return deadwoodOfMasks(masks) < without + cardValue(card);
}

/**
 * When to knock. "asap": whenever allowed; "patient": waits for a lower count while the stock is
 * still full; "gin": holds out for gin until the stock runs low.
 */
export type KnockStyle = 'asap' | 'patient' | 'gin' | 'low' | 'gin8';

function wantsKnock(left: number, seen: Seen, style: KnockStyle): boolean {
  if (left === 0 || style === 'asap') return true;
  if (style === 'gin') return left <= Math.min(seen.limit, seen.stockCount > 12 ? 0 : 10);
  if (style === 'gin8') return left <= Math.min(seen.limit, seen.stockCount > 8 ? 0 : 10);
  if (style === 'low') return left <= Math.min(seen.limit, seen.stockCount > 12 ? 3 : 10);
  return left <= Math.min(seen.limit, seen.stockCount > 20 ? 6 : seen.stockCount > 12 ? 8 : 10);
}

/** The heuristic move in any state (it reads only that seat's hand and what is public). */
export function policyMove(state: GinState, seat: Seat, policy: 1 | 2, knock: KnockStyle = policy === 1 ? 'asap' : 'patient'): GinAction {
  const seen = seenOf(state, seat);
  switch (state.phase) {
    case 'offer':
      return wantsPile(seen, policy) ? { type: 'take' } : { type: 'pass' };
    case 'draw':
      return !state.stockOnly && wantsPile(seen, policy) ? { type: 'pile' } : { type: 'stock' };
    default: {
      if (state.config.bigGin > 0 && seen.hand.length === HAND_SIZE + 1 && deadwood(seen.hand) === 0) return { type: 'big-gin' };
      const { card, left } = heuristicDiscard(seen, policy);
      if (canKnockWith(seen.hand.filter((c) => c !== card), seen.limit) && wantsKnock(left, seen, knock)) return { type: 'knock', card };
      return { type: 'discard', card };
    }
  }
}


/** The least deadwood after drawing `card` into ten cards and throwing the best card. */
function afterDraw(m: number[], card: Card): number {
  const s = 'cdhs'.indexOf(card[1] as string);
  const bit = 1 << ginRank(card);
  m[s] = (m[s] as number) | bit;
  let best = Infinity;
  for (let x = 0; x < 4; x++) {
    let bits = m[x] as number;
    while (bits) {
      const low = bits & -bits;
      bits &= bits - 1;
      m[x] = (m[x] as number) & ~low;
      const d = deadwoodOfMasks(m);
      m[x] = (m[x] as number) | low;
      if (d < best) best = d;
    }
  }
  m[s] = (m[s]) & ~bit;
  return best;
}

/** Ten cards plus one drawn: the hand after throwing the card that leaves the least deadwood. */
function drawAndThrow(hand: readonly Card[], card: Card | undefined): { hand: Card[]; left: number } {
  if (!card) return { hand: [...hand], left: deadwood(hand) };
  const eleven = [...hand, card];
  let best: { hand: Card[]; left: number } | null = null;
  for (const x of eleven) {
    const rest = eleven.filter((c) => c !== x);
    const left = deadwood(rest);
    if (!best || left < best.left) best = { hand: rest, left };
  }
  return best as { hand: Card[]; left: number };
}

/**
 * Level 4's plan for each discard (higher is better): the determinized search. Deal the stock and
 * the other hand with `sample` many times; in each deal draw your next two stock cards (every other
 * card, since the other player draws in between), throwing the best card each time, and score how
 * low the count gets and whether you could knock. Every discard is tried on the same deals; the
 * danger of feeding the cards the other player collects is taken off.
 */
export function planValues(v: GinView, samples: number, rng: Rng): Map<string, number> {
  const limit = knockLimit(v.config, v.upcard);
  const worlds = Array.from({ length: Math.max(1, samples) }, () => ginRummy.sample?.(v, v.seat, rng) as GinState);
  const out = new Map<string, number>();
  const theirs = v.known[v.seat === 0 ? 1 : 0] ?? [];
  for (const card of v.hand) {
    if (card === v.taken) continue;
    const rest = v.hand.filter((c) => c !== card);
    let total = 0;
    for (const w of worlds) {
      const one = drawAndThrow(rest, w.stock[1] ?? w.stock[0]);
      const two = drawAndThrow(one.hand, w.stock[3] ?? w.stock[2]);
      total += -two.left + (one.left <= limit ? 8 : 0) + (two.left <= limit ? 4 : 0);
    }
    out.set(card, total / worlds.length - 0.6 * danger(card, theirs) - 0.25 * deadwood(rest));
  }
  return out;
}

export interface MoveValue {
  readonly action: GinAction;
  readonly value: number;
}

/**
 * Every legal move valued for the coach and the review (higher is better, in deadwood points):
 * draws by the deadwood expected afterwards (a stock card averaged over every card you cannot see),
 * discards by level 4's plan, a knock as its discard with a little more for ending the hand while
 * the count is low.
 */
export function moveValues(v: GinView, samples: number, rng: Rng): MoveValue[] {
  const legal = viewLegal(v);
  if (v.phase !== 'discard') {
    const unseen = unseenCards(v);
    const m = masksOf(v.hand);
    const top = v.discard[v.discard.length - 1];
    let stock = 0;
    for (const c of unseen) stock += afterDraw(m, c);
    stock /= Math.max(1, unseen.length);
    return legal.map((action) => ({ action, value: (action.type === 'pile' || action.type === 'take') && top ? -afterDraw(m, top) : -stock }));
  }
  const plan = planValues(v, samples, rng);
  const limit = knockLimit(v.config, v.upcard);
  return legal.map((action) => {
    if (action.type === 'big-gin') return { action, value: 100 };
    if (action.type === 'knock') {
      const left = deadwood(v.hand.filter((c) => c !== action.card));
      return { action, value: (plan.get(action.card) ?? 0) + (left === 0 ? 30 : 4 - (4 * left) / Math.max(1, limit)) };
    }
    return { action, value: action.type === 'discard' ? (plan.get(action.card) ?? 0) : 0 };
  });
}

function asState(v: GinView): GinState {
  return { ...v, hands: v.seat === 0 ? [v.hand, []] : [[], v.hand], stockCount: v.stockCount } as unknown as GinState;
}

export function chooseAction(v: GinView, level: number, rng: Rng): GinAction {
  const params = LEVEL_PARAMS[level];
  if (!params) throw new Error(`Gin Rummy has no level ${level}`);
  const state = asState(v);
  const rule = policyMove(state, v.seat, params.policy, params.knock);
  if (params.samples === 0 || v.phase !== 'discard' || rule.type !== 'discard') return rule;
  // Gin, big gin and the knock follow the rules of thumb; the plan chooses what to throw.
  const plan = planValues(v, params.samples, rng);
  return bestScored(
    [...plan.entries()].map(([card, value]) => ({ action: { type: 'discard', card: card as Card }, value })),
    rng,
  );
}

export function tagsFor(v: GinView, action: GinAction): string[] {
  switch (action.type) {
    case 'take':
    case 'pile':
      return ['gin-takes-discard'];
    case 'knock':
      return deadwood(v.hand.filter((c) => c !== action.card)) === 0 ? ['gin-gin'] : ['gin-knocks'];
    case 'big-gin':
      return ['gin-gin'];
    case 'discard':
      return danger(action.card, v.known[v.seat === 0 ? 1 : 0] ?? []) === 0 ? ['gin-safe-discard'] : ['gin-sheds'];
    default:
      return [];
  }
}

function advise(v: GinView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const samples = typeof query.samples === 'number' ? Math.max(4, Math.min(80, Math.round(query.samples))) : 24;
  switch (query.type) {
    case 'hint':
    case 'best': {
      const action = chooseAction(v, 4, rng);
      return { action: actionText(action), tags: tagsFor(v, action) };
    }
    case 'analyse':
      return { moves: moveValues(v, samples, rng).map((x) => ({ action: actionText(x.action), value: Math.round(x.value * 10) / 10 })) };
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const ginBots: BotSet<GinView, GinAction> = {
  gameId: 'gin-rummy',
  levels: GIN_LEVELS,
  choose({ view, level, rng }: BotInput<GinView>): BotChoice<GinAction> {
    const action = chooseAction(view, level, rng);
    return { action, tags: tagsFor(view, action), nodes: LEVEL_PARAMS[level]?.samples ?? 0 };
  },
  advise: ({ view, query, rng }) => advise(view, query, rng),
  encode: (action) => ginRummy.codec.action.toJSON(action),
};
