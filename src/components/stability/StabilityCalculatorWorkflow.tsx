// Comprehensive Stability Calculator - Step-by-step Workflow UI

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Ship, 
  Upload, 
  Calculator, 
  BarChart3, 
  CheckCircle, 
  AlertTriangle, 
  Download,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StabilityCalculationEngine } from '../../services/stabilityCalculationEngine';
import { VesselData, LoadingCase } from '../../types/vessel';

type WorkflowStep = 'vessel' | 'loading' | 'calculate' | 'curve' | 'criteria' | 'results';

interface StabilityCalculatorWorkflowProps {
  className?: string;
}

export const StabilityCalculatorWorkflow: React.FC<StabilityCalculatorWorkflowProps> = ({
  className = ''
}) => {
  const { toast } = useToast();
  
  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('vessel');
  const [completedSteps, setCompletedSteps] = useState<WorkflowStep[]>([]);
  
  // Data states
  const [vessel, setVessel] = useState<VesselData | null>(null);
  const [loading, setLoading] = useState<LoadingCase | null>(null);
  const [results, setResults] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  
  // Example vessel data for quick start
  const [exampleVessel] = useState<VesselData>({
    name: 'MV Example',
    Lpp: 120.0,
    B: 20.0,
    D: 12.0,
    lightship: {
      weight: 3500.0,
      KG: 6.5,
      LCG: 60.0,
      TCG: 0.0
    },
    hydrostatics: {
      T_values: [4.0, 5.0, 6.0, 7.0, 8.0],
      Delta: [5000, 6000, 7100, 8300, 9600],
      KB: [2.8, 3.0, 3.2, 3.4, 3.6],
      KMt: [7.2, 7.0, 6.85, 6.75, 6.7],
      KN: {
        phi_deg: [0, 10, 20, 30, 40, 50, 60],
        'T=6.0': [0.0, 0.17, 0.33, 0.48, 0.60, 0.68, 0.70]
      }
    },
    tanks: [
      {
        id: 'FO1',
        rho: 0.85,
        capacity_m3: 200.0,
        fsm_table: [[0, 0], [25, 0.6], [50, 1.0], [75, 0.7], [100, 0]],
        lcg: 20.0,
        tcg: 4.0,
        vcg: 3.0
      },
      {
        id: 'DB_Port',
        rho: 1.025,
        capacity_m3: 300.0,
        fsm_table: [[0, 0], [25, 0.8], [50, 1.2], [75, 0.9], [100, 0]],
        lcg: 80.0,
        tcg: -5.0,
        vcg: 2.0
      }
    ],
    downflooding_angle_deg: 52.0
  });

  const [exampleLoading] = useState<LoadingCase>({
    name: 'Example Loading',
    items: [
      {
        name: 'Cargo Hold 1',
        weight: 1200.0,
        lcg: 40.0,
        tcg: 0.0,
        vcg: 4.0
      },
      {
        name: 'Deck Cargo',
        weight: 300.0,
        lcg: 80.0,
        tcg: 1.0,
        vcg: 10.0
      }
    ],
    tanks: [
      { id: 'FO1', fill_percent: 60 },
      { id: 'DB_Port', fill_percent: 30 }
    ]
  });

  // Step progress calculation
  const getProgress = () => {
    const steps: WorkflowStep[] = ['vessel', 'loading', 'calculate', 'curve', 'criteria', 'results'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  // Load example data
  const loadExampleData = () => {
    setVessel(exampleVessel);
    setLoading(exampleLoading);
    setCompletedSteps(['vessel', 'loading']);
    toast({
      title: 'Example Data Loaded',
      description: 'Sample vessel and loading data has been loaded for testing.'
    });
  };

  // Perform calculations
  const performCalculations = async () => {
    if (!vessel || !loading) {
      toast({
        title: 'Missing Data',
        description: 'Please complete vessel and loading data first.',
        variant: 'destructive'
      });
      return;
    }

    setCalculating(true);
    try {
      const calculationResults = StabilityCalculationEngine.performCompleteAnalysis(vessel, loading);
      setResults(calculationResults);
      setCompletedSteps(prev => [...new Set([...prev, 'calculate' as WorkflowStep, 'curve' as WorkflowStep, 'criteria' as WorkflowStep])]);
      setCurrentStep('results');
      
      toast({
        title: 'Calculations Complete',
        description: 'Stability analysis has been completed successfully.',
        className: 'bg-green-50 border-green-200'
      });
    } catch (error) {
      console.error('Calculation error:', error);
      toast({
        title: 'Calculation Error',
        description: 'An error occurred during calculations. Please check your data.',
        variant: 'destructive'
      });
    } finally {
      setCalculating(false);
    }
  };

  // Render different workflow steps
  const renderVesselStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ship className="h-5 w-5" />
          Step 1: Vessel Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="lpp">LPP (m)</Label>
            <Input
              id="lpp"
              type="number"
              value={vessel?.Lpp || ''}
              onChange={(e) => vessel && setVessel({...vessel, Lpp: parseFloat(e.target.value) || 0})}
              placeholder="120.0"
            />
          </div>
          <div>
            <Label htmlFor="breadth">Breadth (m)</Label>
            <Input
              id="breadth"
              type="number"
              value={vessel?.B || ''}
              onChange={(e) => vessel && setVessel({...vessel, B: parseFloat(e.target.value) || 0})}
              placeholder="20.0"
            />
          </div>
          <div>
            <Label htmlFor="depth">Depth (m)</Label>
            <Input
              id="depth"
              type="number"
              value={vessel?.D || ''}
              onChange={(e) => vessel && setVessel({...vessel, D: parseFloat(e.target.value) || 0})}
              placeholder="12.0"
            />
          </div>
          <div>
            <Label htmlFor="kg">Lightship KG (m)</Label>
            <Input
              id="kg"
              type="number"
              value={vessel?.lightship.KG || ''}
              onChange={(e) => vessel && setVessel({
                ...vessel, 
                lightship: {...vessel.lightship, KG: parseFloat(e.target.value) || 0}
              })}
              placeholder="6.5"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={loadExampleData} variant="outline" className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            Load Example Vessel Data
          </Button>
          <p className="text-sm text-muted-foreground">
            Load sample vessel data including hydrostatic tables and tank geometry
          </p>
        </div>

        {vessel && (
          <div className="mt-4">
            <Badge variant="outline" className="bg-green-50">
              ✓ Vessel data loaded: {vessel.name}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderLoadingStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Step 2: Loading Condition
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && (
          <>
            <div>
              <h4 className="font-semibold mb-2">Loading Items</h4>
              <div className="space-y-2">
                {loading.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2 p-2 bg-gray-50 rounded">
                    <span className="font-medium">{item.name}</span>
                    <span>{item.weight} t</span>
                    <span>LCG: {item.lcg}m</span>
                    <span>VCG: {item.vcg}m</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Tank Fillings</h4>
              <div className="space-y-2">
                {loading.tanks.map((tank, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="font-medium">{tank.id}</span>
                    <Badge variant="secondary">{tank.fill_percent}% full</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <Badge variant="outline" className="bg-green-50">
                ✓ Loading condition configured
              </Badge>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderCalculateStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Step 3: Calculate Stability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={performCalculations} 
          disabled={!vessel || !loading || calculating}
          className="w-full"
          size="lg"
        >
          {calculating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="h-4 w-4 mr-2" />
              Perform Complete Analysis
            </>
          )}
        </Button>

        {results && (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-sm text-blue-600">Total Displacement</div>
                <div className="text-xl font-bold">{results.loadingSummary.total_displacement.toFixed(0)} t</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-sm text-green-600">GM (Corrected)</div>
                <div className="text-xl font-bold">{results.GM_t.toFixed(3)} m</div>
              </div>
            </div>

            {results.warnings.length > 0 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    {results.warnings.map((warning: string, i: number) => (
                      <div key={i} className="text-sm">{warning}</div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderResultsStep = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Results & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {results && (
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="criteria">Criteria</TabsTrigger>
              <TabsTrigger value="curve">GZ Curve</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <div className="text-sm text-blue-600">Displacement</div>
                  <div className="text-lg font-bold">{results.loadingSummary.total_displacement.toFixed(0)} t</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="text-sm text-green-600">GM</div>
                  <div className="text-lg font-bold">{results.GM_t.toFixed(3)} m</div>
                </div>
                <div className="bg-purple-50 p-3 rounded">
                  <div className="text-sm text-purple-600">Max GZ</div>
                  <div className="text-lg font-bold">{results.stabilityCurve.max_GZ.toFixed(3)} m</div>
                </div>
                <div className="bg-orange-50 p-3 rounded">
                  <div className="text-sm text-orange-600">Draft</div>
                  <div className="text-lg font-bold">{results.draftSolution.T_mean.toFixed(2)} m</div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="criteria" className="space-y-4">
              <div className="space-y-2">
                {results.criteriaResults.compliance.map((criterion: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <div className="font-medium">{criterion.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Value: {criterion.value.toFixed(3)} | Required: {criterion.requirement.toFixed(3)}
                      </div>
                    </div>
                    <Badge variant={criterion.passed ? 'default' : 'destructive'}>
                      {criterion.passed ? (
                        <><CheckCircle className="h-3 w-3 mr-1" />PASS</>
                      ) : (
                        <><AlertTriangle className="h-3 w-3 mr-1" />FAIL</>
                      )}
                    </Badge>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="curve" className="space-y-4">
              <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>GZ Curve Visualization</p>
                  <p className="text-sm">(Chart implementation would go here)</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}

        <Separator />

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" className="flex-1">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">Ship Stability Calculator</h2>
            <Badge variant="outline">{Math.round(getProgress())}% Complete</Badge>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex flex-wrap gap-2">
            {(['vessel', 'loading', 'calculate', 'curve', 'criteria', 'results'] as WorkflowStep[]).map((step) => (
              <Button
                key={step}
                variant={currentStep === step ? 'default' : completedSteps.includes(step) ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setCurrentStep(step)}
                className="capitalize"
              >
                {completedSteps.includes(step) && <CheckCircle className="h-3 w-3 mr-1" />}
                {step.replace(/([A-Z])/g, ' $1')}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {currentStep === 'vessel' && renderVesselStep()}
      {currentStep === 'loading' && renderLoadingStep()}
      {currentStep === 'calculate' && renderCalculateStep()}
      {(currentStep === 'curve' || currentStep === 'criteria' || currentStep === 'results') && renderResultsStep()}
    </div>
  );
};

export default StabilityCalculatorWorkflow;