import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, AlertTriangle, ArrowLeft, Brain, BookOpen, Activity, Package, Droplets, Building, Route, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const groups = [
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
        { to: "/stability/rules", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" }
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);
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
          <div className="space-y-4">
            {/* Basitleştirilmiş arayüz: sadece iki seçenek */}
            
            {/* All Items */}
            <div className="flex flex-wrap gap-2 py-1">
              {items.map((it)=> (
                <Link key={it.to} to={it.to}>
                  <Button variant="outline" className="justify-start gap-2 whitespace-nowrap" data-no-translate>
                    {it.icon}
                    {it.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}