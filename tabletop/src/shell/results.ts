import { outcomePoints } from '../core/contract';
import type { GameRecord } from '../core/record';
import { humanSeats, isPassAndPlay } from '../core/record';
import type { AnyGameUi } from '../games/types';
import type { MessageKey } from '../text';
import { t, tDynamic } from '../text';
import { namesFor, peopleResult, seatLabel } from './table/passplay';

/** How a finished game went for the person who played it. */
export function resultFor(record: GameRecord): MessageKey {
  if (!record.outcome) return 'result.unfinished';
  const seat = humanSeats(record)[0] ?? 0;
  if (record.ending?.kind === 'resigned' && record.ending.seat === seat) return 'result.resigned';
  if (record.ending?.kind === 'timeout' && record.ending.seat === seat && outcomePoints(record.outcome, seat) < 0.5) return 'result.timeout';
  const points = outcomePoints(record.outcome, seat);
  return points > 0.5 ? 'result.win' : points < 0.5 ? 'result.loss' : 'result.draw';
}

/**
 * The result in a few words: by name in pass-and-play ("Ana wins"), by place when one person
 * played several others ("You came third"), otherwise win, loss or draw.
 */
export function resultTitle(ui: AnyGameUi, record: GameRecord): string {
  if (!record.outcome) return t('result.unfinished');
  if (isPassAndPlay(record)) {
    const names = namesFor(record, null);
    return peopleResult(record, (seat) => seatLabel(ui, record, seat, [], names));
  }
  const key = resultFor(record);
  const outcome = record.outcome;
  const several = outcome.results.length > 2 && !(outcome.teams && outcome.teams.some((team) => team.length > 1));
  if (several && key !== 'result.resigned' && key !== 'result.timeout') {
    const seat = humanSeats(record)[0] ?? 0;
    const place = outcome.results.find((r) => r.seat === seat)?.place ?? 1;
    if (place > 1) return t('result.place', { place: tDynamic(`ordinal.${place}`) });
  }
  return t(key);
}
