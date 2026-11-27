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
import { LearnScreen } from './screens/LearnScreen';
import { PracticeScreen } from './screens/PracticeScreen';
import { DrillScreen } from './practice/DrillScreen';
import { ProblemScreen } from './practice/ProblemScreen';
import { LessonScreen } from './learn/LessonScreen';
import { ProgressScreen } from './screens/ProgressScreen';
import { ReferenceScreen } from './screens/ReferenceScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TodayScreen } from './screens/TodayScreen';
import { BlindTimerScreen } from './tools/BlindTimerScreen';
import { PadScreen } from './tools/PadScreen';
import { ToolsScreen } from './tools/ToolsScreen';
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
  const deck = useApp((s) => s.settings?.deck ?? 'two');
  const reduced = useReducedMotion(motion);
  const route = useRoute();

  useEffect(() => {
    void useApp.getState().init();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.look = look;
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
    document.documentElement.dataset.deck = deck;
  }, [look, reduced, deck]);

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
  if (first === 'learn' && second) {
    return (
      <div className="app-full">
        <LessonScreen key={second} lessonId={second} />
        <Toast />
      </div>
    );
  }
  if (first === 'practice' && second && third) {
    return (
      <div className="app-full">
        {third.startsWith('drill-') ? (
          <DrillScreen key={`${second}/${third}`} gameId={second} drillId={third} seed={route.query.get('seed')} />
        ) : (
          <ProblemScreen key={`${second}/${third}/${route.query.get('theme') ?? ''}/${route.query.get('id') ?? ''}`} gameId={second} setId={third} theme={route.query.get('theme')} problemId={route.query.get('id')} />
        )}
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
      else if (second && third === 'learn') screen = <LearnScreen gameId={second} />;
      else if (second && third === 'practice') screen = <PracticeScreen gameId={second} />;
      else if (second && !third) {
        const fen = route.query.get('fen');
        // A starting position by link: FEN for chess, the game's own position text for others (?position=...).
        const position = route.query.get('position');
        screen = <HubScreen gameId={second} seed={route.query.get('seed') ?? undefined} setup={fen ? { fen } : position ? { position } : {}} />;
      }
      else if (!second) screen = <GamesScreen />;
      else screen = <NotFound />;
      if (second && catalogGame(second)?.onShelf === false) section = '/settings';
      break;
    case 'progress':
      screen = <ProgressScreen />;
      break;
    case 'tools':
      if (second === 'pad' && third) screen = <PadScreen key={third} padId={third} />;
      else if (second === 'timer') screen = <BlindTimerScreen />;
      else if (!second) screen = <ToolsScreen />;
      else screen = <NotFound />;
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
