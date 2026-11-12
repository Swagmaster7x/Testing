// Translations. The game's text is written in English in the code; tr() swaps it for the chosen
// language at the moment it is shown. Three kinds of entry in a language file (src/lang/*.json):
//   "Shop": "Tienda"                                    exact text
//   "+{0} attack. {1}% chance to stun.": "..."          numbers are lifted out as {0}, {1}... and put back
//   "{a} has fallen": "{a} ha caído"                    {a}, {b}, {c} stand for names or other words
// Anything without an entry is shown in English.
import es from './lang/es.json';
import pt from './lang/pt.json';
import fr from './lang/fr.json';
import de from './lang/de.json';

export const LANGS = { en: 'English', es: 'Español', pt: 'Português', fr: 'Français', de: 'Deutsch' };
const DICTS = { es, pt, fr, de };
let lang = 'en', dict = {}, patterns = [];
const NUM = /\d+(?:\.\d+)?/g;
export const seen = (typeof window !== 'undefined' && window.__i18nCollect) ? new Set() : null;      // for the string-collecting tool

export function setLang(code) {
  lang = DICTS[code] ? code : 'en'; dict = DICTS[lang] || {};
  // Entries with {a}/{b}/{c} become patterns, longest first so the most specific one wins.
  patterns = Object.keys(dict).filter((k) => /\{[a-c]\}/.test(k)).sort((x, y) => y.length - x.length).map((k) => {
    const names = [];
    const re = new RegExp('^' + k.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{([a-c])\\?\}/g, (m, n) => { names.push(n); return '(.+?)'; }).replace(/\{(\d+)\}/g, '\\{$1\\}') + '$');
    return { re, names, out: dict[k] };
  });
  if (typeof document !== 'undefined') document.documentElement.lang = lang;
}
export const getLang = () => lang;
/** The language to start in: the phone's, if we have it. */
export function guessLang() { const n = (typeof navigator !== 'undefined' && navigator.language || 'en').slice(0, 2).toLowerCase(); return DICTS[n] ? n : 'en'; }

export function tr(s) {
  if (typeof s !== 'string' || !s) return s;
  // "Back|body": the part after | only tells translators which meaning is intended; it is never shown.
  const ctx = /^([^|]+)\|[a-z]+$/.exec(s);
  if (ctx) { const t = dict[s]; return t !== undefined ? t : ctx[1]; }
  if (lang === 'en' && !seen) return s;
  const lead = s.match(/^\s*/)[0], tail = s.match(/\s*$/)[0], core = s.slice(lead.length, s.length - tail.length);
  if (!core || !/[A-Za-z]/.test(core)) return s;
  const nums = [];
  const key = core.replace(NUM, (m) => { nums.push(m); return '{' + (nums.length - 1) + '}'; });
  if (seen) seen.add(key);
  if (lang === 'en') return s;
  const fill = (t) => t.replace(/\{(\d+)\}/g, (m, i) => (nums[i] !== undefined ? nums[i] : m));
  if (dict[core] !== undefined) return lead + dict[core] + tail;
  if (dict[key] !== undefined) return lead + fill(dict[key]) + tail;
  for (const p of patterns) {
    const m = p.re.exec(key);
    if (m) return lead + fill(p.out.replace(/\{([a-c])\}/g, (x, n) => tr(fill(m[p.names.indexOf(n) + 1])))) + tail;
  }
  return s;
}
