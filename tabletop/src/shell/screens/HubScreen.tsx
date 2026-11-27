/**
 * A game's hub: the same four doors for every game (Learn, Practice, Play, Review) plus the
 * reference card. Unbuilt games show their doors as coming.
 */
import { useState } from 'react';
import type { CatalogGame } from '../../games/catalog';
import { catalogGame } from '../../games/catalog';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi } from '../../games/types';
import { appDb } from '../../store/db';
import type { StoredRecord } from '../../store/db';
import { activeRecord, finishedRecords } from '../../store/records';
import { gameName, t, tCount, tDynamic } from '../../text';
import { GameGlyph } from '../components/GameGlyph';
import type { IconName } from '../components/Icon';
import { Icon } from '../components/Icon';
import { Segmented } from '../components/Segmented';
import { shortDate, timeAgo } from '../format';
import { href, navigate } from '../router';
import { resultFor } from '../results';
import { useApp } from '../state';
import { startGame } from '../table/start';
import { useAsync } from '../useAsync';
import { BackLink, CenterMessage, Screen } from './common';

interface DoorProps {
  readonly icon: IconName;
  readonly title: string;
  readonly blurb: string;
  readonly foot?: string;
  readonly footStrong?: boolean;
  readonly onOpen?: (() => void) | undefined;
}

function Door({ icon, title, blurb, foot, footStrong = false, onOpen }: DoorProps) {
  const disabled = !onOpen;
  return (
    <button type="button" className="door" aria-disabled={disabled} onClick={onOpen}>
      <span className="door-icon">
        <Icon name={icon} size={26} />
      </span>
      <h3>{title}</h3>
      <p>{blurb}</p>
      {foot ? <span className={footStrong ? 'door-foot status' : 'door-foot status status-quiet'}>{foot}</span> : null}
    </button>
  );
}

