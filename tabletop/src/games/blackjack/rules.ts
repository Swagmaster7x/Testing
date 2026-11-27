/**
 * Blackjack (docs/rules/blackjack.md), behind the game contract. One to three boxes play against
 * the house; the dealer follows fixed rules inside `apply`, so the dealer is not a seat. A session
 * is a number of rounds; every box starts with the same play chips (PLAN.md decision 6: no money).
 *
 * Hidden information: the order of the shoe and the dealer's hole card until it is turned. Every
 * other card is face up, so all boxes see the same table.
 */
import type { Codec, GameDef, GameEvent, JsonCodec, Outcome, Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject, stableStringify } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Card } from '../classic/cards';
import { DECK, readCards } from '../classic/cards';
import type { StrategyRules } from './strategy';
import { handTotal, isBlackjackCards, rankIndex } from './strategy';

export const BANKROLL = 1000;
export const BET_STEP = 10;

export interface BlackjackConfig extends StrategyRules {
  readonly insurance: 'offered' | 'none';
  readonly penetration: number;
  readonly limits: '10-500' | '20-1000' | '50-2500';
  readonly rounds: number;
  readonly boxes: number;
  readonly start?: string;
}

export const STANDARD: BlackjackConfig = {
  decks: 6,
  soft17: 'stand',
  payout: '3:2',
  double: 'any',
  das: 'yes',
  splitTo: 4,
  resplitAces: 'no',
  hitSplitAces: 'no',
  surrender: 'late',
  holeCard: 'peek',
  charlie: 'off',
  insurance: 'offered',
  penetration: 75,
  limits: '10-500',
  rounds: 20,
  boxes: 1,
};

export const PRESETS: Readonly<Record<string, BlackjackConfig>> = {
  'six-deck': STANDARD,
  'double-deck': { ...STANDARD, decks: 2, soft17: 'hit', surrender: 'none' },
  'single-deck': { ...STANDARD, decks: 1, soft17: 'hit', double: '10-11', das: 'no', splitTo: 2, surrender: 'none', payout: '6:5' },
  european: { ...STANDARD, holeCard: 'enhc', double: '9-11', surrender: 'none' },
};

export const DECKS: readonly number[] = [6, 8, 2, 1];
export const SPLIT_TO: readonly number[] = [4, 3, 2];
export const PENETRATIONS: readonly number[] = [75, 50, 85];
export const ROUNDS: readonly number[] = [20, 10, 50, 100];
export const BOXES: readonly number[] = [1, 2, 3];
export const LIMITS: readonly BlackjackConfig['limits'][] = ['10-500', '20-1000', '50-2500'];

export function limitsOf(config: Pick<BlackjackConfig, 'limits'>): { min: number; max: number } {
  const [min, max] = config.limits.split('-').map(Number);
  return { min: min ?? 10, max: max ?? 500 };
}

export type HandOutcome = 'win' | 'lose' | 'push' | 'blackjack' | 'surrender' | 'bust' | 'charlie';

export interface PlayerHand {
  readonly cards: readonly Card[];
  readonly bet: number;
  readonly doubled: boolean;
  readonly fromSplit: boolean;
  readonly splitAces: boolean;
  readonly done: boolean;
  readonly surrendered: boolean;
  /** Set once the hand is settled. */
  readonly outcome: HandOutcome | null;
  /** Chips won (positive) or lost (negative) on this hand. */
  readonly net: number;
}

export interface Box {
  /** Chips not on the table. */
  readonly chips: number;
  /** This round's first bet; null until placed. */
  readonly bet: number | null;
  readonly hands: readonly PlayerHand[];
  /** Insurance taken (chips), 0 when declined, null when not yet decided or not offered. */
  readonly insurance: number | null;
  /** Can no longer cover the table minimum: sits out the rest of the session. */
  readonly out: boolean;
  /** Net chips this round, once settled. */
  readonly roundNet: number;
}

export interface RoundSnapshot {
  readonly round: number;
  readonly dealer: readonly Card[];
  readonly boxes: readonly Box[];
}

export interface BlackjackState {
  readonly config: BlackjackConfig;
  readonly seed: string;
  readonly round: number;
  /** Shuffles so far (each shuffle deals a new shoe from the seed). */
  readonly shuffles: number;
  /** Top first. */
  readonly shoe: readonly Card[];
  /** Every card shown since the last shuffle (the hole card only once it is turned). */
  readonly seen: readonly Card[];
  readonly dealer: readonly Card[];
  readonly holeShown: boolean;
  readonly phase: 'bet' | 'insurance' | 'play' | 'done';
  readonly boxes: readonly Box[];
  /** The hand to act in the play phase. */
  readonly at: { readonly box: number; readonly hand: number } | null;
  /** The last finished round, for showing its result until the next deal. */
  readonly last: RoundSnapshot | null;
  readonly history: readonly (readonly number[])[];
}

