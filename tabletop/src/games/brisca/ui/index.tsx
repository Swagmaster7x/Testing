import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { BRISCA_LEVELS } from '../bots';
import { analyseBriscaGame } from '../review';
import type { BriscaAction, BriscaConfig, BriscaEvent, BriscaState, BriscaView } from '../rules';
import { brisca, MATCH_LENGTHS, PRESETS } from '../rules';
import { BriscaCoachPanel } from './CoachPanel';
import { cardName, suitName } from './names';
import { BriscaSeatMark, BriscaSurface } from './BriscaSurface';

const who = (seat: Seat, mySeats: readonly Seat[] | undefined): string => ((mySeats ?? [0]).includes(seat) ? t('brisca.who.you') : t('brisca.who.cpu'));

const FIELDS: readonly { key: keyof BriscaConfig; values: readonly (string | number)[] }[] = [
  { key: 'swap', values: ['seven-and-two', 'seven', 'none'] },
  { key: 'swapWhen', values: ['any-turn', 'after-own-trick'] },
  { key: 'tie', values: ['draw', 'most-cards'] },
  { key: 'matchTo', values: MATCH_LENGTHS },
  { key: 'bigWin', values: ['single', 'double'] },
  { key: 'turnedBrisca', values: ['stays', 'redeal'] },
  { key: 'trumps', values: ['turned', 'rotate'] },
  { key: 'arrastre', values: ['off', 'on'] },
  { key: 'secondBrisca', values: ['three', 'seven'] },
];

export const briscaOptions: GameOptions<BriscaConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`brisca.preset.${id}`), config })),
  fields: FIELDS.map(
    (f): OptionField => ({
      key: f.key,
      label: tDynamic(`brisca.option.${f.key}`),
      choices: f.values.map((value) => ({ value, label: tDynamic(`brisca.option.${f.key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof BriscaConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

export const briscaUi: GameUi<BriscaState, BriscaAction, BriscaConfig, BriscaView, BriscaEvent> = {
  def: brisca,
  levels: BRISCA_LEVELS,
  levelBlurb: (level) => tDynamic(`brisca.level.${level}`),
  layout: 'table',
  Surface: BriscaSurface,
  SeatMark: BriscaSeatMark,
  sides: [
    { id: 'first', label: 'brisca.side.first', seat: 0 },
    { id: 'second', label: 'brisca.side.second', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => tDynamic(`brisca.seat.${seat}`),
  movePrefix: (seat, mySeats) => ((mySeats ?? [0]).includes(seat) ? t('brisca.you') : t('brisca.cpu')),
  eventDuration(event) {
    switch (event.type) {
      case 'play':
        return 300;
      case 'trick':
        return 620;
      case 'draw':
        return 230;
      case 'swap':
        return 480;
      case 'deal':
        return 650;
      case 'hand-end':
        return 1600;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats) {
    switch (event.type) {
      case 'play':
        return t(event.call ? 'brisca.log.call' : 'brisca.log.play', { who: who(event.seat, mySeats), card: cardName(event.card) });
      case 'swap':
        return t('brisca.log.swap', { who: who(event.seat, mySeats), gave: cardName(event.gave), took: cardName(event.took) });
      case 'trick':
        return event.points > 0 ? t('brisca.log.trick', { who: who(event.winner, mySeats), n: event.points }) : t('brisca.log.trick.none', { who: who(event.winner, mySeats) });
      case 'draw':
        if (event.turned) return t('brisca.log.draw.turned', { who: who(event.seat, mySeats), card: cardName(event.card) });
        return (mySeats ?? [0]).includes(event.seat) ? t('brisca.log.draw.you', { card: cardName(event.card) }) : t('brisca.log.draw.cpu');
      case 'deal':
        return t('brisca.log.deal', { n: event.handNo + 1, suit: suitName(event.trumpSuit) });
      case 'hand-end': {
        const me = (mySeats ?? [0])[0] ?? 0;
        return t('brisca.log.hand-end', { a: event.points[me] ?? 0, b: event.points[me === 0 ? 1 : 0] ?? 0 });
      }
      case 'match-end':
        return t('brisca.log.match-end');
    }
  },
  counters(state, mySeats) {
    const me = mySeats[0] ?? 0;
    const them = me === 0 ? 1 : 0;
    const rows = [
      { label: t('brisca.counter.stock'), value: String(state.stock.length) },
      { label: t('brisca.counter.tricks'), value: `${state.tricksWon[me] ?? 0} · ${state.tricksWon[them] ?? 0}` },
    ];
    if (state.config.matchTo > 1) rows.push({ label: t('brisca.counter.match'), value: `${state.matchWins[me] ?? 0} · ${state.matchWins[them] ?? 0}` });
    return rows;
  },
  sound: (event) => (event.type === 'play' || event.type === 'swap' ? 'card' : event.type === 'deal' ? 'shuffle' : event.type === 'match-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const n = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.brisca.cards', items: n('ref.brisca.cards', 3) },
      { title: 'ref.brisca.play', items: n('ref.brisca.play', 5) },
      { title: 'ref.brisca.swap', items: n('ref.brisca.swap', 2) },
      { title: 'ref.brisca.terms', items: n('ref.brisca.terms', 6) },
      { title: 'ref.brisca.presets', items: n('ref.brisca.presets', 3) },
      { title: 'ref.brisca.ask', items: n('ref.brisca.ask', 5) },
      { title: 'ref.brisca.levels', items: BRISCA_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('brisca.rating', { n: l.rating })}): ${tDynamic(`brisca.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'whatBeats', label: 'coach.help.whatBeats', on: false, training: true },
      { id: 'counts', label: 'coach.help.counts', on: false, training: true },
      { id: 'seen', label: 'coach.help.seen', on: false, training: true },
      { id: 'openHand', label: 'coach.help.openHand', on: false, training: true },
    ],
    Panel: BriscaCoachPanel,
  },
  review: {
    analyse: analyseBriscaGame,
    configAt: (state) => ({ ...state.config, start: brisca.codec.state.toText(state) }),
  },
  options: briscaOptions,
};

