import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection, SeatNames } from '../../types';
import { BRISCA_LEVELS } from '../bots';
import { analyseBriscaGame } from '../review';
import type { BriscaAction, BriscaConfig, BriscaEvent, BriscaState, BriscaView } from '../rules';
import { brisca, MATCH_LENGTHS, PRESETS, sideOf } from '../rules';
import { BriscaCoachPanel } from './CoachPanel';
import { cardName, seatName, suitName } from './names';
import { BriscaSeatMark, BriscaSurface } from './BriscaSurface';

/** You, the CPU (or right, partner, left), or at a pass-and-play table another person's name. */
const who = (seat: Seat, mySeats: readonly Seat[] | undefined, names?: SeatNames, n = 2): string => ((mySeats ?? [0]).includes(seat) ? t('brisca.who.you') : seatName(seat, (mySeats ?? [0])[0] ?? 0, n, names));

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
  { key: 'players', values: [2, 4] },
  { key: 'signals', values: ['off', 'señas'] },
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
  movePrefix: (seat, mySeats, seats, names) => ((mySeats ?? [0]).includes(seat) ? t('brisca.you') : (seats ?? 2) === 4 ? seatName(seat, (mySeats ?? [0])[0] ?? 0, 4, names) : (names?.(seat) ?? t('brisca.cpu'))),
  playerName: (seat, mySeats, seats, names) => (mySeats.includes(seat) ? t('common.you') : seats === 4 ? seatName(seat, mySeats[0] ?? 0, 4, names) : t('common.cpu')),
  // A seña is seen only by the side that made it.
  moveVisible: (action, seat, mySeats) => action.type !== 'sign' || mySeats.some((m) => sideOf(m) === sideOf(seat)),
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
      case 'sign':
        return 500;
      case 'deal':
        return 650;
      case 'hand-end':
        return 1600;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, seats, names) {
    const n = seats ?? 2;
    switch (event.type) {
      case 'play':
        return t(event.call ? 'brisca.log.call' : 'brisca.log.play', { who: who(event.seat, mySeats, names, n), card: cardName(event.card) });
      case 'swap':
        return t('brisca.log.swap', { who: who(event.seat, mySeats, names, n), gave: cardName(event.gave), took: cardName(event.took) });
      case 'sign':
        // Only the signing side sees a seña.
        if (!(mySeats ?? [0]).some((m) => sideOf(m) === sideOf(event.seat))) return null;
        return t('brisca.log.sign', { who: who(event.seat, mySeats, names, n), card: tDynamic(`brisca.sign.${event.sign}`) });
      case 'trick':
        return event.points > 0 ? t('brisca.log.trick', { who: who(event.winner, mySeats, names, n), n: event.points }) : t('brisca.log.trick.none', { who: who(event.winner, mySeats, names, n) });
      case 'draw': {
        if (event.turned) return t('brisca.log.draw.turned', { who: who(event.seat, mySeats, names, n), card: cardName(event.card) });
        if ((mySeats ?? [0]).includes(event.seat)) return t('brisca.log.draw.you', { card: cardName(event.card) });
        const person = names?.(event.seat);
        if (person) return t('brisca.log.draw.other', { who: person });
        return n === 4 ? t('brisca.log.draw.other', { who: who(event.seat, mySeats, names, n) }) : t('brisca.log.draw.cpu');
      }
      case 'deal':
        return t('brisca.log.deal', { n: event.handNo + 1, suit: suitName(event.trumpSuit) });
      case 'hand-end': {
        const me = (mySeats ?? [0])[0] ?? 0;
        const them = me === 0 ? 1 : 0;
        if (n === 4) return t('brisca.log.hand-end.sides', { a: event.points[sideOf(me)] ?? 0, b: event.points[1 - sideOf(me)] ?? 0 });
        const person = names?.(them);
        return person
          ? t('brisca.log.hand-end.named', { a: event.points[me] ?? 0, who: person, b: event.points[them] ?? 0 })
          : t('brisca.log.hand-end', { a: event.points[me] ?? 0, b: event.points[them] ?? 0 });
      }
      case 'match-end':
        return t('brisca.log.match-end');
    }
  },
  counters(state, mySeats) {
    const me = mySeats[0] ?? 0;
    const them = me === 0 ? 1 : 0;
    if (state.hands.length === 4) {
      const side = sideOf(me);
      const tricks = (s: number) => state.tricksWon.reduce((a, k, seat) => a + (sideOf(seat) === s ? k : 0), 0);
      const four = [
        { label: t('brisca.counter.stock'), value: String(state.stock.length) },
        { label: t('brisca.counter.tricks.sides'), value: `${tricks(side)} · ${tricks(1 - side)}` },
      ];
      if (state.config.matchTo > 1) four.push({ label: t('brisca.counter.match.sides'), value: `${state.matchWins[side] ?? 0} · ${state.matchWins[1 - side] ?? 0}` });
      return four;
    }
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

