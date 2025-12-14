import type { QuizQuestion } from "@/types/quiz";

export const seamanshipQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Demir zinciri scope oranı (normal koşullarda) genellikle en az kaç olmalıdır?",
    options: ["3:1", "5:1", "7:1", "10:1"],
    correctAnswer: 1,
    explanation: "Normal koşullarda 5:1 (çoğu durumda 5–7:1) yaygın minimum kabul edilir; ağır havada daha fazla gerekir.",
    category: "Demirleme"
  },
  {
    id: 2,
    question: "COLREG Kural 5 neyi zorunlu kılar?",
    options: ["Güvenli hız", "Uygun gözcülük", "Çatışmadan kaçınma", "Işık gösterme"],
    correctAnswer: 1,
    explanation: "Rule 5: Her zaman uygun gözcülük (look-out).",
    category: "COLREG"
  },
  {
    id: 3,
    question: "ISM Kodunun temel amacı nedir?",
    options: ["Gemi güvenliği sertifikasyonu", "Güvenli gemi işletimi ve kirlilik önleme", "Mürettebat sertifikasyonu", "Kargo güvenliği"],
    correctAnswer: 1,
    explanation: "ISM, emniyetli işletim ve çevre kirliliğinin önlenmesi için yönetim sistemi standartları getirir.",
    category: "ISM/ISPS"
  },
  {
    id: 4,
    question: "ISPS Kodunda kaç güvenlik seviyesi vardır?",
    options: ["2", "3", "4", "5"],
    correctAnswer: 1,
    explanation: "Seviye 1 (Normal), 2 (Artırılmış), 3 (Olağanüstü).",
    category: "ISM/ISPS"
  },
  {
    id: 5,
    question: "Spring halatlar ne için kullanılır?",
    options: ["Geminin ileri-geri hareketini kontrol etmek", "Geminin yükselip alçalmasını sağlamak", "Geminin dönmesini önlemek", "Geminin yan yatmasını önlemek"],
    correctAnswer: 0,
    explanation: "Spring, rıhtım boyunca ileri-geri (surge) hareketi kontrol eder.",
    category: "Palamar"
  },
  {
    id: 6,
    question: "Palamar hatlarında 'snap-back zone' neyi ifade eder?",
    options: ["Halatın suya değdiği bölge", "Halat koparsa geri savrulacağı tehlike alanı", "Halatın yağlanacağı alan", "Halatın bağlanacağı babayı"],
    correctAnswer: 1,
    explanation: "Kopma halinde halat, elastik enerjiyle geri savrulur; bu bölge ölümcül olabilir.",
    category: "Palamar"
  },
  {
    id: 7,
    question: "Bowline (İzbarço) düğümünün en önemli özelliği hangisidir?",
    options: ["Yük altında sıkışıp çözülmez", "Sabit bir göz (ilmek) oluşturur", "Sadece zincirde kullanılır", "Su altında çözülür"],
    correctAnswer: 1,
    explanation: "Bowline güvenilir sabit göz oluşturur; birçok pratik kullanımda tercih edilir.",
    category: "Düğümler"
  },
  {
    id: 8,
    question: "Clove hitch (Kazık bağı) en çok ne için kullanılır?",
    options: ["Sabit göz yapmak", "Bir direğe hızlı geçici bağ", "Zincir kısaltmak", "Çelik halat ek yapmak"],
    correctAnswer: 1,
    explanation: "Direk/boruya hızlı bağ için pratik; sürekli yükte kayabilir, emniyet bağı eklenir.",
    category: "Düğümler"
  },
  {
    id: 9,
    question: "Denizde 'man overboard' durumunda ilk aksiyon hangisidir?",
    options: ["Günlük doldurmak", "Can simidi/ışık duman şamandırası atmak ve alarm vermek", "Hemen limana dönmek", "Makineyi durdurmak"],
    correctAnswer: 1,
    explanation: "İlk hedef: kişiyi işaretlemek ve görünür kılmak (lifebuoy/marking) + alarm/koordinasyon.",
    category: "Acil Durum"
  },
  {
    id: 10,
    question: "Güvertede ağır hava devriyesinde öncelikli kontrol hangisidir?",
    options: ["Kamarot bölümü", "Mutfak", "Ambar kapakları ve güverte ekipman emniyeti", "Ofis evrakı"],
    correctAnswer: 2,
    explanation: "Ambar kapakları, lashings, ventler, güverte ekipmanı heavy weather'da kritik risk oluşturur.",
    category: "Ağır Hava"
  },
  {
    id: 11,
    question: "Çelik halatın (wire) periyodik kontrolünde en kritik bulgulardan biri hangisidir?",
    options: ["Renk değişimi", "Kırık tel sayısı ve bukle/kink", "Sadece yağ seviyesi", "Etiket yazısı"],
    correctAnswer: 1,
    explanation: "Broken wires, kinks, birdcaging gibi deformasyonlar ciddi emniyet riski taşır.",
    category: "Bakım"
  },
  {
    id: 12,
    question: "Gemi yanaşma sırasında römorkör komutu verirken en önemli unsur hangisidir?",
    options: ["Sadece rüzgâr", "Net ve standart iletişim/komut", "Sadece akıntı", "Sadece draft"],
    correctAnswer: 1,
    explanation: "Tug operations'ta yanlış anlaşılma ciddi kaza sebebidir; standard phraseology kritik.",
    category: "Manevra"
  },
  {
    id: 13,
    question: "Kıçtan bağlanmada (stern-to) en önemli risklerden biri hangisidir?",
    options: ["Görüş artışı", "Pervane/rudder hasarı ve kıçın dalga/akıntıyla sürüklenmesi", "Yakıt tasarrufu", "Radar menzil artışı"],
    correctAnswer: 1,
    explanation: "Kıç manevrası dar alanda hassastır; prop/rudder clearance ve çevresel etkiler kritik.",
    category: "Manevra"
  },
  {
    id: 14,
    question: "Denizde çatışma önlemede 'stand-on vessel' için doğru ifade hangisidir?",
    options: ["Her zaman rota/hız değiştirir", "Mümkün olduğunca rota ve hızını muhafaza eder", "Daima iskeleye döner", "Hiç manevra yapamaz"],
    correctAnswer: 1,
    explanation: "COLREG: Stand-on, şartlar elverdiğince rota/hızını korur; risk devam ederse manevra yapabilir.",
    category: "COLREG"
  },
  {
    id: 15,
    question: "Bir gemide 'permit to work' sistemi aşağıdakilerden hangisini en çok azaltır?",
    options: ["Yakıt tüketimini", "Kontrolsüz ve riskli iş yapılmasını", "Radar arızasını", "Gelgit hatasını"],
    correctAnswer: 1,
    explanation: "PTW: sıcak iş, enclosed space vb. riskli işlerde prosedür/izolasyon/ölçüm kontrolü sağlar.",
    category: "İş Emniyeti"
  },
  {
    id: 16,
    question: "Enclosed space entry (kapalı mahale giriş) için en kritik ön koşul hangisidir?",
    options: ["Kapıyı açık bırakmak", "Atmosfer ölçümü ve havalandırma", "Telefonla konuşmak", "Sadece aydınlatma"],
    correctAnswer: 1,
    explanation: "O2, LEL, toksik gaz ölçümü + sürekli havalandırma + izin/prosedür hayati önemdedir.",
    category: "İş Emniyeti"
  },
  {
    id: 17,
    question: "Gemide 'toolbox talk' (iş başı konuşması) en iyi ne zaman yapılır?",
    options: ["İş bittikten sonra", "İşe başlamadan hemen önce", "Sadece limanda", "Sadece kaptan isteyince"],
    correctAnswer: 1,
    explanation: "İşe başlamadan önce riskler/roller/iletişim netleştirilir.",
    category: "İş Emniyeti"
  },
  {
    id: 18,
    question: "Demir taraması (dragging anchor) şüphesinde en pratik göstergelerden biri hangisidir?",
    options: ["GPS/ekosounder konumunun sabit kalması", "Kerterizlerin ve GPS pozisyonunun sürüklenmesi", "Deniz suyu tuzluluğu", "Hava sıcaklığı"],
    correctAnswer: 1,
    explanation: "Kerterizler değişiyor ve pozisyon sürükleniyorsa anchor dragging ihtimali artar.",
    category: "Demirleme"
  },
  {
    id: 19,
    question: "Bir halatın SWL/WLL değerleri ile ilgili doğru ifade hangisidir?",
    options: ["WLL her zaman MBL'den büyüktür", "WLL çalışma yük limitidir, MBL kırılma yüküdür", "MBL ile WLL aynıdır", "WLL sadece zincirde kullanılır"],
    correctAnswer: 1,
    explanation: "WLL/SWL güvenli çalışma sınırı; MBL minimum kırılma yüküdür (emniyet katsayısı uygulanır).",
    category: "Palamar"
  },
  {
    id: 20,
    question: "Denizde yangında, 'boundary cooling' (sınır soğutma) temel amacı hangisidir?",
    options: ["Yangını beslemek", "Yangının yayılmasını önlemek", "Sadece dumanı artırmak", "Yakıt tüketimini azaltmak"],
    correctAnswer: 1,
    explanation: "Komşu bölmeleri soğutarak ısı transferiyle yayılımı sınırlandırır.",
    category: "Acil Durum"
  },
  {
    id: 21,
    question: "Güvertede 'lanyard' kullanımının temel amacı hangisidir?",
    options: ["Süslü görünmek", "Aletlerin düşmesini önlemek", "Rüzgârı ölçmek", "Pusula sapmasını ölçmek"],
    correctAnswer: 1,
    explanation: "Tool lanyard, overboard düşüşü ve yaralanma riskini azaltır.",
    category: "İş Emniyeti"
  },
  {
    id: 22,
    question: "Emniyet kemeri/harness için doğru kullanım hangisidir?",
    options: ["Sadece bele bağlamak", "Uygun ankraj noktasına bağlayıp fall-arrest kullanmak", "İple elde tutmak", "Ağır havada hiç kullanmamak"],
    correctAnswer: 1,
    explanation: "Fall-arrest sisteminde sertifikalı ankraj + doğru bağlantı ve kontrol şarttır.",
    category: "İş Emniyeti"
  },
  {
    id: 23,
    question: "Denizde 'heaving line' (atış halatı) en çok hangi amaçla kullanılır?",
    options: ["Yangın söndürmek", "Palamarı iskeleye/rihtıma ulaştırmak", "Radar hedefi işaretlemek", "Gelgit ölçmek"],
    correctAnswer: 1,
    explanation: "Heaving line ile messenger/halat karşı tarafa atılır; ardından asıl palamar alınır.",
    category: "Palamar"
  },
  {
    id: 24,
    question: "Bir palamarın babaya (bitt) düzgün bağlanmasında en önemli ilke hangisidir?",
    options: ["Düğümleri rastgele atmak", "Turns düzgün ve çaprazsız; sürtünme/çakışma olmadan", "Sadece tek tur", "Halatı ıslatmak"],
    correctAnswer: 1,
    explanation: "Düzgün turns ve figure-of-eight bağ, yük altında kaymayı ve hasarı azaltır.",
    category: "Palamar"
  },
  {
    id: 25,
    question: "Gemide 'near miss' raporlamasının temel faydası hangisidir?",
    options: ["Ceza vermek", "Kaza olmadan önce tehlikeyi görüp iyileştirmek", "Sadece evrak artırmak", "Sigorta primini hemen düşürmek"],
    correctAnswer: 1,
    explanation: "Near miss, kök neden analizi ve önleyici aksiyonlar için en değerli girdilerden biridir.",
    category: "SMS"
  }
];

