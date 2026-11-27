/**
 * The Hold'em CPU (PLAN.md 2.4): style bots built from preflop range charts, equity against an
 * assumed range, pot odds and sizing rules, with mixed frequencies.
 *
 * Two things set a CPU seat apart. Its **style** is a personality: a rock (few hands, rarely
 * bluffs), a calling station (calls too much), a maniac (bets and raises with anything), tight-
 * aggressive, loose-aggressive, and solid. Its **level** is how well it plays that style: levels 1
 * and 2 judge hands against any two cards and misjudge by a wide margin; levels 3 and 4 put
 * opponents on ranges from their actions; levels 5 and 6 also read each opponent's session
 * statistics and exploit them (value-bet a calling station thinner, bluff a rock more), with more
 * samples. Each level also seats a different mix of styles, weak styles at the low levels.
 *
 * A seat's style comes from the table's public number and the seat, so it is fixed for a session
 * and shown when the session ends (see `styleOf`).
 */
import type { AdviseInput, BotChoice, BotLevel, BotSet } from '../../ai/bot';
import type { Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card } from './cards';
import { cardIndex, cardOf, handClass } from './cards';
import type { Combo, Range } from './equity';
import { ANY_HAND, exactEquity, rangeEquity, withoutDead } from './equity';
import { openFraction, rankOf } from './preflop';
import type { Read } from './reading';
import { estimateRange, outs, readFromStats, readHand, TYPICAL } from './reading';
import type { HoldemAction, HoldemView, PlayerView } from './rules';
import { actionText, dealtOrder, potOf, positionName, raiseRange, seatsInHand, toCallOf } from './rules';

export type Style = 'rock' | 'station' | 'maniac' | 'tag' | 'lag' | 'solid';
export const STYLES: readonly Style[] = ['rock', 'station', 'maniac', 'tag', 'lag', 'solid'];

interface StyleParams {
  /** Multiplies the share of hands played. */
  readonly loose: number;
  /** Chance of limping instead of raising a hand it plays. */
  readonly limp: number;
  /** Open-raise size in big blinds. */
  readonly open: number;
  /** Share of hands it re-raises with, and flat-calls with, against a typical opening raise. */
  readonly threeBet: number;
  readonly call: number;
  /** Chance of re-raising as a bluff with a hand just outside its range. */
  readonly bluff3: number;
  /** Strength (equity against what it fears, heads-up terms) to bet for value, and to raise. */
  readonly value: number;
  readonly raise: number;
  /** Multiplies the equity it needs to call: below 1 calls too much. */
  readonly sticky: number;
  readonly cbet: number;
  readonly semi: number;
  readonly bluff: number;
  readonly bluffRaise: number;
  /** Bet size as a share of the pot. */
  readonly sizing: number;
  /** Chance of checking a very strong hand to trap. */
  readonly trap: number;
}

export const STYLE_PARAMS: Readonly<Record<Style, StyleParams>> = {
  rock: { loose: 0.6, limp: 0.1, open: 3, threeBet: 0.025, call: 0.05, bluff3: 0, value: 0.68, raise: 0.85, sticky: 1.25, cbet: 0.45, semi: 0.15, bluff: 0.03, bluffRaise: 0, sizing: 0.6, trap: 0.15 },
  station: { loose: 1.5, limp: 0.8, open: 3, threeBet: 0.012, call: 0.35, bluff3: 0, value: 0.72, raise: 0.92, sticky: 0.55, cbet: 0.25, semi: 0.05, bluff: 0.02, bluffRaise: 0, sizing: 0.45, trap: 0.05 },
  maniac: { loose: 2, limp: 0.05, open: 4, threeBet: 0.16, call: 0.12, bluff3: 0.4, value: 0.48, raise: 0.62, sticky: 0.85, cbet: 0.9, semi: 0.7, bluff: 0.45, bluffRaise: 0.18, sizing: 0.95, trap: 0.05 },
  tag: { loose: 1, limp: 0, open: 2.5, threeBet: 0.055, call: 0.09, bluff3: 0.15, value: 0.6, raise: 0.78, sticky: 1, cbet: 0.65, semi: 0.45, bluff: 0.12, bluffRaise: 0.05, sizing: 0.66, trap: 0.1 },
  lag: { loose: 1.35, limp: 0, open: 2.5, threeBet: 0.085, call: 0.12, bluff3: 0.3, value: 0.56, raise: 0.74, sticky: 0.92, cbet: 0.75, semi: 0.6, bluff: 0.22, bluffRaise: 0.1, sizing: 0.72, trap: 0.1 },
  solid: { loose: 1.05, limp: 0, open: 2.5, threeBet: 0.065, call: 0.1, bluff3: 0.2, value: 0.57, raise: 0.76, sticky: 1, cbet: 0.62, semi: 0.5, bluff: 0.15, bluffRaise: 0.06, sizing: 0.66, trap: 0.12 },
};

