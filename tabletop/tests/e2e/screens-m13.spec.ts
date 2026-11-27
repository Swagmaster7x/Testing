/**
 * Milestone 13 screenshots: the classic card pack (Blackjack, Hearts, Spades, Gin Rummy) at
 * 844 × 390 (twice the pixels): each game's hub, table, a key moment, the coach, a result, a
 * lesson, practice and a review.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { playFirstCard, startClassic, waitTurn } from './m13-helpers';

const DIR = 'screenshots/m13';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('milestone 13 screens: hearts', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/hearts?seed=shots-hearts');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-hearts-hub');
  await startClassic(page, 'hearts', 'shots-hearts', 2);
  await expect(page.locator('.trick-action')).toBeVisible({ timeout: 20_000 });
  await shot(page, '02-hearts-pass');
  const cards = page.locator('button.table-card');
  for (let i = 0; i < 3; i++) await cards.nth(12 - i).click();
  await shot(page, '03-hearts-pass-chosen');
  await page.getByRole('button', { name: /^Pass / }).click();
  await waitTurn(page);
  await shot(page, '04-hearts-table');
  for (let i = 0; i < 4; i++) {
    if (await waitTurn(page)) break;
    await playFirstCard(page);
  }
  await waitTurn(page);
  await page.getByRole('switch', { name: 'Points taken so far' }).click();
  await page.getByRole('switch', { name: 'Cards played' }).click();
  await page.getByRole('switch', { name: 'Who is void' }).click();
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 30_000 });
  await page.getByRole('button', { name: 'Tell me more' }).click();
  await shot(page, '05-hearts-coach');
});

test('milestone 13 screens: spades', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/spades?seed=shots-spades');
  await shot(page, '11-spades-hub');
  await startClassic(page, 'spades', 'shots-spades', 2);
  await expect(page.locator('.bid-panel')).toBeVisible({ timeout: 20_000 });
  await shot(page, '12-spades-bid');
  await page.getByRole('button', { name: 'Bid 3', exact: true }).click();
  await waitTurn(page);
  await shot(page, '13-spades-table');
  await page.getByRole('switch', { name: 'Tricks against the bids' }).click();
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 30_000 });
  await shot(page, '14-spades-coach');
});

test('milestone 13 screens: gin rummy', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/gin-rummy?seed=shots-gin');
  await shot(page, '21-gin-hub');
  await startClassic(page, 'gin-rummy', 'shots-gin', 2);
  await waitTurn(page);
  await shot(page, '22-gin-table');
  await page.getByRole('switch', { name: 'Deadwood count' }).click();
  await page.getByRole('switch', { name: 'Cards they picked up' }).click();
  await shot(page, '23-gin-coach');
});

test('milestone 13 screens: blackjack', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/blackjack?seed=shots-bj');
  await shot(page, '31-blackjack-hub');
  await startClassic(page, 'blackjack', 'shots-bj', 3);
  await waitTurn(page);
  await shot(page, '32-blackjack-bet');
  await page.locator('.bet-call').click();
  await waitTurn(page);
  await shot(page, '33-blackjack-table');
  await page.getByRole('switch', { name: 'Basic-strategy chart' }).click();
  await page.getByRole('switch', { name: 'Running count' }).click();
  await page.getByRole('switch', { name: 'Expected value of each move' }).click();
  await shot(page, '34-blackjack-coach');
});
