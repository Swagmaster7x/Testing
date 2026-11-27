/**
 * The checks behind the Hold'em lesson linter. A "best" claim is proved by equity and pot-odds
 * arithmetic, so it may only be made where equity decides the play:
 *
 * - **call or fold** when calling ends the betting (everyone else in the hand is all-in): calling
 *   gains its equity share of each pot it can win, plus chips that come back, less the call;
 * - **all-in or fold** against one player left to answer (the push-or-fold model for a short
 *   stack): folding gains nothing, the all-in wins the pot when they fold and its equity share
 *   when they call. Smaller raises and limps are left out on purpose, as the model does.
 *
 * Only one other player may be in the hand. Their cards are the real ones when the step shows
 * every hand ("cards up"), or else the range the position's seed assumes (ranges.ts); the all-in
 * model always needs the range they call with. Equity is exact from the flop on (every rest of
 * the board is dealt); before the flop it is exact against one known hand, and a large
 * fixed-seed sample against a range. The accepted play must beat the other by MARGIN of the pot
 * it is played for, so a claim is never a coin flip.
 */
import type { LessonVerifier } from '../../../teach/lint';
import { cardIndex } from '../cards';
import type { Combo } from '../equity';
import type { HoldemState, Player } from '../rules';
import { checkCards, isFreezeout, potOf, raiseRange, toCallOf } from '../rules';
import { pokerLessonGame } from './game';
import { CHECK_SAMPLES, callGain, deadFor, holeOf, knownEquity, liveHands, opponents, othersAllIn, pushGain, rangeShare } from './math';
import { assumed, assumedRange, liveCombos } from './ranges';

/** The least edge a "best" play must have, as a share of the pot it is played for. */
export const MARGIN = 0.03;

export type Proof =
  | {
      readonly kind: 'call';
      /** Equity against the other hand or range. */
      readonly equity: number;
      /** Chips the call gains over a fold (negative: folding is better). */
      readonly gain: number;
      /** The pot after the call: the margin is a share of it. */
      readonly stake: number;
      readonly best: string;
    }
  | { readonly kind: 'push'; readonly equity: number; readonly pCall: number; readonly gain: number; readonly stake: number; readonly best: string }
  | { readonly kind: 'none'; readonly why: string };

/** What equity says about the decision in front of the seat to act. */
export function prove(state: HoldemState, openHand: boolean): Proof {
  const seat = state.toAct;
  if (seat === null || state.over) return { kind: 'none', why: 'nobody is to act' };
  const others = opponents(state, seat);
  const opp = others[0];
  if (others.length !== 1 || opp === undefined) return { kind: 'none', why: 'only a decision against one other player can be proved' };
  const me = state.players[seat] as Player;
  const hero = holeOf(me);
  const board = state.board.map(cardIndex);
  const dead = deadFor(state, seat);
  const a = assumed(state.seed);
  const range: Combo[] | null = a ? liveCombos(assumedRange(a), dead) : null;
  const owe = Math.min(toCallOf(state, seat), me.stack);

  if (owe > 0 && othersAllIn(state, seat)) {
    let equity: number;
    if (openHand) equity = knownEquity([hero, holeOf(state.players[opp] as Player)], board, true)[0] ?? 0;
    else if (range && range.length > 0) equity = rangeShare(hero, board, range, CHECK_SAMPLES);
    else return { kind: 'none', why: 'the other hand is hidden and the position assumes no range for it' };
    const gain = callGain(state, seat, equity);
    return { kind: 'call', equity, gain, stake: potOf(state) + owe, best: gain > 0 ? 'call' : 'fold' };
  }

  const raise = raiseRange(state, seat);
  const other = state.players[opp] as Player;
  if (raise && other.stack > 0) {
    if (!range || range.length === 0) return { kind: 'none', why: 'an all-in is proved against the range the other player calls with; the position assumes none' };
    const pCall = range.length / liveHands(dead).length;
    const equity = rangeShare(hero, board, range, CHECK_SAMPLES);
    const gain = pushGain(state, seat, opp, pCall, equity);
    const matched = Math.min(raise.max - other.bet, other.stack);
    return { kind: 'push', equity, pCall, gain, stake: potOf(state) + (raise.max - me.bet) + matched, best: gain > 0 ? `r${raise.max}` : 'fold' };
  }
  return { kind: 'none', why: 'equity decides only a call or fold when calling ends the betting, or an all-in against one player' };
}

/** Problems with a "best" claim for the accepted moves, or none. */
export function claimProblems(state: HoldemState, accept: readonly string[], openHand: boolean): string[] {
  const canonical = accept.map((m) => pokerLessonGame.canonical(state, m));
  const seat = state.toAct;
  const range = seat === null ? null : raiseRange(state, seat);
  const shape = canonical.length !== 1 ? null : canonical[0] === 'fold' ? 'fold' : canonical[0] === 'call' ? 'call' : range && canonical[0] === `r${range.max}` ? 'all-in' : null;
  if (!shape) return ['claim "best": only a call, a fold or an all-in can be proved by equity, one at a time'];
  if (shape === 'call' && (seat === null || !othersAllIn(state, seat))) return ['claim "best": equity decides a call only when calling ends the betting (everyone else is all-in)'];
  const proof = prove(state, openHand);
  if (proof.kind === 'none') return [`claim "best": ${proof.why}`];
  if (canonical.length !== 1 || canonical[0] !== proof.best) {
    const what = proof.kind === 'call' ? `equity ${(100 * proof.equity).toFixed(1)}%, calling gains ${proof.gain.toFixed(1)} chips` : `equity when called ${(100 * proof.equity).toFixed(1)}%, called ${(100 * proof.pCall).toFixed(1)}% of the time, the all-in gains ${proof.gain.toFixed(1)} chips`;
    return [`claim "best": the best play is ${proof.best} (${what}), not ${accept.join(' or ')}`];
  }
  if (Math.abs(proof.gain) < MARGIN * proof.stake) return [`claim "best": ${proof.best} is better by only ${Math.abs(proof.gain).toFixed(1)} chips of a ${proof.stake}-chip pot; make the claim where it is clear`];
  return [];
}

/** Chips are conserved within the hand: what each seat started it with is in its stack or in the middle. */
function chipProblems(state: HoldemState): string[] {
  const start = state.players.reduce((a, p) => a + p.startStack, 0);
  const now = state.players.reduce((a, p) => a + p.stack + p.total, 0);
  return start === now ? [] : [`${now} chips on the table, ${start} at the start of the hand`];
}

export const pokerVerifier: LessonVerifier<HoldemState> = {
  positionProblems(state) {
    const problems: string[] = [];
    try {
      checkCards(state);
    } catch (err) {
      problems.push((err as Error).message);
    }
    problems.push(...chipProblems(state));
    if (!isFreezeout(state.config) && state.handNo !== state.config.hands) problems.push('a lesson hand must be the last of its session (build it with lessonPosition)');
    if (!state.over && (state.players[0]?.hole.length ?? 0) < (state.config.game === 'holdem' ? 2 : 1)) problems.push('you (seat 0) are not dealt in');
    return problems;
  },

  checkBest(state, accept, context) {
    return Promise.resolve(claimProblems(state, accept, context?.openHand === true));
  },

  freePlayMove(state) {
    // Hold'em lessons have no free play; play on with the first legal move if one ever does.
    return Promise.resolve(pokerLessonGame.moves(state)[0] ?? '');
  },
};
