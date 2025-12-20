import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, Calculator, Ship, Fuel, TrendingDown, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { CalculationLayout } from "@/components/layout/CalculationLayout";
import { CalculationCard } from "@/components/ui/calculation-card";

const carbonFactors: Record<string, number> = {
  "HFO": 3.114,
  "VLSFO": 3.151,
  "MGO": 3.206,
  "MDO": 3.206,
  "LNG": 2.750,
  "Methanol": 1.375,
  "Ethanol": 1.913,
};

const shipTypes = [
  { value: "bulk_carrier", label: "Bulk Carrier", ciiRef: 4745 },
  { value: "tanker", label: "Tanker", ciiRef: 5247 },
  { value: "container", label: "Container Ship", ciiRef: 1984 },
  { value: "general_cargo", label: "General Cargo", ciiRef: 588 },
  { value: "gas_carrier", label: "Gas Carrier", ciiRef: 8714 },
  { value: "lng_carrier", label: "LNG Carrier", ciiRef: 9827 },
  { value: "ro_ro", label: "Ro-Ro Cargo", ciiRef: 1686 },
  { value: "cruise", label: "Cruise Ship", ciiRef: 930 },
];

export default function EmissionCalculationsPage() {
  const [fuelType, setFuelType] = useState("HFO");
  const [fuelConsumption, setFuelConsumption] = useState("");
  const [distance, setDistance] = useState("");
  const [dwt, setDwt] = useState("");
  const [shipType, setShipType] = useState("bulk_carrier");
  const [result, setResult] = useState<{
    co2: number;
    cii: number;
    ciiRating: string;
    aer: number;
  } | null>(null);

  const [eexiData, setEexiData] = useState({
    power: "",
    sfc: "",
    capacity: "",
    speed: "",
  });
  const [eexiResult, setEexiResult] = useState<number | null>(null);

  const calculateCO2AndCII = () => {
    const fuel = parseFloat(fuelConsumption.replace(",", "."));
    const dist = parseFloat(distance.replace(",", "."));
    const deadweight = parseFloat(dwt.replace(",", "."));

    if (isNaN(fuel) || isNaN(dist) || isNaN(deadweight) || fuel <= 0 || dist <= 0 || deadweight <= 0) {
      toast.error("Lütfen tüm değerleri doğru girin");
      return;
    }

    const cf = carbonFactors[fuelType];
    const co2 = fuel * cf;
    const aer = (co2 * 1000000) / (deadweight * dist); // gCO2/ton-nm

    const shipData = shipTypes.find(s => s.value === shipType);
    const ciiRef = shipData?.ciiRef || 4745;
    const cii = aer / ciiRef;

    let ciiRating = "E";
    if (cii <= 0.86) ciiRating = "A";
    else if (cii <= 0.94) ciiRating = "B";
    else if (cii <= 1.06) ciiRating = "C";
    else if (cii <= 1.18) ciiRating = "D";

    setResult({ co2, cii, ciiRating, aer });
    toast.success("Hesaplama tamamlandı");
  };

  const calculateEEXI = () => {
    const power = parseFloat(eexiData.power.replace(",", "."));
    const sfc = parseFloat(eexiData.sfc.replace(",", "."));
    const capacity = parseFloat(eexiData.capacity.replace(",", "."));
    const speed = parseFloat(eexiData.speed.replace(",", "."));

    if (isNaN(power) || isNaN(sfc) || isNaN(capacity) || isNaN(speed) || power <= 0 || sfc <= 0 || capacity <= 0 || speed <= 0) {
      toast.error("Lütfen tüm değerleri doğru girin");
      return;
    }

    const cf = carbonFactors[fuelType];
    const eexi = (power * cf * sfc) / (capacity * speed);
    setEexiResult(eexi);
    toast.success("EEXI hesaplandı");
  };

  const getCiiColor = (rating: string) => {
    switch (rating) {
      case "A": return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30";
      case "B": return "text-green-600 bg-green-100 dark:bg-green-900/30";
      case "C": return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30";
      case "D": return "text-orange-600 bg-orange-100 dark:bg-orange-900/30";
      case "E": return "text-red-600 bg-red-100 dark:bg-red-900/30";
      default: return "text-muted-foreground bg-muted";
    }
  };

  return (
    <CalculationLayout
      title="Emisyon Hesaplamaları"
      description="CO₂, CII ve EEXI değerlendirmelerini tek panelden yönetin"
      icon={Leaf}
      actions={
        <Button variant="outline" asChild>
          <Link to="/calculations">Hesaplama Merkezine Dön</Link>
        </Button>
      }
      maxWidthClassName="max-w-5xl"
    >
      <CalculationCard>
        <CardContent className="space-y-6">
          <Tabs defaultValue="cii" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-card/80 backdrop-blur-sm">
              <TabsTrigger value="cii">CO₂ & CII</TabsTrigger>
              <TabsTrigger value="eexi">EEXI</TabsTrigger>
            </TabsList>

            <TabsContent value="cii">
              <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-emerald-600" />
                    CO₂ Emisyonu ve CII Hesaplama
                  </CardTitle>
                  <CardDescription>Yıllık yakıt tüketimi ve sefer verilerine göre karbon yoğunluğu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Gemi Tipi</Label>
                      <Select value={shipType} onValueChange={setShipType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {shipTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Yakıt Tipi</Label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(carbonFactors).map(fuel => (
                            <SelectItem key={fuel} value={fuel}>
                              {fuel} (CF: {carbonFactors[fuel]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Yakıt Tüketimi (ton/yıl)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={fuelConsumption}
                        onChange={(e) => setFuelConsumption(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Kat Edilen Mesafe (nm/yıl)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>DWT (ton)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={dwt}
                        onChange={(e) => setDwt(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={calculateCO2AndCII}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Hesapla
                  </Button>

                  {result && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/60">
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
                        <p className="text-sm text-muted-foreground">Yıllık CO₂ Emisyonu</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {result.co2.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} ton
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                        <p className="text-sm text-muted-foreground">AER (gCO₂/ton-nm)</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {result.aer.toFixed(2)}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                        <p className="text-sm text-muted-foreground">CII Değeri</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {result.cii.toFixed(3)}
                        </p>
                      </div>

                      <div className={`p-4 rounded-xl ${getCiiColor(result.ciiRating)}`}>
                        <p className="text-sm opacity-80">CII Derecesi</p>
                        <p className="text-3xl font-bold">{result.ciiRating}</p>
                        {(result.ciiRating === "D" || result.ciiRating === "E") && (
                          <p className="text-xs mt-1 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Düzeltici aksiyon gerekli
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="eexi">
              <Card className="border-border/60 bg-card/85 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-emerald-600" />
                    EEXI Hesaplama
                  </CardTitle>
                  <CardDescription>Energy Efficiency Existing Ship Index</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Yakıt Tipi</Label>
                      <Select value={fuelType} onValueChange={setFuelType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(carbonFactors).map(fuel => (
                            <SelectItem key={fuel} value={fuel}>
                              {fuel} (CF: {carbonFactors[fuel]})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Ana Makine Gücü (kW)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={eexiData.power}
                        onChange={(e) => setEexiData({ ...eexiData, power: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>SFC (g/kWh)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={eexiData.sfc}
                        onChange={(e) => setEexiData({ ...eexiData, sfc: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Kapasite (DWT/GT)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={eexiData.capacity}
                        onChange={(e) => setEexiData({ ...eexiData, capacity: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Referans Hız (knot)</Label>
                      <Input
                        type="text"
                        placeholder=""
                        value={eexiData.speed}
                        onChange={(e) => setEexiData({ ...eexiData, speed: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button
                    onClick={calculateEEXI}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    EEXI Hesapla
                  </Button>

                  {eexiResult !== null && (
                    <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                      <p className="text-sm text-muted-foreground mb-2">Hesaplanan EEXI</p>
                      <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                        {eexiResult.toFixed(4)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        gCO₂ / (ton·nm)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </CalculationCard>
    </CalculationLayout>
  );
}
