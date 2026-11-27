/**
 * Chips (PLAN.md 2.9 and M5): a stack drawn for an amount, and the bet controls a person uses to
 * fold, check, call or raise, with size presets and a slider. Play chips only: the app has nothing
 * to buy and no money anywhere.
 */
import { useId, useState } from 'react';

/** Chip colours by value, largest first. */
const DENOMINATIONS: readonly { value: number; fill: string; edge: string }[] = [
  { value: 5000, fill: '#d9822b', edge: '#7a4512' },
  { value: 1000, fill: '#e2c044', edge: '#7a6412' },
  { value: 500, fill: '#7d4fa8', edge: '#3c2153' },
  { value: 100, fill: '#2a2a2e', edge: '#c9c9cf' },
  { value: 25, fill: '#2f8a4c', edge: '#e9f4ec' },
  { value: 5, fill: '#c0392b', edge: '#f6e3e0' },
  { value: 1, fill: '#ecebe6', edge: '#4466aa' },
];

/** The chips that make up an amount, biggest first, at most `max` of them. */
export function chipsFor(amount: number, max = 6): string[] {
  const out: string[] = [];
  let left = amount;
  for (const d of DENOMINATIONS) {
    while (left >= d.value && out.length < max) {
      out.push(d.fill);
      left -= d.value;
    }
  }
  return out;
}

function Chip({ fill, y }: { fill: string; y: number }) {
  const edge = DENOMINATIONS.find((d) => d.fill === fill)?.edge ?? '#fff';
  return (
    <g transform={`translate(0 ${y})`}>
      <ellipse cx="12" cy="6" rx="11" ry="5" fill={fill} stroke="rgb(0 0 0 / 0.45)" strokeWidth="0.8" />
      <ellipse cx="12" cy="6" rx="7" ry="3" fill="none" stroke={edge} strokeWidth="1.4" strokeDasharray="2.4 2.4" />
    </g>
  );
}

/** A small stack of chips with the amount beside it. */
export function ChipStack({ amount, label }: { amount: number; label?: string }) {
  const chips = chipsFor(amount).reverse();
  const h = 12 + chips.length * 3;
  return (
    <span className="chip-stack" aria-label={label}>
      <svg viewBox={`0 0 24 ${h}`} width="20" height={(20 * h) / 24} aria-hidden="true">
        {chips.map((fill, i) => (
          <Chip key={i} fill={fill} y={h - 12 - i * 3} />
        ))}
      </svg>
      <span className="chip-amount num">{amount}</span>
    </span>
  );
}

export interface BetOption {
  /** The bet or raise total this preset puts in. */
  readonly to: number;
  readonly label: string;
}

export interface BetControlsProps {
  readonly canFold: boolean;
  /** Chips to call; 0 means check. */
  readonly toCall: number;
  /** The least and most this seat may raise to, or null when it may not raise. */
  readonly raise: { readonly min: number; readonly max: number } | null;
  readonly unit: number;
  /** True when nobody has bet on this street (a bet, not a raise). */
  readonly opening: boolean;
  readonly presets: readonly BetOption[];
  readonly onFold: () => void;
  readonly onCall: () => void;
  readonly onRaise: (to: number) => void;
  readonly text: {
    readonly fold: string;
    readonly check: string;
    readonly call: (n: number) => string;
    readonly allInCall: (n: number) => string;
    readonly bet: (n: number) => string;
    readonly raise: (n: number) => string;
    readonly allIn: (n: number) => string;
    readonly size: string;
    readonly cancel: string;
  };
  /** Chips behind, to tell when a call is all-in. */
  readonly stack: number;
  /** The bet that puts every chip in, when the most allowed may be less (pot-limit, fixed-limit). Defaults to the most allowed. */
  readonly allInAt?: number;
  /** Fixed-limit: the only bets allowed, each a button of its own. */
  readonly fixed?: readonly number[];
}

/**
 * Fold, check or call, and raise: the raise button opens the sizing tray (presets and a slider) and
 * then confirms the size. Give it a new `key` for each decision so it starts from the minimum.
 */
export function BetControls(p: BetControlsProps) {
  const [sizing, setSizing] = useState(false);
  const [to, setTo] = useState(p.raise?.min ?? 0);
  const sliderId = useId();
  const min = p.raise?.min ?? 0;
  const max = p.raise?.max ?? 0;
  const snap = (x: number) => (x >= max ? max : Math.max(min, min + Math.round((x - min) / p.unit) * p.unit));
  const allIn = p.allInAt ?? max;
  const sizeText = (x: number) => (x >= allIn ? p.text.allIn(x) : p.opening ? p.text.bet(x) : p.text.raise(x));
  const callText = p.toCall === 0 ? p.text.check : p.toCall >= p.stack ? p.text.allInCall(p.stack) : p.text.call(p.toCall);
  return (
    <div className="bet-controls" data-sizing={sizing}>
      {sizing && p.raise ? (
        <div className="bet-tray" role="group" aria-label={p.text.size}>
          <div className="bet-presets">
            {p.presets.map((o) => (
              <button key={o.label} type="button" className="btn btn-small" aria-pressed={snap(o.to) === to} onClick={() => setTo(snap(o.to))}>
                {o.label}
              </button>
            ))}
          </div>
          <div className="bet-slider">
            <label htmlFor={sliderId} className="visually-hidden">
              {p.text.size}
            </label>
            <input id={sliderId} type="range" min={min} max={max} step={p.unit} value={to} onChange={(e) => setTo(snap(Number(e.target.value)))} />
          </div>
          <button type="button" className="btn btn-small bet-cancel" onClick={() => setSizing(false)}>
            {p.text.cancel}
          </button>
        </div>
      ) : null}
      <div className="bet-row bet-main">
        {p.canFold ? (
          <button type="button" className="btn btn-small bet-fold" onClick={p.onFold}>
            {p.text.fold}
          </button>
        ) : null}
        <button type="button" className="btn btn-small bet-call" onClick={p.onCall}>
          {callText}
        </button>
        {p.fixed && p.fixed.length > 0
          ? p.fixed.map((x) => (
              <button key={x} type="button" className="btn btn-small btn-primary bet-raise" onClick={() => p.onRaise(x)}>
                {sizeText(x)}
              </button>
            ))
          : null}
        {p.raise && !(p.fixed && p.fixed.length > 0) ? (
          <button type="button" className="btn btn-small btn-primary bet-raise" aria-expanded={sizing} onClick={() => (sizing ? p.onRaise(to) : min >= max ? p.onRaise(max) : setSizing(true))}>
            {sizing ? sizeText(to) : min >= max ? sizeText(max) : p.opening ? p.text.bet(min) + '…' : p.text.raise(min) + '…'}
          </button>
        ) : null}
      </div>
    </div>
  );
}
