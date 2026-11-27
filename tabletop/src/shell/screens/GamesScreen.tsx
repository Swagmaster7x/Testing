import { GameGlyph } from '../components/GameGlyph';
import { Icon } from '../components/Icon';
import { GROUPS, SHELF, nextUp } from '../../games/catalog';
import { gameName, t, tDynamic } from '../../text';
import { href } from '../router';
import { useApp } from '../state';
import { Screen } from './common';

/** The shelf, grouped as cards, boards and tiles. Unbuilt games show as coming. */
export function GamesScreen() {
  const focus = useApp((s) => s.settings?.focus ?? []);
  const next = nextUp();
  return (
    <Screen label={t('games.title')}>
      <header className="screen-head">
        <h1>{t('games.title')}</h1>
        <p>{t('games.intro')}</p>
      </header>
      <div className="shelf">
        {GROUPS.map((group) => (
          <section key={group} className="shelf-group" aria-labelledby={`group-${group}`}>
            <h2 id={`group-${group}`}>{tDynamic(`group.${group}`)}</h2>
            <div className="shelf-list">
              {SHELF.filter((g) => g.group === group).map((game) => (
                <a key={game.id} className="tile" href={href(`/games/${game.id}`)} aria-label={t('games.open', { game: gameName(game.id) })}>
                  <GameGlyph gameId={game.id} />
                  <span className="tile-text">
                    <span className="tile-name">{gameName(game.id)}</span>
                    {game.playable ? null : (
                      <span className={next?.id === game.id ? 'status' : 'status status-quiet'}>
                        {next?.id === game.id ? t('status.next', { n: game.milestone }) : t('status.coming-short', { n: game.milestone })}
                      </span>
                    )}
                  </span>
                  {focus.includes(game.id) ? (
                    <span className="tile-star" title={t('focus.on')}>
                      <Icon name="star-filled" size={18} title={t('focus.on')} />
                    </span>
                  ) : null}
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Screen>
  );
}
