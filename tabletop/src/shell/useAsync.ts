import { useEffect, useState } from 'react';

export type AsyncState<T> = { status: 'loading' } | { status: 'done'; value: T } | { status: 'failed'; error: Error };

/** Runs an async load when its key changes and keeps the latest result. */
export function useAsync<T>(load: () => Promise<T>, key: string): AsyncState<T> {
  const [state, setState] = useState<{ key: string; result: AsyncState<T> }>({ key, result: { status: 'loading' } });
  useEffect(() => {
    let live = true;
    load().then(
      (value) => live && setState({ key, result: { status: 'done', value } }),
      (error: unknown) => live && setState({ key, result: { status: 'failed', error: error instanceof Error ? error : new Error(String(error)) } }),
    );
    return () => {
      live = false;
    };
    // The key stands for everything the load depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return state.key === key ? state.result : { status: 'loading' };
}
