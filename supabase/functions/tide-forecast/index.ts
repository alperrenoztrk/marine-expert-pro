import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, cache-control, pragma",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type Suggestion = {
  id: string;
  name: string;
  region: string;
};

type TideEvent = {
  type: "high" | "low";
  timeLabel: string; // as displayed on site (e.g. "3:54 AM")
  dateLabel: string; // as displayed (e.g. "Wed 24 December")
  heightM: number;
  timeUtcIso?: string; // only when timezone is GMT/UTC and parsing succeeded
};

function json(
  body: unknown,
  init?: { status?: number; headers?: Record<string, string> },
) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
}

async function fetchTextWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<{ status: number; headers: Headers; text: string }> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, { ...init, signal: controller.signal });
    const text = await resp.text();
    return { status: resp.status, headers: resp.headers, text };
  } finally {
    clearTimeout(t);
  }
}

function parseAutocompleteResponse(raw: string): Suggestion[] {
  // Example:
  // [
  //   ['17576', 'London', 'United Kingdom'],
  //   ['20398', 'Long Beach', 'United States, California'],
  // ]
  const out: Suggestion[] = [];
  const re =
    /\[\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'(?:\s*,\s*'([^']*)')?\s*\]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw))) {
    const id = (m[1] || "").trim();
    const name = (m[2] || "").trim();
    const region = (m[3] || "").trim();
    if (!id || !name) continue;
    out.push({ id, name, region });
    if (out.length >= 15) break;
  }
  return out;
}

const MONTHS: Record<string, number> = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

function parseTime12hTo24h(timeLabel: string): { hh: number; mm: number } | null {
  const s = timeLabel.trim().replace(/\s+/g, " ");
  const m = s.match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!m) return null;
  let hh = Number(m[1]);
  const mm = Number(m[2]);
  const ap = m[3].toUpperCase();
  if (!Number.isFinite(hh) || !Number.isFinite(mm)) return null;
  if (hh < 1 || hh > 12 || mm < 0 || mm > 59) return null;
  if (ap === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh += 12;
  }
  return { hh, mm };
}

function parseDateLabelToYmd(
  dateLabel: string,
  nowUtc: Date,
): { y: number; m: number; d: number } | null {
  // Example: "Wed 24 December"
  const parts = dateLabel.trim().replace(/\s+/g, " ").split(" ");
  if (parts.length < 3) return null;
  const dayNum = Number(parts[1]);
  const monthName = (parts.slice(2).join(" ") || "").trim().toLowerCase();
  const month = MONTHS[monthName];
  if (!Number.isFinite(dayNum) || !month) return null;

  // Year heuristic around year boundary
  const nowY = nowUtc.getUTCFullYear();
  const nowM = nowUtc.getUTCMonth() + 1;
  let y = nowY;
  if (nowM === 12 && month === 1) y = nowY + 1;
  if (nowM === 1 && month === 12) y = nowY - 1;

  return { y, m: month, d: dayNum };
}

function toUtcIsoIfGmtOrUtc(
  timezoneLabel: string,
  timeLabel: string,
  dateLabel: string,
): string | undefined {
  const tz = timezoneLabel.trim().toUpperCase();
  if (!/^(GMT|UTC)$/.test(tz)) return undefined;
  const nowUtc = new Date();
  const ymd = parseDateLabelToYmd(dateLabel, nowUtc);
  const t = parseTime12hTo24h(timeLabel);
  if (!ymd || !t) return undefined;
  const dt = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d, t.hh, t.mm, 0, 0));
  return Number.isNaN(dt.getTime()) ? undefined : dt.toISOString();
}

