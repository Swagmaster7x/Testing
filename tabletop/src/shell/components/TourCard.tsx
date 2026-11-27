/**
 * The first-run tour (milestone 16): a card at the top of Today, five short steps through the
 * app, each with a link to the place it describes. It never blocks the screen; "No thanks" or the
 * last step puts it away, and Settings can bring it back. Kept on the device, not per profile.
 */
import { useEffect, useState } from 'react';
import { appDb } from '../../store/db';
import { t } from '../../text';
import { href } from '../router';

export const TOUR_KEY = 'tour-done';
const STEPS = ['welcome', 'games', 'today', 'progress', 'tools'] as const;
type Step = (typeof STEPS)[number];
const LINK: Readonly<Record<Step, { to: string; label: 'tour.games.link' | 'tour.progress.link' | 'tour.tools.link' } | null>> = {
  welcome: null,
  games: { to: '/games', label: 'tour.games.link' },
  today: null,
  progress: { to: '/progress', label: 'tour.progress.link' },
  tools: { to: '/tools', label: 'tour.tools.link' },
};

export async function resetTour(): Promise<void> {
  await appDb().device.delete(TOUR_KEY);
}

export function TourCard() {
  const [state, setState] = useState<'loading' | 'done' | number>('loading');
  useEffect(() => {
    void appDb()
      .device.get(TOUR_KEY)
      .then((row) => setState(row?.value === true ? 'done' : 0));
  }, []);
  if (typeof state !== 'number') return null;
  const finish = () => {
    setState('done');
    void appDb().device.put({ key: TOUR_KEY, value: true });
  };
  const step = STEPS[state] as Step;
  const link = LINK[step];
  return (
    <section className="card tour-card" aria-labelledby="tour-title">
      <p className="eyebrow">{t('tour.step', { n: state + 1, of: STEPS.length })}</p>
      <h2 id="tour-title">{t(`tour.${step}.title`)}</h2>
      <p>{t(`tour.${step}.body`)}</p>
      <div className="tool-buttons">
        {state > 0 ? (
          <button type="button" className="btn btn-small" onClick={() => setState(state - 1)}>
            {t('tour.back')}
          </button>
        ) : (
          <button type="button" className="btn btn-small btn-quiet" onClick={finish}>
            {t('tour.skip')}
          </button>
        )}
        {link ? (
          <a className="btn btn-small" href={href(link.to)}>
            {t(link.label)}
          </a>
        ) : null}
        {state < STEPS.length - 1 ? (
          <button type="button" className="btn btn-small btn-primary" onClick={() => setState(state + 1)}>
            {t('tour.next')}
          </button>
        ) : (
          <button type="button" className="btn btn-small btn-primary" onClick={finish}>
            {t('tour.done')}
          </button>
        )}
      </div>
    </section>
  );
}
