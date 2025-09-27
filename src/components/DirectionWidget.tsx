import React, { useState, useEffect, useRef } from 'react';
import { Compass, Navigation, RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DirectionWidget = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const offsetRef = useRef(0);

  useEffect(() => {
    checkSupport();
  }, []);

  const checkSupport = () => {
    if (typeof window === 'undefined') return;
    
    if (!('DeviceOrientationEvent' in window)) {
      setError('Cihaz yönlendirme desteklenmiyor');
      setIsSupported(false);
      return;
    }

    // HTTPS kontrolü
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      setError('HTTPS bağlantısı gerekli');
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    requestPermission();
  };

  const requestPermission = async () => {
    try {
      // iOS 13+ için izin isteme
      if ('requestPermission' in DeviceOrientationEvent) {
        // @ts-ignore - iOS 13+ için izin isteme
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setHasPermission(true);
          startListening();
        } else {
          setHasPermission(false);
          setError('Yönlendirme izni reddedildi');
        }
      } else {
        // Android ve diğer cihazlar için direkt başlat
        setHasPermission(true);
        startListening();
      }
    } catch (err) {
      console.error('Permission error:', err);
      setHasPermission(false);
      setError('İzin alınamadı - HTTPS gerekli olabilir');
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let compassHeading = 0;

    try {
      // iOS için webkitCompassHeading kullan
      if ((event as any).webkitCompassHeading !== undefined) {
        compassHeading = (event as any).webkitCompassHeading;
      } 
      // Android ve diğerleri için alpha ve screen orientation kullan
      else if (event.alpha !== null) {
        const screenOrientation = (window.screen?.orientation?.angle) || 0;
        // Doğru Android hesaplaması
        compassHeading = (360 - event.alpha + screenOrientation) % 360;
      } else {
        throw new Error('Pusula verisi alınamıyor');
      }

      // Offset uygula
      const adjustedHeading = (compassHeading + offsetRef.current + 360) % 360;
      setHeading(Math.round(adjustedHeading));
      setError(null);
      
    } catch (err) {
      console.error('Orientation error:', err);
      setError('Pusula verisi işlenemedi');
    }
  };

  const handleOrientationAbsolute = (event: DeviceOrientationEvent) => {
    // deviceorientationabsolute daha doğru olabilir
    handleOrientation(event);
  };

  const startListening = () => {
    try {
      // Hem normal hem de absolute event'leri dinle
      window.addEventListener('deviceorientationabsolute', handleOrientationAbsolute, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
      
      // 5 saniye sonra veri gelmediyse hata göster
      setTimeout(() => {
        if (heading === null && hasPermission === true) {
          setError('Pusula verisi alınamıyor - cihazı hareket ettirin');
        }
      }, 5000);
      
    } catch (err) {
      console.error('Start listening error:', err);
      setError('Dinleme başlatılamadı');
    }
  };

  const stopListening = () => {
    window.removeEventListener('deviceorientationabsolute', handleOrientationAbsolute, true);
    window.removeEventListener('deviceorientation', handleOrientation, true);
  };

  // Component unmount'ta temizle
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  const calibrateCompass = () => {
    setIsCalibrating(true);
    // Kullanıcıya 8 şekli çizdirme
    setError('8 şekli çizerek cihazı kalibre edin...');
    
    // 10 saniye sonra kalibrasyonu bitir
    setTimeout(() => {
      setIsCalibrating(false);
      if (heading !== null) {
        // Kuzey'e göre ayarla (0 derece)
        offsetRef.current = (360 - heading) % 360;
        setError('Kalibrasyon tamamlandı');
        setTimeout(() => setError(null), 2000);
      }
    }, 10000);
  };

  const resetCalibration = () => {
    offsetRef.current = 0;
    setError('Kalibrasyon sıfırlandı');
    setTimeout(() => setError(null), 2000);
  };

  const getCardinalDirection = (degrees: number): string => {
    const directions = [
      'K',    // 0°   - Kuzey
      'KKD',  // 22.5°
      'KD',   // 45°
      'DKD',  // 67.5°
      'D',    // 90°  - Doğu
      'DGD',  // 112.5°
      'GD',   // 135°
      'GGD',  // 157.5°
      'G',    // 180° - Güney
      'GGB',  // 202.5°
      'GB',   // 225°
      'BGB',  // 247.5°
      'B',    // 270° - Batı
      'BBK',  // 292.5°
      'BK',   // 315°
      'KBK'   // 337.5°
    ];
    
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const renderContent = () => {
    if (!isSupported) {
      return (
        <div className="text-center space-y-2">
          <Navigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Bu cihazda desteklenmiyor</p>
          <p className="text-xs text-muted-foreground">HTTPS ve mobil cihaz gerekli</p>
        </div>
      );
    }

    if (hasPermission === false) {
      return (
        <div className="text-center space-y-3">
          <Navigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground mb-2">{error}</p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={requestPermission}
            className="text-xs"
          >
            Tekrar Dene
          </Button>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center space-y-2">
          <Navigation className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{error}</p>
          {!isCalibrating && (
            <div className="flex gap-2 justify-center">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={calibrateCompass}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Kalibre Et
              </Button>
            </div>
          )}
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
        {heading !== null && !isCalibrating && (
          <div className="flex gap-2 justify-center mt-2">
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={calibrateCompass}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Kalibre Et
            </Button>
            {offsetRef.current !== 0 && (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={resetCalibration}
                className="text-xs"
              >
                Sıfırla
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Compass className="h-5 w-5" />
          Dijital Pusula
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default DirectionWidget;