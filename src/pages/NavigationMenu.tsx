import React from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Brain, Sigma, BookOpen, ListChecks, FileText, FileDown } from "lucide-react";

export default function NavigationMenu() {
  const items = [
    { to: "/navigation", icon: Calculator, label: "Hesaplamalar" },
    { to: "/navigation/formulas", icon: Sigma, label: "Formüller" },
    { to: "/navigation/topics", icon: FileText, label: "Konu Anlatımı" },
    { to: "/regulations", icon: BookOpen, label: "Kurallar" },
    { to: "/navigation/colreg-presentation", icon: FileDown, label: "COLREG Ders Sunumu" },
    { to: "/navigation/assistant", icon: Brain, label: "Asistan" },
    { to: "/navigation/quiz", icon: ListChecks, label: "Quiz" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]" data-no-translate>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-card/50">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-3">
            Seyir
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <IconButton
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              variant="primary"
              animationDelay={index * 100}
            />
          ))}
        </div>
      </div>
    </div>
  );
}