function PlayDialog({ ui, profileId, active, seed, now, onClose }: { ui: AnyGameUi; profileId: string; active: StoredRecord | undefined; seed: string | undefined; now: number; onClose: () => void }) {
  const remembered = useApp((s) => s.settings?.levels[ui.def.id]);
  const updateSettings = useApp((s) => s.updateSettings);
  const levels = useApp((s) => s.settings?.levels ?? {});
  const [level, setLevel] = useState<number>(remembered ?? ui.levels[0]?.level ?? 1);
  const [side, setSide] = useState<string>(ui.sides[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const start = async () => {
    setBusy(true);
    const choice = ui.sides.find((s) => s.id === side);
    await updateSettings({ levels: { ...levels, [ui.def.id]: level } });
    const id = await startGame(ui, profileId, { level, side: choice?.seat ?? 'either', ...(seed ? { seed } : {}) });
    navigate(`/play/${id}`);
  };
  return (
    <div className="dialog-scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="play-title">
        <div className="card-title">
          <h2 id="play-title">{t('play.title')}</h2>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="setup">
          {active ? (
            <a className="link-row" href={href(`/play/${active.id}`)}>
              <Icon name="play" />
              <span className="stack" style={{ gap: 0 }}>
                <b>{t('play.resume')}</b>
                <span className="faint num" style={{ fontSize: 'var(--fs-xs)' }}>
                  {t('play.resume.detail', { n: active.actions.length + 1, when: timeAgo(active.updatedAt, now) })}
                </span>
              </span>
              <span className="chev">
                <Icon name="chevron" size={18} />
              </span>
            </a>
          ) : null}
          <div className="setup-row">
            <span className="eyebrow">{t('play.level')}</span>
            <Segmented<number> label={t('play.level')} options={ui.levels.map((l) => ({ value: l.level, label: String(l.level) }))} value={level} onChange={setLevel} />
            <p className="level-blurb">{ui.levelBlurb(level)}</p>
          </div>
          <div className="setup-row">
            <span className="eyebrow">{t('play.side')}</span>
            <Segmented<string> label={t('play.side')} options={ui.sides.map((s) => ({ value: s.id, label: t(s.label) }))} value={side} onChange={setSide} />
          </div>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn btn-quiet" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => void start()} disabled={busy}>
            <Icon name="play" size={18} />
            {active ? t('play.new') : t('play.start')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewDialog({ finished, onClose }: { finished: readonly StoredRecord[]; onClose: () => void }) {
  return (
    <div className="dialog-scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div className="card-title">
          <h2 id="review-title">{t('review.list')}</h2>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {finished.length === 0 ? (
          <p className="empty-note">{t('review.none')}</p>
        ) : (
          <ul className="game-list">
            {finished.slice(0, 30).map((r) => {
              const bot = r.players.find((p) => p.kind === 'bot');
              return (
                <li key={r.id}>
                  <a href={href(`/review/${r.id}`)}>
                    <span className="result">{t(resultFor(r))}</span>
                    <span className="muted">{bot ? t('review.vs', { n: bot.level ?? 1 }) : null}</span>
                    <span className="faint num" style={{ marginLeft: 'auto' }}>
                      {shortDate(r.updatedAt)}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

function PlayableDoors({ game, seed }: { game: CatalogGame; seed: string | undefined }) {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const [open, setOpen] = useState<'play' | 'review' | null>(null);
  const data = useAsync(async () => {
    const [ui, active, finished] = await Promise.all([loadGameUi(game.id), activeRecord(appDb(), profileId, game.id), finishedRecords(appDb(), profileId, game.id)]);
    return { ui, active, finished, now: Date.now() };
  }, `${game.id}:${profileId}:${open ?? ''}`);
  if (data.status !== 'done') return <div className="doors" aria-busy="true" />;
  const { ui, active, finished, now } = data.value;
  return (
    <>
      <div className="doors">
        <Door icon="learn" title={t('door.learn')} blurb={t('door.none')} />
        <Door icon="practice" title={t('door.practice')} blurb={t('door.none')} />
        <Door
          icon="play"
          title={t('door.play')}
          blurb={tDynamic(`game.${game.id}.cpu`)}
          foot={active ? t('play.resume.detail', { n: active.actions.length + 1, when: timeAgo(active.updatedAt, now) }) : t('play.start')}
          footStrong
          onOpen={() => setOpen('play')}
        />
        <Door icon="review" title={t('door.review')} blurb={t('review.key-moments')} foot={finished.length > 0 ? tCount('count.finished', finished.length) : t('review.none.short')} footStrong={finished.length > 0} onOpen={() => setOpen('review')} />
      </div>
      {open === 'play' ? <PlayDialog ui={ui} profileId={profileId} active={active} seed={seed} now={now} onClose={() => setOpen(null)} /> : null}
      {open === 'review' ? <ReviewDialog finished={finished} onClose={() => setOpen(null)} /> : null}
    </>
  );
}

function ComingDoors({ game }: { game: CatalogGame }) {
  const coming = t('door.coming');
  return (
    <div className="doors">
      <Door icon="learn" title={t('door.learn')} blurb={t('door.learn.blurb')} foot={coming} />
      <Door icon="practice" title={t('door.practice')} blurb={tDynamic(`game.${game.id}.practice`)} foot={coming} />
      <Door icon="play" title={t('door.play')} blurb={tDynamic(`game.${game.id}.cpu`)} foot={coming} />
      <Door icon="review" title={t('door.review')} blurb={t('door.review.blurb')} foot={coming} />
    </div>
  );
}

export function HubScreen({ gameId, seed }: { gameId: string; seed: string | undefined }) {
  const game = catalogGame(gameId);
  const isFocus = useApp((s) => s.settings?.focus.includes(gameId) ?? false);
  const toggleFocus = useApp((s) => s.toggleFocus);
  const notify = useApp((s) => s.notify);
  if (!game) {
    return (
      <Screen label={t('app.not-found')}>
        <CenterMessage>
          <p>{t('app.not-found')}</p>
          <a className="btn" href={href('/games')}>
            {t('hub.back')}
          </a>
        </CenterMessage>
      </Screen>
    );
  }
  const name = gameName(game.id);
  const onFocus = async () => {
    const result = await toggleFocus(game.id);
    notify(result === 'full' ? t('focus.full') : result === 'added' ? t('focus.added', { game: name }) : t('focus.removed', { game: name }));
  };
  return (
    <Screen label={name}>
      <BackLink to={game.onShelf ? '/games' : '/settings'} label={game.onShelf ? t('hub.back') : t('nav.settings')} />
      <header className="hub-head">
        <GameGlyph gameId={game.id} large />
        <div className="hub-title">
          <div className="row" style={{ gap: 'var(--sp-3)' }}>
            <h1>{name}</h1>
            {game.playable ? (
              game.onShelf ? null : <span className="status status-quiet">{t('status.test')}</span>
            ) : (
              <span className="status">{t('status.coming-short', { n: game.milestone })}</span>
            )}
          </div>
          <p>{tDynamic(`game.${game.id}.aka`)}</p>
        </div>
        {game.onShelf ? (
          <button type="button" className="btn btn-small" aria-pressed={isFocus} onClick={() => void onFocus()}>
            <Icon name={isFocus ? 'star-filled' : 'star'} size={18} />
            {isFocus ? t('focus.on') : t('focus.add')}
          </button>
        ) : null}
      </header>
      {game.playable ? <PlayableDoors game={game} seed={seed} /> : <ComingDoors game={game} />}
      <div className="hub-more">
        <a className="link-row" href={href(`/games/${game.id}/reference`)}>
          <Icon name="reference" />
          <span className="stack" style={{ gap: 0 }}>
            <b>{t('hub.reference')}</b>
            <span className="faint" style={{ fontSize: 'var(--fs-xs)' }}>
              {t('hub.reference.blurb')}
            </span>
          </span>
          <span className="chev">
            <Icon name="chevron" size={18} />
          </span>
        </a>
        <div className="link-row" style={{ alignItems: 'flex-start' }}>
          <dl className="facts">
            <dt>{t('hub.launch')}</dt>
            <dd>{tDynamic(`game.${game.id}.launch`)}</dd>
            {game.playable ? null : (
              <>
                <dt>{t('hub.later')}</dt>
                <dd>{tDynamic(`game.${game.id}.later`)}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </Screen>
  );
}
