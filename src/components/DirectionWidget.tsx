import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DirectionWidget = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!('DeviceOrientationEvent' in window)) {
      setError('Cihaz yönlendirme desteklenmiyor');
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Android ve iOS için farklı hesaplama
        const compass = (event as any).webkitCompassHeading || (360 - event.alpha);
        setHeading(Math.round(compass));
        setError(null);
      }
    };

    const requestPermission = async () => {
      if ('requestPermission' in DeviceOrientationEvent) {
        try {
          // @ts-ignore - iOS 13+ için izin isteme
          const permission = await DeviceOrientationEvent.requestPermission();
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            setError('Yönlendirme izni reddedildi');
          }
        } catch (err) {
          setError('İzin alınamadı');
        }
      } else {
        // Android için direkt dinleme
        window.addEventListener('deviceorientation', handleOrientation);
      }
    };

    requestPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const getCardinalDirection = (degrees: number) => {
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
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
        {error ? (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold tabular-nums">
              {heading !== null ? `${heading}°` : '--°'}
            </div>
            {heading !== null && (
              <div className="text-sm text-muted-foreground">
                {getCardinalDirection(heading)}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DirectionWidget;