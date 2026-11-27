/**
 * The Brisca coach in the rail. A three-step hint (where to look, the idea, the card), and, as
 * switches, the counts a good player keeps in their head (points so far, trumps and briscas still
 * out) and the cards seen. Every help marks the game as training.
 */
import { useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { BriscaState, Card } from '../rules';
import { cardPoints, isCard, pointsOf, RANKS, SUITS, suitOf, unseenCards, viewOf } from '../rules';
import { cardName, suitName } from './names';

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

const RANK_LABEL: Record<string, string> = { A: '1', S: '10', C: '11', R: '12' };

export function BriscaCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<BriscaState>) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [busy, setBusy] = useState(false);
  const me = seat ?? 0;
  const them = me === 0 ? 1 : 0;
  // A hint belongs to one decision: the hand, the trick and the cards in it.
  const key = `${state.handNo}/${state.won.flat().length}/${state.trick.length}/${state.hands[me]?.join('') ?? ''}`;
  const current = hint?.key === key ? hint : null;
  const view = viewOf(state, me);
  const unseen = unseenCards(view);
  const trumpsOut = unseen.filter((c) => suitOf(c) === state.trumpSuit).length;
  const briscasOut = unseen.filter((c) => cardPoints(c, state.config) >= 10).length;
  const played = new Set<Card>([...state.won.flat(), ...state.trick.map((p) => p.card)]);

  const askHint = async () => {
    if (current) {
      const step = Math.min(3, current.step + 1);
      setHint({ ...current, step });
      if (step === 3 && isCard(current.action)) setOverlay({ arrows: [], marks: [{ square: current.action, tone: 'hint' }] });
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

  const idea = current?.tags[0] ? tDynamic(`brisca.idea.${current.tags[0]}`) : tDynamic('brisca.idea.other');
  const hintCard = current ? current.action.replace('!', '') : '';
  const moveText = current ? (current.action === 'swap' ? t('brisca.coach.move.swap') : t('brisca.coach.move', { card: isCard(hintCard) ? cardName(hintCard) : current.action })) : '';

  return (
    <div className="coach-panel">
      {seat === null ? (
        <p className="empty-note">{t('brisca.coach.not-your-turn')}</p>
      ) : (
        <div className="stack" style={{ gap: 'var(--sp-2)' }}>
          <button type="button" className="btn btn-small" disabled={busy || (current?.step ?? 0) >= 3} onClick={() => void askHint()}>
            {busy ? t('brisca.coach.thinking') : current ? t('brisca.coach.more') : t('brisca.coach.hint')}
          </button>
          {current ? (
            <ol className="hint-steps">
              <li>{state.trick.length === 0 ? t('brisca.coach.look.lead') : t('brisca.coach.look.follow')}</li>
              {current.step >= 2 ? <li>{t('brisca.coach.idea', { idea })}</li> : null}
              {current.step >= 3 ? <li>{moveText}</li> : null}
            </ol>
          ) : null}
        </div>
      )}
      {helps.counts ? (
        <dl className="facts coach-counts">
          <dt>{t('brisca.counter.points')}</dt>
          <dd className="num">
            {pointsOf(state.won[me] ?? [], state.config)} · {pointsOf(state.won[them] ?? [], state.config)}
          </dd>
          <dt>{t('brisca.counter.trumps')}</dt>
          <dd className="num">
            {trumpsOut} ({suitName(state.trumpSuit)})
          </dd>
          <dt>{t('brisca.counter.briscas')}</dt>
          <dd className="num">{briscasOut}</dd>
        </dl>
      ) : null}
      {helps.seen ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('brisca.coach.seen.title')}
          </p>
          {played.size === 0 ? (
            <p className="empty-note">{t('brisca.coach.none-seen')}</p>
          ) : (
            <div className="seen-grid" role="table">
              {SUITS.map((suit) => (
                <div key={suit} role="row" style={{ display: 'contents' }}>
                  <span className="seen-suit" role="rowheader">
                    {suitName(suit)}
                  </span>
                  {RANKS.map((rank) => {
                    const card: Card = `${rank}${suit}`;
                    return (
                      <span key={card} role="cell" data-seen={played.has(card)} aria-label={`${cardName(card)}${played.has(card) ? '' : ' *'}`}>
                        {RANK_LABEL[rank] ?? rank}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
