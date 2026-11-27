/** Milestone 12 screenshots: Omaha, Five-Card Draw and Seven-Card Stud at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { playOne } from './poker-helpers';

const DIR = 'screenshots/m12';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

async function start(page: Page, seed: string, preset: string, level = '3') {
  await page.goto(`/#/games/poker?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: level, exact: true }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radio', { name: preset, exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

const yourMove = (page: Page) => expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 60_000 });

test('milestone 12 screens: poker variants', async ({ page }) => {
  test.setTimeout(600_000);

  await page.goto('/#/games/poker?seed=shots-m12');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('button', { name: 'Change the rules' }).click();
  await page.getByRole('dialog').getByRole('radio', { name: 'Seven-card stud', exact: true }).click();
  await shot(page, '01-variant-rules');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Omaha: four hole cards, then a flop with the hand named.
  await start(page, 'shots-m12-plo', 'Pot-limit Omaha');
  await yourMove(page);
  await shot(page, '02-omaha-table');
  await page.getByRole('switch', { name: 'Name my hand' }).click();
  for (let i = 0; i < 12; i++) {
    if ((await page.locator('.poker-table .table-card[aria-label]:not([aria-label^="Your card"])').count()) >= 3 && (await page.locator('.poker-reading').count()) > 0) break;
    await playOne(page);
    await yourMove(page);
  }
  await shot(page, '03-omaha-flop');

  // Draw: choosing cards to throw away.
  await start(page, 'shots-m12-draw', 'Five-card draw');
  for (let i = 0; i < 12; i++) {
    await yourMove(page);
    if (await page.locator('.bet-draw').isVisible()) break;
    await playOne(page);
  }
  const mine = page.locator('.poker-table button.table-card');
  if ((await mine.count()) > 0) {
    await mine.nth(3).click();
    await mine.nth(4).click();
  }
  await shot(page, '04-draw-choosing');
  if (await page.locator('.bet-draw').isVisible()) await page.locator('.bet-draw').click();
  await yourMove(page);
  await shot(page, '05-draw-after');

  // Stud: third street, then later streets with cards face up all round.
  await start(page, 'shots-m12-stud', 'Seven-card stud');
  await yourMove(page);
  await shot(page, '06-stud-third-street');
  for (let i = 0; i < 20; i++) {
    if ((await page.locator('.poker-table .table-card[aria-label^="Your card, face up"]').count()) >= 3) break;
    await playOne(page);
    await yourMove(page);
  }
  await shot(page, '07-stud-fifth-street');
  // Full motion, so the end of the hand stays up long enough to catch; call down to a showdown.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const over = page.locator('.poker-hand-over');
  for (let i = 0; i < 60; i++) {
    await expect(over.or(page.locator('.status-turn', { hasText: /Your move|Game over/ }))).toBeVisible({ timeout: 60_000 });
    if ((await over.count()) > 0 && (await page.locator('.poker-hand-name').count()) > 0) break;
    if ((await page.locator('.status-turn').textContent())?.includes('Game over')) break;
    if (await page.locator('.status-turn', { hasText: 'Your move' }).isVisible()) await playOne(page);
  }
  await shot(page, '08-stud-showdown');

  // Omaha high-low.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await start(page, 'shots-m12-hilo', 'Omaha high-low');
  await yourMove(page);
  await shot(page, '09-omaha-high-low');
});
