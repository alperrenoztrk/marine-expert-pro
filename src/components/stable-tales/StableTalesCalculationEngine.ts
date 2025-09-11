// Stable Tales Calculation Engine
// Port of Python stability_calculator.py to TypeScript

import {
  YukBilgisi,
  TankBilgisi,
  StabilityCalculationResult,
  SOLASKriterleri,
  SarkacMeyilData,
  BumbaKrenData,
  HavuzKritikData,
  YaraliStabiliteData,
  StableTalesInput
} from './StableTalesTypes';

export class StableTalesEngine {
  private deplasman: number;
  private km: number;
  private kg: number;

  constructor(deplasman: number, km: number, kg: number) {
    this.deplasman = deplasman;
    this.km = km;
    this.kg = kg;
  }

  // Basic GM calculation
  hesapla_gm(): number {
    return this.km - this.kg;
  }

  // Calculate new KG after loading/unloading cargo
  yeni_kg_hesapla(yukler: YukBilgisi[]): number {
    let toplam_agirlik = this.deplasman;
    let toplam_moment = this.deplasman * this.kg;

    yukler.forEach(yuk => {
      toplam_agirlik += yuk.agirlik;
      toplam_moment += yuk.agirlik * yuk.kg;
    });

    return toplam_moment / toplam_agirlik;
  }

  // GM change due to cargo movement
  gm_degisimi_yuk_hareketi(w: number, d: number): number {
    return -(w * d) / this.deplasman;
  }

  // Calculate heel angle from GZ
  meyil_acisi_hesapla(gz: number): number {
    const gm = this.hesapla_gm();
    if (gm <= 0) return 90; // Unstable condition
    return Math.atan(gz / gm) * (180 / Math.PI);
  }

  // Calculate GZ (righting lever)
  gz_hesapla(w: number, d: number): number {
    const meyil_momenti = w * d;
    const gm = this.hesapla_gm();
    if (gm <= 0) return 0;
    
    const meyil_acisi_rad = Math.atan(meyil_momenti / (this.deplasman * gm));
    return gm * Math.sin(meyil_acisi_rad);
  }

  // GM change during boom/crane operations
  bumba_kren_gm_degisimi(w: number, h_cunda: number, h_yuk: number): number {
    const virtual_kg_artis = (w * Math.pow(h_cunda - h_yuk, 2)) / (this.deplasman + w);
    return -virtual_kg_artis;
  }

  // Free surface effect calculation
  serbest_yuzey_etkisi(tanklar: TankBilgisi[]): number {
    let toplam_fsm = 0;
    
    tanklar.forEach(tank => {
      if (tank.doluluk_orani > 0 && tank.doluluk_orani < 1) {
        // Only partially filled tanks contribute to FSE
        const ixx = (tank.uzunluk * Math.pow(tank.genislik, 3)) / 12;
        const fsm = (ixx * tank.sivı_yogunlugu) / this.deplasman;
        toplam_fsm += fsm;
      }
    });
    
    return toplam_fsm;
  }

  // GM reduction due to free surface effect
  gm_kuculmesi_fsm(fsm: number): number {
    return fsm;
  }

  // Roll period calculation
  yalpa_periyodu(c: number, b: number): number {
    const gm = this.hesapla_gm();
    if (gm <= 0) return 0;
    
    return c * (b / Math.sqrt(gm));
  }

  // Calculate GZ from KN values
  kn_den_gz_hesapla(kn: number, phi_derece: number): number {
    const phi_rad = phi_derece * (Math.PI / 180);
    return kn - this.kg * Math.sin(phi_rad);
  }

  // Dynamic stability area using Simpson's rule
  dinamik_stabilite_alani_simpson(gz_degerleri: number[], aci_araligi: number): number {
    if (gz_degerleri.length < 3) return 0;
    
    const n = gz_degerleri.length - 1;
    const h = aci_araligi * (Math.PI / 180); // Convert to radians
    
    let alan = gz_degerleri[0] + gz_degerleri[n];
    
    for (let i = 1; i < n; i++) {
      const katsayi = (i % 2 === 0) ? 2 : 4;
      alan += katsayi * gz_degerleri[i];
    }
    
    return (h / 3) * alan;
  }

