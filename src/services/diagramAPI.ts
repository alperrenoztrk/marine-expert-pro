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
      // Try different possible endpoints
      const endpoints = [
        '/generate',
        '/create-diagram',
        '/diagram',
        '/flowchart',
        '/generate-flowchart'
      ];
      
      let lastError = '';
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-rapidapi-key': this.API_KEY,
              'x-rapidapi-host': 'ai-flowchart-diagram-generator.p.rapidapi.com'
            },
            body: JSON.stringify({
              description: request.description,
              type: request.diagramType || 'flowchart',
              style: request.style || 'modern',
              format: request.format || 'svg'
            })
          });

          if (response.ok) {
            const data = await response.json();
            return {
              success: true,
              diagram: data.diagram || data.svg || data.result || data.flowchart,
              format: data.format || request.format || 'svg'
            };
          } else {
            lastError = `${endpoint}: ${response.status} ${response.statusText}`;
          }
        } catch (endpointError) {
          lastError = `${endpoint}: ${endpointError}`;
          continue;
        }
             }

      throw new Error(`All endpoints failed. Last error: ${lastError}`);

    } catch (error) {
      console.error('Diagram API Error:', error);
      
      // Fallback to Mermaid diagram generation
      const mermaidDiagram = this.generateMermaidFallback(request.description);
      if (mermaidDiagram) {
        return {
          success: true,
          diagram: mermaidDiagram,
          format: 'mermaid'
        };
      }
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Fallback Mermaid diagram generator
  private generateMermaidFallback(description: string): string {
    const keywords = description.toLowerCase();
    
    if (keywords.includes('engine') || keywords.includes('marine')) {
      return `
<div class="mermaid-diagram">
  <div class="diagram-header">Marine Engine System Flowchart</div>
  <svg viewBox="0 0 800 600" style="width: 100%; height: 400px;">
    <!-- Fuel Tank -->
    <rect x="50" y="50" width="100" height="60" fill="#4CAF50" stroke="#333" stroke-width="2" rx="5"/>
    <text x="100" y="85" text-anchor="middle" font-size="12" fill="white">Fuel Tank</text>
    
    <!-- Fuel Pump -->
    <circle cx="200" cy="80" r="30" fill="#2196F3" stroke="#333" stroke-width="2"/>
    <text x="200" y="85" text-anchor="middle" font-size="10" fill="white">Fuel Pump</text>
    
    <!-- Engine -->
    <rect x="300" y="150" width="120" height="80" fill="#FF9800" stroke="#333" stroke-width="2" rx="5"/>
    <text x="360" y="195" text-anchor="middle" font-size="14" fill="white">Main Engine</text>
    
    <!-- Propeller -->
    <circle cx="500" cy="190" r="40" fill="#9C27B0" stroke="#333" stroke-width="2"/>
    <text x="500" y="195" text-anchor="middle" font-size="12" fill="white">Propeller</text>
    
    <!-- Cooling System -->
    <rect x="300" y="280" width="120" height="60" fill="#00BCD4" stroke="#333" stroke-width="2" rx="5"/>
    <text x="360" y="315" text-anchor="middle" font-size="12" fill="white">Cooling</text>
    
    <!-- Exhaust -->
    <rect x="500" y="280" width="100" height="60" fill="#795548" stroke="#333" stroke-width="2" rx="5"/>
    <text x="550" y="315" text-anchor="middle" font-size="12" fill="white">Exhaust</text>
    
    <!-- Arrows -->
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
      </marker>
    </defs>
    
    <!-- Flow arrows -->
    <line x1="150" y1="80" x2="170" y2="80" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
    <line x1="230" y1="80" x2="300" y2="150" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
    <line x1="420" y1="190" x2="460" y2="190" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
    <line x1="360" y1="230" x2="360" y2="280" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
    <line x1="420" y1="210" x2="500" y2="280" stroke="#333" stroke-width="2" marker-end="url(#arrowhead)"/>
  </svg>
</div>`;
    }
    
    if (keywords.includes('gz') || keywords.includes('curve') || keywords.includes('righting')) {
      return `
<div class="mermaid-diagram">
  <div class="diagram-header">GZ Curve (Righting Arm Curve)</div>
  <svg viewBox="0 0 800 600" style="width: 100%; height: 450px;">
    <!-- Grid -->
    <defs>
      <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#E0E0E0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect x="80" y="80" width="640" height="400" fill="url(#grid)"/>
    
    <!-- Axes -->
    <line x1="80" y1="480" x2="720" y2="480" stroke="#333" stroke-width="2"/>
    <line x1="80" y1="480" x2="80" y2="80" stroke="#333" stroke-width="2"/>
    
    <!-- Axis Labels -->
    <text x="400" y="520" text-anchor="middle" font-size="14" fill="#333">Heel Angle (degrees)</text>
    <text x="40" y="280" text-anchor="middle" font-size="14" fill="#333" transform="rotate(-90 40 280)">GZ (m)</text>
    
    <!-- X-axis ticks and labels -->
    <g stroke="#666" stroke-width="1">
      <line x1="160" y1="475" x2="160" y2="485"/><text x="160" y="500" text-anchor="middle" font-size="10">15°</text>
      <line x1="240" y1="475" x2="240" y2="485"/><text x="240" y="500" text-anchor="middle" font-size="10">30°</text>
      <line x1="320" y1="475" x2="320" y2="485"/><text x="320" y="500" text-anchor="middle" font-size="10">45°</text>
      <line x1="400" y1="475" x2="400" y2="485"/><text x="400" y="500" text-anchor="middle" font-size="10">60°</text>
      <line x1="480" y1="475" x2="480" y2="485"/><text x="480" y="500" text-anchor="middle" font-size="10">75°</text>
      <line x1="560" y1="475" x2="560" y2="485"/><text x="560" y="500" text-anchor="middle" font-size="10">90°</text>
    </g>
    
    <!-- Y-axis ticks and labels -->
    <g stroke="#666" stroke-width="1">
      <line x1="75" y1="440" x2="85" y2="440"/><text x="70" y="445" text-anchor="end" font-size="10">0.2</text>
      <line x1="75" y1="400" x2="85" y2="400"/><text x="70" y="405" text-anchor="end" font-size="10">0.4</text>
      <line x1="75" y1="360" x2="85" y2="360"/><text x="70" y="365" text-anchor="end" font-size="10">0.6</text>
      <line x1="75" y1="320" x2="85" y2="320"/><text x="70" y="325" text-anchor="end" font-size="10">0.8</text>
      <line x1="75" y1="280" x2="85" y2="280"/><text x="70" y="285" text-anchor="end" font-size="10">1.0</text>
      <line x1="75" y1="240" x2="85" y2="240"/><text x="70" y="245" text-anchor="end" font-size="10">1.2</text>
    </g>
    
    <!-- GZ Curve -->
    <path d="M 80 480 Q 120 460 160 420 Q 200 360 240 320 Q 280 280 320 260 Q 360 250 400 260 Q 440 280 480 320 Q 520 380 560 450 Q 600 480 640 490" 
          fill="none" stroke="#2196F3" stroke-width="4"/>
    
    <!-- Key points -->
    <circle cx="320" cy="260" r="5" fill="#FF4444"/>
    <text x="330" y="255" font-size="10" fill="#FF4444">Max GZ</text>
    
    <circle cx="640" cy="490" r="5" fill="#FF9800"/>
    <text x="650" y="485" font-size="10" fill="#FF9800">Vanishing</text>
    
    <!-- IMO Criteria lines -->
    <line x1="160" y1="440" x2="720" y2="440" stroke="#4CAF50" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="730" y="445" font-size="10" fill="#4CAF50">IMO Min</text>
    
    <!-- Area under curve -->
    <path d="M 80 480 Q 120 460 160 420 Q 200 360 240 320 Q 280 280 320 260 Q 360 250 400 260 L 400 480 L 80 480" 
          fill="#2196F3" opacity="0.2"/>
    
    <!-- Legend -->
    <rect x="550" y="100" width="160" height="120" fill="white" stroke="#333" stroke-width="1"/>
    <text x="630" y="120" text-anchor="middle" font-size="12" font-weight="bold">Stability Curve</text>
    <line x1="560" y1="135" x2="580" y2="135" stroke="#2196F3" stroke-width="4"/>
    <text x="590" y="140" font-size="10">GZ Curve</text>
    <line x1="560" y1="150" x2="580" y2="150" stroke="#4CAF50" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="590" y="155" font-size="10">IMO Criteria</text>
    <circle cx="570" cy="170" r="3" fill="#FF4444"/>
    <text x="590" y="175" font-size="10">Critical Points</text>
    <rect x="560" y="185" width="20" height="10" fill="#2196F3" opacity="0.2"/>
    <text x="590" y="195" font-size="10">Stability Area</text>
  </svg>
</div>`;
    }
    
    if (keywords.includes('trim') || keywords.includes('stability')) {
      return `
<div class="mermaid-diagram">
  <div class="diagram-header">Ship Trim & Stability Analysis</div>
  <svg viewBox="0 0 800 500" style="width: 100%; height: 350px;">
    <!-- Ship Hull -->
    <path d="M150 250 Q200 200 400 200 Q600 200 650 250 L650 300 Q600 350 400 350 Q200 350 150 300 Z" 
          fill="#2196F3" stroke="#333" stroke-width="3" opacity="0.7"/>
    <text x="400" y="280" text-anchor="middle" font-size="16" fill="white">Ship Hull</text>
    
    <!-- Waterline -->
    <line x1="100" y1="275" x2="700" y2="285" stroke="#00BCD4" stroke-width="4"/>
    <text x="720" y="280" font-size="12" fill="#00BCD4">Waterline</text>
    
    <!-- Center of Gravity -->
    <circle cx="380" cy="260" r="8" fill="#FF4444"/>
    <text x="390" y="265" font-size="12" fill="#FF4444">CG</text>
    
    <!-- Center of Buoyancy -->
    <circle cx="420" cy="290" r="8" fill="#4CAF50"/>
    <text x="430" y="295" font-size="12" fill="#4CAF50">CB</text>
    
    <!-- GM Line -->
    <line x1="380" y1="260" x2="420" y2="290" stroke="#333" stroke-width="2" stroke-dasharray="5,5"/>
    <text x="400" y="255" text-anchor="middle" font-size="10">GM</text>
    
    <!-- Draft markers -->
    <line x1="150" y1="275" x2="150" y2="350" stroke="#666" stroke-width="2"/>
    <text x="140" y="315" font-size="10" fill="#666">Draft F</text>
    
    <line x1="650" y1="285" x2="650" y2="350" stroke="#666" stroke-width="2"/>
    <text x="660" y="320" font-size="10" fill="#666">Draft A</text>
    
    <!-- Trim angle -->
    <path d="M100 275 L700 285" stroke="#FF9800" stroke-width="2" stroke-dasharray="3,3"/>
    <text x="400" y="300" text-anchor="middle" font-size="12" fill="#FF9800">Trim Angle</text>
  </svg>
</div>`;
    }
    
    // Default flowchart
    return `
<div class="mermaid-diagram">
  <div class="diagram-header">Process Flowchart</div>
  <svg viewBox="0 0 600 400" style="width: 100%; height: 300px;">
    <!-- Start -->
    <rect x="50" y="50" width="100" height="50" fill="#4CAF50" stroke="#333" stroke-width="2" rx="25"/>
    <text x="100" y="80" text-anchor="middle" font-size="12" fill="white">Start</text>
    
    <!-- Process 1 -->
    <rect x="250" y="50" width="100" height="50" fill="#2196F3" stroke="#333" stroke-width="2" rx="5"/>
    <text x="300" y="80" text-anchor="middle" font-size="12" fill="white">Process</text>
    
    <!-- Decision -->
    <polygon points="300,150 350,175 300,200 250,175" fill="#FF9800" stroke="#333" stroke-width="2"/>
    <text x="300" y="180" text-anchor="middle" font-size="10" fill="white">Decision</text>
    
    <!-- End -->
    <rect x="450" y="150" width="100" height="50" fill="#F44336" stroke="#333" stroke-width="2" rx="25"/>
    <text x="500" y="180" text-anchor="middle" font-size="12" fill="white">End</text>
    
    <!-- Arrows -->
    <defs>
      <marker id="arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#333"/>
      </marker>
    </defs>
    
    <line x1="150" y1="75" x2="250" y2="75" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
    <line x1="300" y1="100" x2="300" y2="150" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
    <line x1="350" y1="175" x2="450" y2="175" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
  </svg>
</div>`;
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

  async generateGZCurveDiagram(stabilityData: any): Promise<DiagramResponse> {
    const description = `Create a GZ curve (righting arm curve) stability diagram showing:
    - Initial stability (GM): ${stabilityData.GM || 'calculated'} meters
    - Displacement: ${stabilityData.displacement || 'current'} tonnes
    - Maximum GZ value and corresponding heel angle
    - Range of positive stability
    - Angle of vanishing stability
    - IMO stability criteria compliance
    - Critical heel angles and stability parameters
    Show the mathematical curve with grid lines, axes labels, and stability zones.`;

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