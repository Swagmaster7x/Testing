/**
 * Riichi end to end (PLAN.md 2.10, milestone 11): a Riichi hand against level 2 to its end, with
 * the dora indicator in the middle, the result's han and fu (or the drawn hand) and the indicators,
 * then the review; declaring riichi (the switch, the throws it allows, the tile on its side, the
 * seat's mark); the rules dialog with the Riichi options; the reference card's Riichi sections.
 */
import { expect, noHorizontalScroll, test } from './fixtures';
import { playToEnd, startMahjong } from './mahjong-helpers';

test.describe('mahjong: riichi', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a Riichi hand against level 2 to the end, shows han and fu or the drawn hand, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startMahjong(page, { seed: 'e2e-riichi', level: 2, preset: /^Riichi, one hand/ });
    await expect(page.locator('button.mj-tile').first()).toBeVisible({ timeout: 45_000 });
    // The dora indicator lies in the middle of the table.
    await expect(page.locator('.mj-centre-dora')).toContainText('Indicator');
    await expect(page.locator('.mj-centre-dora .mj-mini')).toHaveCount(1);
    await noHorizontalScroll(page);
    await playToEnd(page);
    await expect(page.locator('.status-turn')).toHaveText(/Game over/);
    const result = page.locator('.mj-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText(/won|drawn hand|abortive draw/);
    // A win shows han and fu; any hand shows the indicators, the payments and the final scores.
    if (/won/.test((await result.textContent()) ?? '')) await expect(result.locator('.mj-faan-total').first()).toContainText(/han|Yakuman|Mangan/);
    await expect(result.locator('.mj-result-dora')).toContainText('Indicators');
    await expect(result.locator('.mj-pay')).toContainText('You');
    await expect(result.locator('.mj-final')).toContainText('Final scores');
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await noHorizontalScroll(page);
  });

  test('declaring riichi: the switch leaves only the throws that keep you ready, and the tile lies on its side', async ({ page }) => {
    await page.goto('/#/learn/mahjong.4.riichi-declare');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    const toggle = page.locator('.mj-riichi-toggle');
    await expect(toggle).toHaveText('Riichi');
    await expect(page.locator('button.mj-tile')).toHaveCount(14);
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.mj-centre-tip')).toContainText(/riichi/i);
    // Only the West wind keeps the hand ready: it is the one tile still to be tapped.
    await expect(page.locator('button.mj-tile')).toHaveCount(1);
    const west = page.locator('button.mj-tile[aria-label="West wind"]');
    await west.click();
    await west.click();
    await expect(page.locator('.lesson-feedback')).toContainText('Riichi. The stick is on the table');
    await expect(page.getByRole('img', { name: 'West wind, thrown with riichi' })).toBeVisible();
    await expect(page.locator('.mj-seat[data-where="bottom"] .mj-riichi-mark')).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('the rules dialog offers the Riichi options once a Riichi preset is chosen', async ({ page }) => {
    await page.goto('/#/games/mahjong');
    await page.getByRole('button', { name: /^Play/ }).click();
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('radio', { name: 'Riichi, common online rules' }).click();
    await dialog.getByRole('button', { name: 'Change the rules' }).click();
    await expect(dialog.getByRole('radiogroup', { name: 'Red fives' })).toBeVisible();
    await expect(dialog.getByRole('radiogroup', { name: 'Ura dora' })).toBeVisible();
    // Hong Kong's own options are not offered for a Riichi table.
    await expect(dialog.getByRole('radiogroup', { name: /Flowers/ })).toHaveCount(0);
    await noHorizontalScroll(page);
  });

  test('the reference card has the Riichi yaku, fu and payment table', async ({ page }) => {
    await page.goto('/#/games/mahjong/reference');
    await expect(page.getByRole('heading', { name: 'Riichi yaku (han)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Riichi fu' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Riichi payments' })).toBeVisible();
    await expect(page.getByText(/1000, 2000, 3900, 7700/)).toBeVisible();
    await noHorizontalScroll(page);
  });
});
