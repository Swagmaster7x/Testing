import { GameGlyph } from '../components/GameGlyph';
import { catalogGame, nextUp } from '../../games/catalog';
import { loadGameUi } from '../../games/registry';
import { gameName, t } from '../../text';
import { Icon } from '../components/Icon';
import { longDate } from '../format';
import type { GameProgress } from '../progress-data';
import { gameProgress } from '../progress-data';
import { href, navigate } from '../router';
import { useApp } from '../state';
import { startGame } from '../table/start';
import { useAsync } from '../useAsync';
import { Screen } from './common';

/** How long each part of a session takes, roughly, in minutes. */
const MINUTES = { card: 1, problems: 5, game: 12 } as const;
const MAX_CARDS = 8;
const PROBLEMS = 5;
const MIN_PROBLEMS = 3;
const MIN_MINUTES = 10;
const MAX_MINUTES = 20;

interface SessionItem {
  readonly key: string;
  readonly icon: 'review' | 'learn' | 'practice' | 'play';
  readonly title: string;
  readonly detail: string;
  readonly minutes: number;
  readonly href?: string;
  readonly onStart?: () => void;
}

/** The fixed parts for one game: due reviews, then one lesson (or one game once the lessons are done). */
function coreItems(p: GameProgress, profileId: string): SessionItem[] {
  const name = gameName(p.gameId);
  const items: SessionItem[] = [];
  if (p.due > 0) {
    const cards = Math.min(p.due, MAX_CARDS);
    items.push({ key: `${p.gameId}-review`, icon: 'review', title: t('today.item.review', { game: name }), detail: t('today.item.review.detail', { n: p.due }), minutes: cards * MINUTES.card, href: `/practice/${p.gameId}/review` });
  }
  if (p.nextLesson) {
    items.push({ key: `${p.gameId}-lesson`, icon: 'learn', title: t('today.item.lesson', { game: name }), detail: p.nextLesson.title, minutes: p.nextLesson.minutes, href: `/learn/${p.nextLesson.id}` });
  } else {
    items.push({
      key: `${p.gameId}-game`,
      icon: 'play',
      title: t('today.item.game', { game: name }),
      detail: t('today.item.game.detail', { n: p.suggested }),
      minutes: MINUTES.game,
      onStart: () => {
        void (async () => {
          const ui = await loadGameUi(p.gameId);
          const id = await startGame(ui, profileId, { level: p.suggested, side: 'either', clock: null });
          navigate(`/play/${id}`);
        })();
      },
    });
  }
  return items;
}

function problemsItem(p: GameProgress, count: number): SessionItem {
  return { key: `${p.gameId}-problems`, icon: 'practice', title: t('today.item.problems', { game: gameName(p.gameId), n: count }), detail: t('today.item.problems.detail', { rating: p.problems.rating }), minutes: count, href: `/practice/${p.gameId}/tactics` };
}

/**
 * A session of ten to twenty minutes (PLAN.md 1.1, point 12): each focus game's due reviews and
 * one lesson or game, then problems to fill the time. Games beyond the budget wait for another day.
 */
export function buildSession(progress: readonly GameProgress[], profileId: string): SessionItem[] {
  const items: SessionItem[] = [];
  const total = () => items.reduce((a, b) => a + b.minutes, 0);
  for (const p of progress) {
    const core = coreItems(p, profileId);
    const minutes = core.reduce((a, b) => a + b.minutes, 0);
    if (items.length > 0 && total() + minutes > MAX_MINUTES) continue;
    items.push(...core);
  }
  for (const p of progress) {
    const room = MAX_MINUTES - total();
    if (room < MIN_PROBLEMS) break;
    const wanted = total() < MIN_MINUTES ? Math.max(PROBLEMS, MIN_MINUTES - total()) : PROBLEMS;
    items.push(problemsItem(p, Math.min(wanted, room)));
    if (total() >= MIN_MINUTES) break;
  }
  return items;
}

/** Today: a short session built from the focus games. Nothing is ever "missed". */
export function TodayScreen() {
  const focus = useApp((s) => s.settings?.focus ?? []);
  const profileId = useApp((s) => s.profile?.id ?? '');
  const next = nextUp();
  const ready = focus.filter((id) => catalogGame(id)?.playable);
  const data = useAsync(async () => {
    return Promise.all(ready.map((id) => gameProgress(id, profileId)));
  }, `${profileId}:${ready.join(',')}`);
  const progress = data.status === 'done' ? data.value : [];
  const items = buildSession(progress, profileId);
  const minutes = items.reduce((a, b) => a + b.minutes, 0);
  return (
    <Screen label={t('today.title')}>
      <header className="screen-head">
        <h1>{t('today.title')}</h1>
        <p className="num">{longDate(new Date())}</p>
      </header>
      <div className="grid-2 today-grid">
        <section className="card" aria-labelledby="today-session">
          <div className="card-title">
            <h2 id="today-session">{t('today.session')}</h2>
            {items.length > 0 ? <span className="faint num">{t('today.minutes', { n: minutes })}</span> : null}
          </div>
          {focus.length === 0 ? (
            <div className="stack">
              <p className="empty-note">{t('today.focus.none')}</p>
              <div>
                <a className="btn btn-primary" href={href('/games')}>
                  {t('today.focus.choose')}
                </a>
              </div>
            </div>
          ) : ready.length === 0 ? (
            <p className="empty-note">{t('today.none-ready', { game: gameName('chess') })}</p>
          ) : data.status !== 'done' ? (
            <p className="empty-note">{t('app.loading')}</p>
          ) : (
            <ol className="session-list">
              {items.map((item) =>
                item.href ? (
                  <li key={item.key}>
                    <a className="session-row" href={href(item.href)}>
                      <SessionRow item={item} />
                    </a>
                  </li>
                ) : (
                  <li key={item.key}>
                    <button type="button" className="session-row" onClick={item.onStart}>
                      <SessionRow item={item} />
                    </button>
                  </li>
                ),
              )}
            </ol>
          )}
          {items.length > 0 ? <p className="faint today-note">{t('today.note')}</p> : null}
        </section>
        <section className="card" aria-labelledby="today-focus">
          <div className="card-title">
            <h2 id="today-focus">{t('today.focus')}</h2>
            {focus.length > 0 ? (
              <a className="btn btn-small btn-quiet" href={href('/games')}>
                {t('today.focus.change')}
              </a>
            ) : null}
          </div>
          {focus.length === 0 ? (
            <p className="empty-note">{next ? t('today.first', { game: gameName(next.id), n: next.milestone }) : null}</p>
          ) : (
            <div className="focus-list">
              {focus.map((id) => {
                const game = catalogGame(id);
                return (
                  <a key={id} className="focus-row" href={href(`/games/${id}`)}>
                    <GameGlyph gameId={id} />
                    <span className="stack" style={{ gap: 0 }}>
                      <span className="name">{gameName(id)}</span>
                      {game && !game.playable ? <span className="status">{t('status.coming-short', { n: game.milestone })}</span> : null}
                    </span>
                  </a>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </Screen>
  );
}

function SessionRow({ item }: { item: SessionItem }) {
  return (
    <>
      <span className="session-icon">
        <Icon name={item.icon} size={20} />
      </span>
      <span className="stack" style={{ gap: 0, minWidth: 0 }}>
        <b>{item.title}</b>
        <span className="faint session-detail">{item.detail}</span>
      </span>
      <span className="faint num session-time">{t('today.item.minutes', { n: item.minutes })}</span>
    </>
  );
}