interface Skill {
  /** Monte Carlo samples for equity. */
  readonly samples: number;
  /** Reads opponents' ranges from their actions; otherwise assumes any two cards. */
  readonly ranges: boolean;
  /** Spread of its errors in judging equity. */
  readonly noise: number;
  /** How far it heeds pot odds (1 fully). */
  readonly potOdds: number;
  /** Reads session statistics and exploits them. */
  readonly stats: boolean;
  /** Chance of a human-looking slip: chasing a draw without the odds. */
  readonly slip: number;
  /** Weighs every option by expected value, with fold equity, instead of fixed thresholds. */
  readonly ev: boolean;
  /** How loosely it picks among options of near-equal value (a share of the pot); 0 always takes the best. */
  readonly mix: number;
}

export const SKILL: Readonly<Record<number, Skill>> = {
  1: { samples: 60, ranges: false, noise: 0.18, potOdds: 0.3, stats: false, slip: 0.2, ev: false, mix: 0 },
  2: { samples: 120, ranges: false, noise: 0.06, potOdds: 1, stats: false, slip: 0.05, ev: false, mix: 0 },
  3: { samples: 140, ranges: true, noise: 0.07, potOdds: 0.9, stats: false, slip: 0.06, ev: false, mix: 0 },
  4: { samples: 240, ranges: true, noise: 0.025, potOdds: 1, stats: false, slip: 0.01, ev: true, mix: 0.03 },
  5: { samples: 320, ranges: true, noise: 0.02, potOdds: 1, stats: true, slip: 0.01, ev: true, mix: 0.025 },
  6: { samples: 500, ranges: true, noise: 0.01, potOdds: 1, stats: true, slip: 0, ev: true, mix: 0.02 },
};

const DEFAULT_SKILL: Skill = { samples: 160, ranges: true, noise: 0.05, potOdds: 1, stats: false, slip: 0.04, ev: false, mix: 0 };

export const HOLDEM_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 600 },
  { level: 2, rating: 850 },
  { level: 3, rating: 1100 },
  { level: 4, rating: 1350 },
  { level: 5, rating: 1550 },
  { level: 6, rating: 1750 },
];

/** The styles seated at each level, one per seat (a person's seat skips its entry). */
export const LINEUPS: Readonly<Record<number, readonly Style[]>> = {
  1: ['station', 'station', 'maniac', 'station', 'maniac', 'station'],
  2: ['station', 'rock', 'tag', 'maniac', 'tag', 'rock'],
  3: ['tag', 'lag', 'rock', 'station', 'tag', 'maniac'],
  4: ['tag', 'lag', 'solid', 'tag', 'rock', 'lag'],
  5: ['tag', 'lag', 'solid', 'solid', 'tag', 'lag'],
  6: ['solid', 'solid', 'lag', 'tag', 'solid', 'solid'],
};

/** A CPU seat's style: fixed for the session by the table's public number, the seat and the level. */
export function styleOf(table: number, seat: Seat, level: number): Style {
  const lineup = LINEUPS[level] ?? LINEUPS[3] ?? STYLES;
  const order = createRng(`styles/${table}/${level}`).shuffle(lineup);
  return order[seat % order.length] ?? 'tag';
}

export interface Decision {
  readonly action: HoldemAction;
  readonly tags: readonly string[];
  /** The equity the decision was based on, when one was worked out. */
  readonly equity: number | null;
}

// Helpers on a view

function me(v: HoldemView, seat: Seat): PlayerView {
  const p = v.players[seat];
  if (!p) throw new RangeError(`No seat ${seat}`);
  return p;
}

function holeOf(v: HoldemView, seat: Seat): Combo {
  const h = me(v, seat).hole;
  return [cardIndex(h[0] as Card), cardIndex(h[1] as Card)];
}

/** Chips a seat can still play for against the deepest opponent in the hand. */
export function effectiveStack(v: HoldemView, seat: Seat): number {
  const mine = me(v, seat);
  const others = seatsInHand(v)
    .filter((s) => s !== seat)
    .map((s) => me(v, s).stack + me(v, s).bet);
  return Math.min(mine.stack + mine.bet, Math.max(0, ...others));
}

