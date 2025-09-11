import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StableTalesCalculator } from "@/components/stable-tales/StableTalesCalculator";
import { PendulumStabilityCalc } from "@/components/stable-tales/PendulumStabilityCalc";
import { CraneBoomCalculations } from "@/components/stable-tales/CraneBoomCalculations";
import { DrydockStabilityCalc } from "@/components/stable-tales/DrydockStabilityCalc";
import { DamageStabilityCalc } from "@/components/stable-tales/DamageStabilityCalc";
import { AdvancedSOLASChecker } from "@/components/stable-tales/AdvancedSOLASChecker";
import { StabilityReportGenerator } from "@/components/stable-tales/StabilityReportGenerator";

export default function StableTalesPage() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/stability');
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2 hover:bg-primary hover:text-primary-foreground transition-colors mb-4" 
        onClick={handleBack}
      >
        <ArrowLeft className="h-4 w-4" />
        Stabilite Menüsüne Dön
      </Button>
      
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Stable Tales - Gelişmiş Gemi Stabilite Analizi
          </h1>
          <p className="text-lg text-muted-foreground">
            Profesyonel stabilite hesaplamaları, sarkaç metodu, kren operasyonları ve hasar analizi
          </p>
        </div>

        <Tabs defaultValue="calculator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7">
            <TabsTrigger value="calculator">Ana Hesaplama</TabsTrigger>
            <TabsTrigger value="pendulum">Sarkaç Metodu</TabsTrigger>
            <TabsTrigger value="crane">Kren/Bumba</TabsTrigger>
            <TabsTrigger value="drydock">Havuz Operasyonu</TabsTrigger>
            <TabsTrigger value="damage">Hasar Analizi</TabsTrigger>
            <TabsTrigger value="solas">SOLAS Kriterleri</TabsTrigger>
            <TabsTrigger value="report">Rapor Oluştur</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-4">
            <StableTalesCalculator />
          </TabsContent>

          <TabsContent value="pendulum" className="space-y-4">
            <PendulumStabilityCalc />
          </TabsContent>

          <TabsContent value="crane" className="space-y-4">
            <CraneBoomCalculations />
          </TabsContent>

          <TabsContent value="drydock" className="space-y-4">
            <DrydockStabilityCalc />
          </TabsContent>

          <TabsContent value="damage" className="space-y-4">
            <DamageStabilityCalc />
          </TabsContent>

          <TabsContent value="solas" className="space-y-4">
            <AdvancedSOLASChecker />
          </TabsContent>

          <TabsContent value="report" className="space-y-4">
            <StabilityReportGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}