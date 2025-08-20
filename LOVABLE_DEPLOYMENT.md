# 🚀 Lovable Deployment Status

## 📋 Son Güncellemeler
- **Tarih:** 2025-08-20
- **Sürüm:** v2.5.3
- **Durum:** ✅ Aktif - Stabilite mimarisi sadeleştirildi (Stability 2 kaldırıldı), Bonjean menüden çıkarıldı, Stabilite Asistanı (tam ekran + inline), Google Cloud Gemini ana akışa alındı

## 🔧 Son Yapılan Değişiklikler

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

---

## Önceki Kayıtlar
- 2025-08-16 — v2.5.0: Ana menü sadeleştirildi, Stabilite asistanı ana sayfadan kaldırıldı, stabilite kuralları sayfaları eklendi/güncellendi, yönlendirmeler düzeltildi
- 2025-08-15 — v2.4.16: Hesaplamalar menüsü ve rota düzeltmeleri
- 2025-08-10 — v2.4.15: Tahıl stabilitesi bölümündeki tekrar kaldırıldı
- 2025-08-10 — v2.4.14: Kargo sade menü ve ayrı sayfalar
- 2025-08-10 — v2.4.13: Kargo UI/UX geliştirmeleri
- 2025-08-10 — v2.4.12: Kargo ileri özellikler (IMDG+, optimizer+, SF/BM, Grain, Manifest)

**🎯 Lovable otomatik olarak güncelleniyor!** Değişiklikler ana dala işlendiğinde ve yeni sürüm etiketi (`vX.Y.Z`) gönderildiğinde Lovable dağıtımı tetiklenir.