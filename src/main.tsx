import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Capacitor } from '@capacitor/core'
import { SplashScreen as NativeSplashScreen } from '@capacitor/splash-screen'
import { SplashScreen as UISplashScreen } from './components/ui/splash-screen'

console.log('[Main] Starting Maritime Calculator App v2...');

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

function Root() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && (
        <UISplashScreen onComplete={() => setShowSplash(false)} duration={3000} />
      )}
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </>
  );
}

createRoot(container).render(<Root />);

// Ensure native splash hides once the app is mounted (manual hide mode)
if (Capacitor.isNativePlatform()) {
  window.requestAnimationFrame(() => {
    NativeSplashScreen.hide({ fadeOutDuration: 300 });
  });
}
