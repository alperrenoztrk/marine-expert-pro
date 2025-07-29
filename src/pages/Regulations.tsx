import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
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
  Building
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

const Regulations = () => {
  const { toast } = useToast();
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

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

  const filteredChapters = solasChapters.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.keyProvisions.some(provision => 
                           provision.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = activeCategory === "all" || chapter.category === activeCategory;
    return matchesSearch && matchesCategory;
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
          <Button onClick={exportToPDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            PDF İndir
          </Button>
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chapters">SOLAS Chapters</TabsTrigger>
            <TabsTrigger value="amendments">2024 Amendments</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-4">
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
        </Tabs>
      </div>
    </div>
  );
};

export default Regulations;