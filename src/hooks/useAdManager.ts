import { useState, useEffect } from 'react';

interface AdConfig {
  enabled: boolean;
  frequency: number;
  positions: string[];
  mobileEnabled: boolean;
  desktopEnabled: boolean;
}

interface AdManager {
  shouldShowAd: (position: string) => boolean;
  trackInteraction: (action: string) => void;
  adConfig: AdConfig;
  interactionCount: number;
}

export const useAdManager = (): AdManager => {
  const [interactionCount, setInteractionCount] = useState(0);
  const [adConfig] = useState<AdConfig>({
    enabled: false, // Basitleştirilmiş - reklam devre dışı
    frequency: 3,
    positions: ['after-calculation', 'between-cards', 'bottom-page'],
    mobileEnabled: true,
    desktopEnabled: true,
  });

  // Etkileşim sayısını takip et
  const trackInteraction = (action: string) => {
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);
  };

  // Basitleştirilmiş reklam kontrolü
  const shouldShowAd = (position: string): boolean => {
    return false; // Şimdilik reklam gösterme
  };

  return {
    shouldShowAd,
    trackInteraction,
    adConfig,
    interactionCount
  };
};