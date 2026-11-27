/**
 * Ranges for lessons and problems: what a claim assumes another player may hold, in the usual
 * shorthand. A range is a list separated by commas:
 *
 * - "AA", "AKs", "AKo", "AK" (suited and offsuit): hand classes;
 * - "QQ+" (queens or better), "ATs+" (ace-ten suited up to ace-king suited), "KTo+": a class and
 *   every better class of the same kind, with the higher card fixed;
 * - "KhQh": one exact combination;
 * - "top:0.15": the best 15 per cent of starting hands by the ranking in preflop.ts, the one the
 *   bots and the coach use.
 *
 * A lesson position carries the range a claim assumes in its seed (see `assume`): the seed is part
 * of the state notation but never of any seat's view, so the CPU and the table never see it, while
 * the linter can check the claim and the text can quote the range's size.
 */
import type { Card, Rank } from '../cards';
import { cardIndex, isCard, RANKS } from '../cards';
import type { Combo } from '../equity';
import { ALL_COMBOS, comboClass } from '../equity';
import { band } from '../preflop';

const rankAt = (r: string): number => RANKS.indexOf(r as Rank);

/** The hand classes a token names ("QQ+", "ATs+", "AK", "AKs"), or null if it is not a class token. */
function classesOf(token: string): string[] | null {
  const m = /^([2-9TJQKA])([2-9TJQKA])([so]?)(\+?)$/.exec(token);
  if (!m) return null;
  const [, a = '', b = '', kind = '', plus = ''] = m;
  const hi = rankAt(a);
  const lo = rankAt(b);
  if (hi < 0 || lo < 0) return null;
  if (hi === lo) {
    if (kind) return null;
    const top = plus ? 12 : hi;
    return RANKS.slice(hi, top + 1).map((r) => `${r}${r}`);
  }
  if (lo > hi) return null;
  const kinds = kind ? [kind] : ['s', 'o'];
  const tops = plus ? hi - 1 : lo;
  const out: string[] = [];
  for (let k = lo; k <= tops; k++) for (const x of kinds) out.push(`${a}${RANKS[k] ?? ''}${x}`);
  return out;
}

/** Every combination a range names, each once. Throws on a token it cannot read. */
export function parseRange(text: string): Combo[] {
  const seen = new Set<string>();
  const out: Combo[] = [];
  const add = (c: Combo) => {
    const key = `${Math.max(c[0], c[1])}/${Math.min(c[0], c[1])}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(c);
  };
  for (const raw of text.split(',')) {
    const token = raw.trim();
    if (!token) continue;
    if (token.startsWith('top:')) {
      const fraction = Number(token.slice(4));
      if (!(fraction > 0 && fraction <= 1)) throw new Error(`Range: "${token}" is not a share of hands`);
      const classes = new Set(band(0, fraction));
      for (const c of ALL_COMBOS) if (classes.has(comboClass(c))) add(c);
      continue;
    }
    if (token.length === 4 && isCard(token.slice(0, 2)) && isCard(token.slice(2))) {
      const a = cardIndex(token.slice(0, 2) as Card);
      const b = cardIndex(token.slice(2) as Card);
      if (a === b) throw new Error(`Range: "${token}" uses one card twice`);
      add([Math.max(a, b), Math.min(a, b)]);
      continue;
    }
    const classes = classesOf(token);
    if (!classes) throw new Error(`Range: cannot read "${token}"`);
    const wanted = new Set(classes);
    for (const c of ALL_COMBOS) if (wanted.has(comboClass(c))) add(c);
  }
  return out;
}

/** The combinations of a range that use none of the cards already seen. */
export function liveCombos(text: string, dead: ReadonlySet<number>): Combo[] {
  return parseRange(text).filter((c) => !dead.has(c[0]) && !dead.has(c[1]));
}

/** What a claim assumes the other player holds: one range, or value hands and bluffs. */
export interface Assumption {
  readonly value: string;
  readonly bluff: string;
}

const PREFIX = 'assume|';

/** A seed that carries an assumed range: `{ value: 'QQ+' }`, or value hands and bluffs. */
export function assume(a: { readonly value: string; readonly bluff?: string }): string {
  return `${PREFIX}value=${a.value}|bluff=${a.bluff ?? ''}`;
}

/** The range a position's seed assumes, or null when it assumes none. */
export function assumed(seed: string): Assumption | null {
  if (!seed.startsWith(PREFIX)) return null;
  const parts = new Map(
    seed
      .slice(PREFIX.length)
      .split('|')
      .map((p) => {
        const i = p.indexOf('=');
        return [p.slice(0, i), p.slice(i + 1)] as const;
      }),
  );
  return { value: parts.get('value') ?? '', bluff: parts.get('bluff') ?? '' };
}

/** Every combination an assumption allows (value hands and bluffs together). */
export function assumedRange(a: Assumption): string {
  return [a.value, a.bluff].filter(Boolean).join(',');
}
