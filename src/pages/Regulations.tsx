import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Regulations = () => {
  const handleDownloadCOLREG = () => {
    toast.success("COLREG indiriliyor...", {
      description: "Dosya cihazınıza kaydediliyor",
      duration: 2000,
    });

    // Resmi IMO COLREG kaynağı
    const downloadUrl = 'https://www.pfri.uniri.hr/bopri/documents/33-MECOLREGS_000.pdf';
    
    // İndirme başlat
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'COLREG_1972_Official.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Back Button */}
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" size="sm" className="gap-2 hover:bg-blue-50">
              <ArrowLeft className="w-4 h-4" />
              <span data-translatable>Ana Sayfa</span>
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shield className="h-12 w-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Maritime Regülasyonları
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Uluslararası denizcilik regülasyonlarını indirin
          </p>
        </div>

        {/* COLREG Download */}
        <div className="flex justify-center">
          <Card className="bg-white/80 backdrop-blur-sm border-blue-200 shadow-xl w-full max-w-md">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg text-center">
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-8 w-8" />
                <CardTitle className="text-2xl">COLREG 1972</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 text-center space-y-6">
              <div className="space-y-2">
                <p className="text-gray-800 font-semibold">
                  International Regulations for Preventing Collisions at Sea
                </p>
                <p className="text-gray-600 text-sm">
                  Resmi IMO Dokümantasyonu - PDF Format
                </p>
              </div>

              <Button 
                onClick={handleDownloadCOLREG}
                className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg"
                size="lg"
              >
                <Download className="w-5 h-5 mr-3" />
                COLREG İndir
              </Button>

              <p className="text-xs text-gray-500">
                Dosya boyutu: ~2MB | PDF formatı
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon */}
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Yakında: SOLAS, MARPOL, STCW ve diğer regülasyonlar
          </p>
        </div>

      </div>
    </div>
  );
};

export default Regulations;