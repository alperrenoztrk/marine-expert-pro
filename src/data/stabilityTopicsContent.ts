// Comprehensive Stability Topics Content Data
// Each topic contains detailed explanations, formulas, examples, and practical applications

export interface StabilitySubTopic {
  title: string;
  content: string;
  formulas?: { formula: string; description: string }[];
  examples?: { problem: string; solution: string }[];
  practicalTips?: string[];
  warnings?: string[];
  keyPoints?: string[];
}

export interface StabilityTopic {
  id: string;
  title: string;
  icon: string;
  iconColor: string;
  description: string;
  subtopics: StabilitySubTopic[];
}

export const stabilityTopicsData: StabilityTopic[] = [
  {
    id: "section-1",
    title: "Bölüm 1 – Gemi Stabilitesine Giriş",
    icon: "Anchor",
    iconColor: "from-blue-500 to-indigo-600",
    description: "Gemi stabilitesinin temel kavramları ve önemi",
    subtopics: [
      {
        title: "1.1. Stabilite Kavramı ve Tanımı",
        content: `Gemi stabilitesi, denizcilik mühendisliğinin en kritik konularından biridir ve bir geminin denizde güvenli bir şekilde seyir yapabilmesi için olmazsa olmaz bir özelliktir.

**Stabilite Nedir?**
Gemi stabilitesi, bir geminin dış etkilerle (rüzgâr, dalga, yük kayması, manevra, çarpışma, ani dönüş vb.) yatma veya eğilme hareketine maruz kaldıktan sonra tekrar ilk denge konumuna dönebilme kabiliyetini ifade eder.

Bir başka ifade ile stabilite, geminin dengesinin bozulmasına neden olan etkiler ortadan kalktığında, geminin eski durumuna dönmeye karşı gösterdiği direncin ölçüsüdür. Bu direnç, geminin geometrik özellikleri, yük dağılımı ve hidrostatik özellikleri ile doğrudan ilişkilidir.

**Stabilitenin Fiziksel Temeli**
Stabilitenin fiziksel temeli, Arşimet prensibine ve kuvvet dengesi ilkelerine dayanır. Bir gemi suya konulduğunda:
- Geminin toplam ağırlığı (W) aşağı yönde etki eder
- Yer değiştirilen suyun kaldırma kuvveti (Y) yukarı yönde etki eder
- Denge durumunda bu iki kuvvet eşit ve zıt yönlüdür

**Stabilitenin Önemi**
Stabilite iki temel yönüyle önemlidir:

1. **Emniyet Yönü:** Geminin devrilmeden seferini tamamlaması, mürettebat ve yolcuların güvenliği için hayati önem taşır. Yetersiz stabilite, geminin batmasına ve can kaybına yol açabilir.

2. **Konfor ve İşletme Yönü:** Personel ve yük üzerinde oluşan ivmelerin kabul edilebilir seviyede tutulması gerekir. Aşırı sert bir gemi (çok fazla stabilite), mürettebat için rahatsızlık yaratır ve yüklere zarar verebilir.`,
        keyPoints: [
          "Stabilite, geminin dış etkilere karşı denge konumuna dönme kabiliyetidir",
          "Arşimet prensibi stabilite hesaplarının temelini oluşturur",
          "Hem emniyet hem de konfor açısından kritik öneme sahiptir",
          "Yük dağılımı ve tank yönetimi stabiliteyi doğrudan etkiler"
        ],
        warnings: [
          "Yetersiz stabilite, geminin devrilmesine ve batmasına neden olabilir",
          "Aşırı stabilite de tehlikelidir - sert salınımlar yapısal hasara yol açabilir"
        ]
      },
      {
        title: "1.2. Stabilitenin Türleri",
        content: `Gemi stabilitesi, hareketin yönüne göre üç ana başlıkta incelenir. Her bir stabilite türü farklı fiziksel olaylara ve hesaplamalara dayanır.

**1. Enine (Transvers) Stabilite**
Geminin iskele ve sancak yönünde yatmasına karşı koyma yeteneğidir. Bu, stabilitenin en kritik bileşenidir çünkü:
- Gemiler genellikle enine yönde daha fazla salınım yapar
- Devrilme riski çoğunlukla enine yönde gerçekleşir
- IMO kriterleri öncelikle enine stabiliteyi değerlendirir

Klasik GM (metasantrik yükseklik), GZ eğrileri ve stabilite kriterleri genellikle enine stabiliteyi ifade eder.

**Enine Stabilite Hesaplarında Kullanılan Parametreler:**
- GM (Metasantrik Yükseklik)
- GZ (Sağlama Kolu)
- KG (Ağırlık Merkezi Yüksekliği)
- BM (Metasantrik Yarıçap)

**2. Boyuna (Longitudinal) Stabilite**
Geminin baş ve kıç tarafında meydana gelen trim değişimlerine karşı koyma yeteneğidir. Trim, boyuna ağırlık dağılımındaki değişim sonucu ortaya çıkar.

Boyuna stabilite:
- Trim hesaplamalarında kullanılır
- Yükleme planlamasında kritik öneme sahiptir
- MCT (Moment to Change Trim) kavramı ile ifade edilir
- Geminin su hattı altındaki şekli ile ilişkilidir

**Boyuna Stabilite Parametreleri:**
- GML (Boyuna Metasantrik Yükseklik)
- MCT1cm (1 cm Trim Değiştiren Moment)
- LCF (Boyuna Yüzme Merkezi)
- LCB (Boyuna Kaldırma Merkezi)

**3. Dik (Yönsel/Rota) Stabilite**
Geminin pruvasının belirli bir rotayı koruma eğilimi ile ilgilidir. Bu kısım, daha çok manevra teorisi ile ilişkilidir ve:
- Dümen etkinliği ile doğrudan ilgilidir
- Geminin rotadan sapma eğilimini belirler
- Yaw (sapma) hareketleri ile değerlendirilir`,
        keyPoints: [
          "Enine stabilite: İskele-sancak yönünde, en kritik stabilite türü",
          "Boyuna stabilite: Baş-kıç yönünde, trim hesaplarında önemli",
          "Dik stabilite: Rota koruma kabiliyeti, manevra teorisi ile ilgili"
        ],
        practicalTips: [
          "Yükleme planlaması yaparken öncelikle enine stabiliteyi kontrol edin",
          "Trim değişiklikleri boyuna stabiliteyi etkiler - MCT değerlerini kullanın",
          "Manevra sırasında dik stabilitenin etkilerini göz önünde bulundurun"
        ]
      },
      {
        title: "1.3. Stabilitenin Gemi Tasarımı ve İşletmesindeki Önemi",
        content: `Gemi stabilitesi, tasarım aşamasından işletme sürecine kadar her aşamada kritik öneme sahiptir.

**Tasarım Aşamasında Stabilite**
Geminin tasarım aşamasında stabilite özellikleri belirlenir:

1. **Gövde Formu:** Geminin genişliği (B), derinliği (D) ve su çekimi (T) oranları stabilitenin temel belirleyicileridir. Geniş gövdeli gemiler genellikle daha iyi stabiliteye sahiptir.

2. **Üst Yapı Düzeni:** Üst yapıların yüksekliği ve konumu, geminin ağırlık merkezi yüksekliğini (KG) doğrudan etkiler.

3. **İç Düzenleme:** Tank yerleşimi, makine dairesi konumu ve ambar düzenlemesi stabiliteyi etkiler.

4. **Form Katsayıları:** Block katsayısı (Cb), su hattı alan katsayısı (Cw) gibi parametreler stabilitenin hesaplanmasında kullanılır.

**İnşa Sonrası ve İşletme Döneminde**
Gemi hizmete girdikten sonra stabilite, birçok faktör tarafından sürekli olarak etkilenir:

1. **Yükleme Planı:** Yükün gemiye nasıl yerleştirildiği, KG ve GM değerlerini doğrudan değiştirir.

2. **Yakıt ve Su Dağılımı:** Seyir boyunca tüketilen yakıt ve su, geminin ağırlık merkezini değiştirir.

3. **Balast Kullanımı:** Balast tankları, stabiliteyi optimize etmek için aktif olarak kullanılır.

4. **Tank İşletme Şekilleri:** Kısmen dolu tanklar serbest yüzey etkisi yaratarak GM'i azaltır.

**Klas Kuralları ve Mevzuat**
Uluslararası kuruluşlar gemilerin minimum stabilite gereksinimlerini belirler:

- **IMO (Uluslararası Denizcilik Örgütü):** IS Code, SOLAS, MARPOL
- **Klas Kuruluşları:** Lloyd's, DNV, ABS, BV vb.
- **Bayrak Devletleri:** Ulusal mevzuat gereksinimleri

Bu kurallar, gemilerin belirli stabilite kriterlerini sağlamasını zorunlu kılar ve düzenli denetimlerle kontrol edilir.`,
        keyPoints: [
          "Tasarım aşamasında gövde formu ve üst yapı stabiliteyi belirler",
          "İşletme döneminde yükleme ve tank yönetimi kritiktir",
          "IMO ve klas kuruluşları minimum stabilite standartlarını belirler",
          "Düzenli stabilite denetimleri yasal zorunluluktur"
        ],
        practicalTips: [
          "Her yükleme öncesi stabilite hesabı yapılmalıdır",
          "Seyir boyunca yakıt tüketimi ile değişen stabiliteyi izleyin",
          "Onaylı stabilite kitapçığındaki yükleme senaryolarına uyun",
          "Balast operasyonlarını stabilite göz önünde bulundurarak planlayın"
        ]
      },
      {
        title: "1.4. Tarihsel Perspektif ve Kazalar",
        content: `Gemi stabilitesi konusu, tarih boyunca yaşanan trajik kazalarla şekillenen bir mühendislik disiplinidir.

**Önemli Stabilite Kazaları**

**1. Vasa (1628):** İsveç savaş gemisi, ilk seferinde batmıştır. Nedenleri:
- Üst yapıların çok ağır olması
- Düşük GM değeri
- Açık top limanlarından su girişi
Bu kaza, stabilite hesaplamalarının önemini gösteren ilk büyük örneklerden biridir.

**2. SS Eastland (1915):** Chicago'da 844 kişinin hayatını kaybettiği bu kazada:
- Yolcu gemisi limanda devrilmiştir
- Can salları eklenirken KG yükselmiştir
- Balast tankları boşaltılarak durum kötüleşmiştir

**3. MV Derbyshire (1980):** 44 mürettebat ile kaybolan bulk carrier:
- Tayfun koşullarında batmıştır
- Ambar kapaklarının hasarı ve su girişi
- Bu kaza SOLAS düzenlemelerinin güncellenmesine yol açmıştır

**4. Costa Concordia (2012):** Modern dönemin en bilinen stabilite kazası:
- Karaya çarpma sonrası su girişi
- Hasarlı stabilite yetersizliği
- 32 kişi hayatını kaybetmiştir

**Derslerin Alınması**
Bu kazalar sonucunda:
- IMO stabilite kriterleri sürekli güncellenmektedir
- Hasarlı stabilite hesapları zorunlu hale gelmiştir
- Stabilite eğitimi denizcilik müfredatının temel parçası olmuştur
- Yükleme bilgisayarları ve stabilite yazılımları geliştirilmiştir`,
        warnings: [
          "Stabilite kazaları genellikle birden fazla faktörün birleşmesiyle oluşur",
          "Küçük ihmal veya hatalar büyük felaketlere yol açabilir",
          "Her yükleme durumu için stabilite kontrolü hayati önem taşır"
        ],
        keyPoints: [
          "Tarihi kazalar stabilite mevzuatının gelişmesine katkıda bulunmuştur",
          "Vasa kazası erken dönem stabilite sorunlarının klasik örneğidir",
          "Modern düzenlemeler bu kazalardan çıkarılan derslerle şekillenmiştir"
        ]
      }
    ]
  },
  {
    id: "section-2",
    title: "Bölüm 2 – Temel Kavramlar ve Tanımlar",
    icon: "Scale",
    iconColor: "from-blue-500 to-indigo-600",
    description: "Stabilite hesaplarında kullanılan temel kavramlar",
    subtopics: [
      {
        title: "2.1. Ağırlık Merkezi (G) – Center of Gravity",
        content: `Ağırlık merkezi (G), gemi stabilitesinin en temel kavramlarından biridir ve geminin tüm ağırlığının tek bir noktada toplandığı varsayılan noktadır.

**Tanım ve Fiziksel Anlam**
Gemiyi oluşturan tüm elemanların (gövde yapısı, makine, yük, yakıt, tatlı su, kumanya, yolcu, personel vb.) ağırlıklarının bileşke etki noktasına ağırlık merkezi (G) denir.

Ağırlık kuvveti, geminin ağırlığı W = Δ (deplasman) kadardır ve dikey olarak G noktasından aşağıya doğru etkir. Newton'un yerçekimi kanununa göre, tüm kütle aşağı yönde çekilir ve bu kuvvet G noktasından geçer.

**G Noktasının Koordinatları**
G noktası üç boyutlu bir koordinat sistemi ile tanımlanır:
- **KG (Keel-to-G):** Omurgadan G'ye dikey mesafe
- **LCG (Longitudinal Center of Gravity):** Boyuna ağırlık merkezi konumu
- **TCG (Transverse Center of Gravity):** Enine ağırlık merkezi konumu

**KG'nin Önemi**
KG değeri, stabilite açısından en kritik parametrelerden biridir:
- KG ne kadar düşükse, GM o kadar büyük olur
- Düşük KG = Daha iyi stabilite
- Yüksek KG = Daha zayıf stabilite

**G Noktasının Hareketi**
Gemideki herhangi bir ağırlık değişikliği G noktasının konumunu değiştirir:

1. **Ağırlık yukarı taşınırsa:** G yükselir, GM azalır
2. **Ağırlık aşağı taşınırsa:** G alçalır, GM artar
3. **Ağırlık yatay yönde kaydırılırsa:** G aynı yönde yatay yer değiştirir
4. **Ağırlık eklenmesi:** G, eklenen ağırlık yönüne hareket eder
5. **Ağırlık çıkarılması:** G, çıkarılan ağırlığın tersine hareket eder

**Önemli Kural**
G noktası, ağırlık ekleme, çıkarma veya taşıma işlemi tamamlanana kadar hareket etmez. Kaldırma işlemi başladığı anda (örneğin kreyn ile), yük gemiden ayrılmış kabul edilir ve G anında değişir.`,
        formulas: [
          {
            formula: "KG = Σ(wᵢ × kgᵢ) / Σwᵢ",
            description: "Toplam KG hesabı: Her bir ağırlığın momentleri toplamı / toplam ağırlık"
          },
          {
            formula: "ΔKG = (w × d) / Δ",
            description: "KG değişimi: Taşınan ağırlık × dikey mesafe / toplam deplasman"
          },
          {
            formula: "KG_yeni = (Δ_eski × KG_eski + w × kg_yük) / Δ_yeni",
            description: "Yük ekleme sonrası yeni KG hesabı"
          }
        ],
        examples: [
          {
            problem: "10.000 ton deplasmanli bir geminin KG'si 8.0 m'dir. 500 ton yük, omurgadan 12 m yüksekliğe alınırsa yeni KG kaç olur?",
            solution: "KG_yeni = (10000 × 8.0 + 500 × 12) / 10500 = (80000 + 6000) / 10500 = 8.19 m"
          },
          {
            problem: "12.000 ton gemi, KG = 7.5 m. 200 ton yük 4 m aşağı taşınırsa ΔKG ve yeni KG?",
            solution: "ΔKG = (200 × 4) / 12000 = -0.067 m. Yeni KG = 7.5 - 0.067 = 7.433 m (azaldı)"
          }
        ],
        keyPoints: [
          "G, geminin tüm ağırlığının toplandığı varsayılan noktadır",
          "KG ne kadar düşükse stabilite o kadar iyidir",
          "Her ağırlık değişikliği G'nin konumunu değiştirir",
          "Kaldırma işlemi başladığı anda yük gemiden ayrılmış sayılır"
        ]
      },
      {
        title: "2.2. Yüzme Merkezi (B) – Center of Buoyancy",
        content: `Yüzme merkezi (B), geminin su altında kalan kısmının geometrik merkezidir ve kaldırma kuvvetinin uygulandığı noktayı temsil eder.

**Tanım ve Fiziksel Anlam**
Geminin su altında kalan kısmının (batmış hacmin) hacimsel ağırlık merkezine yüzme merkezi (B) denir. Bu nokta, yer değiştirilen suyun ağırlık merkezine karşılık gelir.

**Arşimet Prensibi ile İlişki**
Geminin deplasmanı kadar suyu yer değiştirmesi sonucu Arşimet prensibine göre oluşan kaldırma kuvveti (Y) büyüklük olarak geminin ağırlığına eşittir. Bu kuvvet B noktasından yukarı doğru etki eder.

**B Noktasının Konumu**
B noktası, su altı hacminin şekline bağlıdır:
- Dikdörtgen kesitli bir gövdede B, tam ortada olur
- Gerçek gemi formlarında B, su altı geometrisine göre değişir

**KB (Keel-to-B):** Omurgadan yüzme merkezine dikey mesafe
- Deplasman arttıkça genellikle KB artar
- Geminin şekli KB'yi doğrudan etkiler

**B Noktasının Hareketi**
G noktasından farklı olarak, B noktası geminin hareketine göre sürekli değişir:

1. **Gemi yatarsa:** B, yatılan tarafa doğru hareket eder
2. **Trim yaparsa:** B, boyuna yönde hareket eder
3. **Deplasman değişirse:** B, su altı hacminin yeni ağırlık merkezine kayar

**G ve B Arasındaki İlişki**
Stabilitenin temeli, G ve B noktalarının göreli konumlarına dayanır:
- Denge durumunda: G ve B aynı düşey doğru üzerindedir
- Gemi yattığında: B hareket eder, G sabit kalır
- Bu konum farkı, doğrultucu veya devirici moment oluşturur`,
        formulas: [
          {
            formula: "KB ≈ T × (0.5 + 0.1 × Cb)",
            description: "Yaklaşık KB hesabı (T: draft, Cb: block katsayısı)"
          },
          {
            formula: "KB = ∫z × dV / ∇",
            description: "Kesin KB hesabı: Hacimsel integral"
          }
        ],
        keyPoints: [
          "B, su altı hacminin geometrik merkezidir",
          "Kaldırma kuvveti B noktasından yukarı doğru etkir",
          "Gemi yattığında B hareket eder, G sabit kalır",
          "KB değeri hidrostatik tablolardan alınır"
        ]
      },
      {
        title: "2.3. Metasanter (M) – Metacenter",
        content: `Metasanter (M), küçük açılı enine stabilite hesaplarının anahtar noktasıdır ve geminin stabilite karakteristiğini belirleyen kritik bir referans noktasıdır.

**Tanımı ve Oluşumu**
Gemi çok küçük bir açı ile (genellikle 10°'ye kadar) enine yönde yatarsa:
1. Su altında kalan hacim şekil değiştirir
2. Yüzme merkezi B noktası yeni konuma (B₁) gider
3. Yeni kaldırma kuvveti doğrusu, geminin orta düzleminde başlangıçtaki kaldırma doğrusu ile bir noktada kesişir
4. Bu teorik kesişme noktası metasanter (M) olarak tanımlanır

**Metasanterin Özellikleri**
- M noktası, küçük açılar için sabit kabul edilir (10°-15°'ye kadar)
- Büyük açılarda M noktası hareket eder ve hesaplar karmaşıklaşır
- Geminin enine stabilitesi, küçük açılarda esas olarak G ile M arasındaki mesafe (GM) ile ifade edilir

**Enine ve Boyuna Metasanter**
İki tür metasanter vardır:
1. **Enine Metasanter (Mₜ):** Enine yatma için, en çok kullanılan
2. **Boyuna Metasanter (Mₗ):** Trim için, genellikle çok yüksekte

**KM Değerinin Belirlenmesi**
KM (Keel-to-Metacenter) değeri:
- Geminin geometrisine bağlıdır
- Deplasman ile değişir
- Hidrostatik tablolardan alınır
- Gemi daha geniş ise KM genellikle daha büyüktür

**Metasantrin Fiziksel Yorumu**
M noktası, geminin küçük açılarda salındığı pivot noktası gibi düşünülebilir:
- G, M'nin altında ise: Gemi stabil (sarkaç gibi)
- G, M ile çakışık ise: Nötr denge
- G, M'nin üstünde ise: Gemi instabil (ters sarkaç)`,
        formulas: [
          {
            formula: "KM = KB + BM",
            description: "Metasantrik yükseklik: Omurgadan metasantera"
          },
          {
            formula: "BM = I / ∇",
            description: "Metasantrik yarıçap: Su hattı atalet momenti / batmış hacim"
          },
          {
            formula: "I = (L × B³) / 12",
            description: "Dikdörtgen su hattı için atalet momenti"
          }
        ],
        keyPoints: [
          "M, küçük açılı yatmalarda kaldırma doğrularının kesişim noktasıdır",
          "Küçük açılarda M sabit kabul edilir",
          "KM değeri hidrostatik tablolardan alınır",
          "GM = KM - KG formülü stabilitenin temelidir"
        ]
      },
      {
        title: "2.4. Dikey Mesafeler: KG, KB, BM, KM ve GM",
        content: `Stabilite hesaplamalarında kullanılan dikey mesafeler, geminin stabilite karakteristiğini tanımlayan temel parametrelerdir.

**Referans Noktası: Omurga (Keel)**
Tüm dikey mesafeler omurgadan (K) ölçülür. Bu, standart bir referans noktası sağlar ve farklı gemiler arasında karşılaştırma yapılmasına olanak tanır.

**Temel Dikey Mesafeler**

**1. KG (Keel to Gravity)**
- Omurga ile ağırlık merkezi G arasındaki dikey mesafe
- Yükleme durumuna göre değişir
- Moment hesabı ile belirlenir
- Stabilite için kritik parametre

**2. KB (Keel to Buoyancy)**
- Omurga ile yüzme merkezi B arasındaki dikey mesafe
- Geminin şekline ve draftına bağlıdır
- Hidrostatik tablolardan alınır
- Deplasman arttıkça genellikle artar

**3. BM (Buoyancy to Metacenter)**
- B ile metasanter M arasındaki dikey mesafe
- Metasantrik yarıçap olarak da bilinir
- BM = I / ∇ formülü ile hesaplanır
- Geminin genişliği arttıkça BM artar

**4. KM (Keel to Metacenter)**
- Omurga ile metasanter M arasındaki mesafe
- KM = KB + BM
- Hidrostatik tablolardan alınır
- Tasarım parametresi, yükleme ile değişmez (aynı draft için)

**5. GM (Gravity to Metacenter)**
- G ile M arasındaki dikey mesafe
- GM = KM - KG
- Stabilitenin birincil göstergesi
- Pozitif GM = Stabil gemi

**GM'in Önemi ve Yorumu**
GM değeri, geminin küçük açılarda ne kadar stabil olduğunu gösterir:
- **Büyük GM (> 1.5 m):** Sert gemi, hızlı salınım
- **Orta GM (0.5 - 1.5 m):** Normal davranış
- **Küçük GM (0.15 - 0.5 m):** Yumuşak gemi, yavaş salınım
- **Çok küçük GM (< 0.15 m):** Tehlikeli bölge
- **Negatif GM:** Gemi devrilir!`,
        formulas: [
          {
            formula: "KM = KB + BM",
            description: "Metasantrik yükseklik bileşenleri"
          },
          {
            formula: "GM = KM - KG",
            description: "Metasantrik yükseklik (stabilite ölçüsü)"
          },
          {
            formula: "GM_eff = GM - (FSM / Δ)",
            description: "Efektif GM (serbest yüzey etkisi dahil)"
          }
        ],
        examples: [
          {
            problem: "Bir gemi için: KB = 4.2 m, BM = 5.8 m, KG = 7.5 m. GM'i hesaplayın.",
            solution: "KM = KB + BM = 4.2 + 5.8 = 10.0 m. GM = KM - KG = 10.0 - 7.5 = 2.5 m (iyi stabilite)"
          },
          {
            problem: "KM = 8.5 m olan gemide, minimum GM = 0.50 m için maksimum KG ne olabilir?",
            solution: "KG_max = KM - GM_min = 8.5 - 0.50 = 8.0 m"
          }
        ],
        keyPoints: [
          "Tüm dikey mesafeler omurgadan (K) referans alınır",
          "KM sabit (aynı draft için), KG yükleme ile değişir",
          "GM = KM - KG stabilite hesabının temelidir",
          "Pozitif GM zorunlu, minimum değerler IMO tarafından belirlenir"
        ],
        warnings: [
          "GM negatif olursa gemi devrilir!",
          "Çok düşük GM değerleri tehlikeli yükleme durumunu gösterir",
          "Serbest yüzey etkisi GM'i azaltır, hesaplarda dikkate alınmalıdır"
        ]
      }
    ]
  },
  {
    id: "section-3",
    title: "Bölüm 3 – Arşimet Prensibi ve Deplasman",
    icon: "Waves",
    iconColor: "from-blue-500 to-indigo-600",
    description: "Yüzme ve kaldırma kuvvetinin fiziksel temelleri",
    subtopics: [
      {
        title: "3.1. Arşimet Prensibi",
        content: `Arşimet prensibi, gemi stabilitesinin fiziksel temelini oluşturan en önemli doğa yasasıdır.

**Prensip Tanımı**
Bir sıvıya kısmen veya tamamen batırılmış bir cisme, yer değiştirdiği sıvının ağırlığına eşit, yukarı yönlü bir kaldırma kuvveti etkir.

**Matematiksel İfade**
Y = γ × ∇ = ρ × g × ∇

Burada:
- Y: Kaldırma kuvveti (Newton veya ton-kuvvet)
- γ: Sıvının birim hacim ağırlığı (kN/m³)
- ρ: Sıvının yoğunluğu (t/m³)
- g: Yerçekimi ivmesi (9.81 m/s²)
- ∇: Batmış hacim (m³)

**Denge Koşulu**
Yüzen bir cisim için denge durumunda:
- Kaldırma kuvveti = Ağırlık kuvveti
- Y = W = Δ

Bu eşitlik, geminin yüzme dengesinin temelidir.

**Deniz Suyu ve Tatlı Su**
Suyun yoğunluğu stabilite hesaplarında önemlidir:
- **Deniz suyu:** ρ = 1.025 t/m³
- **Tatlı su:** ρ = 1.000 t/m³
- **Brackish su:** 1.000 - 1.025 t/m³ arası

Aynı gemi, tatlı suda daha fazla su çeker (batmış hacim artar) çünkü kaldırma kuvveti için daha fazla hacme ihtiyaç vardır.

**Arşimet Prensibinin Stabilitedeki Rolü**
Kaldırma kuvveti:
- B noktasından yukarı doğru etkir
- Gemi yattığında B hareket ettiği için kuvvet doğrusu değişir
- Bu değişim, doğrultucu veya devirici moment oluşturur
- GM kavramı bu moment değişikliğinden türetilir`,
        formulas: [
          {
            formula: "Y = ρ × g × ∇",
            description: "Kaldırma kuvveti formülü"
          },
          {
            formula: "∇ = Δ / ρ",
            description: "Batmış hacim hesabı"
          },
          {
            formula: "Δ_tatlı = Δ_deniz × (ρ_deniz / ρ_tatlı)",
            description: "Tatlı su dönüşümü"
          }
        ],
        examples: [
          {
            problem: "5000 m³ batmış hacme sahip gemi, deniz suyunda kaç ton deplasana sahiptir?",
            solution: "Δ = ρ × ∇ = 1.025 × 5000 = 5125 ton"
          },
          {
            problem: "10.000 tonluk gemi, deniz suyundan tatlı suya geçtiğinde ek su çekimi ne olur?",
            solution: "∇_deniz = 10000/1.025 = 9756 m³, ∇_tatlı = 10000/1.000 = 10000 m³. Fark = 244 m³ (daha fazla batar)"
          }
        ],
        keyPoints: [
          "Arşimet prensibi gemi yüzmesinin fiziksel temelidir",
          "Kaldırma kuvveti yer değiştirilen suyun ağırlığına eşittir",
          "Suyun yoğunluğu draft ve stabiliteyi etkiler",
          "Tatlı suda gemi daha fazla batar"
        ]
      },
      {
        title: "3.2. Deplasman (Δ) Kavramı",
        content: `Deplasman, gemi mühendisliğinin en temel kavramlarından biridir ve geminin toplam ağırlığını ifade eder.

**Deplasman Tanımı**
Deplasman (Δ), geminin ve üzerindeki her şeyin toplam ağırlığıdır. Arşimet prensibine göre, bu değer aynı zamanda yer değiştirilen suyun ağırlığına eşittir.

**Deplasman Bileşenleri**
Toplam deplasman şu unsurlardan oluşur:

Δ = Δ_lightship + Deadweight (DWT)

**Lightship (Hafif Gemi):**
- Gövde yapısı
- Makine dairesi ve ekipmanlar
- Sabit donanımlar
- Boş tanklar
- Tipik olarak geminin %30-40'ı

**Deadweight (Taşınan Ağırlık):**
- Yük (kargo)
- Yakıt
- Tatlı su
- Balast
- Kumanya
- Personel ve bagajları
- Diğer tüketim malzemeleri

**Deplasman Türleri**
1. **Light Displacement:** Boş gemi ağırlığı (lightship)
2. **Load Displacement:** Tam yüklü deplasman
3. **Ballast Displacement:** Ballastlı deplasman
4. **Design Displacement:** Tasarım deplasmanı

**Hacim Deplasmanı (∇)**
Volume displacement, batmış hacmi ifade eder:
∇ = Δ / ρ (m³)

Bu değer hidrostatik hesaplamalar için kullanılır.

**Deplasmanın Stabilite ile İlişkisi**
Deplasman değişimi stabiliteyi etkiler:
- Deplasman arttıkça → Draft artar → KM değişir
- Deplasman arttıkça → Moment hesabında Δ değeri değişir
- GM = KM - KG formülünde KM, deplasmanla değişir`,
        formulas: [
          {
            formula: "Δ = ∇ × ρ",
            description: "Deplasman = Batmış hacim × Su yoğunluğu"
          },
          {
            formula: "Δ = Lightship + DWT",
            description: "Deplasman = Hafif gemi + Deadweight"
          },
          {
            formula: "DWT = Cargo + Fuel + FW + Ballast + Stores",
            description: "Deadweight bileşenleri"
          }
        ],
        examples: [
          {
            problem: "Lightship = 8000 ton, Yakıt = 1500 ton, Yük = 20000 ton, Balast = 500 ton. Toplam deplasman?",
            solution: "Δ = 8000 + 1500 + 20000 + 500 = 30000 ton"
          }
        ],
        keyPoints: [
          "Deplasman geminin toplam ağırlığıdır",
          "Yer değiştirilen suyun ağırlığına eşittir",
          "Lightship + Deadweight = Toplam Deplasman",
          "Stabilite hesaplarında Δ kritik parametredir"
        ]
      },
      {
        title: "3.3. Draft (Su Çekimi) ve Trim",
        content: `Draft, geminin suya ne kadar battığını gösteren temel ölçüdür ve stabilite hesaplamalarında kritik öneme sahiptir.

**Draft Tanımı**
Draft (T), geminin su hattından omurgasına olan dikey mesafedir. Gemi ne kadar yüklenirse, draft o kadar artar.

**Draft Ölçüm Noktaları**
Gemilerde draft genellikle üç noktadan ölçülür:
- **T_F (Forward Draft):** Baş draftı
- **T_A (Aft Draft):** Kıç draftı
- **T_M (Midship Draft):** Orta kesit draftı

**Ortalama Draft**
Basit ortalama: T_ort = (T_F + T_A) / 2
Gerçek ortalama: T_mean = (T_F + 6×T_M + T_A) / 8 (geminin şekline göre)

**Trim**
Trim, baş ve kıç draftları arasındaki farktır:
Trim = T_A - T_F

**Trim Durumları:**
- **Trim by Stern (Kıça trim):** T_A > T_F (pozitif trim)
- **Trim by Head (Başa trim):** T_F > T_A (negatif trim)
- **Even Keel:** T_A = T_F (sıfır trim)

**Draft İşaretleri (Draft Marks)**
Gemilerin her iki bordosunda ve baş/kıç kesitlerinde draft işaretleri bulunur:
- Metrik: 10 cm aralıklarla
- Imperial: 6 inç aralıklarla
- Romen rakamları veya Arap rakamları ile

**Draft ve Stabilite İlişkisi**
Draft değişimi stabiliteyi doğrudan etkiler:
- Draft arttıkça → KB artar
- Draft arttıkça → BM genellikle azalır (su hattı şekline bağlı)
- Net etki → KM değişir
- Hidrostatik tablolar her draft için KM verir`,
        formulas: [
          {
            formula: "Trim = T_A - T_F",
            description: "Trim hesabı (pozitif = kıça trim)"
          },
          {
            formula: "T_mean = (T_F + 6×T_M + T_A) / 8",
            description: "Gerçek ortalama draft (Simpson kuralı)"
          },
          {
            formula: "ΔDraft = w / TPC",
            description: "Paralel batma hesabı (TPC: ton per cm)"
          }
        ],
        examples: [
          {
            problem: "Baş draft = 6.5 m, Kıç draft = 7.3 m. Ortalama draft ve trim?",
            solution: "T_ort = (6.5 + 7.3) / 2 = 6.9 m. Trim = 7.3 - 6.5 = 0.8 m kıça trim"
          }
        ],
        keyPoints: [
          "Draft su hattından omurgaya mesafedir",
          "Baş, kıç ve orta draft noktaları ölçülür",
          "Trim = Kıç draft - Baş draft",
          "Draft değişimi KM'i ve dolayısıyla GM'i etkiler"
        ]
      },
      {
        title: "3.4. TPC ve Paralel Batma",
        content: `TPC (Tonnes Per Centimetre) kavramı, yükleme operasyonlarında geminin ne kadar batacağını hesaplamak için kullanılır.

**TPC Tanımı**
TPC, geminin draftını 1 cm artırmak için gerekli ağırlıktır (ton cinsinden). Su hattı alanı ile doğrudan ilişkilidir.

**TPC Formülü**
TPC = (A_wp × ρ) / 100

Burada:
- A_wp: Su hattı alanı (m²)
- ρ: Su yoğunluğu (t/m³)
- 100: cm → m dönüşümü

**TPC'nin Özellikleri**
- TPC, geminin draft'ına göre değişir
- Hidrostatik tablolarda her draft için verilir
- Geniş gemilerde TPC daha büyüktür
- Deniz suyunda TPC, tatlı suya göre biraz daha büyüktür

**Paralel Batma (Sinkage)**
Gemi yüklendiğinde veya boşaltıldığında draftı paralel olarak değişir (trim değişmeden):

ΔDraft (cm) = w / TPC

**FWA (Fresh Water Allowance)**
Tatlı su toleransı, geminin deniz suyundan tatlı suya geçerken ne kadar daha batacağını gösterir:

FWA = Δ / (4 × TPC) (cm)

Bu değer yükleme hesaplamalarında önemlidir.

**Dock Water Allowance (DWA)**
Liman suyunun yoğunluğu deniz suyundan farklı olabilir:

DWA = FWA × (1025 - ρ_dock) / 25

Burada ρ_dock: Liman suyunun yoğunluğu`,
        formulas: [
          {
            formula: "TPC = A_wp × ρ / 100",
            description: "TPC hesabı (ton/cm)"
          },
          {
            formula: "ΔDraft = w / TPC",
            description: "Paralel batma hesabı (cm)"
          },
          {
            formula: "FWA = Δ / (4 × TPC)",
            description: "Tatlı su toleransı (cm)"
          },
          {
            formula: "DWA = FWA × (1025 - ρ) / 25",
            description: "Liman suyu toleransı (cm)"
          }
        ],
        examples: [
          {
            problem: "TPC = 25 ton/cm olan gemiye 500 ton yük alınırsa paralel batma kaç cm?",
            solution: "ΔDraft = 500 / 25 = 20 cm"
          },
          {
            problem: "Δ = 20000 ton, TPC = 40 ton/cm. FWA ne kadardır?",
            solution: "FWA = 20000 / (4 × 40) = 125 cm = 1.25 m"
          }
        ],
        keyPoints: [
          "TPC, 1 cm batma için gereken ağırlıktır",
          "Su hattı alanı ile doğru orantılıdır",
          "FWA tatlı su-deniz suyu geçişinde önemlidir",
          "Yükleme planlamasında kritik parametre"
        ]
      }
    ]
  },
  {
    id: "section-4",
    title: "Bölüm 4 – Küçük Açılı Enine Stabilite",
    icon: "Calculator",
    iconColor: "from-blue-500 to-indigo-600",
    description: "GM ve GZ kavramları, küçük açı yaklaşımı",
    subtopics: [
      {
        title: "4.1. Gemi Küçük Bir Açıda Yatarken Kuvvetler",
        content: `Gemi küçük bir açıyla yattığında ortaya çıkan kuvvetler ve momentler, enine stabilite teorisinin temelini oluşturur.

**Denge Durumunda Kuvvetler**
Gemi dik konumdayken:
- Ağırlık kuvveti (W = Δ): G noktasından dikey aşağı
- Kaldırma kuvveti (Y = Δ): B noktasından dikey yukarı
- G ve B aynı düşey doğru üzerinde
- Net moment = 0 (denge)

**Yatmış Konumda Kuvvetler**
Gemi küçük bir açıyla (θ) iskele veya sancak tarafa yattığında:

1. **Ağırlık Kuvveti:** Hala G noktasından dikey aşağıya etkir (G sabit)
2. **Kaldırma Kuvveti:** Yeni yüzme merkezinden (B₁) yukarıya etkir (B hareket etti)
3. **Moment Kolu:** G ve kaldırma doğrusu arasında yatay mesafe oluşur

**Kuvvet Çifti ve Moment**
Bu iki paralel kuvvet (eşit ve zıt yönlü) bir kuvvet çifti oluşturur:
- Kuvvet çiftinin momenti = W × GZ
- GZ: Sağlama kolu (righting arm)

**GZ'nin Geometrik Tanımı**
GZ, G noktasından yeni kaldırma doğrusuna çizilen dikmenin uzunluğudur:
- GZ pozitif → Gemi dik konuma döner (righting moment)
- GZ negatif → Gemi daha fazla yatar (heeling moment)
- GZ = 0 → Denge (stable veya unstable olabilir)

**Metasanter ile İlişki**
Küçük açılarda (θ < 10-15°):
- M noktası sabit kabul edilir
- Kaldırma doğrusu M'den geçer
- GZ = GM × sin(θ) bağıntısı geçerlidir`,
        formulas: [
          {
            formula: "GZ = GM × sin(θ)",
            description: "Küçük açılarda GZ hesabı (θ < 10-15°)"
          },
          {
            formula: "M_R = Δ × GZ",
            description: "Sağlama (doğrultucu) momenti"
          },
          {
            formula: "M_R = Δ × GM × sin(θ)",
            description: "Sağlama momenti (açık formül)"
          }
        ],
        keyPoints: [
          "Yatmada G sabit kalır, B hareket eder",
          "GZ, G'den kaldırma doğrusuna dik mesafedir",
          "Pozitif GZ geminin düzelmesini sağlar",
          "Küçük açılarda M sabit kabul edilir"
        ]
      },
      {
        title: "4.2. GZ ve GM İlişkisi (Küçük Açılar)",
        content: `GM ve GZ arasındaki ilişki, stabilite teorisinin temel taşıdır ve pratik hesaplamalarda yaygın olarak kullanılır.

**Küçük Açı Yaklaşımı**
Küçük yatma açılarında (θ < 10-15°):
- Metasanter M sabit kabul edilir
- Trigonometrik yaklaşımlar geçerlidir
- sin(θ) ≈ θ (radyan) kullanılabilir
- GZ = GM × sin(θ) formülü uygulanır

**Formülün Türetilmesi**
Geometrik olarak:
1. M noktası sabit
2. G, M'nin Δh = GM kadar altında
3. Yatma açısı θ olduğunda
4. G ile kaldırma doğrusu arasındaki yatay mesafe = GM × sin(θ) = GZ

**GZ'nin Fiziksel Anlamı**
GZ değeri (sağlama kolu):
- Geminin kendini doğrultma eğiliminin ölçüsüdür
- GZ ne kadar büyükse, doğrultucu moment o kadar güçlüdür
- Birim: metre (m)

**Sağlama Momenti**
Righting moment (M_R):
M_R = Δ × GZ = Δ × GM × sin(θ)

Burada:
- M_R: Sağlama momenti (t·m veya kN·m)
- Δ: Deplasman (ton)
- GZ: Sağlama kolu (m)
- GM: Metasantrik yükseklik (m)
- θ: Yatma açısı

**GM'in Kritik Değerleri**
- GM > 0: Stabil gemi (pozitif sağlama momenti)
- GM = 0: Nötr denge (moment yok)
- GM < 0: İnstabil gemi (devirici moment)

**Minimum GM Gereksinimleri**
IMO tarafından belirlenen tipik minimum GM değerleri:
- Genel kargo gemileri: GM ≥ 0.15 m
- Tahıl yüklü gemiler: GM_düzeltilmiş ≥ 0.30 m
- Yolcu gemileri: Özel kriterler uygulanır`,
        formulas: [
          {
            formula: "GZ = GM × sin(θ)",
            description: "Küçük açılarda temel GZ-GM ilişkisi"
          },
          {
            formula: "M_R = Δ × GM × sin(θ)",
            description: "Sağlama momenti (tam formül)"
          },
          {
            formula: "θ (rad) ≈ tan(θ) ≈ sin(θ)",
            description: "Küçük açı yaklaşımı (θ < 10°)"
          }
        ],
        examples: [
          {
            problem: "Δ = 15000 ton, GM = 1.2 m, θ = 5°. Sağlama momentini hesaplayın.",
            solution: "GZ = 1.2 × sin(5°) = 1.2 × 0.0872 = 0.105 m. M_R = 15000 × 0.105 = 1575 t·m"
          },
          {
            problem: "GM = 0.8 m, θ = 10° için GZ?",
            solution: "GZ = 0.8 × sin(10°) = 0.8 × 0.1736 = 0.139 m"
          }
        ],
        keyPoints: [
          "GZ = GM × sin(θ) küçük açılar için geçerlidir",
          "GM büyükse GZ de büyük olur (daha güçlü doğrultma)",
          "Sağlama momenti M_R = Δ × GZ",
          "Minimum GM değerleri IMO tarafından belirlenir"
        ]
      },
      {
        title: "4.3. GM'in Fiziksel Yorumu ve Stabilite Durumları",
        content: `GM değeri, geminin stabilite karakteristiğini doğrudan belirler. GM'in işaretine göre üç farklı denge durumu tanımlanır.

**Pozitif Stabilite (GM > 0)**
G noktası, M'nin altındadır. Bu durumda:
- Gemi yattığında geri döndürücü (righting) moment oluşur
- Dış etki kalktığında gemi dik konuma döner
- Normal ve güvenli durum
- Sarkaç analojisi: Alt ağırlıklı sarkaç

**Fiziksel Açıklama:**
Gemi yattığında B noktası yatılan tarafa kayar. G, M'nin altında olduğu için, kaldırma kuvveti geminin üst tarafından geçer ve geminin dikilmesini sağlayan bir moment oluşturur.

**Nötr Denge (GM = 0)**
G ile M çakışıktır. Bu durumda:
- Gemi, herhangi bir açıda dengede kalabilir
- Ne döndürücü ne de devirici moment vardır
- Gemi yatık kalır (rastgele konumda)
- Pratik açıdan tehlikeli ve istenmeyen durum

**Negatif Stabilite (GM < 0)**
G noktası, M'nin üzerindedir. Bu durumda:
- Gemi eğildiğinde devirmeye çalışan (heeling) moment oluşur
- Gemi daha fazla yatmaya eğilimlidir
- Çok tehlikeli, devrilme riski yüksek
- Ters sarkaç analojisi

**Loll Durumu**
Negatif GM olan gemi, belirli bir açıda dengeye gelebilir (loll açısı). Bu:
- Geçici bir denge durumudur
- Çok tehlikelidir
- Ani hareket veya ek yük geminin devrilmesine yol açabilir

**Sert ve Yumuşak Gemi Kavramları**
GM değerinin büyüklüğü geminin davranışını etkiler:

**Büyük GM (Sert Gemi - Stiff Ship):**
- GM > 1.5 m (tipik)
- Hızlı salınım (kısa rulo periyodu)
- Yüksek ivmeler
- Mürettebat ve yük için rahatsız edici
- Yapısal yükler artabilir

**Küçük GM (Yumuşak Gemi - Tender Ship):**
- GM < 0.5 m (tipik)
- Yavaş salınım (uzun rulo periyodu)
- Daha konforlu ama dikkatli olunmalı
- Devrilme riski nispeten yüksek

**Optimum GM:**
- Genellikle 0.5 - 1.5 m aralığında
- Güvenlik ve konfor dengesi
- Gemi tipine göre değişir`,
        keyPoints: [
          "GM > 0: Stabil (pozitif sağlama momenti)",
          "GM = 0: Nötr denge (tehlikeli)",
          "GM < 0: İnstabil (devrilme riski)",
          "Çok büyük GM sert gemi, çok küçük GM yumuşak gemi yaratır"
        ],
        warnings: [
          "Negatif GM çok tehlikelidir - gemi devrilebilir!",
          "Nötr denge (GM=0) rastgele yatmaya neden olur",
          "Loll durumunda gemi görünürde dengede olsa da risk altındadır"
        ],
        practicalTips: [
          "Her yüklemede GM'i kontrol edin",
          "Minimum GM kriterlerini daima sağlayın",
          "Sert gemi şikayetlerinde balast düzenlemesi yapın",
          "Yumuşak gemi durumunda alt tanklara balast alın"
        ]
      }
    ]
  },
  {
    id: "section-5",
    title: "Bölüm 5 – Sert ve Yumuşak Gemi, Rulo Periyodu",
    icon: "Ship",
    iconColor: "from-blue-500 to-indigo-600",
    description: "GM'in gemi davranışına etkisi ve rulo periyodu",
    subtopics: [
      {
        title: "5.1. Sert Gemi (Stiff Ship)",
        content: `Sert gemi, yüksek GM değerine sahip olan ve hızlı, güçlü doğrulma eğilimi gösteren gemidir.

**Tanım ve Özellikler**
Sert gemilerde GM büyüktür (tipik olarak > 1.5 m):
- GZ, küçük açılarda bile hızlı büyür
- Gemi, yatma açısını çok kısa sürede toparlar
- Rulo periyodu kısadır (hızlı salınım)
- Yüksek doğrultucu moment

**Sert Geminin Avantajları**
1. Yüksek güvenlik marjı
2. Devrilme riski düşük
3. Büyük dış etkilere karşı direnç

**Sert Geminin Dezavantajları**
1. **Konfor Sorunları:**
   - Mürettebat ve yolcular için rahatsız edici salınım
   - Deniz tutması artabilir
   - Çalışma verimliliği düşer

2. **Yük Hasarı:**
   - Yükler daha yüksek ivmelere maruz kalır
   - Kaymaya eğilimli yükler tehlike altında
   - Hassas kargolar zarar görebilir

3. **Yapısal Yükler:**
   - Gövde üzerindeki gerilmeler artar
   - Tekrarlanan hızlı salınımlar yorgunluğa neden olur
   - Bağlama sistemleri zorlanır

**Neden Sert Gemi Oluşur?**
- Düşük KG (ağır yükler altta)
- Yüksek BM (geniş gemi formu)
- Boş veya hafif yüklü durum
- Alt tanklara alınan ağır balast`,
        keyPoints: [
          "Büyük GM = Sert gemi = Kısa rulo periyodu",
          "Güvenli ama konfor açısından sorunlu olabilir",
          "Yük hasarı ve yapısal yükler artabilir",
          "Üst tanklara balast alarak yumuşatılabilir"
        ],
        practicalTips: [
          "Sert gemi şikayetlerinde üst tanklara balast alın",
          "Yükleri mümkünse biraz daha yükseğe yerleştirin",
          "Hassas kargolar için ek bağlama önlemleri alın",
          "Mürettebat için anti-deniz tutması önlemleri düşünün"
        ]
      },
      {
        title: "5.2. Yumuşak Gemi (Tender Ship)",
        content: `Yumuşak gemi, düşük GM değerine sahip olan ve yavaş, zayıf doğrulma eğilimi gösteren gemidir.

**Tanım ve Özellikler**
Yumuşak gemilerde GM küçüktür (tipik olarak < 0.5 m):
- GZ küçük açılarda yavaş artar
- Gemi yatma açısını çok daha yavaş toparlar
- Rulo periyodu uzundur (yavaş salınım)
- Düşük doğrultucu moment

**Yumuşak Geminin Avantajları**
1. Daha konforlu seyir
2. Yükler üzerinde düşük ivme
3. Yapısal yükler azalır

**Yumuşak Geminin Dezavantajları**
1. **Güvenlik Riski:**
   - GM çok küçükse devrilme riski artar
   - Ani dış etkilere karşı zayıf direnç
   - Yük kayması tehlikeli olabilir

2. **Operasyonel Sorunlar:**
   - Büyük yatma açıları oluşabilir
   - Güverte üstü çalışmalar zorlaşır
   - Manevra kabiliyeti azalabilir

3. **Kritik Durumlar:**
   - Dalga rezonansında büyük salınımlar
   - Ağır havada parametrik rulo riski
   - GM sınırda ise küçük değişiklikler kritik olabilir

**Neden Yumuşak Gemi Oluşur?**
- Yüksek KG (ağır yükler üstte)
- Düşük BM (dar gemi formu)
- Güverte üstü yük (konteyner, timber)
- Üst tanklarda sıvı
- Serbest yüzey etkisi`,
        warnings: [
          "Çok düşük GM tehlikelidir - minimum değerleri kontrol edin",
          "Serbest yüzey etkisi GM'i daha da düşürür",
          "Parametrik rulo riski özellikle uzun rulo periyodlu gemilerde yüksektir"
        ],
        keyPoints: [
          "Küçük GM = Yumuşak gemi = Uzun rulo periyodu",
          "Konforlu ama güvenlik açısından riskli olabilir",
          "Minimum GM değerleri mutlaka sağlanmalı",
          "Alt tanklara balast alarak sertleştirilebilir"
        ],
        practicalTips: [
          "Yumuşak gemi durumunda alt tanklara balast alın",
          "Yükleri mümkünse daha aşağıya yerleştirin",
          "Serbest yüzey etkisini minimize edin",
          "Ağır havada ekstra dikkatli olun"
        ]
      },
      {
        title: "5.3. Rulo Periyodu ve GM İlişkisi",
        content: `Rulo periyodu, geminin bir tam salınım yapması için geçen süredir ve GM ile doğrudan ilişkilidir.

**Rulo Periyodu Tanımı**
Rulo periyodu (T), geminin bir tam enine salınım (örn. sağa-sola-sağa) yapması için geçen süredir. Birim: saniye (s).

**Rulo Periyodu Formülü**
T = 2π × k / √(g × GM)

Veya basitleştirilmiş formül:
T ≈ C × B / √GM

Burada:
- T: Rulo periyodu (s)
- k: Geminin enine atalet yarıçapı (m)
- g: Yerçekimi ivmesi (9.81 m/s²)
- GM: Metasantrik yükseklik (m)
- C: Deneysel katsayı (0.7 - 0.9, gemi tipine bağlı)
- B: Geminin genişliği (m)

**GM-T İlişkisi**
- GM arttıkça T küçülür (sert gemi, hızlı salınım)
- GM azaldıkça T büyür (yumuşak gemi, yavaş salınım)
- Bu ilişki, T ölçülerek GM tahmini için de kullanılır

**Rulo Periyodunun Pratik Önemi**
1. **Konfor:** T = 15-20 s arası genellikle konforlu kabul edilir
2. **Güvenlik:** Çok kısa T (< 8 s) güvenli ama konforsuz
3. **Dalga Rezonansı:** T ≈ dalga periyodu olursa büyük salınımlar

**Periyot Ölçümü ile GM Tahmini**
Rulo periyodu ölçülerek GM tahmin edilebilir:
GM ≈ (C × B / T)²

Bu yöntem pratikte yaygın olarak kullanılır:
1. Gemi sakin suda sallandırılır
2. 10-20 salınımın süresi ölçülür
3. Ortalama periyot bulunur
4. GM hesaplanır`,
        formulas: [
          {
            formula: "T = 2π × k / √(g × GM)",
            description: "Kesin rulo periyodu formülü"
          },
          {
            formula: "T ≈ C × B / √GM",
            description: "Pratik rulo periyodu formülü (C ≈ 0.7-0.9)"
          },
          {
            formula: "GM ≈ (C × B / T)²",
            description: "Periyottan GM tahmini"
          }
        ],
        examples: [
          {
            problem: "Genişlik B = 20 m, GM = 1.0 m, C = 0.8. Rulo periyodunu bulun.",
            solution: "T = 0.8 × 20 / √1.0 = 16 / 1 = 16 saniye"
          },
          {
            problem: "Ölçülen T = 12 s, B = 25 m, C = 0.75. GM tahmini?",
            solution: "GM = (0.75 × 25 / 12)² = (18.75 / 12)² = 1.5625² ≈ 2.44 m"
          }
        ],
        keyPoints: [
          "T, GM'in karekökü ile ters orantılıdır",
          "Büyük GM = Kısa periyot, Küçük GM = Uzun periyot",
          "Periyot ölçümü ile GM tahmin edilebilir",
          "Dalga rezonansından kaçınmak için periyot önemlidir"
        ]
      }
    ]
  }
];

// Export helper function to get topic by ID
export function getTopicById(id: string): StabilityTopic | undefined {
  return stabilityTopicsData.find(topic => topic.id === id);
}

// Export helper function to get all topic IDs
export function getAllTopicIds(): string[] {
  return stabilityTopicsData.map(topic => topic.id);
}
