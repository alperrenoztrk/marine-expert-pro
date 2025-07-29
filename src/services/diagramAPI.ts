interface DiagramRequest {
  description: string;
  diagramType?: 'flowchart' | 'sequence' | 'gantt' | 'pie' | 'mindmap';
  style?: 'modern' | 'classic' | 'minimal';
  format?: 'svg' | 'png' | 'mermaid';
}

interface DiagramResponse {
  success: boolean;
  diagram?: string;
  format?: string;
  error?: string;
}

class DiagramAPIService {
  private readonly API_KEY = 'c42914d723msh5407abeae149ee7p1bfa4fjsn0649a2daef19';
  private readonly BASE_URL = 'https://ai-flowchart-diagram-generator.p.rapidapi.com';

  async generateDiagram(request: DiagramRequest): Promise<DiagramResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-key': this.API_KEY,
        },
        body: JSON.stringify({
          description: request.description,
          diagram_type: request.diagramType || 'flowchart',
          style: request.style || 'modern',
          format: request.format || 'svg'
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        diagram: data.diagram || data.svg || data.result,
        format: data.format || request.format || 'svg'
      };

    } catch (error) {
      console.error('Diagram API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Maritime-specific diagram generators
  async generateEngineFlowChart(engineData: any): Promise<DiagramResponse> {
    const description = `Create a marine engine system flowchart showing:
    - Main engine power: ${engineData.mcrPower} kW
    - Current load: ${engineData.currentLoad}%
    - Fuel system: ${engineData.fuelType} fuel flow
    - Cooling system: seawater inlet ${engineData.seawaterInletTemp}°C
    - Exhaust system with emissions control
    - Power transmission to propeller
    Include fuel injection, turbocharger, intercooler, and exhaust gas cleaning systems.`;

    return this.generateDiagram({
      description,
      diagramType: 'flowchart',
      style: 'modern'
    });
  }

  async generateTrimDiagram(trimData: any): Promise<DiagramResponse> {
    const description = `Create a ship trim and stability diagram showing:
    - Ship length: ${trimData.L} meters
    - Forward draft: ${trimData.draftForward} m
    - Aft draft: ${trimData.draftAft} m
    - Trim angle calculation
    - Weight distribution and center of gravity
    - Metacentric height GM
    - Stability curve
    Show the ship profile with waterlines and load condition.`;

    return this.generateDiagram({
      description,
      diagramType: 'flowchart',
      style: 'modern'
    });
  }

  async generateSafetyEvacuationDiagram(safetyData: any): Promise<DiagramResponse> {
    const description = `Create a ship emergency evacuation flowchart showing:
    - Emergency alarm activation
    - Muster station procedures
    - Lifeboat and life raft deployment
    - Abandon ship sequence
    - Communication protocols
    - Search and rescue coordination
    Include decision points for different emergency scenarios (fire, flooding, collision).`;

    return this.generateDiagram({
      description,
      diagramType: 'flowchart',
      style: 'modern'
    });
  }

  async generateEmissionControlDiagram(emissionData: any): Promise<DiagramResponse> {
    const description = `Create an emission control system diagram showing:
    - Engine exhaust gas flow
    - SCR (Selective Catalytic Reduction) system
    - Scrubber/EGCS system
    - NOx reduction process
    - SOx removal process
    - Monitoring and compliance systems
    - MARPOL Annex VI compliance flow
    Include emission measurement points and control strategies.`;

    return this.generateDiagram({
      description,
      diagramType: 'flowchart',
      style: 'modern'
    });
  }

  async generateCargoOperationDiagram(cargoData: any): Promise<DiagramResponse> {
    const description = `Create a cargo operation flowchart showing:
    - Pre-loading inspection
    - Cargo loading sequence
    - Ballast water management
    - Trim and stability monitoring
    - Cargo securing procedures
    - Documentation and compliance
    - Port departure clearance
    Include safety checkpoints and operational decision points.`;

    return this.generateDiagram({
      description,
      diagramType: 'flowchart',
      style: 'modern'
    });
  }

  async generateStructuralAnalysisDiagram(structuralData: any): Promise<DiagramResponse> {
    const description = `Create a structural analysis flowchart showing:
    - Load identification and calculation
    - Stress analysis procedures
    - Safety factor verification
    - Material property evaluation
    - Fatigue analysis process
    - Inspection and maintenance planning
    - Structural integrity assessment
    Include decision trees for structural modifications.`;

    return this.generateDiagram({
      description,
      diagramType: 'flowchart',
      style: 'modern'
    });
  }
}

export const diagramAPI = new DiagramAPIService();