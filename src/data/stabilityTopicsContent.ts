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
  },
  {
    id: "section-6",
    title: "Bölüm 6 – GZ Eğrileri ve Büyük Açılı Stabilite",
    icon: "Calculator",
    iconColor: "from-emerald-500 to-teal-600",
    description: "Büyük açılı stabilite analizi ve GZ eğrisi yorumu",
    subtopics: [
      {
        title: "6.1. GZ Eğrisi Nedir?",
        content: `GZ eğrisi, gemi stabilitesinin en kapsamlı göstergesidir ve geminin tüm yatma açılarındaki doğrultma kabiliyetini grafiksel olarak gösterir.

**Tanım**
GZ eğrisi (Statik Stabilite Eğrisi veya Righting Arm Curve), geminin farklı yatma açılarındaki (0° - 90° veya daha fazla) GZ değerlerinin grafiğidir. Yatay eksende yatma açısı (heel angle, θ), dikey eksende GZ değeri (metre cinsinden) yer alır.

**Neden GZ Eğrisi Gerekli?**
Küçük açılarda (0-15°) GZ = GM × sin(θ) formülü geçerlidir. Ancak büyük açılarda:
- Metasanter (M) sabit değildir, hareket eder
- Kaldırma merkezinin (B) hareketi karmaşıklaşır
- Güverte batması, borda çıkışları vb. geometri değişir
- Bu nedenle GZ, her açı için ayrı hesaplanır

**GZ Eğrisinin Hesaplanması**
GZ eğrisi, Cross Curves of Stability (KN eğrileri) kullanılarak hesaplanır:
1. Farklı yatma açıları için KN değerleri hidrostatik verilerden alınır
2. GZ = KN - KG × sin(θ) formülü uygulanır
3. Her açı için GZ değeri grafiklenir

**GZ Eğrisinin Şekli**
Tipik bir GZ eğrisi:
- 0°'de başlar (GZ = 0)
- Küçük açılarda lineer yükselir (GM ile orantılı)
- Bir maksimuma ulaşır (GZ_max)
- Daha büyük açılarda azalmaya başlar
- Bir noktada sıfırı keser (Vanishing Angle)

**Önemli Noktalar**
1. **Başlangıç Eğimi:** 0°'deki tanjant GM'e eşittir
2. **Maksimum GZ:** Geminin maksimum doğrultma kapasitesi
3. **Maksimum GZ Açısı:** En güçlü direnç noktası
4. **Yok Olma Açısı:** GZ'nin sıfıra döndüğü açı`,
        formulas: [
          {
            formula: "GZ = KN - KG × sin(θ)",
            description: "GZ hesabı (Cross Curves yöntemi)"
          },
          {
            formula: "tan(eğim)_θ=0 = GM",
            description: "GZ eğrisinin 0°'deki eğimi GM'e eşittir"
          },
          {
            formula: "A = ∫₀^θ GZ × dθ",
            description: "Dinamik stabilite (GZ eğrisi altındaki alan)"
          }
        ],
        keyPoints: [
          "GZ eğrisi büyük açılı stabiliteyi gösterir",
          "0°'deki eğim GM'e eşittir",
          "Maksimum GZ değeri ve açısı kritik parametrelerdir",
          "Yok olma açısı geminin devrilme sınırını gösterir"
        ]
      },
      {
        title: "6.2. GZ Eğrisinin Yorumlanması",
        content: `GZ eğrisi, geminin stabilite durumu hakkında birçok kritik bilgi sağlar.

**Temel Yorumlama Prensipleri**

**1. Başlangıç GM (Initial GM)**
GZ eğrisinin 0° civarındaki eğimi, GM değerini verir:
- Dik eğim = Büyük GM = Sert gemi
- Yatık eğim = Küçük GM = Yumuşak gemi

**2. Maksimum GZ (GZ_max)**
- GZ'nin ulaştığı en yüksek değer
- Geminin en güçlü doğrultma momentini gösterir
- Tipik olarak 25° - 40° arasında oluşur
- IMO kriteri: GZ_max ≥ 0.20 m (25° veya ötesinde)

**3. Maksimum GZ Açısı (θ_max)**
- GZ_max'ın oluştuğu açı
- Bu açıya kadar gemi güçlü direnç gösterir
- IMO kriteri: θ_max ≥ 25°

**4. Yok Olma Açısı (Angle of Vanishing Stability)**
- GZ'nin tekrar sıfıra düştüğü açı
- Bu açının ötesinde gemi devrilir
- Daha büyük = Daha güvenli
- Tipik değer: 50° - 80°

**5. GZ Eğrisi Altındaki Alan**
Dinamik stabiliteyi temsil eder:
- 0° - 30° arası alan: Kısa süreli dış etkilere direnç
- 0° - 40° arası alan: Uzun süreli etkilere direnç
- Daha geniş alan = Daha iyi stabilite rezervi

**GZ Eğrisi Şekilleri**
1. **İdeal Eğri:** Yüksek başlangıç eğimi, geniş maksimum platö, geç yok olma
2. **Sert Gemi:** Çok dik başlangıç, erken ve yüksek maksimum
3. **Yumuşak Gemi:** Yatık başlangıç, düşük maksimum
4. **Tehlikeli Durum:** Çok düşük maksimum, erken yok olma`,
        examples: [
          {
            problem: "GZ eğrisinde: θ=10°'de GZ=0.18m, θ=30°'de GZ=0.45m, θ=60°'de GZ=0.15m, θ=70°'de GZ=0. Bu gemiyi yorumlayın.",
            solution: "GM ≈ 0.18/sin(10°) = 1.04 m (iyi). GZ_max yaklaşık 30° civarında 0.45 m (yeterli). Yok olma açısı 70° (yeterli). Genel olarak iyi stabilite."
          }
        ],
        keyPoints: [
          "Başlangıç eğimi GM'i gösterir",
          "GZ_max ve θ_max kritik IMO kriterleridir",
          "Yok olma açısı devrilme sınırını belirler",
          "Eğri altı alan dinamik stabiliteyi gösterir"
        ],
        practicalTips: [
          "Her yükleme durumu için GZ eğrisini kontrol edin",
          "Minimum IMO kriterlerini sağladığından emin olun",
          "Yok olma açısının yeterli olduğunu doğrulayın",
          "Eğri şeklinin güvenli olduğunu görsel olarak değerlendirin"
        ]
      },
      {
        title: "6.3. Dinamik Stabilite ve Enerji Yaklaşımı",
        content: `Dinamik stabilite, geminin dış etkilere karşı direncini enerji bazında değerlendirir.

**Statik vs Dinamik Stabilite**

**Statik Stabilite:**
- Sabit bir açıda geminin dengesini inceler
- GZ değeri tek bir noktada değerlendirilir
- Yavaş gelişen dış etkiler için uygundur

**Dinamik Stabilite:**
- Geminin salınım enerjisini inceler
- GZ eğrisi altındaki alan ile ölçülür
- Ani dış etkiler (dalga, rüzgar, manevra) için geçerlidir

**Enerji Yaklaşımı**
Gemi yattığında:
- Potansiyel enerji değişimi olur
- Bu enerji kinetik enerjiye dönüşür (salınım)
- GZ × dθ integrali yapılan/alınan işi verir

**Dinamik Stabilite Hesabı**
D.S. = Δ × ∫₀^θ GZ × dθ

Bu integral, GZ eğrisinin altında kalan alandır.

**Heeling Moment ve Denge**
Dış bir heeling moment uygulandığında:
1. Gemi, heeling moment = righting moment olana kadar yatar
2. Bu, GZ eğrisi ile heeling arm eğrisinin kesiştiği noktadır
3. Statik denge açısı bu noktada oluşur

**Dinamik Yatma Açısı**
Ani bir etki (dalga vb.) uygulandığında:
- Gemi statik denge açısının ötesine geçer
- GZ eğrisi altı alan, heeling moment alanına eşit olana kadar yatar
- Bu, dinamik yatma açısıdır ve genellikle statik açıdan büyüktür

**Rüzgar Heeling ve Dinamik Stabilite**
IMO Weather Criterion, dinamik stabilite konseptini kullanır:
- Rüzgar heeling moment eğrisi çizilir
- GZ eğrisi ile kesişim noktaları bulunur
- Alan oranları (A1/A2) kontrol edilir`,
        formulas: [
          {
            formula: "D.S. = Δ × ∫₀^θ GZ × dθ",
            description: "Dinamik stabilite formülü"
          },
          {
            formula: "A1 ≥ A2",
            description: "IMO Weather Criterion alan karşılaştırması"
          },
          {
            formula: "Heeling arm = (P × cos²θ × A × h) / (1000 × g × Δ)",
            description: "Rüzgar heeling arm hesabı"
          }
        ],
        keyPoints: [
          "Dinamik stabilite GZ eğrisi altındaki alandır",
          "Ani etkiler dinamik yatma açısına neden olur",
          "IMO Weather Criterion alan oranlarını kontrol eder",
          "Statik açı + güvenlik marjı = Dinamik değerlendirme"
        ],
        warnings: [
          "Ani rüzgar değişiklikleri veya dalga etkileri dinamik yatma yaratır",
          "Statik denge açısı güvenli görünse bile dinamik etki tehlikeli olabilir",
          "Alan oranları yetersizse gemi devrilebilir"
        ]
      },
      {
        title: "6.4. Cross Curves (KN Eğrileri)",
        content: `Cross Curves of Stability, GZ hesaplamasının temelini oluşturan hidrostatik verilerdir.

**KN Değeri Nedir?**
KN, omurgadan (K) kaldırma doğrusuna çizilen dikmenin uzunluğudur. Farklı yatma açıları ve deplasmanlar için önceden hesaplanır.

**KN ve GZ İlişkisi**
GZ = KN - KG × sin(θ)

Bu formül sayesinde:
1. KN değerleri sabit (gemi geometrisine bağlı)
2. Sadece KG bilindiğinde GZ hesaplanabilir
3. Farklı yükleme durumları için hızlı hesaplama

**Cross Curves Tablosu**
Tipik bir Cross Curves tablosu:
- Satırlar: Farklı deplasmanlar
- Sütunlar: Farklı yatma açıları (10°, 20°, 30°, 45°, 60°, 75°, 90°)
- Değerler: KN (metre)

**Cross Curves Grafiği**
Grafikte:
- Yatay eksen: Deplasman
- Dikey eksen: KN değeri
- Her açı için ayrı bir eğri

**Kullanım Prosedürü**
1. Mevcut deplasmanı belirle
2. Her açı için KN değerlerini tablodan/grafikten al
3. GZ = KN - KG × sin(θ) hesapla
4. GZ değerlerini grafiklendirerek GZ eğrisini çiz

**KN Değerlerinin Özellikleri**
- Sadece gemi geometrisine bağlıdır
- Yükleme durumundan bağımsızdır
- Gemi inşa edilirken bir kez hesaplanır
- Stabilite kitapçığında verilir`,
        formulas: [
          {
            formula: "GZ = KN - KG × sin(θ)",
            description: "GZ hesabı (Cross Curves'ten)"
          },
          {
            formula: "KN = KB × sin(θ) + BM × sin(θ) × cos(θ)",
            description: "Yaklaşık KN formülü (küçük açılar)"
          }
        ],
        examples: [
          {
            problem: "Deplasman = 15000 ton için: KN(30°) = 2.5 m. KG = 7.5 m ise 30°'deki GZ?",
            solution: "GZ = KN - KG × sin(θ) = 2.5 - 7.5 × sin(30°) = 2.5 - 7.5 × 0.5 = 2.5 - 3.75 = -1.25 m (Negatif! İnstabil)"
          },
          {
            problem: "Aynı gemi, KG = 5.5 m ile yüklenirse 30°'deki GZ?",
            solution: "GZ = 2.5 - 5.5 × sin(30°) = 2.5 - 2.75 = -0.25 m (Hala negatif ama daha iyi)"
          }
        ],
        keyPoints: [
          "KN değerleri sadece gemi geometrisine bağlıdır",
          "GZ = KN - KG × sin(θ) temel hesap formülüdür",
          "Cross Curves stabilite kitapçığında bulunur",
          "KG ne kadar düşükse GZ o kadar büyük olur"
        ]
      }
    ]
  },
  {
    id: "section-7",
    title: "Bölüm 7 – Serbest Yüzey Etkisi (Free Surface Effect)",
    icon: "Waves",
    iconColor: "from-cyan-500 to-blue-600",
    description: "Tanklardaki sıvıların stabiliteye etkisi",
    subtopics: [
      {
        title: "7.1. Serbest Yüzey Etkisinin Tanımı",
        content: `Serbest yüzey etkisi (Free Surface Effect - FSE), kısmen dolu tanklardaki sıvıların gemi stabilitesini olumsuz etkilemesidir.

**Temel Kavram**
Bir tank tam dolu veya tamamen boş ise içindeki sıvı sabit bir ağırlık gibi davranır. Ancak tank kısmen dolu ise:
- Gemi yattığında sıvı yüzeyi yatay kalmaya çalışır
- Sıvı, yatılan tarafa doğru akar
- Bu akış, geminin ağırlık merkezini (G) yatılan tarafa kaydırır
- Sonuç olarak doğrultucu moment azalır

**Fiziksel Mekanizma**
1. Gemi θ açısıyla yatar
2. Tank içindeki sıvı yüzeyi yatay kalır
3. Sıvının ağırlık merkezi (g) yatılan tarafa kayar
4. Geminin toplam ağırlık merkezi (G) de kayar
5. GZ (sağlama kolu) azalır

**Sanal KG Artışı (Virtual Rise of G)**
Serbest yüzey etkisi, G'nin sanal olarak yükselmiş gibi davrandığı bir modelle ifade edilir:
- GG₁ = FSM / Δ (G'nin sanal yükselişi)
- GM_eff = GM - GG₁ (Efektif GM)

Bu yaklaşım, gerçekte G'nin yükselmediğini ancak stabilitenin sanki G yükselmiş gibi azaldığını gösterir.

**Serbest Yüzey Momenti (FSM)**
FSM = ρₜ × i
- ρₜ: Tank içindeki sıvının yoğunluğu (t/m³)
- i: Tank sıvı yüzeyinin atalet momenti (m⁴)

Dikdörtgen tank için:
i = (l × b³) / 12
- l: Tankın boyuna uzunluğu
- b: Tankın enine genişliği

**Kritik Nokta**
Serbest yüzey etkisi, tankın doluluk oranından bağımsızdır (yaklaşık olarak). İster %10 dolu, ister %90 dolu olsun, etki benzerdir!`,
        formulas: [
          {
            formula: "FSM = ρₜ × i",
            description: "Serbest yüzey momenti (ton·m)"
          },
          {
            formula: "i = (l × b³) / 12",
            description: "Dikdörtgen yüzeyin atalet momenti (m⁴)"
          },
          {
            formula: "GG₁ = FSM / Δ",
            description: "G'nin sanal yükselişi (m)"
          },
          {
            formula: "GM_eff = GM - Σ(FSM) / Δ",
            description: "Efektif (düzeltilmiş) GM"
          }
        ],
        examples: [
          {
            problem: "Tank boyutları: 20m × 10m. Deniz suyu (ρ=1.025) ile kısmen dolu. Δ=15000 ton, GM=1.5m. FSM ve GM_eff?",
            solution: "i = 20 × 10³ / 12 = 1666.7 m⁴. FSM = 1.025 × 1666.7 = 1708.3 t·m. GG₁ = 1708.3 / 15000 = 0.114 m. GM_eff = 1.5 - 0.114 = 1.386 m"
          }
        ],
        keyPoints: [
          "Kısmen dolu tanklar GM'i düşürür",
          "Etki tankın genişliğinin küpü ile orantılıdır",
          "Doluluk oranı (yaklaşık) etkiyi değiştirmez",
          "GM_eff = GM - FSM/Δ formülü kullanılır"
        ],
        warnings: [
          "Geniş tanklar çok büyük serbest yüzey etkisi yaratır",
          "Birden fazla kısmen dolu tank etkiyi katlar",
          "Minimum GM hesaplarında serbest yüzey düzeltmesi zorunludur"
        ]
      },
      {
        title: "7.2. Serbest Yüzey Etkisini Azaltma Yöntemleri",
        content: `Serbest yüzey etkisi, çeşitli tasarım ve operasyonel önlemlerle azaltılabilir.

**Tasarım Önlemleri**

**1. Tank Bölmelendirmesi**
En etkili yöntem, geniş tankları boyuna ara bölmelerle (longitudinal bulkhead) bölmektir:
- Orijinal genişlik b ise, 2 bölme sonrası her parça b/2 genişliğinde
- i = l × (b/2)³ / 12 = l × b³ / (12 × 8) = orijinal i / 8
- 2 bölme = Toplam FSM 1/4'e düşer!

**n adet eşit parçaya bölünürse:**
Toplam FSM = Orijinal FSM / n²

**2. Tank Şekli Optimizasyonu**
- Kare yerine dikdörtgen kesit (enine dar)
- Geminin orta hattına yakın yerleşim
- V veya trapez şekilli tanklar

**Operasyonel Önlemler**

**1. Tankları Tam Doldurun veya Boşaltın**
- Tam dolu tank → Serbest yüzey yok
- Boş tank → Serbest yüzey yok
- Kısmen dolu tank sayısını minimize edin

**2. Derin Tankları Tercih Edin**
- Geniş sığ tank yerine dar derin tank kullanın
- Genişlik (b) etkiyi en çok artıran parametredir

**3. Sıralı Tank Kullanımı**
- Birden fazla tank yerine tek bir tankı tam kullanın
- Tüketim için sıralı sistem uygulayın:
  * Bir tankı tamamen tükettikten sonra diğerine geçin

**4. Transfer Pompaları**
- Gerektiğinde sıvıları transfer ederek tam doluluk sağlayın
- Dengeleme amacıyla stratejik transferler yapın

**Dikkat Edilecek Noktalar**
- Yakıt tankları seyir boyunca kısmen dolu olur (kaçınılmaz)
- Balast operasyonlarında geçiş süreleri
- Yük tankları (tankerler) için özel dikkat`,
        formulas: [
          {
            formula: "FSM_bölünmüş = FSM_orijinal / n²",
            description: "n adet boyuna bölme sonrası toplam FSM"
          },
          {
            formula: "FSM_2_bölme = FSM / 4",
            description: "2 bölme ile toplam FSM 1/4'e düşer"
          }
        ],
        examples: [
          {
            problem: "Tek bir tank FSM = 2000 t·m. Ortadan boyuna bölme yapılırsa yeni toplam FSM?",
            solution: "2 bölme = n² = 4. FSM_yeni = 2000 / 4 = 500 t·m (4 kat azalma!)"
          }
        ],
        keyPoints: [
          "Boyuna bölme FSM'yi n² oranında azaltır",
          "Tankları tam doldurun veya tamamen boşaltın",
          "Geniş tanklar yerine dar derin tanklar tercih edin",
          "Sıralı tank kullanımı uygulayın"
        ],
        practicalTips: [
          "Yükleme planı yaparken minimum kısmen dolu tank hedefleyin",
          "Yakıt tüketimini sıralı tank sistemiyle planlayın",
          "Balast operasyonlarını GM üzerindeki etkiyi düşünerek yapın",
          "Her durumda GM_eff değerini kontrol edin"
        ]
      },
      {
        title: "7.3. Serbest Yüzey Düzeltmesi Hesaplamaları",
        content: `Serbest yüzey düzeltmesi, tüm stabilite hesaplamalarında uygulanması gereken kritik bir düzeltmedir.

**Genel Hesap Prosedürü**

**Adım 1: Her Tank İçin FSM Hesabı**
Her kısmen dolu tank için:
FSM = ρₜ × i

Atalet momenti (i) hesabı:
- Dikdörtgen tank: i = l × b³ / 12
- Trapez tank: i = l × (b₁³ + b₂³ + b₁²b₂ + b₁b₂²) / 48
- Düzensiz şekil: Stabilite kitapçığındaki tablolardan

**Adım 2: Toplam FSM**
Tüm kısmen dolu tankların FSM değerleri toplanır:
ΣFSM = FSM₁ + FSM₂ + FSM₃ + ...

**Adım 3: G'nin Sanal Yükselişi**
GG₁ = ΣFSM / Δ

**Adım 4: Efektif GM**
GM_eff = GM_solid - GG₁ = GM_solid - ΣFSM / Δ

**Önemli Notlar**
1. **GM_solid:** Serbest yüzey yok sayılarak hesaplanan GM
2. **GM_fluid (GM_eff):** Serbest yüzey düzeltmesi yapılmış GM
3. IMO kriterleri her zaman GM_eff değerini kontrol eder

**Örnek Hesap Tablosu**

| Tank | Boyut (l×b) | ρ (t/m³) | i (m⁴) | FSM (t·m) |
|------|-------------|----------|--------|-----------|
| No.1 DB | 15×8 | 1.025 | 640 | 656 |
| No.2 DB | 15×8 | 1.025 | 640 | 656 |
| FO Tank | 10×6 | 0.95 | 180 | 171 |
| **Toplam** | | | | **1483** |

Δ = 12000 ton, GM_solid = 1.20 m ise:
GG₁ = 1483 / 12000 = 0.124 m
GM_eff = 1.20 - 0.124 = 1.076 m`,
        formulas: [
          {
            formula: "GM_eff = GM_solid - ΣFSM / Δ",
            description: "Efektif GM hesabı"
          },
          {
            formula: "i_dikdörtgen = l × b³ / 12",
            description: "Dikdörtgen tank atalet momenti"
          },
          {
            formula: "FSM = ρₜ × l × b³ / 12",
            description: "Dikdörtgen tank için FSM (birleşik formül)"
          }
        ],
        examples: [
          {
            problem: "Gemi: Δ=20000 ton, GM_solid=1.5m. Tanklar: Tank A (20×12m, HFO ρ=0.95), Tank B (15×10m, SW ρ=1.025). GM_eff?",
            solution: "i_A = 20×12³/12 = 2880 m⁴, FSM_A = 0.95×2880 = 2736 t·m. i_B = 15×10³/12 = 1250 m⁴, FSM_B = 1.025×1250 = 1281 t·m. ΣFSM = 4017 t·m. GG₁ = 4017/20000 = 0.201 m. GM_eff = 1.5 - 0.201 = 1.299 m"
          }
        ],
        keyPoints: [
          "Her kısmen dolu tank için ayrı FSM hesaplanır",
          "Toplam FSM tüm tankların toplamıdır",
          "GM_eff = GM_solid - ΣFSM/Δ",
          "IMO kriterleri GM_eff değerini kontrol eder"
        ],
        warnings: [
          "Serbest yüzey düzeltmesi yapılmamış GM değerleri yanıltıcıdır",
          "Birden fazla kısmen dolu tank toplamı büyük olabilir",
          "Yağ, yakıt, su farklı yoğunluklara sahiptir - doğru ρ kullanın"
        ]
      }
    ]
  },
  {
    id: "section-8",
    title: "Bölüm 8 – Boyuna Stabilite ve Trim",
    icon: "Ship",
    iconColor: "from-violet-500 to-purple-600",
    description: "Boyuna denge, trim hesaplamaları ve MCT kavramı",
    subtopics: [
      {
        title: "8.1. Boyuna Stabilitenin Temelleri",
        content: `Boyuna stabilite, geminin baş-kıç yönündeki denge durumunu ve trim değişimlerini inceler.

**Boyuna vs Enine Stabilite**
- **Enine stabilite:** İskele-sancak yönü, GM ile ölçülür
- **Boyuna stabilite:** Baş-kıç yönü, GML ile ölçülür
- GML >> GM (boyuna stabilite çok daha büyüktür)

**Neden GML Çok Büyük?**
- Gemiler genellikle boyuna yönde çok daha uzundur (L >> B)
- Su hattı alanının boyuna atalet momenti (IL) çok büyüktür
- BML = IL / ∇ değeri çok büyük olur
- Tipik olarak GML = 50-200 m (GM = 0.5-2 m iken)

**Boyuna Stabilitenin Önemi**
Boyuna stabilite, trim değişimlerini hesaplamak için kullanılır:
- Yük yerleşimi planlaması
- Yakıt/balast yönetimi
- Draft kontrolü
- Pervane ve dümen verimliliği

**Trim ve Önemi**
Trim, baş ve kıç draftları arasındaki farktır:
- Trim = T_A - T_F
- Pozitif: Kıça trim (stern trim)
- Negatif: Başa trim (bow trim)
- Sıfır: Even keel (düz omurga)

**İstenen Trim Durumu**
- Çoğu yük gemisi için hafif kıça trim tercih edilir
- Pervane verimliliği için yeterli kıç batması gerekir
- Aşırı başa trim görüş ve dalga vuruşu sorunları yaratır
- Aşırı kıça trim pervane ve dümen problemlerine yol açar`,
        formulas: [
          {
            formula: "GML = KML - KG",
            description: "Boyuna metasantrik yükseklik"
          },
          {
            formula: "BML = IL / ∇",
            description: "Boyuna metasantrik yarıçap"
          },
          {
            formula: "Trim = T_A - T_F",
            description: "Trim tanımı (m)"
          }
        ],
        keyPoints: [
          "Boyuna stabilite (GML) enine stabiliteden (GM) çok büyüktür",
          "Trim, baş ve kıç draft farkıdır",
          "Hafif kıça trim genellikle tercih edilir",
          "Yük yerleşimi trim'i doğrudan etkiler"
        ]
      },
      {
        title: "8.2. MCT (Moment to Change Trim) Kavramı",
        content: `MCT, trim hesaplamalarında kullanılan temel parametredir ve 1 cm trim değişimi için gereken momenti ifade eder.

**MCT Tanımı**
MCT1cm (veya MCTC), geminin trim'ini 1 cm değiştirmek için gereken momenttir (ton-metre).

**MCT Formülü**
MCT1cm = (Δ × GML) / (100 × L)

Burada:
- MCT1cm: Moment (t·m/cm)
- Δ: Deplasman (ton)
- GML: Boyuna metasantrik yükseklik (m)
- L: Geminin boyu (m)
- 100: cm → m dönüşümü

**Alternatif Formül**
MCT1cm = (Δ × BML) / (100 × L) (KG etkisi küçük olduğu için yaklaşık)

**MCT'nin Özellikleri**
- Deplasmanla değişir
- Hidrostatik tablolardan alınır
- Gemi ne kadar büyükse MCT o kadar büyük
- Trim hesaplarında temel çarpan

**MCT Kullanımı**
Trim değişimi = Trimming moment / MCT1cm

Örneğin:
- 1000 t·m moment uygularsanız
- MCT1cm = 200 t·m/cm ise
- Trim değişimi = 1000 / 200 = 5 cm

**Trimming Moment**
Trimming moment = w × d
- w: Taşınan/eklenen ağırlık (ton)
- d: LCF'ye (yüzme merkezine) göre boyuna mesafe (m)

LCF'nin önüne ağırlık → Başa trim
LCF'nin arkasına ağırlık → Kıça trim`,
        formulas: [
          {
            formula: "MCT1cm = (Δ × GML) / (100 × L)",
            description: "MCT hesabı"
          },
          {
            formula: "Trim değişimi = Trimming moment / MCT1cm",
            description: "Trim değişimi hesabı (cm)"
          },
          {
            formula: "Trimming moment = w × d",
            description: "Trimming moment (t·m)"
          }
        ],
        examples: [
          {
            problem: "Δ=15000 ton, GML=150 m, L=120 m. MCT1cm kaçtır?",
            solution: "MCT1cm = (15000 × 150) / (100 × 120) = 2250000 / 12000 = 187.5 t·m/cm"
          },
          {
            problem: "MCT1cm = 200 t·m/cm. 300 ton yük, LCF'nin 15 m önüne konursa trim değişimi?",
            solution: "Moment = 300 × 15 = 4500 t·m. Trim değişimi = 4500 / 200 = 22.5 cm başa trim"
          }
        ],
        keyPoints: [
          "MCT1cm, 1 cm trim için gereken momenttir",
          "Hidrostatik tablolardan alınır veya formülle hesaplanır",
          "Trim değişimi = Moment / MCT",
          "LCF konumu trim yönünü belirler"
        ]
      },
      {
        title: "8.3. Trim Hesaplamaları",
        content: `Trim hesaplamaları, yükleme planlamasının en önemli parçalarından biridir.

**Temel Trim Hesabı**

**Adım 1: Trimming Moment Hesabı**
Her ağırlık değişikliği için:
Moment = w × (x - LCF)

- w: Ağırlık (ton) - pozitif ekleme, negatif çıkarma
- x: Ağırlığın boyuna konumu (midship'ten)
- LCF: Yüzme merkezi konumu (midship'ten)

**Adım 2: Net Trimming Moment**
Tüm momentlerin cebirsel toplamı:
ΣM = M₁ + M₂ + M₃ + ...

**Adım 3: Trim Değişimi**
ΔTrim = ΣM / MCT1cm (cm)

**Adım 4: Baş ve Kıç Draft Değişimleri**
- ΔT_F = ΔTrim × (L - LCF_from_aft) / L
- ΔT_A = ΔTrim × (LCF_from_aft) / L

Veya yaklaşık olarak trim değişimi baş ve kıç arasında orantılı dağılır.

**Draft Sonrası Paralel Batma**
Toplam ağırlık değişikliği paralel batmaya da neden olur:
ΔDraft_paralel = Σw / TPC

Bu da baş ve kıç draftlarına eklenir.

**Toplam Draft Değişimleri**
Final T_F = Initial T_F + ΔDraft_paralel + ΔT_F
Final T_A = Initial T_A + ΔDraft_paralel + ΔT_A

**LCF (Longitudinal Center of Flotation)**
- Su hattı alanının geometrik merkezi
- Trim değişiminin pivot noktası
- Hidrostatik tablolardan alınır
- Deplasmana göre değişir`,
        formulas: [
          {
            formula: "ΔTrim = ΣM / MCT1cm",
            description: "Toplam trim değişimi (cm)"
          },
          {
            formula: "ΔT_F = ΔTrim × d_a / L",
            description: "Baş draft değişimi (d_a: LCF'nin kıçtan mesafesi)"
          },
          {
            formula: "ΔT_A = ΔTrim × d_f / L",
            description: "Kıç draft değişimi (d_f: LCF'nin baştan mesafesi)"
          }
        ],
        examples: [
          {
            problem: "L=100m, LCF midship'ten 2m kıçta. MCT=150 t·m/cm, TPC=20 t/cm. 200 ton yük midship'ten 30m başa alınıyor. T_F=6.0m, T_A=7.0m idi. Yeni draftlar?",
            solution: "Moment = 200 × (30 - (-2)) = 200 × 32 = 6400 t·m (başa). ΔTrim = 6400/150 = 42.7 cm başa. LCF kıçtan 48m (midship'ten -2m). ΔT_F = 42.7 × 48/100 = 20.5 cm batma. ΔT_A = 42.7 × 52/100 = 22.2 cm yükselme. Paralel = 200/20 = 10 cm. T_F = 6.0 + 0.10 + 0.205 = 6.305 m. T_A = 7.0 + 0.10 - 0.222 = 6.878 m"
          }
        ],
        keyPoints: [
          "Trim değişimi = Moment / MCT",
          "LCF trim değişiminin pivot noktasıdır",
          "Baş ve kıç draft değişimleri LCF konumuna göre orantılanır",
          "Paralel batma da dikkate alınmalıdır"
        ],
        practicalTips: [
          "Yükleme planında trim hedefini belirleyin",
          "Ağırlıkları LCF'ye göre dengeleyerek istenen trim'e ulaşın",
          "Seyir boyunca yakıt tüketiminin trim'e etkisini hesaplayın",
          "Balast transferleri ile trim ayarı yapın"
        ]
      },
      {
        title: "8.4. Yükleme Planlaması ve Trim Optimizasyonu",
        content: `Doğru yükleme planlaması, güvenli ve verimli seyir için kritik öneme sahiptir.

**Yükleme Planlamasının Amaçları**
1. Güvenli stabilite (GM) sağlamak
2. İstenen trim'e ulaşmak
3. Yapısal yükleri sınırlamak
4. Operasyonel verimliliği artırmak

**Trim Optimizasyonu**
**İdeal Trim Durumu:**
- Hafif kıça trim (0.5-1.5 m) genellikle tercih edilir
- Pervane verimliliği için yeterli batış
- Aşırıya kaçmamak önemli

**Başa Trim'in Dezavantajları:**
- Pruvada dalga vuruşu (slamming) riski
- Köprüden görüş kaybı
- Çapada zorluk

**Aşırı Kıça Trim'in Dezavantajları:**
- Pervane kavitasyonu
- Dümen verimliliği azalması
- Yakıt tüketimi artışı

**Yükleme Sıralaması**
1. Lightship verilerini al
2. Yük ve yakıt miktarlarını belirle
3. Ağırlıkları dağıt (GM ve trim hedeflerine göre)
4. Stabilite hesabı yap (GM_eff kontrolü)
5. Trim hesabı yap
6. Gerekirse düzenleme yap
7. Yapısal kontroller (shearing force, bending moment)

**Balast Kullanımı**
Balast, trim ve stabiliteyi ayarlamak için ana araçtır:
- Ön tanklara balast → Başa trim azalır
- Arka tanklara balast → Kıça trim azalır
- Derin tanklara balast → GM artar
- Üst tanklara balast → GM azalır (sert gemiyi yumuşatır)

**Dinamik Değişimler**
Seyir boyunca:
- Yakıt tüketimi → Draft ve trim değişir
- Balast transferleri gerekebilir
- Periyodik stabilite/trim kontrolü yapılmalı`,
        keyPoints: [
          "Yükleme planı hem stabilite hem trim için optimize edilmeli",
          "Hafif kıça trim genellikle idealdir",
          "Balast transferleri trim ayarı için kullanılır",
          "Seyir boyunca değişimler izlenmelidir"
        ],
        practicalTips: [
          "Kalkış, varış ve ara durumlarda trim hesabı yapın",
          "Yakıt tüketim planını trim değişimleri ile birlikte değerlendirin",
          "Deniz durumuna göre trim tercihlerini ayarlayın",
          "Yükleme bilgisayarını aktif olarak kullanın"
        ],
        warnings: [
          "Aşırı trim yapısal hasara yol açabilir",
          "Yanlış trim yakıt tüketimini artırır",
          "Trim ile birlikte stabiliteyi de kontrol edin"
        ]
      }
    ]
  },
  {
    id: "section-9",
    title: "Bölüm 9 – Hasarlı Stabilite (Damage Stability)",
    icon: "Shield",
    iconColor: "from-red-500 to-rose-600",
    description: "Su girişi sonrası stabilite ve batmayı önleme",
    subtopics: [
      {
        title: "9.1. Hasarlı Stabilite Kavramı",
        content: `Hasarlı stabilite, geminin bir veya daha fazla bölmesinin su ile dolması sonrası stabilitesini inceler.

**Neden Hasarlı Stabilite?**
Gemiler çeşitli nedenlerle hasara uğrayabilir:
- Çarpışma (collision)
- Karaya oturma (grounding)
- Yapısal hasar (structural failure)
- Aşırı hava koşulları
- Yangın/patlama

Su girişi sonrası:
- Deplasman artar
- Ağırlık merkezi değişir
- Draft ve trim değişir
- Stabilite azalır
- Batma/devrilme riski oluşur

**Hasarlı Stabilite Hesap Yöntemleri**
İki ana yöntem vardır:

**1. Kayıp Kaldırma Kuvveti Yöntemi (Lost Buoyancy Method)**
- Su basan bölme "kaybolmuş" kabul edilir
- Gemi daha az hacimle yüzmeye çalışır
- Hasar görmüş bölmenin kaldırma kuvveti kaybedilir
- Draft ve trim, yeni dengeye ulaşana kadar değişir

**2. Eklenen Ağırlık Yöntemi (Added Weight Method)**
- Basan su, eklenen ağırlık olarak hesaplanır
- Gemi deplasman artışı ile tepki verir
- Daha sezgisel ama karmaşık durumlar için zor

**Permeabilite (μ) Kavramı**
Hasar görmüş bölmenin tamamı su ile dolmaz:
- Bölme içindeki yapılar, yük vb. yer kaplar
- Permeabilite = Dolabilecek hacim / Toplam hacim

Tipik permeabilite değerleri:
- Boş bölme: μ ≈ 0.97
- Makine dairesi: μ ≈ 0.85
- Yük ambarı (genel kargo): μ ≈ 0.60
- Yük ambarı (konteyner): μ ≈ 0.70
- Yaşam mahalleri: μ ≈ 0.95`,
        formulas: [
          {
            formula: "Dolacak su = Bölme hacmi × μ × ρ",
            description: "Bölmeye girecek su miktarı"
          },
          {
            formula: "Yeni Δ = Eski Δ + Basan su ağırlığı",
            description: "Eklenen ağırlık yöntemi"
          }
        ],
        keyPoints: [
          "Hasarlı stabilite su girişi sonrası durumu değerlendirir",
          "Kayıp kaldırma ve eklenen ağırlık iki ana yöntemdir",
          "Permeabilite bölmenin ne kadar dolacağını belirler",
          "SOLAS hasarlı stabilite kriterlerini zorunlu kılar"
        ],
        warnings: [
          "Hasarlı stabilite yetersizse gemi batabilir",
          "Birden fazla bölme hasarı çok tehlikelidir",
          "Asimetrik hasar devrilmeye yol açabilir"
        ]
      },
      {
        title: "9.2. Hasarlı Stabilite Hesabı",
        content: `Hasarlı stabilite hesabı, geminin su alması durumunda hayatta kalabilirliğini değerlendirir.

**Kayıp Kaldırma Kuvveti Yöntemi (Detaylı)**

**Adım 1: Hasar Senaryosunu Belirle**
- Hangi bölme(ler) hasar görmüş?
- Bölme boyutları ve konumu?
- Permeabilite değeri?

**Adım 2: Kaybedilen Hacmi Hesapla**
V_lost = Bölme hacmi × μ

**Adım 3: Yeni Dengeyi Bul**
Gemi, kaybedilen kaldırma kuvvetini telafi etmek için batar:
- Draft artar
- Trim değişir (asimetrik hasar ise)
- Yeni su hattı oluşur

**Adım 4: Yeni Stabiliteyi Hesapla**
- Yeni KM (artmış draft için)
- Yeni KG (serbest yüzey dahil)
- Yeni GM = KM - KG

**Adım 5: GZ Eğrisini Çiz**
- Hasarlı durum için GZ değerleri
- IMO hasarlı stabilite kriterlerini kontrol et

**Eklenen Ağırlık Yöntemi (Detaylı)**

**Adım 1: Basan Su Ağırlığını Hesapla**
w_su = V_bölme × μ × ρ_su

**Adım 2: Su'nun Ağırlık Merkezini Belirle**
- kg (dikey)
- lcg (boyuna)
- tcg (enine) - asimetrik hasar için

**Adım 3: Yeni Deplasman ve KG**
Δ_yeni = Δ_eski + w_su
KG_yeni = (Δ_eski × KG_eski + w_su × kg_su) / Δ_yeni

**Adım 4: Serbest Yüzey Etkisi**
Hasar görmüş bölme serbest yüzey etkisi yaratabilir:
FSM = ρ × i (bölme yüzeyi için)
GM_eff = GM - FSM / Δ

**Adım 5: Stabilite Kontrolü**
IMO hasarlı stabilite kriterlerini kontrol et`,
        formulas: [
          {
            formula: "V_lost = Bölme hacmi × μ",
            description: "Kaybedilen kaldırma hacmi"
          },
          {
            formula: "KG_yeni = (Δ_eski × KG_eski + w_su × kg_su) / Δ_yeni",
            description: "Yeni KG hesabı (eklenen ağırlık yöntemi)"
          },
          {
            formula: "GM_hasarlı = KM_yeni - KG_yeni - FSM / Δ_yeni",
            description: "Hasarlı GM hesabı"
          }
        ],
        examples: [
          {
            problem: "Gemi Δ=10000 ton, KG=7.5m. 1000 m³ bölme (μ=0.85) su aldı. Su merkezi kg=3m. Yeni KG?",
            solution: "w_su = 1000 × 0.85 × 1.025 = 871 ton. Δ_yeni = 10871 ton. KG_yeni = (10000×7.5 + 871×3) / 10871 = 77613 / 10871 = 7.14 m (düştü - su aşağıda olduğu için)"
          }
        ],
        keyPoints: [
          "İki yöntem de aynı sonucu verir",
          "Permeabilite bölme tipine göre değişir",
          "Serbest yüzey etkisi hasarlı durumda da uygulanır",
          "Asimetrik hasar devrilme riski yaratır"
        ]
      },
      {
        title: "9.3. SOLAS Hasarlı Stabilite Gereksinimleri",
        content: `SOLAS (Safety of Life at Sea) konvansiyonu, gemilerin hasarlı stabilite kriterlerini belirler.

**SOLAS Bölüm II-1**
Yolcu gemileri ve kargo gemileri için farklı gereksinimler tanımlar.

**Deterministik vs Probabilistik Yaklaşım**

**Deterministik Yaklaşım (Eski)**
- Belirli hasar senaryoları tanımlanır
- Her senaryo için stabilite kontrol edilir
- Tüm senaryolarda kriter sağlanmalı

**Probabilistik Yaklaşım (Modern)**
- Hasar olasılıkları hesaplanır
- Her senaryo için hayatta kalma olasılığı belirlenir
- Toplam hayatta kalma indeksi (A) hesaplanır
- A ≥ R (gerekli indeks) olmalı

**Attained Subdivision Index (A)**
A = Σ pᵢ × sᵢ
- pᵢ: Hasar senaryosunun olasılığı
- sᵢ: O senaryoda hayatta kalma olasılığı

**Required Subdivision Index (R)**
Gemi tipine ve boyutuna göre belirlenir.

**Hasarlı Stabilite Kriterleri (Genel)**
1. **Final Waterline:** Marj hattının altında kalmalı
2. **Açıklıklar:** Su üstünde kalmalı
3. **Heel Angle:** Asimetrik hasarda <15-20°
4. **GM ve GZ:** Pozitif değerler sağlanmalı
5. **Range of Stability:** Yeterli pozitif GZ aralığı

**Marjin Line (Marj Hattı)**
Su geçirmez güvertenin en az 76 mm altında çizilen hayali hat. Final waterline bu hattın altında kalmalıdır.`,
        keyPoints: [
          "SOLAS hasarlı stabilite kriterlerini zorunlu kılar",
          "Probabilistik yaklaşım modern standarttır",
          "Attained Index ≥ Required Index olmalı",
          "Final waterline marj hattının altında kalmalı"
        ],
        warnings: [
          "SOLAS gereksinimleri karşılanmazsa gemi sefere çıkamaz",
          "Yükleme durumu hasarlı stabiliteyi etkiler",
          "Periyodik doğrulama ve sertifikasyon gereklidir"
        ]
      },
      {
        title: "9.4. Hasar Kontrol ve Müdahale",
        content: `Hasar anında doğru müdahale, geminin ve mürettebatın kurtuluşu için kritiktir.

**Hasar Kontrol Prensipleri**

**1. Hızlı Değerlendirme**
- Hasarın yeri ve boyutu
- Su giriş hızı
- Etkilenen bölmeler
- Mevcut stabilite durumu

**2. Su Girişini Durdurma/Yavaşlatma**
- Tıkaç ve yama kullanımı
- Pompa kapasitesinin değerlendirilmesi
- Bölme kapılarının kapatılması

**3. Dengeleme (Counter-flooding)**
- Asimetrik yatmayı düzeltmek için
- Karşı taraftaki bölmelere kasıtlı su alma
- Dikkatli hesaplama gerektirir!

**Counter-flooding Dikkat Noktaları**
- Toplam su miktarı artar → Batan hacim artar
- GM üzerindeki etkiyi hesaplayın
- Dengeleme miktarını aşmayın

**4. Balast/Yakıt Transferi**
- Yatmayı düzeltmek için
- Stabiliteyi artırmak için
- Trim'i ayarlamak için

**5. Yükün Atılması (Jettisoning)**
- Son çare olarak
- Güverte yükü veya üst yükler
- Stabiliteyi hızla artırır

**Hasar Kontrol Ekipmanları**
- Portatif pompalar
- Tıkaç malzemeleri (wood plugs, cement)
- Yamalar ve destekler
- Su geçirmez kapılar/kapaklar
- Hasar kontrol planları

**Mürettebat Eğitimi**
- Düzenli hasar kontrol tatbikatları
- Bölme planı bilgisi
- Ekipman kullanımı
- Karar verme becerileri`,
        keyPoints: [
          "Hızlı değerlendirme ve müdahale kritiktir",
          "Counter-flooding dikkatli hesaplama gerektirir",
          "Hasar kontrol ekipmanları hazır tutulmalıdır",
          "Düzenli tatbikatlar mürettebatı hazırlar"
        ],
        practicalTips: [
          "Hasar kontrol planını iyi bilin",
          "Bölme kapılarının çalıştığından emin olun",
          "Pompa kapasitelerini önceden hesaplayın",
          "Kritik stabilite limitleri hakkında bilgi sahibi olun"
        ],
        warnings: [
          "Yanlış counter-flooding durumu kötüleştirebilir",
          "Çok fazla su almak batmaya yol açar",
          "Panik halinde yanlış kararlar verilebilir - sakin kalın"
        ]
      }
    ]
  },
  {
    id: "section-10",
    title: "Bölüm 10 – IMO Stabilite Kriterleri",
    icon: "AlertTriangle",
    iconColor: "from-amber-500 to-orange-600",
    description: "Uluslararası stabilite standartları ve uygunluk",
    subtopics: [
      {
        title: "10.1. IMO Intact Stability Code (2008 IS Code)",
        content: `IMO 2008 IS Code, tüm gemiler için genel stabilite kriterlerini tanımlar.

**2008 IS Code Kapsamı**
- Uluslararası sefer yapan tüm gemiler
- 24 metre ve üzeri gemiler
- Bazı gemi tipleri için özel kriterler

**Temel Kriterler (Genel Kargo Gemileri)**

**1. GZ Eğrisi Altındaki Alan**
- A(0°-30°) ≥ 0.055 m·rad
- A(0°-40°) ≥ 0.090 m·rad (veya θ_flood öncesi)
- A(30°-40°) ≥ 0.030 m·rad

**2. Maksimum GZ**
- GZ_max ≥ 0.20 m (θ ≥ 30° için)
- θ_max ≥ 25° (GZ_max'ın oluştuğu açı)

**3. Başlangıç GM**
- GM₀ ≥ 0.15 m (serbest yüzey düzeltmeli)

**4. Hava Kriteri (Weather Criterion)**
- Rüzgar ve dalga etkisi altında stabilite
- Alan oranı: A1 ≥ A2

**Özel Gemi Tipleri**

**Yolcu Gemileri:**
- Daha katı kriterler
- Kalabalıklaşma senaryoları
- Tahliye süreleri ile ilişkili

**Tankerler:**
- Üst güverte açıklıkları için düzeltme
- Yük yoğunluğu etkileri

**Konteyner Gemileri:**
- Güverte yükü etkileri
- Parametrik rulo riskleri

**Balıkçı Gemileri:**
- Ağ çekme kuvvetleri
- Ani yük değişimleri

**RoRo Gemileri:**
- Araba güvertesi su girişi
- Stockholm Agreement kriterleri`,
        formulas: [
          {
            formula: "A(0°-30°) ≥ 0.055 m·rad",
            description: "0-30° arası GZ eğrisi altı alan"
          },
          {
            formula: "A(0°-40°) ≥ 0.090 m·rad",
            description: "0-40° arası GZ eğrisi altı alan"
          },
          {
            formula: "GZ_max ≥ 0.20 m @ θ ≥ 30°",
            description: "Minimum maksimum GZ değeri ve açısı"
          },
          {
            formula: "GM₀ ≥ 0.15 m",
            description: "Minimum başlangıç GM"
          }
        ],
        keyPoints: [
          "2008 IS Code tüm gemiler için temel standarttır",
          "GZ eğrisi alan kriterleri dinamik stabiliteyi değerlendirir",
          "Minimum GM ve GZ_max değerleri zorunludur",
          "Özel gemi tipleri için ek kriterler uygulanır"
        ]
      },
      {
        title: "10.2. Hava Kriteri (Weather Criterion)",
        content: `Hava kriteri, geminin şiddetli rüzgar ve dalga koşullarında stabilitesini değerlendirir.

**Senaryo**
Gemi, sabit bir rüzgar altında yatık konumdayken (θ₀), ani bir rüzgar şiddeti artışı (gust) ile daha fazla yatar. Aynı anda dalgalar gemini rüzgar tarafına sallar.

**Hesap Adımları**

**Adım 1: Sabit Rüzgar Heeling Arm (lw1)**
lw1 = (P × A × Z) / (1000 × g × Δ)

- P: Rüzgar basıncı (504 N/m² standart)
- A: Yanal projeksiyon alanı (m²)
- Z: A'nın merkezinin su hattından yüksekliği (m)
- Δ: Deplasman (ton)
- g: 9.81 m/s²

**Adım 2: Statik Yatma Açısı (θ₀)**
GZ eğrisi ile lw1 çizgisinin kesiştiği açı

**Adım 3: Rüzgar Şiddeti Artışı (lw2)**
lw2 = 1.5 × lw1

**Adım 4: Rulo Açısı (θ₁)**
θ₁ = θ₀ - θ_roll

θ_roll, geminin rüzgar tarafına sallanma açısıdır (formülle hesaplanır)

**Adım 5: Alan Karşılaştırması**
- A1: θ₁ ile θ₀ arasındaki alan (GZ - lw2 arasında)
- A2: θ₀ ile θ₂ arasındaki alan (lw2 - GZ arasında)

**Kriter:**
A1 ≥ A2 olmalıdır.

**Fiziksel Anlam**
- A1: Geminin rüzgar tarafına döndüğündeki enerji kapasitesi
- A2: Rüzgar şiddetinin gemiye vereceği enerji
- A1 > A2 ise gemi devrilmez`,
        formulas: [
          {
            formula: "lw1 = (P × A × Z) / (1000 × g × Δ)",
            description: "Sabit rüzgar heeling arm"
          },
          {
            formula: "lw2 = 1.5 × lw1",
            description: "Rüzgar şiddeti artışı etkisi"
          },
          {
            formula: "A1 ≥ A2",
            description: "Hava kriteri uygunluk koşulu"
          }
        ],
        keyPoints: [
          "Hava kriteri ani rüzgar artışını simüle eder",
          "A1/A2 alan oranı değerlendirilir",
          "A1 ≥ A2 olmalıdır",
          "Rüzgar alanı ve ağırlık merkezi yüksekliği kritik parametrelerdir"
        ],
        warnings: [
          "Yüksek üst yapılı gemiler daha yüksek rüzgar heeling'e maruz kalır",
          "Güverte yükü (konteyner vb.) rüzgar alanını artırır",
          "Hava kriteri sağlanmazsa gemi sefere çıkamaz"
        ]
      },
      {
        title: "10.3. Tahıl Yükü Stabilitesi (Grain Stability)",
        content: `Tahıl taşıyan gemiler için özel stabilite kriterleri uygulanır.

**Neden Özel Kriterler?**
Tahıl:
- Akışkan davranış gösterebilir
- Seyir sırasında yerleşir (settling)
- Yatık gemide kayabilir
- Bu nedenle ek stabilite riski oluşturur

**IMO Grain Code (International Code for Safe Carriage of Grain in Bulk)**

**Temel Kriterler**
1. **Başlangıç GM (düzeltilmiş):**
   GM_fluid ≥ 0.30 m

2. **Maksimum Yatma Açısı:**
   θ ≤ 12° (tahıl kayması sonucu)

3. **GZ Eğrisi Alanı:**
   A(θ_h ile 40° arası) ≥ 0.075 m·rad
   
   θ_h: Tahıl heeling açısı

**Tahıl Heeling Moment**
Tahıl kayması nedeniyle oluşan moment:
- Volumetric heeling moment (VHM)
- Hesap, yük tutma cihazlarına (shifting boards, overstowing) bağlı

**Heeling Arm Hesabı**
λ = VHM / (SF × Δ)

- VHM: Hacimsel heeling momenti (m⁴)
- SF: Stowage factor (m³/ton)
- Δ: Deplasman (ton)

**Document of Authorization**
- Klas kuruluşu tarafından verilen tahıl taşıma belgesi
- Onaylı yükleme senaryoları
- Stabilite hesap kitapçığı`,
        formulas: [
          {
            formula: "GM_fluid ≥ 0.30 m",
            description: "Tahıl taşıyan gemiler için minimum GM"
          },
          {
            formula: "θ_max ≤ 12°",
            description: "Maksimum tahıl kayma açısı"
          },
          {
            formula: "A(θ_h - 40°) ≥ 0.075 m·rad",
            description: "GZ eğrisi alanı kriteri"
          },
          {
            formula: "λ = VHM / (SF × Δ)",
            description: "Tahıl heeling arm hesabı"
          }
        ],
        keyPoints: [
          "Tahıl taşıyan gemiler için özel kriterler uygulanır",
          "GM ≥ 0.30 m (genel gemilerden daha yüksek)",
          "Maksimum yatma açısı 12° ile sınırlı",
          "Document of Authorization zorunludur"
        ],
        practicalTips: [
          "Tahıl yüklemeden önce onaylı senaryoları kontrol edin",
          "Yük tutma cihazlarının (shifting boards) düzgün yerleştirildiğinden emin olun",
          "Seyir boyunca tahıl yerleşmesini izleyin",
          "Stabilite hesabını sık aralıklarla güncelleyin"
        ]
      },
      {
        title: "10.4. Stabilite Doğrulama ve Sertifikasyon",
        content: `Stabilite gereksinimleri, çeşitli doğrulama ve sertifikasyon süreçleriyle kontrol edilir.

**Stabilite Kitapçığı (Stability Booklet)**
Her gemide bulunması zorunlu olan dokümandır:
- Gemi özellikleri ve hidrostatik veriler
- Onaylı yükleme senaryoları
- Stabilite hesap prosedürleri
- IMO kriterleri ve sınırlar
- KN eğrileri veya tabloları
- Tank kapasiteleri ve serbest yüzey verileri

**Stabilite Kitapçığının İçeriği**
1. Genel bilgiler (gemi boyutları, lightship verileri)
2. Hidrostatik tablolar (draft vs KM, TPC, MCT vb.)
3. Tank tabloları (kapasite, VCG, LCG, FSM)
4. Örnek yükleme durumları ve hesaplar
5. Kriter özeti ve kontrol tabloları
6. GZ eğrileri (tipik durumlar için)

**Yükleme Bilgisayarı (Loading Computer)**
Modern gemilerde zorunlu:
- Stabilite hesabını otomatik yapar
- IMO kriterlerini kontrol eder
- Uyarı ve alarm verir
- Onaylı yazılım gerektirir

**Sertifikasyon Süreci**

**1. Tasarım Aşaması:**
- Stabilite hesapları
- Klas kuruluşu onayı

**2. İnşa Sonrası:**
- Eğim testi (inclining experiment)
- Lightship verileri doğrulama
- Stabilite kitapçığı onayı

**3. İşletme Dönemi:**
- Periyodik doğrulama (5 yıl)
- Lightship değişikliği kontrolü
- Yükleme bilgisayarı kalibrasyonu

**Eğim Testi (Inclining Experiment)**
Geminin lightship KG değerini belirlemek için yapılır:
1. Gemi boşaltılır (lightship durumu)
2. Bilinen ağırlıklar enine taşınır
3. Yatma açısı ölçülür
4. GM ve KG hesaplanır`,
        formulas: [
          {
            formula: "GM = (w × d) / (Δ × tan(θ))",
            description: "Eğim testi GM hesabı"
          },
          {
            formula: "KG = KM - GM",
            description: "Eğim testinden KG belirleme"
          }
        ],
        keyPoints: [
          "Stabilite kitapçığı her gemide zorunludur",
          "Yükleme bilgisayarı modern gemilerde standart",
          "Eğim testi lightship KG'yi belirler",
          "Periyodik doğrulama gereklidir"
        ],
        practicalTips: [
          "Stabilite kitapçığını her zaman güncel tutun",
          "Yükleme bilgisayarı sonuçlarını manuel kontrol edin",
          "Lightship değişikliklerini kaydedin ve raporlayın",
          "Kriter sınırlarına yaklaşıldığında dikkatli olun"
        ],
        warnings: [
          "Onaysız stabilite yazılımı kullanmayın",
          "Lightship değişiklikleri rapor edilmelidir",
          "Kriterleri karşılamayan yükleme durumu tehlikelidir"
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
