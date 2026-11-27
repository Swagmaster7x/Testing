import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { MAHJONG_LEVELS, playStyleOf } from '../bots';
import type { MahjongAction, MahjongConfig, MahjongEvent, MahjongState, MahjongView } from '../rules';
import { DEFAULT_CONFIG, mahjong, STYLES } from '../rules';
import { analyseMahjongGame } from '../review';
import { seatWind } from '../core/engine';
import { kindOf } from '../core/tiles';
import { HK_OPTIONS, HK_PRESETS } from '../styles/hong-kong';
import { MahjongCoachPanel } from './CoachPanel';
import { MahjongSeatMark, MahjongSurface } from './MahjongSurface';
import { kindName, moveName, runName, seatName, tileName, whoName, windName } from './names';

export const mahjongOptions: GameOptions<MahjongConfig> = {
  presets: HK_PRESETS.map((p) => ({ id: p.id, label: tDynamic(`mahjong.preset.${p.id}`), config: { style: 'hong-kong', options: p.options } })),
  fields: HK_OPTIONS.map(
    (spec): OptionField => ({
      key: spec.key,
      label: tDynamic(`mahjong.option.${spec.key}`),
      choices: spec.values.map((value) => ({ value, label: tDynamic(`mahjong.option.${spec.key}.${value}`) })),
    }),
  ),
  get: (config, key) => config.options[key] ?? DEFAULT_CONFIG.options[key] ?? '',
  set: (config, key, value) => ({ style: config.style, options: { ...config.options, [key]: value } }),
};

const me = (mySeats: readonly Seat[] | undefined): Seat => (mySeats ?? [0])[0] ?? 0;

