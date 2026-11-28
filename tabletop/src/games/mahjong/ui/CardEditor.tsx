/**
 * Your American card (Tools): type in the card you own, one hand a line, checked as you type and
 * kept on this device. The yearly League card is sold and may not be copied, so the app ships only
 * its own practice card; this is how a player plays with the real one. Lazy-loaded.
 */
import { useMemo, useState } from 'react';
import { t, tDynamic } from '../../../text';
import { BackLink, Screen } from '../../../shell/screens/common';
import { parseCard } from '../american/card';
import { loadCard, saveCard } from '../american/card-store';
import { PRACTICE_CARD } from '../american/practice-card';
import { CardHandTiles } from './CardHand';

export function MahjongCardEditor() {
  const [saved, setSaved] = useState(() => loadCard());
  const [text, setText] = useState(saved);
  const { card, errors } = useMemo(() => parseCard(text), [text]);
  // The hands that read, even while other lines still need fixing.
  const readable = useMemo(() => parseCard(text.split('\n').filter((_, i) => !errors.some((e) => e.line === i + 1)).join('\n')).card, [text, errors]);
  const sections = useMemo(() => {
    const out = new Map<string, NonNullable<typeof readable>['hands'][number][]>();
    for (const h of readable?.hands ?? []) out.set(h.section, [...(out.get(h.section) ?? []), h]);
    return [...out.entries()];
  }, [readable]);
  const dirty = text !== saved;

  return (
    <Screen label={t('tools.card.title')}>
      <BackLink to="/tools" label={t('tools.title')} />
      <header className="screen-head">
        <h1>{t('tools.card.title')}</h1>
        <p>{t('tools.card.intro')}</p>
      </header>
      <div className="calc-grid">
        <section className="card stack" aria-label={t('tools.card.text')} style={{ gap: 'var(--sp-2)' }}>
          <label className="calc-field">
            <span className="eyebrow">{t('tools.card.text')}</span>
            <textarea className="field card-text" spellCheck={false} autoCapitalize="off" autoCorrect="off" rows={12} value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <p className="calc-status" role="status" data-ok={errors.length === 0}>
            {errors.length === 0 ? t('tools.card.ok', { n: card?.hands.length ?? 0 }) : errors.some((e) => e.code === 'empty') ? tDynamic('tools.card.error.empty') : errors.length === 1 ? t('tools.card.bad-one') : t('tools.card.bad', { n: errors.length })}
            {' '}
            {dirty ? t('tools.card.unsaved') : saved ? t('tools.card.saved') : ''}
          </p>
          {errors.filter((e) => e.code !== 'empty').length > 0 ? (
            <ul className="card-errors" aria-label={t('tools.card.problems')}>
              {errors
                .filter((e) => e.code !== 'empty')
                .map((e) => (
                  <li key={`${e.line}-${e.code}`} className="form-error">
                    {t('tools.card.error', { line: e.line, message: tDynamic(`tools.card.error.${e.code}`, { detail: e.detail }) })}
                  </li>
                ))}
            </ul>
          ) : null}
          <div className="tool-buttons">
            <button type="button" className="btn btn-small btn-primary" disabled={!dirty || errors.length > 0} onClick={() => saveCard(text) && setSaved(text)}>
              {t('tools.card.save')}
            </button>
            <button type="button" className="btn btn-small" onClick={() => setText(PRACTICE_CARD)}>
              {t('tools.card.practice')}
            </button>
            <button type="button" className="btn btn-small btn-quiet" onClick={() => setText('')}>
              {t('tools.card.clear')}
            </button>
          </div>
          <details className="card-guide">
            <summary>{t('tools.card.guide')}</summary>
            <ul>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <li key={i}>{tDynamic(`tools.card.guide.${i}`)}</li>
              ))}
            </ul>
          </details>
        </section>
        <section className="card stack" aria-label={t('tools.card.preview')} style={{ gap: 'var(--sp-2)' }}>
          <h2 className="calc-head">{readable?.title || t('tools.card.preview')}</h2>
          {sections.length === 0 ? <p className="muted">{t('tools.card.none')}</p> : null}
          {sections.map(([section, hands]) => (
            <div key={section} className="stack" style={{ gap: 4 }}>
              {section ? <h3 className="eyebrow">{section}</h3> : null}
              {hands.map((h) => (
                <CardHandTiles key={h.id} hand={h} width={15} />
              ))}
            </div>
          ))}
        </section>
      </div>
    </Screen>
  );
}
