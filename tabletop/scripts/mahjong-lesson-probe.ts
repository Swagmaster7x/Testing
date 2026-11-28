/**
 * Prints what a lesson position computes (not part of the checks): the win on offer, its lines,
 * and the numbers lesson text may quote.
 *
 *   npx tsx scripts/mahjong-lesson-probe.ts '<LessonSpec as JSON>' [key ...]
 */
import type { LessonSpec } from '../src/games/mahjong/learn/game';
import { lessonState, mahjongComputed, mahjongLessonGame, winOnOffer } from '../src/games/mahjong/learn/game';

const [json = '{}', ...keys] = process.argv.slice(2);
const spec = JSON.parse(json) as LessonSpec;
const state = lessonState(spec);
const offer = winOnOffer(state);
console.log('moves:', mahjongLessonGame.moves(state).join(' '));
console.log('bonus:', state.bonus.map((b) => b.join(',')).join(' | '));
if (offer) console.log('win:', offer.score.total, offer.score.unit, offer.score.lines.map((l) => `${l.id}=${l.value}${l.times ? `x${l.times}` : ''}`).join(' '));
else console.log('no win on offer');
const values = mahjongComputed(state);
for (const k of keys.length > 0 ? keys : Object.keys(values).filter((k) => k.startsWith('win:') || k.startsWith('shanten') || k === 'min')) console.log(k, values[k]);
