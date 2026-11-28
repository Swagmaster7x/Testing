import type { Lesson } from '../../../teach/lesson';
import { HK_LESSONS } from './hk';
import { BASIC_LESSONS } from './lessons';
import { RIICHI_LESSONS } from './riichi';
import { SICHUAN_LESSONS } from './sichuan';
import { AMERICAN_LESSONS } from './american';
import { TABLE_LESSONS } from './table';

/** In stage order: the Learn screen suggests the first lesson not yet done. */
export const MAHJONG_LESSONS: readonly Lesson[] = [...BASIC_LESSONS, ...HK_LESSONS, ...RIICHI_LESSONS, ...SICHUAN_LESSONS, ...AMERICAN_LESSONS, ...TABLE_LESSONS];
export { mahjongLessonGame } from './game';
