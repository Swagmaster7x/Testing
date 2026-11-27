// Milestone 1 gate: a full game against level 1 at every size, and the chess coach and tools.
import { readFileSync, writeFileSync } from 'node:fs';
import { nodeEngine } from '../harness/stockfish-node';
import { fen, move, playWithEngine, square, startChess } from './chess-helpers';
import { expect, noHorizontalScroll, test } from './fixtures';

test.describe('chess', () => {
  test('plays a whole game against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(240_000);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const engine = nodeEngine();
    try {
      await startChess(page, { seed: 'e2e-chess', level: 1 });
      await noHorizontalScroll(page);
      await playWithEngine(page, engine);
      await expect(page.locator('.result-card h2')).toHaveText('You win');
      await expect(page.locator('.result-card p')).toHaveText('Checkmate.');
      const moves = await page.locator('.moves .mv').count();
      await page.getByRole('link', { name: 'Review' }).click();
      await expect(page.locator('.ply-label')).toHaveText(`Move ${moves} of ${moves}`);
      await page.getByRole('button', { name: 'First position' }).click();
      await expect(page.locator('svg.grid-board')).toHaveAttribute('data-position', 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
      await noHorizontalScroll(page);
    } finally {
      engine.terminate();
    }
  });

  test('taps and drags both move pieces, and legal moves show as dots', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await startChess(page, { seed: 'e2e-input' });
    await square(page, 'g1').click();
    await expect(page.locator('svg.grid-board circle[r="14"]')).toHaveCount(2);
    await square(page, 'f3').click();
    await expect(square(page, 'f3')).toHaveAttribute('aria-label', 'f3, white knight');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    const from = await square(page, 'e2').boundingBox();
    const to = await square(page, 'e4').boundingBox();
    if (!from || !to) throw new Error('no squares');
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 6 });
    await page.mouse.up();
    await expect(square(page, 'e4')).toHaveAttribute('aria-label', 'e4, white pawn');
  });

  test('offers all four promotions', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await startChess(page, { seed: 'e2e-promo', fen: '8/4P3/8/8/8/8/8/k6K w - - 0 1' });
    await square(page, 'e7').click();
    await square(page, 'e8').click();
    for (const piece of ['queen', 'rook', 'bishop', 'knight']) await expect(page.getByRole('button', { name: `Promote to a ${piece}` })).toBeVisible();
    await page.getByRole('button', { name: 'Promote to a knight' }).click();
    await expect(square(page, 'e8')).toHaveAttribute('aria-label', 'e8, white knight');
    await expect(page.locator('.moves .mv').first()).toHaveText('e8=N');
  });

  test('warns before a blunder and takes it back', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await startChess(page, { seed: 'e2e-blunder', fen: '4k3/8/8/3r4/8/8/8/3QK3 w - - 0 1' });
    await page.getByRole('switch', { name: 'Blunder warning' }).click();
    await expect(page.getByRole('switch', { name: 'Blunder warning' })).toHaveAttribute('aria-checked', 'true');
    await move(page, 'd1d4');
    const warning = page.getByRole('alert');
    await expect(warning).toContainText('leaves your queen to be taken');
    await expect(warning).toContainText('Rxd4');
    await warning.getByRole('button', { name: 'Take it back' }).click();
    await expect(square(page, 'd1')).toHaveAttribute('aria-label', 'd1, white queen');
    await expect(page.locator('.status-turn')).toHaveText('Your move');
    await expect(page.getByText('this game will not move your rating')).toBeVisible();
  });

  test('gives a hint in three steps and shows threats', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    // Black threatens Qxf2 mate.
    await startChess(page, { seed: 'e2e-hint', fen: 'r1b1k1nr/pppp1ppp/2n5/2b1p3/2B1P2q/2N5/PPPP1PPP/R1BQK1NR w KQkq - 0 1' });
    await page.getByRole('switch', { name: 'Threats' }).click();
    await expect(page.locator('.coach-line')).toHaveText('They threaten mate: Qxf2#, mate in 1.', { timeout: 15_000 });
    await page.getByRole('button', { name: 'Hint' }).click();
    await expect(page.locator('.hint-steps li')).toHaveCount(1, { timeout: 15_000 });
    await page.getByRole('button', { name: 'Tell me more' }).click();
    await page.getByRole('button', { name: 'Tell me more' }).click();
    await expect(page.locator('.hint-steps li')).toHaveCount(3);
    await expect(page.locator('.hint-steps li').nth(2)).toHaveText(/^Play .+\.$/);
    await expect(page.locator('svg.grid-board line[marker-end]')).toHaveCount(2);
  });

  test('shows an evaluation bar when asked', async ({ page }) => {
    await startChess(page, { seed: 'e2e-eval', fen: '4k3/8/8/8/8/8/8/QQQQK3 w - - 0 1' });
    await page.getByRole('switch', { name: 'Evaluation bar' }).click();
    await expect(page.locator('.eval .num')).toHaveText(/^\+\d+\.\d|White mates in \d+$/, { timeout: 15_000 });
  });

  test('runs a clock for both sides', async ({ page }) => {
    await startChess(page, { seed: 'e2e-clock', clock: '5 min' });
    const clocks = page.locator('.player .clock');
    await expect(clocks).toHaveCount(2);
    await expect(clocks.nth(1)).toHaveText(/^4:5\d$|^5:00$/);
    await page.waitForTimeout(1500);
    await expect(clocks.nth(1)).toHaveText(/^4:5\d$/);
    await expect(clocks.nth(0)).toHaveText('5:00');
  });

  test('saves a game as PGN and opens it again', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'Files do not depend on the layout');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await startChess(page, { seed: 'e2e-pgn' });
    await move(page, 'e2e4');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    await page.getByRole('button', { name: 'Game menu' }).click();
    const download = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'Save as PGN' }).click();
    const file = testInfo.outputPath('game.pgn');
    await (await download).saveAs(file);
    const pgn = readFileSync(file, 'utf8');
    expect(pgn).toContain('[White "You"]');
    expect(pgn).toContain('[Black "CPU Level 1"]');
    expect(pgn).toMatch(/1\. e4 \S+ \*/);

    const other = testInfo.outputPath('scholar.pgn');
    writeFileSync(other, '[Event "Test"]\n[White "A"]\n[Black "B"]\n[Result "1-0"]\n\n1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7# 1-0\n');
    await page.goto('/#/games/chess');
    await page.getByRole('button', { name: /^Review/ }).click();
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Open a game file' }).click();
    await (await chooser).setFiles(other);
    await expect(page).toHaveURL(/#\/review\/g_/);
    await expect(page.locator('.ply-label')).toHaveText('Move 7 of 7');
    await expect(page.locator('.moves .mv').last()).toHaveText('Qxf7#');
  });

  test('resumes a game after the app is closed', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await startChess(page, { seed: 'e2e-chess-resume' });
    await move(page, 'd2d4');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    const before = await fen(page);
    const url = page.url();
    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('svg.grid-board')).toHaveAttribute('data-position', before ?? '');
    await expect(page.locator('.status-turn')).toHaveText('Your move');
  });
});
