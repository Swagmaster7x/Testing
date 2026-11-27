/** Tile, end and seat names in the interface. */
import type { Seat } from '../../../core/contract';
import type { SeatNames } from '../../types';
import { t } from '../../../text';
import type { DominoesConfig, End, HandResult, Tile } from '../rules';
import { isDouble, pipsOf, sideCount, sideOf } from '../rules';

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

/** A finished hand in a sentence, as seen from `me` (the banner at the end of a hand, and the coach's "last hand"). */
export function handResultText(r: HandResult, me: Seat, n: number, config: Pick<DominoesConfig, 'blockedWinner'>, names?: SeatNames): string {
  const side = sideOf(me, n);
  if (r.reason === 'target') return t(r.winner === side ? 'dominoes.hand.we-target' : 'dominoes.hand.they-target', { n: r.points[r.winner ?? 0] ?? 0 });
  if (r.winner === null) return r.split ? t('dominoes.hand.split', { n: r.points[r.split[0] ?? 0] ?? 0 }) : t('dominoes.hand.tie');
  const points = r.points[r.winner] ?? 0;
  if (sideCount(n) > 2 && r.winner !== side) return t(r.reason === 'domino' ? 'dominoes.hand.other-domino' : 'dominoes.hand.other-block', { who: seatName(r.winner, me, n, names), n: points });
  if (r.reason === 'blocked' && config.blockedWinner === 'player' && n === 4) {
    // The lightest single hand won it: name that player.
    let low = -1;
    r.pips.forEach((p, seat) => {
      if (sideOf(seat, n) === r.winner && (low < 0 || p < (r.pips[low] ?? Infinity))) low = seat;
    });
    return t(r.winner === side ? 'dominoes.hand.we-player-block' : 'dominoes.hand.they-player-block', { who: seatName(low, me, n, names), n: points });
  }
  return t(r.winner === side ? (r.reason === 'domino' ? 'dominoes.hand.we-domino' : 'dominoes.hand.we-block') : r.reason === 'domino' ? 'dominoes.hand.they-domino' : 'dominoes.hand.they-block', { n: points });
}
