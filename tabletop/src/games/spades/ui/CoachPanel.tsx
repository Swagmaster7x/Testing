/**
 * The Spades coach in the rail: a three-step hint (with the trick count of your hand while you
 * bid), and as switches the tracker a partnership player keeps: tricks won against each bid, bags,
 * the cards played and who is void.
 */
import { t } from '../../../text';
import type { CoachPanelProps } from '../../types';
import type { Card } from '../../classic/cards';
import { isCard } from '../../classic/cards';
import { cardName } from '../../classic/names';
import { voidsOf } from '../../classic/tricks';
import { HintBox, PlayedGrid, VoidList } from '../../classic/ui/coach';
import { seatLabel } from '../../classic/ui/seats';
import { countTricks } from '../bots';
import type { SpadesState } from '../rules';
import { membersOf, SEATS, sideCount, sideOf, tricksWon } from '../rules';

export function SpadesCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<SpadesState>) {
  const me = seat ?? 0;
  const pairs = state.config.partners === 'pairs';
  const played = new Set<Card>([...state.tricks.flat().map((p) => p.card), ...state.trick.map((p) => p.card)]);
  const won = tricksWon(state);
  const decision = `${state.handNo}/${state.phase}/${state.bids.filter((b) => b !== null).length}/${state.tricks.length}/${state.trick.length}/${state.looked[me] ? 1 : 0}`;
  const describe = (action: string) => {
    if (action.startsWith('bid:')) return Number(action.slice(4)) === 0 ? t('spades.coach.move.nil') : t('spades.coach.move.bid', { n: Number(action.slice(4)) });
    if (action === 'blind') return t('spades.coach.move.blind');
    if (action === 'look') return t('spades.coach.move.look');
    return isCard(action) ? t('spades.coach.move', { card: cardName(action) }) : action;
  };
  const hand = state.hands[me] ?? [];
  const look = state.phase === 'bid' ? t('spades.coach.look.bid', { n: Math.round(countTricks(hand) * 2) / 2 }) : state.trick.length === 0 ? t('spades.coach.look.lead') : t('spades.coach.look.follow');
  return (
    <div className="coach-panel">
      {seat === null ? (
        <p className="empty-note">{t('classic.coach.not-your-turn')}</p>
      ) : (
        <HintBox decision={decision} ask={ask} look={state.looked[me] || state.phase === 'play' ? look : t('spades.coach.look.blind')} describe={describe} markTraining={markTraining} setOverlay={setOverlay} samples={32} game="spades" />
      )}
      {helps.tricks ? (
        <dl className="facts coach-counts">
          {Array.from({ length: sideCount(state.config) }, (_, side) => side).map((side) => {
            const members = membersOf(state.config, side);
            const bid = members.reduce((a, m) => a + Math.max(0, state.bids[m] ?? 0), 0);
            const took = members.reduce((a, m) => a + (won[m] ?? 0), 0);
            const name = pairs ? (side === sideOf(state.config, me) ? t('spades.side.us') : t('spades.side.them')) : seatLabel(members[0] ?? 0, me);
            return (
              <div key={side} style={{ display: 'contents' }}>
                <dt>{name}</dt>
                <dd className="num">{t('spades.coach.tricks', { took, bid, bags: state.bagCount[side] ?? 0 })}</dd>
              </div>
            );
          })}
          {[0, 1, 2, 3]
            .filter((s) => state.bids[s] === 0)
            .map((s) => (
              <div key={`nil-${s}`} style={{ display: 'contents' }}>
                <dt>{t('spades.coach.nil', { who: seatLabel(s, me, undefined, pairs) })}</dt>
                <dd>{(won[s] ?? 0) === 0 ? t('spades.coach.nil.alive') : t('spades.coach.nil.broken')}</dd>
              </div>
            ))}
        </dl>
      ) : null}
      {helps.played ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('classic.coach.played')}
          </p>
          <PlayedGrid played={played} mine={new Set(hand)} />
        </div>
      ) : null}
      {helps.voids ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('classic.coach.voids')}
          </p>
          <VoidList voids={voidsOf(SEATS, [...state.tricks, state.trick]).map((v, i) => (i === me ? new Set() : v))} name={(s) => seatLabel(s, me, undefined, pairs)} />
        </div>
      ) : null}
    </div>
  );
}
