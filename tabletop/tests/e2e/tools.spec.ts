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

  test('the Mahjong calculator scores a hand written down tile by tile', async ({ page }) => {
    await page.goto('/#/tools');
    await page.getByRole('link', { name: 'Open the Mahjong calculator' }).click();
    await expect(page.getByRole('heading', { name: 'Mahjong calculator' })).toBeVisible();
    const picker = page.getByRole('group', { name: 'Tiles to add' });
    for (const tile of ['1 characters', '2 characters', '3 characters', '4 characters', '5 characters', '6 characters', '7 dots', '8 dots', '9 dots', '2 bamboo', '3 bamboo', '4 bamboo', '5 bamboo']) {
      await picker.getByRole('button', { name: `Add the ${tile}`, exact: true }).click();
    }
    await expect(page.locator('.calc-status')).toHaveText('Add 1 more tiles.');
    await picker.getByRole('button', { name: 'Add the 5 bamboo', exact: true }).click();
    await expect(page.locator('.calc-lines')).toContainText('All chows');
    await expect(page.locator('.calc-total')).toHaveText('4 faan');
    await expect(page.locator('.calc-result')).toContainText('Base 16');
    await expect(page.locator('.calc-result')).toContainText('East (winner) +96');
    // On South's discard instead: three faan, South pays double.
    await page.getByRole('radiogroup', { name: 'How it was won' }).getByRole('radio', { name: 'On South’s discard' }).click();
    await expect(page.locator('.calc-total')).toHaveText('3 faan');
    await expect(page.locator('.calc-result')).toContainText('South -16');
  });

  test('the Mahjong calculator takes a Riichi hand: riichi, ippatsu, a dora and a red five', async ({ page }) => {
    await page.goto('/#/tools/mahjong');
    await page.getByRole('radiogroup', { name: 'Style' }).getByRole('radio', { name: 'Riichi' }).click();
    const picker = page.getByRole('group', { name: 'Tiles to add' });
    for (const tile of ['1 characters', '2 characters', '3 characters', '4 characters', '5 characters', '6 characters', '7 dots', '8 dots', '9 dots', '2 bamboo', '3 bamboo', '4 bamboo', '5 bamboo', '5 bamboo']) {
      await picker.getByRole('button', { name: `Add the ${tile}`, exact: true }).click();
    }
    // No yaku yet on a discard: it is not a hand.
    await page.getByRole('radiogroup', { name: 'How it was won' }).getByRole('radio', { name: 'On West’s discard' }).click();
    await page.getByRole('radiogroup', { name: 'Riichi' }).getByRole('radio', { name: 'Riichi', exact: true }).click();
    await expect(page.locator('.calc-lines')).toContainText('Riichi');
    await expect(page.locator('.calc-result')).toContainText('West -2000');
    await page.getByRole('button', { name: 'Ippatsu' }).click();
    await page.getByRole('radiogroup', { name: 'Red fives in the hand' }).getByRole('radio', { name: '1' }).click();
    await page.getByRole('radiogroup', { name: 'Add', exact: true }).getByRole('radio', { name: 'Dora indicators' }).click();
    await picker.getByRole('button', { name: 'Add the 4 characters', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Dora indicator: 4 characters' })).toBeVisible();
    await expect(page.locator('.calc-result')).toContainText('West -12000');
  });

  test('the Mahjong calculator takes a Chinese Official hand: eight points to win, flowers aside, the last of its kind', async ({ page }) => {
    await page.goto('/#/tools/mahjong');
    await page.getByRole('radiogroup', { name: 'Style' }).getByRole('radio', { name: 'Chinese Official' }).click();
    const picker = page.getByRole('group', { name: 'Tiles to add' });
    for (const tile of ['1 characters', '2 characters', '3 characters', '4 characters', '5 characters', '6 characters', '7 dots', '8 dots', '9 dots', '2 bamboo', '3 bamboo', '4 bamboo', '5 bamboo', '5 bamboo']) {
      await picker.getByRole('button', { name: `Add the ${tile}`, exact: true }).click();
    }
    // Self-drawn: fully concealed, all chows, a short straight and no honours make eight.
    await expect(page.locator('.calc-total')).toHaveText('8 points');
    await expect(page.locator('.calc-result')).toContainText('East (winner) +48');
    // On a discard it is two points short; the last tile of its kind lifts it to ten.
    await page.getByRole('radiogroup', { name: 'How it was won' }).getByRole('radio', { name: 'On West’s discard' }).click();
    await expect(page.locator('.calc-result')).toContainText('Below the minimum');
    await page.getByRole('button', { name: 'The last of its kind' }).click();
    await expect(page.locator('.calc-total')).toHaveText('10 points');
    await expect(page.locator('.calc-result')).toContainText('West -18');
  });

  test('the Mahjong calculator takes a Taiwanese hand of sixteen tiles and the winning one, with the dealer’s repeat deals', async ({ page }) => {
    await page.goto('/#/tools/mahjong');
    await page.getByRole('radiogroup', { name: 'Style' }).getByRole('radio', { name: 'Taiwanese' }).click();
    const picker = page.getByRole('group', { name: 'Tiles to add' });
    for (const tile of ['1 characters', '2 characters', '3 characters', '4 characters', '5 characters', '6 characters', '7 dots', '8 dots', '9 dots', '2 bamboo', '3 bamboo', '5 bamboo', '6 bamboo', '7 bamboo', '9 dots', '9 dots']) {
      await picker.getByRole('button', { name: `Add the ${tile}`, exact: true }).click();
    }
    await expect(page.locator('.calc-status')).toHaveText('Add 1 more tiles.');
    await picker.getByRole('button', { name: 'Add the 4 bamboo', exact: true }).click();
    // East self-drawn: concealed and self-drawn (3) and the dealer (1); each pays 100 + 4 × 20.
    await expect(page.locator('.calc-total')).toHaveText('4 tai');
    await expect(page.locator('.calc-result')).toContainText('East (winner) +540');
    // South wins on East's discard, East on two repeat deals: East pays its 1 + 2 × 2 tai too.
    await page.getByRole('radiogroup', { name: 'Winner’s seat' }).getByRole('radio', { name: 'South' }).click();
    await page.getByRole('radiogroup', { name: 'How it was won' }).getByRole('radio', { name: 'On East’s discard' }).click();
    await page.getByRole('radiogroup', { name: 'Dealer’s repeat deals' }).getByRole('radio', { name: '2' }).click();
    await expect(page.locator('.calc-total')).toHaveText('3 tai');
    await expect(page.locator('.calc-result')).toContainText('East -260');
  });
});
