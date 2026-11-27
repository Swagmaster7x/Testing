import type { Lesson } from '../../../teach/lesson';
import { STAGE_0, STAGE_1, STAGE_2, TABLE_READY } from './lessons';

export { ccLessonGame } from './game';

/** All Chinese Checkers lessons, in the recommended order. */
export const CC_LESSONS: readonly Lesson[] = [...STAGE_0, ...STAGE_1, ...STAGE_2, ...TABLE_READY];
