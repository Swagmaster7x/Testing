/**
 * The Blackjack table: the dealer along the top, the boxes along the bottom (yours in the middle
 * when there are three), split hands side by side, each hand's bet in chips and its total. The
 * ChipKit bet controls take the bet; Hit, Stand, Double, Split and Surrender sit under your thumb.
 * Between rounds the last round stays on the felt, with its results, while you bet again. Play
 * chips only.
 */
import type { Seat } from '../../../core/contract';
import type { PlacedCard } from '../../../kits/cards/CardLayer';
import { CardLayer, useSize } from '../../../kits/cards/CardLayer';
import { FrenchCardBack, FrenchCardFace } from '../../../kits/cards/french';
import type { BetOption } from '../../../kits/chips/ChipKit';
import { BetControls, ChipStack } from '../../../kits/chips/ChipKit';
import { t, tDynamic } from '../../../text';
import type { SurfaceProps, SeatNames } from '../../types';
import type { Card } from '../../classic/cards';
import { cardName } from '../../classic/names';
import '../../classic/ui/classic.css';
import { basicFor } from '../bots';
import type { BlackjackAction, BlackjackEvent, BlackjackState, Box, PlayerHand } from '../rules';
import { BANKROLL, betChoices, blackjack, isNatural, limitsOf, whatCan } from '../rules';
import { handTotal } from '../strategy';

const signed = (n: number): string => (n > 0 ? `+${n}` : String(n));

interface Shown {
  readonly round: number;
  readonly dealer: readonly (Card | null)[];
  readonly boxes: readonly Box[];
  /** Results are shown once the round's settle event has played. */
  readonly settled: boolean;
  /** Card positions still to be dealt (their events are queued): "dealer:1", "0:0:2". */
  readonly hidden: ReadonlySet<string>;
}

const posKey = (to: BlackjackEvent & { type: 'card' }) => (to.to === 'dealer' ? `dealer:${to.index}` : `${to.to.box}:${to.to.hand}:${to.index}`);

/** What the felt shows: the round in play, or the last round while bets go down for the next. */
export function shownOf(state: BlackjackState, pending: readonly BlackjackEvent[]): Shown | null {
  const settleQueued = (round: number) => pending.some((e) => e.type === 'settle' && e.round === round);
  const inPlay = state.phase === 'insurance' || state.phase === 'play';
  const hiddenFor = (round: number) => new Set(pending.flatMap((e) => (e.type === 'card' && e.round === round ? [posKey(e)] : [])));
  if (inPlay) {
    const hidden = hiddenFor(state.round);
    const dealer = state.dealer.map((c, i) => (i === 1 && !state.holeShown ? null : c));
    return { round: state.round, dealer, boxes: state.boxes, settled: false, hidden };
  }
  if (!state.last) return null;
  const last = state.last;
  const hidden = hiddenFor(last.round);
  const revealQueued = pending.some((e) => e.type === 'reveal' && e.round === last.round);
  const dealer = last.dealer.map((c, i) => (i === 1 && revealQueued ? null : c));
  return { round: last.round, dealer, boxes: last.boxes, settled: !settleQueued(last.round), hidden };
}

const face = (card: Card) => <FrenchCardFace card={card} />;
const BACK = <FrenchCardBack />;

export function boxName(seat: Seat, me: Seat, names?: SeatNames): string {
  if (seat === me) return t('blackjack.box.you');
  return names?.(seat) ?? t('blackjack.box.cpu', { n: seat + 1 });
}

function outcomeText(h: PlayerHand): string {
  const net = signed(h.net);
  return tDynamic(`blackjack.outcome.${h.outcome ?? 'none'}`, { net });
}

