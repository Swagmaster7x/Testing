import type { Page } from '@playwright/test';
import { searchState } from '../../src/games/shogi/bots';
import { canonicalOf } from '../../src/games/shogi/notation';
import { canonicalAction, shogi } from '../../src/games/shogi/rules';
import { expect } from './fixtures';

export const square = (page: Page, name: string) => page.locator(`svg.grid-board rect.sq-hit[aria-label^="${name},"]`);
export const sfen = (page: Page) => page.locator('svg.grid-board').getAttribute('data-position');
export const hand = (page: Page, side: 'Sente' | 'Gote') => page.getByRole('group', { name: new RegExp(`^${side}.s pieces in hand$`) });

const PIECE: Record<string, string> = { P: 'pawn', L: 'lance', N: 'knight', S: 'silver', G: 'gold', B: 'bishop', R: 'rook' };

export async function startShogi(page: Page, options: { seed: string; level?: number; side?: 'Sente (Black)' | 'Gote (White)'; fen?: string; preset?: string }) {
  const fenPart = options.fen ? `&fen=${encodeURIComponent(options.fen)}` : '';
  await page.goto(`/#/games/shogi?seed=${options.seed}${fenPart}`);
  await page.getByRole('button', { name: /^Play/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('radiogroup', { name: 'CPU level' }).getByRole('radio', { name: String(options.level ?? 1), exact: true }).click();
  await dialog.getByRole('radio', { name: options.side ?? 'Sente (Black)', exact: true }).click();
  if (options.preset) await dialog.locator('#play-preset').selectOption(options.preset);
  await dialog.getByRole('radiogroup', { name: 'Clock' }).getByRole('radio', { name: 'None', exact: true }).click();
  await dialog.getByRole('button', { name: /^(Start|New game)$/ }).click();
  await expect(page).toHaveURL(/#\/play\/g_/);
}

/** Plays a move in the app's notation ("7776", "8822+", "P*55") by tapping, as a person would. */
export async function play(page: Page, move: string, side: 'Sente' | 'Gote' = 'Sente') {
  const drop = /^([PLNSGBR])\*(\d\d)$/.exec(move);
  if (drop) {
    await hand(page, side).getByRole('button', { name: new RegExp(`^${PIECE[drop[1] ?? 'P']} in hand`) }).click();
    await square(page, drop[2] ?? '').click();
    return;
  }
  const m = /^(\d\d)(\d\d)(\+?)$/.exec(move);
  if (!m) throw new Error(`not a move: ${move}`);
  const position = (await sfen(page)) ?? '';
  const state = shogi.codec.state.fromText(position);
  const legal = shogi.legal(state, shogi.turn(state) ?? 0).map(canonicalAction);
  const choice = legal.includes(`${m[1]}${m[2]}`) && legal.includes(`${m[1]}${m[2]}+`);
  await square(page, m[1] ?? '').click();
  await square(page, m[2] ?? '').click();
  if (choice) await page.getByRole('button', { name: m[3] ? 'Promote' : 'Do not promote', exact: true }).click();
}

/** Plays the person's side with the built-in engine until the game ends or `maxPlies` moves are made. */
export async function playWithEngine(page: Page, options: { maxPlies?: number; nodes?: number } = {}): Promise<void> {
  const turn = page.locator('.status-turn');
  for (let ply = 0; ply < (options.maxPlies ?? 160); ply++) {
    await expect(turn).toHaveText(/Your move|Game over/, { timeout: 30_000 });
    if ((await turn.textContent())?.includes('Game over')) return;
    const position = await sfen(page);
    if (!position) throw new Error('no position on the board');
    const state = shogi.codec.state.fromText(position);
    const { result, p } = searchState(state, { nodes: options.nodes ?? 20_000 });
    const side = shogi.turn(state) === 1 ? 'Gote' : 'Sente';
    await play(page, canonicalOf(p.geo, result.best), side);
    await expect.poll(() => sfen(page)).not.toBe(position);
  }
}
