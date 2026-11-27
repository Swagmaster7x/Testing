/** The live table: loads a saved game, resumes it and plays it against the CPU. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { outcomePoints } from '../../core/contract';
import type { GameEvent } from '../../core/contract';
import { EventQueue } from '../../core/events';
import type { GameRecord } from '../../core/record';
import { canOpen, humanSeats, parseRecord } from '../../core/record';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi } from '../../games/types';
import { appDb } from '../../store/db';
import type { StoredRecord } from '../../store/db';
import { finishedRecords, getRecord, saveRecord } from '../../store/records';
import type { MessageKey } from '../../text';
import { gameName, t, tDynamic } from '../../text';
import { botHost } from '../bots';
import { Icon } from '../components/Icon';
import { ConfirmDialog } from '../components/Dialog';
import { useReducedMotion } from '../motion';
import { href, navigate } from '../router';
import { CenterMessage } from '../screens/common';
import { resultFor } from '../results';
import { playSound } from '../sound';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import type { LogEntry } from './controller';
import { TableController } from './controller';
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
    },
    record,
  );
  return { queue, controller };
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
  const profileId = useApp((s) => s.profile?.id ?? '');
  const reduced = useReducedMotion(settings?.motion ?? 'system');
  const sound = settings?.sound ?? true;
  const [session] = useState(() => createSession(ui, initial));
  const { queue, controller } = session;
  const [confirmResign, setConfirmResign] = useState(false);

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
    const human = mySeats[0];
    const id = await startGame(ui, profileId, { level, side: human ?? 'either' });
    navigate(`/play/${id}`, { replace: true });
  };

  const resultKey: MessageKey | null = over ? resultFor(record) : null;
  const turnText = over ? t('table.turn.over') : snap.humanTurn ? t('table.turn.you') : t('table.turn.cpu');
  const name = gameName(ui.def.id);
  const SeatMark = ui.SeatMark;
  const Surface = ui.Surface;
  const moves = snap.history.map((h) => ({ ply: h.ply, seat: h.seat, text: ui.def.codec.action.toText(h.action) }));
  const seatNames = ui.def.seats(state).map((s) => ui.sideName(s));
  const score = results.status === 'done' ? results.value : null;

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
              {ui.def.seats(state).map((seat) => {
                const player = record.players[seat];
                const isTurn = snap.turn === seat;
                return (
                  <li key={seat} className={isTurn && snap.thinking ? 'player thinking' : 'player'} data-turn={isTurn}>
                    <span className="player-mark">
                      <SeatMark seat={seat} />
                    </span>
                    <span className="player-text">
                      <span className="player-name">{player?.kind === 'bot' ? t('common.cpu') : t('common.you')}</span>
                      <span className="player-detail">{player?.kind === 'bot' ? t('common.level', { n: player.level ?? 1 }) : ui.sideName(seat)}</span>
                    </span>
                    {isTurn ? <span className="turn-dot" aria-hidden="true" /> : null}
                  </li>
                );
              })}
            </ul>
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
            canAct={snap.humanTurn}
            legal={snap.legal}
            lastAction={snap.lastAction}
            anim={anim}
            onAction={(a) => {
              queue.skip();
              controller.act(a);
            }}
            onSkip={() => queue.skip()}
          />
        }
        rail={
          <>
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
