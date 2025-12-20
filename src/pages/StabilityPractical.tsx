import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Anchor, Waves, BarChart3 } from "lucide-react";

export default function StabilityPracticalPage() {
  return (
    <MobileLayout>
      <div className="space-y-4">
        {/* Only buttons visible */}
        <div className="grid grid-cols-1 gap-3">
          <Button variant="outline" className="w-full justify-start gap-3 py-6 text-lg" disabled>
            <Anchor className="h-5 w-5" /> Duba/Tank Hacmi ve Kütle
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 py-6 text-lg" disabled>
            <Waves className="h-5 w-5" /> FWA ve Yoğunluk
          </Button>
          <Button variant="outline" className="w-full justify-start gap-3 py-6 text-lg" disabled>
            <BarChart3 className="h-5 w-5" /> GHM Hesaplama
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
