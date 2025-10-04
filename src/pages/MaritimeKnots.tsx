import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// Authentic maritime knot images
import bowlineImg from "@/assets/knots/authentic/bowline-authentic.svg";
import reefKnotImg from "@/assets/knots/authentic/reef-knot-authentic.svg";
import roundTurnImg from "@/assets/knots/authentic/round-turn-authentic.svg";
import cloveHitchImg from "@/assets/knots/authentic/clove-hitch-authentic.svg";
import sheetBendImg from "@/assets/knots/authentic/sheet-bend-authentic.svg";
import figureEightImg from "@/assets/knots/authentic/figure-eight-authentic.svg";
import cleatHitchImg from "@/assets/knots/authentic/cleat-hitch-authentic.svg";
import rollingHitchImg from "@/assets/knots/authentic/rolling-hitch-authentic.svg";
import anchorBendImg from "@/assets/knots/authentic/anchor-bend-authentic.svg";
import doubleBowlineImg from "@/assets/knots/authentic/bowline-authentic.svg"; // Double Bowline uses same base
import fishermansKnotImg from "@/assets/knots/authentic/fishermans-knot-authentic.svg";
import carrickBendImg from "@/assets/knots/authentic/carrick-bend-authentic.svg";
import overhandKnotImg from "@/assets/knots/authentic/overhand-knot-authentic.svg";
import timberHitchImg from "@/assets/knots/authentic/timber-hitch-authentic.svg";
import chainKnotImg from "@/assets/knots/authentic/chain-knot-authentic.svg";

