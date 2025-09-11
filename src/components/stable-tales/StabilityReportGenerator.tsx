import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Download, Printer, Mail } from "lucide-react";
import { toast } from "sonner";
import { StableTalesEngine } from "./StableTalesCalculationEngine";
import { StableTalesInput, StabilityReport } from "./StableTalesTypes";

export const StabilityReportGenerator = () => {
  const [reportData, setReportData] = useState({
    gemi_adi: "M/V Example Ship",
    kaptan_adi: "Kaptan Mehmet Özkan",
    liman: "İstanbul",
    tarih: new Date().toISOString().split('T')[0],
    voyage_no: "2024-001",
    rapor_tipi: "departure",
    ek_notlar: ""
  });

  const [vesselData, setVesselData] = useState({
    deplasman: 25000,
    km: 8.5,
    kg: 7.2,
    loa: 180,
    boa: 32,
    draft: 8.5,
    imo_no: "1234567",
    call_sign: "TCXY",
    mmsi: "271000123"
  });

  const [generatedReport, setGeneratedReport] = useState<string>("");
  const [reportGenerated, setReportGenerated] = useState(false);

  const generateReport = () => {
    try {
      const input: StableTalesInput = {
        deplasman: vesselData.deplasman,
        km: vesselData.km,
        kg: vesselData.kg
      };

      const results = StableTalesEngine.kapsamliHesaplama(input);
      
      const report = `
STABILITE RAPORU
================

GEMİ BİLGİLERİ
--------------
Gemi Adı           : ${reportData.gemi_adi}
IMO Numarası       : ${vesselData.imo_no}
Çağrı İşareti      : ${vesselData.call_sign}
MMSI              : ${vesselData.mmsi}
LOA               : ${vesselData.loa} m
BOA               : ${vesselData.boa} m

OPERASYONEL BİLGİLER
-------------------
Kaptan            : ${reportData.kaptan_adi}
Liman             : ${reportData.liman}
Tarih             : ${reportData.tarih}
Sefer No          : ${reportData.voyage_no}
Rapor Tipi        : ${reportData.rapor_tipi === 'departure' ? 'Hareket Öncesi' : reportData.rapor_tipi === 'arrival' ? 'Varış Sonrası' : 'Operasyonel'}

YÜKLEME DURUMU
--------------
Deplasman         : ${vesselData.deplasman.toLocaleString()} ton
Ortalama Draft    : ${vesselData.draft} m
KM                : ${vesselData.km.toFixed(3)} m
KG                : ${vesselData.kg.toFixed(3)} m
GM                : ${results.gm.toFixed(3)} m

STABİLİTE ANALİZİ
----------------
İlk Stabilite     : ${results.gm >= 0.15 ? 'UYGUN' : 'UYGUN DEĞİL'} (GM = ${results.gm.toFixed(3)} m)
Serbest Yüzey Etkisi : ${results.fsm.toFixed(3)} m
Düzeltilmiş GM    : ${(results.gm - results.fsm).toFixed(3)} m
GZ (15°)          : ${results.gz.toFixed(3)} m
Yalpa Periyodu    : ${results.yalpa_periyodu.toFixed(1)} saniye

SOLAS KRİTERLERİ KONTROLÜ
------------------------
Area 0-30°        : ${results.solas_uygunluk.alan_0_30.deger.toFixed(4)} m.rad (Min: ${results.solas_uygunluk.alan_0_30.kriter.toFixed(3)}) ${results.solas_uygunluk.alan_0_30.uygun ? '✓' : '✗'}
Area 0-40°        : ${results.solas_uygunluk.alan_0_40.deger.toFixed(4)} m.rad (Min: ${results.solas_uygunluk.alan_0_40.kriter.toFixed(3)}) ${results.solas_uygunluk.alan_0_40.uygun ? '✓' : '✗'}
Area 30-40°       : ${results.solas_uygunluk.alan_30_40.deger.toFixed(4)} m.rad (Min: ${results.solas_uygunluk.alan_30_40.kriter.toFixed(3)}) ${results.solas_uygunluk.alan_30_40.uygun ? '✓' : '✗'}
Max GZ            : ${results.solas_uygunluk.max_gz.deger.toFixed(3)} m (Min: ${results.solas_uygunluk.max_gz.kriter.toFixed(3)}) ${results.solas_uygunluk.max_gz.uygun ? '✓' : '✗'}
İlk GM            : ${results.solas_uygunluk.gm.deger.toFixed(3)} m (Min: ${results.solas_uygunluk.gm.kriter.toFixed(3)}) ${results.solas_uygunluk.gm.uygun ? '✓' : '✗'}

GENEL UYGUNLUK    : ${results.solas_uygunluk.genel_uygunluk ? 'UYGUN - TÜM KRİTERLER SAĞLANDI' : 'UYGUN DEĞİL - KRİTERLER BAŞARISIZ'}

DİNAMİK STABİLİTE
-----------------
Dinamik Stabilite Alanı : ${results.dinamik_stabilite.toFixed(4)} m.rad

GÜVENLİK DEĞERLENDİRMESİ
------------------------
${results.gm >= 1.0 ? 
  '• Mükemmel stabilite durumu - Tüm deniz koşullarında güvenli' :
  results.gm >= 0.5 ? 
  '• İyi stabilite durumu - Normal operasyonlar için uygun' :
  results.gm >= 0.15 ?
  '• Kabul edilebilir stabilite - Dikkatli seyir gerekli' :
  '• TEHLİKELİ DURUM - Derhal ballast ayarlaması yapın!'
}

${!results.solas_uygunluk.genel_uygunluk ? 
  '• UYARI: SOLAS kriterleri sağlanmadı - Port State Control riski' : 
  '• SOLAS kriterleri tam uygunluk'
}

EK NOTLAR
---------
${reportData.ek_notlar || 'Ek not bulunmamaktadır.'}

SORUMLU PERSONEL
---------------
Kaptan            : ${reportData.kaptan_adi}
Baş Makinist      : [İsim girilmemiş]
Güverte Zabitlik  : [İsim girilmemiş]

Bu rapor Stable Tales Stabilite Analiz Sistemi ile ${new Date().toLocaleString('tr-TR')} tarihinde otomatik olarak oluşturulmuştur.

İMZA VE ONAY
-----------
Kaptan İmzası: _________________    Tarih: ${reportData.tarih}


==========================================
Stable Tales - Maritime Stability System
==========================================
`;

      setGeneratedReport(report);
      setReportGenerated(true);
      
      toast.success("Stabilite raporu başarıyla oluşturuldu!");
      
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Rapor oluşturma sırasında bir hata oluştu!");
    }
  };

  const downloadReport = () => {
    const blob = new Blob([generatedReport], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Stabilite_Raporu_${reportData.gemi_adi.replace(/\s+/g, '_')}_${reportData.tarih}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Rapor indirildi!");
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Stabilite Raporu</title>
            <style>
              body { font-family: 'Courier New', monospace; margin: 20px; }
              pre { white-space: pre-wrap; }
            </style>
          </head>
          <body>
            <pre>${generatedReport}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
      toast.success("Rapor yazdırılıyor...");
    }
  };

  const emailReport = () => {
    const subject = `Stabilite Raporu - ${reportData.gemi_adi} - ${reportData.tarih}`;
    const body = encodeURIComponent(generatedReport);
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    window.location.href = mailtoLink;
    toast.success("E-posta istemciniz açılıyor...");
  };

  return (
    <div className="space-y-6">
      {/* Rapor Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Stabilite Raporu Oluşturucu
          </CardTitle>
          <CardDescription>
            Profesyonel stabilite raporu oluşturun ve kaydedin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>Gemi Adı</Label>
              <Input
                value={reportData.gemi_adi}
                onChange={(e) => setReportData(prev => ({ ...prev, gemi_adi: e.target.value }))}
              />
            </div>
            <div>
              <Label>Kaptan Adı</Label>
              <Input
                value={reportData.kaptan_adi}
                onChange={(e) => setReportData(prev => ({ ...prev, kaptan_adi: e.target.value }))}
              />
            </div>
            <div>
              <Label>Liman</Label>
              <Input
                value={reportData.liman}
                onChange={(e) => setReportData(prev => ({ ...prev, liman: e.target.value }))}
              />
            </div>
            <div>
              <Label>Tarih</Label>
              <Input
                type="date"
                value={reportData.tarih}
                onChange={(e) => setReportData(prev => ({ ...prev, tarih: e.target.value }))}
              />
            </div>
            <div>
              <Label>Sefer No</Label>
              <Input
                value={reportData.voyage_no}
                onChange={(e) => setReportData(prev => ({ ...prev, voyage_no: e.target.value }))}
              />
            </div>
            <div>
              <Label>Rapor Tipi</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={reportData.rapor_tipi}
                onChange={(e) => setReportData(prev => ({ ...prev, rapor_tipi: e.target.value }))}
              >
                <option value="departure">Hareket Öncesi</option>
                <option value="arrival">Varış Sonrası</option>
                <option value="operational">Operasyonel</option>
                <option value="emergency">Acil Durum</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gemi Teknik Bilgileri */}
      <Card>
        <CardHeader>
          <CardTitle>Gemi Teknik Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>Deplasman (ton)</Label>
              <Input
                type="number"
                value={vesselData.deplasman}
                onChange={(e) => setVesselData(prev => ({ ...prev, deplasman: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>KM (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.km}
                onChange={(e) => setVesselData(prev => ({ ...prev, km: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>KG (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.kg}
                onChange={(e) => setVesselData(prev => ({ ...prev, kg: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Draft (m)</Label>
              <Input
                type="number"
                step="0.01"
                value={vesselData.draft}
                onChange={(e) => setVesselData(prev => ({ ...prev, draft: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>LOA (m)</Label>
              <Input
                type="number"
                value={vesselData.loa}
                onChange={(e) => setVesselData(prev => ({ ...prev, loa: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>BOA (m)</Label>
              <Input
                type="number"
                value={vesselData.boa}
                onChange={(e) => setVesselData(prev => ({ ...prev, boa: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>IMO No</Label>
              <Input
                value={vesselData.imo_no}
                onChange={(e) => setVesselData(prev => ({ ...prev, imo_no: e.target.value }))}
              />
            </div>
            <div>
              <Label>Çağrı İşareti</Label>
              <Input
                value={vesselData.call_sign}
                onChange={(e) => setVesselData(prev => ({ ...prev, call_sign: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ek Notlar */}
      <Card>
        <CardHeader>
          <CardTitle>Ek Notlar ve Açıklamalar</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Stabilite ile ilgili ek notlar, özel durumlar, dikkat edilmesi gereken hususlar..."
            rows={4}
            value={reportData.ek_notlar}
            onChange={(e) => setReportData(prev => ({ ...prev, ek_notlar: e.target.value }))}
          />
        </CardContent>
      </Card>

      {/* Rapor Oluştur */}
      <Card>
        <CardContent className="pt-6">
          <Button onClick={generateReport} className="w-full" size="lg">
            <FileText className="mr-2 h-5 w-5" />
            Stabilite Raporu Oluştur
          </Button>
        </CardContent>
      </Card>

      {/* Oluşturulan Rapor */}
      {reportGenerated && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Oluşturulan Rapor</CardTitle>
              <div className="flex gap-2">
                <Button onClick={downloadReport} size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  İndir
                </Button>
                <Button onClick={printReport} size="sm" variant="outline">
                  <Printer className="mr-2 h-4 w-4" />
                  Yazdır
                </Button>
                <Button onClick={emailReport} size="sm" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  E-posta Gönder
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap font-mono overflow-x-auto">
                  {generatedReport}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};