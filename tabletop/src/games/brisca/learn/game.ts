/** Brisca for the lesson runner: positions in state notation, moves as cards ("Ao") or "swap". */
import { findLegal } from '../../../core/contract';
import type { LessonGame } from '../../../teach/runner';
import type { BriscaState, Card } from '../rules';
import { actionText, brisca, cardPoints, DECK, HAND_SIZE, pointsOf, PUERTO_RICO, RANKS, SUITS, TOTAL_POINTS, unseenCards, viewOf, WINNING_POINTS } from '../rules';

function parse(state: BriscaState, move: string) {
  const seat = brisca.turn(state);
  if (seat === null) return null;
  try {
    return findLegal(brisca, state, seat, brisca.codec.action.fromText(move, state));
  } catch {
    return null;
  }
}

/** Numbers that do not depend on the position. */
const FIXED: Record<string, number> = {
  'deck:cards': DECK.length,
  'deck:suits': SUITS.length,
  'deck:per-suit': RANKS.length,
  'hand:size': HAND_SIZE,
  'points:total': TOTAL_POINTS,
  'points:win': WINNING_POINTS,
  'points:half': TOTAL_POINTS / 2,
  'tricks:total': DECK.length / 2,
  'tricks:drawing': (DECK.length - 2 * HAND_SIZE) / 2,
  'tricks:last': HAND_SIZE,
  'value:A': cardPoints('Ao', PUERTO_RICO),
  'value:3': cardPoints('3o', PUERTO_RICO),
  'value:R': cardPoints('Ro', PUERTO_RICO),
  'value:C': cardPoints('Co', PUERTO_RICO),
  'value:S': cardPoints('So', PUERTO_RICO),
  'value:7': cardPoints('7o', PUERTO_RICO),
  'value:briscas': cardPoints('Ao', PUERTO_RICO) + cardPoints('3o', PUERTO_RICO),
  'value:suit': pointsOf(RANKS.map((r) => `${r}o` as Card), PUERTO_RICO),
};

export const briscaLessonGame: LessonGame<BriscaState> = {
  position: (text) => brisca.codec.state.fromText(text),
  notation: (state) => brisca.codec.state.toText(state),
  play(state, move) {
    const action = parse(state, move);
    return action ? brisca.apply(state, action).state : null;
  },
  canonical(state, move) {
    const action = parse(state, move);
    return action ? actionText(action) : null;
  },
  goalMet(goal, before, after) {
    const student = brisca.turn(before) ?? 0;
    if (goal !== 'win') return false;
    const outcome = brisca.outcome(after);
    return outcome !== null && outcome.results.some((r) => r.seat === student && r.place === 1) && !outcome.results.every((r) => r.place === 1);
  },
  toMove: (state) => brisca.turn(state),
  over: (state) => state.over,
  moves(state) {
    const seat = brisca.turn(state);
    return seat === null ? [] : brisca.legal(state, seat).map(actionText);
  },
  computed(state) {
    const out: Record<string, number> = { ...FIXED };
    const me = 0;
    out['trick:points'] = pointsOf(state.trick.map((p) => p.card), state.config);
    out['pile:me'] = pointsOf(state.won[me] ?? [], state.config);
    out['pile:them'] = pointsOf(state.won[1] ?? [], state.config);
    out['pile:me-cards'] = (state.won[me] ?? []).length;
    out['stock:count'] = state.stock.length;
    out['trumps:unseen'] = unseenCards(viewOf(state, me)).filter((c) => c[1] === state.trumpSuit).length;
    out['hand:points'] = pointsOf(state.hands[me] ?? [], state.config);
    return out;
  },
};
