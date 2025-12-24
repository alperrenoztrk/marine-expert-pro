import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfPath = path.resolve(__dirname, "../public/navigation/pdfs/DN2025SES1112.pdf");
const outPath = path.resolve(__dirname, "../src/data/dn2025ses1112.raw.json");

function coerceSpacing(text) {
  return text
    .replace(/\s+\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function linesFromTextContent(textContent) {
  const items = (textContent.items ?? [])
    .filter((it) => typeof it?.str === "string" && it.str.trim().length > 0 && Array.isArray(it.transform))
    .map((it) => ({
      str: it.str.trim(),
      x: Number(it.transform[4] ?? 0),
      y: Number(it.transform[5] ?? 0),
    }));

  // Sort visually: top-to-bottom (y desc), left-to-right (x asc)
  items.sort((a, b) => (b.y - a.y) || (a.x - b.x));

  const yTolerance = 2.0;
  const lines = [];
  let current = null;

  for (const item of items) {
    if (!current) {
      current = { y: item.y, parts: [item] };
      continue;
    }

    if (Math.abs(current.y - item.y) <= yTolerance) {
      current.parts.push(item);
      continue;
    }

    current.parts.sort((a, b) => a.x - b.x);
    lines.push(current.parts.map((p) => p.str).join(" "));
    current = { y: item.y, parts: [item] };
  }

  if (current) {
    current.parts.sort((a, b) => a.x - b.x);
    lines.push(current.parts.map((p) => p.str).join(" "));
  }

  return lines
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter(Boolean);
}

async function main() {
  const data = new Uint8Array(await fs.readFile(pdfPath));
  const task = getDocument({ data });
  const pdf = await task.promise;

  const pages = [];
  for (let i = 1; i <= pdf.numPages; i += 1) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const lines = linesFromTextContent(textContent);
    pages.push({ pageNumber: i, lines });
  }

  const rawText = coerceSpacing(pages.map((p) => p.lines.join("\n")).join("\n\n---\n\n"));
  await fs.writeFile(outPath, JSON.stringify({ pdfPath: "/navigation/pdfs/DN2025SES1112.pdf", pages, rawText }, null, 2), "utf8");

  // Print a quick preview for inspection
  const preview = rawText.split("\n").slice(0, 160).join("\n");
  process.stdout.write(`${preview}\n`);
  process.stdout.write(`\n\n[written] ${outPath}\n`);
  process.stdout.write(`[pages] ${pdf.numPages}\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

