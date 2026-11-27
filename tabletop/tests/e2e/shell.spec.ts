import { expect, noHorizontalScroll, test } from './fixtures';

test.describe('the shell', () => {
  test('every top-level screen opens from the navigation and fits without sideways scrolling', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Today' })).toBeVisible();
    const nav = page.getByRole('navigation', { name: 'Main' });
    for (const [link, heading] of [
      ['Games', 'Games'],
      ['Progress', 'Progress'],
      ['Tools', 'Tools'],
      ['Settings', 'Settings'],
      ['Today', 'Today'],
    ] as const) {
      await nav.getByRole('link', { name: link, exact: true }).click();
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
      await expect(nav.getByRole('link', { name: link, exact: true })).toHaveAttribute('aria-current', 'page');
      await noHorizontalScroll(page);
    }
  });

  test('the shelf shows the eight launch games as coming, grouped, without the test game', async ({ page }) => {
    await page.goto('/#/games');
    for (const group of ['Cards', 'Boards', 'Tiles']) await expect(page.getByRole('heading', { name: group })).toBeVisible();
    const tiles = page.locator('.tile');
    await expect(tiles).toHaveCount(8);
    for (const name of ['Brisca', 'Poker', 'Chess', 'Go', 'Chinese Checkers', 'Shogi', 'Dominoes', 'Mahjong']) {
      await expect(page.getByRole('link', { name: `Open ${name}` })).toBeVisible();
    }
    await expect(page.getByText('Noughts and crosses')).toHaveCount(0);
    await expect(page.getByText(/Coming · M\d|Next up · M1/)).toHaveCount(8);
  });

  test('a coming game has a hub with four closed doors and a reference card', async ({ page }) => {
    await page.goto('/#/games');
    await page.getByRole('link', { name: 'Open Chess' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Chess' })).toBeVisible();
    const doors = page.locator('.door');
    await expect(doors).toHaveCount(4);
    for (let i = 0; i < 4; i++) await expect(doors.nth(i)).toHaveAttribute('aria-disabled', 'true');
    await page.getByRole('link', { name: /Reference card/ }).click();
    await expect(page.getByText('The reference card arrives with the game.')).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('focus games: up to three, shown on Today', async ({ page }) => {
    for (const game of ['chess', 'brisca', 'go']) {
      await page.goto(`/#/games/${game}`);
      await page.getByRole('button', { name: 'Add to focus' }).click();
      await expect(page.getByRole('button', { name: 'In focus' })).toBeVisible();
    }
    await page.goto('/#/games/poker');
    await page.getByRole('button', { name: 'Add to focus' }).click();
    await expect(page.getByRole('status')).toContainText('three games at once');
    await page.goto('/#/today');
    for (const name of ['Chess', 'Brisca', 'Go']) await expect(page.locator('.focus-row', { hasText: name })).toBeVisible();
    await expect(page.locator('.focus-row', { hasText: 'Poker' })).toHaveCount(0);
  });

  test('settings: profiles can be added, switched, renamed and deleted', async ({ page }) => {
    await page.goto('/#/settings');
    await page.getByRole('textbox', { name: 'New profile name' }).fill('Ana');
    await page.getByRole('button', { name: 'Add', exact: true }).click();
    const ana = page.locator('.profile-row', { hasText: 'Ana' });
    await ana.getByRole('button', { name: 'Use' }).click();
    await expect(page.getByRole('status')).toContainText('Now playing as Ana');
    await expect(page.getByRole('link', { name: 'Profile: Ana' })).toBeVisible();
    await ana.getByRole('button', { name: 'Rename: Ana' }).click();
    await page.getByRole('textbox', { name: 'New name for Ana' }).fill('Ana María');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('.profile-row', { hasText: 'Ana María' })).toBeVisible();
    await page.locator('.profile-row', { hasText: 'Ana María' }).getByRole('button', { name: 'Delete: Ana María' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Delete' }).click();
    await expect(page.locator('.profile-row')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Profile: Player 1' })).toBeVisible();
  });

  test('settings persist across a reload', async ({ page }) => {
    await page.goto('/#/settings');
    await page.getByRole('radiogroup', { name: 'Coach rail side' }).getByRole('radio', { name: 'Left' }).click();
    await page.getByRole('radiogroup', { name: 'Sound' }).getByRole('radio', { name: 'Off' }).click();
    await page.reload();
    await expect(page.getByRole('radiogroup', { name: 'Coach rail side' }).getByRole('radio', { name: 'Left' })).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('radiogroup', { name: 'Sound' }).getByRole('radio', { name: 'Off' })).toHaveAttribute('aria-checked', 'true');
  });

  test('an unknown address says so and offers a way back', async ({ page }) => {
    await page.goto('/#/nowhere');
    await expect(page.getByText('There is nothing at this address.')).toBeVisible();
    await page.getByRole('link', { name: 'Back to Today' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Today' })).toBeVisible();
  });
});
