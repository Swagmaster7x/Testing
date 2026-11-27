/**
 * The Games shelf (PLAN.md 1.2): the eight launch games, grouped as cards, boards and tiles,
 * with the milestone each one arrives in. The noughts-and-crosses fixture is not on the shelf.
 */
export type GameGroup = 'cards' | 'boards' | 'tiles';

export interface CatalogGame {
  readonly id: string;
  readonly group: GameGroup;
  /** The milestone in which it can first be played. */
  readonly milestone: number;
  /** True once its table is built. */
  readonly playable: boolean;
  readonly onShelf: boolean;
}

export const GROUPS: readonly GameGroup[] = ['cards', 'boards', 'tiles'];

export const CATALOG: readonly CatalogGame[] = [
  { id: 'brisca', group: 'cards', milestone: 3, playable: true, onShelf: true },
  { id: 'poker', group: 'cards', milestone: 5, playable: true, onShelf: true },
  { id: 'chess', group: 'boards', milestone: 1, playable: true, onShelf: true },
  { id: 'go', group: 'boards', milestone: 6, playable: true, onShelf: true },
  { id: 'chinese-checkers', group: 'boards', milestone: 7, playable: false, onShelf: true },
  { id: 'shogi', group: 'boards', milestone: 8, playable: true, onShelf: true },
  { id: 'dominoes', group: 'tiles', milestone: 4, playable: true, onShelf: true },
  { id: 'mahjong', group: 'tiles', milestone: 9, playable: false, onShelf: true },
  { id: 'noughts', group: 'boards', milestone: 0, playable: true, onShelf: false },
];

export const SHELF = CATALOG.filter((g) => g.onShelf);

export function catalogGame(id: string): CatalogGame | undefined {
  return CATALOG.find((g) => g.id === id);
}

/** The shelf game that arrives soonest and is not built yet. */
export function nextUp(): CatalogGame | undefined {
  return SHELF.filter((g) => !g.playable).sort((a, b) => a.milestone - b.milestone)[0];
}
