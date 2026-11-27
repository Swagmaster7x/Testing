/** Milestone 3 screenshots: Brisca at 844 × 390 (twice the pixels). */
import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const DIR = 'screenshots/m3';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });

async function tapCard(page: Page, name: string) {
  const card = page.getByRole('button', { name });
  await card.click();
  await card.click();
}

test('milestone 3 screens: brisca', async ({ page }) => {
  test.setTimeout(300_000);
  await page.emulateMedia({ reducedMotion: 'reduce' });

  await page.goto('/#/games/brisca?seed=shots-m3');
  await expect(page.locator('.door')).toHaveCount(4);
  await shot(page, '01-brisca-hub');
  await page.getByRole('button', { name: /^Play/ }).click();
  await page.getByRole('dialog').getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '3', exact: true }).click();
  await page.getByRole('button', { name: 'Change the rules' }).click();
  await shot(page, '02-brisca-rules-at-this-table');
  await page.getByRole('dialog').getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
  await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 20_000 });
  await shot(page, '03-brisca-table');
  const first = page.locator('button.table-card').first();
  await first.click();
  await shot(page, '04-brisca-card-lifted');
  await first.click();
  await expect(page.locator('.status-turn')).toHaveText(/Your move/, { timeout: 20_000 });
  await page.getByRole('switch', { name: 'Points and trumps left' }).click();
  await page.getByRole('switch', { name: 'Cards seen' }).click();
  await page.getByRole('switch', { name: 'What beats this' }).click();
  await page.getByRole('button', { name: 'Hint' }).click();
  await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 20_000 });
  await page.getByRole('button', { name: 'Tell me more' }).click();
  await shot(page, '05-brisca-coach');

  await page.goto('/#/games/brisca/learn');
  await page.getByRole('radio', { name: 'Rules' }).click();
  await shot(page, '06-brisca-learn');
  await page.goto('/#/learn/brisca.0.trick');
  await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled({ timeout: 15_000 });
  await shot(page, '07-brisca-lesson-show');
  await page.goto('/#/learn/brisca.2.take');
  await page.getByRole('button', { name: 'Next' }).click();
  await tapCard(page, 'Tres de oros');
  await expect(page.locator('.lesson-feedback')).toContainText('The Tres takes the Rey');
  await shot(page, '08-brisca-lesson-strategy');

  await page.goto('/#/games/brisca/practice');
  await shot(page, '09-brisca-practice');
  await page.goto('/#/practice/brisca/drill-trumps?seed=shots');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '10-brisca-drill-trumps');
  await page.goto('/#/practice/brisca/endgames');
  await expect(page.getByText('Your turn. Find the best play.')).toBeVisible({ timeout: 15_000 });
  await shot(page, '11-brisca-endgame-problem');

  await page.goto('/#/games/brisca/reference');
  await shot(page, '12-brisca-reference');
});
