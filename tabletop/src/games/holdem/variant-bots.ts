/**
 * The CPU for Omaha, Five-Card Draw and Seven-Card Stud (PLAN.md 2.4: the generic determinized
 * bot, with heuristics on top). To judge a hand it deals the cards it cannot see many times over,
 * plays every deal out to the showdown (in Draw, everyone draws by the standard strategy below)
 * and counts its share of the pot. Then it bets by its style, as the Hold'em bots do: value bets
 * and raises with a strong share, calls when the share beats the price, bluffs now and then.
 * Levels differ in the number of deals, in how far they misjudge their share, and in how well they
 * heed the price; level 1 also draws carelessly.
 */
import type { Seat } from '../../core/contract';
import type { Rng } from '../../core/rng';
import type { Decision, Style } from './bots';
import { STYLE_PARAMS } from './bots';
import type { Card } from './cards';
import { cardIndex } from './cards';
import { categoryOf, evaluate } from './evaluate';
import type { HoldemAction, HoldemState, HoldemView, Player } from './rules';
import { bringInDue, inHand, legalOf, potOf, sampleState, STREETS_OF, toCallOf } from './rules';
import { highValue, lowValue } from './showdown';

const SAMPLES: Readonly<Record<number, number>> = { 1: 40, 2: 80, 3: 120, 4: 200, 5: 300, 6: 400 };
const NOISE: Readonly<Record<number, number>> = { 1: 0.16, 2: 0.09, 3: 0.06, 4: 0.04, 5: 0.025, 6: 0.015 };
/** How far each level heeds the price (1 fully). */
const PRICE: Readonly<Record<number, number>> = { 1: 0.4, 2: 0.75, 3: 0.9, 4: 1, 5: 1, 6: 1 };

const rankOf = (c: Card) => cardIndex(c) >> 2;
const suitOf = (c: Card) => c[1];

/**
 * Standard Five-Card Draw strategy: stand pat on a straight or better; keep trips, two pair or a
 * pair and draw to them; draw one to four of a flush or an open-ended straight; otherwise keep the
 * two highest cards. Never more than `maxDraw`. `careless` keeps a kicker or chases an inside straight.
 */
export function drawStrategy(hole: readonly Card[], maxDraw: number, careless = false): Card[] {
  const cat = categoryOf(evaluate(hole));
  if (cat === 'straight' || cat === 'flush' || cat === 'full-house' || cat === 'quads' || cat === 'straight-flush') return [];
  const byRank = new Map<number, Card[]>();
  for (const c of hole) byRank.set(rankOf(c), [...(byRank.get(rankOf(c)) ?? []), c]);
  const groups = [...byRank.values()].sort((a, b) => b.length - a.length || rankOf(b[0] as Card) - rankOf(a[0] as Card));
  const keepOnly = (keep: readonly Card[]) => hole.filter((c) => !keep.includes(c)).slice(0, maxDraw);
  if (cat === 'trips' || cat === 'two-pair' || cat === 'pair') {
    const made = groups.filter((g) => g.length >= 2).flat();
    if (careless && cat === 'pair') {
      // Keeping a kicker with a pair: a common mistake.
      const kicker = groups.find((g) => g.length === 1);
      return keepOnly([...made, ...(kicker ?? [])]);
    }
    return keepOnly(made);
  }
  // Four of a suit.
  for (const s of ['c', 'd', 'h', 's']) {
    const suited = hole.filter((c) => suitOf(c) === s);
    if (suited.length === 4) return keepOnly(suited);
  }
  // Four in a row (open-ended), or with a gap when careless.
  const ranks = [...new Set(hole.map(rankOf))].sort((a, b) => a - b);
  for (let i = 0; i + 3 < ranks.length; i++) {
    const span = (ranks[i + 3] as number) - (ranks[i] as number);
    if (span === 3 || (careless && span === 4)) {
      const run = ranks.slice(i, i + 4);
      return keepOnly(hole.filter((c) => run.includes(rankOf(c))).slice(0, 4));
    }
  }
  const high = [...hole].sort((a, b) => rankOf(b) - rankOf(a)).slice(0, 2);
  return keepOnly(high);
}

/** Plays a sampled deal out to the showdown with no more betting, and returns `seat`'s share of the pot. */
function playOut(s: HoldemState, seat: Seat, rng: Rng): number {
  const game = s.config.game;
  const deck = [...s.deck];
  const take = () => deck.shift() ?? rng.pick(s.discards);
  const live = s.players.map((p, i) => ({ i, p })).filter(({ p }) => inHand(p));
  const hands = new Map<Seat, { hole: Card[]; up: Card[] }>(live.map(({ i, p }) => [i, { hole: [...p.hole], up: [...p.up] }]));
  const board = [...s.board];
  if (game === 'holdem' || game === 'omaha') {
    while (board.length < 5) board.push(take());
  } else if (game === 'stud') {
    for (const hand of hands.values()) while (hand.hole.length + hand.up.length < 7) hand.hole.push(take());
  } else if (game === 'draw' && STREETS_OF.draw.indexOf(s.street) <= 1) {
    for (const [i, hand] of hands) {
      if ((s.players[i] as Player).drew !== null) continue;
      const out = drawStrategy(hand.hole, s.config.maxDraw);
      hand.hole = [...hand.hole.filter((c) => !out.includes(c)), ...out.map(() => take())];
    }
  }
  const high = new Map<Seat, number>();
  const low = new Map<Seat, number | null>();
  for (const [i, hand] of hands) {
    high.set(i, highValue(game, hand.hole, hand.up, board));
    if (s.config.split === 'high-low') low.set(i, lowValue(game, hand.hole, hand.up, board));
  }
  const top = Math.max(...high.values());
  const highWinners = [...high.keys()].filter((i) => high.get(i) === top);
  const lows = [...low.entries()].filter(([, v]) => v !== null) as [Seat, number][];
  let share = highWinners.includes(seat) ? 1 / highWinners.length : 0;
  if (lows.length > 0) {
    const best = Math.min(...lows.map(([, v]) => v));
    const lowWinners = lows.filter(([, v]) => v === best).map(([i]) => i);
    share = share / 2 + (lowWinners.includes(seat) ? 0.5 / lowWinners.length : 0);
  }
  return share;
}

