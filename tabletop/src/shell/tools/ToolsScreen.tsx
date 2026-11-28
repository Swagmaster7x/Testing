/**
 * Tools (milestone 16): scorepads for games played at a real table, and the poker blind timer.
 * The score calculators for each Mahjong style come with the last part of the milestone.
 */
import { useState } from 'react';
import { appDb } from '../../store/db';
import { newId } from '../../store/ids';
import { deletePad, listPads, savePad } from '../../store/pads';
import type { PadKind } from '../../tools/scorepad';
import { newPad, PAD_KINDS, totals } from '../../tools/scorepad';
import { t, tDynamic } from '../../text';
import { timeAgo } from '../format';
import { href, navigate } from '../router';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { Screen } from '../screens/common';

export function ToolsScreen() {
  const profile = useApp((s) => s.profile);
  const [version, setVersion] = useState(0);
  const pads = useAsync(async () => ({ list: profile ? await listPads(appDb(), profile.id) : [], now: Date.now() }), `${profile?.id ?? ''}/${version}`);

  const create = (kind: PadKind) => {
    if (profile) void createPad(profile.id, kind);
  };
  const remove = async (id: string) => {
    if (!profile) return;
    await deletePad(appDb(), profile.id, id);
    setVersion((v) => v + 1);
  };

  return (
    <Screen label={t('tools.title')}>
      <header className="screen-head">
        <h1>{t('tools.title')}</h1>
      </header>
      <div className="tools-grid">
        <section className="card" aria-labelledby="pads-head">
          <h2 id="pads-head">{t('tools.pads')}</h2>
          <p className="muted">{t('tools.pads.body')}</p>
          <div className="tool-buttons">
            {PAD_KINDS.map((kind) => (
              <button key={kind} type="button" className="btn btn-small" onClick={() => create(kind)}>
                {t('tools.pad.new', { kind: tDynamic(`tools.pad.kind.${kind}`) })}
              </button>
            ))}
          </div>
          {pads.status === 'done' && pads.value.list.length > 0 ? (
            <ul className="pad-list">
              {pads.value.list.map((pad) => (
                <li key={pad.id}>
                  <a href={href(`/tools/pad/${pad.id}`)}>
                    <strong>{pad.title}</strong>
                    <span className="muted num">
                      {pad.names.map((name, i) => `${name} ${totals(pad)[i] ?? 0}`).join(' · ')} · {timeAgo(pad.updatedAt, pads.value.now)}
                    </span>
                  </a>
                  <button type="button" className="btn btn-small btn-quiet" aria-label={t('tools.pad.delete', { title: pad.title })} onClick={() => void remove(pad.id)}>
                    {t('tools.delete')}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
        <section className="card" aria-labelledby="timer-head">
          <h2 id="timer-head">{t('tools.timer')}</h2>
          <p className="muted">{t('tools.timer.body')}</p>
          <a className="btn btn-small btn-primary" href={href('/tools/timer')}>
            {t('tools.timer.open')}
          </a>
        </section>
        <section className="card">
          <h2>{t('tools.list.calculators')}</h2>
          <p className="muted">{t('tools.calculators.body')}</p>
          <a className="btn btn-small btn-primary" href={href('/tools/mahjong')}>
            {t('tools.calc.open')}
          </a>{' '}
          <a className="btn btn-small" href={href('/tools/mahjong-card')}>
            {t('tools.card.open')}
          </a>
        </section>
      </div>
    </Screen>
  );
}

/** Makes a new pad with the usual names for its kind, saves it and opens it. */
async function createPad(profileId: string, kind: PadKind): Promise<void> {
  const pad = newPad(kind, newId('pad'), Date.now(), defaultNames(kind));
  await savePad(appDb(), profileId, { ...pad, title: tDynamic(`tools.pad.kind.${kind}`) });
  navigate(`/tools/pad/${pad.id}`);
}

function defaultNames(kind: PadKind): string[] {
  switch (kind) {
    case 'mahjong':
      return ['east', 'south', 'west', 'north'].map((w) => tDynamic(`tools.pad.wind.${w}`));
    case 'tally':
      return [1, 2, 3].map((n) => t('tools.pad.player', { n }));
    default:
      return [t('tools.pad.us'), t('tools.pad.them')];
  }
}
