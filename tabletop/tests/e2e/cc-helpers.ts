import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { holeName } from '../../src/games/chinese-checkers/board';
import { homeComplete, seatCost } from '../../src/games/chinese-checkers/engine';
import { boardArray, chineseCheckers, layoutOf, legalMoves } from '../../src/games/chinese-checkers/rules';
import { expect } from './fixtures';

/** A hole on the star by name: "5e". Its label reads "5e, empty" or "5e, Red marble". */
export const hole = (page: Page, name: string) => page.locator(`svg.sb circle.sb-hit[aria-label^="${name},"]`);

export interface CcStart {
  readonly seed: string;
  readonly level?: number;
  readonly side?: 'Red, moves first' | 'Blue' | 'Either';
  /** A preset under "Rules at this table": "Three players", "Six players", ... */
  readonly preset?: string;
  /** A starting position in the game's notation (a link like #/games/chinese-checkers?position=...). */
  readonly position?: string;
}

export async function startCc(page: Page, options: CcStart): Promise<void> {
  const query = new URLSearchParams({ seed: options.seed });
  if (options.position) query.set('position', options.position);
  await page.goto(`/#/games/chinese-checkers?${query.toString()}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(options.level ?? 1), exact: true }).click();
  await dialog.getByRole('radio', { name: options.side ?? 'Red, moves first', exact: true }).click();
  if (options.preset) await dialog.getByRole('radiogroup', { name: 'Rules at this table' }).getByRole('radio', { name: options.preset, exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** The move a careful player makes: one that finishes, else the one that leaves them nearest home. */
export function goodMove(position: string): { from: string; to: string } | 'pass' {
  const state = chineseCheckers.codec.state.fromText(position);
  const seat = state.toMove;
  const layout = layoutOf(state);
  const board = boardArray(state.board);
  let best: { from: number; to: number; cost: number } | null = null;
  for (const m of legalMoves(state)) {
    if (m >= 0x10000) return 'pass';
    const from = m & 0xff;
    const to = (m >> 8) & 0xff;
    board[to] = board[from] as number;
    board[from] = 0;
    const cost = homeComplete(board, seat, layout, state.rules.finish) ? -Infinity : seatCost(board, seat, layout);
    board[from] = board[to];
    board[to] = 0;
    if (!best || cost < best.cost) best = { from, to, cost };
  }
  if (!best) return 'pass';
  return { from: holeName(best.from), to: holeName(best.to) };
}

/** Plays the person's moves (a careful player) until the game is over. Returns how many were played. */
export async function playCcToEnd(page: Page, turnPattern: RegExp = /Your move|Game over/, limit = 120): Promise<number> {
  const turn = page.locator('.status-turn');
  let moves = 0;
  for (let guard = 0; guard < limit; guard++) {
    await expect(turn).toHaveText(turnPattern, { timeout: 45_000 });
    if ((await turn.textContent())?.includes('Game over')) return moves;
    const position = (await page.locator('.cc-surface').getAttribute('data-state')) ?? '';
    const move = goodMove(position);
    if (move === 'pass') await page.getByRole('button', { name: 'Pass', exact: true }).click();
    else {
      await hole(page, move.from).click();
      await hole(page, move.to).click();
    }
    moves++;
    await expect(page.locator('.cc-surface')).not.toHaveAttribute('data-state', position, { timeout: 15_000 });
  }
  throw new Error('The Chinese Checkers game did not end');
}

interface ProblemFile {
  readonly problems: readonly (readonly [string, string, string, number, string, string?])[];
}

/** Problems from the generated sets, for tests that solve one: the first move as hole names. */
export function ccProblems(): { id: string; position: string; from: string; to: string; themes: string[] }[] {
  const file = JSON.parse(readFileSync('src/games/chinese-checkers/practice/problems.json', 'utf8')) as ProblemFile;
  return file.problems.map(([id, position, line, , themes]) => {
    const action = chineseCheckers.codec.action.fromJSON(line.split(' ')[0] ?? '');
    if (action.type !== 'move') throw new Error('a problem starts with a move');
    return { id, position, from: holeName(action.from), to: holeName(action.to), themes: themes.split(' ') };
  });
}
