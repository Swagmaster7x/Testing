import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { TUTE_LEVELS } from '../bots';
import { analyseTuteGame, moveName } from '../review';
import type { TuteAction, TuteConfig, TuteEvent, TuteState, TuteView } from '../rules';
import { actionText, CANTE_TRUMPS, CONFIG_CHOICES, PRESETS, seatCount, sideOf, tute } from '../rules';
import { TuteCoachPanel } from './CoachPanel';
import { cardName, seatName, suitName, whoName } from './names';
import { TuteSeatMark, TuteSurface } from './TuteSurface';

const FIELDS: readonly (keyof typeof CONFIG_CHOICES)[] = ['players', 'twoHand', 'matchTo', 'margin', 'handWin', 'target', 'tie', 'bigWin', 'tute', 'mustBeat', 'partner', 'underTrump', 'stockRules', 'singer', 'fortyFirst', 'swap', 'swapWhen', 'capote'];

export const tuteOptions: GameOptions<TuteConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`tute.preset.${id}`), config })),
  fields: FIELDS.map(
    (key): OptionField => ({
      key,
      label: tDynamic(`tute.option.${key}`),
      choices: (CONFIG_CHOICES[key] as readonly (string | number)[]).map((value) => ({ value, label: tDynamic(`tute.option.${key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof TuteConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

const me = (mySeats: readonly Seat[] | undefined): Seat => (mySeats ?? [0])[0] ?? 0;

export const tuteUi: GameUi<TuteState, TuteAction, TuteConfig, TuteView, TuteEvent> = {
  def: tute,
  levels: TUTE_LEVELS,
  levelBlurb: (level) => tDynamic(`tute.level.${level}`),
  layout: 'table',
  Surface: TuteSurface,
  SeatMark: TuteSeatMark,
  sides: [
    { id: 'you', label: 'tute.side.you', seat: 0 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => tDynamic(`tute.seat.${seat}`),
  movePrefix: (seat, mySeats, seats, names) => seatName(seat, me(mySeats), seats ?? 4, names),
  playerName: (seat, mySeats, seats, names) => seatName(seat, me(mySeats), seats, names),
  moveText: (action) => moveName(actionText(action)),
  eventDuration(event) {
    switch (event.type) {
      case 'play':
        return 300;
      case 'trick':
        return 700;
      case 'draw':
        return 230;
      case 'swap':
        return 500;
      case 'sing':
        return 1100;
      case 'tute':
        return 1600;
      case 'reach':
        return 600;
      case 'deal':
        return 650;
      case 'hand-end':
        return 2600;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, seats, names) {
    const m = me(mySeats);
    const n = seats ?? 4;
    const who = (seat: Seat) => whoName(seat, m, n, names);
    // The mover's own lines (play, sing, tute, swap) follow the mover's name in the log; the rest name their subject.
    switch (event.type) {
      case 'play':
        return t('tute.log.play', { card: cardName(event.card) });
      case 'sing':
        return t(event.points >= CANTE_TRUMPS ? 'tute.log.sing.forty' : 'tute.log.sing.twenty', { suit: suitName(event.suit) });
      case 'tute':
        return t(event.kind === 'R' ? 'tute.log.tute.kings' : 'tute.log.tute.knights');
      case 'swap':
        return t('tute.log.swap', { gave: cardName(event.gave), took: cardName(event.took) });
      case 'trick': {
        const mine = event.winner === m;
        if (event.last) return mine ? t('tute.log.trick.last.you', { n: event.points }) : t('tute.log.trick.last', { who: who(event.winner), n: event.points });
        if (event.points > 0) return mine ? t('tute.log.trick.you', { n: event.points }) : t('tute.log.trick', { who: who(event.winner), n: event.points });
        return mine ? t('tute.log.trick.none.you') : t('tute.log.trick.none', { who: who(event.winner) });
      }
      case 'draw':
        if (event.turned) return event.seat === m ? t('tute.log.draw.turned.you', { card: cardName(event.card) }) : t('tute.log.draw.turned', { who: who(event.seat), card: cardName(event.card) });
        if (event.seat === m) return t('tute.log.draw.you', { card: cardName(event.card) });
        return t('tute.log.draw.other', { who: who(event.seat) });
      case 'reach':
        return t(event.side === sideOf(m, n) ? 'tute.log.reach.us' : 'tute.log.reach.them', { n: event.points });
      case 'deal':
        return event.carry.some((x) => x > 0) ? t('tute.log.deal.vuelta', { n: event.handNo + 1, suit: suitName(event.trumpSuit), card: cardName(event.turned) }) : t('tute.log.deal', { n: event.handNo + 1, suit: suitName(event.trumpSuit), card: cardName(event.turned) });
      case 'hand-end': {
        const r = event.result;
        const us = sideOf(m, n);
        const a = (r.carried[us] ?? 0) + (r.points[us] ?? 0);
        const b = (r.carried[1 - us] ?? 0) + (r.points[1 - us] ?? 0);
        if (r.vuelta) return t('tute.log.hand-end.vuelta', { a, b });
        if (r.winner === null) return t('tute.log.hand-end.tie', { a, b });
        return t(r.winner === us ? 'tute.log.hand-end.us' : 'tute.log.hand-end.them', { a, b });
      }
      case 'match-end':
        return t('tute.log.match-end');
    }
  },
  counters(state, mySeats) {
    const m = me(mySeats);
    const n = seatCount(state.config);
    const us = sideOf(m, n);
    const rows = [
      { label: n === 4 ? t('tute.counter.games') : t('tute.counter.games.two'), value: `${state.matchWins[us] ?? 0} · ${state.matchWins[1 - us] ?? 0}` },
      { label: t('tute.counter.target'), value: String(state.config.matchTo) },
      { label: n === 4 ? t('tute.counter.tricks') : t('tute.counter.tricks.two'), value: `${state.tricks.filter((x) => sideOf(x.winner, n) === us).length} · ${state.tricks.filter((x) => sideOf(x.winner, n) !== us).length}` },
    ];
    if (n === 2) rows.push({ label: t('tute.counter.stock'), value: String(state.stock.length) });
    if (state.carry.some((x) => x > 0)) rows.push({ label: t('tute.counter.carry'), value: `${state.carry[us] ?? 0} · ${state.carry[1 - us] ?? 0}` });
    return rows;
  },
  sound: (event) => (event.type === 'play' || event.type === 'swap' ? 'card' : event.type === 'deal' ? 'shuffle' : event.type === 'match-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const lines = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.tute.cards', items: lines('ref.tute.cards', 3) },
      { title: 'ref.tute.play', items: lines('ref.tute.play', 5) },
      { title: 'ref.tute.cantes', items: lines('ref.tute.cantes', 4) },
      { title: 'ref.tute.score', items: lines('ref.tute.score', 4) },
      { title: 'ref.tute.two', items: lines('ref.tute.two', 3) },
      { title: 'ref.tute.terms', items: lines('ref.tute.terms', 8) },
      { title: 'ref.tute.presets', items: Object.keys(PRESETS).map((id) => `${tDynamic(`tute.preset.${id}`)}: ${tDynamic(`tute.preset.${id}.detail`)}`) },
      { title: 'ref.tute.ask', items: lines('ref.tute.ask', 8) },
      { title: 'ref.tute.levels', items: TUTE_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('tute.rating', { n: l.rating })}): ${tDynamic(`tute.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'legal', label: 'coach.help.legal', on: true, training: false },
      { id: 'counts', label: 'tute.help.counts', on: false, training: true },
      { id: 'voids', label: 'tute.help.voids', on: false, training: true },
      { id: 'seen', label: 'tute.help.seen', on: false, training: true },
      { id: 'whatBeats', label: 'tute.help.whatBeats', on: false, training: true },
      { id: 'openHand', label: 'tute.help.openHand', on: false, training: true },
    ],
    Panel: TuteCoachPanel,
  },
  review: {
    analyse: analyseTuteGame,
    configAt: (state) => ({ ...state.config, start: tute.codec.state.toText(state) }),
  },
  options: tuteOptions,
  replayConfig: (config) => ({ ...config, start: undefined }),
};
