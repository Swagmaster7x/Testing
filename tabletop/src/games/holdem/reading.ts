/**
 * Reading a hand and a table: what a hand is on a board (top pair, a flush draw), the outs that
 * improve it, and a weighted range for each opponent from what they have done this hand. The
 * bots, the coach and the review share these, so the coach says what the bots think.
 */
import type { Seat } from '../../core/contract';
import type { Card } from './cards';
import { cardIndex, cardOf, DECK, handClass } from './cards';
import type { Combo, Range } from './equity';
import { ALL_COMBOS, comboClass } from './equity';
import type { Category } from './evaluate';
import { categoryOf, evaluateIndices } from './evaluate';
import { band, openFraction, rankOf } from './preflop';
import type { HoldemView, LogEntry, Street } from './rules';
import { dealtOrder, positionName } from './rules';

export type Detail = 'overpair' | 'top-pair' | 'second-pair' | 'weak-pair' | 'underpair' | 'board-pair' | 'set' | 'trips' | 'two-pair' | 'board' | null;
export type Draw = 'flush-draw' | 'open-ended' | 'gutshot' | 'overcards';

export interface HandReading {
  readonly value: number;
  readonly category: Category;
  readonly detail: Detail;
  readonly draws: readonly Draw[];
  /** 0 nothing, 1 a weak draw or a weak pair, 2 a pair or a good draw, 3 a good pair or a strong draw, 4 a strong pair, 5 two pair or better. */
  readonly tier: number;
}

const rankOfCard = (c: number) => c >> 2;
const suitOfCard = (c: number) => c & 3;

/** Whether a set of ranks (bit mask, bit 12 the ace) holds five in a row; the ace also plays low. */
function hasStraight(mask: number): boolean {
  for (let low = 0; low <= 8; low++) if (((mask >> low) & 0x1f) === 0x1f) return true;
  // The wheel: ace, two, three, four, five.
  return (mask & 0x100f) === 0x100f;
}

const scratch: number[] = [];

function evalWith(hole: Combo, board: readonly number[], extra = -1): number {
  scratch.length = 0;
  scratch.push(hole[0], hole[1], ...board);
  if (extra >= 0) scratch.push(extra);
  return evaluateIndices(scratch);
}

function evalBoard(board: readonly number[], extra = -1): number {
  scratch.length = 0;
  scratch.push(...board);
  if (extra >= 0) scratch.push(extra);
  return evaluateIndices(scratch);
}

/** What a hand is on a board, and how strong, for reading and for the coach. */
export function readHand(hole: Combo, board: readonly number[]): HandReading {
  const value = evalWith(hole, board);
  const cat = value >> 20;
  const category = categoryOf(value);
  const h0 = rankOfCard(hole[0]);
  const h1 = rankOfCard(hole[1]);
  const boardRanks = board.map(rankOfCard);
  const distinct = [...new Set(boardRanks)].sort((a, b) => b - a);
  const top = distinct[0] ?? -1;
  let detail: Detail = null;
  if (board.length >= 3) {
    if (board.length === 5 && cat >= 4 && evalBoard(board) === value) detail = 'board';
    else if (cat === 1) {
      const pair = (value >> 16) & 15;
      if (h0 === h1) detail = h0 > top ? 'overpair' : 'underpair';
      else if (h0 === pair || h1 === pair) detail = pair === top ? 'top-pair' : pair === distinct[1] ? 'second-pair' : 'weak-pair';
      else detail = 'board-pair';
    } else if (cat === 2) {
      const boardPairs = distinct.filter((r) => boardRanks.filter((x) => x === r).length >= 2).length;
      detail = boardPairs >= 2 && h0 !== h1 ? 'board' : 'two-pair';
    } else if (cat === 3) {
      const trip = (value >> 16) & 15;
      if (h0 === h1 && h0 === trip) detail = 'set';
      else if (h0 === trip || h1 === trip) detail = 'trips';
      else detail = 'board';
    }
  }
  const draws: Draw[] = [];
  if (board.length === 3 || board.length === 4) {
    if (cat < 5) {
      for (let s = 0; s < 4; s++) {
        const mine = (suitOfCard(hole[0]) === s ? 1 : 0) + (suitOfCard(hole[1]) === s ? 1 : 0);
        if (mine > 0 && mine + board.filter((c) => suitOfCard(c) === s).length === 4) draws.push('flush-draw');
      }
    }
    if (cat < 4) {
      let mask = (1 << h0) | (1 << h1);
      let boardMask = 0;
      for (const r of boardRanks) {
        mask |= 1 << r;
        boardMask |= 1 << r;
      }
      let completing = 0;
      for (let r = 0; r < 13; r++) {
        if (mask & (1 << r)) continue;
        if (hasStraight(mask | (1 << r)) && !hasStraight(boardMask | (1 << r))) completing++;
      }
      if (completing >= 2) draws.push('open-ended');
      else if (completing === 1) draws.push('gutshot');
    }
    if (cat === 0 && h0 > top && h1 > top) draws.push('overcards');
  }
  return { value, category, detail, draws, tier: tierOf(cat, detail, draws, Math.max(h0, h1) === top ? Math.min(h0, h1) : Math.max(h0, h1)) };
}

