import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StabilityCalculatorWorkflow from "@/components/stability/StabilityCalculatorWorkflow";

export default function StabilityCalculatorPage() {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/stability');
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>
      
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold gradient-text">
            Kapsamlı Gemi Stabilite Hesaplayıcısı
          </h1>
          <p className="text-lg text-muted-foreground">
            Adım adım gemi stabilite analizi ve IMO kriter kontrolü
          </p>
        </div>

        <StabilityCalculatorWorkflow />
      </div>
    </div>
  );
}