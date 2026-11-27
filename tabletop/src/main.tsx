import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './shell/App';
import { isNativeApp } from './shell/platform';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/shell.css';
import './styles/table.css';
import './styles/board.css';

const root = document.getElementById('root');
if (!root) throw new Error('The page has no #root element');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline install for the web build. The APK serves its files from the app itself.
if (import.meta.env.PROD && 'serviceWorker' in navigator && !isNativeApp()) {
  navigator.serviceWorker.register('./sw.js').catch((err: unknown) => console.warn('Offline install is not available:', err));
}
