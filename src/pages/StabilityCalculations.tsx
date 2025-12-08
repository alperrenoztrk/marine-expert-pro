import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";

export default function StabilityCalculationsPage() {
  return (
    <MobileLayout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/stability">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/50 dark:hover:bg-slate-900/40">
                <ArrowLeft className="h-4 w-4" />
                Stabilite
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Stabilite Hesaplamaları
            </h1>
          </div>

          <StabilityCalculations />
        </div>
      </div>
    </MobileLayout>
  );
}
