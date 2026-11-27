/**
 * A lesson on the real game (PLAN.md 2.5): the board on one side, the step on the other. The
 * runner in teach/runner.ts decides everything; this screen only shows it and passes on taps.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import { loadLessons } from '../../games/lessons';
import type { LessonPack } from '../../games/lessons';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi, SurfaceOverlay } from '../../games/types';
import { appDb } from '../../store/db';
import { completeLessons, lessonProgress } from '../../store/learning';
import type { Lesson, LessonStep, QuizStep } from '../../teach/lesson';
import { fillText } from '../../teach/lesson';
import type { RunnerState } from '../../teach/runner';
import { canAdvance, chooseOption, currentQuestion, currentStep, next, opponentMove, playReply, retry, reveal, startLesson, submitMove, submitNumber } from '../../teach/runner';
import { passedCheck, stageCheck } from '../../teach/stage-check';
import { gameName, t, tDynamic } from '../../text';
import { botHost } from '../bots';
import { Icon } from '../components/Icon';
import { href, navigate } from '../router';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { CenterMessage } from '../screens/common';
import { StudyShell } from './StudyShell';
import { useStudyBoard } from './board';

/** Search size for the computer's moves in free play. */
const FREE_PLAY_NODES = 150_000;
const REPLY_PAUSE_MS = 650;
const SHOW_PAUSE_MS = 900;

export function lessonGameId(lessonId: string): string {
  return lessonId.split('.')[0] ?? '';
}

function isCheckId(lessonId: string): boolean {
  return lessonId.split('.')[1] === 'check';
}

export function LessonScreen({ lessonId }: { lessonId: string }) {
  const gameId = lessonGameId(lessonId);
  const data = useAsync(async () => {
    const [pack, ui] = await Promise.all([loadLessons(gameId), loadGameUi(gameId)]);
    return { pack, ui };
  }, gameId);
  if (data.status === 'loading') return <CenterMessage>{t('app.loading')}</CenterMessage>;
  if (data.status === 'failed' || !data.value.pack) return <CenterMessage>{t('app.not-found')}</CenterMessage>;
  const { pack, ui } = data.value;
  const stage = lessonId.split('.')[2] ?? '';
  const lesson = isCheckId(lessonId) ? stageCheck(pack.lessons, pack.game, gameId, stage as Lesson['stage']) : pack.lessons.find((l) => l.id === lessonId);
  if (!lesson || lesson.steps.length === 0) return <CenterMessage>{t('app.not-found')}</CenterMessage>;
  return <LessonPlayer key={lesson.id} lesson={lesson} pack={pack} ui={ui} />;
}

function stepTitle(lesson: Lesson): string {
  return isCheckId(lesson.id) ? t('learn.check.title', { stage: t(`learn.stage.${lesson.stage}`) }) : lesson.title;
}

function feedbackText(feedback: string | null): string | null {
  if (!feedback) return null;
  if (feedback === 'try-again' || feedback === 'revealed' || feedback === 'right' || feedback === 'out-of-moves' || feedback === 'illegal') return t(`lesson.feedback.${feedback}`);
  return feedback;
}

/** A drill: a generated exercise on the lesson runner, recorded as practice rather than as a lesson. */
export interface DrillMode {
  readonly backTo: string;
  readonly onDone: (mistakes: number) => Promise<void>;
  readonly onNext: () => void;
}

