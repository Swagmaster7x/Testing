/**
 * The Blackjack coach in the rail: the basic-strategy chart for the rules at this table (computed
 * by expected value, with your hand's cell marked), the Hi-Lo running and true count (the tracker a
 * counter keeps in their head), the expected value of each move, and a three-step hint.
 */
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { HintBox } from '../../classic/ui/coach';
import { counts, currentHand, valuesFor } from '../bots';
import type { BlackjackState } from '../rules';
import { blackjack } from '../rules';
import type { Cell, ChartRow } from '../strategy';
import { chartCell, handTotal, strategyChart, UPCARDS } from '../strategy';

const CELL_TEXT: Readonly<Record<Cell, string>> = { H: 'H', S: 'S', Dh: 'D', Ds: 'Ds', P: 'P', Ph: 'Ph', Rh: 'R', Rs: 'Rs', Rp: 'Rp' };
const upLabel = (u: number) => (u === 1 ? 'A' : u === 10 ? '10' : String(u));

export function ChartTable({ rows, kind, mark }: { rows: readonly ChartRow[]; kind: 'hard' | 'soft' | 'pair'; mark: { value: number; col: number } | null }) {
  const label = (r: ChartRow) => (kind === 'pair' ? `${upLabel(r.value)},${upLabel(r.value)}` : kind === 'soft' ? `A,${r.value - 11}` : String(r.value));
  return (
    <table className="bj-chart" aria-label={tDynamic(`blackjack.chart.${kind}`)}>
      <thead>
        <tr>
          <th scope="col">{tDynamic(`blackjack.chart.${kind}.short`)}</th>
          {UPCARDS.map((u) => (
            <th key={u} scope="col">
              {upLabel(u)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.value} data-mark={mark?.value === r.value}>
            <th scope="row">{label(r)}</th>
            {r.cells.map((c, i) => (
              <td key={i} data-cell={c[0]} data-mark={mark?.value === r.value && mark.col === i}>
                {CELL_TEXT[c]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function BlackjackCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<BlackjackState>) {
  const me = seat ?? 0;
  const view = blackjack.view(state, me);
  const cur = currentHand(view);
  const up = view.dealer[0];
  const chart = strategyChart(state.config);
  const mine = cur && view.at?.box === me ? cur : null;
  const cell = mine && up ? chartCell(chart, mine.hand.cards, up, mine.can.split) : null;
  const kind = cell?.row.kind ?? 'hard';
  const rows = kind === 'pair' ? chart.pairs : kind === 'soft' ? chart.soft : chart.hard.filter((r) => r.value >= 8 && r.value <= 17);
  const c = counts(view);
  const values = mine ? valuesFor(view) : {};
  const decision = `${state.round}/${state.phase}/${state.at?.hand ?? 0}/${mine?.hand.cards.length ?? 0}`;
  const tot = mine ? handTotal(mine.hand.cards) : null;
  const look = mine && up && tot ? t('blackjack.coach.look', { hand: tot.soft ? t('blackjack.total.soft', { n: tot.total }) : String(tot.total), up: upLabel(UPCARDS[UPCARDS.indexOf(up[0] === 'A' ? 1 : ['T', 'J', 'Q', 'K'].includes(up[0] ?? '') ? 10 : Number(up[0]))] ?? 0) }) : t('blackjack.coach.look.bet');
  return (
    <div className="coach-panel">
      {seat === null || (state.phase !== 'play' && state.phase !== 'insurance') ? (
        <p className="empty-note">{t('blackjack.coach.wait')}</p>
      ) : (
        <HintBox decision={decision} ask={ask} look={state.phase === 'insurance' ? t('blackjack.coach.look.insurance') : look} describe={(a) => tDynamic(`blackjack.coach.move.${a}`)} markTraining={markTraining} setOverlay={setOverlay} samples={1} game="blackjack" />
      )}
      {helps.chart ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {tDynamic(`blackjack.chart.${kind}`)}
          </p>
          <ChartTable rows={rows} kind={kind} mark={cell ? { value: cell.row.value, col: cell.col } : null} />
          <p className="faint bj-legend">{t('blackjack.chart.legend')}</p>
        </div>
      ) : null}
      {helps.count ? (
        <dl className="facts coach-counts">
          <dt>{t('blackjack.coach.running')}</dt>
          <dd className="num">{c.running > 0 ? `+${c.running}` : c.running}</dd>
          <dt>{t('blackjack.coach.decks')}</dt>
          <dd className="num">{c.decksLeft.toFixed(1)}</dd>
          <dt>{t('blackjack.coach.true')}</dt>
          <dd className="num">{c.trueCount > 0 ? '+' : ''}{c.trueCount.toFixed(1)}</dd>
        </dl>
      ) : null}
      {helps.ev && mine ? (
        <dl className="facts coach-counts">
          {Object.entries(values).map(([m, v]) => (
            <div key={m} style={{ display: 'contents' }}>
              <dt>{t(`blackjack.move.${m as 'hit'}`)}</dt>
              <dd className="num">{v !== undefined ? `${v >= 0 ? '+' : ''}${(v * 100).toFixed(1)}%` : ''}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}
