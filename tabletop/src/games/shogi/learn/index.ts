import type { Lesson } from '../../../teach/lesson';
import { STAGE_0, STAGE_1 } from './stage0-1';
import { STAGE_2, STAGE_3 } from './stage2-3';
import { castleLessons } from './castles';
import { TABLE_READY } from './table';

export { shogiLessonGame } from './game';

/** Stage 4: the castle trainer (M15). */
export const STAGE_4: readonly Lesson[] = castleLessons();

/** All shogi lessons, in the recommended order. */
export const SHOGI_LESSONS: readonly Lesson[] = [...STAGE_0, ...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4, ...TABLE_READY];
