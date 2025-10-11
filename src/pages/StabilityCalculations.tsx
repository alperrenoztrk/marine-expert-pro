import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";

export default function StabilityCalculationsPage() {
  return (
    <MobileLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link to="/stability">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Stabilite
            </Button>
          </Link>
        </div>

        <StabilityCalculations />
      </div>
    </MobileLayout>
  );
}
