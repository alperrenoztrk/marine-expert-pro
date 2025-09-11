import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { Anchor, Compass } from "lucide-react";
import "./splash-screen.css";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
  allowSkip?: boolean;
  oncePerSession?: boolean;
}

const SESSION_KEY = "splashSeen:v2";

export const SplashScreen = ({ onComplete, duration = 5000, allowSkip = true, oncePerSession = true }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showWaves, setShowWaves] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);
  const reducedMotion = useRef(typeof window !== 'undefined' && 'matchMedia' in window ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false).current;
  const effectiveDuration = useMemo(() => (reducedMotion ? Math.min(duration, 1200) : duration), [duration, reducedMotion]);

  const fullTitle = "Maritime Calculator";
  const subtitle = "Professional Maritime Calculations";

  // Typewriter effect
  useEffect(() => {
    if (!showTitle) return;
    if (reducedMotion) {
      setTitleText(fullTitle);
      return;
    }
    let currentIndex = 0;
    const timer = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [showTitle, fullTitle, reducedMotion]);

  // Once-per-session fast path
  useEffect(() => {
    if (!oncePerSession) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setIsVisible(false);
        onComplete();
      }
    } catch {
      // no-op
    }
  }, [oncePerSession, onComplete]);

  const handleSkip = useCallback(() => {
    if (!isVisible) return;
    setFadeOut(true);
    window.setTimeout(() => {
      setIsVisible(false);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
      onComplete();
    }, 300);
  }, [isVisible, onComplete]);

  useEffect(() => {
    // Enhanced animations sequence
    const timers: number[] = [];

    if (!isVisible) return () => {};

    timers.push(window.setTimeout(() => setIsAnimating(true), 150));
    timers.push(window.setTimeout(() => setShowWaves(!reducedMotion), 300));
    timers.push(window.setTimeout(() => setShowLogo(true), reducedMotion ? 200 : 600));
    timers.push(window.setTimeout(() => setShowTitle(true), reducedMotion ? 300 : 1200));
    
    // Start fade out
    const fadeStart = Math.max(0, effectiveDuration - 1200);
    timers.push(window.setTimeout(() => setFadeOut(true), fadeStart));
    
    // Complete splash screen
    timers.push(window.setTimeout(() => {
      setIsVisible(false);
      try { sessionStorage.setItem(SESSION_KEY, '1'); } catch {}
      timers.push(window.setTimeout(onComplete, 300));
    }, effectiveDuration));

    return () => {
      timers.forEach(id => clearTimeout(id));
    };
  }, [onComplete, effectiveDuration, reducedMotion, isVisible]);

  // Keyboard skip support (Escape)
  useEffect(() => {
    if (!allowSkip || !isVisible) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [allowSkip, isVisible, handleSkip]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isAnimating ? 'animate' : ''} ${fadeOut ? 'fade-out' : ''}`} aria-busy="true" data-reduced-motion={reducedMotion ? 'true' : 'false'}>
      {allowSkip && (
        <button className="skip-button" onClick={handleSkip} aria-label="Skip splash screen" title="Skip">
          Skip
        </button>
      )}
      {/* Maritime Wave Background */}
      <div className="maritime-background">
        <div className={`wave-animation ${showWaves ? 'active' : ''}`}>
          <div className="wave wave-1"></div>
          <div className="wave wave-2"></div>
          <div className="wave wave-3"></div>
        </div>
        
        {/* Floating Maritime Elements */}
        <div className="maritime-particles">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className={`maritime-particle particle-${i + 1}`}>
              {i % 3 === 0 ? <Compass className="w-4 h-4" /> : 
               i % 3 === 1 ? <Anchor className="w-3 h-3" /> : 
               <div className="compass-dot"></div>}
            </div>
          ))}
        </div>
        
        {/* Enhanced gradient overlay */}
        <div className="enhanced-gradient-overlay"></div>
      </div>

      {/* Main Content Container */}
      <div className="splash-content">
        {/* Maritime Logo with Compass */}
        <div className={`logo-container ${showLogo ? 'show' : ''}`}>
          <div className="compass-ring">
            <Compass className="compass-icon w-16 h-16 md:w-20 md:h-20" />
            <div className="compass-glow"></div>
          </div>
          <div className="anchor-decoration">
            <Anchor className="anchor-icon w-12 h-12 md:w-14 md:h-14" />
          </div>
        </div>

        {/* Enhanced Typography */}
        <div className={`title-container ${showTitle ? 'show' : ''}`}>
          <h1 className="main-title">
            <span className="typewriter-text">{titleText}</span>
            <span className="cursor">|</span>
          </h1>
          <p className="subtitle">{subtitle}</p>
        </div>
      </div>

      {/* Enhanced Loading System */}
      <div className="loading-system">
        <div className="loading-compass">
          <Compass className="loading-compass-icon w-6 h-6" />
        </div>
        <div className="loading-bar">
          <div className="loading-progress"></div>
          <div className="loading-wave"></div>
        </div>
        <p className="loading-text">Initializing Maritime Systems...</p>
      </div>

      {/* Smooth Transition Overlay */}
      <div className={`transition-overlay ${fadeOut ? 'active' : ''}`}></div>
    </div>
  );
};
