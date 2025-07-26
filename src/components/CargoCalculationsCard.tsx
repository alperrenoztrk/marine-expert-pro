import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Package } from "lucide-react";
import { CargoCalculations } from "./calculations/CargoCalculations";

export const CargoCalculationsCard = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Kargo</CardTitle>
            <CardDescription>Kargo hesaplamaları ve yük analizi</CardDescription>
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
              <DialogTitle>Kargo Hesaplamaları</DialogTitle>
            </DialogHeader>
            <CargoCalculations />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};