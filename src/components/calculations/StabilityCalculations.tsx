import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Ship,
  Waves,
  Activity,
  Droplets,
  Wind,
  Shield,
  AlertTriangle,
  Gauge,
  Layers,
  Boxes,
  Compass,
  Package,
  Anchor,
  ArrowRight
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

type SectionItem = {
  id: string;
  title: string;
  icon: LucideIcon;
  accent: string;
  path: string;
  tagline?: string;
  subtopics: string[];
  notes?: string[];
};

type CalculationSection = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  items: SectionItem[];
};

const sections: CalculationSection[] = [
  {
    id: "stability",
    title: "A. STABILITY",
    kicker: "core intact modules",
    description: "Survey esnasinda ilk acilan 8 hesap, IMO kriter kontrolu icin zorunlu dosya seti.",
    items: [
      {
        id: "draft-trim",
        title: "1. Draft & Trim Calculator",
        icon: Ship,
        accent: "from-sky-400 to-blue-600",
        path: "/stability/draft-trim",
        tagline: "Draft survey boyunca anlik trim ve deplasman takibi",
        subtopics: [
          "Mevcut draftlardan deplasman hesaplama",
          "Trim hesaplama",
          "Agirlik ekleme/cikarma -> yeni draft & trim",
          "Longitudinal moment (LCG) hesaplama",
          "Final drafts (FWD-AFT-MCT-change trim)"
        ],
        notes: [
          "En cok kullanilan fonksiyon",
          "Gemide survey sirasinda dogrudan kullanilir"
        ]
      },
      {
        id: "hydrostatics",
        title: "2. Hydrostatics (Hidrostatik Degerler)",
        icon: Waves,
        accent: "from-cyan-400 to-sky-600",
        path: "/stability/hydrostatics",
        tagline: "TPC, MCT, KB-KM-BM ve yogunluk duzeltmeleri tek ekranda",
        subtopics: [
          "TPC (tonnes per cm)",
          "MCT 1 cm",
          "KB, KM, BM hesaplari",
          "LCB ve LCF hesaplama",
          "Yogunluk duzeltmesi"
        ],
        notes: ["Draft survey ve stabilite icin temel veri seti"]
      },
      {
        id: "intact",
        title: "3. Intact Stability Calculator",
        icon: Activity,
        accent: "from-indigo-400 to-purple-600",
        path: "/stability/analysis",
        tagline: "GM0, KG duzeltmesi, GZ egri ve alan hesaplari",
        subtopics: [
          "GM0 hesaplama",
          "KG duzeltmesi (agirlik ekleme/cikarma)",
          "LCG/TCG duzeltmeleri",
          "KN tablosundan GZ egri olusturma",
          "Max GZ, maksimum aci ve alan kontrolleri"
        ],
        notes: ["IMO kriter kontrolu icin sart"]
      },
      {
        id: "fse",
        title: "4. Free Surface Effect (FSE)",
        icon: Droplets,
        accent: "from-emerald-400 to-teal-600",
        path: "/stability/free-surface",
        tagline: "Tek ve coklu tank FSM toplami ile GM_eff raporu",
        subtopics: [
          "Tek tank FSM hesaplama",
          "Coklu tank FSM toplami",
          "Free surface correction (GG1)",
          "Duzeltilmis GM (GM_eff)",
          "FSM raporlama"
        ],
        notes: ["Genclerin vardiyada kontrol ettigi kritik hesap"]
      },
      {
        id: "heel-list",
        title: "5. Heel & List Calculator",
        icon: Compass,
        accent: "from-amber-400 to-orange-600",
        path: "/stability/heel-list",
        tagline: "Agirlik kaymasi ve TCG degisiminden final meyil acisi",
        subtopics: [
          "Transverse weight shift -> heel angle",
          "TCG degisiminden kaynakli liste",
          "Heeling moment calculation",
          "Final heel angle (phi)",
          "Alarm limitleri ve raporlama"
        ],
        notes: ["Bos konteyner ve yuk kaymasi senaryolari icin ideal"]
      },
      {
        id: "grain",
        title: "6. Grain Stability (Tahil)",
        icon: Anchor,
        accent: "from-yellow-400 to-lime-500",
        path: "/stability/grain-calculation",
        tagline: "IMO Grain Code icin Mh, GG1 grain ve GZ karsilastirmalari",
        subtopics: [
          "Grain heeling moment (Mh)",
          "Grain correction (GG1 grain)",
          "GZ ve heeling lever karsilastirmasi",
          "Minimum stabilite kontrolu",
          "Doluluk oranina gore heeling moment"
        ],
        notes: ["Ro-ro ve bulk gemileri icin pratik modul"]
      },
      {
        id: "wind-weather",
        title: "7. Wind & Weather Criterion",
        icon: Wind,
        accent: "from-blue-400 to-indigo-600",
        path: "/stability/wind-weather",
        tagline: "Wind pressure, lever ve IMO weather criterion PASS/FAIL",
        subtopics: [
          "Wind pressure (q)",
          "Projected area (A) -> wind force",
          "Wind heeling moment (Mw)",
          "Heeling lever (lh)",
          "Weather criterion PASS/FAIL"
        ],
        notes: ["Class ve PSC kontrol listesinde yer alir"]
      },
      {
        id: "damage",
        title: "8. Damage Stability (Hizli)",
        icon: Shield,
        accent: "from-rose-400 to-red-600",
        path: "/stability/damage",
        tagline: "Tek bolme su alirsa yeni draft-trim ve GZ egri",
        subtopics: [
          "Single compartment flooding",
          "Permeability uygulamasi",
          "Su hacminden yeni deplasman",
          "Yeni KG, LCG hesaplama",
          "Hasarli draft, trim ve GZ egri"
        ],
        notes: ["Operasyonda 'bolme dolarsa ne olur' sorusuna dogrudan yanit"]
      }
    ]
  },
  {
    id: "longitudinal",
    title: "B. LONGITUDINAL STRENGTH",
    kicker: "structural watch",
    description: "Shear force ve bending moment diyagramlari ile hogging/sagging kontrolu.",
    items: [
      {
        id: "shear-force",
        title: "9. Shear Force Monitor",
        icon: Layers,
        accent: "from-slate-400 to-slate-600",
        path: "/stability/shearing-bending",
        tagline: "Agirlik/buoyancy dagilimi -> SF diyagrami ve limit kontrolu",
        subtopics: [
          "Weight distribution",
          "Buoyancy distribution",
          "Shear force diagram",
          "Sagging/hogging kontrolu",
          "Permissible limit PASS/FAIL"
        ],
        notes: ["Konteyner gemilerinde vardiya boyunca acik tutulur"]
      },
      {
        id: "bending-moment",
        title: "10. Bending Moment Analyzer",
        icon: Gauge,
        accent: "from-gray-400 to-gray-600",
        path: "/stability/shearing-bending",
        tagline: "Ayni panelde BM diyagrami ve maksimum stres raporu",
        subtopics: [
          "Shear'dan otomatik BM entegrasyonu",
          "BM diagrami ve kritik noktalar",
          "Sagging/hogging alarmi",
          "Class limitleri ile karsilastirma",
          "PDF/CSV rapor cikisi"
        ],
        notes: ["SF ile ayni panelde calisir, BM icin filtre uzerinden secim"]
      }
    ]
  },
  {
    id: "operations",
    title: "C. OPERATIONS",
    kicker: "day-to-day tools",
    description: "Balast, yuk kaymasi ve konteyner GM limit hesaplari icin hizli araclar.",
    items: [
      {
        id: "ballast",
        title: "11. Ballast & Vessel Loading Tools",
        icon: Boxes,
        accent: "from-green-400 to-emerald-600",
        path: "/operations/ballast",
        tagline: "Balast transferi -> Delta TCG/KG/draft ve optimum plan",
        subtopics: [
          "Balast transferi: Delta TCG, Delta KG, Delta draft",
          "Final GM ve trim hesaplama",
          "Tank doluluk -> FSM etkisi",
          "Optimum balast plani oneri"
        ],
        notes: ["Gemde en sik yapilan operasyon"]
      },
      {
        id: "cargo-shift",
        title: "12. Cargo Shift Calculator",
        icon: Package,
        accent: "from-orange-400 to-red-500",
        path: "/stability/weight-shift",
        tagline: "Bulk/container/liquid kaymalari icin meyil analizi",
        subtopics: [
          "Bulk cargo shift -> heel angle",
          "Container shifting -> list angle",
          "Liquid cargo shifting -> FSM etkisi",
          "Securing failure simulation"
        ],
        notes: ["Ro-ro ve bulk operasyonlarinda zorunlu kontrol"]
      },
      {
        id: "container-gm",
        title: "13. Container GM Limit Calculator",
        icon: AlertTriangle,
        accent: "from-purple-400 to-fuchsia-600",
        path: "/stability/gm",
        tagline: "GM limit curves (bay-plan) ve stack uyumlulugu",
        subtopics: [
          "GM limit curves (bay-plan)",
          "Stack weight ve GM uyumlulugu",
          "Allowed GM kontrolu",
          "Actual GM uzerine limit cizelgesi uygula"
        ],
        notes: ["Arkas/MSC/Maersk gemilerinde sahada kullaniliyor"]
      }
    ]
  }
];

export const StabilityCalculations = () => {
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <section key={section.id} className="space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-blue-500">{section.kicker}</p>
            <h2 className="text-3xl font-bold text-slate-900">{section.title}</h2>
            <p className="text-muted-foreground text-sm md:text-base">{section.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.id}
                  className="relative overflow-hidden border border-white/60 bg-white/90 backdrop-blur-md shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.accent}`} />
                  <div className="relative space-y-4 p-6">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-2xl p-3 text-white bg-gradient-to-br ${item.accent}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                        {item.tagline && <p className="text-sm text-muted-foreground">{item.tagline}</p>}
                      </div>
                    </div>

                    <ul className="space-y-1.5 text-sm text-slate-600">
                      {item.subtopics.map((topic) => (
                        <li key={topic} className="flex gap-2">
                          <span className="text-slate-400">•</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>

                    {item.notes && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {item.notes.map((note) => (
                          <Badge key={note} variant="outline" className="bg-slate-50 text-slate-600 border-slate-200">
                            {note}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <Button asChild variant="outline" className="w-full justify-between">
                        <Link to={item.path} className="flex items-center justify-between w-full">
                          Modulu ac
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default StabilityCalculations;
