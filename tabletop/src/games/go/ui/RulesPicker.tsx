/**
 * "Rules at this table" for Go (PLAN.md 2.3): the board size and the named presets first, then
 * handicap and komi, and every other rule under "All the rules". Changing the preset resets the
 * rules to it; changing the handicap sets komi to the usual value for it.
 */
import { useId } from 'react';
import { Segmented } from '../../../shell/components/Segmented';
import { t, tDynamic } from '../../../text';
import { maxHandicap } from '../coords';
import type { GoConfig, GoPresetId, GoRules } from '../rules';
import { BOARD_SIZES, CAPTURE_TARGETS, makeConfig, PRESET_IDS, presetRules } from '../rules';
import './go.css';

const KOMI_CHOICES: readonly number[] = [0, 0.5, 5.5, 6, 6.5, 7, 7.5];

type Choice<T> = readonly { readonly value: T; readonly label: string }[];

function Select<T extends string | number | boolean>({ label, value, options, onChange }: { label: string; value: T; options: Choice<T>; onChange: (v: T) => void }) {
  const id = useId();
  return (
    <div className="go-rules-row">
      <label className="eyebrow" htmlFor={id}>
        {label}
      </label>
      <select id={id} value={String(value)} onChange={(e) => onChange((options.find((o) => String(o.value) === e.target.value) ?? options[0])?.value as T)}>
        {options.map((o) => (
          <option key={String(o.value)} value={String(o.value)}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

const yesNo: Choice<boolean> = [
  { value: true, label: t('common.on') },
  { value: false, label: t('common.off') },
];

/** One line saying what a preset does, for the picker and the reference card. */
export function rulesSummary(rules: GoRules): string {
  if (rules.captureTarget > 0) return t('go.rules.summary.capture', { n: rules.captureTarget });
  return t('go.rules.summary', {
    counting: tDynamic(`go.rules.scoring.${rules.scoring}`),
    komi: rules.komi,
    ko: tDynamic(`go.rules.ko.${rules.ko}`),
  });
}

export function GoRulesPicker({ value, onChange }: { value: GoConfig; onChange: (config: GoConfig) => void }) {
  const set = (changes: Partial<GoRules>) => onChange({ ...value, rules: { ...value.rules, ...changes } });
  const capture = value.rules.captureTarget > 0;
  const handicaps = [0, ...Array.from({ length: maxHandicap(value.size) - 1 }, (_, i) => i + 2)];
  return (
    <div className="go-rules">
      <div className="go-rules-row">
        <span className="eyebrow">{t('go.rules.board')}</span>
        <Segmented<number>
          label={t('go.rules.board')}
          options={BOARD_SIZES.map((s) => ({ value: s, label: t('go.size', { n: s }) }))}
          value={value.size}
          onChange={(size) => onChange({ ...value, size, handicap: Math.min(value.handicap, maxHandicap(size)) })}
        />
      </div>
      <Select<GoPresetId>
        label={t('go.rules.preset')}
        value={value.preset}
        options={PRESET_IDS.map((p) => ({ value: p, label: tDynamic(`go.preset.${p}`) }))}
        onChange={(preset) => onChange(makeConfig(value.size, preset, presetRules(preset, 0).captureTarget > 0 ? 0 : value.handicap))}
      />
      <p className="go-rules-note">{rulesSummary(value.rules)}</p>
      {capture ? (
        <div className="go-rules-row">
          <span className="eyebrow">{t('go.rules.target')}</span>
          <Segmented<number> label={t('go.rules.target')} options={CAPTURE_TARGETS.map((n) => ({ value: n, label: String(n) }))} value={value.rules.captureTarget} onChange={(n) => set({ captureTarget: n })} />
        </div>
      ) : (
        <>
          <div className="go-rules-row">
            <span className="eyebrow">{t('go.rules.handicap')}</span>
            <Segmented<number>
              label={t('go.rules.handicap')}
              options={handicaps.map((n) => ({ value: n, label: n === 0 ? t('go.rules.handicap.none') : String(n) }))}
              value={value.handicap}
              onChange={(handicap) => onChange({ ...value, handicap, rules: { ...value.rules, komi: presetRules(value.preset, handicap).komi } })}
            />
          </div>
          <Select<number> label={t('go.rules.komi')} value={value.rules.komi} options={(KOMI_CHOICES.includes(value.rules.komi) ? KOMI_CHOICES : [...KOMI_CHOICES, value.rules.komi]).map((k) => ({ value: k, label: String(k) }))} onChange={(komi) => set({ komi })} />
        </>
      )}
      <details>
        <summary className="eyebrow">{t('go.rules.all')}</summary>
        <div className="go-rules go-rules-all" style={{ marginTop: 'var(--sp-2)' }}>
          <Select<GoRules['scoring']> label={t('go.rules.scoring')} value={value.rules.scoring} options={(['area', 'territory'] as const).map((v) => ({ value: v, label: tDynamic(`go.rules.scoring.${v}`) }))} onChange={(scoring) => set({ scoring })} />
          <Select<GoRules['ko']> label={t('go.rules.ko')} value={value.rules.ko} options={(['positional', 'situational', 'simple'] as const).map((v) => ({ value: v, label: tDynamic(`go.rules.ko.${v}`) }))} onChange={(ko) => set({ ko })} />
          <Select<boolean> label={t('go.rules.suicide')} value={value.rules.suicide} options={yesNo} onChange={(suicide) => set({ suicide })} />
          <Select<GoRules['handicapPlacement']> label={t('go.rules.placement')} value={value.rules.handicapPlacement} options={(['fixed', 'free'] as const).map((v) => ({ value: v, label: tDynamic(`go.rules.placement.${v}`) }))} onChange={(handicapPlacement) => set({ handicapPlacement })} />
          <Select<GoRules['compensation']> label={t('go.rules.compensation')} value={value.rules.compensation} options={(['none', 'n', 'n-1'] as const).map((v) => ({ value: v, label: tDynamic(`go.rules.compensation.${v}`) }))} onChange={(compensation) => set({ compensation })} />
          <Select<GoRules['seki']> label={t('go.rules.seki')} value={value.rules.seki} options={(['count', 'neutral'] as const).map((v) => ({ value: v, label: tDynamic(`go.rules.seki.${v}`) }))} onChange={(seki) => set({ seki })} />
          <Select<boolean> label={t('go.rules.marking')} value={value.rules.marking} options={yesNo} onChange={(marking) => set({ marking })} />
          <Select<boolean> label={t('go.rules.pass-stones')} value={value.rules.passStones} options={yesNo} onChange={(passStones) => set({ passStones })} />
          <Select<boolean> label={t('go.rules.white-last')} value={value.rules.whitePassesLast} options={yesNo} onChange={(whitePassesLast) => set({ whitePassesLast })} />
        </div>
      </details>
    </div>
  );
}
