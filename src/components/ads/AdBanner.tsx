import { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  style,
  className = ""
}: AdBannerProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // AdSense script'i sadece mevcut ve etkinse push et
      if (import.meta.env.VITE_ADS_ENABLED === 'true' && typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('Ad loading error:', error);
    }
  }, []);

  return (
    <>
    {import.meta.env.VITE_ADS_ENABLED !== 'true' ? null : (
    <Card className={`p-2 sm:p-3 bg-muted/30 border-dashed ${className}`}>
      <div className="text-center">
        <span className="text-xs text-muted-foreground mb-2 block">Advertisement</span>
        <div ref={adRef}>
          <ins
            className="adsbygoogle"
            style={{
              display: 'block',
              minHeight: '90px',
              backgroundColor: '#f8f9fa',
              ...style
            }}
            data-ad-client={import.meta.env.VITE_ADSENSE_CLIENT || ''}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive.toString()}
          />
        </div>
      </div>
    </Card>
    )}
    </>
  );
};

// Farklı reklam boyutları için hazır bileşenler
export const AdBannerMobile = () => (
  <AdBanner 
    slot="1234567890"
    format="auto"
    style={{ minHeight: '90px', width: '100%' }}
    className="my-4"
  />
);

export const AdBannerDesktop = () => (
  <AdBanner 
    slot="0987654321"
    format="rectangle"
    style={{ minHeight: '250px', width: '300px', margin: '0 auto' }}
    className="my-6"
  />
);

export const AdBannerInline = () => (
  <AdBanner 
    slot="1122334455"
    format="horizontal"
    style={{ minHeight: '90px', width: '100%' }}
    className="my-3"
  />
);