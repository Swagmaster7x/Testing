/**
 * The Mahjong score calculator in Tools (milestone 16): write down a winning hand from a real
 * table (the tiles in hand, the sets laid down, the flowers, how it was won) and get its patterns,
 * its value and who pays what, from the same rules file the app's table plays with. Lazy-loaded.
 */
import type { ReactNode } from 'react';
import { useState } from 'react';
import { t, tDynamic } from '../../../text';
import { Segmented } from '../../../shell/components/Segmented';
import { BackLink, Screen } from '../../../shell/screens/common';
import type { CalcInput, CalcSet } from '../calculator';
import { calculate, EMPTY_INPUT, overused, setFits, setKinds, tilesWanted } from '../calculator';
import type { Kind } from '../core/tiles';
import { FLOWER_1, isBonus, PLAYING_KINDS } from '../core/tiles';
import { STYLES } from '../rules';
import { kindName, patternName, windName } from './names';
import { TileFace } from './tiles';

type AddMode = 'hand' | 'chow' | 'pung' | 'kong' | 'concealed-kong' | 'flower';
const FLOWERS: readonly Kind[] = Array.from({ length: 8 }, (_, i) => FLOWER_1 + i);
const KINDS: readonly Kind[] = Array.from({ length: PLAYING_KINDS }, (_, i) => i);

/** A control with its name shown above it. */
function Labelled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="calc-field">
      <span className="eyebrow">{label}</span>
      {children}
    </div>
  );
}

function Tile({ kind, label, onClick, selected = false }: { kind: Kind; label: string; onClick?: () => void; selected?: boolean }) {
  const face = (
    <span className="calc-tile-face" aria-hidden="true">
      <TileFace kind={kind} learner />
    </span>
  );
  if (!onClick)
    return (
      <span className="calc-tile" role="img" aria-label={label}>
        {face}
      </span>
    );
  return (
    <button type="button" className="calc-tile" aria-label={label} aria-pressed={selected} data-selected={selected} onClick={onClick}>
      {face}
    </button>
  );
}

