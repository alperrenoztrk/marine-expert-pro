import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Maximize2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { diagramAPI } from "@/services/diagramAPI";

interface DiagramViewerProps {
  title: string;
  description?: string;
  data: any;
  diagramType: 'engine' | 'trim' | 'safety' | 'emission' | 'cargo' | 'structural' | 'gz-curve';
  className?: string;
}

export const DiagramViewer = ({ 
  title, 
  description, 
  data, 
  diagramType, 
  className = "" 
}: DiagramViewerProps) => {
  const [diagram, setDiagram] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { toast } = useToast();

  const generateDiagram = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let response;
      
      switch (diagramType) {
        case 'engine':
          response = await diagramAPI.generateEngineFlowChart(data);
          break;
        case 'trim':
          response = await diagramAPI.generateTrimDiagram(data);
          break;
        case 'safety':
          response = await diagramAPI.generateSafetyEvacuationDiagram(data);
          break;
        case 'emission':
          response = await diagramAPI.generateEmissionControlDiagram(data);
          break;
        case 'cargo':
          response = await diagramAPI.generateCargoOperationDiagram(data);
          break;
        case 'structural':
          response = await diagramAPI.generateStructuralAnalysisDiagram(data);
          break;
        case 'gz-curve':
          response = await diagramAPI.generateGZCurveDiagram(data);
          break;
        default:
          throw new Error('Unsupported diagram type');
      }

      if (response.success && response.diagram) {
        setDiagram(response.diagram);
        toast({
          title: "Diyagram Oluşturuldu! 🎉",
          description: "AI destekli diyagramınız başarıyla hazırlandı.",
        });
      } else {
        throw new Error(response.error || 'Diagram generation failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setError(errorMessage);
      toast({
        title: "Diyagram Hatası ❌",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDiagram = () => {
    if (!diagram) return;
    
    const blob = new Blob([diagram], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}_diagram.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "İndirildi! 📥",
      description: "Diyagram SVG formatında indirildi.",
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <>
      <Card className={`${className} ${isFullscreen ? 'fixed inset-0 z-50 m-4' : ''}`}>
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                📊 {title}
              </CardTitle>
              {description && (
                <CardDescription className="mt-2">
                  {description}
                </CardDescription>
              )}
            </div>
            <div className="flex gap-2">
              {diagram && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={downloadDiagram}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    İndir
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleFullscreen}
                    className="gap-2"
                  >
                    <Maximize2 className="h-4 w-4" />
                    {isFullscreen ? 'Küçült' : 'Büyüt'}
                  </Button>
                </>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateDiagram}
                disabled={isLoading}
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    {diagram ? 'Yenile' : 'Diyagram Oluştur'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-700 text-sm">
                <strong>Hata:</strong> {error}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Diyagram Oluşturuluyor...</p>
                <p className="text-sm text-gray-500 mt-1">
                  Bu işlem 10-30 saniye sürebilir
                </p>
              </div>
            </div>
          )}

          {diagram && !isLoading && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border">
                <div 
                  className="w-full overflow-auto"
                  style={{ maxHeight: isFullscreen ? 'calc(100vh - 200px)' : '500px' }}
                >
                  <div dangerouslySetInnerHTML={{ __html: diagram }} />
                </div>
              </div>
              
              <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                <span>Teknik Diyagram Sistemi</span>
              </div>
            </div>
          )}

          {!diagram && !isLoading && !error && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                📊
              </div>
              <div className="text-center">
                <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Diyagram Hazır Değil</p>
                <p className="text-sm text-gray-500 mt-1">
                  Hesaplama verilerinizi analiz ederek teknik diyagram oluşturun
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </>
  );
};