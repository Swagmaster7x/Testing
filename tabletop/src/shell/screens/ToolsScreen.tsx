import { t } from '../../text';
import { Screen } from './common';

export function ToolsScreen() {
  return (
    <Screen label={t('tools.title')}>
      <header className="screen-head">
        <h1>{t('tools.title')}</h1>
      </header>
      <section className="card" style={{ maxWidth: 620 }}>
        <p className="muted" style={{ marginBottom: 'var(--sp-3)' }}>
          {t('tools.body')}
        </p>
        <ul className="checklist">
          <li>
            <span className="status status-quiet">{t('status.coming')}</span>
            {t('tools.list.scorepads')}
          </li>
          <li>
            <span className="status status-quiet">{t('status.coming')}</span>
            {t('tools.list.timer')}
          </li>
          <li>
            <span className="status status-quiet">{t('status.coming')}</span>
            {t('tools.list.calculators')}
          </li>
        </ul>
      </section>
    </Screen>
  );
}