/** Every action the seat to act may take, from its view (the same list the rules give). */
export function viewLegal(v: HoldemView, seat: Seat): HoldemAction[] {
  if (v.over || v.toAct !== seat) return [];
  const out: HoldemAction[] = toCallOf(v, seat) > 0 ? [{ type: 'fold' }, { type: 'call' }] : [{ type: 'check' }];
  const range = raiseRange(v, seat);
  if (range) {
    for (let to = range.min; to < range.max; to += v.blinds.unit) out.push({ type: 'raise', to });
    out.push({ type: 'raise', to: range.max });
  }
  return out;
}

const passive = (v: HoldemView, seat: Seat): HoldemAction => (toCallOf(v, seat) > 0 ? { type: 'fold' } : { type: 'check' });
const callOrCheck = (v: HoldemView, seat: Seat): HoldemAction => (toCallOf(v, seat) > 0 ? { type: 'call' } : { type: 'check' });

/** A raise to about `to` chips, made legal: on the chip grid, at least the minimum, all-in when little would be left. */
export function raiseTo(v: HoldemView, seat: Seat, to: number): HoldemAction | null {
  const range = raiseRange(v, seat);
  if (!range) return null;
  const unit = v.blinds.unit;
  let t = Math.max(range.min, Math.min(range.max, to));
  if (t < range.max) t = range.min + Math.round((t - range.min) / unit) * unit;
  const mine = me(v, seat);
  const potAfter = potOf(v) + (t - mine.bet) * 2;
  if (range.max - t < 0.3 * potAfter) t = range.max;
  return { type: 'raise', to: Math.min(t, range.max) };
}

function gaussian(rng: Rng): number {
  const u = Math.max(1e-9, rng.next());
  const w = rng.next();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w);
}

const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

function readOf(v: HoldemView, seat: Seat, skill: Skill): Read {
  return skill.stats ? readFromStats(v, seat) : TYPICAL;
}

/** Opponents' ranges as this seat would judge them. */
export function rangesFor(v: HoldemView, seat: Seat, skill: Pick<Skill, 'ranges' | 'stats'>): { seat: Seat; range: Range }[] {
  const hole = holeOf(v, seat);
  const dead = new Set<number>([...hole, ...v.board.map(cardIndex)]);
  return seatsInHand(v)
    .filter((s) => s !== seat)
    .map((s) => ({ seat: s, range: skill.ranges ? estimateRange(v, s, skill.stats ? readFromStats(v, s) : TYPICAL, dead) : withoutDead(ANY_HAND, dead) }));
}

/** Short-stack shoving: the share of hands to move all-in with, first in, by stack depth and players left behind. */
export function pushFraction(bigBlinds: number, behind: number): number {
  const base = bigBlinds <= 4 ? 1 : bigBlinds <= 6 ? 0.8 : bigBlinds <= 8 ? 0.66 : bigBlinds <= 10 ? 0.56 : bigBlinds <= 13 ? 0.46 : 0.38;
  return clamp(base / (1 + 0.55 * Math.max(0, behind - 1)), 0.05, 1);
}

// Before the flop

