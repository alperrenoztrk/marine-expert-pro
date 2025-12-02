import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Anchor, Ship, Waves, Shield, AlertTriangle, Calculator, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function StabilityTopicsPage() {
  return (
    <MobileLayout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto pb-20">
          <div className="flex items-center justify-between mb-8">
            <Link to="/stability">
              <Button variant="ghost" size="sm" className="gap-2 hover:bg-white/50">
                <ArrowLeft className="h-4 w-4" />
                Stabilite
              </Button>
            </Link>
          </div>

          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="h-10 w-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-3">
              Gemi Stabilitesi Konu Anlatımı
            </h1>
            <p className="text-muted-foreground">Kapsamlı teorik bilgi ve formüller</p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {/* BÖLÜM 1 */}
            <AccordionItem value="section-1" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Anchor className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 1 – Gemi Stabilitesine Giriş</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">1.1. Stabilite Kavramı</h3>
                      <p className="text-muted-foreground mb-3">
                        Gemi stabilitesi, bir geminin dış etkilerle (rüzgâr, dalga, yük kayması, manevra, çarpışma vb.) yatma veya eğilme hareketine maruz kaldıktan sonra tekrar ilk denge konumuna dönebilme kabiliyetidir.
                      </p>
                      <p className="text-muted-foreground mb-3">
                        Bir başka ifade ile stabilite, geminin dengesinin bozulmasına neden olan etkiler ortadan kalktığında, geminin eski durumuna dönmeye karşı gösterdiği direncin ölçüsüdür.
                      </p>
                      <p className="text-muted-foreground font-medium">Stabilite iki yönüyle önemlidir:</p>
                      <ol className="list-decimal list-inside ml-4 text-muted-foreground space-y-1">
                        <li><strong>Emniyet yönü:</strong> Geminin devrilmeden seferini tamamlaması.</li>
                        <li><strong>Konfor ve işletme yönü:</strong> Personel ve yük üzerinde oluşan ivmelerin kabul edilebilir seviyede tutulması.</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">1.2. Stabilitenin Türleri</h3>
                      <p className="text-muted-foreground mb-2">Genel olarak gemi stabilitesi üç ana başlıkta incelenir:</p>
                      <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                        <li>
                          <strong>Enine (transvers) stabilite:</strong>
                          <p className="ml-6">Geminin iskele ve sancak yönünde yatmasına karşı koyma yeteneğidir. Klasik GM, GZ eğrileri vb. genellikle enine stabiliteyi ifade eder.</p>
                        </li>
                        <li>
                          <strong>Boyuna (longitudinal) stabilite:</strong>
                          <p className="ml-6">Geminin baş ve kıç tarafında meydana gelen trim değişimlerine karşı koyma yeteneğidir. Trim, boyuna ağırlık dağılımındaki değişim sonucu ortaya çıkar.</p>
                        </li>
                        <li>
                          <strong>Dik (yönsel) stabilite:</strong>
                          <p className="ml-6">Geminin pruvasının belirli bir rotayı koruma eğilimi ile ilgilidir. Bu kısım, daha çok manevra teorisi ile ilişkilidir.</p>
                        </li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">1.3. Stabilitenin Gemi Tasarımı ve İşletmesindeki Önemi</h3>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-2">
                        <li><strong>Tasarım aşamasında:</strong> Gövde formu, genişlik, derinlik, su çekimi, üst yapı düzeni ve iç düzenleme stabiliteyi doğrudan etkiler.</li>
                        <li><strong>İnşa sonrası:</strong> Yükleme planı, yakıt ve su dağılımı, balast kullanımı, tank işletme şekilleri, serbest yüzey etkisi gibi unsurlar, stabilitenin seyir boyunca değişmesine neden olur.</li>
                        <li><strong>Klas ve mevzuat:</strong> Uluslararası sözleşmeler ve klas kuralları, gemilerin belirli stabilite kriterlerini sağlamasını zorunlu kılar.</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 2 */}
            <AccordionItem value="section-2" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Scale className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 2 – Temel Kavramlar ve Tanımlar</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">2.1. Ağırlık Merkezi (G) – Center of Gravity</h3>
                      <p className="text-muted-foreground mb-3">
                        Gemiyi oluşturan tüm elemanların (gövde yapısı, makine, yük, yakıt, tatlı su, kumanya, yolcu, personel vb.) ağırlıklarının bileşke etki noktasına ağırlık merkezi (G) denir.
                      </p>
                      <p className="text-muted-foreground mb-3">
                        Ağırlık kuvveti, geminin ağırlığı W = Δ (deplasman) kadardır ve dikey olarak G noktasından aşağıya doğru etkir.
                      </p>
                      <p className="text-muted-foreground font-medium mb-2">Önemli özellikler:</p>
                      <ol className="list-decimal list-inside ml-4 text-muted-foreground space-y-1">
                        <li>Ağırlıklar yukarı taşındığında G yükselir.</li>
                        <li>Ağırlıklar aşağı taşındığında G alçalır.</li>
                        <li>Ağırlık yatay yönde kaydırıldığında G, aynı yönde yatay yer değiştirir.</li>
                        <li>G'nin konumu, geminin stabilitesi üzerinde doğrudan belirleyicidir.</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">2.2. Yüzme Merkezi (B) – Center of Buoyancy</h3>
                      <p className="text-muted-foreground mb-3">
                        Geminin su altında kalan kısmının (batmış hacmin) ağırlık merkezine yüzme merkezi (B) denir.
                      </p>
                      <p className="text-muted-foreground mb-3">
                        Geminin deplasmanı kadar suyu yer değiştirmesi sonucu Arşimet prensibine göre oluşan kaldırma kuvveti (Y) büyüklük olarak geminin ağırlığına eşittir.
                      </p>
                      <p className="text-muted-foreground">
                        Geminin yatması, trim yapması veya yüklenmesi sonucu su altında kalan şekil değiştiğinden B noktasının da konumu değişir. Stabilite analizi, G ve B noktalarının göreli hareketleri üzerinden gerçekleştirilir.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">2.3. Metasanter (M) – Metacenter</h3>
                      <p className="text-muted-foreground mb-3">
                        Gemi çok küçük bir açı ile (genellikle 10 dereceye kadar) enine yönde yatarsa, su altında kalan hacim şekil değiştirir ve yüzme merkezi B noktası yeni konuma (B₁) gider. Yeni kaldırma kuvveti doğrusu geminin orta düzleminde, başlangıçtaki kaldırma doğrusu ile belirli bir noktada kesişir. Bu teorik kesişme noktası metasanter (M) olarak tanımlanır.
                      </p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                        <li>M noktası, küçük açılar için sabit kabul edilir.</li>
                        <li>Geminin enine stabilitesi, küçük açılarda esas olarak G ile M arasındaki mesafe (GM) ile ifade edilir.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">2.4. Dikey Mesafeler: KG, KB, BM, KM ve GM</h3>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1 mb-4">
                        <li><strong>KG:</strong> Omurga (keel) ile ağırlık merkezi G arasındaki dikey mesafe.</li>
                        <li><strong>KB:</strong> Omurga ile yüzme merkezi B arasındaki dikey mesafe.</li>
                        <li><strong>BM:</strong> B ile metasanter M arasındaki dikey mesafe (metasantrik yarıçap).</li>
                        <li><strong>KM:</strong> Omurga ile metasanter M arasındaki mesafe.</li>
                      </ul>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">KM = KB + BM</p>
                        <p className="font-mono text-center text-blue-800 font-semibold mt-2">GM = KM - KG</p>
                      </div>
                      <p className="text-muted-foreground mt-3">
                        Bu bağıntı, küçük açılı enine stabilitenin temel formülüdür. GM'nin işareti ve büyüklüğü, geminin sıfır derece civarındaki stabilitesini belirler.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 3 */}
            <AccordionItem value="section-3" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Waves className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 3 – Arşimet Prensibi ve Deplasman</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">3.1. Arşimet Prensibi</h3>
                      <p className="text-muted-foreground mb-3">
                        <strong>Tanım:</strong> Bir sıvıya batırılmış cisme, yer değiştirdiği sıvının ağırlığına eşit, yukarı yönlü bir kaldırma kuvveti etkir.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 font-semibold">Y = γ · ∇</p>
                        <div className="text-xs text-blue-600 mt-2 text-center">
                          <p>Y: Kaldırma kuvveti | γ: Sıvının birim hacim ağırlığı | ∇: Batmış hacim (m³)</p>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="font-mono text-center text-green-800 font-semibold">Denge durumunda: Y = W = Δ</p>
                        <p className="text-xs text-green-600 mt-2 text-center">
                          Geminin deplasman ağırlığı, yer değiştirdiği suyun ağırlığına eşittir.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">3.2. Deplasman (Δ) Kavramı</h3>
                      <p className="text-muted-foreground mb-3">
                        Deplasman (Δ), geminin ve üzerindeki her şeyin toplam ağırlığıdır:
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 text-sm">
                          Δ = W<sub>gövde</sub> + W<sub>makine</sub> + W<sub>yük</sub> + W<sub>yakıt</sub> + W<sub>su</sub> + W<sub>kumanya</sub> + ...
                        </p>
                      </div>
                      <p className="text-muted-foreground">
                        Deplasman arttıkça gemi daha fazla suya batar, draft (su çekimi) artar ve yüzme merkezi B'nin konumu, su altı formuna bağlı olarak değişir.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">3.3. Draft (Su Çekimi) ve Su Hattı</h3>
                      <p className="text-muted-foreground mb-3">
                        Draft (T), geminin su hattından omurgasına olan dikey mesafedir:
                      </p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1 mb-3">
                        <li><strong>T<sub>B</sub>:</strong> Baş draftı</li>
                        <li><strong>T<sub>K</sub>:</strong> Kıç draftı</li>
                      </ul>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">
                          T<sub>ort</sub> = (T<sub>baş</sub> + T<sub>kıç</sub>) / 2
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 4 */}
            <AccordionItem value="section-4" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 4 – Küçük Açılı Enine Stabilite</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">4.1. Gemi Küçük Bir Açıda Yatarken Kuvvetler</h3>
                      <p className="text-muted-foreground mb-3">
                        Gemi küçük bir açıyla (θ) iskele veya sancak tarafa yattığında ağırlık kuvveti W, G noktasından dikey aşağıya; kaldırma kuvveti Y, yeni yüzme merkezinden (B₁) yukarıya etki eder. Bu iki kuvvet bir moment çifti oluşturur.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">4.2. GZ ve GM İlişkisi (Küçük Açılar)</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 font-semibold">GZ ≈ GM · sin θ</p>
                        <div className="text-xs text-blue-600 mt-2 text-center">
                          <p>GZ: Sağlama kolu | GM: Metasantrik yükseklik | θ: Yatma açısı</p>
                        </div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-center text-green-800 font-medium mb-2">Statik Sağlama Momenti:</p>
                        <p className="font-mono text-center text-green-800 font-semibold">M<sub>R</sub> = Δ · GZ = Δ · GM · sin θ</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">4.3. GM'in Fiziksel Yorumu</h3>
                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="font-semibold text-green-800">GM {">"} 0 (Pozitif Stabilite)</p>
                          <p className="text-green-700 text-sm">G, M'nin altındadır. Gemi, eğildiğinde geri döndürücü (righting) moment oluşur.</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="font-semibold text-yellow-800">GM = 0 (Nötr Denge)</p>
                          <p className="text-yellow-700 text-sm">G ile M çakışıktır. Geminin dengesi nötrdür.</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                          <p className="font-semibold text-red-800">GM {"<"} 0 (Negatif Stabilite)</p>
                          <p className="text-red-700 text-sm">G, M'nin üzerindedir. Devirmeye çalışan moment oluşur. Gemi kolayca devrilebilir!</p>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-blue-800 text-sm">
                          <strong>Büyük GM →</strong> sert gemi (stiff ship)<br/>
                          <strong>Küçük GM →</strong> yumuşak gemi (tender ship)
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 5 */}
            <AccordionItem value="section-5" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Ship className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 5 – Sert ve Yumuşak Gemi, Rulo Periyodu</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">5.1. Sert Gemi (Stiff Ship)</h3>
                      <p className="text-muted-foreground mb-3">Sert gemilerde GM büyüktür:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1 mb-3">
                        <li>GZ, küçük açılarda bile hızlı büyür.</li>
                        <li>Gemi, yatma açısını çok kısa sürede toparlar.</li>
                        <li>Rulo periyodu kısadır, gemi hızlı salınır.</li>
                      </ul>
                      <p className="text-muted-foreground font-medium">Sonuçları:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                        <li>Personel ve yolcu konforu olumsuz etkilenir.</li>
                        <li>Yükler daha yüksek ivmelere maruz kalır.</li>
                        <li>Aşırı sertlik yapısal yükleri artırabilir.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">5.2. Yumuşak Gemi (Tender Ship)</h3>
                      <p className="text-muted-foreground mb-3">Yumuşak gemilerde GM küçüktür:</p>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                        <li>GZ küçük açılarda yavaş artar.</li>
                        <li>Gemi yatma açısını çok daha yavaş toparlar.</li>
                        <li>Rulo periyodu uzundur.</li>
                        <li>GM çok küçükse devrilme riski artar!</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">5.3. Rulo Periyodu ve GM İlişkisi</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 font-semibold">T ≈ C · √(k / GM)</p>
                        <div className="text-xs text-blue-600 mt-2 text-center">
                          <p>T: Rulo periyodu | C: Deneysel sabit | k: Atalet yarıçapı</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground">
                        GM arttıkça T küçülür, GM azaldıkça T büyür. Bu ilişki pratikte, rulo periyodu ölçülerek GM'in tahmini için de kullanılır.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 6 */}
            <AccordionItem value="section-6" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Scale className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 6 – GZ Eğrileri, Statik ve Dinamik Stabilite</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">6.1. GZ Eğrisi (Righting Arm Curve)</h3>
                      <p className="text-muted-foreground">
                        GZ ≈ GM·sinθ ifadesi sadece küçük açılar için geçerlidir. Gemiler pratikte 40–60 dereceye kadar yatabilir. Bu nedenle, farklı açılar için GZ değerleri hesaplanır ve GZ – θ eğrisi çizilir.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">6.2. GZ Eğrisinin Önemli Parametreleri</h3>
                      <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                        <li><strong>Başlangıç eğimi:</strong> 0–10° arasındaki eğim, GM hakkında bilgi verir.</li>
                        <li><strong>Maksimum GZ (GZ<sub>max</sub>):</strong> Stabilitenin en kuvvetli olduğu açı.</li>
                        <li><strong>Pozitif stabilite aralığı:</strong> GZ'nin pozitif olduğu açı aralığı.</li>
                        <li><strong>Vanishing stability açısı (θ<sub>v</sub>):</strong> GZ'nin sıfıra düştüğü açı. Bu açıdan sonra gemi devrilir.</li>
                      </ol>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">6.3. Statik Stabilite</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">M<sub>R</sub>(θ) = Δ · GZ(θ)</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">6.4. Dinamik Stabilite</h3>
                      <p className="text-muted-foreground mb-3">
                        Dinamik stabilite, geminin belirli bir açıya kadar devrilmesi için gerekli enerji ile ilgilidir:
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">E(θ) ∝ ∫₀^θ GZ(φ) dφ</p>
                        <p className="text-xs text-blue-600 mt-2 text-center">Alan büyükse devrilme için daha fazla enerji gerekir.</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 7 */}
            <AccordionItem value="section-7" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 7 – GM Hesapları: KG, KB, BM, KM</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">7.1. KB ve BM'nin Belirlenmesi</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">BM = I / ∇</p>
                        <div className="text-xs text-blue-600 mt-2 text-center">
                          <p>I: Su hattı alanının enine atalet momenti | ∇: Batmış hacim (m³)</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mt-3">
                        Gemi ne kadar geniş ve su hattı alanı ne kadar yaygın ise, I o kadar büyük olur, dolayısıyla BM artar.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">7.2. KG'nin Hesaplanması</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">KG = Σ(wᵢ · kg_i) / Σwᵢ</p>
                        <div className="text-xs text-blue-600 mt-2 text-center">
                          <p>wᵢ: i. ağırlığın ton cinsinden büyüklüğü | kg_i: omurgadan dikey mesafesi</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">7.3. KM ve GM'nin Hesaplanması</h3>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="font-mono text-center text-green-800 font-semibold">GM = KM - KG</p>
                        <div className="text-xs text-green-600 mt-2 text-center">
                          <p>KM: Hidrostatikten alınan değer | KG: Yükleme hesaplarından</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 8 */}
            <AccordionItem value="section-8" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Anchor className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 8 – Ağırlıkların Taşınması ve Etkileri</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">8.1. Dikey Yönde Ağırlık Taşınması</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 font-semibold">ΔKG = (w · Δh) / Δ</p>
                        <p className="text-xs text-blue-600 mt-2 text-center">
                          Δh: Dikey yer değiştirme (yukarı +, aşağı -)
                        </p>
                      </div>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                        <li>Ağırlık yukarı taşınırsa ΔKG {">"} 0, KG artar, GM azalır.</li>
                        <li>Ağırlık aşağı taşınırsa ΔKG {"<"} 0, KG azalır, GM artar.</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">8.2. Enine Yönde Ağırlık Taşınması ve List Açısı</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 font-semibold">M<sub>enine</sub> = w · y</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="font-mono text-center text-green-800 font-semibold">tan θ ≈ (w · y) / (Δ · GM)</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">8.3. Boyuna Yönde Ağırlık Taşınması ve Trim</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">M<sub>boyuna</sub> = w · x</p>
                        <p className="text-xs text-blue-600 mt-2 text-center">
                          x: Ağırlığın LCF'ye göre boyuna mesafesindeki değişim
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 9 */}
            <AccordionItem value="section-9" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Waves className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 9 – Serbest Yüzey Etkisi (FSE)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">9.1. Serbest Yüzeyin Tanımı</h3>
                      <p className="text-muted-foreground">
                        Gemide kısmen dolu olan sıvı tanklarında, sıvının üst yüzeyi serbesttir. Gemi enine yönde yatmaya başladığında tanktaki sıvı daha düşük seviyeye doğru akar ve geminin o bordaya doğru ağırlığı artmış gibi davranır.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">9.2. Serbest Yüzeyin GM Üzerine Etkisi</h3>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="font-mono text-center text-red-800 font-semibold">GM<sub>eff</sub> = GM<sub>gerçek</sub> - (ΣFSM / Δ)</p>
                        <p className="text-xs text-red-600 mt-2 text-center">
                          Serbest yüzey etkisi ne kadar büyükse, GM o kadar azalır!
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">9.3. FSM'in Hesaplanması</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">FSM ≈ ρ · (b³ · l) / 12</p>
                        <div className="text-xs text-blue-600 mt-2 text-center">
                          <p>b: Tankın enine genişliği | l: Boyuna uzunluğu | ρ: Sıvının yoğunluğu</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">9.4. Serbest Yüzey Etkisini Azaltma Yöntemleri</h3>
                      <ol className="list-decimal list-inside ml-4 text-muted-foreground space-y-2">
                        <li>Tankları tam dolu veya tam boş tutmak.</li>
                        <li>Geniş tankları boyuna veya enine perdelerle bölümlendirmek.</li>
                        <li>Özellikle double bottom tanklarını tercih etmek.</li>
                        <li>Balast planlamasını optimize etmek.</li>
                      </ol>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 10 */}
            <AccordionItem value="section-10" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Ship className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 10 – Boyuna Stabilite ve Trim</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">10.1. Trim ve Ortalama Draft</h3>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-3">
                        <p className="font-mono text-center text-blue-800 font-semibold">Trim = T<sub>kıç</sub> - T<sub>baş</sub></p>
                      </div>
                      <p className="text-muted-foreground">
                        Pozitif trim, genelde kıçın daha derinde, başın daha sığ olduğu durumu ifade eder.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">10.3. MCT (Moment to Change Trim) Kavramı</h3>
                      <p className="text-muted-foreground mb-3">
                        MCT1cm, geminin trimini 1 cm değiştirmek için gerekli boyuna momenti ifade eder:
                      </p>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="font-mono text-center text-green-800 font-semibold">ΔTrim (cm) = (w · x) / MCT1cm</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">10.4. LCF (Longitudinal Center of Flotation)</h3>
                      <p className="text-muted-foreground">
                        LCF, su hattı alanının boyuna ağırlık merkezi olup, trim değişiklikleri yaklaşık olarak bu nokta etrafında gerçekleşir.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 11 */}
            <AccordionItem value="section-11" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-red-500 to-orange-600 p-2 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 11 – Hasarlı Stabilite ve Su Alma</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">11.1. Hasarlı Stabilitenin Tanımı</h3>
                      <p className="text-muted-foreground">
                        Hasarlı stabilite, geminin bir veya daha fazla su geçirmez bölmesinin bütünlüğünü kaybettiği durumda (çarpışma, karaya oturma, patlama vb.) sahip olduğu stabilite özelliklerini ifade eder.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">11.2. Su Geçirmez Bölmeleme</h3>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-1">
                        <li>Çift dip (double bottom)</li>
                        <li>Yan tanklar (wing tanks)</li>
                        <li>Enine ve boyuna perdeler</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                      <p className="text-red-800 text-sm">
                        <strong>Uyarı:</strong> Hasarlı bölmelerdeki su, tam dolmamışsa serbest yüzey etkisi yaratarak GM'i daha da düşürür!
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 12 */}
            <AccordionItem value="section-12" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 12 – IMO Stabilite Kriterleri</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">12.1. Genel Felsefe</h3>
                      <p className="text-muted-foreground">
                        IMO, gemilerin farklı yükleme durumlarında asgari stabilite gereklerini karşılamasını zorunlu kılmıştır.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">12.2. Tipik Kriterler</h3>
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-sm"><strong>Alan Kriteri:</strong> 0°–30° veya 0°–40° arası GZ alanı minimum değerden büyük olmalı</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-sm"><strong>GZ Kriteri:</strong> 30° veya 40°'de minimum GZ sağlanmalı</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-sm"><strong>Maks GZ Açısı:</strong> Belirli aralıkta olmalı (örn. 25°–35°)</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="text-blue-800 text-sm"><strong>GM₀ Kriteri:</strong> Minimum değeri sağlamalı</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 13-14 */}
            <AccordionItem value="section-13" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                      <Ship className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 13-14 – Yükleme Durumları ve Özel Yükler</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Temel Yükleme Durumları</h3>
                      <div className="space-y-3">
                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                          <p className="font-semibold text-yellow-800">1. Hafif gemi (Lightship)</p>
                          <p className="text-yellow-700 text-sm">Minimum yük durumu. KG yüksek olabilir!</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                          <p className="font-semibold text-green-800">2. Ballastlı durum</p>
                          <p className="text-green-700 text-sm">Alt tanklara su alınarak KG düşürülür. En emniyetli GM.</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                          <p className="font-semibold text-blue-800">3. Tam yüklü durum</p>
                          <p className="text-blue-700 text-sm">Yükün yerleşimine bağlı KG. Serbest yüzey etkisine dikkat!</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Özel Yükler</h3>
                      <ul className="list-disc list-inside ml-4 text-muted-foreground space-y-2">
                        <li><strong>Tahıl ve Dökme Yükler:</strong> Kayma riski, kalıcı list oluşabilir.</li>
                        <li><strong>Sıvı Yükler (Tankerler):</strong> Büyük serbest yüzey etkisi.</li>
                        <li><strong>Araç ve Canlı Yük:</strong> Hareketli yük, dinamik ağırlık merkezi.</li>
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>

            {/* BÖLÜM 15-16 */}
            <AccordionItem value="section-15" className="border-none">
              <Card className="overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-blue-50/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold text-lg text-left">Bölüm 15-16 – Yükleme Bilgisayarları ve Sayısal Örnekler</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-6">
                  <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Yükleme Bilgisayarı ve Stabilite Kitapçığı</h3>
                      <p className="text-muted-foreground">
                        Modern gemilerde yükleme bilgisayarı toplam deplasmanı, KG'yi, GM'i, GZ eğrilerini ve stabilite kriterlerini otomatik hesaplar. Her gemi için stabilite kitapçığı bulunur.
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Örnek 1 – Yeni KG'nin Hesabı</h3>
                      <p className="text-muted-foreground mb-2">10.000 ton gemi, KG=8.5m, 500 ton yük 10m yüksekliğe alınırsa:</p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">
                          KG<sub>yeni</sub> = (10000 · 8.5 + 500 · 10) / 10500 = 8.57 m
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Örnek 2 – Dikey Ağırlık Taşınması</h3>
                      <p className="text-muted-foreground mb-2">12.000 ton gemi, 200 ton 2m yukarı taşınırsa:</p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">
                          ΔKG = (200 · 2) / 12000 = 0.033 m
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Örnek 3 – Serbest Yüzey Etkisi</h3>
                      <p className="text-muted-foreground mb-2">8.000 ton gemi, FSM = 600 ton·m:</p>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="font-mono text-center text-blue-800 font-semibold">
                          ΔKG = 600 / 8000 = 0.075 m
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-700 mb-2">Örnek 4 – List Açısı</h3>
                      <p className="text-muted-foreground mb-2">15.000 ton, GM=1.0m, 100 ton 5m sancağa:</p>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="font-mono text-center text-green-800 font-semibold">
                          tan θ = 500 / (15000 · 1.0) = 0.033 → θ ≈ 1.9°
                        </p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </MobileLayout>
  );
}
