import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, Ship, Waves, AlertCircle, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DraftReadings {
  // Port Side
  portForward: string;
  portMidship: string;
  portAft: string;
  
  // Starboard Side
  starboardForward: string;
  starboardMidship: string;
  starboardAft: string;
}

interface ShipParticulars {
  lbp: string; // Length Between Perpendiculars
  loa: string; // Length Overall
  breadth: string;
  depth: string;
  deadweight: string;
  lightWeight: string;
  tpc: string; // Tons per Centimeter
  mct: string; // Moment to Change Trim
  lcf: string; // Longitudinal Center of Flotation
  fwda: string; // Fresh Water Draft Allowance
}

interface DensityCorrections {
  seawaterDensity: string;
  actualDensity: string;
  temperature: string;
}

interface DraftSurveyResults {
  // Basic Draft Calculations
  portMeanDraft: number;
  starboardMeanDraft: number;
  overallMeanDraft: number;
  
  // Trim and List
  trim: number;
  trimByHead: boolean;
  list: number;
  listToPort: boolean;
  
  // Corrected Values
  correctedDraft: number;
  displacement: number;
  deadweight: number;
  
  // Density Corrections
  densityCorrection: number;
  
  // Final Values
  finalDisplacement: number;
  finalDeadweight: number;
  cargoWeight: number;
}

