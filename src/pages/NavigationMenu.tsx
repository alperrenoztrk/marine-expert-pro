import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Brain, Sigma, BookOpen, ListChecks } from "lucide-react";

export default function NavigationMenu(){
  const items = [
    { to: "/navigation", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" },
    { to: "/navigation/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
    { to: "/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
    { to: "/regulations", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
    { to: "/navigation/quiz", icon: <ListChecks className="h-4 w-4" />, label: "Quiz" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Ana Sayfa</Button>
        </Link>
      </div>
      <Card>
        <CardHeader><CardTitle>Seyir Menüsü</CardTitle></CardHeader>
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