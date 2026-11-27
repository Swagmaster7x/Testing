import { outcomePoints } from '../core/contract';
import type { GameRecord } from '../core/record';
import { humanSeats } from '../core/record';
import type { MessageKey } from '../text';

/** How a finished game went for the person who played it. */
export function resultFor(record: GameRecord): MessageKey {
  if (!record.outcome) return 'result.draw';
  const seat = humanSeats(record)[0] ?? 0;
  if (record.resigned === seat) return 'result.resigned';
  const points = outcomePoints(record.outcome, seat);
  return points > 0.5 ? 'result.win' : points < 0.5 ? 'result.loss' : 'result.draw';
}
