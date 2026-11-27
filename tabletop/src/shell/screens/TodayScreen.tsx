import { GameGlyph } from '../components/GameGlyph';
import { catalogGame, nextUp } from '../../games/catalog';
import { gameName, t } from '../../text';
import { longDate } from '../format';
import { href } from '../router';
import { useApp } from '../state';
import { Screen } from './common';

/** Today: a short session built from the focus games. Nothing is ever "missed". */
export function TodayScreen() {
  const focus = useApp((s) => s.settings?.focus ?? []);
  const next = nextUp();
  return (
    <Screen label={t('today.title')}>
      <header className="screen-head">
        <h1>{t('today.title')}</h1>
        <p className="num">{longDate(new Date())}</p>
      </header>
      <div className="grid-2">
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
            <div className="stack">
              <p className="empty-note">{t('today.focus.none')}</p>
              <div>
                <a className="btn btn-primary" href={href('/games')}>
                  {t('today.focus.choose')}
                </a>
              </div>
            </div>
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
        <section className="card" aria-labelledby="today-session">
          <div className="card-title">
            <h2 id="today-session">{t('today.session')}</h2>
          </div>
          <p className="big-quiet">{t('today.session.empty')}</p>
          <p className="empty-note">{t('today.session.detail')}</p>
          {next ? (
            <p className="empty-note" style={{ marginTop: 'var(--sp-3)' }}>
              {t('today.first')}
            </p>
          ) : null}
        </section>
      </div>
    </Screen>
  );
}
