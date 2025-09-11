import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Waves, Ship, BarChart3, AlertTriangle, ArrowLeft, Brain, BookOpen, Activity, Package, Droplets, Building, Route, Calculator } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function StabilityMenu() {
  const navigate = useNavigate();
  const groups = [
    {
      title: 'Stabilite',
      items: [
        { to: "/stability/assistant", icon: <Brain className="h-4 w-4" />, label: "Asistan" },
        { to: "/stability/assistant", icon: <BookOpen className="h-4 w-4" />, label: "Asistan" }
      ]
    }
  ];
  const items = groups.flatMap((g)=> g.items);


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
    { key: 'gz-imo', label: 'GZ / IMO Kriterleri', to: '/stability/gz-imo' },
    { key: 'damage', label: 'Hasarlı Stabilite', to: '/stability/damage' },
    { key: 'grain', label: 'Tahıl Stabilitesi', to: '/stability/grain' },
    { key: 'stable-tales', label: 'Stable Tales', to: '/stability/stable-tales' },
  ];

  const handleSelect = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <div key="stability-menu-v2" className="container mx-auto p-4 space-y-4" data-no-translate>
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
          <div className="space-y-4">
            {/* Hero / Opening section */}
            <div className="rounded-lg border bg-muted/20 p-3 md:p-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1.5">
                        {optionButtons.map((opt, idx) => (
                          <Button
                            key={opt.key}
                            variant="outline"
                            className="justify-start gap-2 data-[state=open]:bg-accent"
                            style={{ transitionDelay: `${idx * 60}ms` }}
                            onClick={() => handleSelect(opt.to)}
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