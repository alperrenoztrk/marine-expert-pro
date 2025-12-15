import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Calculator } from "lucide-react";
import { WeatherCalculations as WeatherCalcs } from "@/components/calculations/WeatherCalculations";
import { Separator } from "@/components/ui/separator";

const WeatherCalculationsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,12%)] p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Cloud className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Meteoroloji Hesaplamaları
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Beaufort & Douglas skalaları, rüzgar/akıntı etkileri ve kuvvet analizi
          </p>
        </div>

        {/* Weather Calculations */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="shadow-lg border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Cloud className="h-6 w-6 text-primary" />
                Meteoroloji ve Oşinografi Hesaplama Modülü
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WeatherCalcs />
            </CardContent>
          </Card>
        </div>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          Beaufort & Douglas skalaları, rüzgar/akıntı kuvvet analizi ve seyir düzeltmeleri
        </div>
      </div>
    </div>
  );
};

export default WeatherCalculationsPage;