import { useEffect } from 'react';

export const useFrameRate = () => {
  useEffect(() => {
    // Always set to maximum frame rate for optimal performance
    const maxFrameRate = 120;
    
    // Apply maximum frame rate to CSS custom property
    document.documentElement.style.setProperty('--frame-rate', `${maxFrameRate}`);
    
    // Update animation durations for maximum performance
    const baseDuration = 1000 / maxFrameRate; // ~8.33ms for 120 FPS
    document.documentElement.style.setProperty('--animation-duration', `${baseDuration}ms`);
    
    // Update transition durations for smooth performance
    document.documentElement.style.setProperty('--transition-duration', `${baseDuration * 2}ms`);
    
    // Save to localStorage for consistency
    localStorage.setItem('frameRate', maxFrameRate.toString());
  }, []);

  return {
    frameRate: 120,
    updateFrameRate: () => {} // No-op since we always use max
  };
};