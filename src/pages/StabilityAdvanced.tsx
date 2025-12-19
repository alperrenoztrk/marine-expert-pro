import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StabilityCalculations } from "@/components/calculations/StabilityCalculations";

export default function StabilityAdvancedPage() {
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <StabilityCalculations />
        </CardContent>
      </Card>
    </div>
  );
}
