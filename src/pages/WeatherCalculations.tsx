import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Cloud, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { WeatherCalculations as WeatherCalcs } from "@/components/calculations/WeatherCalculations";
import { Separator } from "@/components/ui/separator";

const WeatherCalculationsPage = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Cloud className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              Meteoroloji Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Beaufort & Douglas skalaları, rüzgar/akıntı etkileri ve kuvvet analizi
          </p>
        </div>

        {/* Weather Calculations */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Cloud className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Meteoroloji ve Oşinografi Hesaplama Modülü
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherCalcs />
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Beaufort & Douglas skalaları, rüzgar/akıntı kuvvet analizi ve seyir düzeltmeleri
        </div>
      </div>
    </div>
  );
};

export default WeatherCalculationsPage;