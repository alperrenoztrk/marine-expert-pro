import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Anchor } from "lucide-react";
import { BallastCalculations } from "./calculations/BallastCalculations";

export const BallastCalculationsCard = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-info-muted rounded-lg">
            <Anchor className="w-5 h-5 text-info" />
          </div>
          <div>
            <CardTitle className="text-lg">Balast</CardTitle>
            <CardDescription>Balast hesaplamaları ve analizi</CardDescription>
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
              <DialogTitle>Balast Hesaplamaları</DialogTitle>
            </DialogHeader>
            <BallastCalculations />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};