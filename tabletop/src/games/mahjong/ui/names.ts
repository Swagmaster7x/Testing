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

/** A hand's value in its style's unit: "3 faan", "2 han", "12 points", "5 tai". */
export function valueName(unit: string, n: number): string {
  return tDynamic(`mahjong.unit.${unit}`, { n });
}

/** The unit a style counts hands in (its scorer's `unit`), for screens that have no score at hand. */
export function unitOf(style: string): string {
  return ({ riichi: 'han', 'chinese-official': 'mcr', taiwanese: 'tai', sichuan: 'fan', american: 'points' } as Record<string, string>)[style] ?? 'faan';
}

/** Styles whose table words are Mandarin (hú, zìmō) rather than Cantonese or Japanese. */
export function mandarin(style: string): boolean {
  return style === 'chinese-official' || style === 'taiwanese';
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
    case 'pass-tiles':
      return action.blind > 0 ? t('mahjong.move.pass-blind', { n: action.tiles.length, blind: action.blind }) : t('mahjong.move.pass-tiles', { n: action.tiles.length });
    case 'vote':
      return t(action.yes ? 'mahjong.move.vote-yes' : 'mahjong.move.vote-no');
    case 'void':
      return t('mahjong.move.void', { suit: suitName(action.suit) });
    case 'expose':
      return action.jokers > 1 ? t('mahjong.move.expose-jokers', { set: setName(action.size), n: action.jokers }) : action.jokers === 1 ? t('mahjong.move.expose-joker', { set: setName(action.size) }) : t('mahjong.move.expose', { set: setName(action.size) });
    case 'swap':
      return t('mahjong.move.swap');
  }
}

/** A set by its size: "pung", "kong", "quint", "sextet". */
export function setName(size: number): string {
  return tDynamic(`mahjong.set.${Math.max(3, Math.min(6, size))}`);
}

/** A suit by number: "characters", "dots", "bamboo". */
export function suitName(suit: number): string {
  return tDynamic(`mahjong.suit-name.${suit}`);
}

/** A direction tiles are passed in, from the passer: 1 right, 2 across, 3 left. */
export function directionName(dir: number): string {
  return tDynamic(`mahjong.dir.${dir}`);
}
