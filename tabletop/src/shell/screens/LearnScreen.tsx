/**
 * A game's Learn door (PLAN.md 1.3): lessons in stages, with a recommended path. Nothing is
 * locked, and "I already know this" passes a stage after a short check.
 */
import { useState } from 'react';
import { catalogGame } from '../../games/catalog';
import { loadLessons } from '../../games/lessons';
import { appDb } from '../../store/db';
import { lessonProgress, wasSkipped } from '../../store/learning';
import type { StageId } from '../../teach/lesson';
import { STAGES } from '../../teach/lesson';
import { gameName, t } from '../../text';
import { Icon } from '../components/Icon';
import { Segmented } from '../components/Segmented';
import { href } from '../router';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { BackLink, CenterMessage, Screen } from './common';

export function LearnScreen({ gameId }: { gameId: string }) {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const data = useAsync(async () => {
    const [pack, done] = await Promise.all([loadLessons(gameId), lessonProgress(appDb(), profileId, gameId)]);
    return { pack, done };
  }, `${gameId}:${profileId}`);
  const [picked, setPicked] = useState<StageId | null>(null);
  const game = catalogGame(gameId);
  if (!game) return <CenterMessage>{t('app.not-found')}</CenterMessage>;
  const name = gameName(gameId);
  if (data.status !== 'done') {
    return (
      <Screen label={t('learn.title', { game: name })}>
        <BackLink to={`/games/${gameId}`} label={name} />
        <p className="empty-note">{data.status === 'failed' ? data.error.message : t('app.loading')}</p>
      </Screen>
    );
  }
  const { pack, done } = data.value;
  if (!pack) {
    return (
      <Screen label={t('learn.title', { game: name })}>
        <BackLink to={`/games/${gameId}`} label={name} />
        <p className="empty-note">{t('learn.none')}</p>
      </Screen>
    );
  }
  const lessons = pack.lessons;
  const stages = STAGES.filter((stage) => lessons.some((l) => l.stage === stage));
  const upNext = lessons.find((l) => !done.has(l.id));
  const stage = picked ?? upNext?.stage ?? stages[0] ?? 'stage-0';
  const inStage = lessons.filter((l) => l.stage === stage);
  const stageDone = inStage.filter((l) => done.has(l.id)).length;
  const doneCount = lessons.filter((l) => done.has(l.id)).length;

  return (
    <Screen label={t('learn.title', { game: name })}>
      <BackLink to={`/games/${gameId}`} label={name} />
      <header className="screen-head learn-head">
        <div>
          <h1>{t('learn.title', { game: name })}</h1>
          <p className="num">{t('learn.count', { done: doneCount, total: lessons.length })}</p>
        </div>
        {upNext ? (
          <a className="btn btn-primary" href={href(`/learn/${upNext.id}`)}>
            <Icon name="play" size={18} />
            {doneCount === 0 ? t('learn.start', { title: upNext.title }) : t('learn.continue', { title: upNext.title })}
          </a>
        ) : (
          <span className="status">{t('learn.all-done')}</span>
        )}
      </header>
      <div className="learn-stages">
        <Segmented<StageId> label={t('learn.stages')} options={stages.map((st) => ({ value: st, label: t(`learn.stage.${st}`) }))} value={stage} onChange={setPicked} />
      </div>
      <section className="card learn-stage" aria-labelledby="stage-title">
        <div className="card-title">
          <div>
            <h2 id="stage-title">{t(`learn.stage.${stage}`)}</h2>
            <p className="muted learn-stage-blurb">{t(`learn.stage.${stage}.blurb`)}</p>
          </div>
          <div className="row" style={{ gap: 'var(--sp-2)' }}>
            <span className="faint num">{t('learn.stage.count', { done: stageDone, total: inStage.length })}</span>
            {stageDone < inStage.length ? (
              <a className="btn btn-small" href={href(`/learn/${gameId}.check.${stage}`)}>
                {t('learn.know-this')}
              </a>
            ) : null}
          </div>
        </div>
        <ol className="lesson-list">
          {inStage.map((lesson) => {
            const row = done.get(lesson.id);
            const isNext = upNext?.id === lesson.id;
            return (
              <li key={lesson.id}>
                <a className="lesson-row" href={href(`/learn/${lesson.id}`)} data-next={isNext}>
                  <span className="lesson-mark" data-done={row !== undefined} aria-hidden="true">
                    {row ? <Icon name="check" size={16} /> : null}
                  </span>
                  <span className="lesson-name">{lesson.title}</span>
                  <span className="faint num lesson-meta">
                    {row ? (wasSkipped(row) ? t('learn.skipped') : t('learn.done')) : isNext ? t('learn.next') : t('learn.minutes', { n: lesson.minutes })}
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </section>
    </Screen>
  );
}
