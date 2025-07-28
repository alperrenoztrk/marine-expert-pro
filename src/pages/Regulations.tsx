import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Shield, ArrowLeft, Ship, Navigation, AlertTriangle, Eye, Compass, Clock, Anchor, Radio, Search, BookOpen, Map, Zap, Users, Lightbulb, Camera, Sun, Moon, Cloud, Droplets } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface COLREGRule {
  id: string;
  rule: string;
  title: string;
  category: 'general' | 'lights' | 'sounds' | 'conduct' | 'special';
  description: string;
  detailedText: string;
  visualAid?: string;
  examples: string[];
  relatedRules: string[];
  applicability: string[];
  penalties: string;
  modernInterpretation: string;
}

interface NavigationScenario {
  id: string;
  title: string;
  description: string;
  vesselA: {
    type: string;
    bearing: number;
    speed: number;
    course: number;
  };
  vesselB: {
    type: string;
    bearing: number;
    speed: number;
    course: number;
  };
  situation: string;
  applicableRules: string[];
  action: string;
  explanation: string;
}

const Regulations = () => {
  const { toast } = useToast();
  const [selectedRule, setSelectedRule] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [scenarioFilter, setScenarioFilter] = useState<string>("all");

  const colregRules: COLREGRule[] = [
    {
      id: "rule2",
      rule: "Rule 2",
      title: "Responsibility",
      category: "general",
      description: "Nothing in these Rules shall exonerate any vessel from the consequences of any neglect to comply with these Rules",
      detailedText: "This rule establishes that compliance with COLREG does not excuse poor seamanship or failure to take proper precautions. Masters must use good seamanship and consider all circumstances, including limitations of involved vessels. The rule emphasizes that COLREG is the minimum standard, not the maximum requirement for safe navigation.",
      examples: [
        "A power vessel following rules but not reducing speed in fog when radar shows risk of collision",
        "Vessel maintaining course per rules but ignoring VHF communication about dangerous situation",
        "Ship following crossing rules but not considering other vessel's maneuverability constraints"
      ],
      relatedRules: ["Rule 5", "Rule 6", "Rule 7", "Rule 8"],
      applicability: ["All vessels", "All visibility conditions", "All waters"],
      penalties: "Civil and criminal liability for collision damages, potential license suspension",
      modernInterpretation: "Includes electronic navigation aids, AIS data interpretation, and cyber-security considerations in modern context"
    },
    {
      id: "rule5",
      rule: "Rule 5",
      title: "Look-out",
      category: "general",
      description: "Every vessel shall at all times maintain a proper look-out by sight and hearing as well as by all available means",
      detailedText: "A proper lookout must be maintained by all available means including visual, auditory, radar, AIS, and electronic aids. This includes posting qualified personnel, using all available technology, and ensuring continuous monitoring. The lookout must be able to make full assessment of collision risk and detect any change in the situation.",
      examples: [
        "Bridge team using radar, AIS, ECDIS, and visual lookout simultaneously",
        "Single-handed sailing vessel using electronic aids when below deck",
        "Commercial vessel posting additional lookouts in restricted visibility"
      ],
      relatedRules: ["Rule 7", "Rule 19", "Rule 34", "Rule 35"],
      applicability: ["All vessels", "All times", "All visibility conditions"],
      penalties: "Primary cause in collision investigations, heavy civil penalties",
      modernInterpretation: "Includes cyber awareness, AIS spoofing detection, and integration of AI-assisted navigation systems"
    },
    {
      id: "rule6",
      rule: "Rule 6",
      title: "Safe Speed",
      category: "general",
      description: "Every vessel shall at all times proceed at a safe speed",
      detailedText: "Safe speed must allow the vessel to take proper and effective action to avoid collision and be stopped within appropriate distance. Factors include visibility, traffic density, maneuverability, sea state, wind, depth of water, proximity of navigational hazards, radar limitations, and background interference.",
      examples: [
        "Reducing speed to bare steerageway in dense fog",
        "Adjusting speed in traffic separation schemes",
        "Considering stopping distance in shallow water"
      ],
      relatedRules: ["Rule 5", "Rule 7", "Rule 8", "Rule 19"],
      applicability: ["All vessels", "All conditions", "Special emphasis in restricted visibility"],
      penalties: "Major factor in collision liability, potential criminal charges",
      modernInterpretation: "Considers autonomous vessel operations, dynamic positioning systems, and predictive collision avoidance"
    },
    {
      id: "rule7",
      rule: "Rule 7",
      title: "Risk of Collision",
      category: "general",
      description: "Every vessel shall use all available means to determine if risk of collision exists",
      detailedText: "Risk assessment must use compass bearings, radar plotting, AIS data, and visual observations. Progressive bearing analysis, CPA (Closest Point of Approach), and TCPA (Time to CPA) calculations are essential. Small changes in bearing with decreasing range indicate collision risk. Assumptions should not be made based on scanty information.",
      examples: [
        "Plotting radar contacts to determine if bearing is changing",
        "Using AIS data to verify visual observations",
        "Taking compass bearings of approaching vessels"
      ],
      relatedRules: ["Rule 5", "Rule 6", "Rule 8", "Rule 15-17"],
      applicability: ["All vessels", "All visibility conditions", "Primary importance in open sea"],
      penalties: "Critical element in collision investigations",
      modernInterpretation: "Integration with AI collision prediction algorithms, machine learning risk assessment, and quantum radar technology"
    },
    {
      id: "rule8",
      rule: "Rule 8",
      title: "Action to Avoid Collision",
      category: "conduct",
      description: "Any action taken to avoid collision shall be positive, made in ample time and with due regard to good seamanship",
      detailedText: "Actions must be large enough to be readily apparent to the other vessel, taken early enough to be effective, and made with proper seamanship. Avoid succession of small alterations. If space permits, alteration of course alone may be more effective than alteration of speed. Actions should result in passing at safe distance.",
      examples: [
        "Making substantial course alteration early rather than small changes",
        "Reducing speed significantly when course alteration is insufficient",
        "Using engines rather than rudder alone for emergency maneuvers"
      ],
      relatedRules: ["Rule 5", "Rule 6", "Rule 7", "Rule 17"],
      applicability: ["All vessels taking avoiding action", "All visibility conditions"],
      penalties: "Inadequate action can result in shared liability",
      modernInterpretation: "Includes dynamic positioning responses, automated collision avoidance systems, and coordinated fleet maneuvering"
    },
    {
      id: "rule12",
      rule: "Rule 12",
      title: "Sailing Vessels",
      category: "conduct",
      description: "When two sailing vessels are approaching so as to involve risk of collision, rules for sailing vessels apply",
      detailedText: "When on different tacks, vessel on port tack keeps clear. When on same tack, windward vessel keeps clear. When vessel on port tack cannot determine other vessel's tack, she shall keep clear. These rules apply when both vessels are under sail alone - any vessel using mechanical propulsion is deemed a power vessel.",
      examples: [
        "Port tack yacht gives way to starboard tack vessel",
        "Windward sailing vessel alters course when both on starboard tack",
        "Racing sailboat using engine becomes power vessel under COLREG"
      ],
      relatedRules: ["Rule 18", "Rule 25", "Rule 36"],
      applicability: ["Sailing vessels only", "When using wind power alone"],
      penalties: "Sailing vessel collisions often result in total loss claims",
      modernInterpretation: "Applies to modern wind-assisted commercial vessels and autonomous sailing craft"
    },
    {
      id: "rule13",
      rule: "Rule 13",
      title: "Overtaking",
      category: "conduct",
      description: "Any vessel overtaking another shall keep clear of the vessel being overtaken",
      detailedText: "Overtaking vessel must keep clear until finally past and clear. A vessel is overtaking when approaching from direction more than 22.5° abaft the beam. When in doubt, assume you are overtaking. The overtaking vessel remains the give-way vessel even if the overtaken vessel changes course during the maneuver.",
      examples: [
        "Fast container ship overtaking slower bulk carrier",
        "Yacht overtaking commercial fishing vessel",
        "High-speed craft passing conventional vessel in channel"
      ],
      relatedRules: ["Rule 8", "Rule 15", "Rule 18"],
      applicability: ["All vessels in overtaking situation", "All visibility conditions"],
      penalties: "Overtaking vessel typically bears primary responsibility for collisions",
      modernInterpretation: "Relevant for autonomous vessel programming and high-speed craft operations"
    },
    {
      id: "rule15",
      rule: "Rule 15",
      title: "Crossing Situation",
      category: "conduct",
      description: "When two power-driven vessels are crossing, the vessel on the starboard side has right of way",
      detailedText: "When two power vessels cross so that risk of collision exists, the vessel having the other on her starboard side must give way. The stand-on vessel should maintain course and speed but may take action if the give-way vessel does not take appropriate action. This is often called the 'starboard hand rule'.",
      examples: [
        "Port side vessel alters course when vessels cross at 90 degrees",
        "Vessel seeing green light of another vessel gives way",
        "Stand-on vessel eventually takes action when give-way vessel fails to act"
      ],
      relatedRules: ["Rule 16", "Rule 17", "Rule 8"],
      applicability: ["Power-driven vessels", "Crossing situations", "Good visibility"],
      penalties: "Clear liability determination in most crossing collisions",
      modernInterpretation: "Programming basis for autonomous collision avoidance systems"
    },
    {
      id: "rule17",
      rule: "Rule 17",
      title: "Action by Stand-on Vessel",
      category: "conduct",
      description: "The stand-on vessel shall maintain course and speed, but may take action when the other vessel is not taking appropriate action",
      detailedText: "Stand-on vessel maintains course and speed but must take action when it becomes apparent the give-way vessel is not taking sufficient action. When taking action, avoid turning to port for vessels forward of the beam. The stand-on vessel may indicate intentions by sound signals but should act decisively when necessary.",
      examples: [
        "Stand-on vessel sounds danger signal when give-way vessel doesn't alter",
        "Emergency action by stand-on vessel when collision becomes imminent",
        "Stand-on vessel maintaining course until last responsible moment"
      ],
      relatedRules: ["Rule 15", "Rule 16", "Rule 34"],
      applicability: ["Stand-on vessels", "When give-way vessel fails to act"],
      penalties: "Failure to take timely action can result in shared liability",
      modernInterpretation: "Critical for autonomous vessel decision-making algorithms"
    },
    {
      id: "rule19",
      rule: "Rule 19",
      title: "Conduct in Restricted Visibility",
      category: "special",
      description: "Special rules apply when vessels are in sight of one another in restricted visibility",
      detailedText: "Every vessel must proceed at safe speed and be ready to take immediate action to avoid collision. Vessels must navigate with extreme caution and may need to stop engines and cease all way. Sound signals must be made according to Part D. Regular and systematic use of radar is essential for detecting approaching vessels.",
      examples: [
        "Ship proceeding at slow speed in dense fog using radar",
        "Vessel stopping engines when detecting close contact on radar",
        "Regular fog signals being made while navigating in poor visibility"
      ],
      relatedRules: ["Rule 5", "Rule 6", "Rule 35", "Rule 36"],
      applicability: ["All vessels", "Restricted visibility conditions", "Fog, snow, storms"],
      penalties: "Enhanced penalties for collisions in restricted visibility",
      modernInterpretation: "Enhanced by thermal imaging, AI-assisted navigation, and 5G communication systems"
    },
    {
      id: "rule20",
      rule: "Rule 20",
      title: "Application of Lights",
      category: "lights",
      description: "Rules concerning lights shall be complied with from sunset to sunrise and in restricted visibility",
      detailedText: "Navigation lights must be displayed from sunset to sunrise and during restricted visibility during daylight hours. No other lights that could be mistaken for prescribed lights should be displayed. Lights must be of correct color, intensity, and arc of visibility as specified in Annex I.",
      examples: [
        "Commercial vessel displaying masthead, side lights, and stern light at night",
        "Sailing vessel showing red/green side lights and white stern light",
        "Vessel at anchor displaying appropriate anchor lights"
      ],
      relatedRules: ["Rule 21-31", "Annex I"],
      applicability: ["All vessels", "Night time", "Restricted visibility"],
      penalties: "Improper lighting is primary evidence in collision investigations",
      modernInterpretation: "LED technology improvements, smart lighting systems, and energy efficiency considerations"
    },
    {
      id: "rule23",
      rule: "Rule 23",
      title: "Power-driven Vessels Underway",
      category: "lights",
      description: "Power vessel shall exhibit masthead light forward, second masthead light aft (if over 50m), sidelights, and stern light",
      detailedText: "Masthead light must be placed over fore and aft centerline showing unbroken light over 225° arc. Vessels 50m+ must show two masthead lights with after light higher than forward light. Side lights show unbroken light over 112.5° arc from dead ahead to 22.5° abaft beam. Stern light shows 135° arc centered on stern.",
      examples: [
        "Large container ship with two white masthead lights, red/green side lights, white stern light",
        "Small motor yacht under 50m with single masthead light and navigation lights",
        "Pilot vessel displaying pilot lights in addition to normal navigation lights"
      ],
      relatedRules: ["Rule 20", "Rule 21", "Annex I"],
      applicability: ["Power-driven vessels underway", "All sizes", "Night and restricted visibility"],
      penalties: "Incorrect light display can determine collision liability",
      modernInterpretation: "Smart LED systems, automatic light switching, and integration with vessel monitoring systems"
    },
    {
      id: "rule25",
      rule: "Rule 25",
      title: "Sailing Vessels and Vessels Under Oars",
      category: "lights",
      description: "Sailing vessel underway shall exhibit sidelights and a stern light",
      detailedText: "Sailing vessel may carry side lights and stern light in separate lanterns or combined in one lantern at masthead. Vessels under 20m may display these lights in one lantern at masthead. Vessels under oars may display lights or have electric torch ready for use. Sailing vessels may also display red over green lights at masthead for additional visibility.",
      examples: [
        "Yacht with red/green side lights and white stern light",
        "Racing sailboat with masthead tricolor light",
        "Small dinghy with hand-held flashlight for emergency signaling"
      ],
      relatedRules: ["Rule 12", "Rule 18", "Annex I"],
      applicability: ["Sailing vessels under sail alone", "Vessels under oars"],
      penalties: "Sailing vessel accidents often involve recreational craft with inadequate lighting",
      modernInterpretation: "Solar-powered LED systems, GPS-integrated lighting, and smart sailing technologies"
    }
  ];

  const navigationScenarios: NavigationScenario[] = [
    {
      id: "crossing1",
      title: "Basic Crossing Situation",
      description: "Two power vessels approaching each other at right angles in clear weather",
              vesselA: { type: "Container Ship", bearing: 90, speed: 18, course: 0 },
      vesselB: { type: "Bulk Carrier", bearing: 0, speed: 12, course: 270 },
      situation: "Clear day, good visibility, open ocean",
      applicableRules: ["Rule 15", "Rule 16", "Rule 17"],
      action: "Bulk Carrier (give-way vessel) must alter course and/or speed to pass astern of Container Ship",
      explanation: "Container Ship has Bulk Carrier on her starboard side, making Container Ship the stand-on vessel. Bulk Carrier must take early and substantial action to avoid collision."
    },
    {
      id: "overtaking1",
      title: "Overtaking in Channel",
      description: "Fast ferry overtaking cargo vessel in narrow channel",
              vesselA: { type: "High Speed Ferry", bearing: 30, speed: 35, course: 45 },
        vesselB: { type: "General Cargo", bearing: 0, speed: 14, course: 45 },
      situation: "Narrow channel, moderate traffic",
      applicableRules: ["Rule 13", "Rule 9", "Rule 34"],
      action: "Ferry must keep clear of cargo vessel throughout overtaking maneuver and may need to signal intentions",
      explanation: "Ferry is overtaking from more than 22.5° abaft beam. Channel rules also apply requiring sound signals for overtaking in narrow waters."
    },
    {
      id: "fog1",
      title: "Radar Contact in Fog",
      description: "Two vessels approaching each other in dense fog using radar",
      vesselA: { type: "Tanker", bearing: 45, speed: 8, course: 180 },
              vesselB: { type: "Container Ship", bearing: 225, speed: 6, course: 0 },
      situation: "Dense fog, visibility less than 0.5 nm",
      applicableRules: ["Rule 19", "Rule 6", "Rule 35"],
      action: "Both vessels reduce speed, use radar plotting, make fog signals, and be prepared to stop",
      explanation: "Normal crossing rules don't apply in fog. Both vessels must navigate with extreme caution and use all available means to avoid collision."
    },
    {
      id: "fishing1",
      title: "Fishing Vessel Encounter",
      description: "Commercial vessel encountering fishing vessels engaged in fishing",
              vesselA: { type: "Cargo Ship", bearing: 0, speed: 16, course: 90 },
        vesselB: { type: "Fishing Vessel", bearing: 90, speed: 3, course: 45 },
      situation: "Fishing vessel with nets deployed, displaying fishing signals",
      applicableRules: ["Rule 18", "Rule 26", "Rule 27"],
      action: "Cargo ship must keep clear of fishing vessel and avoid fishing gear",
      explanation: "Vessel engaged in fishing has priority over power vessel not engaged in fishing. Cargo ship must take avoiding action early."
    }
  ];

  const handleDownloadCOLREG = () => {
    toast({
      title: "COLREG İndiriliyor",
      description: "US Coast Guard resmi Navigation Rules dokümantasyonu",
    });

    const downloadUrl = 'https://www.navcen.uscg.gov/sites/default/files/pdf/navRules/navrules.pdf';
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'COLREG_Navigation_Rules_2024.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadSOLAS = () => {
    toast({
      title: "SOLAS İndiriliyor",
      description: "Safety of Life at Sea Convention dokümantasyonu",
    });
    // IMO SOLAS link would go here
  };

  const handleDownloadMARPOL = () => {
    toast({
      title: "MARPOL İndiriliyor", 
      description: "Marine Pollution Convention dokümantasyonu",
    });
    // IMO MARPOL link would go here
  };

  const filteredRules = colregRules.filter(rule => {
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.rule.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || rule.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredScenarios = navigationScenarios.filter(scenario => {
    return scenarioFilter === "all" || scenario.id.includes(scenarioFilter);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gelişmiş Maritime Regülasyonları
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Kapsamlı COLREG analizi, interaktif kurallar ve navigasyon senaryoları
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="colreg" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="colreg">COLREG Kuralları</TabsTrigger>
            <TabsTrigger value="scenarios">Navigasyon Senaryoları</TabsTrigger>
            <TabsTrigger value="lights">Işık Sistemleri</TabsTrigger>
            <TabsTrigger value="sounds">Ses Sinyalleri</TabsTrigger>
            <TabsTrigger value="downloads">Resmi Dokümantasyon</TabsTrigger>
          </TabsList>

          <TabsContent value="colreg" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  COLREG Kural Arama ve Filtreleme
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Kural Ara</Label>
                    <Input
                      id="search"
                      placeholder="Kural numarası, başlık veya açıklama..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Kategori</Label>
                    <Select value={activeCategory} onValueChange={setActiveCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Kategori seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tüm Kategoriler</SelectItem>
                        <SelectItem value="general">Genel Kurallar</SelectItem>
                        <SelectItem value="lights">Işık Kuralları</SelectItem>
                        <SelectItem value="sounds">Ses Sinyalleri</SelectItem>
                        <SelectItem value="conduct">Seyr Kuralları</SelectItem>
                        <SelectItem value="special">Özel Durumlar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* COLREG Rules Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Rules List */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">COLREG Kuralları ({filteredRules.length})</h3>
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredRules.map((rule) => (
                    <Card key={rule.id} className={`cursor-pointer transition-all ${selectedRule === rule.id ? 'ring-2 ring-blue-500 border-blue-300' : 'hover:shadow-md'}`}
                          onClick={() => setSelectedRule(rule.id)}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rule.rule}: {rule.title}</CardTitle>
                          <Badge variant={
                            rule.category === 'general' ? 'default' :
                            rule.category === 'lights' ? 'secondary' :
                            rule.category === 'sounds' ? 'outline' :
                            rule.category === 'conduct' ? 'destructive' : 'secondary'
                          }>
                            {rule.category === 'general' ? 'Genel' :
                             rule.category === 'lights' ? 'Işık' :
                             rule.category === 'sounds' ? 'Ses' :
                             rule.category === 'conduct' ? 'Seyr' : 'Özel'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{rule.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Rule Details */}
              <div className="space-y-4">
                {selectedRule ? (
                  (() => {
                    const rule = colregRules.find(r => r.id === selectedRule);
                    if (!rule) return null;
                    
                    return (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            {rule.rule}: {rule.title}
                          </CardTitle>
                          <CardDescription>{rule.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Detailed Text */}
                          <div>
                            <h4 className="font-semibold mb-2">Detaylı Açıklama</h4>
                            <p className="text-sm leading-relaxed">{rule.detailedText}</p>
                          </div>

                          {/* Examples */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Örnekler
                            </h4>
                            <ul className="space-y-1">
                              {rule.examples.map((example, index) => (
                                <li key={index} className="text-sm flex items-start gap-2">
                                  <span className="text-blue-500 mt-1">•</span>
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Applicability */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Ship className="h-4 w-4" />
                              Uygulanabilirlik
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {rule.applicability.map((app, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {app}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Related Rules */}
                          <div>
                            <h4 className="font-semibold mb-2">İlgili Kurallar</h4>
                            <div className="flex flex-wrap gap-2">
                              {rule.relatedRules.map((relatedRule, index) => (
                                <Button 
                                  key={index}
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const related = colregRules.find(r => r.rule === relatedRule);
                                    if (related) setSelectedRule(related.id);
                                  }}
                                >
                                  {relatedRule}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Modern Interpretation */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <Zap className="h-4 w-4" />
                              Modern Yorumlama
                            </h4>
                            <p className="text-sm text-blue-700 bg-blue-50 p-3 rounded">{rule.modernInterpretation}</p>
                          </div>

                          {/* Penalties */}
                          <div>
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Hukuki Sonuçlar
                            </h4>
                            <p className="text-sm text-red-700 bg-red-50 p-3 rounded">{rule.penalties}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })()
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Detayları görmek için sol taraftan bir kural seçin</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            {/* Scenario Filter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  Navigasyon Senaryoları
                </CardTitle>
                <CardDescription>
                  Gerçek navigasyon durumları ve COLREG uygulamaları
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="scenario-filter">Senaryo Tipi</Label>
                  <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Senaryo tipi seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Senaryolar</SelectItem>
                      <SelectItem value="crossing">Çarpışma Kursu</SelectItem>
                      <SelectItem value="overtaking">Sollama</SelectItem>
                      <SelectItem value="fog">Sınırlı Görüş</SelectItem>
                      <SelectItem value="fishing">Balıkçı Gemileri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Scenarios Display */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScenarios.map((scenario) => (
                <Card key={scenario.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="h-5 w-5" />
                      {scenario.title}
                    </CardTitle>
                    <CardDescription>{scenario.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Vessel Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Gemi A</h4>
                        <div className="text-xs space-y-1">
                          <p><strong>Tip:</strong> {scenario.vesselA.type}</p>
                          <p><strong>Kerteriz:</strong> {scenario.vesselA.bearing}°</p>
                          <p><strong>Hız:</strong> {scenario.vesselA.speed} knot</p>
                          <p><strong>Rota:</strong> {scenario.vesselA.course}°</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold text-sm">Gemi B</h4>
                        <div className="text-xs space-y-1">
                          <p><strong>Tip:</strong> {scenario.vesselB.type}</p>
                          <p><strong>Kerteriz:</strong> {scenario.vesselB.bearing}°</p>
                          <p><strong>Hız:</strong> {scenario.vesselB.speed} knot</p>
                          <p><strong>Rota:</strong> {scenario.vesselB.course}°</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Situation */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Durum</h4>
                      <p className="text-sm text-gray-600">{scenario.situation}</p>
                    </div>

                    {/* Applicable Rules */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Uygulanacak Kurallar</h4>
                      <div className="flex flex-wrap gap-1">
                        {scenario.applicableRules.map((rule, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {rule}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Required */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Gerekli Eylem</h4>
                      <p className="text-sm bg-green-50 text-green-800 p-2 rounded">{scenario.action}</p>
                    </div>

                    {/* Explanation */}
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Açıklama</h4>
                      <p className="text-sm text-gray-600">{scenario.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  COLREG Işık Sistemleri
                </CardTitle>
                <CardDescription>
                  Gemi türlerine göre navigation ışıkları ve görünürlük kuralları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Power Vessel Lights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Ship className="h-5 w-5" />
                    Motorlu Gemi Işıkları
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">50m Altı Motorlu Gemiler</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Tek direk feneri (225° yay)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm">İskele yan feneri (112.5° yay)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm">Sancak yan feneri (112.5° yay)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Kıç feneri (135° yay)</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">50m Üstü Motorlu Gemiler</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Ön direk feneri (225° yay)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Arka direk feneri (225° yay) - daha yüksek</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm">İskele yan feneri (112.5° yay)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm">Sancak yan feneri (112.5° yay)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Kıç feneri (135° yay)</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Sailing Vessel Lights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Yelkenli Gemi Işıkları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Ayrı Fenerler</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm">İskele yan feneri</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm">Sancak yan feneri</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Kıç feneri</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Kombine Fener</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-gradient-to-r from-red-500 via-white to-green-500 rounded"></div>
                          <span className="text-sm">Üç renkli fener (direk başında)</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          20m altı yelkenliler için uygundur
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Opsiyonel Fenerler</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm">Kırmızı fener (üstte)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded"></div>
                          <span className="text-sm">Yeşil fener (altta)</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Ek görünürlük için direk başında
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Special Vessel Lights */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Özel Durum Işıkları</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Balıkçı Gemileri</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded"></div>
                          <span className="text-sm">Kırmızı fener (üstte)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Beyaz fener (altta)</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Balık avlama faaliyeti göstergesi
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Demirlemiş Gemiler</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Ön demir feneri</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                          <span className="text-sm">Arka demir feneri (100m+ gemiler)</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Demir bölgesi aydınlatması dahil
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sounds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Radio className="h-5 w-5" />
                  COLREG Ses Sinyalleri
                </CardTitle>
                <CardDescription>
                  Maneuvering ve warning sinyalleri, fog sinyalleri ve distress çağrıları
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Maneuvering Signals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Manevra Sinyalleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Navigation className="h-4 w-4" />
                          Rota Değişiklik Sinyalleri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">• (Kısa)</Badge>
                          <span className="text-sm">Sancağa dönüyorum</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">• • (2 Kısa)</Badge>
                          <span className="text-sm">İskeleye dönüyorum</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">• • • (3 Kısa)</Badge>
                          <span className="text-sm">Makine geri çalışıyor</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Uyarı Sinyalleri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="destructive">— — — — — (5 Uzun)</Badge>
                          <span className="text-sm">Tehlike sinyali</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">? (Morse)</Badge>
                          <span className="text-sm">Niyet anlaşılmadı</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Fog Signals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    Sis Sinyalleri
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Motorlu Gemi (Yolda)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">— (Uzun)</Badge>
                          <span className="text-sm">En fazla 2 dk aralıkla</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Motorlu Gemi (Durdurulmuş)</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">— — (2 Uzun)</Badge>
                          <span className="text-sm">En fazla 2 dk aralıkla</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Yelkenli/Balıkçı</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">— • • (Uzun-Kısa-Kısa)</Badge>
                          <span className="text-sm">En fazla 2 dk aralıkla</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Overtaking Signals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Sollama Sinyalleri (Dar Kanallar)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Sollama Talepleri</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">— — • • (2 Uzun-2 Kısa)</Badge>
                          <span className="text-sm">Sancaktan sollama talebi</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">— — • (2 Uzun-1 Kısa)</Badge>
                          <span className="text-sm">İskeleden sollama talebi</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Sollama Cevapları</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="default">• • • • (4 Kısa)</Badge>
                          <span className="text-sm">Sollama kabul edildi</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="destructive">— — — — — (5 Kısa)</Badge>
                          <span className="text-sm">Sollama reddedildi</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Pilot and Anchor Signals */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Özel Durum Sinyalleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Pilot Sinyalleri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">G (Morse)</Badge>
                          <span className="text-sm">Pilot talep ediyorum</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">H (Morse)</Badge>
                          <span className="text-sm">Pilot gemide</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Anchor className="h-4 w-4" />
                          Demir Sinyalleri
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Bell (Zil)</Badge>
                          <span className="text-sm">5 saniye hızlı çalma</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          100m+ gemiler ek gong sinyali
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Zaman Aralıkları
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm space-y-1">
                          <p><strong>Kısa sinyal:</strong> 1 saniye</p>
                          <p><strong>Uzun sinyal:</strong> 4-6 saniye</p>
                          <p><strong>Sis sinyali:</strong> Max 2 dk aralık</p>
                          <p><strong>Demir zili:</strong> 1 dk aralık</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            {/* Official Documentation Downloads */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* COLREG */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Ship className="h-8 w-8" />
                    <CardTitle className="text-xl">COLREG 1972</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-center space-y-4">
                                     <div className="space-y-2">
                     <p className="text-gray-800 font-semibold">
                       Navigation Rules (International-Inland)
                     </p>
                     <p className="text-gray-600 text-sm">
                       US Coast Guard Resmi Navigation Rules - COLREG 1972 + Inland Rules
                     </p>
                     <Badge variant="secondary" className="text-xs">
                       Latest Edition: 2024
                     </Badge>
                   </div>
                  <Button 
                    onClick={handleDownloadCOLREG}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    COLREG İndir
                  </Button>
                                     <p className="text-xs text-gray-500">
                     PDF | ~3.2MB | English | US Coast Guard Official
                   </p>
                </CardContent>
              </Card>

              {/* SOLAS */}
              <Card className="bg-white/80 backdrop-blur-sm border-orange-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-t-lg text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="h-8 w-8" />
                    <CardTitle className="text-xl">SOLAS 1974</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-gray-800 font-semibold">
                      Safety of Life at Sea
                    </p>
                    <p className="text-gray-600 text-sm">
                      Denizde Can Güvenliği Sözleşmesi - Konsolidasyonlu Versiyon
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Latest Amendment: 2024
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleDownloadSOLAS}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    SOLAS İndir
                  </Button>
                  <p className="text-xs text-gray-500">
                    PDF | ~8.5MB | English
                  </p>
                </CardContent>
              </Card>

              {/* MARPOL */}
              <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Droplets className="h-8 w-8" />
                    <CardTitle className="text-xl">MARPOL 73/78</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-gray-800 font-semibold">
                      Marine Pollution Prevention
                    </p>
                    <p className="text-gray-600 text-sm">
                      Deniz Kirliliğini Önleme Sözleşmesi - Tüm Ekler
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Latest Amendment: 2024
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleDownloadMARPOL}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    MARPOL İndir
                  </Button>
                  <p className="text-xs text-gray-500">
                    PDF | ~12.3MB | English
                  </p>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Additional Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Ek Kaynaklar ve Referanslar
                </CardTitle>
                <CardDescription>
                  Maritime regülasyonlarla ilgili ek dokümantasyon ve referans materyalleri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">IMO Resmi Kaynakları</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• IMO Model Courses for Maritime Training</li>
                      <li>• Bridge Resource Management Guidelines</li>
                      <li>• Electronic Chart Display Systems (ECDIS)</li>
                      <li>• Automatic Identification Systems (AIS)</li>
                      <li>• Global Maritime Distress Safety System</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Ulusal Regülasyonlar</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• TC Ulaştırma ve Altyapı Bakanlığı Talimatları</li>
                      <li>• Türk Loydu Teknik Kuralları</li>
                      <li>• Liman ve Kıyı Güvenlik Regülasyonları</li>
                      <li>• Çevre ve Şehircilik Bakanlığı Direktifleri</li>
                      <li>• Denizcilik İstatistikleri ve Raporları</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Update Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Güncelleme Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <p><strong>Son Güncelleme:</strong> 1 Ocak 2024</p>
                  <p><strong>Sonraki Revizyon:</strong> Temmuz 2024 (IMO MEPC 82)</p>
                  <p><strong>Önemli Değişiklikler:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>MARPOL Annex VI - Carbon Intensity Indicator (CII) güncellemeleri</li>
                    <li>SOLAS Chapter V - E-Navigation sistemleri entegrasyonu</li>
                    <li>COLREG Rule 5 - Autonomous vessel considerations</li>
                    <li>ISM Code - Cyber risk management gereksinimleri</li>
                  </ul>
                  <p className="text-blue-600">
                    <strong>Not:</strong> Bu platform sürekli güncellenmekte olup, en son IMO düzenlemelerini takip etmektedir.
                  </p>
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