function preflop(v: HoldemView, seat: Seat, style: StyleParams, skill: Skill, rng: Rng): Decision {
  const mine = me(v, seat);
  const cls = handClass(mine.hole[0] as Card, mine.hole[1] as Card);
  const bb = v.blinds.bb;
  const players = dealtOrder(v).length;
  const pos = positionName(v, seat);
  const owe = toCallOf(v, seat);
  const pot = potOf(v);
  const eff = effectiveStack(v, seat) / bb;
  const r = clamp(rankOf(cls) + gaussian(rng) * skill.noise * 0.6, 0, 1);
  const pre = v.log.filter((e) => e.street === 'preflop');
  const raises = pre.filter((e) => e.kind === 'raise').length;
  const limpers = pre.filter((e) => e.kind === 'call' && !pre.slice(0, pre.indexOf(e)).some((x) => x.kind === 'raise')).length;
  const order = dealtOrder(v);
  // Before the flop play starts left of the big blind and ends with the blinds (heads-up, the button first).
  const preflopOrder = order.length === 2 ? [order[1], order[0]] : [...order.slice(2), ...order.slice(0, 2)];
  const behind = preflopOrder.length - 1 - preflopOrder.indexOf(seat);
  const result = (action: HoldemAction | null, tags: string[], equity: number | null = null): Decision => ({ action: action ?? callOrCheck(v, seat), tags, equity });

  if (raises === 0) {
    // Short stack, first in: move all-in or fold.
    if (eff <= 13) {
      const push = clamp(pushFraction(eff, Math.max(1, behind)) * Math.sqrt(style.loose), 0, 1);
      if (r < push) return result(raiseTo(v, seat, mine.stack + mine.bet), ['push']);
      return result(passive(v, seat), owe > 0 ? ['fold-weak'] : ['check']);
    }
    const open = clamp(openFraction(pos, players) * style.loose, 0, 0.97);
    if (pos === 'BB' && owe === 0) {
      if (r < 0.12 * style.loose && rng.next() > style.limp) return result(raiseTo(v, seat, (3.5 + limpers) * bb), ['isolate']);
      return result({ type: 'check' }, ['check']);
    }
    if (r < open) {
      if (rng.next() < style.limp) return result(callOrCheck(v, seat), ['limp']);
      const size = (style.open + limpers + (pos === 'SB' ? 0.5 : 0)) * bb;
      const steal = (pos === 'BTN' || pos === 'CO' || pos === 'SB') && r > 0.15;
      return result(raiseTo(v, seat, size), [steal ? 'steal' : 'open']);
    }
    if (owe > 0 && limpers > 0 && r < open * 1.6 && rng.next() < style.limp + 0.2) return result({ type: 'call' }, ['limp']);
    if (owe > 0 && pos === 'SB' && owe * 2 <= bb && r < open * 1.4 && rng.next() < style.limp + 0.15) return result({ type: 'call' }, ['complete']);
    return result(passive(v, seat), ['fold-weak']);
  }

  // Facing a raise.
  const lastRaise = [...pre].reverse().find((e) => e.kind === 'raise');
  const raiser = lastRaise?.seat ?? seat;
  const read = readOf(v, raiser, skill);
  const potOdds = owe / (pot + owe);
  const allInCall = owe >= mine.stack * 0.5 || (lastRaise?.allIn ?? false);
  // Against a big bet, compare equity with the price.
  const priceCheck = (tags: string[]): Decision => {
    const ranges = rangesFor(v, seat, { ranges: true, stats: skill.stats });
    const eq = clamp(rangeEquity(holeOf(v, seat), [], ranges.map((x) => x.range), skill.samples, rng) + gaussian(rng) * skill.noise, 0, 1);
    const need = potOdds * (skill.potOdds * style.sticky + (1 - skill.potOdds) * 0.8);
    if (eq >= need) return result({ type: 'call' }, [...tags, 'pot-odds'], eq);
    return result({ type: 'fold' }, ['price'], eq);
  };
  if (lastRaise?.allIn && skill.ranges) return priceCheck(['call']);
  if (raises === 1) {
    const raiserOpen = openFraction(positionName(v, raiser), players) * read.loose;
    const wide = Math.sqrt(Math.max(0.05, raiserOpen) / 0.2);
    const threeBet = style.threeBet * wide;
    const call = style.call * wide * (pos === 'BB' ? 2.4 : pos === 'SB' ? 0.8 : 1);
    if (r < threeBet) {
      if (eff <= 30) return result(raiseTo(v, seat, mine.stack + mine.bet), ['three-bet', 'push']);
      const inPosition = pos !== 'SB' && pos !== 'BB';
      return result(raiseTo(v, seat, v.currentBet * (inPosition ? 3 : 3.8)), ['three-bet']);
    }
    const bluffable = cls.endsWith('s') && (cls.startsWith('A') || /^(KQ|QJ|JT|T9|98|87|76|65|54)s$/.test(cls));
    if (bluffable && r >= threeBet && r < 0.45 && rng.next() < style.bluff3 * 0.5 && eff > 30) {
      return result(raiseTo(v, seat, v.currentBet * 3.3), ['three-bet', 'bluff']);
    }
    if (r < threeBet + call) {
      if (allInCall) return priceCheck(['call']);
      return result({ type: 'call' }, cls.length === 2 && rankOf(cls) > 0.05 ? ['set-mine'] : ['call']);
    }
    return result({ type: 'fold' }, ['fold-weak']);
  }
  // Facing a re-raise or more.
  const top = (raises === 2 ? 0.035 : 0.022) * Math.sqrt(style.loose);
  const callTop = (raises === 2 ? 0.1 : 0.04) / Math.min(1.2, style.sticky);
  if (r < top) {
    if (eff <= 45 || raises >= 3) return result(raiseTo(v, seat, mine.stack + mine.bet), ['four-bet', 'push']);
    return result(raiseTo(v, seat, v.currentBet * 2.3), ['four-bet']);
  }
  if (r < callTop) {
    if (allInCall) return priceCheck(['call']);
    return result({ type: 'call' }, ['call']);
  }
  if (allInCall && skill.ranges) return priceCheck(['call']);
  return result({ type: 'fold' }, ['fold-weak']);
}

// After the flop

