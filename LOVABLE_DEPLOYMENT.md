# 🚀 Lovable Deployment Status

## 📋 Son Güncellemeler
- **Tarih:** 2025-08-23
- **Sürüm:** v2.5.16
- **Durum:** ✅ Otomatik Lovable güncelleme (squash-merge akışı)

- **Tarih:** 2025-08-23
- **Sürüm:** v2.5.15
- **Durum:** ✅ Otomatik Lovable güncelleme (squash-merge akışı)

- **Tarih:** 2025-08-23
- **Sürüm:** v2.5.14
- **Durum:** ✅ Otomatik Lovable güncelleme (squash-merge akışı)

- **Tarih:** 2025-08-22
- **Sürüm:** v2.5.13
- **Durum:** ✅ Aktif — Mark “Regülasyon Rehberi” personası; ALRS/NAVTEX/GMDSS yerel bilgi eşlemeleri, UI etiketi güncellendi

## 🔧 Son Yapılan Değişiklikler

### 🧭 Mark — Regülasyon Rehberi Odak (2025-08-22)
- Persona: Yanıt formatı “Kaynak / Erişim / Not” olacak şekilde revize edildi
- Yerel bilgi eşlemeleri: Weather Fax → ALRS Vol 3; NAVTEX → ALRS Vol 3; VHF/liman → ALRS Vol 6; GMDSS → ALRS Vol 5 vb.
- Ana sayfa: Buton etiketi “Regülasyon Rehberi: Mark” olarak güncellendi
- Derleme ve doğrulama yapıldı

### 🧮 Stabilite Hesaplamaları UI Senkronizasyonu (2025-08-22)
- `ComprehensiveMaritimeCalculations.tsx`: Tüm formül bölümlerine “Amaç” açıklamaları eklendi
- Sekme etiketleri listede verilen başlıklarla uyumlu hale getirildi (Enine/ Boyuna/ Duba ve Yoğunluk/ SOLAS/ Yük)
- Derleme doğrulandı (vite build)

### 🛠️ Rota Düzeltmesi (2025-08-18)
- “Stabilite” bağlantısı `"/stability/stability"` rotasına gidiyordu ancak rota tanımlı değildi; `src/App.tsx` içine eksik rota eklendi
- Etki: Stabilite hesaplamaları sayfası artık menüden sorunsuz açılıyor

### 🚀 Lovable Yayını (2025-08-18)
- v2.5.1 etiketi hatalı derlemeye işaret edebileceği için `v2.5.2` etiketi oluşturuldu ve ana dala bağlandı

### 🧭 Stabilite ve Navigasyon Güncellemeleri (2025-08-20)
- Stability 2 sayfası kaldırıldı; `/stability` artık `StabilityMenu` açıyor
- Bonjean, stabilite menüsünden ve hızlı bağlantılardan kaldırıldı (rota erişimi kapatıldı)
- Stabilite Asistanı tam ekran ve inline tetikleme ile güncellendi; başlıklar sadeleştirildi
- Asistan, Google Cloud Gemini (1.5 Flash) doğrudan çağrımıyla çalışıyor, Edge Function fallback korunuyor

### 📚 Almanak Eklentisi (2025-08-20)
- `NavigationCalculations` bileşeninde “Almanac” sekmesi zenginleştirildi (PDF bağlantıları, hızlı tablolar)
- `Navigation` sayfası `?tab=` sorgu parametresinden başlangıç sekmesini alacak şekilde güncellendi
- `NavigationMenu` içine “Almanak” hızlı bağlantısı eklendi

### 🗂️ Stabilite Menü Reorganizasyonu (2025-08-20)
- ### ⚓ Stabilite Modları (2025-08-20)
- Temel: GM, KM, BM, TPC, draft değişimi, LCG hızlı hesaplamaları
- Gelişmiş: Gemi profili sihirbazı (L,B,D,T,Cb,Cwp,tanklar), tek seferlik veri, gelişmiş hesaplamalarda kullanım

- ### 📦 Kargo Temizliği (2025-08-20)
- Üst KPI barı (Kargo/Toplam Ağırlık/TEU/DG/Tahmini Maliyet) kaldırıldı
- `StabilityMenu` yeniden düzenlendi: Enine, Boyuna, Intact, Damage, Dinamik, Yükleme & Denge, Boyuna Dayanım, Hat Başlıkları, Doğrulama & Kalibrasyon başlıkları altında gruplandı
- Var olan sayfalara mantıklı bağlantılarla yönlendirildi (ör. Dinamik → Analiz/GZ, Yükleme & Denge → Kargo/Balast)

---

## Önceki Kayıtlar
- 2025-08-22 — v2.5.12: Formüller “Amaç” açıklamaları + sekme eşleştirme; Lovable senkron
- 2025-08-22 — v2.5.10: Hedef-temelli sihirbaz, dinamik giriş/çıktı; profil opsiyonel
- 2025-08-16 — v2.5.0: Ana menü sadeleştirildi, Stabilite asistanı ana sayfadan kaldırıldı, stabilite kuralları sayfaları eklendi/güncellendi, yönlendirmeler düzeltildi
- 2025-08-15 — v2.4.16: Hesaplamalar menüsü ve rota düzeltmeleri
- 2025-08-10 — v2.4.15: Tahıl stabilitesi bölümündeki tekrar kaldırıldı
- 2025-08-10 — v2.4.14: Kargo sade menü ve ayrı sayfalar
- 2025-08-10 — v2.4.13: Kargo UI/UX geliştirmeleri
- 2025-08-10 — v2.4.12: Kargo ileri özellikler (IMDG+, optimizer+, SF/BM, Grain, Manifest)

**🎯 Lovable otomatik olarak güncelleniyor!** Değişiklikler ana dala işlendiğinde ve yeni sürüm etiketi (`vX.Y.Z`) gönderildiğinde Lovable dağıtımı tetiklenir.