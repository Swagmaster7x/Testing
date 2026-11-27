/**
 * Blackjack players for the other boxes at the table (PLAN.md 2.4). Blackjack is played against
 * the house, so a level is a strategy, measured by how much expected value it gives away and by
 * what it wins over many shoes (`npm run ladder -- blackjack`):
 *
 * 1. Plays like the dealer: hits to 17, never doubles, splits or surrenders.
 * 2. Rules of thumb: stands on a stiff hand against a weak dealer card, doubles 10 and 11, splits
 *    aces and eights.
 * 3. Basic strategy, computed by expected value from the rules in force (strategy.ts), flat bets.
 * 4. Basic strategy with the Hi-Lo count: bets more when the true count is high, takes insurance
 *    at a true count of 3 or more, and makes the best-known count deviations.
 *
 * The coach's hint and the review use level 3's chart and the expected values behind it.
 */
import type { BotChoice, BotInput, BotLevel, BotSet } from '../../ai/bot';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { Card } from '../classic/cards';
import type { BlackjackAction, BlackjackConfig, BlackjackView, PlayerHand } from './rules';
import { actionText, betChoices, blackjack, isPair, limitsOf, whatCan } from './rules';
import type { Move } from './strategy';
import { basicMove, chartCell, handTotal, hiLo, insuranceValue, moveValues, rankIndex, strategyChart, UPCARDS } from './strategy';

export const BLACKJACK_LEVELS: readonly BotLevel[] = [
  { level: 1, rating: 600 },
  { level: 2, rating: 900 },
  { level: 3, rating: 1200 },
  { level: 4, rating: 1450 },
];

/** Hi-Lo running count and true count from what a seat has seen. */
export function counts(v: Pick<BlackjackView, 'seen' | 'shoeLeft' | 'holeShown' | 'dealer'>): { running: number; decksLeft: number; trueCount: number } {
  let running = 0;
  for (const c of v.seen) running += hiLo(c);
  const unseen = v.shoeLeft + (!v.holeShown && v.dealer.length > 1 ? 1 : 0);
  const decksLeft = Math.max(0.25, unseen / 52);
  return { running, decksLeft, trueCount: running / decksLeft };
}

/** The hand to act, and what it may do. */
export function currentHand(v: BlackjackView): { hand: PlayerHand; can: ReturnType<typeof whatCan> } | null {
  if (v.phase !== 'play' || !v.at) return null;
  const hand = v.boxes[v.at.box]?.hands[v.at.hand];
  if (!hand) return null;
  return { hand, can: whatCan(v, v.at) };
}

function moveAction(m: Move): BlackjackAction {
  return { type: m };
}

/** Level 1: hit to 17 like the dealer. */
function dealerLike(hand: PlayerHand, config: BlackjackConfig, canHit: boolean): Move {
  const t = handTotal(hand.cards);
  if (!canHit) return 'stand';
  if (t.total < 17 || (t.total === 17 && t.soft && config.soft17 === 'hit')) return 'hit';
  return 'stand';
}

/** Level 2: rules of thumb. */
function thumb(hand: PlayerHand, up: Card, can: ReturnType<typeof whatCan>): Move {
  const t = handTotal(hand.cards);
  const u = rankIndex(up);
  const weak = u >= 2 && u <= 6;
  if (can.split && isPair(hand.cards) && (rankIndex(hand.cards[0] as Card) === 1 || rankIndex(hand.cards[0] as Card) === 8)) return 'split';
  if (can.double && !t.soft && (t.total === 11 || (t.total === 10 && u >= 2 && u <= 9))) return 'double';
  if (!can.hit) return 'stand';
  if (t.soft) return t.total <= 17 ? 'hit' : 'stand';
  if (t.total >= 17) return 'stand';
  if (t.total >= 12 && weak) return 'stand';
  return 'hit';
}

/** Level 4's count deviations from basic strategy (Hi-Lo true count; hard totals). */
function deviation(hand: PlayerHand, up: Card, can: ReturnType<typeof whatCan>, tc: number): Move | null {
  const t = handTotal(hand.cards);
  if (t.soft) return null;
  const u = rankIndex(up);
  const two = hand.cards.length === 2;
  if (two && can.split && isPair(hand.cards) && rankIndex(hand.cards[0] as Card) === 10 && ((u === 5 && tc >= 5) || (u === 6 && tc >= 4))) return 'split';
  if (two && can.surrender && ((t.total === 14 && u === 10 && tc >= 3) || (t.total === 15 && u === 9 && tc >= 2) || (t.total === 15 && u === 1 && tc >= 1))) return 'surrender';
  if (two && can.double && ((t.total === 10 && u === 10 && tc >= 4) || (t.total === 10 && u === 1 && tc >= 4) || (t.total === 11 && u === 1 && tc >= 1) || (t.total === 9 && u === 2 && tc >= 1) || (t.total === 9 && u === 7 && tc >= 3))) return 'double';
  if (!can.hit) return null;
  if ((t.total === 16 && u === 10 && tc >= 0) || (t.total === 15 && u === 10 && tc >= 4) || (t.total === 16 && u === 9 && tc >= 5) || (t.total === 12 && u === 3 && tc >= 2) || (t.total === 12 && u === 2 && tc >= 3)) return 'stand';
  if ((t.total === 13 && u === 2 && tc <= -1) || (t.total === 12 && u === 4 && tc < 0) || (t.total === 12 && u === 5 && tc <= -2) || (t.total === 12 && u === 6 && tc <= -1) || (t.total === 13 && u === 3 && tc <= -2)) return 'hit';
  return null;
}

