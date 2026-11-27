import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { DOMINOES_LEVELS } from '../bots';
import { analyseDominoesGame } from '../review';
import type { DominoesAction, DominoesConfig, DominoesEvent, DominoesState, DominoesView } from '../rules';
import { CONFIG_CHOICES, dominoes, PRESETS, seatCount, sideOf } from '../rules';
import { DominoesCoachPanel } from './CoachPanel';
import { DominoesSeatMark, DominoesSurface } from './DominoesSurface';
import { seatName, tileLabel, whoName } from './names';

const FIELDS: readonly (keyof typeof CONFIG_CHOICES)[] = ['mode', 'target', 'scoring', 'blockedScore', 'blockedWinner', 'blockedTie', 'firstLead', 'nextLead', 'earlyBonus', 'capicu', 'chuchazo', 'chuchazoEnds', 'passBonus', 'redeal', 'drawLimit'];

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

export const dominoesUi: GameUi<DominoesState, DominoesAction, DominoesConfig, DominoesView, DominoesEvent> = {
  def: dominoes,
  levels: DOMINOES_LEVELS,
  levelBlurb: (level) => tDynamic(`dominoes.level.${level}`),
  layout: 'table',
  Surface: DominoesSurface,
  SeatMark: DominoesSeatMark,
  sides: [{ id: 'you', label: 'dominoes.side.you', seat: 0 }],
  sideName: (seat) => tDynamic(`dominoes.seat.${seat}`),
  movePrefix: (seat, mySeats, seats) => seatName(seat, me(mySeats), seats ?? 4),
  playerName: (seat, mySeats, seats) => seatName(seat, me(mySeats), seats),
  moveText: (action) => {
    if (action.type !== 'play') return t(`dominoes.move.${action.type}`);
    const tile = tileLabel(action.tile);
    return action.end === 'left' ? `← ${tile}` : action.end === 'right' ? `${tile} →` : tile;
  },
  eventDuration(event) {
    switch (event.type) {
      case 'play':
        return 420;
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
  describeEvent(event, mySeats, seats) {
    const m = me(mySeats);
    const n = seats ?? 4;
    switch (event.type) {
      case 'play':
        return t(event.end === null ? 'dominoes.log.play.first' : 'dominoes.log.play', { tile: tileLabel(event.tile), end: event.end === 'left' ? t('dominoes.log.left') : t('dominoes.log.right') });
      case 'pass':
        return t('dominoes.log.pass', { a: event.ends[0], b: event.ends[1] });
      case 'draw':
        return event.seat === m ? t('dominoes.log.draw.you', { tile: tileLabel(event.tile) }) : t('dominoes.log.draw.other');
      case 'deal':
        return event.mustLead
          ? t('dominoes.log.deal.must', { n: event.handNo + 1, who: whoName(event.leader, m, n), tile: tileLabel(event.mustLead) })
          : t('dominoes.log.deal', { n: event.handNo + 1, who: whoName(event.leader, m, n) });
      case 'bonus':
        return tDynamic(`dominoes.log.bonus.${event.bonus.kind}`, { points: event.bonus.points });
      case 'hand-end': {
        const r = event.result;
        const side = r.winner === null ? '' : r.winner === sideOf(m, n) ? t('dominoes.side.us') : t('dominoes.side.them');
        if (r.winner === null) return t('dominoes.log.hand-end.tie');
        return t(r.reason === 'domino' ? 'dominoes.log.hand-end.domino' : 'dominoes.log.hand-end.block', { who: whoName(r.by, m, n), side, n: r.points[r.winner] ?? 0 });
      }
      case 'match-end':
        return t('dominoes.log.match-end');
    }
  },
  counters(state, mySeats) {
    const m = me(mySeats);
    const n = seatCount(state.config);
    const us = sideOf(m, n);
    const rows = [
      { label: n === 4 ? t('dominoes.counter.score') : t('dominoes.counter.score.two'), value: `${state.scores[us] ?? 0} · ${state.scores[1 - us] ?? 0}` },
      { label: t('dominoes.counter.target'), value: state.config.target > 0 ? String(state.config.target) : t('dominoes.counter.target.hand') },
      { label: t('dominoes.counter.hand'), value: String(state.handNo + 1) },
    ];
    if (state.config.mode === 'draw') rows.push({ label: t('dominoes.counter.boneyard'), value: String(state.boneyard.length) });
    return rows;
  },
  sound: (event) => (event.type === 'play' ? 'tile' : event.type === 'draw' ? 'tile' : event.type === 'deal' ? 'shuffle' : event.type === 'match-end' ? 'end' : null),
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
      { title: 'ref.dominoes.levels', items: DOMINOES_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('dominoes.rating', { n: l.rating })}): ${tDynamic(`dominoes.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'tilesOut', label: 'dominoes.help.tilesOut', on: false, training: true },
      { id: 'cantHave', label: 'dominoes.help.cantHave', on: false, training: true },
      { id: 'pips', label: 'dominoes.help.pips', on: false, training: true },
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
