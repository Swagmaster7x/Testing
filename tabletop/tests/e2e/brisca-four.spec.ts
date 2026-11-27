/**
 * Brisca for four in pairs end to end (milestone 12): a whole hand with señas against level 1;
 * the señas lesson; the señas drill.
 */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

async function startFour(page: Page, seed: string) {
  await page.goto(`/#/games/brisca?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '1', exact: true }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radio', { name: 'Four in pairs, with señas', exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

test.describe('brisca for four', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a whole hand in pairs, signing when it can, to the end', async ({ page }) => {
    test.setTimeout(180_000);
    await startFour(page, 'e2e-four');
    await expect(page.locator('.brisca-seat-tag')).toHaveCount(3);
    await expect(page.locator('.brisca-seat-tag', { hasText: 'Your partner' })).toBeVisible();
    const turn = page.locator('.status-turn');
    for (let i = 0; i < 30; i++) {
      await expect(turn).toHaveText(/Your move|Game over/, { timeout: 20_000 });
      if ((await turn.textContent())?.includes('Game over')) break;
      const signs = page.getByRole('button', { name: 'Señas', exact: true });
      if (await signs.isVisible()) {
        await signs.click();
        await page.locator('.brisca-sign-btn').first().click();
        await expect(turn).toHaveText(/Your move/);
        continue;
      }
      const card = page.locator('button.table-card').first();
      await card.click();
      await card.click();
    }
    await expect(turn).toHaveText(/Game over/, { timeout: 20_000 });
    await expect(page.locator('.result-card h2')).toHaveText(/win|Draw/);
  });

  test('the señas lesson: make a sign, then read your partner’s', async ({ page }) => {
    await page.goto('/#/learn/brisca.3.senas');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Señas', exact: true }).click();
    await page.getByRole('button', { name: 'Sign to your partner: the As of trumps' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Signed');
    await page.getByRole('button', { name: 'Next' }).click();
    // The sign is drawn without its name.
    await expect(page.locator('.brisca-signed')).toHaveAttribute('aria-label', 'Your partner’s sign');
    await expect(page.locator('.brisca-signed')).not.toContainText('Rey');
    await page.getByRole('button', { name: 'The Rey' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('glance upwards');
  });

  test('the señas drill opens and asks about a sign', async ({ page }) => {
    await page.goto('/#/practice/brisca/drill-senas?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText(/sign/);
    await expect(page.locator('.brisca-seat-tag')).toHaveCount(3);
  });
});
