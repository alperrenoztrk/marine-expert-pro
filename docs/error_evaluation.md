# Maritime Calculator Hata Değerlendirmesi

Bu doküman, depoda bulunan Streamlit tabanlı gemi stabilite uygulaması ile TypeScript hesaplama motorunun mevcut hatalarını ve çalıştırma sırasında karşılaşılan sorunları özetler.

## 1. Bağımlılık / Kurulum Sorunları
- `npm install` komutu, `onnxruntime-node` paketinin NVIDIA CUDA bağımlılıklarını ve GitHub'dan ikili dosya indirmesini gerektirmesi nedeniyle çevrimdışı ortamda başarısız oluyor. Hata mesajı `nvcc not found` ve `connect ENETUNREACH` ile sona eriyor.【ad9a8e†L1-L27】
  - **Etkisi:** Front-end tarafındaki TypeScript/Vite projesinin bağımlılıkları yüklenemiyor; lint/build komutları çalıştırılamıyor.
  - **Öneri:** 
    - GPU yerine CPU sürümünü kullanmak için `npm_config_onnxruntime_download_gpu=false` parametresiyle kurulumu zorlayın ya da doğrudan `onnxruntime-web` gibi tarayıcı uyumlu paketlere geçin.
    - CI/CD ortamında `npm install --ignore-scripts` gibi komutlarla sorunlu scriptleri geçici olarak atlayıp, model dosyalarını manuel paketleyin.

## 2. Streamlit Uygulaması (Python) Hataları
- Kullanıcı arayüzü `deplasman` değerine `0` girilmesine izin veriyor (minimum değer 0). Bu değerle oluşturulan `EnineStabiliteHesaplama` nesnesinin bir çok metodunda doğrudan `self.deplasman` ile bölme işlemi yapılıyor ve `ZeroDivisionError` oluşuyor. Örnekler:
  - `gm_degisimi_yuk_hareketi`, `gz_hesapla`, `bumba_kren_gm_degisimi`, `gm_kuculmesi_fsm` fonksiyonları `self.deplasman` ile bölüyor.【F:stability_calculator.py†L72-L139】【F:stability_calculator.py†L173-L183】
  - `yeni_kg_hesapla` fonksiyonu, toplam ağırlık değişimi gemiyi tekrar 0 tona getirirse `toplam_agirlik` değişkeni sıfır oluyor ve yine sıfıra bölme gerçekleşiyor.【F:stability_calculator.py†L63-L70】
- Streamlit arayüzü bu fonksiyonları kullanıcı aksiyonlarına bağlı olarak tetikliyor ve minimum değer kontrolü olmadığı için uygulama kolayca çöker.【F:streamlit_app.py†L30-L118】【F:streamlit_app.py†L213-L315】
  - **Öneri:** Kullanıcı girdilerinde `min_value` değerini `> 0` yapın veya servis katmanında `deplasman <= 0` kontrolü ekleyerek kullanıcıya hata mesajı gösterin.

## 3. TypeScript Hesaplama Motoru Hataları
- `StabilityCalculationEngine.computeLoadingTotals` fonksiyonu, yük listesi boş olduğunda `itemWeights` sıfır olduğu halde `itemLCG`, `itemTCG`, `itemVCG` değerlerini `itemWeights`e bölüyor ve `NaN` üretiyor. Ardından toplam deplasman da sıfırsa LCG/TCG/KG hesaplamalarında `NaN` veya `Infinity` dönebiliyor.【F:src/services/stabilityCalculationEngine.ts†L82-L154】
  - **Öneri:** Yük listesi boşsa bu ortalama hesaplarını atlayın ve toplam deplasmanı sıfıra eşit olduğunda erken çıkış / hata fırlatın.
- Aynı fonksiyonda `total_displacement` sıfır olursa (örneğin sadece hava draftı girilmiş bir gemi verisi) `LCG`, `TCG`, `KG` ve `KG_corrected` hesaplarında sıfıra bölme gerçekleşiyor.【F:src/services/stabilityCalculationEngine.ts†L141-L144】
  - **Öneri:** `total_displacement <= 0` durumunda kullanıcıya uyarı dönün ve hesaplamayı sonlandırın.

## 4. Genel Öneriler
- Hem Python hem TypeScript tarafında ortak payda olan “deplasman = 0” senaryosunu giriş doğrulamalarıyla engelleyin.
- Tip güvenliği açısından, kritik hesapların yapıldığı fonksiyonlara `try/except` ya da guard kontrolleri ekleyip kullanıcıya anlaşılır hata mesajları sağlayın.

Bu tespitler öncelikle uygulamanın stabil çalışmasına engel olan koşulları belirlemekte ve düzeltme önerileri sunmaktadır.
