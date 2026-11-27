/**
 * The Spades table on the shared trick table: your partner across, the bids and tricks on each
 * seat's tag, the bidding panel while it is your bid (nil and, where allowed, blind nil).
 */
import type { Seat } from '../../../core/contract';
import { t, tDynamic } from '../../../text';
import type { SurfaceProps } from '../../types';
import type { Card } from '../../classic/cards';
import type { Play } from '../../classic/tricks';
import { trickWinner } from '../../classic/tricks';
import { TrickTable } from '../../classic/ui/TrickTable';
import { seatLabel } from '../../classic/ui/seats';
import type { SpadesAction, SpadesEvent, SpadesState } from '../rules';
import { HAND_SIZE, membersOf, sideCount, sideOf, TRUMP, tricksWon } from '../rules';

export interface SpadesDisplay {
  readonly hands: Card[][];
  readonly trick: Play[];
  readonly bids: (number | null)[];
  readonly won: number[];
}

export function displayOf(state: SpadesState, pending: readonly SpadesEvent[]): SpadesDisplay {
  const hands = state.hands.map((h) => [...h]);
  let trick = [...state.trick];
  const bids = [...state.bids];
  const won = tricksWon(state);
  for (const e of [...pending].reverse()) {
    switch (e.type) {
      case 'deal':
        hands.forEach((h) => h.splice(0));
        trick = [];
        // The last hand's bids and tricks, as they stood at its end.
        for (let i = 0; i < 4; i++) {
          bids[i] = state.results[e.handNo - 1]?.bids[i] ?? null;
          won[i] = state.results[e.handNo - 1]?.tricks[i] ?? 0;
        }
        break;
      case 'trick':
        trick = [...e.plays];
        won[e.winner] = (won[e.winner] ?? 0) - 1;
        break;
      case 'play':
        trick = trick.filter((p) => p.card !== e.card);
        hands[e.seat]?.push(e.card);
        break;
      case 'bid':
        bids[e.seat] = null;
        break;
      default:
        break;
    }
  }
  return { hands, trick, bids, won };
}

export function SpadesSurface({ state, mySeats, canAct, legal, anim, onAction, onSkip, helps, names }: SurfaceProps<SpadesState, SpadesAction, SpadesEvent>) {
  const me: Seat = mySeats[0] ?? 0;
  const pending = anim.pending.map((p) => p.event);
  const d = displayOf(state, pending);
  const settled = anim.playing === null && pending.length === 0;
  const pairs = state.config.partners === 'pairs';
  const playable = new Set<Card>(legal.flatMap((a) => (a.type === 'play' ? [a.card] : [])));
  const bidding = canAct && settled && state.phase === 'bid';
  const bids = new Set(legal.flatMap((a) => (a.type === 'bid' ? [a.n] : [])));
  const blindChoice = legal.some((a) => a.type === 'blind' || a.type === 'look');
  const playing = anim.playing?.event ?? null;
  const handOver = playing?.type === 'hand-end' ? playing : null;
  const led = d.trick[0];
  const wins = (card: Card) => helps.whatWins === true && led !== undefined && canAct && playable.has(card) && trickWinner([...d.trick, { seat: me, card }], TRUMP) === me;
  const bidText = (b: number | null, seat: Seat) => (b === null ? t('spades.tag.no-bid') : b === 0 ? (state.blind[seat] ? t('spades.blind') : t('spades.nil')) : String(b));

  return (
    <TrickTable
      hands={d.hands}
      me={me}
      open={helps.openHand === true}
      trick={d.trick}
      playable={playable}
      canAct={canAct && settled && state.phase === 'play'}
      onPlay={(card) => onAction({ type: 'play', card })}
      onSkip={onSkip}
      busy={anim.playing !== null}
      duration={anim.playing ? anim.duration : 220}
      hideMine={blindChoice}
      tone={(card) => (wins(card) ? 'win' : null)}
      tag={(seat) => ({
        name: seatLabel(seat, me, names, pairs),
        detail: t('spades.tag', { bid: bidText(d.bids[seat] ?? null, seat), won: d.won[seat] ?? 0 }),
        turn: settled && !state.over && (state.phase === 'bid' ? (state.dealer + 1 + state.bids.filter((b) => b !== null).length) % 4 === seat : (state.leader + state.trick.length) % 4 === seat),
      })}
    >
      {bidding && blindChoice ? (
        <div className="trick-action">
          <p className="trick-action-note">{t('spades.blind.note')}</p>
          <div className="row" style={{ gap: 'var(--sp-2)', justifyContent: 'center' }}>
            <button type="button" className="btn btn-small" onClick={() => onAction({ type: 'blind' })}>
              {t('spades.blind.bid')}
            </button>
            <button type="button" className="btn btn-primary btn-small" onClick={() => onAction({ type: 'look' })}>
              {t('spades.blind.look')}
            </button>
          </div>
        </div>
      ) : null}
      {bidding && !blindChoice ? (
        <div className="trick-action bid-panel" role="group" aria-label={t('spades.bid.label')}>
          <p className="trick-action-note">{t('spades.bid.note')}</p>
          <div className="bid-grid">
            {Array.from({ length: HAND_SIZE + 1 }, (_, n) => n).map((n) => (
              <button key={n} type="button" className="btn btn-small bid-btn" disabled={!bids.has(n)} onClick={() => onAction({ type: 'bid', n })} aria-label={n === 0 ? t('spades.bid.nil') : t('spades.bid.n', { n })}>
                {n === 0 ? t('spades.nil') : n}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {handOver ? (
        <div className="hand-over trick-hand-over" role="status">
          <p>{t('spades.hand-over')}</p>
          <ul>
            {Array.from({ length: sideCount(state.config) }, (_, side) => side).map((side) => {
              const members = membersOf(state.config, side);
              const name = pairs ? (members.includes(me) ? t('spades.side.us') : t('spades.side.them')) : seatLabel(members[0] ?? 0, me, names);
              const bid = members.reduce((a, m) => a + (handOver.result.bids[m] ?? 0), 0);
              const took = members.reduce((a, m) => a + (handOver.result.tricks[m] ?? 0), 0);
              return (
                <li key={side}>
                  <span>{name}</span>
                  <span className="num faint">{t('spades.hand-over.line', { bid, took })}</span>
                  <b className="num">{(handOver.result.deltas[side] ?? 0) > 0 ? '+' : ''}{handOver.result.deltas[side] ?? 0}</b>
                  <span className="num faint">{handOver.scores[side] ?? 0}</span>
                </li>
              );
            })}
          </ul>
          {handOver.result.penalties.some((p) => p > 0) ? <p className="faint">{tDynamic('spades.hand-over.bags')}</p> : null}
        </div>
      ) : null}
      {sideOf(state.config, me) >= 0 && state.phase === 'bid' && !bidding && settled && !state.over ? <p className="trick-wait">{t('spades.bid.waiting')}</p> : null}
    </TrickTable>
  );
}
