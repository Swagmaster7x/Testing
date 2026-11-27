import { useState } from 'react';
import brand from '../../../brand.json';
import type { Profile } from '../../store/db';
import { appDb } from '../../store/db';
import type { BackupFile } from '../../store/backup';
import { backupFileName, exportBackup, importBackup, parseBackup, summarise } from '../../store/backup';
import { t, tCount } from '../../text';
import { ConfirmDialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { Segmented } from '../components/Segmented';
import { shortDate } from '../format';
import { pickTextFile, saveTextFile } from '../platform';
import { href } from '../router';
import { useApp } from '../state';
import { SHIPPED } from '../third-party';
import { Screen } from './common';

function ProfilesCard() {
  const profiles = useApp((s) => s.profiles);
  const active = useApp((s) => s.profile);
  const { switchProfile, addProfile, renameProfile, removeProfile, notify } = useApp.getState();
  const [newName, setNewName] = useState('');
  const [renaming, setRenaming] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState<Profile | null>(null);

  const run = async (work: () => Promise<void>) => {
    try {
      await work();
    } catch (err) {
      notify(t('settings.backup.failed', { message: (err as Error).message }));
    }
  };

  return (
    <section className="card" aria-labelledby="profiles-title">
      <div className="card-title">
        <h2 id="profiles-title">{t('settings.profiles')}</h2>
      </div>
      <p className="empty-note" style={{ marginBottom: 'var(--sp-2)' }}>
        {t('settings.profiles.intro')}
      </p>
      {profiles.map((p) => {
        const isActive = p.id === active?.id;
        return (
          <div key={p.id} className="profile-row" data-active={isActive}>
            <span className="profile-initial" aria-hidden="true">
              {p.name.charAt(0).toUpperCase()}
            </span>
            {renaming?.id === p.id ? (
              <form
                className="inline-form"
                style={{ margin: 0, flex: 1 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  void run(async () => {
                    await renameProfile(p.id, renaming.name);
                    setRenaming(null);
                  });
                }}
              >
                <input className="field" aria-label={t('settings.profiles.rename-to', { name: p.name })} value={renaming.name} onChange={(e) => setRenaming({ id: p.id, name: e.target.value })} autoFocus maxLength={40} />
                <button type="submit" className="btn btn-small">
                  {t('settings.profiles.save')}
                </button>
              </form>
            ) : (
              <>
                <span className="profile-name">{p.name}</span>
                <span className="profile-actions">
                  {isActive ? (
                    <span className="status" style={{ alignSelf: 'center', marginRight: 'var(--sp-2)' }}>
                      {t('settings.profiles.active')}
                    </span>
                  ) : (
                    <button type="button" className="btn btn-small btn-quiet" onClick={() => void run(() => switchProfile(p.id))}>
                      {t('settings.profiles.use')}
                    </button>
                  )}
                  <button type="button" className="icon-btn" aria-label={`${t('settings.profiles.rename')}: ${p.name}`} onClick={() => setRenaming({ id: p.id, name: p.name })}>
                    <Icon name="edit" size={18} />
                  </button>
                  <button type="button" className="icon-btn" aria-label={`${t('settings.profiles.delete')}: ${p.name}`} disabled={profiles.length <= 1} onClick={() => setDeleting(p)}>
                    <Icon name="trash" size={18} />
                  </button>
                </span>
              </>
            )}
          </div>
        );
      })}
      <form
        className="inline-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!newName.trim()) return;
          void run(async () => {
            await addProfile(newName);
            setNewName('');
          });
        }}
      >
        <input className="field" placeholder={t('settings.profiles.new')} aria-label={t('settings.profiles.new')} value={newName} onChange={(e) => setNewName(e.target.value)} maxLength={40} />
        <button type="submit" className="btn" disabled={!newName.trim()}>
          <Icon name="plus" size={18} />
          {t('settings.profiles.add')}
        </button>
      </form>
      {deleting ? (
        <ConfirmDialog
          title={t('settings.profiles.delete.title', { name: deleting.name })}
          confirmLabel={t('settings.profiles.delete')}
          danger
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            const target = deleting;
            setDeleting(null);
            void run(() => removeProfile(target.id));
          }}
        >
          {t('settings.profiles.delete.body')}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}

function TableCard() {
  const settings = useApp((s) => s.settings);
  const update = useApp((s) => s.updateSettings);
  if (!settings) return null;
  return (
    <section className="card" aria-labelledby="table-title">
      <div className="card-title">
        <h2 id="table-title">{t('settings.table')}</h2>
      </div>
      <div className="setting">
        <span className="setting-label">{t('settings.rail')}</span>
        <Segmented
          label={t('settings.rail')}
          options={[
            { value: 'left', label: t('settings.rail.left') },
            { value: 'right', label: t('settings.rail.right') },
          ]}
          value={settings.railSide}
          onChange={(railSide) => void update({ railSide })}
        />
      </div>
      <div className="setting">
        <span className="setting-label">{t('settings.motion')}</span>
        <Segmented
          label={t('settings.motion')}
          options={[
            { value: 'system', label: t('settings.motion.system') },
            { value: 'reduced', label: t('settings.motion.reduced') },
            { value: 'full', label: t('settings.motion.full') },
          ]}
          value={settings.motion}
          onChange={(motion) => void update({ motion })}
        />
      </div>
      <div className="setting">
        <span className="setting-label">{t('settings.sound')}</span>
        <Segmented
          label={t('settings.sound')}
          options={[
            { value: 'on', label: t('common.on') },
            { value: 'off', label: t('common.off') },
          ]}
          value={settings.sound ? 'on' : 'off'}
          onChange={(v) => void update({ sound: v === 'on' })}
        />
      </div>
      <div className="setting">
        <span className="setting-label">{t('settings.deck')}</span>
        <Segmented
          label={t('settings.deck')}
          options={[
            { value: 'two', label: t('settings.deck.two') },
            { value: 'four', label: t('settings.deck.four') },
          ]}
          value={settings.deck}
          onChange={(deck) => void update({ deck })}
        />
      </div>
    </section>
  );
}

