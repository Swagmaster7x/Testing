import type { Lesson } from '../../../teach/lesson';
import { STAGE_0, STAGE_1 } from './stage0-1';
import { STAGE_2, STAGE_3 } from './stage2-3';
import { TABLE_READY } from './table';

export { shogiLessonGame } from './game';

/** All shogi lessons, in the recommended order. */
export const SHOGI_LESSONS: readonly Lesson[] = [...STAGE_0, ...STAGE_1, ...STAGE_2, ...STAGE_3, ...TABLE_READY];
