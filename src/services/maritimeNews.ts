import { supabase } from "@/integrations/supabase/safeClient";

export type MaritimeNewsItem = {
  title: string;
  link: string;
  publishedAt?: string;
  source: string;
  summary?: string;
  imageUrl?: string;
};

export type MaritimeNewsResponse = {
  fetchedAt: string;
  items: MaritimeNewsItem[];
  sources?: Array<{ id: string; name: string; url: string }>;
  errors?: Array<{ source: string; error: string }>;
};

const FALLBACK_NEWS: MaritimeNewsResponse = {
  fetchedAt: new Date().toISOString(),
  items: [
    {
      title: "Haber servisi geçici olarak kullanılamıyor. Güncel kaynaklara aşağıdaki bağlantılardan ulaşabilirsiniz.",
      link: "https://www.maritime-executive.com/",
      source: "Yedek Kaynak",
      summary:
        "Supabase haber servisine şu anda ulaşılamıyor. Genel denizcilik haberleri için Maritime Executive, gCaptain ve Splash247 kaynaklarını ziyaret edebilirsiniz.",
    },
    {
      title: "gCaptain – Son Haberler",
      link: "https://gcaptain.com/",
      source: "gCaptain",
    },
    {
      title: "Splash247 – Denizcilik Haberleri",
      link: "https://splash247.com/",
      source: "Splash247",
    },
  ],
  sources: [
    { id: "gcaptain", name: "gCaptain", url: "https://gcaptain.com/" },
    { id: "splash247", name: "Splash247", url: "https://splash247.com/" },
    { id: "maritime-executive", name: "Maritime Executive", url: "https://www.maritime-executive.com/" },
  ],
};

