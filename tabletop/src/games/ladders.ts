/**
 * Ladder definitions for every game with bots. `npm run ladder` runs them; a short version runs
 * in the unit tests. Engines are passed in, so the same ladders run on Node's Stockfish.
 */
import type { Contender, LadderSpec } from '../ai/ladder';
import { randomChoice } from '../ai/random-bot';
import type { Engine } from '../ai/uci';
import type { GameEvent } from '../core/contract';
import { briscaBots } from './brisca/bots';
import type { BriscaAction, BriscaConfig, BriscaEvent, BriscaState, BriscaView } from './brisca/rules';
import { brisca, PUERTO_RICO } from './brisca/rules';
import { chessBots } from './chess/bots';
import type { ChessAction, ChessConfig, ChessEvent, ChessState, ChessView } from './chess/rules';
import { chess } from './chess/rules';
import { noughtsBots } from './noughts/bots';
import type { NoughtsAction, NoughtsConfig, NoughtsEvent, NoughtsState, NoughtsView } from './noughts/rules';
import { noughts } from './noughts/rules';

export interface Ladder<S = unknown, A = unknown, C = unknown, V = unknown, E extends GameEvent = GameEvent> {
  readonly spec: LadderSpec<S, A, C, V, E>;
  readonly random: Contender<V, A>;
  /** Games per rung for `npm run ladder` when none is given. */
  readonly games: number;
  /** Frees engines when the ladder is done. */
  readonly close?: () => void;
}

export interface LadderDeps {
  /** Makes a chess engine (Node's Stockfish in scripts and tests). */
  readonly chessEngine: () => Engine;
}

function noughtsLadder(): Ladder<NoughtsState, NoughtsAction, NoughtsConfig, NoughtsView, NoughtsEvent> {
  return {
    spec: {
      def: noughts,
      config: noughts.defaultConfig,
      levels: noughtsBots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: (view, seat, rng) => noughtsBots.choose({ view, seat, level, rng }).action,
      }),
      margin: 0.6,
    },
    random: { name: 'random', choose: (view, seat, rng) => randomChoice(noughts, view, seat, rng) },
    games: 200,
  };
}

function chessLadder(deps: LadderDeps): Ladder<ChessState, ChessAction, ChessConfig, ChessView, ChessEvent> {
  const engines: Engine[] = [];
  const bots = chessBots(() => {
    const engine = deps.chessEngine();
    engines.push(engine);
    return engine;
  });
  return {
    spec: {
      def: chess,
      config: chess.defaultConfig,
      levels: bots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: async (view, seat, rng) => (await bots.choose({ view, seat, level, rng })).action,
      }),
      margin: 0.6,
    },
    random: { name: 'random', choose: (view, seat, rng) => randomChoice(chess, view, seat, rng) },
    games: 20,
    close: () => engines.forEach((e) => e.terminate()),
  };
}

/**
 * Brisca rungs are games to three hands, as tables play them, with every deal played twice with
 * the seats swapped, so the luck of the deal cancels out.
 */
function briscaLadder(): Ladder<BriscaState, BriscaAction, BriscaConfig, BriscaView, BriscaEvent> {
  return {
    spec: {
      def: brisca,
      config: { ...PUERTO_RICO, matchTo: 3 },
      levels: briscaBots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: async (view, seat, rng) => (await briscaBots.choose({ view, seat, level, rng })).action,
      }),
      margin: 0.6,
      paired: true,
    },
    random: { name: 'random', choose: (view, seat, rng) => randomChoice(brisca, view, seat, rng) },
    games: 100,
  };
}

export function buildLadders(deps: LadderDeps): Record<string, Ladder<never, never, never, never, never>> {
  return {
    noughts: noughtsLadder() as unknown as Ladder<never, never, never, never, never>,
    chess: chessLadder(deps) as unknown as Ladder<never, never, never, never, never>,
    brisca: briscaLadder() as unknown as Ladder<never, never, never, never, never>,
  };
}