export type BlackjackAction =
  | { readonly type: 'bet'; readonly amount: number }
  | { readonly type: 'insure' }
  | { readonly type: 'no-insurance' }
  | { readonly type: 'hit' }
  | { readonly type: 'stand' }
  | { readonly type: 'double' }
  | { readonly type: 'split' }
  | { readonly type: 'surrender' };

export type Where = 'dealer' | { readonly box: number; readonly hand: number };

export type BlackjackEvent =
  | { readonly type: 'shuffle'; readonly round: number }
  | { readonly type: 'bet'; readonly seat: Seat; readonly amount: number }
  | { readonly type: 'card'; readonly round: number; readonly to: Where; readonly index: number; readonly card: Card | null }
  | { readonly type: 'insurance'; readonly seat: Seat; readonly amount: number }
  | { readonly type: 'peek'; readonly round: number; readonly blackjack: boolean }
  | { readonly type: 'reveal'; readonly round: number; readonly card: Card }
  | { readonly type: 'move'; readonly round: number; readonly seat: Seat; readonly hand: number; readonly move: 'hit' | 'stand' | 'double' | 'split' | 'surrender'; readonly total: number }
  | { readonly type: 'settle'; readonly round: number; readonly dealerTotal: number; readonly dealerBlackjack: boolean; readonly nets: readonly number[] }
  | { readonly type: 'game-end'; readonly nets: readonly number[] };

export interface BlackjackView {
  readonly seat: Seat;
  readonly config: BlackjackConfig;
  readonly round: number;
  readonly shoeLeft: number;
  readonly shoeSize: number;
  readonly seen: readonly Card[];
  /** The dealer's cards, with null for the hole card while it is face down. */
  readonly dealer: readonly (Card | null)[];
  readonly holeShown: boolean;
  readonly phase: BlackjackState['phase'];
  readonly boxes: readonly Box[];
  readonly at: BlackjackState['at'];
  readonly last: RoundSnapshot | null;
  readonly history: readonly (readonly number[])[];
}

// Shoes and totals

export function shoeOf(decks: number): Card[] {
  const out: Card[] = [];
  for (let d = 0; d < decks; d++) out.push(...DECK);
  return out;
}

const tenValue = (card: Card) => rankIndex(card) === 10;
const isAce = (card: Card) => rankIndex(card) === 1;

export function isPair(cards: readonly Card[]): boolean {
  return cards.length === 2 && rankIndex(cards[0] as Card) === rankIndex(cards[1] as Card);
}

/** A natural: two cards making 21, not after a split. */
export function isNatural(hand: Pick<PlayerHand, 'cards' | 'fromSplit'>): boolean {
  return !hand.fromSplit && isBlackjackCards(hand.cards);
}

function newHand(cards: readonly Card[], bet: number, fromSplit = false, splitAces = false): PlayerHand {
  return { cards, bet, doubled: false, fromSplit, splitAces, done: false, surrendered: false, outcome: null, net: 0 };
}

function freshShoe(s: Pick<BlackjackState, 'seed' | 'config'>, shuffles: number): Card[] {
  return createRng(`${s.seed}/shoe/${shuffles}`).shuffle(shoeOf(s.config.decks));
}

// Turns

function toMove(s: BlackjackState): Seat | null {
  switch (s.phase) {
    case 'bet': {
      const i = s.boxes.findIndex((b) => !b.out && b.bet === null);
      return i >= 0 ? i : null;
    }
    case 'insurance': {
      const i = s.boxes.findIndex((b) => !b.out && (b.bet ?? 0) > 0 && b.insurance === null);
      return i >= 0 ? i : null;
    }
    case 'play':
      return s.at ? s.at.box : null;
    default:
      return null;
  }
}

/** The bets a box may place. */
export function betChoices(config: BlackjackConfig, chips: number): number[] {
  const { min, max } = limitsOf(config);
  const out: number[] = [];
  for (let x = min; x <= Math.min(max, chips); x += BET_STEP) out.push(x);
  return out;
}

export interface Can {
  readonly hit: boolean;
  readonly double: boolean;
  readonly split: boolean;
  readonly surrender: boolean;
}

/** What the hand to act may do. */
export function whatCan(s: Pick<BlackjackState, 'config' | 'boxes'>, at: { box: number; hand: number }): Can {
  const box = s.boxes[at.box];
  const hand = box?.hands[at.hand];
  if (!box || !hand || hand.done) return { hit: false, double: false, split: false, surrender: false };
  const c = s.config;
  const total = handTotal(hand.cards).total;
  const lockedAces = hand.splitAces && c.hitSplitAces === 'no';
  const doubleTotal = c.double === 'any' || (c.double === '9-11' ? total >= 9 && total <= 11 : total >= 10 && total <= 11);
  return {
    hit: !lockedAces,
    double: !lockedAces && hand.cards.length === 2 && box.chips >= hand.bet && doubleTotal && (!hand.fromSplit || c.das === 'yes'),
    split: isPair(hand.cards) && box.hands.length < c.splitTo && box.chips >= hand.bet && (!isAce(hand.cards[0] as Card) || !hand.fromSplit || c.resplitAces === 'yes'),
    surrender: c.surrender === 'late' && hand.cards.length === 2 && !hand.fromSplit && box.hands.length === 1,
  };
}

