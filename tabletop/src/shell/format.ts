import { currentLanguage, t, tCount } from '../text';

/** Dates follow the interface language; English keeps the device's own English. */
const locale = (): string | undefined => (currentLanguage() === 'es' ? 'es' : undefined);

export function timeAgo(then: number, now: number): string {
  const minutes = Math.floor((now - then) / 60_000);
  if (minutes < 1) return t('common.just-now');
  if (minutes < 60) return tCount('common.minutes-ago', minutes);
  return new Date(then).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function longDate(when: Date): string {
  return when.toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' });
}

export function shortDate(when: number): string {
  return new Date(when).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' });
}
