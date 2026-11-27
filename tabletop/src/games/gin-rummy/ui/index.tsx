import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection, SeatNames } from '../../types';
import { cardName, cardShort } from '../../classic/names';
import { FrenchSeatMark } from '../../classic/ui/SeatMark';
import { GIN_LEVELS } from '../bots';
import { analyseGinGame } from '../review';
import type { GinAction, GinConfig, GinEvent, GinState, GinView } from '../rules';
import { BIG_GIN, GIN_BONUSES, ginRummy, knockLimit, LINE_BONUSES, PRESETS, TARGETS, UNDERCUT_BONUSES } from '../rules';
import { GinCoachPanel } from './CoachPanel';
import { GinSurface } from './GinSurface';

const FIELDS: readonly { key: keyof GinConfig; values: readonly (string | number)[] }[] = [
  { key: 'knock', values: ['ten', 'oklahoma', 'oklahoma-ace-gin'] },
  { key: 'spadeDouble', values: ['on', 'off'] },
  { key: 'ginBonus', values: GIN_BONUSES },
  { key: 'undercutBonus', values: UNDERCUT_BONUSES },
  { key: 'bigGin', values: BIG_GIN },
  { key: 'lineBonus', values: LINE_BONUSES },
  { key: 'shutout', values: ['double-bonus', 'double-all', 'none'] },
  { key: 'target', values: TARGETS },
  { key: 'firstTurn', values: ['upcard', 'eleven'] },
  { key: 'nextDealer', values: ['winner', 'loser', 'alternate'] },
];

export const ginOptions: GameOptions<GinConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`gin.preset.${id}`), config })),
  fields: FIELDS.map(
    (f): OptionField => ({
      key: f.key,
      label: tDynamic(`gin.option.${f.key}`),
      choices: f.values.map((value) => ({ value, label: tDynamic(`gin.option.${f.key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof GinConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

const who = (seat: Seat, mySeats: readonly Seat[] | undefined, names?: SeatNames): string => ((mySeats ?? [0]).includes(seat) ? t('gin.who.you') : (names?.(seat) ?? t('gin.who.cpu')));

export const ginUi: GameUi<GinState, GinAction, GinConfig, GinView, GinEvent> = {
  def: ginRummy,
  levels: GIN_LEVELS,
  levelBlurb: (level) => tDynamic(`gin.level.${level}`),
  layout: 'table',
  Surface: GinSurface,
  SeatMark: FrenchSeatMark,
  sides: [
    { id: 'first', label: 'gin.side.first', seat: 0 },
    { id: 'second', label: 'gin.side.second', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => tDynamic(`gin.seat.${seat}`),
  movePrefix: (seat, mySeats, _seats, names) => who(seat, mySeats, names),
  moveText: (action) => {
    switch (action.type) {
      case 'discard':
        return cardShort(action.card);
      case 'knock':
        return t('gin.move.knock.short', { card: cardShort(action.card) });
      default:
        return tDynamic(`gin.move.${action.type}`);
    }
  },
  eventDuration(event) {
    switch (event.type) {
      case 'discard':
      case 'draw':
      case 'offer':
        return 320;
      case 'deal':
        return 600;
      case 'knock':
        return 300;
      case 'hand-end':
        return 4200;
      case 'dead':
        return 1600;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, _seats, names) {
    const me = (mySeats ?? [0])[0] ?? 0;
    switch (event.type) {
      case 'deal':
        return event.upcard ? t('gin.log.deal', { n: event.handNo + 1, card: cardName(event.upcard) }) : t('gin.log.deal.eleven', { n: event.handNo + 1 });
      case 'offer':
        return t(event.take ? 'gin.log.take' : 'gin.log.pass', { who: who(event.seat, mySeats, names), card: cardName(event.card) });
      case 'draw':
        if (event.from === 'pile') return t('gin.log.take', { who: who(event.seat, mySeats, names), card: cardName(event.card) });
        return event.seat === me ? t('gin.log.draw.you', { card: cardName(event.card) }) : t('gin.log.draw', { who: who(event.seat, mySeats, names) });
      case 'discard':
        return t('gin.log.discard', { who: who(event.seat, mySeats, names), card: cardName(event.card) });
      case 'knock':
        return t(event.result.kind === 'gin' || event.result.kind === 'big-gin' ? 'gin.log.gin' : 'gin.log.knock', { who: who(event.seat, mySeats, names), n: event.result.knockerCount });
      case 'dead':
        return t('gin.log.dead');
      case 'hand-end':
        return event.result.winner === null ? null : tDynamic(`gin.result.${event.result.kind}`, { who: who(event.result.winner, mySeats, names), n: event.result.points });
      case 'game-end':
        return t('gin.log.game-end', { a: event.final[me] ?? 0, b: event.final[me === 0 ? 1 : 0] ?? 0 });
    }
  },
  counters(state, mySeats) {
    const me = mySeats[0] ?? 0;
    const them = me === 0 ? 1 : 0;
    return [
      { label: t('gin.counter.hand'), value: String(state.handNo + 1) },
      { label: t('gin.counter.score'), value: `${state.scores[me] ?? 0} · ${state.scores[them] ?? 0}` },
      { label: t('gin.counter.stock'), value: String(state.stock.length) },
      { label: t('gin.counter.knock'), value: String(knockLimit(state.config, state.upcard)) },
    ];
  },
  sound: (event) => (event.type === 'discard' || event.type === 'draw' || event.type === 'offer' ? 'card' : event.type === 'deal' ? 'shuffle' : event.type === 'game-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const n = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.gin.cards', items: n('ref.gin.cards', 3) },
      { title: 'ref.gin.play', items: n('ref.gin.play', 4) },
      { title: 'ref.gin.knock', items: n('ref.gin.knock', 4) },
      { title: 'ref.gin.score', items: n('ref.gin.score', 5) },
      { title: 'ref.gin.terms', items: n('ref.gin.terms', 4) },
      { title: 'ref.gin.presets', items: Object.keys(PRESETS).map((id) => `${tDynamic(`gin.preset.${id}`)}: ${tDynamic(`gin.preset.${id}.detail`)}`) },
      { title: 'ref.gin.ask', items: n('ref.gin.ask', 6) },
      { title: 'ref.gin.levels', items: GIN_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('classic.rating', { n: l.rating })}): ${tDynamic(`gin.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'deadwood', label: 'gin.help.deadwood', on: false, training: true },
      { id: 'pickups', label: 'gin.help.pickups', on: false, training: true },
      { id: 'openHand', label: 'gin.help.openHand', on: false, training: true },
    ],
    Panel: GinCoachPanel,
  },
  review: {
    analyse: analyseGinGame,
    configAt: (state) => ({ ...state.config, start: ginRummy.codec.state.toText(state) }),
  },
  options: ginOptions,
  replayConfig: (config) => ({ ...config, start: undefined }),
};