function legalActions(s: BlackjackState, seat: Seat): BlackjackAction[] {
  if (toMove(s) !== seat) return [];
  const box = s.boxes[seat] as Box;
  if (s.phase === 'bet') return betChoices(s.config, box.chips).map((amount) => ({ type: 'bet', amount }));
  if (s.phase === 'insurance') return box.chips >= (box.bet ?? 0) / 2 ? [{ type: 'insure' }, { type: 'no-insurance' }] : [{ type: 'no-insurance' }];
  if (s.phase !== 'play' || !s.at) return [];
  const can = whatCan(s, s.at);
  const out: BlackjackAction[] = [];
  if (can.hit) out.push({ type: 'hit' });
  out.push({ type: 'stand' });
  if (can.double) out.push({ type: 'double' });
  if (can.split) out.push({ type: 'split' });
  if (can.surrender) out.push({ type: 'surrender' });
  return out;
}

// The round

interface Work {
  shoe: Card[];
  seen: Card[];
  shuffles: number;
  events: BlackjackEvent[];
  /** Cards on the table this round, face up or down (they stay out of a new shoe). */
  table: Card[];
  /** The dealer's hole card while it is face down. */
  hole: Card | null;
}

function work(s: BlackjackState, events: BlackjackEvent[], fresh = false): Work {
  const table = fresh ? [] : [...s.boxes.flatMap((b) => b.hands.flatMap((h) => h.cards)), ...s.dealer];
  return { shoe: [...s.shoe], seen: [...s.seen], shuffles: s.shuffles, events, table, hole: fresh || s.holeShown ? null : (s.dealer[1] ?? null) };
}

function draw(w: Work, s: BlackjackState, faceUp = true): Card {
  if (w.shoe.length === 0) {
    // Out of cards mid-round (only with a small shoe and a deep cut): the discards make a new shoe.
    w.shuffles++;
    const pool = shoeOf(s.config.decks);
    for (const c of w.table) pool.splice(pool.indexOf(c), 1);
    w.shoe = createRng(`${s.seed}/shoe/${w.shuffles}`).shuffle(pool);
    const faceDown = w.hole;
    let skipped = false;
    w.seen = w.table.filter((c) => {
      if (!skipped && faceDown !== null && c === faceDown) {
        skipped = true;
        return false;
      }
      return true;
    });
    w.events.push({ type: 'shuffle', round: s.round });
  }
  const card = w.shoe.shift() as Card;
  w.table.push(card);
  if (faceUp) w.seen.push(card);
  else w.hole = card;
  return card;
}

/** Deals the round once every box has bet (or sat out). */
function deal(s: BlackjackState, events: BlackjackEvent[]): BlackjackState {
  const w = work(s, events, true);
  const size = s.config.decks * DECK.length;
  if (size - w.shoe.length >= (size * s.config.penetration) / 100) {
    w.shuffles++;
    w.shoe = freshShoe(s, w.shuffles);
    w.seen = [];
    events.push({ type: 'shuffle', round: s.round });
  }
  const playing = s.boxes.map((b) => !b.out && (b.bet ?? 0) > 0);
  const first: Card[] = [];
  const second: Card[] = [];
  playing.forEach((p, i) => {
    if (!p) return;
    first[i] = draw(w, s);
    events.push({ type: 'card', round: s.round, to: { box: i, hand: 0 }, index: 0, card: first[i] });
  });
  const up = draw(w, s);
  events.push({ type: 'card', round: s.round, to: 'dealer', index: 0, card: up });
  playing.forEach((p, i) => {
    if (!p) return;
    second[i] = draw(w, s);
    events.push({ type: 'card', round: s.round, to: { box: i, hand: 0 }, index: 1, card: second[i] });
  });
  const dealer: Card[] = [up];
  if (s.config.holeCard === 'peek') {
    dealer.push(draw(w, s, false));
    events.push({ type: 'card', round: s.round, to: 'dealer', index: 1, card: null });
  }
  const boxes = s.boxes.map((b, i) => (playing[i] ? { ...b, hands: [newHand([first[i] as Card, second[i] as Card], b.bet ?? 0)] } : { ...b, hands: [] }));
  const next: BlackjackState = { ...s, shoe: w.shoe, seen: w.seen, shuffles: w.shuffles, dealer, holeShown: false, boxes };
  if (s.config.insurance === 'offered' && isAce(up) && boxes.some((b) => b.hands.length > 0)) {
    return { ...next, phase: 'insurance', boxes: next.boxes.map((b) => ({ ...b, insurance: b.hands.length > 0 ? null : 0 })) };
  }
  return afterInsurance(next, events);
}

