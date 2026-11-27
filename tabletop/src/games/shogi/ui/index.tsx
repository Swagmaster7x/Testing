/** Shogi at the table: board, hands, coach, counters, reference card, files and review. */
import type { Outcome, Seat } from '../../../core/contract';
import { isJsonObject } from '../../../core/json';
import type { MessageKey } from '../../../text';
import { t, tDynamic } from '../../../text';
import type { CoachWarning, GameUi, ReferenceSection, SetupPreset } from '../../types';
import { NO_OVERLAY } from '../../types';
import { GEOMETRY } from '../core';
import { canWriteCsa, readGameFile, writeCsa, writeKif, writeUsi } from '../formats';
import { SHOGI_LEVELS } from '../levels';
import type { ShogiConfig } from '../presets';
import { DECLARE_BLACK, DECLARE_PIECES, DECLARE_WHITE, HANDICAPS, IMPASSE_24, IMPASSE_BIG, IMPASSE_SMALL, POINTS_PER_RANK, PRESETS, REPETITIONS } from '../presets';
import { analyseShogiGame } from '../review';
import type { ShogiAction, ShogiEvent, ShogiState, ShogiView } from '../rules';
import { canonicalAction, checksInARow, handOf, impassePoints, material, PIECE_NAMES, positionOf, repetitionCount, shogi, TEACHING_VALUE } from '../rules';
import { ShogiCoachPanel } from './CoachPanel';
import { MARKS_HELP } from './look';
import { pieceWord, ShogiSeatMark, ShogiSurface } from './ShogiSurface';
import './shogi.css';

const PIECE_KEY: Record<string, MessageKey> = Object.fromEntries(PIECE_NAMES.map((name) => [name, `shogi.piece.${name}` as MessageKey]));

function warningText(reason: string, mateIn: number, reply: string): string {
  let main: string;
  if (reason === 'allows-mate') main = t('coach.warn.allows-mate', { n: mateIn });
  else if (reason.startsWith('hangs-')) main = t('coach.warn.hangs', { piece: t(PIECE_KEY[reason.slice(6)] ?? 'shogi.piece.pawn') });
  else main = t('coach.warn.loses-ground');
  return reply ? `${main} ${t('coach.warn.reply', { move: reply })}` : main;
}

/** The handicap's worth in rating points, for the level a handicap game plays like. */
function presetOffset(config: ShogiConfig): number {
  const h = HANDICAPS.find((x) => x.board === (config.board ?? 'standard') && x.id === (config.handicap ?? 'even'));
  return h ? Math.round(h.ranks * POINTS_PER_RANK) : 0;
}

const SETUP_PRESETS: readonly SetupPreset<ShogiConfig>[] = PRESETS.map((p) => {
  const handicap = p.config.handicap;
  const detail = handicap
    ? t('shogi.preset.handicap.detail', { pieces: t(`shogi.handicap.${handicap}` as MessageKey), ranks: HANDICAPS.find((h) => h.id === handicap)?.ranks ?? 0 })
    : tDynamic(`shogi.preset.${p.id}.detail`);
  return { id: p.id, label: t(`shogi.preset.${p.id}` as MessageKey), detail, config: p.config, ratingOffset: presetOffset(p.config) };
});

