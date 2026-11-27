/** Asks the browser to keep the app's storage instead of clearing it when space runs low. */
export type PersistState = 'kept' | 'not-kept' | 'unknown';

export async function requestPersistence(): Promise<PersistState> {
  try {
    if (!navigator.storage?.persist) return 'unknown';
    return (await navigator.storage.persist()) ? 'kept' : 'not-kept';
  } catch {
    return 'unknown';
  }
}

export async function persistenceState(): Promise<PersistState> {
  try {
    if (!navigator.storage?.persisted) return 'unknown';
    return (await navigator.storage.persisted()) ? 'kept' : 'not-kept';
  } catch {
    return 'unknown';
  }
}
