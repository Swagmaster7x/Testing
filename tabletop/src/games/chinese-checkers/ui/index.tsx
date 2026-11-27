import type { Seat } from '../../../core/contract';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachWarning, GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { NO_OVERLAY } from '../../types';
import { createRng } from '../../../core/rng';
import { HOLES, holeCode, holeName, NEIGHBOUR, POINT_HOLES } from '../board';
import { marblesHome } from '../engine';
import { CC_LEVELS } from '../levels';
import { analyseCcGame } from '../review';
import type { CcAction, CcConfig, CcEvent, CcRules, CcState, CcView } from '../rules';
import { boardArray, chineseCheckers, configAt, DEFAULT_CONFIG, layoutOf, makeConfig, MARBLE_COUNTS, PRESET_IDS, PRESETS, rowsLeft, TURN_LIMITS } from '../rules';
import { CcCoachPanel } from './CoachPanel';
import { CcSeatMark, CcSurface, seatColour } from './CcSurface';

const FIELDS: readonly { key: 'players' | 'marbles' | keyof CcRules; values: readonly (string | number)[] }[] = [
  { key: 'players', values: [2, 3, 4, 6] },
  { key: 'marbles', values: MARBLE_COUNTS },
  { key: 'jumps', values: ['adjacent', 'long'] },
  { key: 'stop', values: ['anywhere', 'pass-through', 'never'] },
  { key: 'home', values: ['stay', 'free', 'frozen'] },
  { key: 'finish', values: ['filled', 'own'] },
  { key: 'end', values: ['places', 'first'] },
  { key: 'limit', values: TURN_LIMITS },
];

export const ccOptions: GameOptions<CcConfig> = {
  presets: PRESET_IDS.map((id) => ({ id, label: tDynamic(`cc.preset.${id}`), config: PRESETS[id] })),
  fields: FIELDS.map(
    (f): OptionField => ({
      key: f.key,
      label: tDynamic(`cc.option.${f.key}`),
      choices: f.values.map((value) => ({ value, label: tDynamic(`cc.option.${f.key}.${value}`) })),
    }),
  ),
  get: (config, key) => (key === 'players' ? config.players : key === 'marbles' ? config.marbles : (config.rules[key as keyof CcRules])),
  set(config, key, value) {
    // Fifteen marbles are for two players only: choosing one fixes the other.
    if (key === 'players') return makeConfig(Number(value), Number(value) === 2 ? config.marbles : 10, config.rules);
    if (key === 'marbles') return makeConfig(Number(value) === 15 ? 2 : config.players, Number(value), config.rules);
    return makeConfig(config.players, config.marbles, { ...config.rules, [key]: value });
  },
};

const placeWord = (place: number) => tDynamic(`cc.place.${place}`);

function warningText(reason: string, move: string): string {
  if (reason === 'misses-finish') return t('cc.warn.misses-finish', { move });
  if (reason === 'leaves-behind') return t('cc.warn.leaves-behind', { move });
  return t('cc.warn.slower', { move });
}