function tierOf(cat: number, detail: Detail, draws: readonly Draw[], kicker: number): number {
  let tier = 0;
  if (detail === 'board') tier = 0;
  else if (cat >= 4) tier = 5;
  else if (detail === 'set' || detail === 'two-pair') tier = 5;
  else if (detail === 'trips') tier = 4;
  else if (detail === 'overpair') tier = 4;
  else if (detail === 'top-pair') tier = kicker >= 8 ? 4 : 3;
  else if (detail === 'second-pair' || detail === 'underpair') tier = 2;
  else if (detail === 'weak-pair') tier = 1;
  const strongDraw = draws.includes('flush-draw') || draws.includes('open-ended');
  const weakDraw = draws.includes('gutshot') || draws.includes('overcards');
  if (strongDraw && (weakDraw || draws.length >= 2)) tier = Math.max(tier, 3);
  else if (strongDraw) tier = Math.max(tier, 2);
  else if (weakDraw) tier = Math.max(tier, 1);
  return tier;
}

/**
 * Outs: unseen cards that improve the hand to a better kind of hand (one the board alone does not
 * give everybody). `draw` are the ones that make a straight or better; `improve` all of them.
 */
export function outs(hole: readonly Card[], board: readonly Card[]): { draw: Card[]; improve: Card[] } {
  if (board.length < 3 || board.length >= 5) return { draw: [], improve: [] };
  const h: Combo = [cardIndex(hole[0] as Card), cardIndex(hole[1] as Card)];
  const b = board.map(cardIndex);
  const seen = new Set<number>([...h, ...b]);
  const now = evalWith(h, b) >> 20;
  const draw: Card[] = [];
  const improve: Card[] = [];
  for (let c = 0; c < 52; c++) {
    if (seen.has(c)) continue;
    const v = evalWith(h, b, c);
    const cat = v >> 20;
    // The improvement must be the player's own, not a card that improves the board for everyone.
    if (cat <= now || v <= evalBoard(b, c)) continue;
    improve.push(cardOf(c));
    if (cat >= 4) draw.push(cardOf(c));
  }
  return { draw, improve };
}

// Opponents' ranges

/** How a player plays, as far as reading them goes: 1 is a typical player, more is looser. */
export interface Read {
  readonly loose: number;
  /** How often they bet or raise with little; 1 is typical. */
  readonly bluffs: number;
}

export const TYPICAL: Read = { loose: 1.1, bluffs: 1 };

/** A read on a seat from its session statistics, pulled toward a typical player while there are few hands. */
export function readFromStats(v: Pick<HoldemView, 'stats'>, seat: Seat): Read {
  const s = v.stats[seat];
  if (!s) return TYPICAL;
  const prior = 12;
  const vpip = (s.vpip + 0.26 * prior) / (s.hands + prior);
  const aggression = (s.aggressive + 1.2 * 4) / (s.passive + 4);
  return { loose: Math.min(2.6, Math.max(0.45, vpip / 0.24)), bluffs: Math.min(2.5, Math.max(0.4, aggression / 1.2)) };
}

