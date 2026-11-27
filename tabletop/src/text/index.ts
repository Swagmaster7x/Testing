/** Looks up interface text. Unknown keys show the key itself, so a gap is visible, not blank. */
import type { MessageKey } from './en';
import { en } from './en';

export type { MessageKey } from './en';

export type Params = Readonly<Record<string, string | number>>;

const catalogue: Readonly<Record<string, string>> = en;

export function hasText(key: string): key is MessageKey {
  return Object.prototype.hasOwnProperty.call(catalogue, key);
}

function fill(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (whole, name: string) => (name in params ? String(params[name]) : whole));
}

export function t(key: MessageKey, params?: Params): string {
  return fill(catalogue[key] ?? key, params);
}

/** Text for a key built at run time, such as "game.chess.name". */
export function tDynamic(key: string, params?: Params): string {
  return fill(hasText(key) ? (catalogue[key] as string) : key, params);
}

/** A counted phrase: picks "<base>.one" or "<base>.other" and fills in {n}. */
export function tCount(base: string, n: number, params?: Params): string {
  return tDynamic(`${base}.${n === 1 ? 'one' : 'other'}`, { n, ...params });
}

export function gameName(gameId: string): string {
  return tDynamic(`game.${gameId}.name`);
}
