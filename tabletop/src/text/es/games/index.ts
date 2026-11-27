/**
 * Spanish for each game, one file per game (src/text/es/games/<game>.ts), the same keys as the
 * English file of the same name (src/text/games/<game>.ts). Add a game by importing its file here.
 */
import type { MessageKey } from '../../en';
import { esBlackjack } from './blackjack';
import { esBrisca } from './brisca';
import { esChineseCheckers } from './chinese-checkers';
import { esClassic } from './classic';
import { esDominoes } from './dominoes';
import { esGinRummy } from './gin-rummy';
import { esGo } from './go';
import { esHearts } from './hearts';
import { esMahjong } from './mahjong';
import { esPoker } from './poker';
import { esShogi } from './shogi';
import { esSpades } from './spades';
import { esTute } from './tute';

export const esGames: Partial<Record<MessageKey, string>> = {
  ...esBrisca,
  ...esChineseCheckers,
  ...esDominoes,
  ...esGo,
  ...esShogi,
  ...esPoker,
  ...esMahjong,
  ...esClassic,
  ...esBlackjack,
  ...esHearts,
  ...esSpades,
  ...esGinRummy,
  ...esTute,
};
