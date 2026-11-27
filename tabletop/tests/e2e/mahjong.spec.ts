/**
 * Mahjong end to end (PLAN.md 2.10, milestone 9): a hand played against level 1 to its end, with
 * the scoring shown and the game reviewed; a call made from the claim prompt; the coach's helps;
 * the reference card.
 */
import { expect, noHorizontalScroll, test } from './fixtures';
import { playToEnd, startMahjong, takeTurn } from './mahjong-helpers';

test.describe('mahjong', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a hand against level 2 to the end, shows the scoring, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startMahjong(page, { seed: 'e2e-17', level: 2, oneHand: true });
    await expect(page.locator('button.mj-tile').first()).toBeVisible();
    await noHorizontalScroll(page);
    await playToEnd(page);
    await expect(page.locator('.status-turn')).toHaveText(/Game over/);
    // The hand's result: who won and the faan line by line, or the drawn hand; and the payments.
    const result = page.locator('.mj-result');
    await expect(result).toBeVisible();
    await expect(result).toContainText(/won|drawn hand/);
    await expect(result.locator('.mj-pay')).toContainText('You');
    await expect(page.locator('.result-card h2')).toBeVisible();
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await expect(page.locator('.accuracy')).toContainText('You:');
    await noHorizontalScroll(page);
  });

  test('a call: the prompt says what each call takes, and a chow is laid down', async ({ page }) => {
    test.setTimeout(240_000);
    await startMahjong(page, { seed: 'e2e-5', level: 2, oneHand: true });
    const prompt = page.locator('.mj-prompt');
    for (let i = 0; i < 40 && !(await prompt.isVisible()); i++) {
      await expect(page.locator('.status-turn')).toHaveText(/Your move|Game over/, { timeout: 45_000 });
      if (await prompt.isVisible()) break;
      await takeTurn(page);
    }
    await expect(prompt).toBeVisible();
    await expect(prompt).toContainText('discarded');
    const chow = prompt.locator('.mj-call[data-call="chow"]').first();
    await expect(chow.locator('.mj-call-tile')).toHaveCount(3);
    await expect(prompt.locator('.mj-call[data-call="pass"]')).toBeVisible();
    await chow.click();
    // The run is laid down beside your hand, and you must now discard.
    await expect(page.locator('.mj-centre-tip')).toHaveText(/Now discard a tile/, { timeout: 15_000 });
  });

  test('the coach: learner tiles, tiles from ready, tiles not seen and safe tiles', async ({ page }) => {
    test.setTimeout(180_000);
    await startMahjong(page, { seed: 'e2e-coach', level: 2 });
    await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 45_000 });
    // Learner tiles are on by default: every tile in your hand carries its number and suit letter.
    await expect(page.getByRole('switch', { name: 'Learner tiles (numbers and letters)' })).toHaveAttribute('aria-checked', 'true');
    await page.getByRole('switch', { name: 'Tiles from ready and useful tiles' }).click();
    await expect(page.locator('.mj-eff')).toBeVisible();
    await expect(page.locator('button.mj-tile[data-tone="hint"]').first()).toBeVisible();
    await expect(page.locator('.mj-note').first()).toBeVisible();
    await page.getByRole('switch', { name: 'Tiles you have not seen' }).click();
    await expect(page.locator('.mj-unseen-cell')).toHaveCount(34);
    await page.getByRole('switch', { name: 'Safe tiles against each player' }).click();
    await expect(page.locator('.mj-safety-tile').first()).toBeVisible();
    await page.getByRole('button', { name: 'Hint' }).click();
    await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 15_000 });
  });

  test('the reference card', async ({ page }) => {
    await page.goto('/#/games/mahjong/reference');
    await expect(page.getByRole('heading', { name: 'The faan table (Hong Kong defaults)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Ask before you sit' })).toBeVisible();
    await expect(page.getByText(/Sik wu/)).toBeVisible();
    await noHorizontalScroll(page);
  });
});
