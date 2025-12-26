// Comprehensive Stability Topics Content Data
// Each topic contains detailed explanations, formulas, examples, and practical applications

export interface StabilitySubTopic {
  id?: string;
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
    title: "Bölüm 1 – Temel Kavramlar ve Tanımlar",
    icon: "Anchor",
    iconColor: "from-blue-500 to-indigo-600",
    description: "Stabilitenin temel bileşenleri, denge türleri ve metasantrik kavramlar",
    subtopics: [
      {
        title: "1.1 Denge Türleri",
        content: `Stabilite, bir geminin dış etkilere karşı dengesini koruma yeteneğidir. Denge türleri şunlardır:

**Kararlı (stabil) denge:** Gemi dış etkiyle yan yatsa bile kuvvet ortadan kalkınca tekrar dik konuma döner. Bu durumda GZ kolu ve metasantrik yükseklik (GM) pozitiftir.

**Nötr denge:** Gemi dış etkiyle yeni bir açıda dengeye gelir; doğrultucu kol sıfıra yaklaşır.

**Kararsız (unstable) denge:** GM negatiftir. Gemi dik konumda kararsızdır ve en küçük eğilme gemiyi devrilmeye götürür.`,
        keyPoints: [
          "Kararlı denge: GZ ve GM pozitiftir",
          "Nötr dengede doğrultucu kol sıfıra yaklaşır",
          "Kararsız dengede GM negatiftir"
        ]
      },
      {
        title: "1.2 Deplasman, Kaldırma ve Ağırlık Merkezi",
        content: `**Deplasman (Δ):** Geminin yer değiştirdiği suyun ağırlığıdır.

**Ağırlık merkezi (G):** Gemideki tüm yüklerin bileşik uygulama noktasıdır. Yüklerin taşınması veya tank dolulukları değiştiğinde KG değişir.

**Kaldırma kuvveti merkezi (B):** Su altında kalan hacmin ağırlık merkezidir ve geminin yüzme konumuna göre yer değiştirir.`,
        keyPoints: [
          "Deplasman geminin toplam ağırlığına eşittir",
          "G noktası yük dağılımıyla doğrudan değişir",
          "B noktası geminin su altı hacmine bağlıdır"
        ]
      },
      {
        title: "1.3 Metasantrik Yükseklik ve Gemi Sertliği",
        content: `Metasantrik yükseklik (GM), küçük açılardaki ilk stabilitenin göstergesidir.

**Formül:** GM = KM − KG

GM arttıkça gemi **sert (stiff)** hale gelir; yuvarlanma periyodu kısalır ve gemi hızlı hareket eder. GM düşük veya negatifse gemi **yumuşak (tender)** olur; yuvarlanma periyodu uzar ve stabilite zayıflar.

Dik konumda G, B ve M aynı dikey hat üzerindedir. Gemi yan yattığında B yana kayar ve G–Z doğrultucu kol oluşur.`,
        keyPoints: [
          "GM küçük açılı stabilitenin temel göstergesidir",
          "GM büyükse gemi sert, küçükse gemi yumuşaktır",
          "B'nin yanal hareketi GZ kolunu doğurur"
        ]
      },
      {
        title: "1.4 Sert ve Yumuşak Gemi",
        content: `**Sert gemi:** GM büyük, yuvarlanma periyodu kısa, hızlı hareket eder. Büyük GM daha fazla doğrultucu moment sağlar fakat yolcu konforu düşer.

**Yumuşak gemi:** GM küçük, yuvarlanma periyodu uzun. Yolcu konforu artar ama stabilite zayıflar. Yük ve tank düzenlemesiyle GM artırılmalıdır.`,
        keyPoints: [
          "Sert gemi: hızlı ama konforsuz",
          "Yumuşak gemi: konforlu ama zayıf stabilite",
          "Operasyonel yönetimle GM optimize edilir"
        ]
      }
    ]
  },
  {
    id: "section-2",
    title: "Bölüm 2 – Statik Stabilite ve GZ Eğrisi",
    icon: "LineChart",
    iconColor: "from-emerald-500 to-teal-600",
    description: "Doğrultucu kol, doğrultucu moment ve GZ eğrisi yorumu",
    subtopics: [
      {
        title: "2.1 Doğrultucu Kol ve Doğrultucu Moment",
        content: `**Doğrultucu kol (GZ):** Ağırlık merkezi (G) ile kaldırma kuvvetinin doğrultusu arasındaki kol uzunluğudur.

Küçük açılar için yaklaşık ilişki: **GZ ≈ GM · sinφ**.

**Doğrultucu moment (RM):** RM = Δ · GZ olup dış kuvvetlere karşı koyan momenti temsil eder.`,
        keyPoints: [
          "GZ doğrultucu etkinin temel ölçüsüdür",
          "RM = Δ · GZ doğrultucu momenti verir",
          "Küçük açılarda sin yaklaşımı kullanılır"
        ]
      },
      {
        title: "2.2 GZ Eğrisi (Statik Stabilite Eğrisi)",
        content: `GZ eğrisi, farklı yatma açılarına karşı GZ değerlerini gösterir. Eğriden şu bilgiler okunur:

- **Maksimum GZ** ve oluştuğu açı
- **Pozitif stabilite menzili** (GZ > 0 olan açılar)
- **Vanishing stability açısı (AVS)**: GZ'nin sıfırlandığı açı
- **Dinamik stabilite alanı**: GZ eğrisi altındaki alan

GZ eğrisinin başlangıç eğimi, GM hakkında bilgi verir.`,
        keyPoints: [
          "GZ eğrisi stabilite karakterini gösterir",
          "Pozitif menzil ve AVS kritik limitlerdir",
          "Eğri altı alan dinamik stabilitedir"
        ]
      },
      {
        title: "2.3 Dinamik Stabilite",
        content: `Statik stabilite eğrisinin altında kalan alan, geminin heeling sırasında absorbe edebileceği enerji miktarını (dinamik stabilite) temsil eder.

Yüksek maksimum GZ tek başına yeterli değildir; alanın geniş olması geminin daha fazla enerji absorbe edebileceği anlamına gelir.`,
        keyPoints: [
          "Dinamik stabilite enerji bazlı değerlendirmedir",
          "GZ alanı büyüdükçe stabilite rezervi artar"
        ]
      },
      {
        title: "2.4 GZ Eğrisi Oluşturma ve KN Eğrileri",
        content: `Farklı KG ve deplasmanlar için **cross-curves of stability (KN eğrileri)** çıkarılır. KN eğrileri, belirli yatma açıları için KN değerlerini verir.

KN'den GZ'ye dönüşüm:

**GZ(θ) = KN(θ) − KG · sinθ**

KN eğrileri stabilite kitapçığında tablo halinde verilir ve Simpson yöntemleriyle entegrasyon yapılarak GZ eğrisi elde edilir.`,
        keyPoints: [
          "KN eğrileri GZ hesaplamasını hızlandırır",
          "GZ = KN − KG·sinθ ilişkisi kullanılır",
          "Simpson yöntemi ile alanlar hesaplanır"
        ]
      }
    ]
  },
  {
    id: "section-3",
    title: "Bölüm 3 – Serbest Yüzey Etkisi",
    icon: "Droplet",
    iconColor: "from-cyan-500 to-blue-600",
    description: "Kısmen dolu tankların GM üzerindeki olumsuz etkileri",
    subtopics: [
      {
        title: "3.1 Serbest Yüzeyin Stabiliteye Etkisi",
        content: `Kısmen dolu tanklardaki sıvı, gemi yatınca serbest yüzeyin yatay kalma eğilimiyle bir sıvı kama transferi oluşturur. Bu durum ağırlık merkezini yana kaydırır ve GM'yi düşürür. Buna **serbest yüzey etkisi (FSE)** denir.

Bu etki gemi yatıkken sıvının düşük tarafa akmasıyla oluşur; ağırlık merkezi G yana kayar ve ilave heeling momenti yaratır.`,
        warnings: [
          "Kısmen dolu tanklar GM'yi önemli ölçüde düşürebilir",
          "Serbest yüzey etkisi özellikle küçük GM durumlarında kritiktir"
        ],
        keyPoints: [
          "Serbest yüzey etkisi stabiliteyi olumsuz etkiler",
          "Sıvı transferi G noktasını yana kaydırır"
        ]
      },
      {
        title: "3.2 Serbest Yüzey Düzeltmesi",
        content: `Serbest yüzey düzeltmesi, GM'den her tank için serbest yüzey düzeltmesinin çıkarılmasıyla yapılır:

**GM düzeltilmiş = GM − Σ(I_f / ∇)**

Burada I_f her tankın serbest yüzey atalet momenti, ∇ deplasman hacmidir.

Tankları bölmelere ayırmak, tankları tam dolu veya boş tutmak ve enine/boyuna bölmeler kullanmak serbest yüzey etkisini azaltır.`,
        keyPoints: [
          "GM düzeltmesi tankların I_f değerlerine bağlıdır",
          "Bölmeleme serbest yüzey etkisini azaltır"
        ]
      }
    ]
  },
  {
    id: "section-4",
    title: "Bölüm 4 – İç Yükler ve İç Etkiler",
    icon: "Boxes",
    iconColor: "from-orange-500 to-amber-600",
    description: "Yolcu hareketi, yük kayması ve vinç operasyonları",
    subtopics: [
      {
        title: "4.1 İç Yük Kaynaklı Stabilite Etkileri",
        content: `Gemideki ağırlıkların konumu stabiliteyi doğrudan etkiler:

- **Yolcu/personel hareketi:** Kalabalığın bir tarafa toplanması heeling momenti oluşturur.
- **Yük kayması:** Sabitlenmemiş yüklerin kayması G noktasını değiştirir ve GZ'yi azaltır.
- **Vinçle yük kaldırma:** Güverte dışına asılı yükler ağırlık merkezini yükseltip yana kaydırır.
- **Balast ve tank operasyonları:** Balast dolulukları KG ve GM değerlerini değiştirir.`,
        keyPoints: [
          "İç yük hareketleri G noktasını değiştirir",
          "Yük kayması stabiliteyi kritik seviyede düşürebilir",
          "Balast operasyonları GM üzerinde belirleyicidir"
        ]
      }
    ]
  },
  {
    id: "section-5",
    title: "Bölüm 5 – Dış Etkiler ve Manevra Kaynaklı Stabilite",
    icon: "Wind",
    iconColor: "from-purple-500 to-indigo-600",
    description: "Rüzgâr, dalga, parametrik salınım ve manevra etkileri",
    subtopics: [
      {
        title: "5.1 Rüzgâr Devrilme Momenti",
        content: `Rüzgâr, üst yapı alanına etki ederek heeling momenti yaratır. IMO kodu, bu heeling kolunu GZ eğrisi ile karşılaştırarak belirli açı aralıklarında alan kriterleri getirir.

Rüzgâr momenti genellikle yükseklik ve yüzey alanıyla orantılıdır ve geminin seyir durumuna göre hesaplanır.`,
        keyPoints: [
          "Rüzgâr heeling momenti oluşturur",
          "IMO kriterleri alan karşılaştırması ister"
        ]
      },
      {
        title: "5.2 Dalga Etkileri ve Parametrik Salınım",
        content: `Dalga tepe ve çukurlarında kaldırma kuvveti değişir; bu da GZ kolunun periyodik değişmesine neden olur.

**Parametrik salınım**, baş veya kıçtan gelen dalgalarda GZ kolunun periyodik değişimiyle oluşan rezonans fenomenidir. Metasantrik yükseklik dalga tepesinde azalır, dalga çukurunda artar. Bu periyodik değişim geminin doğal yuvarlanma periyoduyla çakışırsa şiddetli yalpa oluşur.

Risk, hız ve rota ayarlamasıyla azaltılabilir.`,
        keyPoints: [
          "Parametrik salınım periyodik GM değişiminden doğar",
          "Rota ve hız ayarı risk azaltır"
        ]
      },
      {
        title: "5.3 Manevra ve Diğer Dış Faktörler",
        content: `- **Hızlı dönüş (turning heel):** Merkezkaç kuvveti heeling momenti yaratır.
- **Römork ve akıntı etkileri:** Halat kuvveti ve akıntı gemiyi yana çeker.
- **Buz ve su birikmesi:** KG yükselir, GM düşer.
- **Karaya oturma:** Kaldırma kuvveti azalır, stabilite düşer.`,
        keyPoints: [
          "Manevralar heeling momenti oluşturur",
          "Buzlanma ve su birikmesi KG'yi yükseltir",
          "Karaya oturma stabiliteyi aniden düşürür"
        ]
      }
    ]
  },
  {
    id: "section-6",
    title: "Bölüm 6 – Stabilite Kriterleri ve Düzenlemeler",
    icon: "Shield",
    iconColor: "from-rose-500 to-red-600",
    description: "IMO İntakt Stabilite Kodu ve temel kriterler",
    subtopics: [
      {
        title: "6.1 IMO İntakt Stabilite Kriterleri",
        content: `IMO İntakt Stabilite Kodu, gemiler için asgari stabilite şartlarını tanımlar. Temel kriterler:

- **Minimum GM:** Tam yüklü kargolu gemiler için GM ≥ 0,15 m
- **Maksimum GZ:** En az 0,20 m ve 30°–40° aralığında oluşmalı
- **Pozitif stabilite alanları:**
  - 0°–30° alanı ≥ 0,055 m·rad
  - 0°–40° (veya daldırma açısı) alanı ≥ 0,09 m·rad
  - 30°–40° alanı ≥ 0,03 m·rad
- **Vanishing stability açısı:** 25°'ten büyük olmalı

Her gemi için stabilite kitapçığı, KN tabloları, GZ eğrileri, KG limitleri ve yükleme koşullarını içerir.`,
        keyPoints: [
          "IMO kriterleri minimum GM ve GZ alanları belirler",
          "Stabilite kitapçığı gemide bulundurulmalıdır"
        ]
      }
    ]
  },
  {
    id: "section-7",
    title: "Bölüm 7 – Hasar Stabilitesi",
    icon: "ShieldAlert",
    iconColor: "from-slate-500 to-gray-600",
    description: "Su alma sonrası stabilite değerlendirmeleri",
    subtopics: [
      {
        title: "7.1 Hasar Stabilitesi Yöntemleri",
        content: `Hasar stabilitesi, bir veya daha fazla bölmenin su alması sonrası geminin stabilitesinin değerlendirilmesidir.

İki temel yöntem kullanılır:

- **Kayıp kaldırma (lost buoyancy) yöntemi:** Su alan bölmenin kaldırması yok sayılır; deplasman azalır ve yeni B ile G konumları hesaplanır.
- **Ek ağırlık (added weight) yöntemi:** Su alan bölmeye giren su ağırlığa eklenir; deplasman artar ve G yükselir.

Değerlendirme SOLAS probabilistik kriterlerine göre yapılır; watertight perdeler ve acil pompalar hasar stabilitesini artırır.`,
        keyPoints: [
          "Hasar stabilitesi SOLAS kriterlerine göre kontrol edilir",
          "Perdeler ve pompalar hayatta kalabilirliği artırır"
        ]
      }
    ]
  },
  {
    id: "section-8",
    title: "Bölüm 8 – Testler ve Ölçümler",
    icon: "TestTube",
    iconColor: "from-lime-500 to-green-600",
    description: "İnklinasyon ve yuvarlanma testleri, KN eğrileri",
    subtopics: [
      {
        title: "8.1 İnklinasyon Deneyi",
        content: `Gemi inşa edildikten sonra gerçek KG ve GM değerlerini belirlemek için yapılır. Bilinen ağırlıklar gemi içinde yatay olarak yer değiştirir ve oluşan yatma açılarından GM hesaplanır.

İnklinasyon deney raporu stabilite kitapçığında bulunur.`,
        keyPoints: [
          "İnklinasyon deneyi gerçek GM'yi ölçer",
          "Rapor stabilite kitapçığında yer alır"
        ]
      },
      {
        title: "8.2 Yuvarlanma (Rolling) Testi",
        content: `Bazı ülkeler yuvarlanma periyodunu tespit etmek için deneme yapılmasını ister. Yuvarlanma periyodu metasantrik yükseklik ve gemi enkesit dağılımıyla ilişkilidir.

Yaklaşık ilişki:

**T = C_b · B / √GM**

Burada C_b blok katsayısı, B gemi enidir.`,
        keyPoints: [
          "Rolling testi periyot ölçümü için yapılır",
          "Periyot GM ile ters orantılıdır"
        ]
      },
      {
        title: "8.3 KN Eğrileri ve Simpson Alan Hesapları",
        content: `Tasarım aşamasında belirli KG ve trim değerlerine göre KN eğrileri oluşturulur. KN değerleri Simpson yöntemleriyle entegre edilerek alanlar hesaplanır ve GZ eğrisi elde edilir.

Simpson 1/3 ve 3/8 kuralları düzensiz alanların hesaplanmasında kullanılır.`,
        keyPoints: [
          "KN eğrileri GZ hesaplamasının temelidir",
          "Simpson yöntemleri alan hesabı için kullanılır"
        ]
      }
    ]
  },
  {
    id: "section-9",
    title: "Bölüm 9 – Trim ve Boyuna Denge",
    icon: "MoveHorizontal",
    iconColor: "from-sky-500 to-blue-600",
    description: "Trim, MCT ve TPC ilişkileri",
    subtopics: [
      {
        title: "9.1 Trim, Hogging ve Sagging",
        content: `Baş ve kıç draftlarının farklı olması trim olarak adlandırılır. Ortalama draft:

**d_M = (d_F + d_A) / 2**

Eğer d_F + d_A > 2d_M ise gemi **hogging**, d_F + d_A < 2d_M ise **sagging** durumundadır.`,
        keyPoints: [
          "Trim baş-kıç draft farkıdır",
          "Hogging ve sagging boyuna dengeyi etkiler"
        ]
      },
      {
        title: "9.2 Trim Momenti ve Paralel Batma",
        content: `Trim momenti hesaplamak için MCT (Moment to Change Trim) kullanılır:

**ΔTrim = Toplam Moment / MCT**

Paralel batma veya çıkma TPC ile hesaplanır:

**Batma (cm) = w / TPC**

Boyuna stabilite hesaplarında LCG ve LCF konumları dikkate alınır.`,
        keyPoints: [
          "MCT trim hesabının temelidir",
          "TPC paralel batma hesabında kullanılır"
        ]
      }
    ]
  },
  {
    id: "section-10",
    title: "Bölüm 10 – İleri Konular",
    icon: "Sparkles",
    iconColor: "from-fuchsia-500 to-purple-600",
    description: "Negatif GM, loll açısı ve parametrik salınım önleme",
    subtopics: [
      {
        title: "10.1 Negatif GM ve Loll Açısı",
        content: `KG yükselip GM negatif olduğunda gemi dik konumda kararsızdır ve kendi kendine bir tarafa yatmaya başlar. GZ kolu tekrar sıfıra ve pozitife döndüğünde gemi belirli bir açıda dengede kalır; bu açıya **loll açısı** denir.

Loll durumu serbest yüzey etkisi, üstte yoğun ağırlık birikmesi veya yetersiz balast nedeniyle ortaya çıkabilir. Çözüm KG'nin düşürülmesidir.`,
        warnings: [
          "Negatif GM geminin dik dengesini kaybettirir",
          "Loll açısı operasyonel risk işaretidir"
        ],
        keyPoints: [
          "Loll açısı kararsız denge göstergesidir",
          "Balast ve yük transferiyle KG düşürülmelidir"
        ]
      },
      {
        title: "10.2 Parametrik Salınımın Önlenmesi",
        content: `Parametrik salınım riskini azaltmak için hız ve rota ayarlanmalı; dalga karşılaşma periyodunun geminin doğal yuvarlanma periyodu ile çakışması önlenmelidir.

Stabilite kitapçığında riskli yükleme koşulları belirtilmeli ve gemi kaptanları bu durumlar için uyarılmalıdır.`,
        keyPoints: [
          "Periyot çakışması riskin temelidir",
          "Rota/hız ayarı önleyici bir tedbirdir"
        ]
      }
    ]
  },
  {
    id: "section-11",
    title: "Bölüm 11 – Havuzlamada Stabilite ve Kritik GM",
    icon: "Ship",
    iconColor: "from-slate-600 to-zinc-700",
    description: "Dry dock sürecinde stabilite riskleri ve kritik GM",
    subtopics: [
      {
        title: "11.1 Dry Docking Sürecine Genel Bakış",
        content: `Kuru havuza girişte geminin stabilitesi önemli ölçüde değişir. Gemi havuza girdikten sonra su seviyesi düşürülür ve kıç önce keel bloklarına oturur. Bu anda blok reaksiyonu (upthrust) artar ve GM'de sanal bir azalma oluşur.

Gemi kuru havuza girmeden önce yeterli pozitif GM sağlanmalıdır.`,
        warnings: [
          "Yetersiz GM geminin bloklardan kaymasına neden olabilir"
        ],
        keyPoints: [
          "Keel blok reaksiyonu GM'yi sanal olarak azaltır",
          "Dry dock öncesi GM kontrolü zorunludur"
        ]
      },
      {
        title: "11.2 Kritik GM ve Formülasyon",
        content: `Docking sırasında kritik denge için:

**Δ · GM = R · KM**

Burada Δ deplasman, R blok reaksiyonu, KM kökten metasentre mesafedir. Buradan kritik GM:

**GM_kritik = (R · KM) / Δ**

Gemi kuru havuza girmeden önce gerçek GM değerinin kritik değerden büyük olması gerekir.`,
        keyPoints: [
          "Kritik GM, upthrust ile doğru orantılıdır",
          "Gerçek GM kritik değerin üzerinde olmalıdır"
        ]
      },
      {
        title: "11.3 Docking Plan ve Hidrostatik Kontroller",
        content: `Docking planında şu veriler bulunur:

- Baş ve kıç draftları
- LCB, LCF
- MCTc
- KM ve GM

Keel blok yerleşimi, LRP ve yan blok destekleri dock plan çizimlerinde gösterilir.`,
        keyPoints: [
          "Dock plan hidrostatik verileri içerir",
          "Blok yerleşimi stabiliteyi doğrudan etkiler"
        ]
      },
      {
        title: "11.4 Güvenli Docking İçin Altın Kurallar",
        content: `- Kritik GM pozitif olmalıdır.
- Gemi her zaman dik tutulmalıdır.
- Önerilen ortalama draft ve trim sınırları aşılmamalıdır.
- Tüm sintine ve tanklar kuru olmalıdır.
- Tank sounding kayıtları güncel tutulmalıdır.

Bu kurallar geminin bloklardan kaymasını veya yana devrilmesini önlemek için kritiktir.`,
        keyPoints: [
          "Kritik GM kontrolü docking güvenliğinin temelidir",
          "Trim ve tank kayıtları operasyon güvenliğini artırır"
        ]
      }
    ]
  },
  {
    id: "section-12",
    title: "Bölüm 12 – Formüller ve Hesaplamalar",
    icon: "Calculator",
    iconColor: "from-teal-500 to-cyan-600",
    description: "Stabilite hesaplarında sık kullanılan formüller",
    subtopics: [
      {
        title: "12.1 Temel Formüller",
        content: `**Metasantrik yükseklik:** GM = KM − KG veya GM = (I / ∇) − KG

**Doğrultucu kol:** GZ ≈ GM · sinφ (küçük açı), büyük açılar için KN eğrileri

**Doğrultucu moment:** RM = Δ · GZ

**Metasantrik yarıçap:** BM = I / ∇

**KG hesabı:** KG = Σ(w_i · KG_i) / Σw_i

**Serbest yüzey düzeltmesi:** GM_düzeltilmiş = GM − Σ(I_f / ∇)

**Yalpa periyodu:** T = C_b · B / √GM

**Trim değişimi:** ΔTrim = Toplam Moment / MCT

**Paralel batma:** Batma (cm) = w / TPC

**KN'den GZ:** GZ(θ) = KN(θ) − KG · sinθ

**Ağırlık kaydırma etkisi:** ΔGM = (w · d) / Δ

**Kritik GM (dry dock):** GM_kritik = (R · KM) / Δ`,
        keyPoints: [
          "Formüller hızlı referans için özetlenmiştir",
          "Detaylar ilgili bölümlerde açıklanır"
        ]
      }
    ]
  }
];