export const mahjongUi: GameUi<MahjongState, MahjongAction, MahjongConfig, MahjongView, MahjongEvent> = {
  def: mahjong,
  levels: MAHJONG_LEVELS,
  levelBlurb: (level) => tDynamic(`mahjong.level.${level}`),
  layout: 'table',
  Surface: MahjongSurface,
  SeatMark: MahjongSeatMark,
  sides: [{ id: 'you', label: 'mahjong.side.you', seat: 0 }],
  sideName: (seat) => tDynamic(`mahjong.seat.${seat}`),
  movePrefix: (seat, mySeats) => seatName(seat, me(mySeats)),
  playerName: (seat, mySeats) => seatName(seat, me(mySeats)),
  moveText: (action) => moveName(action),
  // Choices made in a claim window are secret until it closes; passes and "next hand" are noise.
  moveVisible: (action, seat, mySeats) => {
    if (action.type === 'pass' || action.type === 'next') return false;
    if (action.type === 'pung' || action.type === 'chow' || (action.type === 'kong' && action.tile === undefined)) return mySeats.includes(seat);
    return true;
  },
  shownTurn: (state, mySeats) => ((state.phase === 'claim' || state.phase === 'rob') && !mySeats.includes(state.turn) ? null : state.over ? null : state.turn),
  eventSeat: (event) => {
    switch (event.type) {
      case 'discard':
      case 'call':
      case 'kong':
      case 'bonus':
      case 'draw':
        return event.seat;
      case 'win':
        return event.win.seat;
      default:
        return null;
    }
  },
  eventDuration(event) {
    switch (event.type) {
      case 'deal':
        return 700;
      case 'bonus':
        return 320;
      case 'draw':
        return 180;
      case 'discard':
        return 520;
      case 'call':
      case 'kong':
        return 650;
      case 'win':
        return 1100;
      case 'exhausted':
      case 'abort':
        return 900;
      case 'ready':
        return 700;
      case 'indicator':
        return 450;
      case 'hand-end':
        return 600;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats) {
    const m = me(mySeats);
    switch (event.type) {
      case 'deal':
        return t('mahjong.log.deal', { n: event.handNo + 1, round: windName(event.round), who: whoName(event.dealer, m) });
      case 'bonus':
        return t('mahjong.log.bonus', { who: whoName(event.seat, m), tile: tileName(event.tile) });
      case 'draw':
        if (event.seat !== m) return null;
        return t(event.from === 'back' ? 'mahjong.log.draw.back' : 'mahjong.log.draw.you', { tile: tileName(event.tile) });
      case 'discard':
        return t('mahjong.log.discard', { who: whoName(event.seat, m), tile: tileName(event.tile) });
      case 'call':
        if (event.call === 'chow') return t('mahjong.log.chow', { who: whoName(event.seat, m), tiles: runName(Math.min(...event.meld.tiles.map(kindOf))) });
        return t(event.call === 'pung' ? 'mahjong.log.pung' : 'mahjong.log.kong-call', { who: whoName(event.seat, m), tile: tileName(event.tile), from: whoName(event.from, m) });
      case 'kong':
        return t(event.added ? 'mahjong.log.kong-added' : 'mahjong.log.kong-concealed', { who: whoName(event.seat, m), tile: tileName(event.meld.tiles[event.meld.tiles.length - 1] ?? '') });
      case 'win': {
        const w = event.win;
        const params = { who: whoName(w.seat, m), from: w.from === null ? '' : whoName(w.from, m), faan: w.score.total };
        return t(w.from === null ? 'mahjong.log.win.self' : w.robbed ? 'mahjong.log.win.robbed' : 'mahjong.log.win.discard', params);
      }
      case 'exhausted':
        return t('mahjong.log.exhausted');
      case 'ready':
        return t('mahjong.log.ready', { who: whoName(event.seat, m), tile: tileName(event.tile) });
      case 'stake':
        return t('mahjong.log.stake', { who: whoName(event.seat, m), n: event.amount });
      case 'indicator':
        return t('mahjong.log.indicator', { tile: tileName(event.tile) });
      case 'abort':
        return tDynamic(`mahjong.log.abort.${event.reason}`, { who: event.seat === null ? '' : whoName(event.seat, m) });
      case 'hand-end':
        return null;
      case 'game-end':
        return t('mahjong.log.game-end');
    }
  },
  counters(state, mySeats) {
    const m = me(mySeats);
    const options = state.config.options;
    const minimum = Number(options.minFaan ?? 0);
    const limit = Number(options.limit ?? 10);
    const order = [0, 1, 2, 3].map((i) => (m + i) % 4);
    return [
      { label: t('mahjong.counter.round'), value: t('mahjong.counter.round.value', { wind: windName(state.round), n: state.handNo + 1 }) },
      { label: t('mahjong.counter.seat'), value: windName(seatWind(m, state.dealer)) },
      { label: t('mahjong.counter.dealer'), value: seatName(state.dealer, m) },
      { label: t('mahjong.counter.wall'), value: String(state.wall.length) },
      { label: t('mahjong.counter.scores'), value: order.map((s) => String(state.scores[s] ?? 0)).join(' · ') },
      { label: t('mahjong.counter.minimum'), value: minimum > 0 ? t('mahjong.counter.minimum.value', { n: minimum, limit }) : t('mahjong.counter.minimum.none', { limit }) },
    ];
  },
  sound: (event) => (event.type === 'discard' || event.type === 'call' || event.type === 'kong' ? 'tile' : event.type === 'deal' ? 'shuffle' : event.type === 'game-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const lines = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.mahjong.tiles', items: lines('ref.mahjong.tiles', 4) },
      { title: 'ref.mahjong.play', items: lines('ref.mahjong.play', 4) },
      { title: 'ref.mahjong.faan', items: lines('ref.mahjong.faan', 6) },
      { title: 'ref.mahjong.pay', items: lines('ref.mahjong.pay', 4) },
      { title: 'ref.mahjong.terms', items: lines('ref.mahjong.terms', 5) },
      { title: 'ref.mahjong.presets', items: lines('ref.mahjong.presets', 4) },
      { title: 'ref.mahjong.ask', items: lines('ref.mahjong.ask', 7) },
      { title: 'ref.mahjong.levels', items: MAHJONG_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('mahjong.rating', { n: l.rating })}): ${tDynamic(`mahjong.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'learner', label: 'mahjong.help.learner', on: true, training: false },
      { id: 'efficiency', label: 'mahjong.help.efficiency', on: false, training: true },
      { id: 'unseen', label: 'mahjong.help.unseen', on: false, training: true },
      { id: 'safety', label: 'mahjong.help.safety', on: false, training: true },
      { id: 'openHand', label: 'mahjong.help.openHand', on: false, training: true },
      // Off, you count each winning hand yourself before the sheet shows: harder, so not training.
      { id: 'autoScore', label: 'mahjong.help.autoScore', on: true, training: false },
    ],
    Panel: MahjongCoachPanel,
  },
  review: {
    analyse: analyseMahjongGame,
    configAt: (state) => ({ style: state.config.style, options: state.config.options, start: mahjong.codec.state.toText(state) }),
  },
  options: mahjongOptions,
  replayConfig: (config) => ({ style: STYLES[config.style] ? config.style : 'hong-kong', options: config.options }),
  resultText(record) {
    const outcome = record.outcome;
    const seat = record.players.findIndex((p) => p.kind === 'human');
    const mine = outcome?.results.find((r) => r.seat === seat);
    if (!outcome || !mine) return null;
    const tied = outcome.results.filter((r) => r.place === mine.place).length > 1;
    const score = mine.score > 0 ? `+${mine.score}` : String(mine.score);
    return t(tied ? 'mahjong.result.finished.tied' : 'mahjong.result.finished', { place: tDynamic(`mahjong.place.${mine.place}`), score });
  },
  revealSeat: (start, record, seat) => (record.players[seat]?.kind === 'bot' ? t('mahjong.reveal', { style: t(`mahjong.style.${playStyleOf(start.table, seat)}`) }) : null),
};

/** Kind names for tests and lessons. */
export { kindName };
