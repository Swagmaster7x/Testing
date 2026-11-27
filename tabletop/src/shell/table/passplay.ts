/**
 * Pass-and-play (PLAN.md 1.1, point 10): several people share one device, each seat a person or the
 * CPU. Every game gets it from the shell: the table shows the board or the hand of the person whose
 * turn it is (turned their way), names the people, and in games with hidden cards or tiles covers
 * itself between two people's turns ("pass the device to ...") so nobody sees another's hand.
 * Games between people never move a rating (src/teach/progress.ts rates one person against one CPU).
 */
import type { GameDef, GameEvent, Seat } from '../../core/contract';
import { stableStringify } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { isPassAndPlay } from '../../core/record';
import type { AnyGameUi, SeatNames } from '../../games/types';
import { t } from '../../text';

export { isPassAndPlay };

/** A person's name at a pass-and-play table: the one typed in, or "Player 2" by their order among the people. Null for the CPU and outside pass-and-play. */
export function personName(record: Pick<GameRecord, 'players'>, seat: Seat): string | null {
  if (!isPassAndPlay(record)) return null;
  const player = record.players[seat];
  if (player?.kind !== 'human') return null;
  if (player.name) return player.name;
  const order = record.players.slice(0, seat + 1).filter((p) => p.kind === 'human').length;
  return t('pnp.player', { n: order });
}

/** Names of the other people at the device, for the games' own log lines. */
export function namesFor(record: Pick<GameRecord, 'players'>, viewer: Seat | null): SeatNames {
  return (seat) => (seat === viewer ? null : personName(record, seat));
}

/**
 * True when one seat's view hides something from another (cards in hand, tiles), so pass-and-play
 * needs a cover between people. A game can say so itself (GameUi.hiddenInfo); otherwise the views
 * of every seat at the start are compared.
 */
export function hasHiddenInformation<S, A, C, V, E extends GameEvent>(ui: { readonly def: GameDef<S, A, C, V, E>; readonly hiddenInfo?: boolean }, start: S): boolean {
  if (ui.hiddenInfo !== undefined) return ui.hiddenInfo;
  const seats = ui.def.seats(start);
  const first = stableStringify(ui.def.view(start, seats[0] ?? 0) as never);
  return seats.some((seat) => stableStringify(ui.def.view(start, seat) as never) !== first);
}

export interface Viewer {
  /** The seat the table is shown for: its hand, its side at the bottom. Null while nobody holds the device. */
  readonly seat: Seat | null;
  /** In a hidden-information game, the person the device must be passed to before the table shows. */
  readonly passTo: Seat | null;
}

/**
 * Whose table this is now. Outside pass-and-play it is always the one person. With several people:
 * the person whose turn it is, or while the CPU moves, the person who moved last. With hidden cards
 * or tiles the table only changes hands when the next person says they hold the device (`holder`),
 * and until then it is covered. While the coach is still checking a person's move, or a warning
 * about it waits (`pending`), the table stays with the person who made it.
 */
export function viewerOf(record: Pick<GameRecord, 'players' | 'status'>, turn: Seat | null, history: readonly { readonly seat: Seat }[], hidden: boolean, holder: Seat | null, pending = false): Viewer {
  const people = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  if (people.length < 2) return { seat: people[0] ?? null, passTo: null };
  let lastPerson: Seat | null = null;
  for (let i = history.length - 1; i >= 0 && lastPerson === null; i--) {
    const seat = history[i]?.seat;
    if (seat !== undefined && people.includes(seat)) lastPerson = seat;
  }
  if (pending && lastPerson !== null) return { seat: lastPerson, passTo: null };
  const over = record.status !== 'active';
  const turnPerson = !over && turn !== null && people.includes(turn) ? turn : null;
  if (!hidden) return { seat: turnPerson ?? lastPerson ?? people[0] ?? null, passTo: null };
  if (over) return { seat: holder ?? people[0] ?? null, passTo: null };
  // Hidden information: the next person to act must take the device first.
  const next = turnPerson ?? (holder === null ? (people[0] ?? null) : null);
  if (next !== null && next !== holder) return { seat: null, passTo: next };
  return { seat: holder, passTo: null };
}

/** How a finished pass-and-play game went, by name: "Ana wins", "Ana and Ben share first place". */
export function peopleResult(record: Pick<GameRecord, 'players' | 'outcome'>, nameOf: (seat: Seat) => string): string {
  const outcome = record.outcome;
  if (!outcome) return t('result.unfinished');
  const teams = outcome.teams;
  // Partnerships only: a list of one-seat teams (two players) names a single winner.
  if (teams && teams.length > 1 && teams.some((team) => team.length > 1)) {
    const best = Math.min(...outcome.results.map((r) => r.place));
    const winners = teams.filter((team) => team.some((s) => outcome.results.find((r) => r.seat === s)?.place === best));
    if (winners.length !== 1) return t('result.draw');
    return t('result.people-win', { names: (winners[0] ?? []).map(nameOf).join(t('pnp.and')) });
  }
  const firsts = outcome.results.filter((r) => r.place === 1);
  if (firsts.length === outcome.results.length && firsts.length > 1) return t('result.draw');
  if (firsts.length === 1) return t('result.person-wins', { name: nameOf((firsts[0] as { seat: Seat }).seat) });
  return t('result.people-share', { names: firsts.map((r) => nameOf(r.seat)).join(t('pnp.and')) });
}

/** Everyone's place in a game of more than two, in order: "1 Ana · 2 CPU (Blue) · 3 Ben". */
export function placesLine(record: Pick<GameRecord, 'outcome'>, nameOf: (seat: Seat) => string): string | null {
  const outcome = record.outcome;
  if (!outcome || outcome.results.length <= 2 || (outcome.teams && outcome.teams.some((team) => team.length > 1))) return null;
  return [...outcome.results]
    .sort((a, b) => a.place - b.place || a.seat - b.seat)
    .map((r) => t('result.place-line', { place: r.place, name: nameOf(r.seat) }))
    .join(' · ');
}

/** The player list's name for a seat: a person at a pass-and-play table, then the game's own name, then You or CPU. */
export function seatLabel(ui: AnyGameUi, record: Pick<GameRecord, 'players'>, seat: Seat, viewSeats: readonly Seat[], names: SeatNames): string {
  const person = personName(record, seat);
  if (person) return person;
  if (ui.playerName) return ui.playerName(seat, viewSeats, record.players.length, names);
  return record.players[seat]?.kind === 'bot' ? t('common.cpu') : t('common.you');
}
