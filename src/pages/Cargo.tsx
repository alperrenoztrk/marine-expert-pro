import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { CargoCalculations } from "@/components/calculations/CargoCalculations";

const Cargo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Package className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kargo Operasyonları
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Yük hesaplamaları, istif planı ve ağırlık merkezi hesaplamalarınızı yapın
          </p>
        </div>

        {/* Cargo Calculations */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-6 w-6 text-blue-600" />
              Kargo Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CargoCalculations />
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center text-sm text-gray-500">
          Yük kapasitesi, istif optimizasyonu ve ağırlık dağılım analizleri
        </div>
      </div>
    </div>
  );
};

export default Cargo;