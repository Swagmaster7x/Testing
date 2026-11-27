/** Playable games, loaded only when first opened. */
import type { AnyGameUi } from './types';

const loaders: Record<string, () => Promise<AnyGameUi>> = {
  noughts: () => import('./noughts/ui').then((m) => m.noughtsUi as unknown as AnyGameUi),
  chess: () => import('./chess/ui').then((m) => m.chessUi as unknown as AnyGameUi),
  brisca: () => import('./brisca/ui').then((m) => m.briscaUi as unknown as AnyGameUi),
  dominoes: () => import('./dominoes/ui').then((m) => m.dominoesUi as unknown as AnyGameUi),
  shogi: () => import('./shogi/ui').then((m) => m.shogiUi as unknown as AnyGameUi),
  go: () => import('./go/ui').then((m) => m.goUi as unknown as AnyGameUi),
  poker: () => import('./holdem/ui').then((m) => m.holdemUi as unknown as AnyGameUi),
  'chinese-checkers': () => import('./chinese-checkers/ui').then((m) => m.ccUi as unknown as AnyGameUi),
  mahjong: () => import('./mahjong/ui').then((m) => m.mahjongUi as unknown as AnyGameUi),
  blackjack: () => import('./blackjack/ui').then((m) => m.blackjackUi as unknown as AnyGameUi),
  hearts: () => import('./hearts/ui').then((m) => m.heartsUi as unknown as AnyGameUi),
  spades: () => import('./spades/ui').then((m) => m.spadesUi as unknown as AnyGameUi),
  'gin-rummy': () => import('./gin-rummy/ui').then((m) => m.ginUi as unknown as AnyGameUi),
};

export function isPlayable(gameId: string): boolean {
  return Object.prototype.hasOwnProperty.call(loaders, gameId);
}

const cache = new Map<string, Promise<AnyGameUi>>();

export function loadGameUi(gameId: string): Promise<AnyGameUi> {
  const load = loaders[gameId];
  if (!load) return Promise.reject(new Error(`"${gameId}" is not playable yet`));
  let pending = cache.get(gameId);
  if (!pending) {
    pending = load();
    cache.set(gameId, pending);
  }
  return pending;
}
