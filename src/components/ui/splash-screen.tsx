import { useEffect, useState } from "react";
import { Anchor, Compass } from "lucide-react";
import "./splash-screen.css";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 5000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showWaves, setShowWaves] = useState(false);
  const [showTitle, setShowTitle] = useState(false);
  const [titleText, setTitleText] = useState("");
  const [fadeOut, setFadeOut] = useState(false);

  const fullTitle = "Maritime Calculator";
  const subtitle = "Professional Maritime Calculations";

  // Typewriter effect
  useEffect(() => {
    if (!showTitle) return;
    
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
  }, [showTitle, fullTitle]);

  useEffect(() => {
    // Enhanced animations sequence
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setIsAnimating(true), 150));
    timers.push(window.setTimeout(() => setShowWaves(true), 300));
    timers.push(window.setTimeout(() => setShowLogo(true), 600));
    timers.push(window.setTimeout(() => setShowTitle(true), 1200));
    
    // Start fade out
    timers.push(window.setTimeout(() => setFadeOut(true), duration - 1200));
    
    // Complete splash screen
    timers.push(window.setTimeout(() => {
      setIsVisible(false);
      timers.push(window.setTimeout(onComplete, 1000));
    }, duration));

    return () => {
      timers.forEach(id => clearTimeout(id));
    };
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isAnimating ? 'animate' : ''} ${fadeOut ? 'fade-out' : ''}`}>
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
            <Compass className="compass-icon w-16 h-16 md:w-20 md:w-20" />
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