/** The peek, paying player blackjacks, and the start of the players' turns. */
function afterInsurance(s: BlackjackState, events: BlackjackEvent[]): BlackjackState {
  const up = s.dealer[0] as Card;
  if (s.config.holeCard === 'peek' && (isAce(up) || tenValue(up))) {
    const dealerBj = isBlackjackCards(s.dealer);
    events.push({ type: 'peek', round: s.round, blackjack: dealerBj });
    if (dealerBj) return settle({ ...s, holeShown: true, seen: [...s.seen, s.dealer[1] as Card] }, events, true);
  }
  // Insurance is lost when the dealer has no blackjack (with no hole card it is settled at the end).
  let boxes = s.boxes;
  if (s.config.holeCard === 'peek') {
    boxes = boxes.map((b) => {
      const hand = b.hands[0];
      if (!hand || !isNatural(hand)) return b;
      const won = blackjackWin(s.config, hand.bet);
      return { ...b, chips: b.chips + hand.bet + won, hands: [{ ...hand, done: true, outcome: 'blackjack' as const, net: won }], roundNet: b.roundNet + won };
    });
  } else {
    boxes = boxes.map((b) => {
      const hand = b.hands[0];
      return hand && isNatural(hand) ? { ...b, hands: [{ ...hand, done: true }] } : b;
    });
  }
  return advance({ ...s, boxes, phase: 'play', at: null }, events);
}

function blackjackWin(config: BlackjackConfig, bet: number): number {
  return config.payout === '3:2' ? (bet * 3) / 2 : (bet * 6) / 5;
}

/** Moves the turn to the next hand that still has to act, or plays the dealer. */
function advance(s: BlackjackState, events: BlackjackEvent[]): BlackjackState {
  for (let b = 0; b < s.boxes.length; b++) {
    const box = s.boxes[b] as Box;
    for (let h = 0; h < box.hands.length; h++) {
      if (!(box.hands[h] as PlayerHand).done) return { ...s, at: { box: b, hand: h } };
    }
  }
  return dealerTurn({ ...s, at: null }, events);
}

function dealerTurn(s: BlackjackState, events: BlackjackEvent[]): BlackjackState {
  const w = work(s, events);
  const dealer = [...s.dealer];
  if (s.config.holeCard === 'peek') {
    w.seen.push(dealer[1] as Card);
    w.hole = null;
    events.push({ type: 'reveal', round: s.round, card: dealer[1] as Card });
  } else {
    const card = draw(w, s);
    dealer.push(card);
    events.push({ type: 'card', round: s.round, to: 'dealer', index: 1, card });
  }
  const live = s.boxes.some((b) => b.hands.some((h) => !h.surrendered && h.outcome === null && handTotal(h.cards).total <= 21 && !isNatural(h) && !(s.config.charlie === 'five' && h.cards.length >= 5)));
  const dealerBj = isBlackjackCards(dealer);
  if (live && !dealerBj) {
    for (;;) {
      const t = handTotal(dealer);
      if (t.total > 17 || (t.total === 17 && !(t.soft && s.config.soft17 === 'hit'))) break;
      const card = draw(w, s);
      dealer.push(card);
      events.push({ type: 'card', round: s.round, to: 'dealer', index: dealer.length - 1, card });
    }
  }
  return settle({ ...s, shoe: w.shoe, seen: w.seen, shuffles: w.shuffles, dealer, holeShown: true }, events, dealerBj);
}

/** Settles every hand and insurance bet, records the round, and starts the next one (or ends the session). */
function settle(s: BlackjackState, events: BlackjackEvent[], dealerBj: boolean): BlackjackState {
  const dt = handTotal(s.dealer).total;
  const c = s.config;
  const boxes = s.boxes.map((b) => {
    let chips = b.chips;
    let net = b.roundNet;
    if ((b.insurance ?? 0) > 0) {
      const ins = b.insurance as number;
      if (dealerBj) {
        chips += ins * 3;
        net += ins * 2;
      } else net -= ins;
    }
    // With no hole card and only original bets lost, a box loses at most its first bet to a dealer blackjack.
    let obo = c.holeCard === 'enhc-obo' && dealerBj ? (b.bet ?? 0) : Infinity;
    const hands = b.hands.map((h) => {
      if (h.outcome !== null) return h;
      let outcome: HandOutcome;
      let won: number;
      const t = handTotal(h.cards).total;
      if (h.surrendered) {
        outcome = 'surrender';
        won = -h.bet / 2;
      } else if (t > 21) {
        outcome = 'bust';
        won = -h.bet;
      } else if (isNatural(h)) {
        outcome = dealerBj ? 'push' : 'blackjack';
        won = dealerBj ? 0 : blackjackWin(c, h.bet);
      } else if (dealerBj) {
        outcome = 'lose';
        const loss = Math.min(h.bet, obo);
        obo -= loss;
        won = -loss;
      } else if (c.charlie === 'five' && h.cards.length >= 5) {
        outcome = 'charlie';
        won = h.bet;
      } else if (dt > 21 || t > dt) {
        outcome = 'win';
        won = h.bet;
      } else if (t === dt) {
        outcome = 'push';
        won = 0;
      } else {
        outcome = 'lose';
        won = -h.bet;
      }
      chips += h.bet + won;
      net += won;
      return { ...h, done: true, outcome, net: won };
    });
    return { ...b, chips, hands, roundNet: net };
  });
  const nets = boxes.map((b) => b.roundNet);
  events.push({ type: 'settle', round: s.round, dealerTotal: dt, dealerBlackjack: dealerBj, nets });
  const last: RoundSnapshot = { round: s.round, dealer: s.dealer, boxes };
  const history = [...s.history, nets];
  const { min } = limitsOf(c);
  const nextBoxes = boxes.map((b) => ({ chips: b.chips, bet: null, hands: [], insurance: null, out: b.out || b.chips < min, roundNet: 0 }));
  const round = s.round + 1;
  const finished = round >= c.rounds || nextBoxes.every((b) => b.out);
  const base: BlackjackState = { ...s, holeShown: true, boxes: nextBoxes, at: null, last, history, round, dealer: [] };
  if (finished) {
    const totals = nextBoxes.map((b) => b.chips - BANKROLL);
    events.push({ type: 'game-end', nets: totals });
    return { ...base, phase: 'done' };
  }
  return { ...base, phase: 'bet' };
}

