import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Ship } from "lucide-react";
import { Link } from "react-router-dom";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";

const Stability = () => {
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
            <Ship className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Stabilite Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Gemi stabilite analizi ve hesaplama araçları
          </p>
        </div>

        {/* Stability Calculations */}
        <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-3">
              <Ship className="h-8 w-8" />
              Stabilite Hesaplama Modülü
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <StabilityCalculations />
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            GM, BM, KB, GZ eğrisi ve stabilite kriterleri hesaplamaları
          </p>
        </div>

      </div>
    </div>
  );
};

export default Stability;