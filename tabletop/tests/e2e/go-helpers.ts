import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { expect } from './fixtures';

/** A point on the Go board, by name: "D4". Its label reads "D4, empty" or "D4, black stone". */
export const point = (page: Page, name: string) => page.locator(`svg.ib rect.ib-hit[aria-label^="${name},"]`);

export interface GoStart {
  readonly seed: string;
  readonly level?: number;
  readonly side?: 'Black, moves first' | 'White' | 'Either';
  readonly size?: 9 | 13 | 19;
  readonly preset?: string;
  readonly handicap?: number;
}

/** Opens the Go hub and starts a game with a fixed seed, choosing the rules at this table. */
export async function startGo(page: Page, options: GoStart): Promise<void> {
  await page.goto(`/#/games/go?seed=${options.seed}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(options.level ?? 1), exact: true }).click();
  await dialog.getByRole('radio', { name: options.side ?? 'Black, moves first', exact: true }).click();
  await dialog.getByRole('radiogroup', { name: 'Board' }).getByRole('radio', { name: `${options.size ?? 9}×${options.size ?? 9}`, exact: true }).click();
  if (options.preset) await dialog.getByLabel('Rules', { exact: true }).selectOption({ label: options.preset });
  if (options.handicap) await dialog.getByRole('radiogroup', { name: 'Handicap' }).getByRole('radio', { name: String(options.handicap), exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/**
 * Plays the person's side to the end: the scripted points while they are free, then passes,
 * and "Done" while counting. Returns the number of stones placed.
 */
export async function playGoToEnd(page: Page, script: readonly string[]): Promise<number> {
  const turn = page.locator('.status-turn');
  const queue = [...script];
  let stones = 0;
  for (let guard = 0; guard < 120; guard++) {
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 45_000 });
    if ((await turn.textContent())?.includes('Game over')) return stones;
    const done = page.getByRole('button', { name: 'Done', exact: true });
    if (await done.isVisible()) {
      await done.click();
    } else {
      let played = false;
      while (queue.length > 0 && !played) {
        const name = queue.shift() as string;
        const cell = point(page, name);
        const label = (await cell.getAttribute('aria-label')) ?? '';
        if (label.endsWith('empty') && (await cell.getAttribute('aria-disabled')) === 'false') {
          await cell.click();
          stones++;
          played = true;
        }
      }
      if (!played) await page.getByRole('button', { name: 'Pass', exact: true }).click();
    }
    await expect(turn).not.toHaveText('Your move', { timeout: 5_000 }).catch(() => undefined);
  }
  throw new Error('The Go game did not end');
}

interface ProblemFile {
  readonly problems: readonly (readonly [string, string, string, number, string])[];
}

/** Problems from the generated set, for tests that solve one. */
export function goProblems(): { id: string; line: string[]; themes: string[] }[] {
  const file = JSON.parse(readFileSync('src/games/go/practice/problems.json', 'utf8')) as ProblemFile;
  return file.problems.map(([id, , line, , themes]) => ({ id, line: line.split(' '), themes: themes.split(' ') }));
}

/** Plays a problem's line: the student's moves, waiting for each reply. */
export async function solveGoProblem(page: Page, line: readonly string[]): Promise<void> {
  for (let i = 0; i < line.length; i += 2) {
    const cell = point(page, line[i] as string);
    await expect(cell).toHaveAttribute('aria-disabled', 'false', { timeout: 15_000 });
    await cell.click();
  }
}
