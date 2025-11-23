import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";

export default function StabilityCalculationsPage() {
  return (
    <MobileLayout>
      <div className="min-h-screen bg-white p-4">
        <div className="space-y-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/stability">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Stabilite
              </Button>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-blue-600">Stabilite Hesaplamaları</h1>
          </div>

          <StabilityCalculations />
        </div>
      </div>
    </MobileLayout>
  );
}
