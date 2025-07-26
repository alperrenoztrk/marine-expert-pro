import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Cog } from "lucide-react";
import { EngineCalculations } from "./calculations/EngineCalculations";

export const EngineCalculationsCard = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Cog className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Motor</CardTitle>
            <CardDescription>Motor hesaplamaları ve güç analizi</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full gap-2">
              <Calculator className="w-4 h-4" />
              Hesapla
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Motor Hesaplamaları</DialogTitle>
            </DialogHeader>
            <EngineCalculations />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};