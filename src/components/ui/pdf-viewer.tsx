import React from "react";

interface PdfViewerProps {
  url?: string;
  title?: string;
  className?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ url, title, className }) => {
  if (!url) {
    return (
      <div className={`w-full h-[70vh] flex items-center justify-center rounded-lg border border-border bg-muted/30 ${className || ''}`}>
        <div className="text-center text-sm text-muted-foreground">
          Görüntülenecek PDF seçilmedi
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{title || 'PDF Görüntüleyici'}</div>
        <div className="flex items-center gap-2 text-sm">
          <a href={url} target="_blank" rel="noreferrer" className="underline">
            Yeni sekmede aç
          </a>
          <a href={url} download className="underline">
            İndir
          </a>
        </div>
      </div>
      <iframe src={url} title={title || 'PDF'} className="w-full h-[75vh] rounded-lg border" />
    </div>
  );
};