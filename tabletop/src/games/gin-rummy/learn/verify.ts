/**
 * The checks behind the Gin Rummy lesson linter. A "best" claim on a discard is proved by counting:
 * the accepted discards leave the least deadwood, and every other discard leaves at least one
 * point more.
 */
import type { Card } from '../../classic/cards';
import { isCard } from '../../classic/cards';
import { deadwood } from '../../classic/melds';
import { basicVerifier } from '../../classic/verify';
import type { GinAction, GinState } from '../rules';
import { checkConservation, ginRummy } from '../rules';

export function checkBestDiscard(state: GinState, accept: readonly string[]): string[] {
  if (state.phase !== 'discard') return ['claim "best" is only proved for a discard'];
  const hand = state.hands[state.toAct] ?? [];
  const options = hand.filter((c) => c !== state.taken);
  const left = new Map(options.map((c) => [c as string, deadwood(hand.filter((x) => x !== c))]));
  const least = Math.min(...left.values());
  const problems: string[] = [];
  for (const a of accept) {
    if (!isCard(a) || !left.has(a)) problems.push(`claim "best": ${a} is not a discard here`);
    else if ((left.get(a) ?? 0) !== least) problems.push(`claim "best": ${a} leaves ${left.get(a)} deadwood, the least is ${least}`);
  }
  for (const [card, n] of left) if (!accept.includes(card) && n < least + 1) problems.push(`claim "best": ${card} leaves ${n} too`);
  return problems;
}

export const ginVerifier = basicVerifier<GinState, GinAction>({ def: ginRummy, conserve: checkConservation, checkBest: checkBestDiscard });

export type { Card };
