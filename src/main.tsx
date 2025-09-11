import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Capacitor } from '@capacitor/core'
import { SplashScreen } from '@capacitor/splash-screen'

console.log('[Main] Starting Maritime Calculator App v2...');

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

createRoot(container).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

// Hide native splash as soon as React mounts (native only)
if (Capacitor.isNativePlatform()) {
  SplashScreen.hide().catch(() => {});
}
