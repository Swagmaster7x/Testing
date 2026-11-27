// Milestone 15, trial 1: Fairy-Stockfish for shogi needs a cross-origin isolated page. The preview
// server sends the headers; a plain static server does not, and then the service worker adds them
// from the second visit. Every other test in the suite runs under the same headers, which is the
// check that every page still works under COEP.
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { canonicalAction, shogi, stateFromSfen } from '../../src/games/shogi/rules';
import { toCanonical } from '../../src/games/shogi/notation';
import { STRONG_NODES } from '../../src/games/shogi/strong';
import { fairyNodeEngine } from '../harness/fairy-node';
import { expect, test } from './fixtures';
import { sfen as boardSfen, startShogi } from './shogi-helpers';

const DIST = join(import.meta.dirname, '../../dist');
const TYPES: Record<string, string> = { '.html': 'text/html', '.js': 'text/javascript', '.wasm': 'application/wasm', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };

/** A static server for the build that sends no isolation headers, as a plain web host would. */
async function plainServer(): Promise<{ url: string; close: () => Promise<void> }> {
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent((req.url ?? '/').split('?')[0] ?? '/')).replace(/^(\.\.[/\\])+/, '');
    readFile(join(DIST, path.endsWith('/') ? `${path}index.html` : path)).then(
      (body) => {
        res.writeHead(200, { 'Content-Type': TYPES[extname(path)] ?? 'text/html' });
        res.end(body);
      },
      () => {
        res.writeHead(404);
        res.end();
      },
    );
  });
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address() as AddressInfo;
  return { url: `http://127.0.0.1:${port}/`, close: () => new Promise((resolve) => server.close(() => resolve())) };
}

const START = 'lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1';

/** Starts the engine host in the page and asks for a move by time, as the trial asks. */
async function askEngine(page: import('@playwright/test').Page, sfen: string): Promise<string[]> {
  return page.evaluate(
    (position) =>
      new Promise<string[]>((resolve) => {
        const worker = new Worker('./engines/fairy-stockfish/host.js');
        const lines: string[] = [];
        worker.onmessage = (event: MessageEvent<string>) => {
          lines.push(event.data);
          if (event.data.startsWith('bestmove') || event.data.startsWith('error')) {
            worker.terminate();
            resolve(lines);
          }
        };
        for (const command of ['usi', 'isready', `position sfen ${position}`, 'go movetime 800']) worker.postMessage(command);
      }),
    sfen,
  );
}

function legalUsi(sfen: string, usi: string): boolean {
  const state = stateFromSfen(sfen);
  const canonical = toCanonical(usi);
  return shogi.legal(state, shogi.turn(state) ?? 0).some((a) => canonicalAction(a) === canonical);
}

test.describe('strong engines: Fairy-Stockfish for shogi', () => {
  test('the page is cross-origin isolated and the engine answers with a legal move', async ({ page }) => {
    test.setTimeout(60_000);
    await page.goto('/');
    expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(true);
    for (const sfen of [START, 'ln1g1g1nl/1r1s1k3/p1pppsbpp/1p3pp2/7P1/2P6/PPBPPPP1P/2S2S1R1/LN1GKG1NL b - 15', '4k4/9/4P4/9/9/9/9/9/4K4 b G 1']) {
      const lines = await askEngine(page, sfen);
      const best = lines.find((l) => l.startsWith('bestmove'))?.split(' ')[1] ?? '';
      expect(lines).toContain('usiok');
      expect(legalUsi(sfen, best), `${best} in ${sfen}`).toBe(true);
    }
  });

  test('level 8 plays at the table on Fairy-Stockfish', async ({ page }) => {
    test.setTimeout(90_000);
    // One search thread and a node budget: the app's move is the one the same build finds in Node.
    const engine = fairyNodeEngine();
    const expected = toCanonical((await engine.search({ fen: START, nodes: STRONG_NODES })).bestmove) ?? '';
    engine.terminate();
    const start = stateFromSfen(START);
    const action = shogi.legal(start, 0).find((a) => canonicalAction(a) === expected);
    if (!action) throw new Error(`no legal ${expected}`);
    const after = shogi.apply(start, action).state.sfen;
    await startShogi(page, { seed: 'e2e-strong', level: 8, side: 'Gote (White)' });
    await expect(page.locator('.moves .mv')).toHaveCount(1, { timeout: 30_000 });
    await expect(page.locator('.status-turn')).toHaveText('Your move');
    expect(await boardSfen(page)).toBe(after);
  });

  test('without isolation the strong level is not offered; the service worker isolates the second visit', async ({ browser }) => {
    test.setTimeout(90_000);
    const plain = await plainServer();
    const context = await browser.newContext();
    try {
      const page = await context.newPage();
      await page.goto(`${plain.url}#/games/shogi`);
      expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(false);
      await page.getByRole('button', { name: /^Play/ }).click();
      const levels = page.getByRole('dialog').getByRole('radiogroup', { name: 'CPU level' });
      await expect(levels.getByRole('radio', { name: '7', exact: true })).toBeVisible();
      await expect(levels.getByRole('radio', { name: '8', exact: true })).toHaveCount(0);
      const refused = await askEngine(page, START);
      expect(refused.at(-1)).toMatch(/^error/);

      // The service worker adds COOP and COEP to everything it serves: the next visit is isolated.
      await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
      });
      await page.reload();
      await expect.poll(() => page.evaluate(() => navigator.serviceWorker.controller !== null)).toBe(true);
      expect(await page.evaluate(() => self.crossOriginIsolated)).toBe(true);
      const lines = await askEngine(page, START);
      expect(legalUsi(START, lines.find((l) => l.startsWith('bestmove'))?.split(' ')[1] ?? '')).toBe(true);
      await page.getByRole('button', { name: /^Play/ }).click();
      await expect(page.getByRole('dialog').getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '8', exact: true })).toBeVisible();
    } finally {
      await context.close();
      await plain.close();
    }
  });
});
