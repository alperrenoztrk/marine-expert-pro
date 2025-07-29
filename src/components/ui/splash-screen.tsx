import { useEffect, useState } from "react";
import { Anchor, Waves, Ship, Compass } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen = ({ onComplete, duration = 3000 }: SplashScreenProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Start animations
    setTimeout(() => setIsAnimating(true), 100);
    
    // Complete splash screen
    setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, duration);
  }, [onComplete, duration]);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isAnimating ? 'animate' : ''}`}>
      {/* Background */}
      <div className="splash-background">
        <div className="wave-animation">
          <svg viewBox="0 0 1200 120" className="wave-svg">
            <path
              d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.1)"
            />
            <path
              d="M0,80 C300,140 600,20 900,80 C1050,110 1150,50 1200,80 L1200,120 L0,120 Z"
              fill="rgba(255,255,255,0.05)"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="splash-content">
        {/* Logo Container */}
        <div className="logo-container">
          <div className="logo-circle">
            <div className="compass-ring"></div>
            <div className="anchor-icon">
              <Anchor className="w-12 h-12 text-white" />
            </div>
            
            <div className="floating-ship">
              <Ship className="w-8 h-8 text-cyan-200" />
            </div>
            
            <div className="floating-waves">
              <Waves className="w-8 h-8 text-blue-200" />
            </div>
            
            <div className="floating-compass">
              <Compass className="w-6 h-6 text-yellow-200" />
            </div>
          </div>
        </div>

        {/* App Title */}
        <div className="app-title">
          <h1 className="title-text">Maritime Calculator</h1>
          <p className="subtitle-text">Profesyonel Denizcilik Hesaplamaları</p>
        </div>

        {/* Loading Animation */}
        <div className="loading-container">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          
          <div className="loading-dots">
            <div className="dot dot-1"></div>
            <div className="dot dot-2"></div>
            <div className="dot dot-3"></div>
          </div>
          
          <p className="loading-text">Denizcilik modülleri yükleniyor...</p>
        </div>
      </div>

      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
};