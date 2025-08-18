import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DraftSurveyAnalysis = () => {
  const navigate = useNavigate();
  const [vesselName, setVesselName] = useState("");
  const [surveyDate, setSurveyDate] = useState("");
  const [loadedCargo, setLoadedCargo] = useState("");
  const [dischargeCargo, setDischargeCargo] = useState("");
  const [observations, setObservations] = useState("");
  const [report, setReport] = useState<any>(null);

  const generateReport = () => {
    const loaded = parseFloat(loadedCargo);
    const discharged = parseFloat(dischargeCargo);
    
    if (loaded && discharged) {
      const netCargo = loaded - discharged;
      const efficiency = (discharged / loaded) * 100;
      
      setReport({
        vesselName,
        surveyDate,
        loadedCargo: loaded,
        dischargeCargo: discharged,
        netCargo,
        efficiency,
        observations
      });
    }
  };

  const downloadReport = () => {
    if (!report) return;
    
    const reportContent = `
DRAFT SURVEY RAPORU
==================

Gemi Adı: ${report.vesselName}
Tarih: ${report.surveyDate}

KARGO BİLGİLERİ:
- Yüklenen Kargo: ${report.loadedCargo.toFixed(2)} ton
- Boşaltılan Kargo: ${report.dischargeCargo.toFixed(2)} ton
- Net Kargo: ${report.netCargo.toFixed(2)} ton
- Verimlilik: ${report.efficiency.toFixed(2)}%

GÖZLEMLER:
${report.observations}

Rapor Tarihi: ${new Date().toLocaleDateString('tr-TR')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `draft-survey-report-${report.vesselName}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analiz & Rapor</h1>
          <p className="text-muted-foreground">Sonuç analizi ve raporlama</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Rapor Bilgileri
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vessel-name">Gemi Adı</Label>
              <Input
                id="vessel-name"
                value={vesselName}
                onChange={(e) => setVesselName(e.target.value)}
                placeholder="M/V EXAMPLE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="survey-date">Survey Tarihi</Label>
              <Input
                id="survey-date"
                type="date"
                value={surveyDate}
                onChange={(e) => setSurveyDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loaded-cargo">Yüklenen Kargo (ton)</Label>
              <Input
                id="loaded-cargo"
                type="number"
                step="0.1"
                value={loadedCargo}
                onChange={(e) => setLoadedCargo(e.target.value)}
                placeholder="25000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="discharge-cargo">Boşaltılan Kargo (ton)</Label>
              <Input
                id="discharge-cargo"
                type="number"
                step="0.1"
                value={dischargeCargo}
                onChange={(e) => setDischargeCargo(e.target.value)}
                placeholder="24800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Gözlemler ve Notlar</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Survey sırasında yapılan gözlemler, özel durumlar ve notlar..."
              rows={4}
            />
          </div>

          <Button onClick={generateReport} className="w-full">
            Rapor Oluştur
          </Button>
        </CardContent>
      </Card>

      {report && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Survey Raporu</span>
              <Button onClick={downloadReport} size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                İndir
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Gemi</p>
                  <p className="font-semibold">{report.vesselName}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Tarih</p>
                  <p className="font-semibold">{report.surveyDate}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Yüklenen</p>
                  <p className="text-lg font-semibold">{report.loadedCargo.toFixed(2)} ton</p>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Boşaltılan</p>
                  <p className="text-lg font-semibold">{report.dischargeCargo.toFixed(2)} ton</p>
                </div>
                <div className="text-center p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">Verimlilik</p>
                  <p className="text-lg font-semibold">{report.efficiency.toFixed(2)}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Net Kargo Farkı</p>
                <p className="text-lg font-semibold text-primary">{report.netCargo.toFixed(2)} ton</p>
              </div>

              {report.observations && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Gözlemler</p>
                  <p className="text-sm bg-secondary/20 p-3 rounded-lg">{report.observations}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DraftSurveyAnalysis;