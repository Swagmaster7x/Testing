import type { IconName } from './components/Icon';
import { Icon } from './components/Icon';
import type { MessageKey } from '../text';
import { t } from '../text';
import { href } from './router';
import { useApp } from './state';

const ITEMS: readonly { path: string; icon: IconName; label: MessageKey }[] = [
  { path: '/today', icon: 'today', label: 'nav.today' },
  { path: '/games', icon: 'games', label: 'nav.games' },
  { path: '/progress', icon: 'progress', label: 'nav.progress' },
  { path: '/tools', icon: 'tools', label: 'nav.tools' },
  { path: '/settings', icon: 'settings', label: 'nav.settings' },
];

/** The main navigation: a rail on the left in landscape, a bar along the bottom in portrait. */
export function NavRail({ section }: { section: string }) {
  const profile = useApp((s) => s.profile);
  const initial = profile?.name.trim().charAt(0).toUpperCase() ?? '?';
  return (
    <nav className="nav" aria-label={t('nav.label')}>
      <a className="nav-profile" href={href('/settings')} aria-label={t('nav.profile', { name: profile?.name ?? '' })} title={profile?.name}>
        {initial}
      </a>
      {ITEMS.map((item) => (
        <a key={item.path} className="nav-item" href={href(item.path)} aria-current={section === item.path ? 'page' : undefined}>
          <Icon name={item.icon} />
          <span>{t(item.label)}</span>
        </a>
      ))}
    </nav>
  );
}
