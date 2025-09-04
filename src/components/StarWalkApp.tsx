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
  requestDeviceOrientationPermission,
  addDeviceOrientationListener,
} from '@/utils/celestialCamera';
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

  // Get device orientation (centralized utils)
  useEffect(() => {
    let removeListener: (() => void) | null = null;
    (async () => {
      const granted = await requestDeviceOrientationPermission();
      setOrientationPermission(granted ? 'granted' : 'denied');
      if (granted) {
        removeListener = addDeviceOrientationListener(({ alpha, beta, gamma }) => {
          setDeviceOrientation({ alpha, beta, gamma });
        });
      }
    })();
    return () => {
      if (removeListener) removeListener();
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
    const granted = await requestDeviceOrientationPermission();
    setOrientationPermission(granted ? 'granted' : 'denied');
    if (granted) {
      addDeviceOrientationListener(({ alpha, beta, gamma }) => {
        setDeviceOrientation({ alpha, beta, gamma });
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-black text-white ${className}`}>
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-3 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" fill="currentColor" />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold truncate">Göksel - Yıldız Tanıma</h1>
              <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Star Walk benzeri yıldız keşif uygulaması</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs">
            <Badge variant="outline" className="text-xs whitespace-nowrap">
              <MapPin className="h-3 w-3 mr-1" />
              {observerPosition.latitude.toFixed(1)}°, {observerPosition.longitude.toFixed(1)}°
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
        <div className="bg-yellow-600/20 border-b border-yellow-500/30 p-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <h3 className="font-medium text-sm">İzinler Gerekli</h3>
              <p className="text-xs text-gray-300 mt-1">
                En iyi deneyim için konum ve cihaz oryantasyonu izinleri gereklidir.
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {locationPermission !== 'granted' && (
                <Button size="sm" onClick={requestLocationPermission} className="text-xs">
                  Konum İzni
                </Button>
              )}
              {orientationPermission !== 'granted' && (
                <Button size="sm" onClick={requestOrientationPermission} className="text-xs">
                  Oryantasyon İzni
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-2 sm:p-4 pb-20">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-black/30 border border-white/10 text-xs">
            <TabsTrigger value="ar" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">AR Kamera</span>
              <span className="sm:hidden">AR</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Map className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Yıldız Haritası</span>
              <span className="sm:hidden">Harita</span>
            </TabsTrigger>
            <TabsTrigger value="catalog" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Search className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Katalog</span>
              <span className="sm:hidden">Arama</span>
            </TabsTrigger>
            <TabsTrigger value="time" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Zaman</span>
              <span className="sm:hidden">Zaman</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Info className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Bilgi</span>
              <span className="sm:hidden">Bilgi</span>
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