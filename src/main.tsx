import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
import { weatherPreloader } from './services/weatherPreloader'
import { LocationProvider } from './contexts/LocationContext'

console.log('[Main] Starting Maritime Calculator App v2...');

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

function Root() {
  return (
    <ErrorBoundary>
      <LocationProvider>
        <App />
      </LocationProvider>
    </ErrorBoundary>
  );
}

// Start preloading weather data during splash screen
console.log('🌤️ [Main] Hava durumu preload başlatılıyor...');
weatherPreloader.preloadWeatherData();

createRoot(container).render(<Root />);

// Hide splash screen only after weather data is preloaded or timeout
const splashEl = document.getElementById('splash-root');
if (splashEl) {
  const hideSplash = () => {
    console.log('✅ [Main] Splash screen gizleniyor...');
    splashEl.classList.add('splash-hide');
    // Remove from DOM after transition
    setTimeout(() => splashEl.remove(), 600);
  };

  // Wait for preload to complete or timeout after 8 seconds
  const checkPreloadStatus = () => {
    if (weatherPreloader.isPreloadComplete()) {
      console.log('✅ [Main] Hava durumu preload tamamlandı, splash screen gizleniyor');
      setTimeout(hideSplash, 1000); // Show splash for at least 1 second
    } else {
      // Check again in 100ms
      setTimeout(checkPreloadStatus, 100);
    }
  };

  // Start checking after minimum splash time
  setTimeout(checkPreloadStatus, 1000);
  
  // Force hide after 8 seconds max
  setTimeout(() => {
    if (!splashEl.classList.contains('splash-hide')) {
      console.log('⏱️ [Main] Splash screen timeout, zorla gizleniyor');
      hideSplash();
    }
  }, 8000);
}
