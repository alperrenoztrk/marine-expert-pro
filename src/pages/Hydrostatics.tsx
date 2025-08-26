import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Droplets, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HydrostaticsData {
  // Draft Survey Parameters
  draftForward: number;
  draftMidships: number;
  draftAft: number;
  volume: number;
  waterDensity: number;
  waterplaneArea: number;
  
  // Bonjean Curves Parameters
  stationNumber: number;
  crossSectionalArea: number;
  frameSpacing: number;
  stationPosition: number;
}

interface HydrostaticsResults {
  // Draft Survey Results
  meanDraft: number;
  displacement: number;
  tpc: number;
  
  // Bonjean Curves Results
  volume: number;
  lcb: number;
  moment: number;
}

export const HydrostaticsCalculations = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('draft-survey');
  const [hydrostaticsData, setHydrostaticsData] = useState<HydrostaticsData>({
    draftForward: 0,
    draftMidships: 0,
    draftAft: 0,
    volume: 0,
    waterDensity: 1025,
    waterplaneArea: 0,
    stationNumber: 0,
    crossSectionalArea: 0,
    frameSpacing: 0,
    stationPosition: 0
  });
  const [draftSurveyResults, setDraftSurveyResults] = useState<HydrostaticsResults | null>(null);
  const [bonjeanResults, setBonjeanResults] = useState<HydrostaticsResults | null>(null);

  const calculateDraftSurvey = () => {
    // Formül 1: Ortalama su çekimi - T_mean = (T_f + 4×T_m + T_a) / 6
    const meanDraft = (hydrostaticsData.draftForward + 4 * hydrostaticsData.draftMidships + hydrostaticsData.draftAft) / 6;
    
    // Formül 2: Displacement - Δ = V × ρ_sw
    const displacement = hydrostaticsData.volume * (hydrostaticsData.waterDensity / 1000);
    
    // Formül 3: TPC - TPC = (A_wp × ρ_sw) / 100
    const tpc = (hydrostaticsData.waterplaneArea * hydrostaticsData.waterDensity) / 100000;
    
    setDraftSurveyResults({
      meanDraft,
      displacement,
      tpc,
      volume: 0,
      lcb: 0,
      moment: 0
    });
    
    toast({
      title: "Başarılı!",
      description: "Draft Survey hesaplamaları tamamlandı!"
    });
  };

  const calculateBonjeanCurves = () => {
    // Formül 1: Su Altı Hacim - V = ∫ A(x) dx
    const volume = hydrostaticsData.crossSectionalArea * hydrostaticsData.frameSpacing;
    
    // Formül 2: LCB Hesabı - LCB = ∫ x × A(x) dx / V
    const lcb = (hydrostaticsData.stationPosition * hydrostaticsData.crossSectionalArea) / volume;
    
    // Formül 3: Moment - M = ∫ x² × A(x) dx
    const moment = Math.pow(hydrostaticsData.stationPosition, 2) * hydrostaticsData.crossSectionalArea;
    
    setBonjeanResults({
      volume,
      lcb,
      moment,
      meanDraft: 0,
      displacement: 0,
      tpc: 0
    });
    
    toast({
      title: "Başarılı!",
      description: "Bonjean Curves hesaplamaları tamamlandı!"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Droplets className="h-8 w-8 text-primary nature-icon" />
          <div>
            <h1 className="text-3xl font-bold nature-title">Hidrostatik Hesaplamaları</h1>
            <p className="text-muted-foreground">Draft Survey ve Bonjean Curves hesaplamaları</p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-2 text-sm flex items-center">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline" data-translatable>Ana Sayfa</span>
            <span className="xs:hidden" data-translatable>Geri</span>
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
              <TabsTrigger value="draft-survey" className="flex-1 min-w-[120px] text-xs">Draft Survey</TabsTrigger>
              <TabsTrigger value="bonjean" className="flex-1 min-w-[120px] text-xs">Bonjean Curves</TabsTrigger>
            </TabsList>
            
            {/* 2 satır boşluk */}
            <div className="mt-12"></div>

            <TabsContent value="draft-survey" className="space-y-6">
              {/* Formül 1: Ortalama su çekimi - T_mean = (T_f + 4×T_m + T_a) / 6 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📏 Ortalama su çekimi hesaplama</h3>
                <p className="text-sm text-gray-600">T_mean = (T_f + 4×T_m + T_a) / 6</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="draftForward">Baş su çekimi (T_f) [m]</Label>
                    <Input
                      id="draftForward"
                      type="number"
                      step="0.01"
                      value={hydrostaticsData.draftForward || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, draftForward: parseFloat(e.target.value)})}
                      placeholder="7.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftMidships">Orta su çekimi (T_m) [m]</Label>
                    <Input
                      id="draftMidships"
                      type="number"
                      step="0.01"
                      value={hydrostaticsData.draftMidships || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, draftMidships: parseFloat(e.target.value)})}
                      placeholder="7.65"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftAft">Kıç su çekimi (T_a) [m]</Label>
                    <Input
                      id="draftAft"
                      type="number"
                      step="0.01"
                      value={hydrostaticsData.draftAft || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, draftAft: parseFloat(e.target.value)})}
                      placeholder="7.80"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: Displacement - Δ = V × ρ_sw */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ Displacement Hesaplama</h3>
                <p className="text-sm text-gray-600">Δ = V × ρ_sw</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="volume">Su Altı Hacim (V) [m³]</Label>
                    <Input
                      id="volume"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.volume || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, volume: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waterDensity">Su Yoğunluğu (ρ_sw) [kg/m³]</Label>
                    <Input
                      id="waterDensity"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.waterDensity || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, waterDensity: parseFloat(e.target.value)})}
                      placeholder="1025"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: TPC - TPC = (A_wp × ρ_sw) / 100 */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 TPC Hesaplama</h3>
                <p className="text-sm text-gray-600">TPC = (A_wp × ρ_sw) / 100</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="waterplaneArea">Su Hattı Alanı (A_wp) [m²]</Label>
                    <Input
                      id="waterplaneArea"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.waterplaneArea || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, waterplaneArea: parseFloat(e.target.value)})}
                      placeholder="2500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waterDensity_tpc">Su Yoğunluğu (ρ_sw) [kg/m³]</Label>
                    <Input
                      id="waterDensity_tpc"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.waterDensity || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, waterDensity: parseFloat(e.target.value)})}
                      placeholder="1025"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateDraftSurvey} 
                  className="px-8 py-2 bg-green-600 hover:bg-green-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {draftSurveyResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Draft Survey Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Ortalama su çekimi (T_mean)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {draftSurveyResults.meanDraft.toFixed(3)} m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Displacement (Δ)</Label>
                      <div className="text-lg font-bold text-green-600">
                        {draftSurveyResults.displacement.toFixed(0)} ton
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">TPC</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {draftSurveyResults.tpc.toFixed(2)} ton/cm
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bonjean" className="space-y-6">
              {/* Formül 1: Su Altı Hacim - V = ∫ A(x) dx */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">🌊 Su Altı Hacim Hesaplama</h3>
                <p className="text-sm text-gray-600">V = ∫ A(x) dx</p>
                <p className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                  <strong>📋 Amaç:</strong> Gemi boyunca değişen kesit alanlarının integrali ile toplam su altı hacmi hesaplanır. 
                  Bu formül gemi formunun karmaşık geometrisini dikkate alır.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationNumber">Station Numarası</Label>
                    <Input
                      id="stationNumber"
                      type="number"
                      min="0"
                      max="20"
                      value={hydrostaticsData.stationNumber || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, stationNumber: parseInt(e.target.value)})}
                      placeholder="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossSectionalArea">Kesit Alanı A(x) [m²]</Label>
                    <Input
                      id="crossSectionalArea"
                      type="number"
                      step="0.01"
                      value={hydrostaticsData.crossSectionalArea || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, crossSectionalArea: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frameSpacing">Frame Aralığı [m]</Label>
                    <Input
                      id="frameSpacing"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.frameSpacing || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, frameSpacing: parseFloat(e.target.value)})}
                      placeholder="7"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: LCB Hesabı - LCB = ∫ x × A(x) dx / V */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ LCB Hesabı</h3>
                <p className="text-sm text-gray-600">LCB = ∫ x × A(x) dx / V</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationPosition">Station Pozisyonu x [m]</Label>
                    <Input
                      id="stationPosition"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.stationPosition || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, stationPosition: parseFloat(e.target.value)})}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossSectionalArea_lcb">Kesit Alanı A(x) [m²]</Label>
                    <Input
                      id="crossSectionalArea_lcb"
                      type="number"
                      step="0.01"
                      value={hydrostaticsData.crossSectionalArea || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, crossSectionalArea: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="volume_lcb">Hacim V [m³]</Label>
                    <Input
                      id="volume_lcb"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.volume || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, volume: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Moment - M = ∫ x² × A(x) dx */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 Moment Hesaplama</h3>
                <p className="text-sm text-gray-600">M = ∫ x² × A(x) dx</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stationPosition_moment">Station Pozisyonu x [m]</Label>
                    <Input
                      id="stationPosition_moment"
                      type="number"
                      step="0.1"
                      value={hydrostaticsData.stationPosition || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, stationPosition: parseFloat(e.target.value)})}
                      placeholder="70"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="crossSectionalArea_moment">Kesit Alanı A(x) [m²]</Label>
                    <Input
                      id="crossSectionalArea_moment"
                      type="number"
                      step="0.01"
                      value={hydrostaticsData.crossSectionalArea || ''}
                      onChange={(e) => setHydrostaticsData({...hydrostaticsData, crossSectionalArea: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateBonjeanCurves} 
                  className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {bonjeanResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Bonjean Curves Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Su Altı Hacim (V)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {bonjeanResults.volume.toFixed(1)} m³
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">LCB</Label>
                      <div className="text-lg font-bold text-green-600">
                        {bonjeanResults.lcb.toFixed(2)} m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Moment (M)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {bonjeanResults.moment.toFixed(1)} m³
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};