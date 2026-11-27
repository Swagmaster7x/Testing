import { t, tCount } from '../text';

export function timeAgo(then: number, now: number): string {
  const minutes = Math.floor((now - then) / 60_000);
  if (minutes < 1) return t('common.just-now');
  if (minutes < 60) return tCount('common.minutes-ago', minutes);
  return new Date(then).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function longDate(when: Date): string {
  return when.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
}

export function shortDate(when: number): string {
  return new Date(when).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
