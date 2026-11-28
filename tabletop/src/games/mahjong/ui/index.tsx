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
import { KONG_PAY, SICHUAN_DEFAULTS, SICHUAN_FAN, SICHUAN_PRESETS, sichuanPoints } from '../styles/sichuan';
import { AMERICAN_PRESETS, cardOf, PRACTICE } from '../styles/american';
import { loadCard } from '../american/card-store';
import { MahjongCoachPanel } from './CoachPanel';
import { MahjongSeatMark, MahjongSurface } from './MahjongSurface';
import { directionName, kindName, moveName, runName, seatName, suitName, tileName, whoName, windName } from './names';

const fieldsOf = (style: string): OptionField[] => {
  // Hong Kong's options are plain "mahjong.option"; every later style has its own prefix ("mahjong.riichi.option").
  const prefix = style === 'hong-kong' || !STYLES[style] ? 'mahjong.option' : `mahjong.${style}.option`;
  // A free-text option (a card typed in) has its own screen, not a row of choices.
  return (STYLES[style]?.options ?? HK_OPTIONS).filter((spec) => !spec.text).map(
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
    ...SICHUAN_PRESETS.map((p) => ({ id: p.id, label: tDynamic(`mahjong.preset.${p.id}`), config: { style: 'sichuan', options: p.options } })),
    ...AMERICAN_PRESETS.map((p) => ({ id: p.id, label: tDynamic(`mahjong.preset.${p.id}`), config: { style: 'american', options: p.options } })),
  ],
  fields: [STYLE_FIELD, ...fieldsOf('hong-kong')],
  fieldsFor: (config) => [STYLE_FIELD, ...fieldsOf(config.style)],
  get: (config, key) => (key === 'style' ? config.style : (config.options[key] ?? STYLES[config.style]?.defaults[key] ?? DEFAULT_CONFIG.options[key] ?? '')),
  set: (config, key, value) => {
    if (key === 'style') {
      const style = STYLES[String(value)];
      return style ? { style: String(value), options: style.defaults } : config;
    }
    // Playing "my card" copies the card typed in (Tools) into the rules, so the game's record keeps it.
    if (config.style === 'american' && key === 'card') return { style: config.style, options: { ...config.options, card: value, cardText: value === 'mine' ? loadCard() : '' } };
    return { style: config.style, options: { ...config.options, [key]: value } };
  },
};

