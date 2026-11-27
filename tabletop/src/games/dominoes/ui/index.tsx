import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { DOMINOES_LEVELS } from '../bots';
import { analyseDominoesGame } from '../review';
import type { DominoesAction, DominoesConfig, DominoesEvent, DominoesState, DominoesView } from '../rules';
import { CONFIG_CHOICES, dominoes, drawing, endsCount, PRESETS, seatCount, sideCount, sideOf } from '../rules';
import { DominoesCoachPanel } from './CoachPanel';
import { DominoesSeatMark, DominoesSurface } from './DominoesSurface';
import { seatName, tileLabel, whoName } from './names';

const FIELDS: readonly (keyof typeof CONFIG_CHOICES)[] = [
  'mode',
  'set',
  'hand',
  'target',
  'scoring',
  'blockedScore',
  'blockedWinner',
  'blockedTie',
  'firstLead',
  'nextLead',
  'earlyBonus',
  'capicu',
  'chuchazo',
  'chuchazoEnds',
  'passBonus',
  'redeal',
  'drawLimit',
  'spinner',
  'fives',
  'rounding',
  'finish',
];

export const dominoesOptions: GameOptions<DominoesConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`dominoes.preset.${id}`), config })),
  fields: FIELDS.map(
    (key): OptionField => ({
      key,
      label: tDynamic(`dominoes.option.${key}`),
      choices: (CONFIG_CHOICES[key] as readonly (string | number)[]).map((value) => ({ value, label: tDynamic(`dominoes.option.${key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof DominoesConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

const me = (mySeats: readonly Seat[] | undefined): Seat => (mySeats ?? [0])[0] ?? 0;

const END_LOG = { left: 'dominoes.log.left', right: 'dominoes.log.right', up: 'dominoes.log.up', down: 'dominoes.log.down' } as const;

export const dominoesUi: GameUi<DominoesState, DominoesAction, DominoesConfig, DominoesView, DominoesEvent> = {
  def: dominoes,
  levels: DOMINOES_LEVELS,
  levelBlurb: (level) => tDynamic(`dominoes.level.${level}`),
  layout: 'table',
  Surface: DominoesSurface,
  SeatMark: DominoesSeatMark,
  sides: [{ id: 'you', label: 'dominoes.side.you', seat: 0 }],
  sideName: (seat) => tDynamic(`dominoes.seat.${seat}`),
  movePrefix: (seat, mySeats, seats, names) => seatName(seat, me(mySeats), seats ?? 4, names),
  playerName: (seat, mySeats, seats, names) => seatName(seat, me(mySeats), seats, names),
  moveText: (action) => {
    if (action.type !== 'play') return t(`dominoes.move.${action.type}`);
    const tile = tileLabel(action.tile);
    switch (action.end) {
      case 'left':
        return `← ${tile}`;
      case 'right':
        return `${tile} →`;
      case 'up':
        return `↑ ${tile}`;
      case 'down':
        return `↓ ${tile}`;
      default:
        return tile;
    }
  },
  eventDuration(event) {
    switch (event.type) {
      case 'play':
        return (event.scored ?? 0) > 0 ? 900 : 420;
      case 'pass':
        return 700;
      case 'draw':
        return 260;
      case 'bonus':
        return 900;
      case 'deal':
        return 700;
      case 'hand-end':
        return 3200;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, seats, names) {
    const m = me(mySeats);
    const n = seats ?? 4;
    switch (event.type) {
      case 'play': {
        const played = t(event.end === null ? 'dominoes.log.play.first' : 'dominoes.log.play', { tile: tileLabel(event.tile), end: t(END_LOG[event.end ?? 'left']) });
        if (event.count === undefined) return played;
        return (event.scored ?? 0) > 0 ? t('dominoes.log.play.scores', { play: played, count: event.count, n: event.scored ?? 0 }) : t('dominoes.log.play.count', { play: played, count: event.count });
      }
      case 'pass':
        return event.ends.length === 2 ? t('dominoes.log.pass', { a: event.ends[0] ?? 0, b: event.ends[1] ?? 0 }) : t('dominoes.log.pass.list', { list: event.ends.join(', ') });
      case 'draw':
        return event.seat === m ? t('dominoes.log.draw.you', { tile: tileLabel(event.tile) }) : t('dominoes.log.draw.other');
      case 'deal':
        return event.mustLead
          ? t('dominoes.log.deal.must', { n: event.handNo + 1, who: whoName(event.leader, m, n, names), tile: tileLabel(event.mustLead) })
          : t('dominoes.log.deal', { n: event.handNo + 1, who: whoName(event.leader, m, n, names) });
      case 'bonus':
        return tDynamic(`dominoes.log.bonus.${event.bonus.kind}`, { points: event.bonus.points });
      case 'hand-end': {
        const r = event.result;
        if (r.reason === 'target') return t('dominoes.log.hand-end.target', { who: whoName(r.by, m, n, names) });
        if (r.winner === null) return r.split ? t('dominoes.log.hand-end.split', { n: r.points[r.split[0] ?? 0] ?? 0 }) : t('dominoes.log.hand-end.tie');
        const side = sideCount(n) > 2 ? seatName(r.winner, m, n, names) : r.winner === sideOf(m, n) ? t('dominoes.side.us') : t('dominoes.side.them');
        return t(r.reason === 'domino' ? 'dominoes.log.hand-end.domino' : 'dominoes.log.hand-end.block', { who: whoName(r.by, m, n, names), side, n: r.points[r.winner] ?? 0 });
      }
      case 'match-end':
        return t('dominoes.log.match-end');
    }
  },
  counters(state, mySeats) {
    const m = me(mySeats);
    const n = seatCount(state.config);
    const us = sideOf(m, n);
    const score =
      n === 3
        ? { label: t('dominoes.counter.score.three'), value: [0, 1, 2].map((rel) => String(state.scores[(m + rel) % 3] ?? 0)).join(' · ') }
        : { label: n === 4 ? t('dominoes.counter.score') : t('dominoes.counter.score.two'), value: `${state.scores[us] ?? 0} · ${state.scores[1 - us] ?? 0}` };
    const rows = [
      score,
      { label: t('dominoes.counter.target'), value: state.config.target > 0 ? String(state.config.target) : t('dominoes.counter.target.hand') },
      { label: t('dominoes.counter.hand'), value: String(state.handNo + 1) },
    ];
    if (state.config.fives === 'on') rows.push({ label: t('dominoes.counter.count'), value: String(endsCount(state)) });
    if (drawing(state.config)) rows.push({ label: t('dominoes.counter.boneyard'), value: String(state.boneyard.length) });
    return rows;
  },
  sound: (event) => (event.type === 'play' ? ((event.scored ?? 0) > 0 ? 'chip' : 'tile') : event.type === 'draw' ? 'tile' : event.type === 'deal' ? 'shuffle' : event.type === 'match-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const lines = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.dominoes.tiles', items: lines('ref.dominoes.tiles', 3) },
      { title: 'ref.dominoes.play', items: lines('ref.dominoes.play', 4) },
      { title: 'ref.dominoes.bonus', items: lines('ref.dominoes.bonus', 3) },
      { title: 'ref.dominoes.conventions', items: lines('ref.dominoes.conventions', 4) },
      { title: 'ref.dominoes.terms', items: lines('ref.dominoes.terms', 6) },
      { title: 'ref.dominoes.presets', items: lines('ref.dominoes.presets', 4) },
      { title: 'ref.dominoes.ask', items: lines('ref.dominoes.ask', 5) },
      { title: 'ref.dominoes.fives', items: lines('ref.dominoes.fives', 5) },
      { title: 'ref.dominoes.cuban', items: lines('ref.dominoes.cuban', 5) },
      { title: 'ref.dominoes.levels', items: DOMINOES_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('dominoes.rating', { n: l.rating })}): ${tDynamic(`dominoes.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      // On by default and not training: the layout is in view of everyone at a real table. Lessons and drills that ask for the count pass no helps, so it stays hidden there.
      { id: 'count', label: 'dominoes.help.count', on: true, training: false },
      { id: 'tilesOut', label: 'dominoes.help.tilesOut', on: false, training: true },
      { id: 'cantHave', label: 'dominoes.help.cantHave', on: false, training: true },
      { id: 'pips', label: 'dominoes.help.pips', on: false, training: true },
      { id: 'scoring', label: 'dominoes.help.scoring', on: false, training: true },
      { id: 'openHand', label: 'dominoes.help.openHand', on: false, training: true },
    ],
    Panel: DominoesCoachPanel,
  },
  review: {
    analyse: analyseDominoesGame,
    configAt: (state) => ({ ...state.config, start: dominoes.codec.state.toText(state) }),
  },
  options: dominoesOptions,
};
