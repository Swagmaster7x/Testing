import { useEffect } from 'react';
import { catalogGame } from '../games/catalog';
import { t } from '../text';
import { Toast } from './components/Toast';
import { useReducedMotion } from './motion';
import { NavRail } from './NavRail';
import { useRoute } from './router';
import { CenterMessage, Screen } from './screens/common';
import { GamesScreen } from './screens/GamesScreen';
import { HubScreen } from './screens/HubScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ReferenceScreen } from './screens/ReferenceScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TodayScreen } from './screens/TodayScreen';
import { ToolsScreen } from './screens/ToolsScreen';
import { useApp } from './state';
import { ReviewScreen } from './table/ReviewScreen';
import { TableScreen } from './table/TableScreen';

function NotFound() {
  return (
    <Screen label={t('app.not-found')}>
      <CenterMessage>
        <p>{t('app.not-found')}</p>
        <a className="btn" href="#/today">
          {t('app.back-to-today')}
        </a>
      </CenterMessage>
    </Screen>
  );
}

export function App() {
  const status = useApp((s) => s.status);
  const look = useApp((s) => s.settings?.look ?? 'club');
  const motion = useApp((s) => s.settings?.motion ?? 'system');
  const reduced = useReducedMotion(motion);
  const route = useRoute();

  useEffect(() => {
    void useApp.getState().init();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.look = look;
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
  }, [look, reduced]);

  if (status === 'loading') return <CenterMessage>{t('app.loading')}</CenterMessage>;
  if (status === 'failed') return <CenterMessage>{t('app.failed')}</CenterMessage>;

  const [first, second, third] = route.parts;

  // The table and review take the whole screen.
  if (first === 'play' && second) {
    return (
      <div className="app-full">
        <TableScreen recordId={second} />
        <Toast />
      </div>
    );
  }
  if (first === 'review' && second) {
    const ply = third !== undefined && /^\d+$/.test(third) ? Number(third) : null;
    return (
      <div className="app-full">
        <ReviewScreen recordId={second} ply={ply} />
        <Toast />
      </div>
    );
  }

  let section = `/${first ?? 'today'}`;
  let screen;
  switch (first) {
    case 'today':
      screen = <TodayScreen />;
      break;
    case 'games':
      if (second && third === 'reference') screen = <ReferenceScreen gameId={second} />;
      else if (second && !third) {
        const fen = route.query.get('fen');
        screen = <HubScreen gameId={second} seed={route.query.get('seed') ?? undefined} setup={fen ? { fen } : {}} />;
      }
      else if (!second) screen = <GamesScreen />;
      else screen = <NotFound />;
      if (second && catalogGame(second)?.onShelf === false) section = '/settings';
      break;
    case 'progress':
      screen = <ProgressScreen />;
      break;
    case 'tools':
      screen = <ToolsScreen />;
      break;
    case 'settings':
      screen = <SettingsScreen />;
      break;
    default:
      screen = <NotFound />;
  }

  return (
    <div className="app">
      <NavRail section={section} />
      {screen}
      <Toast />
    </div>
  );
}
