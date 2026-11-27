/**
 * Where each game's practice lives: problem sets (rated, chosen near your rating) and drills
 * (generated exercises that run on the lesson runner). Loaded on demand.
 */
import type { Lesson } from '../teach/lesson';
import type { Problem } from '../teach/problem';
import type { LessonGame } from '../teach/runner';
import type { MessageKey } from '../text';

export interface PracticeSetDef {
  readonly id: string;
  /** A problem belongs to the set when it has any of these themes... */
  readonly themes: readonly string[];
  /** ...and none of these. */
  readonly exclude?: readonly string[];
  /** Themes offered as narrower choices within the set. */
  readonly chips?: readonly string[];
}

export interface DrillDef {
  readonly id: string;
  /** A fresh exercise, as a short lesson. */
  make(random: () => number): Lesson;
}

export interface PracticePack {
  readonly problems: readonly Problem[];
  readonly sets: readonly PracticeSetDef[];
  readonly drills: readonly DrillDef[];
  /** Themes in the order hints and summaries name them; others are not named. */
  readonly themeOrder: readonly string[];
  /** Where the problems come from, for the attribution line. */
  readonly attribution: MessageKey | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- each game has its own state type
  readonly game: LessonGame<any>;
}

const PACKS: Readonly<Record<string, () => Promise<PracticePack>>> = {
  chess: async () => (await import('./chess/practice')).loadChessPractice(),
  brisca: async () => (await import('./brisca/practice')).loadBriscaPractice(),
  dominoes: async () => (await import('./dominoes/practice')).loadDominoesPractice(),
  shogi: async () => (await import('./shogi/practice')).loadShogiPractice(),
  go: async () => (await import('./go/practice')).loadGoPractice(),
  'chinese-checkers': async () => (await import('./chinese-checkers/practice')).loadCcPractice(),
  poker: async () => (await import('./holdem/practice')).loadPokerPractice(),
  tute: async () => (await import('./tute/practice')).loadTutePractice(),
};

export function hasPractice(gameId: string): boolean {
  return gameId in PACKS;
}

export async function loadPractice(gameId: string): Promise<PracticePack | null> {
  const load = PACKS[gameId];
  return load ? load() : null;
}

export function inSet(problem: Problem, set: PracticeSetDef, theme?: string | null): boolean {
  if (theme) return problem.themes.includes(theme) && !(set.exclude ?? []).some((t) => problem.themes.includes(t));
  return set.themes.some((t) => problem.themes.includes(t)) && !(set.exclude ?? []).some((t) => problem.themes.includes(t));
}
