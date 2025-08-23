import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, AlertTriangle, ArrowLeft, Brain, BookOpen, Activity, Package, Droplets, Building, Route, Calculator } from "lucide-react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function StabilityMenu() {
  const groups = [
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
        { to: "/stability/rules", icon: <BookOpen className="h-4 w-4" />, label: "Kurallar" }
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);

  // Category headings only (placeholders for now)
  const categories = [
    { title: 'Enine Stabilite' },
    { title: 'Boyuna Stabilite' },
    { title: 'GZ Eğrisi ve IMO Kriterleri' },
    { title: 'Hasarlı Stabilite' },
    { title: 'Tahıl Stabilitesi' },
    { title: 'Dinamik Stabilite' },
    { title: 'Trim ve Stabilite' },
  ];

  const [open, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (open) {
      setShowPrompt(false);
      setShowOptions(false);
      const t1 = setTimeout(() => setShowPrompt(true), 150);
      const t2 = setTimeout(() => setShowOptions(true), 850);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else {
      setShowPrompt(false);
      setShowOptions(false);
    }
  }, [open]);

  const optionButtons = [
    { key: 'athwartship', label: 'Enine Stabilite' },
    { key: 'longitudinal', label: 'Boyuna Stabilite' },
    { key: 'gz-imo', label: 'GZ / IMO Kriterleri' },
    { key: 'damage', label: 'Hasarlı Stabilite' },
    { key: 'grain', label: 'Tahıl Stabilitesi' },
  ];

  return (
    <div key="stability-menu-v2" className="container mx-auto p-6 space-y-6" data-no-translate>
      <div className="flex items-center justify-between">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfa
          </Button>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle data-no-translate>Stabilite Hesaplamaları</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Hero / Opening section */}
            <div className="rounded-lg border bg-muted/20 p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <div className="text-2xl font-bold">Stabilite Modülü</div>
                  <p className="text-muted-foreground">Başlıklar halinde düzenlendi. Detaylar gerektiğinde eklenecek.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button variant="calculator" className="gap-2">
                      <Calculator className="h-4 w-4" />
                      <span>Stabilite Hesaplamaları</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      {showPrompt && (
                        <DialogTitle className="text-center text-2xl font-bold animate-in fade-in-0 duration-500">
                          Hangi hesabı yapmak istiyorsunuz?
                        </DialogTitle>
                      )}
                      <DialogDescription className="text-center">
                        {showPrompt && <span className="animate-in fade-in-0 delay-200">Lütfen bir seçenek seçin</span>}
                      </DialogDescription>
                    </DialogHeader>

                    {showOptions && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                        {optionButtons.map((opt, idx) => (
                          <Button
                            key={opt.key}
                            variant="outline"
                            className="justify-start gap-2 data-[state=open]:bg-accent"
                            style={{ transitionDelay: `${idx * 60}ms` }}
                            onClick={() => setOpen(false)}
                          >
                            {opt.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Category headings only */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <div key={cat.title} className="rounded-md border p-4 bg-background/60">
                  <div className="text-base font-semibold">{cat.title}</div>
                </div>
              ))}
            </div>

            {/* All Items (Assistant, Rules) */}
            <div className="flex flex-wrap gap-2 py-1">
              {items.map((it)=> (
                <Link key={it.to} to={it.to}>
                  <Button variant="outline" className="justify-start gap-2 whitespace-nowrap" data-no-translate>
                    {it.icon}
                    {it.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}