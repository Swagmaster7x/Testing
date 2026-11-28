/**
 * An American card hand drawn as small tiles, group by group, the way a card prints it: suit a as
 * characters, b as dots, c as bamboo (on a real card, the three colours), with its points and
 * whether it must stay concealed. Used by the coach, the card editor and the calculator.
 */
import { t } from '../../../text';
import type { CardHand } from '../american/card';
import { groupKinds } from '../american/card';
import { kindName } from './names';
import { MiniTile } from './MahjongSurface';

export function CardHandTiles({ hand, width = 14, learner = true }: { hand: CardHand; width?: number; learner?: boolean }) {
  const groups = groupKinds(hand);
  const label = t('mahjong.card.hand', { text: hand.text, points: hand.points, mark: t(hand.concealed ? 'mahjong.card.concealed' : 'mahjong.card.exposed') });
  return (
    <span className="mj-card-hand" role="img" aria-label={`${label}${hand.shift ? `, ${t('mahjong.card.shift')}` : ''}: ${groups.map((g) => g.map(kindName).join(' ')).join('; ')}`}>
      {groups.map((g, i) => (
        <span key={i} className="mj-card-group" aria-hidden="true">
          {g.map((k, j) => (
            <MiniTile key={j} kind={k} learner={learner} width={width} />
          ))}
        </span>
      ))}
      <span className="num faint" aria-hidden="true">
        {hand.points} {hand.concealed ? 'C' : 'X'}
        {hand.shift ? ' ↕' : ''}
      </span>
    </span>
  );
}
