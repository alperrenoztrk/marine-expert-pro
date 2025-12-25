import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function COLREGPresentation() {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-dark via-primary to-primary-light">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          COLREG Ders Sunumu
        </h1>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white font-semibold">
              {pageNumber} / {numPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.max(0.5, scale - 0.2))}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-white font-semibold">{Math.round(scale * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setScale(Math.min(2.0, scale + 0.2))}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div
          className="bg-card text-card-foreground rounded-lg shadow-xl overflow-auto p-4 flex justify-center border border-border/60"
          style={{ maxHeight: 'calc(100vh - 250px)' }}
        >
          <Document
            file="/COLREG-Ders-Sunumu.pdf"
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-center py-8">
                <p className="text-muted-foreground">PDF yükleniyor...</p>
              </div>
            }
            error={
              <div className="text-center py-8">
                <p className="text-destructive">PDF yüklenirken hata oluştu</p>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}
