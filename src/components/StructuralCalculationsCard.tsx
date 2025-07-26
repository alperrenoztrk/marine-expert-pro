import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Building } from "lucide-react";
import { StructuralCalculations } from "./calculations/StructuralCalculations";

export const StructuralCalculationsCard = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-100 dark:bg-slate-900/20 rounded-lg">
            <Building className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Yapısal</CardTitle>
            <CardDescription>Yapısal hesaplamaları ve dayanım analizi</CardDescription>
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
              <DialogTitle>Yapısal Hesaplamaları</DialogTitle>
            </DialogHeader>
            <StructuralCalculations />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};