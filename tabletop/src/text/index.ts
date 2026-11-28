/**
 * Looks up interface text. Unknown keys show the key itself, so a gap is visible, not blank.
 * The language is English or Spanish (milestone 16); a Spanish string missing from the Spanish
 * catalogue falls back to the English one.
 */
import type { MessageKey } from './en';
import { en } from './en';

export type { MessageKey } from './en';

export type Params = Readonly<Record<string, string | number>>;
export type Language = 'en' | 'es';
export const LANGUAGES: readonly Language[] = ['en', 'es'];

let catalogue: Readonly<Record<string, string>> = en;
let language: Language = 'en';
/** The Spanish catalogue, once loaded: it is its own download, so English never pays for it. */
let spanish: Readonly<Record<string, string>> | null = null;

/** Loads a language's text, if it is not loaded yet. */
export async function loadLanguage(next: Language): Promise<void> {
  if (next === 'es' && !spanish) spanish = (await import('./es')).es;
}

/** Whether a language's text is loaded, so `setLanguage` can switch to it. */
export function languageReady(next: Language): boolean {
  return next === 'en' || spanish !== null;
}

/**
 * Sets the interface language, once its text is loaded (`loadLanguage`); until then nothing
 * changes. Screens read text when they render, so re-render after this.
 */
export function setLanguage(next: Language): void {
  if (!languageReady(next)) return;
  language = next;
  catalogue = next === 'es' && spanish ? { ...en, ...spanish } : en;
}

export function currentLanguage(): Language {
  return language;
}

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

/** A practice set's name or blurb: the game's own text when it has one, else the shared text. */
export function practiceText(gameId: string, setId: string, part: '' | '.blurb' = ''): string {
  const own = `practice.set.${gameId}.${setId}${part}`;
  return hasText(own) ? tDynamic(own) : tDynamic(`practice.set.${setId}${part}`);
}
