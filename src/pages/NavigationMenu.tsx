import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Compass, Map, Clock, Ruler, Anchor, Book, Star, Camera } from "lucide-react";

export default function NavigationMenu(){
  const items = [
    { to: "/navigation", icon: <Compass className="h-4 w-4" />, label: "Seyir Ana Sayfa" },
    { to: "/navigation?tab=route", icon: <Map className="h-4 w-4" />, label: "Rota" },
    { to: "/navigation?tab=plane-sailing", icon: <Ruler className="h-4 w-4" />, label: "Plane Sailing" },
    { to: "/navigation?tab=traverse-sailing", icon: <Compass className="h-4 w-4" />, label: "Traverse" },
    { to: "/navigation?tab=route-plan", icon: <Map className="h-4 w-4" />, label: "Route Plan" },
    { to: "/navigation?tab=real-time", icon: <Clock className="h-4 w-4" />, label: "Real Time" },
    { to: "/navigation?tab=current-wind", icon: <Clock className="h-4 w-4" />, label: "Current Wind" },
    { to: "/navigation?tab=current", icon: <Clock className="h-4 w-4" />, label: "Akıntı" },
    { to: "/navigation?tab=compass", icon: <Compass className="h-4 w-4" />, label: "Pusula" },
    { to: "/navigation?tab=radar", icon: <Compass className="h-4 w-4" />, label: "Radar" },
    { to: "/navigation?tab=tide", icon: <Clock className="h-4 w-4" />, label: "Gelgit" },
    { to: "/navigation?tab=weather", icon: <Clock className="h-4 w-4" />, label: "Hava" },
    { to: "/navigation?tab=marine-weather", icon: <Clock className="h-4 w-4" />, label: "Deniz Hava" },
    { to: "/navigation?tab=sunrise", icon: <Clock className="h-4 w-4" />, label: "Gündoğumu" },
    { to: "/navigation?tab=port", icon: <Anchor className="h-4 w-4" />, label: "Liman" },
    { to: "/navigation?tab=celestial", icon: <Book className="h-4 w-4" />, label: "Göksel" },
    { to: "/navigation?tab=astronomical", icon: <Book className="h-4 w-4" />, label: "Astronomik" },
    { to: "/navigation?tab=almanac", icon: <Book className="h-4 w-4" />, label: "Almanac" },
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