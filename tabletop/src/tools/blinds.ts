/**
 * The poker blind timer (milestone 16): a schedule of levels and a clock that survives the app
 * being closed, because it is kept as when it started and how long it has run, not as a countdown.
 * Pure functions; the screen is `src/shell/tools/BlindTimerScreen.tsx`.
 */

export interface BlindLevel {
  readonly sb: number;
  readonly bb: number;
  readonly ante: number;
}

export interface TimerSettings {
  /** Minutes per level. */
  readonly minutes: number;
  /** The first level's big blind; the rest follow the usual steps from it. */
  readonly startBb: number;
  /** From which level (counting from 1) every player antes; 0 for never. */
  readonly anteFrom: number;
}

export const DEFAULT_TIMER: TimerSettings = { minutes: 15, startBb: 2, anteFrom: 0 };
export const LEVEL_MINUTES: readonly number[] = [5, 10, 15, 20, 30];
export const START_BBS: readonly number[] = [2, 10, 20, 50, 100];

/** The usual big-blind steps, as multiples of the first: about half again each level, on round numbers. */
const STEPS: readonly number[] = [1, 2, 3, 4, 6, 8, 10, 15, 20, 30, 40, 50, 60, 80, 100, 150, 200, 300, 400, 500];

/** The levels of a schedule. The small blind is half the big blind (rounded down to the first level's unit). */
export function schedule(s: TimerSettings): BlindLevel[] {
  const unit = Math.max(1, Math.floor(s.startBb / 2));
  return STEPS.map((k, i) => {
    const bb = s.startBb * k;
    const sb = Math.max(unit, Math.floor(bb / 2 / unit) * unit);
    const ante = s.anteFrom > 0 && i + 1 >= s.anteFrom ? Math.max(unit, Math.floor(bb / 8 / unit) * unit) : 0;
    return { sb, bb, ante };
  });
}

/** A running (or paused) clock: `startedAt` while running; `elapsed` ms banked from earlier runs; `skip` levels moved by hand. */
export interface TimerClock {
  readonly startedAt: number | null;
  readonly elapsed: number;
  readonly skip: number;
}

export const STOPPED: TimerClock = { startedAt: null, elapsed: 0, skip: 0 };

export const running = (c: TimerClock): boolean => c.startedAt !== null;
const spent = (c: TimerClock, now: number): number => c.elapsed + (c.startedAt === null ? 0 : Math.max(0, now - c.startedAt));

export function start(c: TimerClock, now: number): TimerClock {
  return c.startedAt === null ? { ...c, startedAt: now } : c;
}

export function pause(c: TimerClock, now: number): TimerClock {
  return c.startedAt === null ? c : { ...c, startedAt: null, elapsed: spent(c, now) };
}

/** Where the clock stands: the level (from 0), the ms left in it, and whether the last level is reached. */
export function position(c: TimerClock, s: TimerSettings, now: number, levels: number): { level: number; left: number; last: boolean } {
  const length = s.minutes * 60_000;
  const raw = Math.floor(spent(c, now) / length) + c.skip;
  const level = Math.max(0, Math.min(levels - 1, raw));
  // On the last level the clock keeps going round; the blinds stay.
  return { level, left: length - (spent(c, now) % length), last: level === levels - 1 };
}

/** Moves to the start of the next (or previous) level, keeping the clock running or paused. */
export function jump(c: TimerClock, s: TimerSettings, now: number, levels: number, by: 1 | -1): TimerClock {
  const length = s.minutes * 60_000;
  const { level } = position(c, s, now, levels);
  const target = Math.max(0, Math.min(levels - 1, level + by));
  // Restart the current level's time at zero, then count the levels moved as skips.
  const base = Math.floor(spent(c, now) / length);
  const elapsed = base * length;
  return { startedAt: c.startedAt === null ? null : now, elapsed, skip: target - base };
}

/** "12:05" for ms left. */
export function clockText(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const sec = total % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}
