import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Fuel, Container, Ship, Truck } from "lucide-react";

export const SpecialShipCalculations = ({ initialTab }: { initialTab?: string } = {}) => {
  // Tanker - COW and Inert Gas
  const [cargoTankVolume, setCargoTankVolume] = useState("");
  const [cowRate, setCowRate] = useState("");
  const [tankPressure, setTankPressure] = useState("");
  const [tankerResult, setTankerResult] = useState<any>(null);

  // LNG - Boil-off Rate
  const [lngTankCapacity, setLngTankCapacity] = useState("");
  const [boilOffRate, setBoilOffRate] = useState("");
  const [voyageDuration, setVoyageDuration] = useState("");
  const [lngResult, setLngResult] = useState<any>(null);

  // Container - Stack Weight
  const [containerWeight, setContainerWeight] = useState("");
  const [stackHeight, setStackHeight] = useState("");
  const [deckCapacity, setDeckCapacity] = useState("");
  const [containerResult, setContainerResult] = useState<any>(null);

  // Ro-Ro - Axle Load
  const [vehicleWeight, setVehicleWeight] = useState("");
  const [axleNumber, setAxleNumber] = useState("");
  const [deckLoadLimit, setDeckLoadLimit] = useState("");
  const [roroResult, setRoroResult] = useState<any>(null);

  const calculateTankerOperations = () => {
    const volume = parseFloat(cargoTankVolume);
    const rate = parseFloat(cowRate);
    const pressure = parseFloat(tankPressure);
    
    if (isNaN(volume) || isNaN(rate) || isNaN(pressure)) return;

    const cowTime = volume / rate; // hours
    const inertGasRequired = volume * 1.05; // 5% excess
    const pressureStatus = pressure < 0.014 ? 'safe' : pressure < 0.02 ? 'caution' : 'critical';

    setTankerResult({
      tankVolume: volume,
      cowTime,
      inertGasRequired,
      tankPressure: pressure,
      pressureStatus,
      safetyNote: pressureStatus === 'safe' ? 'Güvenli basınç seviyesi' : 
                  pressureStatus === 'caution' ? 'Dikkat - basınç yükseliyor' : 
                  'Kritik basınç - acil müdahale gerekli'
    });
  };

  const calculateLNGBoilOff = () => {
    const capacity = parseFloat(lngTankCapacity);
    const dailyBoilOff = parseFloat(boilOffRate);
    const duration = parseFloat(voyageDuration);
    
    if (isNaN(capacity) || isNaN(dailyBoilOff) || isNaN(duration)) return;

    const totalBoilOff = (dailyBoilOff / 100) * capacity * duration;
    const remainingCargo = capacity - totalBoilOff;
    const lossPercentage = (totalBoilOff / capacity) * 100;

    setLngResult({
      tankCapacity: capacity,
      dailyBoilOffRate: dailyBoilOff,
      voyageDays: duration,
      totalBoilOff,
      remainingCargo,
      lossPercentage,
      status: lossPercentage < 2 ? 'excellent' : 
              lossPercentage < 5 ? 'good' : 
              lossPercentage < 10 ? 'acceptable' : 'excessive'
    });
  };

  const calculateContainerStack = () => {
    const weight = parseFloat(containerWeight);
    const height = parseFloat(stackHeight);
    const capacity = parseFloat(deckCapacity);
    
    if (isNaN(weight) || isNaN(height) || isNaN(capacity)) return;

    const totalStackWeight = weight * height;
    const weightPerUnit = totalStackWeight / (height || 1);
    const safetyFactor = capacity / totalStackWeight;
    const maxSafeHeight = Math.floor(capacity / weight);

    setContainerResult({
      containerWeight: weight,
      stackHeight: height,
      totalStackWeight,
      weightPerUnit,
      deckCapacity: capacity,
      safetyFactor,
      maxSafeHeight,
      status: safetyFactor >= 1.5 ? 'safe' : 
              safetyFactor >= 1.2 ? 'caution' : 'dangerous',
      recommendation: safetyFactor < 1.2 ? 'Stack yüksekliğini azaltın' : 
                     safetyFactor < 1.5 ? 'Dikkatli yükleme yapın' : 
                     'Güvenli yükleme limitleri'
    });
  };

  const calculateRoRoAxleLoad = () => {
    const weight = parseFloat(vehicleWeight);
    const axles = parseFloat(axleNumber);
    const limit = parseFloat(deckLoadLimit);
    
    if (isNaN(weight) || isNaN(axles) || isNaN(limit) || axles === 0) return;

    const axleLoad = weight / axles;
    const totalPressure = weight;
    const safetyMargin = ((limit - axleLoad) / limit) * 100;

    setRoroResult({
      vehicleWeight: weight,
      axleNumber: axles,
      axleLoad,
      deckLoadLimit: limit,
      totalPressure,
      safetyMargin,
      status: axleLoad <= limit ? 'safe' : 'overload',
      recommendation: axleLoad <= limit ? 
        `Güvenli - ${safetyMargin.toFixed(1)}% emniyet marjı` : 
        'Yük limiti aşıldı - araç reddedilmeli'
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue={initialTab || "tanker"} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tanker">Tanker</TabsTrigger>
          <TabsTrigger value="lng">LNG</TabsTrigger>
          <TabsTrigger value="container">Container</TabsTrigger>
          <TabsTrigger value="roro">Ro-Ro</TabsTrigger>
        </TabsList>

        {/* Tanker Operations */}
        <TabsContent value="tanker">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Fuel className="w-5 h-5 text-orange-500" />
                Tanker Operasyonları
              </CardTitle>
              <CardDescription>
                COW süresi ve inert gaz hesaplamaları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="cargoTankVolume">Tank Hacmi (m³)</Label>
                  <Input
                    id="cargoTankVolume"
                    type="number"
                    value={cargoTankVolume}
                    onChange={(e) => setCargoTankVolume(e.target.value)}
                    placeholder="Tank kapasitesi"
                  />
                </div>
                <div>
                  <Label htmlFor="cowRate">COW Oranı (m³/saat)</Label>
                  <Input
                    id="cowRate"
                    type="number"
                    value={cowRate}
                    onChange={(e) => setCowRate(e.target.value)}
                    placeholder="Yıkama oranı"
                  />
                </div>
                <div>
                  <Label htmlFor="tankPressure">Tank Basıncı (bar)</Label>
                  <Input
                    id="tankPressure"
                    type="number"
                    value={tankPressure}
                    onChange={(e) => setTankPressure(e.target.value)}
                    placeholder="Mevcut basınç"
                  />
                </div>
              </div>
              
              <Button onClick={calculateTankerOperations} className="w-full">
                Hesapla
              </Button>

              {tankerResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">COW Süresi:</span>
                        <span className="ml-2">{tankerResult.cowTime.toFixed(1)} saat</span>
                      </div>
                      <div>
                        <span className="font-medium">İnert Gaz:</span>
                        <span className="ml-2">{tankerResult.inertGasRequired.toFixed(0)} m³</span>
                      </div>
                      <div>
                        <span className="font-medium">Basınç Durumu:</span>
                        <Badge variant={tankerResult.pressureStatus === 'safe' ? 'default' : 
                                      tankerResult.pressureStatus === 'caution' ? 'outline' : 'destructive'} 
                               className="ml-2">
                          {tankerResult.pressureStatus}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Güvenlik Notu:</span>
                        <p className="mt-1 text-muted-foreground">{tankerResult.safetyNote}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* LNG Calculations */}
        <TabsContent value="lng">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Fuel className="w-5 h-5 text-blue-500" />
                LNG Boil-off Hesabı
              </CardTitle>
              <CardDescription>
                Sefer sırasında boil-off kayıpları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="lngTankCapacity">Tank Kapasitesi (m³)</Label>
                  <Input
                    id="lngTankCapacity"
                    type="number"
                    value={lngTankCapacity}
                    onChange={(e) => setLngTankCapacity(e.target.value)}
                    placeholder="LNG tank kapasitesi"
                  />
                </div>
                <div>
                  <Label htmlFor="boilOffRate">Günlük Boil-off (%)</Label>
                  <Input
                    id="boilOffRate"
                    type="number"
                    value={boilOffRate}
                    onChange={(e) => setBoilOffRate(e.target.value)}
                    placeholder="Günlük kayıp oranı"
                  />
                </div>
                <div>
                  <Label htmlFor="voyageDuration">Sefer Süresi (Gün)</Label>
                  <Input
                    id="voyageDuration"
                    type="number"
                    value={voyageDuration}
                    onChange={(e) => setVoyageDuration(e.target.value)}
                    placeholder="Toplam sefer günü"
                  />
                </div>
              </div>
              
              <Button onClick={calculateLNGBoilOff} className="w-full">
                Boil-off Hesapla
              </Button>

              {lngResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Toplam Kayıp:</span>
                        <span className="ml-2">{lngResult.totalBoilOff.toFixed(1)} m³</span>
                      </div>
                      <div>
                        <span className="font-medium">Kalan Kargo:</span>
                        <span className="ml-2">{lngResult.remainingCargo.toFixed(1)} m³</span>
                      </div>
                      <div>
                        <span className="font-medium">Kayıp Oranı:</span>
                        <Badge variant={lngResult.status === 'excellent' ? 'default' : 
                                      lngResult.status === 'good' ? 'outline' : 'destructive'} 
                               className="ml-2">
                          {lngResult.lossPercentage.toFixed(2)}%
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium">Durum:</span>
                        <span className="ml-2 capitalize">{lngResult.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Container Calculations */}
        <TabsContent value="container">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Container className="w-5 h-5 text-green-500" />
                Konteyner Stack Limiti
              </CardTitle>
              <CardDescription>
                Stack ağırlık ve yükseklik kontrolü
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="containerWeight">Konteyner Ağırlığı (ton)</Label>
                  <Input
                    id="containerWeight"
                    type="number"
                    value={containerWeight}
                    onChange={(e) => setContainerWeight(e.target.value)}
                    placeholder="Ton/konteyner"
                  />
                </div>
                <div>
                  <Label htmlFor="stackHeight">Stack Yüksekliği (adet)</Label>
                  <Input
                    id="stackHeight"
                    type="number"
                    value={stackHeight}
                    onChange={(e) => setStackHeight(e.target.value)}
                    placeholder="Konteyner sayısı"
                  />
                </div>
                <div>
                  <Label htmlFor="deckCapacity">Güverte Kapasitesi (ton)</Label>
                  <Input
                    id="deckCapacity"
                    type="number"
                    value={deckCapacity}
                    onChange={(e) => setDeckCapacity(e.target.value)}
                    placeholder="Maksimum kapasite"
                  />
                </div>
              </div>
              
              <Button onClick={calculateContainerStack} className="w-full">
                Stack Kontrolü
              </Button>

              {containerResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Toplam Ağırlık:</span>
                        <span className="ml-2">{containerResult.totalStackWeight} ton</span>
                      </div>
                      <div>
                        <span className="font-medium">Emniyet Faktörü:</span>
                        <span className="ml-2">{containerResult.safetyFactor.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="font-medium">Maks. Güvenli Stack:</span>
                        <span className="ml-2">{containerResult.maxSafeHeight} adet</span>
                      </div>
                      <div>
                        <span className="font-medium">Durum:</span>
                        <Badge variant={containerResult.status === 'safe' ? 'default' : 
                                      containerResult.status === 'caution' ? 'outline' : 'destructive'} 
                               className="ml-2">
                          {containerResult.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Öneri:</span>
                        <p className="mt-1 text-muted-foreground">{containerResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ro-Ro Calculations */}
        <TabsContent value="roro">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="w-5 h-5 text-purple-500" />
                Ro-Ro Axle Load
              </CardTitle>
              <CardDescription>
                Araç axle yükü ve güverte limiti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="vehicleWeight">Araç Ağırlığı (ton)</Label>
                  <Input
                    id="vehicleWeight"
                    type="number"
                    value={vehicleWeight}
                    onChange={(e) => setVehicleWeight(e.target.value)}
                    placeholder="Toplam araç ağırlığı"
                  />
                </div>
                <div>
                  <Label htmlFor="axleNumber">Axle Sayısı</Label>
                  <Input
                    id="axleNumber"
                    type="number"
                    value={axleNumber}
                    onChange={(e) => setAxleNumber(e.target.value)}
                    placeholder="Toplam axle"
                  />
                </div>
                <div>
                  <Label htmlFor="deckLoadLimit">Güverte Limit (ton/axle)</Label>
                  <Input
                    id="deckLoadLimit"
                    type="number"
                    value={deckLoadLimit}
                    onChange={(e) => setDeckLoadLimit(e.target.value)}
                    placeholder="Axle başına limit"
                  />
                </div>
              </div>
              
              <Button onClick={calculateRoRoAxleLoad} className="w-full">
                Axle Load Kontrolü
              </Button>

              {roroResult && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Axle Yükü:</span>
                        <span className="ml-2">{roroResult.axleLoad.toFixed(2)} ton/axle</span>
                      </div>
                      <div>
                        <span className="font-medium">Emniyet Marjı:</span>
                        <span className="ml-2">{roroResult.safetyMargin.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="font-medium">Durum:</span>
                        <Badge variant={roroResult.status === 'safe' ? 'default' : 'destructive'} 
                               className="ml-2">
                          {roroResult.status}
                        </Badge>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Öneri:</span>
                        <p className="mt-1 text-muted-foreground">{roroResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};