function parseTideEventsFromHtml(
  html: string,
): { timezoneLabel: string; events: TideEvent[] } {
  const tableMatch = html.match(
    /<table[^>]*class=["'][^"']*tide-day-tides[^"']*["'][^>]*>([\s\S]*?)<\/table>/i,
  );
  if (!tableMatch) return { timezoneLabel: "Unknown", events: [] };

  const tableHtml = tableMatch[0];
  const tzMatch = tableHtml.match(/Time\s*\(([^)]+)\)/i);
  const timezoneLabel = (tzMatch?.[1] || "Unknown").trim();

  const events: TideEvent[] = [];
  const rowRe =
    /<tr>\s*<td>\s*(High Tide|Low Tide)\s*<\/td>\s*<td>\s*<b>\s*([^<]+?)\s*<\/b>\s*<span[^>]*>\s*\(([^)]+)\)\s*<\/span>\s*<\/td>\s*<td[^>]*>[\s\S]*?\(\s*([-0-9.]+)\s*m\s*\)\s*<\/span>[\s\S]*?<\/td>\s*<\/tr>/gi;
  let m: RegExpExecArray | null;
  while ((m = rowRe.exec(tableHtml))) {
    const type = m[1].toLowerCase().includes("high") ? "high" : "low";
    const timeLabel = (m[2] || "").trim();
    const dateLabel = (m[3] || "").trim();
    const heightM = Number(m[4]);
    if (!timeLabel || !dateLabel || !Number.isFinite(heightM)) continue;
    events.push({
      type,
      timeLabel,
      dateLabel,
      heightM,
      timeUtcIso: toUtcIsoIfGmtOrUtc(timezoneLabel, timeLabel, dateLabel),
    });
  }

  return { timezoneLabel, events };
}

function computeRangeM(events: TideEvent[]): number | null {
  const highs = events.filter((e) => e.type === "high").map((e) => e.heightM);
  const lows = events.filter((e) => e.type === "low").map((e) => e.heightM);
  if (!highs.length || !lows.length) return null;
  const maxHigh = Math.max(...highs);
  const minLow = Math.min(...lows);
  const range = maxHigh - minLow;
  return Number.isFinite(range) ? range : null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = req.method === "POST"
      ? await req.json().catch(() => ({}))
      : Object.fromEntries(new URL(req.url).searchParams.entries());

    const query = typeof body.query === "string" ? body.query.trim() : "";
    const locId = typeof body.loc_id === "string" ? body.loc_id.trim() : "";

    if (!query) {
      return json({ error: "query is required" }, { status: 400 });
    }

    // 1) Search suggestions
    if (!locId) {
      const url =
        `https://www.tide-forecast.com/locations/ac_location_name?query=${encodeURIComponent(query)}`;
      const res = await fetchTextWithTimeout(
        url,
        {
          method: "GET",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (compatible; GelgitApp/1.0) AppleWebKit/537.36",
            "Accept": "text/plain,*/*",
            "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
          },
        },
        12_000,
      );
      if (res.status !== 200) {
        return json(
          { error: `autocomplete failed: ${res.status}` },
          { status: 502 },
        );
      }
      const suggestions = parseAutocompleteResponse(res.text);
      return json({ suggestions });
    }

    // 2) Resolve to location URL (302 redirect) and fetch tides
    const catchUrl = "https://www.tide-forecast.com/locations/catch";
    const form = new URLSearchParams({ query, loc_id: locId, action: "save" });
    const catchRes = await fetchTextWithTimeout(
      catchUrl,
      {
        method: "POST",
        redirect: "manual",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; GelgitApp/1.0) AppleWebKit/537.36",
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "text/html,*/*",
          "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
        },
        body: form,
      },
      12_000,
    );

    const locationUrl = catchRes.headers.get("location") || "";
    if (!locationUrl) {
      return json(
        {
          error:
            "could not resolve location URL (missing redirect location header)",
          status: catchRes.status,
        },
        { status: 502 },
      );
    }

    const tidesRes = await fetchTextWithTimeout(
      locationUrl,
      {
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; GelgitApp/1.0) AppleWebKit/537.36",
          "Accept": "text/html,*/*",
          "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
        },
      },
      15_000,
    );

    if (tidesRes.status !== 200) {
      return json(
        { error: `tides page fetch failed: ${tidesRes.status}`, locationUrl },
        { status: 502 },
      );
    }

    const parsed = parseTideEventsFromHtml(tidesRes.text);
    const rangeM = computeRangeM(parsed.events);

    return json({
      locationUrl,
      timezoneLabel: parsed.timezoneLabel,
      events: parsed.events,
      rangeM,
    }, {
      headers: {
        // Cache lightly to reduce upstream hits; user can refresh anytime.
        "Cache-Control": "public, max-age=120",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return json({ error: message }, { status: 500 });
  }
});

