/** Tile, end and seat names in the interface. */
import type { Seat } from '../../../core/contract';
import type { SeatNames } from '../../types';
import { t } from '../../../text';
import type { End, Tile } from '../rules';
import { isDouble, pipsOf } from '../rules';

export function tileLabel(tile: Tile): string {
  const [a, b] = pipsOf(tile);
  return isDouble(tile) ? t('dominoes.tile.double', { a }) : t('dominoes.tile', { a, b });
}

const END_KEYS = { left: 'dominoes.end.left', right: 'dominoes.end.right', up: 'dominoes.end.up', down: 'dominoes.end.down' } as const;

export function endName(end: End, value: number): string {
  return t(END_KEYS[end], { n: value });
}

/** A seat's name as seen from `me`: you, partner, right, left (or the CPU with two players; right and left with three); another person's name at a pass-and-play table. */
export function seatName(seat: Seat, me: Seat, n: number, names?: SeatNames): string {
  const rel = (seat - me + n) % n;
  if (rel === 0) return t('dominoes.seat.you');
  const person = names?.(seat);
  if (person) return person;
  if (n === 2) return t('dominoes.seat.cpu');
  if (n === 3) return t(rel === 1 ? 'dominoes.seat.right' : 'dominoes.seat.left');
  return t(rel === 1 ? 'dominoes.seat.right' : rel === 2 ? 'dominoes.seat.partner' : 'dominoes.seat.left');
}

/** The subject of a log line: you, your partner, right, left, the CPU, or another person by name. */
export function whoName(seat: Seat, me: Seat, n: number, names?: SeatNames): string {
  const rel = (seat - me + n) % n;
  if (rel === 0) return t('dominoes.who.you');
  const person = names?.(seat);
  if (person) return person;
  if (n === 2) return t('dominoes.who.cpu');
  if (n === 3) return t(rel === 1 ? 'dominoes.who.right' : 'dominoes.who.left');
  return t(rel === 1 ? 'dominoes.who.right' : rel === 2 ? 'dominoes.who.partner' : 'dominoes.who.left');
}
