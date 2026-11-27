import { humanSeats } from '../../core/record';
import type { GameRecord } from '../../core/record';
import type { AnyGameUi } from '../../games/types';
import { t } from '../../text';

/** A player's name: the game's own ("Partner", "Right") or "You" / "CPU". */
export function playerName(ui: AnyGameUi, record: GameRecord, seat: number): string {
  if (ui.playerName) return ui.playerName(seat, humanSeats(record), record.players.length);
  return record.players[seat]?.kind === 'bot' ? t('common.cpu') : t('common.you');
}
