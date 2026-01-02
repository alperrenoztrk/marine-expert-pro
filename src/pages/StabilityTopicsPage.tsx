import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  Anchor,
  ChevronRight,
  FileText,
  AlertTriangle,
  Waves,
  Scale,
  Ship,
  Calculator,
  Gauge,
  Shield,
  Lightbulb,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { InteractiveStabilityTools } from "@/components/stability/InteractiveStabilityTools";
import { Stability3DSim } from "@/components/stability/Stability3DSim";

interface TopicSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const topicSections: TopicSection[] = [
  {
    id: "temel-kavramlar",
    title: "1. Temel Kavramlar ve Tanımlar",
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Stabilite, bir geminin dış etkilere (rüzgâr, dalga, yük kayması, dönüş manevraları) karşı dengesini koruma ve denge bozulduğunda yeniden
          dik konuma dönme yeteneğidir. Aşağıdaki kavramlar stabiliteyi anlamak için temel oluşturur. Burada amaç, hem teorik temeli hem de pratik
          operasyondaki kritik noktaları netleştirmektir.
        </p>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">1.1 Denge Türleri</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Denge türleri, geminin küçük bir yatma açısı sonrası nasıl davrandığını gösterir. Denge davranışını anlamak; yükleme, balast
            ve operasyon kararlarının güvenliğini belirler.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <span><strong className="text-foreground">Kararlı (stabil) denge:</strong> Gemi, dış etkiyle yan yatıp kuvvet ortadan kalktığında tekrar dik konumuna döner. Stabil durumda pozitif GZ kolu ve pozitif metasantrik yükseklik vardır. Genellikle güvenli yükleme durumunu temsil eder.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-yellow-500" />
              <span><strong className="text-foreground">Nötr denge:</strong> Gemi, dış etkiyle bir açıda yeni denge konumunda kalır; doğrultucu kol sıfıra yaklaşır. Bu durumda küçük bir ilave etkiyle gemi kalıcı olarak başka bir açıda dengede kalabilir.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
              <span><strong className="text-foreground">Kararsız (unstable) denge:</strong> Gemi dik konumda iken negatif metasantrik yükseklik nedeniyle en ufak bir eğilmeyle devrilmeye meyillidir. Bu durumda yükleme ve balast operasyonları acil düzeltme gerektirir.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">1.2 Deplasman, Kaldırma ve Ağırlık Merkezi</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Geminin ağırlığı ile yer değiştirdiği suyun kaldırma kuvveti, stabiliteyi belirleyen temel dengedir. Bu denge, ağırlık merkezi (G)
            ve kaldırma merkezi (B) arasındaki ilişkiyle modellenir.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Deplasman (Δ):</strong> Geminin yer değiştirdiği suyun ağırlığıdır. Geminin toplam ağırlığına eşittir ve ton cinsinden ifade edilir.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Ağırlık merkezi (G):</strong> Gemideki tüm yüklerin ağırlıklarının birleşik uygulama noktasıdır. Yüklerin taşınması veya tankların doluluklarının değişmesi KG'yi değiştirir. KG yükselirse stabilite azalır.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Kaldırma kuvveti merkezi (B):</strong> Su altında kalan hacmin ağırlık merkezi olup, geminin yüzdüğü konuma göre yer değiştirir. Yatma açısı değiştikçe B noktası yana kayar ve doğrultucu kol oluşur.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">1.3 Metasantrik Yükseklik ve Sert/Yumuşak Gemi</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Metasantrik yükseklik (GM), geminin küçük açılardaki ilk stabilitesinin göstergesidir. <strong className="text-foreground">GM = KM − KG</strong> formülüyle hesaplanır; burada KM kökle metasentre arasındaki mesafe, KG kökle ağırlık merkezi arasındaki mesafedir.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GM değeri arttıkça gemi hızlı ve sert bir yalpa davranışı gösterir; GM azaldıkça daha yavaş ve geniş salınımlar görülür. Bu nedenle GM,
            hem emniyet hem de konfor açısından dengelenmelidir.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
              <h5 className="text-sm font-medium text-green-600 dark:text-green-400">Sert (Stiff) Gemi</h5>
              <p className="text-xs text-muted-foreground mt-1">GM değerinin artması gemiyi "sert" yapar; yuvarlanma periyodu kısalır ve gemi hızlı hareket eder.</p>
            </div>
            <div className="rounded-lg border border-orange-500/30 bg-orange-500/5 p-3">
              <h5 className="text-sm font-medium text-orange-600 dark:text-orange-400">Yumuşak (Tender) Gemi</h5>
              <p className="text-xs text-muted-foreground mt-1">GM'nin düşük veya negatif olması gemiyi "yumuşak" yapar; yuvarlanma periyodu uzar ve yolcular daha rahat olsa da stabilite zayıflar.</p>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "statik-stabilite",
    title: "2. Statik Stabilite ve GZ Eğrisi",
    icon: Scale,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Statik stabilite, geminin belirli bir yatma açısında dış kuvvetler olmadan dengeye gelmesiyle ilgilidir. Bunun analizinde GZ (doğrultucu kol)
          eğrisi kullanılır. GZ eğrisi, geminin farklı açılardaki doğrultucu moment kapasitesini görsel ve sayısal olarak ortaya koyar.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">2.1 Doğrultucu Kol ve Doğrultucu Moment</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GZ kolu geminin dengeye dönme kabiliyetini temsil eder. GZ büyüdükçe gemi daha büyük doğrultucu moment üretir ve dış kuvvetlere daha iyi karşı koyar.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Doğrultucu kol (GZ):</strong> Ağırlık merkezi (G) ile kaldırma kuvvetinin etkili doğrultusunu (Z) birleştiren kol uzunluğudur. Küçük açılar için yaklaşık olarak <strong>GZ ≈ GM·sin φ</strong> formülü kullanılır.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Doğrultucu moment (RM):</strong> Geminin deplasmanının (Δ) GZ ile çarpımına eşittir <strong>(RM = Δ·GZ)</strong>. Dış kuvvetlere karşı koyan moment budur.</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">2.2 GZ Eğrisinden Okunan Bilgiler</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="py-2 text-left font-semibold text-foreground">Bilgi</th>
                  <th className="py-2 text-left font-semibold text-foreground">Açıklama</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Metasantrik yükseklik</td>
                  <td className="py-2">Eğrinin başlangıçtaki eğimi 57,3° (1 rad) ordinatı ile kesiştiğinde GM'nin ölçüsünü verir</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Maksimum GZ ve açısı</td>
                  <td className="py-2">Tepe noktadaki GZ değeri ve açısı geminin dayanabileceği en büyük doğrultucu momenti gösterir</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Pozitif stabilite menzili</td>
                  <td className="py-2">GZ eğrisinin pozitif kaldığı yatış açıları aralığıdır; geniş aralık daha iyi stabilite demektir</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 font-medium text-foreground">Vanishing stability açısı</td>
                  <td className="py-2">Eğri x-ekseni ile kesiştiğinde (GZ=0) gemi doğrultucu kol üretmez ve devrilme riski vardır</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium text-foreground">Dinamik stabilite alanı</td>
                  <td className="py-2">Eğri altında kalan alan geminin dış kuvvetlere karşı depolayabildiği enerjiyi gösterir</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">2.3 Dinamik Stabilite</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Statik stabilite eğrisinin altında kalan alan, geminin heeling sırasında absorbe edebileceği enerji miktarını (dinamik stabilite) gösterir. Yüksek maksimum GZ değeri tek başına yeterli değildir; alanın geniş olması, geminin devrilmeden önce daha fazla enerji absorbe edebileceği anlamına gelir.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dinamik stabilite değerlendirmeleri, rüzgâr ve dalga koşullarında geminin güvenliğini ölçmek için kullanılır. IMO kriterleri, özellikle belirli açı aralıklarında
            GZ alanlarını asgari seviyede şart koşar.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">2.4 GZ Eğrisi Oluşturma ve KN Eğrileri</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Farklı KG ve deplasman değerleri için cross-curves of stability (KN eğrileri) çıkarılır. KN'den GZ'ye dönüşüm formülü:
          </p>
          <div className="rounded-lg bg-primary/10 p-3 text-center font-mono text-sm font-semibold text-primary">
            GZ(θ) = KN(θ) − KG · sin θ
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">2.5 3B Eğitsel Stabilite Görselleştirme</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            GM ve KG değerlerini değiştirerek geminin eğim davranışını gözlemleyin. Bu görselleştirme, stabilite kavramını sezgisel olarak
            anlamaya yardımcı olmak için hazırlanmış eğitim amaçlı bir modeldir.
          </p>
          <Stability3DSim />
          <p className="text-xs text-muted-foreground">
            Not: Küçük açılar için <strong className="text-foreground">GZ ≈ GM · sinφ</strong> yaklaşımı geçerlidir; GM yükseldikçe gemi daha hızlı doğrulur,
            KG yükseldikçe meyil artar.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "serbest-yuzey",
    title: "3. Serbest Yüzey Etkisi",
    icon: Waves,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Kısmen dolu tanklardaki sıvı, gemi yatınca serbest yüzeyinde yatay kalmaya çalışarak bir kama şeklinde transfer oluşturur. Bu durum ağırlık merkezini
          yana kaydırarak geminin metasantrik yüksekliğini düşürür; buna <strong className="text-foreground">serbest yüzey etkisi (free surface effect)</strong> denir.
          Serbest yüzey etkisi, büyük tanklarda ve geniş güverteli gemilerde çok daha kritiktir.
        </p>

        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <h4 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">Serbest Yüzey Düzeltmesi Formülü</h4>
          <div className="rounded bg-background/50 p-2 text-center font-mono text-sm text-foreground">
            GM<sub>düzeltilmiş</sub> = GM − Σ(I<sub>f</sub>/∇)
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Burada I<sub>f</sub> her tankın serbest yüzey atalet momenti, ∇ deplasman hacmidir.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Serbest Yüzey Etkisini Azaltma Yöntemleri</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <span>Tanklar bölmelere ayrılarak I<sub>f</sub> küçültülür</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <span>Tankların tamamen dolu veya boş tutulması</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <span>Enine bölme ve yatay perdeler kullanılması</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "ic-etkiler",
    title: "4. İç Yükler ve Diğer İç Etkiler",
    icon: Ship,
    content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
          Geminin içindeki ağırlıkların konumu stabiliteyi doğrudan etkiler. Yüklerin merkezden uzaklaşması, ağırlık merkezinin yana kayması ve GM değerinin
          düşmesi gibi etkiler devrilme riskini artırabilir. Bu nedenle yükleme emniyeti ile stabilite emniyeti birlikte düşünülmelidir.
          </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border/40 bg-card/50 p-3">
            <h5 className="text-sm font-medium text-foreground mb-1">Yolcu/Personel Hareketi</h5>
            <p className="text-xs text-muted-foreground">Yolcuların veya personelin bir tarafa toplanması gemide heeling momenti oluşturur; kalabalığın dengeli dağıtılması gerekir.</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card/50 p-3">
            <h5 className="text-sm font-medium text-foreground mb-1">Yük Kayması</h5>
            <p className="text-xs text-muted-foreground">Sabitlenmemiş veya gevşek bağlanmış yüklerin kayması G noktasını değiştirir, GZ kolunu azaltır ve gemiyi tehlikeye sokar.</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card/50 p-3">
            <h5 className="text-sm font-medium text-foreground mb-1">Vinçle Yük Kaldırma</h5>
            <p className="text-xs text-muted-foreground">Güverte dışına asılı ağır yükler, ağırlık merkezini yükseltip yana kaydırır; doğrultucu kolu azaltarak gemiyi "boom heel" durumuna getirir.</p>
          </div>
          <div className="rounded-lg border border-border/40 bg-card/50 p-3">
            <h5 className="text-sm font-medium text-foreground mb-1">Balast ve Tank Operasyonları</h5>
            <p className="text-xs text-muted-foreground">Balast tanklarının doldurulması/boşaltılması ile geminin deplasmanı ve KG değişir; yuvarlanma periyodu ve metasantrik yükseklik buna bağlı olarak değişir.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "dis-etkiler",
    title: "5. Dış Etkiler ve Manevra Kaynaklı Stabilite",
    icon: Gauge,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Gemi dışındaki çevresel kuvvetler ve manevra hareketleri de stabiliteyi değiştirir. Deniz durumu, rüzgâr kuvveti, akıntı ve manevra ivmeleri
          heeling momentleri oluşturur ve GZ eğrisinin kullanılabilirliğini belirler.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">5.1 Rüzgâr Devrilme Momenti</h4>
          <p className="text-sm text-muted-foreground">
            Rüzgâr, üst yapı alanına etki ederek heeling momenti yaratır. IMO kodu bu heeling kolunu GZ eğrisi ile karşılaştırarak belirli açı aralıklarında alan kriterleri getirir.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">5.2 Dalga Etkileri ve Parametrik Salınım</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parametrik salınım (parametric rolling), baş veya kıçtan gelen dalgalarda GZ kolunun zamanla periyodik değişmesi sonucu ortaya çıkan bir rezonans fenomenidir. Metasantrik yükseklik dalga tepesinde azalır ve dalga çukurunda artar. Bu periyodik değişim, gemi kendi doğal yuvarlanma periyodu ile uyumlu olduğunda şiddetli yalpalamalara neden olur.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">5.3 Diğer Dış Faktörler</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Hızlı dönüş (turning heel):</strong> Gemi yüksek hızda keskin dönüş yaptığında merkezkaç kuvveti heeling momenti oluşturur</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Römork ve akıntı etkileri:</strong> Römork halatı veya güçlü akıntı gemiyi bir tarafa çeker</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Buz ve su birikmesi:</strong> Güverte üzerinde biriken buz veya su, KG'yi yükseltip GM'yi azaltır</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Karaya oturma:</strong> Geminin karaya oturması sırasında kaldırma kuvveti kaybolur ve stabilite düşer</span>
            </li>
          </ul>
        </div>
      </div>
    )
  },
  {
    id: "imo-kriterleri",
    title: "6. Stabilite Kriterleri ve Düzenlemeler",
    icon: Shield,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Uluslararası Denizcilik Örgütü (IMO) İntakt Stabilite Kodu, gemilerin sefer sırasında asgari stabilite şartlarını belirler.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Temel IMO Kriterleri</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bu kriterler gemi tipine göre farklılık gösterebilir; yolcu gemileri, yüksek hızlı araçlar (HSC) ve özel maksatlı gemiler için ek veya
            daha sıkı stabilite şartları uygulanır.
          </p>
          <div className="grid gap-2">
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">1</div>
              <div>
                <p className="text-sm font-medium text-foreground">Minimum metasantrik yükseklik</p>
                <p className="text-xs text-muted-foreground">Tam yüklü kargolu gemiler için GM ≥ 0,15 m</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">2</div>
              <div>
                <p className="text-sm font-medium text-foreground">Maksimum GZ ve açısı</p>
                <p className="text-xs text-muted-foreground">Maksimum GZ kolu en az 0,20 m olmalı ve 30°–40° arası bir açıda oluşmalıdır</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">3</div>
              <div>
                <p className="text-sm font-medium text-foreground">Pozitif stabilite alanı</p>
                <p className="text-xs text-muted-foreground">0°–30° arası en az 0,055 m·rad; 0°–40° arası en az 0,09 m·rad; 30°–40° arası en az 0,03 m·rad</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-primary/5 p-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">4</div>
              <div>
                <p className="text-sm font-medium text-foreground">Vanishing stability açısı</p>
                <p className="text-xs text-muted-foreground">Geminin doğrultucu kolunun sıfıra düştüğü açı 25°'ten büyük olmalıdır</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "hasar-stabilitesi",
    title: "7. Hasar Stabilitesi",
    icon: AlertTriangle,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Hasar stabilitesi, geminin bir veya daha fazla bölmesi su aldığında kalan kaldırma kuvveti ve stabilitenin değerlendirilmesidir. Bu analiz,
          geminin hasar sonrası hayatta kalabilirliğini gösterir ve SOLAS kurallarına göre asgari kriterleri sağlamalıdır.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">Kayıp Kaldırma Yöntemi</h5>
            <p className="text-xs text-muted-foreground">Su alan bölmenin kaldırma kuvveti yok sayılır; geminin deplasmanı azalır ve yeni B ve G noktaları belirlenir.</p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">Ek Ağırlık Yöntemi</h5>
            <p className="text-xs text-muted-foreground">Su alan bölmeye giren su, geminin ağırlığına eklenir; deplasman artar ve G noktası yükselir.</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          Hasar stabilitesi değerlendirmeleri, SOLAS'ın probabilistik kriterleri ve ulusal yönetmelikler uyarınca yapılır. Tanklar arası watertight (su geçirmez) perdeler ve acil durum pompaları hasar stabilitesinin artırılmasına yardımcı olur.
        </p>
      </div>
    )
  },
  {
    id: "testler",
    title: "8. Testler ve Ölçümler",
    icon: Calculator,
    content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">8.1 İnklinasyon Deneyi</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Gemi inşa edildikten sonra gerçek KG ve GM değerlerini belirlemek için yapılan deneydir. Bilinen ağırlıklar gemi içinde yatay olarak yer değiştirir ve sonuçta meydana gelen yatma açılarından GM hesaplanır.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              İnklinasyon sonuçları, stabilite kitapçığının temelini oluşturur. Ölçümde yakıt, tatlı su ve ekipman konfigürasyonlarının doğru kaydedilmesi kritik önemdedir.
            </p>
          </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">8.2 Yuvarlanma (Rolling) Testi</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bazı ülkeler, geminin yuvarlanma periyodunu tespit etmek için deneme yapılmasını ister. Yuvarlanma periyodu T şu formülle yaklaşık hesaplanabilir:
          </p>
          <div className="rounded-lg bg-primary/10 p-3 text-center font-mono text-sm font-semibold text-primary">
            T = C<sub>b</sub> × B / √GM
          </div>
          <p className="text-xs text-muted-foreground text-center">
            C<sub>b</sub>: blok katsayısı, B: en geniş genişlik
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">8.3 KN / Cross-Curves ve Simpson Alan Hesapları</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tasarım aşamasında belirli KG ve trim değerlerine göre cross-curves of stability (KN eğrileri) oluşturulur. Simpson'un 1/3 ve 3/8 kuralları, düzensiz alanların hesaplanmasında kullanılır.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "trim",
    title: "9. Trim ve Boyuna Denge",
    icon: Anchor,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Geminin baş ve kıç draftlarının farklı olması trim olarak adlandırılır. Geminin boyuna dengesini anlamak için hogging (ortadan yukarı bükülme)
          ve sagging (ortadan aşağı sarkma) kavramları kullanılır. Trim hesapları; yükleme planı, yakıt tüketimi ve balast yönetimi için temel girdidir.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Ortalama Draft Hesabı</h4>
          <div className="rounded-lg bg-primary/10 p-3 text-center font-mono text-sm font-semibold text-primary">
            d<sub>M</sub> = (d<sub>F</sub> + d<sub>A</sub>) / 2
          </div>
          <p className="text-xs text-muted-foreground text-center">
            d<sub>F</sub>: baş (forward) draftı, d<sub>A</sub>: kıç (aft) draftı
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Trim Değişimi</h4>
          <div className="rounded-lg bg-primary/10 p-3 text-center font-mono text-sm font-semibold text-primary">
            ΔTrim = Toplam Moment / MCT
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Paralel Batma/Çıkma</h4>
          <div className="rounded-lg bg-primary/10 p-3 text-center font-mono text-sm font-semibold text-primary">
            Batma (cm) = w / TPC
          </div>
          <p className="text-xs text-muted-foreground text-center">
            w: ilave/kaldırılan ağırlık, TPC: Tonnes per Centimetre Immersion
          </p>
        </div>
      </div>
    )
  },
  {
    id: "ileri-konular",
    title: "10. İleri Konular",
    icon: Lightbulb,
    content: (
      <div className="space-y-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">10.1 Negatif GM ve Loll Açısı</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bazı yükleme durumlarında KG o kadar yükselir ki GM negatif olur. Bu durumda gemi dik konumda kararsızdır ve bir tarafa doğru kendi kendine yatmaya başlar. GZ kolu tekrar sıfıra ve pozitife döndüğünde belirli bir açıda dengede kalır. Bu açıya <strong className="text-foreground">loll açısı</strong> denir.
          </p>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <p className="text-xs text-amber-600 dark:text-amber-400">
              ⚠️ Loll durumu serbest yüzey etkisi, üstte yoğun ağırlık birikmesi veya yetersiz balast nedeniyle ortaya çıkabilir. Loll'den kurtulmak için KG'nin düşürülmesi gerekir.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">10.2 Parametrik Salınımın Önlenmesi</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Parametrik salınım riskini azaltmak için sefer sırasında dalga yönüne göre hız ve rota ayarlanmalı; dalga tepelerine denk gelen periyotlarla geminin doğal yuvarlanma periyotunun çakışması engellenmelidir.
          </p>
        </div>
      </div>
    )
  },
  {
    id: "havuzlama",
    title: "11. Havuzlamada Stabilite ve Kritik GM",
    icon: Ship,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Kuru havuza girmek (dry docking) geminin bakım ve onarımı için rutin bir işlemdir. Ancak bu süreçte geminin stabilitesi önemli ölçüde değişir ve kritik GM hesapları yapılmadan operasyon risklidir.
        </p>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Etkili Kuvvetler</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Ağırlık (W):</strong> Geminin kendi ağırlığı olup aşağı yönlüdür</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Keel blok reaksiyonu (P):</strong> Bloklar tarafından uygulanan yukarı yönlü kuvvettir</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
              <span><strong className="text-foreground">Kaldırma kuvveti (W−P):</strong> Kalan deplasmanın yarattığı yukarı yönlü kuvvettir</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Kritik GM Formülü</h4>
          <div className="rounded-lg bg-primary/10 p-3 text-center font-mono text-sm font-semibold text-primary">
            GM<sub>kritik</sub> = R × KM / Δ
          </div>
          <p className="text-xs text-muted-foreground text-center">
            R: keel blok reaksiyonu, KM: kökle metasentre mesafe, Δ: gemi deplasmanı
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Güvenli Docking İçin Altın Kurallar</h4>
          <div className="grid gap-2">
            {[
              "Kritik GM pozitif olmalıdır",
              "Gemi her zaman dik olmalıdır",
              "Önerilen ortalama draft aşılmamalıdır",
              "Önerilen kıç trim aşılmamalıdır",
              "Tüm sintine ve tanklar kuru olmalıdır",
              "Tüm tankların sounding kayıtları tutulmalıdır"
            ].map((rule, index) => (
              <div key={index} className="flex items-center gap-2 rounded-lg bg-green-500/5 border border-green-500/20 p-2">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-xs font-bold text-green-600 dark:text-green-400">
                  {index + 1}
                </div>
                <span className="text-xs text-foreground">{rule}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: "formuller",
    title: "12. Formüller ve Hesaplamalar",
    icon: Calculator,
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Aşağıdaki tabloda gemi stabilitesiyle ilgili temel formüller özetlenmiştir.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left font-semibold text-foreground">Konu</th>
                <th className="py-2 text-left font-semibold text-foreground">Formül</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Metasantrik Yükseklik (GM)</td>
                <td className="py-2 font-mono">GM = KM − KG veya GM = I/∇ − KG</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Doğrultucu Kol (GZ)</td>
                <td className="py-2 font-mono">GZ ≈ GM · sin φ (küçük açı)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Doğrultucu Moment (RM)</td>
                <td className="py-2 font-mono">RM = Δ · GZ</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Metasantrik Yarıçap (BM)</td>
                <td className="py-2 font-mono">BM = I/∇</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">KG Hesabı</td>
                <td className="py-2 font-mono">KG = Σ(wᵢ × KGᵢ) / Σwᵢ</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Serbest Yüzey Düzeltmesi</td>
                <td className="py-2 font-mono">GM<sub>d</sub> = GM − Σ(I<sub>f</sub>/∇)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Yalpa Periyodu</td>
                <td className="py-2 font-mono">T = C<sub>b</sub> × B / √GM</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">KN'den GZ'ye Dönüşüm</td>
                <td className="py-2 font-mono">GZ(θ) = KN(θ) − KG · sin θ</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2 font-medium text-foreground">Ağırlık Kaydırma Etkisi</td>
                <td className="py-2 font-mono">ΔGM = w × d / Δ</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-foreground">Kritik GM (Dry Dock)</td>
                <td className="py-2 font-mono">GM<sub>kritik</sub> = R × KM / Δ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
];

export default function StabilityTopicsPage() {
  const highRefreshRateStyles: CSSProperties = {
    ["--frame-rate" as string]: "120",
    ["--animation-duration" as string]: "8.33ms",
    ["--transition-duration" as string]: "16.67ms",
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 px-4 py-8 dark:from-[hsl(220,50%,6%)] dark:via-[hsl(220,50%,8%)] dark:to-[hsl(220,50%,10%)]"
      data-no-translate
      style={highRefreshRateStyles}
    >
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-10 right-10 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col gap-6">
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
            <GraduationCap className="h-4 w-4" />
            Konu Anlatımı
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <Anchor className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Gemi Stabilitesi Konu Anlatımı</h1>
          </div>
          
        </header>

        {/* Topics Accordion */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Konu Başlıkları</h2>
          </div>
          
          <Accordion type="single" collapsible className="space-y-2">
            {topicSections.map((section) => {
              const SectionIcon = section.icon;
              return (
                <AccordionItem
                  key={section.id}
                  value={section.id}
                  className="rounded-xl border border-border/40 bg-card/80 backdrop-blur overflow-hidden"
                >
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-card/90 [&[data-state=open]]:bg-card/90">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <SectionIcon className="h-4 w-4" />
                      </div>
                      <span className="text-left font-medium text-foreground">{section.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4">
                    {section.content}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </section>

        {/* Quick Links */}
        <section className="rounded-2xl border border-border/40 bg-card/80 p-6 backdrop-blur">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Hızlı Erişim</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { title: "Stabilite Hesaplamaları", href: "/stability/calculations" },
              { title: "Stabilite Formülleri", href: "/stability/formulas" },
              { title: "IMO Kuralları", href: "/stability/rules" }
            ].map((resource, index) => (
              <Link
                key={index}
                to={resource.href}
                className="group flex items-center justify-between rounded-lg border border-border/40 bg-background/50 px-4 py-3 transition-all hover:border-primary/40 hover:bg-background"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{resource.title}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </section>

        {/* Interactive Tools Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">İnteraktif Hesaplama Araçları</h2>
          </div>
          <InteractiveStabilityTools />
        </section>

        {/* Back to Lessons */}
        <div className="flex justify-center pt-2">
          <Link
            to="/lessons"
            className="inline-flex items-center gap-2 rounded-full bg-card/60 px-4 py-2 text-xs text-muted-foreground backdrop-blur transition-colors hover:bg-card hover:text-foreground"
          >
            <BookOpen className="h-4 w-4" />
            Tüm Derslere Dön
          </Link>
        </div>
      </div>
    </div>
  );
}
