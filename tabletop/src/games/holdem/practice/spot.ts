/**
 * All-in spots for practice: a heads-up hand in a six-handed cash game where the other player
 * moves all-in, built through the rules from a deal and one of a few common lines. Shared by the
 * problem generator (scripts/generate-holdem-spots.ts) and the pot-odds drill, so both build the
 * same kind of hand. The other player sits on the left or right of the table (seat 1 or 5), where
 * the table draws their cards above their name, clear of the action labels and bets.
 */
import type { Card } from '../cards';
import { lessonPosition } from '../learn/game';
import type { HoldemState, Player } from '../rules';
import { holdem } from '../rules';

export interface Line {
  readonly id: string;
  readonly button: number;
  /** The other player's seat. */
  readonly opp: number;
  /** Actions before the flop. */
  readonly pre: readonly string[];
  /** Actions after the flop is dealt and before an all-in on the flop... */
  readonly flop: readonly string[];
  /** ...and before an all-in on the turn (the flop's actions included). */
  readonly turn: readonly string[];
}

export const LINES: readonly Line[] = [
  // You open on the button; the small blind calls, then moves all-in.
  { id: 'btn', button: 0, opp: 1, pre: ['fold', 'fold', 'fold', 'r5', 'call', 'fold'], flop: [], turn: ['check', 'r6', 'call'] },
  // Folded to the small blind, who raises; you call in the big blind; the small blind moves all-in.
  { id: 'bb', button: 4, opp: 5, pre: ['fold', 'fold', 'fold', 'fold', 'r6', 'call'], flop: [], turn: ['r6', 'call'] },
  // The cutoff opens, you re-raise on the button, the cutoff calls, then moves all-in.
  { id: '3bet', button: 0, opp: 5, pre: ['fold', 'fold', 'r5', 'r15', 'fold', 'fold', 'call'], flop: [], turn: ['check', 'r16', 'call'] },
  // You open on the button and bet; the small blind check-raises all-in.
  { id: 'xr', button: 0, opp: 1, pre: ['fold', 'fold', 'fold', 'r5', 'call', 'fold'], flop: ['check', 'r6'], turn: ['check', 'r6', 'call', 'check', 'r12'] },
];

export interface Deal {
  readonly you: readonly Card[];
  readonly them: readonly Card[];
  /** All five board cards, in the order they come. */
  readonly board: readonly Card[];
}

/**
 * The position before the all-in, with the other player's stack set so the all-in adds `ratio`
 * of the pot (after calling what they owe), and the all-in itself in notation. Null when the
 * line cannot be played with this deal.
 */
export function allInSpot(line: Line, street: 'flop' | 'turn', deal: Deal, ratio: number): { before: HoldemState; setup: string } | null {
  const actions = [...line.pre, ...(street === 'flop' ? line.flop : line.turn)];
  const holes: (Card[] | null)[] = [[...deal.you], null, null, null, null, null];
  holes[line.opp] = [...deal.them];
  const build = (stacks: number[]): HoldemState | null => {
    try {
      return holdem.codec.state.fromText(lessonPosition({ button: line.button, stacks, holes, board: [...deal.board], actions }));
    } catch {
      return null;
    }
  };
  const deep = [200, 200, 200, 200, 200, 200];
  const probe = build(deep);
  if (!probe || probe.toAct !== line.opp) return null;
  const opp = probe.players[line.opp] as Player;
  const pot = probe.players.reduce((a, p) => a + p.total, 0);
  const owed = probe.currentBet - opp.bet;
  const extra = Math.max(2, Math.round(ratio * (pot + owed)));
  const stacks = [...deep];
  stacks[line.opp] = opp.total + owed + extra;
  const before = build(stacks);
  if (!before) return null;
  const o = before.players[line.opp] as Player;
  const setup = `r${o.bet + o.stack}`;
  const legal = holdem.legal(before, line.opp).map((a) => holdem.codec.action.toText(a));
  return legal.includes(setup) ? { before, setup } : null;
}
