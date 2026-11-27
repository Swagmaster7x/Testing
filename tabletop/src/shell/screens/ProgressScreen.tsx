import { GameGlyph } from '../components/GameGlyph';
import { SHELF } from '../../games/catalog';
import type { MessageKey } from '../../text';
import { gameName, t } from '../../text';
import { Screen } from './common';

const READY: readonly MessageKey[] = ['ready.setup', 'ready.terms', 'ready.score', 'ready.etiquette', 'ready.beat'];

/** Skills, ratings and the table-ready checklist per game. No streaks, ever. */
export function ProgressScreen() {
  const none = t('common.none');
  return (
    <Screen label={t('progress.title')}>
      <header className="screen-head">
        <h1>{t('progress.title')}</h1>
        <p>{t('progress.intro')}</p>
      </header>
      <div className="grid-2" style={{ gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1fr)' }}>
        <section className="card" aria-label={t('progress.title')}>
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
              {SHELF.map((game) => (
                <tr key={game.id}>
                  <td>
                    <span className="progress-game">
                      <GameGlyph gameId={game.id} />
                      {gameName(game.id)}
                    </span>
                  </td>
                  <td className="num">{none}</td>
                  <td className="num">{none}</td>
                  <td className="num">{none}</td>
                  <td className="num">{t('progress.ready.count', { done: 0, total: READY.length })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="card" aria-labelledby="ready-title">
          <div className="card-title">
            <h2 id="ready-title">{t('progress.checklist')}</h2>
          </div>
          <p className="empty-note" style={{ marginBottom: 'var(--sp-3)' }}>
            {t('progress.checklist.intro')}
          </p>
          <ul className="checklist">
            {READY.map((key) => (
              <li key={key}>
                <span className="check-box" aria-hidden="true" />
                {t(key)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
