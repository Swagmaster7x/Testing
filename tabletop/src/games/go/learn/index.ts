import type { Lesson } from '../../../teach/lesson';
import { STAGE_0, STAGE_1 } from './stage0-1';
import { STAGE_2, STAGE_3 } from './stage2-3';
import { josekiLessons } from './joseki';
import { TABLE_READY } from './table';

export { goLessonGame } from './game';

/** Stage 4: joseki basics (M15). */
export const STAGE_4: readonly Lesson[] = josekiLessons();

/** All Go lessons, in the recommended order: Capture-Go first. */
export const GO_LESSONS: readonly Lesson[] = [...STAGE_0, ...STAGE_1, ...STAGE_2, ...STAGE_3, ...STAGE_4, ...TABLE_READY];
