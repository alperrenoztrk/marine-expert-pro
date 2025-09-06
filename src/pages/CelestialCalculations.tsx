import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  BookOpen,
  Calculator,
  Navigation,
  Ruler
} from 'lucide-react';
import { EnhancedCelestialAROverlay } from '@/components/EnhancedCelestialAROverlay';
import { StarSearchAndCatalog } from '@/components/StarSearchAndCatalog';
import { CelestialTimeTravel } from '@/components/CelestialTimeTravel';
import { StarMapView } from '@/components/StarMapView';
import { SextantCamera } from '@/components/SextantCamera';
import { Sextant3D } from '@/components/Sextant3D';
import {
  requestDeviceOrientationPermission,
  addDeviceOrientationListener,
} from '@/utils/celestialCamera';
import { 
  EnhancedCelestialBody,
  getAllEnhancedCelestialBodies
} from '@/utils/enhancedCelestialCalculations';
import { ObserverPosition } from '@/utils/celestialCalculations';
import { useToast } from '@/hooks/use-toast';

export default function CelestialCalculations() {
  const { toast } = useToast();
  
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

  // Sextant calculations
  const [sextantReadings, setSextantReadings] = useState({
    observedAltitude: '',
    indexError: '',
    dip: '',
    refraction: '',
    semiDiameter: '',
    parallax: ''
  });
  const [trueAltitude, setTrueAltitude] = useState<number | null>(null);

  // Celestial navigation calculations
  const [navInputs, setNavInputs] = useState({
    gha: '', // Greenwich Hour Angle
    sha: '', // Sidereal Hour Angle
    declination: '',
    assumedLatitude: '',
    assumedLongitude: ''
  });
  const [navResults, setNavResults] = useState<{
    lha: number;
    calculatedAltitude: number;
    calculatedAzimuth: number;
    intercept: number;
  } | null>(null);

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

  // Sextant calculations
  const calculateTrueAltitude = () => {
    const ho = parseFloat(sextantReadings.observedAltitude);
    const ie = parseFloat(sextantReadings.indexError) || 0;
    const dip = parseFloat(sextantReadings.dip) || 0;
    const refraction = parseFloat(sextantReadings.refraction) || 0;
    const sd = parseFloat(sextantReadings.semiDiameter) || 0;
    const parallax = parseFloat(sextantReadings.parallax) || 0;

    if (isNaN(ho)) {
      toast({ title: "Hata", description: "Lütfen geçerli yükseklik değeri girin", variant: "destructive" });
      return;
    }

    // True altitude formula: Ho ± IE ± Dip ± Refraction ± Semi-diameter ± Parallax
    const trueAlt = ho + ie - dip - refraction + sd + parallax;
    setTrueAltitude(trueAlt);
    
    toast({ 
      title: "Gerçek Yükseklik Hesaplandı", 
      description: `${trueAlt.toFixed(4)}°` 
    });
  };

  // Celestial navigation calculations
  const calculateCelestialNavigation = () => {
    const gha = parseFloat(navInputs.gha);
    const sha = parseFloat(navInputs.sha);
    const dec = parseFloat(navInputs.declination);
    const lat = parseFloat(navInputs.assumedLatitude);
    const lon = parseFloat(navInputs.assumedLongitude);

    if (isNaN(gha) || isNaN(dec) || isNaN(lat) || isNaN(lon)) {
      toast({ title: "Hata", description: "Lütfen tüm alanları doldurun", variant: "destructive" });
      return;
    }

    // Calculate LHA (Local Hour Angle)
    const lha = gha + (sha || 0) - lon;
    const lhaNormalized = ((lha % 360) + 360) % 360;

    // Calculate theoretical altitude using spherical trigonometry
    const latRad = (lat * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const lhaRad = (lhaNormalized * Math.PI) / 180;

    const sinAlt = Math.sin(latRad) * Math.sin(decRad) + 
                  Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad);
    const calculatedAlt = Math.asin(sinAlt) * (180 / Math.PI);

    // Calculate azimuth
    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / 
                  (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
    let azimuth = Math.acos(Math.abs(cosAz)) * (180 / Math.PI);
    
    // Determine quadrant for azimuth
    if (lhaNormalized > 180) {
      azimuth = 360 - azimuth;
    }

    const intercept = trueAltitude ? (trueAltitude - calculatedAlt) * 60 : 0; // in nautical miles

    setNavResults({
      lha: lhaNormalized,
      calculatedAltitude: calculatedAlt,
      calculatedAzimuth: azimuth,
      intercept
    });

    toast({ 
      title: "Göksel Navigasyon Hesaplandı", 
      description: `Intercept: ${intercept.toFixed(1)} mil` 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-white/10 p-3 sticky top-0 z-50">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-0 sm:justify-between">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-400" fill="currentColor" />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold truncate">Göksel Hesaplamalar</h1>
              <p className="text-xs sm:text-sm text-gray-300 hidden sm:block">Sextant, yıldız tanıma ve göksel navigasyon</p>
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
          <TabsList className="grid w-full grid-cols-6 bg-black/30 border border-white/10 text-xs">
            <TabsTrigger value="ar" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">AR Kamera</span>
              <span className="sm:hidden">AR</span>
            </TabsTrigger>
            <TabsTrigger value="sextant" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Ruler className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Sextant</span>
              <span className="sm:hidden">Sextant</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex flex-col sm:flex-row items-center gap-1 px-2 py-2">
              <Navigation className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Navigasyon</span>
              <span className="sm:hidden">Nav</span>
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
                  <SextantCamera 
                    onHoMeasured={() => {}}
                    observerPosition={{
                      latitude: observerPosition.latitude,
                      longitude: observerPosition.longitude
                    }}
                    className="w-full h-full"
                  />
                  
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

          {/* Sextant Calculations */}
          <TabsContent value="sextant" className="mt-4">
            <div className="space-y-4">
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Sextant Düzeltmeleri
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Gözlenen yüksekliği gerçek yüksekliğe çevirin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="observed-altitude">Gözlenen Yükseklik (Ho)</Label>
                      <Input
                        id="observed-altitude"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.observedAltitude}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          observedAltitude: e.target.value
                        }))}
                        placeholder="Derece cinsinden"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="index-error">Index Error (IE)</Label>
                      <Input
                        id="index-error"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.indexError}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          indexError: e.target.value
                        }))}
                        placeholder="Dakika cinsinden"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="dip">Dip Düzeltmesi</Label>
                      <Input
                        id="dip"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.dip}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          dip: e.target.value
                        }))}
                        placeholder="Dakika cinsinden"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="refraction">Refraksiyon Düzeltmesi</Label>
                      <Input
                        id="refraction"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.refraction}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          refraction: e.target.value
                        }))}
                        placeholder="Dakika cinsinden"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="semi-diameter">Yarı Çap (SD)</Label>
                      <Input
                        id="semi-diameter"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.semiDiameter}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          semiDiameter: e.target.value
                        }))}
                        placeholder="Güneş/Ay için"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parallax">Parallax Düzeltmesi</Label>
                      <Input
                        id="parallax"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.parallax}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          parallax: e.target.value
                        }))}
                        placeholder="Ay için"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={calculateTrueAltitude} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Gerçek Yükseklik Hesapla
                  </Button>
                  
                  {trueAltitude !== null && (
                    <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-400 mb-2">Gerçek Yükseklik (Ht)</h4>
                      <p className="text-2xl font-mono">{trueAltitude.toFixed(4)}°</p>
                      <p className="text-sm text-gray-300 mt-1">
                        {Math.floor(trueAltitude)}° {((trueAltitude % 1) * 60).toFixed(1)}'
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle>3D Sextant Modeli</CardTitle>
                  <CardDescription className="text-gray-300">
                    Interaktif sextant görselleştirmesi
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <Sextant3D
                    src="/sextant-golden-real.jpg"
                    alt="Golden Sextant"
                    className="w-64 h-64"
                    depthPx={40}
                    numLayers={16}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Celestial Navigation */}
          <TabsContent value="navigation" className="mt-4">
            <Card className="bg-black/20 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="h-5 w-5" />
                  Göksel Navigasyon Hesaplamaları
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Sight reduction ve intercept hesaplamaları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gha">GHA (Greenwich Hour Angle)</Label>
                    <Input
                      id="gha"
                      type="number"
                      step="0.1"
                      value={navInputs.gha}
                      onChange={(e) => setNavInputs(prev => ({
                        ...prev,
                        gha: e.target.value
                      }))}
                      placeholder="Derece cinsinden"
                      className="bg-black/40 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sha">SHA (Sidereal Hour Angle)</Label>
                    <Input
                      id="sha"
                      type="number"
                      step="0.1"
                      value={navInputs.sha}
                      onChange={(e) => setNavInputs(prev => ({
                        ...prev,
                        sha: e.target.value
                      }))}
                      placeholder="Yıldızlar için (opsiyonel)"
                      className="bg-black/40 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="declination">Declination (Dec)</Label>
                    <Input
                      id="declination"
                      type="number"
                      step="0.1"
                      value={navInputs.declination}
                      onChange={(e) => setNavInputs(prev => ({
                        ...prev,
                        declination: e.target.value
                      }))}
                      placeholder="Derece cinsinden"
                      className="bg-black/40 border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assumed-latitude">Tahmini Enlem</Label>
                    <Input
                      id="assumed-latitude"
                      type="number"
                      step="0.1"
                      value={navInputs.assumedLatitude}
                      onChange={(e) => setNavInputs(prev => ({
                        ...prev,
                        assumedLatitude: e.target.value
                      }))}
                      placeholder="Derece cinsinden"
                      className="bg-black/40 border-white/20"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="assumed-longitude">Tahmini Boylam</Label>
                    <Input
                      id="assumed-longitude"
                      type="number"
                      step="0.1"
                      value={navInputs.assumedLongitude}
                      onChange={(e) => setNavInputs(prev => ({
                        ...prev,
                        assumedLongitude: e.target.value
                      }))}
                      placeholder="Derece cinsinden"
                      className="bg-black/40 border-white/20"
                    />
                  </div>
                </div>
                
                <Button onClick={calculateCelestialNavigation} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Sight Reduction Hesapla
                </Button>
                
                {navResults && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4 space-y-3">
                    <h4 className="font-semibold text-blue-400 mb-2">Hesaplama Sonuçları</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>LHA:</strong> {navResults.lha.toFixed(1)}°</p>
                        <p><strong>Hesaplanan Yükseklik:</strong> {navResults.calculatedAltitude.toFixed(4)}°</p>
                      </div>
                      <div>
                        <p><strong>Azimuth:</strong> {navResults.calculatedAzimuth.toFixed(1)}°</p>
                        <p><strong>Intercept:</strong> {navResults.intercept.toFixed(1)} nm</p>
                      </div>
                    </div>
                  </div>
                )}
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
        </Tabs>
      </div>
    </div>
  );
}