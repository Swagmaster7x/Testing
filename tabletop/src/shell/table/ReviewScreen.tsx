/**
 * Review: replays a finished game from its record. Every position has its own link
 * (#/review/<id>/<move>), and stepping forward animates the move from the same event queue.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Json } from '../../core/json';
import type { GameEvent } from '../../core/contract';
import { EventQueue } from '../../core/events';
import { canOpen, humanSeats, parseRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi, AskCoach, SurfaceOverlay } from '../../games/types';
import { appDb } from '../../store/db';
import type { StoredRecord } from '../../store/db';
import { addCard, getAnalysis, saveAnalysis } from '../../store/learning';
import { getRecord } from '../../store/records';
import type { GameAnalysis, MoveVerdict } from '../../teach/analysis';
import { analysisFromJson, analysisToJson } from '../../teach/analysis';
import { botHost } from '../bots';
import { startGame } from './start';
import { gameName, t, tDynamic } from '../../text';
import { NO_OVERLAY } from '../../games/types';
import { saveTextFile } from '../platform';
import { Icon } from '../components/Icon';
import { useReducedMotion } from '../motion';
import { href, navigate } from '../router';
import { CenterMessage } from '../screens/common';
import { resultFor } from '../results';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { Counters, MoveList, RailSection, TableShell } from './TableShell';

const MARK: Record<string, string> = { inaccuracy: '?!', mistake: '?', blunder: '??' };

function moveLabel(m: MoveVerdict): string {
  return `${Math.floor(m.ply / 2) + 1}${m.seat === 0 ? '.' : '…'} ${m.played}`;
}

function Review({ ui, record, ply, initial }: { ui: AnyGameUi; record: StoredRecord; ply: number | null; initial: GameAnalysis | null }) {
  const settings = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const reduced = useReducedMotion(settings?.motion ?? 'system');
  const [queue] = useState(() => new EventQueue<GameEvent>({ duration: (e) => ui.eventDuration(e), reducedMotion: () => false }));
  const [{ steps, start }] = useState(() => ({ steps: replay(ui.def, record).steps, start: startState(ui.def, record) }));
  const total = steps.length;
  const current = Math.max(0, Math.min(ply ?? total, total));
  const previous = useRef(current);
  const [flipOverride, setFlipOverride] = useState(false);
  const notify = useApp((s) => s.notify);
  const anim = useSyncExternalStore(queue.subscribe, queue.snapshot);
  const [analysis, setAnalysis] = useState<GameAnalysis | null>(initial);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const profileId = useApp((s) => s.profile?.id ?? '');

  // Analyse a finished game once, in the bot worker, and keep the result.
  useEffect(() => {
    const review = ui.review;
    if (analysis || !review || record.status !== 'finished') return undefined;
    let cancelled = false;
    const ask: AskCoach = (query: Json, position?: unknown) => {
      const state = position ?? startState(ui.def, record);
      const seat = ui.def.turn(state) ?? 0;
      return botHost().advise({ gameId: ui.def.id, view: ui.def.view(state, seat), seat, query, seed: `${record.seed}/review` });
    };
    review
      .analyse(record, ask, (done, total) => !cancelled && setProgress({ done, total }), () => cancelled)
      .then(async (result) => {
        if (!result || cancelled) return;
        await saveAnalysis(appDb(), { recordId: record.id, profileId: record.profileId, gameId: record.gameId, createdAt: Date.now(), data: analysisToJson(result) });
        setAnalysis(result);
      })
      .catch((err: unknown) => !cancelled && setAnalysisError((err as Error).message));
    return () => {
      cancelled = true;
    };
  }, [analysis, record, ui]);

  useEffect(() => {
    queue.configure({ reducedMotion: () => reduced });
  }, [queue, reduced]);

  useEffect(() => {
    const step = steps[current - 1];
    // Only the latest step animates; stepping quickly never builds up a backlog.
    queue.skip();
    if (current === previous.current + 1 && step) queue.push(step.events);
    previous.current = current;
  }, [current, steps, queue]);

  useEffect(() => () => queue.clear(), [queue]);

  const go = (n: number) => navigate(`/review/${record.id}/${Math.max(0, Math.min(n, total))}`, { replace: true });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(current - 1);
      else if (e.key === 'ArrowRight') go(current + 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const state = current === 0 ? start : (steps[current - 1]?.state ?? start);
  const lastAction = current === 0 ? null : (steps[current - 1]?.action ?? null);
  const mySeats = humanSeats(record);
  const bot = record.players.find((p) => p.kind === 'bot');
  const name = gameName(ui.def.id);
  const Surface = ui.Surface;
  const SeatMark = ui.SeatMark;
  const SeatExtra = ui.SeatExtra;
  const verdicts = analysis?.moves ?? [];
  const moves = steps.map((s, i) => ({ ply: s.ply, seat: s.seat, text: `${ui.def.codec.action.toText(s.action)}${MARK[verdicts[i]?.verdict ?? ''] ?? ''}` }));
  const here = verdicts[current];
  const flagged = here && (here.verdict === 'inaccuracy' || here.verdict === 'mistake' || here.verdict === 'blunder') ? here : null;
  const overlay: SurfaceOverlay = flagged
    ? {
        arrows: [
          ...(flagged.bestMove ? [{ from: flagged.bestMove.slice(0, 2), to: flagged.bestMove.slice(2, 4), tone: 'hint' as const }] : []),
          ...(steps[current] && ui.moveSquares ? [ui.moveSquares(steps[current]?.action)].flatMap((sq) => (sq ? [{ ...sq, tone: 'threat' as const }] : [])) : []),
        ],
        marks: [],
      }
    : NO_OVERLAY;
  const humanSeat = mySeats[0] ?? 0;
  const playOn = async () => {
    const review = ui.review;
    if (!review) return;
    const id = await startGame(ui, profileId, { level: bot?.level ?? 1, side: humanSeat, config: review.configAt(state), clock: null });
    navigate(`/play/${id}`);
  };
  const addMoment = async (m: MoveVerdict) => {
    const before = current === m.ply ? state : (m.ply === 0 ? start : steps[m.ply - 1]?.state);
    if (before === undefined) return;
    const added = await addCard(appDb(), profileId, ui.def.id, { kind: 'position', position: ui.def.codec.state.toText(before), accept: m.accept, played: m.played, recordId: record.id, ply: m.ply }, Date.now());
    notify(added ? t('practice.added') : t('practice.added.already'));
  };
  const exportAs = (format: NonNullable<AnyGameUi['exportRecord']>) => {
    const names = ui.def.seats(start).map((s) => (record.players[s]?.kind === 'bot' ? `${t('common.cpu')} ${t('common.level', { n: record.players[s]?.level ?? 1 })}` : t('common.you')));
    const fileName = `${ui.def.id}-${new Date(record.createdAt).toISOString().slice(0, 10)}.${format.extension}`;
    saveTextFile(fileName, format.write(record, names), name).then(
      () => notify(t('table.exported', { file: fileName })),
      (err: unknown) => notify(t('settings.backup.failed', { message: (err as Error).message })),
    );
  };
  const seatNames = ui.def.seats(start).map((s) => (ui.movePrefix ? ui.movePrefix(s) : ui.sideName(s)));
  const positionText = current === 0 ? t('review.start') : t('review.of', { n: current, total });

  return (
    <TableShell
      label={`${t('review.title')}: ${name}`}
      title={`${t('review.title')} · ${name}`}
      meta={bot ? [{ key: 'level', text: t('review.vs', { n: bot.level ?? 1 }) }] : []}
      turn={{ text: positionText, mine: false }}
      backTo={`/games/${ui.def.id}`}
      railSide={settings?.railSide ?? 'right'}
      railOpen={settings?.railOpen ?? true}
      onToggleRail={() => void updateSettings({ railOpen: !(settings?.railOpen ?? true) })}
      menu={(close) => (
        <>
          {ui.flipForSeat ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                setFlipOverride((f) => !f);
              }}
            >
              <Icon name="again" size={20} />
              {t('table.flip')}
            </button>
          ) : null}
          {ui.exportRecord ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close();
                if (ui.exportRecord) exportAs(ui.exportRecord);
              }}
            >
              <Icon name="export" size={20} />
              {t('table.export', { format: ui.exportRecord.extension.toUpperCase() })}
            </button>
          ) : null}
          {ui.moreExports
            ?.filter((format) => format.canWrite?.(record) ?? true)
            .map((format) => (
              <button
                key={format.extension}
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  exportAs(format);
                }}
              >
                <Icon name="export" size={20} />
                {t('table.export', { format: format.extension.toUpperCase() })}
              </button>
            ))}
          <a role="menuitem" href={href(`/games/${ui.def.id}/reference`)} onClick={close}>
            <Icon name="reference" size={20} />
            {t('table.reference')}
          </a>
          <a role="menuitem" href={href(`/games/${ui.def.id}`)} onClick={close}>
            <Icon name="leave" size={20} />
            {t('table.to-hub')}
          </a>
        </>
      )}
      side={
        <>
          <ul className="players" aria-label={t('play.side')}>
            {ui.def.seats(start).map((seat) => {
              const player = record.players[seat];
              return (
                <li key={seat} className="player" data-turn={false}>
                  <span className="player-mark">
                    <SeatMark seat={seat} />
                  </span>
                  <span className="player-text">
                    <span className="player-name">{player?.kind === 'bot' ? t('common.cpu') : t('common.you')}</span>
                    <span className="player-detail">{player?.kind === 'bot' ? t('common.level', { n: player.level ?? 1 }) : ui.sideName(seat)}</span>
                    {SeatExtra ? <SeatExtra state={state} start={start} seat={seat} /> : null}
                  </span>
                </li>
              );
            })}
          </ul>
          {record.outcome ? (
            <div className="result-card">
              <h2>{record.players.some((p) => p.kind === 'bot') ? t(resultFor(record)) : sideResult(ui, record)}</h2>
              <p>{tDynamic(`reason.${record.outcome.reason}`)}</p>
            </div>
          ) : null}
          <div className="side-actions">
            <p className="ply-label num" aria-live="polite">
              {positionText}
            </p>
            <div className="stepper">
              <button type="button" className="icon-btn" aria-label={t('review.first')} disabled={current === 0} onClick={() => go(0)}>
                <Icon name="first" />
              </button>
              <button type="button" className="icon-btn" aria-label={t('review.prev')} disabled={current === 0} onClick={() => go(current - 1)}>
                <Icon name="prev" />
              </button>
              <button type="button" className="icon-btn" aria-label={t('review.next')} disabled={current === total} onClick={() => go(current + 1)}>
                <Icon name="next" />
              </button>
              <button type="button" className="icon-btn" aria-label={t('review.last')} disabled={current === total} onClick={() => go(total)}>
                <Icon name="last" />
              </button>
            </div>
          </div>
        </>
      }
      surface={
        <Surface
          state={state}
          mySeats={mySeats}
          canAct={false}
          legal={[]}
          lastAction={lastAction}
          anim={anim}
          onAction={() => undefined}
          onSkip={() => queue.skip()}
          flipped={(ui.flipForSeat?.(mySeats[0] ?? 0) ?? false) !== flipOverride}
          helps={{}}
          overlay={overlay}
        />
      }
      rail={
        <>
          <RailSection title={t('review.moments')}>
          {flagged ? (
              <div className="moment-card" data-verdict={flagged.verdict}>
                <h2>
                  {moveLabel(flagged)} · {t(`review.verdict.${flagged.verdict}`)}
                </h2>
                {flagged.reason ? <p>{tDynamic(flagged.reason.key, flagged.reason.params)}</p> : null}
                {flagged.best && flagged.reason?.key !== 'why.better' ? <p className="faint">{t('review.best', { move: flagged.best })}</p> : null}
                {mySeats.includes(flagged.seat) && flagged.accept.length > 0 ? (
                  <button type="button" className="btn btn-small" onClick={() => void addMoment(flagged)}>
                    <Icon name="plus" size={16} />
                    {t('review.add')}
                  </button>
                ) : null}
              </div>
            ) : null}
            {ui.review && bot ? (
              <button type="button" className="btn btn-small play-on" onClick={() => void playOn()}>
                <Icon name="play" size={16} />
                {t('review.play-on')}
              </button>
            ) : null}
            <KeyMoments analysis={analysis} progress={progress} error={analysisError} ui={ui} record={record} supported={ui.review !== undefined} />
          </RailSection>
          <RailSection title={t('rail.moves')}>
            <MoveList moves={moves} seatNames={seatNames} current={current} linkFor={(n) => `/review/${record.id}/${n}`} />
          </RailSection>
          <RailSection title={t('rail.counters')}>
            <Counters rows={ui.counters(state, mySeats)} />
          </RailSection>
        </>
      }
    />
  );
}

/** The result of a game between two people, by side. */
function sideResult(ui: AnyGameUi, record: StoredRecord): string {
  const outcome = record.outcome;
  if (!outcome) return t('result.unfinished');
  const firsts = outcome.results.filter((r) => r.place === 1);
  const winner = firsts.length === 1 ? firsts[0] : undefined;
  return winner ? t('result.side-wins', { side: ui.sideName(winner.seat) }) : t('result.draw');
}