function postflop(v: HoldemView, seat: Seat, style: StyleParams, skill: Skill, rng: Rng): Decision {
  const mine = me(v, seat);
  const hole = holeOf(v, seat);
  const board = v.board.map(cardIndex);
  const ranges = rangesFor(v, seat, skill);
  const k = ranges.length;
  const raw = rangeEquity(hole, board, ranges.map((x) => x.range), skill.samples, rng);
  const eq = clamp(raw + gaussian(rng) * skill.noise, 0, 1);
  const rel = Math.min(1, (eq * (k + 1)) / 2);
  const reading = readHand(hole, board);
  const pot = potOf(v);
  const owe = toCallOf(v, seat);
  const street = v.street;
  const preRaises = v.log.filter((e) => e.street === 'preflop' && e.kind === 'raise');
  const aggressor = preRaises[preRaises.length - 1]?.seat === seat;
  // How readily the others fold, and whether they call too much, by the session so far.
  const reads = ranges.map((x) => readOf(v, x.seat, skill));
  const loose = reads.reduce((a, r) => a + r.loose, 0) / Math.max(1, reads.length);
  const foldiness = skill.stats ? clamp(1.15 / loose, 0.3, 1.6) : 1;
  const thin = skill.stats && loose > 1.4 ? 0.06 : 0;
  const strongDraw = reading.draws.includes('flush-draw') || reading.draws.includes('open-ended');
  const result = (action: HoldemAction | null, tags: string[]): Decision => ({ action: action ?? callOrCheck(v, seat), tags, equity: eq });
  const bet = (fraction: number, tags: string[]): Decision => result(raiseTo(v, seat, mine.bet + Math.max(v.blinds.bb, pot * fraction)), tags);

  if (owe === 0) {
    if (rel >= style.value - thin) {
      if (rel > 0.88 && street !== 'river' && rng.next() < style.trap) return result({ type: 'check' }, ['trap']);
      return bet(street === 'river' && rel > 0.8 ? style.sizing + 0.1 : style.sizing, ['value']);
    }
    if (street !== 'river' && strongDraw && rng.next() < style.semi) return bet(style.sizing, ['semi-bluff']);
    if (aggressor && street === 'flop' && k <= 2 && rng.next() < style.cbet * foldiness) return bet(Math.min(style.sizing, 0.5), ['c-bet']);
    if (rel < 0.35 && rng.next() < style.bluff * foldiness * (k === 1 ? 1 : 0.5)) return bet(style.sizing, ['bluff']);
    return result({ type: 'check' }, rel >= 0.45 ? ['pot-control'] : ['check']);
  }

  const potOdds = owe / (pot + owe);
  const need = potOdds * (skill.potOdds * style.sticky) + (1 - skill.potOdds) * 0.25;
  // Implied odds: a strong draw with deep stacks behind may call a little light.
  const implied = skill.ranges && strongDraw && street !== 'river' && effectiveStack(v, seat) > pot * 2 ? 0.04 : 0;
  if (rel >= style.raise - thin / 2) {
    return result(raiseTo(v, seat, v.currentBet * 2.8 + (pot - v.currentBet) * 0.4) ?? { type: 'call' }, ['value']);
  }
  if (eq >= need - implied) return result({ type: 'call' }, [implied > 0 && eq < need ? 'implied-odds' : 'pot-odds']);
  if (street !== 'river' && strongDraw && rng.next() < style.semi * 0.35) {
    const raise = raiseTo(v, seat, v.currentBet * 3);
    if (raise) return result(raise, ['semi-bluff']);
  }
  if (street !== 'river' && rng.next() < style.bluffRaise * foldiness) {
    const raise = raiseTo(v, seat, v.currentBet * 3);
    if (raise) return result(raise, ['bluff']);
  }
  if (reading.draws.length > 0 && rng.next() < skill.slip) return result({ type: 'call' }, ['chase']);
  return result({ type: 'fold' }, ['price']);
}

/** An opponent's range with each hand's tier on the board, to tell what folds to a bet. */
interface Reader {
  readonly seat: Seat;
  readonly range: Range;
  readonly tiers: Uint8Array;
  readonly read: Read;
}

/** A hand's tier before the flop, from its place in the starting-hand ranking. */
function preflopTier(c: Combo): number {
  const r = rankOf(handClass(cardOf(c[0]), cardOf(c[1])));
  return r < 0.03 ? 5 : r < 0.08 ? 4 : r < 0.18 ? 3 : r < 0.35 ? 2 : r < 0.6 ? 1 : 0;
}

/** A hand's tier now: by the ranking before the flop, by what it makes after. */
export function tierNow(c: Combo, board: readonly number[]): number {
  return board.length === 0 ? preflopTier(c) : readHand(c, board).tier;
}

