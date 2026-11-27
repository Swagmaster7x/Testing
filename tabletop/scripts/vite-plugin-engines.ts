/**
 * Engine files (PLAN.md 2.2, public/engines/): copied from node_modules at build time rather than
 * kept in the repository. In the dev server they are served from node_modules directly.
 * Stockfish's lite single-threaded build ships for chess (about 1.8 MB) and, since M15,
 * Fairy-Stockfish for shogi (about 1.7 MB, a threaded build that needs cross-origin isolation).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Plugin } from 'vite';

export interface EngineFile {
  /** Name under engines/ in the app. */
  readonly name: string;
  /** Path on disk. */
  readonly source: string;
  readonly mime: string;
}

/** `headers` go on every engine file the dev server sends (the isolation headers). */
export function engines(files: readonly EngineFile[], headers: Readonly<Record<string, string>> = {}): Plugin {
  return {
    name: 'tabletop-engines',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0] ?? '';
        const file = files.find((f) => url.endsWith(`/engines/${f.name}`));
        if (!file) {
          next();
          return;
        }
        res.setHeader('Content-Type', file.mime);
        for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
        res.end(readFileSync(file.source));
      });
    },
    generateBundle() {
      for (const file of files) this.emitFile({ type: 'asset', fileName: join('engines', file.name), source: readFileSync(file.source) });
    },
  };
}
