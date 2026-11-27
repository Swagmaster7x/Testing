/**
 * How strong each Blackjack level is (the definition of done's ladder, for a game against the
 * house). Every level plays the same shoes, alone at the table, with the default rules:
 *
 * - **Return**: chips won per 100 rounds, in minimum bets, over many sessions. A rung passes when the
 *   higher level wins more than the lower by at least two standard errors of the paired difference
 *   (sessions are played on the same seeds, so the luck of the shoe largely cancels).
 * - **Expected value given away**: for every decision, the loss against the best move with every
 *   seen card taken out of the shoe, in hundredths of the bet on that hand (an "accuracy" that also
 *   rewards counting).
 */
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { BlackjackAction, BlackjackConfig, BlackjackState, BlackjackView } from './rules';
import { BANKROLL, blackjack, limitsOf, STANDARD } from './rules';
import { chooseAction, currentHand, randomMove, valuesFor } from './bots';

export type Player = (view: BlackjackView, rng: Rng) => BlackjackAction;

export const PLAYERS: Readonly<Record<string, Player>> = {
  random: (v, rng) => randomMove(v, rng),
  L1: (v) => chooseAction(v, 1),
  L2: (v) => chooseAction(v, 2),
  L3: (v) => chooseAction(v, 3),
  L4: (v) => chooseAction(v, 4),
};

export interface SessionResult {
  /** Net chips in minimum bets. */
  readonly units: number;
  readonly rounds: number;
  /** Expected value lost over the decisions measured (in bets) and how many there were. */
  readonly loss: number;
  readonly decisions: number;
}

/** One session alone at the table on a fixed seed. */
export function playSession(player: Player, seed: string, config: BlackjackConfig, measureLoss: boolean): SessionResult {
  let s: BlackjackState = blackjack.setup(config, createRng(seed));
  const rng = createRng(`${seed}/player`);
  let loss = 0;
  let decisions = 0;
  for (let guard = 0; guard < 100_000 && blackjack.turn(s) !== null; guard++) {
    const view = blackjack.view(s, 0);
    const action = player(view, rng);
    if (measureLoss && view.phase === 'play' && currentHand(view)) {
      const values = valuesFor(view, true);
      const top = Math.max(...Object.values(values).map((x) => x ?? -Infinity));
      const mine = values[action.type as keyof typeof values];
      if (mine !== undefined) {
        loss += Math.max(0, top - mine);
        decisions++;
      }
    }
    s = blackjack.apply(s, action).state;
  }
  const { min } = limitsOf(config);
  const net = (s.boxes[0]?.chips ?? BANKROLL) - BANKROLL;
  return { units: net / min, rounds: s.history.length, loss, decisions };
}

export interface LevelRow {
  readonly name: string;
  /** Minimum bets won per 100 rounds (negative: lost). */
  readonly per100: number;
  readonly sessions: readonly number[];
  /** Expected value given away per decision, in hundredths of a bet. */
  readonly lossPer100: number;
}

export function measure(name: string, sessions: number, seedPrefix: string, lossSessions = Math.min(sessions, 60), config: BlackjackConfig = { ...STANDARD, rounds: 100, limits: '10-500' }): LevelRow {
  const player = PLAYERS[name];
  if (!player) throw new Error(`No Blackjack player ${name}`);
  const units: number[] = [];
  let rounds = 0;
  let loss = 0;
  let decisions = 0;
  for (let i = 0; i < sessions; i++) {
    const r = playSession(player, `${seedPrefix}:${i}`, config, i < lossSessions);
    units.push((r.units * 100) / Math.max(1, r.rounds));
    rounds += r.rounds;
    loss += r.loss;
    decisions += r.decisions;
  }
  void rounds;
  const per100 = units.reduce((a, b) => a + b, 0) / Math.max(1, units.length);
  return { name, per100, sessions: units, lossPer100: decisions > 0 ? (100 * loss) / decisions : 0 };
}

/** The paired difference between two rows (higher minus lower) and its standard error. */
export function compare(higher: LevelRow, lower: LevelRow): { diff: number; se: number } {
  const d = higher.sessions.map((x, i) => x - (lower.sessions[i] ?? 0));
  const mean = d.reduce((a, b) => a + b, 0) / d.length;
  const variance = d.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, d.length - 1);
  return { diff: mean, se: Math.sqrt(variance / d.length) };
}
