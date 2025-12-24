import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export async function exportNodeToPng(node: HTMLElement, fileName = 'chart.png') {
  const canvas = await html2canvas(node, { backgroundColor: '#0b0b0b00', scale: 2 });
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

type CsvCell = string | number | boolean | null | undefined;

export function exportToCsv(rows: Array<Record<string, CsvCell>>, fileName = 'data.csv') {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);

  const escapeCsv = (value: string) => {
    // RFC 4180-ish: wrap with quotes if contains quote/comma/newline; double quotes inside.
    const needsQuotes = /[",\r\n]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  };

  const toCell = (v: CsvCell) => escapeCsv(String(v ?? ''));

  // Add BOM for better Excel compatibility with UTF-8 (Turkish chars).
  const csv = '\ufeff' + [headers.map(toCell).join(',')]
    .concat(rows.map(r => headers.map(h => toCell(r[h])).join(',')))
    .join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}

export function exportToPdfFromPngDataUrl(pngDataUrl: string, fileName = 'chart.pdf') {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(pngDataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
  pdf.save(fileName);
}