import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Link, useParams } from "react-router-dom";
import { MobileLayout } from "@/components/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationGrid, CalculationGridScreen, type CalculationGridItem } from "@/components/ui/calculation-grid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Anchor, Navigation2, Ship, Sigma, Wind } from "lucide-react";

const seamanshipItems: CalculationGridItem[] = [
  { id: "overview", title: "Gemicilik Paneli", icon: Navigation2, to: "/seamanship/calculations" },
  { id: "mooring", title: "Palamar Çalışma Yükü", icon: Anchor, to: "/seamanship/calculations/mooring" },
  { id: "wind", title: "Rüzgâr Kuvveti", icon: Wind, to: "/seamanship/calculations/wind" },
  { id: "catenary", title: "Katenary Hesabı", icon: Ship, to: "/seamanship/calculations/catenary" },
];

const sectionTitles: Record<string, string> = {
  mooring: "Palamar Çalışma Yükü",
  wind: "Rüzgâr Kuvveti",
  catenary: "Katenary Hesabı",
};

type SectionKey = keyof typeof sectionTitles;

const validSections = new Set<SectionKey>(["mooring", "wind", "catenary"]);

function SeamanshipCalculationContent({ initialSection }: { initialSection?: SectionKey }) {
  const [mooringInputs, setMooringInputs] = useState({ swl: "", safetyFactor: "0.55" });
  const [windInputs, setWindInputs] = useState({ cd: "1.2", area: "", velocity: "" });
  const [catenaryInputs, setCatenaryInputs] = useState({ weight: "", scope: "", depth: "" });

  const sectionRefs: Record<SectionKey, RefObject<HTMLDivElement>> = {
    mooring: useRef<HTMLDivElement>(null),
    wind: useRef<HTMLDivElement>(null),
    catenary: useRef<HTMLDivElement>(null),
  };

  useEffect(() => {
    if (!initialSection) return;
    const target = sectionRefs[initialSection]?.current;
    if (target) {
      setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [initialSection]);

  const calculateMooringLoad = () => {
    const swl = parseFloat(mooringInputs.swl.replace(",", "."));
    const sf = parseFloat(mooringInputs.safetyFactor.replace(",", "."));
    if (isNaN(swl) || isNaN(sf)) return null;
    return ((swl * sf) / 1000).toFixed(2);
  };

  const calculateWindForce = () => {
    const cd = parseFloat(windInputs.cd.replace(",", "."));
    const area = parseFloat(windInputs.area.replace(",", "."));
    const velocity = parseFloat(windInputs.velocity.replace(",", "."));
    if (isNaN(cd) || isNaN(area) || isNaN(velocity)) return null;
    return (0.613 * cd * area * velocity * velocity / 1000).toFixed(2);
  };

  const calculateCatenaryLength = () => {
    const weight = parseFloat(catenaryInputs.weight.replace(",", "."));
    const scope = parseFloat(catenaryInputs.scope.replace(",", "."));
    const depth = parseFloat(catenaryInputs.depth.replace(",", "."));
    if (isNaN(weight) || isNaN(scope) || isNaN(depth)) return null;
    const chainLength = Math.sqrt(scope * scope + depth * depth);
    return chainLength.toFixed(2);
  };

  return (
    <div className="space-y-6">
      <Card ref={sectionRefs.mooring} className="bg-white/90 border-white/60 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
            <Anchor className="h-5 w-5" />
            Palamar Çalışma Yükü
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>SWL (kg)</Label>
            <Input
              placeholder="Güvenli çalışma yükü"
              value={mooringInputs.swl}
              onChange={(e) => setMooringInputs({ ...mooringInputs, swl: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Güvenlik Katsayısı</Label>
            <Input
              placeholder="0.55 - 0.60"
              value={mooringInputs.safetyFactor}
              onChange={(e) => setMooringInputs({ ...mooringInputs, safetyFactor: e.target.value })}
            />
          </div>
          {calculateMooringLoad() && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-slate-600">Çalışma Yükü:</p>
              <p className="text-2xl font-bold text-[#2F5BFF]">{calculateMooringLoad()} kN</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card ref={sectionRefs.wind} className="bg-white/90 border-white/60 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
              <Wind className="h-5 w-5" />
              Rüzgâr Kuvveti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Sürtünme Katsayısı (Cd)</Label>
              <Input
                placeholder="1.0 - 1.3"
                value={windInputs.cd}
                onChange={(e) => setWindInputs({ ...windInputs, cd: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cephe Alanı (m²)</Label>
              <Input
                placeholder="Rüzgâra maruz alan"
                value={windInputs.area}
                onChange={(e) => setWindInputs({ ...windInputs, area: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Rüzgâr Hızı (m/s)</Label>
              <Input
                placeholder="Rüzgâr hızı"
                value={windInputs.velocity}
                onChange={(e) => setWindInputs({ ...windInputs, velocity: e.target.value })}
              />
            </div>
            {calculateWindForce() && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Rüzgâr Kuvveti:</p>
                <p className="text-2xl font-bold text-[#2F5BFF]">{calculateWindForce()} kN</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card ref={sectionRefs.catenary} className="bg-white/90 border-white/60 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
              <Ship className="h-5 w-5" />
              Katenary Hesabı
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Zincir Ağırlığı (kg/m)</Label>
              <Input
                placeholder="Zincir ağırlığı"
                value={catenaryInputs.weight}
                onChange={(e) => setCatenaryInputs({ ...catenaryInputs, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Mendirek Mesafesi (m)</Label>
              <Input
                placeholder="Scope"
                value={catenaryInputs.scope}
                onChange={(e) => setCatenaryInputs({ ...catenaryInputs, scope: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Su Derinliği (m)</Label>
              <Input
                placeholder="Derinlik"
                value={catenaryInputs.depth}
                onChange={(e) => setCatenaryInputs({ ...catenaryInputs, depth: e.target.value })}
              />
            </div>
            {calculateCatenaryLength() && (
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-slate-600">Zincir Uzunluğu:</p>
                <p className="text-2xl font-bold text-[#2F5BFF]">{calculateCatenaryLength()} m</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function SeamanshipCalculationDetailPage() {
  const { tool } = useParams<{ tool?: string }>();
  const initialSection = useMemo(() => {
    if (tool && validSections.has(tool as SectionKey)) {
      return tool as SectionKey;
    }
    return "mooring";
  }, [tool]);

  const activeTitle = tool && sectionTitles[tool] ? sectionTitles[tool] : "Gemicilik Hesaplamaları";

  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Gemicilik"
        title={activeTitle}
        subtitle="Palamar yükü, rüzgâr kuvveti ve katenary hesaplarını aynı temada toplayın"
      >
        <SeamanshipCalculationContent initialSection={initialSection} />
      </CalculationGridScreen>
    </MobileLayout>
  );
}

const SeamanshipCalculationsPage = () => {
  return (
    <MobileLayout>
      <CalculationGridScreen
        eyebrow="Gemicilik"
        title="Gemicilik Hesaplamaları"
        subtitle="Palamar yükü, rüzgâr kuvveti ve katenary hesaplarını aynı temada toplayın"
      >
        <div className="space-y-6">
          <div className="flex justify-end">
            <Link to="/seamanship/formulas">
              <Button variant="secondary" size="sm" className="gap-2">
                <Sigma className="h-4 w-4" />
                Formüller
              </Button>
            </Link>
          </div>

          <CalculationGrid items={seamanshipItems} className="sm:grid-cols-2" />

          <p className="text-center text-sm text-slate-300" data-no-translate>
            Her hesaplama ayrı bir sayfada açılır
          </p>
        </div>
      </CalculationGridScreen>
    </MobileLayout>
  );
};

export default SeamanshipCalculationsPage;