function applyAction(s: BlackjackState, action: BlackjackAction): { state: BlackjackState; events: BlackjackEvent[] } {
  const seat = toMove(s);
  if (seat === null) throw new Error('The session is over');
  const key = actionText(action);
  if (!legalActions(s, seat).some((a) => actionText(a) === key)) throw new Error(`${key} is not legal here`);
  const events: BlackjackEvent[] = [];
  const setBox = (st: BlackjackState, i: number, box: Box) => ({ ...st, boxes: st.boxes.map((b, j) => (j === i ? box : b)) });
  const box = s.boxes[seat] as Box;

  if (action.type === 'bet') {
    events.push({ type: 'bet', seat, amount: action.amount });
    const next = setBox(s, seat, { ...box, bet: action.amount, chips: box.chips - action.amount });
    if (toMove(next) !== null) return { state: next, events };
    return { state: deal(next, events), events };
  }
  if (action.type === 'insure' || action.type === 'no-insurance') {
    const amount = action.type === 'insure' ? (box.bet ?? 0) / 2 : 0;
    events.push({ type: 'insurance', seat, amount });
    const next = setBox(s, seat, { ...box, insurance: amount, chips: box.chips - amount });
    if (toMove(next) !== null) return { state: next, events };
    return { state: afterInsurance(next, events), events };
  }

  const at = s.at as { box: number; hand: number };
  const hand = box.hands[at.hand] as PlayerHand;
  const w = work(s, events);
  const putHands = (hands: readonly PlayerHand[], chips = box.chips): BlackjackState => ({ ...setBox(s, seat, { ...box, hands, chips }), shoe: w.shoe, seen: w.seen, shuffles: w.shuffles });
  const finishIfDone = (h: PlayerHand): PlayerHand => {
    const t = handTotal(h.cards).total;
    const charlie = s.config.charlie === 'five' && h.cards.length >= 5;
    return t >= 21 || charlie ? { ...h, done: true } : h;
  };
  let next: BlackjackState;
  switch (action.type) {
    case 'hit': {
      const card = draw(w, s);
      const cards = [...hand.cards, card];
      events.push({ type: 'move', round: s.round, seat, hand: at.hand, move: 'hit', total: handTotal(cards).total });
      events.push({ type: 'card', round: s.round, to: at, index: cards.length - 1, card });
      next = putHands(box.hands.map((h, i) => (i === at.hand ? finishIfDone({ ...h, cards }) : h)));
      break;
    }
    case 'stand':
      events.push({ type: 'move', round: s.round, seat, hand: at.hand, move: 'stand', total: handTotal(hand.cards).total });
      next = putHands(box.hands.map((h, i) => (i === at.hand ? { ...h, done: true } : h)));
      break;
    case 'double': {
      const card = draw(w, s);
      const cards = [...hand.cards, card];
      events.push({ type: 'move', round: s.round, seat, hand: at.hand, move: 'double', total: handTotal(cards).total });
      events.push({ type: 'card', round: s.round, to: at, index: 2, card });
      next = putHands(
        box.hands.map((h, i) => (i === at.hand ? { ...h, cards, bet: h.bet * 2, doubled: true, done: true } : h)),
        box.chips - hand.bet,
      );
      break;
    }
    case 'surrender':
      events.push({ type: 'move', round: s.round, seat, hand: at.hand, move: 'surrender', total: handTotal(hand.cards).total });
      next = putHands(box.hands.map((h, i) => (i === at.hand ? { ...h, surrendered: true, done: true } : h)));
      break;
    case 'split': {
      const aces = isAce(hand.cards[0] as Card);
      events.push({ type: 'move', round: s.round, seat, hand: at.hand, move: 'split', total: handTotal(hand.cards).total });
      const a = draw(w, s);
      const b = draw(w, s);
      const lock = (h: PlayerHand): PlayerHand => {
        // Split aces take one card each and stand, unless they may be hit, or resplit on another ace.
        if (!aces || s.config.hitSplitAces === 'yes') return finishIfDone(h);
        const again = isAce(h.cards[1] as Card) && s.config.resplitAces === 'yes';
        return again ? h : { ...h, done: true };
      };
      const one = lock(newHand([hand.cards[0] as Card, a], hand.bet, true, aces));
      const two = lock(newHand([hand.cards[1] as Card, b], hand.bet, true, aces));
      events.push({ type: 'card', round: s.round, to: { box: seat, hand: at.hand }, index: 1, card: a });
      events.push({ type: 'card', round: s.round, to: { box: seat, hand: at.hand + 1 }, index: 1, card: b });
      const hands = [...box.hands.slice(0, at.hand), one, two, ...box.hands.slice(at.hand + 1)];
      next = putHands(hands, box.chips - hand.bet);
      break;
    }
    default:
      throw new Error('Unknown move');
  }
  return { state: advance(next, events), events };
}

