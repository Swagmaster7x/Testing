/**
 * The poker blind timer: the level, the blinds, the time left and the next level, large enough to
 * read across a table. The clock is saved on the device as when it started, so closing the app
 * does not stop it. While it runs, the screen is kept awake where the browser allows it.
 */
import { useEffect, useRef, useState } from 'react';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import { appDb } from '../../store/db';
import type { TimerClock, TimerSettings } from '../../tools/blinds';
import { clockText, DEFAULT_TIMER, jump, LEVEL_MINUTES, pause, position, running, schedule, start, START_BBS, STOPPED } from '../../tools/blinds';
import { t } from '../../text';
import { Segmented } from '../components/Segmented';
import { playSound } from '../sound';
import { BackLink, Screen } from '../screens/common';

const KEY = 'blind-timer';
const ANTES: readonly number[] = [0, 4, 6, 8];

interface Saved {
  readonly settings: TimerSettings;
  readonly clock: TimerClock;
}

function readSaved(value: Json | undefined): Saved {
  if (!isJsonObject(value) || !isJsonObject(value.settings) || !isJsonObject(value.clock)) return { settings: DEFAULT_TIMER, clock: STOPPED };
  const s = value.settings;
  const c = value.clock;
  const num = (x: Json | undefined, fallback: number) => (typeof x === 'number' && Number.isFinite(x) ? x : fallback);
  return {
    settings: { minutes: num(s.minutes, DEFAULT_TIMER.minutes), startBb: num(s.startBb, DEFAULT_TIMER.startBb), anteFrom: num(s.anteFrom, DEFAULT_TIMER.anteFrom) },
    clock: { startedAt: typeof c.startedAt === 'number' ? c.startedAt : null, elapsed: num(c.elapsed, 0), skip: num(c.skip, 0) },
  };
}

type WakeLock = { release: () => Promise<void> };

export function BlindTimerScreen() {
  const [saved, setSaved] = useState<Saved | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const lastLevel = useRef<number | null>(null);
  const wake = useRef<WakeLock | null>(null);

  useEffect(() => {
    void appDb()
      .device.get(KEY)
      .then((row) => setSaved(readSaved(row?.value)));
  }, []);

  const store = (next: Saved) => {
    setSaved(next);
    void appDb().device.put({ key: KEY, value: { settings: { ...next.settings }, clock: { ...next.clock } } });
  };

  const isRunning = saved !== null && running(saved.clock);
  useEffect(() => {
    if (!isRunning) return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    // Keep the screen on while the clock runs, where the browser allows it.
    const nav = navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLock> } };
    void nav.wakeLock?.request('screen').then(
      (lock) => (wake.current = lock),
      () => undefined,
    );
    return () => {
      clearInterval(id);
      void wake.current?.release().catch(() => undefined);
      wake.current = null;
    };
  }, [isRunning]);

  const levels = saved ? schedule(saved.settings) : [];
  const where = saved ? position(saved.clock, saved.settings, now, levels.length) : { level: 0, left: 0, last: false };

  // A chime when the level changes while the clock runs.
  useEffect(() => {
    if (lastLevel.current !== null && lastLevel.current !== where.level && isRunning) {
      playSound('end');
      navigator.vibrate?.(400);
    }
    lastLevel.current = where.level;
  }, [where.level, isRunning]);

  if (!saved) return <Screen label={t('tools.timer')}>{null}</Screen>;
  const level = levels[where.level];
  const next = levels[where.level + 1];
  const blinds = (l: typeof level) => (l ? (l.ante > 0 ? t('tools.timer.blinds.ante', { sb: l.sb, bb: l.bb, ante: l.ante }) : t('tools.timer.blinds', { sb: l.sb, bb: l.bb })) : '');
  const fresh = saved.clock.startedAt === null && saved.clock.elapsed === 0 && saved.clock.skip === 0;

  return (
    <Screen label={t('tools.timer')}>
      <BackLink to="/tools" label={t('tools.title')} />
      <section className="timer-face" aria-live="polite">
        <p className="timer-level">{t('tools.timer.level', { n: where.level + 1 })}</p>
        <p className="timer-blinds num">{blinds(level)}</p>
        <p className="timer-clock num" data-low={where.left < 60_000 && isRunning}>
          {clockText(where.left)}
        </p>
        <p className="muted">{next ? t('tools.timer.next', { blinds: blinds(next) }) : t('tools.timer.last')}</p>
        <div className="tool-buttons">
          <button type="button" className="btn btn-small" onClick={() => store({ ...saved, clock: jump(saved.clock, saved.settings, Date.now(), levels.length, -1) })} disabled={where.level === 0}>
            {t('tools.timer.previous')}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => store({ ...saved, clock: isRunning ? pause(saved.clock, Date.now()) : start(saved.clock, Date.now()) })}>
            {isRunning ? t('tools.timer.pause') : fresh ? t('tools.timer.start') : t('tools.timer.resume')}
          </button>
          <button type="button" className="btn btn-small" onClick={() => store({ ...saved, clock: jump(saved.clock, saved.settings, Date.now(), levels.length, 1) })} disabled={where.last}>
            {t('tools.timer.next-level')}
          </button>
        </div>
      </section>
      <details className="card" open={fresh}>
        <summary>{t('tools.timer.settings')}</summary>
        <div className="stack" style={{ gap: 'var(--sp-2)' }}>
          <Segmented label={t('tools.timer.minutes')} value={saved.settings.minutes} options={LEVEL_MINUTES.map((m) => ({ value: m, label: t('tools.timer.min', { n: m }) }))} onChange={(minutes) => store({ settings: { ...saved.settings, minutes }, clock: saved.clock })} />
          <Segmented label={t('tools.timer.first')} value={saved.settings.startBb} options={START_BBS.map((bb) => ({ value: bb, label: t('tools.timer.blinds', { sb: Math.max(1, Math.floor(bb / 2)), bb }) }))} onChange={(startBb) => store({ settings: { ...saved.settings, startBb }, clock: saved.clock })} />
          <Segmented label={t('tools.timer.antes')} value={saved.settings.anteFrom} options={ANTES.map((n) => ({ value: n, label: n === 0 ? t('tools.timer.no-antes') : t('tools.timer.antes-from', { n }) }))} onChange={(anteFrom) => store({ settings: { ...saved.settings, anteFrom }, clock: saved.clock })} />
          <button type="button" className="btn btn-small" onClick={() => store({ settings: saved.settings, clock: STOPPED })}>
            {t('tools.timer.reset')}
          </button>
        </div>
        <ol className="timer-schedule">
          {levels.slice(0, 12).map((l, i) => (
            <li key={i} data-now={i === where.level}>
              {t('tools.timer.level', { n: i + 1 })}: {blinds(l)}
            </li>
          ))}
        </ol>
      </details>
    </Screen>
  );
}
