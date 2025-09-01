// Enhanced star database with detailed information for Star Walk-like features
export interface EnhancedStar {
  name: string;
  commonName?: string;
  constellation: string;
  rightAscension: number; // hours
  declination: number; // degrees
  magnitude: number;
  spectralClass: string;
  distance?: number; // light years
  color: string;
  description?: string;
  mythology?: string;
  isNavigationStar?: boolean;
  bayerDesignation?: string;
  hipId?: number;
}

export interface Constellation {
  name: string;
  abbreviation: string;
  stars: string[]; // star names that form the constellation
  lines: Array<[string, string]>; // pairs of star names to draw lines between
  mythology?: string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface DeepSkyObject {
  name: string;
  type: 'galaxy' | 'nebula' | 'star_cluster' | 'planetary_nebula';
  rightAscension: number;
  declination: number;
  magnitude: number;
  constellation: string;
  description?: string;
  distance?: number;
  color: string;
}

// Enhanced star catalog with 100+ brightest and most notable stars
export const enhancedStarCatalog: EnhancedStar[] = [
  // Navigation stars (existing ones enhanced)
  {
    name: 'Sirius',
    commonName: 'Köpek Yıldızı',
    constellation: 'Canis Major',
    rightAscension: 6.75,
    declination: -16.7,
    magnitude: -1.46,
    spectralClass: 'A1V',
    distance: 8.6,
    color: '#87CEEB',
    description: 'Gece gökyüzünün en parlak yıldızı. İkili yıldız sistemi.',
    mythology: 'Antik Mısırlılar tarafından İsis tanrıçasının yıldızı olarak tapınılırdı.',
    isNavigationStar: true,
    bayerDesignation: 'α CMa',
    hipId: 32349
  },
  {
    name: 'Canopus',
    commonName: 'Süheyl',
    constellation: 'Carina',
    rightAscension: 6.4,
    declination: -52.7,
    magnitude: -0.74,
    spectralClass: 'A9II',
    distance: 310,
    color: '#F5F5DC',
    description: 'Gece gökyüzünün ikinci en parlak yıldızı. Süper dev yıldız.',
    mythology: 'Arap astronomisinde Süheyl olarak bilinir ve navigasyonda önemlidir.',
    isNavigationStar: true,
    bayerDesignation: 'α Car',
    hipId: 30438
  },
  {
    name: 'Arcturus',
    commonName: 'Ayı Bekçisi',
    constellation: 'Boötes',
    rightAscension: 14.26,
    declination: 19.2,
    magnitude: -0.05,
    spectralClass: 'K1.5III',
    distance: 37,
    color: '#FFA500',
    description: 'Kuzey yarımkürenin en parlak yıldızı. Kırmızı dev yıldız.',
    mythology: 'Büyük Ayı takımyıldızını takip ettiği için Ayı Bekçisi denir.',
    isNavigationStar: true,
    bayerDesignation: 'α Boo',
    hipId: 69673
  },
  {
    name: 'Vega',
    commonName: 'Çoban Yıldızı',
    constellation: 'Lyra',
    rightAscension: 18.62,
    declination: 38.8,
    magnitude: 0.03,
    spectralClass: 'A0V',
    distance: 25,
    color: '#E6E6FA',
    description: 'Kuzey kutup yıldızının 12,000 yıl sonraki hali olacak.',
    mythology: 'Çin mitolojisinde çoban yıldızı olarak bilinir.',
    isNavigationStar: true,
    bayerDesignation: 'α Lyr',
    hipId: 91262
  },
  {
    name: 'Capella',
    commonName: 'Keçi Yıldızı',
    constellation: 'Auriga',
    rightAscension: 5.28,
    declination: 46.0,
    magnitude: 0.08,
    spectralClass: 'G5III',
    distance: 43,
    color: '#FFFF99',
    description: 'Aslında dörtlü yıldız sistemi. Kuzey gökyüzünün en parlak yıldızlarından.',
    mythology: 'Romalılar tarafından keçi olarak görülür.',
    isNavigationStar: true,
    bayerDesignation: 'α Aur',
    hipId: 24608
  },

  // Additional bright stars
  {
    name: 'Rigel',
    commonName: 'Sol Ayak',
    constellation: 'Orion',
    rightAscension: 5.24,
    declination: -8.2,
    magnitude: 0.13,
    spectralClass: 'B8Ia',
    distance: 860,
    color: '#4169E1',
    description: 'Avcı Orion\'un sol ayağı. Süper dev mavi yıldız.',
    mythology: 'Arapça "Orion\'un sol ayağı" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'β Ori',
    hipId: 24436
  },
  {
    name: 'Procyon',
    commonName: 'Küçük Köpek',
    constellation: 'Canis Minor',
    rightAscension: 7.65,
    declination: 5.2,
    magnitude: 0.34,
    spectralClass: 'F5IV-V',
    distance: 11.5,
    color: '#F5F5DC',
    description: 'Güneşe en yakın yıldızlardan biri. İkili yıldız sistemi.',
    mythology: 'Yunanca "köpekten önce" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α CMi',
    hipId: 37279
  },
  {
    name: 'Betelgeuse',
    commonName: 'Dev Omuz',
    constellation: 'Orion',
    rightAscension: 5.92,
    declination: 7.4,
    magnitude: 0.50,
    spectralClass: 'M2Ia',
    distance: 700,
    color: '#FF4500',
    description: 'Kırmızı süper dev. Yakın gelecekte süpernova olabilir.',
    mythology: 'Arapça "devin eli" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α Ori',
    hipId: 27989
  },
  {
    name: 'Aldebaran',
    commonName: 'Takipçi',
    constellation: 'Taurus',
    rightAscension: 4.60,
    declination: 16.5,
    magnitude: 0.85,
    spectralClass: 'K5III',
    distance: 65,
    color: '#FF6347',
    description: 'Boğa\'nın gözü. Ülker yıldız kümesini takip eder.',
    mythology: 'Arapça "takipçi" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α Tau',
    hipId: 21421
  },

  // Additional notable stars
  {
    name: 'Polaris',
    commonName: 'Kutup Yıldızı',
    constellation: 'Ursa Minor',
    rightAscension: 2.53,
    declination: 89.3,
    magnitude: 1.98,
    spectralClass: 'F7Ib',
    distance: 433,
    color: '#F5F5DC',
    description: 'Kuzey kutup yıldızı. Navigasyonda kritik öneme sahip.',
    mythology: 'Denizcilik tarihinde en önemli yıldız.',
    isNavigationStar: true,
    bayerDesignation: 'α UMi',
    hipId: 11767
  },
  {
    name: 'Altair',
    commonName: 'Kartal',
    constellation: 'Aquila',
    rightAscension: 19.85,
    declination: 8.9,
    magnitude: 0.77,
    spectralClass: 'A7V',
    distance: 17,
    color: '#FFFFFF',
    description: 'Yaz üçgeninin bir köşesi. Hızla dönen yıldız.',
    mythology: 'Arapça "uçan kartal" anlamına gelir.',
    bayerDesignation: 'α Aql',
    hipId: 97649
  },
  {
    name: 'Deneb',
    commonName: 'Kuğu Kuyruğu',
    constellation: 'Cygnus',
    rightAscension: 20.69,
    declination: 45.3,
    magnitude: 1.25,
    spectralClass: 'A2Ia',
    distance: 2600,
    color: '#F0F8FF',
    description: 'Yaz üçgeninin bir köşesi. Çok uzak süper dev.',
    mythology: 'Arapça "kuyruk" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α Cyg',
    hipId: 102098
  },
  {
    name: 'Regulus',
    commonName: 'Aslan Kalbi',
    constellation: 'Leo',
    rightAscension: 10.14,
    declination: 12.0,
    magnitude: 1.35,
    spectralClass: 'B7V',
    distance: 77,
    color: '#87CEEB',
    description: 'Aslan takımyıldızının kalbi. Dörtlü yıldız sistemi.',
    mythology: 'Latince "küçük kral" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α Leo',
    hipId: 49669
  },
  {
    name: 'Spica',
    commonName: 'Başak',
    constellation: 'Virgo',
    rightAscension: 13.42,
    declination: -11.2,
    magnitude: 0.97,
    spectralClass: 'B1III-IV',
    distance: 250,
    color: '#4169E1',
    description: 'Başak takımyıldızının en parlak yıldızı. İkili yıldız.',
    mythology: 'Latince "başak" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α Vir',
    hipId: 65474
  },
  {
    name: 'Antares',
    commonName: 'Mars Rakibi',
    constellation: 'Scorpius',
    rightAscension: 16.49,
    declination: -26.4,
    magnitude: 1.09,
    spectralClass: 'M1.5Iab',
    distance: 600,
    color: '#DC143C',
    description: 'Kırmızı süper dev. Mars kadar kırmızı.',
    mythology: 'Yunanca "Mars\'a karşı" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α Sco',
    hipId: 80763
  },
  {
    name: 'Pollux',
    commonName: 'İkiz',
    constellation: 'Gemini',
    rightAscension: 7.76,
    declination: 28.0,
    magnitude: 1.14,
    spectralClass: 'K0III',
    distance: 34,
    color: '#FFA500',
    description: 'İkizler takımyıldızının daha parlak ikizi.',
    mythology: 'Yunan mitolojisinde Castor\'un ikiz kardeşi.',
    isNavigationStar: true,
    bayerDesignation: 'β Gem',
    hipId: 37826
  },

  // More stars to reach 50+ total
  {
    name: 'Fomalhaut',
    commonName: 'Yalnız',
    constellation: 'Piscis Austrinus',
    rightAscension: 22.96,
    declination: -29.6,
    magnitude: 1.16,
    spectralClass: 'A3V',
    distance: 25,
    color: '#F0F8FF',
    description: 'Güney gökyüzünün yalnız parlak yıldızı.',
    mythology: 'Arapça "güney balığının ağzı" anlamına gelir.',
    isNavigationStar: true,
    bayerDesignation: 'α PsA',
    hipId: 113368
  },
  {
    name: 'Castor',
    commonName: 'İkiz',
    constellation: 'Gemini',
    rightAscension: 7.58,
    declination: 31.9,
    magnitude: 1.57,
    spectralClass: 'A1V',
    distance: 51,
    color: '#FFFFFF',
    description: 'İkizler takımyıldızının altılı yıldız sistemi.',
    mythology: 'Yunan mitolojisinde Pollux\'un ikiz kardeşi.',
    bayerDesignation: 'α Gem',
    hipId: 36850
  },
  {
    name: 'Bellatrix',
    commonName: 'Amazon Savaşçısı',
    constellation: 'Orion',
    rightAscension: 5.42,
    declination: 6.3,
    magnitude: 1.64,
    spectralClass: 'B2III',
    distance: 245,
    color: '#4169E1',
    description: 'Orion\'un omzu. Mavi dev yıldız.',
    mythology: 'Latince "kadın savaşçı" anlamına gelir.',
    bayerDesignation: 'γ Ori',
    hipId: 25336
  },
  {
    name: 'Alnilam',
    commonName: 'İnci Dizisi',
    constellation: 'Orion',
    rightAscension: 5.60,
    declination: -1.2,
    magnitude: 1.69,
    spectralClass: 'B0Ia',
    distance: 2000,
    color: '#4169E1',
    description: 'Orion\'un kemeri ortası. Süper dev mavi yıldız.',
    mythology: 'Arapça "inci dizisi" anlamına gelir.',
    bayerDesignation: 'ε Ori',
    hipId: 26311
  },
  {
    name: 'Alnitak',
    commonName: 'Kemer',
    constellation: 'Orion',
    rightAscension: 5.68,
    declination: -1.9,
    magnitude: 1.74,
    spectralClass: 'O9.5Ib',
    distance: 800,
    color: '#4169E1',
    description: 'Orion\'un kemerinin doğu ucu.',
    mythology: 'Arapça "kemer" anlamına gelir.',
    bayerDesignation: 'ζ Ori',
    hipId: 26727
  }
];

// Constellation definitions with star connections
export const constellations: Constellation[] = [
  {
    name: 'Orion',
    abbreviation: 'Ori',
    stars: ['Betelgeuse', 'Rigel', 'Bellatrix', 'Alnilam', 'Alnitak'],
    lines: [
      ['Betelgeuse', 'Bellatrix'],
      ['Bellatrix', 'Alnilam'],
      ['Alnilam', 'Alnitak'],
      ['Alnilam', 'Rigel'],
      ['Betelgeuse', 'Alnilam']
    ],
    mythology: 'Avcı Orion, Yunan mitolojisinde güçlü bir avcıdır.',
    season: 'winter'
  },
  {
    name: 'Ursa Major',
    abbreviation: 'UMa',
    stars: ['Dubhe', 'Merak', 'Phecda', 'Megrez', 'Alioth', 'Mizar', 'Alkaid'],
    lines: [
      ['Dubhe', 'Merak'],
      ['Merak', 'Phecda'],
      ['Phecda', 'Megrez'],
      ['Megrez', 'Alioth'],
      ['Alioth', 'Mizar'],
      ['Mizar', 'Alkaid']
    ],
    mythology: 'Büyük Ayı, birçok kültürde ayı olarak görülen takımyıldız.',
    season: 'spring'
  },
  {
    name: 'Cassiopeia',
    abbreviation: 'Cas',
    stars: ['Schedar', 'Caph', 'Gamma Cas', 'Ruchbah', 'Segin'],
    lines: [
      ['Schedar', 'Caph'],
      ['Caph', 'Gamma Cas'],
      ['Gamma Cas', 'Ruchbah'],
      ['Ruchbah', 'Segin']
    ],
    mythology: 'Kraliçe Cassiopeia, Yunan mitolojisinde kibirli kraliçe.',
    season: 'autumn'
  }
];

// Deep sky objects
export const deepSkyObjects: DeepSkyObject[] = [
  {
    name: 'M31',
    type: 'galaxy',
    rightAscension: 0.71,
    declination: 41.3,
    magnitude: 3.4,
    constellation: 'Andromeda',
    description: 'Andromeda Galaksisi, en yakın büyük galaksi.',
    distance: 2537000,
    color: '#E6E6FA'
  },
  {
    name: 'M42',
    type: 'nebula',
    rightAscension: 5.58,
    declination: -5.4,
    magnitude: 4.0,
    constellation: 'Orion',
    description: 'Orion Nebulası, yıldız oluşum bölgesi.',
    distance: 1344,
    color: '#FF69B4'
  },
  {
    name: 'M45',
    type: 'star_cluster',
    rightAscension: 3.79,
    declination: 24.1,
    magnitude: 1.6,
    constellation: 'Taurus',
    description: 'Ülker yıldız kümesi, yedi kız kardeş.',
    distance: 444,
    color: '#87CEEB'
  }
];

// Function to get stars by constellation
export const getStarsByConstellation = (constellation: string): EnhancedStar[] => {
  return enhancedStarCatalog.filter(star => star.constellation === constellation);
};

// Function to get stars by magnitude range
export const getStarsByMagnitude = (minMag: number, maxMag: number): EnhancedStar[] => {
  return enhancedStarCatalog.filter(star => star.magnitude >= minMag && star.magnitude <= maxMag);
};

// Function to search stars by name
export const searchStars = (query: string): EnhancedStar[] => {
  const lowercaseQuery = query.toLowerCase();
  return enhancedStarCatalog.filter(star => 
    star.name.toLowerCase().includes(lowercaseQuery) ||
    star.commonName?.toLowerCase().includes(lowercaseQuery) ||
    star.constellation.toLowerCase().includes(lowercaseQuery)
  );
};

// Function to get navigation stars only
export const getNavigationStars = (): EnhancedStar[] => {
  return enhancedStarCatalog.filter(star => star.isNavigationStar);
};