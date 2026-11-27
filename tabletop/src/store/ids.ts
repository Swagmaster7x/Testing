/** Ids for rows. Random, so two devices never clash when a backup is moved between them. */
export function newId(prefix: string): string {
  const bytes = new Uint8Array(10);
  globalThis.crypto.getRandomValues(bytes);
  return `${prefix}_${Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 16)}`;
}