// Codecs

export function actionText(a: BlackjackAction): string {
  return a.type === 'bet' ? `bet:${a.amount}` : a.type;
}

function parseAction(text: string): BlackjackAction {
  const t = text.trim();
  const bet = /^bet:(\d+)$/.exec(t);
  if (bet) return { type: 'bet', amount: Number(bet[1]) };
  if (['insure', 'no-insurance', 'hit', 'stand', 'double', 'split', 'surrender'].includes(t)) return { type: t } as BlackjackAction;
  throw new Error(`"${text}" is not a Blackjack move, such as bet:20, hit or stand`);
}

const CONFIG_KEYS = ['decks', 'soft17', 'payout', 'double', 'das', 'splitTo', 'resplitAces', 'hitSplitAces', 'surrender', 'holeCard', 'charlie', 'insurance', 'penetration', 'limits', 'rounds', 'boxes'] as const;

function readConfig(json: Json): BlackjackConfig {
  if (!isJsonObject(json)) return STANDARD;
  const pick = <K extends keyof BlackjackConfig>(key: K, allowed: readonly BlackjackConfig[K][]): BlackjackConfig[K] => {
    const value = json[key] as BlackjackConfig[K] | undefined;
    return value !== undefined && allowed.includes(value) ? value : STANDARD[key];
  };
  return {
    decks: pick('decks', DECKS),
    soft17: pick('soft17', ['stand', 'hit']),
    payout: pick('payout', ['3:2', '6:5']),
    double: pick('double', ['any', '9-11', '10-11']),
    das: pick('das', ['yes', 'no']),
    splitTo: pick('splitTo', SPLIT_TO),
    resplitAces: pick('resplitAces', ['no', 'yes']),
    hitSplitAces: pick('hitSplitAces', ['no', 'yes']),
    surrender: pick('surrender', ['late', 'none']),
    holeCard: pick('holeCard', ['peek', 'enhc', 'enhc-obo']),
    charlie: pick('charlie', ['off', 'five']),
    insurance: pick('insurance', ['offered', 'none']),
    penetration: pick('penetration', PENETRATIONS),
    limits: pick('limits', LIMITS),
    rounds: pick('rounds', ROUNDS),
    boxes: pick('boxes', BOXES),
    ...(typeof json.start === 'string' ? { start: json.start } : {}),
  };
}

function configJson(c: BlackjackConfig): Json {
  const out: Record<string, Json> = {};
  for (const key of CONFIG_KEYS) out[key] = c[key];
  if (c.start) out.start = c.start;
  return out;
}

const OUTCOMES: readonly HandOutcome[] = ['win', 'lose', 'push', 'blackjack', 'surrender', 'bust', 'charlie'];

function handFromJson(j: Json): PlayerHand {
  if (!isJsonObject(j)) throw new Error('Blackjack: a hand is damaged');
  return {
    cards: readCards(j.cards, 'Blackjack: a hand'),
    bet: typeof j.bet === 'number' ? j.bet : 0,
    doubled: j.doubled === true,
    fromSplit: j.fromSplit === true,
    splitAces: j.splitAces === true,
    done: j.done === true,
    surrendered: j.surrendered === true,
    outcome: OUTCOMES.includes(j.outcome as HandOutcome) ? (j.outcome as HandOutcome) : null,
    net: typeof j.net === 'number' ? j.net : 0,
  };
}

function boxFromJson(j: Json): Box {
  if (!isJsonObject(j)) throw new Error('Blackjack: a box is damaged');
  return {
    chips: typeof j.chips === 'number' ? j.chips : BANKROLL,
    bet: typeof j.bet === 'number' ? j.bet : null,
    hands: Array.isArray(j.hands) ? j.hands.map(handFromJson) : [],
    insurance: typeof j.insurance === 'number' ? j.insurance : null,
    out: j.out === true,
    roundNet: typeof j.roundNet === 'number' ? j.roundNet : 0,
  };
}

