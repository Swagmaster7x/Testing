import { useState } from 'react';
import { GameGlyph } from '../components/GameGlyph';
import { SHELF } from '../../games/catalog';
import { READY_IDS } from '../../games/ready';
import { SETTLED_AFTER } from '../../teach/rating';
import { gameName, practiceText, t, tCount } from '../../text';
import { Icon } from '../components/Icon';
import { Segmented } from '../components/Segmented';
import type { GameProgress } from '../progress-data';
import { gameProgress } from '../progress-data';
import { href } from '../router';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { Screen } from './common';

function Spark({ values }: { values: readonly number[] }) {
  if (values.length === 0) return <span className="faint">{t('common.none')}</span>;
  const w = 84;
  const h = 24;
  const step = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values.map((v, i) => `${(i * step).toFixed(1)},${(h - (v / 100) * h).toFixed(1)}`).join(' ');
  return (
    <svg className="spark" viewBox={`-3 -3 ${w + 6} ${h + 6}`} width={w + 6} height={h + 6} role="img" aria-label={t('progress.accuracy.trend', { list: values.join(', ') })}>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {values.map((v, i) => (
        <circle key={i} cx={(i * step).toFixed(1)} cy={(h - (v / 100) * h).toFixed(1)} r="2.4" fill="currentColor" />
      ))}
    </svg>
  );
}

function rating(state: { rating: number; count: number }): string {
  return state.count === 0 ? t('common.none') : `${state.rating}${state.count < SETTLED_AFTER ? '?' : ''}`;
}

