/** Milestone 9 screenshots: Mahjong (Hong Kong style) at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';
import { playToEnd, startMahjong, takeTurn } from './mahjong-helpers';

const DIR = 'screenshots/m9';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

test('milestone 9 screens: mahjong', async ({ page }) => {
  test.setTimeout(900_000);

  await page.goto('/#/games/mahjong?seed=shots-m9');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-mahjong-hub');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('button', { name: 'Change the rules' }).click();
  await shot(page, '02-mahjong-rules-at-this-table');
  await page.getByRole('radiogroup', { name: 'Faan to points' }).scrollIntoViewIfNeeded();
  await shot(page, '03-mahjong-rules-options');
  await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  // You deal in this one: the table as the hand starts.
  await startMahjong(page, { seed: 'e2e-1', level: 2, oneHand: true });
  const turn = page.locator('.status-turn');
  await expect(turn).toHaveText(/Your move/, { timeout: 45_000 });
  await shot(page, '04-mahjong-table-start');

  // Here the first thing to decide is a call: the prompt says what each call takes.
  await startMahjong(page, { seed: 'e2e-5', level: 2, oneHand: true });
  await expect(turn).toHaveText(/Your move/, { timeout: 45_000 });
  await expect(page.locator('.mj-prompt')).toBeVisible();
  await shot(page, '05-mahjong-claim-prompt');
  await page.locator('.mj-call[data-call="pass"]').click();

  // The efficiency helper with learner tiles: the best discards marked, useful tiles above each.
  for (let i = 0; i < 4; i++) {
    await expect(turn).toHaveText(/Your move/, { timeout: 45_000 });
    if (!(await page.locator('.mj-prompt').isVisible())) break;
    await takeTurn(page);
  }
  await expect(turn).toHaveText(/Your move/, { timeout: 45_000 });
  await page.getByRole('switch', { name: 'Tiles from ready and useful tiles' }).click();
  await expect(page.locator('.mj-note').first()).toBeVisible();
  await page.locator('.mj-eff').scrollIntoViewIfNeeded();
  await shot(page, '06-mahjong-efficiency-learner');
  await page.getByRole('switch', { name: 'Tiles you have not seen' }).click();
  await page.locator('.mj-unseen').scrollIntoViewIfNeeded();
  await shot(page, '07-mahjong-tiles-not-seen');
  await page.getByRole('switch', { name: 'Tiles you have not seen' }).click();
  await page.getByRole('switch', { name: 'Safe tiles against each player' }).click();
  await page.locator('.mj-safety-list').scrollIntoViewIfNeeded();
  await shot(page, '08-mahjong-safe-tiles');
  await page.getByRole('switch', { name: 'Safe tiles against each player' }).click();

  // A won hand, played with the helper's best discards: the faan line by line, the payments.
  await startMahjong(page, { seed: 'win-10', level: 2, oneHand: true });
  await playToEnd(page, 'efficient');
  await expect(page.locator('.mj-result')).toBeVisible();
  await shot(page, '09-mahjong-win-faan');

  // Its review.
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
  await shot(page, '10-mahjong-review');

  // An exhaustive draw: nobody wins before the wall runs out. Throwing every drawn tile away
  // leaves plenty for the review to point out.
  await startMahjong(page, { seed: 'e2e-1', level: 2, oneHand: true });
  await playToEnd(page, 'drawn', 60);
  await expect(page.locator('.mj-result')).toContainText(/drawn hand/);
  await shot(page, '11-mahjong-exhaustive-draw');
  await page.getByRole('link', { name: 'Review' }).click();
  await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
  await page.locator('.moment-list a').first().click();
  await expect(page.locator('.moment-card')).toBeVisible();
  await shot(page, '12-mahjong-review-moment');

  await page.goto('/#/games/mahjong/reference');
  await shot(page, '13-mahjong-reference');
  await page.getByRole('heading', { name: 'The faan table (Hong Kong defaults)' }).scrollIntoViewIfNeeded();
  await shot(page, '14-mahjong-reference-faan');
});
