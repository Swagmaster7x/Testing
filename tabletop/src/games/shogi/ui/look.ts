/**
 * The shogi piece face (one kanji, two kanji, international symbols) and the learner marks, a
 * setting per profile. Kept with the shogi coach switches (settings.coach.shogi), so it needs no
 * storage change and travels with backups; the movement marks are also a coach switch in the rail.
 */
import { useCallback } from 'react';
import { useApp } from '../../../shell/state';
import type { PieceStyle } from './pieces';

export const MARKS_HELP = 'marks';
const KANJI2 = 'look-kanji2';
const SYMBOLS = 'look-symbols';

export interface ShogiLook {
  readonly style: PieceStyle;
  readonly marks: boolean;
}

export function lookFrom(stored: Readonly<Record<string, boolean>> | undefined): ShogiLook {
  const style: PieceStyle = stored?.[SYMBOLS] ? 'symbols' : stored?.[KANJI2] ? 'kanji2' : 'kanji1';
  return { style, marks: stored?.[MARKS_HELP] ?? false };
}

export function useShogiLook(): { look: ShogiLook; setStyle: (style: PieceStyle) => void; setMarks: (on: boolean) => void } {
  const coach = useApp((s) => s.settings?.coach);
  const update = useApp((s) => s.updateSettings);
  const stored = coach?.shogi;
  const look = lookFrom(stored);
  const save = useCallback(
    (patch: Record<string, boolean>) => void update({ coach: { ...(coach ?? {}), shogi: { ...(stored ?? {}), ...patch } } }),
    [coach, stored, update],
  );
  return {
    look,
    setStyle: (style) => save({ [KANJI2]: style === 'kanji2', [SYMBOLS]: style === 'symbols' }),
    setMarks: (on) => save({ [MARKS_HELP]: on }),
  };
}

export const STYLES: readonly PieceStyle[] = ['kanji1', 'kanji2', 'symbols'];
