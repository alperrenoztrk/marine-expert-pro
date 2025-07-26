import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Waves } from "lucide-react";
import { HydrodynamicsCalculations } from "./calculations/HydrodynamicsCalculations";

export const HydrodynamicsCalculationsCard = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900/20 rounded-lg">
            <Waves className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Hidrodinamik</CardTitle>
            <CardDescription>Hidrodinamik hesaplamaları ve dalga analizi</CardDescription>
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
              <DialogTitle>Hidrodinamik Hesaplamaları</DialogTitle>
            </DialogHeader>
            <HydrodynamicsCalculations />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};