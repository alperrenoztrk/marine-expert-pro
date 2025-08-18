import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, Ruler, AlertTriangle, ArrowLeft, Gauge, Brain, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const groups = [
    {
      title: 'Hidrostatik',
      items: [
        { to: "/stability/hydrostatic", icon: <Waves className="h-4 w-4" />, label: "Hidrostatik" }
      ]
    },
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/stability", icon: <Shield className="h-4 w-4" />, label: "Stabilite" }
      ]
    },
    {
      title: 'Trim & List',
      items: [
        { to: "/stability/trimlist", icon: <Ship className="h-4 w-4" />, label: "Trim & List" }
      ]
    },
    {
      title: 'Gelişmiş',
      items: [
        { to: "/stability/analysis", icon: <BarChart3 className="h-4 w-4" />, label: "Analiz" },
        { to: "/stability/bonjean", icon: <Ruler className="h-4 w-4" />, label: "Bonjean" },
        { to: "/stability/draft", icon: <Waves className="h-4 w-4" />, label: "Draft Survey" },
        { to: "/stability/damage", icon: <AlertTriangle className="h-4 w-4" />, label: "Hasar" },
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);
  items.push({ to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" } as any);
  items.push({ to: "/stability/rules", icon: <Shield className="h-4 w-4" />, label: "Kurallar" } as any);
  items.push({ to: "/stability/rules-basic", icon: <Shield className="h-4 w-4" />, label: "Kurallar (Temel)" } as any);
  return (
    <div key="stability-menu-v2" className="container mx-auto p-6 space-y-6" data-no-translate>
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
          <CardTitle data-no-translate>Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 py-1">
            {items.map((it)=> (
              <Link key={it.to} to={it.to} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="justify-start gap-2 whitespace-nowrap" data-no-translate>
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