export function DraftSurveyCalculations() {
  const { toast } = useToast();
  
  const [draftReadings, setDraftReadings] = useState<DraftReadings>({
    portForward: "",
    portMidship: "",
    portAft: "",
    starboardForward: "",
    starboardMidship: "",
    starboardAft: ""
  });
  
  const [shipParticulars, setShipParticulars] = useState<ShipParticulars>({
    lbp: "150",
    loa: "155",
    breadth: "25",
    depth: "12",
    deadweight: "25000",
    lightWeight: "8000",
    tpc: "25.5",
    mct: "850",
    lcf: "75",
    fwda: "150"
  });
  
  const [densityCorrections, setDensityCorrections] = useState<DensityCorrections>({
    seawaterDensity: "1.025",
    actualDensity: "1.023",
    temperature: "15"
  });
  
  const [ballastDeduction, setBallastDeduction] = useState<string>("2500");
  const [fuelDeduction, setFuelDeduction] = useState<string>("1200");
  const [freshWaterDeduction, setFreshWaterDeduction] = useState<string>("300");
  const [storesDeduction, setStoresDeduction] = useState<string>("150");
  
  const [results, setResults] = useState<DraftSurveyResults | null>(null);

  const calculateDraftSurvey = () => {
    try {
      // Validate inputs
      const draftValues = Object.values(draftReadings);
      const shipValues = Object.values(shipParticulars);
      const densityValues = Object.values(densityCorrections);
      
      if ([...draftValues, ...shipValues, ...densityValues, ballastDeduction, fuelDeduction, freshWaterDeduction, storesDeduction]
          .some(val => val === "" || isNaN(parseFloat(val)))) {
        toast({ 
          title: "Hata", 
          description: "Lütfen tüm alanları geçerli sayısal değerlerle doldurun", 
          variant: "destructive" 
        });
        return;
      }

      // Parse draft readings
      const pf = parseFloat(draftReadings.portForward);
      const pm = parseFloat(draftReadings.portMidship);
      const pa = parseFloat(draftReadings.portAft);
      const sf = parseFloat(draftReadings.starboardForward);
      const sm = parseFloat(draftReadings.starboardMidship);
      const sa = parseFloat(draftReadings.starboardAft);

      // Calculate mean drafts using proper formula
      const portMeanDraft = (pf + 6 * pm + pa) / 8;
      const starboardMeanDraft = (sf + 6 * sm + sa) / 8;
      const overallMeanDraft = (portMeanDraft + starboardMeanDraft) / 2;

      // Calculate trim and list
      const forwardMean = (pf + sf) / 2;
      const aftMean = (pa + sa) / 2;
      const trim = aftMean - forwardMean;
      const trimByHead = trim < 0;

      const midshipMean = (pm + sm) / 2;
      const list = pm - sm; // Port positive
      const listToPort = list > 0;

      // Ship particulars
      const lbp = parseFloat(shipParticulars.lbp);
      const tpc = parseFloat(shipParticulars.tpc);
      const mct = parseFloat(shipParticulars.mct);
      const lcf = parseFloat(shipParticulars.lcf);
      const lightWeight = parseFloat(shipParticulars.lightWeight);
      const fwda = parseFloat(shipParticulars.fwda) / 1000; // Convert mm to m

      // Trim correction
      const trimMoment = Math.abs(trim) * lbp / 2;
      const trimCorrection = (trimMoment * (lcf - lbp/2)) / (mct * 100); // Convert to meters

      // Apply trim correction to draft
      const correctedDraft = overallMeanDraft + (trim > 0 ? trimCorrection : -trimCorrection);

      // Calculate displacement from draft
      const displacement = correctedDraft * tpc * 100; // Convert cm to tons

      // Density corrections
      const standardDensity = parseFloat(densityCorrections.seawaterDensity);
      const actualDensity = parseFloat(densityCorrections.actualDensity);
      const densityCorrection = displacement * (1 - actualDensity / standardDensity);
      const finalDisplacement = displacement - densityCorrection;

      // Calculate deadweight
      const totalDeductions = parseFloat(ballastDeduction) + 
                             parseFloat(fuelDeduction) + 
                             parseFloat(freshWaterDeduction) + 
                             parseFloat(storesDeduction);
      
      const deadweight = finalDisplacement - lightWeight;
      const finalDeadweight = deadweight - totalDeductions;
      const cargoWeight = finalDeadweight;

      const calculatedResults: DraftSurveyResults = {
        portMeanDraft,
        starboardMeanDraft,
        overallMeanDraft,
        trim: Math.abs(trim),
        trimByHead,
        list: Math.abs(list),
        listToPort,
        correctedDraft,
        displacement,
        deadweight,
        densityCorrection,
        finalDisplacement,
        finalDeadweight,
        cargoWeight
      };

      setResults(calculatedResults);
      toast({ 
        title: "Draft Survey Tamamlandı", 
        description: `Kargo Ağırlığı: ${cargoWeight.toFixed(2)} ton hesaplandı` 
      });

    } catch (error) {
      toast({ 
        title: "Hesaplama Hatası", 
        description: "Draft survey hesaplamasında bir hata oluştu", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <Ship className="h-5 w-5" />
            Profesyonel Draft Survey Hesabı
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="drafts" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1">
              <TabsTrigger value="drafts">Draft Okumaları</TabsTrigger>
              <TabsTrigger value="particulars">Gemi Özellikleri</TabsTrigger>
              <TabsTrigger value="density">Yoğunluk Düzeltmeleri</TabsTrigger>
              <TabsTrigger value="deductions">Çıkarımlar</TabsTrigger>
              <TabsTrigger value="results">Sonuçlar</TabsTrigger>
            </TabsList>

            <TabsContent value="drafts" className="space-y-4">
              <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Waves className="h-4 w-4" />
                  Draft Okumaları (metre)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  <div>
                    <h5 className="font-medium mb-3 text-red-600 dark:text-red-400">Port Tarafı</h5>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="port-forward">Ön Draft (Port)</Label>
                        <Input
                          id="port-forward"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={draftReadings.portForward}
                          onChange={(e) => setDraftReadings(prev => ({ ...prev, portForward: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="port-midship">Orta Draft (Port)</Label>
                        <Input
                          id="port-midship"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={draftReadings.portMidship}
                          onChange={(e) => setDraftReadings(prev => ({ ...prev, portMidship: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="port-aft">Arka Draft (Port)</Label>
                        <Input
                          id="port-aft"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={draftReadings.portAft}
                          onChange={(e) => setDraftReadings(prev => ({ ...prev, portAft: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="font-medium mb-3 text-green-600 dark:text-green-400">Starboard Tarafı</h5>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="starboard-forward">Ön Draft (Starboard)</Label>
                        <Input
                          id="starboard-forward"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={draftReadings.starboardForward}
                          onChange={(e) => setDraftReadings(prev => ({ ...prev, starboardForward: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="starboard-midship">Orta Draft (Starboard)</Label>
                        <Input
                          id="starboard-midship"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={draftReadings.starboardMidship}
                          onChange={(e) => setDraftReadings(prev => ({ ...prev, starboardMidship: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="starboard-aft">Arka Draft (Starboard)</Label>
                        <Input
                          id="starboard-aft"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={draftReadings.starboardAft}
                          onChange={(e) => setDraftReadings(prev => ({ ...prev, starboardAft: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="particulars" className="space-y-4">
              <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Gemi Ana Özellikleri</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <Label htmlFor="lbp">LBP (m)</Label>
                    <Input
                      id="lbp"
                      type="number"
                      value={shipParticulars.lbp}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, lbp: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="breadth">Genişlik (m)</Label>
                    <Input
                      id="breadth"
                      type="number"
                      value={shipParticulars.breadth}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, breadth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth">Derinlik (m)</Label>
                    <Input
                      id="depth"
                      type="number"
                      value={shipParticulars.depth}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, depth: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadweight">DWT (ton)</Label>
                    <Input
                      id="deadweight"
                      type="number"
                      value={shipParticulars.deadweight}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, deadweight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lightWeight">Light Weight (ton)</Label>
                    <Input
                      id="lightWeight"
                      type="number"
                      value={shipParticulars.lightWeight}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, lightWeight: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tpc">TPC (ton/cm)</Label>
                    <Input
                      id="tpc"
                      type="number"
                      step="0.1"
                      value={shipParticulars.tpc}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, tpc: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mct">MCT (ton.m)</Label>
                    <Input
                      id="mct"
                      type="number"
                      value={shipParticulars.mct}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, mct: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lcf">LCF (m from AP)</Label>
                    <Input
                      id="lcf"
                      type="number"
                      value={shipParticulars.lcf}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, lcf: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fwda">FWDA (mm)</Label>
                    <Input
                      id="fwda"
                      type="number"
                      value={shipParticulars.fwda}
                      onChange={(e) => setShipParticulars(prev => ({ ...prev, fwda: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="density" className="space-y-4">
              <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Yoğunluk ve Sıcaklık Düzeltmeleri</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-start">
                  <div>
                    <Label htmlFor="seawater-density">Standart Deniz Suyu Yoğunluğu (ton/m³)</Label>
                    <Input
                      id="seawater-density"
                      type="number"
                      step="0.001"
                      value={densityCorrections.seawaterDensity}
                      onChange={(e) => setDensityCorrections(prev => ({ ...prev, seawaterDensity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="actual-density">Mevcut Su Yoğunluğu (ton/m³)</Label>
                    <Input
                      id="actual-density"
                      type="number"
                      step="0.001"
                      value={densityCorrections.actualDensity}
                      onChange={(e) => setDensityCorrections(prev => ({ ...prev, actualDensity: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Sıcaklık (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={densityCorrections.temperature}
                      onChange={(e) => setDensityCorrections(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="deductions" className="space-y-4">
              <div className="bg-red-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-4">Çıkarımlar (ton)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-start">
                  <div>
                    <Label htmlFor="ballast">Balast Suyu</Label>
                    <Input
                      id="ballast"
                      type="number"
                      value={ballastDeduction}
                      onChange={(e) => setBallastDeduction(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fuel">Yakıt</Label>
                    <Input
                      id="fuel"
                      type="number"
                      value={fuelDeduction}
                      onChange={(e) => setFuelDeduction(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fresh-water">Tatlı Su</Label>
                    <Input
                      id="fresh-water"
                      type="number"
                      value={freshWaterDeduction}
                      onChange={(e) => setFreshWaterDeduction(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="stores">İkmal</Label>
                    <Input
                      id="stores"
                      type="number"
                      value={storesDeduction}
                      onChange={(e) => setStoresDeduction(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {results && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Waves className="h-4 w-4" />
                        Draft Analizi
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Port Ortalama Draft:</span>
                          <span className="font-mono">{results.portMeanDraft.toFixed(3)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Starboard Ortalama Draft:</span>
                          <span className="font-mono">{results.starboardMeanDraft.toFixed(3)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Genel Ortalama Draft:</span>
                          <span className="font-mono">{results.overallMeanDraft.toFixed(3)} m</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Düzeltilmiş Draft:</span>
                          <span className="font-mono">{results.correctedDraft.toFixed(3)} m</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Trim ve List
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Trim:</span>
                          <span className="font-mono">
                            {results.trim.toFixed(3)} m {results.trimByHead ? "(By Head)" : "(By Stern)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>List:</span>
                          <span className="font-mono">
                            {results.list.toFixed(3)} m {results.listToPort ? "(Port)" : "(Starboard)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Calculator className="h-4 w-4" />
                      Deplasman Hesaplamaları
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm items-start">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Ham Deplasman:</span>
                          <span className="font-mono">{results.displacement.toFixed(2)} ton</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Yoğunluk Düzeltmesi:</span>
                          <span className="font-mono">{results.densityCorrection.toFixed(2)} ton</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Son Deplasman:</span>
                          <span className="font-mono">{results.finalDisplacement.toFixed(2)} ton</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Deadweight:</span>
                          <span className="font-mono">{results.deadweight.toFixed(2)} ton</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Net Deadweight:</span>
                          <span className="font-mono">{results.finalDeadweight.toFixed(2)} ton</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-bold text-lg text-green-600 dark:text-green-400">KARGO AĞIRLIĞI:</span>
                          <span className="font-mono font-bold text-lg text-green-600 dark:text-green-400">
                            {results.cargoWeight.toFixed(2)} ton
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />
          
          <div className="flex justify-center">
            <Button onClick={calculateDraftSurvey} size="lg" className="w-full md:w-auto">
              <Calculator className="w-4 h-4 mr-2" />
              Draft Survey Hesapla
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}