/**
 * Hold'em for the lesson runner: positions in state notation (`holdem.codec.state`), moves in
 * action notation (fold, check, call, r60 for a raise to 60). A move may be several actions
 * separated by spaces ("fold fold call"), so one scripted reply carries every other player's turn.
 *
 * You always sit in seat 0. A lesson position is the last hand of a short cash session
 * (`lessonPosition`), so the table stops when that hand ends instead of dealing the next one.
 *
 * Numbers in lesson text come from `pokerComputed`: pot sizes, amounts to call, pot odds, outs,
 * exact equity, side pots, hand names, positions, the preflop chart, session statistics and the
 * tournament blinds, all worked out from the rules, the evaluator and the strategy modules.
 */
import { findLegal } from '../../../core/contract';
import type { Seat } from '../../../core/contract';
import { tDynamic } from '../../../text';
import type { LessonGame } from '../../../teach/runner';
import { pushFraction, STYLE_PARAMS } from '../bots';
import type { Card } from '../cards';
import { cardIndex, DECK, HAND_CLASSES, handClass, RANKS, SUITS } from '../cards';
import { ALL_COMBOS, combosOf } from '../equity';
import { CATEGORY_NAMES, categoryOf, evaluate, handNameParts, ranksOf } from '../evaluate';
import { HEADS_UP_OPEN, OPEN, openFraction, rankOf } from '../preflop';
import { outs } from '../reading';
import type { HoldemConfig, HoldemState, Player } from '../rules';
import { actionText, ANTE_LEVEL, blindsAt, dealtOrder, holdem, inHand, isFreezeout, LEVELS, position, positionName, potOf, PRESETS, raiseRange, seatsInHand, settle, SIX_MAX_CASH, startChips, toCallOf } from '../rules';
import { seatName } from '../ui/names';
import { callGain, cardsToCome, deadFor, holeOf, knownEquity, liveHands, othersAllIn, pushGain, rangeShare, winningCards } from './math';
import { assumed, assumedRange, liveCombos } from './ranges';

export const STUDENT: Seat = 0;
/** A lesson hand is the last of a session this long, so nothing is dealt after it. */
export const LESSON_HANDS = 10;

type PositionSpec = Parameters<typeof position>[0];

/** A lesson position in notation: the last hand of a short cash session, unless the format is a freezeout. */
export function lessonPosition(p: PositionSpec): string {
  const config: Partial<HoldemConfig> = { ...p.config };
  const freezeout = config.format !== undefined && config.format !== 'cash';
  const spec: PositionSpec = freezeout ? p : { ...p, config: { ...config, hands: LESSON_HANDS }, handNo: LESSON_HANDS };
  return holdem.codec.state.toText(position(spec));
}

/** Plays actions in notation from a position in notation (for building later lesson positions). */
export function after(start: string, moves: string): string {
  const s = playAll(holdem.codec.state.fromText(start), moves);
  if (!s) throw new Error(`Hold'em lesson: "${moves}" is not legal here`);
  return holdem.codec.state.toText(s.state);
}

function parse(state: HoldemState, move: string) {
  const seat = holdem.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(holdem, state, seat, holdem.codec.action.fromText(move));
  } catch {
    return null;
  }
}

/** Plays one or more actions; null if any is not legal. */
function playAll(state: HoldemState, moves: string): { state: HoldemState; canonical: string[] } | null {
  let s = state;
  const canonical: string[] = [];
  const list = moves.trim().split(/\s+/).filter(Boolean);
  if (list.length === 0) return null;
  for (const move of list) {
    const action = parse(s, move);
    if (!action) return null;
    canonical.push(actionText(action));
    s = holdem.apply(s, action).state;
  }
  return { state: s, canonical };
}

const pct = (x: number): number => Math.round(100 * x);
const oneDecimal = (x: number): string => (Math.round(x * 10) / 10).toString();

/** The board after each street, counted by dealing a hand that is checked to the river. */
const STREET_CARDS = (() => {
  let s = position({ seats: 2, holes: [] });
  const counts: number[] = [];
  for (const m of ['call', 'check', 'check', 'check', 'check', 'check']) {
    const before = s.board.length;
    s = holdem.apply(s, holdem.codec.action.fromText(m)).state;
    if (s.board.length !== before) counts.push(s.board.length);
  }
  return counts;
})();