/** The basic-strategy move for the hand to act. */
export function basicFor(v: BlackjackView): Move | null {
  const cur = currentHand(v);
  const up = v.dealer[0];
  if (!cur || !up) return null;
  return basicMove(strategyChart(v.config), cur.hand.cards, up, cur.can, v.config.das === 'yes');
}

/** A bet for the level: level 4 spreads by the true count, the others bet the minimum. */
export function chooseBet(v: BlackjackView, level: number): number {
  const box = v.boxes[v.seat];
  const choices = betChoices(v.config, box?.chips ?? 0);
  const { min } = limitsOf(v.config);
  if (level < 4) return choices[0] ?? min;
  const tc = counts(v).trueCount;
  const units = tc < 2 ? 1 : tc < 3 ? 2 : tc < 4 ? 4 : tc < 5 ? 6 : 8;
  const want = units * min;
  return choices.filter((x) => x <= want).at(-1) ?? choices[0] ?? min;
}

export function chooseAction(v: BlackjackView, level: number): BlackjackAction {
  if (v.phase === 'bet') return { type: 'bet', amount: chooseBet(v, level) };
  if (v.phase === 'insurance') {
    const box = v.boxes[v.seat];
    const can = (box?.chips ?? 0) >= (box?.bet ?? 0) / 2;
    return level >= 4 && can && counts(v).trueCount >= 3 ? { type: 'insure' } : { type: 'no-insurance' };
  }
  const cur = currentHand(v);
  const up = v.dealer[0];
  if (!cur || !up) return { type: 'stand' };
  switch (level) {
    case 1:
      return moveAction(dealerLike(cur.hand, v.config, cur.can.hit));
    case 2:
      return moveAction(thumb(cur.hand, up, cur.can));
    case 3:
      return moveAction(basicFor(v) ?? 'stand');
    default:
      return moveAction(deviation(cur.hand, up, cur.can, counts(v).trueCount) ?? basicFor(v) ?? 'stand');
  }
}

/** The expected value of every allowed move for the hand to act ("with what you knew": the rules, not the count). */
export function valuesFor(v: BlackjackView, shoeAware = false): Partial<Record<Move, number>> {
  const cur = currentHand(v);
  const up = v.dealer[0];
  if (!cur || !up) return {};
  const box = v.boxes[v.at?.box ?? 0];
  const allowed = { double: cur.can.double, split: cur.can.split, surrender: cur.can.surrender, splitsLeft: Math.max(0, v.config.splitTo - (box?.hands.length ?? 1) - 1), fromSplit: cur.hand.fromSplit };
  const removed = shoeAware ? v.seen.filter((c) => !cur.hand.cards.includes(c) && c !== up) : [];
  const values = moveValues(cur.hand.cards, up, v.config, allowed, removed);
  if (!cur.can.hit) delete values.hit;
  return values;
}

export function tagsFor(v: BlackjackView, action: BlackjackAction): string[] {
  if (action.type === 'bet') return [];
  if (action.type === 'insure') return ['blackjack-insures'];
  if (action.type === 'no-insurance') return [];
  const basic = basicFor(v);
  return basic === action.type ? ['blackjack-chart'] : ['blackjack-count'];
}

function advise(v: BlackjackView, query: Json): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  if (v.phase === 'insurance') {
    // Insurance costs half the bet and pays 2 to 1: its value per chip of the bet, with the cards in sight out of the shoe.
    const box = v.boxes[v.seat];
    const inSight = [...(box?.hands[0]?.cards ?? []), ...v.dealer.filter((c): c is Card => c !== null)];
    const value = 0.5 * insuranceValue(inSight, v.config.decks);
    return { action: 'no-insurance', tags: ['blackjack-move-no-insurance'], moves: [{ action: 'insure', value: Math.round(value * 1000) / 1000 }, { action: 'no-insurance', value: 0 }] };
  }
  if (v.phase === 'bet') return { action: actionText({ type: 'bet', amount: chooseBet(v, 3) }), tags: [], moves: [] };
  const values = valuesFor(v);
  const basic = basicFor(v) ?? 'stand';
  const cur = currentHand(v);
  const up = v.dealer[0];
  const cell = cur && up ? chartCell(strategyChart(v.config), cur.hand.cards, up, cur.can.split) : null;
  const moves = Object.entries(values).map(([action, value]) => ({ action, value: Math.round((value ?? 0) * 1000) / 1000 }));
  return { action: basic, tags: [`blackjack-move-${basic}`], moves, cell: cell ? { kind: cell.row.kind, value: cell.row.value, up: UPCARDS[cell.col] ?? 0 } : null };
}

export const blackjackBots: BotSet<BlackjackView, BlackjackAction> = {
  gameId: 'blackjack',
  levels: BLACKJACK_LEVELS,
  choose({ view, level }: BotInput<BlackjackView>): BotChoice<BlackjackAction> {
    const action = chooseAction(view, level);
    return { action, tags: tagsFor(view, action), nodes: 0 };
  },
  advise: ({ view, query }) => advise(view, query),
  encode: (action) => blackjack.codec.action.toJSON(action),
};

/** Random play for the ladder's floor: the minimum bet, then any legal move. */
export function randomMove(v: BlackjackView, rng: Rng): BlackjackAction {
  if (v.phase === 'bet') return { type: 'bet', amount: chooseBet(v, 1) };
  if (v.phase === 'insurance') return rng.next() < 0.5 ? { type: 'insure' } : { type: 'no-insurance' };
  const cur = currentHand(v);
  if (!cur) return { type: 'stand' };
  const options: BlackjackAction[] = [{ type: 'stand' }];
  if (cur.can.hit) options.push({ type: 'hit' });
  if (cur.can.double) options.push({ type: 'double' });
  if (cur.can.split) options.push({ type: 'split' });
  if (cur.can.surrender) options.push({ type: 'surrender' });
  return rng.pick(options);
}
