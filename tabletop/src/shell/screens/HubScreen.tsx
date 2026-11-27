/**
 * A game's hub: the same four doors for every game (Learn, Practice, Play, Review) plus the
 * reference card. Unbuilt games show their doors as coming.
 */
import { useState } from 'react';
import { stableStringify } from '../../core/json';
import type { CatalogGame } from '../../games/catalog';
import { catalogGame } from '../../games/catalog';
import { hasLessons, loadLessons } from '../../games/lessons';
import { hasPractice } from '../../games/practice';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi } from '../../games/types';
import { appDb } from '../../store/db';
import type { StoredRecord } from '../../store/db';
import { attemptsFor, cardsFor, lessonProgress } from '../../store/learning';
import { problemRating } from '../../teach/progress';
import type { RatingState } from '../../teach/rating';
import { SETTLED_AFTER } from '../../teach/rating';
import { playRatingFor, suggestedLevel } from '../ratings';
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
import { useEscape } from '../useEscape';
import { importGame, startGame } from '../table/start';
import { pickTextFile } from '../platform';
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

function PlayDialog({ ui, profileId, active, seed, setup, now, rating, onClose }: { ui: AnyGameUi; profileId: string; active: StoredRecord | undefined; seed: string | undefined; setup: unknown; now: number; rating: RatingState; onClose: () => void }) {
  const suggested = suggestedLevel(ui, rating);
  const remembered = useApp((s) => s.settings?.levels[ui.def.id]);
  const rememberedClock = useApp((s) => s.settings?.clocks[ui.def.id]);
  const updateSettings = useApp((s) => s.updateSettings);
  const levels = useApp((s) => s.settings?.levels ?? {});
  const clockChoices = useApp((s) => s.settings?.clocks ?? {});
  const clocks = ui.clocks ?? [];
  const rulesChosen = useApp((s) => s.settings?.rules ?? {});
  const options = setup === undefined ? ui.options : undefined;
  const [config, setConfig] = useState<unknown>(() => {
    const remembered = rulesChosen[ui.def.id];
    if (remembered === undefined) return ui.def.defaultConfig;
    try {
      return ui.def.codec.config.fromJSON(remembered);
    } catch {
      return ui.def.defaultConfig;
    }
  });
  const [showRules, setShowRules] = useState(false);
  const configKey = (c: unknown) => stableStringify(ui.def.codec.config.toJSON(c));
  const presetId = options?.presets.find((p) => configKey(p.config) === configKey(config))?.id ?? null;
  // Games with fixed setups (shogi's handicaps, mini-shogi) offer them as a list instead.
  const setupPresets = ui.presets ?? [];
  const [setupPresetId, setSetupPresetId] = useState<string>(setupPresets[0]?.id ?? '');
  const setupPreset = setup === undefined ? setupPresets.find((p) => p.id === setupPresetId) : undefined;
  const [level, setLevel] = useState<number>(remembered ?? suggested);
  const [side, setSide] = useState<string>(ui.sides[0]?.id ?? '');
  const [clockId, setClockId] = useState<string>(rememberedClock ?? clocks[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  useEscape(onClose);
  const start = async () => {
    setBusy(true);
    const choice = ui.sides.find((s) => s.id === side);
    const clock = clocks.find((c) => c.id === clockId);
    await updateSettings({
      levels: { ...levels, [ui.def.id]: level },
      clocks: { ...clockChoices, [ui.def.id]: clockId },
      ...(options ? { rules: { ...rulesChosen, [ui.def.id]: ui.def.codec.config.toJSON(config) } } : {}),
    });
    const id = await startGame(ui, profileId, {
      level,
      side: choice?.seat ?? 'either',
      ...(seed ? { seed } : {}),
      ...(setup !== undefined ? { config: setup } : options ? { config } : setupPreset ? { config: setupPreset.config } : {}),
      clock: clock && clock.initialMs > 0 ? { initialMs: clock.initialMs, incrementMs: clock.incrementMs } : null,
    });
    navigate(`/play/${id}`);
  };
  return (
    <div className="dialog-scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog dialog-wide" role="dialog" aria-modal="true" aria-labelledby="play-title">
        <div className="card-title">
          <h2 id="play-title">{t('play.title')}</h2>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="setup">
          {active ? (
            <a className="link-row wide" href={href(`/play/${active.id}`)}>
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
          <div className="setup-row wide">
            <span className="eyebrow">{t('play.level')}</span>
            <Segmented<number> label={t('play.level')} options={ui.levels.map((l) => ({ value: l.level, label: String(l.level) }))} value={level} onChange={setLevel} />
            <p className="level-blurb">{ui.levelBlurb(level)}</p>
            <p className="level-blurb faint num">
              {t('play.suggested', { n: suggested, rating: rating.rating })}
              {rating.count < SETTLED_AFTER ? ` (${t('rating.provisional')})` : ''}
              {level !== suggested ? (
                <>
                  {' '}
                  <button type="button" className="link-button inline" onClick={() => setLevel(suggested)}>
                    {t('play.use-suggested')}
                  </button>
                </>
              ) : null}
            </p>
          </div>
          {setupPreset ? (
            <div className="setup-row wide">
              <label className="eyebrow" htmlFor="play-preset">
                {t('play.rules')}
              </label>
              <select id="play-preset" className="preset-select" value={setupPreset.id} onChange={(e) => setSetupPresetId(e.target.value)}>
                {setupPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              {setupPreset.detail ? <p className="level-blurb">{setupPreset.detail}</p> : null}
              {setupPreset.ratingOffset ? (
                <p className="level-blurb faint num">{t('play.rules.strength', { n: Math.max(100, (ui.levels.find((l) => l.level === level)?.rating ?? 0) - setupPreset.ratingOffset) })}</p>
              ) : null}
            </div>
          ) : null}
          {ui.sides.length > 1 ? (
            <div className="setup-row">
              <span className="eyebrow">{t('play.side')}</span>
              <Segmented<string> label={t('play.side')} options={ui.sides.map((s) => ({ value: s.id, label: t(s.label) }))} value={side} onChange={setSide} />
            </div>
          ) : null}
          {options ? (
            <div className="setup-row wide">
              <span className="eyebrow">{t('rules.title')}</span>
              <div className="row" style={{ gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <Segmented<string>
                  label={t('rules.title')}
                  options={[...options.presets.map((p) => ({ value: p.id, label: p.label })), ...(presetId ? [] : [{ value: 'custom', label: t('rules.custom') }])]}
                  value={presetId ?? 'custom'}
                  onChange={(id) => {
                    const preset = options.presets.find((p) => p.id === id);
                    if (preset) setConfig(preset.config);
                  }}
                />
                <button type="button" className="link-button inline" aria-expanded={showRules} onClick={() => setShowRules((v) => !v)}>
                  {showRules ? t('rules.hide') : t('rules.change')}
                </button>
              </div>
              {showRules ? (
                <div className="rule-fields">
                  {options.fields.map((f) => (
                    <div key={f.key} className="rule-field">
                      <span className="rule-label">{f.label}</span>
                      <Segmented<string | number> label={f.label} options={f.choices.map((c) => ({ value: c.value, label: c.label }))} value={options.get(config, f.key)} onChange={(v) => setConfig(options.set(config, f.key, v))} />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
          {clocks.length > 0 ? (
            <div className="setup-row">
              <span className="eyebrow">{t('clock.label')}</span>
              <Segmented<string> label={t('clock.label')} options={clocks.map((c) => ({ value: c.id, label: t(c.label) }))} value={clockId} onChange={setClockId} />
            </div>
          ) : null}
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

function ReviewDialog({ ui, profileId, finished, onClose }: { ui: AnyGameUi; profileId: string; finished: readonly StoredRecord[]; onClose: () => void }) {
  const notify = useApp((s) => s.notify);
  useEscape(onClose);
  const openFile = async () => {
    const format = ui.importRecord;
    if (!format) return;
    try {
      const picked = await pickTextFile(format.accept);
      if (!picked) return;
      const id = await importGame(ui, profileId, picked.text);
      notify(t('play.imported', { file: picked.name }));
      navigate(`/review/${id}`);
    } catch (err) {
      notify(t('play.import.failed', { message: (err as Error).message }));
    }
  };
  return (
    <div className="dialog-scrim" onPointerDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="review-title">
        <div className="card-title">
          <h2 id="review-title">{t('review.list')}</h2>
          <button type="button" className="icon-btn" aria-label={t('common.close')} onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        {ui.importRecord ? (
          <button type="button" className="btn btn-small" style={{ marginBottom: 'var(--sp-3)' }} onClick={() => void openFile()}>
            <Icon name="import" size={18} />
            {t('play.import')}
          </button>
        ) : null}
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

function PlayableDoors({ game, seed, setup }: { game: CatalogGame; seed: string | undefined; setup: Record<string, string> }) {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const [open, setOpen] = useState<'play' | 'review' | null>(null);
  const data = useAsync(async () => {
    const [ui, active, finished, pack, done, attempts, cards] = await Promise.all([
      loadGameUi(game.id),
      activeRecord(appDb(), profileId, game.id),
      finishedRecords(appDb(), profileId, game.id),
      hasLessons(game.id) ? loadLessons(game.id) : Promise.resolve(null),
      lessonProgress(appDb(), profileId, game.id),
      attemptsFor(appDb(), profileId, game.id),
      cardsFor(appDb(), profileId, game.id),
    ]);
    const rating = await playRatingFor(ui, profileId);
    return { ui, active, finished, pack, done, attempts, cards, rating, now: Date.now() };
  }, `${game.id}:${profileId}:${open ?? ''}`);
  if (data.status !== 'done') return <div className="doors" aria-busy="true" />;
  const { ui, active, finished, pack, done, attempts, cards, rating, now } = data.value;
  const due = cards.filter((c) => c.schedule.due <= now).length;
  const lessons = pack?.lessons ?? [];
  const lessonsDone = lessons.filter((l) => done.has(l.id)).length;
  const nextLesson = lessons.find((l) => !done.has(l.id));
  return (
    <>
      <div className="doors">
        {pack ? (
          <Door
            icon="learn"
            title={t('door.learn')}
            blurb={nextLesson ? t('door.learn.next', { title: nextLesson.title }) : t('learn.all-done')}
            foot={t('door.learn.count', { done: lessonsDone, total: lessons.length })}
            footStrong={lessonsDone > 0}
            onOpen={() => navigate(`/games/${game.id}/learn`)}
          />
        ) : (
          <Door icon="learn" title={t('door.learn')} blurb={t('door.none')} />
        )}
        {hasPractice(game.id) ? (
          <Door
            icon="practice"
            title={t('door.practice')}
            blurb={t('door.practice.blurb')}
            foot={due > 0 ? t('door.practice.due', { n: due }) : t('door.practice.rating', { rating: problemRating(attempts).rating })}
            footStrong={due > 0}
            onOpen={() => navigate(`/games/${game.id}/practice`)}
          />
        ) : (
          <Door icon="practice" title={t('door.practice')} blurb={t('door.none')} />
        )}
        <Door
          icon="play"
          title={t('door.play')}
          blurb={tDynamic(`game.${game.id}.cpu`)}
          foot={active ? t('play.resume.detail', { n: active.actions.length + 1, when: timeAgo(active.updatedAt, now) }) : t('play.start')}
          footStrong
          onOpen={() => setOpen('play')}
        />
        <Door icon="review" title={t('door.review')} blurb={ui.review ? t('door.review.blurb') : t('review.key-moments')} foot={finished.length > 0 ? tCount('count.finished', finished.length) : t('review.none.short')} footStrong={finished.length > 0} onOpen={() => setOpen('review')} />
      </div>
      {open === 'play' ? (
        <PlayDialog ui={ui} profileId={profileId} active={active} seed={seed} setup={Object.keys(setup).length > 0 ? ui.def.codec.config.fromJSON(setup) : undefined} now={now} rating={rating} onClose={() => setOpen(null)} />
      ) : null}
      {open === 'review' ? <ReviewDialog ui={ui} profileId={profileId} finished={finished} onClose={() => setOpen(null)} /> : null}
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

export function HubScreen({ gameId, seed, setup = {} }: { gameId: string; seed: string | undefined; setup?: Record<string, string> }) {
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
      {game.playable ? <PlayableDoors game={game} seed={seed} setup={setup} /> : <ComingDoors game={game} />}
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
