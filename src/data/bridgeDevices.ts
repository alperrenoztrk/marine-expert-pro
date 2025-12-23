import {
  Compass,
  Navigation,
  Radar as RadarIcon,
  Radio,
  SatelliteDish,
  Waves,
  Navigation2
} from "lucide-react";

export type BridgeDeviceId =
  | "vhf"
  | "dsc"
  | "ecdis"
  | "radar"
  | "navtex"
  | "ais"
  | "gyro"
  | "autopilot";

export interface BridgeDeviceInfo {
  id: BridgeDeviceId;
  name: string;
  description: string;
  summary: string;
  icon: typeof Radio;
  accent: string;
  images: string[];
  duties: string[];
  operations: string[];
  monitoring: string[];
  integration: string[];
}

export const bridgeDevices: BridgeDeviceInfo[] = [
  {
    id: "vhf",
    name: "VHF",
    description: "Kanal yönetimi, distress ve routine call kontrolleri",
    summary:
      "GMDSS kapsamında gemi-gemi ve gemi-kıyı arasındaki temel ses haberleşmesini sağlar; kanal 16 sürekli dinleme ve köprüüstü koordinasyonu için kritik rol oynar.",
    icon: Radio,
    accent: "from-sky-500 via-blue-500 to-indigo-500",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/Maritime_VHF_Sailor_RT144.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/2/29/VHF_radio_with_Maritime_Distress_Safety_System.jpg"
    ],
    duties: [
      "Görüş hattı mesafelerde emniyet, operasyonel ve liman kılavuz çağrıları",
      "Mayday, Pan-Pan ve Sécurité anonslarının hızlı ve prosedüre uygun iletimi",
      "Kanal 13/16/06 gibi köprüüstü ve manevra kanallarında sürekli dinleme",
      "Pilot ve VTS ile yanaşma/kalkış sırasında kesintisiz koordinasyon"
    ],
    operations: [
      "Kanal seçimi: Acil durum için CH16, manevra için CH13/12, liman otoritesi talimatlarına göre yerel kanallar",
      "Güç ve anten kontrolleri: 25 W/1 W çıkış seçimi, anten SWR ve ayrım mesafesi doğrulaması",
      "DSC bağlantılı cihazlarda MMSI ve grup çağrılarının hazır tutulması",
      "Sessizlik (silence) modunun sadece otorite talebiyle ve kısa süreli kullanılması"
    ],
    monitoring: [
      "Çekiş ve demir operasyonlarında parazit veya crosstalk için squelch ayarını optimize et",
      "Köprüüstü alarmlarını kayda al; kayıt cihazı varsa ses kayıtlarını zaman damgasıyla arşivle",
      "Kanal tıkanıklığı veya acil durum taşması olduğunda MF/HF veya uyduya yönel",
      "Yedek el VHF'lerin batarya ve watertight kapak kontrollerini günlük yap"
    ],
    integration: [
      "VTS, pilot ve kurtarma koordinasyon merkezleriyle standart mayday formatında iletişim",
      "DSC cihazı varsa otomatik distress/urgency başlatma ve navtex/ais uyarılarıyla birlikte kullanma",
      "Köprüüstü kayıt sistemine (VDR/S-VDR) ses çıkışını besleyerek olay sonrası analiz"
    ]
  },
  {
    id: "dsc",
    name: "DSC",
    description: "Distress, urgency ve safety çağrı protokolleri",
    summary:
      "Digital Selective Calling, GMDSS'in dijital uyarı katmanıdır; otomatik konumlu distress/urgency çağrılarını ve seçilmiş istasyonla sessiz arama kurar.",
    icon: Waves,
    accent: "from-cyan-500 via-sky-500 to-blue-600",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/AN_ICS_DSC_2_GMDSS_control_panel.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/3/36/Sankt_Erik_VHF_marine_radio_DSC_0188w.jpg"
    ],
    duties: [
      "Tek tuşla MMSI ve GNSS konum bilgisi içeren distress alarmı gönderir",
      "Seçici arama ile belirli gemi/kiyi istasyonuna rutin veya urgency çağrı",
      "Otomatik ack/relay akışlarıyla SAR zincirinin hızlı kurulumu",
      "Gemiye ait MMSI, grup numarası ve RX/TX frekans setlerinin yönetimi"
    ],
    operations: [
      "GNSS girişinin doğruluğunu günlük kontrol et; konum yoksa manuel gir ve logla",
      "Distress kategorisi (fire, flooding, collision vb.) seçimini tatbikatlarda tekrar et",
      "RX/ACK işlemlerinde sesli takip için ilgili VHF veya MF/HF kanalına geçiş",
      "Gürültü ve yanlış alarm riskine karşı test çağrılarını (test call) mesai dışı yoğun olmayan zamanda yap"
    ],
    monitoring: [
      "Alarm geçmişini (log) yedekle; VDR entegrasyonu varsa kayıtların çalıştığını doğrula",
      "Anten ve modülasyon performansını SWR metre ve BITE self-test ile kontrol et",
      "Kurulum değişiklikleri sonrası MMSI, ATIS ve frekans tablolarını iki kişiyle çapraz doğrula",
      "Deneme çağrılarında alınan ACK sürelerini kaydedip kapsama kalitesini izleme"
    ],
    integration: [
      "Navtex ve AIS emniyet mesajlarıyla paralel uyarı; SAR koordinasyonunda EPIRB/PLB ile birlikte",
      "VHF-DSC ve MF/HF-DSC arasında bölgeye (Sea Area A1/A2/A3) göre otomatik öncelik",
      "Gemi telsiz el kitabı ve GMDSS konsolu üzerinde ortak alarm planı"
    ]
  },
  {
    id: "ecdis",
    name: "ECDIS",
    description: "Rota planlama, ENC güncellemeleri ve alarmlar",
    summary:
      "Elektronik seyir haritası sistemi; SOLAS uyumlu rota planlama, ENCs, alarmlar ve sensör entegrasyonu ile kâğıt haritaya eşdeğer resmi seyir sağlar.",
    icon: Navigation,
    accent: "from-emerald-500 via-teal-500 to-cyan-500",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Cap_San_Diego_Br%C3%BCcke_Radar_ECDIS.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/d/dc/Sichem_Osprey_radar_and_ECDIS.jpg"
    ],
    duties: [
      "Passage plan üretimi: appraisal–planning–execution–monitoring aşamalarının dijital yönetimi",
      "ENC güncellemeleri, T&P notları ve katmanların (CATZOC, batimetri, AIO) doğrulanması",
      "Sensor entegrasyonu: GPS/INS, gyro, log, AIS, radar overlay, Navtex/T&P layer",
      "Rota devri sırasında master/pilot review ve alarm limitlerinin yazılı onayı"
    ],
    operations: [
      "XTD, turn radius/speed ve safety contour/safety depth limitlerini sefer özelliklerine göre ayarla",
      "Look-ahead alarmlarını (shoal, nav aid, TSS, no-go) test et ve bridge team ile paylaş",
      "ENC cell lisanslarının süresini ve S-63/S-57/S-101 formatlarının uyumunu takip et",
      "UPS/güç yedekliliği ve sensör kaybı senaryolarında yedek ECDIS veya kağıt haritaya geçiş prosedürü"
    ],
    monitoring: [
      "Track control veya pilotage sırasında radar overlay parazit ve heading latency'yi izleme",
      "Position source değişimlerinde (GPS1 → GPS2 → DR/INS) alarm/ack zincirini belgeleyin",
      "Layer yoğunluğu ve parlaklık ayarlarını gece seyri için optimize et",
      "VDR ekran kayıtlarının çalıştığını periyodik kontrol et"
    ],
    integration: [
      "Conning display, pilot plug ve VTS paylaşımı için waypoint ve ETA çıktıları",
      "UKC/air-draft hesap modülleri, tidal/meteoroloji katmanları ve Navtex uyarılarını rota üzerine bindirme",
      "AIS, radar ARPA hedefleri ve CPA/TCPA katmanlarıyla birleşik durum farkındalığı"
    ]
  },
  {
    id: "radar",
    name: "Radar",
    description: "ARPA, CPA/TCPA ve yağmur/deniz clutter ayarları",
    summary:
      "Radar ve ARPA hedef takibi, çarpışma önleme ve yakın seyirde durumsal farkındalığın ana sensörüdür; deniz/yağmur clutter kontrolü güvenli ayrımı sağlar.",
    icon: RadarIcon,
    accent: "from-indigo-500 via-blue-600 to-slate-700",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/Tarmo_bridge_radar_display.JPG",
      "https://upload.wikimedia.org/wikipedia/commons/c/ca/Cap_San_Diego_Br%C3%BCcke_Radar_ECDIS.jpg"
    ],
    duties: [
      "Hedef tespiti ve ARPA takibiyle CPA/TCPA hesaplama",
      "Head-up/ North-up/ Course-up modlarıyla pilotaj ve açık deniz kullanımına uygun görünüm",
      "True/relative motion ve ground/sea stabilization yönetimi",
      "Guard zone, exclusion zone ve alarm ayarlarıyla erken uyarı"
    ],
    operations: [
      "Gain, sea, rain clutter ve interference rejection ayarlarını çevre koşullarına göre optimize et",
      "Paralel index (PI) ve VRM/EBL ile referans mesafe/açılar oluştur",
      "Target swap ve manual acquire kullanarak yanlış ARPA eşleşmelerini düzelt",
      "Heading/görüntü gecikmesi için gyro latency ve log kaymasını düzenli kontrol et"
    ],
    monitoring: [
      "Gyro, log ve GPS kaynaklarında kopma yaşanırsa STW/COG fallback modlarına geç",
      "Close-quarters manevrada guard zone alarm sürelerini kısalt ve güvenli limiti daralt",
      "X-band/S-band seçimini görüş, yağmur ve yol tutuşuna göre yap",
      "Ekran parlaklığı ve renk paletini gece görüşünü bozmayacak şekilde ayarla"
    ],
    integration: [
      "ECDIS radar overlay ve AIS target fusion ile birleşik tablo",
      "VDR kayıt çıkışları ve bridge alert management (BAM) sistemine alarm gönderimi",
      "ARPA hedeflerinin VHF/DSC/AIS ile doğrulanarak köprüüstü iletişim"
    ]
  },
  {
    id: "navtex",
    name: "Navtex",
    description: "Meteoroloji, seyir uyarıları ve MSI mesajları",
    summary:
      "Navigational Telex, kıyı istasyonlarından seyrüsefer ve meteoroloji uyarılarını otomatik alır; MSI ve SAR bildirimleri için düşük bant genişlikli zorunlu GMDSS katmanıdır.",
    icon: SatelliteDish,
    accent: "from-amber-500 via-orange-500 to-rose-500",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/1/1f/Navtex.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e8/NASA-Marine-NAVTEX-RX.jpg"
    ],
    duties: [
      "NAVAREA/METAREA yayınlarının otomatik alımı ve kategorilere göre filtrelenmesi",
      "SAR, seyir engelleri, fener/dalmaçya arızaları ve meteorolojik fırtına uyarılarının köprüüstüne iletimi",
      "Yeni mesajların ECDIS/rota planına yansıtılması ve watchkeeper imzasıyla loglanması",
      "B1/B2 kod yönetimiyle bölgesel gereksiz trafiğin süzülmesi"
    ],
    operations: [
      "518/490/4209.5 kHz frekanslarını deniz alanına göre seç ve anten uyumluluğunu doğrula",
      "Mesaj sınıflarını (A=seyir, B=meteoroloji, D=SAR vb.) filtrele; otomatik çıktı yazdırma/arkivle",
      "Makine/eşik paraziti durumunda anten topraklama ve kablo ekranlamasını kontrol et",
      "Mesaj saatlerini UTC olarak köprüüstü jurnaline kaydet, pilotage öncesi yeni yayın var mı kontrol et"
    ],
    monitoring: [
      "Alım kalitesini sinyal seviyesi ve hata oranıyla takip et; zayıf alımda frekans/power ayarı yap",
      "Eski mesajları periyodik silerek hafıza doluluk alarmını önle",
      "NAVTEX Tx arızalarında alternatif MSI kaynağı olarak Inmarsat SafetyNET veya VHF Sécurité anonslarını hazır tut",
      "Tehlike mesajlarını bridge team'e sözlü aktar ve ECDIS üzerinde ilgili noktayı işaretle"
    ],
    integration: [
      "ECDIS üzerinde T&P/temporary notice katmanına manuel işaretleme",
      "GMDSS konsolu, köprüüstü durum ekranı ve VDR kayıt entegrasyonu",
      "AIS emniyet mesajları ve DSC uyarılarıyla birlikte alarm matrisine dahil et"
    ]
  },
  {
    id: "ais",
    name: "AIS",
    description: "Mesaj tipleri, target filtreleri ve emniyet mesajları",
    summary:
      "Automatic Identification System, seyir bilgilerini yayınlar ve alır; çarpışma önleme, trafik resmi ve liman otoritesi bilgi akışı için ana veri kaynağıdır.",
    icon: Radio,
    accent: "from-violet-500 via-indigo-500 to-blue-500",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/6/63/Ais_dcu_bridge.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/f/fc/Nauticast_Inland_AIS_Transponder_make_ACR_type_R-4-203.JPG"
    ],
    duties: [
      "Statik (IMO, MMSI, çağrı adı) ve dinamik (SOG, COG, ROT) bilgileri periyodik yayınlama",
      "Voyage related veriler (ETA, yük, varış limanı, taslak) ve emniyet mesajları",
      "Hedeflerin CPA/TCPA bilgisini radar/ECDIS ile karşılaştırma",
      "SART/AtoN/BASE station mesajlarını izleme ve raporlama"
    ],
    operations: [
      "Yanlış kimlik yayınını önlemek için statik verileri sefer başında çift kontrol et",
      "Silent mode veya düşük güç modunu sadece otorite talebiyle ve kayıt altına alarak kullan",
      "Target filtreleriyle gereksiz yakın kıyı trafiğini süz, fakat emniyet mesajlarını açık bırak",
      "Pilot plug veya VTS entegrasyonu için NMEA/USB çıkışlarını doğrula"
    ],
    monitoring: [
      "GPS kaynağı kaybında dead reckoning yayınına geçildiğini alarm ekranından izle",
      "CPA/TCPA farkları görürsen radar/visual doğrulaması yap ve bridge team'e bildir",
      "SOTDMA/CSTDMA slot çakışmalarında TX gecikmelerini logla",
      "Çevre gemilerden alınan safety related message (SRM) içeriklerini köprü defterine geçir"
    ],
    integration: [
      "ECDIS ve radar overlay üzerinde hedef kimliklerinin görüntülenmesi",
      "VDR kayıtlarına AIS girişinin sağlandığını ve zaman senkronunun doğru olduğunu kontrol et",
      "DSC ve VHF çağrılarında MMSI seçimi için AIS hedef listesini kullan"
    ]
  },
  {
    id: "gyro",
    name: "Gyro / Pusula",
    description: "Heading kontrolü, düzeltmeler ve hata analizi",
    summary:
      "Gyro ve manyetik pusula, heading referansını sağlar; sensör entegrasyonunda hataların izlenmesi rota tutuşu ve sensör güvenliği için kritiktir.",
    icon: Compass,
    accent: "from-slate-600 via-gray-700 to-stone-800",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/f/fe/NS_Savannah_-_Close-up_of_Gyrocompass.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/US_Navy_091002-N-0807W-006_Quartermaster_Seaman_Ricky_C._Rodriguez_uses_a_gyrocompass_during_sea_and_anchor_detail_aboard_the_amphibious_dock_landing_ship_USS_Harpers_Ferry_%28LSD_49%29.jpg"
    ],
    duties: [
      "COG/heading referansı sağlayarak radar, ECDIS, autopilot ve conning sistemlerini besler",
      "Gyro deviation ve magnetic variation hesaplarıyla gerçek/Manyetik yönleri düzeltir",
      "Emergency steering ve manyetik pusula yedeklemesi için sürekli hazır tutma",
      "Hava koşulları, hız ve enleme bağlı gyro drift takibi"
    ],
    operations: [
      "Gyro settle time sonrası heading'i pelorus veya azimuth mirror ile doğrula",
      "Manyetik pusula için günlük/haftalık deviasyon kaydı ve flinders/flinder çubuk kontrolü",
      "Sensor selection panelinden gyro1/gyro2 veya compass fallback seçimini kayıt altına al",
      "UPS ve power supply kontrolü; alarm durumunda autopilot'u hand steering'e geçir"
    ],
    monitoring: [
      "Drift veya ani sapmalarda diğer sensörlerle (GPS COG, visual transit) karşılaştırma",
      "Radar/ECDIS üzerindeki heading latency veya offset'i periyodik test et",
      "Repeaters ve bearing repeaters'ın kalibrasyonunu kontrol et",
      "Magnetic compass'ta kabarcık, card lekesi, aydınlatma ve degaussing etkilerini gözle"
    ],
    integration: [
      "Autopilot ve track control için heading/ROT girdisi",
      "VDR, radar, ECDIS ve AIS'e NMEA heading bilgisi dağıtımı",
      "Rate-of-turn verisinin pilotage ve manevra kayıtlarında kullanımı"
    ]
  },
  {
    id: "autopilot",
    name: "Otopilot",
    description: "Track control, yaw damping ve alarm limitleri",
    summary:
      "Otopilot, rota veya track takip ederken dümen komutlarını optimize eder; yakıt, konfor ve güvenlik için kontrol modları ve limitler hassas ayarlanmalıdır.",
    icon: Navigation2,
    accent: "from-teal-500 via-cyan-500 to-blue-500",
    images: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a1/Boat_autopilot.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/1/1a/Yacht_Instruments%2C_Southerly_Pearl.jpg"
    ],
    duties: [
      "Heading hold, course over ground veya track control modlarında otomatik dümenleme",
      "Rudder limit, rate limit ve yaw damping ile konforlu ve ekonomik seyir",
      "Track cross error, drift ve set için hata düzeltmesi",
      "Hand-over/take-over prosedürlerinde hızlı geçiş ve alarm yönetimi"
    ],
    operations: [
      "Pilotaj ve dar geçitlerde el ile dümen; açık denizde uygun gain ve counter rudder ayarı",
      "Track control modunda ECDIS ile waypoint doğrulaması ve XTD limitlerini aktifleştir",
      "Rudder ve rate limitlerini hava/deniz durumuna göre artır veya azalt",
      "Alarmları (off-course, gyro fail, follow-up fail) test ederek bridge log'a işle"
    ],
    monitoring: [
      "Yaw ve heading sapmalarını trend olarak izle; aşırı trim veya yük dengesizliğinde ayarları güncelle",
      "Hydraulic/steering gear basınç ve yağ sıcaklıklarını alarm panelinden takip et",
      "Rudder angle feedback ile otopilot komutlarının tutarlılığını doğrula",
      "E-Nav entegrasyonlarında sensör kaybında otomatik hand steering'e düşme davranışını test et"
    ],
    integration: [
      "Gyro, log ve GPS'ten heading/COG/SOG girdileri; ECDIS track control arayüzü",
      "VDR ve bridge alert management sistemine alarm/veri çıkışı",
      "Follow-up/Non-follow-up (NFU) ve tiller/joystick kontrol istasyonlarıyla birlikte çalışır"
    ]
  }
];

export const bridgeDeviceMap = bridgeDevices.reduce((acc, device) => {
  acc[device.id] = device;
  return acc;
}, {} as Record<BridgeDeviceId, BridgeDeviceInfo>);
