import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, BookOpen, Calculator, Sigma, ListChecks, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

export default function StabilityMenu() {
  const groups = [
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/calculations", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" },
        { to: "/stability/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
        { to: "/stability/topic-explanation", icon: <GraduationCap className="h-4 w-4" />, label: "Konu Anlatımı" },
        { to: "/stability/rules", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
        { to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
        { to: "/stability/quiz", icon: <ListChecks className="h-4 w-4" />, label: "Quiz" },
        
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);

  return (
    <div key="stability-menu-v4" className="relative min-h-screen overflow-hidden" data-no-translate>
      {/* Background to match the blue main menu */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        {/* Page title without icon */}
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 drop-shadow-sm">Stabilite</h1>
        </div>

        {/* Menu items styled like the main menu */}
        <div className="space-y-6">
          {items.map((it)=> (
            <Link
              key={it.to}
              to={it.to}
              className="block rounded-2xl border border-white/30 p-6 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {React.cloneElement(it.icon as React.ReactElement, { className: "w-12 h-12 text-blue-700 drop-shadow-lg", strokeWidth: 1.5 })}
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-bold text-blue-700 drop-shadow-sm">{it.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}