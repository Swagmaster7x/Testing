import { useSyncExternalStore } from 'react';
import type { MotionSetting } from '../store/db';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

export function systemPrefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;
}

/** True when animations should be skipped: the setting, or the system setting when it says "as system". */
export function useReducedMotion(setting: MotionSetting): boolean {
  const system = useSyncExternalStore(subscribe, systemPrefersReducedMotion, () => false);
  return setting === 'reduced' || (setting === 'system' && system);
}
