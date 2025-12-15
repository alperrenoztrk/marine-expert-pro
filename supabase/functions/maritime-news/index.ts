import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { XMLParser } from "https://esm.sh/fast-xml-parser@4.5.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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
};

const FEEDS: FeedSource[] = [
  {
    id: "maritime-executive",
    name: "The Maritime Executive",
    url: "https://www.maritime-executive.com/rss",
  },
  {
    id: "gcaptain",
    name: "gCaptain",
    url: "https://gcaptain.com/feed/",
  },
  {
    id: "marinelink",
    name: "MarineLink",
    url: "https://www.marinelink.com/rss/news",
  },
  {
    id: "splash247",
    name: "Splash247",
    url: "https://splash247.com/feed/",
  },
  {
    id: "hellenicshipping",
    name: "Hellenic Shipping",
    url: "https://www.hellenicshippingnews.com/feed/",
  },
  {
    id: "safety4sea",
    name: "Safety4Sea",
    url: "https://www.safety4sea.com/feed/",
  },
  {
    id: "offshore-energy",
    name: "Offshore Energy",
    url: "https://www.offshore-energy.biz/feed/",
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
        if (!title || !link) return null;
        return { title, link, summary, publishedAt, source: sourceName } satisfies NewsItem;
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
        if (!title || !link) return null;
        return { title, link, summary, publishedAt, source: sourceName } satisfies NewsItem;
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
        "User-Agent": "MarineExpertNewsBot/1.0 (+https://example.invalid)",
        "Accept": "application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.1",
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

    let limit = Number(url.searchParams.get("limit") || "30");
    if (req.method === "POST") {
      try {
        const body = await req.json();
        if (body && typeof body.limit !== "undefined") limit = Number(body.limit);
      } catch {
        // ignore invalid json
      }
    }

    if (!Number.isFinite(limit)) limit = 30;
    limit = Math.max(5, Math.min(80, Math.trunc(limit)));

    const results = await Promise.allSettled(
      FEEDS.map(async (feed) => {
        const xml = await fetchWithTimeout(feed.url, 10_000);
        const items = parseRssOrAtom(xml, feed.name).map((i) => ({ ...i, source: feed.name }));
        return { feed, items };
      })
    );

    const allItems: NewsItem[] = [];
    const errors: Array<{ source: string; error: string }> = [];

    for (const r of results) {
      if (r.status === "fulfilled") {
        allItems.push(...r.value.items);
      } else {
        const msg = r.reason instanceof Error ? r.reason.message : String(r.reason);
        errors.push({ source: "unknown", error: msg });
      }
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
