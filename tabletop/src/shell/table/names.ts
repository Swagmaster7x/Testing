import type { Seat } from '../../core/contract';
import { humanSeats } from '../../core/record';
import type { GameRecord } from '../../core/record';
import type { AnyGameUi } from '../../games/types';
import { t } from '../../text';
import { namesFor, seatLabel } from './passplay';

/**
 * A player's name: a person's name at a pass-and-play table, the game's own ("Partner", "Right"),
 * or "You" / "CPU". `viewSeats` is whose table it is now (the person holding the device).
 */
export function playerName(ui: AnyGameUi, record: GameRecord, seat: Seat, viewSeats?: readonly Seat[]): string {
  const view = viewSeats ?? humanSeats(record);
  return seatLabel(ui, record, seat, view, namesFor(record, view[0] ?? null));
}

/** A CPU seat's level, and once the game is over what it turned out to be (poker: its style). */
export function levelAndReveal(ui: AnyGameUi, start: unknown, record: GameRecord, seat: number, over: boolean): string {
  const level = t('common.level', { n: record.players[seat]?.level ?? 1 });
  const reveal = over ? (ui.revealSeat?.(start, record, seat) ?? null) : null;
  return reveal ? `${level} · ${reveal}` : level;
}
