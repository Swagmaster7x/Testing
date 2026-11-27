/**
 * The Gin Rummy coach in the rail: a three-step hint, and as switches the tracker a gin player
 * keeps: your melds and deadwood count, and the cards the other player picked up from the pile
 * (and what they threw), which tell you what they are collecting.
 */
import { t } from '../../../text';
import type { CoachPanelProps } from '../../types';
import type { Card } from '../../classic/cards';
import { isCard } from '../../classic/cards';
import { bestArrangement } from '../../classic/melds';
import { cardName, cardsShort } from '../../classic/names';
import { HintBox } from '../../classic/ui/coach';
import type { GinState } from '../rules';
import { knockLimit } from '../rules';

export function GinCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<GinState>) {
  const me = seat ?? 0;
  const them = me === 0 ? 1 : 0;
  const hand = state.hands[me] ?? [];
  const arrangement = bestArrangement(hand);
  const limit = knockLimit(state.config, state.upcard);
  const decision = `${state.handNo}/${state.log.length}/${state.phase}`;
  const describe = (action: string) => {
    if (action === 'stock') return t('gin.coach.move.stock');
    if (action === 'discard' || action === 'take') return t('gin.coach.move.pile');
    if (action === 'pass') return t('gin.coach.move.pass');
    if (action === 'big-gin') return t('gin.coach.move.big-gin');
    if (action.startsWith('knock:')) return t('gin.coach.move.knock', { card: cardName(action.slice(6) as Card) });
    return isCard(action) ? t('gin.coach.move.discard', { card: cardName(action) }) : action;
  };
  const look = state.phase === 'discard' ? t('gin.coach.look.discard') : t('gin.coach.look.draw');
  const taken = state.log.filter((e) => e.seat === them && e.type === 'take' && e.card).map((e) => e.card as Card);
  const thrown = state.log.filter((e) => e.seat === them && e.type === 'discard' && e.card).map((e) => e.card as Card);
  const passed = state.log.filter((e) => e.seat === them && e.type === 'pass' && e.card).map((e) => e.card as Card);
  return (
    <div className="coach-panel">
      {seat === null ? (
        <p className="empty-note">{t('classic.coach.not-your-turn')}</p>
      ) : (
        <HintBox decision={decision} ask={ask} look={look} describe={describe} markTraining={markTraining} setOverlay={setOverlay} samples={24} game="gin" />
      )}
      {helps.deadwood ? (
        <dl className="facts coach-counts">
          <dt>{t('gin.coach.deadwood')}</dt>
          <dd className="num">{arrangement.count}</dd>
          <dt>{t('gin.coach.melds')}</dt>
          <dd>{arrangement.melds.length > 0 ? arrangement.melds.map((m) => cardsShort(m)).join(' · ') : t('common.none')}</dd>
          <dt>{t('gin.coach.knock-at')}</dt>
          <dd className="num">{limit}</dd>
        </dl>
      ) : null}
      {helps.pickups ? (
        <dl className="facts coach-counts">
          <dt>{t('gin.coach.picked')}</dt>
          <dd>{taken.length > 0 ? cardsShort(taken) : t('common.none')}</dd>
          <dt>{t('gin.coach.passed')}</dt>
          <dd>{passed.length > 0 ? cardsShort(passed) : t('common.none')}</dd>
          <dt>{t('gin.coach.thrown')}</dt>
          <dd>{thrown.length > 0 ? cardsShort(thrown) : t('common.none')}</dd>
        </dl>
      ) : null}
    </div>
  );
}
