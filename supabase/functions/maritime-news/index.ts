import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { XMLParser } from "https://esm.sh/fast-xml-parser@4.5.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, cache-control, pragma",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

type FeedSource = {
  id: string;
  name: string;
  url: string;
};

type NewsItem = {
  title: string;
  link: string;
  publishedAt?: string; // ISO
  source: string;
  summary?: string;
  imageUrl?: string;
};

const FEEDS: FeedSource[] = [
  {
    id: "gcaptain",
    name: "gCaptain",
    url: "https://gcaptain.com/feed/",
  },
  {
    id: "marinelink",
    name: "MarineLink",
    url: "https://www.marinelink.com/rss",
  },
  {
    id: "splash247",
    name: "Splash247",
    url: "https://splash247.com/feed/",
  },
  {
    id: "offshore-energy",
    name: "Offshore Energy",
    url: "https://www.offshore-energy.biz/feed/",
  },
  {
    id: "worldmaritimenews",
    name: "World Maritime News",
    url: "https://worldmaritimenews.com/feed/",
  },
  {
    id: "marinelog",
    name: "Marine Log",
    url: "https://www.marinelog.com/feed/",
  },
  {
    id: "theloadstar",
    name: "The Loadstar",
    url: "https://theloadstar.com/feed/",
  },
  {
    id: "seatrade-maritime",
    name: "Seatrade Maritime",
    url: "https://www.seatrade-maritime.com/rss.xml",
  },
];

