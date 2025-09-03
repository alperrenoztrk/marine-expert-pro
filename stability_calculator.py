"""
Gemi Enine Stabilite Hesaplamaları Modülü
Bu modül, gemi stabilitesi ile ilgili tüm hesaplamaları içerir.
"""

import math
from dataclasses import dataclass
from typing import List, Tuple, Optional


@dataclass
class YukBilgisi:
    """Yük bilgilerini tutan sınıf"""
    agirlik: float  # ton
    kg: float  # metre
    yatay_mesafe: float = 0  # metre (yatay hareket için)
    dikey_mesafe: float = 0  # metre (dikey hareket için)


@dataclass
class TankBilgisi:
    """Tank bilgilerini tutan sınıf"""
    boy: float  # metre
    en: float  # metre
    yukseklik: float  # metre
    doluluk_orani: float  # 0-1 arası
    sivi_yogunlugu: float = 1.025  # ton/m³ (deniz suyu için)


class EnineStabiliteHesaplama:
    """Enine stabilite hesaplamaları için ana sınıf"""
    
    def __init__(self, deplasman: float, km: float, kg: float):
        """
        Args:
            deplasman: Geminin deplasmanı (ton)
            km: Metasantr yüksekliği (metre)
            kg: Ağırlık merkezi yüksekliği (metre)
        """
        self.deplasman = deplasman
        self.km = km
        self.kg = kg
        self.gm = self.hesapla_gm()
    
    def hesapla_gm(self) -> float:
        """GM (Metasantr Yüksekliği) hesaplar"""
        return self.km - self.kg
    
    def hesapla_kb_bm(self, kb: float) -> float:
        """KM = KB + BM formülünden BM hesaplar"""
        return self.km - kb
    
    def yeni_kg_hesapla(self, yukler: List[YukBilgisi]) -> float:
        """
        Yükleme/tahliye sonrası yeni KG hesaplar
        
        Args:
            yukler: YukBilgisi listesi
            
        Returns:
            Yeni KG değeri (metre)
        """
        toplam_moment = self.deplasman * self.kg
        toplam_agirlik = self.deplasman
        
        for yuk in yukler:
            toplam_moment += yuk.agirlik * yuk.kg
            toplam_agirlik += yuk.agirlik
        
        return toplam_moment / toplam_agirlik
    
    def gm_degisimi_yuk_hareketi(self, w: float, d: float) -> float:
        """
        Yük hareketi veya yüklenmesi/tahliyesi sonucu GM değişimi
        
        Args:
            w: Yük miktarı (ton)
            d: Dikey veya yatay mesafe (metre)
            
        Returns:
            GG1 değeri (metre)
        """
        return (w * d) / self.deplasman
    
    def meyil_acisi_hesapla(self, gz: float) -> float:
        """
        Meyil açısını hesaplar
        
        Args:
            gz: Doğrultucu kol (metre)
            
        Returns:
            Meyil açısı (derece)
        """
        if self.gm == 0:
            return 0
        tan_phi = gz / self.gm
        return math.degrees(math.atan(tan_phi))
    
    def gz_hesapla(self, w: float, d: float) -> float:
        """
        GZ (Doğrultucu Kol) hesaplar
        
        Args:
            w: Yük miktarı (ton)
            d: Yatay mesafe (metre)
            
        Returns:
            GZ değeri (metre)
        """
        return (w * d) / self.deplasman
    
    def sarkac_ile_meyil_acisi(self, sapma: float, sarkac_boyu: float) -> float:
        """
        Sarkaç ile meyil açısı hesaplar
        
        Args:
            sapma: Sapma miktarı (metre)
            sarkac_boyu: Sarkaç boyu (metre)
            
        Returns:
            Meyil açısı (derece)
        """
        sin_phi = sapma / sarkac_boyu
        return math.degrees(math.asin(sin_phi))
    
    def bumba_kren_gm_degisimi(self, w: float, h_cunda: float, h_yuk: float) -> float:
        """
        Bumba/Kren operasyonlarında GM değişimi
        
        Args:
            w: Yük ağırlığı (ton)
            h_cunda: Cunda yüksekliği (metre)
            h_yuk: Yük yüksekliği (metre)
            
        Returns:
            GG1 değeri (metre)
        """
        return (w * (h_cunda - h_yuk)) / self.deplasman
    
    def havuzda_kritik_gm(self, mct_1cm: float, trim_cm: float, t: float) -> float:
        """
        Havuzda kritik GM hesabı
        
        Args:
            mct_1cm: 1 cm trim için moment (ton.m)
            trim_cm: Trim değeri (cm)
            t: Kıç topuk - F noktası mesafesi (metre)
            
        Returns:
            Kritik GM değeri (metre)
        """
        p = (mct_1cm * trim_cm) / t
        return (p * self.km) / self.deplasman
    
    def serbest_yuzey_etkisi(self, tanklar: List[TankBilgisi]) -> float:
        """
        Serbest yüzey etkisini hesaplar
        
        Args:
            tanklar: Tank bilgileri listesi
            
        Returns:
            Toplam FSM değeri (ton.m)
        """
        toplam_fsm = 0
        for tank in tanklar:
            if 0 < tank.doluluk_orani < 1:  # Kısmi dolu tanklar
                fsm = (tank.boy * tank.en**3 * tank.sivi_yogunlugu) / 12
                toplam_fsm += fsm
        return toplam_fsm
    
    def gm_kuculmesi_fsm(self, fsm: float) -> float:
        """
        Serbest yüzey etkisi nedeniyle GM küçülmesi
        
        Args:
            fsm: Free Surface Moment (ton.m)
            
        Returns:
            GG1 değeri (metre)
        """
        return fsm / self.deplasman
    
    def yalpa_periyodu(self, c: float, b: float) -> float:
        """
        Yalpa periyodu hesaplar
        
        Args:
            c: Geminin blok katsayısına bağlı sabit
            b: Gemi genişliği (metre)
            
        Returns:
            Yalpa periyodu (saniye)
        """
        if self.gm <= 0:
            return float('inf')
        return c * b / math.sqrt(self.gm)
    
    def kn_den_gz_hesapla(self, kn: float, phi_derece: float) -> float:
        """
        KN değerinden GZ hesaplar
        
        Args:
            kn: KN değeri (metre)
            phi_derece: Meyil açısı (derece)
            
        Returns:
            GZ değeri (metre)
        """
        phi_rad = math.radians(phi_derece)
        return kn - self.kg * math.sin(phi_rad)
    
    def dinamik_stabilite_alani_simpson(self, gz_degerleri: List[float], 
                                       aci_araligi: float) -> float:
        """
        Simpson kuralı ile dinamik stabilite alanı hesaplar
        
        Args:
            gz_degerleri: GZ değerleri listesi
            aci_araligi: Açı aralığı (derece)
            
        Returns:
            Alan (m.rad)
        """
        if len(gz_degerleri) < 3 or len(gz_degerleri) % 2 == 0:
            raise ValueError("Simpson kuralı için tek sayıda (en az 3) değer gerekli")
        
        h = math.radians(aci_araligi)
        alan = gz_degerleri[0] + gz_degerleri[-1]
        
        for i in range(1, len(gz_degerleri) - 1):
            if i % 2 == 1:
                alan += 4 * gz_degerleri[i]
            else:
                alan += 2 * gz_degerleri[i]
        
        return (h / 3) * alan
    
    def yarali_stabilite_draft_degisimi(self, w: float, boy: float, en: float, 
                                       yarali_alan: float) -> float:
        """
        Yaralı stabilite durumunda draft değişimi (Duba örneği)
        
        Args:
            w: Su girişi ağırlığı (ton)
            boy: Gemi/duba boyu (metre)
            en: Gemi/duba eni (metre)
            yarali_alan: Yaralı bölge alanı (m²)
            
        Returns:
            Draft değişimi (metre)
        """
        net_alan = (boy * en) - yarali_alan
        if net_alan <= 0:
            return float('inf')
        return w / net_alan
    
    def solas_kriterleri_kontrol(self, gz_egri: List[Tuple[float, float]]) -> dict:
        """
        SOLAS stabilite kriterlerini kontrol eder
        
        Args:
            gz_egri: (açı, GZ) değerleri listesi
            
        Returns:
            Kriterlerin sağlanıp sağlanmadığı bilgisi
        """
        kriterler = {
            "GM >= 0.15m": self.gm >= 0.15,
            "GM >= 0.30m (dökme tahıl)": self.gm >= 0.30,
            "Alan 0-30°": False,
            "Alan 0-40°": False,
            "Alan 30-40°": False,
            "Max GZ >= 0.20m": False,
            "Max GZ açısı >= 25°": False
        }
        
        # GZ eğrisi analizi
        if gz_egri:
            max_gz = max(gz_egri, key=lambda x: x[1])
            kriterler["Max GZ >= 0.20m"] = max_gz[1] >= 0.20
            kriterler["Max GZ açısı >= 25°"] = max_gz[0] >= 25
            
            # Alan hesaplamaları (basitleştirilmiş)
            alan_0_30 = self._alan_hesapla(gz_egri, 0, 30)
            alan_0_40 = self._alan_hesapla(gz_egri, 0, 40)
            alan_30_40 = self._alan_hesapla(gz_egri, 30, 40)
            
            kriterler["Alan 0-30°"] = alan_0_30 >= 0.055
            kriterler["Alan 0-40°"] = alan_0_40 >= 0.090
            kriterler["Alan 30-40°"] = alan_30_40 >= 0.030
        
        return kriterler
    
    def _alan_hesapla(self, gz_egri: List[Tuple[float, float]], 
                      baslangic: float, bitis: float) -> float:
        """
        GZ eğrisi altındaki alanı hesaplar (yamuk yöntemi)
        
        Args:
            gz_egri: (açı, GZ) değerleri listesi
            baslangic: Başlangıç açısı (derece)
            bitis: Bitiş açısı (derece)
            
        Returns:
            Alan (m.rad)
        """
        filtreli = [(aci, gz) for aci, gz in gz_egri if baslangic <= aci <= bitis]
        if len(filtreli) < 2:
            return 0
        
        alan = 0
        for i in range(len(filtreli) - 1):
            aci1, gz1 = filtreli[i]
            aci2, gz2 = filtreli[i + 1]
            # Yamuk alan formülü
            alan += 0.5 * (gz1 + gz2) * math.radians(aci2 - aci1)
        
        return alan
    
    def parametrik_yalpa_analizi(self, dalga_boyu: float, dalga_yuksekligi: float, 
                                 gemi_hizi: float = 0) -> dict:
        """
        Parametrik yalpa analizi yapar
        
        Args:
            dalga_boyu: Dalga boyu (metre)
            dalga_yuksekligi: Dalga yüksekliği (metre)
            gemi_hizi: Gemi hızı (m/s)
            
        Returns:
            Parametrik yalpa analiz sonuçları
        """
        # Yalpa periyodu hesapla (varsayılan değerlerle)
        yalpa_periyodu = self.yalpa_periyodu(0.8, 20)  # C=0.8, B=20m varsayımı
        
        # Dalga periyodu hesapla
        g = 9.81
        dalga_periyodu = 2 * math.pi * math.sqrt(dalga_boyu / g)
        
        # Parametrik yalpa periyodu = yalpa periyodu / 2
        parametrik_periyot = yalpa_periyodu / 2
        
        # Rezonans oranı
        rezonans_orani = abs(dalga_periyodu - parametrik_periyot) / parametrik_periyot
        
        # Risk değerlendirmesi
        dalga_boy_orani = dalga_boyu / 100  # Gemi boyu 100m varsayımı
        boy_uyumu = 0.8 <= dalga_boy_orani <= 1.2
        periyot_uyumu = rezonans_orani <= 0.2
        onemli_dalga = dalga_yuksekligi / 20 >= 0.1  # Gemi eni 20m varsayımı
        
        risk_var = boy_uyumu and periyot_uyumu and onemli_dalga
        
        return {
            "yalpa_periyodu": yalpa_periyodu,
            "dalga_periyodu": dalga_periyodu,
            "parametrik_periyot": parametrik_periyot,
            "rezonans_orani": rezonans_orani,
            "risk_var": risk_var,
            "boy_uyumu": boy_uyumu,
            "periyot_uyumu": periyot_uyumu,
            "onemli_dalga": onemli_dalga
        }
    
    def ruzgar_kriteri_analizi(self, ruzgar_hizi: float, yanal_alan: float, 
                               ruzgar_kolu: float) -> dict:
        """
        Rüzgar kriteri analizi yapar
        
        Args:
            ruzgar_hizi: Rüzgar hızı (m/s)
            yanal_alan: Yanal alan (m²)
            ruzgar_kolu: Rüzgar kol uzunluğu (m)
            
        Returns:
            Rüzgar kriteri analiz sonuçları
        """
        # Rüzgar basıncı hesapla
        hava_yogunlugu = 1.225  # kg/m³
        ruzgar_basinc = 0.5 * hava_yogunlugu * ruzgar_hizi**2  # N/m²
        
        # Rüzgar kuvveti ve momenti
        ruzgar_kuvveti = ruzgar_basinc * yanal_alan  # N
        ruzgar_momenti = ruzgar_kuvveti * ruzgar_kolu  # N.m
        
        # Rüzgar yatırma kolu
        g = 9.81
        ruzgar_yatirma_kolu = ruzgar_momenti / (self.deplasman * 1000 * g)  # m
        
        # Rüzgar yatırma açısı
        if self.gm > 0:
            ruzgar_acisi = math.degrees(math.atan(ruzgar_yatirma_kolu / self.gm))
        else:
            ruzgar_acisi = 90  # Stabil değil
        
        # Güvenlik marjı
        guvenlik_marji = self.gm - ruzgar_yatirma_kolu
        guvenli = guvenlik_marji > 0.15  # Minimum 0.15m güvenlik marjı
        
        return {
            "ruzgar_basinc": ruzgar_basinc,
            "ruzgar_kuvveti": ruzgar_kuvveti / 1000,  # kN
            "ruzgar_momenti": ruzgar_momenti / 1000,  # kN.m
            "ruzgar_yatirma_kolu": ruzgar_yatirma_kolu,
            "ruzgar_acisi": ruzgar_acisi,
            "guvenlik_marji": guvenlik_marji,
            "guvenli": guvenli
        }
    
    def tahil_stabilite_analizi(self, tahil_kayma_momenti: float, 
                                tahil_yoğunluğu: float = 0.8) -> dict:
        """
        SOLAS Bölüm VI tahıl stabilite analizi
        
        Args:
            tahil_kayma_momenti: Tahıl kayma momenti (ton.m)
            tahil_yoğunluğu: Tahıl yoğunluğu (ton/m³)
            
        Returns:
            Tahıl stabilite analiz sonuçları
        """
        # SOLAS gereksinimleri
        minimum_gm = 0.30  # Tahıl gemileri için minimum GM
        izin_verilen_yatma = 12  # derece
        guvenlik_faktoru_min = 1.4
        
        # Tahıl kayma açısı
        if self.gm > 0:
            tahil_yatma_acisi = math.degrees(math.atan(tahil_kayma_momenti / (self.deplasman * self.gm)))
        else:
            tahil_yatma_acisi = 90
        
        # Güvenlik faktörü hesabı
        if tahil_yatma_acisi > 0:
            guvenlik_faktoru = izin_verilen_yatma / tahil_yatma_acisi
        else:
            guvenlik_faktoru = float('inf')
        
        # Uygunluk kontrolü
        gm_uygun = self.gm >= minimum_gm
        aci_uygun = tahil_yatma_acisi <= izin_verilen_yatma
        guvenlik_uygun = guvenlik_faktoru >= guvenlik_faktoru_min
        
        solas_uygun = gm_uygun and aci_uygun and guvenlik_uygun
        
        return {
            "minimum_gm_gereksinimi": minimum_gm,
            "mevcut_gm": self.gm,
            "gm_uygun": gm_uygun,
            "tahil_yatma_acisi": tahil_yatma_acisi,
            "izin_verilen_yatma": izin_verilen_yatma,
            "aci_uygun": aci_uygun,
            "guvenlik_faktoru": guvenlik_faktoru,
            "guvenlik_faktoru_min": guvenlik_faktoru_min,
            "guvenlik_uygun": guvenlik_uygun,
            "solas_uygun": solas_uygun
        }
    
    def hasar_stabilite_analizi(self, hasar_hacmi: float, hasar_kg: float, 
                                gecirgenlik: float = 0.95) -> dict:
        """
        Hasar stabilitesi analizi yapar
        
        Args:
            hasar_hacmi: Hasarlı bölme hacmi (m³)
            hasar_kg: Hasarlı bölmenin KG'si (metre)
            gecirgenlik: Geçirgenlik faktörü (0-1)
            
        Returns:
            Hasar stabilite analiz sonuçları
        """
        # Su girişi ağırlığı
        deniz_suyu_yogunlugu = 1.025  # ton/m³
        giren_su_agirligi = hasar_hacmi * gecirgenlik * deniz_suyu_yogunlugu
        
        # Yeni deplasman
        yeni_deplasman = self.deplasman + giren_su_agirligi
        
        # Yeni KG hesabı (moment dengesi)
        toplam_moment = self.deplasman * self.kg + giren_su_agirligi * hasar_kg
        yeni_kg = toplam_moment / yeni_deplasman
        
        # Yeni draft hesabı (basitleştirilmiş)
        draft_artisi = giren_su_agirligi / (100 * 20 * deniz_suyu_yogunlugu)  # Varsayılan boyutlar
        yeni_draft = 8.0 + draft_artisi  # 8m varsayılan draft
        
        # Yeni KM hesabı (draft artışı ile)
        km_azalmasi = draft_artisi * 0.1  # Yaklaşık azalma
        yeni_km = self.km - km_azalmasi
        
        # Kalan GM
        kalan_gm = yeni_km - yeni_kg
        
        # Çapraz su alma süresi (Torricelli yasası)
        aciklama_alani = hasar_hacmi * 0.01  # %1 açıklama alanı varsayımı
        su_alma_hizi = aciklama_alani * math.sqrt(2 * 9.81 * 2)  # 2m yükseklik varsayımı
        capraz_su_alma_suresi = hasar_hacmi / su_alma_hizi / 60  # dakika
        
        # Hayatta kalma faktörü
        if kalan_gm > 0:
            hayatta_kalma = min(1.0, kalan_gm / 0.05)  # 0.05m minimum gereksinim
        else:
            hayatta_kalma = 0
        
        return {
            "giren_su_agirligi": giren_su_agirligi,
            "yeni_deplasman": yeni_deplasman,
            "yeni_kg": yeni_kg,
            "yeni_km": yeni_km,
            "kalan_gm": kalan_gm,
            "draft_artisi": draft_artisi,
            "capraz_su_alma_suresi": capraz_su_alma_suresi,
            "hayatta_kalma_faktoru": hayatta_kalma,
            "guvenli": kalan_gm > 0.05
        }
    
    def optimum_trim_hesapla(self, gemi_hizi: float, gemi_boyu: float) -> dict:
        """
        Minimum direnç için optimum trim hesaplar
        
        Args:
            gemi_hizi: Gemi hızı (m/s)
            gemi_boyu: Gemi boyu (metre)
            
        Returns:
            Optimum trim analiz sonuçları
        """
        g = 9.81
        froude_sayisi = gemi_hizi / math.sqrt(g * gemi_boyu)
        
        # Optimum trim yüzdesi
        if froude_sayisi > 0.2:
            optimum_trim_yuzde = 0.008  # %0.8
        elif froude_sayisi < 0.15:
            optimum_trim_yuzde = 0.003  # %0.3
        else:
            optimum_trim_yuzde = 0.005  # %0.5
        
        optimum_trim = gemi_boyu * optimum_trim_yuzde
        
        # Direnç azalması (yaklaşık)
        direnc_azalmasi = optimum_trim * 0.02  # %2/metre
        
        # Önerilen draft'lar
        ortalama_draft = 8.0  # Varsayılan
        on_draft = ortalama_draft - optimum_trim / 2
        arka_draft = ortalama_draft + optimum_trim / 2
        
        return {
            "froude_sayisi": froude_sayisi,
            "optimum_trim": optimum_trim,
            "optimum_trim_yuzde": optimum_trim_yuzde * 100,
            "direnc_azalmasi_yuzde": direnc_azalmasi * 100,
            "onerilen_on_draft": on_draft,
            "onerilen_arka_draft": arka_draft,
            "trim_tipi": "kıç trim" if optimum_trim > 0 else "baş trim"
        }


