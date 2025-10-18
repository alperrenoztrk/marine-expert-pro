import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Anchor, Waves, BarChart3 } from "lucide-react";

export default function StabilityPracticalPage() {
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

        {/* Only buttons visible */}
        <div className="grid grid-cols-1 gap-3">
          <Link to="/stability/practical/tank">
            <Button variant="outline" className="w-full justify-start gap-3 py-6 text-lg">
              <Anchor className="h-5 w-5" /> Duba/Tank Hacmi ve Kütle
            </Button>
          </Link>
          <Link to="/stability/practical/fwa">
            <Button variant="outline" className="w-full justify-start gap-3 py-6 text-lg">
              <Waves className="h-5 w-5" /> FWA ve Yoğunluk
            </Button>
          </Link>
          <Link to="/stability/practical/ghm">
            <Button variant="outline" className="w-full justify-start gap-3 py-6 text-lg">
              <BarChart3 className="h-5 w-5" /> GHM Hesaplama
            </Button>
          </Link>
        </div>
      </div>
    </MobileLayout>
  );
}
