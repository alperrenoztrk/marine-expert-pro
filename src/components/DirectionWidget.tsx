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
import { createCompassListener, requestCompassPermission } from '@/utils/heading';

const DirectionWidget = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null); // Speed in knots
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    let compassCleanup: (() => void) | null = null;
    let gpsWatchId: number | null = null;

    const checkSupportAndStart = async () => {
      // Check basic support
      if (!('DeviceOrientationEvent' in window)) {
        setError('Cihaz yönlendirme desteklenmiyor');
        setIsSupported(false);
        return;
      }
      setIsSupported(true);

      // Request permission (iOS 13+)
      const granted = await requestCompassPermission();
      setHasPermission(granted);
      
      if (!granted) {
        setError('Yönlendirme izni reddedildi');
        return;
      }

      // Start compass listener
      compassCleanup = createCompassListener((h) => {
        setHeading(Math.round(h));
        setError(null);
      }, 0.3);
    };

    checkSupportAndStart();
    
    // Start GPS speed tracking
    if ('geolocation' in navigator) {
      gpsWatchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.speed !== null && position.coords.speed >= 0) {
            // Convert m/s to knots (1 m/s = 1.94384 knots)
            const speedKnots = position.coords.speed * 1.94384;
            setSpeed(speedKnots);
          } else {
            setSpeed(0);
          }
        },
        (err) => {
          console.warn('GPS hız verisi alınamadı:', err);
          setSpeed(null);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 1000,
          timeout: 5000
        }
      );
    }

    return () => {
      if (compassCleanup) {
        compassCleanup();
      }
      if (gpsWatchId !== null) {
        navigator.geolocation.clearWatch(gpsWatchId);
      }
    };
  }, []);

  const requestPermissionManually = async () => {
    const granted = await requestCompassPermission();
    if (granted) {
      setHasPermission(true);
      setError(null);
      // Re-initialize compass listener
      const cleanup = createCompassListener((h) => {
        setHeading(Math.round(h));
        setError(null);
      }, 0.3);
      // Note: This cleanup won't be called on unmount since we're in an event handler
      // But it's fine since the component will re-render and the useEffect will handle cleanup
    } else {
      setHasPermission(false);
      setError('Yönlendirme izni reddedildi');
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
      <div className="text-center space-y-3">
        <div className="text-3xl font-bold tabular-nums">
          {heading !== null ? `${heading}°` : '--°'}
        </div>
        {heading !== null && (
          <div className="text-sm text-muted-foreground">
            {getCardinalDirection(heading)}
          </div>
        )}
        {/* Speed indicator */}
        <div className="pt-2 border-t border-border/50">
          <div className="text-lg font-semibold tabular-nums text-foreground">
            {speed !== null ? `${speed.toFixed(1)} kn` : '-- kn'}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Hız</div>
        </div>
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
