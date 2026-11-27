/**
 * Interface text for each game, one file per game (src/text/games/<game>.ts), merged into the
 * catalogue. Keep keys prefixed with the game id ("go.", "ref.go.", ...) so files never clash.
 * Add a game by importing its file here and spreading it into `enGames`.
 */
import { enBrisca } from './brisca';

export const enGames = { ...enBrisca } as const;
