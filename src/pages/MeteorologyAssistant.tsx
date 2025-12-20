import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain } from "lucide-react";

import { UnifiedMaritimeAssistant } from "@/components/UnifiedMaritimeAssistant";

export default function MeteorologyAssistantPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
<div className="text-sm text-muted-foreground flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Meteoroloji Asistanı
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
            Meteoroloji Asistanı
          </h1>
          <p className="text-muted-foreground mt-2">
            Rota bazlı hava tavsiyeleri ve alarm eşikleri
          </p>
        </div>

        <UnifiedMaritimeAssistant />
      </div>
    </div>
  );
}