export function LessonPlayer({ lesson, pack, ui, drill }: { lesson: Lesson; pack: LessonPack; ui: AnyGameUi; drill?: DrillMode }) {
  const game = pack.game;
  const profileId = useApp((s) => s.profile?.id ?? '');
  const notify = useApp((s) => s.notify);
  const [s, setS] = useState<RunnerState>(() => startLesson(lesson));
  const [entry, setEntry] = useState('');
  const [chosen, setChosen] = useState<number | null>(null);
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const saved = useRef(false);
  const step = currentStep(s);
  const question = currentQuestion(s);
  const computed = useMemo(() => game.computed(game.position(s.position)), [game, s.position]);
  const board = useStudyBoard(ui, s.position, s.lastMove);
  const isCheck = isCheckId(lesson.id);
  const fill = useCallback((text: string) => fillText(text, computed), [computed]);
  // In free play the student plays the side to move in the step's own starting position.
  const studentSide = useMemo(() => (step?.kind === 'freePlay' ? ui.def.turn(ui.def.codec.state.fromText(step.position)) : null), [step, ui]);

  // Show steps play their moves one at a time; scripted replies follow a short pause.
  useEffect(() => {
    if (step?.kind === 'show' && s.shown < step.moves.length) {
      const timer = setTimeout(() => setS((x) => next(game, x)), s.shown === 0 ? SHOW_PAUSE_MS / 2 : SHOW_PAUSE_MS);
      return () => clearTimeout(timer);
    }
    if (s.pendingReply) {
      const timer = setTimeout(() => setS((x) => playReply(game, x)), REPLY_PAUSE_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [game, step, s.shown, s.pendingReply]);

  // Free play: the engine answers the student's moves.
  useEffect(() => {
    if (step?.kind !== 'freePlay') return;
    const state = ui.def.codec.state.fromText(s.position);
    const turn = ui.def.turn(state);
    if (turn === null || turn === studentSide || s.phase !== 'ready') return;
    let live = true;
    botHost()
      .advise({ gameId: ui.def.id, view: ui.def.view(state, turn), seat: turn, query: { type: 'best', nodes: FREE_PLAY_NODES }, seed: `${lesson.id}/free` })
      .then((answer: Json) => {
        if (!live) return;
        const uci = isJsonObject(answer) && typeof answer.uci === 'string' ? answer.uci : null;
        if (uci) setS((x) => (x.position === s.position ? opponentMove(game, x, uci) : x));
      })
      .catch((err: unknown) => live && notify(t('table.error', { message: (err as Error).message })));
    return () => {
      live = false;
    };
  }, [game, lesson.id, notify, s.phase, s.position, step, studentSide, ui]);

  // Save the lesson when it is done (a stage check marks its whole stage).
  useEffect(() => {
    if (s.phase !== 'done' || saved.current) return;
    saved.current = true;
    void (async () => {
      if (drill) {
        await drill.onDone(s.mistakes);
        return;
      }
      if (isCheck) {
        const last = lesson.steps[lesson.steps.length - 1];
        const total = last?.kind === 'checkpoint' ? last.questions.length : 0;
        const passed = passedCheck(s.right, total);
        setCheckResult(passed ? 'passed' : 'failed');
        if (passed) {
          const ids = pack.lessons.filter((l) => l.gameId === lesson.gameId && l.stage === lesson.stage).map((l) => l.id);
          await completeLessons(appDb(), profileId, lesson.gameId, ids, { mistakes: 0, skipped: true }, Date.now());
        }
      } else {
        await completeLessons(appDb(), profileId, lesson.gameId, [lesson.id], { mistakes: s.mistakes, skipped: false }, Date.now());
      }
    })();
  }, [drill, isCheck, lesson, pack.lessons, profileId, s.mistakes, s.phase, s.right]);

  const seat = ui.def.turn(board.state);
  const thinking = step?.kind === 'freePlay' && seat !== null && seat !== studentSide && s.phase === 'ready';
  const moving = question?.kind === 'askMove' || step?.kind === 'freePlay';
  const interactive =
    seat !== null &&
    !thinking &&
    s.pendingReply === null &&
    moving &&
    (s.phase === 'ready' || s.phase === 'wrong') &&
    (step?.kind !== 'freePlay' || seat === studentSide);
  const legal = interactive && seat !== null ? ui.def.legal(board.state, seat) : [];
  const overlay: SurfaceOverlay = {
    arrows: (s.phase === 'ready' || step?.kind === 'say' || step?.kind === 'show' ? (step?.arrows ?? []) : []).map((a) => ({ from: a.from, to: a.to, tone: 'hint' as const })),
    marks: (step?.marks ?? []).map((square) => ({ square, tone: 'info' as const })),
  };

  const onAction = (action: unknown) => {
    board.skip();
    const move = ui.def.codec.action.toText(action);
    setS((x) => submitMove(game, x, move, game.computed(game.position(x.position))));
  };

  const Surface = ui.Surface;
  const total = lesson.steps.length;
  const meta = s.phase === 'done' ? t('lesson.done.short') : t('lesson.step', { n: Math.min(s.step + 1, total), total });
  const backTo = drill?.backTo ?? `/games/${lesson.gameId}/learn`;

  return (
    <StudyShell
      label={stepTitle(lesson)}
      title={stepTitle(lesson)}
      meta={meta}
      backTo={backTo}
      board={
        <Surface
          state={board.state}
          mySeats={interactive && seat !== null ? [seat] : []}
          canAct={interactive}
          legal={legal}
          lastAction={board.lastAction}
          anim={board.anim}
          onAction={onAction}
          onSkip={board.skip}
          flipped={false}
          helps={{ legal: true }}
          overlay={overlay}
        />
      }
      panel={
        s.phase === 'done' && drill ? (
          <div className="lesson-panel lesson-done" role="status">
            <h2>{t('drill.done')}</h2>
            <p className="muted">{s.mistakes === 0 ? t('lesson.done.clean') : t('lesson.done.mistakes', { n: s.mistakes })}</p>
            <div className="lesson-actions">
              <a className="btn" href={href(drill.backTo)}>
                {t('practice.back', { game: gameName(lesson.gameId) })}
              </a>
              <button type="button" className="btn btn-primary" onClick={drill.onNext}>
                {t('drill.next')}
                <Icon name="chevron" size={18} />
              </button>
            </div>
          </div>
        ) : s.phase === 'done' ? (
          <LessonDone lesson={lesson} pack={pack} mistakes={s.mistakes} checkResult={checkResult} right={s.right} profileId={profileId} onRetry={() => {
            saved.current = false;
            setCheckResult(null);
            setS(startLesson(lesson));
          }} />
        ) : (
          <div className="lesson-panel">
            <ol className="lesson-dots" aria-label={meta}>
              {lesson.steps.map((_, i) => (
                <li key={i} data-state={i < s.step ? 'done' : i === s.step ? 'now' : 'todo'} />
              ))}
            </ol>
            {step ? <StepBody step={step} question={question} s={s} fill={fill} thinking={thinking} entry={entry} setEntry={setEntry} chosen={chosen} onChoose={(i) => {
              setChosen(i);
              setS((x) => chooseOption(game, x, i, computed));
            }} onNumber={(n) => {
              setEntry('');
              setS((x) => submitNumber(game, x, n, computed));
            }} /> : null}
            <Feedback s={s} answer={question?.kind === 'askNumber' ? computed[question.answer] : undefined} />
            <div className="lesson-actions">
              {step?.kind === 'freePlay' && s.phase === 'failed' ? (
                <button type="button" className="btn btn-primary" onClick={() => setS((x) => retry(game, x))}>
                  <Icon name="again" size={18} />
                  {t('lesson.retry')}
                </button>
              ) : null}
              {s.phase === 'wrong' && step && step.kind !== 'checkpoint' && step.kind !== 'freePlay' ? (
                <button type="button" className="btn" onClick={() => setS((x) => reveal(game, x))}>
                  {t('lesson.show')}
                </button>
              ) : null}
              <button type="button" className="btn btn-primary" disabled={!canAdvance(s) || s.pendingReply !== null} onClick={() => {
                setChosen(null);
                setS((x) => next(game, x));
              }}>
                {t('lesson.next')}
                <Icon name="chevron" size={18} />
              </button>
            </div>
          </div>
        )
      }
    />
  );
}

function StepBody({ step, question, s, fill, thinking, entry, setEntry, chosen, onChoose, onNumber }: { step: LessonStep; question: QuizStep | LessonStep | null; s: RunnerState; fill: (text: string) => string; thinking: boolean; entry: string; setEntry: (v: string) => void; chosen: number | null; onChoose: (i: number) => void; onNumber: (n: number) => void }) {
  const q = step.kind === 'checkpoint' ? question : step;
  const done = s.phase === 'correct' || s.phase === 'revealed';
  return (
    <div className="lesson-step" aria-live="polite">
      {step.kind === 'checkpoint' ? (
        <p className="eyebrow">{step.questions.length > 0 && s.question < step.questions.length ? t('lesson.question', { n: s.question + 1, total: step.questions.length }) : t('lesson.quiz.done', { right: s.right, total: step.questions.length })}</p>
      ) : null}
      {step.kind === 'checkpoint' && step.text ? <p className="lesson-text">{fill(step.text)}</p> : null}
      {q && (step.kind !== 'checkpoint' || s.question < step.questions.length) ? <p className="lesson-text">{fill(q.text)}</p> : null}
      {step.kind === 'freePlay' ? <p className="faint num">{thinking ? t('lesson.thinking') : t('lesson.moves-left', { n: Math.max(0, step.maxMoves - s.freeMoves) })}</p> : null}
      {q?.kind === 'askMove' && s.phase !== 'correct' ? <p className="faint">{t('lesson.your-move')}</p> : null}
      {q?.kind === 'askChoice' && (step.kind !== 'checkpoint' || s.question < step.questions.length) ? (
        <div className="choice-list">
          {q.options.map((o, i) => (
            <button
              key={o.text}
              type="button"
              className="choice"
              disabled={done}
              data-state={step.kind === 'checkpoint' ? undefined : done && o.correct ? 'right' : chosen === i && !o.correct ? 'wrong' : undefined}
              onClick={() => onChoose(i)}
            >
              {fill(o.text)}
            </button>
          ))}
        </div>
      ) : null}
      {q?.kind === 'askNumber' && !done && (step.kind !== 'checkpoint' || s.question < step.questions.length) ? <NumberPad value={entry} onChange={setEntry} onSubmit={onNumber} /> : null}
    </div>
  );
}

function NumberPad({ value, onChange, onSubmit }: { value: string; onChange: (v: string) => void; onSubmit: (n: number) => void }) {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  return (
    <div className="number-pad">
      <output className="number-entry num" aria-label={t('lesson.number.entry')}>
        {value || ' '}
      </output>
      <div className="number-keys">
        {digits.map((d) => (
          <button key={d} type="button" className="key num" onClick={() => onChange((value + d).slice(0, 3))}>
            {d}
          </button>
        ))}
        <button type="button" className="key" aria-label={t('lesson.number.clear')} onClick={() => onChange(value.slice(0, -1))}>
          <Icon name="back" size={18} />
        </button>
        <button type="button" className="key key-ok" disabled={value === ''} onClick={() => onSubmit(Number(value))}>
          {t('lesson.number.check')}
        </button>
      </div>
    </div>
  );
}

function Feedback({ s, answer }: { s: RunnerState; answer: string | number | undefined }) {
  const inQuiz = currentStep(s)?.kind === 'checkpoint';
  const text =
    inQuiz && s.lastRight === false && s.feedback === 'try-again'
      ? t('lesson.feedback.missed')
      : s.phase === 'revealed' && answer !== undefined
        ? t('lesson.answer-is', { n: answer })
        : feedbackText(s.feedback);
  if (!text) return null;
  const tone = inQuiz ? (s.lastRight ? 'good' : 'bad') : s.phase === 'correct' ? 'good' : s.phase === 'wrong' || s.phase === 'failed' ? 'bad' : 'info';
  return (
    <p className="lesson-feedback" data-tone={tone} role="status">
      {text}
    </p>
  );
}

function LessonDone({ lesson, pack, mistakes, checkResult, right, profileId, onRetry }: { lesson: Lesson; pack: LessonPack; mistakes: number; checkResult: string | null; right: number; profileId: string; onRetry: () => void }) {
  const progress = useAsync(() => lessonProgress(appDb(), profileId, lesson.gameId), `${profileId}:${lesson.id}:${checkResult ?? ''}`);
  const done = progress.status === 'done' ? progress.value : new Map();
  const upNext = pack.lessons.find((l) => l.gameId === lesson.gameId && l.id !== lesson.id && !done.has(l.id));
  const isCheck = isCheckId(lesson.id);
  const last = lesson.steps[lesson.steps.length - 1];
  const total = last?.kind === 'checkpoint' ? last.questions.length : 0;
  return (
    <div className="lesson-panel lesson-done" role="status">
      <h2>{isCheck ? (checkResult === 'passed' ? t('learn.check.passed') : t('learn.check.failed')) : t('lesson.done')}</h2>
      <p className="muted">
        {isCheck ? t('lesson.quiz.done', { right, total }) : mistakes === 0 ? t('lesson.done.clean') : t('lesson.done.mistakes', { n: mistakes })}
      </p>
      {isCheck && checkResult === 'passed' ? <p className="muted">{t('learn.check.passed.detail', { stage: t(`learn.stage.${lesson.stage}`) })}</p> : null}
      {isCheck && checkResult === 'failed' ? <p className="muted">{t('learn.check.failed.detail')}</p> : null}
      <div className="lesson-actions">
        {isCheck && checkResult === 'failed' ? (
          <button type="button" className="btn" onClick={onRetry}>
            <Icon name="again" size={18} />
            {t('lesson.retry')}
          </button>
        ) : null}
        <a className="btn" href={href(`/games/${lesson.gameId}/learn`)}>
          {t('learn.all', { game: gameName(lesson.gameId) })}
        </a>
        {upNext ? (
          <button type="button" className="btn btn-primary" onClick={() => navigate(`/learn/${upNext.id}`)}>
            {tDynamic('lesson.next-lesson', { title: upNext.title })}
            <Icon name="chevron" size={18} />
          </button>
        ) : null}
      </div>
    </div>
  );
}
