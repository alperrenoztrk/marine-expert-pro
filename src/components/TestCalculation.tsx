import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

export const TestCalculation = () => {
  const [L, setL] = useState("");
  const [B, setB] = useState("");
  const [T, setT] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateDisplacement = () => {
    const length = parseFloat(L);
    const breadth = parseFloat(B);
    const draft = parseFloat(T);
    
    if (length && breadth && draft) {
      // Simple displacement calculation: V = L × B × T × CB (assuming CB = 0.7)
      const CB = 0.7;
      const displacement = length * breadth * draft * CB * 1.025; // tonnes
      setResult(displacement);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Test Hesaplama - Deplasман
        </CardTitle>
        <CardDescription>
          Basit deplasman hesaplaması
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="length">Boy (L) - m</Label>
            <Input
              id="length"
              type="number"
              value={L}
              onChange={(e) => setL(e.target.value)}
              placeholder="200"
            />
          </div>
          <div>
            <Label htmlFor="breadth">Genişlik (B) - m</Label>
            <Input
              id="breadth"
              type="number"
              value={B}
              onChange={(e) => setB(e.target.value)}
              placeholder="30"
            />
          </div>
          <div>
            <Label htmlFor="draft">Su Çekimi (T) - m</Label>
            <Input
              id="draft"
              type="number"
              value={T}
              onChange={(e) => setT(e.target.value)}
              placeholder="12"
            />
          </div>
        </div>
        
        <Button onClick={calculateDisplacement} className="w-full">
          Deplasman Hesapla
        </Button>
        
        {result !== null && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-green-800">
                  Deplasman: {result.toFixed(2)} ton
                </p>
                <p className="text-sm text-green-600 mt-2">
                  Hesaplama: {L} × {B} × {T} × 0.7 × 1.025 = {result.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};