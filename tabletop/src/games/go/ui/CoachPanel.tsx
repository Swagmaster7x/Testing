/**
 * The Go coach in the rail: a three-step hint (where to look, the idea, the point), the
 * territory estimate from the CPU's playouts, and while counting, the CPU's suggestion of which
 * stones are dead. Liberty counts and atari rings are drawn by the board itself.
 */
import { useEffect, useState } from 'react';
import type { BoardMark } from '../../../kits/board/GridBoard';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { GoState } from '../rules';
import { areaMark, deadMark, ownershipMarks } from './overlay';

interface Hint {
  readonly move: string;
  readonly name: string;
  readonly idea: string;
}

/** A key for "this position", so answers about an older position are not shown. */
function keyOf(state: GoState): string {
  return `${state.history.length}:${state.history[state.history.length - 1] ?? ''}:${state.phase}:${state.dead.join(',')}`;
}

export function estimateText(margin: number): string {
  if (Math.abs(margin) < 1) return t('go.estimate.even');
  return margin > 0 ? t('go.estimate.black', { n: Math.abs(margin) }) : t('go.estimate.white', { n: Math.abs(margin) });
}

export function GoCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<GoState>) {
  const key = keyOf(state);
  const [hint, setHint] = useState<{ key: string; step: number; data: Hint | null } | null>(null);
  const [territory, setTerritory] = useState<{ key: string; marks: BoardMark[]; margin: number } | null>(null);
  const [dead, setDead] = useState<{ key: string; marks: BoardMark[]; count: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const myTurn = seat !== null;
  const playing = state.phase === 'play';
  const scoring = state.phase === 'scoring';
  const hintHere = hint?.key === key ? hint : null;

  // The territory estimate, worked out afresh after every move.
  useEffect(() => {
    if (!helps.territory || state.phase === 'over' || state.phase === 'handicap') return;
    let live = true;
    ask({ type: 'territory' })
      .then((answer) => {
        if (!live || !isJsonObject(answer) || !Array.isArray(answer.ownership)) return;
        const ownership = answer.ownership.map((v) => (typeof v === 'number' ? v : 0));
        setTerritory({ key, marks: ownershipMarks(state.size, ownership), margin: typeof answer.margin === 'number' ? answer.margin : 0 });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [helps.territory, key, ask, state.phase, state.size]);

  // While counting, the CPU's view of which stones are dead.
  useEffect(() => {
    if (!scoring || !myTurn) return;
    let live = true;
    ask({ type: 'dead' })
      .then((answer) => {
        if (!live || !isJsonObject(answer) || !Array.isArray(answer.dead)) return;
        const points = answer.dead.filter((p): p is number => typeof p === 'number');
        setDead({ key, marks: points.map((p) => deadMark(p, state.size)), count: points.length });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [scoring, myTurn, key, ask, state.size]);

  const territoryHere = helps.territory && territory?.key === key ? territory : null;
  const deadHere = scoring && dead?.key === key ? dead : null;
  useEffect(() => {
    const marks: BoardMark[] = [];
    const arrows = [];
    if (territoryHere) marks.push(...territoryHere.marks);
    if (deadHere) marks.push(...deadHere.marks);
    if (hintHere?.data && hintHere.data.move !== 'pass') {
      if (hintHere.step >= 1) marks.push(areaMark(hintHere.data.move));
      if (hintHere.step >= 3) arrows.push({ from: hintHere.data.move, to: hintHere.data.move, tone: 'hint' as const });
    }
    setOverlay(marks.length || arrows.length ? { arrows, marks } : NO_OVERLAY);
  }, [territoryHere, deadHere, hintHere, setOverlay]);

  const nextHint = async () => {
    markTraining();
    if (hintHere?.data) {
      setHint({ ...hintHere, step: Math.min(3, hintHere.step + 1) });
      return;
    }
    setBusy(true);
    try {
      const answer = await ask({ type: 'hint' });
      const data = isJsonObject(answer) && typeof answer.move === 'string' && typeof answer.name === 'string' && typeof answer.idea === 'string' ? { move: answer.move, name: answer.name, idea: answer.idea } : null;
      setHint({ key, step: 1, data });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="coach">
      {myTurn && playing ? (
        <div className="coach-hint">
          <button type="button" className="btn btn-small" onClick={() => void nextHint()} disabled={busy || (hintHere?.step ?? 0) >= 3}>
            {hintHere ? t('coach.hint.more') : t('coach.hint')}
          </button>
          {hintHere?.data ? (
            <ol className="hint-steps">
              <li>{hintHere.data.move === 'pass' ? t('go.hint.pass') : t('go.hint.look')}</li>
              {hintHere.step >= 2 ? <li>{tDynamic(`go.idea.${hintHere.data.idea}`)}</li> : null}
              {hintHere.step >= 3 ? <li>{hintHere.data.move === 'pass' ? t('go.hint.play-pass') : t('go.hint.play', { point: hintHere.data.name })}</li> : null}
            </ol>
          ) : null}
        </div>
      ) : null}
      {helps.territory && state.phase !== 'over' ? (
        <p className="coach-line" aria-live="polite">
          {territoryHere ? estimateText(territoryHere.margin) : t('common.loading')}
        </p>
      ) : null}
      {scoring && myTurn ? <p className="coach-line">{deadHere ? (deadHere.count > 0 ? t('go.dead.suggested', { n: deadHere.count }) : t('go.dead.none')) : t('common.loading')}</p> : null}
    </div>
  );
}
