import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Map, Clock, Ruler, Anchor } from "lucide-react";

export default function NavigationMenu(){
  const items = [
    { to: "/navigation", icon: <Compass className="h-4 w-4" />, label: "Seyir Ana Sayfa" },
    { to: "/navigation", icon: <Map className="h-4 w-4" />, label: "Rota / Mesafe" },
    { to: "/navigation", icon: <Clock className="h-4 w-4" />, label: "ETA / ETD" },
    { to: "/navigation", icon: <Ruler className="h-4 w-4" />, label: "Paralel Seyir" },
    { to: "/navigation", icon: <Anchor className="h-4 w-4" />, label: "Demirleme" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Ana Sayfa</Button>
        </Link>
      </div>
      <Card>
        <CardHeader><CardTitle>Seyir Hesaplamaları</CardTitle></CardHeader>
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