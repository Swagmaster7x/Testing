/**
 * Hash routing, so every screen, game and review position has a link that tests and
 * bookmarks can use. Routes look like #/games/chess or #/review/<id>/3.
 */
import { useMemo, useSyncExternalStore } from 'react';

export interface Route {
  readonly path: string;
  readonly parts: readonly string[];
  readonly query: URLSearchParams;
}

export const HOME = '/today';

export function parseHash(hash: string): Route {
  const raw = decodeURI(hash.replace(/^#/, ''));
  const [pathPart = '', queryPart = ''] = raw.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  if (parts.length === 0) return { path: HOME, parts: HOME.split('/').filter(Boolean), query: new URLSearchParams(queryPart) };
  return { path: `/${parts.join('/')}`, parts, query: new URLSearchParams(queryPart) };
}

const subscribe = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

const getHash = () => window.location.hash;

export function useRoute(): Route {
  const hash = useSyncExternalStore(subscribe, getHash, () => '');
  return useMemo(() => parseHash(hash), [hash]);
}

export function href(path: string): string {
  return `#${path}`;
}

export function navigate(path: string, options: { replace?: boolean } = {}): void {
  const target = href(path);
  if (options.replace) window.location.replace(target);
  else window.location.hash = path;
}
