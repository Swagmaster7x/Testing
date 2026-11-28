import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { MAHJONG_LEVELS, playStyleOf } from '../bots';
import type { MahjongAction, MahjongConfig, MahjongEvent, MahjongState, MahjongView } from '../rules';
import { DEFAULT_CONFIG, engine, mahjong, STYLES } from '../rules';
import { analyseMahjongGame } from '../review';
import { seatWind } from '../core/engine';
import { kindOf } from '../core/tiles';
import { HK_OPTIONS, HK_PRESETS } from '../styles/hong-kong';
import { basePoints as riichiBase, COUNTER_VALUE, doraOf, NOTEN_POOL, payments as riichiPayments, RIICHI_PRESETS, STAKE, YAKU_HAN } from '../styles/riichi';
import { CO_BASE, CO_PATTERNS, CO_PRESETS, coFan } from '../styles/chinese-official';
import { MahjongCoachPanel } from './CoachPanel';
import { MahjongSeatMark, MahjongSurface } from './MahjongSurface';
import { kindName, moveName, runName, seatName, tileName, valueName, whoName, windName } from './names';

const fieldsOf = (style: string): OptionField[] => {
  const prefix = ({ riichi: 'mahjong.riichi.option', 'chinese-official': 'mahjong.co.option', taiwanese: 'mahjong.tw.option' } as Record<string, string>)[style] ?? 'mahjong.option';
  return (STYLES[style]?.options ?? HK_OPTIONS).map(
    (spec): OptionField => ({
      key: spec.key,
      label: tDynamic(`${prefix}.${spec.key}`),
      choices: spec.values.map((value) => ({ value, label: tDynamic(`${prefix}.${spec.key}.${value}`) })),
    }),
  );
};

/** The style first (switching it starts from that style's defaults), then that style's options. */
const STYLE_FIELD: OptionField = {
  key: 'style',
  label: t('mahjong.option.style'),
  choices: Object.keys(STYLES).map((id) => ({ value: id, label: tDynamic(`mahjong.style-name.${id}`) })),
};

export const mahjongOptions: GameOptions<MahjongConfig> = {
  presets: [
    ...HK_PRESETS.map((p) => ({ id: p.id, label: tDynamic(`mahjong.preset.${p.id}`), config: { style: 'hong-kong', options: p.options } })),
    ...RIICHI_PRESETS.map((p) => ({ id: p.id, label: tDynamic(`mahjong.preset.${p.id}`), config: { style: 'riichi', options: p.options } })),
    ...CO_PRESETS.map((p) => ({ id: p.id, label: tDynamic(`mahjong.preset.${p.id}`), config: { style: 'chinese-official', options: p.options } })),
  ],
  fields: [STYLE_FIELD, ...fieldsOf('hong-kong')],
  fieldsFor: (config) => [STYLE_FIELD, ...fieldsOf(config.style)],
  get: (config, key) => (key === 'style' ? config.style : (config.options[key] ?? STYLES[config.style]?.defaults[key] ?? DEFAULT_CONFIG.options[key] ?? '')),
  set: (config, key, value) => {
    if (key === 'style') {
      const style = STYLES[String(value)];
      return style ? { style: String(value), options: style.defaults } : config;
    }
    return { style: config.style, options: { ...config.options, [key]: value } };
  },
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
        if (w.score.unit === 'han') return t(w.from === null ? 'mahjong.log.tsumo' : 'mahjong.log.ron', { ...params, value: w.score.yakuman ? t('mahjong.band.yakuman') : t('mahjong.result.han-fu', { han: w.score.total, fu: w.score.fu ?? 0 }) });
        if (w.score.unit !== 'faan') {
          const value = valueName(w.score.unit, w.score.total);
          if (w.from === m) return t(w.robbed ? 'mahjong.log.win.robbed.value.you' : 'mahjong.log.win.discard.value.you', { value });
          return t(w.from === null ? 'mahjong.log.win.self.value' : w.robbed ? 'mahjong.log.win.robbed.value' : 'mahjong.log.win.discard.value', { who: params.who, from: params.from, value });
        }
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
    if (state.config.style === 'riichi') {
      return [
        { label: t('mahjong.counter.round'), value: t('mahjong.counter.round.value', { wind: windName(state.round), n: state.passes + 1 }) },
        { label: t('mahjong.counter.seat'), value: windName(seatWind(m, state.dealer)) },
        { label: t('mahjong.counter.dealer'), value: seatName(state.dealer, m) },
        { label: t('mahjong.counter.wall'), value: String(Math.max(0, state.wall.length - engine.rules(state.config).deadWall)) },
        // The dora themselves, one row each; the table shows the indicators.
        ...(state.indicators?.tiles.slice(0, state.indicators.shown) ?? []).map((id, i) => ({ label: i === 0 ? t('mahjong.counter.dora') : t('mahjong.counter.kan-dora', { n: i }), value: kindName(doraOf(kindOf(id))) })),
        { label: t('mahjong.counter.honba'), value: String(state.counter) },
        { label: t('mahjong.counter.sticks'), value: String(state.stakes) },
        { label: t('mahjong.counter.minimum'), value: t('mahjong.counter.minimum.yaku') },
        // Five-figure scores do not fit four to a line, so each seat has its own row.
        ...order.map((s) => ({ label: seatName(s, m), value: String(state.scores[s] ?? 0) })),
      ];
    }
    if (state.config.style === 'chinese-official') {
      return [
        { label: t('mahjong.counter.round'), value: t('mahjong.counter.round.value', { wind: windName(state.round), n: state.passes + 1 }) },
        { label: t('mahjong.counter.seat'), value: windName(seatWind(m, state.dealer)) },
        { label: t('mahjong.counter.dealer'), value: seatName(state.dealer, m) },
        { label: t('mahjong.counter.wall'), value: String(Math.max(0, state.wall.length - engine.rules(state.config).deadWall)) },
        { label: t('mahjong.counter.scores'), value: order.map((s) => String(state.scores[s] ?? 0)).join(' · ') },
        { label: t('mahjong.counter.minimum'), value: Number(options.minPoints ?? 8) > 0 ? t('mahjong.counter.minimum.points', { n: Number(options.minPoints ?? 8) }) : t('mahjong.counter.minimum.any') },
      ];
    }
    return [
      { label: t('mahjong.counter.round'), value: t('mahjong.counter.round.value', { wind: windName(state.round), n: state.handNo + 1 }) },
      { label: t('mahjong.counter.seat'), value: windName(seatWind(m, state.dealer)) },
      { label: t('mahjong.counter.dealer'), value: seatName(state.dealer, m) },
      { label: t('mahjong.counter.wall'), value: String(Math.max(0, state.wall.length - engine.rules(state.config).deadWall)) },
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
      { title: 'ref.mahjong.riichi', items: lines('ref.mahjong.riichi', 5) },
      { title: 'ref.mahjong.yaku', items: [...riichiYakuLines(), ...lines('ref.mahjong.yaku', 2)] },
      { title: 'ref.mahjong.fu', items: lines('ref.mahjong.fu', 4) },
      { title: 'ref.mahjong.rpay', items: riichiPayLines() },
      { title: 'ref.mahjong.rterms', items: lines('ref.mahjong.rterms', 5) },
      { title: 'ref.mahjong.rask', items: lines('ref.mahjong.rask', 6) },
      { title: 'ref.mahjong.co', items: lines('ref.mahjong.co', 5) },
      { title: 'ref.mahjong.cofan', items: coFanLines() },
      { title: 'ref.mahjong.copay', items: [t('ref.mahjong.copay.1', { base: CO_BASE }), t('ref.mahjong.copay.2', { base: CO_BASE })] },
      { title: 'ref.mahjong.coask', items: lines('ref.mahjong.coask', 5) },
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
    // Hong Kong scores start at nothing and show a sign; Riichi scores are the points held.
    const riichi = (record.config as { style?: string } | null)?.style === 'riichi';
    const score = mine.score > 0 && !riichi ? `+${mine.score}` : String(mine.score);
    return t(tied ? 'mahjong.result.finished.tied' : 'mahjong.result.finished', { place: tDynamic(`mahjong.place.${mine.place}`), score });
  },
  revealSeat: (start, record, seat) => (record.players[seat]?.kind === 'bot' ? t('mahjong.reveal', { style: t(`mahjong.style.${playStyleOf(start.table, seat)}`) }) : null),
};

