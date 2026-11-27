/** The Spanish catalogue: only real keys, the same placeholders, and how much of each area is done. */
import { describe, expect, it } from 'vitest';
import { currentLanguage, setLanguage, t, tDynamic } from '../../src/text';
import { en } from '../../src/text/en';
import { enLearn } from '../../src/text/en-learn';
import { enGames } from '../../src/text/games';
import { es } from '../../src/text/es';

const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

describe('the Spanish catalogue', () => {
  it('has only keys the English catalogue has, with the same placeholders', () => {
    for (const [key, value] of Object.entries(es)) {
      expect(key in en, key).toBe(true);
      expect(placeholders(value ?? ''), key).toEqual(placeholders((en as Record<string, string>)[key] ?? ''));
      expect(value?.trim(), key).not.toBe('');
    }
  });

  it('covers every shell string', () => {
    // The shell: everything in en.ts itself, not the learning loop's file or a game's file.
    const elsewhere = new Set([...Object.keys(enLearn), ...Object.keys(enGames)]);
    const shell = Object.keys(en).filter((k) => !elsewhere.has(k) && k !== 'app.name' && k !== 'common.none' && (en as Record<string, string>)[k] !== '');
    const missing = shell.filter((k) => !(k in es));
    expect(missing, `${missing.length} shell strings untranslated`).toEqual([]);
  });

  it('covers every string of the learning loop', () => {
    const missing = Object.keys(enLearn).filter((k) => !(k in es));
    expect(missing, `${missing.length} learning-loop strings untranslated`).toEqual([]);
  });

  it('switches language and falls back to English for anything untranslated', () => {
    const before = currentLanguage();
    setLanguage('es');
    expect(t('nav.games')).toBe('Juegos');
    expect(t('common.level', { n: 3 })).toBe('Nivel 3');
    expect(tDynamic('no.such.key')).toBe('no.such.key');
    setLanguage('en');
    expect(t('nav.games')).toBe('Games');
    setLanguage(before);
  });
});
