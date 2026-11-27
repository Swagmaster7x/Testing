/**
 * Milestone 13 screenshots: the classic card pack (Blackjack, Hearts, Spades, Gin Rummy) at
 * 844 × 390 (twice the pixels): each game's hub, table, a key moment, the coach, a result, a
 * lesson, practice and a review.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { blackjackMove, ginMove, playFirstCard, playToEnd, startClassic, trickMove, waitTurn } from './m13-helpers';

const DIR = 'screenshots/m13';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

/** Scrolls the coach rail down to the hint and trackers. */
async function showCoach(page: Page, what: string): Promise<void> {
  await page.locator(what).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
}

/** The result, then the review at its first key moment. */
async function resultAndReview(page: Page, game: string, first: number): Promise<void> {
  await expect(page.locator('.result-card h2')).toBeVisible();
  await page.waitForTimeout(400);
  await shot(page, `${String(first).padStart(2, '0')}-${game}-result`);
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 180_000 });
  const moment = page.locator('.moment-list a').first();
  if (await moment.isVisible()) await moment.click();
  await page.waitForTimeout(300);
  await shot(page, `${String(first + 1).padStart(2, '0')}-${game}-review`);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('milestone 13 screens: hearts', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games');
  await page.getByRole('heading', { name: 'Cards' }).scrollIntoViewIfNeeded();
  await shot(page, '00-shelf');
  await page.goto('/#/games/hearts?seed=shots-hearts');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-hearts-hub');
  await startClassic(page, 'hearts', 'shots-hearts', 2, undefined, { group: 'Game to', choice: 'One hand' });
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
  await showCoach(page, '.hint-steps');
  await shot(page, '05-hearts-coach');
  await playToEnd(page, trickMove);
  await resultAndReview(page, 'hearts', 6);
  await page.goto('/#/learn/hearts.1.void');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  await shot(page, '08-hearts-learn');
  await page.goto('/#/practice/hearts/drill-hearts-duck?seed=shots');
  await page.waitForTimeout(400);
  await shot(page, '09-hearts-practice');
});

test('milestone 13 screens: spades', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/spades?seed=shots-spades');
  await shot(page, '11-spades-hub');
  await startClassic(page, 'spades', 'shots-spades', 2, undefined, { group: 'Game to', choice: 'One hand' });
  await expect(page.locator('.bid-panel')).toBeVisible({ timeout: 20_000 });
  await shot(page, '12-spades-bid');
  await page.getByRole('button', { name: 'Bid 3', exact: true }).click();
  await waitTurn(page);
  await shot(page, '13-spades-table');
  await page.getByRole('switch', { name: 'Tricks against the bids' }).click();
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 30_000 });
  await showCoach(page, '.hint-steps');
  await shot(page, '14-spades-coach');
  await playToEnd(page, trickMove);
  await resultAndReview(page, 'spades', 15);
  await page.goto('/#/learn/spades.1.score');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  await shot(page, '17-spades-learn');
  await page.goto('/#/practice/spades/drill-spades-trick?seed=shots');
  await page.waitForTimeout(400);
  await shot(page, '18-spades-practice');
});

test('milestone 13 screens: gin rummy', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/gin-rummy?seed=shots-gin');
  await shot(page, '21-gin-hub');
  await startClassic(page, 'gin-rummy', 'shots-gin', 2, undefined, { group: 'Game to', choice: 'One hand' });
  await waitTurn(page);
  await shot(page, '22-gin-table');
  await page.getByRole('switch', { name: 'Deadwood count' }).click();
  await page.getByRole('switch', { name: 'Cards they picked up' }).click();
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 30_000 });
  await showCoach(page, '.hint-steps');
  await shot(page, '23-gin-coach');
  // The knock, both hands laid out in melds, is the key moment and the result.
  await playToEnd(page, ginMove);
  await resultAndReview(page, 'gin', 24);
  await page.goto('/#/learn/gin-rummy.1.knock');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  await shot(page, '26-gin-learn');
  await page.goto('/#/practice/gin-rummy/drill-gin-discard?seed=shots');
  await page.waitForTimeout(400);
  await shot(page, '27-gin-practice');
});

test('milestone 13 screens: blackjack', async ({ page }) => {
  test.setTimeout(300_000);
  await page.goto('/#/games/blackjack?seed=shots-bj');
  await shot(page, '31-blackjack-hub');
  await startClassic(page, 'blackjack', 'shots-bj', 3, undefined, { group: 'Rounds', choice: '10' });
  await waitTurn(page);
  await shot(page, '32-blackjack-bet');
  await page.locator('.bet-call').click();
  await waitTurn(page);
  await shot(page, '33-blackjack-table');
  await page.getByRole('switch', { name: 'Basic-strategy chart' }).click();
  await page.getByRole('switch', { name: 'Running count' }).click();
  await page.getByRole('switch', { name: 'Expected value of each move' }).click();
  await showCoach(page, '.bj-chart');
  await shot(page, '34-blackjack-coach');
  await playToEnd(page, blackjackMove);
  await resultAndReview(page, 'blackjack', 35);
  // The key moment: a pair split into two hands side by side.
  await page.goto('/#/learn/blackjack.2.split');
  await page.getByRole('button', { name: 'Next' }).click();
  await page.waitForTimeout(400);
  await shot(page, '37-blackjack-learn');
  await page.getByRole('button', { name: 'Split', exact: true }).click();
  await page.waitForTimeout(800);
  await shot(page, '38-blackjack-split');
  await page.goto('/#/practice/blackjack/drill-blackjack-chart?seed=shots');
  await page.waitForTimeout(400);
  await shot(page, '39-blackjack-practice');
});
