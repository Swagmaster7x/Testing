/** Blackjack for the lesson runner: positions in state notation, moves as in the rules ("hit", "stand"), the student in box 0. */
import { classicLessonGame, STUDENT } from '../../classic/learn';
import { counts } from '../bots';
import type { BlackjackAction, BlackjackState } from '../rules';
import { actionText, blackjack, DEALER_DRAWS_TO, INSURANCE_PAYS, limitsOf, PRESETS, STANDARD, TWENTY_ONE } from '../rules';
import { handTotal, rankIndex } from '../strategy';

const [payA, payB] = PRESETS['six-deck']?.payout.split(':').map(Number) ?? [];
const [payC, payD] = PRESETS['single-deck']?.payout.split(':').map(Number) ?? [];

const FIXED: Record<string, number> = {
  'bust:over': TWENTY_ONE,
  'dealer:stands': DEALER_DRAWS_TO,
  'value:picture': rankIndex('Kc'),
  'value:ace-low': rankIndex('Ac'),
  'value:ace-high': handTotal(['Ac']).total,
  'pay:a': payA ?? 0,
  'pay:b': payB ?? 0,
  'pay:c': payC ?? 0,
  'pay:d': payD ?? 0,
  'insurance:pays': INSURANCE_PAYS,
  'table:min': limitsOf(STANDARD).min,
  'decks:usual': STANDARD.decks,
};

export function blackjackComputed(state: BlackjackState): Record<string, number> {
  const out: Record<string, number> = { ...FIXED };
  const box = state.boxes[STUDENT];
  const hand = box?.hands[state.at?.box === STUDENT ? (state.at?.hand ?? 0) : 0];
  const bet = hand?.bet ?? box?.bet ?? 0;
  if (hand) {
    const t = handTotal(hand.cards);
    out['hand:total'] = t.total;
    out['hand:hard'] = t.soft ? t.total - 10 : t.total;
  }
  const up = state.dealer[0];
  if (up) out['dealer:up'] = rankIndex(up) === 1 ? 11 : rankIndex(up);
  out.bet = bet;
  out['pay:bj'] = (bet * (payA ?? 0)) / (payB ?? 1);
  out['pay:65'] = (bet * (payC ?? 0)) / (payD ?? 1);
  out['pay:insurance'] = (bet / 2) * INSURANCE_PAYS;
  out['cost:insurance'] = bet / 2;
  const c = counts(blackjack.view(state, STUDENT));
  out['count:running'] = c.running;
  out['count:cards'] = state.seen.length;
  return out;
}

export const blackjackLessonGame = classicLessonGame<BlackjackState, BlackjackAction>({
  def: blackjack,
  text: actionText,
  computed: blackjackComputed,
  over: (s) => s.phase !== 'play' && s.phase !== 'insurance',
});
