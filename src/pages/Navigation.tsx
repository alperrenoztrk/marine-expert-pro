import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { CalculationHero } from "@/components/ui/calculation-hero";
import navigationCompass from "@/assets/maritime/navigation-compass.jpg";

const Navigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <CalculationHero
          title="Seyir Hesaplamaları"
          description="Denizcilik navigasyon ve rota planlama araçları"
          imageSrc={navigationCompass}
          imageAlt="Navigation Compass"
        />

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Compass className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              <span data-translatable>Seyir Hesaplamaları</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Mesafe, hız, rota, konum ve zaman hesaplamalarınızı yapın
          </p>
        </div>

        {/* Navigation Calculations */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Compass className="h-6 w-6 text-blue-600" />
              Seyir Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* NavigationCalculations component was removed from imports, so this section is now empty */}
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center text-sm text-gray-500">
          Great Circle, Rhumb Line, Compass hesaplamaları ve daha fazlası
        </div>
      </div>
    </div>
  );
};

export default Navigation;