function readerOf(v: HoldemView, s: Seat, range: Range, read: Read): Reader {
  const board = v.board.map(cardIndex);
  return { seat: s, range, tiers: Uint8Array.from(range.combos.map((c) => tierNow(c, board))), read };
}

function readersFor(v: HoldemView, seat: Seat, skill: Skill): Reader[] {
  return rangesFor(v, seat, skill).map(({ seat: s, range }) => readerOf(v, s, range, readOf(v, s, skill)));
}

/** Roughly the equity a hand of each tier has against a betting range. */
const TIER_EQUITY = [0.12, 0.28, 0.42, 0.55, 0.68, 0.85];

/**
 * The least tier that goes on when calling costs `price` of the pot it would win (the pot odds the
 * caller is offered): a calling station goes on with less, a rock needs more.
 */
export function continueTier(price: number, read: Read): number {
  const need = price * (read.loose > 1.5 ? 0.7 : read.loose < 0.75 ? 1.25 : 1);
  const tier = TIER_EQUITY.findIndex((e) => e >= need);
  return tier < 0 ? 5 : tier;
}

/** How much of a range folds to a bet, and the range that goes on. */
function splitRange(r: Reader, price: number): { fold: number; keep: Range } {
  const need = continueTier(price, r.read);
  let total = 0;
  let folded = 0;
  const combos: Combo[] = [];
  const weights: number[] = [];
  r.range.combos.forEach((c, i) => {
    const w = r.range.weights[i] ?? 0;
    total += w;
    if ((r.tiers[i] ?? 0) < need) folded += w;
    else {
      combos.push(c);
      weights.push(w);
    }
  });
  return { fold: total > 0 ? folded / total : 0, keep: combos.length > 0 ? { combos, weights } : r.range };
}

interface Option {
  readonly action: HoldemAction;
  readonly ev: number;
  readonly tags: string[];
}

/**
 * After the flop, by expected value: folding is worth nothing more, calling or checking is worth
 * the equity share of the pot less the price, and each bet or raise size is worth what the others
 * fold to it plus the equity against the hands that go on.
 */
function postflopEV(v: HoldemView, seat: Seat, style: StyleParams, skill: Skill, rng: Rng): Decision {
  const mine = me(v, seat);
  const hole = holeOf(v, seat);
  const board = v.board.map(cardIndex);
  const readers = readersFor(v, seat, skill);
  const noisy = (x: number) => clamp(x + gaussian(rng) * skill.noise, 0, 1);
  const eq = noisy(rangeEquity(hole, board, readers.map((r) => r.range), skill.samples, rng));
  const pot = potOf(v);
  const owe = Math.min(toCallOf(v, seat), mine.stack);
  const reading = readHand(hole, board);
  const strongDraw = reading.draws.includes('flush-draw') || reading.draws.includes('open-ended');
  const drawBonus = strongDraw && v.street !== 'river' && effectiveStack(v, seat) > pot ? 0.05 : 0;
  const preRaises = v.log.filter((e) => e.street === 'preflop' && e.kind === 'raise');
  const aggressor = preRaises[preRaises.length - 1]?.seat === seat;
  const options: Option[] = [];
  if (owe > 0) options.push({ action: { type: 'fold' }, ev: 0, tags: ['price'] });
  const callEv = (eq + drawBonus) * (pot + owe) - owe + (owe > 0 ? (1 - style.sticky) * pot * 0.15 : 0);
  options.push({ action: owe > 0 ? { type: 'call' } : { type: 'check' }, ev: callEv, tags: owe > 0 ? [drawBonus > 0 && eq * (pot + owe) < owe ? 'implied-odds' : 'pot-odds'] : [eq > 0.5 ? 'pot-control' : 'check'] });
  const range = raiseRange(v, seat);
  if (range) {
    const fractions = skill.samples >= 500 ? [0.33, 0.5, 0.75, 1, 1.5] : [0.5, 0.75, 1];
    const targets = new Set<number>();
    for (const f of fractions) {
      const a = raiseTo(v, seat, v.currentBet + f * (pot + owe));
      if (a?.type === 'raise') targets.add(a.to);
    }
    targets.add(range.max);
    const aggression = (style.bluff - 0.15) * pot * 0.4;
    for (const to of targets) {
      const add = to - mine.bet;
      let allFold = 1;
      let callChips = 0;
      const keeps: Range[] = [];
      for (const r of readers) {
        const p = me(v, r.seat);
        const call = Math.min(to - p.bet, p.stack);
        // The others are offered a price too: a small raise into a big pot is called by almost anything.
        const { fold, keep } = splitRange(r, call / Math.max(1, pot + add + call));
        // Reads are never certain: count on a little less folding than the model says.
        allFold *= fold * 0.85;
        callChips += (1 - fold) * call;
        keeps.push(keep);
      }
      const eqCalled = noisy(rangeEquity(hole, board, keeps, Math.ceil(skill.samples / 2), rng));
      const ev = allFold * pot + (1 - allFold) * ((eqCalled + drawBonus / 2) * (pot + add + callChips) - add) + aggression;
      const kind = eqCalled >= 0.5 ? 'value' : strongDraw && v.street !== 'river' ? 'semi-bluff' : aggressor && v.street === 'flop' && owe === 0 ? 'c-bet' : 'bluff';
      options.push({ action: { type: 'raise', to }, ev, tags: [kind] });
    }
  }
  let best = options[0] as Option;
  for (const o of options) if (o.ev > best.ev) best = o;
  if (skill.mix > 0) {
    // Options worth about the same are mixed, so the play is harder to read.
    const t = Math.max(1, skill.mix * pot);
    const weights = options.map((o) => Math.exp((o.ev - best.ev) / t));
    let x = rng.next() * weights.reduce((a, b) => a + b, 0);
    for (const [i, o] of options.entries()) {
      x -= weights[i] ?? 0;
      if (x <= 0) {
        best = o;
        break;
      }
    }
  }
  if (best.action.type === 'fold' && reading.draws.length > 0 && rng.next() < skill.slip) return { action: { type: 'call' }, tags: ['chase'], equity: eq };
  return { action: best.action, tags: best.tags, equity: eq };
}

