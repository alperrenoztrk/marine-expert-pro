import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import bowlineImg from "@/assets/knots/bowline.jpg";
import reefKnotImg from "@/assets/knots/reef-knot.jpg";
import roundTurnImg from "@/assets/knots/round-turn-two-half-hitches.jpg";
import cloveHitchImg from "@/assets/knots/clove-hitch.jpg";
import sheetBendImg from "@/assets/knots/sheet-bend.jpg";
import figureEightImg from "@/assets/knots/figure-eight.jpg";
import cleatHitchImg from "@/assets/knots/cleat-hitch.jpg";
import rollingHitchImg from "@/assets/knots/rolling-hitch.jpg";
import anchorBendImg from "@/assets/knots/anchor-bend.jpg";
import bowlineImg2 from "@/assets/knots/bowline.jpg"; // Double Bowline
import truckersHitchImg from "@/assets/knots/truckers-hitch.jpg"; // Fisherman's Knot placeholder
import truckersHitchImg2 from "@/assets/knots/truckers-hitch.jpg"; // Carrick Bend placeholder
import truckersHitchImg3 from "@/assets/knots/truckers-hitch.jpg"; // Overhand Knot placeholder
import truckersHitchImg4 from "@/assets/knots/truckers-hitch.jpg"; // Timber Hitch placeholder
import truckersHitchImg5 from "@/assets/knots/truckers-hitch.jpg"; // Chain Knot placeholder

