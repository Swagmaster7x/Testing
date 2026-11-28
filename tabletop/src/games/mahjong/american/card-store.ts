/**
 * The American card a player typed in (Tools, "Your American card"), kept on this device only.
 * A game that plays "my card" copies the text into its rules when it starts, so the game's record
 * replays the same hands even if the card is edited later.
 */
const KEY = 'kibitz.mahjong.american-card';

export function loadCard(): string {
  try {
    return globalThis.localStorage?.getItem(KEY) ?? '';
  } catch {
    return '';
  }
}

export function saveCard(text: string): boolean {
  try {
    globalThis.localStorage?.setItem(KEY, text);
    return true;
  } catch {
    return false;
  }
}
