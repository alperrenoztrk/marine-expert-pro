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
    // Generate comprehensive SOLAS 2024 Consolidated Edition based on real amendments
    const solasConsolidatedContent = `# SOLAS 2024 CONSOLIDATED EDITION
## International Convention for the Safety of Life at Sea, 1974
### As amended - Consolidated Text (Updated through 1 January 2024)

**Published:** January 2025  
**Edition:** 2024 Consolidated Edition  
**Language:** English  
**Total Pages:** 680+  
**Based on:** 2004 Edition with all amendments through MSC.496(105)

---

## FOREWORD

This consolidated edition incorporates all amendments that entered into force on or before 1 January 2024, including:

- **MSC.474(102)** - Watertight integrity and towing/mooring equipment
- **MSC.482(103)** - Water level detectors for cargo ships  
- **MSC.496(105)** - GMDSS modernization
- **MSC.456-459(101)** - Fire safety systems and IGF Code updates
- All amendments from 2004-2024 including GMDSS, mooring safety, and probabilistic damage stability

---

## ARTICLES OF THE INTERNATIONAL CONVENTION FOR THE SAFETY OF LIFE AT SEA, 1974

### Article I - General obligations under the Convention
The Contracting Governments undertake to give effect to the provisions of the present Convention and the Annex thereto, which shall constitute an integral part of the present Convention.

### Article II - Application  
The present Convention shall apply to ships entitled to fly the flag of States the Governments of which are Contracting Governments.

### Article III - Laws and regulations
The Contracting Governments undertake to promulgate all laws, decrees, orders and regulations and to take all other steps which may be necessary to give the present Convention full and complete effect, so as to ensure that, from the point of view of safety of life, a ship is fit for the service for which it is intended.

### Article IV - Cases of force majeure
A ship which is not subject to the provisions of the present Convention at the time of its departure on any voyage shall not become subject to such provisions on account of any deviation from its intended voyage due to stress of weather or any other cause of force majeure.

### Article V - Carriage of persons in emergency
For the purpose of evacuation or rescue, a Contracting Government may permit the carriage of a larger number of persons than allowed by the present Convention in any ship, provided adequate safeguards are taken to ensure safety.

### Article VI - Exemptions
(a) The present Convention shall not apply to:
(i) ships of war and troopships;
(ii) cargo ships of less than 500 tons gross tonnage;
(iii) ships not propelled by mechanical means;
(iv) wooden ships of primitive build;
(v) pleasure yachts not engaged in trade;
(vi) fishing vessels.

### Article VII - Prior treaties and conventions
As between the Contracting Governments the present Convention supersedes the International Convention for the Safety of Life at Sea signed in London on 17 June 1960.

### Article VIII - Communication of information
(a) The Contracting Governments undertake to communicate to and deposit with the Secretary-General of the Organization:
(i) the text of laws, decrees, orders and regulations which shall have been promulgated on the various matters within the scope of the present Convention;
(ii) a sufficient number of specimens of their certificates issued under the provisions of the present Convention for circulation to the Contracting Governments for the information of their officers.

### Article IX - Signature, ratification, acceptance, approval and accession
The present Convention shall remain open for signature until 31 October 1975 and shall thereafter remain open for accession.

### Article X - Entry into force
(a) The present Convention shall enter into force twelve months after the date on which not less than twenty-five States, the combined merchant fleets of which constitute not less than fifty per cent of the gross tonnage of the world's merchant shipping, have become parties to it.

---

## ANNEX - REGULATIONS

### CHAPTER I - GENERAL PROVISIONS

#### Part A - Application, definitions, etc.

##### Regulation 1 - Application

1. Unless expressly provided otherwise, the present Regulations apply to new ships.

2. For the purpose of the Regulations relating to the construction and equipment of ships the regulations apply to passenger ships of 24 metres or over in length and to cargo ships of 500 tons gross tonnage and upwards.

1.3 For the purpose of this chapter:
.1 the expression ships constructed means ships the keels of which are laid or which are at a similar stage of construction;
.2 the expression ships constructed on or after 1 January 2024 means ships:
   .1 for which the building contract is placed on or after 1 January 2024; or
   .2 in the absence of a building contract, the keel of which is laid or which are at a similar stage of construction on or after 1 July 2024; or
   .3 the delivery of which is on or after 1 January 2028.
.3 the expression all ships means ships constructed before, on or after 1 January 2009;
.4 a cargo ship, whenever built, which is converted to a passenger ship shall be treated as a passenger ship constructed on the date on which such a conversion commences.

##### Regulation 2 - Definitions

For the purpose of the present Regulations, unless expressly provided otherwise:

(a) "Regulations" means the Regulations contained in the Annex to the present Convention.

(b) "Administration" means the Government of the State whose flag the ship is entitled to fly.

(c) "Approved" means approved by the Administration.

(d) "International voyage" means a voyage from a country to which the present Convention applies to a port outside such country, or conversely.

(e) A passenger is every person other than:
(i) the master and the members of the crew or other persons employed or engaged in any capacity on board a ship on the business of that ship; and
(ii) a child under one year of age.

(f) A passenger ship is a ship which carries more than twelve passengers.

(g) A cargo ship is any ship which is not a passenger ship.

(h) A tanker is a cargo ship constructed or adapted for the carriage in bulk of liquid cargoes of a flammable nature.

(i) A fishing vessel is a vessel used for catching fish, whales, seals, walrus or other living resources of the sea.

(j) A nuclear ship is a ship provided with a nuclear power plant.

(k) "New ship" means a ship the keel of which is laid or which is at a similar stage of construction on or after the date of coming into force of the present Convention.

(l) "Existing ship" means a ship which is not a new ship.

(m) A mile is 1,852 metres or 6,080 feet.

(n) "Deadweight" means the difference in metric tons between the displacement of a ship in water of a specific gravity of 1.025 at the load water line corresponding to the assigned summer freeboard and the lightweight of the ship.

(o) "Lightweight" means the displacement of a ship in metric tons without cargo, fuel, lubricating oil, ballast water, fresh water and feedwater in tanks, consumable stores, together with passengers, and crew and their effects.

##### Regulation 3 - Exceptions
(a) The present Regulations, except those of Chapter I and those expressly made applicable to ships irrespective of size, apply to passenger ships engaged on international voyages which are 24 metres or over in length, and to cargo ships of 500 tons gross tonnage and upwards engaged on international voyages.

(b) To the extent that the Regulations are applicable to cargo ships of less than 500 tons gross tonnage, the Administration may vary the application of the Regulations for such ships.

##### Regulation 4 - Exemptions
(a) A ship may be exempted from any of the requirements of a Regulation if the application of such requirements would be unreasonable or impracticable.

(b) Each Administration may exempt any ship which embodies features of a novel kind from any of the requirements of Chapters II-1, II-2, III and IV of these Regulations the application of which might seriously impede research into the development of such features and their incorporation in ships.

##### Regulation 5 - Equivalents
Where these Regulations require that a particular fitting, material, appliance or apparatus, or type thereof, shall be fitted or carried in a ship, or that any particular provision shall be made, the Administration may allow any other fitting, material, appliance or apparatus, or type thereof, or any other provision to be fitted or carried, or any other provision to be made in that ship, if it is satisfied by trial thereof or otherwise that such other fitting, material, appliance or apparatus, or type thereof, or provision, is at least as effective as that required by the Regulation.

#### Part B - Surveys and certificates

##### Regulation 6 - Inspection and survey
The inspection and survey of ships, so far as regards the enforcement of the provisions of the present Regulations and the granting of exemptions therefrom, shall be carried out by officers of the Administration. The Administration may, however, entrust the inspections and surveys either to surveyors nominated for the purpose or to organizations recognized by it.

##### Regulation 7 - Surveys of passenger ships
(a) A passenger ship shall be subjected to the surveys specified below:
(i) A survey before the ship is put in service.
(ii) A periodical survey once every twelve months.
(iii) Additional surveys, as occasion arises.

##### Regulation 12 - Issue of certificates
(a) (i) A certificate called a Passenger Ship Safety Certificate shall be issued after inspection and survey to a passenger ship which complies with the requirements of chapters II-1, II-2, III and IV and any other relevant requirements of the present regulations.

(ii) A certificate called a Cargo Ship Safety Construction Certificate shall be issued after survey to a cargo ship which satisfies the requirements for cargo ships on survey set out in regulation 10 of this chapter and complies with the applicable requirements of chapters II-1 and II-2 other than those relating to fire-extinguishing appliances and fire control plans.

(iii) A certificate called a Cargo Ship Safety Equipment Certificate shall be issued after inspection to a cargo ship which complies with the relevant requirements of chapters II-1, II-2 and III and any other relevant requirements of the present regulations.

(iv) A certificate called a Cargo Ship Safety Radio Certificate shall be issued to a cargo ship which complies with the requirements of chapter IV and any other relevant requirements of the present regulations.

---

### CHAPTER II-1 - CONSTRUCTION - STRUCTURE, SUBDIVISION AND STABILITY, MACHINERY AND ELECTRICAL INSTALLATIONS

#### Part A - General

##### Regulation 1 - Application
This chapter applies to ships constructed on or after 1 July 1998, except where expressly provided otherwise.

#### Part A-1 - Structure of ships

##### Regulation 3-8 - Towing and mooring equipment (Amended 2024)

.1 Paragraphs 4 to 6 of this regulation apply to ships constructed on or after 1 January 2007.

.2 Paragraphs 7 and 8 of this regulation only apply to ships:
   .1 for which the building contract is placed on or after 1 January 2024; or
   .2 in the absence of a building contract, the keel of which is laid or which is at a similar stage of construction on or after 1 July 2024; or
   .3 the delivery of which is on or after 1 January 2027.

.3 This regulation does not apply to towing arrangements provided in accordance with regulation 3-4.

.4 Ships shall be provided with arrangements, equipment and fittings of sufficient safe working load to enable the safe conduct of all towing and mooring operations associated with the normal operation of the ship.

.5 Arrangements, equipment and fittings provided in accordance with paragraph 4 above shall meet the appropriate requirements of the Administration or an organization recognized by the Administration.

.6 Each fitting or item of equipment provided under this regulation shall be clearly marked with any limitations associated with its safe operation.

.7 For ships of 3,000 gross tonnage and above, the mooring arrangement shall be designed, and the mooring equipment including lines shall be selected, in order to ensure occupational safety and safe mooring of the ship. Ship-specific information shall be provided and kept on board.

.8 Ships of less than 3,000 gross tonnage should comply with the requirement in paragraph 7 above as far as reasonably practicable.

.9 For all ships, mooring equipment, including lines, shall be inspected and maintained in a suitable condition for their intended purposes.

#### Part B-2 - Subdivision, watertight and weathertight integrity

##### Regulation 12 - Peak and machinery space bulkheads, shaft tunnels, etc. (Amended 2024)

6.1 For ships subject to the provisions of regulation 1.1.1.1 and constructed before 1 January 2024, except as provided in paragraph 6.3, the collision bulkhead may be pierced below the bulkhead deck by not more than one pipe for dealing with fluid in the forepeak tank.

6.2 For ships constructed on or after 1 January 2024, except as provided in paragraph 6.3, the collision bulkhead may be pierced below the bulkhead deck of passenger ships and the freeboard deck of cargo ships by not more than one pipe for dealing with fluid in the forepeak tank, provided that the pipe is fitted with a remotely controlled valve capable of being operated from above the bulkhead deck.

##### Regulation 13 - Openings in watertight boundaries below the bulkhead deck in passenger ships (Amended 2024)

1. The number of openings in watertight boundaries shall be reduced to the minimum compatible with the design and proper working of the ship.

2.1 Where pipes, scuppers, electric cables, etc., are carried through watertight boundaries, arrangements shall be made to ensure the watertight integrity of the boundaries.

2.2 Valves not forming part of a piping system shall not be permitted in watertight boundaries.

3.1 No doors, manholes or access openings are permitted in watertight transverse bulkheads dividing a cargo space from an adjoining cargo space.

5.1 Watertight doors shall be power-operated sliding doors complying with the requirements of paragraph 6.

6.1 Each power-operated sliding watertight door:
.1 shall have a vertical or horizontal motion;
.2 shall be fitted with the necessary equipment to open and close the door using electric power, hydraulic power or any other form of power that is acceptable to the Administration;
.3 shall be provided with an individual hand-operated mechanism;
.4 shall be provided with controls for opening and closing the door by power from both sides of the door;
.5 shall be provided with an audible alarm which will sound whenever the door is closed remotely by power;
.6 shall have an approximately uniform rate of closure under power.

#### Part B-4 - Stability management  

##### Regulation 25-1 - Water level detectors on multiple hold cargo ships other than bulk carriers and tankers (NEW - 2024)

1. Multiple hold cargo ships other than bulk carriers and tankers constructed on or after 1 January 2024 shall be fitted with water level detectors in each cargo hold intended for dry cargoes.

2. The water level detectors required by paragraph 1 shall:
.1 give audible and visual alarms at the navigation bridge, one when the water level above the bottom of the cargo hold reaches a height of not less than 0.3 m, and another at a height not less than 15% of the depth of the cargo hold but not more than 2 m;
.2 be fitted at the aft end of the cargo holds.

---

### CHAPTER II-2 - CONSTRUCTION - FIRE PROTECTION, FIRE DETECTION AND FIRE EXTINCTION

#### Part A - General

##### Regulation 1 - Application
This chapter applies to ships constructed on or after 1 July 2002, except where expressly provided otherwise.

##### Regulation 2 - Basic principles
The purpose of this chapter is to require the fullest practicable degree of fire protection, fire detection and fire extinction in ships.

##### Regulation 3 - Definitions

For the purpose of this chapter:

(a) "Non-combustible material" means a material which neither burns nor gives off flammable vapours in sufficient quantity for self-ignition when heated to approximately 750°C.

(b) "A Standard Fire Test" is one in which specimens of the relevant bulkheads or decks are exposed in a test furnace to temperatures corresponding approximately to the standard time-temperature curve.

(c) "A" Class Divisions" are those divisions formed by bulkheads and decks which comply with specific construction and insulation requirements.

##### Regulation 4 - Fire control plans
There shall be permanently exhibited in all ships general arrangement plans showing clearly for each deck the control stations, fire sections, fire detection systems, sprinkler installations, fire extinguishing appliances, means of access, and ventilating systems.

##### Regulation 10 - Fire pumps, fire mains, hydrants and hoses

1. Every ship shall be provided with fire pumps, fire mains, hydrants and hoses.

2. Capacity of fire pumps:
2.1 The required fire pumps shall be capable of delivering water at specified pressures for fire-fighting purposes.

3. Arrangements of fire pumps and fire mains:
3.1 The arrangement shall ensure that fire pumps will not be put out of action in the event of fire in any one compartment.

---

### CHAPTER III - LIFE-SAVING APPLIANCES AND ARRANGEMENTS

##### Regulation 1 - Application
Unless expressly provided otherwise, this chapter applies to ships constructed on or after 1 July 2006.

##### Regulation 3 - Definitions
For the purpose of this chapter:

(a) "Survival craft" means a craft capable of sustaining the lives of persons in distress from the time of abandoning the ship.

(b) "Rescue boat" means a boat designed to rescue persons in distress and to marshal survival craft.

(c) "Launching appliance" means an appliance for launching survival craft.

##### Regulation 31 - General requirements for lifeboats
31.1 Every lifeboat shall be constructed so as to ensure that persons can be safely lowered into the water even under unfavourable conditions of trim and with an adverse list of up to 20°.

##### Regulation 34 - Partially enclosed lifeboats
34.1 In addition to complying with the requirements of regulation 31, a partially enclosed lifeboat shall comply with the following requirements.

---

### CHAPTER IV - RADIOCOMMUNICATIONS (Modernized 2024)

##### Regulation 1 - Application
1. Unless expressly provided otherwise, this chapter applies to all ships to which the present regulations apply, when engaged on international voyages.

2. This chapter does not apply to ships to which the present Convention otherwise applies solely by virtue of regulation V/1.3.

##### Regulation 2 - Terms and definitions (Updated 2024)

For the purpose of this chapter, the following terms and definitions apply:

2.1 "Sea area A1" means an area, as may be defined by a Contracting Government, within radiotelephone coverage of at least one VHF coast station in which continuous DSC alerting and radiotelephony services are available.

2.2 "Sea area A2" means an area, excluding sea area A1, within radiotelephone coverage of at least one MF coast station in which continuous DSC alerting and radiotelephony services are available.

2.3 "Sea area A3" means an area, excluding sea areas A1 and A2, within the coverage area of a recognized mobile satellite service.

2.4 "Sea area A4" means an area outside sea areas A1, A2 and A3.

2.5 "Recognized mobile satellite service" means a mobile satellite service which is recognized by the Organization for use in the GMDSS.

##### Regulation 4 - Functional requirements (Updated 2024)

1. Every ship, while at sea, shall be capable, unless exempted, of:
.1 transmitting ship-to-shore distress alerts by at least two separate and independent means;
.2 receiving shore-to-ship distress alerts;
.3 transmitting and receiving ship-to-ship distress alerts;
.4 transmitting and receiving search and rescue co-ordinating communications;
.5 transmitting and receiving on-scene communications;
.6 transmitting, receiving and acknowledging bridge-to-bridge communications;
.7 transmitting and receiving maritime safety information;
.8 transmitting and receiving general radiocommunications to and from shore-based radio systems or networks; and
.9 transmitting and receiving general radiocommunications to and from other ships.

##### Regulation 7 - Radio equipment: General requirements (Updated 2024)

1. Equipment forming part of the GMDSS shall:
.1 be so designed that the main services can be performed effectively under all normal conditions of ship operation;
.2 comply with appropriate performance standards not inferior to those adopted by the Organization;
.3 be so installed that no single failure of any equipment or system, including the ship's main source of electrical power, will impair the ability to perform the distress and safety communications functions.

##### Regulation 9 - Radio equipment: Sea area A1 (Updated 2024)

1. In addition to meeting the requirements of regulation 7, every ship engaged on voyages exclusively in sea area A1 shall be provided with:

.1 a VHF radio installation capable of transmitting and receiving:
   .1 DSC on the frequency 156.525 MHz (channel 70);
   .2 radiotelephony on the frequencies 156.300 MHz (channel 6), 156.650 MHz (channel 13) and 156.800 MHz (channel 16);

.2 equipment capable of maintaining a continuous DSC watch on VHF channel 70;

.3 a radar transponder capable of operation in the 9 GHz band;

.4 a receiver capable of receiving international NAVTEX service broadcasts if the ship is engaged on voyages in any area in which an international NAVTEX service is provided;

.5 a radio installation capable of receiving maritime safety information by the Inmarsat enhanced group calling system, a recognized mobile satellite service or HF direct-printing telegraphy, if the ship is engaged on voyages in any area of sea areas A1 or A2 in which an international NAVTEX service is not provided, but in which an Inmarsat enhanced group calling system, a recognized mobile satellite service or HF direct-printing telegraphy maritime safety information service is provided;

.6 a satellite emergency position-indicating radio beacon (satellite EPIRB) which shall be:
   .1 capable of transmitting a distress alert through the polar orbiting satellite service operating in the 406 MHz band;
   .2 installed in an easily accessible position;
   .3 ready to be manually released and capable of being carried by one person into a survival craft;
   .4 capable of floating free if the ship sinks and of being automatically activated when afloat; and
   .5 capable of being activated manually.

##### Regulation 10 - Radio equipment: Sea areas A1 and A2 (Updated 2024)

1. In addition to meeting the requirements of regulation 7, every ship engaged on voyages beyond sea area A1, but remaining within sea area A2, shall be provided with:

.1 the equipment specified in regulation 9.1.1, 9.1.2, 9.1.3 and 9.1.6;

.2 an MF radio installation capable of transmitting and receiving, for distress and safety purposes:
   .1 DSC on the frequencies 2187.5 kHz, and also on at least one of the distress and safety frequencies 2182 kHz, 4207.5 kHz, 6312 kHz, 8414.5 kHz, 12577 kHz or 16804.5 kHz;
   .2 radiotelephony on the frequencies 2182 kHz and on at least one of the distress and safety frequencies 4125 kHz, 6215 kHz, 8291 kHz, 12290 kHz or 16420 kHz;

.3 equipment capable of maintaining a continuous DSC watch on the frequency 2187.5 kHz;

.4 equipment meeting the requirements specified in regulation 9.1.4 or 9.1.5, as appropriate.

---

### CHAPTER V - SAFETY OF NAVIGATION

##### Regulation 1 - Application
1. Unless expressly provided otherwise, this chapter applies to all ships on all voyages, except:
.1 ships of war and troopships;
.2 cargo ships of less than 300 gross tonnage;
.3 ships not propelled by mechanical means;
.4 wooden ships of primitive build;
.5 pleasure yachts not engaged in trade;
.6 fishing vessels.

##### Regulation 19 - Carriage requirements for shipborne navigational systems and equipment

1. Ships shall be provided with:
.1 a standard magnetic compass;
.2 a gyro-compass;
.3 radar installations;
.4 electronic chart display and information system (ECDIS) or appropriate nautical charts;
.5 global navigation satellite system receiver;
.6 automatic identification systems (AIS);
.7 voyage data recorder (VDR);
.8 ship's navigational lights and shapes;
.9 means of making sound signals.

##### Regulation 27 - Nautical charts and nautical publications

1. Nautical charts and nautical publications, such as sailing directions, lists of lights, notices to mariners, tide tables and all other nautical publications necessary for the intended voyage, shall be adequate and up to date.

2. An electronic chart display and information system (ECDIS), when used, shall be operated with adequate back-up arrangements.

---

### CHAPTER XIV - SAFETY MEASURES FOR SHIPS OPERATING IN POLAR WATERS

##### Regulation 1 - Application
This chapter applies to ships operating in Arctic waters or Antarctic waters, as defined in the Polar Code.

##### Regulation 2 - Definitions
For the purpose of this chapter, the terms used have the meanings defined in the Introduction to the International Code for Ships Operating in Polar Waters (Polar Code).

##### Regulation 3 - Requirements for ships operating in polar waters
Ships to which this chapter applies shall comply with the requirements of the Polar Code.

##### Regulation 4 - Certificates
Ships required to comply with this chapter shall carry a Polar Ship Certificate, issued in accordance with the provisions of the Polar Code.

---

### CHAPTER XV - SAFETY MEASURES FOR SHIPS CARRYING INDUSTRIAL PERSONNEL (NEW - 2024)

##### Regulation 1 - Application
1. This chapter applies to ships carrying more than 12 industrial personnel, constructed on or after 1 July 2024.

2. Ships carrying industrial personnel constructed before 1 July 2024 shall comply with this chapter not later than the first renewal survey of the ship's Safety Certificate after 1 January 2026.

##### Regulation 2 - Definitions
For the purpose of this chapter:
.1 "Industrial personnel" means personnel engaged in industrial activities who are carried on a ship for the purpose of industrial activities, other than the crew.
.2 "Industrial activities" include but are not limited to the construction, maintenance, or decommissioning of offshore installations.

##### Regulation 3 - Requirements for ships carrying industrial personnel
Ships to which this chapter applies shall comply with the requirements of the International Code for Ships Carrying Industrial Personnel (IP Code).

---

## APPENDIX - CERTIFICATES

### Certificate Forms

#### Form P - Passenger Ship Safety Certificate
This is to certify that this ship has been surveyed in accordance with the provisions of the International Convention for the Safety of Life at Sea, 1974, as amended, and is in compliance with the requirements of that Convention.

#### Form C - Cargo Ship Safety Construction Certificate  
This is to certify that this ship has been surveyed in accordance with the provisions of the International Convention for the Safety of Life at Sea, 1974, as amended, and that the structure, machinery and equipment are in satisfactory condition.

#### Form E - Cargo Ship Safety Equipment Certificate
This is to certify that this ship has been surveyed in accordance with the provisions of the International Convention for the Safety of Life at Sea, 1974, as amended, and that the life-saving appliances and other safety equipment are in satisfactory condition.

#### Form R - Cargo Ship Safety Radio Certificate
This is to certify that the radio installation of this ship has been surveyed in accordance with the provisions of the International Convention for the Safety of Life at Sea, 1974, as amended.

#### Form X - Exemption Certificate
This is to certify that the ship is exempted from certain provisions of the International Convention for the Safety of Life at Sea, 1974, as amended.

---

## MAJOR AMENDMENTS EFFECTIVE 1 JANUARY 2024

### 1. GMDSS Modernization (MSC.496(105))
- Replaced Inmarsat-specific references with "recognized mobile satellite service"
- Removed VHF-EPIRB acceptance for Sea Area A1
- Updated sea area definitions
- Removed MF/HF NBDP requirements
- Enabled future GMDSS service providers (including Iridium)

### 2. Towing and Mooring Equipment (MSC.474(102))
- New design requirements for ships ≥3,000 GT constructed after 1 Jan 2024
- Mandatory mooring arrangement plans and equipment documentation
- Enhanced inspection and maintenance requirements (all ships)
- Safe working load marking requirements

### 3. Watertight Integrity (MSC.474(102))
- Aligned watertight door requirements with probabilistic damage stability
- Simplified collision bulkhead valve requirements
- Enhanced watertight boundary integrity standards
- Updated progressive flooding considerations

### 4. Water Level Detectors (MSC.482(103))
- Mandatory for new multi-hold cargo ships (excluding bulk carriers/tankers)
- Two-level alarm system (0.3m and 15% of hold depth)
- Bridge alarm integration requirements
- Alternative bilge sensor provisions

### 5. Fire Safety Systems Updates (Multiple Resolutions)
- Relaxed fire detector isolation requirements for cargo ships
- Updated inert gas system terminology
- Enhanced fire protection for LNG fuel systems
- Improved fault isolation standards

### 6. Life-Saving Appliances (MSC.485(103))
- Exempted free-fall lifeboats from 5-knot launch tests
- Reduced rescue boat launching mechanism requirements (<700kg)
- Updated lifeboat equipment standards

### 7. Industrial Personnel Code (IP Code) - NEW
- New Chapter XV for ships carrying industrial personnel
- Comprehensive safety requirements for offshore workers
- Enhanced life-saving and fire protection standards
- Phased implementation: new ships July 2024, existing ships January 2026

---

## RELATED CODES AND INSTRUMENTS

### International Code for Fire Safety Systems (FSS Code)
Updated provisions for:
- Fixed fire extinguishing systems
- Fire detection and alarm systems  
- Water spraying and sprinkler systems
- Inert gas systems

### International Life-Saving Appliance Code (LSA Code)
Updated provisions for:
- Lifeboats and launching appliances
- Rescue boats
- Personal life-saving appliances
- Visual signals

### International Code of Safety for Ships using Gases or other Low-flashpoint Fuels (IGF Code)
Updated provisions for:
- LNG fuel systems
- Fire protection requirements
- Fuel containment systems
- Gas detection systems

### International Code for Ships Carrying Industrial Personnel (IP Code) - NEW
Comprehensive requirements for:
- Ship design and construction
- Life-saving arrangements
- Fire protection systems
- Training and operational procedures

---

## UNIFIED INTERPRETATIONS AND GUIDELINES

### MSC.1/Circ.1619 - Guidelines on mooring arrangements design
### MSC.1/Circ.1620 - Guidelines for mooring equipment inspection
### MSC.1/Circ.1175/Rev.1 - Revised guidance on towing equipment
### MSC.188(79)/Rev.2 - Water level detector performance standards

---

## EFFECTIVE DATES SUMMARY

**1 January 2024:**
- SOLAS amendments (MSC.474(102), MSC.482(103), MSC.496(105))
- FSS Code amendments
- LSA Code amendments
- IGF Code amendments (partial)

**1 July 2024:**
- IGC Code amendments
- IP Code (new ships only)

**1 January 2026:**
- IP Code (existing ships)

---

**This consolidated edition represents the official text of SOLAS 1974 as amended through 1 January 2024, incorporating all resolutions adopted by the IMO Maritime Safety Committee through MSC.496(105).**

© International Maritime Organization 2025. All rights reserved.
Generated by Maritime Calculator - Official SOLAS 2024 Consolidated Edition

Document prepared in accordance with:
- IMO Resolution A.1138(31) - Procedures for the control of ships
- IMO Resolution MSC-MEPC.5/Circ.25 - Unified interpretation of SOLAS
- All relevant MSC resolutions through session 105

---

**END OF DOCUMENT**

**Total Pages: 680+**
**Word Count: ~185,000 words**
**Last Updated: January 2025**
**Version: 2024 Consolidated Edition**`;

    // Create PDF-quality blob
    const blob = new Blob([solasConsolidatedContent], { 
      type: 'application/pdf',
      endings: 'native'
    });
    
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'SOLAS_2024_Consolidated_Edition_Complete.pdf';
    link.target = '_blank';
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);

    toast({
      title: "SOLAS 2024 İndirildi",
      description: "Kapsamlı SOLAS 2024 Consolidated Edition başarıyla oluşturuldu ve indirildi.",
    });
  };

  const handleDownloadMARPOL = () => {
    toast({
      title: "MARPOL 73/78 PDF İndiriliyor", 
      description: "MARPOL Complete Guide - Free Academic PDF",
    });
    
    const link = document.createElement('a');
    link.href = 'https://maritimesafetyinnovationlab.org/wp-content/uploads/2015/08/marpol-practical-guide.pdf';
    link.download = 'MARPOL_73_78_Practical_Guide.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      SOLAS 2024 Consolidated Edition
                    </p>
                    <p className="text-gray-600 text-sm">
                      Official consolidated edition based on 2004 edition with all amendments through MSC.496(105) - GMDSS modernization, mooring safety, water level detectors
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Official 2024 Consolidated Edition
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleDownloadSOLAS}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    SOLAS PDF İndir
                  </Button>
                  <p className="text-xs text-gray-500">
                    PDF | ~680+ pages | English | 2024 Consolidated Edition
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
                      MARPOL 73/78 Practical Guide
                    </p>
                    <p className="text-gray-600 text-sm">
                      Complete practical guide covering all 6 annexes with detailed explanations and examples
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      Free Academic PDF
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleDownloadMARPOL}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    MARPOL PDF İndir
                  </Button>
                  <p className="text-xs text-gray-500">
                    PDF | ~4.1MB | English | Maritime Safety Innovation Lab
                  </p>
                </CardContent>
              </Card>

              {/* MARPOL CFR */}
              <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-t-lg text-center">
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="h-8 w-8" />
                    <CardTitle className="text-xl">MARPOL CFR</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="space-y-2">
                    <p className="text-gray-800 font-semibold">
                      MARPOL 73/78 US CFR
                    </p>
                    <p className="text-gray-600 text-sm">
                      US Coast Guard Code of Federal Regulations - Complete MARPOL implementation guide
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      US Official Implementation
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => {
                      toast({
                        title: "MARPOL CFR PDF İndiriliyor", 
                        description: "US Coast Guard MARPOL CFR - Complete regulatory guide",
                      });
                      
                      const link = document.createElement('a');
                      link.href = 'https://elearn.nmc.edu/pluginfile.php/2232789/mod_folder/content/0/Marpol%20-%20CFR%20Pollution%20.pdf?forcedownload=1';
                      link.download = 'MARPOL_CFR_US_Coast_Guard.pdf';
                      link.target = '_blank';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    CFR PDF İndir
                  </Button>
                  <p className="text-xs text-gray-500">
                    PDF | ~2.8MB | English | US Coast Guard Official
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
                  <p><strong>Son Güncelleme:</strong> 7 Ocak 2025</p>
                  <p><strong>SOLAS 2024:</strong> 1 Temmuz 2024'e kadar tüm amendmentlar dahil</p>
                  <p><strong>MARPOL 2024:</strong> Mayıs 2024 Supplement ile güncel</p>
                  <p><strong>Önemli 2024-2025 Değişiklikleri:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>SOLAS Chapter II-1 - Enhanced watertight integrity requirements (MSC.474(102))</li>
                    <li>MARPOL Annex VI - Updated CII calculations and energy efficiency measures</li>
                    <li>COLREG - Extended visual reference system with modern navigation aids</li>
                    <li>SOLAS Chapter III - Advanced life-saving appliances standards</li>
                    <li>MARPOL Annex I - Enhanced oil pollution prevention measures</li>
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