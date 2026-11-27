/**
 * Interface text for each game, one file per game (src/text/games/<game>.ts), merged into the
 * catalogue. Keep keys prefixed with the game id ("go.", "ref.go.", ...) so files never clash.
 * Add a game by importing its file here and spreading it into `enGames`.
 */
import { enBlackjack } from './blackjack';
import { enBrisca } from './brisca';
import { enClassic } from './classic';
import { enGinRummy } from './gin-rummy';
import { enHearts } from './hearts';
import { enSpades } from './spades';
import { enChineseCheckers } from './chinese-checkers';
import { enDominoes } from './dominoes';
import { enGo } from './go';
import { enMahjong } from './mahjong';
import { enPoker } from './poker';
import { enShogi } from './shogi';
import { enTute } from './tute';

export const enGames = { ...enBrisca, ...enChineseCheckers, ...enDominoes, ...enGo, ...enShogi, ...enPoker, ...enMahjong, ...enClassic, ...enBlackjack, ...enHearts, ...enSpades, ...enGinRummy, ...enTute } as const;