export function BlackjackSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, names }: SurfaceProps<BlackjackState, BlackjackAction, BlackjackEvent>) {
  const [ref, size] = useSize<HTMLDivElement>();
  const me: Seat = mySeats[0] ?? 0;
  const pending = anim.pending.map((p) => p.event);
  const shown = shownOf(state, pending);
  const settledAnim = anim.playing === null && pending.length === 0;
  const act = canAct && settledAnim;
  const W = size.width;
  const H = size.height;
  const n = state.boxes.length;
  const cardW = Math.max(28, Math.min(W / (n === 1 ? 9 : 11), (H * 0.24) / 1.5));
  const cardH = cardW * 1.5;
  const gap = Math.max(4, H * 0.015);
  const placed: PlacedCard[] = [];
  const order = Array.from({ length: n }, (_, i) => i);
  // Your box in the middle of three, on the right of two.
  const slotOf = (box: number): number => (n === 3 ? (box === me ? 1 : order.filter((b) => b !== me).indexOf(box) === 0 ? 0 : 2) : n === 2 ? (box === me ? 1 : 0) : 0);
  const boxW = W / n;
  const dealerY = gap + cardH / 2 + 22;
  const handY = H * 0.62;

  if (shown) {
    shown.dealer.forEach((card, i) => {
      const hidden = shown.hidden.has(`dealer:${i}`);
      if (hidden) return;
      placed.push({ key: `${shown.round}-d-${i}`, face: card ? face(card) : null, back: BACK, x: W / 2 + (i - (shown.dealer.length - 1) / 2) * cardW * 0.62, y: dealerY, z: 10 + i, label: card ? t('blackjack.dealer-card', { card: cardName(card) }) : t('blackjack.hole') });
    });
    shown.boxes.forEach((box, b) => {
      const cx = (slotOf(b) + 0.5) * boxW;
      const hands = box.hands;
      const handW = Math.min(boxW / Math.max(1, hands.length), cardW * 2.4);
      hands.forEach((hand, h) => {
        const hx = cx + (h - (hands.length - 1) / 2) * handW;
        hand.cards.forEach((card, i) => {
          if (shown.hidden.has(`${b}:${h}:${i}`)) return;
          const scale = b === me ? 1 : 0.8;
          placed.push({ key: `${shown.round}-${b}-${h}-${i}`, face: face(card), back: BACK, x: hx + (i - 0.5) * cardW * 0.32 * scale, y: handY - i * cardH * 0.13 * scale, z: 40 + b * 30 + h * 8 + i, rotate: hand.doubled && i === 2 ? 90 : 0, scale, label: b === me ? t('blackjack.your-card', { card: cardName(card) }) : cardName(card) });
        });
      });
    });
  }

  const dealerTotal = shown ? (() => {
    const visible = shown.dealer.filter((c, i): c is Card => c !== null && !shown.hidden.has(`dealer:${i}`));
    if (visible.length === 0) return null;
    const tot = handTotal(visible);
    return tot.soft && tot.total < 21 && visible.length > 1 ? t('blackjack.total.soft', { n: tot.total }) : String(tot.total);
  })() : null;

  // Controls.
  const box = state.boxes[me];
  const { min } = limitsOf(state.config);
  const choices = box ? betChoices(state.config, box.chips) : [];
  const lastBet = state.last?.boxes[me]?.bet ?? min;
  const repeat = choices.includes(lastBet) ? lastBet : (choices[0] ?? min);
  const presets: BetOption[] = [...new Set([min, 50, 100, 200, choices[choices.length - 1] ?? min])].filter((x) => choices.includes(x)).map((x) => ({ to: x, label: x === choices[choices.length - 1] ? t('blackjack.bet.max', { n: x }) : String(x) }));
  const can = state.at && state.phase === 'play' ? whatCan(state, state.at) : null;
  const myTurnPlay = act && state.phase === 'play' && state.at?.box === me && can;
  const basic = myTurnPlay && helps.chartTone ? basicFor(blackjack.view(state, me)) : null;
  const move = (type: BlackjackAction['type']) => legal.some((a) => a.type === type);
  const handNow = state.at ? state.boxes[state.at.box]?.hands[state.at.hand] : undefined;

  return (
    <div ref={ref} className="card-table bj-table" onPointerDown={(e) => e.target === e.currentTarget && onSkip()} data-busy={anim.playing !== null} data-boxes={n}>
      <div className="bj-arc" aria-hidden="true" style={{ top: `${(dealerY + handY) / 2}px` }}>
        <span>{state.config.payout === '3:2' ? t('blackjack.felt.32') : t('blackjack.felt.65')}</span>
        <span>{state.config.soft17 === 'stand' ? t('blackjack.felt.s17') : t('blackjack.felt.h17')}</span>
      </div>
      {W > 0 ? <CardLayer cards={placed} cardWidth={cardW} duration={anim.playing ? anim.duration : 220} /> : null}
      <div className="bj-dealer-tag" style={{ top: `${gap}px` }}>
        <b>{t('blackjack.dealer')}</b>
        {dealerTotal ? <span className="num">{dealerTotal}</span> : null}
      </div>
      <div className="bj-shoe" style={{ left: `${gap}px`, top: `${gap}px` }}>
        {t('blackjack.shoe', { decks: state.config.decks, n: state.shoe.length })}
        <br />
        {t('blackjack.round', { n: Math.min(state.round + 1, state.config.rounds), total: state.config.rounds })}
      </div>
      {shown
        ? shown.boxes.map((b, i) => {
            const cx = (slotOf(i) + 0.5) * boxW;
            const handW = Math.min(boxW / Math.max(1, b.hands.length), cardW * 2.4);
            return (
              <div key={i}>
                {b.hands.map((hand, h) => {
                  const hx = cx + (h - (b.hands.length - 1) / 2) * handW;
                  const visible = hand.cards.filter((_, k) => !shown.hidden.has(`${i}:${h}:${k}`));
                  const tot = visible.length > 0 ? handTotal(visible) : null;
                  const active = state.phase === 'play' && state.at?.box === i && state.at.hand === h && shown.round === state.round;
                  return (
                    <div key={h} className="bj-hand-tag" data-active={active} style={{ left: `${hx}px`, top: `${handY + cardH * 0.62}px` }}>
                      {tot ? <span className="num bj-total">{isNatural(hand) && visible.length === 2 ? t('blackjack.total.bj') : tot.soft && tot.total < 21 ? t('blackjack.total.soft', { n: tot.total }) : tot.total > 21 ? t('blackjack.total.bust', { n: tot.total }) : tot.total}</span> : null}
                      <ChipStack amount={hand.bet} label={t('blackjack.bet-of', { n: hand.bet })} />
                      {shown.settled && hand.outcome ? <span className="bj-outcome" data-tone={hand.net > 0 ? 'good' : hand.net < 0 ? 'bad' : 'even'}>{outcomeText(hand)}</span> : null}
                    </div>
                  );
                })}
              </div>
            );
          })
        : null}
      {state.boxes.map((b, i) => (
        <div key={i} className="seat-tag bj-box-tag" data-turn={state.phase !== 'done' && settledAnim && ((state.phase === 'play' && state.at?.box === i) || ((state.phase === 'bet' || state.phase === 'insurance') && blackjack.turn(state) === i))} style={{ left: `${(slotOf(i) + 0.5) * boxW}px`, bottom: `${gap}px` }}>
          <b>{boxName(i, me, names)}</b>
          <span className="num">{t('blackjack.chips', { n: b.chips })}</span>
          {b.out ? <span>{t('blackjack.out')}</span> : null}
          {(b.insurance ?? 0) > 0 && state.phase === 'play' ? <span>{t('blackjack.insured', { n: b.insurance ?? 0 })}</span> : null}
        </div>
      ))}
      {act && state.phase === 'bet' && box ? (
        <div className="bj-controls">
          <BetControls
            key={`bet-${state.round}`}
            canFold={false}
            toCall={0}
            stack={box.chips}
            raise={choices.length > 0 ? { min: choices[0] ?? min, max: choices[choices.length - 1] ?? min } : null}
            unit={10}
            opening
            presets={presets}
            onFold={() => undefined}
            onCall={() => onAction({ type: 'bet', amount: repeat })}
            onRaise={(to) => onAction({ type: 'bet', amount: Math.max(choices[0] ?? min, Math.min(to, choices[choices.length - 1] ?? min)) })}
            text={{
              fold: '',
              check: t('blackjack.bet.same', { n: repeat }),
              call: (x) => t('blackjack.bet.same', { n: x }),
              allInCall: (x) => t('blackjack.bet.same', { n: x }),
              bet: (x) => t('blackjack.bet.n', { n: x }),
              raise: (x) => t('blackjack.bet.n', { n: x }),
              allIn: (x) => t('blackjack.bet.n', { n: x }),
              size: t('blackjack.bet.size'),
              cancel: t('poker.cancel'),
            }}
          />
        </div>
      ) : null}
      {act && state.phase === 'insurance' ? (
        <div className="bj-controls bj-moves">
          <p className="bj-note">{t('blackjack.insurance.note')}</p>
          {move('insure') ? (
            <button type="button" className="btn btn-small" onClick={() => onAction({ type: 'insure' })}>
              {t('blackjack.insure', { n: (box?.bet ?? 0) / 2 })}
            </button>
          ) : null}
          <button type="button" className="btn btn-small btn-primary" onClick={() => onAction({ type: 'no-insurance' })}>
            {t('blackjack.no-insurance')}
          </button>
        </div>
      ) : null}
      {myTurnPlay ? (
        <div className="bj-controls bj-moves" role="group" aria-label={t('blackjack.moves')}>
          {(['hit', 'stand', 'double', 'split', 'surrender'] as const).map((m) =>
            move(m) ? (
              <button key={m} type="button" className={`btn btn-small${basic === m ? ' btn-primary' : ''}`} data-chart={basic === m} onClick={() => onAction({ type: m })}>
                {t(`blackjack.move.${m}`)}
              </button>
            ) : null,
          )}
          {handNow && state.boxes[me] && state.boxes[me].hands.length > 1 ? <span className="bj-note">{t('blackjack.hand-of', { n: (state.at?.hand ?? 0) + 1, total: state.boxes[me].hands.length })}</span> : null}
        </div>
      ) : null}
      {state.phase === 'done' && settledAnim ? (
        <div className="hand-over" role="status">
          {t('blackjack.session-over', { n: signed((box?.chips ?? BANKROLL) - BANKROLL) })}
        </div>
      ) : null}
    </div>
  );
}
