import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Compass } from "lucide-react";

const navigationMaterialSections = [
  {
    title: "Ders Materyali Bilgisi",
    icon: BookOpen,
    items: [
      "Ad: Seyir ve Elektronik Seyir Atölyesi 11",
      "Alan: Denizcilik Alanı (Meslekî ve Teknik Anadolu Lisesi)",
      "Kod: MEB__212930",
      "ISBN: 978-975-11-6911-2",
      "Erişim: EBA kitap altyapısı (kitap.eba.gov.tr) üzerinden",
    ],
  },
  {
    title: "Kıyı Seyri (Coastal Navigation) — Konu Başlıkları",
    icon: Compass,
    items: [
      "Referans maddelerden kerteriz ve mesafe ölçümü (kerte/mevki hattı, transit hattı, mevki dairesi)",
      "Kıyı seyrinde mevki koyma yöntemleri: 2/3 kerteriz, 2/3 mesafe, 1 kerteriz + 1 mesafe",
      "Running fix (yürütme yöntemi), parakete (DR) mevkisi, transit hattı ile mevki koyma",
      "İskandil değeri ile mevki (yaklaşık), yatay sekstant açısı ve station pointer ile mevki",
    ],
  },
  {
    title: "Akıntı Seyri — Konu Başlıkları",
    icon: Compass,
    items: [
      "Akıntı türleri ve rüzgâr akıntısı (yön/şiddet hesap yaklaşımı)",
      "Akıntı elemanları: set–drift, akıntı vektörü ve akıntı üçgeni",
      "Bileşke vektör / akıntı üçgeni yöntemleriyle rota–hız (COG/SOG) ilişkisi",
      "Akıntı cetvelleri ile pratik çözüm yaklaşımı",
    ],
  },
  {
    title: "Karasal Seyir — Konu Başlıkları",
    icon: Compass,
    items: [
      "Enlem/boylam farkı, orta enlem (M.lat) ve departure",
      "Düzlem seyir üçgeni ile rota–mesafe hesapları",
      "Büyük daire seyri: mesafe, başlangıç/bitiş rotası, tepe noktası (vertex) kavramları",
    ],
  },
  {
    title: "Gelgit — Konu Başlıkları",
    icon: Compass,
    items: [
      "Gelgit teorisi: HW/LW, range, LAT/HAT gibi temel kavramlar",
      "Gelgit cetvelleri ile standart/tali liman hesap yaklaşımı",
      "Zamana göre gelgit yüksekliği ve istenen yüksekliğe göre zaman bulma",
      "UKC mantığı: Harita derinliği + gelgit yüksekliği ile güvenli geçiş aralığı",
      "Gelgit akıntısı: HW’a göre saat farkı ile akıntı hız/yön okuma yaklaşımı",
    ],
  },
  {
    title: "Elektronik Seyir — Konu Başlıkları (Özet)",
    icon: Compass,
    items: [
      "GNSS/GPS ve temel elektronik mevkilendirme kavramları",
      "AIS, NAVTEX ve seyir emniyetine yönelik yayınların kullanımı",
      "ECDIS: harita yükleme/güncelleme ve temel kullanım yaklaşımı",
      "Radar/ARPA: hedef takibi ve radar plot mantığına giriş",
    ],
  },
  {
    title: "Olağan Dışı Şartlarda Seyir — Konu Başlıkları",
    icon: Compass,
    items: [
      "Tropikal fırtınalarda emniyet: tehlikeli/seyredilebilir yarı daire kavramı ve kaçınma yaklaşımı",
      "Kısıtlı görüşte seyir: emniyetli hız, gözcülük, cihazların etkin kullanımı ve prosedür disiplini",
      "Arama–kurtarma (SAR): hazırlıklar ve temel arama modelleri kavramı",
    ],
  },
];

export default function NavigationRulesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Seyir Kuralları — Konu Anlatımı
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Seyir Kuralları — Konu Anlatımı
          </h1>
          <p className="text-muted-foreground mt-2">
            MEB “Seyir ve Elektronik Seyir Atölyesi 11” materyaline göre özet konu başlıkları
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            Not: Bu sayfa, ders materyalinin konu başlıklarını ve özetini içerir. Tam metin için ilgili MEB/EBA yayınına başvurunuz.
          </p>
        </div>

        <div className="grid gap-6">
          {navigationMaterialSections.map((section) => (
            <Card key={section.title} className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <section.icon className="h-5 w-5 text-indigo-600" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.items.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-xs text-muted-foreground">
          EBA erişim:{" "}
          <a href="http://kitap.eba.gov.tr/" target="_blank" rel="noreferrer" className="underline">
            kitap.eba.gov.tr
          </a>
        </div>
      </div>
    </div>
  );
}

