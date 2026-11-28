/**
 * Milestone 14b screenshots: Chinese Official and Taiwanese at the table, in Learn and Practice, in
 * the calculator, at 844 × 390 (twice the pixels), then a few tables upright and on a laptop.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { playToEnd, startMahjong } from './mahjong-helpers';

const DIR = 'screenshots/m14b';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

async function addTiles(page: Page, tiles: readonly string[]) {
  const picker = page.getByRole('group', { name: 'Tiles to add' });
  for (const tile of tiles) await picker.getByRole('button', { name: `Add the ${tile}`, exact: true }).click();
}

test('milestone 14b screens: chinese official', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // The play dialog: the presets and their rules.
  await page.goto('/#/games/mahjong?seed=shots-co');
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: 'Chinese Official, sixteen hands' }).click();
  await shot(page, 'co-01-play-presets');
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radiogroup', { name: 'Two concealed kongs' }).scrollIntoViewIfNeeded();
  await shot(page, 'co-02-rules');

  // A hand at the table, then its end.
  await page.keyboard.press('Escape');
  await page.goto('/#/games');
  await startMahjong(page, { seed: 'shots-co', level: 2, preset: /^Chinese Official, one hand/ });
  await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
  await shot(page, 'co-03-table');
  await playToEnd(page, 'efficient');
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, 'co-04-table-result');

  // The lessons.
  await page.goto('/#/learn/mahjong.4.co-changes');
  await next(page);
  await next(page);
  await next(page);
  await shot(page, 'co-05-lesson-minimum');
  await page.getByRole('button', { name: /^No: without the flower/ }).click();
  await shot(page, 'co-06-lesson-minimum-answer');
  await page.goto('/#/learn/mahjong.4.co-patterns');
  await next(page);
  await next(page);
  await shot(page, 'co-07-lesson-patterns');
  await page.goto('/#/learn/mahjong.4.co-knitted');
  await next(page);
  await next(page);
  await shot(page, 'co-08-lesson-knitted');
  await page.goto('/#/learn/mahjong.4.co-settle');
  await next(page);
  await typeNumber(page, 15);
  await next(page);
  await typeNumber(page, 23);
  await next(page);
  await typeNumber(page, 39);
  await next(page);
  await page.locator('.mj-prompt .mj-call[data-call="win"]').click();
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, 'co-09-lesson-settle-sheet');

  // The track in Learn, the drill in Practice.
  await page.goto('/#/games/mahjong/learn');
  await page.getByRole('radio', { name: 'Advanced' }).click();
  await expect(page.locator('.lesson-row').first()).toBeVisible();
  await page.locator('.lesson-row').last().scrollIntoViewIfNeeded();
  await shot(page, 'co-10-learn-track');
  await page.goto('/#/practice/mahjong/drill-mahjong-co-points?seed=shots');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, 'co-11-drill');
  await page.locator('.choice-list button.choice').first().click();
  if (!/Right/.test((await page.locator('.lesson-feedback').textContent()) ?? '')) await page.getByRole('button', { name: 'Show me' }).click();
  await next(page);
  await shot(page, 'co-12-drill-count');

  // The calculator.
  await page.goto('/#/tools/mahjong');
  await page.getByRole('radiogroup', { name: 'Style' }).getByRole('radio', { name: 'Chinese Official' }).click();
  await addTiles(page, ['1 characters', '2 characters', '3 characters', '1 dots', '2 dots', '3 dots', '1 bamboo', '2 bamboo', '3 bamboo', '4 characters', '5 characters', '6 characters', '9 bamboo', '9 bamboo']);
  await expect(page.locator('.calc-total')).toBeVisible();
  await shot(page, 'co-13-calculator');
  await page.locator('.calc-result').scrollIntoViewIfNeeded();
  await shot(page, 'co-14-calculator-result');

  // The reference card.
  await page.goto('/#/games/mahjong/reference');
  await page.getByRole('heading', { name: 'Chinese Official patterns (points)' }).scrollIntoViewIfNeeded();
  await shot(page, 'co-15-reference');

  // The table upright on a phone, and on a laptop.
  for (const [width, height, name] of [
    [390, 844, 'co-16-table-portrait'],
    [1440, 900, 'co-17-table-laptop'],
  ] as const) {
    await page.setViewportSize({ width, height });
    await startMahjong(page, { seed: 'shots-co', level: 2, preset: /^Chinese Official, one round/ });
    await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
    await shot(page, name);
  }
});
