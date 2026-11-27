/** The coach section of the rail: one switch per help, and the game's own coach panel. */
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { AnyGameUi } from '../../games/types';
import { t } from '../../text';
import { useApp } from '../state';
import { RailSection } from './TableShell';

/** The coach switches for a game: the profile's choices, or the game's defaults. */
export function useHelps(ui: AnyGameUi): { helps: Readonly<Record<string, boolean>>; setHelp: (id: string, on: boolean) => void } {
  const all = useApp((s) => s.settings?.coach);
  const update = useApp((s) => s.updateSettings);
  const stored = all?.[ui.def.id];
  const helps = useMemo(() => Object.fromEntries((ui.coach?.helps ?? []).map((h) => [h.id, stored?.[h.id] ?? h.on])), [ui, stored]);
  const setHelp = (id: string, on: boolean) => void update({ coach: { ...(all ?? {}), [ui.def.id]: { ...(stored ?? {}), [id]: on } } });
  return { helps, setHelp };
}

export function CoachSection({ ui, helps, setHelp, training, children }: { ui: AnyGameUi; helps: Readonly<Record<string, boolean>>; setHelp: (id: string, on: boolean) => void; training: boolean; children: ReactNode }) {
  return (
    <RailSection title={t('coach.title')}>
      <div className="helps" role="group" aria-label={t('coach.title')}>
        {(ui.coach?.helps ?? []).map((h) => (
          <button key={h.id} type="button" role="switch" aria-checked={helps[h.id] === true} className="help-chip" onClick={() => setHelp(h.id, !helps[h.id])}>
            {t(h.label)}
          </button>
        ))}
      </div>
      {children}
      {training ? <p className="side-note">{t('coach.training')}</p> : null}
    </RailSection>
  );
}
