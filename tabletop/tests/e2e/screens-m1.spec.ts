/** Milestone 1 screenshots: Chess at 844 × 390 (twice the pixels), plus a tablet view. */
import type { Page } from '@playwright/test';
import { nodeEngine } from '../harness/stockfish-node';
import { move, playWithEngine, square, startChess } from './chess-helpers';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m1';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 1 screens: chess', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const engine = nodeEngine();
  try {
    await page.goto('/#/games/chess');
    await expect(page.locator('.door')).toHaveCount(4);
    await shot(page, '01-chess-hub');
    await page.getByRole('button', { name: /^Play/ }).click();
    await page.getByRole('dialog').getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '3', exact: true }).click();
    await page.getByRole('dialog').getByRole('radiogroup', { name: 'Clock' }).getByRole('radio', { name: '10 min', exact: true }).click();
    await shot(page, '02-chess-new-game');
    await page.keyboard.press('Escape');

    await startChess(page, { seed: 'shots-open', level: 2 });
    for (const m of ['e2e4', 'g1f3', 'f1c4']) {
      await move(page, m);
      await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 20_000 });
    }
    await square(page, 'b1').click();
    await shot(page, '03-chess-opening-legal-moves');

    await startChess(page, { seed: 'shots-hint', fen: 'r1b1k1nr/pppp1ppp/2n5/2b1p3/2B1P2q/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 1' });
    await page.getByRole('switch', { name: 'Threats' }).click();
    await page.getByRole('switch', { name: 'Evaluation bar' }).click();
    await expect(page.locator('.coach-line')).toContainText('mate', { timeout: 20_000 });
    await page.getByRole('button', { name: 'Hint' }).click();
    await page.getByRole('button', { name: 'Tell me more' }).click();
    await page.getByRole('button', { name: 'Tell me more' }).click();
    await expect(page.locator('.hint-steps li')).toHaveCount(3);
    await shot(page, '04-chess-hint-threats-eval');
    await page.getByRole('switch', { name: 'Threats' }).click();
    await page.getByRole('switch', { name: 'Evaluation bar' }).click();

    await startChess(page, { seed: 'shots-blunder', fen: '4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1' });
    await page.getByRole('switch', { name: 'Blunder warning' }).click();
    await move(page, 'd1d4');
    await expect(page.getByRole('alert')).toBeVisible({ timeout: 20_000 });
    await shot(page, '05-chess-blunder-warning');
    await page.getByRole('alert').getByRole('button', { name: 'Take it back' }).click();
    await page.getByRole('switch', { name: 'Blunder warning' }).click();

    await startChess(page, { seed: 'shots-promo', fen: '8/4P3/8/8/8/8/8/k6K w - - 0 1' });
    await square(page, 'e7').click();
    await square(page, 'e8').click();
    await shot(page, '06-chess-promotion');
    await page.getByRole('button', { name: 'Promote to a queen' }).click();

    await startChess(page, { seed: 'shots-clock', level: 1, clock: '5 min' });
    await move(page, 'd2d4');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 20_000 });
    await shot(page, '07-chess-clock');

    await startChess(page, { seed: 'shots-mate', level: 1 });
    await playWithEngine(page, engine);
    await expect(page.locator('.result-card')).toBeVisible();
    await shot(page, '08-chess-checkmate');
    await page.getByRole('link', { name: 'Review' }).click();
    await page.getByRole('button', { name: 'First position' }).click();
    for (let i = 0; i < 6; i++) await page.getByRole('button', { name: 'Next move' }).click();
    await shot(page, '09-chess-review');

    await page.goto('/#/games/chess/reference');
    await shot(page, '10-chess-reference');

    await page.setViewportSize({ width: 1180, height: 820 });
    await startChess(page, { seed: 'shots-tablet', level: 4 });
    await move(page, 'e2e4');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 20_000 });
    await shot(page, '11-chess-tablet');
  } finally {
    engine.terminate();
  }
});
