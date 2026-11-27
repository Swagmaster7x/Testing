/**
 * Interface text for each game, one file per game (src/text/games/<game>.ts), merged into the
 * catalogue. Keep keys prefixed with the game id ("go.", "ref.go.", ...) so files never clash.
 * Add a game by importing its file here and spreading it into `enGames`.
 */
import { enBrisca } from './brisca';
import { enChineseCheckers } from './chinese-checkers';
import { enDominoes } from './dominoes';
import { enGo } from './go';
import { enShogi } from './shogi';

export const enGames = { ...enBrisca, ...enChineseCheckers, ...enDominoes, ...enGo, ...enShogi } as const;