/** A decision for a seat at a level and style. */
export function decide(v: HoldemView, seat: Seat, level: number, style: Style, rng: Rng): Decision {
  const skill: Skill = SKILL[level] ?? DEFAULT_SKILL;
  const params = STYLE_PARAMS[style];
  const legal = viewLegal(v, seat);
  if (legal.length === 0) throw new Error('Not this seat’s turn');
  const d = v.street === 'preflop' ? preflop(v, seat, params, skill, rng) : skill.ev ? postflopEV(v, seat, params, skill, rng) : postflop(v, seat, params, skill, rng);
  // Whatever was worked out, play only what the rules allow.
  const text = actionText(d.action);
  if (legal.some((a) => actionText(a) === text)) return d;
  return { ...d, action: callOrCheck(v, seat) };
}

export interface OptionValue {
  /** The action in notation. */
  readonly action: string;
  /** Expected chips, against what folding would leave: folding is 0. */
  readonly ev: number;
  /** Equity when the others go on (all of them for a call or check). */
  readonly equity: number;
  readonly tags: readonly string[];
}

/**
 * What each option is worth, in chips, as a solid player would judge it: by equity against the
 * others' likely hands ("with what you knew") or, given `known`, against the hands they really
 * held ("with every card face up"), with what they would fold to each bet. The raise sizes tried
 * are the minimum, half the pot, the pot and all-in, plus `extra` targets.
 */
export function optionValues(v: HoldemView, seat: Seat, samples: number, rng: Rng, known?: ReadonlyMap<Seat, Combo>, extra: readonly number[] = []): OptionValue[] {
  const mine = me(v, seat);
  const hole = holeOf(v, seat);
  const board = v.board.map(cardIndex);
  const others = seatsInHand(v).filter((s) => s !== seat);
  const readers: Reader[] = known
    ? others.map((s) => {
        const c = known.get(s);
        const range: Range = c ? { combos: [c], weights: [1] } : withoutDead(ANY_HAND, new Set([...hole, ...board]));
        return readerOf(v, s, range, readFromStats(v, s));
      })
    : readersFor(v, seat, { samples, ranges: true, noise: 0, potOdds: 1, stats: true, slip: 0, ev: true, mix: 0 });
  const exact = known !== undefined && board.length >= 3;
  const equityAgainst = (ranges: readonly Range[]) => {
    if (ranges.length === 0) return 1;
    if (exact && ranges.every((r) => r.combos.length === 1)) return exactEquity([hole, ...ranges.map((r) => r.combos[0] as Combo)], board)[0] ?? 0;
    return rangeEquity(hole, board, ranges, samples, rng);
  };
  const pot = potOf(v);
  const owe = Math.min(toCallOf(v, seat), mine.stack);
  const eq = equityAgainst(readers.map((r) => r.range));
  const out: OptionValue[] = [];
  if (owe > 0) out.push({ action: 'fold', ev: 0, equity: eq, tags: ['price'] });
  out.push({ action: owe > 0 ? 'call' : 'check', ev: eq * (pot + owe) - owe, equity: eq, tags: owe > 0 ? ['pot-odds'] : ['check'] });
  const range = raiseRange(v, seat);
  if (range) {
    const targets = new Set<number>([range.min, range.max, ...extra.filter((x) => x >= range.min && x <= range.max)]);
    for (const f of [0.5, 1]) {
      const a = raiseTo(v, seat, v.currentBet + f * (pot + owe));
      if (a?.type === 'raise') targets.add(a.to);
    }
    for (const to of [...targets].sort((a, b) => a - b)) {
      const add = to - mine.bet;
      let allFold = 1;
      let callChips = 0;
      const keeps: Range[] = [];
      for (const r of readers) {
        const p = me(v, r.seat);
        const call = Math.min(to - p.bet, p.stack);
        const { fold, keep } = splitRange(r, call / Math.max(1, pot + add + call));
        allFold *= fold;
        callChips += (1 - fold) * call;
        if (fold < 1) keeps.push(keep);
      }
      const eqCalled = keeps.length > 0 ? equityAgainst(keeps) : eq;
      const ev = allFold * pot + (1 - allFold) * (eqCalled * (pot + add + callChips) - add);
      out.push({ action: `r${to}`, ev, equity: eqCalled, tags: [eqCalled >= 0.5 ? 'value' : 'bluff'] });
    }
  }
  return out;
}

