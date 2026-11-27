import { tDynamic, t } from '../../../text';
import type { GameUi, ReferenceSection } from '../../types';
import { NOUGHTS_LEVELS } from '../levels';
import type { Mark, NoughtsAction, NoughtsConfig, NoughtsEvent, NoughtsState, NoughtsView } from '../rules';
import { cellName, markOf, noughts, openLines } from '../rules';
import { NoughtsBoard, NoughtsSeatMark } from './NoughtsBoard';

export const noughtsUi: GameUi<NoughtsState, NoughtsAction, NoughtsConfig, NoughtsView, NoughtsEvent> = {
  def: noughts,
  levels: NOUGHTS_LEVELS,
  levelBlurb: (level) => tDynamic(`noughts.level.${level}`),
  layout: 'board',
  Surface: NoughtsBoard,
  SeatMark: NoughtsSeatMark,
  sides: [
    { id: 'x', label: 'play.side.x', seat: 0 },
    { id: 'o', label: 'play.side.o', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => markOf(seat),
  eventDuration: (event) => (event.type === 'placed' ? 280 : event.type === 'line' ? 480 : 0),
  describeEvent(event) {
    switch (event.type) {
      case 'placed':
        return t('noughts.log.placed', { mark: markOf(event.seat), square: cellName(event.cell) });
      case 'line':
        return t('noughts.log.line', { mark: markOf(event.seat) });
      case 'full':
        return t('noughts.log.full');
    }
  },
  counters(state) {
    return [
      { label: t('noughts.counter.empty'), value: String(state.cells.filter((c) => c === null).length) },
      ...([0, 1] as Mark[]).map((seat) => ({ label: t('noughts.counter.open', { mark: markOf(seat) }), value: String(openLines(state.cells, seat)) })),
    ];
  },
  sound: (event) => (event.type === 'placed' ? 'place' : event.type === 'line' ? 'line' : 'end'),
  reference(): readonly ReferenceSection[] {
    return [
      { title: 'ref.noughts.rules', items: [t('ref.noughts.rule.1'), t('ref.noughts.rule.2'), t('ref.noughts.rule.3')] },
      { title: 'ref.noughts.notation', items: [t('ref.noughts.notation.1'), t('ref.noughts.notation.2')] },
      { title: 'ref.noughts.levels', items: NOUGHTS_LEVELS.map((l) => `${t('common.level', { n: l.level })}: ${tDynamic(`noughts.level.${l.level}`)}`) },
      { title: 'ref.noughts.terms', items: [t('ref.noughts.term.fork'), t('ref.noughts.term.block')] },
    ];
  },
};