export const shogiUi: GameUi<ShogiState, ShogiAction, ShogiConfig, ShogiView, ShogiEvent> = {
  def: shogi,
  levels: SHOGI_LEVELS,
  levelBlurb: (level) => tDynamic(`shogi.level.${level}`),
  layout: 'board',
  Surface: ShogiSurface,
  SeatMark: ShogiSeatMark,
  sides: [
    { id: 'black', label: 'shogi.side.black', seat: 0 },
    { id: 'white', label: 'shogi.side.white', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => (seat === 0 ? t('shogi.side.black.detail') : t('shogi.side.white.detail')),
  movePrefix: (seat) => (seat === 0 ? '▲' : '△'),
  eventDuration: (event) => (event.type === 'move' ? 230 : event.type === 'drop' ? 160 : 0),
  describeEvent(event) {
    switch (event.type) {
      case 'move':
      case 'drop':
        return event.text;
      case 'check':
        return t('shogi.log.check');
      case 'declare':
        return t('shogi.log.declare');
      case 'end':
        return tDynamic(`shogi.log.end.${event.result.kind}`);
    }
  },
  counters(state) {
    const p = positionOf(state.sfen);
    const m = material(state);
    const inHand = (seat: 0 | 1) => handOf(state, seat).reduce((n, h) => n + h.count, 0);
    const rows = [
      { label: t('shogi.counter.material'), value: `${m[0]} · ${m[1]}` },
      { label: t('shogi.counter.hand'), value: `${inHand(0)} · ${inHand(1)}` },
      { label: t('shogi.counter.repetition'), value: t('shogi.counter.of', { n: repetitionCount(state), total: REPETITIONS }) },
      { label: t('shogi.counter.checks'), value: String(checksInARow(state)) },
    ];
    if (state.rules.board === 'standard') {
      rows.splice(2, 0, { label: t('shogi.counter.impasse'), value: `${impassePoints(p, 0, state.rules)} · ${impassePoints(p, 1, state.rules)}` });
    }
    return rows;
  },
  sound: (event) => (event.type === 'move' ? (event.captured ? 'capture' : 'place') : event.type === 'drop' ? 'place' : event.type === 'end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const values = (['pawn', 'lance', 'knight', 'silver', 'gold', 'bishop', 'rook', 'tokin', 'horse', 'dragon'] as const).map((name) => `${pieceWord(PIECE_NAMES.indexOf(name))} ${TEACHING_VALUE[PIECE_NAMES.indexOf(name)]}`).join(', ');
    return [
      { title: 'ref.shogi.pieces', items: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => tDynamic(`ref.shogi.pieces.${i}`)) },
      {
        title: 'ref.shogi.promotion',
        items: [t('ref.shogi.promotion.1', { zone: GEOMETRY.standard.zone, miniZone: GEOMETRY.mini.zone }), t('ref.shogi.promotion.2'), t('ref.shogi.promotion.3'), t('ref.shogi.promotion.4')],
      },
      { title: 'ref.shogi.drops', items: [1, 2, 3, 4].map((i) => tDynamic(`ref.shogi.drops.${i}`)) },
      { title: 'ref.shogi.end', items: [t('ref.shogi.end.1'), t('ref.shogi.end.2', { n: REPETITIONS }), t('ref.shogi.end.3'), t('ref.shogi.end.4'), t('ref.shogi.end.5')] },
      {
        title: 'ref.shogi.impasse',
        items: [
          t('ref.shogi.impasse.1', { big: IMPASSE_BIG, small: IMPASSE_SMALL, start: 2 * IMPASSE_BIG + 17 * IMPASSE_SMALL }),
          t('ref.shogi.impasse.2', { count: IMPASSE_24 }),
          t('ref.shogi.impasse.3', { pieces: DECLARE_PIECES, black: DECLARE_BLACK, white: DECLARE_WHITE }),
          t('ref.shogi.impasse.4'),
          t('ref.shogi.impasse.5'),
        ],
      },
      { title: 'ref.shogi.presets', items: SETUP_PRESETS.map((p) => t('ref.shogi.preset', { name: p.label, detail: p.detail ?? '' })) },
      { title: 'ref.shogi.notation', items: [1, 2, 3, 4].map((i) => tDynamic(`ref.shogi.notation.${i}`)) },
      { title: 'ref.shogi.terms', items: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => tDynamic(`ref.shogi.terms.${i}`)) },
      { title: 'ref.shogi.values', items: [t('ref.shogi.values.1', { list: values }), t('ref.shogi.values.2')] },
      { title: 'ref.shogi.ask', items: [1, 2, 3, 4, 5, 6].map((i) => tDynamic(`ref.shogi.ask.${i}`)) },
      { title: 'ref.shogi.levels', items: SHOGI_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('shogi.rating', { n: l.rating })}): ${tDynamic(`shogi.level.${l.level}`)}`) },
    ];
  },
  flipForSeat: (seat) => seat === 1,
  coach: {
    helps: [
      { id: 'legal', label: 'coach.help.legal', on: true, training: false },
      { id: MARKS_HELP, label: 'shogi.help.marks', on: false, training: false },
      { id: 'blunder', label: 'coach.help.blunder', on: false, training: true },
      { id: 'threats', label: 'coach.help.threats', on: false, training: true },
      { id: 'eval', label: 'coach.help.eval', on: false, training: true },
    ],
    Panel: ShogiCoachPanel,
    async checkMove(ask, before, action): Promise<CoachWarning | null> {
      if (action.type === 'declare') return null;
      const answer = await ask({ type: 'check-move', move: canonicalAction(action) }, before);
      if (!isJsonObject(answer) || answer.warn !== true) return null;
      const reply = isJsonObject(answer.reply) ? answer.reply : null;
      const text = typeof reply?.text === 'string' ? reply.text : '';
      const from = typeof reply?.from === 'string' ? reply.from : typeof reply?.drop === 'string' ? `${reply.drop}*` : '';
      const to = typeof reply?.to === 'string' ? reply.to : '';
      return {
        text: warningText(typeof answer.reason === 'string' ? answer.reason : '', typeof answer.mateIn === 'number' ? answer.mateIn : 0, text),
        overlay: from && to ? { arrows: [{ from, to, tone: 'threat' }], marks: [] } : NO_OVERLAY,
      };
    },
  },
  clocks: [
    { id: 'none', label: 'clock.none', initialMs: 0, incrementMs: 0 },
    { id: '10', label: 'clock.10', initialMs: 10 * 60_000, incrementMs: 0 },
    { id: '15+10', label: 'clock.15-10', initialMs: 15 * 60_000, incrementMs: 10_000 },
  ],
  timeoutOutcome(_state, seat: Seat): Outcome {
    // Shogi has no "cannot mate" draw: running out of time loses.
    const other: Seat = seat === 0 ? 1 : 0;
    return { reason: 'timeout', results: [{ seat: other, place: 1, score: 1 }, { seat, place: 2, score: 0 }] };
  },
  exportRecord: { extension: 'kifu', mime: 'text/plain', write: writeKif },
  moreExports: [
    { extension: 'csa', mime: 'text/plain', write: writeCsa, canWrite: canWriteCsa },
    { extension: 'sfen', mime: 'text/plain', write: (record) => writeUsi(record, true) },
  ],
  review: {
    analyse: analyseShogiGame,
    configAt: (state) => ({
      position: state.sfen,
      ...(state.rules.impasse !== 'declare-27' ? { impasse: state.rules.impasse } : {}),
      ...(state.rules.handicap !== 'even' ? { handicap: state.rules.handicap } : {}),
    }),
  },
  moveSquares: (action) => (action.type === 'move' ? { from: action.from, to: action.to } : action.type === 'drop' ? { from: `${action.piece}*`, to: action.to } : null),
  importRecord: {
    accept: '.kifu,.kif,.ki2,.csa,.jkf,.usi,.sfen,.txt,text/plain',
    read: (text) => readGameFile(text, { encoding: t('shogi.files.encoding'), unknown: t('shogi.files.unknown') }),
  },
  presets: SETUP_PRESETS,
  replayConfig: (config) => {
    const { position: _position, ...rest } = config;
    return rest;
  },
};
