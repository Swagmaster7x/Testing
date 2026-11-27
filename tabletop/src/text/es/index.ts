/**
 * The Spanish catalogue (milestone 16), the same keys as the English one, in the Spanish of Puerto
 * Rico and the Caribbean where usage differs. Any key missing here shows in English. Placeholders
 * ({name}) are kept exactly; `tests/unit/text-es.test.ts` checks them.
 */
import type { MessageKey } from '../en';
import { esBase } from './base';
import { esLearn } from './learn';

export const es: Partial<Record<MessageKey, string>> = { ...esBase, ...esLearn };
