/**
 * Review: replays a finished game from its record. Every position has its own link
 * (#/review/<id>/<move>), and stepping forward animates the move from the same event queue.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { GameEvent } from '../../core/contract';
import { EventQueue } from '../../core/events';
import { canOpen, humanSeats, parseRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import { loadGameUi } from '../../games/registry';
import type { AnyGameUi } from '../../games/types';
import { appDb } from '../../store/db';
import type { StoredRecord } from '../../store/db';
import { getRecord } from '../../store/records';
import { gameName, t, tDynamic } from '../../text';
import { Icon } from '../components/Icon';
import { useReducedMotion } from '../motion';
import { href, navigate } from '../router';
import { CenterMessage } from '../screens/common';
import { resultFor } from '../results';
import { useApp } from '../state';
import { useAsync } from '../useAsync';
import { Counters, MoveList, RailSection, TableShell } from './TableShell';

function Review({ ui, record, ply }: { ui: AnyGameUi; record: StoredRecord; ply: number | null }) {
  const settings = useApp((s) => s.settings);
  const updateSettings = useApp((s) => s.updateSettings);
  const reduced = useReducedMotion(settings?.motion ?? 'system');
  const [queue] = useState(() => new EventQueue<GameEvent>({ duration: (e) => ui.eventDuration(e), reducedMotion: () => false }));
  const [{ steps, start }] = useState(() => ({ steps: replay(ui.def, record).steps, start: startState(ui.def, record) }));
  const total = steps.length;
  const current = Math.max(0, Math.min(ply ?? total, total));
  const previous = useRef(current);
  const anim = useSyncExternalStore(queue.subscribe, queue.snapshot);

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
  const moves = steps.map((s) => ({ ply: s.ply, seat: s.seat, text: ui.def.codec.action.toText(s.action) }));
  const seatNames = ui.def.seats(start).map((s) => ui.sideName(s));
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
                  </span>
                </li>
              );
            })}
          </ul>
          {record.outcome ? (
            <div className="result-card">
              <h2>{t(resultFor(record))}</h2>
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
      surface={<Surface state={state} mySeats={mySeats} canAct={false} legal={[]} lastAction={lastAction} anim={anim} onAction={() => undefined} onSkip={() => queue.skip()} />}
      rail={
        <>
          <RailSection title={t('rail.moves')}>
            <MoveList moves={moves} seatNames={seatNames} current={current} linkFor={(n) => `/review/${record.id}/${n}`} />
          </RailSection>
          <RailSection title={t('rail.counters')}>
            <Counters rows={ui.counters(state, mySeats)} />
          </RailSection>
          <RailSection title={t('review.title')}>
            <p className="empty-note">{t('review.key-moments')}</p>
          </RailSection>
        </>
      }
    />
  );
}

export function ReviewScreen({ recordId, ply }: { recordId: string; ply: number | null }) {
  const loaded = useAsync(async () => {
    const stored = await getRecord(appDb(), recordId);
    if (!stored) return null;
    const record = { ...parseRecord(stored), profileId: stored.profileId };
    const ui = await loadGameUi(record.gameId);
    return canOpen(ui.def, record) ? { ui, record } : null;
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
  return <Review key={recordId} ui={loaded.value.ui} record={loaded.value.record} ply={ply} />;
}
