import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Brain, Sigma, BookOpen, ListChecks, FileText, FileDown } from "lucide-react";

export default function NavigationMenu() {
  const items = [
    { to: "/navigation", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" },
    { to: "/navigation/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
    { to: "/navigation/topics", icon: <FileText className="h-4 w-4" />, label: "Konu Anlatımı" },
    { to: "/regulations", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
    { to: "/navigation/colreg-presentation", icon: <FileDown className="h-4 w-4" />, label: "COLREG Ders Sunumu" },
    { to: "/navigation/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
    { to: "/navigation/quiz", icon: <ListChecks className="h-4 w-4" />, label: "Quiz" },
  ];

  return (
    <div key="navigation-menu-v2" className="relative min-h-screen overflow-hidden" data-no-translate>
      {/* Background to match the main menu styling */}
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
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-white drop-shadow-sm text-center">Seyir</h1>
        </div>

        {/* Menu items in card style */}
        <div className="space-y-6">
          {items.map((it) => (
            <Link
              key={it.to}
              to={it.to}
              className="block rounded-2xl border border-white/30 p-6 bg-white/10 hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  {React.cloneElement(it.icon as React.ReactElement, { className: "w-12 h-12 text-white drop-shadow-lg", strokeWidth: 1.5 })}
                </div>
                <div className="flex-1">
                  <span className="text-2xl font-bold text-white drop-shadow-sm">{it.label}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}