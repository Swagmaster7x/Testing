/**
 * Shared end-to-end setup. Every test fails if the page logs an error or asks for anything
 * outside the app itself: the app makes no network requests while running (PLAN.md 1.6).
 */
import type { Page } from '@playwright/test';
import { expect, test as base } from '@playwright/test';

export const test = base.extend<{ guard: void }>({
  guard: [
    async ({ page, baseURL }, use) => {
      const problems: string[] = [];
      page.on('pageerror', (err) => problems.push(`page error: ${err.message}`));
      page.on('console', (msg) => {
        if (msg.type() === 'error') problems.push(`console error: ${msg.text()}`);
      });
      page.on('request', (req) => {
        const url = req.url();
        if (!url.startsWith(baseURL ?? '') && !url.startsWith('data:') && !url.startsWith('blob:')) problems.push(`outside request: ${url}`);
      });
      await use();
      expect(problems, problems.join('\n')).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

export async function noHorizontalScroll(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'the page scrolls sideways').toBeLessThanOrEqual(0);
}

/** Opens the test table's hub and starts a game with a fixed seed. */
export async function startFixtureGame(page: Page, options: { seed: string; level: 1 | 2 | 3; side: 'X, moves first' | 'O' | 'Either' }): Promise<void> {
  await page.goto(`/#/games/noughts?seed=${options.seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: String(options.level), exact: true }).click();
  await dialog.getByRole('radio', { name: options.side, exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

const ORDER = ['b2', 'a3', 'c1', 'c3', 'a1', 'b3', 'b1', 'a2', 'c2'];

/** Squares as the board labels them: "b2, X", "a3, empty". */
export async function boardText(page: Page): Promise<string[]> {
  const labels = await page.getByRole('group', { name: 'Noughts and crosses board' }).getByRole('button').evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
  return labels;
}

/** Plays the person's moves in a fixed order of preference until the game ends. */
export async function playToEnd(page: Page): Promise<number> {
  let moves = 0;
  for (let guard = 0; guard < 10; guard++) {
    const turn = page.locator('.status-turn');
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 15_000 });
    if ((await turn.textContent())?.includes('Game over')) return moves;
    for (const square of ORDER) {
      const cell = page.getByRole('button', { name: `${square}, empty`, exact: true });
      if ((await cell.count()) === 1 && (await cell.getAttribute('aria-disabled')) === 'false') {
        await cell.click();
        moves++;
        break;
      }
    }
    await expect(turn).not.toHaveText('Your move', { timeout: 5_000 }).catch(() => undefined);
  }
  throw new Error('The game did not end');
}
