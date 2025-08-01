import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

interface TrimData {
  // Ship Parameters
  L: number; // Length between perpendiculars (m)
  B: number; // Breadth (m)
  displacement: number; // Current displacement (tonnes)
  GML: number; // Longitudinal metacentric height (m)
  
  // Current condition
  draftForward: number; // Forward draft (m)
  draftAft: number; // Aft draft (m)
  
  // Weight operations
  weightAdded: number; // Weight to be added/removed (tonnes)
  weightLCG: number; // Longitudinal position of weight from AP (m)
  
  // List Calculations
  transverseG: number; // Transverse center of gravity (m)
  listWeight: number; // List weight (tonnes)
  listDistance: number; // List distance (m)
  listAngle: number; // List angle (degrees)
  GM: number; // Metacentric height (m)
}

interface TrimResults {
  trimAngle: number;
  mct: number;
  trimChange: number;
  listAngle: number;
  listMoment: number;
  rightingMoment: number;
}

interface TrimCalculationsProps {
  onCalculationComplete?: (calculationType: string, inputData: any, resultData: any) => void;
}

export const TrimCalculations = ({ onCalculationComplete }: TrimCalculationsProps = {}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('basic');
  const [trimData, setTrimData] = useState<TrimData>({
    L: 0,
    B: 0,
    displacement: 0,
    GML: 0,
    draftForward: 0,
    draftAft: 0,
    weightAdded: 0,
    weightLCG: 0,
    transverseG: 0,
    listWeight: 0,
    listDistance: 0,
    listAngle: 0,
    GM: 0
  });
  const [basicTrimResults, setBasicTrimResults] = useState<TrimResults | null>(null);
  const [listResults, setListResults] = useState<TrimResults | null>(null);

  const calculateBasicTrim = () => {
    // Formül 1: Trim Açısı - θ = arctan((T_a - T_f) / L)
    const trimAngle = Math.atan((trimData.draftAft - trimData.draftForward) / trimData.L) * (180 / Math.PI);
    
    // Formül 2: MCT - MCT = (Δ × GM_L × B²) / (12 × L)
    const mct = (trimData.displacement * trimData.GML * Math.pow(trimData.B, 2)) / (12 * trimData.L);
    
    // Formül 3: Trim Değişimi - ΔT = (W × d) / MCT
    const trimChange = (trimData.weightAdded * trimData.weightLCG) / mct;
    
    setBasicTrimResults({
      trimAngle,
      mct,
      trimChange,
      listAngle: 0,
      listMoment: 0,
      rightingMoment: 0
    });
    
    toast.success("Temel trim hesaplamaları tamamlandı!");
  };

  const calculateList = () => {
    // Formül 1: List Açısı - θ = arctan(TG / GM)
    const listAngle = Math.atan(trimData.transverseG / trimData.GM) * (180 / Math.PI);
    
    // Formül 2: List Moment - M_list = W × d
    const listMoment = trimData.listWeight * trimData.listDistance;
    
    // Formül 3: Doğrultma Momenti - M_righting = Δ × GM × sin(θ)
    const rightingMoment = trimData.displacement * trimData.GM * Math.sin(trimData.listAngle * Math.PI / 180);
    
    setListResults({
      trimAngle: 0,
      mct: 0,
      trimChange: 0,
      listAngle,
      listMoment,
      rightingMoment
    });
    
    toast.success("List hesaplamaları tamamlandı!");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="flex flex-wrap gap-1 p-2 bg-muted/50 rounded-lg">
              <TabsTrigger value="basic" className="flex-1 min-w-[120px] text-xs">Temel Trim</TabsTrigger>
              <TabsTrigger value="list" className="flex-1 min-w-[120px] text-xs">List</TabsTrigger>
            </TabsList>
            
            {/* 3 satır boşluk */}
            <div className="mt-12"></div>

            <TabsContent value="basic" className="space-y-6">
              {/* Formül 1: Trim Açısı - θ = arctan((T_a - T_f) / L) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📐 Trim Açısı Hesaplama</h3>
                <p className="text-sm text-gray-600">θ = arctan((T_a - T_f) / L)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="draftAft">Kıç Draft (T_a) [m]</Label>
                    <Input
                      id="draftAft"
                      type="number"
                      step="0.01"
                      value={trimData.draftAft || ''}
                      onChange={(e) => setTrimData({...trimData, draftAft: parseFloat(e.target.value)})}
                      placeholder="8.20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="draftForward">Baş Draft (T_f) [m]</Label>
                    <Input
                      id="draftForward"
                      type="number"
                      step="0.01"
                      value={trimData.draftForward || ''}
                      onChange={(e) => setTrimData({...trimData, draftForward: parseFloat(e.target.value)})}
                      placeholder="7.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="L">Dikmeler Arası Boy (L) [m]</Label>
                    <Input
                      id="L"
                      type="number"
                      value={trimData.L || ''}
                      onChange={(e) => setTrimData({...trimData, L: parseFloat(e.target.value)})}
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: MCT - MCT = (Δ × GM_L × B²) / (12 × L) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ MCT Hesaplama</h3>
                <p className="text-sm text-gray-600">MCT = (Δ × GM_L × B²) / (12 × L)</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displacement">Deplasman (Δ) [ton]</Label>
                    <Input
                      id="displacement"
                      type="number"
                      value={trimData.displacement || ''}
                      onChange={(e) => setTrimData({...trimData, displacement: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="GML">GM_L [m]</Label>
                    <Input
                      id="GML"
                      type="number"
                      step="0.01"
                      value={trimData.GML || ''}
                      onChange={(e) => setTrimData({...trimData, GML: parseFloat(e.target.value)})}
                      placeholder="150"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="B">Genişlik (B) [m]</Label>
                    <Input
                      id="B"
                      type="number"
                      step="0.1"
                      value={trimData.B || ''}
                      onChange={(e) => setTrimData({...trimData, B: parseFloat(e.target.value)})}
                      placeholder="20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="L_mct">Dikmeler Arası Boy (L) [m]</Label>
                    <Input
                      id="L_mct"
                      type="number"
                      value={trimData.L || ''}
                      onChange={(e) => setTrimData({...trimData, L: parseFloat(e.target.value)})}
                      placeholder="140"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Trim Değişimi - ΔT = (W × d) / MCT */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">📊 Trim Değişimi Hesaplama</h3>
                <p className="text-sm text-gray-600">ΔT = (W × d) / MCT</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightAdded">Eklenen Ağırlık (W) [ton]</Label>
                    <Input
                      id="weightAdded"
                      type="number"
                      step="0.1"
                      value={trimData.weightAdded || ''}
                      onChange={(e) => setTrimData({...trimData, weightAdded: parseFloat(e.target.value)})}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weightLCG">Ağırlık Mesafesi (d) [m]</Label>
                    <Input
                      id="weightLCG"
                      type="number"
                      step="0.1"
                      value={trimData.weightLCG || ''}
                      onChange={(e) => setTrimData({...trimData, weightLCG: parseFloat(e.target.value)})}
                      placeholder="45"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="MCT">MCT [ton.m/cm]</Label>
                    <Input
                      id="MCT"
                      type="number"
                      step="0.1"
                      value={basicTrimResults?.mct || ''}
                      placeholder="Hesaplanacak"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateBasicTrim} 
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {basicTrimResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 Temel Trim Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trim Açısı (θ)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {basicTrimResults.trimAngle.toFixed(2)}°
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">MCT</Label>
                      <div className="text-lg font-bold text-green-600">
                        {basicTrimResults.mct.toFixed(1)} ton.m/cm
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Trim Değişimi (ΔT)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {basicTrimResults.trimChange.toFixed(1)} cm
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              {/* Formül 1: List Açısı - θ = arctan(TG / GM) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700">📐 List Açısı Hesaplama</h3>
                <p className="text-sm text-gray-600">θ = arctan(TG / GM)</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="transverseG">Enine Ağırlık Merkezi TG [m]</Label>
                    <Input
                      id="transverseG"
                      type="number"
                      step="0.01"
                      value={trimData.transverseG || ''}
                      onChange={(e) => setTrimData({...trimData, transverseG: parseFloat(e.target.value)})}
                      placeholder="0.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="GM_list">Metasentrik Yükseklik GM [m]</Label>
                    <Input
                      id="GM_list"
                      type="number"
                      step="0.01"
                      value={trimData.GM || ''}
                      onChange={(e) => setTrimData({...trimData, GM: parseFloat(e.target.value)})}
                      placeholder="1.2"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 2: List Moment - M_list = W × d */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-700">⚖️ List Moment Hesabı</h3>
                <p className="text-sm text-gray-600">M_list = W × d</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="listWeight">Ağırlık W [ton]</Label>
                    <Input
                      id="listWeight"
                      type="number"
                      step="0.1"
                      value={trimData.listWeight || ''}
                      onChange={(e) => setTrimData({...trimData, listWeight: parseFloat(e.target.value)})}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listDistance">Mesafe d [m]</Label>
                    <Input
                      id="listDistance"
                      type="number"
                      step="0.01"
                      value={trimData.listDistance || ''}
                      onChange={(e) => setTrimData({...trimData, listDistance: parseFloat(e.target.value)})}
                      placeholder="2.0"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Formül 3: Doğrultma Momenti - M_righting = Δ × GM × sin(θ) */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-purple-700">🔄 Doğrultma Momenti</h3>
                <p className="text-sm text-gray-600">M_righting = Δ × GM × sin(θ)</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displacement_list">Deplasman Δ [ton]</Label>
                    <Input
                      id="displacement_list"
                      type="number"
                      value={trimData.displacement || ''}
                      onChange={(e) => setTrimData({...trimData, displacement: parseFloat(e.target.value)})}
                      placeholder="15000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="GM_righting">GM [m]</Label>
                    <Input
                      id="GM_righting"
                      type="number"
                      step="0.01"
                      value={trimData.GM || ''}
                      onChange={(e) => setTrimData({...trimData, GM: parseFloat(e.target.value)})}
                      placeholder="1.2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="listAngle">List Açısı θ [°]</Label>
                    <Input
                      id="listAngle"
                      type="number"
                      step="0.1"
                      value={trimData.listAngle || ''}
                      onChange={(e) => setTrimData({...trimData, listAngle: parseFloat(e.target.value)})}
                      placeholder="5.0"
                    />
                  </div>
                </div>
              </div>

              {/* Hesaplama Butonu */}
              <div className="flex justify-center pt-4">
                <Button 
                  onClick={calculateList} 
                  className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Hesapla
                </Button>
              </div>

              {/* Sonuçlar */}
              {listResults && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-800">📊 List Hesaplama Sonuçları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">List Açısı (θ)</Label>
                      <div className="text-lg font-bold text-blue-600">
                        {listResults.listAngle.toFixed(2)}°
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">List Moment (M_list)</Label>
                      <div className="text-lg font-bold text-green-600">
                        {listResults.listMoment.toFixed(1)} ton.m
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Doğrultma Momenti (M_righting)</Label>
                      <div className="text-lg font-bold text-purple-600">
                        {listResults.rightingMoment.toFixed(1)} ton.m
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