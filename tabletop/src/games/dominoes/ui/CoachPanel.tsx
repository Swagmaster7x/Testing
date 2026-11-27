/**
 * The dominoes coach in the rail. A three-step hint (where to look, the idea, the tile), and, as
 * switches, what a good player keeps in their head: the tiles out (the triangle of the whole set,
 * 28 tiles or 55), how many of each number are still unseen, what each player cannot have after
 * passing, the pip totals, and when the ends score as you play, the count of the ends and which of
 * your tiles would score now. Every help marks the game as training.
 */
import { useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { DominoFace } from '../../../kits/tiles/domino';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import { playScore } from '../bots';
import type { DominoesState, End, Pip, Tile } from '../rules';
import { cantHave, drawing, endsCount, handPips, hasNumber, isTile, numbersOf, openEnds, seatCount, setPips, tileOf, tilesOfSet, tilesOnTable, unseenTiles, viewOf } from '../rules';
import { endName, handResultText, tileLabel, whoName } from './names';

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

const LETTER_END: Readonly<Record<string, End>> = { L: 'left', R: 'right', U: 'up', D: 'down' };

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
  const linePips = handPips(tilesOnTable(state).map((p) => p.tile));
  const numbers = numbersOf(state.config.set);

  const askHint = async () => {
    if (current) {
      const step = Math.min(3, current.step + 1);
      setHint({ ...current, step });
      const tile = current.action.replace(/[LRUD]$/, '');
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
      const tile = current.action.replace(/[LRUD]$/, '');
      const end = LETTER_END[current.action.slice(-1)] ?? null;
      const spot = end ? openEnds(state).find((e) => e.end === end) : undefined;
      if (isTile(tile)) moveText = end && spot ? t('dominoes.coach.move.end', { tile: tileLabel(tile), end: endName(end, spot.value) }) : t('dominoes.coach.move', { tile: tileLabel(tile) });
    }
  }
  const last = state.results[state.results.length - 1];
  const fives = state.config.fives === 'on';
  // Your tiles that would score now, and how much.
  const scoring = fives
    ? view.hand.flatMap((tile) => {
        const ends: (End | undefined)[] = state.chain.length === 0 ? [undefined] : openEnds(state).filter((e) => hasNumber(tile, e.value)).map((e) => e.end);
        return ends.map((end) => ({ tile, end, points: playScore(state, tile, end) })).filter((x) => x.points > 0);
      })
    : [];

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
              <li>{state.chain.length === 0 ? t('dominoes.coach.look.lead') : fives ? t('dominoes.coach.look.fives') : t('dominoes.coach.look.follow')}</li>
              {current.step >= 2 ? <li>{t('dominoes.coach.idea', { idea })}</li> : null}
              {current.step >= 3 ? <li>{moveText}</li> : null}
            </ol>
          ) : null}
        </div>
      )}
      {last ? (
        <p className="coach-last">
          <span className="eyebrow">{t('dominoes.coach.last')}</span> {handResultText(last, me, n, state.config)}
        </p>
      ) : null}
      {helps.scoring ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('dominoes.coach.scoring.title')}
          </p>
          {!fives ? (
            <p className="empty-note">{t('dominoes.coach.scoring.off')}</p>
          ) : (
            <>
              <p className="empty-note num">{t('dominoes.coach.scoring.count', { n: endsCount(state) })}</p>
              {scoring.length === 0 ? (
                <p className="empty-note">{t('dominoes.coach.scoring.none')}</p>
              ) : (
                <ul className="fives-list">
                  {scoring.map((x) => (
                    <li key={`${x.tile}${x.end ?? ''}`}>{t('dominoes.coach.scoring.row', { tile: tileLabel(x.tile), end: x.end ? endName(x.end, openEnds(state).find((e) => e.end === x.end)?.value ?? 0) : t('dominoes.coach.scoring.lead'), n: x.points })}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      ) : null}
      {helps.pips ? (
        <dl className="facts coach-counts">
          <dt>{t('dominoes.coach.pips.mine')}</dt>
          <dd className="num">{handPips(view.hand)}</dd>
          <dt>{t('dominoes.coach.pips.line')}</dt>
          <dd className="num">{linePips}</dd>
          <dt>{t('dominoes.coach.pips.unseen')}</dt>
          <dd className="num">{setPips(state.config.set) - linePips - handPips(view.hand)}</dd>
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
          <div className="tiles-out" data-set={state.config.set} role="table" aria-label={t('dominoes.coach.out.title')}>
            {numbers.map((a) => (
              <div key={a} role="row" className="tiles-out-row">
                {numbers
                  .filter((b) => b >= a)
                  .map((b) => {
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
          <p className="empty-note">{t('dominoes.coach.out.note', { yard: drawing(state.config) ? t('dominoes.coach.out.yard') : state.boneyard.length > 0 ? t('dominoes.coach.out.sleeping') : '' })}</p>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('dominoes.coach.numbers')}
          </p>
          <div className="number-counts num">
            {numbers.map((x: Pip) => (
              <span key={x} data-zero={countUnseen(unseen, x, state.config.set) === 0}>
                <b>{x}</b> {countUnseen(unseen, x, state.config.set)}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function countUnseen(unseen: ReadonlySet<Tile>, x: number, set: DominoesState['config']['set']): number {
  return tilesOfSet(set).filter((tile) => hasNumber(tile, x) && unseen.has(tile)).length;
}
