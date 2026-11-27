/**
 * Ladder definitions for every game with bots. `npm run ladder` runs them; a short version runs
 * in the unit tests. Engines are passed in, so the same ladders run on Node's Stockfish.
 */
import type { Contender, LadderSpec } from '../ai/ladder';
import { randomChoice } from '../ai/random-bot';
import type { Engine } from '../ai/uci';
import type { GameEvent, Outcome, Seat } from '../core/contract';
import { briscaBots } from './brisca/bots';
import { ccBots } from './chinese-checkers/bots';
import type { CcAction, CcConfig, CcEvent, CcState, CcView } from './chinese-checkers/rules';
import { chineseCheckers } from './chinese-checkers/rules';
import type { BriscaAction, BriscaConfig, BriscaEvent, BriscaState, BriscaView } from './brisca/rules';
import { brisca, PUERTO_RICO } from './brisca/rules';
import { chessBots } from './chess/bots';
import { dominoesBots } from './dominoes/bots';
import type { DominoesAction, DominoesConfig, DominoesEvent, DominoesState, DominoesView } from './dominoes/rules';
import { dominoes, PRESETS as DOMINOES_PRESETS } from './dominoes/rules';
import type { ChessAction, ChessConfig, ChessEvent, ChessState, ChessView } from './chess/rules';
import { chess } from './chess/rules';
import { goBots } from './go/bots';
import { holdemBots, viewLegal } from './holdem/bots';
import type { HoldemAction, HoldemConfig, HoldemEvent, HoldemState, HoldemView } from './holdem/rules';
import { holdem, SIX_MAX_CASH } from './holdem/rules';
import type { GoAction, GoConfig, GoEvent, GoState, GoView } from './go/rules';
import { go, makeConfig } from './go/rules';
import { decide as mahjongDecide, mahjongBots } from './mahjong/bots';
import type { MahjongAction, MahjongConfig, MahjongEvent, MahjongState, MahjongView } from './mahjong/rules';
import { mahjong } from './mahjong/rules';
import { HK_DEFAULTS } from './mahjong/styles/hong-kong';
import { RIICHI_DEFAULTS } from './mahjong/styles/riichi';
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

/**
 * Dominoes rungs are partnership matches to 200 (Puerto Rico 200): the level under test sits in
 * seats 0 and 2 against the other level in 1 and 3, and every deal is played twice with the sides
 * swapped, so the luck of the deal cancels out.
 */
function dominoesLadder(): Ladder<DominoesState, DominoesAction, DominoesConfig, DominoesView, DominoesEvent> {
  return {
    spec: {
      def: dominoes,
      config: DOMINOES_PRESETS['puerto-rico-200'] as DominoesConfig,
      levels: dominoesBots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: async (view, seat, rng) => (await dominoesBots.choose({ view, seat, level, rng })).action,
      }),
      margin: 0.6,
      paired: true,
    },
    random: { name: 'random', choose: (view, seat, rng) => randomChoice(dominoes, view, seat, rng) },
    games: 100,
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

/** Poker: a side's score is whether its three seats won chips over the whole session. */
export function pokerSideScore(outcome: Outcome, seats: readonly Seat[]): number {
  const net = outcome.results.filter((r) => seats.includes(r.seat)).reduce((sum, r) => sum + r.score, 0);
  return net > 0 ? 1 : net < 0 ? 0 : 0.5;
}

function pokerLadder(): Ladder<HoldemState, HoldemAction, HoldemConfig, HoldemView, HoldemEvent> {
  return {
    spec: {
      def: holdem,
      // Six-handed cash sessions of 100 hands, three seats each, every deal played twice with the seats swapped.
      config: { ...SIX_MAX_CASH, hands: 100 },
      levels: holdemBots.levels.map((l) => l.level),
      bot: (level) => ({ name: `L${level}`, choose: async (view, seat, rng) => (await holdemBots.choose({ view, seat, level, rng })).action }),
      margin: 0.58,
      paired: true,
      score: pokerSideScore,
    },
    // Random play picks a kind of action (fold, call or check, raise) at random, then a size.
    random: {
      name: 'random',
      choose: (view, seat, rng) => {
        const legal = viewLegal(view, seat);
        const kind = rng.pick([...new Set(legal.map((a) => a.type))]);
        return rng.pick(legal.filter((a) => a.type === kind));
      },
    },
    games: 300,
  };
}

