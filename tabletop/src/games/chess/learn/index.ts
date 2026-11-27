import type { Lesson } from '../../../teach/lesson';
import { STAGE_0, STAGE_1 } from './stage0-1';
import { STAGE_2, STAGE_3 } from './stage2-3';
import { openingLessons } from './openings';
import { TABLE_READY } from './table';

export { chessLessonGame } from './game';

/** Stage 4: the opening trainer (M15). */
export const STAGE_4: readonly Lesson[] = openingLessons();

/** All chess lessons, in the recommended order. */
export const CHESS_LESSONS: readonly Lesson[] = [...STAGE_0, ...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4, ...TABLE_READY];
