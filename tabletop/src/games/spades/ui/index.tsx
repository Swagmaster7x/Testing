import type { Seat } from '../../../core/contract';
import type { GameRecord } from '../../../core/record';
import { t, tDynamic } from '../../../text';
import type { GameOptions, GameUi, OptionField, ReferenceSection } from '../../types';
import { cardName, cardShort } from '../../classic/names';
import { meOf, seatLabel } from '../../classic/ui/seats';
import { FrenchSeatMark } from '../../classic/ui/SeatMark';
import { SPADES_LEVELS } from '../bots';
import { analyseSpadesGame } from '../review';
import type { SpadesAction, SpadesConfig, SpadesEvent, SpadesState, SpadesView } from '../rules';
import { LOSE_AT, MIN_BIDS, NIL_VALUES, PRESETS, sideOf, spades, TARGETS, tricksWon } from '../rules';
import { SpadesCoachPanel } from './CoachPanel';
import { SpadesSurface } from './SpadesSurface';

const FIELDS: readonly { key: keyof SpadesConfig; values: readonly (string | number)[] }[] = [
  { key: 'partners', values: ['pairs', 'solo'] },
  { key: 'nil', values: NIL_VALUES },
  { key: 'blindNil', values: ['off', 'behind-100', 'always'] },
  { key: 'nilTricks', values: ['bags', 'count'] },
  { key: 'bags', values: ['penalty', 'none', 'minus'] },
  { key: 'breakSpades', values: ['on', 'off'] },
  { key: 'firstLead', values: ['left', 'two-clubs'] },
  { key: 'minBid', values: MIN_BIDS },
  { key: 'target', values: TARGETS },
  { key: 'loseAt', values: LOSE_AT },
];

export const spadesOptions: GameOptions<SpadesConfig> = {
  presets: Object.entries(PRESETS).map(([id, config]) => ({ id, label: tDynamic(`spades.preset.${id}`), config })),
  fields: FIELDS.map(
    (f): OptionField => ({
      key: f.key,
      label: tDynamic(`spades.option.${f.key}`),
      choices: f.values.map((value) => ({ value, label: tDynamic(`spades.option.${f.key}.${value}`) })),
    }),
  ),
  get: (config, key) => config[key as keyof SpadesConfig] as string | number,
  set: (config, key, value) => ({ ...config, [key]: value }),
};

const partnersOf = (state?: { config: SpadesConfig }) => state?.config.partners !== 'solo';

