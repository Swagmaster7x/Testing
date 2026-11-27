/** Tute for the lesson runner: positions in state notation, moves as cards ("Ao"), "sing-c", "tute-R" or "swap". */
import { findLegal } from '../../../core/contract';
import type { LessonGame } from '../../../teach/runner';
import type { Card, TuteState } from '../rules';
import {
  actionText,
  CANTE_PLAIN,
  CANTE_TRUMPS,
  canteValue,
  cardPoints,
  DECK,
  dutyOf,
  handSize,
  HAND_POINTS,
  LAST_TEN,
  obligations,
  pointsOf,
  RANKS,
  REACH,
  seatCount,
  sideOf,
  sidePoints,
  SPAIN_PAIRS,
  SUITS,
  TOTAL_POINTS,
  tute,
  unseenCards,
  viewOf,
} from '../rules';

function parse(state: TuteState, move: string) {
  const seat = tute.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(tute, state, seat, tute.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

const TWO = { players: 2 } as const;

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'deck:cards': DECK.length,
  'deck:suits': SUITS.length,
  'deck:per-suit': RANKS.length,
  'players:four': seatCount(SPAIN_PAIRS),
  'players:two': seatCount(TWO),
  'hand:four': handSize(SPAIN_PAIRS),
  'hand:two': handSize(TWO),
  'tricks:four': DECK.length / seatCount(SPAIN_PAIRS),
  'stock:two': DECK.length - seatCount(TWO) * handSize(TWO),
  'tricks:drawing': (DECK.length - seatCount(TWO) * handSize(TWO)) / seatCount(TWO),
  'tricks:last-two': handSize(TWO),
  'value:A': cardPoints('Ao'),
  'value:3': cardPoints('3o'),
  'value:R': cardPoints('Ro'),
  'value:C': cardPoints('Co'),
  'value:S': cardPoints('So'),
  'value:7': cardPoints('7o'),
  'value:briscas': cardPoints('Ao') + cardPoints('3o'),
  'value:pair': cardPoints('Ro') + cardPoints('Co'),
  'value:suit': pointsOf(RANKS.map((r): Card => `${r}o`)),
  'points:total': TOTAL_POINTS,
  'points:last': LAST_TEN,
  'points:hand': HAND_POINTS,
  'points:half': HAND_POINTS / 2,
  'points:reach': REACH,
  'cante:plain': CANTE_PLAIN,
  'cante:trumps': CANTE_TRUMPS,
};

export const tuteLessonGame: LessonGame<TuteState> = {
  position: (text) => tute.codec.state.fromText(text),
  notation: (state) => tute.codec.state.toText(state),
  play(state, move) {
    const action = parse(state, move);
    return action ? tute.apply(state, action).state : null;
  },
  canonical(state, move) {
    const action = parse(state, move);
    return action ? actionText(action) : null;
  },
  goalMet(goal, before, after) {
    if (goal !== 'win') return false;
    const student = tute.turn(before) ?? 0;
    const outcome = tute.outcome(after);
    return outcome !== null && outcome.results.some((r) => r.seat === student && r.place === 1) && !outcome.results.every((r) => r.place === 1);
  },
  toMove: (state) => tute.turn(state),
  over: (state) => state.over,
  moves(state) {
    const seat = tute.turn(state);
    return seat === null ? [] : tute.legal(state, seat).map(actionText);
  },
  computed(state) {
    const out: Record<string, number> = { ...FIXED };
    const players = seatCount(state.config);
    const me = 0;
    const us = sideOf(me, players);
    const seat = tute.turn(state);
    out['trick:points'] = pointsOf(state.trick.map((p) => p.card));
    out['pile:us'] = pointsOf(state.won[us] ?? []);
    out['pile:them'] = pointsOf(state.won[1 - us] ?? []);
    out['side:us'] = sidePoints(state, us);
    out['side:them'] = sidePoints(state, 1 - us);
    const players4 = players;
    out['cantes:us'] = state.cantes.filter((c) => sideOf(c.seat, players4) === us).reduce((a, c) => a + c.points, 0);
    out['cantes:them'] = state.cantes.filter((c) => sideOf(c.seat, players4) !== us).reduce((a, c) => a + c.points, 0);
    out['stock:count'] = state.stock.length;
    out['hand:points'] = pointsOf(state.hands[me] ?? []);
    out['trumps:unseen'] = unseenCards(viewOf(state, me)).filter((c) => c[1] === state.trumpSuit).length;
    out['hand:cantes'] = SUITS.filter((s) => (state.hands[me] ?? []).includes(`R${s}`) && (state.hands[me] ?? []).includes(`C${s}`)).reduce((a, s) => a + canteValue(s, state.trumpSuit), 0);
    out['legal:count'] = seat === null ? 0 : obligations({ hand: state.hands[seat] ?? [], trick: state.trick, trumpSuit: state.trumpSuit, config: state.config, duty: dutyOf(state), seat }).allowed.length;
    // The hand just finished, if any: both sides' totals.
    const last = state.results[state.results.length - 1];
    if (last) {
      out['result:us'] = (last.points[us] ?? 0) + (last.carried[us] ?? 0);
      out['result:them'] = (last.points[1 - us] ?? 0) + (last.carried[1 - us] ?? 0);
    }
    return out;
  },
};
