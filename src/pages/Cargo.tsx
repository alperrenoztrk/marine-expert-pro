import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package, Scale, Shield, Zap, Anchor } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CargoData {
  // Cargo Distribution
  totalCargoWeight: number; // Total cargo weight (tonnes)
  cargoDistribution: number; // Cargo distribution ratio (%)
  cargoLCG: number; // Cargo LCG (m)
  shipLCF: number; // Ship LCF (m)
  
  // Trim Effects
  trimMoment: number; // Trim moment (ton.m)
  draftChange: number; // Draft change (cm)
  TPC: number; // Tonnes per centimeter
  
  // Stability
  currentGM: number; // Current GM (m)
  cargoKG: number; // Cargo KG (m)
  newGM: number; // New GM (m)
  stabilityMargin: number; // Stability margin (%)
  
  // Structural Safety
  maxShearForce: number; // Maximum shear force (ton)
  bendingMoment: number; // Bending moment (ton.m)
  structuralLimits: number; // Structural limits (%)
  safetyFactor: number; // Safety factor
  
  // Performance Impact
  additionalResistance: number; // Additional resistance (%)
  speedLoss: number; // Speed loss (knots)
  fuelConsumptionIncrease: number; // Fuel consumption increase (ton/day)
  
  // Safety Index
  safetyIndex: number; // Safety index
  emissionImpact: number; // Emission impact (ton CO2)
  environmentalCompliance: boolean; // Environmental compliance
  imoStandards: boolean; // IMO standards compliance
}

interface CargoResults {
  cargoDistribution: {
    totalWeight: number;
    distributionRatio: number;
    trimMoment: number;
    draftChange: number;
  };
  stability: {
    newGM: number;
    maxKG: number;
    stabilityMargin: number;
    stabilityStatus: string;
  };
  structural: {
    maxShearForce: number;
    bendingMoment: number;
    structuralLimits: number;
    safetyFactor: number;
  };
  performance: {
    additionalResistance: number;
    speedLoss: number;
    fuelConsumptionIncrease: number;
    performanceImpact: string;
  };
  safety: {
    safetyIndex: number;
    emissionImpact: number;
    environmentalCompliance: boolean;
    imoStandards: boolean;
  };
}

