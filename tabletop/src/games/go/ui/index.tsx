import { isJsonObject } from '../../../core/json';
import type { Outcome } from '../../../core/contract';
import { t, tCount, tDynamic } from '../../../text';
import type { CoachWarning, GameUi, ReferenceSection } from '../../types';
import { NO_OVERLAY } from '../../types';
import { Board } from '../board';
import { pointName } from '../coords';
import { GO_LEVELS } from '../levels';
import { analyseGoGame } from '../review';
import type { GoAction, GoConfig, GoEvent, GoState, GoView } from '../rules';
import { configAt, countState, go, PRESET_IDS, PRESETS } from '../rules';
import { compensationFor } from '../score';
import { readSgf, writeSgf } from '../sgf';
import { GoCoachPanel } from './CoachPanel';
import { GoSeatExtra, GoSeatMark, GoSurface, marginText } from './GoSurface';
import { GoReviewInsight } from './ReviewInsight';
import { GoRulesPicker, rulesSummary } from './RulesPicker';

function lastLiberties(state: GoState): string {
  if (state.last < 0 || state.board[state.last] === '.') return '—';
  const board = Board.fromText(state.size, state.board);
  return String(board.libertyCount(board.fromPoint(state.last)));
}

function warningText(reason: string, reply: string): string {
  if (reason === 'gets-captured') return t('go.warn.gets-captured', { point: reply });
  if (reason === 'gets-atari') return t('go.warn.gets-atari', { point: reply });
  return t('go.warn.loses-ground', { point: reply });
}

