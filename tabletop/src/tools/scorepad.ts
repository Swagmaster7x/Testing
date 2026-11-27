/**
 * Scorepads for games played at a real table (PLAN.md 1.10, milestone 16): pure functions over a
 * pad's entries, so the totals are always worked out again from what was written down and an entry
 * can be taken back. The store keeps pads per profile (`src/store/pads.ts`).
 *
 * - Dominoes: two sides (or up to four players); the winner of each hand scores; the first to the
 *   target (100, 150, 200 or 500) wins.
 * - Brisca: two sides; each hand is written as one side's points (the other has the rest of 120);
 *   61 wins the hand, 60–60 is a tie; the first to the target number of hands wins.
 * - Mahjong point sticks: four players from a starting score; each win is paid by the discarder
 *   alone, by everyone (self-drawn), or by everyone with the discarder paying double (Hong Kong
 *   half-gun); a drawn hand changes nothing.
 * - Tally: two to eight players adding points each round; the most (or the fewest) wins when one
 *   reaches the target, or whenever you stop.
 */

export type PadKind = 'dominoes' | 'brisca' | 'mahjong' | 'tally';
export const PAD_KINDS: readonly PadKind[] = ['dominoes', 'brisca', 'mahjong', 'tally'];

export type PadEntry =
  /** Points to one side (Dominoes, Tally). */
  | { readonly type: 'score'; readonly side: number; readonly points: number }
  /** A Brisca hand: the first side's points; the second side has the rest of 120. */
  | { readonly type: 'hand'; readonly first: number }
  /** A Tally round: points for every side at once. */
  | { readonly type: 'round'; readonly points: readonly number[] }
  /**
   * A Mahjong win: `amount` from each payer to the winner. `from` is the discarder, or null when
   * the winner drew the tile. `mode`: only the discarder pays; or everyone pays and the discarder
   * pays double.
   */
  | { readonly type: 'win'; readonly winner: number; readonly from: number | null; readonly amount: number; readonly mode: 'discarder' | 'half-gun' };

export interface Pad {
  readonly id: string;
  readonly kind: PadKind;
  readonly title: string;
  /** The sides (or players) by name. */
  readonly names: readonly string[];
  /** Points (Dominoes, Tally) or hands (Brisca) that win; 0 for none. */
  readonly target: number;
  /** Mahjong: each player's starting score. */
  readonly start: number;
  /** Tally: the fewest points win (golf, Hearts). */
  readonly lowWins: boolean;
  readonly entries: readonly PadEntry[];
  readonly createdAt: number;
  readonly updatedAt: number;
}

/** Sensible starting values for a new pad of each kind. */
export function newPad(kind: PadKind, id: string, now: number, names?: readonly string[]): Pad {
  const base = { id, kind, entries: [], createdAt: now, updatedAt: now, lowWins: false, start: 0 };
  switch (kind) {
    case 'dominoes':
      return { ...base, title: 'Dominoes', names: names ?? ['Us', 'Them'], target: 200 };
    case 'brisca':
      return { ...base, title: 'Brisca', names: names ?? ['Us', 'Them'], target: 3 };
    case 'mahjong':
      return { ...base, title: 'Mahjong', names: names ?? ['East', 'South', 'West', 'North'], target: 0, start: 25_000 };
    case 'tally':
      return { ...base, title: 'Scores', names: names ?? ['Ana', 'Beto', 'Carmen'], target: 0 };
  }
}

export const BRISCA_TOTAL = 120;

/** A Brisca hand's winner: 0 or 1, or null for 60–60. */
export function briscaHandWinner(first: number): number | null {
  const second = BRISCA_TOTAL - first;
  return first > second ? 0 : second > first ? 1 : null;
}

/** What each side has: points, or hands won (Brisca), or the score (Mahjong). */
export function totals(pad: Pad): number[] {
  const out = pad.names.map(() => (pad.kind === 'mahjong' ? pad.start : 0));
  const add = (side: number, n: number) => {
    if (side >= 0 && side < out.length) out[side] = (out[side] ?? 0) + n;
  };
  for (const e of pad.entries) {
    switch (e.type) {
      case 'score':
        add(e.side, e.points);
        break;
      case 'hand': {
        const w = briscaHandWinner(e.first);
        if (w !== null) add(w, 1);
        break;
      }
      case 'round':
        e.points.forEach((p, side) => add(side, p));
        break;
      case 'win':
        for (const [payer, amount] of payments(e, pad.names.length)) {
          add(payer, -amount);
          add(e.winner, amount);
        }
        break;
    }
  }
  return out;
}