function Detail({ p }: { p: GameProgress }) {
  const latest = p.accuracy[p.accuracy.length - 1];
  return (
    <div className="grid-2 progress-detail">
      <section className="card" aria-labelledby="skills-title">
        <div className="card-title">
          <h2 id="skills-title">{t('progress.skills', { game: gameName(p.gameId) })}</h2>
        </div>
        <ul className="stage-bars">
          {p.stages.map((s) => (
            <li key={s.stage}>
              <span>{t(`learn.stage.${s.stage}`)}</span>
              <span className="bar" aria-hidden="true">
                <span style={{ width: `${Math.round((s.done / Math.max(1, s.total)) * 100)}%` }} />
              </span>
              <span className="num faint">{t('learn.stage.count', { done: s.done, total: s.total })}</span>
            </li>
          ))}
        </ul>
        <dl className="facts progress-facts">
          <dt>{t('progress.problems')}</dt>
          <dd className="num">{p.problems.count === 0 ? t('common.none') : t('progress.problems.detail', { rating: rating(p.problems), n: p.problems.solved })}</dd>
          <dt>{t('progress.rating')}</dt>
          <dd className="num">{p.play.count === 0 ? t('progress.rating.none') : tCount('progress.rating.detail', p.play.count, { rating: rating(p.play) })}</dd>
          <dt>{t('progress.accuracy')}</dt>
          <dd className="num accuracy-row">
            <Spark values={p.accuracy} />
            {latest !== undefined ? <span>{t('progress.accuracy.latest', { n: latest })}</span> : null}
          </dd>
          <dt>{t('progress.queue')}</dt>
          <dd className="num">{t('progress.queue.detail', { due: p.due, total: p.cards })}</dd>
        </dl>
        <p className="faint" style={{ fontSize: 'var(--fs-xs)', margin: 'var(--sp-2) 0 0' }}>
          {t('progress.provisional.note', { n: SETTLED_AFTER })}
        </p>
      </section>
      <section className="card" aria-labelledby="ready-title">
        <div className="card-title">
          <h2 id="ready-title">{t('progress.checklist')}</h2>
          <span className="faint num">{t('progress.ready.count', { done: p.ready.filter((r) => r.done).length, total: p.ready.length })}</span>
        </div>
        <ul className="checklist">
          {p.ready.map((item) => (
            <li key={item.id} data-done={item.done}>
              <span className="check-box" aria-hidden="true">
                {item.done ? <Icon name="check" size={14} /> : null}
              </span>
              <span className="stack" style={{ gap: 0 }}>
                <span>{t(`ready.${item.id}`)}</span>
                <span className="faint ready-how">
                  {item.lessons.length > 0 ? t('ready.how.lessons', { list: item.lessons.map((l) => l.title).join(', ') }) : null}
                  {item.drill ? t('ready.how.drill', { drill: practiceText(p.gameId, item.drill.id), n: item.drill.times, passed: Math.min(item.drill.passed, item.drill.times) }) : null}
                  {item.beatLevel !== null ? t('ready.how.beat', { n: item.beatLevel }) : null}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Skills, ratings and the table-ready checklist per game. No streaks, ever. */
export function ProgressScreen() {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const focus = useApp((s) => s.settings?.focus ?? []);
  const playable = SHELF.filter((g) => g.playable);
  const [picked, setPicked] = useState<string | null>(null);
  const selected = picked ?? focus.find((id) => playable.some((g) => g.id === id)) ?? playable[0]?.id ?? null;
  const all = useAsync(async () => {
    return Promise.all(playable.map((g) => gameProgress(g.id, profileId)));
  }, `${profileId}:${playable.map((g) => g.id).join(',')}`);
  const rows = all.status === 'done' ? all.value : [];
  const detail = rows.find((r) => r.gameId === selected);
  const none = t('common.none');
  return (
    <Screen label={t('progress.title')}>
      <header className="screen-head">
        <h1>{t('progress.title')}</h1>
        <p>{t('progress.intro')}</p>
      </header>
      <section className="card" aria-label={t('progress.title')} style={{ marginBottom: 'var(--sp-3)' }}>
        <table className="progress-table">
          <thead>
            <tr>
              <th scope="col">{t('progress.game')}</th>
              <th scope="col">{t('progress.lessons')}</th>
              <th scope="col">{t('progress.problems')}</th>
              <th scope="col">{t('progress.rating')}</th>
              <th scope="col">{t('progress.ready')}</th>
            </tr>
          </thead>
          <tbody>
            {SHELF.map((game) => {
              const row = rows.find((r) => r.gameId === game.id);
              return (
                <tr key={game.id} data-selected={game.id === selected}>
                  <td>
                    {row ? (
                      <button type="button" className="progress-game" onClick={() => setPicked(game.id)} aria-pressed={game.id === selected}>
                        <GameGlyph gameId={game.id} />
                        {gameName(game.id)}
                      </button>
                    ) : (
                      <span className="progress-game">
                        <GameGlyph gameId={game.id} />
                        {gameName(game.id)}
                      </span>
                    )}
                  </td>
                  <td className="num">{row && row.lessonsTotal > 0 ? t('progress.ready.count', { done: row.lessonsDone, total: row.lessonsTotal }) : none}</td>
                  <td className="num">{row ? rating(row.problems) : none}</td>
                  <td className="num">{row ? rating(row.play) : none}</td>
                  <td className="num">{row ? t('progress.ready.count', { done: row.ready.filter((r) => r.done).length, total: row.ready.length }) : t('progress.ready.count', { done: 0, total: READY_IDS.length })}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      {rows.length > 1 ? (
        <div style={{ marginBottom: 'var(--sp-3)' }}>
          <Segmented<string> label={t('progress.game')} options={rows.map((r) => ({ value: r.gameId, label: gameName(r.gameId) }))} value={selected ?? ''} onChange={setPicked} />
        </div>
      ) : null}
      {detail ? <Detail p={detail} /> : all.status === 'loading' ? <p className="empty-note">{t('app.loading')}</p> : null}
      {detail ? (
        <p className="faint" style={{ fontSize: 'var(--fs-xs)', marginTop: 'var(--sp-3)' }}>
          <a href={href(`/games/${detail.gameId}`)}>{t('progress.open', { game: gameName(detail.gameId) })}</a>
        </p>
      ) : null}
    </Screen>
  );
}
