import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Save, History, Ship, Calculator } from "lucide-react";
import { HydrostaticCalculations } from "../services/hydrostaticCalculations";
import { ShipGeometry, HydrostaticData, StabilityData } from "../types/hydrostatic";
import { useToast } from "@/hooks/use-toast";

interface SavedProfile {
  name: string;
  geometry: ShipGeometry;
  timestamp: number;
}

interface CalculationHistory {
  id: string;
  timestamp: number;
  geometry: ShipGeometry;
  results: any;
}

export const HydrostaticCalculator: React.FC = () => {
  const { toast } = useToast();
  const [geometry, setGeometry] = useState<ShipGeometry>({
    length: 150,
    breadth: 25,
    depth: 12,
    draft: 8.5,
    blockCoefficient: 0.82,
    waterplaneCoefficient: 0.85,
    midshipCoefficient: 0.98,
    prismaticCoefficient: 0.75,
    verticalPrismaticCoefficient: 0.85
  });

  const [results, setResults] = useState<any>(null);
  const [savedProfiles, setSavedProfiles] = useState<SavedProfile[]>([]);
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [activeTab, setActiveTab] = useState("input");

  

  const handleInputChange = useCallback((field: keyof ShipGeometry, value: number) => {
    setGeometry(prev => ({ ...prev, [field]: value }));
  }, []);

  const calculateHydrostatics = useCallback(() => {
    try {
      const displacement = HydrostaticCalculations.calculateDisplacement(geometry);
      const centers = HydrostaticCalculations.calculateCenterPoints(geometry, 7.5); // Default KG
      const stability = HydrostaticCalculations.calculateStabilityData(geometry, 7.5);
      
      const hydrostatic = {
        displacement: displacement.displacement,
        volumeDisplacement: displacement.volumeDisplacement,
        waterplaneArea: HydrostaticCalculations.calculateWaterplaneArea(geometry),
        immersedVolume: HydrostaticCalculations.calculateImmersedVolume(geometry)
      };
      
      const newResults = {
        hydrostatic,
        stability,
        centers,
        geometry
      };
      
      setResults(newResults);
      
      // Add to history
      const historyEntry: CalculationHistory = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        geometry: { ...geometry },
        results: newResults
      };
      
      setHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10
      setActiveTab("results");
      
      toast({
        title: "Calculation Complete",
        description: "Hydrostatic properties calculated successfully"
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input values",
        variant: "destructive"
      });
    }
  }, [geometry, toast]);

  const saveProfile = useCallback(() => {
    const name = `Profile_${new Date().toLocaleDateString()}`;
    const newProfile: SavedProfile = {
      name,
      geometry: { ...geometry },
      timestamp: Date.now()
    };
    
    setSavedProfiles(prev => [...prev, newProfile]);
    localStorage.setItem('hydrostaticProfiles', JSON.stringify([...savedProfiles, newProfile]));
    
    toast({
      title: "Profile Saved",
      description: `Saved as ${name}`
    });
  }, [geometry, savedProfiles, toast]);

  const loadProfile = useCallback((profile: SavedProfile) => {
    setGeometry(profile.geometry);
    toast({
      title: "Profile Loaded",
      description: `Loaded ${profile.name}`
    });
  }, [toast]);

  const loadExampleData = useCallback(() => {
    const exampleGeometry: ShipGeometry = {
      length: 175,
      breadth: 28.5,
      depth: 14.2,
      draft: 9.8,
      blockCoefficient: 0.78,
      waterplaneCoefficient: 0.88,
      midshipCoefficient: 0.995,
      prismaticCoefficient: 0.784,
      verticalPrismaticCoefficient: 0.87
    };
    
    setGeometry(exampleGeometry);
    toast({
      title: "Example Data Loaded",
      description: "Container ship example loaded"
    });
  }, [toast]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h1 className="text-3xl font-bold gradient-text flex items-center justify-center gap-2">
          <Ship className="h-8 w-8" />
          Hydrostatic Calculator
        </h1>
        <p className="text-lg text-muted-foreground">
          Advanced ship hydrostatic and stability calculations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input">Ship Data</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Ship Geometry Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="length">Length (L) [m]</Label>
                  <Input
                    id="length"
                    type="number"
                    value={geometry.length}
                    onChange={(e) => handleInputChange('length', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="breadth">Breadth (B) [m]</Label>
                  <Input
                    id="breadth"
                    type="number"
                    value={geometry.breadth}
                    onChange={(e) => handleInputChange('breadth', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="depth">Depth (D) [m]</Label>
                  <Input
                    id="depth"
                    type="number"
                    value={geometry.depth}
                    onChange={(e) => handleInputChange('depth', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="draft">Draft (T) [m]</Label>
                  <Input
                    id="draft"
                    type="number"
                    value={geometry.draft}
                    onChange={(e) => handleInputChange('draft', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="blockCoefficient">Block Coefficient (Cb)</Label>
                  <Input
                    id="blockCoefficient"
                    type="number"
                    step="0.01"
                    value={geometry.blockCoefficient}
                    onChange={(e) => handleInputChange('blockCoefficient', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="waterplaneCoefficient">Waterplane Coefficient (Cw)</Label>
                  <Input
                    id="waterplaneCoefficient"
                    type="number"
                    step="0.01"
                    value={geometry.waterplaneCoefficient}
                    onChange={(e) => handleInputChange('waterplaneCoefficient', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button onClick={calculateHydrostatics} className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Calculate
                </Button>
                <Button variant="outline" onClick={loadExampleData}>
                  Load Example
                </Button>
                <Button variant="outline" onClick={saveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results ? (
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hydrostatic Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.hydrostatic.displacement.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Displacement (t)</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.centers.lcb.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">LCB (m)</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.centers.kb.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">KB (m)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stability Parameters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.centers.gmt.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">GM (m)</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.centers.kmt.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">KM (m)</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.centers.bmt.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">BM (m)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                No calculation results yet. Go to Ship Data tab and click Calculate.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              {savedProfiles.length > 0 ? (
                <div className="space-y-2">
                  {savedProfiles.map((profile, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">{profile.name}</div>
                        <div className="text-sm text-muted-foreground">
                          L: {profile.geometry.length}m, B: {profile.geometry.breadth}m, T: {profile.geometry.draft}m
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadProfile(profile)}
                      >
                        Load
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No saved profiles yet. Save a profile from the Ship Data tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Calculation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-2">
                  {history.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <div className="font-medium">
                          {new Date(entry.timestamp).toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          L: {entry.geometry.length}m, Δ: {entry.results.hydrostatic.displacement.toFixed(0)}t
                        </div>
                      </div>
                      <Badge variant="secondary">
                        GM: {entry.results.centers.gmt.toFixed(2)}m
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertDescription>
                    No calculation history yet. Perform calculations to see history.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};