/** Who pays what for a Mahjong win: [payer, amount] pairs. */
export function payments(e: Extract<PadEntry, { type: 'win' }>, players: number): [number, number][] {
  const others = Array.from({ length: players }, (_, i) => i).filter((i) => i !== e.winner);
  if (e.from === null) return others.map((p) => [p, e.amount]);
  if (e.mode === 'discarder') return [[e.from, e.amount]];
  return others.map((p) => [p, p === e.from ? 2 * e.amount : e.amount]);
}

/** The side that has won, once one reaches the target; null while play goes on (or with no target). */
export function winnerOf(pad: Pad): number | null {
  if (pad.target <= 0 || pad.kind === 'mahjong') return null;
  const t = totals(pad);
  const reached = t.map((n, side) => ({ n, side })).filter((x) => x.n >= pad.target);
  if (reached.length === 0) return null;
  if (pad.kind === 'tally' && pad.lowWins) {
    // Golf-like: the game ends when someone reaches the target; the fewest points win.
    const low = Math.min(...t);
    const lows = t.flatMap((n, side) => (n === low ? [side] : []));
    return lows.length === 1 ? (lows[0] as number) : null;
  }
  const top = Math.max(...reached.map((x) => x.n));
  const tops = reached.filter((x) => x.n === top);
  return tops.length === 1 ? (tops[0] as { side: number }).side : null;
}

/** The side in front now (most points, or fewest with `lowWins`), or null on a tie or with nothing written. */
export function leaderOf(pad: Pad): number | null {
  if (pad.entries.length === 0) return null;
  const t = totals(pad);
  const best = pad.kind === 'tally' && pad.lowWins ? Math.min(...t) : Math.max(...t);
  const at = t.flatMap((n, side) => (n === best ? [side] : []));
  return at.length === 1 ? (at[0] as number) : null;
}

/** Adds an entry, refusing ones that do not fit the pad. Returns the new pad. */
export function addEntry(pad: Pad, entry: PadEntry, now: number): Pad {
  const n = pad.names.length;
  const ok = (x: number) => Number.isFinite(x) && Number.isInteger(x);
  const valid = (() => {
    switch (entry.type) {
      case 'score':
        return (pad.kind === 'dominoes' || pad.kind === 'tally') && entry.side >= 0 && entry.side < n && ok(entry.points) && (pad.kind === 'tally' || entry.points >= 0);
      case 'hand':
        return pad.kind === 'brisca' && ok(entry.first) && entry.first >= 0 && entry.first <= BRISCA_TOTAL;
      case 'round':
        return pad.kind === 'tally' && entry.points.length === n && entry.points.every(ok);
      case 'win':
        return pad.kind === 'mahjong' && entry.winner >= 0 && entry.winner < n && (entry.from === null || (entry.from >= 0 && entry.from < n && entry.from !== entry.winner)) && ok(entry.amount) && entry.amount > 0;
    }
  })();
  if (!valid) throw new Error('That entry does not fit this scorepad');
  return { ...pad, entries: [...pad.entries, entry], updatedAt: now };
}

/** Takes back the last entry. */
export function undoEntry(pad: Pad, now: number): Pad {
  return pad.entries.length === 0 ? pad : { ...pad, entries: pad.entries.slice(0, -1), updatedAt: now };
}

/** Checks a pad read from storage or a backup; throws on anything damaged. */
export function checkPad(value: unknown): Pad {
  const p = value as Pad;
  if (typeof p !== 'object' || p === null || typeof p.id !== 'string' || !PAD_KINDS.includes(p.kind) || !Array.isArray(p.names) || !Array.isArray(p.entries)) throw new Error('A scorepad is damaged');
  // Replaying every entry checks each one.
  let replay: Pad = { ...p, entries: [] };
  for (const e of p.entries as readonly PadEntry[]) replay = addEntry(replay, e, p.updatedAt);
  return p;
}
