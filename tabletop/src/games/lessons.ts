/**
 * Where each game's lessons live. They load on demand, so a game's lessons only reach the
 * device's memory when its Learn door opens.
 */
import type { Lesson } from '../teach/lesson';
import type { LessonGame } from '../teach/runner';

export interface LessonPack {
  readonly lessons: readonly Lesson[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each game has its own state type
  readonly game: LessonGame<any>;
}

const PACKS: Readonly<Record<string, () => Promise<LessonPack>>> = {
  brisca: async () => {
    const m = await import('./brisca/learn');
    return { lessons: m.BRISCA_LESSONS, game: m.briscaLessonGame };
  },
  chess: async () => {
    const m = await import('./chess/learn');
    return { lessons: m.CHESS_LESSONS, game: m.chessLessonGame };
  },
  dominoes: async () => {
    const m = await import('./dominoes/learn');
    return { lessons: m.DOMINOES_LESSONS, game: m.dominoesLessonGame };
  },
  shogi: async () => {
    const m = await import('./shogi/learn');
    return { lessons: m.SHOGI_LESSONS, game: m.shogiLessonGame };
  },
};

export function hasLessons(gameId: string): boolean {
  return gameId in PACKS;
}

export function lessonGames(): string[] {
  return Object.keys(PACKS);
}

export async function loadLessons(gameId: string): Promise<LessonPack | null> {
  const load = PACKS[gameId];
  return load ? load() : null;
}
