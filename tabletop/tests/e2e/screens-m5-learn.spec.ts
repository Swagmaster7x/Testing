/** Milestone 5 screenshots: Hold'em Learn and Practice at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m5-learn';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const spots = JSON.parse(readFileSync(new URL('../../src/games/holdem/practice/spots.json', import.meta.url), 'utf8')) as { problems: { id: string; line: string[] }[] };

const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

test('milestone 5 screens: hold’em learn and practice', async ({ page }) => {
  test.setTimeout(240_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games/poker');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-hub');

  await page.goto('/#/games/poker/learn');
  await expect(page.locator('.lesson-row').first()).toBeVisible();
  await shot(page, '02-learn-stage-0');
  await page.getByRole('radio', { name: /Table/ }).click();
  await shot(page, '03-learn-table-ready');

  // Stage 0: the first lesson, its show steps and the showdown question.
  await page.goto('/#/learn/poker.0.game');
  await expect(page.locator('.lesson-text')).toContainText('one pack of 52 cards');
  await shot(page, '04-lesson-game-start');
  await next(page);
  await next(page);
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 20_000 });
  await next(page);
  await expect(page.locator('.lesson-text')).toContainText('Only you and Beto are left');
  await shot(page, '05-lesson-game-flop');
  await next(page);
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 20_000 });
  await next(page);
  await expect(page.locator('.lesson-text')).toContainText('Who wins the pot?');
  await shot(page, '06-lesson-game-showdown');

  // A number to work out, with the number pad.
  await page.goto('/#/learn/poker.1.side-pots');
  await next(page);
  await next(page);
  await page.getByRole('button', { name: /^Call/ }).click();
  await expect(page.locator('.lesson-feedback')).toContainText('You call');
  await next(page);
  await expect(page.locator('.lesson-text')).toContainText('main pot');
  await shot(page, '07-lesson-side-pot-number');

  // Cards up: the pot-odds decision, with the bet controls.
  await page.goto('/#/learn/poker.2.pot-odds');
  for (let i = 0; i < 2; i++) await next(page);
  for (const d of '25') await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check' }).click();
  await next(page);
  await next(page);
  await expect(page.locator('.lesson-text')).toContainText('Call or fold?');
  await shot(page, '08-lesson-pot-odds-cards-up');
  await page.getByRole('button', { name: /^Call/ }).click();
  await expect(page.locator('.lesson-feedback')).toContainText('Call. On average');
  await page.waitForTimeout(400);
  await shot(page, '09-lesson-pot-odds-called');

  // A checkpoint with cards up: which hand wins.
  await page.goto('/#/learn/poker.0.ranking');
  await next(page);
  await next(page);
  await shot(page, '10-lesson-ranking-cards-up');

  // Stage 2: all-in or fold, with the sizing tray open.
  await page.goto('/#/learn/poker.3.push-or-fold');
  await next(page);
  await next(page);
  await page.locator('.bet-raise').click();
  await shot(page, '11-lesson-push-tray');

  // Table-ready: the blind clock in a sit-and-go.
  await page.goto('/#/learn/poker.table.blind-clock');
  await next(page);
  await shot(page, '12-lesson-blind-clock');

  // Practice: the door, a problem, and each drill.
  await page.goto('/#/games/poker/practice');
  await expect(page.locator('.practice-card').first()).toBeVisible();
  await shot(page, '13-practice');
  const first = spots.problems[0];
  if (!first) throw new Error('no problems');
  await page.goto(`/#/practice/poker/spots?id=${first.id}`);
  await expect(page.getByText(/Find the best play/)).toBeVisible({ timeout: 15_000 });
  await page.waitForTimeout(500);
  await shot(page, '14-problem');
  await page.getByRole('button', { name: first.line[0] === 'call' ? /^Call/ : /^Fold/ }).click();
  await expect(page.locator('.lesson-feedback')).toContainText('Solved', { timeout: 15_000 });
  await page.waitForTimeout(400);
  await shot(page, '15-problem-solved');

  for (const [i, drill] of ['winner', 'outs', 'odds', 'preflop'].entries()) {
    await page.goto(`/#/practice/poker/drill-poker-${drill}?seed=shots`);
    await expect(page.locator('.lesson-text')).toBeVisible();
    await page.waitForTimeout(300);
    await shot(page, `${16 + i}-drill-${drill}`);
  }
});
