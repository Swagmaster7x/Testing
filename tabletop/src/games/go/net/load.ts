/**
 * Loading the Go review's network in the bot worker (M15). The file ships with the app under
 * engines/ (copied at build time from assets/katago/), so loading it is no network request: it
 * comes from the app's own files, offline, like Stockfish's WebAssembly.
 */
import type { Network } from './model';
import { readNetwork } from './model';

export const NET_FILE = 'katago/g170-b6c96-f16.bin';

export async function loadNetFrom(assetsBase: string): Promise<Network> {
  // eslint-disable-next-line no-restricted-globals -- the app's own file under engines/, never the internet
  const response = await fetch(new URL(`engines/${NET_FILE}`, assetsBase));
  if (!response.ok) throw new Error('The Go network file is missing');
  return readNetwork(new Uint8Array(await response.arrayBuffer()));
}
