/** The live table: loads a saved game, resumes it and plays it against the CPU, with the coach. */
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { GameEvent, Seat } from '../../core/contract';
import { outcomePoints } from '../../core/contract';
import { EventQueue } from '../../core/events';
import type { Json } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { canOpen, humanSeats, parseRecord } from '../../core/record';
import { startState } from '../../core/replay';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi, SurfaceOverlay } from '../../games/types';
import { NO_OVERLAY } from '../../games/types';
import { appDb } from '../../store/db';
import type { StoredRecord } from '../../store/db';
import { finishedRecords, getRecord, saveRecord } from '../../store/records';
import type { MessageKey } from '../../text';
import { gameName, t, tDynamic } from '../../text';
import { botHost } from '../bots';
import { ConfirmDialog } from '../components/Dialog';
import { Icon } from '../components/Icon';
import { useReducedMotion } from '../motion';
import { saveTextFile } from '../platform';
import { resultFor } from '../results';
import { href, navigate } from '../router';
import { CenterMessage } from '../screens/common';
import { playSound } from '../sound';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import type { LogEntry } from './controller';
import { TableController } from './controller';
import { CoachSection, useHelps } from './coach';
import { startGame } from './start';
import { Counters, MoveList, RailSection, TableShell } from './TableShell';

type Session = { queue: EventQueue<GameEvent>; controller: TableController<unknown, unknown, unknown, unknown, GameEvent> };

function createSession(ui: AnyGameUi, record: StoredRecord): Session {
  const queue = new EventQueue<GameEvent>({ duration: (e) => ui.eventDuration(e), reducedMotion: () => false });
  const controller = new TableController(
    {
      def: ui.def,
      bots: botHost(),
      queue,
      save: async (r) => {
        await saveRecord(appDb(), record.profileId, r);
      },
      now: () => Date.now(),
      ...(ui.timeoutOutcome ? { timeoutOutcome: (state: unknown, seat: Seat) => ui.timeoutOutcome?.(state, seat) ?? { reason: 'timeout', results: [] } } : {}),
    },
    record,
  );
  return { queue, controller };
}

