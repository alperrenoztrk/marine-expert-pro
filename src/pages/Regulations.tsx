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
  imageUrl?: string;
  imageDescription?: string;
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
      id: "rule1",
      rule: "Rule 1",
      title: "Application",
      category: "general",
      description: "These Rules shall apply to all vessels upon the high seas and in all waters connected therewith navigable by seagoing vessels",
      detailedText: "COLREG applies to all vessels on high seas and connected waters navigable by seagoing vessels. Special rules may be made by appropriate authorities for specific areas but must conform as closely as possible to these Rules. Traffic separation schemes may be adopted by the Organization.",
      examples: [
        "Commercial vessel transiting international waters",
        "Yacht sailing from territorial waters to high seas",
        "Special rules in port approaches that modify but don't contradict COLREG"
      ],
      relatedRules: ["Rule 10", "Rule 38"],
      applicability: ["All vessels", "High seas", "Connected navigable waters"],
      penalties: "Violation of Rule 1 can void insurance coverage and create liability",
      modernInterpretation: "Applies to autonomous vessels, drones, and modern high-speed craft; includes cyber-navigation systems"
    },
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
      id: "rule3",
      rule: "Rule 3",
      title: "General Definitions",
      category: "general",
      description: "Definitions of vessel, power-driven vessel, sailing vessel, fishing vessel, and other key terms",
      detailedText: "Provides essential definitions including vessel (every description of watercraft), power-driven vessel (propelled by machinery), sailing vessel (under sail with machinery not being used), vessel engaged in fishing (with gear restricting maneuverability), vessel not under command, vessel restricted in ability to maneuver, and vessel constrained by draft.",
      examples: [
        "Sailing yacht using engine becomes power-driven vessel",
        "Fishing trawler with nets deployed is vessel engaged in fishing",
        "Ship with engine failure becomes vessel not under command"
      ],
      relatedRules: ["All Rules"],
      applicability: ["All vessels", "Fundamental definitions"],
      penalties: "Misclassification can affect right-of-way and collision liability",
      modernInterpretation: "Includes WIG craft, high-speed craft, autonomous vessels, and modern propulsion systems"
    },
    {
      id: "rule4",
      rule: "Rule 4",
      title: "Application (Section I)",
      category: "general",
      description: "Rules in Section I apply in any condition of visibility",
      detailedText: "Section I rules (Rules 4-10) apply regardless of visibility conditions. These are fundamental navigation rules that must be followed whether in clear weather, fog, or any restricted visibility condition.",
      examples: [
        "Lookout requirements apply day and night, clear or foggy",
        "Safe speed rules apply in all weather conditions",
        "Traffic separation scheme rules apply regardless of visibility"
      ],
      relatedRules: ["Rule 5", "Rule 6", "Rule 7", "Rule 8", "Rule 9", "Rule 10"],
      applicability: ["All vessels", "Any condition of visibility"],
      penalties: "Violation of basic navigation principles",
      modernInterpretation: "Encompasses all modern navigation aids and autonomous navigation systems"
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
      imageUrl: "https://www.hughes38.com/wp-content/uploads/2016/02/COLREGS-Summary-and-Action-Chart.pdf",
      imageDescription: "COLREG overtaking diagram showing 22.5° abaft beam sector and stern light visibility zone",
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
      id: "rule23b",
      rule: "Rule 23(b)",
      title: "Air-cushion Vessels (Hovercraft)",
      category: "lights",
      description: "Special additional lights for air-cushion vessels operating in non-displacement mode",
      detailedText: "Air-cushion vessel when operating in non-displacement mode shows all-round flashing yellow light in addition to normal power vessel lights. When in displacement mode, shows only normal power vessel lights.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/hovercraft-ahead-new-3x.png",
      imageDescription: "Hovercraft showing flashing yellow light in addition to normal navigation lights",
      examples: [
        "Passenger hovercraft with flashing yellow light",
        "Military hovercraft showing yellow beacon",
        "Commercial air-cushion vehicle with additional yellow light"
      ],
      relatedRules: ["Rule 23", "Annex I"],
      applicability: ["Air-cushion vessels", "Non-displacement mode operation"],
      penalties: "Failure to show proper lights can affect collision avoidance",
      modernInterpretation: "LED flashing systems, integrated hovercraft lighting, GPS mode detection"
    },
        {
      id: "rule25",
      rule: "Rule 25",
      title: "Sailing Vessels and Vessels Under Oars",
      category: "lights",
      description: "Sailing vessel underway shall exhibit sidelights and a stern light",
      detailedText: "Sailing vessel may carry side lights and stern light in separate lanterns or combined in one lantern at masthead. Vessels under 20m may display these lights in one lantern at masthead. Vessels under oars may display lights or have electric torch ready for use. Sailing vessels may also display red over green lights at masthead for additional visibility.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/sailingboat1-ahead-new-3x.png",
      imageDescription: "Sailing vessel navigation lights showing red/green sidelights and white stern light configuration",
      examples: [
        "Yacht with red/green side lights and white stern light",
        "Racing sailboat with masthead tricolor light",
        "Small dinghy with hand-held flashlight for emergency signaling"
      ],
      relatedRules: ["Rule 12", "Rule 18", "Annex I"],
      applicability: ["Sailing vessels under sail alone", "Vessels under oars"],
      penalties: "Sailing vessel accidents often involve recreational craft with inadequate lighting",
      modernInterpretation: "Solar-powered LED systems, GPS-integrated lighting, and smart sailing technologies"
    },
          {
      id: "rule23",
      rule: "Rule 23",
      title: "Power-driven Vessels Underway",
      category: "lights",
      description: "Power-driven vessel shall exhibit masthead light, sidelights, and stern light",
      detailedText: "Masthead light must be placed over fore and aft centerline showing unbroken light over 225° arc. Vessels 50m+ must show two masthead lights with after light higher than forward light. Side lights show unbroken light over 112.5° arc from dead ahead to 22.5° abaft beam. Stern light shows 135° arc centered on stern.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/power-driven-vessel-ahead-new-3x.png",
      imageDescription: "Power-driven vessel navigation lights showing masthead light forward, red/green sidelights, and white stern light configuration",
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
      id: "rule9",
      rule: "Rule 9",
      title: "Narrow Channels",
      category: "conduct",
      description: "A vessel proceeding along a narrow channel shall keep as near to the starboard side as is safe and practicable",
      detailedText: "Vessels must keep to starboard side of narrow channels. Vessels under 20m or sailing vessels shall not impede larger vessels. Fishing vessels shall not impede passage. Overtaking signals are required in narrow channels. Vessels should avoid anchoring in channels.",
      examples: [
        "Container ship keeping to starboard in Suez Canal",
        "Yacht giving way to commercial traffic in channel",
        "Overtaking vessel using sound signals before passing"
      ],
      relatedRules: ["Rule 13", "Rule 34", "Rule 8"],
      applicability: ["All vessels", "Narrow channels and fairways"],
      penalties: "Channel violations can result in major collision liability",
      modernInterpretation: "Includes VTS coordination, electronic chart integration, and AIS-based traffic management"
    },
    {
      id: "rule10",
      rule: "Rule 10",
      title: "Traffic Separation Schemes",
      category: "conduct",
      description: "Rules for behavior in traffic separation schemes adopted by the Organization",
      detailedText: "Vessels must proceed in appropriate traffic lanes in general direction of flow. Avoid crossing separation lines except at terminations. Cross traffic lanes at right angles when necessary. Inshore zones are for specific purposes only. Small vessels and fishing vessels have restrictions.",
      examples: [
        "Ship following Dover Strait TSS eastbound lane",
        "Vessel crossing TSS at right angles to minimize exposure time",
        "Fishing vessel operating in separation zone during emergency"
      ],
      relatedRules: ["Rule 1", "Rule 18", "Rule 8"],
      applicability: ["All vessels", "IMO adopted traffic separation schemes"],
      penalties: "TSS violations are monitored by VTS and can result in prosecution",
      modernInterpretation: "Enhanced by AIS mandatory reporting, satellite monitoring, and real-time traffic management"
    },
    {
      id: "rule11",
      rule: "Rule 11",
      title: "Application (Section II)",
      category: "conduct",
      description: "Rules in Section II apply to vessels in sight of one another",
      detailedText: "Section II contains the classic 'rules of the road' for vessels that can see each other visually. These rules determine right-of-way between different types of vessels and in different encounter situations.",
      examples: [
        "Two ships meeting head-on in clear weather",
        "Sailing yacht and motor vessel crossing paths",
        "Commercial vessel overtaking another in good visibility"
      ],
      relatedRules: ["Rule 12", "Rule 13", "Rule 14", "Rule 15", "Rule 16", "Rule 17", "Rule 18"],
      applicability: ["Vessels in sight of each other", "Good visibility conditions"],
      penalties: "Right-of-way violations are primary cause of collision liability",
      modernInterpretation: "Enhanced by AIS target identification and electronic bearing taking"
    },
    {
      id: "rule14",
      rule: "Rule 14",
      title: "Head-on Situation",
      category: "conduct",
      description: "When two power-driven vessels are meeting head-on, each shall alter course to starboard",
      detailedText: "Both vessels must alter course to starboard to pass port-to-port. Situation exists when vessels see each other ahead with masthead lights in line and both sidelights visible. When in doubt, assume head-on situation exists.",
      imageUrl: "https://www.hughes38.com/wp-content/uploads/2016/02/COLREGS-Summary-and-Action-Chart.pdf",
      imageDescription: "COLREG head-on situation diagram showing both vessels altering course to starboard",
      examples: [
        "Two container ships meeting in mid-ocean altering to starboard",
        "Ferry and cargo ship meeting in channel both going to starboard",
        "Uncertain situation treated as head-on for safety"
      ],
      relatedRules: ["Rule 8", "Rule 34"],
      applicability: ["Power-driven vessels", "Meeting head-on or nearly so"],
      penalties: "Head-on collision often results in shared liability if rules not followed",
      modernInterpretation: "Enhanced by GPS course prediction and collision avoidance systems"
    },
    {
      id: "rule15",
      rule: "Rule 15",
      title: "Crossing Situation", 
      category: "conduct",
      description: "When two power-driven vessels are crossing, the vessel having the other on her starboard side shall give way",
      detailedText: "When two power vessels cross so that risk of collision exists, the vessel having the other on her starboard side must give way. The stand-on vessel should maintain course and speed but may take action if the give-way vessel does not take appropriate action. This is often called the 'starboard hand rule'.",
      imageUrl: "https://www.unitedmarine.net/blog/wp-content/uploads/vessels-passing21.jpg",
      imageDescription: "Diagram showing crossing situation where vessel with another on starboard side gives way",
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
      id: "rule16",
      rule: "Rule 16",
      title: "Action by Give-way Vessel",
      category: "conduct",
      description: "Every vessel directed to keep out of the way shall take early and substantial action to keep well clear",
      detailedText: "Give-way vessel must take positive, early action that is readily apparent to the other vessel. Action should be large enough to be clearly seen and result in passing at a safe distance.",
      examples: [
        "Port vessel in crossing situation making substantial course alteration",
        "Overtaking vessel reducing speed and altering course early",
        "Power vessel giving way to sailing vessel with obvious maneuver"
      ],
      relatedRules: ["Rule 8", "Rule 15", "Rule 17"],
      applicability: ["Give-way vessels", "All encounter situations"],
      penalties: "Inadequate give-way action can result in collision liability",
      modernInterpretation: "Automated collision avoidance systems must demonstrate clear avoiding action"
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
      id: "rule18",
      rule: "Rule 18",
      title: "Responsibilities Between Vessels",
      category: "conduct",
      description: "Hierarchy of responsibilities between different types of vessels",
      detailedText: "Power vessels give way to sailing vessels, fishing vessels, restricted vessels, and not under command vessels. Sailing vessels give way to fishing vessels and restricted vessels. Fishing vessels give way to not under command and restricted vessels. Seaplanes generally keep clear of all vessels.",
      examples: [
        "Motor yacht giving way to sailing vessel",
        "Cargo ship avoiding fishing trawler with nets out",
        "All vessels keeping clear of vessel not under command"
      ],
      relatedRules: ["Rule 26", "Rule 27", "Rule 3"],
      applicability: ["All vessels", "Determines right-of-way hierarchy"],
      penalties: "Failure to respect vessel hierarchy major factor in collision liability",
      modernInterpretation: "Includes autonomous vessels, high-speed craft, and modern vessel classifications"
    },
    {
      id: "rule19",
      rule: "Rule 19", 
      title: "Conduct of Vessels in Restricted Visibility",
      category: "special",
      description: "Special rules apply when vessels are not in sight of one another in restricted visibility",
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
      description: "Rules concerning lights apply from sunset to sunrise and in restricted visibility",
      detailedText: "Navigation lights must be displayed from sunset to sunrise. In restricted visibility, lights may be displayed during daylight. No other lights should interfere with prescribed lights or impair lookout. Lights must comply with Annex I specifications.",
      examples: [
        "Commercial vessel displaying proper lights at night",
        "Ship showing lights in fog during daytime",
        "Avoiding deck lights that interfere with navigation lights"
      ],
      relatedRules: ["Rule 21", "Rule 22", "Annex I"],
      applicability: ["All vessels", "Night time and restricted visibility"],
      penalties: "Improper lighting primary evidence in collision investigations",
      modernInterpretation: "LED technology, smart lighting systems, and automated light control"
    },
    {
      id: "rule21",
      rule: "Rule 21",
      title: "Definitions of Lights",
      category: "lights",
      description: "Definitions of masthead light, sidelights, stern light, towing light, all-round light, and flashing light",
      detailedText: "Masthead light shows 225° arc ahead. Sidelights show 112.5° arcs (green starboard, red port). Stern light shows 135° arc astern. Towing light is yellow with stern light characteristics. All-round light shows 360°. Flashing light flashes 120+ times per minute.",
      examples: [
        "Masthead light covering forward 225° sector",
        "Port and starboard sidelights with proper color and arc",
        "Towing light distinguishing towing vessels"
      ],
      relatedRules: ["Rule 23", "Rule 24", "Rule 25", "Annex I"],
      applicability: ["All vessels", "Light specifications"],
      penalties: "Wrong light configuration can determine collision fault",
      modernInterpretation: "Precise LED light specifications and photometric requirements"
    },
    {
      id: "rule22",
      rule: "Rule 22",
      title: "Visibility of Lights",
      category: "lights",
      description: "Minimum visibility ranges for navigation lights based on vessel size",
      detailedText: "Lights must be visible at specified minimum ranges: large vessels (50m+) require longer ranges, smaller vessels have reduced requirements. Visibility ranges ensure lights can be seen at safe distances for collision avoidance.",
      examples: [
        "Large container ship masthead light visible 6 miles",
        "Small yacht sidelight visible 1 mile",
        "Medium vessel towing light visible 2 miles"
      ],
      relatedRules: ["Rule 21", "Annex I"],
      applicability: ["All vessels", "Light intensity requirements"],
      penalties: "Insufficient light range contributes to collision risk",
      modernInterpretation: "LED efficiency allows longer ranges, smart lighting adjusts to conditions"
    },
    {
      id: "rule24",
      rule: "Rule 24",
      title: "Towing and Pushing",
      category: "lights",
      description: "Special lights for vessels engaged in towing and pushing operations",
      detailedText: "Towing vessels show two or three masthead lights vertically (three if tow exceeds 200m), plus towing light. Vessels being towed show sidelights and stern light. Pushing vessels show two masthead lights. Composite units treated as single power vessel.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/tugboat-50-200-ahead-new2-3x.png",
      imageDescription: "Towing vessel showing three vertical masthead lights and yellow towing light for tow exceeding 200m",
      examples: [
        "Tug with three masthead lights towing long barge train",
        "Push boat with two masthead lights and barge unit",
        "Vessel being towed showing required lights and day shapes"
      ],
      relatedRules: ["Rule 23", "Rule 27", "Annex I"],
      applicability: ["Towing and pushing vessels", "Vessels being towed"],
      penalties: "Towing accidents often involve improper light display",
      modernInterpretation: "LED light arrays, integrated towing systems, and smart barge lighting"
    },
    {
      id: "rule26",
      rule: "Rule 26",
      title: "Fishing Vessels",
      category: "lights",
      description: "Special lights and shapes for vessels engaged in fishing",
      detailedText: "Trawling vessels show green over white lights and two cones apex together. Other fishing shows red over white lights and two cones apex together. Additional white light indicates direction of outlying gear over 150m. When making way, also show normal navigation lights.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/trawling-ahead-new-3x.png",
      imageDescription: "Fishing vessel engaged in trawling showing green over white lights and proper day shapes",
      examples: [
        "Trawler with green over white lights and cone shapes",
        "Longliner with red over white lights and gear direction indicator",
        "Fishing vessel also showing sidelights and stern light when moving"
      ],
      relatedRules: ["Rule 18", "Rule 3", "Annex II"],
      applicability: ["Vessels engaged in fishing", "Trawling and other fishing methods"],
      penalties: "Fishing vessel lights critical for avoiding gear and determining rights",
      modernInterpretation: "LED fishing lights, GPS-tracked fishing gear, and electronic fishing notifications"
    },
    {
      id: "rule27",
      rule: "Rule 27",
      title: "Vessels Not Under Command or Restricted in Ability to Maneuver",
      category: "lights",
      description: "Special lights for vessels unable to maneuver normally",
      detailedText: "Not under command vessels show two red lights and two balls vertically. Restricted in ability to maneuver show red-white-red lights and ball-diamond-ball shapes. Specific signals for dredging, diving, mineclearance operations.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/vessel-no-command-ahead-new-3x.png",
      imageDescription: "Vessel not under command showing two red all-round lights vertically aligned",
      examples: [
        "Ship with engine failure showing two red lights",
        "Dredger with restricted maneuverability lights and obstruction indicators",
        "Cable layer showing restricted lights while laying cable"
      ],
      relatedRules: ["Rule 18", "Rule 3", "Annex I"],
      applicability: ["Vessels not under command", "Vessels restricted in maneuverability"],
      penalties: "Failure to display proper signals removes right-of-way protection",
      modernInterpretation: "Electronic failure notifications, satellite emergency beacons, and automated distress signals"
    },
    {
      id: "rule27f",
      rule: "Rule 27(f)",
      title: "Mine Clearance Vessels",
      category: "lights",
      description: "Special lights for vessels engaged in mine clearance operations",
      detailedText: "Vessels engaged in mine clearance show three green all-round lights in triangular formation - one at foremast and one at each end of the foreyard. Other vessels must stay at least 1000m clear. Shows normal power vessel or anchor lights as appropriate.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/minesweeper-ahead-new2-3x.png",
      imageDescription: "Mine clearance vessel showing three green lights in triangular formation with day shapes",
      examples: [
        "Naval minesweeper with three green lights in triangle formation",
        "Mine clearance vessel with warning zone of 1000m minimum",
        "Commercial mine clearance showing green lights and normal navigation lights"
      ],
      relatedRules: ["Rule 18", "Rule 27", "Annex I"],
      applicability: ["Vessels engaged in mine clearance", "All other vessels must keep clear"],
      penalties: "Severe penalties for violating 1000m exclusion zone",
      modernInterpretation: "GPS-monitored exclusion zones, electronic warning systems, satellite tracking"
    },
    {
      id: "rule28",
      rule: "Rule 28",
      title: "Vessels Constrained by Their Draft",
      category: "lights",
      description: "Special lights for deep-draft vessels with limited maneuverability",
      detailedText: "Vessels constrained by draft may show three red lights vertically or cylinder shape in addition to normal power vessel lights. Indicates vessel cannot easily deviate from course due to depth limitations.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/power-driven-vessel-constrained-ahead-new-3x.png",
      imageDescription: "Vessel constrained by draft showing three red lights vertically and cylinder day shape",
      examples: [
        "VLCC in shallow channel showing three red lights",
        "Bulk carrier with deep draft showing cylinder day shape",
        "Loaded tanker indicating draft constraints to other traffic"
      ],
      relatedRules: ["Rule 18", "Rule 23"],
      applicability: ["Deep-draft vessels", "Vessels limited by depth"],
      penalties: "Other vessels must avoid impeding passage of draft-constrained vessels",
      modernInterpretation: "Electronic draft monitoring, real-time under-keel clearance systems"
    },
    {
      id: "rule29",
      rule: "Rule 29",
      title: "Pilot Vessels",
      category: "lights",
      description: "Special lights for vessels engaged in pilotage duty",
      detailedText: "Pilot vessels show white over red lights at masthead when on pilotage duty, plus normal navigation lights when underway and anchor lights when at anchor. When not on pilotage duty, show normal lights for vessel of their size.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/pilot-boat-ahead-new-3x.png",
      imageDescription: "Pilot vessel showing white over red lights plus navigation lights when on duty",
      examples: [
        "Pilot boat with white over red lights approaching ship",
        "Pilot vessel at anchor showing pilot lights plus anchor light",
        "Off-duty pilot vessel showing normal pleasure craft lights"
      ],
      relatedRules: ["Rule 23", "Rule 30"],
      applicability: ["Vessels engaged in pilotage duty"],
      penalties: "Pilot vessels have special status but must follow general rules when not on duty",
      modernInterpretation: "Electronic pilot scheduling, GPS pilot transfer monitoring, digital pilot identification"
    },
    {
      id: "rule30",
      rule: "Rule 30",
      title: "Anchored Vessels and Vessels Aground",
      category: "lights",
      description: "Lights and shapes for anchored and grounded vessels",
      detailedText: "Anchored vessels show white light forward and lower white light aft. Vessels under 50m may show single white light. Large vessels must illuminate decks. Aground vessels show anchor lights plus two red lights and three balls vertically.",
      imageUrl: "https://www.sailingissues.com/navcourse10images/anchored-100-ahead-new-3x.png",
      imageDescription: "Anchored vessel showing required white anchor lights fore and aft",
      examples: [
        "Cargo ship at anchor with forward and aft white lights",
        "Small yacht with single white anchor light",
        "Grounded vessel showing red lights warning of danger"
      ],
      relatedRules: ["Rule 35", "Annex I"],
      applicability: ["Anchored vessels", "Vessels aground"],
      penalties: "Improper anchor lights major cause of anchor area collisions",
      modernInterpretation: "LED anchor lights, GPS anchor watch, electronic anchor position broadcasting"
    },
    {
      id: "rule31",
      rule: "Rule 31",
      title: "Seaplanes",
      category: "lights",
      description: "Light requirements for seaplanes on water",
      detailedText: "Seaplanes should exhibit lights similar to those prescribed for vessels as closely as possible when characteristics and position allow. Practical considerations of aircraft design may require modifications.",
      imageUrl: "https://opanalytics.ca/courses/mod/page/view.php?id=12",
      imageDescription: "Seaplane navigation lights configuration showing aircraft adapted for water operations",
      examples: [
        "Seaplane showing aircraft navigation lights adapted for water operations",
        "Amphibious aircraft with maritime-style position lights",
        "Floatplane displaying closest practical equivalent to vessel lights"
      ],
      relatedRules: ["Rule 18", "Annex I"],
      applicability: ["Seaplanes operating on water"],
      penalties: "Seaplanes must integrate safely with marine traffic",
      modernInterpretation: "Modern amphibious aircraft, drone operations on water, hybrid air-sea vehicles"
    },
    {
      id: "rule32",
      rule: "Rule 32",
      title: "Definitions of Sound Signals",
      category: "sounds",
      description: "Definitions of whistle, short blast, and prolonged blast",
      detailedText: "Whistle means any sound signaling appliance meeting specifications. Short blast is about one second duration. Prolonged blast is four to six seconds duration. Sound signals must meet specific frequency and audibility requirements.",
      examples: [
        "Ship's whistle giving one short blast for starboard turn",
        "Vessel sounding prolonged blast in fog every two minutes",
        "Emergency sound signal of five short blasts"
      ],
      relatedRules: ["Rule 33", "Rule 34", "Rule 35", "Annex III"],
      applicability: ["All vessels with sound signaling equipment"],
      penalties: "Improper sound signals can indicate confusion or failure to communicate intentions",
      modernInterpretation: "Electronic sound signal generation, automated fog signal systems, digital communication integration"
    },
    {
      id: "rule33",
      rule: "Rule 33",
      title: "Equipment for Sound Signals",
      category: "sounds",
      description: "Requirements for whistles, bells, and gongs on vessels",
      detailedText: "Vessels 12m+ need whistle and bell. Vessels 100m+ also need gong. Sound equipment must meet specifications in Annex III. Smaller vessels need some means of making efficient sound signal. Manual sounding must always be possible.",
      examples: [
        "Large container ship with whistle, bell, and gong",
        "Medium fishing vessel with whistle and bell",
        "Small recreational boat with air horn or whistle"
      ],
      relatedRules: ["Rule 32", "Rule 34", "Rule 35", "Annex III"],
      applicability: ["All vessels by size category"],
      penalties: "Inadequate sound signaling equipment violates safety requirements",
      modernInterpretation: "Electronic sound signal systems, automated signaling, backup sound devices"
    },
    {
      id: "rule34",
      rule: "Rule 34",
      title: "Maneuvering and Warning Signals",
      category: "sounds",
      description: "Sound signals for indicating maneuvers and warning other vessels",
      detailedText: "One short blast means altering course to starboard. Two short blasts mean altering to port. Three short blasts mean engines going astern. Five short blasts indicate doubt or danger. Narrow channel overtaking signals use prolonged and short blast combinations.",
      examples: [
        "Container ship sounding one blast before turning right",
        "Ferry giving two blasts before port turn",
        "Vessel in doubt sounding five short blasts rapidly"
      ],
      relatedRules: ["Rule 8", "Rule 9", "Rule 35"],
      applicability: ["Vessels in sight of each other", "Maneuvering situations"],
      penalties: "Failure to signal maneuvers or improper signals contribute to collision risk",
      modernInterpretation: "Integration with AIS maneuvering broadcasts, automated turn signals, digital intention sharing"
    },
    {
      id: "rule35",
      rule: "Rule 35",
      title: "Sound Signals in Restricted Visibility",
      category: "sounds",
      description: "Fog signals for different types of vessels and situations",
      detailedText: "Power vessels making way sound one prolonged blast every 2 minutes. Power vessels stopped sound two prolonged blasts. Sailing vessels, fishing vessels, and restricted vessels sound one prolonged plus two short blasts. Anchored vessels ring bell for 5 seconds every minute.",
      examples: [
        "Ship in fog sounding one long blast every two minutes",
        "Anchored vessel ringing bell every minute",
        "Fishing vessel sounding one long plus two short blasts"
      ],
      relatedRules: ["Rule 19", "Rule 30", "Rule 33"],
      applicability: ["All vessels", "Restricted visibility conditions"],
      penalties: "Failure to make fog signals major factor in collision investigations",
      modernInterpretation: "Automated fog signal systems, GPS-triggered signals, electronic fog signal coordination"
    },
    {
      id: "rule36",
      rule: "Rule 36",
      title: "Signals to Attract Attention",
      category: "sounds",
      description: "Signals for attracting attention of other vessels",
      detailedText: "Any vessel may make light or sound signals to attract attention, provided they cannot be mistaken for signals authorized elsewhere in the Rules. Searchlights may be directed toward danger but must not embarrass other vessels.",
      examples: [
        "Vessel flashing searchlight to warn of hazard",
        "Ship using horn to attract attention in emergency",
        "Warning signals that don't conflict with navigation signals"
      ],
      relatedRules: ["Rule 37", "Annex IV"],
      applicability: ["All vessels", "Emergency and attention-getting situations"],
      penalties: "Improper attention signals must not interfere with navigation",
      modernInterpretation: "LED signal lights, electronic warning systems, digital emergency communication"
    },
    {
      id: "rule37",
      rule: "Rule 37",
      title: "Distress Signals",
      category: "sounds",
      description: "Signals indicating distress and need of assistance",
      detailedText: "Vessels in distress shall use signals prescribed in Annex IV including rockets, orange smoke, radio signals (SOS, MAYDAY), signal flags, flames, and other internationally recognized distress signals. Misuse of distress signals is prohibited.",
      examples: [
        "Vessel firing red rocket flares in emergency",
        "Ship transmitting MAYDAY on VHF radio",
        "Vessel displaying orange smoke signal"
      ],
      relatedRules: ["Rule 36", "Annex IV"],
      applicability: ["Vessels in distress", "Emergency situations"],
      penalties: "False distress signals subject to severe penalties; failure to assist vessels in distress is criminal",
      modernInterpretation: "EPIRB satellite beacons, digital selective calling (DSC), GPS emergency positioning"
    },
    {
      id: "rule38",
      rule: "Rule 38",
      title: "Exemptions",
      category: "special",
      description: "Exemptions for vessels built before COLREG 1972 entry into force",
      detailedText: "Vessels complying with previous 1960 Collision Regulations that were built or under construction when 1972 COLREG entered force may be exempted from certain light and sound signal requirements for specified periods. Applies mainly to historic vessels.",
      examples: [
        "Classic yacht with traditional light arrangements",
        "Historic vessel with grandfathered equipment",
        "Older commercial vessel with approved alternative compliance"
      ],
      relatedRules: ["Rule 1", "Annex I", "Annex III"],
      applicability: ["Pre-1977 vessels", "Historic vessels", "Special construction vessels"],
      penalties: "Exemptions must be properly documented and approved by flag state",
      modernInterpretation: "Modern exemptions for innovative designs, autonomous vessels, and alternative compliance methods"
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

                          {/* Visual Reference */}
                          {rule.imageUrl && (
                            <div>
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <Camera className="h-4 w-4" />
                                Görsel Referans
                              </h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="relative overflow-hidden rounded-lg border border-gray-300">
                                  <img 
                                    src={rule.imageUrl} 
                                    alt={rule.imageDescription || `Visual diagram for ${rule.title}`}
                                    className="w-full h-auto max-h-96 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      e.currentTarget.nextElementSibling.style.display = 'block';
                                    }}
                                  />
                                  <div className="hidden text-center text-gray-500 p-4">
                                    Görsel yüklenemedi
                                  </div>
                                </div>
                                {rule.imageDescription && (
                                  <p className="text-sm text-gray-600 mt-2 italic">
                                    {rule.imageDescription}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

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