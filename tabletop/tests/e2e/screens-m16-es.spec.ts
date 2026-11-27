/** Milestone 16 screenshots: the interface in Spanish, at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m16';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 16 screens: Spanish', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/settings');
  await page.getByRole('radio', { name: 'Español' }).click();
  await expect(page.getByRole('heading', { name: 'Ajustes', level: 1 })).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await shot(page, '20-es-settings');
  await page.goto('/#/today');
  await shot(page, '21-es-today');
  await page.goto('/#/games/dominoes');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '22-es-hub');
  await page.goto('/#/games/dominoes/learn');
  await shot(page, '23-es-learn');
  await page.goto('/#/progress');
  await shot(page, '24-es-progress');
  await page.goto('/#/games/brisca?seed=es');
  await page.getByRole('button', { name: /^Jugar/ }).click();
  await shot(page, '25-es-new-game');
  await page.getByRole('dialog').getByRole('button', { name: /^(Empezar|Partida nueva)$/ }).click();
  await expect(page.locator('.status-turn')).toHaveText(/Te toca/, { timeout: 60_000 });
  await shot(page, '26-es-table');
});
