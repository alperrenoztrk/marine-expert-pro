# 🚀 Lovable Deployment Status

## 📋 Son Güncellemeler
- **Tarih:** 2025-08-18
- **Sürüm:** v2.5.1
- **Durum:** ✅ Aktif - Stabilite menüsündeki "Stabilite" bağlantısının açılmama sorunu giderildi (eksik rota eklendi)

## 🔧 Son Yapılan Değişiklikler

### 🛠️ Rota Düzeltmesi (2025-08-18)
- “Stabilite” bağlantısı `"/stability/stability"` rotasına gidiyordu ancak rota tanımlı değildi; `src/App.tsx` içine eksik rota eklendi
- Etki: Stabilite hesaplamaları sayfası artık menüden sorunsuz açılıyor

### 🎨 Arayüz ve Navigasyon (2025-08-16)
- Hesaplamalar menüsü yalnızca ana başlıkları gösterecek şekilde sadeleştirildi
- “Stabilite” linki her zaman stabilite seçenek menüsüne açılıyor
- Ana sayfadaki global Stabilite Asistanı kaldırıldı (yalnızca ilgili stabilite sayfalarında görünür)
- “Stabilite Kuralları” ve “Temel Düzey” sayfaları eklendi; sayısal kriterler genişletildi
- IBC/IGC bölümüne ek notlar (sızıntı, buharlaşma, yeni kargo tipleri) eklendi

---

## Önceki Kayıtlar
- 2025-08-16 — v2.5.0: Ana menü sadeleştirildi, Stabilite asistanı ana sayfadan kaldırıldı, stabilite kuralları sayfaları eklendi/güncellendi, yönlendirmeler düzeltildi
- 2025-08-15 — v2.4.16: Hesaplamalar menüsü ve rota düzeltmeleri
- 2025-08-10 — v2.4.15: Tahıl stabilitesi bölümündeki tekrar kaldırıldı
- 2025-08-10 — v2.4.14: Kargo sade menü ve ayrı sayfalar
- 2025-08-10 — v2.4.13: Kargo UI/UX geliştirmeleri
- 2025-08-10 — v2.4.12: Kargo ileri özellikler (IMDG+, optimizer+, SF/BM, Grain, Manifest)

**🎯 Lovable otomatik olarak güncelleniyor!** Değişiklikler ana dala işlendiğinde ve yeni sürüm etiketi (`vX.Y.Z`) gönderildiğinde Lovable dağıtımı tetiklenir.