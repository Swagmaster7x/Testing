import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import type { Card } from '../../classic/cards';
import { cardName, cardShort, cardsShort } from '../../classic/names';
import { meOf, seatLabel } from '../../classic/ui/seats';
import { FrenchSeatMark } from '../../classic/ui/SeatMark';
import { HEARTS_LEVELS } from '../bots';
import { analyseHeartsGame } from '../review';
import type { HeartsAction, HeartsConfig, HeartsEvent, HeartsState, HeartsView } from '../rules';
import { giverTo, hearts, MOON_POINTS, PRESETS, pointsOf, takenBy, TARGETS } from '../rules';
import { HeartsCoachPanel } from './CoachPanel';
import { HeartsSurface } from './HeartsSurface';

const FIELDS: readonly { key: keyof HeartsConfig; values: readonly (string | number)[] }[] = [
  { key: 'passing', values: ['lrah', 'lra', 'lr', 'left', 'none'] },
  { key: 'firstLead', values: ['two-clubs', 'left-of-dealer'] },
  { key: 'firstTrickPoints', values: ['no', 'yes'] },
  { key: 'breakHearts', values: ['on', 'off'] },
  { key: 'queenBreaks', values: ['no', 'yes'] },
  { key: 'moon', values: ['add', 'subtract', 'choose'] },
  { key: 'jackDiamonds', values: ['off', 'minus-10'] },
  { key: 'target', values: TARGETS },
  { key: 'ties', values: ['share', 'play-on'] },
];

export const heartsOptions: GameOptions<HeartsConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`hearts.preset.${id}`), config })),
  fields: FIELDS.map(
    (f): OptionField => ({
      key: f.key,
      label: tDynamic(`hearts.option.${f.key}`),
      choices: f.values.map((value) => ({ value, label: tDynamic(`hearts.option.${f.key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof HeartsConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

export const heartsUi: GameUi<HeartsState, HeartsAction, HeartsConfig, HeartsView, HeartsEvent> = {
  def: hearts,
  levels: HEARTS_LEVELS,
  levelBlurb: (level) => tDynamic(`hearts.level.${level}`),
  layout: 'table',
  Surface: HeartsSurface,
  SeatMark: FrenchSeatMark,
  sides: [{ id: 'you', label: 'classic.side.you', seat: 0 }],
  sideName: (seat) => tDynamic(`classic.seat.name.${seat}`),
  movePrefix: (seat, mySeats, _seats, names) => seatLabel(seat, meOf(mySeats), names),
  playerName: (seat, mySeats, _seats, names) => seatLabel(seat, meOf(mySeats), names),
  moveText: (action) => (action.type === 'pass' ? t('hearts.move.pass', { cards: cardsShort(action.cards) }) : cardShort(action.card)),
  eventDuration(event) {
    switch (event.type) {
      case 'play':
        return 280;
      case 'trick':
        return 650;
      case 'exchange':
        return 700;
      case 'deal':
        return 600;
      case 'hand-end':
        return 2600;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, _seats, names) {
    const me = meOf(mySeats);
    const who = (seat: Seat) => seatLabel(seat, me, names);
    switch (event.type) {
      case 'deal':
        return event.passDir === 0 ? t('hearts.log.deal.hold', { n: event.handNo + 1 }) : t('hearts.log.deal', { n: event.handNo + 1, dir: tDynamic(`hearts.dir.${event.passDir}`) });
      case 'pass-chosen':
        return event.seat === me ? null : t('hearts.log.passed', { who: who(event.seat) });
      case 'exchange': {
        const gave = event.gave[me] ?? [];
        const got = event.gave[giverTo(me, event.passDir)] ?? [];
        return t('hearts.log.exchange', { gave: cardsShort(gave), got: cardsShort(got) });
      }
      case 'play':
        return t(event.breaks ? 'hearts.log.play.breaks' : 'hearts.log.play', { who: who(event.seat), card: cardName(event.card) });
      case 'trick':
        return event.points === 0 ? t('hearts.log.trick.clean', { who: who(event.winner) }) : t('hearts.log.trick', { who: who(event.winner), n: event.points });
      case 'hand-end':
        return event.moon !== null ? t('hearts.log.moon', { who: who(event.moon), n: MOON_POINTS }) : t('hearts.log.hand-end', { list: [0, 1, 2, 3].map((s) => `${who(s)} ${event.points[s] ?? 0}`).join(', ') });
      case 'game-end':
        return t('hearts.log.game-end');
    }
  },
  counters(state, mySeats) {
    const me = meOf(mySeats);
    const taken = takenBy(state).map((cards) => pointsOf(cards, state.config));
    return [
      { label: t('hearts.counter.hand'), value: String(state.handNo + 1) },
      { label: t('hearts.counter.pass'), value: tDynamic(`hearts.dir.${state.passDir}`) },
      { label: t('hearts.counter.broken'), value: state.broken ? t('common.on') : t('common.off') },
      { label: t('hearts.counter.mine'), value: `${taken[me] ?? 0} · ${state.scores[me] ?? 0}` },
    ];
  },
  sound: (event) => (event.type === 'play' ? 'card' : event.type === 'deal' ? 'shuffle' : event.type === 'game-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const n = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.hearts.cards', items: n('ref.hearts.cards', 3) },
      { title: 'ref.hearts.pass', items: n('ref.hearts.pass', 3) },
      { title: 'ref.hearts.play', items: n('ref.hearts.play', 4) },
      { title: 'ref.hearts.score', items: n('ref.hearts.score', 4) },
      { title: 'ref.hearts.terms', items: n('ref.hearts.terms', 4) },
      { title: 'ref.hearts.presets', items: Object.keys(PRESETS).map((id) => `${tDynamic(`hearts.preset.${id}`)}: ${tDynamic(`hearts.preset.${id}.detail`)}`) },
      { title: 'ref.hearts.ask', items: n('ref.hearts.ask', 7) },
      { title: 'ref.hearts.levels', items: HEARTS_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('classic.rating', { n: l.rating })}): ${tDynamic(`hearts.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'points', label: 'hearts.help.points', on: false, training: true },
      { id: 'played', label: 'classic.help.played', on: false, training: true },
      { id: 'voids', label: 'classic.help.voids', on: false, training: true },
      { id: 'ducks', label: 'hearts.help.ducks', on: false, training: true },
      { id: 'openHand', label: 'classic.help.openHand', on: false, training: true },
    ],
    Panel: HeartsCoachPanel,
  },
  review: {
    analyse: analyseHeartsGame,
    configAt: (state) => ({ ...state.config, start: hearts.codec.state.toText(state) }),
  },
  options: heartsOptions,
  replayConfig: (config) => ({ ...config, start: undefined }),
};

export type { Card };
