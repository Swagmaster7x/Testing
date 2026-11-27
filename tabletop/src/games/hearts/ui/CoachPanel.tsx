/**
 * The Hearts coach in the rail: a three-step hint, and as switches the things a good player keeps
 * in their head: the cards played, who has shown a void, and the points taken so far.
 */
import { t } from '../../../text';
import type { CoachPanelProps } from '../../types';
import type { Card } from '../../classic/cards';
import { isCard } from '../../classic/cards';
import { cardName, cardsShort } from '../../classic/names';
import { voidsOf } from '../../classic/tricks';
import { HintBox, PlayedGrid, VoidList } from '../../classic/ui/coach';
import { seatLabel } from '../../classic/ui/seats';
import type { HeartsState } from '../rules';
import { isHeart, pointsOf, QUEEN, SEATS, takenBy } from '../rules';

export function HeartsCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<HeartsState>) {
  const me = seat ?? 0;
  const played = new Set<Card>([...state.tricks.flat().map((p) => p.card), ...state.trick.map((p) => p.card)]);
  const taken = takenBy(state);
  const heartsOut = 13 - [...played].filter(isHeart).length;
  const queenGone = played.has(QUEEN);
  const decision = `${state.handNo}/${state.phase}/${state.tricks.length}/${state.trick.length}`;
  const describe = (action: string) => {
    if (action.startsWith('pass:')) return t('hearts.coach.move.pass', { cards: cardsShort(action.slice(5).split(',') as Card[]) });
    return isCard(action) ? t('hearts.coach.move', { card: cardName(action) }) : action;
  };
  return (
    <div className="coach-panel">
      {seat === null ? (
        <p className="empty-note">{t('classic.coach.not-your-turn')}</p>
      ) : (
        <HintBox
          decision={decision}
          ask={ask}
          look={state.phase === 'pass' ? t('hearts.coach.look.pass') : state.trick.length === 0 ? t('hearts.coach.look.lead') : t('hearts.coach.look.follow')}
          describe={describe}
          markTraining={markTraining}
          setOverlay={setOverlay}
          samples={32}
          game="hearts"
        />
      )}
      {helps.points ? (
        <dl className="facts coach-counts classic-counts">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'contents' }}>
              <dt>{seatLabel(s, me)}</dt>
              <dd className="num">{t('hearts.coach.points', { n: pointsOf(taken[s] ?? [], state.config), total: state.scores[s] ?? 0 })}</dd>
            </div>
          ))}
          <dt>{t('hearts.coach.hearts-out')}</dt>
          <dd className="num">{heartsOut}</dd>
          <dt>{t('hearts.coach.queen')}</dt>
          <dd>{queenGone ? t('hearts.coach.queen.gone') : (state.hands[me] ?? []).includes(QUEEN) ? t('hearts.coach.queen.mine') : t('hearts.coach.queen.out')}</dd>
        </dl>
      ) : null}
      {helps.played ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('classic.coach.played')}
          </p>
          <PlayedGrid played={played} mine={new Set(state.hands[me] ?? [])} />
        </div>
      ) : null}
      {helps.voids ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('classic.coach.voids')}
          </p>
          <VoidList voids={voidsOf(SEATS, [...state.tricks, state.trick]).map((v, i) => (i === me ? new Set() : v))} name={(s) => seatLabel(s, me)} />
        </div>
      ) : null}
    </div>
  );
}
