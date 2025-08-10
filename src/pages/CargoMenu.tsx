import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Boxes, Shield, Wheat, Package, Truck, DollarSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function CargoMenu() {
  const items = [
    { to: "/cargo/distribution", icon: <LayoutGrid className="h-4 w-4" />, label: "Dağılım" },
    { to: "/cargo/containers", icon: <Boxes className="h-4 w-4" />, label: "Konteyner" },
    { to: "/cargo/securing", icon: <Shield className="h-4 w-4" />, label: "Güçlendirme" },
    { to: "/cargo/grain", icon: <Wheat className="h-4 w-4" />, label: "Tahıl" },
    { to: "/cargo/survey", icon: <Package className="h-4 w-4" />, label: "Survey" },
    { to: "/cargo/planning", icon: <Truck className="h-4 w-4" />, label: "Yükleme Planı" },
    { to: "/cargo/costs", icon: <DollarSign className="h-4 w-4" />, label: "Maliyet" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
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
          <CardTitle>Kargo Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {items.map((it)=> (
              <Link key={it.to} to={it.to}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  {it.icon}
                  {it.label}
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}