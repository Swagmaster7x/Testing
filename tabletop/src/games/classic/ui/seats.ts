/** Seat names at the four-seat card tables: you, left, across (or partner), right; a person's own name in pass-and-play. */
import type { Seat } from '../../../core/contract';
import { t } from '../../../text';
import type { SeatNames } from '../../types';

export function seatLabel(seat: Seat, me: Seat, names?: SeatNames, partners = false): string {
  const rel = (seat - me + 4) % 4;
  if (rel === 0) return t('classic.seat.you');
  const person = names?.(seat);
  if (person) return person;
  if (rel === 1) return t('classic.seat.left');
  if (rel === 2) return partners ? t('classic.seat.partner') : t('classic.seat.across');
  return t('classic.seat.right');
}

/** The subject of a log line ("You", "Left", or a person's name). */
export const whoLabel = seatLabel;

/** The person holding the device (the first of the seats played at it). */
export const meOf = (mySeats?: readonly Seat[]): Seat => mySeats?.[0] ?? 0;
