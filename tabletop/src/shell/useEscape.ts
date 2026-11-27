import { useEffect } from 'react';

/** Calls `onEscape` when Escape is pressed, for dialogs and sheets. */
export function useEscape(onEscape: () => void): void {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onEscape]);
}
