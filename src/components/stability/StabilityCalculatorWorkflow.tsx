import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Calculator, Ship, BarChart3, Settings, FileText } from "lucide-react";
import { HydrostaticCalculations } from "../../services/hydrostaticCalculations";
import { ShipGeometry } from "../../types/hydrostatic";
import { useToast } from "@/hooks/use-toast";
import { EnhancedStabilityChart } from "./EnhancedStabilityChart";
import { StabilityProfileManager } from "./StabilityProfileManager";

export const StabilityCalculatorWorkflow: React.FC = () => {
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

  const [kg, setKg] = useState(7.5);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("input");
  const [calculating, setCalculating] = useState(false);

  const handleInputChange = useCallback((field: keyof ShipGeometry, value: number) => {
    setGeometry(prev => ({ ...prev, [field]: value }));
  }, []);

  const performCalculations = useCallback(async () => {
    setCalculating(true);
    try {
      // Perform comprehensive stability analysis
      const displacement = HydrostaticCalculations.calculateDisplacement(geometry);
      const centers = HydrostaticCalculations.calculateCenterPoints(geometry, kg);
      const stability = HydrostaticCalculations.calculateStabilityData(geometry, kg);
      const imoCriteria = HydrostaticCalculations.calculateIMOStabilityCriteria(stability);
      const coefficients = HydrostaticCalculations.calculateHydrostaticCoefficients(geometry);
      
      // Generate detailed GZ curve data
      const gzCurveData = stability.angles.map((angle, index) => ({
        angle,
        gz: stability.gz[index],
        rightingMoment: stability.rightingMoment[index] / 1000, // Convert to kN·m
        kn: HydrostaticCalculations.calculateKNApprox(geometry, kg, angle)
      }));

      // Calculate critical points
      const criticalPoints = {
        maxGZ: { angle: stability.maxGzAngle, value: stability.maxGz },
        vanishingAngle: stability.vanishingAngle,
        deckEdgeAngle: stability.deckEdgeAngle,
        downfloodingAngle: stability.downfloodingAngle
      };

      const newResults = {
        geometry,
        kg,
        displacement,
        centers,
        stability,
        imoCriteria,
        coefficients,
        gzCurveData,
        criticalPoints,
        timestamp: Date.now()
      };

      setResults(newResults);
      setActiveTab("results");

      toast({
        title: "Calculations Complete",
        description: `Stability analysis completed. IMO compliance: ${imoCriteria.compliance ? 'PASS' : 'FAIL'}`
      });

    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Please check your input values and try again",
        variant: "destructive"
      });
    } finally {
      setCalculating(false);
    }
  }, [geometry, kg, toast]);

  const handleLoadProfile = useCallback((newGeometry: ShipGeometry, newKg: number) => {
    setGeometry(newGeometry);
    setKg(newKg);
    setResults(null); // Clear previous results
  }, []);

  const exportResults = useCallback(() => {
    if (!results) return;

    const exportData = {
      ...results,
      exportedAt: new Date().toISOString(),
      calculationSummary: {
        vesselName: `Vessel_${geometry.length}x${geometry.breadth}`,
        displacement: results.displacement.displacement,
        gm: results.centers.gmt,
        maxGZ: results.stability.maxGz,
        imoCompliance: results.imoCriteria.compliance
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stability_analysis_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Results Exported",
      description: "Stability analysis exported to JSON file"
    });
  }, [results, geometry, toast]);

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="input">Ship Data</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="calculate">Calculate</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="chart">GZ Chart</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ship className="h-5 w-5" />
                Ship Geometry
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
                  <Label htmlFor="kg">KG [m]</Label>
                  <Input
                    id="kg"
                    type="number"
                    value={kg}
                    onChange={(e) => setKg(parseFloat(e.target.value))}
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
                
                <div className="space-y-2">
                  <Label htmlFor="midshipCoefficient">Midship Coefficient (Cm)</Label>
                  <Input
                    id="midshipCoefficient"
                    type="number"
                    step="0.01"
                    value={geometry.midshipCoefficient}
                    onChange={(e) => handleInputChange('midshipCoefficient', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prismaticCoefficient">Prismatic Coefficient (Cp)</Label>
                  <Input
                    id="prismaticCoefficient"
                    type="number"
                    step="0.01"
                    value={geometry.prismaticCoefficient}
                    onChange={(e) => handleInputChange('prismaticCoefficient', parseFloat(e.target.value))}
                  />
                </div>
              </div>
              
              <Alert>
                <Settings className="h-4 w-4" />
                <AlertDescription>
                  Enter your ship's main dimensions and form coefficients. Use the Profiles tab to save and load ship configurations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <StabilityProfileManager
            currentGeometry={geometry}
            currentKG={kg}
            onLoadProfile={handleLoadProfile}
          />
        </TabsContent>

        <TabsContent value="calculate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Stability Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Button 
                  onClick={performCalculations} 
                  disabled={calculating}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {calculating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="h-4 w-4 mr-2" />
                      Perform Complete Stability Analysis
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {geometry.length.toFixed(1)}
                  </div>
                  <div className="text-sm text-muted-foreground">Length (m)</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {(geometry.length * geometry.breadth * geometry.draft * geometry.blockCoefficient * 1.025).toFixed(0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Est. Displacement (t)</div>
                </div>
              </div>
              
              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  This will perform a complete stability analysis including hydrostatic calculations, 
                  GZ curve generation, and IMO criteria verification.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          {results ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Stability Results Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.displacement.displacement.toFixed(0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Displacement (t)</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.centers.gmt.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">GM (m)</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {results.stability.maxGz.toFixed(3)}
                      </div>
                      <div className="text-sm text-muted-foreground">Max GZ (m)</div>
                    </div>
                    
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">
                        <Badge variant={results.imoCriteria.compliance ? "default" : "destructive"}>
                          {results.imoCriteria.compliance ? "PASS" : "FAIL"}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">IMO Compliance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Hydrostatic Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">KB</div>
                      <div className="font-medium">{results.centers.kb.toFixed(2)} m</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">KM</div>
                      <div className="font-medium">{results.centers.kmt.toFixed(2)} m</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">BM</div>
                      <div className="font-medium">{results.centers.bmt.toFixed(2)} m</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">LCB</div>
                      <div className="font-medium">{results.centers.lcb.toFixed(2)} m</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">TPC</div>
                      <div className="font-medium">{results.coefficients.tpc.toFixed(2)} t/cm</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm text-muted-foreground">MCT</div>
                      <div className="font-medium">{results.coefficients.mtc1cm.toFixed(1)} t·m/cm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex gap-2">
                <Button onClick={exportResults} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </Button>
                <Button onClick={() => setActiveTab("chart")} className="flex-1">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View GZ Chart
                </Button>
              </div>
            </div>
          ) : (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                No calculation results yet. Go to the Calculate tab and run the stability analysis.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="chart" className="space-y-4">
          {results ? (
            <EnhancedStabilityChart
              data={results.gzCurveData}
              criticalPoints={results.criticalPoints}
              imoCriteria={results.imoCriteria}
              showKN={true}
              title="Ship Stability Curve Analysis"
            />
          ) : (
            <Alert>
              <BarChart3 className="h-4 w-4" />
              <AlertDescription>
                No chart data available. Please run the stability calculations first.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StabilityCalculatorWorkflow;