function LookCard() {
  return (
    <section className="card" aria-labelledby="look-title">
      <div className="card-title">
        <h2 id="look-title">{t('settings.look')}</h2>
      </div>
      <div className="look-option">
        <span className="swatch" aria-hidden="true" />
        <span className="stack" style={{ gap: 0, flex: 1 }}>
          <span className="setting-label">{t('settings.look.club')}</span>
          <span className="setting-detail">{t('settings.look.club.detail')}</span>
        </span>
        <span className="status">
          <Icon name="check" size={16} />
        </span>
      </div>
      <div className="look-option" aria-disabled="true">
        <span className="swatch swatch-daylight" aria-hidden="true" />
        <span className="stack" style={{ gap: 0, flex: 1 }}>
          <span className="setting-label faint">{t('settings.look.daylight')}</span>
          <span className="setting-detail">{t('settings.look.daylight.detail')}</span>
        </span>
      </div>
    </section>
  );
}

function BackupCard() {
  const persist = useApp((s) => s.persist);
  const { notify, reload } = useApp.getState();
  const [pending, setPending] = useState<BackupFile | null>(null);

  const doExport = async () => {
    try {
      const now = new Date();
      const file = await exportBackup(appDb(), { name: brand.name, version: __APP_VERSION__ }, now);
      const name = backupFileName(brand.name, now);
      const result = await saveTextFile(name, `${JSON.stringify(file, null, 1)}\n`, t('settings.backup'));
      notify(result.kind === 'shared' ? t('settings.backup.shared') : t('settings.backup.exported', { file: name }));
    } catch (err) {
      notify(t('settings.backup.failed', { message: (err as Error).message }));
    }
  };

  const doPick = async () => {
    try {
      const picked = await pickTextFile('application/json,.json');
      if (picked) setPending(parseBackup(picked.text));
    } catch (err) {
      notify(t('settings.backup.failed', { message: (err as Error).message }));
    }
  };

  const doImport = async (backup: BackupFile) => {
    setPending(null);
    try {
      await importBackup(appDb(), backup);
      await reload();
      notify(t('settings.backup.imported'));
    } catch (err) {
      notify(t('settings.backup.failed', { message: (err as Error).message }));
    }
  };

  const summary = pending ? summarise(pending) : null;
  return (
    <section className="card" aria-labelledby="backup-title">
      <div className="card-title">
        <h2 id="backup-title">{t('settings.backup')}</h2>
      </div>
      <p className="empty-note">{t('settings.backup.intro')}</p>
      <div className="row" style={{ marginTop: 'var(--sp-3)' }}>
        <button type="button" className="btn" onClick={() => void doExport()}>
          <Icon name="export" size={18} />
          {t('settings.backup.export')}
        </button>
        <button type="button" className="btn" onClick={() => void doPick()}>
          <Icon name="import" size={18} />
          {t('settings.backup.import')}
        </button>
      </div>
      <p className="setting-detail" style={{ marginTop: 'var(--sp-3)' }}>
        {persist === 'kept' ? t('settings.storage.kept') : persist === 'not-kept' ? t('settings.storage.not-kept') : t('settings.storage.unknown')}
      </p>
      {pending && summary ? (
        <ConfirmDialog title={t('settings.backup.import.title')} confirmLabel={t('settings.backup.import.go')} danger onCancel={() => setPending(null)} onConfirm={() => void doImport(pending)}>
          {t('settings.backup.import.body', {
            date: summary.exportedAt ? shortDate(Date.parse(summary.exportedAt)) : '?',
            profiles: tCount('count.profiles', summary.profiles),
            games: tCount('count.games', summary.games),
          })}
        </ConfirmDialog>
      ) : null}
    </section>
  );
}

function FoundationCard() {
  return (
    <section className="card" aria-labelledby="foundation-title">
      <div className="card-title">
        <h2 id="foundation-title">{t('settings.foundation')}</h2>
      </div>
      <p className="empty-note" style={{ marginBottom: 'var(--sp-3)' }}>
        {t('settings.foundation.intro')}
      </p>
      <a className="btn" href={href('/games/noughts')}>
        {t('settings.foundation.open')}
      </a>
    </section>
  );
}

function AboutCard() {
  return (
    <section className="card" aria-labelledby="about-title">
      <div className="card-title">
        <h2 id="about-title">{t('settings.about')}</h2>
        <span className="faint num" style={{ fontSize: 'var(--fs-xs)' }}>
          {t('settings.about.version', { version: __APP_VERSION__ })}
        </span>
      </div>
      <p className="empty-note">{t('settings.about.ground')}</p>
      <details>
        <summary>{t('settings.about.third-party')}</summary>
        <ul className="third-party">
          {SHIPPED.map((item) => (
            <li key={item.name}>
              <b>{item.name}</b> · {item.licence} · {item.use}
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}

export function SettingsScreen() {
  return (
    <Screen label={t('settings.title')}>
      <header className="screen-head">
        <h1>{t('settings.title')}</h1>
      </header>
      <div className="settings-grid">
        <ProfilesCard />
        <TableCard />
        <BackupCard />
        <LookCard />
        <FoundationCard />
        <AboutCard />
      </div>
    </Screen>
  );
}
