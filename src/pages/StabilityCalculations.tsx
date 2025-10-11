import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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

        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground text-lg">
            Bu sayfa hazırlanıyor...
          </p>
        </div>
      </div>
    </MobileLayout>
  );
}
