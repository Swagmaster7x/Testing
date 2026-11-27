import type { CapacitorConfig } from '@capacitor/cli';
import brand from './brand.json';

// The Android wrapper. The app id stays fixed even if the app is renamed, so a new build
// always installs over the old one and keeps its data.
const config: CapacitorConfig = {
  appId: 'com.personal.kibitz',
  appName: brand.name,
  webDir: 'dist',
  backgroundColor: '#15120e',
  android: {
    // The game makes no network requests; nothing loads over http.
    allowMixedContent: false,
    captureInput: false,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    // Full screen for the table: the system bars hide (MainActivity keeps them hidden), and
    // notch and camera cut-out sizes reach the page as safe-area insets.
    SystemBars: {
      hidden: true,
      style: 'DARK',
      insetsHandling: 'css',
      initialViewportFitValueHint: 'cover',
    },
  },
};

export default config;
