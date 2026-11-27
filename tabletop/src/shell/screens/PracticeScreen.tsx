/**
 * A game's Practice door (PLAN.md 1.3): the review queue of cards that are due, problem sets
 * chosen near your rating, and generated drills.
 */
import { catalogGame } from '../../games/catalog';
import { inSet, loadPractice } from '../../games/practice';
import { appDb } from '../../store/db';
import { attemptsFor, cardsFor } from '../../store/learning';
import { SETTLED_AFTER } from '../../teach/rating';
import { problemRating } from '../../teach/progress';
import { gameName, t, tCount, tDynamic } from '../../text';
import { Icon } from '../components/Icon';
import { href } from '../router';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { BackLink, CenterMessage, Screen } from './common';

export function PracticeScreen({ gameId }: { gameId: string }) {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const data = useAsync(async () => {
    const [pack, attempts, cards] = await Promise.all([loadPractice(gameId), attemptsFor(appDb(), profileId, gameId), cardsFor(appDb(), profileId, gameId)]);
    return { pack, attempts, cards, now: Date.now() };
  }, `${gameId}:${profileId}`);
  const game = catalogGame(gameId);
  if (!game) return <CenterMessage>{t('app.not-found')}</CenterMessage>;
  const name = gameName(gameId);
  if (data.status !== 'done' || !data.value.pack) {
    return (
      <Screen label={t('practice.title', { game: name })}>
        <BackLink to={`/games/${gameId}`} label={name} />
        <p className="empty-note">{data.status === 'loading' ? t('app.loading') : data.status === 'failed' ? data.error.message : t('practice.none')}</p>
      </Screen>
    );
  }
  const { pack, attempts, cards, now } = data.value;
  const rating = problemRating(attempts);
  const due = cards.filter((c) => c.schedule.due <= now).length;
  const solved = attempts.filter((a) => a.solved).length;
  const later = cards.filter((c) => c.schedule.due > now).sort((a, b) => a.schedule.due - b.schedule.due)[0];

  return (
    <Screen label={t('practice.title', { game: name })}>
      <BackLink to={`/games/${gameId}`} label={name} />
      <header className="screen-head learn-head">
        <div>
          <h1>{t('practice.title', { game: name })}</h1>
          <p className="num">
            {t('practice.rating.long', { rating: rating.rating })}
            {rating.count < SETTLED_AFTER ? ` · ${t('rating.provisional')}` : ''} · {t('practice.solved.count', { n: solved })}
          </p>
        </div>
      </header>
      <div className="practice-grid">
        <section className="card practice-card" aria-labelledby="queue-title">
          <div className="card-title">
            <h2 id="queue-title">{t('practice.review.title')}</h2>
            <span className="status" data-quiet={due === 0}>{t('practice.review.due', { n: due })}</span>
          </div>
          <p className="muted">{cards.length === 0 ? t('practice.review.empty') : due === 0 && later ? tCount('practice.review.later', cards.length) : tCount('practice.review.blurb', cards.length)}</p>
          <div className="practice-actions">
            {due > 0 ? (
              <a className="btn btn-primary" href={href(`/practice/${gameId}/review`)}>
                <Icon name="play" size={18} />
                {t('practice.review.start')}
              </a>
            ) : null}
          </div>
        </section>
        {pack.sets.map((set) => {
          const count = pack.problems.filter((p) => inSet(p, set)).length;
          return (
            <section key={set.id} className="card practice-card" aria-labelledby={`set-${set.id}`}>
              <div className="card-title">
                <h2 id={`set-${set.id}`}>{tDynamic(`practice.set.${set.id}`)}</h2>
                <span className="faint num">{t('practice.count', { n: count })}</span>
              </div>
              <p className="muted">{tDynamic(`practice.set.${set.id}.blurb`)}</p>
              <div className="practice-actions">
                <a className="btn btn-primary" href={href(`/practice/${gameId}/${set.id}`)}>
                  <Icon name="play" size={18} />
                  {t('practice.start')}
                </a>
                {(set.chips ?? []).map((theme) => (
                  <a key={theme} className="chip" href={href(`/practice/${gameId}/${set.id}?theme=${theme}`)}>
                    {tDynamic(`theme.${theme}`)}
                  </a>
                ))}
              </div>
            </section>
          );
        })}
        {pack.drills.map((drill) => (
          <section key={drill.id} className="card practice-card" aria-labelledby={`drill-${drill.id}`}>
            <div className="card-title">
              <h2 id={`drill-${drill.id}`}>{tDynamic(`practice.set.${drill.id}`)}</h2>
              <span className="faint">{t('practice.generated')}</span>
            </div>
            <p className="muted">{tDynamic(`practice.set.${drill.id}.blurb`)}</p>
            <div className="practice-actions">
              <a className="btn btn-primary" href={href(`/practice/${gameId}/${drill.id}`)}>
                <Icon name="play" size={18} />
                {t('practice.start')}
              </a>
            </div>
          </section>
        ))}
      </div>
      {pack.attribution ? <p className="faint attribution" style={{ marginTop: 'var(--sp-4)' }}>{t(pack.attribution)}</p> : null}
    </Screen>
  );
}
