import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Brain, Sigma, BookOpen, ListChecks } from "lucide-react";

export default function NavigationMenu(){
  const items = [
    { to: "/navigation", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" },
    { to: "/navigation/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
    { to: "/regulations", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
    { to: "/navigation/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
    { to: "/navigation/quiz", icon: <ListChecks className="h-4 w-4" />, label: "Quiz" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/calculations">
          <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="h-4 w-4" /> Geri</Button>
        </Link>
      </div>
      <div className="flex flex-col gap-3 max-w-md mx-auto">
        {items.map((it)=> (
          <Link key={it.label} to={it.to}>
            <Button variant="outline" className="w-full justify-center gap-3 h-14 text-lg font-semibold">{it.icon}<span className="text-blue-600">{it.label}</span></Button>
          </Link>
        ))}
      </div>
    </div>
  );
}