import { useCallback, useState, useEffect } from 'react';
import { useTheme } from './useTheme';

// Neon sound effects using Web Audio API
const createNeonClickSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create oscillator for electronic click sound
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  // Connect nodes
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Set electronic sound properties
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
  
  // Set gain envelope for click effect
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
  
  // Start and stop
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.1);
};

const createNeonHoverSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Higher frequency for hover
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.05);
};

const createNeonSuccessSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Success sound - ascending tone
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
};

export const useNeonSound = () => {
  const { theme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('neonSoundEnabled');
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting));
    }
  }, []);
  
  const playNeonClick = useCallback(() => {
    if (theme === 'neon' && soundEnabled) {
      try {
        createNeonClickSound();
      } catch (error) {
        console.log('Neon sound not supported');
      }
    }
  }, [theme, soundEnabled]);
  
  const playNeonHover = useCallback(() => {
    if (theme === 'neon' && soundEnabled) {
      try {
        createNeonHoverSound();
      } catch (error) {
        console.log('Neon hover sound not supported');
      }
    }
  }, [theme, soundEnabled]);
  
  const playNeonSuccess = useCallback(() => {
    if (theme === 'neon' && soundEnabled) {
      try {
        createNeonSuccessSound();
      } catch (error) {
        console.log('Neon success sound not supported');
      }
    }
  }, [theme, soundEnabled]);
  
  return {
    playNeonClick,
    playNeonHover,
    playNeonSuccess,
    soundEnabled
  };
};