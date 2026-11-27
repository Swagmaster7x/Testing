/** A seat's mark in the player list for the classic card games: a small card back in the seat's colour. */
import type { Seat } from '../../../core/contract';

const COLOURS = ['#e7c27a', '#c0392b', '#1d63b8', '#2b7a35'];

export function FrenchSeatMark({ seat }: { seat: Seat }) {
  const colour = COLOURS[seat % COLOURS.length] as string;
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <rect x="5" y="2.5" width="14" height="19" rx="2.5" fill={colour} stroke="rgb(0 0 0 / 0.5)" />
      <rect x="7.5" y="5" width="9" height="14" rx="1.5" fill="none" stroke="#fbf8f1" strokeWidth="1.2" opacity="0.85" />
    </svg>
  );
}