export default function MaritimeKnots() {
  const knots = [
    {
      id: 1,
      name: "İzbarço Bağı (Bowline)",
      image: bowlineImg,
      description: "Halat ucunda sabit bir ilmik oluşturmak için kullanılır. 'Kral düğüm' olarak da bilinir.",
      uses: "Kurtarma operasyonları, demir atma, halat bağlama",
      steps: [
        "Halatın ucunda küçük bir ilmik oluşturun (tavşan deliği)",
        "Çalışma ucunu ilmiğin içinden yukarı geçirin (tavşan delikten çıkar)",
        "Çalışma ucunu ana halatın etrafından dolaştırın (ağacın etrafından dolaşır)",
        "Çalışma ucunu tekrar ilmiğe sokun (tavşan deliğe geri girer)",
        "Düğümü sıkılaştırın"
      ],
      safety: "Düğüm yük altında çözülmez ve kolayca açılabilir."
    },
    {
      id: 2,
      name: "Camadan Bağı (Reef Knot)",
      image: reefKnotImg,
      description: "Aynı kalınlıktaki iki halatı düz şekilde birleştirir.",
      uses: "Yelken sarma, paket bağlama",
      steps: [
        "Sağ ucu sol ucun üzerinden geçirin ve bağlayın",
        "Sol ucu (artık sağda) sağ ucun (artık solda) üzerinden geçirin",
        "İkinci düğümü de yapın",
        "Düğümü sıkılaştırın"
      ],
      safety: "UYARI: Kritik yük taşıma için kullanmayın, kayabilir!"
    },
    {
      id: 3,
      name: "Volta Bağı (Round Turn and Two Half Hitches)",
      image: roundTurnImg,
      description: "Halatı bir direğe veya halkaya çok güvenli şekilde bağlar.",
      uses: "Ağır yük bağlama, demir halatı, römork halatı",
      steps: [
        "Halatı direğin etrafından tam iki tur sarın",
        "İlk yarım bağı ana halatın etrafına yapın",
        "İkinci yarım bağı da aynı şekilde yapın",
        "Her iki yarım bağın aynı yönde olduğundan emin olun",
        "Düğümü sıkılaştırın"
      ],
      safety: "Çok güvenli, ağır yükler için idealdir."
    },
    {
      id: 4,
      name: "Kazık Bağı (Clove Hitch)",
      image: cloveHitchImg,
      description: "Halatı bir direğe veya halkaya geçici olarak bağlamak için kullanılır.",
      uses: "İskele bağlama, çadır germe, geçici tespit",
      steps: [
        "Halatı direğin etrafından bir tur sarın",
        "İkinci turu ilkinin üzerinden geçirerek yapın",
        "İkinci turun altından geçen ucu çıkartın",
        "Her iki ucu sıkıca çekin"
      ],
      safety: "Sabit yük altında güvenlidir, ancak değişken yüklerde kayabilir."
    },
    {
      id: 5,
      name: "Dülger Bağı (Sheet Bend)",
      image: sheetBendImg,
      description: "İki farklı kalınlıktaki halatı birbirine bağlamak için kullanılır.",
      uses: "Farklı halatları birleştirme, yelken bağlama",
      steps: [
        "Kalın halatta bir ilmik yapın",
        "İnce halatı ilmiğin içinden geçirin",
        "İnce halatı kalın halatın her iki ucunun altından geçirin",
        "İnce halatı kendi duran ucunun altına sokun",
        "Düğümü sıkılaştırın"
      ],
      safety: "Farklı çaplardaki halatlar için idealdir."
    },
    {
      id: 6,
      name: "Sekizli Bağı (Figure-Eight Knot)",
      image: figureEightImg,
      description: "Halatın ucunda bir durdurma düğümü oluşturur. Halat delikten kaçmasını önler.",
      uses: "Halat ucu stopper, güvenlik düğümü",
      steps: [
        "Halatla bir ilmik oluşturun",
        "Çalışma ucunu ilmiğin altından geçirin",
        "Ucu ilmiğin içinden geri geçirin (8 şekli oluşur)",
        "Düğümü sıkılaştırın"
      ],
      safety: "Basit düğümden daha güvenli, çözülmesi kolaydır."
    },
    {
      id: 7,
      name: "Palamar Bağı (Cleat Hitch)",
      image: cleatHitchImg,
      description: "Halatı iskele takozuna güvenli şekilde bağlamak için kullanılır.",
      uses: "Tekne bağlama, iskele operasyonları",
      steps: [
        "Halatı takozun tabanından bir tur sarın",
        "Halatı takozun bir boynuzunun üzerinden çapraz geçirin",
        "Halatı diğer boynuzun altından geçirin",
        "Son turda bir ilmik yaparak kilitleyin",
        "Halatı gergin tutun"
      ],
      safety: "Hızlı bağlama ve çözme imkanı sağlar."
    },
    {
      id: 8,
      name: "Kaşık Bağı (Rolling Hitch)",
      image: rollingHitchImg,
      description: "Bir halatı başka bir halata veya direğe kayma yapmadan bağlar.",
      uses: "Halata ek halat bağlama, çekme operasyonları",
      steps: [
        "Halatı ana halatın etrafından iki tur sarın (aynı yönde)",
        "Üçüncü turu diğer yöne doğru yapın",
        "Ucu ikinci turların arasından geçirin",
        "Yük yönünde sıkılaştırın"
      ],
      safety: "Yük altında kaymaz, yük olmadığında hareket ettirilebilir."
    },
    {
      id: 9,
      name: "Kanca Bağı (Anchor Bend)",
      image: anchorBendImg,
      description: "Halatı demir veya halkalara çok güvenli şekilde bağlamak için kullanılır.",
      uses: "Demir bağlama, salıncak zinciri",
      steps: [
        "Halatı halkanın içinden iki kez geçirin",
        "İlk turların içinden geçerek bir yarım bağ yapın",
        "Ana halatın etrafına ikinci bir yarım bağ yapın",
        "Güvenlik için ucu ana halata bağlayın",
        "Düğümü sıkılaştırın"
      ],
      safety: "Suya dayanıklı, çok güvenli bağlantı sağlar."
    },
    {
      id: 10,
      name: "Fener Bağı (Double Bowline)",
      image: bowlineImg2,
      description: "İzbarço bağının güçlendirilmiş versiyonu. Daha güvenli ve güçlü bir ilmik oluşturur.",
      uses: "Ağır yükler için güvenli ilmik, kurtarma operasyonları",
      steps: [
        "Halatın ucunda küçük bir ilmik oluşturun",
        "Çalışma ucunu ilmiğin içinden iki kez geçirin",
        "Çalışma ucunu ana halatın etrafından dolaştırın",
        "Çalışma ucunu tekrar ilmiğe sokun",
        "Düğümü sıkılaştırın"
      ],
      safety: "Tek izbarço bağından daha güvenli, ağır yükler için idealdir."
    },
    {
      id: 11,
      name: "Balıkçı Bağı (Fisherman's Knot)",
      image: truckersHitchImg,
      description: "İki halat ucunu birbirine bağlamak için kullanılan güvenli düğüm.",
      uses: "Balıkçılık, halat uçlarını birleştirme",
      steps: [
        "İlk halatın ucunda bir overhand düğümü yapın",
        "İkinci halatın ucunu ilk halatın düğümünün içinden geçirin",
        "İkinci halatın ucunda da bir overhand düğümü yapın",
        "Her iki düğümü sıkılaştırın"
      ],
      safety: "Çok güvenli, halatların çözülmesini önler."
    },
    {
      id: 12,
      name: "Kral Bağı (Carrick Bend)",
      image: truckersHitchImg2,
      description: "İki kalın halatı birbirine bağlamak için kullanılan güçlü düğüm.",
      uses: "Kalın halatları birleştirme, gemi halatları",
      steps: [
        "İlk halatla bir ilmik oluşturun",
        "İkinci halatı ilmiğin altından geçirin",
        "İkinci halatı ilk halatın üzerinden ve altından geçirin",
        "İkinci halatı ilmiğin içinden geçirin",
        "Düğümü sıkılaştırın"
      ],
      safety: "Çok güçlü, kalın halatlar için idealdir."
    },
    {
      id: 13,
      name: "Düğümleme Bağı (Overhand Knot)",
      image: truckersHitchImg3,
      description: "En basit düğüm türü. Halatın ucunda durdurma düğümü olarak kullanılır.",
      uses: "Halat ucu stopper, basit bağlama",
      steps: [
        "Halatın ucunda bir ilmik oluşturun",
        "Ucu ilmiğin içinden geçirin",
        "Düğümü sıkılaştırın"
      ],
      safety: "Basit ama güvenilir, çözülmesi zor olabilir."
    },
    {
      id: 14,
      name: "Kırlangıç Bağı (Timber Hitch)",
      image: truckersHitchImg4,
      description: "Halatı kütük, direk veya silindirik nesnelere bağlamak için kullanılır.",
      uses: "Kütük çekme, direk bağlama, silindirik nesne bağlama",
      steps: [
        "Halatı nesnenin etrafından bir tur sarın",
        "Halatın ucunu kendi etrafından dolaştırın",
        "Ucu turların arasından geçirin",
        "Düğümü sıkılaştırın"
      ],
      safety: "Çekme yönünde güçlü, gevşek yüklerde kayabilir."
    },
    {
      id: 15,
      name: "Zincir Bağı (Chain Knot)",
      image: truckersHitchImg5,
      description: "Halatı kısaltmak veya geçici olarak zincir şeklinde düzenlemek için kullanılır.",
      uses: "Halat kısaltma, geçici depolama, dekoratif amaçlar",
      steps: [
        "Halatın ucunda bir ilmik oluşturun",
        "Ucu ilmiğin içinden geçirin",
        "Yeni ilmik oluşturun ve tekrarlayın",
        "İstediğiniz uzunluğa kadar devam edin",
        "Son ilmikte ucu sabitleyin"
      ],
      safety: "Geçici kullanım için uygun, yük taşımak için kullanmayın."
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-primary-dark via-primary to-primary-light" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 sm:mb-8">
          <Link to="/seamanship-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        <div className="mb-8 sm:mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-700 dark:text-blue-400 mb-4 drop-shadow-sm">
            Gemici Bağları
          </h1>
          <p className="text-base sm:text-lg text-blue-600 dark:text-blue-300 max-w-3xl mx-auto">
            Denizcilikte en çok kullanılan 15 temel düğüm ve bağlama tekniği
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {knots.map((knot) => (
            <Card 
              key={knot.id} 
              className="overflow-hidden border-2 border-blue-200/50 dark:border-blue-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-xl"
            >
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <CardTitle className="text-2xl sm:text-3xl text-blue-800 dark:text-blue-300">
                  {knot.id}. {knot.name}
                </CardTitle>
                <CardDescription className="text-base sm:text-lg text-blue-700 dark:text-blue-400">
                  {knot.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Image Section */}
                <div className="rounded-lg overflow-hidden bg-white shadow-lg">
                  <img 
                    src={knot.image} 
                    alt={knot.name}
                    className="w-full h-auto object-contain max-h-96"
                  />
                </div>

                {/* Usage Section */}
                <div className="bg-blue-50 dark:bg-blue-950/50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-2">
                    Kullanım Alanları:
                  </h3>
                  <p className="text-blue-700 dark:text-blue-400">
                    {knot.uses}
                  </p>
                </div>

                {/* Steps Section */}
                <div>
                  <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-3">
                    Yapılışı:
                  </h3>
                  <ol className="space-y-2">
                    {knot.steps.map((step, index) => (
                      <li 
                        key={index}
                        className="flex gap-3 text-blue-700 dark:text-blue-400"
                      >
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Safety Section */}
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border-l-4 border-yellow-500 dark:border-yellow-600 rounded-r-lg p-4">
                  <h3 className="font-semibold text-lg text-yellow-800 dark:text-yellow-400 mb-2">
                    ⚠️ Güvenlik Notu:
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-500">
                    {knot.safety}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* General Tips Section */}
        <Card className="mt-8 border-2 border-blue-200/50 dark:border-blue-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardTitle className="text-2xl text-blue-800 dark:text-blue-300">
              Genel İpuçları
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3 text-blue-700 dark:text-blue-400">
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>Her düğümü kullanmadan önce ıslak halatta pratik yapın, kuru halatta farklı davranabilir.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>Düğümleri düzenli olarak kontrol edin, özellikle kritik uygulamalarda.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>Yük altındayken düğümleri çözmeye çalışmayın.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>Her düğümün sınırlamalarını ve uygun kullanım alanlarını öğrenin.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>Hasar görmüş halatlarda kritik düğümler kullanmayın.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-blue-600 dark:text-blue-500">•</span>
                <span>Sentetik halatlarda bazı düğümler kayabilir, ek güvenlik önlemleri alın.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
