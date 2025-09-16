import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Compass, Calculator, Brain, BookOpen, Sigma, ListChecks } from "lucide-react";
import { Link } from "react-router-dom";

const NavigationCalculationsPage = () => {
  const navMenuItems = [
    { to: "/navigation-menu", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
    { to: "/regulations", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" },
    { to: "/formulas", icon: <Sigma className="h-4 w-4" />, label: "Formüller" },
    { to: "/navigation", icon: <Calculator className="h-4 w-4" />, label: "Hesaplamalar" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 cyberpunk:from-black cyberpunk:to-gray-900 neon:from-slate-900 neon:to-slate-800 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-blue-50 dark:hover:bg-gray-700 cyberpunk:hover:bg-gray-800 neon:hover:bg-slate-800">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Compass className="h-12 w-12 text-blue-600 dark:text-blue-400 nature-icon" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent nature-title">
              <span data-translatable>Seyir Hesaplamaları</span>
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Mesafe, hız, rota, konum ve zaman hesaplamalarınızı yapın
          </p>
        </div>

        {/* Top Menu (Assistant, Rules, Formulas, Calculations, Quiz) */}
        <Card>
          <CardHeader>
            <CardTitle data-no-translate>Seyir Hesaplamaları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 py-1">
              {navMenuItems.map((it) => (
                <Link key={it.to} to={it.to}>
                  <Button variant="outline" className="justify-start gap-2 whitespace-nowrap" data-no-translate>
                    {it.icon}
                    {it.label}
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sadece üst menü butonları gösteriliyor */}
      </div>
    </div>
  );
};

export default NavigationCalculationsPage;