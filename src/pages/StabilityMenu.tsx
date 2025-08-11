import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, Ruler, Wheat, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const items = [
    { to: "/stability/hydrostatic", icon: <Waves className="h-4 w-4" />, label: "Hidrostatik" },
    { to: "/stability/stability", icon: <Shield className="h-4 w-4" />, label: "Stabilite" },
    { to: "/stability/trimlist", icon: <Ship className="h-4 w-4" />, label: "Trim & List" },
    { to: "/stability/analysis", icon: <BarChart3 className="h-4 w-4" />, label: "Analiz Özeti" },
    { to: "/stability/bonjean", icon: <Ruler className="h-4 w-4" />, label: "Bonjean" },
    { to: "/stability/draft", icon: <Waves className="h-4 w-4" />, label: "Draft Survey" },
    { to: "/stability/damage", icon: <AlertTriangle className="h-4 w-4" />, label: "Hasar" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfa
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((it)=> (
              <Link key={it.to} to={it.to}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  {it.icon}
                  {it.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}