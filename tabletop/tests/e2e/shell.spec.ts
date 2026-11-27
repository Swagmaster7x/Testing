import { SHELF } from '../../src/games/catalog';
import { expect, noHorizontalScroll, test } from './fixtures';

const NAMES: Record<string, string> = { brisca: 'Brisca', poker: 'Poker', chess: 'Chess', go: 'Go', 'chinese-checkers': 'Chinese Checkers', shogi: 'Shogi', dominoes: 'Dominoes', mahjong: 'Mahjong' };
const gameName = (id: string) => NAMES[id] ?? id;

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

  test('the shelf shows the eight launch games and Tute, grouped, built ones playable, without the test game', async ({ page }) => {
    await page.goto('/#/games');
    for (const group of ['Cards', 'Boards', 'Tiles']) await expect(page.getByRole('heading', { name: group })).toBeVisible();
    const tiles = page.locator('.tile');
    await expect(tiles).toHaveCount(SHELF.length);
    for (const name of ['Brisca', 'Poker', 'Tute', 'Chess', 'Go', 'Chinese Checkers', 'Shogi', 'Dominoes', 'Mahjong']) {
      await expect(page.getByRole('link', { name: `Open ${name}` })).toBeVisible();
    }
    await expect(page.getByText('Noughts and crosses')).toHaveCount(0);
    // Built games open; the rest say when they arrive.
    const coming = SHELF.filter((g) => !g.playable);
    await expect(page.getByText(/Coming · M\d|Next up · M\d/)).toHaveCount(coming.length);
    for (const g of SHELF.filter((x) => x.playable)) await expect(page.getByRole('link', { name: `Open ${gameName(g.id)}` })).not.toContainText(/Coming|Next up/);
  });

  test('a coming game has a hub with four closed doors and a reference card', async ({ page }) => {
    const coming = SHELF.filter((g) => !g.playable).sort((a, b) => b.milestone - a.milestone)[0];
    test.skip(!coming, 'every game is built');
    const name = gameName(coming?.id ?? '');
    await page.goto('/#/games');
    await page.getByRole('link', { name: `Open ${name}` }).click();
    await expect(page.getByRole('heading', { level: 1, name })).toBeVisible();
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
    await expect(page.getByRole('radiogroup', { name: 'Sound' }).getByRole('radio', { name: 'Off' })).toHaveAttribute('aria-checked', 'true');
    // Settings are written in the background; give the write a moment before the reload.
    await page.waitForTimeout(400);
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