/** The Chinese Official patterns by points, from the rules file. */
function coFanLines(): string[] {
  const byValue = new Map<number, string[]>();
  for (const id of CO_PATTERNS) {
    const v = coFan(id);
    byValue.set(v, [...(byValue.get(v) ?? []), tDynamic(`mahjong.pattern.${id}`)]);
  }
  return [...byValue.entries()].sort((a, b) => b[0] - a[0]).map(([n, names]) => t('ref.mahjong.cofan.line', { n, list: names.join('; ') }));
}

/** The Riichi yaku by han, from the rules file: closed-only ones marked, and the open value where it drops. */
function riichiYakuLines(): string[] {
  const byHan = new Map<number, string[]>();
  for (const [id, [closed, open]] of Object.entries(YAKU_HAN)) {
    const name = tDynamic(`mahjong.pattern.${id}`);
    const label = open === 0 ? t('ref.mahjong.yaku.closed', { name }) : open < closed ? t('ref.mahjong.yaku.open', { name, n: open }) : name;
    byHan.set(closed, [...(byHan.get(closed) ?? []), label]);
  }
  return [...byHan.entries()].sort((a, b) => a[0] - b[0]).map(([han, names]) => t('ref.mahjong.yaku.han', { n: han, list: names.join('; ') }));
}

/** The payment table, computed by the Riichi scorer: 1 to 4 han at 30 and 40 fu, then the bands. */
function riichiPayLines(): string[] {
  const hans = [1, 2, 3, 4];
  const ron = (fu: number, dealer: boolean) => hans.map((han) => riichiPayments(riichiBase(han, fu).base, dealer).ron).join(', ');
  const tsumo = (fu: number) =>
    hans
      .map((han) => {
        const p = riichiPayments(riichiBase(han, fu).base, false);
        return `${p.tsumoOther}/${p.tsumoDealer}`;
      })
      .join(', ');
  const dealerTsumo = (fu: number) => hans.map((han) => riichiPayments(riichiBase(han, fu).base, true).tsumoOther).join(', ');
  const band = (name: string, han: number) => {
    const base = riichiBase(han, 20).base;
    return t('ref.mahjong.rpay.band', { name: tDynamic(`mahjong.band.${name}`), han, ron: riichiPayments(base, false).ron, dealer: riichiPayments(base, true).ron });
  };
  return [
    t('ref.mahjong.rpay.ron', { fu: 30, list: ron(30, false), dealer: ron(30, true) }),
    t('ref.mahjong.rpay.ron', { fu: 40, list: ron(40, false), dealer: ron(40, true) }),
    t('ref.mahjong.rpay.tsumo', { fu: 30, list: tsumo(30), dealer: dealerTsumo(30) }),
    [band('mangan', 5), band('haneman', 6), band('baiman', 8), band('sanbaiman', 11), band('kazoe', 13)].join('; '),
    t('ref.mahjong.rpay.extra', { honba: COUNTER_VALUE, stick: STAKE, noten: NOTEN_POOL }),
  ];
}

/** Kind names for tests and lessons. */
export { kindName };
