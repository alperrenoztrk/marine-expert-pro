import { useEffect, useState } from "react";
import "./splash-screen.css";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 4000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start animations sequence with cleanup-safe timers
    const timers: number[] = [];

    timers.push(window.setTimeout(() => setIsAnimating(true), 100));
    timers.push(window.setTimeout(() => setShowLogo(true), 300));
    timers.push(window.setTimeout(() => setShowParticles(true), 800));
    
    // Start fade out
    timers.push(window.setTimeout(() => setFadeOut(true), duration - 1000));
    
    // Complete splash screen: hide self, then notify parent
    timers.push(window.setTimeout(() => {
      setIsVisible(false);
      timers.push(window.setTimeout(onComplete, 800));
    }, duration));

    return () => {
      // Clear all timers on unmount to avoid race conditions
      timers.forEach(id => clearTimeout(id));
    };
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isAnimating ? 'animate' : ''} ${fadeOut ? 'fade-out' : ''} relative`}>
      {/* Animated Background */}
      <div className="splash-background">
        <div className="gradient-overlay"></div>
        <div className="floating-elements">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`floating-element element-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Main Logo (Centered) */}
      <div className={`main-logo ${showLogo ? 'show' : ''} absolute inset-0 flex flex-col items-center justify-center text-center z-10`}>
        <div className="splash-title">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-teal-300 bg-clip-text text-transparent">
            Maritime Calculator
          </h1>
        </div>
      </div>

      {/* Loading Bar */}
      <div className="loading-container">
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>

      
      <div className="coral-decoration"></div>

      {/* Transition Overlay */}
      <div className={`transition-overlay ${fadeOut ? 'active' : ''}`}></div>
    </div>
  );
};
