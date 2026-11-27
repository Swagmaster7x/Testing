// Milestone 8: shogi end to end at every size. A whole game against level 1, drops and refusals,
// promotion, mini-shogi, a lesson, a problem, a drill, a review, files and resuming.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseSfen, START_SFEN } from '../../src/games/shogi/core';
import { impassePoints } from '../../src/games/shogi/rules';
import { expect, noHorizontalScroll, test } from './fixtures';
import { hand, play, playWithEngine, sfen, square, startShogi } from './shogi-helpers';

interface ProblemFile {
  readonly problems: readonly { readonly id: string; readonly line: readonly string[]; readonly themes: readonly string[] }[];
}
const problems = (JSON.parse(readFileSync(join(import.meta.dirname, '../../src/games/shogi/practice/problems.json'), 'utf8')) as ProblemFile).problems;

test.describe('shogi', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('plays a whole game against level 1 to the end, then reviews it', async ({ page }) => {
    test.setTimeout(300_000);
    await startShogi(page, { seed: 'e2e-shogi', level: 1 });
    await noHorizontalScroll(page);
    await expect(hand(page, 'Sente')).toBeVisible();
    await expect(hand(page, 'Gote')).toBeVisible();
    await playWithEngine(page);
    await expect(page.locator('.result-card h2')).toHaveText('You win');
    await expect(page.locator('.result-card p')).toHaveText(/Checkmate|No legal move/);
    const moves = await page.locator('.moves .mv').count();
    await page.getByRole('link', { name: 'Review' }).click();
    await expect(page.locator('.ply-label')).toHaveText(`Move ${moves} of ${moves}`);
    await page.getByRole('button', { name: 'First position' }).click();
    await expect(page.locator('svg.grid-board')).toHaveAttribute('data-position', START_SFEN.standard);
    await expect(page.locator('.moments')).toBeVisible({ timeout: 120_000 });
    await noHorizontalScroll(page);
  });

  test('drops from hand, and refuses two pawns on a file with the reason', async ({ page }) => {
    await startShogi(page, { seed: 'e2e-nifu', fen: '4k4/9/9/9/9/9/4P4/9/4K4 b P 1' });
    await hand(page, 'Sente').getByRole('button', { name: /^pawn in hand/ }).click();
    await square(page, '55').click();
    await expect(page.locator('.shogi-note')).toContainText('Two pawns on one file (nifu)');
    await expect(square(page, '55')).toHaveAttribute('aria-label', '55, empty');
    await play(page, 'P*65');
    await expect(square(page, '65')).toHaveAttribute('aria-label', '65, Black pawn');
    await expect(page.locator('.moves .mv').first()).toHaveText('▲ P*65');
  });

  test('asks before an optional promotion, and promotes by itself when it must', async ({ page }) => {
    await startShogi(page, { seed: 'e2e-promo', fen: '4k4/P8/9/4S4/9/9/9/9/4K4 b - 1' });
    await square(page, '54').click();
    await square(page, '53').click();
    await expect(page.getByRole('button', { name: 'Do not promote', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Promote', exact: true }).click();
    await expect(square(page, '53')).toHaveAttribute('aria-label', '53, Black promoted silver');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    await square(page, '92').click();
    await square(page, '91').click();
    await expect(square(page, '91')).toHaveAttribute('aria-label', '91, Black tokin');
    await expect(page.locator('.shogi-note')).toContainText('promotes: it could never move again');
  });

  test('refuses a move into check, and the piece faces change', async ({ page }) => {
    await startShogi(page, { seed: 'e2e-check', fen: '4k4/9/9/9/9/9/9/3r5/4K4 b - 1' });
    await square(page, '59').click();
    await square(page, '58').click();
    await expect(page.locator('.shogi-note')).toHaveText('That would leave your king in check.');
    const faces = page.getByRole('radiogroup', { name: 'Piece faces' });
    if (await faces.isVisible()) {
      await faces.getByRole('radio', { name: 'Symbols' }).click();
      await expect(faces.getByRole('radio', { name: 'Symbols' })).toHaveAttribute('aria-checked', 'true');
      await faces.getByRole('radio', { name: '1 kanji' }).click();
    }
  });

  test('plays mini-shogi from the rules presets', async ({ page }) => {
    await startShogi(page, { seed: 'e2e-mini', preset: 'mini' });
    await expect(page.locator('svg.grid-board rect.sq-hit')).toHaveCount(25);
    await expect(page.locator('svg.grid-board')).toHaveAttribute('data-position', START_SFEN.mini);
    await play(page, '5453');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    expect(await sfen(page)).not.toBe(START_SFEN.mini);
  });

  test('finishes a lesson with drops on both boards', async ({ page }) => {
    await page.goto('/#/learn/shogi.2.head-gold');
    await expect(page.locator('.status-title')).toHaveText('Mate with a gold on the head');
    await page.getByRole('button', { name: 'Next' }).click();
    await play(page, 'G*52');
    await expect(page.locator('.lesson-feedback')).toContainText('Checkmate: the gold on the head.');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.locator('svg.grid-board rect.sq-hit')).toHaveCount(25);
    await play(page, 'G*42');
    await expect(page.locator('.lesson-feedback')).toContainText('Mate again.');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Lesson complete' })).toBeVisible();
  });

  test('solves a mate problem', async ({ page }) => {
    const problem = problems.find((p) => p.themes.includes('shogi-mate1'));
    test.skip(!problem, 'no problems generated');
    if (!problem) return;
    await page.goto(`/#/practice/shogi/shogi-mate1?id=${encodeURIComponent(problem.id)}`);
    await expect(page.locator('.lesson-text')).toContainText('Your move.', { timeout: 15_000 });
    const position = (await sfen(page)) ?? '';
    await play(page, problem.line[0] ?? '', position.split(' ')[1] === 'w' ? 'Gote' : 'Sente');
    await expect(page.locator('.lesson-feedback')).toContainText('Solved!');
  });

  test('counts impasse points in a drill, checked against the rules', async ({ page }) => {
    await page.goto('/#/practice/shogi/drill-shogi-points?seed=e2e');
    await expect(page.locator('.lesson-text')).toBeVisible();
    const position = (await sfen(page)) ?? '';
    const text = (await page.locator('.lesson-text').textContent()) ?? '';
    const p = parseSfen(position);
    const answer = impassePoints(p, text.startsWith('Count Black') ? 0 : 1, { handicapPoints: 0 });
    for (const d of String(answer)) await page.getByRole('button', { name: d, exact: true }).click();
    await page.getByRole('button', { name: 'Check' }).click();
    await expect(page.locator('.lesson-feedback')).toContainText('Right');
  });

  test('saves a game as KIF and opens it again', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'Files do not depend on the layout');
    await startShogi(page, { seed: 'e2e-kif' });
    await play(page, '7776');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    await page.getByRole('button', { name: 'Game menu' }).click();
    const download = page.waitForEvent('download');
    await page.getByRole('menuitem', { name: 'Save as KIFU' }).click();
    const file = testInfo.outputPath('game.kifu');
    await (await download).saveAs(file);
    const kif = readFileSync(file, 'utf8');
    expect(kif).toContain('７六歩(77)');
    expect(kif).toContain('先手：You');

    const other = testInfo.outputPath('other.kifu');
    writeFileSync(other, ['手合割：平手', '先手：A', '後手：B', '手数----指手---------消費時間--', '   1 ７六歩(77)', '   2 ３四歩(33)', '   3 ２二角成(88)', '   4 同　銀(31)', '   5 投了'].join('\n'));
    await page.goto('/#/games/shogi');
    await page.getByRole('button', { name: /^Review/ }).click();
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Open a game file' }).click();
    await (await chooser).setFiles(other);
    await expect(page).toHaveURL(/#\/review\/g_/);
    await expect(page.locator('.ply-label')).toHaveText('Move 4 of 4');
    await expect(page.locator('.moves .mv').last()).toHaveText('△ Sx22');
  });

  test('resumes a game after the app is closed', async ({ page }) => {
    await startShogi(page, { seed: 'e2e-shogi-resume' });
    await play(page, '2726');
    await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 15_000 });
    const before = await sfen(page);
    const url = page.url();
    await page.goto('about:blank');
    await page.goto(url);
    await expect(page.locator('svg.grid-board')).toHaveAttribute('data-position', before ?? '');
    await expect(page.locator('.status-turn')).toHaveText('Your move');
  });
});
