import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Shield, Waves, Compass, Cog, Cloud, LifeBuoy, Wrench, Factory, DollarSign, Droplets, Ruler, BarChart3 } from "lucide-react";

export default function CalculationsMenu() {
  const groups = [
    {
      title: 'Kargo ve Stabilite',
      items: [
        { to: "/cargo", icon: <Package className="h-4 w-4" />, label: "Kargo" },
        { to: "/stability", icon: <Shield className="h-4 w-4" />, label: "Stabilite" },
      ]
    },
    {
      title: 'Gemi Performansı',
      items: [
        { to: "/hydrodynamics", icon: <Waves className="h-4 w-4" />, label: "Hidrodinamik" },
        { to: "/engine", icon: <Cog className="h-4 w-4" />, label: "Makine" },
        { to: "/navigation", icon: <Compass className="h-4 w-4" />, label: "Seyir" },
      ]
    },
    {
      title: 'Operasyonel',
      items: [
        { to: "/tank", icon: <Ruler className="h-4 w-4" />, label: "Tank" },
        { to: "/ballast", icon: <Droplets className="h-4 w-4" />, label: "Balast" },
        { to: "/trim", icon: <Ruler className="h-4 w-4" />, label: "Trim & List" },
      ]
    },
    {
      title: 'Çevre ve Güvenlik',
      items: [
        { to: "/weather", icon: <Cloud className="h-4 w-4" />, label: "Hava" },
        { to: "/safety", icon: <LifeBuoy className="h-4 w-4" />, label: "Emniyet" },
        { to: "/structural", icon: <Wrench className="h-4 w-4" />, label: "Yapısal" },
        { to: "/emissions", icon: <Factory className="h-4 w-4" />, label: "Emisyon" },
      ]
    },
    {
      title: 'Ekonomi',
      items: [
        { to: "/economics", icon: <DollarSign className="h-4 w-4" />, label: "Ekonomi" },
        { to: "/regulations", icon: <BarChart3 className="h-4 w-4" />, label: "Regülasyonlar" },
      ]
    }
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

      {groups.map((g) => (
        <Card key={g.title}>
          <CardHeader>
            <CardTitle>{g.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {g.items.map((it) => (
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
      ))}
    </div>
  );
}