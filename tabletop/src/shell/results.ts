import { outcomePoints } from '../core/contract';
import type { GameRecord } from '../core/record';
import { humanSeats } from '../core/record';
import type { MessageKey } from '../text';

/** How a finished game went for the person who played it. */
export function resultFor(record: GameRecord): MessageKey {
  if (!record.outcome) return 'result.unfinished';
  const seat = humanSeats(record)[0] ?? 0;
  if (record.ending?.kind === 'resigned' && record.ending.seat === seat) return 'result.resigned';
  if (record.ending?.kind === 'timeout' && record.ending.seat === seat && outcomePoints(record.outcome, seat) < 0.5) return 'result.timeout';
  const points = outcomePoints(record.outcome, seat);
  return points > 0.5 ? 'result.win' : points < 0.5 ? 'result.loss' : 'result.draw';
}
