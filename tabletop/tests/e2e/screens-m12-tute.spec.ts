/** Milestone 12 screenshots: Tute, at 844 × 390 (twice the pixels), then the table at the tablet and laptop sizes. */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m12-tute';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

async function start(page: Page, seed: string, preset: string, level = '1') {
  await page.goto(`/#/games/tute?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: level, exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Rules at this table' }).getByRole('radio', { name: preset, exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

const yourMove = (page: Page) => expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 60_000 });

/** On your turn: sing or declare when offered, else play the first card you may. */
async function playOne(page: Page) {
  const offer = page.locator('.tute-actions button').first();
  if (await offer.isVisible()) {
    await offer.click();
    return;
  }
  const card = page.locator('button.table-card:not(:has([data-dim="true"]))').first();
  await card.click();
  await card.click();
}

test('milestone 12 screens: tute', async ({ page }) => {
  test.setTimeout(900_000);

  await page.goto('/#/games');
  await shot(page, '01-shelf');
  await page.goto('/#/games/tute?seed=shots');
  await shot(page, '02-hub');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Change the rules' }).click();
  await shot(page, '03-rules-at-this-table');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Four players: the start, a trick in progress, a card refused.
  await start(page, 'shots-four', 'Spain, in pairs');
  await yourMove(page);
  await shot(page, '04-four-start');
  for (let i = 0; i < 10; i++) {
    await yourMove(page);
    const dim = page.locator('button.table-card:has([data-dim="true"])').first();
    if ((await page.locator('.tute-table .table-card[aria-label*=" played the "]').count()) >= 2 && (await dim.count()) > 0) {
      await shot(page, '05-four-trick-legal-cards');
      await dim.click();
      await expect(page.getByRole('alert')).toBeVisible();
      await shot(page, '06-four-card-refused');
      break;
    }
    await playOne(page);
  }

  // The coach: points, voids and cards seen.
  for (const help of ['Points, trumps and pairs left', 'Who cannot have a suit', 'Cards seen']) await page.getByRole('switch', { name: help }).click();
  await page.waitForTimeout(300);
  await shot(page, '07-four-coach-counts');
  for (const help of ['Points, trumps and pairs left', 'Who cannot have a suit', 'Cards seen']) await page.getByRole('switch', { name: help }).click();

  // Play on with full motion so the end of the hand stays up long enough to catch.
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const over = page.locator('.tute-hand-over');
  for (let i = 0; i < 80; i++) {
    await expect(over.or(page.locator('.status-turn', { hasText: /Your move|Game over/ }))).toBeVisible({ timeout: 60_000 });
    if ((await over.count()) > 0) break;
    if ((await page.locator('.status-turn').textContent())?.includes('Game over')) break;
    if (await page.locator('.status-turn', { hasText: 'Your move' }).isVisible()) await playOne(page);
  }
  if ((await over.count()) > 0) await shot(page, '08-four-hand-over');
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // Two players with a stock.
  await start(page, 'shots-two', 'Two players (habanero)');
  await yourMove(page);
  for (let i = 0; i < 3; i++) {
    await playOne(page);
    await yourMove(page);
  }
  await shot(page, '09-two-players-stock');

  // Cantes: the lesson that sings las veinte, then las cuarenta by the partner's trick.
  await page.goto('/#/learn/tute.1.sing');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '10-lesson-sing-button');
  await page.getByRole('button', { name: 'Sing the 20 in copas' }).click();
  await shot(page, '11-lesson-sung');
  await page.goto('/#/learn/tute.1.trump');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '12-lesson-overtrump');
  await page.goto('/#/learn/tute.2.finish');
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '13-lesson-finish-open-hands');
  await page.goto('/#/games/tute/learn');
  await shot(page, '14-learn-door');

  // Drills.
  await page.goto('/#/practice/tute/drill-tute-play?seed=shots');
  await shot(page, '15-drill-which-cards');
  await page.goto('/#/practice/tute/drill-tute-count?seed=shots');
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 15_000 });
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '16-drill-count-the-hand');
  await page.goto('/#/practice/tute/drill-tute-trick?seed=shots');
  await shot(page, '17-drill-who-wins');
  await page.goto('/#/games/tute/practice');
  await shot(page, '18-practice-door');

  // A finished game of one hand against level 1, and its review.
  await page.goto('/#/games/tute?seed=shots-review');
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Rules at this table' }).getByRole('radio', { name: 'Spain, in pairs', exact: true }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radiogroup', { name: 'Games to win' }).getByRole('radio', { name: 'One', exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  for (let i = 0; i < 40; i++) {
    await yourMove(page);
    if ((await page.locator('.status-turn').textContent())?.includes('Game over')) break;
    await playOne(page);
  }
  await shot(page, '19-game-over');
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 180_000 });
  await shot(page, '20-review');
  await page.goto('/#/games/tute/reference');
  await shot(page, '21-reference');

  // The table at the tablet and laptop sizes.
  for (const [width, height, name] of [
    [1180, 820, '22-tablet-table'],
    [1440, 900, '23-laptop-table'],
  ] as const) {
    await page.setViewportSize({ width, height });
    await start(page, `shots-${name}`, 'Spain, in pairs');
    await yourMove(page);
    await playOne(page);
    await yourMove(page);
    await shot(page, name);
  }
});
