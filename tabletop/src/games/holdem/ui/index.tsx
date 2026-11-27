import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { HOLDEM_LEVELS, STYLES } from '../bots';
import type { HoldemAction, HoldemConfig, HoldemEvent, HoldemState, HoldemView } from '../rules';
import { CONFIG_CHOICES, holdem, isFreezeout, netChips, potOf, PRESETS } from '../rules';
import { actionWords, PokerCoachPanel } from './CoachPanel';
import { cardName, handName, seatName } from './names';
import { PokerSeatMark, PokerSurface } from './PokerSurface';

const FIELDS: readonly (keyof typeof CONFIG_CHOICES)[] = ['format', 'stack', 'hands', 'levelHands', 'ante', 'straddle', 'shortAllIn', 'oddChip', 'showdown', 'payouts'];

export const holdemOptions: GameOptions<HoldemConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`poker.preset.${id}`), config })),
  fields: FIELDS.map(
    (key): OptionField => ({
      key,
      label: tDynamic(`poker.option.${key}`),
      choices: (CONFIG_CHOICES[key] as readonly (string | number)[]).map((value) => ({ value, label: tDynamic(`poker.option.${key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof HoldemConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

const me = (mySeats: readonly Seat[] | undefined): Seat => (mySeats ?? [0])[0] ?? 0;
const cards = (list: readonly string[]) => list.map((c) => cardName(c as Parameters<typeof cardName>[0])).join(', ');

export const holdemUi: GameUi<HoldemState, HoldemAction, HoldemConfig, HoldemView, HoldemEvent> = {
  def: holdem,
  levels: HOLDEM_LEVELS,
  levelBlurb: (level) => tDynamic(`poker.level.${level}`),
  layout: 'table',
  Surface: PokerSurface,
  SeatMark: PokerSeatMark,
  sides: [{ id: 'you', label: 'poker.side.you', seat: 0 }],
  sideName: (seat) => seatName(seat, null),
  movePrefix: (seat, mySeats) => seatName(seat, me(mySeats)),
  playerName: (seat, mySeats) => seatName(seat, me(mySeats)),
  moveText: (action) => actionWords(holdem.codec.action.toText(action)),
  eventDuration(event) {
    switch (event.type) {
      case 'deal':
        return 450;
      case 'post':
        return 160;
      case 'hole':
        return 500;
      case 'act':
        return event.kind === 'fold' ? 300 : 420;
      case 'collect':
        return 380;
      case 'board':
        return 600;
      case 'show':
        return 650;
      case 'muck':
        return 300;
      case 'return':
        return 300;
      case 'win':
        return 650;
      case 'hand-end':
        return 2400;
      case 'bust':
      case 'rebuy':
        return 700;
      case 'level':
        return 1000;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats) {
    const m = me(mySeats);
    switch (event.type) {
      case 'deal':
        return t('poker.log.deal', { n: event.handNo, name: seatName(event.button, m) });
      case 'post':
        return t(`poker.log.post.${event.kind}`, { n: event.amount });
      case 'act':
        if (event.allIn && event.kind !== 'fold' && event.kind !== 'check') return t('poker.log.all-in', { n: event.to });
        return tDynamic(`poker.log.${event.kind}`, { n: event.kind === 'call' ? event.amount : event.to });
      case 'board':
        return t(`poker.log.board.${event.street === 'flop' ? 'flop' : event.street === 'turn' ? 'turn' : 'river'}`, { cards: cards(event.cards) });
      case 'show':
        return t('poker.log.show', { cards: cards(event.cards), hand: handName(event.value) });
      case 'muck':
        return t('poker.log.muck');
      case 'return':
        return t('poker.log.return', { n: event.amount });
      case 'win':
        return event.value === null ? t('poker.log.win', { n: event.amount }) : t('poker.log.win.hand', { n: event.amount, hand: handName(event.value) });
      case 'bust':
        return t('poker.log.bust', { name: seatName(event.seat, m), n: event.place });
      case 'rebuy':
        return t('poker.log.rebuy', { name: seatName(event.seat, m), n: event.amount });
      case 'level':
        return event.blinds.ante > 0 ? t('poker.log.level.ante', { sb: event.blinds.sb, bb: event.blinds.bb, ante: event.blinds.ante }) : t('poker.log.level', { sb: event.blinds.sb, bb: event.blinds.bb });
      case 'match-end':
        return t('poker.log.match-end');
      default:
        return null;
    }
  },
  counters(state, mySeats) {
    const m = me(mySeats);
    const rows = [
      { label: t('poker.counter.hand'), value: String(state.handNo) },
      { label: t('poker.counter.blinds'), value: state.blinds.ante > 0 ? `${state.blinds.sb}/${state.blinds.bb} (${state.blinds.ante})` : `${state.blinds.sb}/${state.blinds.bb}` },
      { label: t('poker.counter.pot'), value: String(potOf(state)) },
      { label: t('poker.counter.chips'), value: String(state.players[m]?.stack ?? 0) },
    ];
    if (isFreezeout(state.config)) {
      rows.push({ label: t('poker.counter.level'), value: String(state.level) });
      rows.push({ label: t('poker.counter.left'), value: String(state.players.filter((p) => !p.out).length) });
    } else {
      const net = netChips(state)[m] ?? 0;
      rows.push({ label: t('poker.counter.net'), value: net > 0 ? `+${net}` : String(net) });
    }
    return rows;
  },
  sound: (event) => (event.type === 'act' && event.amount > 0 ? 'chip' : event.type === 'post' || event.type === 'win' ? 'chip' : event.type === 'board' ? 'card' : event.type === 'deal' ? 'shuffle' : event.type === 'match-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const lines = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.poker.ranking', items: lines('ref.poker.ranking', 9) },
      { title: 'ref.poker.play', items: lines('ref.poker.play', 5) },
      { title: 'ref.poker.terms', items: lines('ref.poker.terms', 6) },
      { title: 'ref.poker.styles', items: STYLES.map((s) => `${tDynamic(`poker.style.name.${s}`)}: ${tDynamic(`poker.style.${s}`)}`) },
      { title: 'ref.poker.presets', items: lines('ref.poker.presets', 4) },
      { title: 'ref.poker.ask', items: lines('ref.poker.ask', 5) },
      { title: 'ref.poker.levels', items: HOLDEM_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('poker.rating', { n: l.rating })}): ${tDynamic(`poker.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'potOdds', label: 'poker.help.potOdds', on: false, training: true },
      { id: 'outs', label: 'poker.help.outs', on: false, training: true },
      { id: 'equity', label: 'poker.help.equity', on: false, training: true },
      { id: 'handName', label: 'poker.help.handName', on: false, training: true },
      { id: 'positions', label: 'poker.help.positions', on: false, training: true },
      { id: 'chart', label: 'poker.help.chart', on: false, training: true },
      { id: 'stats', label: 'poker.help.stats', on: false, training: true },
      { id: 'openHand', label: 'poker.help.openHand', on: false, training: true },
    ],
    Panel: PokerCoachPanel,
  },
  options: holdemOptions,
};
