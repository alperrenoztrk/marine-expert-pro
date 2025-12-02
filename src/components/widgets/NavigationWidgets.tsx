import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Navigation, Gauge } from "lucide-react";
import MetalCompassDial from "@/components/ui/MetalCompassDial";
import { computeHeadingFromEvent, smoothAngle } from "@/utils/heading";
import { Button } from "@/components/ui/button";

const NavigationWidgets: React.FC = () => {
  const [heading, setHeading] = useState<number | null>(null);
  const [speed, setSpeed] = useState<number | null>(null);
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
    
    // Start GPS speed tracking
    let watchId: number | null = null;
    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.speed !== null && position.coords.speed >= 0) {
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
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startListening = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const h = computeHeadingFromEvent(event);
      if (h !== null && isFinite(h)) {
        setHeading((prev) => Math.round(smoothAngle(prev, h, 0.3)));
        setError(null);
      } else {
        setError('Pusula verisi alınamıyor');
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, { passive: true });

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

  return (
    <div className="space-y-4" data-widget-container>
      {/* Compass Card with MetalCompassDial */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-2xl p-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Navigation className="h-5 w-5 text-primary animate-pulse" />
            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Pusula
            </div>
          </div>

          {!isSupported ? (
            <div className="text-center space-y-3 py-8">
              <Navigation className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">Bu cihazda desteklenmiyor</p>
            </div>
          ) : hasPermission === false ? (
            <div className="text-center space-y-4 py-8">
              <Navigation className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-xs text-muted-foreground">{error}</p>
              <Button 
                size="sm" 
                onClick={requestPermissionManually}
                className="glass-widget"
              >
                İzin Ver
              </Button>
            </div>
          ) : error && hasPermission !== true ? (
            <div className="text-center space-y-3 py-8">
              <Navigation className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <p className="text-xs text-muted-foreground">{error}</p>
            </div>
          ) : (
            <>
              {/* Metal Compass Dial */}
              <div className="flex justify-center">
                <MetalCompassDial 
                  headingDeg={heading ?? 0} 
                  className="h-64 w-64" 
                />
              </div>

              {/* Heading Display */}
              <div className="text-center space-y-2">
                <div className="font-mono text-5xl font-bold text-foreground animate-neon-glow">
                  {heading !== null ? `${heading}°` : '--°'}
                </div>
                {heading !== null && (
                  <div className="text-xl font-semibold text-muted-foreground uppercase tracking-widest">
                    {getCardinalDirection(heading)}
                  </div>
                )}
                {heading === null && hasPermission === true && (
                  <p className="text-xs text-muted-foreground">Pusula verisi bekleniyor...</p>
                )}
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Speed Card */}
      <Card className="glass-widget glass-widget-hover relative overflow-hidden rounded-xl p-5 shadow-lg group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <Gauge className="h-12 w-12 text-green-500 animate-float" />
            <div className="absolute inset-0 blur-xl opacity-40">
              <Gauge className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Hız
            </div>
            <div className="font-mono text-3xl font-bold text-foreground">
              {speed !== null ? `${speed.toFixed(1)}` : '--'}
              <span className="text-xl ml-1 text-muted-foreground">kn</span>
            </div>
            <div className="mt-2 w-full bg-muted/30 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (speed || 0) / 30 * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NavigationWidgets;
