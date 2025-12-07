import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Flame, Radio, LifeBuoy } from "lucide-react";

const equipmentSets = [
  {
    title: "Can Kurtarma Donanımı",
    icon: LifeBuoy,
    badge: "Bölüm III",
    summary: "Filika, can salı, MES ve kişisel ekipman envanteri.",
    checks: [
      "Filika başına kişi kapasitesi × 1.25 kuralına uyum",
      "HRU ve painter şamandıraları son servis tarihleri kayıtta",
      "Immersion suit ve lifejacket sayı + beden dağılımı yeterli",
    ],
    stock: [
      { label: "Filika", qty: "2 x 70 ki ş.", status: "Operasyonel" },
      { label: "Can Salı", qty: "6 x 25 ki ş.", status: "Servis 2026" },
      { label: "MES", qty: "2 set", status: "Drill 2025-01" },
    ],
  },
  {
    title: "Yangın Söndürme Sistemleri",
    icon: Flame,
    badge: "Bölüm II-2",
    summary: "Sabit ve taşınabilir yangın söndürme donanımı.",
    checks: [
      "CO₂ odası mühürlü, şişe tartı/kütle kayıtları mevcut",
      "Sprinkler/ drencher pompaları haftalık test loglarında",
      "Taşınabilir tüpler için aylık checklist + yıllık servis etiketleri",
    ],
    stock: [
      { label: "CO₂ Sabit Sistem", qty: "1 set (45 şişe)", status: "Test 2024-11" },
      { label: "Foam Monitor", qty: "2 adet", status: "Nozzle temiz" },
      { label: "Taşınabilir Tüp", qty: "48 adet", status: "%100 dolu" },
    ],
  },
  {
    title: "Acil Haberleşme & Navigasyon",
    icon: Radio,
    badge: "Bölüm IV - V",
    summary: "GMDSS ekipmanı, alarmlar ve seyir yardımcıları.",
    checks: [
      "SART, EPIRB ve VHF el telsizleri için self-test logları",
      "BNWAS, GMDSS, NAVTEX için günlük onay imzaları",
      "Emergency lighting UPS / akü kayıtları 6 ayda bir testli",
    ],
    stock: [
      { label: "EPIRB", qty: "1 adet", status: "Battery due 2027" },
      { label: "SART", qty: "2 adet", status: "Test 2025-02" },
      { label: "Handheld GMDSS", qty: "3 adet", status: "Yedek aküler haz." },
    ],
  },
];

const SOLASSafetyEquipmentPage = () => {
  return (
          <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <LifeBuoy className="h-12 w-12 text-orange-600 dark:text-orange-400" />
            <div>
              <p className="text-sm uppercase tracking-widest text-orange-600 dark:text-orange-300">Acil Durum</p>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-rose-500 bg-clip-text text-transparent">
                SOLAS Güvenlik Ekipmanları
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Gemi üzerindeki kritik güvenlik ekipmanlarını tek ekranda görün; servis, drill ve test kayıtlarını aynı yerde takip edin.
          </p>
        </div>

        {/* Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {equipmentSets.map((set) => (
            <Card key={set.title} className="border border-orange-100/60 shadow-lg shadow-orange-500/10">
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <set.icon className="w-8 h-8 text-orange-500" />
                  <Badge variant="outline" className="text-xs">{set.badge}</Badge>
                </div>
                <CardTitle>{set.title}</CardTitle>
                <CardDescription>{set.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <div>
                  <p className="font-semibold text-orange-700 mb-2">Kontrol Listesi</p>
                  <ul className="space-y-1">
                    {set.checks.map((check) => (
                      <li key={check} className="flex gap-2">
                        <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div>
                  <p className="font-semibold text-orange-700 mb-2">Envanter Durumu</p>
                  <div className="space-y-2">
                    {set.stock.map((item) => (
                      <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/80 dark:bg-slate-900/50 px-3 py-2">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.qty}</p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] tracking-wide">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOLASSafetyEquipmentPage;
