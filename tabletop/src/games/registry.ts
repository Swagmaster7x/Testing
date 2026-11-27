/** Playable games, loaded only when first opened. */
import type { AnyGameUi } from './types';

const loaders: Record<string, () => Promise<AnyGameUi>> = {
  noughts: () => import('./noughts/ui').then((m) => m.noughtsUi as unknown as AnyGameUi),
  chess: () => import('./chess/ui').then((m) => m.chessUi as unknown as AnyGameUi),
  brisca: () => import('./brisca/ui').then((m) => m.briscaUi as unknown as AnyGameUi),
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
