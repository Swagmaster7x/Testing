import type { Lesson } from '../../../teach/lesson';
import { HK_LESSONS } from './hk';
import { BASIC_LESSONS } from './lessons';
import { TABLE_LESSONS } from './table';

/** In stage order: the Learn screen suggests the first lesson not yet done. */
export const MAHJONG_LESSONS: readonly Lesson[] = [...BASIC_LESSONS, ...HK_LESSONS, ...TABLE_LESSONS];
export { mahjongLessonGame } from './game';
