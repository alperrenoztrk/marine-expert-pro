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