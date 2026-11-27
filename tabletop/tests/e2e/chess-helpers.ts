import type { Page } from '@playwright/test';
import type { UciEngine } from '../../src/ai/uci';
import { expect } from './fixtures';

export const square = (page: Page, name: string) => page.locator(`svg.grid-board rect.sq-hit[aria-label^="${name},"]`);
export const fen = (page: Page) => page.locator('svg.grid-board').getAttribute('data-position');

export async function startChess(page: Page, options: { seed: string; level?: number; side?: 'White, moves first' | 'Black'; fen?: string; clock?: string }) {
  const fenPart = options.fen ? `&fen=${encodeURIComponent(options.fen)}` : '';
  await page.goto(`/#/games/chess?seed=${options.seed}${fenPart}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(options.level ?? 1), exact: true }).click();
  await dialog.getByRole('radio', { name: options.side ?? 'White, moves first', exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Clock' }).getByRole('radio', { name: options.clock ?? 'None', exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

export async function move(page: Page, uci: string) {
  await square(page, uci.slice(0, 2)).click();
  await square(page, uci.slice(2, 4)).click();
  if (uci.length === 5) {
    const names: Record<string, string> = { q: 'queen', r: 'rook', b: 'bishop', n: 'knight' };
    await page.getByRole('button', { name: `Promote to a ${names[uci[4] ?? 'q']}` }).click();
  }
}

/** Plays the person's side with Stockfish until the game ends or `maxPlies` moves are made. */
export async function playWithEngine(page: Page, engine: UciEngine, options: { maxPlies?: number; nodes?: number } = {}): Promise<void> {
  const turn = page.locator('.status-turn');
  for (let ply = 0; ply < (options.maxPlies ?? 200); ply++) {
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
    if ((await turn.textContent())?.includes('Game over')) return;
    const position = await fen(page);
    if (!position) throw new Error('no position on the board');
    const result = await engine.search({ fen: position, nodes: options.nodes ?? 30_000 });
    await move(page, result.bestmove);
    await expect.poll(() => fen(page)).not.toBe(position);
  }
}
