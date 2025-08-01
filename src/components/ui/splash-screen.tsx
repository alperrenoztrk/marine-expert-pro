import { useEffect, useState } from "react";
import { Anchor, Waves, Ship, Compass, Navigation } from "lucide-react";

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
    // Start animations sequence
    setTimeout(() => setIsAnimating(true), 100);
    setTimeout(() => setShowLogo(true), 300);
    setTimeout(() => setShowParticles(true), 800);
    
    // Start fade out
    setTimeout(() => setFadeOut(true), duration - 1000);
    
    // Complete splash screen
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, duration);
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isAnimating ? 'animate' : ''} ${fadeOut ? 'fade-out' : ''}`}>
      {/* Animated Background */}
      <div className="splash-background">
        <div className="gradient-overlay"></div>
        <div className="floating-elements">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`floating-element element-${i + 1}`}></div>
          ))}
        </div>
      </div>

      {/* Main Logo */}
      <div className={`main-logo ${showLogo ? 'show' : ''}`}>
        <div className="logo-orb">
          <div className="orb-ring orb-ring-1"></div>
          <div className="orb-ring orb-ring-2"></div>
          <div className="orb-ring orb-ring-3"></div>
          <div className="orb-center">
            <Navigation className="w-16 h-16 text-white" />
          </div>
        </div>
      </div>

      {/* Floating Icons */}
      <div className={`floating-icons ${showParticles ? 'show' : ''}`}>
        <div className="floating-icon ship-icon">
          <Ship className="w-16 h-16 text-cyan-300" />
        </div>
        <div className="floating-icon anchor-icon">
          <Anchor className="w-12 h-12 text-blue-300" />
        </div>
        <div className="floating-icon compass-icon">
          <Compass className="w-10 h-10 text-yellow-300" />
        </div>
        <div className="floating-icon waves-icon">
          <Waves className="w-12 h-12 text-indigo-300" />
        </div>
      </div>

      {/* Loading Bar */}
      <div className="loading-container">
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      </div>

      {/* Transition Overlay */}
      <div className={`transition-overlay ${fadeOut ? 'active' : ''}`}></div>
    </div>
  );
};