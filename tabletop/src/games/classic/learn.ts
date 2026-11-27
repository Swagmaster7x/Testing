/**
 * The lesson-runner adapter shared by the classic card games: positions in state notation, moves in
 * move notation, and several moves in one string separated by spaces ("Kd 3d 9d"), so one scripted
 * reply can carry the other players' turns. The student always sits in seat 0.
 */
import type { GameDef, GameEvent, Seat } from '../../core/contract';
import { findLegal } from '../../core/contract';
import type { FreePlayGoal } from '../../teach/lesson';
import type { LessonGame } from '../../teach/runner';

export const STUDENT: Seat = 0;

/** Card names written with suit signs ("Q♠", "10♥", "A♣") are notation, not typed numbers. */
export function stripCards(text: string): string {
  return text.replace(/(?:10|[2-9JQKA])[♠♥♦♣]/g, ' ');
}

export interface ClassicLessonSpec<S, A> {
  readonly def: GameDef<S, A, unknown, unknown, GameEvent>;
  readonly text: (action: A) => string;
  readonly computed: (state: S) => Record<string, number | string>;
  /** A lesson position is over when this is true (the end of a hand); the game's end when absent. */
  readonly over?: (state: S) => boolean;
  /** Free play's "win" goal, judged from `before` and `after`. */
  readonly won?: (before: S, after: S) => boolean;
}

export function classicLessonGame<S, A>(spec: ClassicLessonSpec<S, A>): LessonGame<S> {
  const { def } = spec;
  const over = (s: S) => (spec.over ? spec.over(s) : def.outcome(s) !== null);
  const parse = (state: S, move: string): A | null => {
    const seat = def.turn(state);
    if (seat === null) return null;
    try {
      return findLegal(def, state, seat, def.codec.action.fromText(move, state));
    } catch {
      return null;
    }
  };
  const playAll = (state: S, moves: string): { state: S; canonical: string[] } | null => {
    let s = state;
    const canonical: string[] = [];
    for (const move of moves.trim().split(/\s+/)) {
      if (over(s)) return null;
      const action = parse(s, move);
      if (action === null) return null;
      canonical.push(spec.text(action));
      s = def.apply(s, action).state;
    }
    return { state: s, canonical };
  };
  return {
    position: (text) => def.codec.state.fromText(text),
    notation: (state) => def.codec.state.toText(state),
    play: (state, move) => playAll(state, move)?.state ?? null,
    canonical: (state, move) => playAll(state, move)?.canonical.join(' ') ?? null,
    goalMet(goal: FreePlayGoal, before, after) {
      return goal === 'win' && spec.won !== undefined && spec.won(before, after);
    },
    toMove: (state) => (over(state) ? null : def.turn(state)),
    over,
    moves(state) {
      const seat = def.turn(state);
      return seat === null || over(state) ? [] : def.legal(state, seat).map(spec.text);
    },
    computed: spec.computed,
    stripNotation: stripCards,
  };
}
