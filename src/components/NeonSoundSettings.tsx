import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export const NeonSoundSettings = () => {
  const { theme } = useTheme();
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const savedSoundSetting = localStorage.getItem('neonSoundEnabled');
    if (savedSoundSetting !== null) {
      setSoundEnabled(JSON.parse(savedSoundSetting));
    }
  }, []);

  const toggleSound = () => {
    const newSetting = !soundEnabled;
    setSoundEnabled(newSetting);
    localStorage.setItem('neonSoundEnabled', JSON.stringify(newSetting));
  };

  // Only show in neon theme
  if (theme !== 'neon') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSound}
        className="bg-slate-900/80 backdrop-blur-sm border border-cyan-400/50 hover:bg-slate-800/90 text-cyan-400 hover:text-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
      >
        {soundEnabled ? (
          <Volume2 className="h-5 w-5" />
        ) : (
          <VolumeX className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
};