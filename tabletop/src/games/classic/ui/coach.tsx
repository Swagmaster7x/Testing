/**
 * Coach pieces shared by the classic card games: the cards-played grid (what a good player tracks
 * in their head), the void list, and the three-step hint (where to look, the idea, the card).
 */
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { AskCoach, SurfaceOverlay } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { Card, Suit } from '../cards';
import { RANKS, SHOW_SUITS } from '../cards';
import { cardName, suitName, suitSymbol } from '../names';

const RANK_LABEL: Readonly<Record<string, string>> = { T: '10' };

/** Every card, by suit, crossed out once played. */
export function PlayedGrid({ played, mine }: { played: ReadonlySet<Card>; mine?: ReadonlySet<Card> }) {
  return (
    <div className="played-grid" role="table" aria-label={t('classic.coach.played')}>
      {SHOW_SUITS.map((suit) => (
        <div key={suit} role="row" style={{ display: 'contents' }}>
          <span className={`played-suit suit-text-${suit}`} role="rowheader" aria-label={suitName(suit)}>
            {suitSymbol(suit)}
          </span>
          {[...RANKS].reverse().map((rank) => {
            const card: Card = `${rank}${suit}`;
            const state = played.has(card) ? 'played' : mine?.has(card) ? 'mine' : 'out';
            return (
              <span key={card} role="cell" data-state={state} aria-label={`${cardName(card)}: ${t(`classic.coach.card.${state}`)}`}>
                {RANK_LABEL[rank] ?? rank}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** Who has shown a void, seat by seat. */
export function VoidList({ voids, name }: { voids: readonly ReadonlySet<Suit>[]; name: (seat: Seat) => string }) {
  const rows = voids.flatMap((set, seat) => (set.size > 0 ? [{ seat, suits: [...set] }] : []));
  if (rows.length === 0) return <p className="empty-note">{t('classic.coach.no-voids')}</p>;
  return (
    <ul className="lacks-list">
      {rows.map((r) => (
        <li key={r.seat}>
          {t('classic.coach.void', { who: name(r.seat), suits: r.suits.map((s) => `${suitSymbol(s)} ${suitName(s)}`).join(', ') })}
        </li>
      ))}
    </ul>
  );
}

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

/**
 * The three-step hint. `key` names the decision (a new decision clears the hint); `describe` turns
 * the answer into words for the third step; `look` is the first step's text.
 */
export function HintBox({ decision, ask, look, describe, markTraining, setOverlay, samples, game }: { decision: string; ask: AskCoach; look: string; describe: (action: string) => string; markTraining: () => void; setOverlay: (o: SurfaceOverlay) => void; samples: number; game: string }) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [busy, setBusy] = useState(false);
  const current = hint?.key === decision ? hint : null;
  const more = async () => {
    if (current) {
      setHint({ ...current, step: Math.min(3, current.step + 1) });
      return;
    }
    setBusy(true);
    markTraining();
    try {
      const answer = await ask({ type: 'hint', samples });
      if (isJsonObject(answer) && typeof answer.action === 'string') {
        setHint({ key: decision, step: 1, action: answer.action, tags: Array.isArray(answer.tags) ? answer.tags.filter((x): x is string => typeof x === 'string') : [] });
        setOverlay(NO_OVERLAY);
      }
    } finally {
      setBusy(false);
    }
  };
  const idea = current?.tags[0] ? tDynamic(`${game}.idea.${current.tags[0]}`) : tDynamic(`${game}.idea.other`);
  return (
    <div className="stack" style={{ gap: 'var(--sp-2)' }}>
      <button type="button" className="btn btn-small" disabled={busy || (current?.step ?? 0) >= 3} onClick={() => void more()}>
        {busy ? t('classic.coach.thinking') : current ? t('classic.coach.more') : t('classic.coach.hint')}
      </button>
      {current ? (
        <ol className="hint-steps">
          <li>{look}</li>
          {current.step >= 2 ? <li>{t('classic.coach.idea', { idea })}</li> : null}
          {current.step >= 3 ? <li>{describe(current.action)}</li> : null}
        </ol>
      ) : null}
    </div>
  );
}
