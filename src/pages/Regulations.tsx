import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { OpenLibraryBrowser } from "@/components/ui/open-library-browser";
import { LanguageSelector } from "@/components/ui/language-selector";
import { 
  ArrowLeft, 
  Ship, 
  Shield, 
  Droplets, 
  FileText, 
  Download, 
  Search, 
  BookOpen, 
  Flame,
  Radio,
  Navigation,
  Package,
  AlertTriangle,
  Zap,
  Users,
  Building,
  Compass,
  Eye,
  Volume2,
  Lightbulb,
  Cloud
} from 'lucide-react';
import jsPDF from 'jspdf';

interface SOLASChapter {
  id: string;
  chapter: string;
  title: string;
  category: 'general' | 'construction' | 'fire' | 'lifesaving' | 'radio' | 'safety' | 'cargo' | 'nuclear';
  description: string;
  lastAmended: string;
  keyProvisions: string[];
  applicability: string[];
  amendments2024: string[];
  regulations: SOLASRegulation[];
}

interface SOLASRegulation {
  id: string;
  regulation: string;
  title: string;
  description: string;
  requirements: string[];
  exemptions?: string[];
  penalties: string;
}

interface COLREGRule {
  id: string;
  part: string;
  section: string;
  rule: string;
  title: string;
  category: 'general' | 'steering' | 'lights' | 'sound' | 'distress';
  description: string;
  keyProvisions: string[];
  diagrams?: string[];
  applicability: string[];
}

interface COLREGPart {
  id: string;
  part: string;
  title: string;
  description: string;
  rules: COLREGRule[];
}