const DEALT = position({ holes: [] });
const STRADDLED = position({ config: { straddle: 'live' }, holes: [] });
const sngChips = startChips(PRESETS['sit-and-go'] ?? SIX_MAX_CASH);

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number | string> = (() => {
  const out: Record<string, number | string> = {
    deck: DECK.length,
    suits: SUITS.length,
    ranks: RANKS.length,
    hole: DEALT.players[0]?.hole.length ?? 0,
    'flop:cards': STREET_CARDS[0] ?? 0,
    'turn:cards': (STREET_CARDS[1] ?? 0) - (STREET_CARDS[0] ?? 0),
    'board:cards': STREET_CARDS[2] ?? 0,
    'hand:cards': ranksOf(0).length,
    'cards:all': (DEALT.players[0]?.hole.length ?? 0) + (STREET_CARDS[2] ?? 0),
    categories: CATEGORY_NAMES.length,
    classes: HAND_CLASSES.length,
    'combos:all': ALL_COMBOS.length,
    'combos:pair': combosOf('AA').length,
    'combos:suited': combosOf('AKs').length,
    'combos:offsuit': combosOf('AKo').length,
    'combos:unpaired': combosOf('AKs').length + combosOf('AKo').length,
    seats: DEALT.players.length,
    'cash:sb': blindsAt(SIX_MAX_CASH, 1).sb,
    'cash:bb': blindsAt(SIX_MAX_CASH, 1).bb,
    'cash:stack': startChips(SIX_MAX_CASH),
    'cash:stack-bb': SIX_MAX_CASH.stack,
    straddle: blindsAt({ ...SIX_MAX_CASH, straddle: 'live' }, 1).straddle,
    'straddle:min-raise': raiseRange(STRADDLED, STRADDLED.toAct ?? 0)?.min ?? 0,
    'sng:chips': sngChips,
    'sng:bb': sngChips / (LEVELS[0]?.[1] ?? 1),
    'level-hands': SIX_MAX_CASH.levelHands,
    'ante-level': ANTE_LEVEL,
    'open:hu': pct(HEADS_UP_OPEN),
    // The rule of 2 and 4: one card in about 46 is worth about 2 per cent; two cards to come, about 4.
    'rule:one': Math.round(100 / (DECK.length - 6)),
    'rule:two': Math.round(200 / (DECK.length - 5)),
  };
  for (const [pos, fraction] of Object.entries(OPEN)) out[`open:${pos}`] = pct(fraction);
  LEVELS.forEach(([sb, bb], i) => {
    out[`level:${i + 1}:sb`] = sb;
    out[`level:${i + 1}:bb`] = bb;
    out[`level:${i + 1}:m`] = Math.floor(sngChips / (sb + bb));
  });
  // A caller's break-even share, and how often a bluff must work, for common bet sizes.
  for (const [name, f] of [
    ['third', 1 / 3],
    ['half', 1 / 2],
    ['two-thirds', 2 / 3],
    ['pot', 1],
  ] as const) {
    out[`need:${name}`] = pct(f / (1 + 2 * f));
    out[`bluff:${name}`] = pct(f / (1 + f));
  }
  for (const bb of [4, 6, 8, 10, 13]) for (const behind of [1, 2]) out[`push:${bb}:${behind}`] = pct(pushFraction(bb, behind));
  return out;
})();

/** "the button", "under the gun". */
export const positionWords = (pos: string): string => tDynamic(`poker.position.${pos}`);

/** A hand's name for the middle of a sentence: "a pair of queens", "two pair, kings and nines", "a royal flush". */
export function handPhrase(value: number): string {
  const { category, ranks } = handNameParts(value);
  const [a = '2', b = '2'] = ranks;
  const one = (r: string) => tDynamic(`poker.rank.${r}`).toLowerCase();
  const many = (r: string) => tDynamic(`poker.ranks.${r}`);
  if (category === 'straight-flush' && a === 'A') return tDynamic('poker.phrase.royal-flush');
  const plural = category === 'pair' || category === 'two-pair' || category === 'trips' || category === 'full-house' || category === 'quads';
  return tDynamic(`poker.phrase.${category}`, { a: plural ? many(a) : one(a), b: many(b) });
}

