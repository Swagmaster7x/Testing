/**
 * Table tools end to end (milestone 16): scorepads for Dominoes, Brisca and Mahjong, the blind
 * timer, the daylight look and the first-run tour.
 */
import { expect, test } from './fixtures';

test.describe('tools', () => {
  test('a Dominoes scorepad adds hands to a side, names the winner at the target, and takes an entry back', async ({ page }) => {
    await page.goto('/#/tools');
    await page.getByRole('button', { name: 'New Dominoes pad' }).click();
    await expect(page).toHaveURL(/#\/tools\/pad\//);
    await expect(page.getByRole('heading', { name: 'Dominoes', level: 1 })).toBeVisible();
    const points = page.getByLabel('Points', { exact: true });
    await points.fill('150');
    await page.getByRole('button', { name: 'Add to Us' }).click();
    await points.fill('35');
    await page.getByRole('button', { name: 'Add to Them' }).click();
    await expect(page.locator('.pad-total').first()).toContainText('150');
    await points.fill('60');
    await page.getByRole('button', { name: 'Add to Us' }).click();
    await expect(page.locator('.pad-winner')).toContainText('Us win!');
    await page.getByRole('button', { name: 'Take back the last' }).click();
    await expect(page.locator('.pad-winner')).toHaveCount(0);
    // Saved: it is in the list on Tools, and opens again.
    await page.goto('/#/tools');
    await expect(page.locator('.pad-list li')).toHaveCount(1);
    await expect(page.locator('.pad-list')).toContainText('Us 150 · Them 35');
  });

  test('a Brisca pad counts hands from one side’s points; a Mahjong pad moves points on a win', async ({ page }) => {
    await page.goto('/#/tools');
    await page.getByRole('button', { name: 'New Brisca pad' }).click();
    const points = page.getByLabel('Points for Us');
    await points.fill('75');
    await expect(page.locator('.pad-form')).toContainText('Them: 45');
    await page.getByRole('button', { name: 'Add the hand' }).click();
    await expect(page.locator('.pad-history')).toContainText('Us 75 · Them 45: Us take the hand');
    await page.goto('/#/tools');
    await page.getByRole('button', { name: 'New Mahjong pad' }).click();
    await page.getByRole('radiogroup', { name: 'Who won' }).getByRole('radio', { name: 'South' }).click();
    await page.getByRole('radiogroup', { name: 'How' }).getByRole('radio', { name: 'On East’s discard' }).click();
    await page.getByLabel('The discarder pays').fill('8000');
    await page.getByRole('button', { name: 'Add the win' }).click();
    await expect(page.locator('.pad-total').nth(0)).toContainText('17,000');
    await expect(page.locator('.pad-total').nth(1)).toContainText('33,000');
  });

  test('the blind timer starts, pauses and moves between levels', async ({ page }) => {
    await page.goto('/#/tools/timer');
    await expect(page.locator('.timer-level')).toHaveText('Level 1');
    await expect(page.locator('.timer-blinds')).toHaveText('1/2');
    await expect(page.locator('.timer-clock')).toHaveText('15:00');
    await page.getByRole('button', { name: 'Start' }).click();
    await expect(page.locator('.timer-clock')).not.toHaveText('15:00', { timeout: 5_000 });
    await page.getByRole('button', { name: 'Pause' }).click();
    await page.getByRole('button', { name: 'Next level' }).click();
    await expect(page.locator('.timer-level')).toHaveText('Level 2');
    await expect(page.locator('.timer-blinds')).toHaveText('2/4');
    await expect(page.locator('.timer-clock')).toHaveText('15:00');
    // Kept on the device: a reload finds it where it was.
    await page.reload();
    await expect(page.locator('.timer-level')).toHaveText('Level 2');
    await expect(page.getByRole('button', { name: 'Resume' })).toBeVisible();
  });

  test('the daylight look, and the tour on Today', async ({ page }) => {
    await page.goto('/#/today');
    await expect(page.locator('.tour-card')).toContainText('Welcome to Kibitz');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('.tour-card')).toContainText('Every game has four doors');
    await page.getByRole('button', { name: 'Back' }).click();
    await page.getByRole('button', { name: 'No thanks' }).click();
    await expect(page.locator('.tour-card')).toHaveCount(0);
    await page.reload();
    await expect(page.locator('.tour-card')).toHaveCount(0);
    await page.goto('/#/settings');
    await page.getByRole('radio', { name: /Daylight/ }).click();
    await expect(page.locator('html')).toHaveAttribute('data-look', 'daylight');
    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe('rgb(247, 241, 230)');
    await page.getByRole('button', { name: 'Show the tour again' }).click();
    await expect(page.locator('.tour-card')).toBeVisible();
  });
});
