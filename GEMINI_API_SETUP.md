# 🤖 Gemini API Kurulum Rehberi

## 📋 Gemini API Anahtarı Alma (5 Dakika)

### Adım 1: Google AI Studio'ya Girin
1. **Web tarayıcınızda** [Google AI Studio](https://aistudio.google.com/apikey) adresine gidin
2. **Google hesabınızla** giriş yapın (Gmail, Google hesabı)
3. Hesap doğrulaması gerekirse tamamlayın

### Adım 2: API Anahtarı Oluşturun
1. **"Get API key"** butonuna tıklayın (sağ üst köşe)
2. **"Create API key"** seçeneğini seçin
3. **"Create API key in new project"** veya mevcut projeyi seçin
4. API anahtarı oluşturulacak (yaklaşık 40 karakter)

### Adım 3: API Anahtarını Kopyalayın
```bash
# API anahtarı örneği (bu gerçek değil):
AIzaSyDExample_Your_Real_API_Key_Here_123456789
```

⚠️ **ÖNEMLİ:** Bu anahtarı güvenli bir yerde saklayın - tekrar gösterilmeyecek!

---

## 🔧 Lovable Project'e Entegrasyon

### Adım 1: Lovable Environment Variables
1. **Lovable Project Dashboard**'a gidin
2. **Settings** → **Environment Variables** bölümüne gidin
3. Yeni environment variable ekleyin:
   ```
   Variable Name: GEMINI_API_KEY
   Variable Value: YOUR_ACTUAL_API_KEY_HERE
   ```
4. **Save** butonuna tıklayın

### Adım 2: Supabase Secrets (Opsiyonel)
Eğer Supabase kullanıyorsanız:
1. Supabase Dashboard → Project Settings → API
2. Environment Variables bölümüne gidin
3. `GEMINI_API_KEY` ekleyin

---

## 📊 API Limitleri (2024/2025 - ÜCRETSİZ)

### Günlük Limitler
- **60 request/minute** (dakika başına)
- **300,000 token/day** (günlük)
- **Gemini 2.5 Flash & Pro** dahil

### Model Özellikleri
- **Context Window:** 1M token'a kadar
- **Multimodal:** Text, image, audio, video
- **Languages:** 100+ dil desteği (Türkçe dahil)

---

## 🧪 Test Etme

### 1. Yerel Test (Terminal)
```bash
# Terminal'de test edin:
export GEMINI_API_KEY="your_actual_api_key"
node test-gemini.js
```

### 2. App İçinde Test
1. Maritime Calculator uygulamasını açın
2. **"AI Test Modu"** kartına tıklayın
3. Soru yazın ve test edin
4. Simülasyon yanıtı görmelisiniz

### 3. Gerçek API Test
API anahtarını ekledikten sonra:
1. **"AI Asistana Sor"** sayfasına gidin (/formulas)
2. Maritime mühendisliği sorusu yazın
3. Gerçek Gemini yanıtı almalısınız

---

## 🔒 Güvenlik Kuralları

### ❌ YAPMAYINLAR:
- API anahtarını GitHub'a commit etmeyin
- Client-side kodda API anahtarını hardcode etmeyin
- API anahtarını public olarak paylaşmayın
- Screenshot'larda API anahtarını göstermeyin

### ✅ YAPILAR:
- Environment variable olarak saklayın
- Server-side (Supabase Edge Function) kullanın
- API anahtarına restriction ekleyin
- Düzenli olarak rotate edin

---

## 🚀 Maritime Calculator'da Kullanım

### Özellikler
- **Maritime AI Asistan:** Denizcilik sorularına cevap
- **Formül Açıklamaları:** GM, stabilite, trim hesaplamaları
- **Türkçe Dil Desteği:** Otomatik çeviri
- **Hibrit Sistem:** Gemini + Wolfram Alpha

### Kullanım Alanları
```
✅ Desteklenen Sorular:
• "GM hesaplaması nedir?"
• "Stabilite kriterleri nelerdir?"
• "Trim açısı nasıl bulunur?"
• "SOLAS standartları neler?"
• "Ballast hesaplaması"
• "Navigasyon formülleri"
```

---

## 🐛 Sorun Giderme

### API Anahtarı Çalışmıyor
```bash
Error: "API key not valid"
```
**Çözüm:**
1. API anahtarının doğru kopyalandığını kontrol edin
2. Boşluk/ekstra karakter olmadığından emin olun
3. Google AI Studio'da anahtarın aktif olduğunu kontrol edin

### Quota Aşıldı
```bash
Error: "Rate limit exceeded"
```
**Çözüm:**
1. 1 dakika bekleyin (60 req/min limit)
2. Günlük 300K token limitini kontrol edin
3. Request boyutunu küçültün

### Network Hatası
```bash
Error: "Failed to fetch"
```
**Çözüm:**
1. İnternet bağlantısını kontrol edin
2. CORS ayarlarını kontrol edin
3. Supabase Edge Function loglarını kontrol edin

---

## 📈 Monitoring ve Optimizasyon

### Usage Tracking
1. **Google AI Studio Dashboard**'da usage görüntüleyin
2. **Daily token consumption** takip edin
3. **Request patterns** analiz edin

### Optimizasyon İpuçları
```javascript
// Token tasarrufu için:
- Kısa ve net promptlar yazın
- Gereksiz context'i çıkarın
- Cache mekanizması kullanın
- Batch requestler gönderin
```

---

## 🎯 Sonuç

Gemini API kurulumu tamamlandığında:

✅ **Hesaplamalar çalışacak**
✅ **AI asistan aktif olacak** 
✅ **Türkçe dil desteği**
✅ **Maritime uzmanlık alanı**
✅ **Ücretsiz kullanım (300K token/day)**

**🔗 Live Test:** https://dfc3279a-089d-4d25-bff1-ff197bc24769.lovableproject.com

Maritime Calculator artık tam özellikli AI destekli bir hesaplama platformu olacak!

---

## 📞 Destek

**Sorularınız için:**
- GitHub Issues
- Lovable Community
- Google AI Forum

**Maritime Calculator Support:**
- Live URL test edin
- AI Test Modu'nu deneyin
- Hesaplama kartlarını test edin