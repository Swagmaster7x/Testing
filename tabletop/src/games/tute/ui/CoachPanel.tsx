/**
 * The Tute coach in the rail. A three-step hint (where to look, the idea, the card), and, as
 * switches, what a good player keeps in their head: points so far with the cantes, trumps and
 * Ases and Treses still out, which pairs can still be sung, the cards seen, and who cannot have a
 * suit (read from the obligations). Every help marks the game as training.
 */
import { useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { Card, TuteState } from '../rules';
import { cannotHold, cardPoints, isCard, RANKS, seatCount, sideOf, sidePoints, SUITS, suitOf, unseenCards, viewOf } from '../rules';
import { cardName, seatName, suitName } from './names';

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

const RANK_LABEL: Record<string, string> = { A: '1', S: '10', C: '11', R: '12' };

export function TuteCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<TuteState>) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [busy, setBusy] = useState(false);
  const players = seatCount(state.config);
  const me = seat ?? 0;
  const us = sideOf(me, players);
  // A hint belongs to one decision.
  const key = `${state.handNo}/${state.tricks.length}/${state.trick.length}/${state.cantes.length}/${state.hands[me]?.join('') ?? ''}`;
  const current = hint?.key === key ? hint : null;
  const view = viewOf(state, me);
  const unseen = unseenCards(view);
  const out = new Set<Card>([...unseen, ...state.known.flatMap((k, s) => (s === me ? [] : k))]);
  const trumpsOut = [...out].filter((c) => suitOf(c) === state.trumpSuit).length;
  const bigOut = [...out].filter((c) => cardPoints(c) >= 10).length;
  const played = new Set<Card>([...state.won.flat(), ...state.trick.map((p) => p.card)]);
  const sung = new Set(state.cantes.map((c) => c.suit));
  // A pair can still be sung while neither card has been played and the suit is not sung.
  const openPairs = SUITS.filter((s) => !sung.has(s) && !played.has(`R${s}`) && !played.has(`C${s}`));
  const bars = cannotHold(view);

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

  const idea = current?.tags[0] ? tDynamic(`tute.idea.${current.tags[0]}`) : tDynamic('tute.idea.tute-other');
  const moveText = !current
    ? ''
    : current.action === 'swap'
      ? t('tute.coach.move.swap')
      : current.action.startsWith('sing-')
        ? t('tute.coach.move.sing')
        : current.action.startsWith('tute-')
          ? t('tute.coach.move.tute')
          : t('tute.coach.move', { card: isCard(current.action) ? cardName(current.action) : current.action });

  return (
    <div className="coach-panel">
      {seat === null ? (
        <p className="empty-note">{t('tute.coach.not-your-turn')}</p>
      ) : (
        <div className="stack" style={{ gap: 'var(--sp-2)' }}>
          <button type="button" className="btn btn-small" disabled={busy || (current?.step ?? 0) >= 3} onClick={() => void askHint()}>
            {busy ? t('tute.coach.thinking') : current ? t('tute.coach.more') : t('tute.coach.hint')}
          </button>
          {current ? (
            <ol className="hint-steps">
              <li>{state.trick.length === 0 ? t('tute.coach.look.lead') : t('tute.coach.look.follow')}</li>
              {current.step >= 2 ? <li>{t('tute.coach.idea', { idea })}</li> : null}
              {current.step >= 3 ? <li>{moveText}</li> : null}
            </ol>
          ) : null}
        </div>
      )}
      {helps.counts ? (
        <dl className="facts coach-counts">
          <dt>{players === 4 ? t('tute.counter.points') : t('tute.counter.points.two')}</dt>
          <dd className="num">
            {sidePoints(state, us)} · {sidePoints(state, 1 - us)}
          </dd>
          <dt>{t('tute.counter.trumps')}</dt>
          <dd className="num">
            {trumpsOut} ({suitName(state.trumpSuit)})
          </dd>
          <dt>{t('tute.counter.big')}</dt>
          <dd className="num">{bigOut}</dd>
          <dt>{t('tute.counter.pairs')}</dt>
          <dd>{openPairs.length === 0 ? t('tute.counter.pairs.none') : openPairs.map(suitName).join(', ')}</dd>
        </dl>
      ) : null}
      {helps.voids ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('tute.coach.voids.title')}
          </p>
          <ul className="tute-voids">
            {Array.from({ length: players }, (_, s) => s)
              .filter((s) => s !== me)
              .map((s) => {
                const lacks = SUITS.filter((suit) => [...out].some((c) => suitOf(c) === suit) && [...out].filter((c) => suitOf(c) === suit).every((c) => bars[s]?.has(c)));
                return (
                  <li key={s}>
                    <b>{seatName(s, me, players)}</b> {lacks.length === 0 ? t('tute.coach.voids.none') : lacks.map(suitName).join(', ')}
                  </li>
                );
              })}
          </ul>
        </div>
      ) : null}
      {helps.seen ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('tute.coach.seen.title')}
          </p>
          {played.size === 0 ? (
            <p className="empty-note">{t('tute.coach.none-seen')}</p>
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
