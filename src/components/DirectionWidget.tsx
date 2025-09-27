import React, { useState, useEffect } from 'react';
import { Compass, Navigation } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DirectionWidget = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = async () => {
    // DeviceOrientationEvent desteğini kontrol et
    if (!('DeviceOrientationEvent' in window)) {
      setError('Cihaz yönlendirme desteklenmiyor');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // iOS 13+ için izin kontrol et
    if ('requestPermission' in DeviceOrientationEvent) {
      try {
        // @ts-ignore - iOS 13+ için izin isteme
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          startListening();
        } else {
          setHasPermission(false);
          setError('Yönlendirme izni reddedildi');
        }
      } catch (err) {
        setHasPermission(false);
        setError('İzin alınamadı - HTTPS gerekli olabilir');
      }
    } else {
      // Android için direkt başlat
      setHasPermission(true);
      startListening();
    }
  };

  const startListening = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // iOS için webkitCompassHeading, Android için alpha
        let compass: number;
        if ((event as any).webkitCompassHeading !== undefined) {
          compass = (event as any).webkitCompassHeading;
        } else {
          compass = 360 - event.alpha;
        }
        setHeading(Math.round(compass));
        setError(null);
      } else {
        setError('Pusula verisi alınamıyor');
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);

    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  };

  const requestPermissionManually = async () => {
    if ('requestPermission' in DeviceOrientationEvent) {
      try {
        // @ts-ignore - iOS 13+ için izin isteme
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          setError(null);
          startListening();
        } else {
          setHasPermission(false);
          setError('Yönlendirme izni reddedildi');
        }
      } catch (err) {
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
          <Navigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Bu cihazda desteklenmiyor</p>
        </div>
      );
    }

    if (hasPermission === false) {
      return (
        <div className="text-center space-y-3">
          <Navigation className="h-8 w-8 mx-auto text-muted-foreground" />
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
          <Navigation className="h-8 w-8 mx-auto text-muted-foreground" />
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
          <Compass className="h-5 w-5" />
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