/** What the coach and the review show about a decision: equity against the ranges a solid player would put the others on, and the price. */
export function equityReport(v: HoldemView, seat: Seat, samples: number, rng: Rng) {
  const mine = me(v, seat);
  const hole = holeOf(v, seat);
  const board = v.board.map(cardIndex);
  const ranges = rangesFor(v, seat, { ranges: true, stats: true });
  const equity = ranges.length > 0 ? rangeEquity(hole, board, ranges.map((x) => x.range), samples, rng) : 1;
  const random = ranges.length > 0 ? rangeEquity(hole, board, ranges.map(() => withoutDead(ANY_HAND, new Set([...hole, ...board]))), samples, rng) : 1;
  const owe = Math.min(toCallOf(v, seat), mine.stack);
  const pot = potOf(v);
  const o = outs(mine.hole, v.board);
  return {
    equity,
    random,
    owe,
    pot,
    potOdds: owe > 0 ? owe / (pot + owe) : 0,
    outs: o.draw.length,
    improve: o.improve.length,
    reading: readHand(hole, board),
  };
}

function advise(input: AdviseInput<HoldemView>): Json {
  const q = isJsonObject(input.query) ? input.query : {};
  const v = input.view;
  const seat = input.seat;
  if (q.type === 'hint') {
    const d = decide(v, seat, 6, 'solid', input.rng);
    return { action: actionText(d.action), tags: [...d.tags], equity: d.equity };
  }
  if (q.type === 'analyse') {
    // The others' real hands, for the "every card face up" lens: { seat: ["Ah", "Kd"] }.
    const known = new Map<Seat, Combo>();
    if (isJsonObject(q.known)) {
      for (const [k, cards] of Object.entries(q.known)) {
        if (Array.isArray(cards) && cards.length === 2 && cards.every((c) => typeof c === 'string')) known.set(Number(k), [cardIndex(cards[0] as Card), cardIndex(cards[1] as Card)]);
      }
    }
    const extra = Array.isArray(q.extra) ? q.extra.filter((x): x is number => typeof x === 'number') : [];
    const samples = typeof q.samples === 'number' ? q.samples : 400;
    const knew = optionValues(v, seat, samples, input.rng, undefined, extra);
    const up = known.size > 0 ? optionValues(v, seat, samples, input.rng, known, extra) : knew;
    return { knew: knew.map((o) => ({ ...o, tags: [...o.tags] })), up: up.map((o) => ({ ...o, tags: [...o.tags] })) };
  }
  if (q.type === 'equity') {
    const r = equityReport(v, seat, typeof q.samples === 'number' ? q.samples : 1500, input.rng);
    return { equity: r.equity, random: r.random, owe: r.owe, pot: r.pot, potOdds: r.potOdds, outs: r.outs, improve: r.improve, tier: r.reading.tier };
  }
  return null;
}

export const holdemBots: BotSet<HoldemView, HoldemAction> = {
  gameId: 'poker',
  levels: HOLDEM_LEVELS,
  choose({ view, seat, level, rng }): BotChoice<HoldemAction> {
    const d = decide(view, seat, level, styleOf(view.table, seat, level), rng);
    return { action: d.action, tags: d.tags, nodes: 0 };
  },
  advise,
  encode: (action) => actionText(action),
};
