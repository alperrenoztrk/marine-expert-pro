import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Waves, Ruler, Activity, Package, LineChart, LifeBuoy, ClipboardCheck } from "lucide-react";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function Stability2() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Helmet>
        <title>Stabilite Hesaplamaları | Gelişmiş Stabilite Modülleri</title>
        <meta name="description" content="Stabilite hesaplamaları: Hidrostatik, stabilite, trim & list, analiz, bonjean, dip ve hasar stabilite hesaplamaları." />
        <link rel="canonical" href="/stability-2" />
      </Helmet>

      <header className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate('/calculations')}>
          <ArrowLeft className="h-4 w-4" />
          Ana Sayfa
        </Button>
      </header>

      <main>
        <h1 className="text-3xl font-bold mb-2" data-no-translate>Stabilite Hesaplamaları</h1>
        <p className="text-muted-foreground mb-6">İleri seviye stabilite hesaplamaları ve analizleri</p>

        {/* Stabilite Asistanı - Her zaman göster */}
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                AI Stabilite Asistanı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Stabilite hesaplamaları hakkında sorularınızı sorun ve detaylı açıklamalar alın.
              </p>
              <StabilityAssistantPopup />
            </CardContent>
          </Card>
        </div>

        {/* Ana Stabilite Kategorileri */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[
            <Card key="hydrostatic" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/hydrostatic')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Hidrostatik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Deplasman, Dip, TPC hesaplamaları
                </p>
              </CardContent>
            </Card>,

            <Card key="stability" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/stability')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  GM, GZ hesaplamaları
                </p>
              </CardContent>
            </Card>,

            <Card key="trimlist" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/trimlist')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  Trim & List
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Trim, List, Loll hesaplamaları
                </p>
              </CardContent>
            </Card>,

            <Card key="analysis" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/analysis')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Analiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Stabilite analizi ve değerlendirme
                </p>
              </CardContent>
            </Card>,

            <Card key="bonjean" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/bonjean')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Bonjean
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Bonjean diyagramları ve hesaplamaları
                </p>
              </CardContent>
            </Card>,

            <Card key="draft" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/draft')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Waves className="h-5 w-5" />
                  Dip & Su Dışarı Çıkarma
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Dip hesaplamaları ve su dışarı çıkarma
                </p>
              </CardContent>
            </Card>,

            <Card key="damage" className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/stability/damage')}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <LifeBuoy className="h-5 w-5" />
                  Hasar Stabilite
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Hasar sonrası stabilite hesaplamaları
                </p>
              </CardContent>
            </Card>
          ]}
        </div>
      </main>
    </div>
  );
}