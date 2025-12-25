import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { EconomicCalculations } from "@/components/calculations/EconomicCalculations";

const Economics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Deniz İşletmeciliğinde Ticari Operasyonlar
            </h1>
            <p className="text-gray-600 mt-1">
              Navlun ekonomisi, kârlılık ve operasyon yönetimi
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0">
                      <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 from-yellow-500 to-yellow-600 text-white rounded-t-lg">
            <CardTitle className="text-xl">Maritime Economics</CardTitle>
            <CardDescription className="text-blue-100">
              TCE, Demurrage ve Sefer Ekonomisi hesaplamaları
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <EconomicCalculations />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Economics;