/**
 * The Chinese Checkers coach in the rail: a three-step hint (the marble, the idea, the hole), and,
 * as a switch, the race a good player keeps in their head: how many rows each player still has to
 * climb (docs/rules/chinese-checkers.md, rule 12), with a bar for how far each has come.
 */
import { useEffect, useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { CcState } from '../rules';
import { rowsLeft } from '../rules';
import { CcSeatMark, seatColour } from './CcSurface';

interface Hint {
  readonly move: string;
  readonly name: string;
  readonly from: string;
  readonly to: string;
  readonly idea: string;
}

/** Rows to go at the start: everything still to climb. */
export function startRows(state: CcState): number {
  return state.marbles === 15 ? 160 : 120;
}

export function RaceList({ state }: { state: CcState }) {
  const rows = rowsLeft(state);
  const full = startRows(state);
  return (
    <ul className="cc-race" aria-label={t('cc.race.title')}>
      {rows.map((n, seat) => (
        <li key={seat}>
          <CcSeatMark seat={seat} />
          <span className="bar" aria-hidden="true">
            <span style={{ width: `${Math.round(100 * Math.max(0, Math.min(1, 1 - n / full)))}%` }} />
          </span>
          <span className="num" aria-label={t('cc.race.row', { colour: seatColour(seat), n })}>
            {state.done.includes(seat) ? t('cc.race.home') : n}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function CcCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<CcState>) {
  const key = `${state.board}/${state.toMove}/${state.round}`;
  const [hint, setHint] = useState<{ key: string; step: number; data: Hint | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const here = hint?.key === key ? hint : null;
  const myTurn = seat !== null && state.end === null;

  useEffect(() => {
    if (!here?.data || here.data.move === 'pass') {
      setOverlay(NO_OVERLAY);
      return;
    }
    const { from, to } = here.data;
    setOverlay({
      arrows: here.step >= 3 ? [{ from, to, tone: 'hint' }] : [],
      marks: here.step >= 1 ? [{ square: from, tone: 'hint' }] : [],
    });
  }, [here, setOverlay]);

  const nextHint = async () => {
    markTraining();
    if (here?.data) {
      setHint({ ...here, step: Math.min(3, here.step + 1) });
      return;
    }
    setBusy(true);
    try {
      const answer = await ask({ type: 'hint' });
      const data =
        isJsonObject(answer) && typeof answer.move === 'string' && typeof answer.name === 'string' && typeof answer.from === 'string' && typeof answer.to === 'string' && typeof answer.idea === 'string'
          ? { move: answer.move, name: answer.name, from: answer.from, to: answer.to, idea: answer.idea }
          : null;
      setHint({ key, step: 1, data });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="coach">
      {myTurn ? (
        <div className="coach-hint">
          <button type="button" className="btn btn-small" onClick={() => void nextHint()} disabled={busy || (here?.step ?? 0) >= 3}>
            {here ? t('coach.hint.more') : t('coach.hint')}
          </button>
          {here?.data ? (
            <ol className="hint-steps">
              <li>{here.data.move === 'pass' ? t('cc.hint.pass') : t('cc.hint.look')}</li>
              {here.step >= 2 ? <li>{tDynamic(`cc.idea.${here.data.idea}`)}</li> : null}
              {here.step >= 3 ? <li>{t('cc.hint.play', { move: here.data.name })}</li> : null}
            </ol>
          ) : null}
        </div>
      ) : null}
      {helps.race ? (
        <div className="coach-race">
          <p className="coach-line">{t('cc.race.title')}</p>
          <RaceList state={state} />
        </div>
      ) : null}
    </div>
  );
}
