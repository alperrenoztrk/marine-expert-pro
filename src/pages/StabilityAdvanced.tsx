import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";

export default function StabilityAdvancedPage() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Gelişmiş Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <StabilityCalculations />
        </CardContent>
      </Card>
    </div>
  );
}

