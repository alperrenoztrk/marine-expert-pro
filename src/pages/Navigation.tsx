import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Compass } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { NavigationCalculations } from "@/components/calculations/NavigationCalculations";

const Navigation = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || undefined;
  return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
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
            <Compass className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              <span data-translatable>Seyir Hesaplamaları</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mesafe, hız, rota, konum ve zaman hesaplamalarınızı yapın
          </p>
        </div>

        {/* Navigation Calculations */}
        <NavigationCalculations initialTab={initialTab} />

        {/* Info */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Great Circle, Rhumb Line, Compass hesaplamaları ve daha fazlası
        </div>
      </div>
    </div>
  );
};

export default Navigation;