import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Shield, BarChart3, Anchor, Wind, LineChart as LineChartIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityTransversePage() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4 space-y-3" data-no-translate>
{/* Ağırlık Merkezi ve GM */}
      <Card>
        <CardHeader>
          <CardTitle>Ağırlık Merkezi ve GM</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/gm')}>
            <Shield className="h-4 w-4" /> GM Hesaplama
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/weight-shift')}>
            <ArrowRight className="h-4 w-4" /> Ağırlık Ekleme/Çıkarma/Şift
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/free-surface')}>
            <Wind className="h-4 w-4" /> Serbest Yüzey Etkisi
          </Button>
        </CardContent>
      </Card>

      {/* GZ ve Moment Hesaplamaları */}
      <Card>
        <CardHeader>
          <CardTitle>GZ ve Moment Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/gz')}>
            <BarChart3 className="h-4 w-4" /> GZ Hesaplama
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/analysis')}>
            <LineChartIcon className="h-4 w-4" /> Dinamik Stabilite
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/gz-imo')}>
            <Shield className="h-4 w-4" /> IMO Kriterleri
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