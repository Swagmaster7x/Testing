/** Milestone 12 screenshots: Brisca for four in pairs, with señas, at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m12';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

async function startFour(page: Page, seed: string, preset: string) {
  await page.goto(`/#/games/brisca?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '3', exact: true }).click();
  await dialog.getByRole('button', { name: 'Change the rules' }).click();
  await dialog.getByRole('radio', { name: preset, exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** Play the first card offered (tap twice). */
async function playFirst(page: Page) {
  const card = page.locator('.card-table button.table-card').first();
  await card.click();
  await card.click();
}

test('milestone 12 screens: brisca for four', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  // Deal until you hold a high trump, so the Señas button shows.
  const turn = page.locator('.status-turn');
  const signs = page.getByRole('button', { name: 'Señas', exact: true });
  for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']) {
    await startFour(page, `shots-m12-four-${seed}`, 'Four in pairs, with señas');
    await expect(turn).toHaveText(/Your move/, { timeout: 60_000 });
    if (await signs.isVisible()) break;
  }
  await shot(page, '20-brisca-four-table');
  if (await signs.isVisible()) {
    await signs.click();
    await shot(page, '21-brisca-four-senas-tray');
    await page.locator('.brisca-sign-btn').first().click();
    await expect(turn).toHaveText(/Your move/);
  }
  for (let i = 0; i < 4; i++) {
    await playFirst(page);
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 60_000 });
    if (i === 0) await shot(page, '22-brisca-four-trick');
  }
  await shot(page, '23-brisca-four-later');

  // The señas lesson's quiz and the drill: the sign drawn without its name.
  await page.goto('/#/learn/brisca.3.senas');
  for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Next' }).click();
  await page.getByRole('button', { name: 'Señas', exact: true }).click();
  await page.getByRole('button', { name: 'Sign to your partner: the As of trumps' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  await shot(page, '24-brisca-senas-lesson-quiz');
  await page.goto('/#/practice/brisca/drill-senas?seed=shots');
  await expect(page.locator('.lesson-text')).toContainText(/sign/);
  await shot(page, '25-brisca-senas-drill');
});
