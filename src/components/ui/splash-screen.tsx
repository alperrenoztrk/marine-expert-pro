import { useEffect, useState } from "react";
import { Anchor } from "lucide-react";
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

      {/* Main Anchor Logo */}
      <div className={`main-logo ${showLogo ? 'show' : ''}`}>
        <div className="anchor-container">
          <Anchor className="w-64 h-64 text-blue-300" strokeWidth={2.5} />
        </div>
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