export function MahjongCalculator() {
  const styleIds = Object.keys(STYLES);
  const [styleId, setStyleId] = useState(styleIds[0] ?? 'hong-kong');
  const style = STYLES[styleId] ?? Object.values(STYLES)[0];
  const [presetId, setPresetId] = useState(style?.presets[0]?.id ?? '');
  const [mode, setMode] = useState<AddMode>('hand');
  const [input, setInput] = useState<CalcInput>(EMPTY_INPUT);
  if (!style) return null;
  const options = style.presets.find((p) => p.id === presetId)?.options ?? style.defaults;
  const size = style.rules(options).handSize;
  const wanted = tilesWanted(input, size);
  const tooMany = overused(input);
  const update = (patch: Partial<CalcInput>) => setInput({ ...input, ...patch });

  const add = (kind: Kind) => {
    if (mode === 'flower') {
      update({ bonus: input.bonus.includes(kind) ? input.bonus.filter((k) => k !== kind) : [...input.bonus, kind] });
      return;
    }
    if (mode === 'hand') {
      update({ hand: [...input.hand, kind], winning: input.hand.length });
      return;
    }
    const type: CalcSet['type'] = mode === 'chow' ? 'chow' : mode === 'pung' ? 'pung' : 'kong';
    if (setFits(type, kind)) update({ sets: [...input.sets, { type, kind, concealed: mode === 'concealed-kong' }] });
  };

  const complete = wanted === 0 && tooMany === null && input.winning >= 0;
  const result = complete ? calculate(style, options, input) : null;
  const winds = (offset: number) => windName((input.seatWind + offset) % 4);
  const fromOptions = [{ value: 'self' as const, label: t('tools.calc.self') }, ...([1, 2, 3] as const).map((k) => ({ value: k, label: t('tools.calc.from', { wind: winds(k) }) }))];

  return (
    <Screen label={t('tools.calc.title')}>
      <BackLink to="/tools" label={t('tools.title')} />
      <header className="screen-head">
        <h1>{t('tools.calc.title')}</h1>
      </header>
      <div className="calc-grid">
        <section className="card" aria-label={t('tools.calc.hand')}>
          {styleIds.length > 1 ? <Segmented label={t('tools.calc.style')} value={styleId} options={styleIds.map((id) => ({ value: id, label: tDynamic(`tools.calc.style.${id}`) }))} onChange={(id) => (setStyleId(id), setPresetId(STYLES[id]?.presets[0]?.id ?? ''))} /> : null}
          <label className="calc-field">
            <span className="eyebrow">{t('tools.calc.rules')}</span>
            <select className="field" value={presetId} onChange={(e) => setPresetId(e.target.value)}>
              {style.presets.map((p) => (
                <option key={p.id} value={p.id}>
                  {tDynamic(`mahjong.preset.${p.id}`)}
                </option>
              ))}
            </select>
          </label>
          <h2 className="calc-head">{t('tools.calc.hand')}</h2>
          <div className="calc-row" aria-label={t('tools.calc.in-hand')}>
            {input.hand.map((k, i) => (
              <Tile key={i} kind={k} label={i === input.winning ? t('tools.calc.winning-tile', { tile: kindName(k) }) : kindName(k)} selected={i === input.winning} onClick={() => update({ winning: i })} />
            ))}
            {input.sets.map((s, i) => (
              <span key={`s${i}`} className="calc-set" data-concealed={s.concealed}>
                {setKinds(s).map((k, j) => (
                  <Tile key={j} kind={k} label={kindName(k)} />
                ))}
                <button type="button" className="btn btn-small btn-quiet" aria-label={t('tools.calc.remove-set', { n: i + 1 })} onClick={() => update({ sets: input.sets.filter((_, k) => k !== i) })}>
                  ×
                </button>
              </span>
            ))}
            {input.bonus.map((k) => (
              <Tile key={`b${k}`} kind={k} label={kindName(k)} onClick={() => update({ bonus: input.bonus.filter((x) => x !== k) })} />
            ))}
          </div>
          <p className="muted calc-status" role="status">
            {tooMany !== null ? t('tools.calc.too-many-of', { tile: kindName(tooMany) }) : wanted > 0 ? t('tools.calc.more', { n: wanted }) : wanted < 0 ? t('tools.calc.fewer', { n: -wanted }) : t('tools.calc.tap-winning')}
          </p>
          <div className="tool-buttons">
            <button type="button" className="btn btn-small" disabled={input.hand.length === 0} onClick={() => update({ hand: input.hand.slice(0, -1), winning: Math.min(input.winning, input.hand.length - 2) })}>
              {t('tools.calc.remove-last')}
            </button>
            <button type="button" className="btn btn-small btn-quiet" onClick={() => setInput({ ...EMPTY_INPUT, seatWind: input.seatWind, prevailingWind: input.prevailingWind })}>
              {t('tools.calc.clear')}
            </button>
          </div>
          <Labelled label={t('tools.calc.add-to')}>
            <Segmented
              label={t('tools.calc.add-to')}
              value={mode}
              options={(['hand', 'chow', 'pung', 'kong', 'concealed-kong', 'flower'] as const).map((m) => ({ value: m, label: tDynamic(`tools.calc.mode.${m}`) }))}
              onChange={setMode}
            />
          </Labelled>
          <div className="calc-picker" role="group" aria-label={t('tools.calc.picker')}>
            {(mode === 'flower' ? FLOWERS : KINDS).map((k) => (
              <Tile key={k} kind={k} label={t('tools.calc.add', { tile: kindName(k) })} selected={isBonus(k) && input.bonus.includes(k)} onClick={() => add(k)} />
            ))}
          </div>
        </section>
        <section className="card" aria-label={t('tools.calc.how')}>
          <div className="calc-result calc-result-top" aria-live="polite">
            {!complete ? (
              <p className="muted">{t('tools.calc.waiting')}</p>
            ) : result?.score === null || result === null ? (
              <p>{t('tools.calc.no-hand')}</p>
            ) : (
              <>
                <ul className="calc-lines">
                  {result.score.lines.map((l) => (
                    <li key={l.id}>
                      <span>{patternName(l.id)}</span>
                      <span className="num">{l.times && l.times > 1 ? `${l.value} × ${l.times}` : l.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="calc-total">
                  {t('tools.calc.total', { n: result.score.total, unit: result.score.unit })}
                  {result.score.limit ? ` · ${t('tools.calc.limit')}` : ''}
                </p>
                {result.belowMinimum ? (
                  <p className="form-error">{t('tools.calc.below')}</p>
                ) : (
                  <p className="num">
                    {t('tools.calc.base', { n: result.score.base })}
                    {' · '}
                    {result.payments.map((x, i) => `${windName((input.seatWind + i) % 4)}${i === 0 ? ` (${t('tools.calc.winner')})` : ''} ${x > 0 ? '+' : ''}${x}`).join(' · ')}
                  </p>
                )}
              </>
            )}
          </div>
          <Labelled label={t('tools.calc.seat')}>
            <Segmented label={t('tools.calc.seat')} value={input.seatWind} options={[0, 1, 2, 3].map((w) => ({ value: w, label: windName(w) }))} onChange={(seatWind) => update({ seatWind })} />
          </Labelled>
          <Labelled label={t('tools.calc.round')}>
            <Segmented label={t('tools.calc.round')} value={input.prevailingWind} options={[0, 1, 2, 3].map((w) => ({ value: w, label: windName(w) }))} onChange={(prevailingWind) => update({ prevailingWind })} />
          </Labelled>
          <Labelled label={t('tools.calc.how')}>
            <Segmented label={t('tools.calc.how')} value={input.from ?? 'self'} options={fromOptions} onChange={(v) => update({ from: v === 'self' ? null : v })} />
          </Labelled>
          <div className="tool-buttons">
            {(input.from === null ? (['lastTile', 'afterKong'] as const) : (['lastDiscard', 'robbed'] as const)).map((key) => (
              <button key={key} type="button" className="btn btn-small" aria-pressed={input[key]} data-on={input[key]} onClick={() => update({ [key]: !input[key] })}>
                {tDynamic(`tools.calc.${key}`)}
              </button>
            ))}
          </div>
        </section>
      </div>
    </Screen>
  );
}