/** The opening position of a record, remembered per record. */
const starts = new WeakMap<object, unknown>();
function startOf(ui: AnyGameUi, record: GameRecord): unknown {
  const key = record.config as object;
  if (key && typeof key === 'object' && starts.has(key)) return starts.get(key);
  const start = startState(ui.def, record);
  if (key && typeof key === 'object') starts.set(key, start);
  return start;
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function LogLines({ log, ui, record }: { log: readonly LogEntry<GameEvent>[]; ui: AnyGameUi; record: GameRecord }) {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    // Keep the newest line in view inside the log, without moving the rest of the rail.
    if (list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [log.length]);
  if (log.length === 0) return <p className="empty-note">{t('rail.log.none')}</p>;
  return (
    <ul className="log" ref={list}>
      {log.map((entry, i) => {
        const text = ui.describeEvent(entry.event);
        if (!text) return null;
        const first = i === 0 || log[i - 1]?.ply !== entry.ply;
        const who = entry.seat === null ? null : record.players[entry.seat]?.kind === 'bot' ? t('common.cpu') : t('common.you');
        return (
          <li key={entry.id}>
            {first && who ? (
              <>
                <span className="who">{who}</span> · {text}
                {entry.tags.length > 0 ? <span className="why"> · {entry.tags.map((tag) => tDynamic(`tag.${tag}`)).join(', ')}</span> : null}
              </>
            ) : (
              <span className="end">{text}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function LiveTable({ ui, record: initial }: { ui: AnyGameUi; record: StoredRecord }) {
  const settings = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const notify = useApp((s) => s.notify);
  const profileId = useApp((s) => s.profile?.id ?? '');
  const reduced = useReducedMotion(settings?.motion ?? 'system');
  const sound = settings?.sound ?? true;
  const [session] = useState(() => createSession(ui, initial));
  const { queue, controller } = session;
  const [confirmResign, setConfirmResign] = useState(false);
  const [overlay, setOverlay] = useState<SurfaceOverlay>(NO_OVERLAY);
  const [flipOverride, setFlipOverride] = useState(false);
  const [, setTick] = useState(0);
  const { helps, setHelp } = useHelps(ui);

  useEffect(() => {
    queue.configure({
      reducedMotion: () => reduced,
      onStart: (item) => {
        const name = sound ? ui.sound(item.event) : null;
        if (name) playSound(name);
      },
    });
  }, [queue, reduced, sound, ui]);

  useEffect(() => {
    controller.start();
    return () => {
      controller.stop();
      queue.clear();
    };
  }, [controller, queue]);

  const snap = useSyncExternalStore(controller.subscribe, controller.snapshot);
  const anim = useSyncExternalStore(queue.subscribe, queue.snapshot);
  const { record, state } = snap;
  const mySeats = humanSeats(record);
  const bot = record.players.find((p) => p.kind === 'bot');
  const level = bot?.level ?? 1;
  const over = record.status === 'finished';
  const mySeat = mySeats[0] ?? 0;
  const actingSeat = snap.humanTurn ? snap.turn : null;

  // The coach answers questions about the person's own position, in the bot worker.
  const ask = useCallback(
    (query: Json, state?: unknown) => {
      const position = state ?? controller.snapshot().state;
      const seat = ui.def.turn(position) ?? mySeat;
      return botHost().advise({ gameId: ui.def.id, view: ui.def.view(position, seat), seat, query, seed: `${controller.snapshot().record.seed}/coach` });
    },
    [controller, mySeat, ui],
  );

  // Blunder warnings: the controller checks each of the person's moves before the CPU answers.
  const coach = ui.coach;
  useEffect(() => {
    if (coach?.checkMove && helps.blunder) controller.setMoveCheck((before, action) => coach.checkMove?.(ask, before, action) ?? Promise.resolve(null));
    else controller.setMoveCheck(null);
  }, [controller, coach, helps.blunder, ask]);

  // Any help that counts as training, switched on during a game, makes it a training game.
  const trainingOn = (coach?.helps ?? []).some((h) => h.training && helps[h.id]);
  useEffect(() => {
    if (trainingOn && !over) controller.markTraining();
  }, [trainingOn, over, controller]);

  // A running clock redraws a few times a second and ends the game when a flag falls.
  const clockRunning = record.clock !== null && !over;
  useEffect(() => {
    if (!clockRunning) return;
    const id = setInterval(() => {
      controller.tick();
      setTick((n) => n + 1);
    }, 250);
    return () => clearInterval(id);
  }, [clockRunning, controller]);

  const results = useAsync(async () => {
    // Wait for the last move to be saved, so a game that just ended is counted.
    await controller.flush();
    const done = await finishedRecords(appDb(), profileId, ui.def.id);
    let w = 0;
    let d = 0;
    let l = 0;
    for (const r of done) {
      if (r.players.find((p) => p.kind === 'bot')?.level !== level || !r.outcome) continue;
      const points = outcomePoints(r.outcome, humanSeats(r)[0] ?? 0);
      if (points > 0.5) w++;
      else if (points < 0.5) l++;
      else d++;
    }
    return { w, d, l };
  }, `${profileId}:${ui.def.id}:${level}:${record.status}`);

  const playAgain = async () => {
    await controller.flush();
    const clock = record.clock ? { initialMs: record.clock.initialMs, incrementMs: record.clock.incrementMs } : null;
    // Keep the table's rules (a preset or handicap) when the game says which ones to keep.
    const config = ui.replayConfig ? ui.replayConfig(ui.def.codec.config.fromJSON(record.config)) : undefined;
    const id = await startGame(ui, profileId, { level, side: mySeat, clock, ...(config !== undefined ? { config } : {}) });
    navigate(`/play/${id}`, { replace: true });
  };

  const exportGame = async () => {
    const format = ui.exportRecord;
    if (!format) return;
    await controller.flush();
    const names = ui.def.seats(state).map((s) => (record.players[s]?.kind === 'bot' ? `${t('common.cpu')} ${t('common.level', { n: record.players[s]?.level ?? 1 })}` : t('common.you')));
    const fileName = `${ui.def.id}-${new Date(record.createdAt).toISOString().slice(0, 10)}.${format.extension}`;
    try {
      await saveTextFile(fileName, format.write(controller.snapshot().record, names), gameName(ui.def.id));
      notify(t('table.exported', { file: fileName }));
    } catch (err) {
      notify(t('settings.backup.failed', { message: (err as Error).message }));
    }
  };

  const resultKey: MessageKey | null = over ? resultFor(record) : null;
  const turnText = over ? t('table.turn.over') : snap.checking ? t('coach.checking') : snap.humanTurn ? t('table.turn.you') : t('table.turn.cpu');
  const name = gameName(ui.def.id);
  const SeatMark = ui.SeatMark;
  const SeatExtra = ui.SeatExtra;
  const Surface = ui.Surface;
  const moves = snap.history.map((h) => ({ ply: h.ply, seat: h.seat, text: ui.def.codec.action.toText(h.action) }));
  const seatNames = ui.def.seats(state).map((s) => (ui.movePrefix ? ui.movePrefix(s) : ui.sideName(s)));
  const score = results.status === 'done' ? results.value : null;
  const flipped = (ui.flipForSeat?.(mySeat) ?? false) !== flipOverride;
  const clock = controller.clock();
  const canTakeBack = !over && snap.history.some((h) => record.players[h.seat]?.kind === 'human');
  const shownOverlay = snap.warning ? snap.warning.overlay : overlay;
  const start = startOf(ui, record);

  return (
    <>
      <TableShell
        label={name}
        title={name}
        meta={[
          { key: 'level', text: t('common.level', { n: level }) },
          ...(score ? [{ key: 'score', className: 'score', text: t('table.score', score), label: t('table.score.label', score) }] : []),
        ]}
        turn={{ text: turnText, mine: snap.humanTurn }}
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
            {canTakeBack ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  controller.takeBack();
                }}
              >
                <Icon name="back" size={20} />
                {t('table.take-back')}
              </button>
            ) : null}
            {ui.exportRecord ? (
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  close();
                  void exportGame();
                }}
              >
                <Icon name="export" size={20} />
                {t('table.export', { format: ui.exportRecord.extension.toUpperCase() })}
              </button>
            ) : null}
            <a role="menuitem" href={href(`/games/${ui.def.id}/reference`)} onClick={close}>
              <Icon name="reference" size={20} />
              {t('table.reference')}
            </a>
            {over ? null : (
              <button
                type="button"
                role="menuitem"
                className="danger"
                onClick={() => {
                  close();
                  setConfirmResign(true);
                }}
              >
                <Icon name="flag" size={20} />
                {t('table.resign')}
              </button>
            )}
            <a role="menuitem" href={href(`/games/${ui.def.id}`)} onClick={close}>
              <Icon name="leave" size={20} />
              {t('table.back')}
            </a>
          </>
        )}
        side={
          <>
            <ul className="players" aria-label={t('play.side')}>
              {(flipped ? [...ui.def.seats(state)] : [...ui.def.seats(state)].reverse()).map((seat) => {
                const player = record.players[seat];
                const isTurn = snap.turn === seat;
                const time = clock?.[seat];
                return (
                  <li key={seat} className={isTurn && snap.thinking ? 'player thinking' : 'player'} data-turn={isTurn}>
                    <span className="player-mark">
                      <SeatMark seat={seat} />
                    </span>
                    <span className="player-text">
                      <span className="player-name">{player?.kind === 'bot' ? t('common.cpu') : t('common.you')}</span>
                      <span className="player-detail">{player?.kind === 'bot' ? t('common.level', { n: player.level ?? 1 }) : ui.sideName(seat)}</span>
                      {SeatExtra ? <SeatExtra state={state} start={start} seat={seat} /> : null}
                    </span>
                    {time !== undefined ? (
                      <span className="clock num" data-low={time < 20_000} aria-label={t('clock.of', { seat: ui.sideName(seat), time: formatClock(time) })}>
                        {formatClock(time)}
                      </span>
                    ) : isTurn ? (
                      <span className="turn-dot" aria-hidden="true" />
                    ) : null}
                  </li>
                );
              })}
            </ul>
            {snap.warning ? (
              <div className="warning-card" role="alert">
                <h2>{t('coach.warn.title')}</h2>
                <p>{snap.warning.text}</p>
                <div className="row">
                  <button type="button" className="btn btn-small btn-primary" onClick={() => controller.takeBack()}>
                    {t('coach.warn.back')}
                  </button>
                  <button type="button" className="btn btn-small" onClick={() => controller.keepMove()}>
                    {t('coach.warn.keep')}
                  </button>
                </div>
              </div>
            ) : null}
            {resultKey && record.outcome ? (
              <div className="result-card" role="status">
                <h2>{t(resultKey)}</h2>
                <p>{tDynamic(`reason.${record.outcome.reason}`)}</p>
              </div>
            ) : null}
            {snap.error ? <p className="side-note" style={{ color: 'var(--bad)' }}>{t('table.error', { message: snap.error })}</p> : null}
            <div className="side-actions">
              {over ? (
                <>
                  <button type="button" className="btn btn-primary" onClick={() => void playAgain()}>
                    <Icon name="again" size={18} />
                    {t('table.again')}
                  </button>
                  <a className="btn" href={href(`/review/${record.id}`)}>
                    <Icon name="review" size={18} />
                    {t('table.review')}
                  </a>
                </>
              ) : (
                <button type="button" className="btn btn-quiet" onClick={() => setConfirmResign(true)}>
                  <Icon name="flag" size={18} />
                  {t('table.resign')}
                </button>
              )}
            </div>
          </>
        }
        surface={
          <Surface
            state={state}
            mySeats={mySeats}
            canAct={snap.humanTurn && !snap.warning && !snap.checking}
            legal={snap.legal}
            lastAction={snap.lastAction}
            anim={anim}
            onAction={(a) => {
              queue.skip();
              setOverlay(NO_OVERLAY);
              controller.act(a);
            }}
            onSkip={() => queue.skip()}
            flipped={flipped}
            helps={helps}
            overlay={shownOverlay}
          />
        }
        rail={
          <>
            {coach ? (
              <CoachSection ui={ui} helps={helps} setHelp={setHelp} training={record.training && !over}>
                <coach.Panel state={state} seat={actingSeat} helps={helps} ask={ask} setOverlay={setOverlay} markTraining={() => controller.markTraining()} />
              </CoachSection>
            ) : null}
            <RailSection title={t('rail.moves')}>
              <MoveList moves={moves} seatNames={seatNames} />
            </RailSection>
            <RailSection title={t('rail.counters')}>
              <Counters rows={ui.counters(state, mySeats)} />
            </RailSection>
            <RailSection title={t('rail.log')}>
              <LogLines log={snap.log} ui={ui} record={record} />
            </RailSection>
          </>
        }
      />
      {confirmResign ? (
        <ConfirmDialog
          title={t('table.resign.title')}
          confirmLabel={t('table.resign')}
          danger
          onCancel={() => setConfirmResign(false)}
          onConfirm={() => {
            setConfirmResign(false);
            controller.resign();
          }}
        >
          {t('table.resign.body')}
        </ConfirmDialog>
      ) : null}
    </>
  );
}

export function TableScreen({ recordId }: { recordId: string }) {
  const loaded = useAsync(async () => {
    const stored = await getRecord(appDb(), recordId);
    if (!stored) return { kind: 'missing' as const };
    const record = { ...parseRecord(stored), profileId: stored.profileId };
    const ui = await loadGameUi(record.gameId);
    if (!canOpen(ui.def, record)) return { kind: 'unreadable' as const };
    return { kind: 'ok' as const, ui, record };
  }, recordId);

  if (loaded.status === 'loading') return <CenterMessage>{t('table.loading')}</CenterMessage>;
  if (loaded.status === 'failed' || loaded.value.kind !== 'ok') {
    const key: MessageKey = loaded.status === 'done' && loaded.value.kind === 'missing' ? 'table.missing' : 'table.unreadable';
    return (
      <CenterMessage>
        <p>{t(key)}</p>
        <a className="btn" href={href('/today')}>
          {t('app.back-to-today')}
        </a>
      </CenterMessage>
    );
  }
  return <LiveTable key={loaded.value.record.id} ui={loaded.value.ui} record={loaded.value.record} />;
}
