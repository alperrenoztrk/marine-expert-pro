import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  FileText,
  Calendar,
  Clock,
  Sun,
  Star,
  Globe
} from 'lucide-react';
import { getSunAriesAlmanac2025Utc, getDailySunAriesAlmanac2025Utc, type DailySunAriesAlmanacRow } from '@/utils/nauticalAlmanac2025';
import { StarPlanetTable } from '@/components/celestial/StarPlanetTable';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDF_PATH = '/Nautical-Almanac-2025.pdf';

export function AlmanacViewer() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(true);
  
  // Live data state
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [dailyData, setDailyData] = useState<DailySunAriesAlmanacRow[] | null>(null);
  const [liveData, setLiveData] = useState<{
    ghaSunDeg: number;
    decSunDeg: number;
    ghaAriesDeg: number;
  } | null>(null);

  // Update live data every second
  useEffect(() => {
    const updateLiveData = () => {
      const now = new Date();
      const result = getSunAriesAlmanac2025Utc(now);
      if (result) {
        setLiveData({
          ghaSunDeg: result.ghaSunDeg,
          decSunDeg: result.decSunDeg,
          ghaAriesDeg: result.ghaAriesDeg
        });
      }
    };
    
    updateLiveData();
    const interval = setInterval(updateLiveData, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update daily data when date changes
  useEffect(() => {
    const date = new Date(selectedDate + 'T00:00:00Z');
    const data = getDailySunAriesAlmanac2025Utc(date);
    setDailyData(data);
  }, [selectedDate]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setIsLoading(false);
  }

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, numPages));
    setPageNumber(validPage);
    setPageInputValue(validPage.toString());
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInputValue(e.target.value);
  };

  const handlePageInputBlur = () => {
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page)) {
      goToPage(page);
    } else {
      setPageInputValue(pageNumber.toString());
    }
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  const formatDegrees = (deg: number): string => {
    const d = Math.floor(Math.abs(deg));
    const m = ((Math.abs(deg) - d) * 60).toFixed(1);
    const sign = deg < 0 ? '-' : '';
    return `${sign}${d}° ${m}'`;
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="pdf" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/80 border border-white/60">
          <TabsTrigger value="pdf" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            PDF
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            Güneş/Aries
          </TabsTrigger>
          <TabsTrigger value="stars" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Yıldız & Gezegen
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pdf" className="mt-4">
          <Card className="bg-white/90 border-white/60 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                <FileText className="h-5 w-5" />
                2025 Nautical Almanac
              </CardTitle>
              <CardDescription>
                Tam sürüm PDF almanac görüntüleyici
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Navigation Controls */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => goToPage(pageNumber - 1)}
                    disabled={pageNumber <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <Input
                      type="text"
                      value={pageInputValue}
                      onChange={handlePageInputChange}
                      onBlur={handlePageInputBlur}
                      onKeyDown={handlePageInputKeyDown}
                      className="w-16 text-center"
                    />
                    <span className="text-sm text-muted-foreground">/ {numPages}</span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => goToPage(pageNumber + 1)}
                    disabled={pageNumber >= numPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setScale(s => Math.max(0.5, s - 0.25))}
                    disabled={scale <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-mono w-12 text-center">{Math.round(scale * 100)}%</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setScale(s => Math.min(2, s + 0.25))}
                    disabled={scale >= 2}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Month Navigation */}
              <div className="flex flex-wrap gap-1">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => (
                  <Button
                    key={month}
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1"
                    onClick={() => goToPage(10 + idx * 25)} // Approximate page per month
                  >
                    {month}
                  </Button>
                ))}
              </div>

              {/* PDF Viewer */}
              <ScrollArea className="h-[500px] w-full border rounded-lg bg-slate-100">
                <div className="flex justify-center p-4 min-h-full">
                  {isLoading && (
                    <div className="flex items-center justify-center h-96">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2F5BFF]"></div>
                    </div>
                  )}
                  <Document
                    file={PDF_PATH}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                  >
                    <Page 
                      pageNumber={pageNumber} 
                      scale={scale}
                      loading={
                        <div className="flex items-center justify-center h-96">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2F5BFF]"></div>
                        </div>
                      }
                    />
                  </Document>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="mt-4 space-y-4">
          {/* Live Data Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                <Clock className="h-5 w-5" />
                Anlık Almanac Verileri (UTC)
              </CardTitle>
              <CardDescription>
                Gerçek zamanlı GHA ve Dec değerleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              {liveData ? (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-muted-foreground mb-1">GHA Sun</div>
                    <div className="text-lg font-mono font-bold text-[#2F5BFF]">
                      {formatDegrees(liveData.ghaSunDeg)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-muted-foreground mb-1">Dec Sun</div>
                    <div className="text-lg font-mono font-bold text-[#2F5BFF]">
                      {formatDegrees(liveData.decSunDeg)}
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="text-xs text-muted-foreground mb-1">GHA Aries</div>
                    <div className="text-lg font-mono font-bold text-[#2F5BFF]">
                      {formatDegrees(liveData.ghaAriesDeg)}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">2025 yılı dışında veri mevcut değil</p>
              )}
            </CardContent>
          </Card>

          {/* Daily Data Card */}
          <Card className="bg-white/90 border-white/60 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-[#2F5BFF]">
                <Calendar className="h-5 w-5" />
                Günlük Almanac Tablosu
              </CardTitle>
              <CardDescription>
                Seçilen tarih için saatlik değerler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="date-picker">Tarih:</Label>
                <Input
                  id="date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min="2025-01-01"
                  max="2025-12-31"
                  className="w-auto"
                />
              </div>

              {dailyData ? (
                <ScrollArea className="h-[300px]">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-100 sticky top-0">
                      <tr>
                        <th className="text-left p-2 font-medium">UTC</th>
                        <th className="text-right p-2 font-medium">GHA Sun</th>
                        <th className="text-right p-2 font-medium">Dec Sun</th>
                        <th className="text-right p-2 font-medium">GHA Aries</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dailyData.map((row) => (
                        <tr key={row.utcHour} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-2 font-mono">{row.utcHour.toString().padStart(2, '0')}:00</td>
                          <td className="p-2 text-right font-mono">{formatDegrees(row.ghaSunDeg)}</td>
                          <td className="p-2 text-right font-mono">{formatDegrees(row.decSunDeg)}</td>
                          <td className="p-2 text-right font-mono">{formatDegrees(row.ghaAriesDeg)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Lütfen 2025 yılından bir tarih seçin
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stars" className="mt-4">
          <StarPlanetTable selectedDate={new Date(selectedDate)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
