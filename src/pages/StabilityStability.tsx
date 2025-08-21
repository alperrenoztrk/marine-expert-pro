import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HydrostaticsStabilityCalculations } from "@/components/calculations/HydrostaticsStabilityCalculations";
import { BasicStabilityCalculations } from "@/components/calculations/BasicStabilityCalculations";
import { AdvancedStabilityWizard } from "@/components/calculations/AdvancedStabilityWizard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StabilityAssistantPopup from "@/components/StabilityAssistantPopup";

export default function StabilityStabilityPage(){
  const navigate = useNavigate();
  const [mode, setMode] = useState<'select'|'basic'|'advanced'>('select');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  
  useEffect(()=>{
    try { setHasProfile(!!localStorage.getItem('advanced-ship-profile')); } catch {}
  }, []);
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
      {mode==='select' && (
        <Card>
          <CardContent className="p-6 grid gap-3">
            <div className="text-lg font-semibold">Stabilite Modu Seçin</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button onClick={()=> setMode('basic')}>1) Temel Hesaplamalar</Button>
              <Button variant="secondary" onClick={()=> setMode('advanced')}>2) Gelişmiş Hesaplamalar</Button>
            </div>
            <div className="text-xs opacity-70">
              Temel: GM, KG, KM, BM, TPC, draft değişimi, LCG gibi hızlı hesaplamalar.
              Gelişmiş: Gemi profilinizi bir kez kurun (tanklar vb.) ve gerçek hesaplamaları çalıştırın.
            </div>
          </CardContent>
        </Card>
      )}

      {mode==='basic' && (
        <BasicStabilityCalculations />
      )}

      {mode==='advanced' && (
        <>
          <div className="flex items-center gap-2">
            <Button onClick={()=> setWizardOpen(true)}>{hasProfile ? 'Profili Güncelle' : 'Profili Kur'}</Button>
            <Button variant="outline" onClick={()=> setMode('select')}>Mod Seçimine Dön</Button>
          </div>
          <HydrostaticsStabilityCalculations singleMode section="stability" />
          <AdvancedStabilityWizard open={wizardOpen} onClose={()=> setWizardOpen(false)} onSaved={()=> setHasProfile(true)} />
        </>
      )}
      
      {/* Stabilite Asistanı */}
      <div className="mt-6">
        <StabilityAssistantPopup />
      </div>
    </div>
  );
}