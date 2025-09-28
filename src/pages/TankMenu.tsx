import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ruler } from "lucide-react";
import BackButton from "@/components/BackButton";

export default function TankMenu(){
  const items = [
    { to: "/tank", icon: <Ruler className="h-4 w-4" />, label: "Tank Hacmi" },
    { to: "/tank", icon: <Ruler className="h-4 w-4" />, label: "Kalibrasyon" },
  ];
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <BackButton />
      </div>
      <Card>
        <CardHeader><CardTitle>Tank Hesaplamaları</CardTitle></CardHeader>
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