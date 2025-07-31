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
import { 
  ArrowLeft, 
  Ship, 
  Shield, 
  FileText, 
  Download, 
  Search, 
  AlertTriangle
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
  const navigate = useNavigate();
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
        "Application to passenger and cargo ships",
        "Survey and certification requirements",
        "Control procedures and port state control"
      ],
      applicability: ["All SOLAS vessels", "Flag states", "Port states"],
      amendments2024: [
        "Updated definitions for new ship types",
        "Enhanced survey requirements for older vessels",
        "Revised port state control procedures"
      ],
      regulations: []
    },
    {
      id: "chapter2",
      chapter: "Chapter II-1",
      title: "Construction - Subdivision and Stability",
      category: "construction",
      description: "Structural requirements, subdivision, stability, machinery and electrical installations",
      lastAmended: "January 2024",
      keyProvisions: [
        "Subdivision and damage stability requirements",
        "Machinery and electrical installations",
        "Periodic operation and testing of systems",
        "Emergency source of electrical power"
      ],
      applicability: ["All SOLAS ships", "New constructions", "Major conversions"],
      amendments2024: [
        "Enhanced damage stability calculations",
        "Updated machinery space requirements",
        "New electrical safety standards"
      ],
      regulations: []
    },
    {
      id: "chapter3",
      chapter: "Chapter II-2",
      title: "Construction - Fire Protection, Fire Detection and Fire Extinction",
      category: "fire",
      description: "Fire safety systems, detection, and extinguishing equipment requirements",
      lastAmended: "January 2024",
      keyProvisions: [
        "Fire prevention and protection systems",
        "Fire detection and alarm systems",
        "Fire fighting equipment and arrangements",
        "Emergency escape routes and procedures"
      ],
      applicability: ["All SOLAS ships", "Cargo spaces", "Accommodation areas", "Machinery spaces"],
      amendments2024: [
        "Updated fire detection system requirements",
        "Enhanced fire fighting equipment standards",
        "New emergency escape route specifications"
      ],
      regulations: []
    },
    {
      id: "chapter4",
      chapter: "Chapter III",
      title: "Life-Saving Appliances and Arrangements",
      category: "lifesaving",
      description: "Life-saving equipment, procedures, and emergency response requirements",
      lastAmended: "January 2024",
      keyProvisions: [
        "Life-saving appliances and equipment",
        "Emergency procedures and drills",
        "Survival craft requirements",
        "Emergency communications equipment"
      ],
      applicability: ["All SOLAS ships", "Crew and passengers", "Emergency situations"],
      amendments2024: [
        "Updated life-saving appliance standards",
        "Enhanced emergency procedure requirements",
        "New survival craft specifications"
      ],
      regulations: []
    },
    {
      id: "chapter5",
      chapter: "Chapter IV",
      title: "Radiocommunications",
      category: "radio",
      description: "GMDSS requirements, radio equipment, and communication procedures",
      lastAmended: "January 2024",
      keyProvisions: [
        "GMDSS equipment and installations",
        "Radio communication procedures",
        "Distress and safety communications",
        "Radio operator requirements"
      ],
      applicability: ["All SOLAS ships", "Different sea areas A1-A4", "Radio operators"],
      amendments2024: [
        "Updated GMDSS equipment requirements",
        "Enhanced communication procedures",
        "New radio operator certification standards"
      ],
      regulations: []
    },
    {
      id: "chapter6",
      chapter: "Chapter V",
      title: "Safety of Navigation",
      category: "safety",
      description: "Navigation safety requirements, equipment, and procedures",
      lastAmended: "January 2024",
      keyProvisions: [
        "Navigation equipment and systems",
        "Safety of navigation procedures",
        "Bridge team management",
        "Voyage planning and execution"
      ],
      applicability: ["All SOLAS ships", "Bridge teams", "Navigation officers"],
      amendments2024: [
        "Updated navigation equipment standards",
        "Enhanced bridge team management requirements",
        "New voyage planning procedures"
      ],
      regulations: []
    },
    {
      id: "chapter7",
      chapter: "Chapter VI",
      title: "Carriage of Cargoes and Oil Fuels",
      category: "cargo",
      description: "Cargo handling, stowage, and securing requirements",
      lastAmended: "January 2024",
      keyProvisions: [
        "Cargo stowage and securing",
        "Grain stability requirements",
        "Dangerous goods handling",
        "Oil fuel safety requirements"
      ],
      applicability: ["Cargo ships", "Bulk carriers", "Container ships"],
      amendments2024: [
        "Updated cargo securing requirements",
        "Enhanced grain stability standards",
        "New dangerous goods handling procedures"
      ],
      regulations: []
    },
    {
      id: "chapter8",
      chapter: "Chapter VIII",
      title: "Nuclear Ships",
      category: "nuclear",
      description: "Additional safety requirements for nuclear-powered ships",
      lastAmended: "January 2024",
      keyProvisions: [
        "Nuclear reactor safety systems",
        "Radiation protection measures",
        "Emergency response procedures",
        "Nuclear fuel handling requirements"
      ],
      applicability: ["Nuclear-powered ships", "Specialized crews", "Nuclear authorities"],
      amendments2024: [
        "Enhanced nuclear safety standards",
        "Updated radiation protection requirements",
        "New emergency response procedures"
      ],
      regulations: []
    }
  ];

  const filteredChapters = solasChapters.filter(chapter => {
    const matchesSearch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         chapter.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || chapter.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'construction': return <Ship className="h-5 w-5 text-green-600" />;
      case 'fire': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'lifesaving': return <Shield className="h-5 w-5 text-orange-600" />;
      case 'radio': return <AlertTriangle className="h-5 w-5 text-purple-600" />;
      case 'safety': return <Ship className="h-5 w-5 text-indigo-600" />;
      case 'cargo': return <FileText className="h-5 w-5 text-yellow-600" />;
      case 'nuclear': return <AlertTriangle className="h-5 w-5 text-gray-600" />;
      default: return <FileText className="h-5 w-5 text-slate-600" />;
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
      case 'nuclear': return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('SOLAS 2020 Edition', 20, 30);
      
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
      
      doc.save('SOLAS_2020_Edition.pdf');
      
      toast({
        title: "PDF Generated",
        description: "SOLAS 2020 regulations have been exported to PDF successfully.",
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
                <h1 className="text-2xl font-bold">SOLAS 2020 Edition</h1>
                <p className="text-muted-foreground">International Convention for the Safety of Life at Sea</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chapters">SOLAS 2020</TabsTrigger>
            <TabsTrigger value="amendments">2024 Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-4">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Ship className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      SOLAS 2020 Edition
                    </CardTitle>
                    <CardDescription>
                      International Convention for the Safety of Life at Sea - 2020 Edition
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => window.open('https://share.google/c37tG0ULCekKFUn07', '_blank')}
                      className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                    >
                      <Download className="h-4 w-4" />
                      Download SOLAS 2020 PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-card/80 rounded-lg border border-border">
                    <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      SOLAS 2020 Resources
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open('https://share.google/c37tG0ULCekKFUn07', '_blank')}
                        className="justify-start text-blue-700 border-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        SOLAS 2020 Edition (Google Drive)
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
                    </div>
                  </div>
                  
                  <div className="text-sm text-blue-800 bg-blue-100/50 p-3 rounded">
                    <p className="font-medium mb-1">📋 Available SOLAS 2020 Resources:</p>
                    <p>• SOLAS 2020 Edition (Google Drive)</p>
                    <p>• Latest amendments and updates</p>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Regulations;