/** Preflop: weights per hand class for what a seat's actions before the flop say about its hand. */
export function preflopWeights(v: Pick<HoldemView, 'log' | 'players' | 'button'>, seat: Seat, read: Read): Map<string, number> {
  const players = dealtOrder(v).length;
  const pos = positionName(v, seat);
  let raises = 0;
  let last: { kind: LogEntry['kind']; raises: number; allIn: boolean } | null = null;
  for (const e of v.log) {
    if (e.street !== 'preflop') break;
    if (e.seat === seat && (e.kind === 'call' || e.kind === 'raise' || e.kind === 'check')) last = { kind: e.kind, raises, allIn: e.allIn };
    if (e.kind === 'raise') raises++;
  }
  const loose = read.loose;
  const open = Math.min(0.95, Math.max(0.05, openFraction(pos === 'BB' ? 'SB' : pos, players) * loose));
  // Has not acted yet (or only posted): any hand.
  let from = 0;
  let to = 1;
  if (last === null) {
    // Nothing to narrow.
  } else if (last.kind === 'check') {
    from = Math.min(0.2, 0.08 * loose);
    to = 1;
  } else if (last.kind === 'raise') {
    if (last.raises === 0) to = open;
    else if (last.raises === 1) to = Math.min(0.4, 0.07 * loose);
    else to = Math.min(0.2, 0.035 * loose);
    if (last.allIn && last.raises === 0) to = Math.max(to, Math.min(0.6, open * 1.2));
  } else if (last.raises === 0) {
    // A limp or a completed small blind.
    from = 0.03;
    to = Math.min(1, Math.max(0.25, open * 1.7));
  } else if (last.raises === 1) {
    from = pos === 'BB' ? 0.06 : 0.04;
    to = Math.min(0.9, (pos === 'BB' ? 0.5 : 0.2) * loose);
  } else {
    from = 0.02;
    to = Math.min(0.5, 0.12 * loose);
  }
  const weights = new Map<string, number>();
  for (const cls of band(0, 1)) weights.set(cls, 0.02);
  for (const cls of band(from, to)) weights.set(cls, 1);
  // Strong hands that would have raised still turn up now and then (slow play).
  if (from > 0) for (const cls of band(0, from)) weights.set(cls, 0.15);
  return weights;
}

const LIKE: Readonly<Record<'aggressive' | 'call' | 'check', readonly number[]>> = {
  aggressive: [0.2, 0.3, 0.45, 0.65, 0.9, 1],
  call: [0.06, 0.55, 0.8, 0.9, 0.75, 0.55],
  check: [1, 0.9, 0.8, 0.7, 0.5, 0.35],
};

/** The board as it was on a street. */
export function boardOn(board: readonly Card[], street: Street): Card[] {
  return board.slice(0, street === 'flop' ? 3 : street === 'turn' ? 4 : street === 'river' ? 5 : 0);
}

/**
 * A weighted range for a seat from everything it did this hand: a band of the starting-hand
 * ranking for its preflop action, then each later bet, call or check makes hands more or less
 * likely by how strong they were on the board at the time. Combos holding a dead card are left out.
 */
export function estimateRange(v: Pick<HoldemView, 'log' | 'players' | 'button' | 'board'>, seat: Seat, read: Read, dead: ReadonlySet<number>): Range {
  const pre = preflopWeights(v, seat, read);
  const streets: { street: Street; act: 'aggressive' | 'call' | 'check'; board: number[] }[] = [];
  for (const street of ['flop', 'turn', 'river'] as const) {
    const mine = v.log.filter((e) => e.seat === seat && e.street === street);
    if (mine.length === 0) continue;
    const act = mine.some((e) => e.kind === 'bet' || e.kind === 'raise') ? 'aggressive' : mine.some((e) => e.kind === 'call') ? 'call' : 'check';
    streets.push({ street, act, board: boardOn(v.board, street).map(cardIndex) });
  }
  const combos: Combo[] = [];
  const weights: number[] = [];
  for (const c of ALL_COMBOS) {
    if (dead.has(c[0]) || dead.has(c[1])) continue;
    let w = pre.get(comboClass(c)) ?? 0.02;
    for (const s of streets) {
      const tier = readHand(c, s.board).tier;
      let like = LIKE[s.act][tier] ?? 0.5;
      if (s.act === 'aggressive' && tier <= 1) like = Math.min(1, like * read.bluffs);
      w *= like;
    }
    if (w > 1e-6) {
      combos.push(c);
      weights.push(w);
    }
  }
  return { combos, weights };
}

/** A hand class from two cards, for the coach and the review. */
export const classOf = (hole: readonly Card[]): string => (hole.length === 2 ? handClass(hole[0] as Card, hole[1] as Card) : '');

/** Unseen cards for a seat. */
export function unseenFor(hole: readonly Card[], board: readonly Card[]): Card[] {
  const seen = new Set<Card>([...hole, ...board]);
  return DECK.filter((c) => !seen.has(c));
}

/** The share of all hands a class is better than, for words such as "a top 10 per cent hand". */
export const topShare = (cls: string): number => rankOf(cls);
