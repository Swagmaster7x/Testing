import { catalogGame } from '../../games/catalog';
import { loadGameUi } from '../../games/registry';
import { gameName, t } from '../../text';
import { useAsync } from '../useAsync';
import { BackLink, Screen } from './common';

/** One page per game: rules, values, terms, presets and the "ask before you sit" card. */
export function ReferenceScreen({ gameId }: { gameId: string }) {
  const game = catalogGame(gameId);
  const ui = useAsync(() => (game?.playable ? loadGameUi(gameId) : Promise.resolve(null)), gameId);
  const name = gameName(gameId);
  return (
    <Screen label={`${t('ref.title')}: ${name}`}>
      <BackLink to={`/games/${gameId}`} label={name} />
      <header className="screen-head">
        <h1>{t('ref.title')}</h1>
        <p>{name}</p>
      </header>
      {ui.status === 'done' && ui.value ? (
        <div className="reference">
          {ui.value.reference().map((section) => (
            <section key={section.title} className="card">
              <div className="card-title">
                <h2>{t(section.title)}</h2>
              </div>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      ) : ui.status === 'loading' ? null : (
        <section className="card" style={{ maxWidth: 560 }}>
          <p className="muted">{t('ref.coming')}</p>
          {game ? <p className="faint" style={{ marginTop: 'var(--sp-2)' }}>{t('status.coming-in', { n: game.milestone })}</p> : null}
        </section>
      )}
    </Screen>
  );
}
