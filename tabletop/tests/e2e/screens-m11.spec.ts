/** Milestone 11 screenshots: Riichi at the table, in Learn and Practice, at 844 × 390 (twice the pixels), then the table upright and on a laptop. */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { playToEnd, startMahjong } from './mahjong-helpers';

const DIR = 'screenshots/m11';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const next = (page: Page) => page.getByRole('button', { name: 'Next' }).click();

async function throwTile(page: Page, name: string) {
  const tile = page.locator(`button.mj-tile[aria-label="${name}"]`).last();
  await tile.click();
  await tile.click();
}

async function typeNumber(page: Page, n: number) {
  for (const d of String(n)) await page.getByRole('button', { name: d, exact: true }).click();
  await page.getByRole('button', { name: 'Check', exact: true }).click();
}

test('milestone 11 screens: riichi', async ({ page }) => {
  test.setTimeout(600_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  // The play dialog: the Riichi presets and their rules.
  await page.goto('/#/games/mahjong?seed=shots-riichi');
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radio', { name: 'Riichi, common online rules' }).click();
  await shot(page, '01-play-riichi-presets');
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await expect(dialog.getByRole('radiogroup', { name: 'Red fives' })).toBeVisible();
  await dialog.getByRole('radiogroup', { name: 'Open tanyao (all simples after a call)' }).scrollIntoViewIfNeeded();
  await shot(page, '02-rules-riichi');

  // A Riichi hand: the indicator in the middle, then the end of the hand.
  await page.keyboard.press('Escape');
  await page.goto('/#/games');
  await startMahjong(page, { seed: 'shots-riichi', level: 2, preset: /^Riichi, one hand/ });
  await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
  await shot(page, '03-table-riichi');
  await playToEnd(page);
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, '04-table-riichi-result');

  // Declaring riichi in the lesson: the switch, the throw on its side, the count, the sheet.
  await page.goto('/#/learn/mahjong.4.riichi-declare');
  await next(page);
  await next(page);
  await page.locator('.mj-riichi-toggle').click();
  await expect(page.locator('button.mj-tile')).toHaveCount(1);
  await shot(page, '05-riichi-switch');
  await throwTile(page, 'West wind');
  await expect(page.locator('.lesson-feedback')).toContainText('Riichi. The stick is on the table');
  await shot(page, '06-riichi-declared');
  await next(page);
  await typeNumber(page, 5);
  await expect(page.locator('.lesson-feedback')).toContainText('mangan');
  await shot(page, '07-riichi-han');
  await next(page);
  await page.getByRole('button', { name: /^Tsumo/ }).click();
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, '08-riichi-tsumo-sheet');

  // Furiten, dora, the payment table, defence.
  await page.goto('/#/learn/mahjong.4.riichi-furiten');
  await next(page);
  await shot(page, '09-lesson-furiten');
  await page.goto('/#/learn/mahjong.4.riichi-dora');
  await next(page);
  await next(page);
  await shot(page, '10-lesson-dora');
  await page.goto('/#/learn/mahjong.4.riichi-scoring');
  await next(page);
  await next(page);
  await next(page);
  await expect(page.getByRole('button', { name: 'Check', exact: true })).toBeVisible();
  await shot(page, '11-lesson-fu');
  await typeNumber(page, 40);
  await next(page);
  await typeNumber(page, 1300);
  await next(page);
  await expect(page.locator('.mj-prompt')).toBeVisible();
  await shot(page, '11b-lesson-ron-prompt');
  await page.goto('/#/learn/mahjong.4.riichi-defence');
  await next(page);
  await next(page);
  await page.getByRole('button', { name: '1 bamboo' }).click();
  await next(page);
  await throwTile(page, '5 dots');
  await expect(page.locator('.lesson-feedback')).toContainText('most dangerous');
  await shot(page, '12-lesson-defence-wrong');

  // The Riichi track in Learn.
  await page.goto('/#/games/mahjong/learn');
  await page.getByRole('radio', { name: 'Advanced' }).click();
  await expect(page.locator('.lesson-row').first()).toBeVisible();
  await shot(page, '13-learn-riichi-track');

  // Practice: the Riichi drills.
  await page.goto('/#/games/mahjong/practice');
  await expect(page.locator('.practice-card').first()).toBeVisible();
  await page.locator('.practice-grid').evaluate((el) => el.scrollIntoView({ block: 'end' }));
  await shot(page, '14-practice-riichi-drills');
  for (const [id, name] of [
    ['drill-mahjong-yaku', '15-drill-yaku'],
    ['drill-mahjong-han-fu', '16-drill-han-fu'],
    ['drill-mahjong-riichi-safe', '17-drill-riichi-safe'],
  ] as const) {
    await page.goto(`/#/practice/mahjong/${id}?seed=shots`);
    await expect(page.locator('.lesson-text')).toBeVisible();
    await shot(page, name);
  }

  // The reference card's Riichi sections.
  await page.goto('/#/games/mahjong/reference');
  await page.getByRole('heading', { name: 'Riichi yaku (han)' }).scrollIntoViewIfNeeded();
  await shot(page, '18-reference-yaku');
  await page.getByRole('heading', { name: 'Riichi payments' }).scrollIntoViewIfNeeded();
  await shot(page, '19-reference-payments');

  // The table upright on a phone, and on a laptop.
  for (const [width, height, name] of [
    [390, 844, '20-table-portrait'],
    [1440, 900, '21-table-laptop'],
  ] as const) {
    await page.setViewportSize({ width, height });
    await startMahjong(page, { seed: 'shots-riichi', level: 2, preset: /^Riichi, common online/ });
    await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
    await shot(page, name);
  }
});