/** "You" and "CPU" against the computer; the side's name when people played both sides. */
function whoPlayed(ui: AnyGameUi, record: StoredRecord, seat: number): string {
  const hasBot = record.players.some((p) => p.kind === 'bot');
  if (!hasBot) return ui.sideName(seat);
  return record.players[seat]?.kind === 'bot' ? t('common.cpu') : t('common.you');
}

function KeyMoments({ analysis, progress, error, ui, record, supported }: { analysis: GameAnalysis | null; progress: { done: number; total: number } | null; error: string | null; ui: AnyGameUi; record: StoredRecord; supported: boolean }) {
  if (!supported) return <p className="empty-note">{t('review.key-moments')}</p>;
  if (error) return <p className="empty-note">{t('review.analysis.failed', { message: error })}</p>;
  if (!analysis) {
    const pct = progress ? Math.round((progress.done / Math.max(1, progress.total)) * 100) : 0;
    return (
      <div className="analysing" role="status">
        <p className="empty-note">{progress ? t('review.analysing', { done: progress.done, total: progress.total }) : t('review.analysing.start')}</p>
        <div className="bar" aria-hidden="true">
          <span style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }
  const seats = ui.def.seats(startState(ui.def, record));
  const moments = analysis.keyMoments.map((p) => analysis.moves[p]).filter((m): m is MoveVerdict => m !== undefined);
  return (
    <div className="moments">
      <p className="accuracy num">
        {seats.map((seat) => t('review.accuracy.seat', { who: whoPlayed(ui, record, seat), n: analysis.accuracy[String(seat)] ?? 0 })).join(' · ')}
      </p>
      {moments.length === 0 ? <p className="empty-note">{t('review.moments.none')}</p> : null}
      <ul className="moment-list">
        {moments.map((m) => (
          <li key={m.ply}>
            <a href={href(`/review/${record.id}/${m.ply}`)} data-verdict={m.verdict}>
              <b className="num">{moveLabel(m)}</b>
              <span>{t(`review.verdict.${m.verdict}`)}</span>
              {m.reason ? <span className="faint">{tDynamic(m.reason.key, m.reason.params)}</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewScreen({ recordId, ply }: { recordId: string; ply: number | null }) {
  const loaded = useAsync(async () => {
    const stored = await getRecord(appDb(), recordId);
    if (!stored) return null;
    const record = { ...parseRecord(stored), profileId: stored.profileId };
    const [ui, analysisRow] = await Promise.all([loadGameUi(record.gameId), getAnalysis(appDb(), recordId)]);
    return canOpen(ui.def, record) ? { ui, record, analysis: analysisRow ? analysisFromJson(analysisRow.data) : null } : null;
  }, recordId);
  if (loaded.status === 'loading') return <CenterMessage>{t('table.loading')}</CenterMessage>;
  if (loaded.status === 'failed' || !loaded.value) {
    return (
      <CenterMessage>
        <p>{t('table.missing')}</p>
        <a className="btn" href={href('/today')}>
          {t('app.back-to-today')}
        </a>
      </CenterMessage>
    );
  }
  return <Review key={recordId} ui={loaded.value.ui} record={loaded.value.record} ply={ply} initial={loaded.value.analysis} />;
}
