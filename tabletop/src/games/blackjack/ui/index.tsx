import type { Seat } from '../../../core/contract';
import type { GameRecord } from '../../../core/record';
import { t, tDynamic } from '../../../text';
import type { CoachWarning, GameOptions, GameUi, OptionField, ReferenceSection, SeatNames } from '../../types';
import { NO_OVERLAY } from '../../types';
import { cardName } from '../../classic/names';
import { FrenchSeatMark } from '../../classic/ui/SeatMark';
import { basicFor, BLACKJACK_LEVELS } from '../bots';
import { analyseBlackjackGame } from '../review';
import type { BlackjackAction, BlackjackConfig, BlackjackEvent, BlackjackState, BlackjackView } from '../rules';
import { BANKROLL, blackjack, BOXES, DECKS, LIMITS, PENETRATIONS, PRESETS, ROUNDS, SPLIT_TO } from '../rules';
import { BlackjackCoachPanel } from './CoachPanel';
import { BlackjackSurface, boxName } from './BlackjackSurface';

const FIELDS: readonly { key: keyof BlackjackConfig; values: readonly (string | number)[] }[] = [
  { key: 'decks', values: DECKS },
  { key: 'soft17', values: ['stand', 'hit'] },
  { key: 'payout', values: ['3:2', '6:5'] },
  { key: 'double', values: ['any', '9-11', '10-11'] },
  { key: 'das', values: ['yes', 'no'] },
  { key: 'splitTo', values: SPLIT_TO },
  { key: 'resplitAces', values: ['no', 'yes'] },
  { key: 'hitSplitAces', values: ['no', 'yes'] },
  { key: 'surrender', values: ['late', 'none'] },
  { key: 'holeCard', values: ['peek', 'enhc', 'enhc-obo'] },
  { key: 'insurance', values: ['offered', 'none'] },
  { key: 'charlie', values: ['off', 'five'] },
  { key: 'penetration', values: PENETRATIONS },
  { key: 'limits', values: LIMITS },
  { key: 'rounds', values: ROUNDS },
  { key: 'boxes', values: BOXES },
];

