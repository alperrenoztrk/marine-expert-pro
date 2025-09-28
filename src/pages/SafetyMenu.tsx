import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LifeBuoy, Shield, AlertTriangle, Flame } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function SafetyMenu(){
  const items = [
    { to: "/safety", icon: <Shield className="h-4 w-4" />, label: "Risk Değerlendirme" },
    { to: "/safety", icon: <AlertTriangle className="h-4 w-4" />, label: "Acil Durum" },
    { to: "/safety", icon: <Flame className="h-4 w-4" />, label: "Yangın" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>
      <Card>
        <CardHeader><CardTitle>Güvenlik Hesaplamaları</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((it)=> (
              <Link key={it.label} to={it.to}>
                <Button variant="outline" className="w-full justify-start gap-2">{it.icon}{it.label}</Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}