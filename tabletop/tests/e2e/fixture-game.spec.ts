// The milestone 0 gate: the fixture game played end to end, with save and resume, replay and
// the animation queue, at phone, tablet and laptop sizes.
import { boardText, expect, noHorizontalScroll, playToEnd, startFixtureGame, test } from './fixtures';

test.describe('the test table (noughts and crosses)', () => {
  test('is reached from Settings, not from the shelf', async ({ page }) => {
    await page.goto('/#/settings');
    await page.getByRole('link', { name: 'Open the test table' }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Noughts and crosses' })).toBeVisible();
    await expect(page.locator('.door')).toHaveCount(4);
  });

  test('plays a whole game against the CPU in a worker, then reviews it move by move', async ({ page }) => {
    await startFixtureGame(page, { seed: 'e2e-full', level: 1, side: 'X, moves first' });
    await expect(page.locator('.status-turn')).toHaveText('Your move');
    await noHorizontalScroll(page);
    const moves = await playToEnd(page);
    expect(moves).toBeGreaterThanOrEqual(3);
    await expect(page.locator('.result-card h2')).toHaveText(/You win|The CPU wins|Draw/);
    const finalBoard = await boardText(page);
    // Every move is in the move list and the log.
    const marks = finalBoard.filter((l) => /, [XO]$/.test(l)).length;
    await expect(page.locator('.moves .mv')).toHaveCount(marks);

    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page).toHaveURL(/#\/review\/g_/);
    await expect(page.locator('.ply-label')).toHaveText(`Move ${marks} of ${marks}`);
    expect(await boardText(page)).toEqual(finalBoard);
    await page.getByRole('button', { name: 'First position' }).click();
    await expect(page.locator('.ply-label')).toHaveText('Start position');
    expect((await boardText(page)).every((l) => l.endsWith('empty'))).toBe(true);
    for (let n = 1; n <= marks; n++) {
      await page.getByRole('button', { name: 'Next move' }).click();
      await expect(page.locator('.ply-label')).toHaveText(`Move ${n} of ${marks}`);
      await expect(page).toHaveURL(new RegExp(`/review/g_[a-z0-9]+/${n}$`));
    }
    expect(await boardText(page)).toEqual(finalBoard);
    await noHorizontalScroll(page);
  });

  test('the same seed and moves give the same game', async ({ page }) => {
    await startFixtureGame(page, { seed: 'e2e-repeat', level: 2, side: 'X, moves first' });
    await playToEnd(page);
    const first = await boardText(page);
    await startFixtureGame(page, { seed: 'e2e-repeat', level: 2, side: 'X, moves first' });
    await playToEnd(page);
    expect(await boardText(page)).toEqual(first);
  });

  test('saves every move and resumes after the app is closed', async ({ page }) => {
    await startFixtureGame(page, { seed: 'e2e-resume', level: 2, side: 'X, moves first' });
    await page.getByRole('button', { name: 'b2, empty', exact: true }).click();
    await expect(page.locator('.status-turn')).toHaveText('Your move');
    const before = await boardText(page);
    expect(before.filter((l) => l.endsWith(', X'))).toHaveLength(1);
    expect(before.filter((l) => l.endsWith(', O'))).toHaveLength(1);
    const url = page.url();

    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('.status-turn')).toHaveText('Your move');
    expect(await boardText(page)).toEqual(before);

    // The hub offers to resume it too.
    await page.goto('/#/games/noughts');
    await expect(page.locator('.door', { hasText: 'Play' })).toContainText('Move 3');
    await page.getByRole('button', { name: /^Play/ }).click();
    await page.getByRole('link', { name: /Resume/ }).click();
    await expect(page).toHaveURL(url);
    await playToEnd(page);
    await expect(page.locator('.result-card')).toBeVisible();
  });

  test('the CPU resumes its own move if the app closed while it was thinking', async ({ page }) => {
    await startFixtureGame(page, { seed: 'e2e-cpu-first', level: 3, side: 'O' });
    // The CPU plays X and moves first; leave before it answers, then come back.
    const url = page.url();
    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 10_000 });
    expect((await boardText(page)).filter((l) => l.endsWith(', X'))).toHaveLength(1);
  });

  test('resigning ends the game as a loss', async ({ page }) => {
    await startFixtureGame(page, { seed: 'e2e-resign', level: 1, side: 'X, moves first' });
    await page.locator('.table-side').getByRole('button', { name: 'Resign' }).click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Resign' }).click();
    await expect(page.locator('.result-card h2')).toHaveText('You resigned');
    await expect(page.locator('.status-turn')).toHaveText('Game over');
  });

  test('animations play from the queue, and a tap on the board skips them', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await startFixtureGame(page, { seed: 'e2e-anim', level: 1, side: 'X, moves first' });
    await page.getByRole('button', { name: 'b2, empty', exact: true }).click();
    // The new mark starts drawing at once while the rules have already moved on.
    await expect(page.locator('.nc-mark.drawing')).toHaveCount(1);
    await page.getByRole('group', { name: 'Noughts and crosses board' }).dispatchEvent('pointerdown');
    await expect(page.locator('.nc-mark.drawing')).toHaveCount(0);
  });

  test('with reduced motion, marks appear without animating', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await startFixtureGame(page, { seed: 'e2e-still', level: 1, side: 'X, moves first' });
    await page.getByRole('button', { name: 'b2, empty', exact: true }).click();
    await expect(page.getByRole('button', { name: 'b2, X', exact: true })).toBeVisible();
    await expect(page.locator('.nc-mark.drawing')).toHaveCount(0);
  });

  test('the coach rail can be hidden and moved to the left', async ({ page }) => {
    await startFixtureGame(page, { seed: 'e2e-rail', level: 1, side: 'X, moves first' });
    const rail = page.getByRole('complementary', { name: 'Coach rail' });
    await expect(rail).toBeVisible();
    await page.getByRole('button', { name: 'Hide the coach rail' }).click();
    await expect(rail).toHaveCount(0);
    await page.getByRole('button', { name: 'Show the coach rail' }).click();
    await expect(rail).toBeVisible();
    await page.goto('/#/settings');
    await page.getByRole('radiogroup', { name: 'Coach rail side' }).getByRole('radio', { name: 'Left' }).click();
    await page.goBack();
    await expect(page.locator('.table-body')).toHaveAttribute('data-rail', 'left');
    const railBox = await page.getByRole('complementary', { name: 'Coach rail' }).boundingBox();
    const boardBox = await page.getByRole('group', { name: 'Noughts and crosses board' }).boundingBox();
    expect(railBox && boardBox && railBox.x < boardBox.x).toBe(true);
  });
});
