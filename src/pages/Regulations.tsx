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
  Ship, 
  Shield, 
  FileText, 
  Download, 
  Search, 
  AlertTriangle,
  Globe,
  Compass,
  Map,
  Landmark,
  Radio,
  Radar,
  Waves
} from 'lucide-react';
import jsPDF from 'jspdf';
import { solas2024Chapters } from '@/data/solas2024';
import { Capacitor } from '@capacitor/core';

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
  const [activeTab, setActiveTab] = useState<string>("chapters");

  const openExternal = async (url: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url });
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.location.href = url;
    }
  };

  const openAsset = async (path: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        window.location.href = path;
      } else {
        window.open(path, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(path, '_blank');
    }
  };

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
              case 'general': return 'bg-blue-100 text-blue-800 cyberpunk:bg-gray-800 cyberpunk:text-yellow-400';
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

  // Tide calculation component
  const TideCalculationCard = () => {
    const [tideTableInputs, setTideTableInputs] = useState({
      lowTide: "1.2",
      highTide: "4.5", 
      lowTideTime: "06:00"
    });
    const [tideTable, setTideTable] = useState<any[]>([]);

    const generateTideTable = () => {
      try {
        const lowTide = parseFloat(tideTableInputs.lowTide);
        const highTide = parseFloat(tideTableInputs.highTide);
        const tidalRange = highTide - lowTide;
        const [hours, minutes] = tideTableInputs.lowTideTime.split(':').map(Number);
        
        const table: any[] = [];
        const ruleOfTwelfths = [0, 1/12, 3/12, 6/12, 9/12, 11/12, 12/12];
        
        // Generate 12 hours of tide data
        for (let i = 0; i < 12; i++) {
          const time = new Date();
          time.setHours(hours + i, minutes, 0, 0);
          const timeStr = time.toTimeString().slice(0, 5);
          
          // Determine cycle position (0-6 hours in each half cycle)
          const cycleHour = i % 6;
          const isRising = Math.floor(i / 6) % 2 === 0;
          
          let height: number;
          let status: string;
          
          if (isRising) {
            // Rising tide (low to high)
            height = lowTide + (tidalRange * ruleOfTwelfths[cycleHour]);
            status = cycleHour === 0 ? 'Alçak Su' : cycleHour === 6 ? 'Yüksek Su' : 'Yükseliyor';
          } else {
            // Falling tide (high to low)
            height = highTide - (tidalRange * ruleOfTwelfths[cycleHour]);
            status = cycleHour === 0 ? 'Yüksek Su' : cycleHour === 6 ? 'Alçak Su' : 'Alçalıyor';
          }
          
          const prevHeight = i > 0 ? table[i-1].height : height;
          const change = height - prevHeight;
          
          table.push({
            time: timeStr,
            height: height,
            change: change,
            status: status
          });
        }
        
        setTideTable(table);
      } catch (error) {
        console.error("Tide table generation error:", error);
      }
    };

    return (
      <Card className="border-cyan-200 bg-cyan-50 dark:bg-cyan-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5 text-cyan-600" />
            Gelgit Tablosu ve Hesaplamaları
          </CardTitle>
          <CardDescription>Rule of Twelfths kullanarak gelgit tablosu oluşturun</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="tide-low">Alçak Su (m)</Label>
                <Input
                  id="tide-low"
                  type="number"
                  placeholder="1.2"
                  value={tideTableInputs.lowTide}
                  onChange={(e) => setTideTableInputs({...tideTableInputs, lowTide: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="tide-high">Yüksek Su (m)</Label>
                <Input
                  id="tide-high"
                  type="number"
                  placeholder="4.5"
                  value={tideTableInputs.highTide}
                  onChange={(e) => setTideTableInputs({...tideTableInputs, highTide: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="tide-time">Alçak Su Zamanı</Label>
                <Input
                  id="tide-time"
                  type="time"
                  value={tideTableInputs.lowTideTime}
                  onChange={(e) => setTideTableInputs({...tideTableInputs, lowTideTime: e.target.value})}
                />
              </div>
            </div>
            
            <Button onClick={generateTideTable} className="w-full">
              <Waves className="h-4 w-4 mr-2" />
              Gelgit Tablosu Oluştur
            </Button>

            {tideTable.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-3">12 Saatlik Gelgit Tablosu (Rule of Twelfths)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs border border-muted">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-left p-2 border-r">Saat</th>
                        <th className="text-left p-2 border-r">Yükseklik (m)</th>
                        <th className="text-left p-2 border-r">Değişim (m)</th>
                        <th className="text-left p-2">Durumu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tideTable.map((row, index) => (
                        <tr key={index} className="border-b hover:bg-muted/30">
                          <td className="p-2 border-r font-mono">{row.time}</td>
                          <td className="p-2 border-r font-mono">{row.height.toFixed(2)}</td>
                          <td className="p-2 border-r font-mono">
                            {row.change > 0 ? '+' : ''}{row.change.toFixed(2)}
                          </td>
                          <td className="p-2">
                            <Badge variant={
                              row.status === 'Yükseliyor' ? 'default' : 
                              row.status === 'Alçalıyor' ? 'secondary' :
                              row.status === 'Yüksek Su' ? 'destructive' : 'outline'
                            }>
                              {row.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  <p><strong>Rule of Twelfths:</strong> Gelgit döngüsündeki her saatte oluşan değişim miktarı (1/12, 2/12, 3/12, 3/12, 2/12, 1/12)</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Ship className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">
                  {activeTab === "chapters" && "SOLAS 2024 Consolidated Edition (Özet)"}
                  {activeTab === "uscg" && "Navigation Rules (COLREG/US Inland)"}
                  {activeTab === "amendments" && "SOLAS 2024 Updates"}
                  {activeTab === "navrules" && "Seyir Kuralları"}
                </h1>
                <p className="text-muted-foreground">
                  {activeTab === "chapters" && "International Convention for the Safety of Life at Sea"}
                  {activeTab === "uscg" && "COLREG (International) ve US Inland Navigation Rules kaynakları"}
                  {activeTab === "amendments" && "Latest SOLAS Amendments and Updates"}
                  {activeTab === "navrules" && "Navigasyonla ilgili uluslararası, teknik ve yerel düzenlemeler"}
                </p>
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

        <Tabs defaultValue="chapters" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto p-1">
            <TabsTrigger value="chapters" className="data-[state=active]:bg-background data-[state=active]:text-foreground">SOLAS 2020</TabsTrigger>
            <TabsTrigger value="uscg" className="data-[state=active]:bg-background data-[state=active]:text-foreground">COLREG</TabsTrigger>
            <TabsTrigger value="amendments" className="data-[state=active]:bg-background data-[state=active]:text-foreground">2024 Updates</TabsTrigger>
            <TabsTrigger value="navrules" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Seyir Kuralları</TabsTrigger>
            <TabsTrigger value="marpol" className="data-[state=active]:bg-background data-[state=active]:text-foreground">MARPOL 2023</TabsTrigger>
          </TabsList>

          <TabsContent value="chapters" className="space-y-4">


            <div className="grid gap-4">
              {(filteredChapters.length ? filteredChapters : solas2024Chapters).map((chapter: any) => (
                <Card key={chapter.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(chapter.category)}
                          <CardTitle className="text-lg">{chapter.chapter}: {chapter.title}</CardTitle>
                          {chapter.category && (
                            <Badge className={getCategoryColor(chapter.category)}>
                              {chapter.category}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{chapter.description || chapter.overview}</CardDescription>
                        {chapter.lastAmended && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Son Güncelleme: {chapter.lastAmended}</span>
                            <span>•</span>
                            <span>{chapter.regulations.length} Düzenleme</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Temel Hükümler:</h4>
                        <ul className="space-y-1">
                          {(chapter.keyProvisions || []).map((provision: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                              <span className="text-primary">•</span>
                              {provision}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {chapter.amendments2024 && chapter.amendments2024.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-orange-500" />
                            2024 Güncellemeleri:
                          </h4>
                          <ul className="space-y-1">
                            {chapter.amendments2024.map((amendment: string, index: number) => (
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
                          {(chapter.applicability || []).map((scope: string, index: number) => (
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

          <TabsContent value="uscg" className="space-y-4">
            <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200 dark:border-red-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                      Navigation Rules
                    </CardTitle>
                    <CardDescription>
                      International Regulations for Preventing Collisions at Sea
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => openAsset('/USCG-Navigation-Rules.pdf')}
                      className="flex items-center gap-2 bg-red-600 text-white hover:bg-red-700"
                    >
                      <Download className="h-4 w-4" />
                      Open COLREG PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-card/80 rounded-lg border border-border">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      COLREG Resources
                    </h4>
                    <div className="grid gap-3 md:grid-cols-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAsset('/USCG-Navigation-Rules.pdf')}
                        className="justify-start text-red-700 border-red-300 hover:bg-red-50 dark:hover:bg-gray-700"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        COLREG Navigation Rules (PDF)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openExternal('https://www.navcen.uscg.gov/')}
                        className="justify-start text-red-700 border-red-300 hover:bg-red-50 dark:hover:bg-gray-700"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        USCG Navigation Center
                      </Button>
                    </div>
                  </div>
                  
                    <div className="text-sm text-red-800 bg-red-100/50 p-3 rounded">
                    <p className="font-medium mb-1">📋 Navigation Rules Kaynakları:</p>
                    <p>• COLREG (International) – Lights, shapes, sound, steering rules</p>
                    <p>• US Inland Navigation Rules – ABD iç sularına özel hükümler</p>
                    <p>• USCG Navigation Center – güncel bültenler ve kılavuzlar</p>
                    <p className="mt-2 text-xs">Not: En güncel metin ve değişiklikler için USCG Navigation Center'a bakınız.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-lg">Part A: General</CardTitle>
                        <Badge className="bg-red-100 text-red-800">General</Badge>
                      </div>
                      <CardDescription>Application, responsibility, and general definitions</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Son Güncelleme: 2024</span>
                        <span>•</span>
                        <span>3 Düzenleme</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Temel Hükümler:</h4>
                      <ul className="space-y-1">
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Application to all vessels on US waters
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Responsibility for compliance with regulations
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          General definitions and terms
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Uygulama Alanı:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">US waters</Badge>
                        <Badge variant="outline" className="text-xs">Navigation</Badge>
                        <Badge variant="outline" className="text-xs">All vessels</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-lg">Part B: Steering and Sailing Rules</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Navigation</Badge>
                      </div>
                      <CardDescription>Rules for vessel conduct in any condition of visibility</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Son Güncelleme: 2024</span>
                        <span>•</span>
                        <span>15 Düzenleme</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Temel Hükümler:</h4>
                      <ul className="space-y-1">
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Conduct of vessels in any condition of visibility
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Conduct of vessels in sight of one another
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Conduct of vessels in restricted visibility
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Uygulama Alanı:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">All vessels</Badge>
                        <Badge variant="outline" className="text-xs">Navigation</Badge>
                        <Badge variant="outline" className="text-xs">Collision avoidance</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-lg">Part C: Lights and Shapes</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Lights</Badge>
                      </div>
                      <CardDescription>Requirements for lights and shapes to be exhibited by vessels</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Son Güncelleme: 2024</span>
                        <span>•</span>
                        <span>12 Düzenleme</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Temel Hükümler:</h4>
                      <ul className="space-y-1">
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Lights to be exhibited by vessels
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Shapes to be exhibited by vessels
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Technical details of lights and shapes
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Uygulama Alanı:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">All vessels</Badge>
                        <Badge variant="outline" className="text-xs">Night navigation</Badge>
                        <Badge variant="outline" className="text-xs">Visibility</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        <CardTitle className="text-lg">Part D: Sound and Light Signals</CardTitle>
                        <Badge className="bg-red-100 text-red-800">Signals</Badge>
                      </div>
                      <CardDescription>Sound and light signals for vessels in sight of one another</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Son Güncelleme: 2024</span>
                        <span>•</span>
                        <span>8 Düzenleme</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Temel Hükümler:</h4>
                      <ul className="space-y-1">
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Sound signals for vessels in sight of one another
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Sound signals in restricted visibility
                        </li>
                        <li className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          Light signals for vessels in sight of one another
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Uygulama Alanı:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-xs">All vessels</Badge>
                        <Badge variant="outline" className="text-xs">Communication</Badge>
                        <Badge variant="outline" className="text-xs">Signaling</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

          <TabsContent value="navrules" className="space-y-6">
            {/* Uluslararası Regülasyonlar */}
            <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  Uluslararası Regülasyonlar
                </CardTitle>
                <CardDescription>IMO tarafından belirlenen ve tüm gemiler için bağlayıcı ana düzenlemeler</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-600" />
                        COLREGs (1972) – Denizde Çatışmayı Önleme
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <p>IMO düzenlemesi. Seyir fenerleri, işaretler ve manevra kuralları (karşılaşma, kavşak, yetişme, dar kanal, sisli hava vb.).</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Tüm gemiler için geçerlidir</li>
                        <li>Işıklar ve işaretler, görünürlük kısıtlı koşullarda ses işaretleri</li>
                        <li>Çatışmayı önleme manevraları ve geçiş hakları</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Compass className="h-4 w-4 text-indigo-600" />
                        SOLAS (1974) – Bölüm V: Seyir Emniyeti
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <p>Köprüüstü teçhizatı ve operasyonel gereklilikler için asgari standartları belirler.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Zorunlu teçhizat: Radar, AIS, ECDIS, VHF, pusula</li>
                        <li>Seyir planlama zorunluluğu</li>
                        <li>Seyir defteri (logbook) tutulması</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        STCW (1978)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <p>Zabitan ve gemi adamlarının eğitim, belgelendirme ve vardiya yeterliliklerini düzenler.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Köprüüstü vardiya düzeni, BRM (Bridge Resource Management)</li>
                        <li>Radar/ECDIS kullanım yeterliliği</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        MARPOL (1973/78)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <p>Deniz kirliliğini önleme hükümleri. Seyir güzergâhı üzerindeki özel alanlarda (Special Areas) deşarj yasakları.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Özel alanlardan geçişte sıkı kısıtlamalar</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        ISM Code (Uluslararası Güvenlik Yönetimi)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <p>Gemi işletmesinin emniyetli prosedürleri uygulamasını zorunlu kılar.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Operasyonel risk yönetimi ve sürekli iyileştirme</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Radio className="h-4 w-4 text-purple-600" />
                        AIS ve VTS (SOLAS kapsamı)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-muted-foreground">
                      <p>Gemilerin sürekli konum, rota ve hız bilgisi paylaşması; liman/VTS otoriteleri ile iletişim.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>AIS yayını ve VTS talimatlarına uyum</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Seyir Yardımcıları ve Teknik Regülasyonlar */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radar className="h-5 w-5 text-blue-600" />
                  Seyir Yardımcıları ve Teknik Regülasyonlar
                </CardTitle>
                <CardDescription>Teçhizat zorunlulukları gemi tipi/boyuna göre değişir; IMO/SOLAS standartları geçerlidir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Map className="h-4 w-4 text-indigo-600" />
                        ECDIS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                      <p>Elektronik harita sistemi. Kağıt haritaların yerini alabilir (zorunluluk gemi tipine/boyuna göre).</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Radio className="h-4 w-4 text-purple-600" />
                        GMDSS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                      <p>Küresel denizcilik tehlike ve emniyet haberleşme sistemi; denizde güvenlik için iletişim ekipmanları.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Radar className="h-4 w-4 text-blue-600" />
                        Radar, ARPA, GNSS, Gyro & Manyetik Pusula
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                      <p>IMO ve SOLAS standartlarına göre sertifikalı olmalıdır; performans ve kalibrasyon gereklilikleri.</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Bölgesel ve Ulusal Kurallar */}
            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-yellow-700" />
                  Bölgesel ve Ulusal Kurallar
                </CardTitle>
                <CardDescription>IMO onaylı TSS'ler ve yerel idare düzenlemeleri</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Compass className="h-4 w-4 text-yellow-700" />
                        TSS (Traffic Separation Schemes)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-1">
                      <p>IMO onaylı trafik ayırım düzenleri; boğaz, kanal ve dar sularda uygulanır.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Landmark className="h-4 w-4 text-yellow-700" />
                        Yerel Denizcilik İdareleri
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                      <p>Örn. Türkiye: Ulaştırma ve Altyapı Bakanlığı, Kıyı Emniyeti, Sahil Güvenlik.</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Liman yönetmelikleri</li>
                        <li>Kılavuz kaptan alma zorunlulukları</li>
                        <li>Boğazlar Tüzüğü (İstanbul ve Çanakkale Boğazları)</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Gelgit Tablosu ve Hesaplamaları */}
            <TideCalculationCard />
          </TabsContent>

          <TabsContent value="marpol" className="space-y-6">
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
              <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-blue-600" />
                    MARPOL Consolidated Edition 2023
                  </CardTitle>
                  <CardDescription>
                    Deniz kirliliğinin önlenmesine yönelik en güncel konsolide (2023) sürümün özet PDF'i ve resmi kaynak bağlantıları.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => openAsset('/MARPOL-Consolidated-2023-Overview.pdf')}
                    className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    <Download className="h-4 w-4" />
                    Özet PDF'i Aç
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openExternal('https://www.imo.org/en/publications/pages/home.aspx')}
                    className="flex items-center gap-2"
                  >
                    <Globe className="h-4 w-4" />
                    Resmi IMO Yayını
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Öne Çıkan Başlıklar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm text-muted-foreground">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Ek I–VI için 2023 konsolide değişiklik notları</li>
                        <li>Özel alanlar, OWS/15 ppm ve ORB kayıt gereklilikleri</li>
                        <li>Yakıt numunesi, EEOI/CII ve SEEMP notları</li>
                      </ul>
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        Not: Özet PDF, 2023 konsolide MARPOL hükümlerinin saha kullanımına yönelik kısa bir referanstır; resmi metin için IMO yayınına başvurulmalıdır.
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Ekler</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {["Ek I - Petrol", "Ek II - Zararlı Döküntüler", "Ek III - Paketli Maddeler", "Ek IV - Pis Su", "Ek V - Çöp", "Ek VI - Hava Kirliliği"].map((item) => (
                        <Badge key={item} variant="secondary" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </CardContent>
                  </Card>
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