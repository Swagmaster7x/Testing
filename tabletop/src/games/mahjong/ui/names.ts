/** Tile, seat and pattern names in the interface. */
import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { MahjongAction } from '../core/engine';
import type { Kind, TileId } from '../core/tiles';
import { kindOf, rankOf, SUIT_LETTERS, suitOf } from '../core/tiles';

/** "5 dots", "East wind", "Plum (flower 1)". */
export function kindName(kind: Kind): string {
  const suit = suitOf(kind);
  if (suit < 3) return tDynamic(`mahjong.suit.${SUIT_LETTERS[suit] ?? 'm'}`, { n: rankOf(kind) });
  return tDynamic(`mahjong.tile.${kind}`);
}

export function tileName(id: TileId): string {
  return kindName(kindOf(id));
}

/** Three tiles of a run, "3-4-5 bamboo". */
export function runName(start: Kind): string {
  const suit = suitOf(start);
  const r = rankOf(start);
  return tDynamic(`mahjong.suit.${SUIT_LETTERS[suit] ?? 'm'}`, { n: `${r}-${r + 1}-${r + 2}` });
}

/** Where a seat sits, counted from you: 0 you, 1 right, 2 across, 3 left. */
export function relative(seat: Seat, me: Seat): number {
  return (seat - me + 4) % 4;
}

export function seatName(seat: Seat, me: Seat): string {
  return t((['mahjong.seat.you', 'mahjong.seat.right', 'mahjong.seat.across', 'mahjong.seat.left'] as const)[relative(seat, me)] ?? 'mahjong.seat.you');
}

export function whoName(seat: Seat, me: Seat): string {
  return t((['mahjong.who.you', 'mahjong.who.right', 'mahjong.who.across', 'mahjong.who.left'] as const)[relative(seat, me)] ?? 'mahjong.who.you');
}

export function windName(wind: number): string {
  return tDynamic(`mahjong.wind.${((wind % 4) + 4) % 4}`);
}

export function patternName(id: string): string {
  return tDynamic(`mahjong.pattern.${id}`);
}

/** How a move reads in the move list. */
export function moveName(action: MahjongAction): string {
  switch (action.type) {
    case 'discard':
      return kindName(action.tile);
    case 'kong':
      return action.tile === undefined ? t('mahjong.move.kong-call') : t('mahjong.move.kong', { tile: kindName(action.tile) });
    case 'chow':
      return t('mahjong.move.chow', { tiles: runName(action.start) });
    case 'pung':
      return t('mahjong.move.pung');
    case 'win':
      return t('mahjong.move.win');
    case 'pass':
      return t('mahjong.move.pass');
    case 'next':
      return t('mahjong.move.next');
    case 'ready':
      return t('mahjong.move.ready', { tile: kindName(action.tile) });
    case 'abort':
      return t('mahjong.move.abort');
  }
}
