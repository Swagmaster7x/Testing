/**
 * Pass-and-play in a game with hidden cards or tiles: the whole table is covered between two
 * people's turns, so nobody sees another's hand, until the next person says they hold the device.
 */
import type { ComponentType } from 'react';
import { t } from '../../text';
import { Icon } from '../components/Icon';
import { href } from '../router';

export function PassCover({ name, side, seat, SeatMark, backTo, onReady }: { name: string; side: string; seat: number; SeatMark: ComponentType<{ seat: number }>; backTo: string; onReady: () => void }) {
  return (
    <div className="pass-cover" role="main" aria-labelledby="pass-title">
      <div className="pass-card">
        <span className="pass-mark" aria-hidden="true">
          <SeatMark seat={seat} />
        </span>
        <h1 id="pass-title">{t('pnp.cover.title', { name })}</h1>
        <p>{t('pnp.cover.body', { name, side })}</p>
        <button type="button" className="btn btn-primary" onClick={onReady}>
          <Icon name="play" size={18} />
          {t('pnp.cover.ready', { name })}
        </button>
        <a className="link-button" href={href(backTo)}>
          {t('table.back')}
        </a>
      </div>
    </div>
  );
}
