/** Everything Progress and Today show for one game, gathered from the device's data. */
import { outcomePoints } from '../core/contract';
import { stableStringify } from '../core/json';
import { hasLessons, loadLessons } from '../games/lessons';
import { hasPractice } from '../games/practice';
import type { ReadyId } from '../games/ready';
import { readyDone, readyItems } from '../games/ready';
import { loadGameUi } from '../games/registry';
import type { AnyGameUi } from '../games/types';
import { appDb } from '../store/db';
import { analysesFor, attemptsFor, cardsFor, lessonProgress } from '../store/learning';
import { finishedRecords } from '../store/records';
import type { Lesson, StageId } from '../teach/lesson';
import { STAGES } from '../teach/lesson';
import { analysisFromJson } from '../teach/analysis';
import type { RatingState } from '../teach/rating';
import { playRatingFor, problemRatingFor, suggestedLevel } from './ratings';

export interface StageProgress {
  readonly stage: StageId;
  readonly done: number;
  readonly total: number;
}

export interface ReadyState {
  readonly id: ReadyId;
  readonly done: boolean;
  readonly lessons: readonly Lesson[];
  readonly drill: { id: string; times: number; passed: number } | null;
  readonly beatLevel: number | null;
}

export interface GameProgress {
  readonly gameId: string;
  readonly ui: AnyGameUi;
  readonly lessonsDone: number;
  readonly lessonsTotal: number;
  readonly stages: readonly StageProgress[];
  readonly nextLesson: Lesson | null;
  readonly problems: RatingState & { solved: number };
  readonly play: RatingState;
  readonly suggested: number;
  /** Your accuracy in analysed games against the CPU, oldest first (last ten). */
  readonly accuracy: readonly number[];
  readonly due: number;
  readonly cards: number;
  readonly ready: readonly ReadyState[];
}

export async function gameProgress(gameId: string, profileId: string, now: number = Date.now()): Promise<GameProgress> {
  const db = appDb();
  const [ui, pack, done, attempts, cards, records, analyses] = await Promise.all([
    loadGameUi(gameId),
    hasLessons(gameId) ? loadLessons(gameId) : Promise.resolve(null),
    lessonProgress(db, profileId, gameId),
    attemptsFor(db, profileId, gameId),
    hasPractice(gameId) ? cardsFor(db, profileId, gameId) : Promise.resolve([]),
    finishedRecords(db, profileId, gameId),
    analysesFor(db, profileId, gameId),
  ]);
  const lessons = pack?.lessons ?? [];
  const stages = STAGES.filter((st) => lessons.some((l) => l.stage === st)).map((stage) => {
    const inStage = lessons.filter((l) => l.stage === stage);
    return { stage, done: inStage.filter((l) => done.has(l.id)).length, total: inStage.length };
  });
  const [play, problems] = await Promise.all([playRatingFor(ui, profileId), problemRatingFor(gameId, profileId)]);

  // Accuracy in analysed games against the CPU, in the order they were played.
  const byId = new Map(records.map((r) => [r.id, r]));
  const accuracy = analyses
    .flatMap((row) => {
      const record = byId.get(row.recordId);
      const analysis = analysisFromJson(row.data);
      const seat = record?.players.findIndex((p) => p.kind === 'human') ?? -1;
      if (!record || !analysis || seat < 0 || !record.players.some((p) => p.kind === 'bot')) return [];
      const value = analysis.accuracy[String(seat)];
      return typeof value === 'number' ? [{ at: record.updatedAt, value }] : [];
    })
    .sort((a, b) => a.at - b.at)
    .slice(-10)
    .map((x) => x.value);

  // Facts for the table-ready checklist.
  const standard = stableStringify(ui.def.codec.config.toJSON(ui.def.defaultConfig));
  let bestWin = 0;
  for (const r of records) {
    const bot = r.players.find((p) => p.kind === 'bot');
    const seat = r.players.findIndex((p) => p.kind === 'human');
    if (!bot || seat < 0 || r.training || !r.outcome || stableStringify(r.config) !== standard) continue;
    if (outcomePoints(r.outcome, seat) === 1) bestWin = Math.max(bestWin, bot.level ?? 0);
  }
  const drillsPassed = new Map<string, number>();
  for (const a of attempts) if (a.solved && a.rated === false && a.problemId.startsWith('drill-')) drillsPassed.set(a.problemId, (drillsPassed.get(a.problemId) ?? 0) + 1);
  const lessonsDone = new Set(done.keys());
  const ready = readyItems(gameId).map((item) => ({
    id: item.id,
    done: readyDone(item, { lessonsDone, drillsPassed, bestWin }),
    lessons: (item.lessons ?? []).map((id) => lessons.find((l) => l.id === id)).filter((l): l is Lesson => l !== undefined),
    drill: item.drill ? { ...item.drill, passed: drillsPassed.get(item.drill.id) ?? 0 } : null,
    beatLevel: item.beatLevel ?? null,
  }));

  return {
    gameId,
    ui,
    lessonsDone: lessons.filter((l) => done.has(l.id)).length,
    lessonsTotal: lessons.length,
    stages,
    nextLesson: lessons.find((l) => !done.has(l.id)) ?? null,
    problems: { ...problems, solved: attempts.filter((a) => a.solved && !a.problemId.startsWith('drill-')).length },
    play,
    suggested: suggestedLevel(ui, play),
    accuracy,
    due: cards.filter((c) => c.schedule.due <= now).length,
    cards: cards.length,
    ready,
  };
}
