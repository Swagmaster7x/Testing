/**
 * The dominoes coach in the rail. A three-step hint (where to look, the idea, the tile), and, as
 * switches, what a good player keeps in their head: the tiles out (the triangle of all 28), how
 * many of each number are still unseen, what each player cannot have after passing, and the pip
 * totals. Every help marks the game as training.
 */
import { useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { DominoFace } from '../../../kits/tiles/domino';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { DominoesState, Pip, Tile } from '../rules';
import { cantHave, endsOf, handPips, hasNumber, isTile, PIPS, seatCount, sideOf, TILES, tileOf, TOTAL_PIPS, unseenTiles, viewOf } from '../rules';
import { endName, tileLabel, whoName } from './names';

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

export function DominoesCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<DominoesState>) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [busy, setBusy] = useState(false);
  const me = seat ?? 0;
  const n = seatCount(state.config);
  const view = viewOf(state, me);
  // A hint belongs to one decision: the hand and the moves so far.
  const key = `${state.handNo}/${state.moves.length}`;
  const current = hint?.key === key ? hint : null;
  const unseen = new Set(unseenTiles(view));
  const mine = new Set(view.hand);
  const linePips = handPips(state.chain.map((p) => p.tile));

  const askHint = async () => {
    if (current) {
      const step = Math.min(3, current.step + 1);
      setHint({ ...current, step });
      const tile = current.action.replace(/[LR]$/, '');
      if (step === 3 && isTile(tile)) setOverlay({ arrows: [], marks: [{ square: tile, tone: 'hint' }] });
      return;
    }
    setBusy(true);
    markTraining();
    try {
      const answer = await ask({ type: 'hint', samples: 40 });
      if (isJsonObject(answer) && typeof answer.action === 'string') {
        setHint({ key, step: 1, action: answer.action, tags: Array.isArray(answer.tags) ? answer.tags.filter((x): x is string => typeof x === 'string') : [] });
        setOverlay(NO_OVERLAY);
      }
    } finally {
      setBusy(false);
    }
  };

  const idea = current?.tags[0] ? tDynamic(`dominoes.idea.${current.tags[0]}`) : tDynamic('dominoes.idea.other');
  let moveText = '';
  if (current) {
    if (current.action === 'pass') moveText = t('dominoes.coach.move.pass');
    else if (current.action === 'draw') moveText = t('dominoes.coach.move.draw');
    else {
      const tile = current.action.replace(/[LR]$/, '');
      const end = current.action.endsWith('L') ? 'left' : current.action.endsWith('R') ? 'right' : null;
      const ends = endsOf(state.chain);
      if (isTile(tile)) {
        moveText = end && ends ? t('dominoes.coach.move.end', { tile: tileLabel(tile), end: endName(end, end === 'left' ? ends[0] : ends[1]) }) : t('dominoes.coach.move', { tile: tileLabel(tile) });
      }
    }
  }
  const last = state.results[state.results.length - 1];

  return (
    <div className="coach-panel">
      {seat === null ? (
        <p className="empty-note">{t('dominoes.coach.not-your-turn')}</p>
      ) : (
        <div className="stack" style={{ gap: 'var(--sp-2)' }}>
          <button type="button" className="btn btn-small" disabled={busy || (current?.step ?? 0) >= 3} onClick={() => void askHint()}>
            {busy ? t('dominoes.coach.thinking') : current ? t('dominoes.coach.more') : t('dominoes.coach.hint')}
          </button>
          {current ? (
            <ol className="hint-steps">
              <li>{state.chain.length === 0 ? t('dominoes.coach.look.lead') : t('dominoes.coach.look.follow')}</li>
              {current.step >= 2 ? <li>{t('dominoes.coach.idea', { idea })}</li> : null}
              {current.step >= 3 ? <li>{moveText}</li> : null}
            </ol>
          ) : null}
        </div>
      )}
      {last ? (
        <p className="coach-last">
          <span className="eyebrow">{t('dominoes.coach.last')}</span>{' '}
          {last.winner === null
            ? t('dominoes.hand.tie')
            : t(sideOf(me, n) === last.winner ? (last.reason === 'domino' ? 'dominoes.hand.we-domino' : 'dominoes.hand.we-block') : last.reason === 'domino' ? 'dominoes.hand.they-domino' : 'dominoes.hand.they-block', { n: last.points[last.winner] ?? 0 })}
        </p>
      ) : null}
      {helps.pips ? (
        <dl className="facts coach-counts">
          <dt>{t('dominoes.coach.pips.mine')}</dt>
          <dd className="num">{handPips(view.hand)}</dd>
          <dt>{t('dominoes.coach.pips.line')}</dt>
          <dd className="num">{linePips}</dd>
          <dt>{t('dominoes.coach.pips.unseen')}</dt>
          <dd className="num">{TOTAL_PIPS - linePips - handPips(view.hand)}</dd>
        </dl>
      ) : null}
      {helps.cantHave ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('dominoes.coach.lacks.title')}
          </p>
          {(() => {
            const rows = Array.from({ length: n }, (_, s) => s)
              .filter((s) => s !== me)
              .map((s) => ({ s, lacks: [...cantHave(view, s)].sort() }))
              .filter((r) => r.lacks.length > 0);
            if (rows.length === 0) return <p className="empty-note">{t('dominoes.coach.lacks.none')}</p>;
            return (
              <ul className="lacks-list">
                {rows.map((r) => (
                  <li key={r.s}>{t('dominoes.coach.lacks.row', { who: whoName(r.s, me, n), list: r.lacks.join(' · ') })}</li>
                ))}
              </ul>
            );
          })()}
        </div>
      ) : null}
      {helps.tilesOut ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('dominoes.coach.out.title')}
          </p>
          <div className="tiles-out" role="table" aria-label={t('dominoes.coach.out.title')}>
            {PIPS.map((a) => (
              <div key={a} role="row" className="tiles-out-row">
                {PIPS.filter((b) => b >= a).map((b) => {
                  const tile = tileOf(a, b);
                  const state_ = mine.has(tile) ? 'mine' : unseen.has(tile) ? 'unseen' : 'played';
                  return (
                    <span key={tile} role="cell" className="tiles-out-cell" data-state={state_} aria-label={`${tileLabel(tile)}: ${state_}`}>
                      <DominoFace a={a} b={b} />
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="empty-note">{t('dominoes.coach.out.note', { yard: state.config.mode === 'partnership' ? '' : t('dominoes.coach.out.yard') })}</p>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('dominoes.coach.numbers')}
          </p>
          <div className="number-counts num">
            {PIPS.map((x: Pip) => (
              <span key={x} data-zero={countUnseen(unseen, x) === 0}>
                <b>{x}</b> {countUnseen(unseen, x)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function countUnseen(unseen: ReadonlySet<Tile>, x: number): number {
  return TILES.filter((tile) => hasNumber(tile, x) && unseen.has(tile)).length;
}
