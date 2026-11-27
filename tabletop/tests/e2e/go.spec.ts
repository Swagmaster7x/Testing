// Milestone 6: Go end to end at every size. A 9×9 game played to the end and counted, the rules at
// the table (13×13 and 19×19, presets, handicap), the confirm step, resuming, a lesson, problems, a drill,
// a review with key moments, SGF out and in.
import { readFileSync } from 'node:fs';
import { expect, noHorizontalScroll, test } from './fixtures';
import { goProblems, playGoToEnd, point, solveGoProblem, startGo } from './go-helpers';

test.describe('go', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a 9×9 game to the end, counts it, and reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startGo(page, { seed: 'e2e-go', level: 1, size: 9 });
    await noHorizontalScroll(page);
    await expect(page.locator('svg.ib rect.ib-hit')).toHaveCount(81);
    await expect(point(page, 'E5')).toHaveAttribute('aria-label', 'E5, empty');
    await point(page, 'E5').click();
    await expect(point(page, 'E5')).toHaveAttribute('aria-label', 'E5, black stone');
    await playGoToEnd(page, ['C3', 'G7', 'C7', 'G3', 'E3', 'E7', 'C5', 'G5', 'D4', 'F6', 'D6', 'F4']);
    await expect(page.locator('.result-card h2')).toHaveText(/^(You win|The CPU wins|Draw)$/);
    await expect(page.locator('.result-card p')).toHaveText('Counted by area: stones plus surrounded points.');
    await expect(page.locator('.go-strip-text')).toContainText(/wins by|tie/);
    const moves = await page.locator('.moves .mv').count();
    expect(moves).toBeGreaterThan(10);
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.ply-label')).toHaveText(`Move ${moves} of ${moves}`);
    await expect(page.locator('.moments .accuracy')).toBeVisible({ timeout: 120_000 });
    await page.getByRole('button', { name: 'First position' }).click();
    await expect(page.locator('svg.ib')).toHaveAttribute('data-position', '.'.repeat(81));
    await noHorizontalScroll(page);
    // Play on from the fourth move: the same stones, a new game against the same level.
    for (let i = 1; i <= 4; i++) {
      await page.getByRole('button', { name: 'Next move' }).click();
      await expect(page.locator('.ply-label')).toHaveText(`Move ${i} of ${moves}`);
    }
    const fourth = await page.locator('svg.ib').getAttribute('data-position');
    await page.getByRole('button', { name: 'Play on from here' }).click();
    await expect(page).toHaveURL(/#\/play\/g_/);
    await expect(page.locator('svg.ib')).toHaveAttribute('data-position', fourth ?? '');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
  });

  test('sets the rules at the table: 13×13 Japanese, 19×19 with handicap', async ({ page }) => {
    test.setTimeout(120_000);
    await startGo(page, { seed: 'e2e-go-13', level: 2, size: 13, preset: 'Japanese (territory)' });
    await expect(page.locator('svg.ib rect.ib-hit')).toHaveCount(169);
    await expect(page.locator('.counters')).toContainText('6.5');
    await point(page, 'D4').click();
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    await noHorizontalScroll(page);

    await startGo(page, { seed: 'e2e-go-19', level: 1, size: 19, preset: 'Japanese (territory)', handicap: 4 });
    await expect(page.locator('svg.ib rect.ib-hit')).toHaveCount(361);
    // Four handicap stones on the star points; White (the CPU) moves first.
    for (const name of ['D4', 'Q16', 'D16', 'Q4']) await expect(point(page, name)).toHaveAttribute('aria-label', `${name}, black stone`);
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    await expect(page.locator('.counters')).toContainText('0.5');
    await noHorizontalScroll(page);
  });

  test('confirms a move when asked, and shows liberties and atari', async ({ page }) => {
    await startGo(page, { seed: 'e2e-go-confirm', level: 1, size: 9 });
    await page.getByRole('switch', { name: 'Confirm moves' }).click();
    await point(page, 'C3').click();
    await expect(point(page, 'C3')).toHaveAttribute('aria-label', 'C3, empty');
    await expect(page.locator('.ib-ghost')).toHaveCount(1);
    await page.getByRole('button', { name: 'Play C3' }).click();
    await expect(point(page, 'C3')).toHaveAttribute('aria-label', 'C3, black stone');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    await page.getByRole('switch', { name: 'Liberty counts' }).click();
    // The number on C3 (the only black stone) is its liberties: the empty points beside it.
    const labels = await Promise.all(['B3', 'D3', 'C2', 'C4'].map((name) => point(page, name).getAttribute('aria-label')));
    await expect(page.locator('svg.ib text.ib-num-on-black')).toHaveText(String(labels.filter((l) => l?.endsWith('empty')).length));
    await expect(page.getByText('this game will not move your rating')).toBeVisible();
  });

  test('resumes a game after the app is closed', async ({ page }) => {
    await startGo(page, { seed: 'e2e-go-resume', level: 1, size: 9 });
    await point(page, 'E5').click();
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    const before = await page.locator('svg.ib').getAttribute('data-position');
    const url = page.url();
    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('svg.ib')).toHaveAttribute('data-position', before ?? '');
    await expect(point(page, 'E5')).toHaveAttribute('aria-label', 'E5, black stone');
    await expect(page.locator('.status-turn')).toHaveText('Your move');
  });

  test('finishes a lesson', async ({ page }) => {
    await page.goto('/#/learn/go.1.capture');
    await expect(page.locator('.status-title')).toHaveText('Capturing a stone');
    await page.getByRole('button', { name: 'Next' }).click();
    await point(page, 'D3').click();
    await expect(page.locator('.lesson-feedback')).toContainText('Captured');
    await expect(point(page, 'C3')).toHaveAttribute('aria-label', 'C3, empty');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: '1', exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('prisoners');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
    await page.getByRole('link', { name: 'All Go lessons' }).click();
    await expect(page.getByText(/^1 of \d+ lessons done$/)).toBeVisible();
  });

  test('wins a Capture-Go lesson against the computer', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto('/#/learn/go.0.capture-go');
    for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Next' }).click();
    await point(page, 'D3').click();
    await page.getByRole('button', { name: 'Next' }).click();
    // Free play: the double atari, then whichever stone is left.
    await point(page, 'D4').click();
    await expect(page.getByText('Moves left: 2')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.lesson-panel')).not.toContainText('The computer is thinking', { timeout: 30_000 });
    // C3 takes the left stone, unless White ran there; then E3 takes the right one.
    const c3 = point(page, 'C3');
    await ((await c3.getAttribute('aria-label'))?.endsWith('empty') ? c3 : point(page, 'E3')).click();
    await expect(page.locator('.lesson-feedback')).toContainText('double atari');
  });

  test('solves a capture problem, a ladder and a net', async ({ page }) => {
    test.setTimeout(120_000);
    const problems = goProblems();
    const capture = problems.find((p) => p.themes.includes('go-capture') && !p.themes.includes('go-ladder') && !p.themes.includes('go-net'));
    const ladder = problems.find((p) => p.themes.includes('go-ladder'));
    const net = problems.find((p) => p.id.startsWith('go:net:'));
    if (!capture || !ladder || !net) throw new Error('no problems');
    await page.goto(`/#/practice/go/go-capture?id=${encodeURIComponent(capture.id)}`);
    await expect(page.getByText(/Your move\. Find the best move for (Black|White)\./)).toBeVisible();
    await solveGoProblem(page, capture.line);
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 15_000 });
    await page.goto(`/#/practice/go/go-ladders?id=${encodeURIComponent(ladder.id)}`);
    await page.getByRole('button', { name: 'Hint' }).click();
    await expect(page.locator('svg.ib .ib-area')).toHaveCount(1);
    await solveGoProblem(page, ladder.line);
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 30_000 });
    await page.goto(`/#/practice/go/go-ladders?id=${encodeURIComponent(net.id)}`);
    await solveGoProblem(page, net.line);
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!', { timeout: 30_000 });
  });

  test('counts a board in the drill', async ({ page }) => {
    await page.goto('/#/practice/go/drill-go-count?seed=e2e');
    await expect(page.locator('.lesson-text')).toContainText(/Count/);
    await expect(page.locator('svg.ib')).toBeVisible();
    await page.getByRole('button', { name: '0', exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toHaveText('Not quite. Try again.');
  });

  test('shows the reference card with every preset and the ask-before-you-sit card', async ({ page }) => {
    await page.goto('/#/games/go/reference');
    await expect(page.getByRole('heading', { name: 'The rules at different tables' })).toBeVisible();
    for (const preset of ['Chinese (area)', 'Japanese (territory)', 'AGA', 'New Zealand', 'Tromp-Taylor (computer)', 'Capture-Go']) await expect(page.locator('.reference')).toContainText(`${preset}:`);
    await expect(page.getByRole('heading', { name: 'Ask before you sit' })).toBeVisible();
    await noHorizontalScroll(page);
  });

  test('saves a game as SGF and opens it again', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'Files do not depend on the layout');
    await startGo(page, { seed: 'e2e-go-sgf', level: 1, size: 9 });
    await point(page, 'E5').click();
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 30_000 });
    await page.getByRole('button', { name: 'Game menu' }).click();
    const download = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'Save as SGF' }).click();
    const file = testInfo.outputPath('game.sgf');
    await (await download).saveAs(file);
    const sgf = readFileSync(file, 'utf8');
    expect(sgf).toContain('SZ[9]');
    expect(sgf).toContain(';B[ee]');
    expect(sgf).toContain('PB[You]');

    await page.goto('/#/games/go');
    await page.getByRole('button', { name: /^Review/ }).click();
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Open a game file' }).click();
    await (await chooser).setFiles(file);
    await expect(page).toHaveURL(/#\/review\//);
    await expect(page.locator('.ply-label')).toHaveText(/Move 2 of 2/);
  });
});