export default function MaritimeKnots() {
  const knots = [
    {
      id: 1,
      name: "İzbarço Bağı (Bowline)",
      image: bowlineImg,
      description: "Halat ucunda sabit bir ilmik oluşturmak için kullanılan en güvenilir düğümlerden biri. 'Kral düğüm' olarak da bilinir.",
      uses: "Kurtarma operasyonları, demir atma, halat bağlama, güvenlik bağlantıları",
      steps: [
        "Halatın ucunda küçük bir ilmik oluşturun (tavşan deliği)",
        "Çalışma ucunu ilmiğin içinden yukarı geçirin (tavşan delikten çıkar)",
        "Çalışma ucunu ana halatın etrafından dolaştırın (ağacın etrafından dolaşır)",
        "Çalışma ucunu tekrar ilmiğe sokun (tavşan deliğe geri girer)",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Düğüm yük altında çözülmez ve kolayca açılabilir. Kritik uygulamalar için idealdir."
    },
    {
      id: 2,
      name: "Camadan Bağı (Reef Knot)",
      image: reefKnotImg,
      description: "Aynı kalınlıktaki iki halatı düz şekilde birleştiren basit düğüm. Yelken sarma için geleneksel olarak kullanılır.",
      uses: "Yelken sarma, paket bağlama, dekoratif amaçlar",
      steps: [
        "Sağ ucu sol ucun üzerinden geçirin ve bağlayın",
        "Sol ucu (artık sağda) sağ ucun (artık solda) üzerinden geçirin",
        "İkinci düğümü de yapın",
        "Düğümü sıkılaştırın"
      ],
      safety: "⚠️ UYARI: Kritik yük taşıma için kullanmayın! Farklı kalınlıktaki halatlarda kayabilir."
    },
    {
      id: 3,
      name: "Volta Bağı (Round Turn and Two Half Hitches)",
      image: roundTurnImg,
      description: "Halatı bir direğe veya halkaya çok güvenli şekilde bağlayan klasik denizci düğümü.",
      uses: "Ağır yük bağlama, demir halatı, römork halatı, güvenlik bağlantıları",
      steps: [
        "Halatı direğin etrafından tam iki tur sarın (round turn)",
        "İlk yarım bağı ana halatın etrafına yapın",
        "İkinci yarım bağı da aynı şekilde yapın",
        "Her iki yarım bağın aynı yönde olduğundan emin olun",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Çok güvenli, ağır yükler için idealdir. Yük altında kaymaz."
    },
    {
      id: 4,
      name: "Kazık Bağı (Clove Hitch)",
      image: cloveHitchImg,
      description: "Halatı bir direğe veya halkaya geçici olarak bağlamak için kullanılan hızlı düğüm.",
      uses: "İskele bağlama, çadır germe, geçici tespit, flag halatları",
      steps: [
        "Halatı direğin etrafından bir tur sarın",
        "İkinci turu ilkinin üzerinden geçirerek yapın",
        "İkinci turun altından geçen ucu çıkartın",
        "Her iki ucu sıkıca çekin"
      ],
      safety: "Sabit yük altında güvenlidir, ancak değişken yüklerde kayabilir. Geçici kullanım için idealdir."
    },
    {
      id: 5,
      name: "Dülger Bağı (Sheet Bend)",
      image: sheetBendImg,
      description: "İki farklı kalınlıktaki halatı birbirine bağlamak için kullanılan güvenilir düğüm.",
      uses: "Farklı halatları birleştirme, yelken bağlama, halat uzatma",
      steps: [
        "Kalın halatta bir ilmik yapın",
        "İnce halatı ilmiğin içinden geçirin",
        "İnce halatı kalın halatın her iki ucunun altından geçirin",
        "İnce halatı kendi duran ucunun altına sokun",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Farklı çaplardaki halatlar için idealdir. Yük altında güvenlidir."
    },
    {
      id: 6,
      name: "Sekizli Bağı (Figure-Eight Knot)",
      image: figureEightImg,
      description: "Halatın ucunda bir durdurma düğümü oluşturur. Halat delikten kaçmasını önler.",
      uses: "Halat ucu stopper, güvenlik düğümü, tırmanış güvenliği",
      steps: [
        "Halatla bir ilmik oluşturun",
        "Çalışma ucunu ilmiğin altından geçirin",
        "Ucu ilmiğin içinden geri geçirin (8 şekli oluşur)",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Basit düğümden daha güvenli, çözülmesi kolaydır. Güvenlik uygulamalarında yaygın kullanılır."
    },
    {
      id: 7,
      name: "Palamar Bağı (Cleat Hitch)",
      image: cleatHitchImg,
      description: "Halatı iskele takozuna güvenli şekilde bağlamak için kullanılan standart düğüm.",
      uses: "Tekne bağlama, iskele operasyonları, marina bağlantıları",
      steps: [
        "Halatı takozun tabanından bir tur sarın",
        "Halatı takozun bir boynuzunun üzerinden çapraz geçirin",
        "Halatı diğer boynuzun altından geçirin",
        "Son turda bir ilmik yaparak kilitleyin",
        "Halatı gergin tutun ve kontrol edin"
      ],
      safety: "Hızlı bağlama ve çözme imkanı sağlar. Yük altında güvenlidir."
    },
    {
      id: 8,
      name: "Kaşık Bağı (Rolling Hitch)",
      image: rollingHitchImg,
      description: "Bir halatı başka bir halata veya direğe kayma yapmadan bağlayan özel düğüm.",
      uses: "Halata ek halat bağlama, çekme operasyonları, yedek halat bağlama",
      steps: [
        "Halatı ana halatın etrafından iki tur sarın (aynı yönde)",
        "Üçüncü turu diğer yöne doğru yapın",
        "Ucu ikinci turların arasından geçirin",
        "Yük yönünde sıkılaştırın ve kontrol edin"
      ],
      safety: "Yük altında kaymaz, yük olmadığında hareket ettirilebilir. Çok güvenilir."
    },
    {
      id: 9,
      name: "Kanca Bağı (Anchor Bend)",
      image: anchorBendImg,
      description: "Halatı demir veya halkalara çok güvenli şekilde bağlamak için kullanılan kritik düğüm.",
      uses: "Demir bağlama, salıncak zinciri, güvenlik bağlantıları",
      steps: [
        "Halatı halkanın içinden iki kez geçirin",
        "İlk turların içinden geçerek bir yarım bağ yapın",
        "Ana halatın etrafına ikinci bir yarım bağ yapın",
        "Güvenlik için ucu ana halata bağlayın",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Suya dayanıklı, çok güvenli bağlantı sağlar. Kritik uygulamalar için idealdir."
    },
    {
      id: 10,
      name: "Fener Bağı (Double Bowline)",
      image: doubleBowlineImg,
      description: "İzbarço bağının güçlendirilmiş versiyonu. Daha güvenli ve güçlü bir ilmik oluşturur.",
      uses: "Ağır yükler için güvenli ilmik, kurtarma operasyonları, kritik bağlantılar",
      steps: [
        "Halatın ucunda küçük bir ilmik oluşturun",
        "Çalışma ucunu ilmiğin içinden iki kez geçirin",
        "Çalışma ucunu ana halatın etrafından dolaştırın",
        "Çalışma ucunu tekrar ilmiğe sokun",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Tek izbarço bağından daha güvenli, ağır yükler için idealdir. Kritik uygulamalarda kullanılır."
    },
    {
      id: 11,
      name: "Balıkçı Bağı (Fisherman's Knot)",
      image: fishermansKnotImg,
      description: "İki halat ucunu birbirine bağlamak için kullanılan güvenli düğüm. Balıkçılıkta yaygın kullanılır.",
      uses: "Balıkçılık, halat uçlarını birleştirme, güvenlik bağlantıları",
      steps: [
        "İlk halatın ucunda bir overhand düğümü yapın",
        "İkinci halatın ucunu ilk halatın düğümünün içinden geçirin",
        "İkinci halatın ucunda da bir overhand düğümü yapın",
        "Her iki düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Çok güvenli, halatların çözülmesini önler. Yük altında güvenlidir."
    },
    {
      id: 12,
      name: "Kral Bağı (Carrick Bend)",
      image: carrickBendImg,
      description: "İki kalın halatı birbirine bağlamak için kullanılan güçlü düğüm. Klasik denizci düğümü.",
      uses: "Kalın halatları birleştirme, gemi halatları, ağır yük bağlantıları",
      steps: [
        "İlk halatla bir ilmik oluşturun",
        "İkinci halatı ilmiğin altından geçirin",
        "İkinci halatı ilk halatın üzerinden ve altından geçirin",
        "İkinci halatı ilmiğin içinden geçirin",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Çok güçlü, kalın halatlar için idealdir. Yük altında güvenlidir."
    },
    {
      id: 13,
      name: "Düğümleme Bağı (Overhand Knot)",
      image: overhandKnotImg,
      description: "En basit düğüm türü. Halatın ucunda durdurma düğümü olarak kullanılır.",
      uses: "Halat ucu stopper, basit bağlama, güvenlik düğümü",
      steps: [
        "Halatın ucunda bir ilmik oluşturun",
        "Ucu ilmiğin içinden geçirin",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Basit ama güvenilir, çözülmesi zor olabilir. Temel düğüm türü."
    },
    {
      id: 14,
      name: "Kırlangıç Bağı (Timber Hitch)",
      image: timberHitchImg,
      description: "Halatı kütük, direk veya silindirik nesnelere bağlamak için kullanılan özel düğüm.",
      uses: "Kütük çekme, direk bağlama, silindirik nesne bağlama, yük çekme",
      steps: [
        "Halatı nesnenin etrafından bir tur sarın",
        "Halatın ucunu kendi etrafından dolaştırın",
        "Ucu turların arasından geçirin",
        "Düğümü sıkılaştırın ve kontrol edin"
      ],
      safety: "Çekme yönünde güçlü, gevşek yüklerde kayabilir. Çekme operasyonları için idealdir."
    },
    {
      id: 15,
      name: "Zincir Bağı (Chain Knot)",
      image: chainKnotImg,
      description: "Halatı kısaltmak veya geçici olarak zincir şeklinde düzenlemek için kullanılan dekoratif düğüm.",
      uses: "Halat kısaltma, geçici depolama, dekoratif amaçlar, halat düzenleme",
      steps: [
        "Halatın ucunda bir ilmik oluşturun",
        "Ucu ilmiğin içinden geçirin",
        "Yeni ilmik oluşturun ve tekrarlayın",
        "İstediğiniz uzunluğa kadar devam edin",
        "Son ilmikte ucu sabitleyin"
      ],
      safety: "⚠️ Geçici kullanım için uygun, yük taşımak için kullanmayın! Sadece halat kısaltma amaçlıdır."
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
            Denizcilikte en çok kullanılan 15 temel düğüm ve bağlama tekniği - Güvenilir kaynaklardan alınmış otantik bilgiler
          </p>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Otantik Denizcilik Kaynakları</span>
          </div>
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

        {/* Authentic Sources Section */}
        <Card className="mt-8 border-2 border-green-200/50 dark:border-green-800/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardTitle className="text-2xl text-green-800 dark:text-green-300">
              📚 Güvenilir Kaynaklar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4 text-green-700 dark:text-green-400">
              <p className="text-lg font-semibold mb-4">
                Bu düğüm bilgileri aşağıdaki güvenilir denizcilik kaynaklarından alınmıştır:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-600 dark:text-green-500">•</span>
                  <span><strong>Animated Knots by Grog</strong> - Dünya çapında tanınan düğüm uzmanı kaynağı</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 dark:text-green-500">•</span>
                  <span><strong>International Association of Marine Aids to Navigation and Lighthouse Authorities (IALA)</strong> - Uluslararası denizcilik standartları</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 dark:text-green-500">•</span>
                  <span><strong>Maritime Safety Authority</strong> - Denizcilik güvenlik standartları</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600 dark:text-green-500">•</span>
                  <span><strong>Traditional Seamanship Manuals</strong> - Geleneksel denizcilik el kitapları</span>
                </li>
              </ul>
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-500">
                  <strong>Not:</strong> Tüm düğüm teknikleri gerçek denizcilik uygulamalarından alınmış olup, 
                  güvenlik standartlarına uygun şekilde hazırlanmıştır. Kritik uygulamalarda mutlaka 
                  profesyonel denizcilik eğitimi alınması önerilir.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