/** "ace-king suited", "a pair of sevens". */
export function classWords(cls: string): string {
  const a = tDynamic(`poker.rank.${cls.charAt(0)}`).toLowerCase();
  const b = tDynamic(`poker.rank.${cls.charAt(1)}`).toLowerCase();
  if (cls.length === 2) return tDynamic('poker.class.pair', { a: tDynamic(`poker.ranks.${cls.charAt(0)}`) });
  return tDynamic(cls.endsWith('s') ? 'poker.class.suited' : 'poker.class.offsuit', { a, b });
}

const valueOf = (p: Player, board: readonly Card[]): number | null => (p.hole.length === 2 && p.hole.length + board.length >= 5 ? evaluate([...p.hole, ...board]) : null);

const CACHE = new Map<string, Readonly<Record<string, number | string>>>();

/** Values for {placeholders}, from the student's seat (0). */
export function pokerComputed(state: HoldemState): Readonly<Record<string, number | string>> {
  const key = holdem.codec.state.toText(state);
  const hit = CACHE.get(key);
  if (hit) return hit;
  const out = computeAll(state);
  if (CACHE.size > 400) CACHE.clear();
  CACHE.set(key, out);
  return out;
}

function computeAll(state: HoldemState): Record<string, number | string> {
  const out: Record<string, number | string> = { ...FIXED };
  const me = state.players[STUDENT];
  if (!me) return out;
  const bb = state.blinds.bb;
  const board = state.board;
  const pot = potOf(state);
  const owe = Math.min(toCallOf(state, STUDENT), me.stack);
  out.bb = bb;
  out.sb = state.blinds.sb;
  out.ante = state.blinds.ante;
  out.level = state.level;
  out.pot = pot;
  out['pot:bb'] = oneDecimal(pot / bb);
  out.call = owe;
  out.final = pot + owe;
  out.need = owe > 0 ? pct(owe / (pot + owe)) : 0;
  out.odds = owe > 0 ? `${oneDecimal(pot / owe)} to 1` : '';
  out.stack = me.stack;
  out['stack:bb'] = oneDecimal(me.stack / bb);
  out['stack:bbs'] = Math.round(me.stack / bb);
  if (isFreezeout(state.config)) {
    const next = blindsAt(state.config, state.level + 1);
    out['next:sb'] = next.sb;
    out['next:bb'] = next.bb;
    out['stack:next'] = Math.round(me.stack / next.bb);
  }
  out.current = state.currentBet;
  out['min-raise:by'] = state.minRaise;
  out.players = dealtOrder(state).length;
  out['in-hand'] = seatsInHand(state).length;
  out['to-come'] = Math.max(0, (FIXED['board:cards'] as number) - board.length);
  out['board:now'] = board.length;
  out.behind = seatsInHand(state).filter((s) => s !== STUDENT).length;
  out['open:size'] = Math.round(STYLE_PARAMS.solid.open * bb);
  out.unseen = DECK.length - me.hole.length - board.length;
  out['unseen:open'] = cardsToCome(state).length;
  // A bet as a share of the pot before it, for sizing lessons.
  const before = pot - state.players.reduce((a, p) => a + p.bet, 0);
  out['pot:before'] = before;
  for (const [name, f] of [
    ['third', 1 / 3],
    ['half', 1 / 2],
    ['two-thirds', 2 / 3],
    ['pot', 1],
  ] as const) {
    out[`size:${name}`] = Math.round(before * f);
  }
  state.players.forEach((p, seat) => {
    out[`name:${seat}`] = seatName(seat, STUDENT);
    out[`stack:${seat}`] = p.stack;
    out[`bet:${seat}`] = p.bet;
    out[`total:${seat}`] = p.total;
    if (p.hole.length > 0 && !p.out) out[`pos:${seat}`] = positionWords(positionName(state, seat));
    const st = state.stats[seat];
    if (st) {
      out[`hands:${seat}`] = st.hands;
      out[`vpip:${seat}`] = st.hands > 0 ? pct(st.vpip / st.hands) : 0;
      out[`pfr:${seat}`] = st.hands > 0 ? pct(st.pfr / st.hands) : 0;
      out[`af:${seat}`] = oneDecimal(st.aggressive / Math.max(1, st.passive));
    }
    const v = valueOf(p, board);
    if (v !== null && seat !== STUDENT) out[`hand:${seat}`] = handPhrase(v);
  });
  if (state.toAct !== null) {
    const range = raiseRange(state, state.toAct);
    if (range) {
      out['min-raise'] = range.min;
      out['all-in'] = range.max;
    }
    out['three-bet'] = Math.round(state.currentBet * 3);
    out['three-bet:oop'] = Math.round(state.currentBet * 4);
  }
  if (me.hole.length === 2) {
    const cls = handClass(me.hole[0] as Card, me.hole[1] as Card);
    out.class = cls;
    out['class:words'] = classWords(cls);
    out['rank:pct'] = pct(rankOf(cls));
    out.top = pct(rankOf(cls) + combosOf(cls).length / ALL_COMBOS.length);
    const pos = positionName(state, STUDENT);
    out.pos = positionWords(pos);
    out['pos:at'] = tDynamic(`poker.position.at.${pos}`);
    out.open = pct(openFraction(pos, dealtOrder(state).length));
    // First in, every player still dealt in is behind you.
    out.push = pct(pushFraction(me.stack / bb, Math.max(1, seatsInHand(state).length - 1)));
    const v = valueOf(me, board);
    if (v !== null) {
      out.hand = handPhrase(v);
      out.category = tDynamic(`poker.category.${categoryOf(v)}`);
    }
    if (board.length === 3 || board.length === 4) {
      const o = outs(me.hole, board);
      out.outs = o.draw.length;
      out['outs:improve'] = o.improve.length;
      out.rough = o.draw.length * (board.length === 3 ? 4 : 2);
      // The exact chance that one of the cards to come is an out.
      const unseen = DECK.length - me.hole.length - board.length;
      const misses = board.length === 3 ? ((unseen - o.draw.length) * (unseen - o.draw.length - 1)) / (unseen * (unseen - 1)) : (unseen - o.draw.length) / unseen;
      const hit = 1 - misses;
      out.hit = pct(hit);
      if (owe > 0 && hit > 0) out['implied:hit'] = Math.max(0, Math.ceil(owe / hit - (pot + owe)));
    }
    if (board.length === 5) out['board:hand'] = handPhrase(evaluate(board));
    openHandValues(state, out, me);
    rangeValues(state, out, me, owe);
  }
  sidePots(state, out);
  return out;
}

