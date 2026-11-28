/** The Spanish catalogue: only real keys, the same placeholders, and how much of each area is done. */
import { describe, expect, it } from 'vitest';
import { currentLanguage, languageReady, loadLanguage, setLanguage, t, tDynamic } from '../../src/text';
import { en } from '../../src/text/en';
import { enLearn } from '../../src/text/en-learn';
import { enGames } from '../../src/text/games';
import { enBlackjack } from '../../src/text/games/blackjack';
import { enBrisca } from '../../src/text/games/brisca';
import { enChineseCheckers } from '../../src/text/games/chinese-checkers';
import { enClassic } from '../../src/text/games/classic';
import { enDominoes } from '../../src/text/games/dominoes';
import { enGinRummy } from '../../src/text/games/gin-rummy';
import { enGo } from '../../src/text/games/go';
import { enHearts } from '../../src/text/games/hearts';
import { enMahjong } from '../../src/text/games/mahjong';
import { enPoker } from '../../src/text/games/poker';
import { enShogi } from '../../src/text/games/shogi';
import { enSpades } from '../../src/text/games/spades';
import { enTute } from '../../src/text/games/tute';
import { es } from '../../src/text/es';
import { esBlackjack } from '../../src/text/es/games/blackjack';
import { esBrisca } from '../../src/text/es/games/brisca';
import { esChineseCheckers } from '../../src/text/es/games/chinese-checkers';
import { esClassic } from '../../src/text/es/games/classic';
import { esDominoes } from '../../src/text/es/games/dominoes';
import { esGinRummy } from '../../src/text/es/games/gin-rummy';
import { esGo } from '../../src/text/es/games/go';
import { esHearts } from '../../src/text/es/games/hearts';
import { esMahjong } from '../../src/text/es/games/mahjong';
import { esPoker } from '../../src/text/es/games/poker';
import { esShogi } from '../../src/text/es/games/shogi';
import { esSpades } from '../../src/text/es/games/spades';
import { esTute } from '../../src/text/es/games/tute';

/** Each translated game: its English file and its Spanish file, which must cover every key. */
const games: readonly [string, Record<string, string>, Partial<Record<string, string>>][] = [
  ['brisca', enBrisca, esBrisca],
  ['chinese-checkers', enChineseCheckers, esChineseCheckers],
  ['dominoes', enDominoes, esDominoes],
  ['go', enGo, esGo],
  ['mahjong', enMahjong, esMahjong],
  ['poker', enPoker, esPoker],
  ['shogi', enShogi, esShogi],
  ['classic', enClassic, esClassic],
  ['blackjack', enBlackjack, esBlackjack],
  ['hearts', enHearts, esHearts],
  ['spades', enSpades, esSpades],
  ['gin-rummy', enGinRummy, esGinRummy],
  ['tute', enTute, esTute],
];

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

  for (const [game, english, spanish] of games) {
    it(`covers every string of ${game}`, () => {
      // A key empty in English on purpose (no "later" plans, a hand with no outcome yet) stays empty.
      const keys = Object.keys(english).filter((k) => english[k] !== '');
      const missing = keys.filter((k) => !spanish[k]?.trim());
      expect(missing, `${missing.length} ${game} strings untranslated`).toEqual([]);
      // The merged catalogue carries the game's Spanish, not another file's text for the same key.
      for (const k of keys) expect((es as Record<string, string>)[k], k).toBe(spanish[k]);
    });
  }

  it('switches language once its text is loaded, and falls back to English for anything untranslated', async () => {
    const before = currentLanguage();
    await loadLanguage('es');
    expect(languageReady('es')).toBe(true);
    setLanguage('es');
    expect(t('nav.games')).toBe('Juegos');
    expect(t('common.level', { n: 3 })).toBe('Nivel 3');
    expect(tDynamic('no.such.key')).toBe('no.such.key');
    setLanguage('en');
    expect(t('nav.games')).toBe('Games');
    setLanguage(before);
  });
});
