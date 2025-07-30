export interface CloudType {
  id: string;
  name: string;
  nameTr: string;
  code: string;
  mgmCode: string;
  level: 'low' | 'middle' | 'high' | 'vertical';
  altitude: string;
  altitudeFt: string;
  description: string;
  descriptionTr: string;
  characteristics: string[];
  maritimeImportance: string;
  visibility: string;
  wind: string;
  precipitation: string;
  danger: 'low' | 'medium' | 'high';
  imageUrl?: string;
}

// MGM Bulut Kataloğu'na göre tüm bulut tipleri
export const cloudTypes: CloudType[] = [
  // ALÇAK BULUTLAR (0-2 km)
  {
    id: 'stratus',
    name: 'Stratus',
    nameTr: 'Stratus',
    code: 'St',
    mgmCode: 'CL 6',
    level: 'low',
    altitude: '0-2 km',
    altitudeFt: '0-6,500 ft',
    description: 'Gray layer cloud with uniform base',
    descriptionTr: 'Düzgün tabanlı gri tabaka bulut',
    characteristics: [
      'Düzgün gri tabaka',
      'Güneşi tamamen kapatır',
      'Sis benzeri görünüm',
      'Yere yakın oluşur'
    ],
    maritimeImportance: 'Görüş mesafesini ciddi azaltır, deniz sisi riski',
    visibility: 'Çok kötü (< 1 km)',
    wind: 'Hafif (< 10 knot)',
    precipitation: 'Çisenti veya hafif kar',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/stratus.jpg'
  },
  {
    id: 'stratocumulus',
    name: 'Stratocumulus',
    nameTr: 'Stratokümülüs',
    code: 'Sc',
    mgmCode: 'CL 5',
    level: 'low',
    altitude: '0.5-2 km',
    altitudeFt: '1,600-6,500 ft',
    description: 'Low lumpy gray or white patches in layers',
    descriptionTr: 'Alçak, yumrulu gri veya beyaz tabakalar',
    characteristics: [
      'Gri veya beyazımsı yumrular',
      'Aralarından mavi gökyüzü görülebilir',
      'Dalga veya sıra şeklinde',
      'En yaygın bulut tipi'
    ],
    maritimeImportance: 'Değişken hava koşullarının göstergesi',
    visibility: 'Orta (3-10 km)',
    wind: 'Orta (10-20 knot)',
    precipitation: 'Hafif yağmur veya kar serpintisi',
    danger: 'low',
    imageUrl: '/assets/mgm-clouds/stratocumulus.jpg'
  },
  {
    id: 'cumulus',
    name: 'Cumulus',
    nameTr: 'Kümülüs',
    code: 'Cu',
    mgmCode: 'CL 1-2',
    level: 'low',
    altitude: '0.5-2 km',
    altitudeFt: '1,600-6,500 ft',
    description: 'Puffy cotton-like fair weather clouds',
    descriptionTr: 'Pamuk görünümlü güzel hava bulutları',
    characteristics: [
      'Pamuk topları şeklinde',
      'Beyaz ve kabarık',
      'Düz taban, kubbe tepeli',
      'Güneşli günlerde oluşur'
    ],
    maritimeImportance: 'İyi hava koşullarının göstergesi',
    visibility: 'Mükemmel (> 10 km)',
    wind: 'Hafif-orta (5-15 knot)',
    precipitation: 'Genelde yok',
    danger: 'low',
    imageUrl: '/assets/mgm-clouds/cumulus.jpg'
  },
  {
    id: 'cumulonimbus',
    name: 'Cumulonimbus',
    nameTr: 'Kümülonimbüs',
    code: 'Cb',
    mgmCode: 'CL 3,9',
    level: 'vertical',
    altitude: '0.5-16 km',
    altitudeFt: '1,600-52,000 ft',
    description: 'Towering storm cloud with anvil top',
    descriptionTr: 'Örs tepeli dev fırtına bulutu',
    characteristics: [
      'Çok yüksek dikey gelişim',
      'Örs şeklinde tepe',
      'Koyu gri veya siyah taban',
      'Şimşek ve gök gürültüsü'
    ],
    maritimeImportance: 'Şiddetli fırtına, yıldırım tehlikesi, su hortumu riski',
    visibility: 'Çok kötü (< 1 km)',
    wind: 'Çok güçlü (> 35 knot)',
    precipitation: 'Şiddetli yağmur, dolu, kar',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/cumulonimbus.jpg'
  },
  {
    id: 'nimbostratus',
    name: 'Nimbostratus',
    nameTr: 'Nimbostratüs',
    code: 'Ns',
    mgmCode: 'CM 2',
    level: 'middle',
    altitude: '2-7 km',
    altitudeFt: '6,500-23,000 ft',
    description: 'Dark, thick cloud producing continuous rain',
    descriptionTr: 'Sürekli yağmur getiren koyu, kalın bulut',
    characteristics: [
      'Koyu gri, kalın tabaka',
      'Güneşi tamamen kapatır',
      'Taban belirsiz',
      'Sürekli yağış'
    ],
    maritimeImportance: 'Uzun süreli yağış, kötü görüş, zor seyir koşulları',
    visibility: 'Kötü (1-3 km)',
    wind: 'Orta-güçlü (15-30 knot)',
    precipitation: 'Sürekli orta/şiddetli yağmur',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/nimbostratus.jpg'
  },

  // ORTA BULUTLAR (2-7 km)
  {
    id: 'altostratus',
    name: 'Altostratus',
    nameTr: 'Altostratüs',
    code: 'As',
    mgmCode: 'CM 1',
    level: 'middle',
    altitude: '2-7 km',
    altitudeFt: '6,500-23,000 ft',
    description: 'Gray sheet often covering entire sky',
    descriptionTr: 'Gökyüzünü kaplayan gri örtü',
    characteristics: [
      'Gri veya mavi-gri tabaka',
      'Güneş belirsiz görünür',
      'Gölge oluşturmaz',
      'Cephe yaklaşımının habercisi'
    ],
    maritimeImportance: '12-24 saat içinde kötü hava, cephe yaklaşıyor',
    visibility: 'Orta (5-10 km)',
    wind: 'Artan (15-25 knot)',
    precipitation: '12 saat içinde başlar',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/altostratus.jpg'
  },
  {
    id: 'altocumulus',
    name: 'Altocumulus',
    nameTr: 'Altokümülüs',
    code: 'Ac',
    mgmCode: 'CM 3-9',
    level: 'middle',
    altitude: '2-7 km',
    altitudeFt: '6,500-23,000 ft',
    description: 'Gray or white patches in waves or bands',
    descriptionTr: 'Dalgalar veya bantlar halinde gri/beyaz yamalar',
    characteristics: [
      'Gri veya beyaz yamalar',
      'Dalgalar veya sıralar halinde',
      'Küçük gölgeler oluşturur',
      'Koyun sürüsü görünümü'
    ],
    maritimeImportance: 'Hava değişikliği yaklaşıyor, 24 saat içinde yağış olası',
    visibility: 'İyi (8-15 km)',
    wind: 'Orta (10-25 knot)',
    precipitation: '24 saat içinde olası',
    danger: 'low',
    imageUrl: '/assets/mgm-clouds/altocumulus.jpg'
  },

  // YÜKSEK BULUTLAR (5-13 km)
  {
    id: 'cirrus',
    name: 'Cirrus',
    nameTr: 'Sirrüs',
    code: 'Ci',
    mgmCode: 'CH 1-4',
    level: 'high',
    altitude: '5-13 km',
    altitudeFt: '16,500-42,500 ft',
    description: 'Thin, wispy, hair-like ice clouds',
    descriptionTr: 'İnce, tüy gibi, ipliksi buz bulutları',
    characteristics: [
      'İnce, beyaz lifler',
      'Tüy veya saç teli görünümü',
      'Buz kristallerinden oluşur',
      'Rüzgar yönünü gösterir'
    ],
    maritimeImportance: '48-72 saat sonra hava değişimi, cephe uzakta',
    visibility: 'Mükemmel (> 20 km)',
    wind: 'Üst seviye güçlü',
    precipitation: 'Yok (48-72 saat sonra olası)',
    danger: 'low',
    imageUrl: '/assets/mgm-clouds/cirrus.jpg'
  },
  {
    id: 'cirrocumulus',
    name: 'Cirrocumulus',
    nameTr: 'Sirrokümülüs',
    code: 'Cc',
    mgmCode: 'CH 5-9',
    level: 'high',
    altitude: '5-13 km',
    altitudeFt: '16,500-42,500 ft',
    description: 'Small white patches in ripples (mackerel sky)',
    descriptionTr: 'Küçük beyaz benekler (balık pulu gökyüzü)',
    characteristics: [
      'Küçük beyaz benekler',
      'Balık pulu deseni',
      'Gölge oluşturmaz',
      'İnce ve yarı saydam'
    ],
    maritimeImportance: 'Hava değişikliği belirtisi, "balık pulu bulut, üç gün sonra yağmur"',
    visibility: 'Mükemmel (> 20 km)',
    wind: 'Değişken',
    precipitation: '24-48 saat içinde olası',
    danger: 'low',
    imageUrl: '/assets/mgm-clouds/cirrocumulus.jpg'
  },
  {
    id: 'cirrostratus',
    name: 'Cirrostratus',
    nameTr: 'Sirrostratüs',
    code: 'Cs',
    mgmCode: 'CH',
    level: 'high',
    altitude: '5-13 km',
    altitudeFt: '16,500-42,500 ft',
    description: 'Thin sheet creating halos around sun/moon',
    descriptionTr: 'Güneş/ay halesi oluşturan ince tabaka',
    characteristics: [
      'Beyazımsı ince örtü',
      'Güneş/ay halesi oluşturur',
      'Tüm gökyüzünü kaplar',
      'Yarı saydam'
    ],
    maritimeImportance: 'Hale görülmesi yaklaşan fırtınanın habercisi',
    visibility: 'İyi (10-20 km)',
    wind: 'Güçleniyor',
    precipitation: '12-24 saat içinde',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/cirrostratus.jpg'
  },

  // ÖZEL BULUTLAR
  {
    id: 'mammatus',
    name: 'Mammatus',
    nameTr: 'Mammatüs',
    code: 'Mam',
    mgmCode: 'Özel',
    level: 'low',
    altitude: 'Değişken',
    altitudeFt: 'Variable',
    description: 'Pouch-like hanging protuberances',
    descriptionTr: 'Kese şeklinde sarkan çıkıntılar',
    characteristics: [
      'Ters yumrular',
      'Cb altında oluşur',
      'Şiddetli türbülans belirtisi',
      'Nadir görülür'
    ],
    maritimeImportance: 'Şiddetli fırtına ve türbülans göstergesi',
    visibility: 'Değişken',
    wind: 'Çok değişken',
    precipitation: 'Yakında şiddetli',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/mammatus.jpg'
  },
  {
    id: 'lenticularis',
    name: 'Lenticularis',
    nameTr: 'Lentikülaris',
    code: 'Len',
    mgmCode: 'Ac len',
    level: 'middle',
    altitude: '2-7 km',
    altitudeFt: '6,500-23,000 ft',
    description: 'Smooth lens or almond shaped',
    descriptionTr: 'Mercek veya badem şeklinde',
    characteristics: [
      'Mercek şekilli',
      'Dağ dalgası göstergesi',
      'Hareketsiz görünür',
      'Güçlü rüzgar belirtisi'
    ],
    maritimeImportance: 'Dağ yakınlarında çok güçlü rüzgarlar',
    visibility: 'İyi',
    wind: 'Çok güçlü (yerel)',
    precipitation: 'Genelde yok',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/lenticularis.jpg'
  },
  {
    id: 'castellanus',
    name: 'Castellanus',
    nameTr: 'Kastellanüs',
    code: 'Cas',
    mgmCode: 'Ac cas',
    level: 'middle',
    altitude: '2-7 km',
    altitudeFt: '6,500-23,000 ft',
    description: 'Turret-shaped cloud tops',
    descriptionTr: 'Kule şeklinde bulut tepeleri',
    characteristics: [
      'Kule şeklinde tepeler',
      'Dikey gelişim',
      'Kararsız hava belirtisi',
      'Sabah görülürse öğleden sonra fırtına'
    ],
    maritimeImportance: 'Gök gürültülü fırtına öncüsü',
    visibility: 'İyi',
    wind: 'Artan',
    precipitation: '6-12 saat içinde',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/castellanus.jpg'
  },
  {
    id: 'fractus',
    name: 'Fractus',
    nameTr: 'Fraktüs',
    code: 'Fra',
    mgmCode: 'St fra, Cu fra',
    level: 'low',
    altitude: '0-2 km',
    altitudeFt: '0-6,500 ft',
    description: 'Ragged cloud fragments',
    descriptionTr: 'Parçalanmış bulut kırıntıları',
    characteristics: [
      'Düzensiz parçalar',
      'Hızlı hareket',
      'Yağış altında oluşur',
      'Rüzgarlı hava belirtisi'
    ],
    maritimeImportance: 'Güçlü rüzgar ve türbülans',
    visibility: 'Değişken',
    wind: 'Güçlü',
    precipitation: 'Devam eden',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/fractus.jpg'
  },
  {
    id: 'tuba',
    name: 'Tuba',
    nameTr: 'Tuba',
    code: 'Tub',
    mgmCode: 'Özel',
    level: 'low',
    altitude: 'Cb tabanı',
    altitudeFt: 'Cb base',
    description: 'Funnel cloud (tornado precursor)',
    descriptionTr: 'Huni bulutu (hortum öncüsü)',
    characteristics: [
      'Huni şeklinde',
      'Cb'den sarkar',
      'Döner',
      'Hortum öncüsü'
    ],
    maritimeImportance: 'Su hortumu tehlikesi! Derhal uzaklaş',
    visibility: 'Çok kötü',
    wind: 'Döner, çok şiddetli',
    precipitation: 'Şiddetli',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/tuba.jpg'
  },
  {
    id: 'arcus',
    name: 'Arcus',
    nameTr: 'Arkus',
    code: 'Arc',
    mgmCode: 'Özel',
    level: 'low',
    altitude: '0.5-2 km',
    altitudeFt: '1,600-6,500 ft',
    description: 'Shelf or roll cloud',
    descriptionTr: 'Raf veya rulo bulut',
    characteristics: [
      'Yatay rulo şekli',
      'Fırtına önünde',
      'Hızlı yaklaşır',
      'Ani rüzgar artışı'
    ],
    maritimeImportance: 'Squall line yaklaşıyor, ani şiddetli rüzgar',
    visibility: 'Hızla azalır',
    wind: 'Ani artış (> 40 knot)',
    precipitation: 'Hemen arkasında',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/arcus.jpg'
  },
  {
    id: 'asperitas',
    name: 'Asperitas',
    nameTr: 'Asperitas',
    code: 'Asp',
    mgmCode: 'Özel',
    level: 'low',
    altitude: '1-2 km',
    altitudeFt: '3,300-6,500 ft',
    description: 'Wave-like undulations',
    descriptionTr: 'Dalga benzeri dalgalanmalar',
    characteristics: [
      'Dalgalı taban',
      'Deniz dalgası görünümü',
      'Nadir',
      'Türbülans belirtisi'
    ],
    maritimeImportance: 'Atmosferik kararsızlık, değişken koşullar',
    visibility: 'Orta',
    wind: 'Değişken',
    precipitation: 'Olası',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/asperitas.jpg'
  },
  {
    id: 'pyrocumulus',
    name: 'Pyrocumulus',
    nameTr: 'Pirokümülüs',
    code: 'Pyr',
    mgmCode: 'Özel',
    level: 'vertical',
    altitude: '0-8 km',
    altitudeFt: '0-26,000 ft',
    description: 'Fire-induced cumulus',
    descriptionTr: 'Yangın kaynaklı kümülüs',
    characteristics: [
      'Yangın üzerinde oluşur',
      'Hızlı dikey gelişim',
      'Gri-kahverengi',
      'Kendi hava sistemini oluşturur'
    ],
    maritimeImportance: 'Kıyı yangınlarında tehlikeli koşullar',
    visibility: 'Çok kötü (duman)',
    wind: 'Değişken, güçlü',
    precipitation: 'Nadir, kül yağışı',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/pyrocumulus.jpg'
  },
  {
    id: 'contrails',
    name: 'Contrails',
    nameTr: 'Kondensasyon İzi',
    code: 'Con',
    mgmCode: 'Yapay',
    level: 'high',
    altitude: '8-12 km',
    altitudeFt: '26,000-40,000 ft',
    description: 'Aircraft condensation trails',
    descriptionTr: 'Uçak kondensasyon izleri',
    characteristics: [
      'Düz çizgiler',
      'Yayılabilir',
      'Nem göstergesi',
      'Yapay bulut'
    ],
    maritimeImportance: 'Üst atmosfer nem durumu hakkında bilgi',
    visibility: 'Etkilemez',
    wind: 'Üst seviye',
    precipitation: 'Yok',
    danger: 'low',
    imageUrl: '/assets/mgm-clouds/contrails.jpg'
  },
  {
    id: 'virga',
    name: 'Virga',
    nameTr: 'Virga',
    code: 'Vir',
    mgmCode: 'Özel',
    level: 'middle',
    altitude: 'Bulut tabanı altı',
    altitudeFt: 'Below cloud base',
    description: 'Rain that evaporates before reaching ground',
    descriptionTr: 'Yere ulaşmadan buharlaşan yağış',
    characteristics: [
      'Sarkan perdeler',
      'Yere ulaşmaz',
      'Kuru hava belirtisi',
      'Görsel yanıltıcı'
    ],
    maritimeImportance: 'Kuru hava, ancak mikro patlama riski',
    visibility: 'İyi',
    wind: 'Ani değişimler olası',
    precipitation: 'Yere ulaşmaz',
    danger: 'medium',
    imageUrl: '/assets/mgm-clouds/virga.jpg'
  },
  {
    id: 'kelvin-helmholtz',
    name: 'Kelvin-Helmholtz',
    nameTr: 'Kelvin-Helmholtz',
    code: 'KH',
    mgmCode: 'Özel',
    level: 'middle',
    altitude: '2-7 km',
    altitudeFt: '6,500-23,000 ft',
    description: 'Wave clouds resembling ocean waves',
    descriptionTr: 'Okyanus dalgasına benzeyen bulutlar',
    characteristics: [
      'Kırılan dalga şekli',
      'Çok nadir',
      'Rüzgar kesmesi',
      'Kısa ömürlü'
    ],
    maritimeImportance: 'Şiddetli rüzgar kesmesi ve türbülans',
    visibility: 'İyi',
    wind: 'Kesme (shear)',
    precipitation: 'Yok',
    danger: 'high',
    imageUrl: '/assets/mgm-clouds/kelvin-helmholtz.jpg'
  }
];

// Tehlike seviyesine göre sıralama
export const cloudTypesByDanger = [...cloudTypes].sort((a, b) => {
  const dangerOrder = { high: 0, medium: 1, low: 2 };
  return dangerOrder[a.danger] - dangerOrder[b.danger];
});

// Seviyeye göre gruplama
export const cloudTypesByLevel = {
  low: cloudTypes.filter(c => c.level === 'low'),
  middle: cloudTypes.filter(c => c.level === 'middle'),
  high: cloudTypes.filter(c => c.level === 'high'),
  vertical: cloudTypes.filter(c => c.level === 'vertical')
};

// MGM koduna göre hızlı erişim
export const cloudTypeByMGMCode: Record<string, CloudType> = cloudTypes.reduce((acc, cloud) => {
  acc[cloud.mgmCode] = cloud;
  return acc;
}, {} as Record<string, CloudType>);