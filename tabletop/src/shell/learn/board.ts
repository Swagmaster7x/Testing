/**
 * A board that shows positions written in a game's notation and animates the moves between
 * them with the game's own events, the same way the table does.
 */
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { GameEvent } from '../../core/contract';
import { findLegal } from '../../core/contract';
import { EventQueue } from '../../core/events';
import type { AnyGameUi } from '../../games/types';
import { useReducedMotion } from '../motion';
import { playSound } from '../sound';
import { useApp } from '../state';

/** The action for a move written in notation, or null if it is not legal there. */
export function actionFor(ui: AnyGameUi, position: string, move: string): unknown {
  const def = ui.def;
  try {
    const state = def.codec.state.fromText(position);
    const seat = def.turn(state);
    if (seat === null) return null;
    return findLegal(def, state, seat, def.codec.action.fromText(move, state)) ?? null;
  } catch {
    return null;
  }
}

export function useStudyBoard(ui: AnyGameUi, position: string, lastMove: string | null) {
  const motion = useApp((s) => s.settings?.motion ?? 'system');
  const sound = useApp((s) => s.settings?.sound ?? true);
  const reduced = useReducedMotion(motion);
  const [queue] = useState(() => new EventQueue<GameEvent>({ duration: (e) => ui.eventDuration(e), reducedMotion: () => false }));
  const previous = useRef<string | null>(null);
  const [lastAction, setLastAction] = useState<unknown>(null);

  useEffect(() => {
    queue.configure({
      reducedMotion: () => reduced,
      onStart: (item) => {
        const name = sound ? ui.sound(item.event) : null;
        if (name) playSound(name);
      },
    });
  }, [queue, reduced, sound, ui]);

  useEffect(() => () => queue.clear(), [queue]);

  useEffect(() => {
    const before = previous.current;
    previous.current = position;
    if (before === position) return;
    let action: unknown = null;
    if (before && lastMove) {
      action = actionFor(ui, before, lastMove);
      if (action !== null) {
        const result = ui.def.apply(ui.def.codec.state.fromText(before), action);
        if (ui.def.codec.state.toText(result.state) === position) queue.push(result.events);
        else action = null;
      }
    }
    if (!action) queue.skip();
    setLastAction(action);
  }, [position, lastMove, ui, queue]);

  const anim = useSyncExternalStore(queue.subscribe, queue.snapshot);
  const state = useMemo(() => ui.def.codec.state.fromText(position), [ui, position]);
  return { state, anim, lastAction, skip: () => queue.skip() };
}