type SupabaseClientInternals = {
  supabaseUrl?: string;
  supabaseKey?: string;
  anonKey?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toStringSafe(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function normalizeResponse(data: unknown): MaritimeNewsResponse {
  // Some runtimes can return non-JSON or unexpected shapes (e.g. { error: "..." }).
  if (!isObject(data)) {
    throw new Error("Haber servisi beklenmeyen yanıt döndürdü.");
  }

  // Edge function error path: { error: message }
  const topLevelError = data["error"];
  if (typeof topLevelError === "string" && topLevelError.trim()) {
    throw new Error(topLevelError);
  }

  const fetchedAt = toStringSafe(data["fetchedAt"]) || new Date().toISOString();
  const itemsRaw = data["items"];
  const errorsRaw = data["errors"];
  const sourcesRaw = data["sources"];

  const items: MaritimeNewsItem[] = Array.isArray(itemsRaw)
    ? itemsRaw
        .map((it) => (isObject(it) ? it : null))
        .filter(Boolean)
        .map((it) => ({
          title: toStringSafe(it["title"]),
          link: toStringSafe(it["link"]),
          publishedAt: typeof it["publishedAt"] === "string" ? it["publishedAt"] : undefined,
          source: toStringSafe(it["source"]),
          summary: typeof it["summary"] === "string" ? it["summary"] : undefined,
          imageUrl: typeof it["imageUrl"] === "string" ? it["imageUrl"] : undefined,
        }))
        .filter((it) => Boolean(it.title && it.link))
    : [];

  const errors: MaritimeNewsResponse["errors"] = Array.isArray(errorsRaw)
    ? errorsRaw
        .map((e) => (isObject(e) ? e : null))
        .filter(Boolean)
        .map((e) => ({ source: toStringSafe(e["source"]), error: toStringSafe(e["error"]) }))
        .filter((e) => Boolean(e.source && e.error))
    : undefined;

  const sources: MaritimeNewsResponse["sources"] = Array.isArray(sourcesRaw)
    ? sourcesRaw
        .map((s) => (isObject(s) ? s : null))
        .filter(Boolean)
        .map((s) => ({ id: toStringSafe(s["id"]), name: toStringSafe(s["name"]), url: toStringSafe(s["url"]) }))
        .filter((s) => Boolean(s.id && s.name && s.url))
    : undefined;

  // If all upstream feeds failed, treat it as an error so the UI retries instead of caching an empty list all day.
  if (items.length === 0 && errors && errors.length > 0) {
    const first = errors[0];
    throw new Error(first?.error || "Haber kaynaklarına erişilemedi.");
  }

  return { fetchedAt, items, errors, sources };
}

function getFunctionBaseUrl(): string {
  // Use the environment variable which points to the correct project
  const baseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (baseUrl) return baseUrl;
  
  // Fallback: use supabase client URL
  const client = supabase as unknown as SupabaseClientInternals;
  const fallback = client.supabaseUrl;
  if (!fallback) throw new Error("Backend URL bulunamadı.");
  return fallback;
}

function getFunctionUrls(): string[] {
  const baseUrl = getFunctionBaseUrl().replace(/\/+$/, "");
  const urls = [`${baseUrl}/functions/v1/maritime-news`];

  try {
    const parsed = new URL(baseUrl);
    const hostParts = parsed.hostname.split(".");

    // https://<project>.supabase.co -> https://<project>.functions.supabase.co/maritime-news
    if (hostParts.length >= 3 && hostParts.includes("supabase")) {
      const projectRef = hostParts[0];
      const rootDomain = hostParts.slice(1).join(".");
      urls.push(`${parsed.protocol}//${projectRef}.functions.${rootDomain}/maritime-news`);
    }
  } catch (e) {
    console.warn("📰 [MaritimeNews] Could not derive functions domain", e);
  }

  return Array.from(new Set(urls));
}

function getAnonKey(): string {
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as
    | string
    | undefined;
  if (key) return key;

  // Fallback to the generated Supabase client key when env is not injected (common in some builds/webviews).
  const client = supabase as unknown as SupabaseClientInternals;
  const fallback = client.supabaseKey || client.anonKey;
  if (!fallback) throw new Error("Backend anahtarı bulunamadı.");
  return fallback;
}

function fetchWithTimeout(url: string, init: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, { ...init, signal: controller.signal }).finally(() => {
    clearTimeout(timeout);
  });
}

export type FetchMaritimeNewsOptions = {
  /**
   * Maximum number of articles to keep per source. Defaults to 10 so that each
   * feed contributes a reasonable slice of headlines with images to the UI.
   */
  perSourceLimit?: number;
  /**
   * Overall cap for returned items. When omitted, the server will default to
   * `perSourceLimit * feedCount` to include the requested slice from every
   * source.
   */
  totalLimit?: number;
};

export async function fetchMaritimeNews(
  options: FetchMaritimeNewsOptions = {},
  timeoutMs = 12_000
): Promise<MaritimeNewsResponse> {
  const { perSourceLimit = 10, totalLimit } = options;
  // Use direct call to avoid mis-pointing to an old/paused backend project when the generated client URL/key is stale.
  const key = getAnonKey();
  const candidateUrls = getFunctionUrls();
  const errors: string[] = [];

  for (const url of candidateUrls) {
    try {
      console.info("📰 [MaritimeNews] Requesting:", { url, totalLimit, perSourceLimit });

      const res = await fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          apikey: key,
          authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({ limit: totalLimit, perSourceLimit }),
      }, timeoutMs);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("📰 [MaritimeNews] HTTP error:", { status: res.status, text });
        throw new Error(text || `Haber servisi hata döndürdü (${res.status}).`);
      }

      const data = (await res.json().catch(() => null)) as unknown;
      return normalizeResponse(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const withTimeout =
        err instanceof DOMException && err.name === "AbortError"
          ? `Zaman aşımı (${timeoutMs} ms)`
          : message;
      errors.push(`${url}: ${withTimeout}`);
      console.warn("📰 [MaritimeNews] Failed endpoint, trying next", { url, message: withTimeout });
    }
  }

  console.warn("📰 [MaritimeNews] All endpoints failed, falling back to static content", { errors });

  return {
    ...FALLBACK_NEWS,
    fetchedAt: new Date().toISOString(),
    errors: errors.map((e, i) => ({ source: `Uç nokta ${i + 1}`, error: e })),
  };
}
