import { readFileSync } from 'node:fs';
import { expect, playToEnd, startFixtureGame, test } from './fixtures';

test.describe('offline install and backup', () => {
  test('works with no network after the first visit, bot included', async ({ page, context }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Today' })).toBeVisible();
    await page.evaluate(async () => {
      await navigator.serviceWorker.ready;
    });
    await context.setOffline(true);
    try {
      await page.reload();
      await expect(page.getByRole('heading', { level: 1, name: 'Today' })).toBeVisible();
      await startFixtureGame(page, { seed: 'e2e-offline', level: 2, side: 'X, moves first' });
      await page.getByRole('button', { name: 'b2, empty', exact: true }).click();
      await expect(page.locator('.status-turn')).toHaveText('Your move', { timeout: 10_000 });
      await expect(page.locator('.moves .mv')).toHaveCount(2);
    } finally {
      await context.setOffline(false);
    }
  });

  test('exports everything to one file and imports it back', async ({ page }, testInfo) => {
    await startFixtureGame(page, { seed: 'e2e-backup', level: 1, side: 'X, moves first' });
    await playToEnd(page);
    await page.goto('/#/games/chess');
    await page.getByRole('button', { name: 'Add to focus' }).click();
    await expect(page.getByRole('button', { name: 'In focus' })).toBeVisible();

    await page.goto('/#/settings');
    const download = page.waitForEvent('download');
    await page.getByRole('button', { name: 'Export', exact: true }).click();
    const file = testInfo.outputPath('backup.json');
    await (await download).saveAs(file);
    const backup = JSON.parse(readFileSync(file, 'utf8')) as { format: string; formatVersion: number; tables: Record<string, unknown[]> };
    expect(backup.format).toBe('tabletop-backup');
    expect(backup.formatVersion).toBe(1);
    expect(backup.tables.records).toHaveLength(1);
    expect(backup.tables.profiles).toHaveLength(1);

    // Wipe the device, as a new phone would be.
    await page.evaluate(
      () =>
        new Promise<void>((resolve, reject) => {
          const req = indexedDB.deleteDatabase('tabletop');
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error ?? new Error('delete failed'));
          req.onblocked = () => resolve();
        }),
    );
    await page.goto('/#/today');
    await page.reload();
    await expect(page.getByText('Pick up to three games you are studying now.')).toBeVisible();

    await page.goto('/#/settings');
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    await (await chooser).setFiles(file);
    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toContainText('1 profile');
    await expect(dialog).toContainText('1 saved game');
    await dialog.getByRole('button', { name: 'Replace' }).click();
    await expect(page.getByRole('status')).toContainText('Backup imported');

    await page.goto('/#/today');
    await expect(page.locator('.focus-row', { hasText: 'Chess' })).toBeVisible();
    await page.goto('/#/games/noughts');
    await expect(page.locator('.door', { hasText: 'Review' })).toContainText('1 finished game');
  });

  test('refuses a file that is not a backup, and changes nothing', async ({ page }, testInfo) => {
    const file = testInfo.outputPath('not-a-backup.json');
    const { writeFileSync } = await import('node:fs');
    writeFileSync(file, '{"hello": "world"}');
    await page.goto('/#/settings');
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    await (await chooser).setFiles(file);
    await expect(page.getByRole('status')).toContainText('not a backup');
    await expect(page.getByRole('alertdialog')).toHaveCount(0);
  });
});
