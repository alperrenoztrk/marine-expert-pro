import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, Calculator, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EconomicCalculationsCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="h-full border-info/20 hover:border-info/30 transition-colors">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <DollarSign className="w-5 h-5 text-green-500" />
          Deniz İşletmeciliğinde Ticari Operasyonlar
        </CardTitle>
        <CardDescription>
          Navlun ekonomisi, kârlılık ve operasyonel maliyetler
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <TrendingUp className="w-4 h-4 text-info" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Time Charter Equivalent (TCE)</h4>
              <p className="text-xs text-muted-foreground">Günlük kârlılık hesabı</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Calculator className="w-4 h-4 text-orange-500" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Demurrage/Despatch</h4>
              <p className="text-xs text-muted-foreground">Bekleme süresi ve ücret</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <DollarSign className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <h4 className="font-medium text-sm">Sefer Ekonomisi</h4>
              <p className="text-xs text-muted-foreground">Kârlılık ve maliyet analizi</p>
            </div>
          </div>
        </div>
        
        <Button 
          onClick={() => navigate("/economics")} 
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 cyberpunk:from-yellow-500 cyberpunk:to-yellow-600 cyberpunk:hover:from-yellow-600 cyberpunk:hover:to-yellow-700"
        >
          Hesaplamalara Git
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};