export const ccUi: GameUi<CcState, CcAction, CcConfig, CcView, CcEvent> = {
  def: chineseCheckers,
  levels: CC_LEVELS,
  levelBlurb: (level) => tDynamic(`cc.level.${level}`),
  layout: 'board',
  Surface: CcSurface,
  SeatMark: CcSeatMark,
  SeatExtra({ state, seat }) {
    const place = state.done.indexOf(seat);
    return <span className="cc-seat-extra num">{place >= 0 ? t('cc.seat.done', { place: placeWord(place + 1) }) : t('cc.seat.home', { n: marblesHome(boardArray(state.board), seat, layoutOf(state)) })}</span>;
  },
  sides: [
    { id: 'red', label: 'cc.side.red', seat: 0 },
    { id: 'blue', label: 'cc.side.blue', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: seatColour,
  movePrefix: (seat, _mySeats, seats) => ((seats ?? 2) > 2 ? seatColour(seat) : seatColour(seat).slice(0, 1)),
  playerName: (seat, mySeats) => (mySeats.includes(seat) ? t('cc.you') : seatColour(seat)),
  moveText: (action) => (action.type === 'pass' ? t('cc.pass') : `${holeName(action.from)}–${holeName(action.to)}`),
  eventDuration(event) {
    switch (event.type) {
      case 'move':
        return Math.min(1_400, 160 + 170 * Math.max(1, event.path.length - 1));
      case 'pass':
        return 500;
      case 'finish':
        return 700;
      default:
        return 0;
    }
  },
  describeEvent(event) {
    switch (event.type) {
      case 'move': {
        const from = holeName(event.from);
        const to = holeName(event.to);
        const hops = event.path.length - 1;
        if (event.path.length === 2 && isNeighbour(event.from, event.to)) return t('cc.log.step', { from, to });
        return hops === 1 ? t('cc.log.hop.one', { from, to }) : t('cc.log.hop.other', { n: hops, from, to });
      }
      case 'pass':
        return t('cc.log.pass');
      case 'finish':
        return t('cc.log.finish', { colour: seatColour(event.seat), place: placeWord(event.place) });
      case 'end':
        return tDynamic(`cc.log.end.${event.reason}`);
    }
  },
  counters(state, mySeats) {
    const board = boardArray(state.board);
    const layout = layoutOf(state);
    const me: Seat = mySeats[0] ?? 0;
    const rows = [{ label: t('cc.counter.round'), value: t('cc.counter.round.value', { n: Math.min(state.round, state.rules.limit), limit: state.rules.limit }) }];
    // With more players each one's marbles home are in the player list instead.
    if (state.players === 2) rows.push({ label: t('cc.counter.home'), value: [me, 1 - me].map((s) => String(marblesHome(board, s, layout))).join(' · ') });
    // The finishing order, by colour initial so a long one still fits beside its label.
    if (state.done.length > 0) rows.push({ label: t('cc.counter.finished'), value: state.done.map((s) => (state.done.length > 2 ? seatColour(s).slice(0, 1) : seatColour(s))).join(', ') });
    return rows;
  },
  sound: (event) => (event.type === 'move' ? 'place' : event.type === 'end' ? 'end' : event.type === 'finish' ? 'line' : null),
  reference(): readonly ReferenceSection[] {
    const lines = (key: string, count: number, params?: Record<string, number>) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`, params));
    const layout = layoutOf(DEFAULT_CONFIG);
    const start = rowsLeft(chineseCheckers.setup(DEFAULT_CONFIG, createRng('reference')))[0] ?? 0;
    const numbers = { holes: HOLES, middle: HOLES - 6 * POINT_HOLES, point: POINT_HOLES, first: 1, tip: 17, base: layout.rowBase, start };
    return [
      { title: 'ref.cc.board', items: lines('ref.cc.board', 4, numbers) },
      { title: 'ref.cc.moves', items: lines('ref.cc.moves', 4) },
      { title: 'ref.cc.finish', items: lines('ref.cc.finish', 4, numbers) },
      { title: 'ref.cc.presets', items: PRESET_IDS.map((id) => `${tDynamic(`cc.preset.${id}`)}: ${presetSummary(PRESETS[id])}`) },
      { title: 'ref.cc.ask', items: lines('ref.cc.ask', 7) },
      { title: 'ref.cc.terms', items: lines('ref.cc.terms', 5) },
      { title: 'ref.cc.levels', items: CC_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('cc.rating', { n: l.rating })}): ${tDynamic(`cc.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'reach', label: 'cc.help.reach', on: true, training: false },
      { id: 'race', label: 'cc.help.race', on: false, training: true },
      { id: 'blunder', label: 'cc.help.blunder', on: false, training: true },
    ],
    Panel: CcCoachPanel,
    async checkMove(ask, before, action): Promise<CoachWarning | null> {
      if (action.type !== 'move') return null;
      const answer = await ask({ type: 'check-move', move: chineseCheckers.codec.action.toJSON(action) }, before);
      if (!isJsonObject(answer) || answer.warn !== true) return null;
      const better = isJsonObject(answer.better) ? answer.better : null;
      const name = typeof better?.name === 'string' ? better.name : '';
      const from = typeof better?.from === 'string' ? better.from : '';
      const to = typeof better?.to === 'string' ? better.to : '';
      return { text: warningText(typeof answer.reason === 'string' ? answer.reason : '', name), overlay: from && to ? { arrows: [{ from, to, tone: 'hint' }], marks: [] } : NO_OVERLAY };
    },
  },
  review: { analyse: analyseCcGame, configAt },
  options: ccOptions,
  moveSquares: (action) => (action.type === 'move' ? { from: holeCode(action.from), to: holeCode(action.to) } : null),
};

function isNeighbour(a: number, b: number): boolean {
  for (let d = 0; d < 6; d++) if (NEIGHBOUR[a * 6 + d] === b) return true;
  return false;
}

/** A preset in a few words: players, marbles and the rules that differ from the standard. */
export function presetSummary(config: CcConfig): string {
  const parts = [tDynamic(`cc.option.players.${config.players}`), tDynamic(`cc.option.marbles.${config.marbles}`)];
  for (const f of FIELDS) {
    if (f.key === 'players' || f.key === 'marbles') continue;
    const value = config.rules[f.key];
    if (value !== DEFAULT_CONFIG.rules[f.key]) parts.push(`${tDynamic(`cc.option.${f.key}`)}: ${tDynamic(`cc.option.${f.key}.${value}`)}`);
  }
  return parts.join(', ');
}
