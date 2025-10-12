import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BarChart3 } from "lucide-react";

const DraftSurveyDensity = () => {
  const [seawaterDensity, setSeawaterDensity] = useState("");
  const [standardDensity, setStandardDensity] = useState("1.025");
  const [displacement, setDisplacement] = useState("");
  const [correction, setCorrection] = useState<number | null>(null);

  const calculateDensityCorrection = () => {
    const density = parseFloat(seawaterDensity);
    const standard = parseFloat(standardDensity);
    const disp = parseFloat(displacement);

    if (density && standard && disp) {
      const correctionValue = disp * ((density - standard) / standard);
      setCorrection(correctionValue);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yoğunluk Düzeltmesi</h1>
          <p className="text-muted-foreground">Deniz suyu yoğunluk etkisi hesaplama</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yoğunluk Düzeltme Hesaplama
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="seawater-density">Deniz Suyu Yoğunluğu (t/m³)</Label>
              <Input
                id="seawater-density"
                type="number"
                step="0.001"
                value={seawaterDensity}
                onChange={(e) => setSeawaterDensity(e.target.value)}
                placeholder="1.025"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standard-density">Standart Yoğunluk (t/m³)</Label>
              <Input
                id="standard-density"
                type="number"
                step="0.001"
                value={standardDensity}
                onChange={(e) => setStandardDensity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displacement">Deplasman (ton)</Label>
              <Input
                id="displacement"
                type="number"
                step="0.1"
                value={displacement}
                onChange={(e) => setDisplacement(e.target.value)}
                placeholder="20000"
              />
            </div>
          </div>

          <Button onClick={calculateDensityCorrection} className="w-full">
            Yoğunluk Düzeltmesini Hesapla
          </Button>

          {correction !== null && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Hesaplama Sonucu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-lg font-semibold">
                    Yoğunluk Düzeltmesi: <span className="text-primary">{correction.toFixed(2)} ton</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {correction > 0 ? "Pozitif düzeltme (ekleme)" : "Negatif düzeltme (çıkarma)"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Yoğunluk Düzeltmesi Hakkında</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Deniz suyunun yoğunluğu coğrafi konuma, sıcaklığa ve tuzluluk oranına göre değişir. 
            Bu hesaplama, geminin farklı yoğunluktaki sularda nasıl davranacağını belirlemek için kullanılır.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftSurveyDensity;