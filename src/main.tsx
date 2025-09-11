import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ErrorBoundary } from './components/ErrorBoundary'
 

console.log('[Main] Starting Maritime Calculator App v2...');

const container = document.getElementById("root");
if (!container) {
  throw new Error('Root element not found');
}

function Root() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}

createRoot(container).render(<Root />);

// Gracefully hide splash once the app mounts
const splashEl = document.getElementById('splash-root');
if (splashEl) {
  // Let first paint happen, then fade out
  requestAnimationFrame(() => {
    splashEl.classList.add('splash-hide');
    // Remove from DOM after transition
    setTimeout(() => splashEl.remove(), 600);
  });
}
