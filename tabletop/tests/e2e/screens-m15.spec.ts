/**
 * Milestone 15 screenshots at 844 × 390 (twice the pixels): the strong shogi level, the Go review's
 * score and ownership map, and the three trainers (chess openings, shogi castles, Go joseki) in
 * practice, drills and lessons.
 */
import { writeFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { chessOpenings } from '../../src/games/chess/openings';
import { pointName } from '../../src/games/go/coords';
import { josekiLines } from '../../src/games/go/joseki';
import { CASTLES } from '../../src/games/shogi/castles';
import { move as chessMove } from './chess-helpers';
import { expect, test } from './fixtures';
import { point } from './go-helpers';
import { play as shogiPlay, startShogi } from './shogi-helpers';

const DIR = 'screenshots/m15';
const shot = (page: Page, name: string) => page.screenshot({ path: `${DIR}/${name}.png` });
const goName = (sgf: string) => pointName((sgf.charCodeAt(1) - 97) * 19 + (sgf.charCodeAt(0) - 97), 19);

const NINE = '(;GM[1]FF[4]SZ[9]KM[7]RU[Chinese]PB[Black]PW[White];B[ee];W[gc];B[cg];W[ce];B[eg];W[gg];B[ge];W[cc];B[dd];W[fd];B[fe];W[dc];B[ed];W[ec];B[hd];W[hc];B[gf];W[bg];B[bh];W[bf])';
const NINETEEN = '(;GM[1]FF[4]SZ[19]KM[6.5]RU[Japanese]PB[Black]PW[White];B[pd];W[dp];B[pp];W[dd];B[fq];W[cn];B[jp];W[qf];B[nc];W[rd];B[qc];W[qi];B[qk];W[oi];B[ok];W[ql])';

async function openSgf(page: Page, file: string): Promise<void> {
  await page.goto('/#/games/go');
  await page.getByRole('button', { name: /^Review/ }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Open a game file' }).click();
  await (await chooser).setFiles(file);
  await expect(page).toHaveURL(/#\/review\//);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('milestone 15 screens: the strong engines', async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  await page.goto('/#/games/shogi?seed=shots-strong');
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: '8', exact: true }).click();
  await page.waitForTimeout(200);
  await shot(page, '01-shogi-level-8');
  await page.keyboard.press('Escape');
  await startShogi(page, { seed: 'shots-strong', level: 8, side: 'Gote (White)' });
  await expect(page.locator('.moves .mv')).toHaveCount(1, { timeout: 30_000 });
  await shogiPlay(page, '3334', 'Gote');
  await expect(page.locator('.moves .mv')).toHaveCount(3, { timeout: 30_000 });
  await page.waitForTimeout(300);
  await shot(page, '02-shogi-level-8-game');

  const nine = testInfo.outputPath('nine.sgf');
  writeFileSync(nine, NINE);
  await openSgf(page, nine);
  await page.getByRole('button', { name: 'Show score and ownership' }).click();
  await expect(page.getByRole('img', { name: /21 of 21 positions read/ })).toBeVisible({ timeout: 30_000 });
  await page.locator('.go-insight').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await shot(page, '03-go-review-score-9x9');
  await page.getByRole('button', { name: 'Previous move' }).click();
  await page.getByRole('button', { name: 'Previous move' }).click();
  await page.waitForTimeout(300);
  await shot(page, '04-go-review-score-9x9-earlier');
  const nineteen = testInfo.outputPath('nineteen.sgf');
  writeFileSync(nineteen, NINETEEN);
  await openSgf(page, nineteen);
  await page.getByRole('button', { name: 'Show score and ownership' }).click();
  await expect(page.getByRole('img', { name: /17 of 17 positions read/ })).toBeVisible({ timeout: 30_000 });
  await page.locator('.go-insight').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await shot(page, '05-go-review-score-19x19');
});

