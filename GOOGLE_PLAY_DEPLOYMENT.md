# 🚀 Google Play Store'a Yayınlama Rehberi

## 📱 **Denizcilik Hesaplayıcısı - Android APK Oluşturma**

### **1️⃣ Gereksinimler**

#### **Sistem Gereksinimleri:**
- Node.js 18+ 
- Android Studio (latest)
- Java Development Kit (JDK) 17+
- Android SDK (API 33+)

#### **Geliştirici Hesapları:**
- Google Play Console Geliştirici Hesabı ($25 tek seferlik ücret)
- Lovable hesabı (mevcut)

### **2️⃣ Yerel Geliştirme Ortamı Kurulumu**

```bash
# Projeyi klonlayın
git clone <your-repo-url>
cd maritime-calculator

# Dependencies yükleyin
npm install

# Production build oluşturun
npm run build

# Android platform ekleyin
npm run cap:add:android

# Capacitor sync
npm run cap:sync

# Android Studio'yu açın
npm run cap:open:android
```

### **3️⃣ Android Studio'da APK Oluşturma**

#### **A) Development APK (Test İçin):**
1. Android Studio'da projeyi açın
2. **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
3. APK dosyası: `android/app/build/outputs/apk/debug/app-debug.apk`

#### **B) Production APK (Google Play İçin):**

**Keystore Oluşturma:**
```bash
keytool -genkey -v -keystore maritime-calculator.keystore -alias maritime-key -keyalg RSA -keysize 2048 -validity 10000
```

**build.gradle düzenlemesi:**
```gradle
android {
    signingConfigs {
        release {
            storeFile file('maritime-calculator.keystore')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'maritime-key'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Release APK Oluşturma:**
```bash
# Android Studio'da
Build > Generate Signed Bundle / APK > APK > Next
# Keystore bilgilerini girin > Create APK
```

### **4️⃣ Google Play Console Kurulumu**

#### **A) Uygulama Oluşturma:**
1. [Google Play Console](https://play.google.com/console)'a giriş yapın
2. **Create app** butonuna tıklayın
3. Uygulama bilgilerini doldurun:
   - **App name:** "Denizcilik Hesaplayıcısı"
   - **Default language:** Turkish
   - **App or game:** App
   - **Free or paid:** Free

#### **B) Store Listing Bilgileri:**
```
App name: Denizcilik Hesaplayıcısı
Short description: Maritime mühendisliği hesaplamaları ve AI asistanı
Full description: 
Denizcilik mühendisliği alanında çalışan profesyoneller için kapsamlı hesaplama aracı. Stabilite, trim, hidrodinamik, navigasyon ve daha birçok maritime hesaplamayı kolayca yapabilir, AI asistanı ile sorularınıza yanıt alabilirsiniz.

Özellikler:
• Stabilite hesaplamaları (GM, BM, KM)
• Trim ve boyuna stabilite
• Hidrodinamik hesaplamalar
• Navigasyon ve seyir hesaplamaları
• Motor ve yakıt hesaplamaları
• Kargo ve balast hesaplamaları
• AI asistanı ile maritime sorular
• Offline çalışma desteği
• Modern ve kullanıcı dostu arayüz

Category: Tools
Tags: maritime, engineering, shipping, naval, calculator
```

#### **C) App Content:**
- **Target age:** 13+
- **Content rating:** Everyone
- **Privacy policy:** (Gerekirse oluşturun)
- **Data safety:** (Veri toplama politikanızı belirtin)

### **5️⃣ APK Yükleme ve Test**

#### **A) Internal Testing:**
1. **Testing** > **Internal testing** > **Create new release**
2. APK dosyanızı sürükleyip bırakın
3. Release notes ekleyin
4. **Save** > **Review release** > **Start rollout to internal testing**

#### **B) Test Kullanıcıları:**
1. **Testing** > **Internal testing** > **Testers** 
2. Email adreslerini ekleyin
3. Test linkini test kullanıcılarına gönderin

### **6️⃣ Production Release**

#### **A) Release Hazırlığı:**
1. **Production** > **Countries/regions** > Türkiye'yi seçin
2. **App content** bölümünü tamamlayın
3. **Policy** sayfasını onaylayın

#### **B) APK Upload:**
1. **Production** > **Create new release**
2. Signed APK dosyanızı yükleyin
3. Release notes yazın (Türkçe):
```
İlk sürüm - v1.0.0

Yeni Özellikler:
✓ Stabilite hesaplamaları
✓ Trim ve boyuna stabilite
✓ Hidrodinamik hesaplamalar
✓ Navigasyon hesaplamaları
✓ AI asistanı desteği
✓ Mobil responsive tasarım
✓ Offline çalışma desteği
```

#### **C) Review ve Yayınlama:**
1. **Review release** butonuna tıklayın
2. Tüm bilgileri kontrol edin
3. **Start rollout to production** ile yayınlayın

### **7️⃣ Lovable'dan Sürekli Deployment**

#### **A) GitHub Actions Kurulumu:**
```yaml
# .github/workflows/android-build.yml
name: Build Android APK
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build project
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync
      
      - name: Build APK
        run: |
          cd android
          ./gradlew assembleRelease
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: android/app/build/outputs/apk/release/app-release.apk
```

### **8️⃣ Icon ve Asset'ler**

#### **A) App Icon Gereksinimleri:**
- **512x512 px** (High-res icon - Google Play)
- **192x192 px** (App icon)
- PNG format, şeffaflık yok

#### **B) Screenshots:**
- **Phone:** 1080x1920 px (en az 2, en fazla 8)
- **Tablet:** 1200x1920 px (isteğe bağlı)

#### **C) Feature Graphic:**
- **1024x500 px** (Google Play banner)

### **9️⃣ Monetization (İsteğe Bağlı)**

#### **A) Reklam Entegrasyonu:**
```bash
npm install @capacitor-community/admob
```

#### **B) In-App Purchase:**
```bash
npm install @capacitor-community/in-app-purchases
```

### **🔟 Publishing Checklist**

- [ ] APK signed ve test edildi
- [ ] Store listing bilgileri tamamlandı
- [ ] App content ve policy onaylandı
- [ ] Screenshots ve iconlar yüklendi
- [ ] Internal testing tamamlandı
- [ ] Production release oluşturuldu
- [ ] Google Play review beklemede

### **📊 Beklenen Timeline**

- **APK Hazırlama:** 1-2 gün
- **Google Play Setup:** 2-3 gün  
- **Google Review:** 1-7 gün
- **Toplam:** 4-12 gün

### **💡 Pro Tips**

1. **Privacy Policy:** Basit bir politika oluşturun
2. **ASO (App Store Optimization):** Anahtar kelimeleri optimize edin
3. **Rating:** İlk kullanıcılardan rating isteyin
4. **Updates:** Düzenli güncellemeler yayınlayın
5. **Feedback:** Kullanıcı yorumlarını takip edin

---

**🎯 Sonuç:** Bu rehberi takip ederek Lovable projenizi başarıyla Google Play Store'da yayınlayabilirsiniz!