/** Values that use the other hands' real cards: for steps that show them ("cards up"). */
function openHandValues(state: HoldemState, out: Record<string, number | string>, me: Player): void {
  const live = seatsInHand(state).filter((s) => s !== STUDENT);
  if (!inHand(me) || live.length === 0 || state.over) return;
  const boardIdx = state.board.map(cardIndex);
  const hero = holeOf(me);
  const hands = [hero, ...live.map((s) => holeOf(state.players[s] as Player))];
  const eq = knownEquity(hands, boardIdx);
  out.equity = pct(eq[0] ?? 0);
  live.forEach((s, i) => (out[`equity:${s}`] = pct(eq[i + 1] ?? 0)));
  const owe = Math.min(toCallOf(state, STUDENT), me.stack);
  if (owe > 0 && othersAllIn(state, STUDENT)) out['ev:call'] = Math.round(callGain(state, STUDENT, eq[0] ?? 0));
  const first = live[0];
  if (live.length === 1 && first !== undefined && (boardIdx.length === 3 || boardIdx.length === 4)) {
    const { win, tie } = winningCards(hero, holeOf(state.players[first] as Player), boardIdx, cardsToCome(state));
    out['outs:win'] = win;
    out['outs:tie'] = tie;
    out['rough:win'] = win * (boardIdx.length === 3 ? 4 : 2);
  }
  // Implied odds: what you would have to win later for this call to pay.
  const share = eq[0] ?? 0;
  if (owe > 0 && share > 0) out.implied = Math.max(0, Math.ceil(owe / share - (potOf(state) + owe)));
}

