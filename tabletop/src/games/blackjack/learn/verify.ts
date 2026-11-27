/**
 * The checks behind the Blackjack lesson linter. A "best" claim is proved by expected value under
 * the rules in the position (the same calculation as the chart): the accepted move must have the
 * highest value, and every other allowed move must be at least BEST_MARGIN of the bet worse.
 */
import { DECK } from '../../classic/cards';
import { basicVerifier } from '../../classic/verify';
import { valuesFor } from '../bots';
import type { BlackjackAction, BlackjackState } from '../rules';
import { blackjack, shoeOf } from '../rules';

export const BEST_MARGIN = 0.02;

export function checkBestMove(state: BlackjackState, accept: readonly string[]): string[] {
  if (state.phase !== 'play' || !state.at) return ['claim "best" needs a hand to play'];
  const values = valuesFor(blackjack.view(state, state.at.box));
  const entries: [string, number][] = Object.entries(values);
  const top = Math.max(...entries.map(([, v]) => v));
  const problems: string[] = [];
  for (const a of accept) {
    const v = values[a as keyof typeof values];
    if (v === undefined) problems.push(`claim "best": ${a} is not allowed here`);
    else if (v < top - 1e-9) problems.push(`claim "best": ${a} is worth ${v.toFixed(3)}, the best ${top.toFixed(3)}`);
  }
  for (const [m, v] of entries) if (!accept.includes(m) && v > top - BEST_MARGIN) problems.push(`claim "best": ${m} is worth ${v.toFixed(3)}, within ${BEST_MARGIN} of the best`);
  return problems;
}

/** The shoe and every card out add up to the packs. */
function conserve(s: BlackjackState): void {
  const out = [...s.shoe, ...s.seen, ...(!s.holeShown && s.dealer[1] ? [s.dealer[1]] : [])];
  if (out.length !== shoeOf(s.config.decks).length) throw new Error(`Blackjack: ${out.length} cards, not ${s.config.decks * DECK.length}`);
}

export const blackjackVerifier = basicVerifier<BlackjackState, BlackjackAction>({ def: blackjack, conserve, checkBest: checkBestMove });
