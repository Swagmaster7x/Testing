/**
 * Ladder definitions for every game with bots. `npm run ladder` runs them; a short version runs
 * in the unit tests. Engines are passed in, so the same ladders run on Node's Stockfish.
 */
import type { Contender, LadderSpec } from '../ai/ladder';
import { randomChoice } from '../ai/random-bot';
import type { Engine } from '../ai/uci';
import type { GameEvent } from '../core/contract';
import { chessBots } from './chess/bots';
import type { ChessAction, ChessConfig, ChessEvent, ChessState, ChessView } from './chess/rules';
import { chess } from './chess/rules';
import { goBots } from './go/bots';
import type { GoAction, GoConfig, GoEvent, GoState, GoView } from './go/rules';
import { go, makeConfig } from './go/rules';
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

/** Go on 9×9 under the default rules. Random play places stones or passes, and accepts the count. */
function goLadder(): Ladder<GoState, GoAction, GoConfig, GoView, GoEvent> {
  return {
    spec: {
      def: go,
      config: makeConfig(9, 'chinese'),
      levels: goBots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: async (view, seat, rng) => (await goBots.choose({ view, seat, level, rng })).action,
      }),
      margin: 0.6,
    },
    random: {
      name: 'random',
      choose: (view, seat, rng) => {
        const legal = go.legal(view, seat);
        return view.phase === 'scoring' ? (legal.find((a) => a.type === 'done') as GoAction) : rng.pick(legal);
      },
    },
    games: 20,
  };
}

export function buildLadders(deps: LadderDeps): Record<string, Ladder<never, never, never, never, never>> {
  return {
    noughts: noughtsLadder() as unknown as Ladder<never, never, never, never, never>,
    chess: chessLadder(deps) as unknown as Ladder<never, never, never, never, never>,
    go: goLadder() as unknown as Ladder<never, never, never, never, never>,
  };
}
