import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function COLREGPresentation() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back button */}
        <div className="mb-4">
          <Link to="/navigation-menu">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Geri
            </Button>
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
          COLREG Ders Sunumu
        </h1>

        {/* PDF Viewer */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 180px)' }}>
          <iframe
            src="/COLREG-Ders-Sunumu.pdf"
            className="w-full h-full"
            title="COLREG Ders Sunumu"
          />
        </div>
      </div>
    </div>
  );
}