export const blackjackOptions: GameOptions<BlackjackConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`blackjack.preset.${id}`), config })),
  fields: FIELDS.map(
    (f): OptionField => ({
      key: f.key,
      label: tDynamic(`blackjack.option.${f.key}`),
      choices: f.values.map((value) => ({ value, label: tDynamic(`blackjack.option.${f.key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof BlackjackConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

const who = (seat: Seat, mySeats: readonly Seat[] | undefined, names?: SeatNames) => boxName(seat, (mySeats ?? [0])[0] ?? 0, names);

export const blackjackUi: GameUi<BlackjackState, BlackjackAction, BlackjackConfig, BlackjackView, BlackjackEvent> = {
  def: blackjack,
  levels: BLACKJACK_LEVELS,
  levelBlurb: (level) => tDynamic(`blackjack.level.${level}`),
  layout: 'table',
  Surface: BlackjackSurface,
  SeatMark: FrenchSeatMark,
  sides: [{ id: 'you', label: 'blackjack.side.you', seat: 0 }],
  sideName: (seat) => t('blackjack.box.n', { n: seat + 1 }),
  movePrefix: (seat, mySeats, _seats, names) => who(seat, mySeats, names),
  playerName: (seat, mySeats, _seats, names) => who(seat, mySeats, names),
  moveText: (action) => (action.type === 'bet' ? t('blackjack.bet.n', { n: action.amount }) : tDynamic(`blackjack.move.${action.type}`)),
  eventDuration(event) {
    switch (event.type) {
      case 'card':
        return 260;
      case 'reveal':
        return 420;
      case 'settle':
        return 1500;
      case 'shuffle':
        return 500;
      case 'peek':
        return 500;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, _seats, names) {
    switch (event.type) {
      case 'shuffle':
        return t('blackjack.log.shuffle');
      case 'bet':
        return t('blackjack.log.bet', { who: who(event.seat, mySeats, names), n: event.amount });
      case 'card':
        if (event.to === 'dealer') return event.card ? t('blackjack.log.dealer-card', { card: cardName(event.card) }) : null;
        return event.card && event.index >= 2 ? t('blackjack.log.card', { who: who(event.to.box, mySeats, names), card: cardName(event.card) }) : null;
      case 'insurance':
        return event.amount > 0 ? t('blackjack.log.insure', { who: who(event.seat, mySeats, names), n: event.amount }) : null;
      case 'peek':
        return event.blackjack ? t('blackjack.log.dealer-bj') : t('blackjack.log.peek');
      case 'reveal':
        return t('blackjack.log.reveal', { card: cardName(event.card) });
      case 'move':
        return t(`blackjack.log.${event.move}`, { who: who(event.seat, mySeats, names), n: event.total });
      case 'settle': {
        const me = (mySeats ?? [0])[0] ?? 0;
        const net = event.nets[me] ?? 0;
        return t(event.dealerTotal > 21 ? 'blackjack.log.settle.bust' : 'blackjack.log.settle', { d: event.dealerTotal, n: net > 0 ? `+${net}` : String(net) });
      }
      case 'game-end':
        return t('blackjack.log.game-end');
    }
  },
  counters(state, mySeats) {
    const me = mySeats[0] ?? 0;
    const box = state.boxes[me];
    return [
      { label: t('blackjack.counter.round'), value: `${Math.min(state.round + 1, state.config.rounds)} / ${state.config.rounds}` },
      { label: t('blackjack.counter.chips'), value: String(box?.chips ?? 0) },
      { label: t('blackjack.counter.net'), value: `${(box?.chips ?? BANKROLL) - BANKROLL >= 0 ? '+' : ''}${(box?.chips ?? BANKROLL) - BANKROLL}` },
      { label: t('blackjack.counter.shoe'), value: String(state.shoe.length) },
    ];
  },
  sound: (event) => (event.type === 'card' || event.type === 'reveal' ? 'card' : event.type === 'bet' || event.type === 'insurance' ? 'chip' : event.type === 'shuffle' ? 'shuffle' : event.type === 'game-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const n = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.blackjack.values', items: n('ref.blackjack.values', 3) },
      { title: 'ref.blackjack.round', items: n('ref.blackjack.round', 5) },
      { title: 'ref.blackjack.moves', items: n('ref.blackjack.moves', 5) },
      { title: 'ref.blackjack.pay', items: n('ref.blackjack.pay', 4) },
      { title: 'ref.blackjack.strategy', items: n('ref.blackjack.strategy', 4) },
      { title: 'ref.blackjack.terms', items: n('ref.blackjack.terms', 5) },
      { title: 'ref.blackjack.presets', items: Object.keys(PRESETS).map((id) => `${tDynamic(`blackjack.preset.${id}`)}: ${tDynamic(`blackjack.preset.${id}.detail`)}`) },
      { title: 'ref.blackjack.ask', items: n('ref.blackjack.ask', 7) },
      { title: 'ref.blackjack.levels', items: BLACKJACK_LEVELS.map((l) => `${t('common.level', { n: l.level })}: ${tDynamic(`blackjack.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'chart', label: 'blackjack.help.chart', on: false, training: true },
      { id: 'count', label: 'blackjack.help.count', on: false, training: true },
      { id: 'ev', label: 'blackjack.help.ev', on: false, training: true },
      { id: 'chartTone', label: 'blackjack.help.chartTone', on: false, training: true },
      { id: 'blunder', label: 'blackjack.help.warn', on: false, training: true },
    ],
    Panel: BlackjackCoachPanel,
    checkMove(_ask, before, action): Promise<CoachWarning | null> {
      if (before.phase !== 'play' || !before.at) return Promise.resolve(null);
      const view = blackjack.view(before, before.at.box);
      const basic = basicFor(view);
      if (!basic || basic === action.type) return Promise.resolve(null);
      return Promise.resolve({ text: t('blackjack.warn', { chart: tDynamic(`blackjack.move.${basic}`), move: tDynamic(`blackjack.move.${action.type}`) }), overlay: NO_OVERLAY });
    },
  },
  review: {
    analyse: analyseBlackjackGame,
    configAt: (state) => ({ ...state.config, start: blackjack.codec.state.toText(state) }),
  },
  options: blackjackOptions,
  replayConfig: (config) => ({ ...config, start: undefined }),
  hiddenInfo: false,
  resultText(record: GameRecord): string | null {
    const o = record.outcome;
    if (!o) return null;
    const mine = o.results.find((r) => r.seat === 0)?.score ?? 0;
    return t('blackjack.result', { n: mine > 0 ? `+${mine}` : String(mine) });
  },
};
