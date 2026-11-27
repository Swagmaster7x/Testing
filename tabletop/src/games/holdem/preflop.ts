/**
 * Starting hands: the 169 hand classes ranked best first (preflop.json, made by
 * scripts/generate-holdem-preflop.ts), the ranges that follow from the ranking, and the opening
 * ranges by position that the bots, the coach's chart and the lessons share.
 *
 * A range here is a slice of the ranking: "the best 15 per cent of hands" is every class that
 * starts before the 15 per cent mark, counting each class by its combinations (a pair has 6,
 * a suited hand 4, an offsuit hand 12, out of 1326).
 */
import data from './preflop.json';

interface Row {
  readonly cls: string;
  readonly combos: number;
  readonly vs1: number;
  readonly vs3: number;
}

const ROWS: readonly Row[] = (data as { hands: Row[] }).hands;

/** Hand classes, best first. */
export const RANKING: readonly string[] = ROWS.map((r) => r.cls);

const BEFORE = new Map<string, number>();
const ROW = new Map<string, Row>();
{
  let cum = 0;
  for (const r of ROWS) {
    BEFORE.set(r.cls, cum / 1326);
    ROW.set(r.cls, r);
    cum += r.combos;
  }
}

/** Where a class starts in the ranking, as a fraction of all hands: 0 for aces, near 1 for the worst. */
export function rankOf(cls: string): number {
  return BEFORE.get(cls) ?? 1;
}

/** A class's equity against one random hand and against three. */
export function equityOf(cls: string): { vs1: number; vs3: number } {
  const r = ROW.get(cls);
  return { vs1: r?.vs1 ?? 0, vs3: r?.vs3 ?? 0 };
}

/** Whether a class is among the best `fraction` of hands. */
export function inTop(cls: string, fraction: number): boolean {
  return rankOf(cls) < fraction - 1e-9;
}

/** Classes whose place in the ranking is from `from` to `to`, as fractions of all hands. */
export function band(from: number, to: number): string[] {
  return RANKING.filter((cls) => {
    const r = rankOf(cls);
    return r >= from - 1e-9 && r < to - 1e-9;
  });
}

/** Opening ranges (raise first in) at a six-handed table, by position, as fractions of all hands. */
export const OPEN: Readonly<Record<string, number>> = { UTG: 0.15, HJ: 0.2, CO: 0.27, BTN: 0.45, SB: 0.38 };
/** Heads-up, the button opens most hands. */
export const HEADS_UP_OPEN = 0.8;

/** The share of hands a solid player opens from a position, with `players` dealt in. */
export function openFraction(position: string, players: number): number {
  if (players <= 2) return position === 'BTN' ? HEADS_UP_OPEN : 0;
  if (position === 'BB') return 0;
  // Short-handed, the first seats to act have fewer players behind them: open a little wider.
  const base = OPEN[position] ?? 0.2;
  if (position === 'UTG' && players <= 4) return OPEN.CO ?? base;
  if (position === 'UTG' && players === 5) return OPEN.HJ ?? base;
  return base;
}
