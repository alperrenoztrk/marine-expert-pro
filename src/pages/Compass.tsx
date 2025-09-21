import React, { useState, useEffect } from "react";
import { MobileLayout } from "@/components/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Smartphone } from "lucide-react";
import { Helmet } from "react-helmet-async";

const CompassPage: React.FC = () => {
  const [heading, setHeading] = useState<number>(0);
  
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [permission, setPermission] = useState<string>("unknown");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Check if device orientation is supported
    if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      setIsSupported(true);
      
      // Request permission for iOS devices
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        setPermission("pending");
      } else {
        startCompass();
      }
    }

    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Location error:", error)
      );
    }
  }, []);

  const requestPermission = async () => {
    try {
      const response = await (DeviceOrientationEvent as any).requestPermission();
      setPermission(response);
      if (response === 'granted') {
        startCompass();
      }
    } catch (error) {
      console.error('Permission request failed:', error);
      setPermission("denied");
    }
  };

  const startCompass = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        // Convert to 0-360 degrees
        let compassHeading = 360 - event.alpha;
        if (compassHeading >= 360) compassHeading -= 360;
        if (compassHeading < 0) compassHeading += 360;
        
        setHeading(Math.round(compassHeading));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  };

  const getCardinalDirection = (degrees: number): string => {
    const directions = ['K', 'KKD', 'KD', 'DKD', 'D', 'DGD', 'GD', 'GGD', 'G', 'GGB', 'GB', 'BGB', 'B', 'BBK', 'BK', 'KBK'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const formatCoordinate = (coord: number, type: 'lat' | 'lng'): string => {
    const abs = Math.abs(coord);
    const degrees = Math.floor(abs);
    const minutes = Math.floor((abs - degrees) * 60);
    const seconds = ((abs - degrees - minutes / 60) * 3600).toFixed(1);
    
    const direction = type === 'lat' 
      ? (coord >= 0 ? 'K' : 'G')
      : (coord >= 0 ? 'D' : 'B');
    
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  return (
    <MobileLayout>
      <Helmet>
        <title>Pusula - Maritime Calculator</title>
        <meta name="description" content="Gerçek zamanlı dijital pusula ve konum bilgileri" />
      </Helmet>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dijital Pusula</h1>
          <p className="text-muted-foreground">Gerçek zamanlı yön ve konum bilgileri</p>
        </div>

        {/* Compass Card */}
        <Card className="mx-auto max-w-sm">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Navigation className="h-5 w-5" />
              Pusula
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Compass Circle */}
            <div className="relative w-80 h-80 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-muted-foreground/30 bg-gradient-to-br from-background to-muted shadow-2xl">
                {/* Outer degree ring */}
                <div className="absolute inset-2 rounded-full">
                  {/* Degree numbers */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => (
                    <div
                      key={degree}
                      className="absolute text-xs font-bold text-muted-foreground"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) translate(0, -130px) rotate(${degree}deg) translate(0, 15px) rotate(${-degree}deg)`
                      }}
                    >
                      {degree}
                    </div>
                  ))}
                  
                  {/* Degree markers - small ticks */}
                  {Array.from({length: 72}, (_, i) => i * 5).map((degree) => (
                    <div
                      key={degree}
                      className={`absolute bg-muted-foreground/40 ${
                        degree % 30 === 0 ? 'w-0.5 h-6' : 'w-0.5 h-3'
                      }`}
                      style={{
                        top: '6px',
                        left: '50%',
                        transformOrigin: '50% 146px',
                        transform: `translateX(-50%) rotate(${degree}deg)`
                      }}
                    />
                  ))}
                </div>

                {/* Inner compass rose */}
                <div className="absolute inset-8 rounded-full border-2 border-muted-foreground/20 bg-gradient-to-br from-muted/10 to-muted/30">
                  {/* Cardinal directions - positioned correctly */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-red-500">K</div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-muted-foreground">G</div>
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-muted-foreground">D</div>
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-muted-foreground">B</div>
                  
                  {/* Cross lines */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-muted-foreground/20 transform -translate-y-0.5"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-muted-foreground/20 transform -translate-x-0.5"></div>
                </div>
                
                {/* Compass Needle */}
                <div
                  className="absolute top-1/2 left-1/2 transition-transform duration-500 ease-out"
                  style={{ transform: `rotate(${heading}deg)` }}
                >
                  {/* North pointing part (green with arrow) */}
                  <div className="relative -translate-x-1/2 -translate-y-12">
                    {/* Arrow tip */}
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-green-500 mx-auto"></div>
                    {/* Needle body */}
                    <div className="w-3 h-10 bg-green-500 shadow-md mx-auto"></div>
                  </div>
                  
                  {/* South pointing part (black with arrow) */}
                  <div className="relative -translate-x-1/2">
                    {/* Needle body */}
                    <div className="w-3 h-10 bg-black shadow-md mx-auto"></div>
                    {/* Arrow tip */}
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-black mx-auto"></div>
                  </div>
                </div>
                
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-foreground rounded-full shadow-lg border-2 border-background"></div>
              </div>
            </div>

            {/* Heading Display */}
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">{heading}°</div>
              <Badge variant="outline" className="text-lg px-4 py-1">
                {getCardinalDirection(heading)}
              </Badge>
            </div>

            {/* Permission Request */}
            {!isSupported && (
              <div className="text-center p-4 bg-muted rounded-lg">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Bu cihaz pusula sensörünü desteklemiyor
                </p>
              </div>
            )}

            {isSupported && permission === "pending" && (
              <Button onClick={requestPermission} className="w-full">
                Pusulayı Etkinleştir
              </Button>
            )}

            {permission === "denied" && (
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <p className="text-sm text-destructive">
                  Pusula izni reddedildi. Ayarlardan izin verin.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Location Card */}
        {coordinates && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Konum Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Enlem:</span>
                  <span className="font-mono">{formatCoordinate(coordinates.lat, 'lat')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Boylam:</span>
                  <span className="font-mono">{formatCoordinate(coordinates.lng, 'lng')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ondalık:</span>
                  <span className="font-mono">{coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Kullanım:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cihazınızı yatay tutun</li>
                <li>Manyetik alan kaynaklarından uzak durun</li>
                <li>Kırmızı ok kuzeyi gösterir</li>
                <li>Doğruluk için cihazınızı kalibre edin</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default CompassPage;