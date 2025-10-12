import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DollarSign, TrendingUp, Calculator, Ship, PieChart } from "lucide-react";

export default function EconomicsMenu() {
  const items = [
    { to: "/economics", icon: <TrendingUp className="h-4 w-4" />, label: "TCE Hesabı" },
    { to: "/economics", icon: <Calculator className="h-4 w-4" />, label: "Demurrage/Despatch" },
    { to: "/economics", icon: <Ship className="h-4 w-4" />, label: "Sefer Ekonomisi" },
    { to: "/economics", icon: <PieChart className="h-4 w-4" />, label: "Maliyet Analizi" },
    { to: "/economics", icon: <DollarSign className="h-4 w-4" />, label: "Kârlılık Hesabı" },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mali Hesaplamalar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((item) => (
              <Link key={item.label} to={item.to}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}