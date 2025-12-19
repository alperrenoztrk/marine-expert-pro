import React from "react";
import { Link } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Leaf, Trash2, Droplets, FileCheck, Factory, Wind, Recycle } from "lucide-react";

const topics = [
  {
    id: "emission-management",
    title: "Emisyon Yönetimi",
    icon: Factory,
    description: "Yakıt tüketimi, CO₂ hesapları, EEXI/CII mantığı",
    content: [
      {
        subtitle: "CO₂ Emisyonu Hesaplama",
        text: "Gemilerde CO₂ emisyonu, yakıt tüketimi ile doğrudan ilişkilidir. Temel formül: CO₂ (ton) = Yakıt Tüketimi (ton) × Karbon Faktörü (CF). CF değeri yakıt türüne göre değişir: HFO için 3.114, MGO için 3.206, LNG için 2.750."
      },
      {
        subtitle: "EEXI (Energy Efficiency Existing Ship Index)",
        text: "EEXI, mevcut gemilerin enerji verimliliğini ölçen bir endekstir. 2023'ten itibaren zorunlu olup, geminin teknik tasarımına bağlı karbon yoğunluğunu gösterir. EEXI = (P × CF × SFC) / (fi × Capacity × Vref)"
      },
      {
        subtitle: "CII (Carbon Intensity Indicator)",
        text: "CII, geminin operasyonel karbon yoğunluğunu ölçer. Yıllık olarak hesaplanır ve A-E arasında derecelendirilir. CII = (Yıllık CO₂) / (Kapasite × Kat edilen mesafe). D veya E alan gemiler düzeltici aksiyon planı sunmalıdır."
      }
    ]
  },
  {
    id: "waste-management",
    title: "Atık Yönetimi",
    icon: Trash2,
    description: "Garbage Record Book, Oil Record Book, teslim tutanakları",
    content: [
      {
        subtitle: "MARPOL Annex V - Çöp Yönetimi",
        text: "Gemi çöpleri kategorilere ayrılır: A-Plastik, B-Yiyecek atıkları, C-Ev atıkları, D-Yemek yağı, E-Kül, F-Operasyonel atık, G-Hayvan leşleri, H-Balıkçılık atıkları, I-E-atık. Her kategori için farklı deşarj kuralları uygulanır."
      },
      {
        subtitle: "Garbage Record Book",
        text: "Tüm atık operasyonları (deşarj, yakma, teslim) kaydedilmelidir. Her girişte tarih/saat, konum, atık kategorisi, tahmini miktar ve deşarj/teslim yöntemi belirtilir. Kayıtlar 2 yıl saklanmalıdır."
      },
      {
        subtitle: "Oil Record Book Part I & II",
        text: "Part I: Makine dairesi operasyonları (sintine, slop, yağlı su). Part II: Kargo/balast operasyonları (tanker gemileri için). Her operasyon kodu (A, B, C, D...) ile kaydedilir."
      }
    ]
  },
  {
    id: "ballast-water",
    title: "Balast Suyu Yönetimi",
    icon: Droplets,
    description: "BWM prosedürleri, değişim/arıtma ve raporlama",
    content: [
      {
        subtitle: "BWM Convention",
        text: "Balast Suyu Yönetim Konvansiyonu, istilacı türlerin yayılmasını önlemeyi amaçlar. Gemiler ya balast değişimi (D-1) ya da arıtma sistemi (D-2) kullanmalıdır."
      },
      {
        subtitle: "D-1 Standardı (Değişim)",
        text: "Açık denizde (karadan en az 200 nm, derinlik 200m+) balast suyunun en az %95'i değiştirilmelidir. Sıralı (sequential), akış-yoluyla (flow-through) veya seyreltme yöntemi kullanılabilir."
      },
      {
        subtitle: "D-2 Standardı (Arıtma)",
        text: "Balast suyu arıtma sistemleri (BWTS) kullanılarak belirli organizma limitleri sağlanmalıdır: <10 canlı organizma ≥50μm/m³, <10 canlı organizma 10-50μm/ml. Sistem IMO onaylı olmalıdır."
      },
      {
        subtitle: "Ballast Water Record Book",
        text: "Tüm balast operasyonları kaydedilmelidir: alım, değişim, arıtma, deşarj. Konum, tarih/saat, tank numaraları, hacim ve yöntem belirtilir."
      }
    ]
  },
  {
    id: "air-emissions",
    title: "Hava Emisyonları",
    icon: Wind,
    description: "SOx, NOx, PM kontrolü ve ECA bölgeleri",
    content: [
      {
        subtitle: "MARPOL Annex VI",
        text: "Gemi kaynaklı hava kirliliğini kontrol eder: SOx, NOx, PM (partikül madde), ODS (ozon tabakasını incelten maddeler) ve VOC (uçucu organik bileşikler)."
      },
      {
        subtitle: "Kükürt Limitleri",
        text: "Global kükürt limiti: %0.50 m/m (2020'den itibaren). ECA bölgelerinde: %0.10 m/m. Alternatif olarak egzoz gazı temizleme sistemi (scrubber) kullanılabilir."
      },
      {
        subtitle: "NOx Emisyon Seviyeleri",
        text: "Tier I: 2000 öncesi gemiler. Tier II: 2011 sonrası gemiler, global standart. Tier III: 2016 sonrası gemiler, NECA bölgelerinde zorunlu (Tier II'nin %80 altında)."
      },
      {
        subtitle: "ECA/NECA Bölgeleri",
        text: "Emission Control Areas: Baltık, Kuzey Denizi, Kuzey Amerika, Karayipler (ABD). Bu bölgelerde sıkı SOx ve NOx limitleri uygulanır."
      }
    ]
  },
  {
    id: "compliance-audit",
    title: "Uyum ve Denetim",
    icon: FileCheck,
    description: "PSC hazırlığı, dokümantasyon ve uygunsuzluk yönetimi",
    content: [
      {
        subtitle: "PSC Denetim Hazırlığı",
        text: "Temel kontrol noktaları: Sertifikaların geçerliliği (IAPP, IOPP, IBWMC), kayıt defterlerinin güncelliği, SOPEP/SMPEP prosedürleri, atık yönetim planı, balast suyu yönetim planı."
      },
      {
        subtitle: "Gerekli Sertifikalar",
        text: "IAPP (International Air Pollution Prevention), IOPP (International Oil Pollution Prevention), IBWMC (International Ballast Water Management Certificate), ISPP (International Sewage Pollution Prevention)."
      },
      {
        subtitle: "Uygunsuzluk Yönetimi",
        text: "Eksiklik tespit edildiğinde: 1) Derhal düzeltici aksiyon planı oluştur, 2) Kök neden analizi yap, 3) Önleyici tedbirler belirle, 4) Takip ve doğrulama yap, 5) Kayıt altına al."
      }
    ]
  },
  {
    id: "sewage-management",
    title: "Pis Su Yönetimi",
    icon: Recycle,
    description: "MARPOL Annex IV gereklilikleri",
    content: [
      {
        subtitle: "Deşarj Kuralları",
        text: "Onaylı arıtma sistemi ile: Kıyıdan 3 nm+ uzakta, 4 knot+ hızda. Arıtılmamış: Kıyıdan 12 nm+ uzakta, 4 knot+ hızda, orta hızda dezenfekte edilmiş ve parçalanmış."
      },
      {
        subtitle: "Özel Alanlar",
        text: "Baltık Denizi özel alan ilan edilmiştir. Yolcu gemileri için sıkı kurallar uygulanır. Tüm pis su liman tesislerine teslim edilmeli veya onaylı sistemle arıtılmalıdır."
      }
    ]
  }
];

export default function EmissionTopics() {
  return (
    <MobileLayout className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-green-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-3 py-6 sm:px-4 md:px-6">
        <div className="mb-6">
          <Link to="/environment/calculations">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Hesaplama Merkezi
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl mb-4">
            <Leaf className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Çevre Yönetimi Konu Anlatımı
          </h1>
          <p className="text-muted-foreground">
            Gemide çevre yönetimi: emisyon, atık, balast ve kayıtlar
          </p>
        </div>

        <div className="space-y-6">
          {topics.map((topic, index) => (
            <Card
              key={topic.id}
              className="overflow-hidden border-border/60 bg-card/85 backdrop-blur-sm animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <topic.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-foreground">{topic.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{topic.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {topic.content.map((section, sIndex) => (
                  <div key={sIndex} className="border-l-2 border-emerald-500/30 pl-4">
                    <h4 className="font-semibold text-foreground mb-2">{section.subtitle}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{section.text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
}