class StabiliteRapor:
    """Stabilite hesaplama sonuçlarını raporlayan sınıf"""
    
    @staticmethod
    def olustur(hesaplama: EnineStabiliteHesaplama, 
                ek_bilgiler: Optional[dict] = None) -> str:
        """
        Stabilite raporu oluşturur
        
        Args:
            hesaplama: EnineStabiliteHesaplama nesnesi
            ek_bilgiler: Ek bilgiler sözlüğü
            
        Returns:
            Rapor metni
        """
        rapor = f"""
====================================
GEMİ ENİNE STABİLİTE RAPORU
====================================

TEMEL BİLGİLER:
--------------
Deplasman (Δ): {hesaplama.deplasman:.2f} ton
KM: {hesaplama.km:.3f} m
KG: {hesaplama.kg:.3f} m
GM: {hesaplama.gm:.3f} m

STABİLİTE DURUMU:
----------------
"""
        
        if hesaplama.gm > 0:
            rapor += f"✓ Gemi STABİL (Pozitif GM = {hesaplama.gm:.3f} m)\n"
        else:
            rapor += f"✗ Gemi UNSTABLE (Negatif GM = {hesaplama.gm:.3f} m)\n"
        
        if hesaplama.gm >= 0.15:
            rapor += "✓ SOLAS minimum GM kriteri sağlanıyor (GM ≥ 0.15 m)\n"
        else:
            rapor += "✗ SOLAS minimum GM kriteri SAĞLANMIYOR (GM < 0.15 m)\n"
        
        if ek_bilgiler:
            rapor += "\nEK BİLGİLER:\n"
            rapor += "-----------\n"
            for anahtar, deger in ek_bilgiler.items():
                rapor += f"{anahtar}: {deger}\n"
        
        return rapor


# Yardımcı fonksiyonlar
def derece_radyan(derece: float) -> float:
    """Dereceyi radyana çevirir"""
    return math.radians(derece)


def radyan_derece(radyan: float) -> float:
    """Radyanı dereceye çevirir"""
    return math.degrees(radyan)


def meyil_momenti_hesapla(w: float, d: float) -> float:
    """
    Meyil momentini hesaplar
    
    Args:
        w: Yük ağırlığı (ton)
        d: Yatay mesafe (metre)
        
    Returns:
        Meyil momenti (ton.m)
    """
    return w * d