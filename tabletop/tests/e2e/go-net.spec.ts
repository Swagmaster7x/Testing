// Milestone 15, trial 2: the Go review's score and ownership map from a small KataGo network,
// read in the bot worker. A 9×9 and a 19×19 game are opened from SGF files; the 19×19 position
// is also read with the processor slowed four times, as on a mid-range phone.
import { writeFileSync } from 'node:fs';
import type { Page } from '@playwright/test';
import { expect, noHorizontalScroll, test } from './fixtures';

const NINE = '(;GM[1]FF[4]SZ[9]KM[7]RU[Chinese]PB[Black]PW[White];B[ee];W[gc];B[cg];W[ce];B[eg];W[gg];B[ge];W[cc];B[dd];W[fd];B[fe];W[dc];B[ed];W[ec];B[hd];W[hc];B[gf];W[bg];B[bh];W[bf])';
const NINETEEN = '(;GM[1]FF[4]SZ[19]KM[6.5]RU[Japanese]PB[Black]PW[White];B[pd];W[dp];B[pp];W[dd];B[fq];W[cn];B[jp];W[qf];B[nc];W[rd];B[qc];W[qi];B[qk];W[oi])';

async function openSgf(page: Page, file: string): Promise<void> {
  await page.goto('/#/games/go');
  await page.getByRole('button', { name: /^Review/ }).click();
  const chooser = page.waitForEvent('filechooser');
  await page.getByRole('button', { name: 'Open a game file' }).click();
  await (await chooser).setFiles(file);
  await expect(page).toHaveURL(/#\/review\//);
}

test.describe('Go review: score and ownership from the network', () => {
  test('reads every position of a 9×9 game, draws who owns what, and graphs the lead', async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const file = testInfo.outputPath('nine.sgf');
    writeFileSync(file, NINE);
    await openSgf(page, file);
    await expect(page.locator('.ply-label')).toHaveText('Move 20 of 20');
    await page.getByRole('button', { name: 'Show score and ownership' }).click();
    await expect(page.locator('.go-insight-lead')).toHaveText(/leads by|About even/, { timeout: 20_000 });
    await expect(page.locator('rect.ib-own-black').first()).toBeVisible();
    await expect(page.locator('rect.ib-own-white').first()).toBeVisible();
    await expect(page.getByRole('img', { name: /21 of 21 positions read/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.faint', { hasText: /Chances: Black \d+%, White \d+%/ })).toBeVisible();
    // Stepping back reads that position at once (it is already in the graph).
    await page.getByRole('button', { name: 'First position' }).click();
    await expect(page.locator('.go-insight-lead')).toHaveText(/leads by|About even/);
    await noHorizontalScroll(page);
    await page.getByRole('button', { name: 'Hide score and ownership' }).click();
    await expect(page.locator('rect.ib-own-black')).toHaveCount(0);
  });

  test('reads a 19×19 position quickly, also with the processor slowed four times', async ({ page, browser }, testInfo) => {
    test.skip(testInfo.project.name !== 'phone', 'Speed does not depend on the layout');
    test.setTimeout(120_000);
    const first = testInfo.outputPath('nineteen.sgf');
    writeFileSync(first, NINETEEN);
    await openSgf(page, first);
    let started = Date.now();
    await page.getByRole('button', { name: 'Show score and ownership' }).click();
    await expect(page.locator('.go-insight-lead')).toHaveText(/leads by|About even/, { timeout: 30_000 });
    const fullSpeed = Date.now() - started;
    await expect(page.getByRole('img', { name: /15 of 15 positions read/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('rect.ib-own-black').first()).toBeVisible();

    // Now slow the page and its workers (the bot worker is running) four times, and open another game.
    const cdp = await browser.newBrowserCDPSession();
    const { targetInfos } = await cdp.send('Target.getTargets');
    const slowed: string[] = [];
    for (const target of targetInfos.filter((t) => t.type === 'page' || t.type === 'worker')) {
      const { sessionId } = await cdp.send('Target.attachToTarget', { targetId: target.targetId, flatten: false });
      await cdp.send('Target.sendMessageToTarget', { sessionId, message: JSON.stringify({ id: 1, method: 'Emulation.setCPUThrottlingRate', params: { rate: 4 } }) });
      slowed.push(target.type === 'worker' ? `worker ${target.url.split('/').pop() ?? ''}` : 'page');
    }
    const second = testInfo.outputPath('nineteen-2.sgf');
    writeFileSync(second, NINETEEN.replace(';W[oi])', ';W[oi];B[ok];W[ql])'));
    await openSgf(page, second);
    started = Date.now();
    await page.getByRole('button', { name: 'Show score and ownership' }).click();
    await expect(page.locator('.go-insight-lead')).toHaveText(/leads by|About even/, { timeout: 60_000 });
    const slow = Date.now() - started;
    const note = `19×19: ${fullSpeed} ms at full speed (network loading included), ${slow} ms slowed four times (${slowed.join('; ')})`;
    testInfo.annotations.push({ type: 'go-net-speed', description: note });
    console.log(note);
    expect(slow).toBeLessThan(15_000);
  });
});