/** Values against the range a position's seed assumes (see ranges.ts). */
function rangeValues(state: HoldemState, out: Record<string, number | string>, me: Player, owe: number): void {
  const a = assumed(state.seed);
  if (!a) return;
  const dead = deadFor(state, STUDENT);
  const combos = liveCombos(assumedRange(a), dead);
  const value = a.value ? liveCombos(a.value, dead).length : 0;
  const bluff = a.bluff ? liveCombos(a.bluff, dead).length : 0;
  out['range:combos'] = combos.length;
  out['value:combos'] = value;
  out['bluff:combos'] = bluff;
  out['bluff:share'] = value + bluff > 0 ? pct(bluff / (value + bluff)) : 0;
  out['range:share'] = pct(combos.length / liveHands(dead).length);
  if (combos.length === 0 || state.over) return;
  const eq = rangeShare(holeOf(me), state.board.map(cardIndex), combos);
  out['equity:range'] = pct(eq);
  if (owe > 0 && othersAllIn(state, STUDENT)) out['ev:range'] = Math.round(callGain(state, STUDENT, eq));
  // Moving all-in against one player left to answer, who calls with the range.
  const caller = seatsInHand(state).find((s) => s !== STUDENT);
  if (state.toAct === STUDENT && caller !== undefined && seatsInHand(state).length === 2) {
    const pCall = combos.length / liveHands(dead).length;
    const gain = pushGain(state, STUDENT, caller, pCall, eq);
    out['ev:push'] = Math.round(gain);
    out['ev:push:bb'] = oneDecimal(gain / state.blinds.bb);
    out['push:loss:bb'] = oneDecimal(Math.max(0, -gain) / state.blinds.bb);
  }
}

/** The main pot and side pots by who can win each, and chips nobody matched. */
function sidePots(state: HoldemState, out: Record<string, number | string>): void {
  if (!state.over) {
    const { returned, pots } = settle(state.players);
    out['pot:main'] = pots[0]?.amount ?? 0;
    out['pot:side'] = pots[1]?.amount ?? 0;
    out['pot:side2'] = pots[2]?.amount ?? 0;
    returned.forEach((r, seat) => (out[`returned:${seat}`] = r));
    return;
  }
  const last = state.lastHand;
  if (!last) return;
  last.net.forEach((n, seat) => (out[`won:${seat}`] = n));
  last.pots.forEach((p, k) => {
    out[`last:pot:${k}`] = p.amount;
    p.winners.forEach((seat, i) => (out[`last:share:${k}:${seat}`] = p.shares[i] ?? 0));
  });
  out['last:pots'] = last.pots.length;
}

/** Card codes ("Ah", "7c") and hand classes with a letter in them ("AKs", "T9s", "QQ+") are notation, not typed numbers. */
export function stripPokerNotation(text: string): string {
  return text.replace(/\b[2-9TJQKA][cdhs]\b/g, ' ').replace(/\b[2-9TJQKA]{2}[so]?\+?(?!\w)/g, (m) => (/[TJQKA]/.test(m.slice(0, 2)) || /[so]\+?$/.test(m) ? ' ' : m));
}

export const pokerLessonGame: LessonGame<HoldemState> = {
  position: (text) => holdem.codec.state.fromText(text),
  notation: (state) => holdem.codec.state.toText(state),
  play(state, move) {
    return playAll(state, move)?.state ?? null;
  },
  canonical(state, move) {
    return playAll(state, move)?.canonical.join(' ') ?? null;
  },
  goalMet(goal, before, after) {
    // A hand won: the student ends it with more chips than they started it with.
    if (goal !== 'win' || !after.over || before.over) return false;
    return (after.lastHand?.net[STUDENT] ?? 0) > 0;
  },
  toMove: (state) => (state.over ? null : state.toAct),
  over: (state) => state.over,
  moves(state) {
    const seat = holdem.turn(state);
    return seat === null ? [] : holdem.legal(state, seat).map(actionText);
  },
  computed: pokerComputed,
  stripNotation: stripPokerNotation,
};
