import { useState, useEffect } from 'react';

interface AdConfig {
  enabled: boolean;
  frequency: number; // Kaç hesaplama sonrası reklam göster
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
  const [adConfig, setAdConfig] = useState<AdConfig>({
    enabled: import.meta.env.VITE_ADS_ENABLED === 'true',
    frequency: 3, // Her 3 hesaplamada bir reklam
    positions: ['after-calculation', 'between-cards', 'bottom-page'],
    mobileEnabled: true,
    desktopEnabled: true,
  });

  // LocalStorage'dan reklam ayarlarını yükle
  useEffect(() => {
    const savedConfig = localStorage.getItem('ad-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setAdConfig({ ...adConfig, ...parsed });
      } catch (error) {
        console.error('Ad config parse error:', error);
      }
    }

    const savedCount = localStorage.getItem('interaction-count');
    if (savedCount) {
      setInteractionCount(parseInt(savedCount, 10) || 0);
    }
  }, []);

  // Etkileşim sayısını takip et
  const trackInteraction = (action: string) => {
    const newCount = interactionCount + 1;
    setInteractionCount(newCount);
    localStorage.setItem('interaction-count', newCount.toString());
    
    // Analytics için
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ad_interaction', {
        event_category: 'engagement',
        event_label: action,
        value: newCount
      });
    }
  };

  // Reklam gösterilsin mi kontrol et
  const shouldShowAd = (position: string): boolean => {
    // Temel kontroller
    if (!adConfig.enabled) return false;
    if (!adConfig.positions.includes(position)) return false;

    // Cihaz kontrolü
    const isMobile = window.innerWidth < 768;
    if (isMobile && !adConfig.mobileEnabled) return false;
    if (!isMobile && !adConfig.desktopEnabled) return false;

    // Frekans kontrolü
    if (interactionCount > 0 && interactionCount % adConfig.frequency === 0) {
      return true;
    }

    // İlk ziyaret için özel durumlar
    if (interactionCount === 1 && position === 'after-calculation') {
      return true;
    }

    return false;
  };

  return {
    shouldShowAd,
    trackInteraction,
    adConfig,
    interactionCount
  };
};

// AdSense script loader
export const loadAdSenseScript = () => {
  if (typeof window === 'undefined') return;
  if (import.meta.env.VITE_ADS_ENABLED !== 'true') return;
  const clientId = import.meta.env.VITE_ADSENSE_CLIENT;
  if (!clientId || /X{6,}/.test(clientId)) return; // skip if placeholder or missing
  
  // Zaten yüklenmişse tekrar yükleme
  if (document.querySelector('script[src*="adsbygoogle"]')) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
  script.crossOrigin = 'anonymous';
  
  script.onload = () => {
    console.log('AdSense script loaded successfully');
  };
  
  script.onerror = () => {
    console.error('Failed to load AdSense script');
  };

  document.head.appendChild(script);
};

// AdMob için Capacitor entegrasyonu
export const initAdMob = async () => {
  try {
    // Capacitor AdMob plugin import (eğer kullanılacaksa)
    // const { AdMob } = await import('@capacitor-community/admob');
    
    // AdMob initialize
    // await AdMob.initialize({
    //   requestTrackingAuthorization: true,
    //   testingDevices: ['YOUR_TESTING_DEVICE_ID'],
    //   initializeForTesting: true,
    // });

    console.log('AdMob initialized for mobile app');
  } catch (error) {
    console.error('AdMob initialization error:', error);
  }
};