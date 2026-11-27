/** Ladder definitions for every game with bots. `npm run ladder` runs them all. */
import type { Contender, LadderSpec } from '../ai/ladder';
import { randomChoice } from '../ai/random-bot';
import type { GameEvent } from '../core/contract';
import { noughtsBots } from './noughts/bots';
import type { NoughtsAction, NoughtsConfig, NoughtsEvent, NoughtsState, NoughtsView } from './noughts/rules';
import { noughts } from './noughts/rules';

export interface Ladder<S = unknown, A = unknown, C = unknown, V = unknown, E extends GameEvent = GameEvent> {
  readonly spec: LadderSpec<S, A, C, V, E>;
  readonly random: Contender<V, A>;
}

const noughtsLadder: Ladder<NoughtsState, NoughtsAction, NoughtsConfig, NoughtsView, NoughtsEvent> = {
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
};

export const LADDERS: Record<string, Ladder<never, never, never, never, never>> = {
  noughts: noughtsLadder as unknown as Ladder<never, never, never, never, never>,
};
