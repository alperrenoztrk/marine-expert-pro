export type PdfTocLevel = 1 | 2;

export interface PdfTocItem {
  title: string;
  page: number;
  level: PdfTocLevel;
}

export const dn2025ses1112 = {
  id: "DN2025SES1112",
  title: "Seyir ve Elektronik Seyir Atölyesi 11 (MEB)",
  pdfPath: "/navigation/pdfs/DN2025SES1112.pdf",
  sourceUrl: "https://meslek.meb.gov.tr/upload/dersmateryali/pdf/DN2025SES1112.pdf",
  // NOTE: İçindekiler sayfasından çıkarılmış özet liste (sayfa numaraları PDF sayfa numarasıdır).
  toc: [
    { title: "Öğrenme Bölümü: Kıyı Seyri", page: 15, level: 1 },
    { title: "Referans maddelerden kerteriz ve mesafe ölçümü", page: 16, level: 2 },
    { title: "Mevki dairesi", page: 17, level: 2 },
    { title: "Kıyı seyrinde mevki koyma yöntemleri", page: 20, level: 2 },

    { title: "Öğrenme Bölümü: Akıntı Seyri", page: 33, level: 1 },
    { title: "Akıntı", page: 34, level: 2 },
    { title: "Akıntı hesaplamaları", page: 38, level: 2 },

    { title: "Öğrenme Bölümü: Karasal Seyir", page: 45, level: 1 },
    { title: "Düzlem seyri", page: 46, level: 2 },
    { title: "Büyük daire seyri", page: 53, level: 2 },

    { title: "Öğrenme Bölümü: Gelgit", page: 59, level: 1 },
    { title: "Gelgit teorisi", page: 60, level: 2 },
    { title: "Gelgit ve gelgit akıntısı hesaplamaları", page: 67, level: 2 },
  ] satisfies PdfTocItem[],
} as const;

