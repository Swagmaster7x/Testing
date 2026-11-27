/**
 * The Go review's score and ownership panel (M15). With the switch on, a small KataGo network in
 * the bot worker reads each position once: who leads and by how much, each side's chances, and who
 * owns each point, drawn on the board. A graph of the lead over the game fills in move by move;
 * tapping it goes to that move.
 */
import { useEffect, useRef, useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { t } from '../../../text';
import type { ReviewInsightProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { GoState } from '../rules';
import { ownershipMarks } from './overlay';

interface Reading {
  readonly blackWins: number;
  readonly blackLead: number;
  readonly ownership: readonly number[];
}

/** The last five moves before a position, oldest first: a point, or -1 for a pass. */
export function recentMoves(states: readonly GoState[], ply: number): number[] {
  const out: number[] = [];
  for (let i = Math.max(1, ply - 4); i <= ply; i++) {
    const last = states[i]?.last ?? -2;
    if (last >= -1) out.push(last);
  }
  return out;
}

function read(answer: unknown): Reading | null {
  if (!isJsonObject(answer) || typeof answer.blackWins !== 'number' || typeof answer.blackLead !== 'number' || !Array.isArray(answer.ownership)) return null;
  return { blackWins: answer.blackWins, blackLead: answer.blackLead, ownership: answer.ownership.map((v) => (typeof v === 'number' ? v : 0)) };
}

export function leadText(lead: number): string {
  if (Math.abs(lead) < 0.5) return t('go.net.even');
  return lead > 0 ? t('go.net.black', { n: Math.abs(lead).toFixed(1) }) : t('go.net.white', { n: Math.abs(lead).toFixed(1) });
}

const GRAPH_W = 240;
const GRAPH_H = 56;

function LeadGraph({ leads, total, ply, go }: { leads: readonly (number | undefined)[]; total: number; ply: number; go: (ply: number) => void }) {
  const known = leads.filter((v): v is number => v !== undefined);
  const range = Math.max(10, ...known.map((v) => Math.abs(v)));
  const x = (i: number) => (total <= 0 ? 0 : (i / total) * GRAPH_W);
  const y = (v: number) => GRAPH_H / 2 - (v / range) * (GRAPH_H / 2 - 3);
  let path = '';
  leads.forEach((v, i) => {
    if (v === undefined) return;
    path += `${path === '' || leads[i - 1] === undefined ? 'M' : 'L'}${x(i).toFixed(1)} ${y(v).toFixed(1)} `;
  });
  return (
    <svg
      className="go-lead-graph"
      viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`}
      role="img"
      aria-label={t('go.net.graph', { done: known.length, total: total + 1 })}
      onClick={(e) => {
        const box = e.currentTarget.getBoundingClientRect();
        go(Math.round(((e.clientX - box.left) / Math.max(1, box.width)) * total));
      }}
    >
      <rect x={0} y={0} width={GRAPH_W} height={GRAPH_H / 2} className="go-lead-black" />
      <rect x={0} y={GRAPH_H / 2} width={GRAPH_W} height={GRAPH_H / 2} className="go-lead-white" />
      <line x1={0} x2={GRAPH_W} y1={GRAPH_H / 2} y2={GRAPH_H / 2} className="go-lead-zero" />
      <line x1={x(ply)} x2={x(ply)} y1={0} y2={GRAPH_H} className="go-lead-now" />
      <path d={path} className="go-lead-line" />
    </svg>
  );
}

export function GoReviewInsight({ states, ply, ask, setOverlay, go }: ReviewInsightProps<GoState>) {
  const [on, setOn] = useState(false);
  const [readings, setReadings] = useState<readonly (Reading | undefined)[]>([]);
  const [failed, setFailed] = useState<string | null>(null);
  // One question at a time; an answer is kept even if the board moved on while it was worked out.
  const pending = useRef(false);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const total = states.length - 1;
  const state = states[ply];
  const here = readings[ply];
  const playing = state !== undefined && state.phase !== 'handicap' && state.size >= 5;

  // Reads the position on the board first, then every other position for the graph.
  useEffect(() => {
    if (!on || failed || pending.current) return;
    let next: number | null = readings[ply] === undefined ? ply : null;
    for (let i = 0; next === null && i <= total; i++) if (readings[i] === undefined) next = i;
    const position = next === null ? undefined : states[next];
    if (next === null || !position) return;
    const index = next;
    pending.current = true;
    ask({ type: 'net', recent: recentMoves(states, index) }, position).then(
      (answer) => {
        pending.current = false;
        if (!alive.current) return;
        setReadings((old) => {
          const copy = [...old];
          copy[index] = read(answer) ?? { blackWins: 50, blackLead: 0, ownership: [] };
          return copy;
        });
      },
      (err: unknown) => {
        pending.current = false;
        if (alive.current) setFailed((err as Error).message);
      },
    );
  }, [on, failed, readings, states, total, ask, ply]);

  useEffect(() => {
    if (!on || !here || !state) setOverlay(NO_OVERLAY);
    else setOverlay({ arrows: [], marks: ownershipMarks(state.size, here.ownership) });
  }, [on, here, state, setOverlay]);
  useEffect(() => () => setOverlay(NO_OVERLAY), [setOverlay]);

  if (!playing && !on) return null;
  return (
    <div className="go-insight">
      <button type="button" className="btn btn-small" aria-pressed={on} onClick={() => setOn((v) => !v)}>
        {on ? t('go.net.hide') : t('go.net.show')}
      </button>
      {on ? (
        failed ? (
          <p className="empty-note">{t('go.net.failed', { message: failed })}</p>
        ) : here ? (
          <>
            <p className="go-insight-lead num" data-lead={here.blackLead}>
              {leadText(here.blackLead)}
            </p>
            <p className="faint num">{t('go.net.chances', { black: Math.round(here.blackWins), white: Math.round(100 - here.blackWins) })}</p>
            <LeadGraph leads={readings.map((r) => r?.blackLead)} total={total} ply={ply} go={go} />
            <p className="faint">{t('go.net.note')}</p>
          </>
        ) : (
          <p className="empty-note" role="status">
            {t('go.net.reading')}
          </p>
        )
      ) : null}
    </div>
  );
}
