import { humanSeats } from '../../core/record';
import type { GameRecord } from '../../core/record';
import type { AnyGameUi } from '../../games/types';
import { t } from '../../text';

/** A player's name: the game's own ("Partner", "Right") or "You" / "CPU". */
export function playerName(ui: AnyGameUi, record: GameRecord, seat: number): string {
  if (ui.playerName) return ui.playerName(seat, humanSeats(record), record.players.length);
  return record.players[seat]?.kind === 'bot' ? t('common.cpu') : t('common.you');
}

/** A CPU seat's level, and once the game is over what it turned out to be (poker: its style). */
export function levelAndReveal(ui: AnyGameUi, start: unknown, record: GameRecord, seat: number, over: boolean): string {
  const level = t('common.level', { n: record.players[seat]?.level ?? 1 });
  const reveal = over ? (ui.revealSeat?.(start, record, seat) ?? null) : null;
  return reveal ? `${level} · ${reveal}` : level;
}