const Regulations = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCOLREGPart, setSelectedCOLREGPart] = useState<string>("");

  const solasChapters: SOLASChapter[] = [
    {
      id: "chapter1",
      chapter: "Chapter I",
      title: "General Provisions",
      category: "general",
      description: "Definitions, application, survey and certification requirements for all vessels",
      lastAmended: "January 2024",
      keyProvisions: [
        "Definitions of terms used throughout SOLAS",
        "Application to different ship types and sizes", 
        "Survey and certification requirements",
        "Port State Control provisions"
      ],
      applicability: ["All SOLAS vessels", "Flag states", "Port states"],
      amendments2024: [
        "Enhanced digital certificate provisions",
        "Updated survey harmonization requirements",
        "Streamlined remote survey capabilities"
      ],
      regulations: [
        {
          id: "reg1",
          regulation: "Regulation 1",
          title: "Application",
          description: "SOLAS applies to passenger ships engaged in international voyages and cargo ships of 500 gross tonnage and upwards engaged in international voyages",
          requirements: [
            "Passenger ships on international voyages regardless of size",
            "Cargo ships ≥500 GT on international voyages",
            "Compliance with all applicable chapters"
          ],
          penalties: "Port State detention, flag state sanctions"
        },
        {
          id: "reg5",
          regulation: "Regulation 5", 
          title: "Surveys",
          description: "Mandatory surveys for safety construction, equipment and radio surveys",
          requirements: [
            "Initial survey before ship enters service",
            "Annual surveys within 3 months of anniversary",
            "Intermediate surveys for passenger ships",
            "Renewal surveys every 5 years"
          ],
          penalties: "Certificate suspension or withdrawal"
        }
      ]
    },
    {
      id: "chapter2-1",
      chapter: "Chapter II-1", 
      title: "Construction - Structure, Subdivision, Stability, Machinery and Electrical Installations",
      category: "construction",
      description: "Requirements for ship construction, watertight integrity, stability, propulsion and electrical systems",
      lastAmended: "January 2024",
      keyProvisions: [
        "Subdivision and damage stability requirements",
        "Machinery installation standards", 
        "Electrical installation requirements",
        "Steering gear provisions"
      ],
      applicability: ["All SOLAS ships", "New constructions", "Major conversions"],
      amendments2024: [
        "Enhanced cybersecurity requirements for ship systems",
        "Updated provisions for alternative fuel systems",
        "Strengthened flooding sensors requirements"
      ],
      regulations: [
        {
          id: "reg21-1",
          regulation: "Regulation 21",
          title: "Bilge pumping arrangements",
          description: "Requirements for bilge and ballast pumping systems to maintain watertight integrity",
          requirements: [
            "Minimum two independent bilge pumps",
            "Emergency bilge pumping from main deck",
            "Bilge level monitoring systems",
            "Cross-flooding arrangements for passenger ships"
          ],
          penalties: "Detention until compliance achieved"
        }
      ]
    },
    {
      id: "chapter2-2",
      chapter: "Chapter II-2",
      title: "Fire Protection, Fire Detection and Fire Extinction", 
      category: "fire",
      description: "Comprehensive fire safety measures including prevention, detection, containment and extinction",
      lastAmended: "January 2024",
      keyProvisions: [
        "Fire prevention in design and construction",
        "Fire detection and alarm systems",
        "Fire suppression and extinction systems",
        "Escape routes and operational procedures"
      ],
      applicability: ["All SOLAS ships", "Cargo spaces", "Accommodation areas", "Machinery spaces"],
      amendments2024: [
        "Enhanced requirements for lithium battery cargo",
        "Improved fire suppression systems for RoRo spaces",
        "Updated provisions for alternative fuel fire hazards"
      ],
      regulations: [
        {
          id: "reg10",
          regulation: "Regulation 10",
          title: "Fire detection and fire alarm systems",
          description: "Mandatory fire detection systems throughout the ship with automatic and manual activation",
          requirements: [
            "Automatic fire detection in all spaces",
            "Manual call points at strategic locations", 
            "Central fire control station",
            "Audio-visual alarms throughout ship"
          ],
          penalties: "Immediate detention until systems operational"
        }
      ]
    },
    {
      id: "chapter3", 
      chapter: "Chapter III",
      title: "Life-Saving Appliances and Arrangements",
      category: "lifesaving",
      description: "Requirements for lifeboats, life rafts, personal flotation devices and emergency procedures",
      lastAmended: "January 2024", 
      keyProvisions: [
        "Lifeboat and life raft capacity requirements",
        "Personal life-saving appliances", 
        "Launch and embarkation arrangements",
        "Training and drills requirements"
      ],
      applicability: ["All SOLAS ships", "Crew and passengers", "Emergency situations"],
      amendments2024: [
        "Enhanced survival equipment for polar waters",
        "Improved launching systems for severe weather",
        "Updated training requirements for crew"
      ],
      regulations: [
        {
          id: "reg31",
          regulation: "Regulation 31",
          title: "Survival craft and rescue boats",
          description: "Requirements for survival craft capacity and performance standards",
          requirements: [
            "100% capacity on each side for passenger ships",
            "Adequate capacity for total persons on board cargo ships",
            "Approval according to LSA Code",
            "Regular inspection and maintenance"
          ],
          penalties: "Port detention until compliance certified"
        }
      ]
    },
    {
      id: "chapter4",
      chapter: "Chapter IV", 
      title: "Global Maritime Distress and Safety System (GMDSS)",
      category: "radio",
      description: "Radio communication requirements for distress, safety and general communications",
      lastAmended: "January 2024",
      keyProvisions: [
        "GMDSS equipment requirements by sea area",
        "Distress and safety communication procedures",
        "Radio operator certification requirements", 
        "Maintenance and testing procedures"
      ],
      applicability: ["All SOLAS ships", "Different sea areas A1-A4", "Radio operators"],
      amendments2024: [
        "Enhanced satellite communication requirements",
        "Cybersecurity provisions for GMDSS equipment", 
        "Updated training standards for operators"
      ],
      regulations: [
        {
          id: "reg7",
          regulation: "Regulation 7",
          title: "Radio equipment - General",
          description: "Basic radio equipment requirements for all GMDSS-equipped vessels",
          requirements: [
            "VHF radio with DSC capability",
            "EPIRB (406 MHz)",
            "SART or AIS-SART",
            "Navtex receiver for sea areas A2, A3, A4"
          ],
          penalties: "Voyage restriction until equipment operational"
        }
      ]
    },
    {
      id: "chapter5",
      chapter: "Chapter V",
      title: "Safety of Navigation", 
      category: "safety",
      description: "Navigation equipment, procedures and voyage planning requirements for safe navigation",
      lastAmended: "January 2024",
      keyProvisions: [
        "Bridge equipment and navigation systems",
        "Voyage planning requirements",
        "Lookout and watch-keeping standards",
        "Reporting of dangers to navigation"
      ],
      applicability: ["All SOLAS ships", "Bridge teams", "Navigation officers"],
      amendments2024: [
        "Enhanced cybersecurity for navigation systems",
        "Updated ECDIS performance standards", 
        "Autonomous vessel navigation provisions"
      ],
      regulations: [
        {
          id: "reg19",
          regulation: "Regulation 19",
          title: "Carriage requirements for shipborne navigational systems and equipment",
          description: "Mandatory navigation equipment based on ship type and voyage area",
          requirements: [
            "Radar systems (one or two depending on ship size)",
            "ECDIS or paper charts",
            "GPS receivers",
            "AIS transponder",
            "VDR (Voyage Data Recorder)"
          ],
          penalties: "Detention until equipment properly installed and tested"
        }
      ]
    },
    {
      id: "chapter6",
      chapter: "Chapter VI",
      title: "Carriage of Cargoes",
      category: "cargo", 
      description: "Safe carriage requirements for different cargo types including containers and bulk cargoes",
      lastAmended: "January 2024",
      keyProvisions: [
        "Grain cargo stability requirements",
        "Container securing arrangements",
        "Dangerous goods carriage",
        "Cargo loading and discharge procedures"
      ],
      applicability: ["Cargo ships", "Container vessels", "Bulk carriers"],
      amendments2024: [
        "Enhanced provisions for lithium battery cargo",
        "Updated container weight verification requirements",
        "Improved dangerous goods documentation"
      ],
      regulations: [
        {
          id: "reg2",
          regulation: "Regulation 2", 
          title: "Cargo securing systems",
          description: "Requirements for securing cargo to prevent shifting during voyage",
          requirements: [
            "Cargo Securing Manual approved by flag state", 
            "Adequate lashings and securing points",
            "Regular inspection of securing arrangements",
            "Training for cargo operations personnel"
          ],
          penalties: "Port State Control detention until cargo properly secured"
        }
      ]
    },
    {
      id: "chapter7",
      chapter: "Chapter VII",
      title: "Carriage of Dangerous Goods",
      category: "cargo",
      description: "Specific requirements for ships carrying dangerous goods including IMDG Code compliance",
      lastAmended: "January 2024", 
      keyProvisions: [
        "IMDG Code compliance",
        "Dangerous goods manifest requirements",
        "Segregation and stowage requirements",
        "Emergency procedures for dangerous goods"
      ],
      applicability: ["Ships carrying dangerous goods", "Packaged dangerous goods", "Solid bulk cargoes"],
      amendments2024: [
        "New provisions for lithium metal and ion batteries",
        "Enhanced segregation requirements",
        "Updated emergency response procedures"
      ],
      regulations: [
        {
          id: "reg3",
          regulation: "Regulation 3",
          title: "Carriage of dangerous goods",
          description: "Mandatory compliance with IMDG Code for packaged dangerous goods",
          requirements: [
            "Proper classification and packaging",
            "Correct marking and labeling", 
            "Dangerous goods manifest and stowage plan",
            "Segregation according to IMDG Code"
          ],
          penalties: "Prohibition of loading until compliance achieved"
        }
      ]
    },
    {
      id: "chapter8",
      chapter: "Chapter VIII", 
      title: "Nuclear Ships",
      category: "nuclear",
      description: "Additional safety measures applicable to nuclear-powered merchant ships",
      lastAmended: "1981",
      keyProvisions: [
        "Nuclear installation safety requirements",
        "Radiation protection measures",
        "Special certification procedures",
        "Port entry restrictions"
      ],
      applicability: ["Nuclear-powered merchant ships"],
      amendments2024: [],
      regulations: [
        {
          id: "reg1n",
          regulation: "Regulation 1",
          title: "Application", 
          description: "Nuclear ships must comply with all SOLAS requirements plus additional nuclear-specific provisions",
          requirements: [
            "Nuclear installation approval",
            "Radiation monitoring systems",
            "Emergency procedures for nuclear incidents",
            "Special crew training and certification"
          ],
          penalties: "Exclusion from ports until safety demonstrated"
        }
      ]
    }
  ];

  // COLREG Rules Data (Based on USCG Navigation Rules)
  const colregParts: COLREGPart[] = [
    {
      id: "partA",
      part: "Part A",
      title: "General",
      description: "General application, responsibility, and definitions",
      rules: [
        {
          id: "rule1",
          part: "A",
          section: "General",
          rule: "Rule 1",
          title: "Application",
          category: "general",
          description: "These Rules shall apply to all vessels upon the high seas and in all waters connected therewith navigable by seagoing vessels",
          keyProvisions: [
            "Applies to all vessels on high seas",
            "Applies to all waters connected to high seas",
            "Nothing interferes with special rules made by appropriate authority",
            "Special rules for harbors, rivers, lakes may be made by local authority"
          ],
          applicability: ["All vessels", "All waters"]
        },
        {
          id: "rule2",
          part: "A",
          section: "General",
          rule: "Rule 2",
          title: "Responsibility",
          category: "general",
          description: "Nothing in these Rules shall exonerate any vessel from consequences of neglect to comply with Rules or special circumstances",
          keyProvisions: [
            "Compliance with rules required",
            "Due regard to all dangers of navigation",
            "Special circumstances may require departure from Rules",
            "Precautions required by ordinary practice of seamen"
          ],
          applicability: ["All vessels", "All situations"]
        },
        {
          id: "rule3",
          part: "A",
          section: "General",
          rule: "Rule 3",
          title: "General Definitions",
          category: "general",
          description: "Definitions of vessel types and conditions used throughout the Rules",
          keyProvisions: [
            "Vessel: Every description of water craft",
            "Power-driven vessel: Any vessel propelled by machinery",
            "Sailing vessel: Any vessel under sail without machinery",
            "Vessel engaged in fishing: Using nets, lines, trawls",
            "Vessel not under command: Unable to maneuver",
            "Vessel restricted in ability to maneuver: Due to nature of work",
            "Vessel constrained by draft: Due to draft vs available depth"
          ],
          applicability: ["All vessels"]
        }
      ]
    },
    {
      id: "partB",
      part: "Part B",
      title: "Steering and Sailing Rules",
      description: "Rules for vessel conduct in any condition of visibility",
      rules: [
        {
          id: "rule4",
          part: "B",
          section: "Section I - Any Visibility",
          rule: "Rule 4",
          title: "Application",
          category: "steering",
          description: "Rules in this section apply in any condition of visibility",
          keyProvisions: [
            "Applies to all visibility conditions",
            "Day or night",
            "Clear weather or restricted visibility"
          ],
          applicability: ["All vessels", "Any visibility"]
        },
        {
          id: "rule5",
          part: "B",
          section: "Section I - Any Visibility",
          rule: "Rule 5",
          title: "Look-out",
          category: "steering",
          description: "Every vessel shall at all times maintain a proper look-out",
          keyProvisions: [
            "Proper look-out by sight and hearing",
            "Use all available means appropriate",
            "Full appraisal of situation",
            "Risk of collision assessment"
          ],
          applicability: ["All vessels", "All times"]
        },
        {
          id: "rule6",
          part: "B",
          section: "Section I - Any Visibility",
          rule: "Rule 6",
          title: "Safe Speed",
          category: "steering",
          description: "Every vessel shall proceed at a safe speed to avoid collision",
          keyProvisions: [
            "Take proper and effective action to avoid collision",
            "Stop within appropriate distance",
            "Consider visibility, traffic density, maneuverability",
            "Background lights, sea conditions, draft"
          ],
          applicability: ["All vessels", "All conditions"]
        },
        {
          id: "rule7",
          part: "B",
          section: "Section I - Any Visibility",
          rule: "Rule 7",
          title: "Risk of Collision",
          category: "steering",
          description: "Use all available means to determine if risk of collision exists",
          keyProvisions: [
            "Use all available means including radar",
            "Compass bearing of approaching vessel",
            "If bearing does not appreciably change, risk exists",
            "Risk may exist even with appreciable bearing change"
          ],
          applicability: ["All vessels"]
        },
        {
          id: "rule8",
          part: "B",
          section: "Section I - Any Visibility",
          rule: "Rule 8",
          title: "Action to Avoid Collision",
          category: "steering",
          description: "Action taken to avoid collision shall be positive and in ample time",
          keyProvisions: [
            "Positive action made in ample time",
            "Large alteration readily apparent",
            "Series of small alterations to be avoided",
            "Result in passing at safe distance",
            "Effectiveness monitored until finally past"
          ],
          applicability: ["All vessels"]
        },
        {
          id: "rule13",
          part: "B",
          section: "Section II - Vessels in Sight",
          rule: "Rule 13",
          title: "Overtaking",
          category: "steering",
          description: "Any vessel overtaking shall keep out of the way of vessel being overtaken",
          keyProvisions: [
            "Overtaking vessel keeps clear",
            "Coming up from direction more than 22.5° abaft beam",
            "If in doubt, assume overtaking",
            "Remains overtaking vessel until finally past and clear"
          ],
          applicability: ["All vessels", "In sight"]
        },
        {
          id: "rule14",
          part: "B",
          section: "Section II - Vessels in Sight",
          rule: "Rule 14",
          title: "Head-on Situation",
          category: "steering",
          description: "Vessels meeting head-on shall each alter course to starboard",
          keyProvisions: [
            "Both alter course to starboard",
            "Pass port to port",
            "Applies when on reciprocal or nearly reciprocal courses",
            "If in doubt, assume head-on situation exists"
          ],
          applicability: ["Power-driven vessels", "In sight"]
        },
        {
          id: "rule15",
          part: "B",
          section: "Section II - Vessels in Sight",
          rule: "Rule 15",
          title: "Crossing Situation",
          category: "steering",
          description: "Vessel with other on starboard side shall keep out of way",
          keyProvisions: [
            "Give-way vessel has other on starboard side",
            "Keep out of way and avoid crossing ahead",
            "Stand-on vessel maintains course and speed",
            "Early and substantial action required"
          ],
          applicability: ["Power-driven vessels", "In sight"]
        }
      ]
    },
    {
      id: "partC",
      part: "Part C",
      title: "Lights and Shapes",
      description: "Requirements for navigation lights and day shapes",
      rules: [
        {
          id: "rule20",
          part: "C",
          section: "Lights and Shapes",
          rule: "Rule 20",
          title: "Application",
          category: "lights",
          description: "Rules concerning lights shall be complied with from sunset to sunrise",
          keyProvisions: [
            "Lights from sunset to sunrise",
            "During restricted visibility",
            "No other lights to impair visibility",
            "Day shapes during daylight"
          ],
          applicability: ["All vessels"]
        },
        {
          id: "rule21",
          part: "C",
          section: "Lights and Shapes",
          rule: "Rule 21",
          title: "Definitions",
          category: "lights",
          description: "Technical specifications for navigation lights",
          keyProvisions: [
            "Masthead light: White, 225° arc, 6 miles visibility",
            "Sidelights: Green starboard, Red port, 112.5° arc, 3 miles",
            "Sternlight: White, 135° arc, 3 miles",
            "Towing light: Yellow, same as sternlight",
            "All-round light: 360° arc",
            "Flashing light: 120+ flashes per minute"
          ],
          applicability: ["All vessels"]
        },
        {
          id: "rule23",
          part: "C",
          section: "Lights and Shapes",
          rule: "Rule 23",
          title: "Power-driven Vessels Underway",
          category: "lights",
          description: "Lights to be displayed by power-driven vessels when underway",
          keyProvisions: [
            "Masthead light forward",
            "Second masthead light abaft and higher (>50m)",
            "Sidelights",
            "Sternlight",
            "Vessels <50m may combine lights"
          ],
          applicability: ["Power-driven vessels", "Underway"]
        }
      ]
    },
    {
      id: "partD",
      part: "Part D",
      title: "Sound and Light Signals",
      description: "Requirements for sound signals and distress signals",
      rules: [
        {
          id: "rule32",
          part: "D",
          section: "Sound Signals",
          rule: "Rule 32",
          title: "Definitions",
          category: "sound",
          description: "Definitions of sound signal equipment and signals",
          keyProvisions: [
            "Whistle: Any sound signaling appliance",
            "Short blast: About 1 second duration",
            "Prolonged blast: 4-6 seconds duration",
            "Vessels >100m: Whistle, bell, and gong",
            "Vessels 20-100m: Whistle and bell",
            "Vessels <20m: Efficient sound signal"
          ],
          applicability: ["All vessels"]
        },
        {
          id: "rule34",
          part: "D",
          section: "Sound Signals",
          rule: "Rule 34",
          title: "Maneuvering and Warning Signals",
          category: "sound",
          description: "Sound signals for maneuvering in sight of one another",
          keyProvisions: [
            "One short blast: Altering course to starboard",
            "Two short blasts: Altering course to port",
            "Three short blasts: Operating astern propulsion",
            "Five short blasts: Warning/doubt signal",
            "Agreement required in narrow channels"
          ],
          applicability: ["Power-driven vessels", "In sight"]
        },
        {
          id: "rule35",
          part: "D",
          section: "Sound Signals",
          rule: "Rule 35",
          title: "Sound Signals in Restricted Visibility",
          category: "sound",
          description: "Required sound signals when operating in or near restricted visibility",
          keyProvisions: [
            "Power-driven making way: One prolonged blast every 2 minutes",
            "Power-driven stopped: Two prolonged blasts every 2 minutes",
            "Not under command/restricted/constrained/sailing/fishing/towing: One prolonged + two short every 2 minutes",
            "Vessel at anchor: Rapid bell for 5 seconds every minute",
            "Vessel aground: Three bell strokes + rapid bell + three bell strokes"
          ],
          applicability: ["All vessels", "Restricted visibility"]
        }
      ]
    },
    {
      id: "partE",
      part: "Part E",
      title: "Exemptions",
      description: "Exemptions for vessels based on construction date",
      rules: [
        {
          id: "rule38",
          part: "E",
          section: "Exemptions",
          rule: "Rule 38",
          title: "Exemptions",
          category: "general",
          description: "Exemptions from technical requirements based on vessel construction date",
          keyProvisions: [
            "Vessels constructed before Rules entry into force",
            "Light positioning exemptions",
            "Sound signal equipment exemptions",
            "Time limits for compliance",
            "National authority determinations"
          ],
          applicability: ["Older vessels"]
        }
      ]
    }
  ];

  const filteredChapters = solasChapters.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.keyProvisions.some(provision => 
                           provision.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = activeCategory === "all" || chapter.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredCOLREGParts = colregParts.filter(part => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = part.title.toLowerCase().includes(searchLower) ||
                         part.description.toLowerCase().includes(searchLower) ||
                         part.rules.some(rule => 
                           rule.title.toLowerCase().includes(searchLower) ||
                           rule.description.toLowerCase().includes(searchLower)
                         );
    return matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <BookOpen className="h-4 w-4" />;
      case 'construction': return <Building className="h-4 w-4" />;
      case 'fire': return <Flame className="h-4 w-4" />;
      case 'lifesaving': return <Users className="h-4 w-4" />;
      case 'radio': return <Radio className="h-4 w-4" />;
      case 'safety': return <Navigation className="h-4 w-4" />;
      case 'cargo': return <Package className="h-4 w-4" />;
      case 'nuclear': return <Zap className="h-4 w-4" />;
      case 'steering': return <Compass className="h-4 w-4" />;
      case 'lights': return <Lightbulb className="h-4 w-4" />;
      case 'sound': return <Volume2 className="h-4 w-4" />;
      case 'distress': return <AlertTriangle className="h-4 w-4" />;
      default: return <Ship className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'construction': return 'bg-green-100 text-green-800';
      case 'fire': return 'bg-red-100 text-red-800';
      case 'lifesaving': return 'bg-orange-100 text-orange-800';
      case 'radio': return 'bg-purple-100 text-purple-800';
      case 'safety': return 'bg-indigo-100 text-indigo-800';
      case 'cargo': return 'bg-yellow-100 text-yellow-800';
      case 'nuclear': return 'bg-gray-100 text-gray-800';
      case 'steering': return 'bg-cyan-100 text-cyan-800';
      case 'lights': return 'bg-amber-100 text-amber-800';
      case 'sound': return 'bg-pink-100 text-pink-800';
      case 'distress': return 'bg-red-200 text-red-900';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('SOLAS 2024 Consolidated Edition', 20, 30);
      
      doc.setFontSize(12);
      doc.text('International Convention for the Safety of Life at Sea', 20, 45);
      doc.text('Generated by Maritime Calculator', 20, 55);
      
      let yPosition = 70;
      
      filteredChapters.forEach((chapter) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        doc.setFontSize(14);
        doc.text(`${chapter.chapter}: ${chapter.title}`, 20, yPosition);
        yPosition += 10;
        
        doc.setFontSize(10);
        doc.text(`Last Amended: ${chapter.lastAmended}`, 20, yPosition);
        yPosition += 8;
        
        doc.text('Description:', 20, yPosition);
        yPosition += 6;
        const splitDescription = doc.splitTextToSize(chapter.description, 170);
        doc.text(splitDescription, 25, yPosition);
        yPosition += splitDescription.length * 6 + 5;
        
        if (chapter.amendments2024.length > 0) {
          doc.text('2024 Amendments:', 20, yPosition);
          yPosition += 6;
          chapter.amendments2024.forEach((amendment) => {
            const splitAmendment = doc.splitTextToSize(`• ${amendment}`, 165);
            doc.text(splitAmendment, 25, yPosition);
            yPosition += splitAmendment.length * 6;
          });
          yPosition += 5;
        }
        
        yPosition += 10;
      });
      
      doc.save('SOLAS_2024_Consolidated_Edition.pdf');
      
      toast({
        title: "PDF Generated",
        description: "SOLAS regulations have been exported to PDF successfully.",
      });
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "There was an error generating the PDF file.",
        variant: "destructive",
      });
    }
  };

  const selectedChapterData = solasChapters.find(chapter => chapter.id === selectedChapter);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfa
            </Link>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Ship className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SOLAS 2024 Consolidated Edition</h1>
                <p className="text-muted-foreground">International Convention for the Safety of Life at Sea</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector variant="compact" />
            <Button onClick={exportToPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              PDF İndir
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Arama ve Filtreler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Arama</Label>
                <Input
                  id="search"
                  placeholder="Chapter, düzenleme veya anahtar kelime ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select value={activeCategory} onValueChange={setActiveCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seç" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    <SelectItem value="general">Genel Hükümler</SelectItem>
                    <SelectItem value="construction">Yapı</SelectItem>
                    <SelectItem value="fire">Yangın Güvenliği</SelectItem>
                    <SelectItem value="lifesaving">Cankurtarma</SelectItem>
                    <SelectItem value="radio">GMDSS</SelectItem>
                    <SelectItem value="safety">Seyir Güvenliği</SelectItem>
                    <SelectItem value="cargo">Kargo Taşımacılığı</SelectItem>
                    <SelectItem value="nuclear">Nükleer Gemiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="chapters" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="chapters">SOLAS</TabsTrigger>
            <TabsTrigger value="colreg">COLREG</TabsTrigger>
            <TabsTrigger value="amendments">2024 Updates</TabsTrigger>
            <TabsTrigger value="library">Library</TabsTrigger>
            <TabsTrigger value="mgm">MGM Bulutlar</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      SOLAS Consolidated Edition 2024
                    </CardTitle>
                    <CardDescription>
                      International Convention for the Safety of Life at Sea - Latest consolidated edition with 2024 amendments
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open('https://www.mar.ist.utl.pt/mventura/Projecto-Navios-I/IMO-Conventions%20(copies)/SOLAS.pdf', '_blank')}
                      className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4" />
                      Download SOLAS Full PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Official SOLAS Resources
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://assets.publishing.service.gov.uk/media/5f7311fce90e0752cb8d2ae9/solas-v-on-safety-of-navigation.pdf', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        SOLAS Chapter V - Safety of Navigation
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.imo.org/en/OurWork/Safety/Pages/SOLAS-amendments.aspx', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Latest SOLAS Amendments
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/Documents/SOLAS%20Brief%20History%20-%20List%20of%20amendments%20to%20date%20and%20how%20to%20find%20them.pdf', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        SOLAS Amendment History
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.imo.org/en/OurWork/Safety/Pages/InternationalLifeSavingAppliance(LSA)Code.aspx', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        LSA Code (Life-Saving)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.imo.org/en/OurWork/Safety/Pages/FSS-Code.aspx', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Flame className="h-4 w-4 mr-2" />
                        FSS Code (Fire Safety)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.classnk.or.jp/hp/pdf/activities/statutory/solas/solas_amend_2024.pdf', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        2024 Amendments Summary (ClassNK)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.dco.uscg.mil/Portals/9/CG-5PC/CG-CVC/CVC3/references/SOLAS%20Consolidated%20Edition%202009.pdf', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        SOLAS 2009 Edition (USCG)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.ccaimo.com/images/Documents_IMO_Conventions_10_codes_IBC.pdf', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        SOLAS + Other IMO Conventions
                      </Button>
                    </div>
                  </div>
                  
                                      <div className="text-sm text-blue-800 bg-blue-100/50 p-3 rounded">
                      <p className="font-medium mb-1">📋 Available SOLAS Resources:</p>
                      <p>• Full SOLAS Convention text (IST Lisbon)</p>
                      <p>• SOLAS Chapter V - Safety of Navigation (UK MCA)</p>
                      <p>• SOLAS 2009 Consolidated Edition (USCG)</p>
                      <p>• Historical amendments and related codes</p>
                      <p className="mt-2 text-xs">Not: En güncel 2024 versiyonu IMO'dan satın alınabilir.</p>
                    </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {filteredChapters.map((chapter) => (
                <Card key={chapter.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(chapter.category)}
                          <CardTitle className="text-lg">{chapter.chapter}: {chapter.title}</CardTitle>
                          <Badge className={getCategoryColor(chapter.category)}>
                            {chapter.category}
                          </Badge>
                        </div>
                        <CardDescription>{chapter.description}</CardDescription>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Son Güncelleme: {chapter.lastAmended}</span>
                          <span>•</span>
                          <span>{chapter.regulations.length} Düzenleme</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Temel Hükümler:</h4>
                        <ul className="space-y-1">
                          {chapter.keyProvisions.map((provision, index) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {provision}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {chapter.amendments2024.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            2024 Güncellemeleri:
                          </h4>
                          <ul className="space-y-1">
                            {chapter.amendments2024.map((amendment, index) => (
                              <li key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded flex items-start gap-2">
                                <span className="text-orange-500">•</span>
                                {amendment}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="font-medium mb-2">Uygulama Alanı:</h4>
                        <div className="flex flex-wrap gap-2">
                          {chapter.applicability.map((scope, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {scope}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="amendments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  SOLAS 2024 Güncellemeleri
                </CardTitle>
                <CardDescription>
                  1 Ocak 2024 tarihinde yürürlüğe giren önemli değişiklikler
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {solasChapters.filter(chapter => chapter.amendments2024.length > 0).map((chapter) => (
                    <div key={chapter.id} className="border-l-4 border-orange-500 pl-4">
                      <h3 className="font-semibold text-lg mb-2">{chapter.chapter}: {chapter.title}</h3>
                      <ul className="space-y-2">
                        {chapter.amendments2024.map((amendment, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-muted-foreground">{amendment}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colreg" className="space-y-4">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Compass className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        International Regulations for Preventing Collisions at Sea (COLREG)
                      </CardTitle>
                      <CardDescription>
                        Based on USCG Navigation Rules - 72 COLREGS
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://www.navcen.uscg.gov/sites/default/files/pdf/navRules/navrules.pdf', '_blank')}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download USCG COLREG PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-blue-50 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-blue-900 mb-2">USCG Navigation Rules Resources</h3>
                      <p className="text-sm text-blue-800 mb-3">
                        The U.S. Coast Guard maintains the official Navigation Rules for U.S. waters, 
                        which incorporate the International COLREGS with additional Inland Rules.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.navcen.uscg.gov/navigation-rules-amalgamated', '_blank')}
                          className="text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          USCG Navigation Center
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.navcen.uscg.gov/sites/default/files/pdf/navRules/CG_NRHB_20240101.pdf', '_blank')}
                          className="text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Navigation Rules Handbook 2024
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open('https://www.navcen.uscg.gov/sites/default/files/pdf/navRules/InlandNavRules2019.pdf', '_blank')}
                          className="text-blue-700 border-blue-300 hover:bg-blue-100"
                        >
                          <Ship className="h-4 w-4 mr-2" />
                          Inland Navigation Rules
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {filteredCOLREGParts.map((part) => (
                <Card key={part.id} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <CardTitle className="text-lg">
                      {part.part}: {part.title}
                    </CardTitle>
                    <CardDescription>{part.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {part.rules.map((rule) => (
                        <div key={rule.id} className="p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              {getCategoryIcon(rule.category)}
                              <div>
                                <h4 className="font-semibold text-sm">
                                  {rule.rule}: {rule.title}
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {rule.description}
                                </p>
                              </div>
                            </div>
                            <Badge className={getCategoryColor(rule.category)}>
                              {rule.category}
                            </Badge>
                          </div>
                          
                          <div className="ml-7 space-y-3">
                            <div>
                              <h5 className="font-medium text-sm mb-2">Key Provisions:</h5>
                              <ul className="space-y-1">
                                {rule.keyProvisions.map((provision, index) => (
                                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{provision}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-3">
                              {rule.applicability.map((scope, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {scope}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredCOLREGParts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      No COLREG rules found matching your search.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <OpenLibraryBrowser className="w-full" />
          </TabsContent>

          <TabsContent value="mgm" className="space-y-6">
            {/* MGM Bulutlar Kataloğu */}
            <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-gray-800 dark:to-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 bg-blue-600 rounded-lg">
                    <Droplets className="h-6 w-6 text-white" />
                  </div>
                  MGM Bulutlar Kataloğu
                </CardTitle>
                <CardDescription className="text-base">
                  Meteoroloji Genel Müdürlüğü (MGM) - Bulut Gözlem ve Sınıflandırma Rehberi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border border-blue-100">
                  <h3 className="font-semibold text-lg mb-3 text-blue-800">Hakkında</h3>
                  <p className="text-gray-700 mb-4">
                    Meteoroloji Genel Müdürlüğü tarafından hazırlanan bu kapsamlı bulut kataloğu, 
                    denizciler ve meteoroloji gözlemcileri için kritik öneme sahip bulut tiplerini, 
                    karakteristiklerini ve denizcilik açısından önemlerini detaylı olarak açıklamaktadır.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">İçerik:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>10 ana bulut tipi ve alt türleri</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>CL, CM, CH kodlama sistemi</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Bulut yükseklikleri ve oluşum şartları</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Hava tahmin yöntemleri</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300">Denizcilik İçin Önemi:</h4>
                      <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Fırtına öncesi bulut belirtileri</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Görüş mesafesi tahminleri</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Rüzgar değişimi göstergeleri</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-0.5">•</span>
                          <span>Yağış zamanlaması ve şiddeti</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open('https://www.mgm.gov.tr/FILES/genel/kitaplar/bulutlar.pdf', '_blank')}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    MGM Bulutlar PDF İndir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="flex-1"
                    onClick={() => navigate('/weather-calculations')}
                  >
                    <Droplets className="mr-2 h-5 w-5" />
                    Bulut Kataloğunu Görüntüle
                  </Button>
                </div>

                {/* Önemli Bulut Tipleri */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-blue-800">Kritik Bulut Tipleri</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-red-200 bg-red-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          Cumulonimbus (Cb)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">
                          <strong>Tehlike:</strong> Şiddetli fırtına, yıldırım, su hortumu
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>İşaret:</strong> Örs şeklinde tepe, koyu taban
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Eye className="h-4 w-4 text-orange-600" />
                          Stratus (St)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">
                          <strong>Tehlike:</strong> Çok düşük görüş, deniz sisi
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>İşaret:</strong> Düzgün gri tabaka, alçak tavan
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-yellow-200 bg-yellow-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Navigation className="h-4 w-4 text-yellow-700" />
                          Cirrostratus (Cs)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">
                          <strong>İşaret:</strong> Güneş/ay halesi
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Anlam:</strong> 12-24 saat içinde fırtına
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50/50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Compass className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          Altocumulus (Ac)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-700">
                          <strong>İşaret:</strong> Koyun sürüsü görünümü
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          <strong>Anlam:</strong> 24 saat içinde hava değişimi
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* MGM Kaynakları */}
                <Card className="border-gray-200 bg-gray-50/50">
                  <CardHeader>
                    <CardTitle className="text-base">İlgili MGM Kaynakları</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => window.open('https://www.mgm.gov.tr', '_blank')}
                      >
                        <Building className="mr-2 h-4 w-4" />
                        MGM Ana Sayfa
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => window.open('https://www.mgm.gov.tr/denizcilik', '_blank')}
                      >
                        <Ship className="mr-2 h-4 w-4" />
                        MGM Denizcilik Meteorolojisi
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="justify-start"
                        onClick={() => window.open('https://www.mgm.gov.tr/egitim', '_blank')}
                      >
                        <BookOpen className="mr-2 h-4 w-4" />
                        MGM Eğitim Kaynakları
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Regulations;