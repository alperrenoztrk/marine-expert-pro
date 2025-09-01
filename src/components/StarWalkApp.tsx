import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Camera, 
  Map, 
  Search, 
  Clock, 
  Star, 
  Settings, 
  Info,
  MapPin,
  Compass,
  Eye,
  BookOpen
} from 'lucide-react';
import { EnhancedCelestialAROverlay } from './EnhancedCelestialAROverlay';
import { StarSearchAndCatalog } from './StarSearchAndCatalog';
import { CelestialTimeTravel } from './CelestialTimeTravel';
import { StarMapView } from './StarMapView';
import { SextantCamera } from './SextantCamera';
import { 
  EnhancedCelestialBody,
  getAllEnhancedCelestialBodies
} from '@/utils/enhancedCelestialCalculations';
import { ObserverPosition } from '@/utils/celestialCalculations';

interface StarWalkAppProps {
  className?: string;
}

export const StarWalkApp: React.FC<StarWalkAppProps> = ({
  className = ""
}) => {
  const [observerPosition, setObserverPosition] = useState<ObserverPosition>({
    latitude: 41.0082, // Istanbul coordinates as default
    longitude: 28.9784,
    dateTime: new Date(),
    timeZone: 3
  });
  
  const [deviceOrientation, setDeviceOrientation] = useState({
    alpha: 0, // compass direction
    beta: 0,  // front-back tilt
    gamma: 0  // left-right tilt
  });
  
  const [selectedObject, setSelectedObject] = useState<EnhancedCelestialBody | null>(null);
  const [currentTab, setCurrentTab] = useState('ar');
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [orientationPermission, setOrientationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setObserverPosition(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationPermission('granted');
        },
        (error) => {
          console.warn('Konum alınamadı:', error);
          setLocationPermission('denied');
        }
      );
    }
  }, []);

  // Get device orientation
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      setDeviceOrientation({
        alpha: event.alpha || 0,
        beta: event.beta || 0,
        gamma: event.gamma || 0
      });
    };

    // Request permission for iOS 13+
    const requestOrientationPermission = async () => {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          setOrientationPermission(permission);
          if (permission === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        } catch (error) {
          console.warn('Oryantasyon izni alınamadı:', error);
          setOrientationPermission('denied');
        }
      } else {
        // For non-iOS devices
        window.addEventListener('deviceorientation', handleOrientation);
        setOrientationPermission('granted');
      }
    };

    requestOrientationPermission();

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Update time
  const handleTimeChange = (newDateTime: Date, bodies: EnhancedCelestialBody[]) => {
    setObserverPosition(prev => ({
      ...prev,
      dateTime: newDateTime
    }));
  };

  // Handle object selection
  const handleObjectSelection = (object: EnhancedCelestialBody) => {
    setSelectedObject(object);
  };

  // Request permissions
  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setObserverPosition(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setLocationPermission('granted');
        },
        (error) => {
          setLocationPermission('denied');
        }
      );
    }
  };

  const requestOrientationPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setOrientationPermission(permission);
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', (event) => {
            setDeviceOrientation({
              alpha: event.alpha || 0,
              beta: event.beta || 0,
              gamma: event.gamma || 0
            });
          });
        }
      } catch (error) {
        setOrientationPermission('denied');
      }
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-black text-white ${className}`}>
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-yellow-400" fill="currentColor" />
            <div>
              <h1 className="text-2xl font-bold">Göksel - Yıldız Tanıma</h1>
              <p className="text-sm text-gray-300">Star Walk benzeri yıldız keşif uygulaması</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              {observerPosition.latitude.toFixed(2)}°, {observerPosition.longitude.toFixed(2)}°
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Compass className="h-3 w-3 mr-1" />
              {deviceOrientation.alpha.toFixed(0)}°
            </Badge>
          </div>
        </div>
      </div>

      {/* Permission Requests */}
      {(locationPermission !== 'granted' || orientationPermission !== 'granted') && (
        <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">İzinler Gerekli</h3>
              <p className="text-sm text-gray-300">
                En iyi deneyim için konum ve cihaz oryantasyonu izinleri gereklidir.
              </p>
            </div>
            <div className="flex gap-2">
              {locationPermission !== 'granted' && (
                <Button size="sm" onClick={requestLocationPermission}>
                  Konum İzni
                </Button>
              )}
              {orientationPermission !== 'granted' && (
                <Button size="sm" onClick={requestOrientationPermission}>
                  Oryantasyon İzni
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/30 border border-white/10">
            <TabsTrigger value="ar" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              AR Kamera
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Yıldız Haritası
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Katalog
            </TabsTrigger>
            <TabsTrigger value="time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Zaman
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Bilgi
            </TabsTrigger>
          </TabsList>

          {/* AR Camera View */}
          <TabsContent value="ar" className="mt-4">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Artırılmış Gerçeklik Görünümü
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Kameranızı gökyüzüne yönlendirin ve yıldızları keşfedin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  {/* Use the existing SextantCamera but with enhanced overlay */}
                  <SextantCamera 
                    onHoMeasured={() => {}}
                    observerPosition={{
                      latitude: observerPosition.latitude,
                      longitude: observerPosition.longitude
                    }}
                    className="w-full h-full"
                  />
                  
                  {/* Enhanced AR Overlay */}
                  <EnhancedCelestialAROverlay
                    observerPosition={observerPosition}
                    deviceOrientation={deviceOrientation}
                    screenWidth={800}
                    screenHeight={500}
                    className="absolute inset-0"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Star Map View */}
          <TabsContent value="map" className="mt-4">
            <StarMapView
              observerPosition={observerPosition}
              selectedObject={selectedObject}
              onSelectObject={handleObjectSelection}
            />
          </TabsContent>

          {/* Star Catalog and Search */}
          <TabsContent value="catalog" className="mt-4">
            <StarSearchAndCatalog
              observerPosition={observerPosition}
              onSelectObject={handleObjectSelection}
            />
          </TabsContent>

          {/* Time Travel */}
          <TabsContent value="time" className="mt-4">
            <CelestialTimeTravel
              observerPosition={{
                latitude: observerPosition.latitude,
                longitude: observerPosition.longitude,
                timeZone: observerPosition.timeZone
              }}
              onTimeChange={handleTimeChange}
            />
          </TabsContent>

          {/* Information and Education */}
          <TabsContent value="info" className="mt-4">
            <div className="space-y-4">
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Göksel Hakkında
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Özellikler</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-400" />
                        50+ yıldız ve gök cismi veritabanı
                      </li>
                      <li className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-400" />
                        Artırılmış gerçeklik ile yıldız tanıma
                      </li>
                      <li className="flex items-center gap-2">
                        <Map className="h-4 w-4 text-green-400" />
                        İnteraktif yıldız haritası
                      </li>
                      <li className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-purple-400" />
                        Gelişmiş arama ve filtreleme
                      </li>
                      <li className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-400" />
                        Zaman yolculuğu özelliği
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Nasıl Kullanılır</h3>
                    <div className="space-y-3 text-sm text-gray-300">
                      <div>
                        <strong className="text-white">AR Kamera:</strong> Cihazınızı gökyüzüne yönlendirin. 
                        Yıldızlar, gezegenler ve takımyıldızlar otomatik olarak tanınacak ve etiketlenecektir.
                      </div>
                      <div>
                        <strong className="text-white">Yıldız Haritası:</strong> Geleneksel yıldız haritası görünümü. 
                        Yakınlaştırabilir, hareket ettirebilir ve nesneleri seçebilirsiniz.
                      </div>
                      <div>
                        <strong className="text-white">Katalog:</strong> Tüm gök cisimlerini arayın, filtreleyin 
                        ve detaylı bilgilerini görüntüleyin.
                      </div>
                      <div>
                        <strong className="text-white">Zaman:</strong> Geçmiş veya gelecekteki herhangi bir 
                        tarih ve saatte gökyüzünün nasıl göründüğünü keşfedin.
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">İpuçları</h3>
                    <ul className="space-y-1 text-sm text-gray-300">
                      <li>• En iyi yıldız gözlemi için şehir ışıklarından uzak durun</li>
                      <li>• Gece yarısından sonra daha fazla yıldız görünür</li>
                      <li>• Kış aylarında Orion takımyıldızı çok belirgindir</li>
                      <li>• Ay dolunayken yıldızlar daha az görünür</li>
                      <li>• Meteoloji durumu gözlemi etkiler</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {selectedObject && (
                <Card className="bg-black/20 border-white/10">
                  <CardHeader>
                    <CardTitle>Seçili Nesne: {selectedObject.commonName || selectedObject.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Tip:</strong> {selectedObject.type}</p>
                        <p><strong>Yükseklik:</strong> {selectedObject.altitude.toFixed(1)}°</p>
                        <p><strong>Azimuth:</strong> {selectedObject.azimuth.toFixed(1)}°</p>
                        {selectedObject.magnitude && (
                          <p><strong>Parlaklık:</strong> {selectedObject.magnitude.toFixed(1)} mag</p>
                        )}
                      </div>
                      <div>
                        {selectedObject.constellation && (
                          <p><strong>Takımyıldız:</strong> {selectedObject.constellation}</p>
                        )}
                        {selectedObject.distance && (
                          <p><strong>Uzaklık:</strong> {selectedObject.distance.toLocaleString()} ışık yılı</p>
                        )}
                        {selectedObject.spectralClass && (
                          <p><strong>Spektral Sınıf:</strong> {selectedObject.spectralClass}</p>
                        )}
                      </div>
                    </div>
                    
                    {selectedObject.description && (
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-sm text-gray-300">{selectedObject.description}</p>
                      </div>
                    )}
                    
                    {selectedObject.mythology && (
                      <div className="mt-3">
                        <h4 className="font-medium mb-1">Mitoloji</h4>
                        <p className="text-sm text-gray-300 italic">{selectedObject.mythology}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};