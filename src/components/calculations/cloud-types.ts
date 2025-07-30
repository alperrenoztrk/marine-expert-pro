export interface CloudType {
  id: string;
  name: string;
  nameTr: string; // Türkçe isim
  code: string;
  mgmCode?: string; // MGM bulut kodu
  emoji: string;
  variant: 'default' | 'warning' | 'danger';
  description: string;
  descriptionTr: string; // Türkçe açıklama
  maritimeImportance: string;
  visibility: string;
  wind: string;
  precipitation: string;
  altitude: string;
  formation: string;
  imageUrl?: string;
}

// MGM (Meteoroloji Genel Müdürlüğü) standartlarına göre bulut tipleri
export const cloudTypes: CloudType[] = [
  // YÜKSEK BULUTLAR (6000m üzeri)
  {
    id: 'cirrus',
    name: 'Cirrus (Ci)',
    nameTr: 'Sirüs',
    code: 'CH 1',
    mgmCode: 'Ci',
    emoji: '🌫️',
    variant: 'default',
    description: 'Thin, wispy strands|High ice crystals',
    descriptionTr: 'İnce, ipliksi|Buz kristalleri',
    maritimeImportance: 'İyi hava belirtisi, 24-48 saat sonra değişim',
    visibility: 'Mükemmel (20+ nm)',
    wind: 'Yüksek irtifa rüzgarı göstergesi',
    precipitation: 'Yok',
    altitude: '6000-12000m',
    formation: 'Yüksek irtifada buz kristalleri'
  },
  {
    id: 'cirrocumulus',
    name: 'Cirrocumulus (Cc)',
    nameTr: 'Sirokümülüs',
    code: 'CH 2',
    mgmCode: 'Cc',
    emoji: '🐚',
    variant: 'default',
    description: 'Small white patches|Fish scales pattern',
    descriptionTr: 'Küçük beyaz lekeler|Balık pulu deseni',
    maritimeImportance: 'Hava değişimi belirtisi',
    visibility: 'İyi (15+ nm)',
    wind: 'Orta (10-20 knot)',
    precipitation: 'Yok',
    altitude: '6000-12000m',
    formation: 'Dalgalı yüksek bulut katmanı'
  },
  {
    id: 'cirrostratus',
    name: 'Cirrostratus (Cs)',
    nameTr: 'Sirostratus',
    code: 'CH 3',
    mgmCode: 'Cs',
    emoji: '🌥️',
    variant: 'default',
    description: 'Thin white veil|Halo around sun',
    descriptionTr: 'İnce beyaz örtü|Güneş halkası',
    maritimeImportance: 'Sıcak cephe yaklaşıyor (12-24 saat)',
    visibility: 'Orta (10-15 nm)',
    wind: 'Artış eğilimi',
    precipitation: '12-24 saat içinde',
    altitude: '6000-12000m',
    formation: 'Geniş buz kristali örtüsü'
  },
  
  // ORTA SEVİYE BULUTLAR (2000-6000m)
  {
    id: 'altocumulus',
    name: 'Altocumulus (Ac)',
    nameTr: 'Altokümülüs',
    code: 'CM 1',
    mgmCode: 'Ac',
    emoji: '☁️',
    variant: 'default',
    description: 'Gray/white patches|Larger than Cc',
    descriptionTr: 'Gri/beyaz yamalar|Cc\'den büyük',
    maritimeImportance: 'Kararsız hava, gök gürültülü fırtına olasılığı',
    visibility: 'Orta (8-12 nm)',
    wind: 'Değişken (10-25 knot)',
    precipitation: 'Olası (öğleden sonra)',
    altitude: '2000-6000m',
    formation: 'Orta seviye konveksiyon'
  },
  {
    id: 'altostratus',
    name: 'Altostratus (As)',
    nameTr: 'Altostratus',
    code: 'CM 2',
    mgmCode: 'As',
    emoji: '🌫️',
    variant: 'warning',
    description: 'Gray sheet|Sun dimly visible',
    descriptionTr: 'Gri tabaka|Güneş zor görünür',
    maritimeImportance: 'Yağış başlangıcı (3-6 saat)',
    visibility: 'Kötü (5-8 nm)',
    wind: 'Artıyor (15-30 knot)',
    precipitation: 'Yakın (3-6 saat)',
    altitude: '2000-6000m',
    formation: 'Kalın su damlacığı katmanı'
  },
  
  // ALÇAK BULUTLAR (0-2000m)
  {
    id: 'cumulus',
    name: 'Cumulus (Cu)',
    nameTr: 'Kümülüs',
    code: 'CL 1',
    mgmCode: 'Cu',
    emoji: '⛅',
    variant: 'default',
    description: 'Puffy cotton|Fair weather',
    descriptionTr: 'Pamuk görünümlü|Güzel hava',
    maritimeImportance: 'İyi hava, hafif türbülans',
    visibility: 'İyi (10+ nm)',
    wind: 'Hafif-orta (5-15 knot)',
    precipitation: 'Yok/çok az',
    altitude: '600-2000m',
    formation: 'Termal yükselme'
  },
  {
    id: 'cumulonimbus',
    name: 'Cumulonimbus (Cb)',
    nameTr: 'Kümülonimbüs',
    code: 'CL 9',
    mgmCode: 'Cb',
    emoji: '⛈️',
    variant: 'danger',
    description: 'Towering anvil|Thunderstorm',
    descriptionTr: 'Örs şeklinde|Gök gürültülü fırtına',
    maritimeImportance: 'TEHLİKE! Şiddetli fırtına, dolu, hortum',
    visibility: 'Çok kötü (0-2 nm)',
    wind: 'Şiddetli (40+ knot)',
    precipitation: 'Şiddetli',
    altitude: '600-12000m+',
    formation: 'Güçlü dikey gelişim'
  },
  {
    id: 'stratus',
    name: 'Stratus (St)',
    nameTr: 'Stratus',
    code: 'CL 6',
    mgmCode: 'St',
    emoji: '🌫️',
    variant: 'warning',
    description: 'Gray layer|Low ceiling',
    descriptionTr: 'Gri tabaka|Alçak tavan',
    maritimeImportance: 'Düşük görüş, sis riski',
    visibility: 'Kötü (1-5 nm)',
    wind: 'Hafif (5-10 knot)',
    precipitation: 'Çisenti/hafif',
    altitude: '0-2000m',
    formation: 'Stabil hava katmanı'
  },
  {
    id: 'stratocumulus',
    name: 'Stratocumulus (Sc)',
    nameTr: 'Stratokümülüs',
    code: 'CL 5',
    mgmCode: 'Sc',
    emoji: '☁️',
    variant: 'default',
    description: 'Low gray patches|Lumpy layer',
    descriptionTr: 'Alçak gri yamalar|Yumrulu tabaka',
    maritimeImportance: 'Kararlı hava, hafif yağış olası',
    visibility: 'Orta (5-10 nm)',
    wind: 'Orta (10-20 knot)',
    precipitation: 'Hafif/ara sıra',
    altitude: '600-2000m',
    formation: 'Alçak seviye kararsızlık'
  },
  {
    id: 'nimbostratus',
    name: 'Nimbostratus (Ns)',
    nameTr: 'Nimbostratus',
    code: 'CM 3',
    mgmCode: 'Ns',
    emoji: '🌧️',
    variant: 'warning',
    description: 'Dark, thick layer|Continuous rain',
    descriptionTr: 'Koyu, kalın tabaka|Sürekli yağış',
    maritimeImportance: 'Uzun süreli yağış, kötü görüş',
    visibility: 'Kötü (2-5 nm)',
    wind: 'Orta-güçlü (15-30 knot)',
    precipitation: 'Sürekli',
    altitude: '600-6000m',
    formation: 'Kalın yağış bulutu'
  }
];

// MGM bulut kodlarına göre hızlı erişim
export const cloudTypeByMGMCode: Record<string, CloudType> = cloudTypes.reduce((acc, cloud) => {
  if (cloud.mgmCode) {
    acc[cloud.mgmCode] = cloud;
  }
  return acc;
}, {} as Record<string, CloudType>);

// Denizcilik tehlike seviyesine göre sıralama
export const cloudTypesByDanger = [...cloudTypes].sort((a, b) => {
  const dangerOrder = { danger: 0, warning: 1, default: 2 };
  return dangerOrder[a.variant] - dangerOrder[b.variant];
});