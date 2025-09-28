import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Droplets } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function BallastMenu(){
  const items = [
    { to: "/ballast", icon: <Droplets className="h-4 w-4" />, label: "Balast Dağılımı" },
    { to: "/ballast", icon: <Droplets className="h-4 w-4" />, label: "Balast Transferi" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>
      <Card>
        <CardHeader><CardTitle>Balast Hesaplamaları</CardTitle></CardHeader>
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