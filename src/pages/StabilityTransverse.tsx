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

      {/* Hidrostatik Temeller */}
      <Card>
        <CardHeader>
          <CardTitle>Hidrostatik Temeller</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/displacement')}>
            <Shield className="h-4 w-4" /> Deplasman (Δ)
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/tpc')}>
            <BarChart3 className="h-4 w-4" /> TPC ve MTC
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/draft')}>
            <ArrowRight className="h-4 w-4" /> KB, BM, KM Hesaplamaları
          </Button>
        </CardContent>
      </Card>

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

      {/* Özel Heeling Etkileri */}
      <Card>
        <CardHeader>
          <CardTitle>Özel Heeling Etkileri</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/wind-heel')}>
            <Wind className="h-4 w-4" /> Rüzgâr Etkisi
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/passenger-shift')}>
            <ArrowRight className="h-4 w-4" /> Yolcu/Ekip Şifti
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/turning-heel')}>
            <Anchor className="h-4 w-4" /> Dönüş Santrifüj Yalpası
          </Button>
        </CardContent>
      </Card>

      {/* Test ve Özel Durumlar */}
      <Card>
        <CardHeader>
          <CardTitle>Test ve Özel Durumlar</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/inclination-test')}>
            <Shield className="h-4 w-4" /> İnklinasyon Deneyi
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/roll-period')}>
            <BarChart3 className="h-4 w-4" /> Yalpa Periyodu
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/stability/loll')}>
            <Anchor className="h-4 w-4" /> Angle of Loll
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