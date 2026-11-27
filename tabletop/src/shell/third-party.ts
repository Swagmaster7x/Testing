/** Software shipped inside the app, shown under Settings → About. THIRD-PARTY.md has the full list. */
export const SHIPPED: readonly { name: string; licence: string; use: string }[] = [
  { name: 'React, React DOM', licence: 'MIT', use: 'Interface' },
  { name: 'Zustand', licence: 'MIT', use: 'Interface state' },
  { name: 'Dexie', licence: 'Apache-2.0', use: 'Storage' },
  { name: 'Capacitor', licence: 'MIT', use: 'Android wrapper, file sharing' },
  { name: 'chess.js', licence: 'BSD-2-Clause', use: 'Chess rules' },
  { name: 'Stockfish 19 (lite)', licence: 'GPL-3.0', use: 'Chess engine' },
  { name: 'ts-fsrs', licence: 'MIT', use: 'Spaced-review schedule' },
  { name: 'Lichess puzzle database', licence: 'CC0 1.0', use: 'Chess problems (lichess.org)' },
  { name: 'Inter', licence: 'SIL OFL 1.1', use: 'Text font' },
  { name: 'Fraunces', licence: 'SIL OFL 1.1', use: 'Heading font' },
];