function stripHtml(input: string): string {
  return input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toIsoDate(value: unknown): string | undefined {
  if (!value) return undefined;
  const s = typeof value === "string" ? value : String(value);
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

function normalizeLink(link: unknown): string {
  if (!link) return "";
  if (typeof link === "string") return link;

  // Atom: link can be { '@_href': '...' } or array of such
  if (Array.isArray(link)) {
    const first = link.find((l) => typeof l === "string") as string | undefined;
    if (first) return first;
    const href = link
      .map((l) => (l && typeof l === "object" ? (l as Record<string, unknown>)["@_href"] : undefined))
      .find((h) => typeof h === "string") as string | undefined;
    return href || "";
  }

  if (typeof link === "object") {
    const href = (link as Record<string, unknown>)["@_href"];
    if (typeof href === "string") return href;
  }

  return String(link);
}

function normalizeImageUrl(value: unknown, baseUrl?: string): string | undefined {
  if (!value) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    // Avoid data URIs or relative paths; only allow http(s).
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    // Some feeds (e.g. gCaptain, Splash247) use protocol-relative URLs. Normalize them to https to keep images visible.
    if (/^\/\//.test(trimmed)) return `https:${trimmed}`;
    if (baseUrl) {
      try {
        const resolved = new URL(trimmed, baseUrl).toString();
        if (/^https?:\/\//i.test(resolved)) return resolved;
      } catch {
        return undefined;
      }
    }
    return undefined;
  }

  if (Array.isArray(value)) {
    for (const v of value) {
      const candidate = normalizeImageUrl(v, baseUrl);
      if (candidate) return candidate;
    }
    return undefined;
  }

  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = ["@_url", "@_href", "url", "href", "#text", "__text", "_text"];
    for (const key of keys) {
      const candidate = normalizeImageUrl(obj[key], baseUrl);
      if (candidate) return candidate;
    }
  }

  return undefined;
}

function extractImageFromHtml(html: string | undefined, baseUrl?: string): string | undefined {
  if (!html) return undefined;
  const attributes = ["data-lazy-src", "data-src", "data-original", "data-srcset", "srcset", "src"];
  for (const attr of attributes) {
    const regex = new RegExp(`<img[^>]+${attr}=["']([^"'>]+)["']`, "i");
    const match = html.match(regex);
    if (!match) continue;
    let candidate = match[1];
    if (attr.includes("srcset")) {
      const first = candidate.split(",")[0]?.trim();
      if (first) {
        candidate = first.split(" ")[0] || first;
      }
    }
    const normalized = normalizeImageUrl(candidate, baseUrl);
    if (normalized) return normalized;
  }
  return undefined;
}

function findImageUrl(entry: Record<string, unknown>): string | undefined {
  let baseUrl: string | undefined;
  try {
    const link = normalizeLink(entry["link"]);
    if (link) baseUrl = link;
  } catch {
    baseUrl = undefined;
  }
  // Common RSS/Atom fields
  const fields = [
    "media:content",
    "media:thumbnail",
    "media:group",
    "enclosure",
    "image",
    "content",
    "thumbnail",
  ];

  for (const field of fields) {
    const candidate = normalizeImageUrl(entry[field], baseUrl);
    if (candidate) return candidate;
  }

  // Atom links can include rel="enclosure" with image type
  const link = entry["link"];
  if (Array.isArray(link)) {
    for (const l of link) {
      if (typeof l === "object" && l && (l as Record<string, unknown>)["@_rel"] === "enclosure") {
        const candidate = normalizeImageUrl((l as Record<string, unknown>)["@_href"], baseUrl);
        if (candidate) return candidate;
      }
    }
  }

  // Try to find the first image in HTML content
  const htmlFields = ["content:encoded", "description", "summary", "content"];
  for (const field of htmlFields) {
    const candidate = extractImageFromHtml(
      typeof entry[field] === "string" ? (entry[field] as string) : undefined,
      baseUrl
    );
    if (candidate) return candidate;
  }

  return undefined;
}

function parseRssOrAtom(xml: string, fallbackSourceName: string): NewsItem[] {
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    textNodeName: "#text",
    trimValues: true,
    removeNSPrefix: true,
  });

  const parsed = parser.parse(xml) as any;

  // RSS 2.0
  const rssChannel = parsed?.rss?.channel;
  if (rssChannel) {
    const sourceName = (rssChannel?.title && stripHtml(String(rssChannel.title))) || fallbackSourceName;
    const itemsRaw = rssChannel?.item;
    const items = Array.isArray(itemsRaw) ? itemsRaw : itemsRaw ? [itemsRaw] : [];
    return items
      .map((it: any) => {
        const title = stripHtml(String(it?.title ?? "")).slice(0, 500);
        const link = normalizeLink(it?.link);
        const summary = it?.description ? stripHtml(String(it.description)).slice(0, 800) : undefined;
        const publishedAt = toIsoDate(it?.pubDate ?? it?.published ?? it?.updated);
        const imageUrl = findImageUrl(it ?? {});
        if (!title || !link) return null;
        return { title, link, summary, publishedAt, imageUrl, source: sourceName } satisfies NewsItem;
      })
      .filter(Boolean) as NewsItem[];
  }

  // Atom
  const atomFeed = parsed?.feed;
  if (atomFeed) {
    const sourceName = (atomFeed?.title && stripHtml(String(atomFeed.title))) || fallbackSourceName;
    const entriesRaw = atomFeed?.entry;
    const entries = Array.isArray(entriesRaw) ? entriesRaw : entriesRaw ? [entriesRaw] : [];

    return entries
      .map((e: any) => {
        const title = stripHtml(String(e?.title ?? "")).slice(0, 500);
        const link = normalizeLink(e?.link);
        const summary = e?.summary
          ? stripHtml(String(e.summary)).slice(0, 800)
          : e?.content
            ? stripHtml(String(e.content)).slice(0, 800)
            : undefined;
        const publishedAt = toIsoDate(e?.published ?? e?.updated);
        const imageUrl = findImageUrl(e ?? {});
        if (!title || !link) return null;
        return { title, link, summary, publishedAt, imageUrl, source: sourceName } satisfies NewsItem;
      })
      .filter(Boolean) as NewsItem[];
  }

  return [];
}

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Some feeds block unknown UAs; this helps.
        "User-Agent": "Mozilla/5.0 (compatible; MaritimeNewsBot/1.0) AppleWebKit/537.36",
        "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.1",
        "Accept-Language": "en-US,en;q=0.9,tr;q=0.8",
      },
    });
    if (!resp.ok) {
      throw new Error(`Feed fetch failed: ${resp.status} ${resp.statusText}`);
    }
    return await resp.text();
  } finally {
    clearTimeout(timeout);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);

    const limitRaw = Number(url.searchParams.get("limit") || "NaN");
    let limit = limitRaw;
    let perSourceLimit = Number(url.searchParams.get("perSourceLimit") || "NaN");
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body && typeof body.limit !== "undefined") limit = Number(body.limit);
        if (body && typeof body.perSourceLimit !== "undefined") perSourceLimit = Number(body.perSourceLimit);
      } catch {
        // ignore invalid json
      }
    }

    const sourceCount = FEEDS.length || 1;
    if (!Number.isFinite(perSourceLimit)) perSourceLimit = 10;
    perSourceLimit = Math.max(5, Math.min(25, Math.trunc(perSourceLimit)));

    if (!Number.isFinite(limit)) limit = perSourceLimit * sourceCount;
    limit = Math.max(5, Math.min(perSourceLimit * sourceCount, Math.trunc(limit)));

    const results = await Promise.all(
      FEEDS.map(async (feed) => {
        try {
          const xml = await fetchWithTimeout(feed.url, 12_000);
          const items = parseRssOrAtom(xml, feed.name)
            .map((i) => ({ ...i, source: feed.name }))
            .sort((a, b) => {
              const aTs = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
              const bTs = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
              return bTs - aTs;
            })
            .slice(0, perSourceLimit);
          return { feed, items, error: null as string | null };
        } catch (e) {
          const msg = e instanceof Error ? e.message : String(e);
          return { feed, items: [] as NewsItem[], error: msg };
        }
      })
    );

    const allItems: NewsItem[] = [];
    const errors: Array<{ source: string; error: string }> = [];

    for (const r of results) {
      allItems.push(...r.items);
      if (r.error) errors.push({ source: r.feed.name, error: r.error });
    }

    const sorted = allItems
      .map((i) => ({
        ...i,
        publishedAt: i.publishedAt,
        _ts: i.publishedAt ? new Date(i.publishedAt).getTime() : 0,
      }))
      .sort((a, b) => b._ts - a._ts)
      .slice(0, limit)
      .map(({ _ts, ...rest }) => rest);

    return new Response(
      JSON.stringify({
        fetchedAt: new Date().toISOString(),
        items: sorted,
        errors,
        sources: FEEDS.map((f) => ({ id: f.id, name: f.name, url: f.url })),
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          // Small cache to keep it snappy and reduce upstream requests
          "Cache-Control": "public, max-age=300",
        },
      }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