  // SOLAS criteria check
  solas_kriterleri_kontrol(gz_egri: Array<{ aci: number; gz: number }>): SOLASKriterleri {
    // Calculate areas using trapezoidal rule
    const alan_0_30 = this.alan_hesapla(gz_egri, 0, 30);
    const alan_0_40 = this.alan_hesapla(gz_egri, 0, 40);
    const alan_30_40 = this.alan_hesapla(gz_egri, 30, 40);
    
    // Find maximum GZ
    const max_gz = Math.max(...gz_egri.map(p => p.gz));
    const gm = this.hesapla_gm();

    // SOLAS criteria requirements
    const kriter_alan_0_30 = 0.055; // m.rad
    const kriter_alan_0_40 = 0.090; // m.rad  
    const kriter_alan_30_40 = 0.030; // m.rad
    const kriter_max_gz = 0.200; // m
    const kriter_gm = 0.150; // m

    return {
      alan_0_30: {
        deger: alan_0_30,
        kriter: kriter_alan_0_30,
        uygun: alan_0_30 >= kriter_alan_0_30
      },
      alan_0_40: {
        deger: alan_0_40,
        kriter: kriter_alan_0_40,
        uygun: alan_0_40 >= kriter_alan_0_40
      },
      alan_30_40: {
        deger: alan_30_40,
        kriter: kriter_alan_30_40,
        uygun: alan_30_40 >= kriter_alan_30_40
      },
      max_gz: {
        deger: max_gz,
        kriter: kriter_max_gz,
        uygun: max_gz >= kriter_max_gz
      },
      gm: {
        deger: gm,
        kriter: kriter_gm,
        uygun: gm >= kriter_gm
      },
      genel_uygunluk: alan_0_30 >= kriter_alan_0_30 && 
                      alan_0_40 >= kriter_alan_0_40 && 
                      alan_30_40 >= kriter_alan_30_40 && 
                      max_gz >= kriter_max_gz && 
                      gm >= kriter_gm
    };
  }

  // Advanced calculations for Stable Tales features

  // Pendulum method for heel angle measurement
  sarkac_ile_meyil_acisi(sarkac_data: SarkacMeyilData): number {
    const { sarkac_uzunlugu, sapma } = sarkac_data;
    return Math.asin(sapma / sarkac_uzunlugu) * (180 / Math.PI);
  }

  // Critical GM calculation for drydock
  havuzda_kritik_gm(havuz_data: HavuzKritikData): number {
    const { havuz_uzunlugu, destek_noktalari } = havuz_data;
    
    // Simplified calculation - would need more detailed ship geometry
    const ortalama_destek_arasi = havuz_uzunlugu / destek_noktalari.length;
    const kritik_gm = 0.05 + (ortalama_destek_arasi / 100);
    
    return kritik_gm;
  }

  // Damage stability - draft change after flooding
  yarali_stabilite_draft_degisimi(yarali_data: YaraliStabiliteData): number {
    const { su_alan_bolme, baslangic_draft } = yarali_data;
    const su_miktari = su_alan_bolme.hacim * su_alan_bolme.gecirimlilik;
    
    // Simplified - would need waterplane area
    const tpc = 20; // Assumed TPC value
    const draft_artisi = su_miktari / tpc;
    
    return baslangic_draft + draft_artisi;
  }

  // Utility function to calculate area under GZ curve
  private alan_hesapla(gz_egri: Array<{ aci: number; gz: number }>, baslangic: number, bitis: number): number {
    const filtrelenmis = gz_egri.filter(p => p.aci >= baslangic && p.aci <= bitis);
    if (filtrelenmis.length < 2) return 0;
    
    let alan = 0;
    for (let i = 0; i < filtrelenmis.length - 1; i++) {
      const aci_farki = (filtrelenmis[i + 1].aci - filtrelenmis[i].aci) * (Math.PI / 180);
      const gz_ortalama = (filtrelenmis[i].gz + filtrelenmis[i + 1].gz) / 2;
      alan += gz_ortalama * aci_farki;
    }
    
    return alan;
  }

  // Comprehensive calculation method
  static kapsamliHesaplama(input: StableTalesInput): StabilityCalculationResult {
    const engine = new StableTalesEngine(input.deplasman, input.km, input.kg);
    
    // Basic calculations
    const gm = engine.hesapla_gm();
    
    // Generate GZ curve (simplified)
    const gz_egri = [];
    for (let aci = 0; aci <= 90; aci += 5) {
      const aci_rad = aci * (Math.PI / 180);
      const gz = gm * Math.sin(aci_rad); // Simplified GZ calculation
      gz_egri.push({ aci, gz: Math.max(0, gz) });
    }
    
    // Advanced calculations if data provided
    let gm_degisimi = 0;
    let fsm = 0;
    
    if (input.yukler && input.yukler.length > 0) {
      const yeni_kg = engine.yeni_kg_hesapla(input.yukler);
      gm_degisimi = input.kg - yeni_kg;
    }
    
    if (input.tanklar && input.tanklar.length > 0) {
      fsm = engine.serbest_yuzey_etkisi(input.tanklar);
    }
    
    const dinamik_stabilite = engine.dinamik_stabilite_alani_simpson(
      gz_egri.map(p => p.gz), 5
    );
    
    const solas_uygunluk = engine.solas_kriterleri_kontrol(gz_egri);
    
    return {
      gm,
      gz: gz_egri[3]?.gz || 0, // GZ at 15 degrees
      gm_degisimi,
      meyil_acisi: engine.meyil_acisi_hesapla(gz_egri[3]?.gz || 0),
      yalpa_periyodu: engine.yalpa_periyodu(0.8, 12), // Default values
      fsm,
      dinamik_stabilite,
      solas_uygunluk
    };
  }
}

// Utility functions
export function dereceRadyan(derece: number): number {
  return derece * (Math.PI / 180);
}

export function radyanDerece(radyan: number): number {
  return radyan * (180 / Math.PI);
}

export function meyilMomentiHesapla(w: number, d: number): number {
  return w * d;
}