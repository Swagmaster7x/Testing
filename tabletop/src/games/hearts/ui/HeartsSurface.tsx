/**
 * The Hearts table on the shared trick table: your hand at the bottom, the others round the table,
 * the trick in the middle. In a passing hand you tap three cards and pass them; the cards you
 * received are ringed until the first card is played. What is drawn lags the rules by the events
 * still queued, so each card moves as its event plays.
 */
import { useState } from 'react';
import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { Card } from '../../classic/cards';
import type { Play } from '../../classic/tricks';
import { trickWinner } from '../../classic/tricks';
import { TrickTable } from '../../classic/ui/TrickTable';
import type { HeartsAction, HeartsEvent, HeartsState } from '../rules';
import { giverTo, PASS_COUNT, playableCards, pointsOf, takenBy } from '../rules';
import { seatLabel } from '../../classic/ui/seats';

export interface HeartsDisplay {
  readonly hands: Card[][];
  readonly trick: Play[];
  /** Points each seat has taken so far this hand, as drawn. */
  readonly taken: number[];
  readonly handNo: number;
}

/** The table as it looks before the queued events play. */
export function displayOf(state: HeartsState, pending: readonly HeartsEvent[]): HeartsDisplay {
  const hands = state.hands.map((h) => [...h]);
  let trick = [...state.trick];
  const taken = takenBy(state).map((cards) => pointsOf(cards, state.config));
  let handNo = state.handNo;
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'deal':
        // Before the next deal every card of the last hand had been played.
        hands.forEach((h) => h.splice(0));
        trick = [];
        handNo = e.handNo - 1;
        for (let i = 0; i < taken.length; i++) taken[i] = 0;
        break;
      case 'trick':
        trick = [...e.plays];
        taken[e.winner] = (taken[e.winner] ?? 0) - e.points;
        break;
      case 'play':
        trick = trick.filter((p) => p.card !== e.card);
        hands[e.seat]?.push(e.card);
        break;
      case 'exchange':
        hands.forEach((h, seat) => {
          const got = e.gave[giverTo(seat, e.passDir)] ?? [];
          const gave = e.gave[seat] ?? [];
          hands[seat] = [...h.filter((c) => !got.includes(c)), ...gave];
        });
        break;
      default:
        break;
    }
  }
  return { hands, trick, taken, handNo };
}

export function HeartsSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, names }: SurfaceProps<HeartsState, HeartsAction, HeartsEvent>) {
  const me: Seat = mySeats[0] ?? 0;
  const pending = anim.pending.map((p) => p.event);
  const d = displayOf(state, pending);
  const settled = anim.playing === null && pending.length === 0;
  const [selected, setSelected] = useState<{ hand: number; cards: Card[] }>({ hand: -1, cards: [] });
  const chosen = selected.hand === state.handNo ? selected.cards : [];
  const passing = canAct && settled && state.phase === 'pass';
  const playable = new Set<Card>(passing ? (state.hands[me] ?? []) : legal.flatMap((a) => (a.type === 'play' ? [a.card] : [])));
  const playing = anim.playing?.event ?? null;
  const handOver = playing?.type === 'hand-end' ? playing : null;
  const received = state.exchanged && state.passDir !== 0 && state.tricks.length === 0 && state.trick.length === 0 ? (state.passes[giverTo(me, state.passDir)] ?? []) : [];
  const led = d.trick[0];
  const ducks = (card: Card) => helps.ducks === true && led !== undefined && canAct && playable.has(card) && trickWinner([...d.trick, { seat: me, card }], null) !== me;
  const toggle = (card: Card) =>
    setSelected(() => {
      const has = chosen.includes(card);
      const cards = has ? chosen.filter((c) => c !== card) : chosen.length < PASS_COUNT ? [...chosen, card] : chosen;
      return { hand: state.handNo, cards };
    });
  const dir = tDynamic(`hearts.dir.${state.passDir}`);

  return (
    <TrickTable
      hands={d.hands}
      me={me}
      open={helps.openHand === true}
      trick={d.trick}
      playable={playable}
      canAct={canAct && settled}
      onPlay={(card) => onAction({ type: 'play', card })}
      onSkip={onSkip}
      busy={anim.playing !== null}
      duration={anim.playing ? anim.duration : 220}
      {...(passing ? { choose: { count: PASS_COUNT, selected: chosen, onToggle: toggle } } : {})}
      tone={(card) => (received.includes(card) ? 'hint' : ducks(card) ? 'win' : null)}
      tag={(seat) => ({
        name: seatLabel(seat, me, names),
        detail: t('hearts.tag', { hand: d.taken[seat] ?? 0, total: state.scores[seat] ?? 0 }),
        turn: settled && state.phase === 'play' && (state.leader + state.trick.length) % 4 === seat && !state.over,
      })}
    >
      {passing ? (
        <div className="trick-action">
          <p className="trick-action-note">{t('hearts.pass.note', { n: PASS_COUNT - chosen.length, dir })}</p>
          <button type="button" className="btn btn-primary btn-small" disabled={chosen.length !== PASS_COUNT} onClick={() => onAction({ type: 'pass', cards: chosen })}>
            {t('hearts.pass.button', { dir })}
          </button>
        </div>
      ) : null}
      {state.phase === 'pass' && !passing && settled && !state.over && state.passes[me] ? <p className="trick-wait">{t('hearts.pass.waiting')}</p> : null}
      {handOver ? (
        <div className="hand-over trick-hand-over" role="status">
          <p>{handOver.moon !== null ? t('hearts.moon', { who: seatLabel(handOver.moon, me, names) }) : t('hearts.hand-over')}</p>
          <ul>
            {[0, 1, 2, 3].map((seat) => (
              <li key={seat}>
                <span>{seatLabel(seat, me, names)}</span>
                <b className="num">{handOver.points[seat] ?? 0}</b>
                <span className="num faint">{handOver.scores[seat] ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {canAct && settled && state.phase === 'play' && playableCards(state, state.hands[me] ?? []).length > 0 && state.tricks.length === 0 && state.trick.length === 0 && received.length > 0 ? (
        <p className="trick-wait">{t('hearts.received', { n: received.length })}</p>
      ) : null}
    </TrickTable>
  );
}
