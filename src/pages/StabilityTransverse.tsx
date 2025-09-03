import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Shield, BarChart3, Anchor, Wind, LineChart as LineChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityTransversePage() {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability');
  };
  return (
    <div className="container mx-auto p-6 space-y-4" data-no-translate>
      <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      {/* Enine Stabilite Alt Menüsü */}
      <Card>
        <CardHeader>
          <CardTitle>Enine Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/gm')}>
            <Shield className="h-4 w-4" /> GM Hesaplama
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/gz')}>
            <BarChart3 className="h-4 w-4" /> GZ Hesaplama
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/list')}>
            <ArrowRight className="h-4 w-4" /> List Açısı
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/loll')}>
            <Anchor className="h-4 w-4" /> Loll Açısı
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/analysis')}>
            <LineChartIcon className="h-4 w-4" /> GZ Eğrisi ve Dinamik Stabilite
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/gz-imo')}>
            <Wind className="h-4 w-4" /> IMO Kriterleri ve Weather
          </Button>
        </CardContent>
      </Card>


      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}