const handJson = (h: PlayerHand): Json => ({ cards: [...h.cards], bet: h.bet, doubled: h.doubled, fromSplit: h.fromSplit, splitAces: h.splitAces, done: h.done, surrendered: h.surrendered, outcome: h.outcome, net: h.net });
const boxJson = (b: Box): Json => ({ chips: b.chips, bet: b.bet, hands: b.hands.map(handJson), insurance: b.insurance, out: b.out, roundNet: b.roundNet });

function stateFromJson(json: Json): BlackjackState {
  if (!isJsonObject(json)) throw new Error('Not a Blackjack position');
  const config = readConfig(json.config ?? null);
  const at = isJsonObject(json.at) && typeof json.at.box === 'number' && typeof json.at.hand === 'number' ? { box: json.at.box, hand: json.at.hand } : null;
  const last = isJsonObject(json.last) && typeof json.last.round === 'number' ? { round: json.last.round, dealer: readCards(json.last.dealer ?? [], 'Blackjack: the dealer'), boxes: Array.isArray(json.last.boxes) ? json.last.boxes.map(boxFromJson) : [] } : null;
  const phases = ['bet', 'insurance', 'play', 'done'] as const;
  return {
    config,
    seed: typeof json.seed === 'string' ? json.seed : 'lesson',
    round: typeof json.round === 'number' ? json.round : 0,
    shuffles: typeof json.shuffles === 'number' ? json.shuffles : 0,
    shoe: readCards(json.shoe ?? [], 'Blackjack: the shoe'),
    seen: readCards(json.seen ?? [], 'Blackjack: the cards seen'),
    dealer: readCards(json.dealer ?? [], 'Blackjack: the dealer'),
    holeShown: json.holeShown === true,
    phase: phases.includes(json.phase as (typeof phases)[number]) ? (json.phase as BlackjackState['phase']) : 'bet',
    boxes: Array.isArray(json.boxes) ? json.boxes.map(boxFromJson) : [],
    at,
    last,
    history: Array.isArray(json.history) ? json.history.map((r) => (Array.isArray(r) ? r.map((x) => (typeof x === 'number' ? x : 0)) : [])) : [],
  };
}

function stateToJson(s: BlackjackState): Json {
  return {
    config: configJson(s.config),
    seed: s.seed,
    round: s.round,
    shuffles: s.shuffles,
    shoe: [...s.shoe],
    seen: [...s.seen],
    dealer: [...s.dealer],
    holeShown: s.holeShown,
    phase: s.phase,
    boxes: s.boxes.map(boxJson),
    at: s.at ? { box: s.at.box, hand: s.at.hand } : null,
    last: s.last ? { round: s.last.round, dealer: [...s.last.dealer], boxes: s.last.boxes.map(boxJson) } : null,
    history: s.history.map((r) => [...r]),
  };
}

const stateCodec: Codec<BlackjackState> = {
  toJSON: stateToJson,
  fromJSON: stateFromJson,
  toText: (s) => stableStringify(stateToJson(s)),
  fromText: (text) => stateFromJson(JSON.parse(text) as Json),
};

const actionCodec: Codec<BlackjackAction> = {
  toJSON: (a) => actionText(a),
  fromJSON(json) {
    if (typeof json !== 'string') throw new Error('A Blackjack move is stored as text, such as bet:20 or hit');
    return parseAction(json);
  },
  toText: actionText,
  fromText: (text) => parseAction(text),
};

const configCodec: JsonCodec<BlackjackConfig> = { toJSON: configJson, fromJSON: readConfig };

function outcomeOf(s: BlackjackState): Outcome | null {
  if (s.phase !== 'done') return null;
  const nets = s.boxes.map((b) => b.chips - BANKROLL);
  if (nets.length === 1) {
    // Alone at the table the session is against the house, which takes the other side of every bet.
    const mine = nets[0] ?? 0;
    return {
      reason: 'blackjack-session',
      results: [
        { seat: 0, place: mine >= 0 ? 1 : 2, score: mine },
        { seat: 1, place: mine <= 0 ? 1 : 2, score: -mine },
      ],
    };
  }
  return { reason: 'blackjack-session', results: nets.map((score, seat) => ({ seat, place: 1 + nets.filter((x) => x > score).length, score })) };
}

export function viewOf(s: BlackjackState, seat: Seat): BlackjackView {
  return {
    seat,
    config: s.config,
    round: s.round,
    shoeLeft: s.shoe.length,
    shoeSize: s.config.decks * DECK.length,
    seen: s.seen,
    dealer: s.dealer.map((c, i) => (i === 1 && !s.holeShown ? null : c)),
    holeShown: s.holeShown,
    phase: s.phase,
    boxes: s.boxes,
    at: s.at,
    last: s.last,
    history: s.history,
  };
}

/** The cards still unseen (in the shoe, or face down under the dealer's up-card), as a multiset. */
export function unseenCards(v: Pick<BlackjackView, 'config' | 'seen'>): Card[] {
  const left = new Map<Card, number>();
  for (const c of DECK) left.set(c, v.config.decks);
  for (const c of v.seen) left.set(c, (left.get(c) ?? 0) - 1);
  const out: Card[] = [];
  for (const [c, n] of left) for (let i = 0; i < n; i++) out.push(c);
  return out;
}

/** A full state consistent with a view: a shuffled shoe of the unseen cards, and a hole card that agrees with the peek. */
export function sampleState(v: BlackjackView, rng: Rng): BlackjackState {
  const unseen = rng.shuffle(unseenCards(v));
  const dealer = v.dealer.map((c) => c ?? null);
  if (dealer.length >= 2 && dealer[1] === null) {
    const up = dealer[0] as Card;
    const peeked = v.config.holeCard === 'peek' && v.phase === 'play' && (isAce(up) || tenValue(up));
    const ok = (c: Card) => !peeked || !(isAce(up) ? tenValue(c) : isAce(c));
    const i = unseen.findIndex(ok);
    dealer[1] = unseen.splice(Math.max(0, i), 1)[0] as Card;
  }
  return {
    config: v.config,
    seed: `sample/${rng.int(1_000_000_000)}`,
    round: v.round,
    shuffles: 0,
    shoe: unseen.slice(0, v.shoeLeft),
    seen: v.seen,
    dealer: dealer as Card[],
    holeShown: v.holeShown,
    phase: v.phase,
    boxes: v.boxes,
    at: v.at,
    last: v.last,
    history: v.history,
  };
}

export const blackjack: GameDef<BlackjackState, BlackjackAction, BlackjackConfig, BlackjackView, BlackjackEvent & GameEvent> = {
  id: 'blackjack',
  rulesVersion: 1,
  defaultConfig: STANDARD,
  setup(config, rng) {
    const seed = `blackjack/${rng.int(2_147_483_647)}/${rng.int(2_147_483_647)}`;
    if (config.start) {
      const from = stateFromJson(JSON.parse(config.start) as Json);
      return { ...from, config: { ...config, start: undefined }, seed };
    }
    const base = { seed, config };
    const boxes: Box[] = Array.from({ length: config.boxes }, () => ({ chips: BANKROLL, bet: null, hands: [], insurance: null, out: false, roundNet: 0 }));
    return { config, seed, round: 0, shuffles: 0, shoe: freshShoe(base, 0), seen: [], dealer: [], holeShown: false, phase: 'bet', boxes, at: null, last: null, history: [] };
  },
  seats: (s) => s.boxes.map((_, i) => i),
  turn: toMove,
  legal: legalActions,
  apply: applyAction,
  outcome: outcomeOf,
  view: viewOf,
  sample: (view, _seat, rng) => sampleState(view, rng),
  codec: { state: stateCodec, action: actionCodec, config: configCodec },
};

export function presetOf(config: BlackjackConfig): string | null {
  const key = stableStringify(configJson({ ...config, start: undefined }));
  return Object.entries(PRESETS).find(([, c]) => stableStringify(configJson(c)) === key)?.[0] ?? null;
}

/**
 * A position for lessons and drills: one box (the student) with a hand against a dealer up-card,
 * in the play phase. The rest of the shoe follows in a fixed order after `next` (the next cards).
 */
export function position(p: { hand: readonly Card[]; up: Card; hole?: Card; next?: readonly Card[]; bet?: number; config?: Partial<BlackjackConfig>; chips?: number; seen?: readonly Card[] }): string {
  const config: BlackjackConfig = { ...STANDARD, boxes: 1, ...p.config };
  const hole = p.hole ?? ('9c');
  const pool = shoeOf(config.decks);
  const take = (c: Card) => {
    const i = pool.indexOf(c);
    if (i < 0) throw new Error(`Blackjack position: no ${c} left in the shoe`);
    pool.splice(i, 1);
  };
  for (const c of [...p.hand, p.up, hole, ...(p.next ?? []), ...(p.seen ?? [])]) take(c);
  const bet = p.bet ?? 10;
  const state: BlackjackState = {
    config,
    seed: 'lesson',
    round: 0,
    shuffles: 0,
    shoe: [...(p.next ?? []), ...pool],
    seen: [...(p.seen ?? []), ...p.hand, p.up],
    dealer: config.holeCard === 'peek' ? [p.up, hole] : [p.up],
    holeShown: false,
    phase: 'play',
    boxes: [{ chips: (p.chips ?? BANKROLL) - bet, bet, hands: [newHand(p.hand, bet)], insurance: 0, out: false, roundNet: 0 }],
    at: { box: 0, hand: 0 },
    last: null,
    history: [],
  };
  return stateCodec.toText(state);
}
