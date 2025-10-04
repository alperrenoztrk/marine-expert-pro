export interface KnotStep {
  id: string;
  description: string;
  paths: string[];
  duration: number;
}

export interface AnimatedKnotData {
  id: number;
  name: string;
  steps: KnotStep[];
}

export const animatedKnotsData: AnimatedKnotData[] = [
  {
    id: 1,
    name: "İzbarço Bağı (Bowline)",
    steps: [
      {
        id: "step1",
        description: "Halatın ucunda küçük bir ilmik oluşturun (tavşan deliği)",
        paths: [
          "M 50 150 Q 100 120 150 150", // Standing part
          "M 150 150 Q 200 100 250 150"  // Initial loop
        ],
        duration: 2000
      },
      {
        id: "step2", 
        description: "Çalışma ucunu ilmiğin içinden yukarı geçirin (tavşan delikten çıkar)",
        paths: [
          "M 250 150 Q 300 180 350 150" // Working end going through loop
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "Çalışma ucunu ana halatın etrafından dolaştırın (ağacın etrafından dolaşır)",
        paths: [
          "M 350 150 Q 300 200 250 150" // Working end wrapping around standing part
        ],
        duration: 2000
      },
      {
        id: "step4",
        description: "Çalışma ucunu tekrar ilmiğe sokun (tavşan deliğe geri girer)",
        paths: [
          "M 250 150 Q 200 180 150 150" // Working end going back through loop
        ],
        duration: 2000
      },
      {
        id: "step5",
        description: "Düğümü sıkılaştırın ve kontrol edin",
        paths: [
          "M 150 150 Q 200 100 250 150" // Tightened loop
        ],
        duration: 1500
      }
    ]
  },
  {
    id: 2,
    name: "Camadan Bağı (Reef Knot)",
    steps: [
      {
        id: "step1",
        description: "Sağ ucu sol ucun üzerinden geçirin ve bağlayın",
        paths: [
          "M 50 120 Q 150 100 250 120", // First rope
          "M 50 180 Q 150 200 250 180"  // Second rope crossing over
        ],
        duration: 2000
      },
      {
        id: "step2",
        description: "Sol ucu (artık sağda) sağ ucun (artık solda) üzerinden geçirin",
        paths: [
          "M 250 120 Q 350 140 400 120", // First rope continuation
          "M 250 180 Q 350 160 400 180"  // Second rope continuation
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "İkinci düğümü de yapın",
        paths: [
          "M 200 150 Q 200 150 200 150" // Knot intersection highlight
        ],
        duration: 1500
      },
      {
        id: "step4",
        description: "Düğümü sıkılaştırın",
        paths: [
          "M 200 150 Q 200 150 200 150" // Final tightened knot
        ],
        duration: 1500
      }
    ]
  },
  {
    id: 3,
    name: "Volta Bağı (Round Turn and Two Half Hitches)",
    steps: [
      {
        id: "step1",
        description: "Halatı direğin etrafından tam iki tur sarın (round turn)",
        paths: [
          "M 50 150 Q 100 120 150 150", // First turn
          "M 150 150 Q 200 120 250 150"  // Second turn
        ],
        duration: 2500
      },
      {
        id: "step2",
        description: "İlk yarım bağı ana halatın etrafına yapın",
        paths: [
          "M 250 150 Q 300 180 350 150" // First half hitch
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "İkinci yarım bağı da aynı şekilde yapın",
        paths: [
          "M 350 150 Q 300 200 250 150" // Second half hitch
        ],
        duration: 2000
      },
      {
        id: "step4",
        description: "Her iki yarım bağın aynı yönde olduğundan emin olun",
        paths: [
          "M 250 150 Q 200 180 150 150" // Final positioning
        ],
        duration: 1500
      },
      {
        id: "step5",
        description: "Düğümü sıkılaştırın ve kontrol edin",
        paths: [
          "M 150 150 Q 200 120 250 150" // Tightened knot
        ],
        duration: 1500
      }
    ]
  },
  {
    id: 4,
    name: "Kazık Bağı (Clove Hitch)",
    steps: [
      {
        id: "step1",
        description: "Halatı direğin etrafından bir tur sarın",
        paths: [
          "M 50 150 Q 100 120 150 150" // First turn around post
        ],
        duration: 2000
      },
      {
        id: "step2",
        description: "İkinci turu ilkinin üzerinden geçirerek yapın",
        paths: [
          "M 150 150 Q 200 120 250 150" // Second turn over first
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "İkinci turun altından geçen ucu çıkartın",
        paths: [
          "M 250 150 Q 300 180 350 150" // Working end exit
        ],
        duration: 2000
      },
      {
        id: "step4",
        description: "Her iki ucu sıkıca çekin",
        paths: [
          "M 350 150 Q 300 200 250 150" // Final tightening
        ],
        duration: 1500
      }
    ]
  },
  {
    id: 5,
    name: "Dülger Bağı (Sheet Bend)",
    steps: [
      {
        id: "step1",
        description: "Kalın halatta bir ilmik yapın",
        paths: [
          "M 50 150 Q 100 120 150 150", // Thick rope standing part
          "M 150 150 Q 200 100 250 150"  // Thick rope loop
        ],
        duration: 2000
      },
      {
        id: "step2",
        description: "İnce halatı ilmiğin içinden geçirin",
        paths: [
          "M 250 150 Q 300 180 350 150" // Thin rope through loop
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "İnce halatı kalın halatın her iki ucunun altından geçirin",
        paths: [
          "M 350 150 Q 300 200 250 150" // Thin rope under thick rope
        ],
        duration: 2000
      },
      {
        id: "step4",
        description: "İnce halatı kendi duran ucunun altına sokun",
        paths: [
          "M 250 150 Q 200 180 150 150" // Thin rope under its own standing part
        ],
        duration: 2000
      },
      {
        id: "step5",
        description: "Düğümü sıkılaştırın ve kontrol edin",
        paths: [
          "M 150 150 Q 200 100 250 150" // Final tightened knot
        ],
        duration: 1500
      }
    ]
  },
  {
    id: 6,
    name: "Sekizli Bağı (Figure-Eight Knot)",
    steps: [
      {
        id: "step1",
        description: "Halatla bir ilmik oluşturun",
        paths: [
          "M 50 150 Q 100 120 150 150" // Initial loop
        ],
        duration: 2000
      },
      {
        id: "step2",
        description: "Çalışma ucunu ilmiğin altından geçirin",
        paths: [
          "M 150 150 Q 200 180 250 150" // Working end under loop
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "Ucu ilmiğin içinden geri geçirin (8 şekli oluşur)",
        paths: [
          "M 250 150 Q 200 120 150 150" // Working end back through loop
        ],
        duration: 2000
      },
      {
        id: "step4",
        description: "Düğümü sıkılaştırın ve kontrol edin",
        paths: [
          "M 150 150 Q 200 180 250 150" // Final figure-eight shape
        ],
        duration: 1500
      }
    ]
  },
  {
    id: 7,
    name: "Palamar Bağı (Cleat Hitch)",
    steps: [
      {
        id: "step1",
        description: "Halatı takozun tabanından bir tur sarın",
        paths: [
          "M 50 150 Q 100 120 150 150" // Base turn around cleat
        ],
        duration: 2000
      },
      {
        id: "step2",
        description: "Halatı takozun bir boynuzunun üzerinden çapraz geçirin",
        paths: [
          "M 150 150 Q 200 120 250 150" // Over first horn
        ],
        duration: 2000
      },
      {
        id: "step3",
        description: "Halatı diğer boynuzun altından geçirin",
        paths: [
          "M 250 150 Q 300 180 350 150" // Under second horn
        ],
        duration: 2000
      },
      {
        id: "step4",
        description: "Son turda bir ilmik yaparak kilitleyin",
        paths: [
          "M 350 150 Q 300 200 250 150" // Locking loop
        ],
        duration: 2000
      },
      {
        id: "step5",
        description: "Halatı gergin tutun ve kontrol edin",
        paths: [
          "M 250 150 Q 200 180 150 150" // Final secure hitch
        ],
        duration: 1500
      }
    ]
  }
];