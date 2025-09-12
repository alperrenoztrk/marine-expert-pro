import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, BookOpen, Calculator, Sigma, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const groups = [
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
        { to: "/stability/rules", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
        { to: "/stability/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
        { to: "/stability/calculations", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" },
        { to: "/stability/quiz", icon: <ListChecks className="h-4 w-4" />, label: "Quiz" }
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);

  return (
    <div key="stability-menu-v3" className="container mx-auto p-4 space-y-4" data-no-translate>
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
            {/* All Items (Assistant, Rules, Formulas, Calculations) */}
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