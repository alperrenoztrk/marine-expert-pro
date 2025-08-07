import React, { useState, useEffect } from 'react';
import { HydrostaticCalculations } from '../services/hydrostaticCalculations';
import {
  ShipGeometry,
  WeightDistribution,
  TankData,
  CompartmentAnalysis,
  StabilityAnalysis
} from '../types/hydrostatic';

interface HydrostaticCalculatorProps {
  className?: string;
}

export const HydrostaticCalculator: React.FC<HydrostaticCalculatorProps> = ({ className }) => {
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 100,
    breadth: 20,
    depth: 10,
    draft: 6,
    blockCoefficient: 0.7,
    waterplaneCoefficient: 0.8,
    midshipCoefficient: 0.9,
    prismaticCoefficient: 0.65,
    verticalPrismaticCoefficient: 0.75
  });

  const [kg, setKg] = useState<number>(5);
  const [weightDistribution, setWeightDistribution] = useState<WeightDistribution[]>([
    { item: 'Hull', weight: 1000, lcg: 50, vcg: 5, tcg: 0, moment: 50000 },
    { item: 'Machinery', weight: 500, lcg: 30, vcg: 3, tcg: 0, moment: 15000 },
    { item: 'Cargo', weight: 2000, lcg: 60, vcg: 8, tcg: 0, moment: 120000 }
  ]);

  const [tanks, setTanks] = useState<TankData[]>([
    {
      name: 'Fuel Tank 1',
      capacity: 100,
      currentVolume: 50,
      lcg: 20,
      vcg: 2,
      tcg: 5,
      freeSurfaceEffect: 0.1,
      fluidDensity: 0.85
    },
    {
      name: 'Ballast Tank 1',
      capacity: 200,
      currentVolume: 100,
      lcg: 80,
      vcg: 1,
      tcg: -3,
      freeSurfaceEffect: 0.05,
      fluidDensity: 1.025
    }
  ]);

  const [floodedCompartments, setFloodedCompartments] = useState<CompartmentAnalysis[]>([]);
  const [grainShiftMoment, setGrainShiftMoment] = useState<number>(0);
  const [grainHeelAngle, setGrainHeelAngle] = useState<number>(0);

  const [analysis, setAnalysis] = useState<StabilityAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState<string>('hydrostatic');

  useEffect(() => {
    if (geometry && kg && weightDistribution && tanks) {
      const result = HydrostaticCalculations.performStabilityAnalysis(
        geometry,
        kg,
        weightDistribution,
        tanks,
        floodedCompartments,
        grainShiftMoment,
        grainHeelAngle
      );
      setAnalysis(result);
    }
  }, [geometry, kg, weightDistribution, tanks, floodedCompartments, grainShiftMoment, grainHeelAngle]);

  const tabs = [
    { id: 'hydrostatic', label: 'Hidrostatik Temeller' },
    { id: 'stability', label: 'Stabilite Analizi' },
    { id: 'imo', label: 'IMO Kriterleri' },
    { id: 'trim', label: 'Trim ve List' },
    { id: 'damage', label: 'Hasar Stabilitesi' },
    { id: 'grain', label: 'Tahıl Stabilitesi' },
    { id: 'dynamic', label: 'Dinamik Stabilite' },
    { id: 'draft', label: 'Draft Survey' }
  ];

  const renderHydrostaticTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Gemi Geometrisi</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Uzunluk (m)</label>
              <input
                type="number"
                value={geometry.length}
                onChange={(e) => setGeometry({ ...geometry, length: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Genişlik (m)</label>
              <input
                type="number"
                value={geometry.breadth}
                onChange={(e) => setGeometry({ ...geometry, breadth: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Derinlik (m)</label>
              <input
                type="number"
                value={geometry.depth}
                onChange={(e) => setGeometry({ ...geometry, depth: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Draft (m)</label>
              <input
                type="number"
                value={geometry.draft}
                onChange={(e) => setGeometry({ ...geometry, draft: parseFloat(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Hidrostatik Sonuçlar</h3>
          {analysis && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Deplasman:</span>
                <span className="font-medium">{analysis.hydrostatic.displacement.toFixed(2)} t</span>
              </div>
              <div className="flex justify-between">
                <span>Hacim Deplasmanı:</span>
                <span className="font-medium">{analysis.hydrostatic.volumeDisplacement.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Su Hattı Alanı:</span>
                <span className="font-medium">{analysis.hydrostatic.waterplaneArea.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between">
                <span>Batık Hacim:</span>
                <span className="font-medium">{analysis.hydrostatic.immersedVolume.toFixed(2)} m³</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Merkez Noktaları</h3>
          {analysis && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>LCB:</span>
                <span className="font-medium">{analysis.centers.lcb.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>VCB:</span>
                <span className="font-medium">{analysis.centers.vcb.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>LCF:</span>
                <span className="font-medium">{analysis.centers.lcf.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>KB:</span>
                <span className="font-medium">{analysis.centers.kb.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>KM:</span>
                <span className="font-medium">{analysis.centers.km.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>BM:</span>
                <span className="font-medium">{analysis.centers.bm.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>KG:</span>
                <span className="font-medium">{analysis.centers.kg.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>GM:</span>
                <span className="font-medium">{analysis.centers.gm.toFixed(2)} m</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Hidrostatik Katsayılar</h3>
          {analysis && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>TPC:</span>
                <span className="font-medium">{analysis.coefficients.tpc.toFixed(3)} t/cm</span>
              </div>
              <div className="flex justify-between">
                <span>MTC:</span>
                <span className="font-medium">{analysis.coefficients.mtc.toFixed(2)} t-m</span>
              </div>
              <div className="flex justify-between">
                <span>LCF:</span>
                <span className="font-medium">{analysis.coefficients.lcf.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>WPA:</span>
                <span className="font-medium">{analysis.coefficients.wpa.toFixed(2)} m²</span>
              </div>
              <div className="flex justify-between">
                <span>KB:</span>
                <span className="font-medium">{analysis.coefficients.kb.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>KM:</span>
                <span className="font-medium">{analysis.coefficients.km.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>BM:</span>
                <span className="font-medium">{analysis.coefficients.bm.toFixed(2)} m</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStabilityTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Stabilite Verileri</h3>
          {analysis && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>GM:</span>
                <span className="font-medium">{analysis.stability.gm.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Maksimum GZ:</span>
                <span className="font-medium">{analysis.stability.maxGz.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Maksimum GZ Açısı:</span>
                <span className="font-medium">{analysis.stability.maxGzAngle.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Kaybolma Açısı:</span>
                <span className="font-medium">{analysis.stability.vanishingAngle.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Güverte Kenar Açısı:</span>
                <span className="font-medium">{analysis.stability.deckEdgeAngle.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Su Alma Açısı:</span>
                <span className="font-medium">{analysis.stability.downfloodingAngle.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Eşitlenme Açısı:</span>
                <span className="font-medium">{analysis.stability.equalizedAngle.toFixed(1)}°</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">KG Ayarlaması</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">KG (m)</label>
            <input
              type="number"
              value={kg}
              onChange={(e) => setKg(parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">GZ Eğrisi</h3>
          <div className="h-64 bg-gray-50 rounded flex items-end justify-center p-4">
            <div className="flex items-end space-x-1">
              {analysis.stability.gz.slice(0, 31).map((gz, index) => (
                <div
                  key={index}
                  className="bg-blue-500 rounded-t"
                  style={{
                    width: '4px',
                    height: `${(gz / analysis.stability.maxGz) * 200}px`
                  }}
                  title={`${index}°: ${gz.toFixed(3)}m`}
                />
              ))}
            </div>
          </div>
          <div className="mt-2 text-center text-sm text-gray-600">
            GZ Değerleri (0-30°)
          </div>
        </div>
      )}
    </div>
  );

  const renderIMOTab = () => (
    <div className="space-y-6">
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">IMO Stabilite Kriterleri</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>0-30° Alan:</span>
                <span className={`font-medium ${analysis.imoCriteria.area0to30 >= 0.055 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.imoCriteria.area0to30.toFixed(3)} m-rad
                </span>
              </div>
              <div className="flex justify-between">
                <span>0-40° Alan:</span>
                <span className={`font-medium ${analysis.imoCriteria.area0to40 >= 0.090 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.imoCriteria.area0to40.toFixed(3)} m-rad
                </span>
              </div>
              <div className="flex justify-between">
                <span>30-40° Alan:</span>
                <span className={`font-medium ${analysis.imoCriteria.area30to40 >= 0.030 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.imoCriteria.area30to40.toFixed(3)} m-rad
                </span>
              </div>
              <div className="flex justify-between">
                <span>Maksimum GZ:</span>
                <span className={`font-medium ${analysis.imoCriteria.maxGz >= 0.20 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.imoCriteria.maxGz.toFixed(3)} m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Başlangıç GM:</span>
                <span className={`font-medium ${analysis.imoCriteria.initialGM >= 0.15 ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.imoCriteria.initialGM.toFixed(3)} m
                </span>
              </div>
              <div className="flex justify-between">
                <span>Hava Kriteri:</span>
                <span className="font-medium">{analysis.imoCriteria.weatherCriterion.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">IMO Uygunluk</h3>
            <div className={`p-4 rounded-lg ${analysis.imoCriteria.compliance ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-3 ${analysis.imoCriteria.compliance ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="font-semibold">
                  {analysis.imoCriteria.compliance ? 'IMO Kriterlerine Uygun' : 'IMO Kriterlerine Uygun Değil'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTrimListTab = () => (
    <div className="space-y-6">
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Trim ve List Hesaplamaları</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Trim Açısı:</span>
                <span className="font-medium">{analysis.trimList.trimAngle.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Trim Değişimi:</span>
                <span className="font-medium">{analysis.trimList.trimChange.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>List Açısı:</span>
                <span className="font-medium">{analysis.trimList.listAngle.toFixed(2)}°</span>
              </div>
              <div className="flex justify-between">
                <span>List Momenti:</span>
                <span className="font-medium">{analysis.trimList.listMoment.toFixed(2)} t-m</span>
              </div>
              <div className="flex justify-between">
                <span>MCT:</span>
                <span className="font-medium">{analysis.trimList.mct.toFixed(2)} t-m</span>
              </div>
              <div className="flex justify-between">
                <span>Trim Düzeltmesi:</span>
                <span className="font-medium">{analysis.trimList.trimCorrection.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>List Düzeltmesi:</span>
                <span className="font-medium">{analysis.trimList.listCorrection.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Draft Düzeltmesi:</span>
                <span className="font-medium">{analysis.trimList.draftCorrection.toFixed(3)} m</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Ağırlık Dağılımı</h3>
            <div className="space-y-2">
              {weightDistribution.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.item}:</span>
                  <span className="font-medium">{item.weight} t</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDamageTab = () => (
    <div className="space-y-6">
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Hasar Stabilitesi</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Su Alma Hacmi:</span>
                <span className="font-medium">{analysis.damageStability.floodedVolume.toFixed(2)} m³</span>
              </div>
              <div className="flex justify-between">
                <span>Yeni KG:</span>
                <span className="font-medium">{analysis.damageStability.newKG.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Kalan GM:</span>
                <span className="font-medium">{analysis.damageStability.residualGM.toFixed(3)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Çapraz Su Alma Süresi:</span>
                <span className="font-medium">{analysis.damageStability.crossFloodingTime} dakika</span>
              </div>
              <div className="flex justify-between">
                <span>Su Alma Açısı:</span>
                <span className="font-medium">{analysis.damageStability.downfloodingAngle.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Eşitlenme Açısı:</span>
                <span className="font-medium">{analysis.damageStability.equalizedAngle.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Hayatta Kalma Faktörü:</span>
                <span className="font-medium">{analysis.damageStability.survivalFactor.toFixed(3)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Bölme Analizi</h3>
            <div className="text-sm text-gray-600">
              Hasar bölmeleri burada listelenecek
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderGrainTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tahıl Stabilitesi Parametreleri</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tahıl Kayma Momenti (t-m)</label>
              <input
                type="number"
                value={grainShiftMoment}
                onChange={(e) => setGrainShiftMoment(parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tahıl Yatma Açısı (°)</label>
              <input
                type="number"
                value={grainHeelAngle}
                onChange={(e) => setGrainHeelAngle(parseFloat(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {analysis && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Tahıl Stabilitesi Sonuçları</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tahıl Güvenlik Faktörü:</span>
                <span className="font-medium">{analysis.grainStability.grainSafetyFactor.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>İzin Verilen Yatma:</span>
                <span className="font-medium">{analysis.grainStability.grainAllowableHeel.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Stabilite Kriteri:</span>
                <span className="font-medium">{analysis.grainStability.grainStabilityCriterion.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>SOLAS Uygunluğu:</span>
                <span className={`font-medium ${analysis.grainStability.compliance ? 'text-green-600' : 'text-red-600'}`}>
                  {analysis.grainStability.compliance ? 'Uygun' : 'Uygun Değil'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderDynamicTab = () => (
    <div className="space-y-6">
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Dinamik Stabilite</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Yalpa Periyodu:</span>
                <span className="font-medium">{analysis.dynamicStability.rollingPeriod.toFixed(2)} s</span>
              </div>
              <div className="flex justify-between">
                <span>Doğal Periyot:</span>
                <span className="font-medium">{analysis.dynamicStability.naturalPeriod.toFixed(2)} s</span>
              </div>
              <div className="flex justify-between">
                <span>Yatmaya Enerji:</span>
                <span className="font-medium">{analysis.dynamicStability.energyToHeel.toFixed(2)} J</span>
              </div>
              <div className="flex justify-between">
                <span>Stabilite İndeksi:</span>
                <span className="font-medium">{analysis.dynamicStability.stabilityIndex.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>Güvenlik Marjı:</span>
                <span className="font-medium">{analysis.dynamicStability.safetyMargin.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Rezonans Kontrolü:</span>
                <span className={`font-medium ${analysis.dynamicStability.resonanceCheck ? 'text-red-600' : 'text-green-600'}`}>
                  {analysis.dynamicStability.resonanceCheck ? 'Rezonans Riski' : 'Güvenli'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Stabilite Aralığı:</span>
                <span className="font-medium">{analysis.dynamicStability.stabilityRange.toFixed(1)}°</span>
              </div>
              <div className="flex justify-between">
                <span>Stabilite Kalitesi:</span>
                <span className="font-medium">{analysis.dynamicStability.stabilityQuality.toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span>GM Standartları:</span>
                <span className="font-medium">{analysis.dynamicStability.gmStandards.toFixed(3)} m</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">GZ Eğrisi Analizi</h3>
            <div className="h-64 bg-gray-50 rounded flex items-end justify-center p-4">
              <div className="flex items-end space-x-1">
                {analysis.dynamicStability.gzCurve.slice(0, 91).map((point, index) => (
                  <div
                    key={index}
                    className="bg-green-500 rounded-t"
                    style={{
                      width: '2px',
                      height: `${(point.gz / Math.max(...analysis.dynamicStability.gzCurve.map(p => p.gz))) * 200}px`
                    }}
                    title={`${point.angle}°: ${point.gz.toFixed(3)}m`}
                  />
                ))}
              </div>
            </div>
            <div className="mt-2 text-center text-sm text-gray-600">
              Dinamik GZ Eğrisi (0-90°)
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDraftTab = () => (
    <div className="space-y-6">
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Draft Survey</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Ön Draft:</span>
                <span className="font-medium">{analysis.draftSurvey.forwardDraft.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Orta Draft:</span>
                <span className="font-medium">{analysis.draftSurvey.midshipDraft.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Arka Draft:</span>
                <span className="font-medium">{analysis.draftSurvey.aftDraft.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Ortalama Draft:</span>
                <span className="font-medium">{analysis.draftSurvey.meanDraft.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Trim:</span>
                <span className="font-medium">{analysis.draftSurvey.trim.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>List:</span>
                <span className="font-medium">{analysis.draftSurvey.list.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Düzeltilmiş Draft:</span>
                <span className="font-medium">{analysis.draftSurvey.correctedDraft.toFixed(2)} m</span>
              </div>
              <div className="flex justify-between">
                <span>Deplasman:</span>
                <span className="font-medium">{analysis.draftSurvey.displacement.toFixed(2)} t</span>
              </div>
              <div className="flex justify-between">
                <span>TPC:</span>
                <span className="font-medium">{analysis.draftSurvey.tpc.toFixed(3)} t/cm</span>
              </div>
              <div className="flex justify-between">
                <span>LCF:</span>
                <span className="font-medium">{analysis.draftSurvey.lcf.toFixed(2)} m</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Serbest Yüzey Düzeltmeleri</h3>
            <div className="space-y-2">
              {analysis.freeSurfaceCorrections.map((correction, index) => (
                <div key={index} className="text-sm">
                  <div className="flex justify-between">
                    <span>{correction.tankName}:</span>
                    <span className="font-medium">{correction.totalFSC.toFixed(3)} m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'hydrostatic':
        return renderHydrostaticTab();
      case 'stability':
        return renderStabilityTab();
      case 'imo':
        return renderIMOTab();
      case 'trim':
        return renderTrimListTab();
      case 'damage':
        return renderDamageTab();
      case 'grain':
        return renderGrainTab();
      case 'dynamic':
        return renderDynamicTab();
      case 'draft':
        return renderDraftTab();
      default:
        return renderHydrostaticTab();
    }
  };

  return (
    <div className={`max-w-7xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Hidrostatik ve Stabilite Hesaplamaları</h1>
        <p className="text-gray-600">Kapsamlı gemi stabilite ve hidrostatik hesaplama sistemi</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};