export const CargoCalculations = () => {
  const { toast } = useToast();
  const [cargoData, setCargoData] = useState<CargoData>({
    totalCargoWeight: 5000,
    cargoDistribution: 60,
    cargoLCG: 70,
    shipLCF: 68,
    trimMoment: 0,
    draftChange: 0,
    TPC: 25.5,
    currentGM: 1.2,
    cargoKG: 8.5,
    newGM: 0,
    stabilityMargin: 0,
    maxShearForce: 0,
    bendingMoment: 0,
    structuralLimits: 0,
    safetyFactor: 0,
    additionalResistance: 0,
    speedLoss: 0,
    fuelConsumptionIncrease: 0,
    safetyIndex: 0,
    emissionImpact: 0,
    environmentalCompliance: true,
    imoStandards: true
  });

  const [cargoResults, setCargoResults] = useState<CargoResults | null>(null);

  const calculateCargoOperations = () => {
    // Formül 1: Yük Dağılımı - W_total = Σ W_i
    const totalWeight = cargoData.totalCargoWeight;
    const distributionRatio = cargoData.cargoDistribution;
    
    // Formül 2: Trim Moment - M_trim = W × (LCG - LCF)
    const trimMoment = totalWeight * (cargoData.cargoLCG - cargoData.shipLCF);
    
    // Formül 3: Draft Değişimi - ΔD = W / TPC
    const draftChange = totalWeight / cargoData.TPC;
    
    // Formül 4: Stabilite - GM_new = GM_old - (W × KG) / Δ
    const newGM = cargoData.currentGM - (totalWeight * cargoData.cargoKG) / (totalWeight * 1.025);
    const maxKG = cargoData.currentGM * 0.8; // 80% of current GM
    const stabilityMargin = (newGM / maxKG) * 100;
    
    // Formül 5: Yapısal Güvenlik - Shear Force = f(loading, distribution)
    const maxShearForce = totalWeight * (distributionRatio / 100) * 0.6;
    const bendingMoment = totalWeight * (distributionRatio / 100) * 0.4;
    const structuralLimits = (maxShearForce / 10000) * 100; // Assuming 10000 ton limit
    const safetyFactor = 10000 / maxShearForce;
    
    // Formül 6: Performans Etkisi - Resistance = f(draft, trim, loading)
    const additionalResistance = (draftChange / 100) * 5; // 5% per cm draft change
    const speedLoss = additionalResistance * 0.2; // 0.2 knots per % resistance
    const fuelConsumptionIncrease = additionalResistance * 2; // 2 ton/day per % resistance
    
    // Formül 7: Güvenlik İndeksi - Safety Index = f(loading, stability, weather)
    const safetyIndex = Math.min(100, 
      (stabilityMargin * 0.4) + 
      (safetyFactor * 20) + 
      (cargoData.environmentalCompliance ? 20 : 0) + 
      (cargoData.imoStandards ? 20 : 0)
    );
    const emissionImpact = totalWeight * 0.001; // 0.001 ton CO2 per ton cargo
    
    setCargoResults({
      cargoDistribution: {
        totalWeight,
        distributionRatio,
        trimMoment,
        draftChange
      },
      stability: {
        newGM,
        maxKG,
        stabilityMargin,
        stabilityStatus: newGM > maxKG ? 'Güvenli' : 'Kritik'
      },
      structural: {
        maxShearForce,
        bendingMoment,
        structuralLimits,
        safetyFactor
      },
      performance: {
        additionalResistance,
        speedLoss,
        fuelConsumptionIncrease,
        performanceImpact: additionalResistance < 10 ? 'Düşük' : 'Yüksek'
      },
      safety: {
        safetyIndex,
        emissionImpact,
        environmentalCompliance: cargoData.environmentalCompliance,
        imoStandards: cargoData.imoStandards
      }
    });
    
    toast({
      title: "Başarılı!",
      description: "Kargo işlemleri hesaplamaları tamamlandı!"
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary nature-icon" />
          <div>
            <h1 className="text-3xl font-bold nature-title">Kargo Hesaplamaları</h1>
            <p className="text-muted-foreground">Yük işlemleri, stabilite ve güvenlik hesaplamaları</p>
          </div>
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="gap-2 text-sm flex items-center"
        >
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline" data-translatable>Ana Sayfa</span>
            <span className="xs:hidden" data-translatable>Geri</span>
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Kargo İşlemleri Hesaplamaları
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Formül 1: Yük Dağılımı - W_total = Σ W_i */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-blue-700">📦 Yük Dağılımı Hesaplama</h3>
              <p className="text-sm text-gray-600">W_total = Σ W_i</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalCargoWeight">Toplam Yük Ağırlığı W [ton]</Label>
                  <Input
                    id="totalCargoWeight"
                    type="number"
                    step="0.1"
                    value={cargoData.totalCargoWeight || ''}
                    onChange={(e) => setCargoData({...cargoData, totalCargoWeight: parseFloat(e.target.value)})}
                    placeholder="5000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoDistribution">Yük Dağılım Oranı [%]</Label>
                  <Input
                    id="cargoDistribution"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={cargoData.cargoDistribution || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoDistribution: parseFloat(e.target.value)})}
                    placeholder="60"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Formül 2: Trim Moment - M_trim = W × (LCG - LCF) */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">⚖️ Trim Moment Hesabı</h3>
              <p className="text-sm text-gray-600">M_trim = W × (LCG - LCF)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cargoLCG">Yük LCG'si [m]</Label>
                  <Input
                    id="cargoLCG"
                    type="number"
                    step="0.1"
                    value={cargoData.cargoLCG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoLCG: parseFloat(e.target.value)})}
                    placeholder="70"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shipLCF">Gemi LCF'si [m]</Label>
                  <Input
                    id="shipLCF"
                    type="number"
                    step="0.1"
                    value={cargoData.shipLCF || ''}
                    onChange={(e) => setCargoData({...cargoData, shipLCF: parseFloat(e.target.value)})}
                    placeholder="68"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="TPC">TPC [ton/cm]</Label>
                  <Input
                    id="TPC"
                    type="number"
                    step="0.01"
                    value={cargoData.TPC || ''}
                    onChange={(e) => setCargoData({...cargoData, TPC: parseFloat(e.target.value)})}
                    placeholder="25.5"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Formül 3: Stabilite - GM_new = GM_old - (W × KG) / Δ */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700">🛡️ Stabilite Kontrolü</h3>
              <p className="text-sm text-gray-600">GM_new = GM_old - (W × KG) / Δ</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentGM">Mevcut GM [m]</Label>
                  <Input
                    id="currentGM"
                    type="number"
                    step="0.01"
                    value={cargoData.currentGM || ''}
                    onChange={(e) => setCargoData({...cargoData, currentGM: parseFloat(e.target.value)})}
                    placeholder="1.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cargoKG">Yük KG'si [m]</Label>
                  <Input
                    id="cargoKG"
                    type="number"
                    step="0.01"
                    value={cargoData.cargoKG || ''}
                    onChange={(e) => setCargoData({...cargoData, cargoKG: parseFloat(e.target.value)})}
                    placeholder="8.5"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Güvenlik Kontrolleri */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-700">🛡️ Güvenlik Kontrolleri</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="environmentalCompliance">Çevresel Uyumluluk</Label>
                  <Select
                    value={cargoData.environmentalCompliance ? 'true' : 'false'}
                    onValueChange={(value) => setCargoData({...cargoData, environmentalCompliance: value === 'true'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Uyumlu</SelectItem>
                      <SelectItem value="false">Uyumlu Değil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imoStandards">IMO Standartları</Label>
                  <Select
                    value={cargoData.imoStandards ? 'true' : 'false'}
                    onValueChange={(value) => setCargoData({...cargoData, imoStandards: value === 'true'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Uyumlu</SelectItem>
                      <SelectItem value="false">Uyumlu Değil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Hesaplama Butonu */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={calculateCargoOperations} 
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Hesapla
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {cargoResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Hesaplama Sonuçları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Yük Dağılımı Sonuçları */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📦 Yük Dağılımı</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Toplam Ağırlık</Label>
                    <div className="text-lg font-bold text-blue-600">
                      {cargoResults.cargoDistribution.totalWeight.toFixed(1)} ton
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Dağılım Oranı</Label>
                    <div className="text-lg font-bold text-blue-600">
                      {cargoResults.cargoDistribution.distributionRatio.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Trim Moment</Label>
                    <div className="text-lg font-bold text-green-600">
                      {cargoResults.cargoDistribution.trimMoment.toFixed(1)} ton.m
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Draft Değişimi</Label>
                    <div className="text-lg font-bold text-green-600">
                      {cargoResults.cargoDistribution.draftChange.toFixed(2)} cm
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Stabilite Sonuçları */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">🛡️ Stabilite</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Yeni GM</Label>
                    <div className="text-lg font-bold text-purple-600">
                      {cargoResults.stability.newGM.toFixed(3)} m
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Maksimum KG</Label>
                    <div className="text-lg font-bold text-purple-600">
                      {cargoResults.stability.maxKG.toFixed(3)} m
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Stabilite Marjı</Label>
                    <div className="text-lg font-bold text-purple-600">
                      {cargoResults.stability.stabilityMargin.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Durum</Label>
                    <div className={`text-lg font-bold ${
                      cargoResults.stability.stabilityStatus === 'Güvenli' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cargoResults.stability.stabilityStatus}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Yapısal Güvenlik Sonuçları */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-orange-700">🏗️ Yapısal Güvenlik</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Maksimum Kesme Kuvveti</Label>
                    <div className="text-lg font-bold text-orange-600">
                      {cargoResults.structural.maxShearForce.toFixed(1)} ton
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Eğilme Momenti</Label>
                    <div className="text-lg font-bold text-orange-600">
                      {cargoResults.structural.bendingMoment.toFixed(1)} ton.m
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Yapısal Limitler</Label>
                    <div className="text-lg font-bold text-orange-600">
                      {cargoResults.structural.structuralLimits.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Güvenlik Faktörü</Label>
                    <div className="text-lg font-bold text-orange-600">
                      {cargoResults.structural.safetyFactor.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Performans Sonuçları */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-indigo-700">⚡ Performans Etkisi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Ek Direnç</Label>
                    <div className="text-lg font-bold text-indigo-600">
                      {cargoResults.performance.additionalResistance.toFixed(1)}%
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Hız Kaybı</Label>
                    <div className="text-lg font-bold text-indigo-600">
                      {cargoResults.performance.speedLoss.toFixed(1)} knot
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Yakıt Artışı</Label>
                    <div className="text-lg font-bold text-indigo-600">
                      {cargoResults.performance.fuelConsumptionIncrease.toFixed(1)} ton/gün
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Etki Seviyesi</Label>
                    <div className="text-lg font-bold text-indigo-600">
                      {cargoResults.performance.performanceImpact}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Güvenlik Sonuçları */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-700">🛡️ Güvenlik İndeksi</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Güvenlik İndeksi</Label>
                    <div className="text-lg font-bold text-red-600">
                      {cargoResults.safety.safetyIndex.toFixed(1)}/100
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Emisyon Etkisi</Label>
                    <div className="text-lg font-bold text-red-600">
                      {cargoResults.safety.emissionImpact.toFixed(3)} ton CO2
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Çevresel Uyumluluk</Label>
                    <div className={`text-lg font-bold ${
                      cargoResults.safety.environmentalCompliance ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cargoResults.safety.environmentalCompliance ? 'Uyumlu' : 'Uyumlu Değil'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">IMO Standartları</Label>
                    <div className={`text-lg font-bold ${
                      cargoResults.safety.imoStandards ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {cargoResults.safety.imoStandards ? 'Uyumlu' : 'Uyumlu Değil'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};