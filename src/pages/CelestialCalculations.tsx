import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoordinateInput } from '@/components/ui/coordinate-input';
import { 
  Star, 
  Calculator,
  Navigation,
  Ruler
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  emptyDMS, 
  dmsToDecimal, 
  formatDecimalAsDMS,
  type DMSCoordinate 
} from '@/utils/coordinateUtils';

export default function CelestialCalculations() {
  const { toast } = useToast();
  
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
    declination: emptyDMS(true),
    assumedLatitude: emptyDMS(true),
    assumedLongitude: emptyDMS(false)
  });
  const [navResults, setNavResults] = useState<{
    lha: number;
    calculatedAltitude: number;
    calculatedAzimuth: number;
    intercept: number;
  } | null>(null);

  // Load saved values from localStorage
  useEffect(() => {
    try {
      const savedSextant = localStorage.getItem('celestial-sextant');
      const savedNav = localStorage.getItem('celestial-nav');
      
      if (savedSextant) {
        setSextantReadings(JSON.parse(savedSextant));
      }
      if (savedNav) {
        setNavInputs(JSON.parse(savedNav));
      }
    } catch (error) {
      console.error("Error loading saved celestial inputs:", error);
    }
  }, []);

  // Save sextant readings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('celestial-sextant', JSON.stringify(sextantReadings));
    } catch (error) {
      console.error("Error saving sextant readings:", error);
    }
  }, [sextantReadings]);

  // Save navigation inputs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('celestial-nav', JSON.stringify(navInputs));
    } catch (error) {
      console.error("Error saving navigation inputs:", error);
    }
  }, [navInputs]);

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
    const dec = dmsToDecimal(navInputs.declination);
    const lat = dmsToDecimal(navInputs.assumedLatitude);
    const lon = dmsToDecimal(navInputs.assumedLongitude);

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
        <div className="flex items-center gap-3">
          <Star className="h-6 w-6 text-yellow-400" fill="currentColor" />
          <div>
            <h1 className="text-lg font-bold">Göksel Hesaplamalar</h1>
            <p className="text-xs text-gray-300">Sextant ve göksel navigasyon</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 pb-20">
        <Tabs defaultValue="sextant" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 border border-white/10">
            <TabsTrigger value="sextant" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Sextant Hesaplamaları
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Göksel Navigasyon
            </TabsTrigger>
          </TabsList>

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
                        placeholder="Dakika cinsinden"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <Label htmlFor="parallax">Parallax</Label>
                      <Input
                        id="parallax"
                        type="number"
                        step="0.0001"
                        value={sextantReadings.parallax}
                        onChange={(e) => setSextantReadings(prev => ({
                          ...prev,
                          parallax: e.target.value
                        }))}
                        placeholder="Dakika cinsinden"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                  </div>

                  <Button onClick={calculateTrueAltitude} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Gerçek Yüksekliği Hesapla
                  </Button>

                  {trueAltitude !== null && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                      <h4 className="font-bold text-green-400">Sonuç</h4>
                      <p className="text-lg font-mono">
                        Gerçek Yükseklik: <span className="text-green-400">{trueAltitude.toFixed(4)}°</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Celestial Navigation */}
          <TabsContent value="navigation" className="mt-4">
            <div className="space-y-4">
              <Card className="bg-black/20 border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="h-5 w-5" />
                    Göksel Navigasyon Hesaplamaları
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    LHA, hesaplanan yükseklik ve azimut hesaplamaları
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gha">Greenwich Hour Angle (GHA)</Label>
                      <Input
                        id="gha"
                        type="number"
                        step="0.01"
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
                      <Label htmlFor="sha">Sidereal Hour Angle (SHA)</Label>
                      <Input
                        id="sha"
                        type="number"
                        step="0.01"
                        value={navInputs.sha}
                        onChange={(e) => setNavInputs(prev => ({
                          ...prev,
                          sha: e.target.value
                        }))}
                        placeholder="Derece cinsinden (opsiyonel)"
                        className="bg-black/40 border-white/20"
                      />
                    </div>
                    <div>
                      <CoordinateInput
                        id="declination"
                        label="Declination"
                        value={navInputs.declination}
                        onChange={(val) => setNavInputs(prev => ({ ...prev, declination: val }))}
                        isLatitude={true}
                      />
                    </div>
                    <div>
                      <CoordinateInput
                        id="assumed-latitude"
                        label="Assumed Latitude"
                        value={navInputs.assumedLatitude}
                        onChange={(val) => setNavInputs(prev => ({ ...prev, assumedLatitude: val }))}
                        isLatitude={true}
                      />
                    </div>
                    <div className="col-span-2">
                      <CoordinateInput
                        id="assumed-longitude"
                        label="Assumed Longitude"
                        value={navInputs.assumedLongitude}
                        onChange={(val) => setNavInputs(prev => ({ ...prev, assumedLongitude: val }))}
                        isLatitude={false}
                      />
                    </div>
                  </div>

                  <Button onClick={calculateCelestialNavigation} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Göksel Navigasyon Hesapla
                  </Button>

                  {navResults && (
                    <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 space-y-2">
                      <h4 className="font-bold text-blue-400">Sonuçlar</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-300">LHA:</span>
                          <span className="text-blue-400 font-mono ml-2">{navResults.lha.toFixed(2)}°</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Hesaplanan Yükseklik:</span>
                          <span className="text-blue-400 font-mono ml-2">{navResults.calculatedAltitude.toFixed(2)}°</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Azimut:</span>
                          <span className="text-blue-400 font-mono ml-2">{navResults.calculatedAzimuth.toFixed(1)}°</span>
                        </div>
                        <div>
                          <span className="text-gray-300">Intercept:</span>
                          <span className="text-blue-400 font-mono ml-2">{navResults.intercept.toFixed(1)} mil</span>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}