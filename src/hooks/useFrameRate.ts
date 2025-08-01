import { useState, useEffect } from 'react';

export const useFrameRate = () => {
  const [frameRate, setFrameRate] = useState(60);

  useEffect(() => {
    const savedFrameRate = localStorage.getItem('frameRate');
    if (savedFrameRate !== null) {
      setFrameRate(parseInt(savedFrameRate));
    }
  }, []);

  const updateFrameRate = (newFrameRate: number) => {
    setFrameRate(newFrameRate);
    localStorage.setItem('frameRate', newFrameRate.toString());
    
    // Apply frame rate to CSS custom property
    document.documentElement.style.setProperty('--frame-rate', `${newFrameRate}`);
    
    // Update animation durations based on frame rate
    const baseDuration = 1000 / newFrameRate; // Base duration in ms
    document.documentElement.style.setProperty('--animation-duration', `${baseDuration}ms`);
    
    // Update transition durations
    document.documentElement.style.setProperty('--transition-duration', `${baseDuration * 2}ms`);
  };

  return {
    frameRate,
    updateFrameRate
  };
};