/** A seat's share of the pot, by dealing the unseen cards `samples` times and playing each deal out. */
export function sampledEquity(v: HoldemView, seat: Seat, samples: number, rng: Rng): number {
  let total = 0;
  for (let k = 0; k < samples; k++) total += playOut(sampleState(v, rng), seat, rng);
  return samples > 0 ? total / samples : 0;
}

function gaussian(rng: Rng): number {
  const u = Math.max(1e-9, rng.next());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng.next());
}

/** The legal raise closest to `to`. */
function nearestRaise(legal: readonly HoldemAction[], to: number): HoldemAction | null {
  const raises = legal.filter((a): a is { type: 'raise'; to: number } => a.type === 'raise');
  if (raises.length === 0) return null;
  return raises.reduce((best, a) => (Math.abs(a.to - to) < Math.abs(best.to - to) ? a : best));
}

/** A decision for a CPU seat in Omaha, Draw or Stud. */
export function variantDecide(v: HoldemView, seat: Seat, level: number, style: Style, rng: Rng): Decision {
  const legal = legalOf(v, seat);
  if (legal.length === 0) throw new Error('Not this seat’s turn');
  const me = v.players[seat] as Player;
  if (v.street === 'draw') {
    const discard = drawStrategy(me.hole, v.config.maxDraw, level <= 1 && rng.next() < 0.5);
    return { action: { type: 'draw', discard }, tags: [discard.length === 0 ? 'stand-pat' : 'draw'], equity: null };
  }
  const params = STYLE_PARAMS[style];
  const noise = NOISE[level] ?? 0.06;
  const raw = sampledEquity(v, seat, SAMPLES[level] ?? 120, rng);
  // Equity is against any hands; a bet and each raise this round say the hands against are better.
  const facing = toCallOf(v, seat) > 0 ? Math.max(1, v.raises) : 0;
  const read = level >= 3 ? 0.85 ** facing : 1;
  const eq = Math.max(0, Math.min(1, raw * read + gaussian(rng) * noise));
  const live = v.players.filter((p) => inHand(p)).length;
  // Strength against a fair share: heads-up the equity itself; more players, more each share is worth.
  const rel = Math.min(1, (eq * (live + 1)) / 3);
  const pot = potOf(v);
  const owe = Math.min(toCallOf(v, seat), me.stack);
  const sized = (fraction: number) => nearestRaise(legal, v.currentBet + Math.max(v.blinds.bb, (pot + owe) * fraction));
  const result = (action: HoldemAction | null, tags: string[]): Decision => ({ action: action ?? (owe > 0 ? { type: 'call' } : { type: 'check' }), tags, equity: eq });

  if (bringInDue(v)) {
    // Stud's bring-in: complete with a strong start, otherwise bring it in for the least.
    const [bringIn, complete] = legal;
    return result(rel >= params.value && complete ? complete : (bringIn ?? null), [rel >= params.value ? 'value' : 'bring-in']);
  }
  if (owe === 0) {
    if (rel >= params.value) return result(sized(params.sizing), ['value']);
    if (rel < 0.35 && rng.next() < params.bluff * (live === 2 ? 1 : 0.5)) return result(sized(params.sizing), ['bluff']);
    return result({ type: 'check' }, ['check']);
  }
  const price = owe / (pot + owe);
  const heed = PRICE[level] ?? 1;
  const need = price * heed * params.sticky + (1 - heed) * 0.25;
  if (rel >= params.raise) return result(sized(0.8) ?? { type: 'call' }, ['value']);
  if (eq >= need) return result({ type: 'call' }, ['pot-odds']);
  if (rng.next() < params.bluffRaise) {
    const r = sized(0.8);
    if (r) return result(r, ['bluff']);
  }
  return result({ type: 'fold' }, ['price']);
}

/** Option values for the review in the variants: the equity share of the pot against any hands, less the price. */
export function variantOptionValues(v: HoldemView, seat: Seat, samples: number, rng: Rng): { action: string; ev: number; equity: number; tags: string[] }[] {
  const legal = legalOf(v, seat);
  const me = v.players[seat] as Player;
  if (v.street === 'draw') return [];
  const eq = sampledEquity(v, seat, samples, rng);
  const pot = potOf(v);
  const owe = Math.min(toCallOf(v, seat), me.stack);
  const others = v.players.filter((p, i) => i !== seat && inHand(p)).length;
  return legal.map((a) => {
    if (a.type === 'fold') return { action: 'fold', ev: 0, equity: eq, tags: ['price'] };
    if (a.type === 'call' || a.type === 'check') return { action: a.type, ev: eq * (pot + owe) - owe, equity: eq, tags: ['pot-odds'] };
    if (a.type === 'raise') {
      const add = a.to - me.bet;
      // Called by one player: the share of a bigger pot, less the chips added.
      return { action: `r${a.to}`, ev: eq * (pot + add + Math.min(add, a.to - v.currentBet + owe) * Math.min(1, others)) - add, equity: eq, tags: [eq >= 0.5 ? 'value' : 'bluff'] };
    }
    return { action: 'd', ev: 0, equity: eq, tags: [] };
  });
}
