/** @jsxRuntime classic */
import React, { useState, useEffect } from 'react';
// Lightweight inline icons to avoid external dependency issues
const IconCompass: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="16 8 14 14 8 16 10 10 16 8"></polygon>
  </svg>
);
const IconNavigation: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
  </svg>
);
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { computeHeadingFromEvent, smoothAngle } from '@/utils/heading';

const DirectionWidget = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSupport = async () => {
      if (!('DeviceOrientationEvent' in window)) {
        setError('Cihaz yönlendirme desteklenmiyor');
        setIsSupported(false);
        return;
      }
      setIsSupported(true);

      // iOS 13+ permission
      const Doe: any = window.DeviceOrientationEvent as unknown;
      if (Doe && typeof Doe.requestPermission === 'function') {
        try {
          const permission = await Doe.requestPermission();
          if (permission === 'granted') {
            setHasPermission(true);
            startListening();
          } else {
            setHasPermission(false);
            setError('Yönlendirme izni reddedildi');
          }
        } catch {
          setHasPermission(false);
          setError('İzin alınamadı - HTTPS gerekli olabilir');
        }
      } else {
        setHasPermission(true);
        startListening();
      }
    };

    checkSupport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const h = computeHeadingFromEvent(event);
      if (h !== null) {
        setHeading((prev) => Math.round(smoothAngle(prev, h, 0.25)));
        setError(null);
      } else {
        setError('Pusula verisi alınamıyor');
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

    // Return cleanup function
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  };

  const requestPermissionManually = async () => {
    const Doe: any = window.DeviceOrientationEvent as unknown;
    if (Doe && typeof Doe.requestPermission === 'function') {
      try {
        const permission = await Doe.requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          setError(null);
          startListening();
        } else {
          setHasPermission(false);
          setError('Yönlendirme izni reddedildi');
        }
      } catch {
        setHasPermission(false);
        setError('İzin alınamadı - HTTPS gerekli');
      }
    }
  };

  const getCardinalDirection = (degrees: number) => {
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const renderContent = () => {
    if (!isSupported) {
      return (
        <div className="text-center space-y-2">
          <IconNavigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Bu cihazda desteklenmiyor</p>
        </div>
      );
    }

    if (hasPermission === false) {
      return (
        <div className="text-center space-y-3">
          <IconNavigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{error}</p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={requestPermissionManually}
            className="text-xs"
          >
            İzin Ver
          </Button>
        </div>
      );
    }

    if (error && hasPermission !== true) {
      return (
        <div className="text-center space-y-2">
          <IconNavigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      );
    }

    return (
      <div className="text-center space-y-2">
        <div className="text-3xl font-bold tabular-nums">
          {heading !== null ? `${heading}°` : '--°'}
        </div>
        {heading !== null && (
          <div className="text-sm text-muted-foreground">
            {getCardinalDirection(heading)}
          </div>
        )}
        {heading === null && hasPermission === true && (
          <p className="text-xs text-muted-foreground">Pusula verisi bekleniyor...</p>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <IconCompass className="h-5 w-5" />
          Yön
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default DirectionWidget;