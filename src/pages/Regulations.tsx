import React from 'react';
import { Ship } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Regulations = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Ship className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">Seyir Kuralları</h1>
                <p className="text-muted-foreground">İstenen sekmeler ve içerik kaldırıldı.</p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Seyir Kuralları</CardTitle>
            <CardDescription>Bu sayfadaki tüm sekmeler ve içerik kaldırıldı.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Talep edilen başlıklar artık gösterilmiyor.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Regulations;
