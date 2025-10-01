import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

export const EconomicCalculations = () => {
  // Time Charter Equivalent
  const [grossFreight, setGrossFreight] = useState("");
  const [voyageExpenses, setVoyageExpenses] = useState("");
  const [voyageDays, setVoyageDays] = useState("");
  const [tceResult, setTceResult] = useState<any>(null);

  // Demurrage Calculation
  const [demurrageRate, setDemurrageRate] = useState("");
  const [layTime, setLayTime] = useState("");
  const [actualTime, setActualTime] = useState("");
  const [demurrageResult, setDemurrageResult] = useState<any>(null);

  // Voyage Economics
  const [cargoQuantity, setCargoQuantity] = useState("");
  const [freightRate, setFreightRate] = useState("");
  const [bunkerCost, setBunkerCost] = useState("");
  const [portCosts, setPortCosts] = useState("");
  const [voyageResult, setVoyageResult] = useState<any>(null);

  const calculateTCE = () => {
    const freight = parseFloat(grossFreight);
    const expenses = parseFloat(voyageExpenses);
    const days = parseFloat(voyageDays);
    
    if (isNaN(freight) || isNaN(expenses) || isNaN(days) || days === 0) return;

    const netFreight = freight - expenses;
    const tce = netFreight / days;

    setTceResult({
      grossFreight: freight,
      voyageExpenses: expenses,
      netFreight,
      voyageDays: days,
      tce: tce,
      profitability: tce > 15000 ? 'Excellent' : tce > 10000 ? 'Good' : tce > 5000 ? 'Fair' : 'Poor'
    });
  };

  const calculateDemurrage = () => {
    const rate = parseFloat(demurrageRate);
    const layTimeHours = parseFloat(layTime);
    const actualHours = parseFloat(actualTime);
    
    if (isNaN(rate) || isNaN(layTimeHours) || isNaN(actualHours)) return;

    const timeDifference = actualHours - layTimeHours;
    let result: any = {
      demurrageRate: rate,
      layTime: layTimeHours,
      actualTime: actualHours,
      timeDifference
    };

    if (timeDifference > 0) {
      // Demurrage - vessel is delayed
      result.type = 'Demurrage';
      result.amount = timeDifference * rate;
      result.description = 'Yükleme/boşaltma süresi aşıldı';
      result.status = 'penalty';
    } else if (timeDifference < 0) {
      // Despatch - vessel finished early
      result.type = 'Despatch';
      result.amount = Math.abs(timeDifference) * (rate * 0.5); // Usually half demurrage rate
      result.description = 'Yükleme/boşaltma erken tamamlandı';
      result.status = 'bonus';
    } else {
      result.type = 'On Time';
      result.amount = 0;
      result.description = 'Tam zamanında tamamlandı';
      result.status = 'neutral';
    }

    setDemurrageResult(result);
  };

  const calculateVoyageEconomics = () => {
    const quantity = parseFloat(cargoQuantity);
    const rate = parseFloat(freightRate);
    const bunker = parseFloat(bunkerCost);
    const ports = parseFloat(portCosts);
    
    if (isNaN(quantity) || isNaN(rate) || isNaN(bunker) || isNaN(ports)) return;

    const grossRevenue = quantity * rate;
    const totalCosts = bunker + ports;
    const netProfit = grossRevenue - totalCosts;
    const profitMargin = (netProfit / grossRevenue) * 100;

    setVoyageResult({
      cargoQuantity: quantity,
      freightRate: rate,
      grossRevenue,
      bunkerCost: bunker,
      portCosts: ports,
      totalCosts,
      netProfit,
      profitMargin,
      profitability: profitMargin > 20 ? 'Excellent' : 
                     profitMargin > 10 ? 'Good' : 
                     profitMargin > 5 ? 'Fair' : 
                     profitMargin > 0 ? 'Poor' : 'Loss'
    });
  };

  return (
    <div className="space-y-6">
      {/* Time Charter Equivalent */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="w-5 h-5 text-green-500" />
            Time Charter Equivalent (TCE)
          </CardTitle>
          <CardDescription>
            Günlük TCE hesaplaması
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="grossFreight">Brüt Navlun ($)</Label>
              <Input
                id="grossFreight"
                type="number"
                value={grossFreight}
                onChange={(e) => setGrossFreight(e.target.value)}
                placeholder="Toplam navlun geliri"
              />
            </div>
            <div>
              <Label htmlFor="voyageExpenses">Sefer Giderleri ($)</Label>
              <Input
                id="voyageExpenses"
                type="number"
                value={voyageExpenses}
                onChange={(e) => setVoyageExpenses(e.target.value)}
                placeholder="Yakıt, liman vs."
              />
            </div>
            <div>
              <Label htmlFor="voyageDays">Sefer Süresi (Gün)</Label>
              <Input
                id="voyageDays"
                type="number"
                value={voyageDays}
                onChange={(e) => setVoyageDays(e.target.value)}
                placeholder="Toplam sefer günü"
              />
            </div>
          </div>
          
          <Button onClick={calculateTCE} className="w-full">
            TCE Hesapla
          </Button>

          {tceResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Brüt Navlun:</span>
                    <span className="ml-2">${tceResult.grossFreight.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Net Navlun:</span>
                    <span className="ml-2">${tceResult.netFreight.toLocaleString()}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">TCE (Günlük):</span>
                    <Badge variant="outline" className="ml-2">
                      ${tceResult.tce.toFixed(0)}/gün
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Kârlılık:</span>
                    <Badge variant={tceResult.profitability === 'Excellent' ? 'default' : 
                                  tceResult.profitability === 'Good' ? 'outline' : 'destructive'} 
                           className="ml-2">
                      {tceResult.profitability}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Demurrage Calculator */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-orange-500" />
            Demurrage/Despatch
          </CardTitle>
          <CardDescription>
            Bekleme süresi ve ücret hesabı
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="demurrageRate">Demurrage Oranı ($/saat)</Label>
              <Input
                id="demurrageRate"
                type="number"
                value={demurrageRate}
                onChange={(e) => setDemurrageRate(e.target.value)}
                placeholder="Saatlik oran"
              />
            </div>
            <div>
              <Label htmlFor="layTime">Lay Time (Saat)</Label>
              <Input
                id="layTime"
                type="number"
                value={layTime}
                onChange={(e) => setLayTime(e.target.value)}
                placeholder="Öngörülen süre"
              />
            </div>
            <div>
              <Label htmlFor="actualTime">Gerçek Süre (Saat)</Label>
              <Input
                id="actualTime"
                type="number"
                value={actualTime}
                onChange={(e) => setActualTime(e.target.value)}
                placeholder="Gerçekleşen süre"
              />
            </div>
          </div>
          
          <Button onClick={calculateDemurrage} className="w-full">
            Hesapla
          </Button>

          {demurrageResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tip:</span>
                    <Badge variant={demurrageResult.status === 'bonus' ? 'default' : 
                                  demurrageResult.status === 'penalty' ? 'destructive' : 'outline'} 
                           className="ml-2">
                      {demurrageResult.type}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Tutar:</span>
                    <span className="ml-2 font-bold">${demurrageResult.amount.toFixed(2)}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Süre Farkı:</span>
                    <span className="ml-2">{Math.abs(demurrageResult.timeDifference)} saat</span>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Açıklama:</span>
                    <p className="mt-1 text-muted-foreground">{demurrageResult.description}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Voyage Economics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Sefer Ekonomisi
          </CardTitle>
          <CardDescription>
            Sefer kârlılığı analizi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cargoQuantity">Kargo Miktarı (MT)</Label>
              <Input
                id="cargoQuantity"
                type="number"
                value={cargoQuantity}
                onChange={(e) => setCargoQuantity(e.target.value)}
                placeholder="Ton"
              />
            </div>
            <div>
              <Label htmlFor="freightRate">Navlun Oranı ($/MT)</Label>
              <Input
                id="freightRate"
                type="number"
                value={freightRate}
                onChange={(e) => setFreightRate(e.target.value)}
                placeholder="Ton başına"
              />
            </div>
            <div>
              <Label htmlFor="bunkerCost">Yakıt Maliyeti ($)</Label>
              <Input
                id="bunkerCost"
                type="number"
                value={bunkerCost}
                onChange={(e) => setBunkerCost(e.target.value)}
                placeholder="Toplam yakıt"
              />
            </div>
            <div>
              <Label htmlFor="portCosts">Liman Masrafları ($)</Label>
              <Input
                id="portCosts"
                type="number"
                value={portCosts}
                onChange={(e) => setPortCosts(e.target.value)}
                placeholder="Liman ve diğer"
              />
            </div>
          </div>
          
          <Button onClick={calculateVoyageEconomics} className="w-full">
            Analiz Et
          </Button>

          {voyageResult && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Brüt Gelir:</span>
                    <span className="ml-2">${voyageResult.grossRevenue.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Toplam Maliyet:</span>
                    <span className="ml-2">${voyageResult.totalCosts.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Net Kâr:</span>
                    <span className={`ml-2 font-bold ${voyageResult.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                      ${voyageResult.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Kâr Marjı:</span>
                    <Badge variant={voyageResult.profitMargin > 10 ? 'default' : 
                                  voyageResult.profitMargin > 0 ? 'outline' : 'destructive'} 
                           className="ml-2">
                      {voyageResult.profitMargin.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Değerlendirme:</span>
                    <Badge variant={voyageResult.profitability === 'Excellent' ? 'default' : 
                                  voyageResult.profitability === 'Good' ? 'outline' : 'destructive'} 
                           className="ml-2">
                      {voyageResult.profitability}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};