import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Move } from "lucide-react";
import { TrimListCalculations } from "./calculations/TrimListCalculations";

export const TrimCalculationsCard = () => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Move className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
                      <CardTitle className="text-lg">Trim ve List</CardTitle>
          <CardDescription>Trim ve list hesaplamaları</CardDescription>
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
                          <DialogTitle>Trim ve List Hesaplamaları</DialogTitle>
          </DialogHeader>
          <TrimListCalculations />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};