export const spadesUi: GameUi<SpadesState, SpadesAction, SpadesConfig, SpadesView, SpadesEvent> = {
  def: spades,
  levels: SPADES_LEVELS,
  levelBlurb: (level) => tDynamic(`spades.level.${level}`),
  layout: 'table',
  Surface: SpadesSurface,
  SeatMark: FrenchSeatMark,
  sides: [{ id: 'you', label: 'classic.side.you', seat: 0 }],
  sideName: (seat) => tDynamic(`classic.seat.name.${seat}`),
  movePrefix: (seat, mySeats, _seats, names) => seatLabel(seat, meOf(mySeats), names, true),
  playerName: (seat, mySeats, _seats, names) => seatLabel(seat, meOf(mySeats), names, true),
  moveText: (action) => {
    switch (action.type) {
      case 'bid':
        return action.n === 0 ? t('spades.nil') : t('spades.move.bid', { n: action.n });
      case 'blind':
        return t('spades.blind');
      case 'look':
        return t('spades.move.look');
      default:
        return cardShort(action.card);
    }
  },
  eventDuration(event) {
    switch (event.type) {
      case 'play':
        return 280;
      case 'trick':
        return 650;
      case 'bid':
        return 350;
      case 'deal':
        return 600;
      case 'hand-end':
        return 2800;
      default:
        return 0;
    }
  },
  describeEvent(event, mySeats, _seats, names) {
    const me = meOf(mySeats);
    const who = (seat: Seat) => seatLabel(seat, me, names, true);
    switch (event.type) {
      case 'deal':
        return t('spades.log.deal', { n: event.handNo + 1 });
      case 'look':
        return t('spades.log.look', { who: who(event.seat) });
      case 'bid':
        return event.blind ? t('spades.log.blind', { who: who(event.seat) }) : event.n === 0 ? t('spades.log.nil', { who: who(event.seat) }) : t('spades.log.bid', { who: who(event.seat), n: event.n });
      case 'play':
        return t(event.breaks ? 'spades.log.play.breaks' : 'spades.log.play', { who: who(event.seat), card: cardName(event.card) });
      case 'trick':
        return t('spades.log.trick', { who: who(event.winner) });
      case 'hand-end':
        return t('spades.log.hand-end', { list: event.result.deltas.map((d) => (d > 0 ? `+${d}` : String(d))).join(' · ') });
      case 'game-end':
        return t('spades.log.game-end');
    }
  },
  counters(state, mySeats) {
    const me = meOf(mySeats);
    const won = tricksWon(state);
    const side = sideOf(state.config, me);
    const rows = [
      { label: t('spades.counter.hand'), value: String(state.handNo + 1) },
      { label: t('spades.counter.score'), value: state.scores.map((x) => String(x)).join(' · ') },
      { label: t('spades.counter.bags'), value: String(state.bagCount[side] ?? 0) },
      { label: t('spades.counter.broken'), value: state.broken ? t('common.on') : t('common.off') },
    ];
    if (partnersOf(state)) rows.splice(2, 0, { label: t('spades.counter.ours'), value: `${(won[me] ?? 0) + (won[(me + 2) % 4] ?? 0)} / ${Math.max(0, state.bids[me] ?? 0) + Math.max(0, state.bids[(me + 2) % 4] ?? 0)}` });
    return rows;
  },
  sound: (event) => (event.type === 'play' ? 'card' : event.type === 'deal' ? 'shuffle' : event.type === 'game-end' ? 'end' : null),
  reference(): readonly ReferenceSection[] {
    const n = (key: string, count: number) => Array.from({ length: count }, (_, i) => tDynamic(`${key}.${i + 1}`));
    return [
      { title: 'ref.spades.cards', items: n('ref.spades.cards', 3) },
      { title: 'ref.spades.bid', items: n('ref.spades.bid', 4) },
      { title: 'ref.spades.play', items: n('ref.spades.play', 4) },
      { title: 'ref.spades.score', items: n('ref.spades.score', 5) },
      { title: 'ref.spades.terms', items: n('ref.spades.terms', 4) },
      { title: 'ref.spades.presets', items: Object.keys(PRESETS).map((id) => `${tDynamic(`spades.preset.${id}`)}: ${tDynamic(`spades.preset.${id}.detail`)}`) },
      { title: 'ref.spades.ask', items: n('ref.spades.ask', 7) },
      { title: 'ref.spades.levels', items: SPADES_LEVELS.map((l) => `${t('common.level', { n: l.level })} (${t('classic.rating', { n: l.rating })}): ${tDynamic(`spades.level.${l.level}`)}`) },
    ];
  },
  coach: {
    helps: [
      { id: 'tricks', label: 'spades.help.tricks', on: false, training: true },
      { id: 'played', label: 'classic.help.played', on: false, training: true },
      { id: 'voids', label: 'classic.help.voids', on: false, training: true },
      { id: 'whatWins', label: 'spades.help.whatWins', on: false, training: true },
      { id: 'openHand', label: 'classic.help.openHand', on: false, training: true },
    ],
    Panel: SpadesCoachPanel,
  },
  review: {
    analyse: analyseSpadesGame,
    configAt: (state) => ({ ...state.config, start: spades.codec.state.toText(state) }),
  },
  options: spadesOptions,
  replayConfig: (config) => ({ ...config, start: undefined }),
  resultText(record: GameRecord): string | null {
    // Partners: say which side won and the score, when the people at the table share a side.
    const o = record.outcome;
    const people = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
    const me = people[0];
    if (!o?.teams || me === undefined || people.some((seat) => seat % 2 !== me % 2)) return null;
    const ours = o.results.find((r) => r.seat === me);
    const theirs = o.results.find((r) => r.seat === (me + 1) % 4);
    if (!ours || !theirs) return null;
    const key = ours.place < theirs.place ? 'spades.result.win' : ours.place > theirs.place ? 'spades.result.lose' : 'spades.result.tie';
    return tDynamic(key, { us: ours.score, them: theirs.score });
  },
};
