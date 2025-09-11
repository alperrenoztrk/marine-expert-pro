// TypeScript interfaces for Stable Tales calculations
// Based on Python stability_calculator.py

export interface YukBilgisi {
  agirlik: number; // Weight in tons
  kg: number; // Height above keel in meters
  yatay_mesafe: number; // Horizontal distance in meters
  dikey_mesafe: number; // Vertical distance in meters
}

export interface TankBilgisi {
  uzunluk: number; // Length in meters
  genislik: number; // Breadth in meters
  yukseklik: number; // Height in meters
  doluluk_orani: number; // Fill ratio (0-1)
  sivı_yogunlugu: number; // Fluid density in t/m³
}

export interface StabilityCalculationResult {
  gm: number; // Metacentric height
  gz: number; // Righting lever
  gm_degisimi: number; // GM change
  meyil_acisi: number; // Heel angle in degrees
  yalpa_periyodu: number; // Roll period in seconds
  fsm: number; // Free surface moment
  dinamik_stabilite: number; // Dynamic stability area
  solas_uygunluk: SOLASKriterleri;
}

export interface SOLASKriterleri {
  alan_0_30: { deger: number; kriter: number; uygun: boolean };
  alan_0_40: { deger: number; kriter: number; uygun: boolean };
  alan_30_40: { deger: number; kriter: number; uygun: boolean };
  max_gz: { deger: number; kriter: number; uygun: boolean };
  gm: { deger: number; kriter: number; uygun: boolean };
  genel_uygunluk: boolean;
}

export interface StabilityReport {
  gemi_bilgisi: {
    ad: string;
    deplasman: number;
    km: number;
    kg: number;
    gm: number;
  };
  hesaplama_sonuclari: StabilityCalculationResult;
  gz_egrisi: Array<{ aci: number; gz: number }>;
  oneriler: string[];
  tarih: string;
}

// Advanced calculation types for Stable Tales specific features
export interface SarkacMeyilData {
  sarkac_uzunlugu: number; // Pendulum length in meters
  sapma: number; // Deviation in meters
  meyil_acisi?: number; // Calculated heel angle
}

export interface BumbaKrenData {
  yuk_agirligi: number; // Load weight in tons
  yukseklik_cunda: number; // Hook height in meters
  yuk_yuksekligi: number; // Load height in meters
  gm_degisimi?: number; // GM change
}

export interface HavuzKritikData {
  havuz_uzunlugu: number; // Dock length in meters
  destek_noktalari: number[]; // Support points array
  kritik_gm?: number; // Critical GM
  kren_momenti?: number; // Heeling moment
}

export interface YaraliStabiliteData {
  su_alan_bolme: {
    hacim: number; // Volume in m³
    kg: number; // Center of gravity height
    gecirimlilik: number; // Permeability 0-1
  };
  baslangic_draft: number; // Initial draft
  yeni_draft?: number; // New draft after damage
  gm_kalici?: number; // Residual GM
}

export interface StableTalesInput {
  // Basic vessel data
  deplasman: number; // Displacement in tons
  km: number; // KM in meters  
  kg: number; // KG in meters
  
  // Optional advanced inputs
  yukler?: YukBilgisi[]; // Array of loads
  tanklar?: TankBilgisi[]; // Array of tanks
  sarkac_data?: SarkacMeyilData; // Pendulum data
  bumba_data?: BumbaKrenData; // Crane/boom data
  havuz_data?: HavuzKritikData; // Drydock data
  yarali_data?: YaraliStabiliteData; // Damage data
}