import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, Ruler, AlertTriangle, ArrowLeft, Gauge } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const groups = [
    {
      title: 'Hidrostatik',
      items: [
        { to: "/stability/displacement", icon: <Gauge className="h-4 w-4" />, label: "Deplasman" },
        { to: "/stability/draft-calc", icon: <Waves className="h-4 w-4" />, label: "Draft" },
        { to: "/stability/tpc", icon: <Ruler className="h-4 w-4" />, label: "TPC" },
      ]
    },
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/gm", icon: <Shield className="h-4 w-4" />, label: "GM" },
        { to: "/stability/gz", icon: <BarChart3 className="h-4 w-4" />, label: "GZ" },
      ]
    },
    {
      title: 'Trim & List',
      items: [
        { to: "/stability/trim", icon: <Ship className="h-4 w-4" />, label: "Trim" },
        { to: "/stability/list", icon: <Ship className="h-4 w-4" />, label: "List" },
        { to: "/stability/loll", icon: <AlertTriangle className="h-4 w-4" />, label: "Loll" },
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
      {groups.map((g)=> (
        <Card key={g.title}>
          <CardHeader>
            <CardTitle>{g.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {g.items.map((it)=> (
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