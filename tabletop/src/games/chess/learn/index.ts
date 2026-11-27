import type { Lesson } from '../../../teach/lesson';
import { STAGE_0, STAGE_1 } from './stage0-1';
import { STAGE_2, STAGE_3 } from './stage2-3';
import { TABLE_READY } from './table';

export { chessLessonGame } from './game';

/** All chess lessons, in the recommended order. */
export const CHESS_LESSONS: readonly Lesson[] = [...STAGE_0, ...STAGE_1, ...STAGE_2, ...STAGE_3, ...TABLE_READY];
