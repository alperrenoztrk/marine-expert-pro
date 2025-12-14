import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UnifiedMaritimeAssistant } from "@/components/UnifiedMaritimeAssistant";

export default function SeamanshipAssistantPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate("/calculations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Gemicilik Asistanı
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
            Gemicilik Asistanı
          </h1>
          <p className="text-muted-foreground mt-2">
            Vardiya, bakım ve güvenlik için öneri setleri
          </p>
        </div>

        <UnifiedMaritimeAssistant
          title="Gemicilik Danışmanı"
          subtitle="Demirleme, palamar, vardiya ve operasyonel sorularınız için"
          systemPrompt="Sen bir denizcilik operasyonları uzmanısın. Demirleme, palamar işlemleri, vardiya yönetimi, ağır hava prosedürleri, COLREG, ISM ve ISPS kodları konularında detaylı bilgi sahibisin. Kullanıcılara güverte operasyonları, bakım planlaması ve güvenlik prosedürleri konularında yardımcı ol. Yanıtlarını Türkçe ver."
          placeholderText="Demirleme veya güverte operasyonları hakkında soru sorun..."
          suggestedQuestions={[
            "Ağır havada demirleme prosedürü nedir?",
            "Palamar hatlarının bakımı nasıl yapılır?",
            "Demir taraması durumunda ne yapılmalı?",
            "Vardiya devir tesliminde nelere dikkat edilmeli?"
          ]}
        />
      </div>
    </div>
  );
}
