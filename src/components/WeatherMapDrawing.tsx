import React, { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Line, Text, Path, Group, FabricObject } from "fabric";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Wind,
  CloudRain,
  Sun,
  Thermometer,
  Activity,
  Download,
  Trash2,
  Info,
  Gauge,
  TrendingDown,
  TrendingUp,
  Circle as CircleIcon,
  Minus,
  Move
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Tool = "select" | "high" | "low" | "cold-front" | "warm-front" | "stationary-front" | "occluded-front" | "isobar";

export const WeatherMapDrawing = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [isobarPressure, setIsobarPressure] = useState(1013);
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: Math.min(window.innerWidth - 40, 1200),
      height: 700,
      backgroundColor: "#f0f9ff",
    });

    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.selection = activeTool === "select";

    const handleClick = (e: any) => {
      if (activeTool === "select" || !e.pointer) return;

      const pointer = fabricCanvas.getPointer(e.e);

      switch (activeTool) {
        case "high":
          addHighPressure(pointer.x, pointer.y);
          break;
        case "low":
          addLowPressure(pointer.x, pointer.y);
          break;
      }
    };

    const handleMouseDown = (e: any) => {
      if (!e.pointer) return;

      const pointer = fabricCanvas.getPointer(e.e);

      if (activeTool === "cold-front") {
        startDrawingFront("cold", pointer);
      } else if (activeTool === "warm-front") {
        startDrawingFront("warm", pointer);
      } else if (activeTool === "stationary-front") {
        startDrawingFront("stationary", pointer);
      } else if (activeTool === "occluded-front") {
        startDrawingFront("occluded", pointer);
      } else if (activeTool === "isobar") {
        startDrawingIsobar(pointer);
      }
    };

    fabricCanvas.on("mouse:down", handleMouseDown);
    fabricCanvas.on("mouse:up", handleClick);

    return () => {
      fabricCanvas.off("mouse:down", handleMouseDown);
      fabricCanvas.off("mouse:up", handleClick);
    };
  }, [fabricCanvas, activeTool, isobarPressure]);

  const addHighPressure = (x: number, y: number) => {
    if (!fabricCanvas) return;

    const circle = new Circle({
      left: x - 40,
      top: y - 40,
      radius: 40,
      fill: "transparent",
      stroke: "#3b82f6",
      strokeWidth: 3,
    });

    const text = new Text("H", {
      left: x - 15,
      top: y - 20,
      fontSize: 40,
      fontWeight: "bold",
      fill: "#3b82f6",
      fontFamily: "Arial",
    });

    const label = new Text("1025 hPa", {
      left: x - 35,
      top: y + 25,
      fontSize: 14,
      fill: "#1e40af",
      fontFamily: "Arial",
    });

    const group = new Group([circle, text, label], {
      left: x - 40,
      top: y - 40,
      selectable: true,
    });

    fabricCanvas.add(group);
    fabricCanvas.renderAll();
    
    toast({
      title: "Yüksek Basınç Eklendi",
      description: "Antisiklon (H) sistemi haritaya yerleştirildi",
    });
  };

  const addLowPressure = (x: number, y: number) => {
    if (!fabricCanvas) return;

    const circle = new Circle({
      left: x - 40,
      top: y - 40,
      radius: 40,
      fill: "transparent",
      stroke: "#ef4444",
      strokeWidth: 3,
    });

    const text = new Text("L", {
      left: x - 12,
      top: y - 20,
      fontSize: 40,
      fontWeight: "bold",
      fill: "#ef4444",
      fontFamily: "Arial",
    });

    const label = new Text("995 hPa", {
      left: x - 30,
      top: y + 25,
      fontSize: 14,
      fill: "#991b1b",
      fontFamily: "Arial",
    });

    const group = new Group([circle, text, label], {
      left: x - 40,
      top: y - 40,
      selectable: true,
    });

    fabricCanvas.add(group);
    fabricCanvas.renderAll();
    
    toast({
      title: "Alçak Basınç Eklendi",
      description: "Siklon (L) sistemi haritaya yerleştirildi",
    });
  };

  const startDrawingFront = (type: "cold" | "warm" | "stationary" | "occluded", startPoint: { x: number; y: number }) => {
    if (!fabricCanvas) return;

    let isDrawing = true;
    const points: { x: number; y: number }[] = [startPoint];

    const handleMouseMove = (e: any) => {
      if (!isDrawing) return;
      const pointer = fabricCanvas.getPointer(e.e);
      points.push({ x: pointer.x, y: pointer.y });
      
      // Draw temporary line
      fabricCanvas.remove(...fabricCanvas.getObjects().filter((obj: any) => obj.temp));
      
      const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const tempLine = new Path(pathString, {
        stroke: type === "cold" ? "#3b82f6" : type === "warm" ? "#ef4444" : "#8b5cf6",
        strokeWidth: 3,
        fill: "",
        selectable: false,
        temp: true,
      } as any);
      
      fabricCanvas.add(tempLine);
      fabricCanvas.renderAll();
    };

    const handleMouseUp = () => {
      isDrawing = false;
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
      
      // Remove temporary line
      fabricCanvas.remove(...fabricCanvas.getObjects().filter((obj: any) => obj.temp));
      
      // Create final front line with symbols
      createFrontLine(type, points);
    };

    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);
  };

  const createFrontLine = (type: "cold" | "warm" | "stationary" | "occluded", points: { x: number; y: number }[]) => {
    if (!fabricCanvas || points.length < 2) return;

    const objects: FabricObject[] = [];

    // Draw main line
    const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const mainLine = new Path(pathString, {
      stroke: type === "cold" ? "#3b82f6" : type === "warm" ? "#ef4444" : type === "stationary" ? "#8b5cf6" : "#f59e0b",
      strokeWidth: 3,
      fill: "",
      selectable: false,
    });
    objects.push(mainLine);

    // Add symbols along the line
    const symbolSpacing = 50;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dist = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
      const numSymbols = Math.floor(dist / symbolSpacing);

      for (let j = 1; j <= numSymbols; j++) {
        const t = j / (numSymbols + 1);
        const x = p1.x + t * (p2.x - p1.x);
        const y = p1.y + t * (p2.y - p1.y);
        
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;

        if (type === "cold") {
          // Cold front: triangles
          const triangle = new Path("M 0 0 L 10 15 L -10 15 Z", {
            left: x,
            top: y,
            fill: "#3b82f6",
            angle: angle + 90,
            selectable: false,
            originX: "center",
            originY: "center",
          });
          objects.push(triangle);
        } else if (type === "warm") {
          // Warm front: semicircles
          const semicircle = new Circle({
            left: x,
            top: y,
            radius: 8,
            fill: "#ef4444",
            angle: angle,
            selectable: false,
            originX: "center",
            originY: "center",
          });
          objects.push(semicircle);
        } else if (type === "stationary") {
          // Stationary front: alternating triangles and semicircles
          if (j % 2 === 0) {
            const triangle = new Path("M 0 0 L 10 15 L -10 15 Z", {
              left: x,
              top: y,
              fill: "#8b5cf6",
              angle: angle + 90,
              selectable: false,
              originX: "center",
              originY: "center",
            });
            objects.push(triangle);
          } else {
            const semicircle = new Circle({
              left: x,
              top: y,
              radius: 8,
              fill: "#8b5cf6",
              angle: angle,
              selectable: false,
              originX: "center",
              originY: "center",
            });
            objects.push(semicircle);
          }
        } else if (type === "occluded") {
          // Occluded front: triangles and semicircles together
          const triangle = new Path("M 0 -8 L 8 7 L -8 7 Z", {
            left: x - 5,
            top: y,
            fill: "#f59e0b",
            angle: angle + 90,
            selectable: false,
            originX: "center",
            originY: "center",
          });
          const semicircle = new Circle({
            left: x + 5,
            top: y,
            radius: 6,
            fill: "#f59e0b",
            angle: angle,
            selectable: false,
            originX: "center",
            originY: "center",
          });
          objects.push(triangle, semicircle);
        }
      }
    }

    const group = new Group(objects, {
      selectable: true,
    });

    fabricCanvas.add(group);
    fabricCanvas.renderAll();

    const frontNames = {
      cold: "Soğuk Cephe",
      warm: "Sıcak Cephe",
      stationary: "Durağan Cephe",
      occluded: "Tıkanık Cephe",
    };

    toast({
      title: `${frontNames[type]} Eklendi`,
      description: "Cephe çizgisi haritaya çizildi",
    });
  };

  const startDrawingIsobar = (startPoint: { x: number; y: number }) => {
    if (!fabricCanvas) return;

    let isDrawing = true;
    const points: { x: number; y: number }[] = [startPoint];

    const handleMouseMove = (e: any) => {
      if (!isDrawing) return;
      const pointer = fabricCanvas.getPointer(e.e);
      points.push({ x: pointer.x, y: pointer.y });
      
      // Draw temporary line
      fabricCanvas.remove(...fabricCanvas.getObjects().filter((obj: any) => obj.temp));
      
      const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      const tempLine = new Path(pathString, {
        stroke: "#64748b",
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        fill: "",
        selectable: false,
        temp: true,
      } as any);
      
      fabricCanvas.add(tempLine);
      fabricCanvas.renderAll();
    };

    const handleMouseUp = () => {
      isDrawing = false;
      fabricCanvas.off("mouse:move", handleMouseMove);
      fabricCanvas.off("mouse:up", handleMouseUp);
      
      // Remove temporary line
      fabricCanvas.remove(...fabricCanvas.getObjects().filter((obj: any) => obj.temp));
      
      // Create final isobar with label
      if (points.length >= 2) {
        const pathString = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        const isobarLine = new Path(pathString, {
          stroke: "#64748b",
          strokeWidth: 2,
          fill: "",
          selectable: false,
        });

        // Add pressure label
        const midPoint = points[Math.floor(points.length / 2)];
        const pressureLabel = new Text(`${isobarPressure} hPa`, {
          left: midPoint.x,
          top: midPoint.y - 20,
          fontSize: 12,
          fill: "#475569",
          backgroundColor: "#f0f9ff",
          fontFamily: "Arial",
        });

        const group = new Group([isobarLine, pressureLabel], {
          selectable: true,
        });

        fabricCanvas.add(group);
        fabricCanvas.renderAll();

        toast({
          title: "İzobar Eklendi",
          description: `${isobarPressure} hPa basınç çizgisi eklendi`,
        });
      }
    };

    fabricCanvas.on("mouse:move", handleMouseMove);
    fabricCanvas.on("mouse:up", handleMouseUp);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#f0f9ff";
    fabricCanvas.renderAll();
    toast({
      title: "Harita Temizlendi",
      description: "Tüm çizimler silindi",
    });
  };

  const handleExport = () => {
    if (!fabricCanvas) return;
    
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement('a');
    link.download = `weather-map-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    toast({
      title: "Harita İndirildi",
      description: "Hava haritası PNG olarak kaydedildi",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            Hava Haritası Çizim Aracı
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Bu araçla hava haritaları üzerinde basınç sistemleri, cepheler ve izobar çizgileri çizerek 
              meteorolojik analiz yapabilirsiniz. Bir araç seçin ve harita üzerine tıklayarak çizim yapın.
            </AlertDescription>
          </Alert>

          {/* Tool Selection */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Basınç Sistemleri</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeTool === "select" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("select")}
                className="gap-2"
              >
                <Move className="h-4 w-4" />
                Seç/Taşı
              </Button>
              <Button
                variant={activeTool === "high" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("high")}
                className="gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Yüksek Basınç (H)
              </Button>
              <Button
                variant={activeTool === "low" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("low")}
                className="gap-2"
              >
                <TrendingDown className="h-4 w-4" />
                Alçak Basınç (L)
              </Button>
            </div>

            <Separator />

            <h3 className="font-semibold text-sm">Hava Cepheleri</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={activeTool === "cold-front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("cold-front")}
                className="gap-2"
              >
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                  Soğuk Cephe
                </div>
              </Button>
              <Button
                variant={activeTool === "warm-front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("warm-front")}
                className="gap-2"
              >
                <div className="flex items-center gap-1">
                  <CircleIcon className="h-3 w-3 fill-red-600 text-red-600" />
                  Sıcak Cephe
                </div>
              </Button>
              <Button
                variant={activeTool === "stationary-front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("stationary-front")}
                className="gap-2"
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-600 rounded-full" />
                  <div className="w-2 h-2 bg-purple-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                  Durağan Cephe
                </div>
              </Button>
              <Button
                variant={activeTool === "occluded-front" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("occluded-front")}
                className="gap-2"
              >
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-orange-600 rounded-full" />
                  <div className="w-2 h-2 bg-orange-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                  Tıkanık Cephe
                </div>
              </Button>
            </div>

            <Separator />

            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              İzobar (Basınç Çizgileri)
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm">Basınç (hPa):</label>
                <input
                  type="number"
                  value={isobarPressure}
                  onChange={(e) => setIsobarPressure(Number(e.target.value))}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  min="940"
                  max="1050"
                  step="4"
                />
              </div>
              <Button
                variant={activeTool === "isobar" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveTool("isobar")}
                className="gap-2"
              >
                <Minus className="h-4 w-4" />
                İzobar Çiz
              </Button>
            </div>

            <Separator />

            <div className="flex gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClear}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Temizle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                PNG İndir
              </Button>
            </div>
          </div>

          {/* Canvas */}
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <canvas ref={canvasRef} className="max-w-full" />
          </div>

          {/* Legend */}
          <Card className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950 dark:to-sky-950">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="h-5 w-5" />
                Sembol Açıklamaları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 font-bold">H</span>
                    Yüksek Basınç (Antisiklon)
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">Açık hava, hafif rüzgarlar</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 font-bold">L</span>
                    Alçak Basınç (Siklon)
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">Kötü hava, kuvvetli rüzgarlar</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                      <div className="w-6 h-0.5 bg-blue-600" />
                    </div>
                    Soğuk Cephe
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">Soğuk hava kütlesi ilerliyor</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <div className="flex items-center">
                      <CircleIcon className="h-3 w-3 fill-red-600 text-red-600" />
                      <div className="w-6 h-0.5 bg-red-600" />
                    </div>
                    Sıcak Cephe
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">Sıcak hava kütlesi ilerliyor</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <div className="w-2 h-2 bg-purple-600 rounded-full" />
                      <div className="w-2 h-2 bg-purple-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                      <div className="w-4 h-0.5 bg-purple-600" />
                    </div>
                    Durağan Cephe
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">İki hava kütlesi dengede</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <div className="w-2 h-2 bg-orange-600 rounded-full" />
                      <div className="w-2 h-2 bg-orange-600" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
                      <div className="w-4 h-0.5 bg-orange-600" />
                    </div>
                    Tıkanık Cephe
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">Soğuk cephe sıcak cepheyi yakaladı</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold flex items-center gap-2">
                    <div className="w-8 h-0.5 border-t-2 border-dashed border-gray-600" />
                    İzobar
                  </p>
                  <p className="text-xs text-muted-foreground ml-10">Eşit basınç çizgisi (hPa)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
