import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StabilityAthwartship() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-6 space-y-4">
      <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/stability')}>
        <ArrowLeft className="h-4 w-4" />
        Geri Dön
      </Button>
      <h1 className="text-2xl font-bold">Enine Stabilite</h1>
      <p className="text-muted-foreground">Bu sayfa enine stabilite hesaplamaları için yer tutucudur. Detaylar yakında.</p>
    </div>
  );
}