export const goUi: GameUi<GoState, GoAction, GoConfig, GoView, GoEvent> = {
  def: go,
  levels: GO_LEVELS,
  levelBlurb: (level) => tDynamic(`go.level.${level}`),
  layout: 'board',
  Surface: GoSurface,
  SeatMark: GoSeatMark,
  SeatExtra: GoSeatExtra,
  sides: [
    { id: 'black', label: 'go.side.black', seat: 0 },
    { id: 'white', label: 'go.side.white', seat: 1 },
    { id: 'either', label: 'play.side.either', seat: 'either' },
  ],
  sideName: (seat) => (seat === 0 ? t('go.black.title') : t('go.white.title')),
  movePrefix: (seat) => (seat === 0 ? t('go.prefix.black') : t('go.prefix.white')),
  eventDuration: (event) => (event.type === 'place' ? (event.captured.length > 0 ? 260 : 170) : 0),
  describeEvent(event) {
    switch (event.type) {
      case 'place':
        if (event.handicap) return t('go.log.handicap', { point: event.name });
        return event.captured.length > 0 ? tCount('go.log.takes', event.captured.length, { point: event.name }) : event.name;
      case 'pass':
        return t('go.log.pass');
      case 'atari':
        return t('go.log.atari');
      case 'scoring':
        return t('go.log.scoring');
      case 'mark':
        return t(event.dead ? 'go.log.dead' : 'go.log.alive', { point: event.name });
      case 'agree':
        return t('go.log.agree');
      case 'resume':
        return t('go.log.resume');
      case 'end': {
        const r = event.result;
        if (r.kind === 'score' || r.kind === 'captures') return marginText(r.black, r.white);
        if (r.kind === 'capture') return r.winner === 0 ? t('go.log.end.capture.black') : t('go.log.end.capture.white');
        return t('go.log.end.no-result');
      }
    }
  },
  counters(state) {
    const rows = [
      { label: t('go.counter.prisoners'), value: `${state.prisoners[0]} · ${state.prisoners[1]}` },
      { label: t('go.counter.liberties'), value: lastLiberties(state) },
    ];
    if (state.rules.captureTarget > 0) rows.push({ label: t('go.counter.target'), value: String(state.rules.captureTarget) });
    else rows.push({ label: t('go.counter.komi'), value: String(state.rules.komi + compensationFor(state.rules.compensation, state.handicap)) });
    if (state.ko >= 0) rows.push({ label: t('go.counter.ko'), value: pointName(state.ko, state.size) });
    if (state.phase === 'scoring' || state.result?.kind === 'score') {
      const c = countState(state);
      rows.push({ label: t('go.counter.count'), value: `${c.black} · ${c.white}` });
    }
    rows.push({ label: t('go.counter.moves'), value: String(state.moveNumber) });
    return rows;
  },
  sound: (event) => (event.type === 'place' ? (event.captured.length > 0 ? 'capture' : 'place') : event.type === 'end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const presets = PRESET_IDS.map((id) => `${tDynamic(`go.preset.${id}`)}: ${rulesSummary(PRESETS[id])}`);
    return [
      { title: 'ref.go.basics', items: [t('ref.go.basics.1'), t('ref.go.basics.2'), t('ref.go.basics.3'), t('ref.go.basics.4'), t('ref.go.basics.5')] },
      { title: 'ref.go.ko', items: [t('ref.go.ko.1'), t('ref.go.ko.2')] },
      { title: 'ref.go.end', items: [t('ref.go.end.1'), t('ref.go.end.2'), t('ref.go.end.3'), t('ref.go.end.4'), t('ref.go.end.5')] },
      { title: 'ref.go.handicap', items: [t('ref.go.handicap.1'), t('ref.go.handicap.2'), t('ref.go.handicap.3')] },
      { title: 'ref.go.presets', items: presets },
      { title: 'ref.go.ask', items: [t('ref.go.ask.1'), t('ref.go.ask.2'), t('ref.go.ask.3'), t('ref.go.ask.4'), t('ref.go.ask.5')] },
      { title: 'ref.go.terms', items: [t('ref.go.terms.1'), t('ref.go.terms.2'), t('ref.go.terms.3'), t('ref.go.terms.4')] },
      { title: 'ref.go.levels', items: GO_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('go.rating', { n: l.rating })}): ${tDynamic(`go.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'confirm', label: 'go.help.confirm', on: false, training: false },
      { id: 'count', label: 'go.help.count', on: true, training: false },
      { id: 'liberties', label: 'go.help.liberties', on: false, training: true },
      { id: 'atari', label: 'go.help.atari', on: false, training: true },
      { id: 'territory', label: 'go.help.territory', on: false, training: true },
      { id: 'blunder', label: 'go.help.blunder', on: false, training: true },
    ],
    Panel: GoCoachPanel,
    async checkMove(ask, before, action): Promise<CoachWarning | null> {
      if (action.type !== 'play' || before.phase !== 'play') return null;
      const answer = await ask({ type: 'check-move', move: action.at }, before);
      if (!isJsonObject(answer) || answer.warn !== true) return null;
      const reply = isJsonObject(answer.reply) ? answer.reply : null;
      const name = typeof reply?.name === 'string' ? reply.name : '';
      const at = typeof reply?.move === 'string' ? reply.move : '';
      return {
        text: warningText(typeof answer.reason === 'string' ? answer.reason : '', name),
        overlay: at ? { arrows: [{ from: at, to: at, tone: 'threat' }], marks: [] } : NO_OVERLAY,
      };
    },
  },
  clocks: [
    { id: 'none', label: 'clock.none', initialMs: 0, incrementMs: 0 },
    { id: '10+5', label: 'go.clock.10-5', initialMs: 10 * 60_000, incrementMs: 5_000 },
    { id: '20+10', label: 'go.clock.20-10', initialMs: 20 * 60_000, incrementMs: 10_000 },
  ],
  timeoutOutcome(_state, seat): Outcome {
    const other = seat === 0 ? 1 : 0;
    return { reason: 'timeout', results: [{ seat: other, place: 1, score: 1 }, { seat, place: 2, score: 0 }] };
  },
  exportRecord: { extension: 'sgf', mime: 'application/x-go-sgf', write: (record, names) => writeSgf(record, names) },
  review: { analyse: analyseGoGame, configAt, Insight: GoReviewInsight },
  moveSquares: (action) => (action.type === 'play' ? { from: action.at, to: action.at } : null),
  importRecord: { accept: '.sgf,application/x-go-sgf,text/plain', read: readSgf },
  rules: { Picker: GoRulesPicker },
};
