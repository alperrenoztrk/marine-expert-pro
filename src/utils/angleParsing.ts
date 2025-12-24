/**
 * Parse an angle that may include East/West direction letters.
 *
 * Accepted examples (case-insensitive):
 * - "5E", "5 E", "E5", "5°E" => +5
 * - "5W", "5 W", "W5", "5°W" => -5
 * - "+5" => +5
 * - "-5" => -5
 * - "5"  => 5
 *
 * Notes:
 * - If both E and W exist in the same string, returns NaN.
 * - If E/W is present, it overrides the sign to match the direction.
 * - Comma decimal separator is supported (e.g., "1,5W").
 */
export function parseSignedAngleEW(input: string): number {
  const raw = (input ?? "").trim();
  if (raw.length === 0) return Number.NaN;

  const s = raw.toUpperCase().replace(",", ".");
  const hasE = s.includes("E");
  const hasW = s.includes("W");
  if (hasE && hasW) return Number.NaN;

  // Remove non-numeric markers (keep sign and decimal point).
  const numeric = s.replace(/[EW°\s]/g, "");
  const n = parseFloat(numeric);
  if (!Number.isFinite(n)) return Number.NaN;

  if (hasE) return Math.abs(n);
  if (hasW) return -Math.abs(n);
  return n;
}

