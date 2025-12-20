import React, { useState, useEffect } from 'react';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CoordinateInput } from '@/components/ui/coordinate-input';
import { Card } from '@/components/ui/card';
import { MobileLayout } from "@/components/MobileLayout";
import { CalculationGridScreen } from "@/components/ui/calculation-grid";
import { 
  Calculator,
  Navigation,
  Ruler
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  emptyDMS, 
  dmsToDecimal, 
  type DMSCoordinate 
} from '@/utils/coordinateUtils';

export default function CelestialCalculations() {
  const { toast } = useToast();
  
  const [sextantReadings, setSextantReadings] = useState({
    observedAltitude: '',
    indexError: '',
    dip: '',
    refraction: '',
    semiDiameter: '',
    parallax: ''
  });
  const [trueAltitude, setTrueAltitude] = useState<number | null>(null);

  const [navInputs, setNavInputs] = useState({
    gha: '',
    sha: '',
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

  useEffect(() => {
    try {
      localStorage.setItem('celestial-sextant', JSON.stringify(sextantReadings));
    } catch (error) {
      console.error("Error saving sextant readings:", error);
    }
  }, [sextantReadings]);

  useEffect(() => {
    try {
      localStorage.setItem('celestial-nav', JSON.stringify(navInputs));
    } catch (error) {
      console.error("Error saving navigation inputs:", error);
    }
  }, [navInputs]);

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

    const trueAlt = ho + ie - dip - refraction + sd + parallax;
    setTrueAltitude(trueAlt);
    
    toast({ 
      title: "Gerçek Yükseklik Hesaplandı", 
      description: `${trueAlt.toFixed(4)}°` 
    });
  };

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

    const lha = gha + (sha || 0) - lon;
    const lhaNormalized = ((lha % 360) + 360) % 360;

    const latRad = (lat * Math.PI) / 180;
    const decRad = (dec * Math.PI) / 180;
    const lhaRad = (lhaNormalized * Math.PI) / 180;

    const sinAlt = Math.sin(latRad) * Math.sin(decRad) + 
                  Math.cos(latRad) * Math.cos(decRad) * Math.cos(lhaRad);
    const calculatedAlt = Math.asin(sinAlt) * (180 / Math.PI);

    const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / 
                  (Math.cos(latRad) * Math.cos(Math.asin(sinAlt)));
    let azimuth = Math.acos(Math.abs(cosAz)) * (180 / Math.PI);
    
    if (lhaNormalized > 180) {
      azimuth = 360 - azimuth;
    }

    const intercept = trueAltitude ? (trueAltitude - calculatedAlt) * 60 : 0;

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
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Göksel"
        title="Göksel Hesaplamalar"
        subtitle="Sextant ve göksel navigasyon hesaplamaları"
      >
        <div className="pb-20">
          <Tabs defaultValue="sextant" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 border border-white/60">
              <TabsTrigger value="sextant" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Sextant
              </TabsTrigger>
              <TabsTrigger value="navigation" className="flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Navigasyon
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sextant" className="mt-4">
              <div className="space-y-4">
                <Card className="bg-white/90 border-white/60 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                      <Ruler className="h-5 w-5" />
                      Sextant Düzeltmeleri
                    </CardTitle>
                    <CardDescription>
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
                        />
                      </div>
                    </div>

                    <Button onClick={calculateTrueAltitude} className="w-full bg-[#2F5BFF] hover:bg-[#2F5BFF]/90">
                      <Calculator className="h-4 w-4 mr-2" />
                      Gerçek Yüksekliği Hesapla
                    </Button>

                    {trueAltitude !== null && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-bold text-[#2F5BFF]">Sonuç</h4>
                        <p className="text-lg font-mono">
                          Gerçek Yükseklik: <span className="text-[#2F5BFF] font-bold">{trueAltitude.toFixed(4)}°</span>
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="mt-4">
              <div className="space-y-4">
                <Card className="bg-white/90 border-white/60 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                      <Navigation className="h-5 w-5" />
                      Göksel Navigasyon Hesaplamaları
                    </CardTitle>
                    <CardDescription>
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

                    <Button onClick={calculateCelestialNavigation} className="w-full bg-[#2F5BFF] hover:bg-[#2F5BFF]/90">
                      <Calculator className="h-4 w-4 mr-2" />
                      Göksel Navigasyon Hesapla
                    </Button>

                    {navResults && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                        <h4 className="font-bold text-[#2F5BFF]">Sonuçlar</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-slate-600">LHA:</span>
                            <span className="text-[#2F5BFF] font-mono ml-2">{navResults.lha.toFixed(2)}°</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Hesaplanan Yükseklik:</span>
                            <span className="text-[#2F5BFF] font-mono ml-2">{navResults.calculatedAltitude.toFixed(2)}°</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Azimut:</span>
                            <span className="text-[#2F5BFF] font-mono ml-2">{navResults.calculatedAzimuth.toFixed(1)}°</span>
                          </div>
                          <div>
                            <span className="text-slate-600">Intercept:</span>
                            <span className="text-[#2F5BFF] font-mono ml-2">{navResults.intercept.toFixed(1)} mil</span>
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
      </CalculationGridScreen>
    </MobileLayout>
  );
}
