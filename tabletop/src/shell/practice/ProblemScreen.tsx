/**
 * Solving problems (PLAN.md 1.3, Practice): a set chosen near your rating, or the review queue
 * of cards that are due. Multi-move lines, a three-step hint, retry, the solution, and "add to
 * my practice" for problems you missed. Only first, unhinted tries move the problem rating.
 */
import { useEffect, useRef, useState } from 'react';
import type { PracticePack, PracticeSetDef } from '../../games/practice';
import { inSet, loadPractice } from '../../games/practice';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi, SurfaceOverlay } from '../../games/types';
import { appDb } from '../../store/db';
import type { ReviewCard } from '../../store/learning';
import { addAttempt, addCard, attemptsFor, dueCards, gradeCard, hasCard } from '../../store/learning';
import type { Problem, ProblemRun } from '../../teach/problem';
import { expectedMove, pickProblem, playProblemReply, playSetup, retryProblem, showSolution, startProblem, submitProblemMove, takeHint } from '../../teach/problem';
import { problemRating } from '../../teach/progress';
import { gameName, t, tDynamic } from '../../text';
import { Icon } from '../components/Icon';
import { href, navigate } from '../router';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { CenterMessage } from '../screens/common';
import { StudyShell } from '../learn/StudyShell';
import { useStudyBoard } from '../learn/board';

const SETUP_PAUSE_MS = 700;
const REPLY_PAUSE_MS = 600;
const SOLUTION_STEP_MS = 900;

/** A review card as a problem: a saved problem, or a position from one of your games. */
function cardProblem(card: ReviewCard, pack: PracticePack): Problem | null {
  const item = card.item;
  if (item.kind === 'problem') return pack.problems.find((p) => p.id === item.problemId) ?? null;
  const [first, ...rest] = item.accept;
  if (!first) return null;
  return { id: card.id, position: item.position, setup: null, line: [first], alsoFirst: rest, rating: 0, themes: [] };
}

interface Session {
  readonly pack: PracticePack;
  readonly ui: AnyGameUi;
  readonly set: PracticeSetDef | null;
  readonly pool: readonly Problem[];
  readonly queue: readonly { card: ReviewCard; problem: Problem }[];
  readonly rating: { rating: number; count: number };
  readonly tried: Map<string, number>;
  /** The first problem, chosen when the session loads. */
  readonly first: Problem | null;
}

export function ProblemScreen({ gameId, setId, theme, problemId }: { gameId: string; setId: string; theme: string | null; problemId: string | null }) {
  const profileId = useApp((s) => s.profile?.id ?? '');
  const data = useAsync(async (): Promise<Session | null> => {
    const [pack, ui, attempts, due] = await Promise.all([loadPractice(gameId), loadGameUi(gameId), attemptsFor(appDb(), profileId, gameId), dueCards(appDb(), profileId, gameId, Date.now())]);
    if (!pack) return null;
    const set = pack.sets.find((s) => s.id === setId) ?? null;
    const pool = set ? pack.problems.filter((p) => inSet(p, set, theme)) : pack.problems;
    const queue = setId === 'review' ? due.flatMap((card) => {
      const problem = cardProblem(card, pack);
      return problem ? [{ card, problem }] : [];
    }) : [];
    const tried = new Map<string, number>();
    for (const a of attempts) tried.set(a.problemId, a.at);
    const rating = problemRating(attempts);
    const first = setId === 'review' ? (queue[0]?.problem ?? null) : problemId ? (pack.problems.find((p) => p.id === problemId) ?? null) : pickProblem(pool, rating.rating, tried, Math.random());
    return { pack, ui, set, pool, queue, rating, tried, first };
  }, `${gameId}:${setId}:${theme ?? ''}:${problemId ?? ''}:${profileId}`);
  if (data.status === 'loading') return <CenterMessage>{t('app.loading')}</CenterMessage>;
  if (data.status === 'failed' || !data.value) return <CenterMessage>{t('app.not-found')}</CenterMessage>;
  return <ProblemSession session={data.value} gameId={gameId} setId={setId} theme={theme} profileId={profileId} />;
}