const me = (mySeats: readonly Seat[] | undefined): Seat => (mySeats ?? [0])[0] ?? 0;
/** A card's title cut to fit a counter's value. */
const shortTitle = (title: string): string => (title.length > 18 ? `${title.slice(0, 17).trimEnd()}…` : title);

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
    // Tiles passed, votes and void suits are chosen in secret; the table shows them when all have chosen.
    if (action.type === 'pass-tiles' || action.type === 'vote' || action.type === 'void') return mySeats.includes(seat);
    // An exposure call is secret until the claim window closes, like a pung.
    if (action.type === 'expose') return mySeats.includes(seat);
    if (action.type === 'pung' || action.type === 'chow' || (action.type === 'kong' && action.tile === undefined)) return mySeats.includes(seat);
    return true;
  },
  shownTurn: (state, mySeats) => ((state.phase === 'claim' || state.phase === 'rob' || state.phase === 'pass' || state.phase === 'void') && !mySeats.includes(state.turn) ? null : state.over ? null : state.turn),
  eventSeat: (event) => {
    switch (event.type) {
      case 'discard':
      case 'call':
      case 'kong':
      case 'bonus':
      case 'draw':
      case 'swap':
      case 'dead':
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
      case 'passed':
      case 'voids':
        return 600;
      case 'pay':
        return 300;
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
      case 'passed':
        return t('mahjong.log.passed', { dir: directionName(event.dir) });
      case 'vote-result':
        return t(event.yes ? 'mahjong.log.vote.yes' : 'mahjong.log.vote.no');
      case 'voids':
        return t('mahjong.log.voids', { list: event.voids.map((v, seat) => `${seatName(seat, m)} ${v === null ? '' : suitName(v)}`).join(', ') });
      case 'swap':
        return t('mahjong.log.swap', { tile: tileName(event.tile), from: whoName(event.from, m) });
      case 'dead':
        return t('mahjong.log.dead');
      case 'pay': {
        // A win's payments are on the sheet; the log names what a kong collected at once.
        if (!event.reason.startsWith('kong-')) return null;
        return t('mahjong.log.pay.kong', { who: whoName(event.seat, m), n: event.deltas[event.seat] ?? 0 });
      }
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
    if (state.config.style === 'american') {
      const hands = { hand: 1, four: 4, eight: 8, sixteen: 16 }[String(options.length ?? 'four')] ?? 4;
      const jokers = [...(state.hands[m] ?? []), ...state.melds.flat().flatMap((x) => x.tiles), ...state.discards.flat().filter((x) => !x.claimed).map((x) => x.tile)].filter((id) => kindOf(id) === 42).length;
      return [
        { label: t('mahjong.counter.hand'), value: t('mahjong.counter.hand.value', { n: state.handNo + 1, total: hands }) },
        { label: t('mahjong.counter.dealer'), value: seatName(state.dealer, m) },
        { label: t('mahjong.counter.wall'), value: String(state.wall.length) },
        // Short, so the labels keep their line: the practice card by kind, yours by its title.
        { label: t('mahjong.counter.card'), value: options.card === 'mine' ? shortTitle(cardOf(options).title) || t('mahjong.counter.card.mine') : t('mahjong.counter.card.practice') },
        { label: t('mahjong.counter.jokers'), value: String(jokers) },
        { label: t('mahjong.counter.scores'), value: order.map((s) => String(state.scores[s] ?? 0)).join(' · ') },
      ];
    }
    if (state.config.style === 'sichuan') {
      const cap = Number(options.cap ?? SICHUAN_DEFAULTS.cap);
      const hands = { hand: 1, four: 4, eight: 8, sixteen: 16 }[String(options.length ?? 'four')] ?? 4;
      return [
        { label: t('mahjong.counter.hand'), value: t('mahjong.counter.hand.value', { n: state.handNo + 1, total: hands }) },
        { label: t('mahjong.counter.dealer'), value: seatName(state.dealer, m) },
        { label: t('mahjong.counter.wall'), value: String(state.wall.length) },
        { label: t('mahjong.counter.cap'), value: t('mahjong.counter.cap.value', { n: cap, points: sichuanPoints(cap, options) }) },
        // Void suits once everyone has chosen (your own as soon as you have).
        ...order.flatMap((s) => {
          const v = s === m || state.phase !== 'void' ? state.voids[s] : null;
          return v === null || v === undefined ? [] : [{ label: seatName(s, m), value: t('mahjong.void.mark', { suit: suitName(v) }) }];
        }),
        ...(state.won.length > 0 ? [{ label: t('mahjong.counter.out'), value: state.won.map((w) => seatName(w.seat, m)).join(', ') }] : []),
        { label: t('mahjong.counter.scores'), value: order.map((s) => String(state.scores[s] ?? 0)).join(' · ') },
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
      { title: 'ref.mahjong.sichuan', items: lines('ref.mahjong.sichuan', 5) },
      { title: 'ref.mahjong.sfan', items: sichuanFanLines() },
      { title: 'ref.mahjong.spay', items: [t('ref.mahjong.spay.1'), t('ref.mahjong.spay.2', { exposed: KONG_PAY.exposed, added: KONG_PAY.added, concealed: KONG_PAY.concealed }), t('ref.mahjong.spay.3')] },
      { title: 'ref.mahjong.sask', items: lines('ref.mahjong.sask', 5) },
      { title: 'ref.mahjong.american', items: lines('ref.mahjong.american', 6) },
      { title: 'ref.mahjong.apay', items: lines('ref.mahjong.apay', 2) },
      { title: 'ref.mahjong.acard', items: [t('ref.mahjong.acard.note'), ...PRACTICE.hands.map((h) => t('ref.mahjong.acard.line', { section: h.section, text: h.text, points: h.points, mark: h.concealed ? 'C' : 'X' }))] },
      { title: 'ref.mahjong.aask', items: lines('ref.mahjong.aask', 5) },
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

/** The Sichuan fan table, from the rules file, and the cap. */
function sichuanFanLines(): string[] {
  const cap = Number(SICHUAN_DEFAULTS.cap);
  return [...Object.entries(SICHUAN_FAN).map(([id, n]) => t('ref.mahjong.sfan.line', { name: tDynamic(`mahjong.pattern.${id}`), n })), t('ref.mahjong.sfan.cap', { n: cap, points: sichuanPoints(cap) })];
}

/** Kind names for tests and lessons. */
export { kindName };
