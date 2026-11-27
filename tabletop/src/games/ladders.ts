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
import { noughtsBots } from './noughts/bots';
import { shogiBots } from './shogi/bots';
import { LADDER_MOVE_LIMIT } from './shogi/presets';
import type { ShogiAction, ShogiConfig, ShogiEvent, ShogiState, ShogiView } from './shogi/rules';
import { shogi } from './shogi/rules';
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

function shogiLadder(): Ladder<ShogiState, ShogiAction, ShogiConfig, ShogiView, ShogiEvent> {
  return {
    spec: {
      def: shogi,
      // Games between programs always end: a draw at the computer-shogi move limit.
      config: { moveLimit: LADDER_MOVE_LIMIT },
      levels: shogiBots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: async (view, seat, rng) => (await shogiBots.choose({ view, seat, level, rng })).action,
      }),
      margin: 0.6,
    },
    random: { name: 'random', choose: (view, seat, rng) => randomChoice(shogi, view, seat, rng) },
    games: 20,
  };
}

export function buildLadders(deps: LadderDeps): Record<string, Ladder<never, never, never, never, never>> {
  return {
    noughts: noughtsLadder() as unknown as Ladder<never, never, never, never, never>,
    chess: chessLadder(deps) as unknown as Ladder<never, never, never, never, never>,
    shogi: shogiLadder() as unknown as Ladder<never, never, never, never, never>,
  };
}