function ProblemSession({ session, gameId, setId, theme, profileId }: { session: Session; gameId: string; setId: string; theme: string | null; profileId: string }) {
  const { pack, ui, pool, queue } = session;
  const game = pack.game;
  const notify = useApp((s) => s.notify);
  const isReview = setId === 'review';
  const [rating, setRating] = useState(session.rating);
  const [tried] = useState(() => new Map(session.tried));
  const [queueIndex, setQueueIndex] = useState(0);
  const [score, setScore] = useState({ solved: 0, failed: 0 });
  const [delta, setDelta] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);
  const recorded = useRef<string | null>(null);

  const [run, setRun] = useState<ProblemRun | null>(() => (session.first ? startProblem(session.first) : null));
  const board = useStudyBoard(ui, run?.position ?? pack.problems[0]?.position ?? '', run?.lastMove ?? null);

  // The opponent's setup move, replies from the line, and the solution played step by step.
  useEffect(() => {
    if (!run) return undefined;
    if (run.phase === 'setup') {
      const timer = setTimeout(() => setRun((r) => (r ? playSetup(game, r) : r)), SETUP_PAUSE_MS);
      return () => clearTimeout(timer);
    }
    if (run.phase === 'reply' || (run.phase === 'shown' && run.index < run.problem.line.length)) {
      const timer = setTimeout(() => setRun((r) => (r ? playProblemReply(game, r) : r)), run.phase === 'shown' ? SOLUTION_STEP_MS : REPLY_PAUSE_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [game, run]);

  // Record the attempt once, when the problem is first solved or failed.
  useEffect(() => {
    if (!run || (run.phase !== 'solved' && run.phase !== 'failed') || recorded.current === run.problem.id) return;
    recorded.current = run.problem.id;
    const solved = run.phase === 'solved';
    const rated = !isReview && run.hints === 0 && !(solved && run.spoiled) && !tried.has(run.problem.id);
    const now = Date.now();
    tried.set(run.problem.id, now);
    void (async () => {
      if (isReview) {
        const card = queue[queueIndex]?.card;
        if (card) await gradeCard(appDb(), card.id, solved && run.hints === 0, now);
      } else {
        await addAttempt(appDb(), { profileId, gameId, problemId: run.problem.id, solved, at: now, rating: run.problem.rating, rated });
        if (rated) {
          const next = problemRating(await attemptsFor(appDb(), profileId, gameId));
          setDelta(next.rating - rating.rating);
          setRating(next);
        } else setDelta(null);
      }
      setScore((s) => (solved ? { ...s, solved: s.solved + 1 } : { ...s, failed: s.failed + 1 }));
      setSaved(await hasCard(appDb(), profileId, gameId, { kind: 'problem', problemId: run.problem.id }));
    })();
  }, [gameId, isReview, profileId, queue, queueIndex, rating.rating, run, tried]);

  const nextProblem = () => {
    setDelta(null);
    setSaved(false);
    recorded.current = null;
    if (isReview) {
      const i = queueIndex + 1;
      setQueueIndex(i);
      const item = queue[i];
      setRun(item ? startProblem(item.problem) : null);
      return;
    }
    const pick = pickProblem(pool, rating.rating, tried, Math.random(), run?.problem.id);
    setRun(pick ? startProblem(pick) : null);
  };

  const backTo = `/games/${gameId}/practice`;
  const title = isReview ? t('practice.review.title') : theme ? `${tDynamic(`practice.set.${setId}`)}: ${tDynamic(`theme.${theme}`)}` : tDynamic(`practice.set.${setId}`);
  if (!run) {
    return (
      <StudyShell label={title} title={title} backTo={backTo} board={null} panel={
        <div className="lesson-panel lesson-done" role="status">
          <h2>{isReview ? t('practice.review.done') : t('practice.none')}</h2>
          {isReview ? <p className="muted">{t('practice.review.done.detail', { right: score.solved, total: score.solved + score.failed })}</p> : null}
          <div className="lesson-actions">
            <a className="btn btn-primary" href={href(backTo)}>
              {t('practice.back', { game: gameName(gameId) })}
            </a>
          </div>
        </div>
      } />
    );
  }

  const seat = ui.def.turn(board.state);
  const solverSeat = solverSeatOf(ui, run, game);
  const interactive = run.phase === 'solving' && seat !== null;
  const legal = interactive && seat !== null ? ui.def.legal(board.state, seat) : [];
  const expected = expectedMove(run);
  const overlay: SurfaceOverlay = {
    arrows: run.hints >= 3 && expected && run.phase === 'solving' ? [{ from: expected.slice(0, 2), to: expected.slice(2, 4), tone: 'hint' }] : [],
    marks: run.hints >= 1 && expected && run.phase === 'solving' ? [{ square: expected.slice(0, 2), tone: 'hint' }] : [],
  };
  const Surface = ui.Surface;
  const sideName = solverSeat !== null ? ui.sideName(solverSeat) : '';
  const done = run.phase === 'solved' || run.phase === 'failed' || run.phase === 'shown';
  const meta = isReview ? t('practice.review.count', { n: queueIndex + 1, total: queue.length }) : t('practice.rating', { rating: rating.rating });
  const themeNames = pack.themeOrder.filter((th) => run.problem.themes.includes(th)).map((th) => tDynamic(`theme.${th}`));

  const addToPractice = async () => {
    const added = await addCard(appDb(), profileId, gameId, { kind: 'problem', problemId: run.problem.id }, Date.now());
    setSaved(true);
    notify(added ? t('practice.added') : t('practice.added.already'));
  };

  return (
    <StudyShell
      label={title}
      title={title}
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
          onAction={(action) => {
            board.skip();
            const move = ui.def.codec.action.toText(action);
            setRun((r) => (r ? submitProblemMove(game, r, move) : r));
          }}
          onSkip={board.skip}
          flipped={solverSeat !== null && (ui.flipForSeat?.(solverSeat) ?? false)}
          helps={{ legal: true }}
          overlay={overlay}
        />
      }
      panel={
        <div className="lesson-panel" data-problem={run.problem.id}>
          <p className="eyebrow">{isReview ? t('practice.review.eyebrow') : run.problem.rating > 0 ? t('practice.problem.rated', { rating: run.problem.rating }) : t('practice.problem')}</p>
          <p className="lesson-text">
            {run.phase === 'setup' ? t('practice.watch') : run.phase === 'solving' ? t('practice.find', { side: sideName }) : run.phase === 'reply' ? t('practice.good-reply') : null}
          </p>
          {run.phase === 'solving' && run.hints >= 2 ? <p className="faint">{themeNames.length > 0 ? t('practice.hint.idea', { idea: themeNames[0] ?? '' }) : t('practice.hint.idea.none')}</p> : null}
          {run.phase === 'solved' ? (
            <p className="lesson-feedback" data-tone="good" role="status">
              {t('practice.solved')}
              {delta !== null ? ` ${t('practice.delta', { delta: delta >= 0 ? `+${delta}` : String(delta) })}` : ''}
            </p>
          ) : null}
          {run.phase === 'failed' ? (
            <p className="lesson-feedback" data-tone="bad" role="status">
              {t('practice.failed')}
              {delta !== null ? ` ${t('practice.delta', { delta: String(delta) })}` : ''}
            </p>
          ) : null}
          {run.phase === 'shown' ? <p className="lesson-feedback" role="status">{t('practice.solution')}</p> : null}
          {done && themeNames.length > 0 && !isReview ? <p className="faint">{t('practice.themes', { themes: themeNames.slice(0, 4).join(', ') })}</p> : null}
          {!isReview ? <p className="faint num">{t('practice.session', { solved: score.solved, failed: score.failed })}</p> : null}
          {pack.attribution && run.problem.id.startsWith('lichess:') ? <p className="faint attribution">{t(pack.attribution)}</p> : null}
          <div className="lesson-actions">
            {run.phase === 'solving' ? (
              <button type="button" className="btn" disabled={run.hints >= 3} onClick={() => setRun((r) => (r ? takeHint(r) : r))}>
                {run.hints === 0 ? t('practice.hint') : run.hints === 1 ? t('practice.hint.more') : t('practice.hint.move')}
              </button>
            ) : null}
            {run.phase === 'failed' ? (
              <>
                <button type="button" className="btn" onClick={() => setRun((r) => (r ? retryProblem(game, r) : r))}>
                  <Icon name="again" size={18} />
                  {t('lesson.retry')}
                </button>
                <button type="button" className="btn" onClick={() => setRun((r) => (r ? showSolution(game, r) : r))}>
                  {t('practice.show')}
                </button>
              </>
            ) : null}
            {done && !isReview && !saved ? (
              <button type="button" className="btn" onClick={() => void addToPractice()}>
                <Icon name="plus" size={18} />
                {t('practice.add')}
              </button>
            ) : null}
            {done ? (
              <button type="button" className="btn btn-primary" onClick={nextProblem}>
                {t('practice.next')}
                <Icon name="chevron" size={18} />
              </button>
            ) : null}
          </div>
          {done && isReview && run.phase === 'failed' ? <p className="faint">{t('practice.review.again')}</p> : null}
          {isReview ? null : (
            <button type="button" className="link-button" onClick={() => navigate(backTo)}>
              {t('practice.stop')}
            </button>
          )}
        </div>
      }
    />
  );
}

/** The seat the student plays: the side to move once the setup move is played. */
function solverSeatOf(ui: AnyGameUi, run: ProblemRun, game: PracticePack['game']): number | null {
  const before: unknown = game.position(run.problem.position);
  const start: unknown = run.problem.setup ? game.play(before, run.problem.setup) : before;
  if (start === null) return null;
  return ui.def.turn(ui.def.codec.state.fromText(game.notation(start)));
}
