import React from "react";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Link } from "react-router-dom";
import { ArrowLeft, DollarSign, TrendingUp, Calculator, Ship, PieChart } from "lucide-react";

export default function EconomicsMenu() {
  const items = [
    { to: "/economics", icon: TrendingUp, label: "TCE Hesabı" },
    { to: "/economics", icon: Calculator, label: "Demurrage/Despatch" },
    { to: "/economics", icon: Ship, label: "Sefer Ekonomisi" },
    { to: "/economics", icon: PieChart, label: "Maliyet Analizi" },
    { to: "/economics", icon: DollarSign, label: "Kârlılık Hesabı" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link to="/calculations">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/50 dark:hover:bg-slate-900/40">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-3">
            Mali Hesaplamalar
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <IconButton
              key={item.label}
              to={item.to}
              icon={item.icon}
              label={item.label}
              variant="amber"
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
