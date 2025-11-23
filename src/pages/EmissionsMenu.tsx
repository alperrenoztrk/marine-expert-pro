import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Factory, Leaf, Cloud } from "lucide-react";

export default function EmissionsMenu(){
  const items = [
    { to: "/emissions", icon: <Factory className="h-4 w-4" />, label: "NOx / SOx / CO2" },
    { to: "/emissions", icon: <Leaf className="h-4 w-4" />, label: "EEOI / CII" },
    { to: "/emissions", icon: <Cloud className="h-4 w-4" />, label: "Emisyon Raporu" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader><CardTitle>Emisyon Hesaplamaları</CardTitle></CardHeader>
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