// Pass-and-play (milestone 7) for every game, from the shell: people share the device, each seat a
// person or the CPU. Brisca hides its hands, so the table covers itself between people; Chinese
// Checkers turns the board towards whoever is to move.
import type { Page } from '@playwright/test';
import { hole } from './cc-helpers';
import { square } from './chess-helpers';
import { expect, noHorizontalScroll, test } from './fixtures';

/** Opens a game's New game dialog and seats people by name (a name of '' leaves "Player N"; null puts the CPU there). */
async function startPassAndPlay(page: Page, game: string, seed: string, seats: readonly { side: string; name: string | null }[], preset?: string): Promise<void> {
  await page.goto(`/#/games/${game}?seed=${seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  if (preset) await dialog.getByRole('radiogroup', { name: 'Rules at this table' }).getByRole('radio', { name: preset, exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Who plays' }).getByRole('radio', { name: 'Pass and play', exact: true }).click();
  for (const seat of seats) {
    if (seat.name === null) await dialog.getByRole('radiogroup', { name: `Who plays ${seat.side}` }).getByRole('radio', { name: 'CPU', exact: true }).click();
    else if (seat.name) await dialog.getByRole('textbox', { name: `Name for ${seat.side}` }).fill(seat.name);
  }
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

async function resign(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Game menu' }).click();
  await page.getByRole('menuitem', { name: 'Resign' }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Resign' }).click();
}

test.describe('pass and play', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('covers a card table between two people, so neither sees the other’s hand', async ({ page }) => {
    test.setTimeout(120_000);
    await startPassAndPlay(page, 'brisca', 'e2e-pnp-brisca', [
      { side: 'First to lead', name: 'Ana' },
      { side: 'Dealer', name: 'Ben' },
    ]);
    // Nobody holds the device yet: the cover, and no cards at all on the page.
    await expect(page.getByRole('heading', { name: 'Pass the device to Ana' })).toBeVisible();
    await expect(page.locator('button.table-card')).toHaveCount(0);
    await noHorizontalScroll(page);
    await page.getByRole('button', { name: 'I am Ana: show my hand' }).click();
    await expect(page.locator('.status-turn')).toHaveText('Ana to move');
    await expect(page.locator('.status-meta').first()).toHaveText('Pass and play');
    await expect(page.locator('.players')).toContainText('Ana');
    await expect(page.locator('.players')).toContainText('Ben');

    const seenCovers = new Set<string>();
    for (let plays = 0; plays < 6; ) {
      const cover = page.locator('.pass-cover h1');
      if (await cover.isVisible()) {
        const title = (await cover.textContent()) ?? '';
        seenCovers.add(title);
        const name = title.replace('Pass the device to ', '');
        await expect(page.locator('button.table-card')).toHaveCount(0);
        await page.getByRole('button', { name: `I am ${name}: show my hand` }).click();
        continue;
      }
      const turn = (await page.locator('.status-turn').textContent()) ?? '';
      if (!/to move/.test(turn)) {
        await page.waitForTimeout(100);
        continue;
      }
      const card = page.locator('button.table-card').first();
      await card.click();
      await card.click();
      plays++;
      await page.waitForTimeout(150);
    }
    expect(seenCovers.has('Pass the device to Ben')).toBe(true);

    // Whoever holds the device resigns: the other one wins, by name.
    if (await page.locator('.pass-cover').isVisible()) await page.locator('.pass-cover .btn-primary').click();
    const holder = ((await page.locator('.status-turn').textContent()) ?? '').replace(' to move', '');
    await resign(page);
    await expect(page.locator('.result-card h2')).toHaveText(holder === 'Ana' ? 'Ben wins' : 'Ana wins');
  });

  test('turns a board towards each person, and names them', async ({ page }) => {
    test.setTimeout(120_000);
    await startPassAndPlay(page, 'chinese-checkers', 'e2e-pnp-cc', [
      { side: 'Red', name: 'Ana' },
      { side: 'Blue', name: 'Ben' },
    ]);
    // A board game has nothing hidden: no cover, Red's side at the bottom for Ana.
    await expect(page.locator('.pass-cover')).toHaveCount(0);
    await expect(page.locator('.status-turn')).toHaveText('Ana to move');
    await expect(page.locator('svg.sb')).toHaveAttribute('data-bottom', '0');
    await hole(page, '4b').click();
    await hole(page, '5f').click();
    await expect(page.locator('.status-turn')).toHaveText('Ben to move');
    await expect(page.locator('svg.sb')).toHaveAttribute('data-bottom', '3');
    await hole(page, '14a').click();
    await hole(page, '13e').click();
    await expect(page.locator('.status-turn')).toHaveText('Ana to move');
    await expect(page.locator('.log')).toContainText('Ben');
    await noHorizontalScroll(page);
    await resign(page);
    await expect(page.locator('.result-card h2')).toHaveText('Ben wins');
  });

  test('flips the chess board for whoever is to move', async ({ page }) => {
    await startPassAndPlay(page, 'chess', 'e2e-pnp-chess', [
      { side: 'White', name: 'Ana' },
      { side: 'Black', name: 'Ben' },
    ]);
    const y = async (name: string) => (await square(page, name).boundingBox())?.y ?? 0;
    await expect(page.locator('.status-turn')).toHaveText('Ana to move');
    expect(await y('e2')).toBeGreaterThan(await y('e7'));
    await square(page, 'e2').click();
    await square(page, 'e4').click();
    await expect(page.locator('.status-turn')).toHaveText('Ben to move');
    // Black at the bottom now.
    await expect.poll(async () => (await y('e7')) > (await y('e2'))).toBe(true);
    await square(page, 'e7').click();
    await square(page, 'e5').click();
    await expect(page.locator('.status-turn')).toHaveText('Ana to move');
    await expect(page.locator('.moves')).toContainText('e5');
  });

  test('seats a CPU among the people, three at the star', async ({ page }) => {
    test.setTimeout(120_000);
    await startPassAndPlay(
      page,
      'chinese-checkers',
      'e2e-pnp-three',
      [
        { side: 'Red', name: 'Ana' },
        { side: 'Blue', name: null },
        { side: 'Green', name: '' },
      ],
      'Three players',
    );
    await expect(page.locator('.players .player')).toHaveCount(3);
    await expect(page.locator('.status-turn')).toHaveText('Ana to move');
    await hole(page, '4c').click();
    await hole(page, '5h').click();
    // The CPU (Blue) answers, then the unnamed person on Green is "Player 2", with Green's point at the bottom.
    await expect(page.locator('.status-turn')).toHaveText('Player 2 to move', { timeout: 30_000 });
    await expect(page.locator('svg.sb')).toHaveAttribute('data-bottom', '4');
    await expect(page.locator('.status-meta').first()).toHaveText('Pass and play');
    await noHorizontalScroll(page);
  });
});