test('milestone 15 screens: the chess opening trainer', async ({ page }) => {
  test.setTimeout(240_000);
  const italian = chessOpenings().find((o) => o.id === 'italian')!;
  await page.goto('/#/practice/chess/openings?id=line:italian');
  await expect(page.locator('.problem-title')).toBeVisible();
  await chessMove(page, italian.moves[0] ?? '');
  await page.waitForTimeout(900);
  await shot(page, '06-chess-opening-problem');
  await chessMove(page, italian.moves[2] ?? '');
  await page.waitForTimeout(900);
  await chessMove(page, italian.moves[4] ?? '');
  await expect(page.locator('.problem-note')).toBeVisible();
  await shot(page, '07-chess-opening-solved');
  await page.goto('/#/games/chess/practice');
  await page.getByRole('heading', { name: 'Openings' }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await shot(page, '08-chess-practice-openings');
  await page.goto('/#/practice/chess/drill-openings?seed=shots-open');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '09-chess-opening-drill');
  await page.goto('/#/games/chess/learn');
  await page.getByRole('radio', { name: 'Advanced' }).click();
  await page.waitForTimeout(200);
  await shot(page, '10-chess-learn-openings');
  await page.goto('/#/learn/chess.openings.open-white');
  const next = page.getByRole('button', { name: 'Next' });
  await next.click();
  await shot(page, '11-chess-opening-lesson-idea');
  for (let i = 0; i < 6; i++) {
    await expect(next).toBeEnabled({ timeout: 20_000 });
    await next.click();
  }
  await expect(page.locator('.lesson-text').last()).toContainText('Italian Game');
  await shot(page, '12-chess-opening-lesson-quiz');
});

test('milestone 15 screens: the shogi castle trainer', async ({ page }) => {
  test.setTimeout(240_000);
  const mino = CASTLES.find((c) => c.id === 'mino')!;
  await page.goto('/#/practice/shogi/shogi-castles?id=line:mino');
  await expect(page.locator('.problem-title')).toBeVisible();
  for (let ply = 0; ply < 10; ply += 2) {
    await shogiPlay(page, mino.moves[ply] ?? '');
    await page.waitForTimeout(900);
  }
  await shot(page, '13-shogi-castle-problem');
  const boat = CASTLES.find((c) => c.id === 'boat')!;
  await page.goto('/#/practice/shogi/shogi-castles?id=line:boat');
  await expect(page.locator('.problem-title')).toBeVisible();
  for (let ply = 0; ply < boat.moves.length; ply += 2) {
    await shogiPlay(page, boat.moves[ply] ?? '');
    await page.waitForTimeout(900);
  }
  await expect(page.locator('.problem-note')).toBeVisible();
  await shot(page, '14-shogi-castle-solved');
  await page.goto('/#/practice/shogi/drill-shogi-build?seed=shots-castle');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '15-shogi-castle-drill');
  await page.goto('/#/learn/shogi.castles.mino-family');
  const next = page.getByRole('button', { name: 'Next' });
  await next.click();
  await shot(page, '16-shogi-castle-lesson-idea');
  await next.click();
  await page.waitForTimeout(6_000);
  await shot(page, '17-shogi-castle-lesson-building');
  await page.goto('/#/games/shogi/practice');
  await page.getByRole('heading', { name: 'Build a castle' }).scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await shot(page, '18-shogi-practice-castles');
});

test('milestone 15 screens: Go joseki basics', async ({ page }) => {
  test.setTimeout(240_000);
  const attach = josekiLines().find((j) => j.id === 'komoku-attach')!;
  await page.goto('/#/practice/go/go-joseki?id=line:komoku-attach');
  await expect(page.locator('.problem-title')).toBeVisible();
  await point(page, goName(attach.moves[0] ?? '')).click();
  await page.waitForTimeout(900);
  await shot(page, '19-go-joseki-problem');
  await point(page, goName(attach.moves[2] ?? '')).click();
  await page.waitForTimeout(900);
  await point(page, goName(attach.moves[4] ?? '')).click();
  await expect(page.locator('.problem-note')).toBeVisible();
  await shot(page, '20-go-joseki-solved');
  await page.goto('/#/practice/go/drill-go-joseki?seed=shots-joseki');
  await expect(page.locator('.lesson-text')).toBeVisible();
  await shot(page, '21-go-joseki-drill');
  await page.goto('/#/learn/go.joseki.komoku');
  const next = page.getByRole('button', { name: 'Next' });
  await next.click();
  await shot(page, '22-go-joseki-lesson-idea');
  await page.goto('/#/settings');
  await page.getByText('Third-party software').click();
  await page.getByText('Fairy-Stockfish').scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await shot(page, '23-settings-third-party');
});