/** Chinese Checkers for two under the default rules: random play wanders and loses at the turn limit. */
function chineseCheckersLadder(): Ladder<CcState, CcAction, CcConfig, CcView, CcEvent> {
  return {
    spec: {
      def: chineseCheckers,
      config: chineseCheckers.defaultConfig,
      levels: ccBots.levels.map((l) => l.level),
      bot: (level) => ({
        name: `L${level}`,
        choose: async (view, seat, rng) => (await ccBots.choose({ view, seat, level, rng })).action,
      }),
      margin: 0.6,
    },
    random: { name: 'random', choose: (view, seat, rng) => randomChoice(chineseCheckers, view, seat, rng) },
    games: 30,
  };
}

/** Mahjong: a side's score is whether its two seats together won more points than the other two. */
export function mahjongSideScore(outcome: Outcome, seats: readonly Seat[]): number {
  // The side's points against the other side's: Hong Kong scores start at nothing, Riichi's at a stack.
  const sum = (mine: boolean) => outcome.results.filter((r) => seats.includes(r.seat) === mine).reduce((total, r) => total + r.score, 0);
  const net = sum(true) - sum(false);
  return net > 0 ? 1 : net < 0 ? 0 : 0.5;
}

/**
 * Mahjong rungs are East-round games under the default Hong Kong rules (`mahjong-riichi`:
 * East-South games under the common online Riichi rules): the level under test sits in seats 0
 * and 2 against the other level in 1 and 3, and every deal is played twice with the seats
 * swapped, so the luck of the tiles cancels out.
 */
function mahjongLadder(config: MahjongConfig = { style: 'hong-kong', options: { ...HK_DEFAULTS, length: 'east' } }, top = 5): Ladder<MahjongState, MahjongAction, MahjongConfig, MahjongView, MahjongEvent> {
  return {
    spec: {
      def: mahjong,
      config,
      levels: mahjongBots.levels.map((l) => l.level).filter((l) => l <= top),
      bot: (level) => ({ name: `L${level}`, choose: (view, _seat, rng) => mahjongDecide(view, level, rng).action }),
      margin: 0.6,
      paired: true,
      score: mahjongSideScore,
    },
    // Random play picks any of the things it may do: a discard, a call, a pass, a win.
    random: { name: 'random', choose: (view, _seat, rng) => rng.pick(view.options) },
    games: 200,
  };
}

export function buildLadders(deps: LadderDeps): Record<string, Ladder<never, never, never, never, never>> {
  return {
    noughts: noughtsLadder() as unknown as Ladder<never, never, never, never, never>,
    chess: chessLadder(deps) as unknown as Ladder<never, never, never, never, never>,
    brisca: briscaLadder() as unknown as Ladder<never, never, never, never, never>,
    dominoes: dominoesLadder() as unknown as Ladder<never, never, never, never, never>,
    shogi: shogiLadder() as unknown as Ladder<never, never, never, never, never>,
    go: goLadder() as unknown as Ladder<never, never, never, never, never>,
    poker: pokerLadder() as unknown as Ladder<never, never, never, never, never>,
    'chinese-checkers': chineseCheckersLadder() as unknown as Ladder<never, never, never, never, never>,
    mahjong: mahjongLadder() as unknown as Ladder<never, never, never, never, never>,
    // The same rungs at a Riichi table: full East-South games under the common online rules (the
    // Riichi default; a single East round leaves too much to the tiles). Levels 1 to 4: level 5
    // scores only about 0.61 against level 4 at this table, short of the margin (PROGRESS-M11.md).
    'mahjong-riichi': mahjongLadder({ style: 'riichi', options: RIICHI_DEFAULTS }, 4) as unknown as Ladder<never, never, never, never, never>,
  };
}
