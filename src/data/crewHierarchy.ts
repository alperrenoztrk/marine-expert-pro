export type CrewRole = {
  slug: string;
  rank: string;
  responsibility: string;
  reportsTo: string;
  alwaysDuties: string[];
  generalTasks: string[];
};

export type CrewGroup = {
  department: string;
  focus: string;
  colorCode: string;
  roles: CrewRole[];
};

export const crewHierarchy: CrewGroup[] = [
  {
    department: "Köprüüstü / Operasyon",
    focus: "Seyir, emniyet ve yük operasyonu yönetimi",
    colorCode: "KAPTANLIK",
    roles: [
      {
        slug: "kaptan",
        rank: "Kaptan (Master)",
        responsibility: "Geminin en üst amiri; seyir, güvenlik, yük ve idari tüm kararlar.",
        reportsTo: "Şirket",
        alwaysDuties: [
          "Gemi emniyetinin korunması ve ISM/ISPS gerekliliklerinin eksiksiz uygulanması",
          "Seyir planlarının onayı ve risk değerlendirmelerinin sürekli güncel tutulması",
          "Acil durumlarda komuta ve kontrolün sağlanması; muster ve alarm prosedürlerinin çalıştırılması",
        ],
        generalTasks: [
          "Kaptan günlükleri, log kayıtları ve şirket yazışmalarının yürütülmesi",
          "Klas, liman devleti ve bayrak devleti denetimlerinde tüm hazırlıkların koordine edilmesi",
          "Yük operasyonlarının güvenli ve çevresel mevzuata uygun yürütülmesinin gözetimi",
          "Kadro yönetimi, eğitim planları ve performans değerlendirmelerinin yapılması",
        ],
      },
      {
        slug: "birinci-zabit",
        rank: "Birinci Zabit (Chief Officer)",
        responsibility: "Güverte departmanı yöneticisi; yük operasyonları, emniyet ekipmanları, ISM/ISPS kayıtları.",
        reportsTo: "Kaptan",
        alwaysDuties: [
          "Güverte emniyet turu ve çalışma izinlerinin (PTW) kontrolü",
          "Can kurtarma ve yangınla mücadele ekipmanlarının hazır olduğunun doğrulanması",
          "Yük operasyonlarında emniyetli yükleme/boşaltma parametrelerinin izlenmesi",
        ],
        generalTasks: [
          "Bakım planlaması (PMS) ve güverte bakım programlarının yürütülmesi",
          "Günlük operasyon toplantıları ve risk değerlendirmelerinin hazırlanması",
          "Güverte vardiya çizelgelerinin ve eğitim tatbikatlarının organizasyonu",
          "Ballast planlarının ve stabilite girişlerinin kontrolü",
        ],
      },
      {
        slug: "ikinci-zabit",
        rank: "İkinci Zabit (Second Officer)",
        responsibility: "Seyir planı, harita ve yayınların güncellemesi, köprüüstü vardiyaları, GMDSS sorumlusu.",
        reportsTo: "Kaptan",
        alwaysDuties: [
          "GMDSS teçhizatının günlük kontrolleri ve seyir uyarılarının takibi",
          "Vardiya öncesi seyir planı doğrulamaları ve ekipmana ait emniyet kontrolleri",
          "Harita ve yayınların süreklilik kontrolü; köprüüstü kayıtlarının eksiksiz tutulması",
        ],
        generalTasks: [
          "Passage plan hazırlığı, rota optimizasyonu ve ETA güncellemeleri",
          "Meteoroloji, NAVTEX ve ECDIS alarmlarının değerlendirilmesi",
          "Köprüüstü bakım listelerinin ve kronometre/seyir cihazı kalibrasyonlarının takibi",
          "Köprüüstü ekibinin BRM ve alarm prosedürleri konusunda eğitilmesi",
        ],
      },
      {
        slug: "ucuncu-zabit",
        rank: "Üçüncü Zabit (Third Officer)",
        responsibility: "Emniyet ekipmanlarının günlük kontrolleri, köprüüstü vardiyaları ve mustering listeleri.",
        reportsTo: "Birinci Zabit",
        alwaysDuties: [
          "Günlük köprüüstü ve seyir ekipmanı kontrollerinin yapılması",
          "Yaşam mahalli ve güverte emniyet turu; kapı, ışık ve alarm kontrolleri",
          "Muster listelerinin güncel tutulması ve acil durum ekipman sayımlarının yapılması",
        ],
        generalTasks: [
          "Emniyet kayıtlarının (weekly/monthly check list) eksiksiz doldurulması",
          "Tatbikat hazırlıkları, acil durum ekipman testleri ve raporlaması",
          "Çapa, demir taraması ve manevra hazırlıklarında destek",
          "Köprüüstü stoklarının (bayrak, flama, sinyal fişekleri) takip edilmesi",
        ],
      },
      {
        slug: "reis-bosun",
        rank: "Reis / Bosun",
        responsibility: "Güverte tayfalarının lideri; bakım planlarının uygulanması ve güverte operasyonlarının koordinasyonu.",
        reportsTo: "Birinci Zabit",
        alwaysDuties: [
          "Günlük iş/emniyet toplantılarında ekip briefingi ve PPE kontrolleri",
          "Güverte temizlik ve güvenlik düzeninin sürekli kontrolü",
          "Yükleme-boşaltma ve halat operasyonlarında güvenlik gözlemi",
        ],
        generalTasks: [
          "Koruyucu boya, halat, tel ve güverte donanımlarının bakımının organize edilmesi",
          "Acemilik eğitimlerinin desteklenmesi ve işbaşı risk değerlendirmelerinin iletilmesi",
          "Emniyetli erişim, merdiven ve iskele kurulumlarının kontrol edilmesi",
          "Atık, sintine ve güverte düzeni kayıtlarının tutulmasına yardımcı olunması",
        ],
      },
      {
        slug: "ustagemici",
        rank: "Usta Gemici & Gemiciler",
        responsibility: "Güverte vardiyaları, halat operasyonu, yük güverte güvenlik ve bakım işleri.",
        reportsTo: "Reis",
        alwaysDuties: [
          "Vardiya sırasında çevre güvenliği, seyir nöbetleri ve lookout görevlerinin yürütülmesi",
          "PPE kullanımı, kayma/düşme risklerine karşı güverte temizliğinin sürdürülmesi",
          "Manevra ve yük operasyonlarında verilen emniyet komutlarına uyum",
        ],
        generalTasks: [
          "Boyama, yıkama, halat bakımı ve çelik tel kontrollerinin yapılması",
          "Iskele, merdiven ve güvenlik bariyerlerinin kurulmasına destek",
          "Acil durum ekipmanlarının yerlerinin ve kullanımının öğrenilmesi",
          "Limanda ve seyirde köprüüstü iletişimlerine destek verilmesi",
        ],
      },
      {
        slug: "guverte-stajyer",
        rank: "Stajyer Zabiti / Güverte Stajyeri",
        responsibility: "Seyir ve operasyon süreçlerine destek; eğitim amaçlı görevler.",
        reportsTo: "Kaptan",
        alwaysDuties: [
          "Eğitmen zabit gözetiminde vardiya disiplinine ve emniyet kurallarına uymak",
          "Günlük öğrenme hedeflerini ve gözlemlerini kayıt altına almak",
          "Tatbikatlarda muster ve görev istasyonlarını takip etmek",
        ],
        generalTasks: [
          "Harita, yayın ve seyir planı hazırlıklarına destek olmak",
          "Bakım ve güverte operasyonlarını gözlemleyerek raporlamak",
          "Güvenlik turu, ISM dokümantasyonu ve PTW süreçlerini öğrenmek",
          "Kaptan veya zabit tarafından verilen eğitim modüllerini tamamlamak",
        ],
      },
    ],
  },
  {
    department: "Makine / Teknik",
    focus: "Ana makine, yardımcı sistemler ve enerji yönetimi",
    colorCode: "MAKİNE",
    roles: [
      {
        slug: "bas-muhendis",
        rank: "Baş Mühendis (Chief Engineer)",
        responsibility: "Makine departmanı amiri; enerji, bakım stratejisi ve emniyetli operasyon.",
        reportsTo: "Kaptan",
        alwaysDuties: [
          "Ana makine, yardımcı sistemler ve emniyet cihazlarının çalışma sürekliliğinin sağlanması",
          "Makine dairesi emniyet turları ve sıcak çalışma izinlerinin kontrolü",
          "Acil durumda güç dağılımı ve yangınla mücadele planlarının yönetilmesi",
        ],
        generalTasks: [
          "PMS uygulamaları, yedek parça stok kontrolü ve yakıt/smadde raporlaması",
          "Bunker, transfer ve sludge operasyonlarının emniyetli şekilde planlanması",
          "Teknik kayıtların, logların ve sörvey hazırlıklarının organize edilmesi",
          "Makine personeli eğitimleri ve yetkinlik planlarının hazırlanması",
        ],
      },
      {
        slug: "ikinci-muhendis",
        rank: "İkinci Mühendis (Second Engineer)",
        responsibility: "Günlük makina operasyonu, PMS uygulamaları, yakıt transferi ve teknik raporlama.",
        reportsTo: "Baş Mühendis",
        alwaysDuties: [
          "Vardiya devri öncesi ekipman kontrolleri ve yağlama/güvenlik sistemlerinin doğrulanması",
          "Makine günlüklerinin düzenli tutulması ve tüketim kayıtlarının izlenmesi",
          "PMS iş emirlerinin dağıtılması ve sahada iş güvenliği gözetimi",
        ],
        generalTasks: [
          "Bunker ve yakıt transferlerinde numune alma, densite ve sıcaklık kayıtları",
          "Kazan, separatör ve yardımcı makine bakımlarının planlanması",
          "Sludge, bilge ve çevresel deşarj kayıtlarının hazırlanması",
          "Makine personeli vardiya çizelgeleri ve eğitimlerinin koordine edilmesi",
        ],
      },
      {
        slug: "ucuncu-muhendis",
        rank: "Üçüncü/Dördüncü Mühendis",
        responsibility: "Aux makineler, kazan, safra ve seperatör bakımları; vardiya mühendisliği.",
        reportsTo: "İkinci Mühendis",
        alwaysDuties: [
          "Vardiya sırasında makine parametrelerinin izlenmesi ve anormalliklerin raporlanması",
          "Emniyet sistemleri (LO, FO, FO heater, bilge, alarm) testlerinin yapılması",
          "Sıcak çalışma ve izole çalışma izinlerinde kilitleme/etiketleme (LOTO) kurallarına uyum",
        ],
        generalTasks: [
          "Pompalar, kompresörler, separatör ve kazan yardımcılarının rutin bakımlarının yapılması",
          "Safra ve transfer operasyonlarında valf ve seviye kontrollerine destek",
          "Teknik logların düzenli güncellenmesi ve sarf malzeme takibi",
          "Vardiya mühendisliği görevlerinde önleyici bakım uygulamaları",
        ],
      },
      {
        slug: "eto",
        rank: "Elektrik Zabiti (ETO)",
        responsibility: "Elektrik-elektronik sistemler, köprüüstü cihazları, alarm ve otomasyon bakımı.",
        reportsTo: "Baş Mühendis",
        alwaysDuties: [
          "Güç dağıtım panoları ve acil güç kaynaklarının emniyetli durumda tutulması",
          "Alarm, otomasyon ve yangın algılama sistemlerinin günlük testlerinin yapılması",
          "Elektrik çalışmalarında izolasyon, kilitleme ve topraklama kontrollerinin sağlanması",
        ],
        generalTasks: [
          "Köprüüstü seyrüsefer cihazları, radar, ECDIS ve haberleşme ekipmanlarının bakımı",
          "Jeneratör, batarya, UPS ve aydınlatma sistemlerinin periyodik kontrolleri",
          "Yedek parça ve sarf malzeme stoklarının takibi; kritik spares listelerinin güncellenmesi",
          "Elektrik arızalarında root-cause analizi ve önleyici aksiyon planlarının hazırlanması",
        ],
      },
      {
        slug: "yagci-fitter",
        rank: "Yağcı / Fitter / Silici",
        responsibility: "Makine dairesi vardiyaları, yağlama ve bakım işleri, kaynak ve metal işleri desteği.",
        reportsTo: "İkinci Mühendis",
        alwaysDuties: [
          "Vardiya sırasında yağlama devreleri, sızıntılar ve sıcaklıkların kontrolü",
          "Temizlik, dökülme önleme ve kayma/düşme risklerine karşı düzenin sağlanması",
          "Çalışma izni, PPE ve izolasyon kurallarına uygun hareket edilmesi",
        ],
        generalTasks: [
          "Filtre temizliği, yağ değişimi ve temel bakım işlerinde mühendis desteği",
          "Kaynak ve metal işlerinde emniyet tedbirlerinin alınarak uygulanması",
          "Makine dairesi stoklarının, yağ ve kimyasal seviyelerinin raporlanması",
          "Acil durum ekipmanlarının yer ve kullanımının öğrenilmesi",
        ],
      },
      {
        slug: "makine-stajyer",
        rank: "Makine Stajyeri",
        responsibility: "Makine vardiyalarına destek, sistem kontrolleri ve bakım süreçlerine katılım.",
        reportsTo: "Baş Mühendis",
        alwaysDuties: [
          "Gözetmen mühendis eşliğinde vardiya güvenliği ve LOTO kurallarına uymak",
          "Günlük öğrenme raporlarını ve gözlem notlarını doldurmak",
          "Acil durum tahliye yolları ve muster noktalarını bilmek",
        ],
        generalTasks: [
          "Makine günlük kontrollerine, yağ seviye kontrollerine destek olmak",
          "Bakım faaliyetlerini gözlemlemek ve parçaların isimlerini öğrenmek",
          "PMS, yedek parça ve teknik çizimlerin nasıl okunduğunu çalışmak",
          "Baş Mühendis tarafından verilen eğitim modüllerini tamamlamak",
        ],
      },
    ],
  },
  {
    department: "İkmal / Yaşam Mahalli",
    focus: "Kumanya, ikmal, gemi içi düzen ve mürettebat hizmetleri",
    colorCode: "IKMAL",
    roles: [
      {
        slug: "asci",
        rank: "Aşçı (Cook)",
        responsibility: "Gemi kumanyasının yönetimi, yemeklerin hazırlanması ve gıda hijyeninin sağlanması.",
        reportsTo: "Kaptan",
        alwaysDuties: [
          "Gıda güvenliği, soğuk zincir ve temizlik standartlarının korunması",
          "Alerjen listelerinin ve özel diyetlerin gözetilmesi",
          "Mutfak yangın emniyeti ve ekipmanlarının çalışır durumda tutulması",
        ],
        generalTasks: [
          "Kumanya stok takibi, günlük/haftalık menü planlaması ve tedarik taleplerinin hazırlanması",
          "Mutfak ve kuru erzak depolarının düzeninin sağlanması",
          "Gemi doktoru veya sorumlu zabit ile sağlık-hijyen kontrollerinin yürütülmesi",
          "Atık gıda ve yağların çevre prosedürlerine uygun bertarafının organize edilmesi",
        ],
      },
      {
        slug: "kamarot",
        rank: "Kamarot / Steward",
        responsibility: "Yaşam mahalli düzeni, kumanya servisleri, vardiya ve temizlik planlarının uygulanması.",
        reportsTo: "Aşçı",
        alwaysDuties: [
          "Hijyen ve temizlik kurallarına uymak, kayma/düşme risklerini azaltmak",
          "Yangın, acil çıkış ve güvenlik ekipman yollarının açık tutulması",
          "Servis sırasında sıcaklık ve gıda güvenliği kurallarının izlenmesi",
        ],
        generalTasks: [
          "Kamaralar, ortak alanlar ve ofislerin günlük temizlik ve çarşaf değişimlerinin yapılması",
          "Yemek servisi hazırlıkları, bulaşık ve depo düzeninin sağlanması",
          "Çamaşırhane ve sarf malzeme stok takibinin yapılması",
          "Tatbikatlarda muster istasyonlarına katılım ve misafir yönetiminde destek",
        ],
      },
      {
        slug: "yagli-vardiya-destek",
        rank: "Yağlı Vardiya Destekleri",
        responsibility: "Can salları, yangın ekipmanı ve acil durum istasyonları için ikmal desteği.",
        reportsTo: "Birinci Zabit",
        alwaysDuties: [
          "Acil durum istasyonlarındaki ekipmanların eksiksiz ve kullanılabilir olduğunun kontrolü",
          "İkmal sırasında sıcak çalışma ve yükleme güvenliği prosedürlerine uyum",
          "Kişisel koruyucu donanımların doğru kullanımının sağlanması",
        ],
        generalTasks: [
          "Yangın hortumları, nozüller, can salı ve can yeleği malzemelerinin ikmaline destek",
          "Depolama alanlarının düzeni, raf ve kutu etiketlerinin takibi",
          "Tatbikatlarda ekipman hazırlığı ve dağıtımında yardım",
          "Emniyet ekipman envanterlerinin güncellenmesine katkı",
        ],
      },
    ],
  },
];

export const crewRoleMap = crewHierarchy.reduce<Record<string, CrewRole>>((acc, group) => {
  group.roles.forEach((role) => {
    acc[role.slug] = role;
  });
  return acc;
}, {});
