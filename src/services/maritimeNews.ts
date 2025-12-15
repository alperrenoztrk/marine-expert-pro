import { supabase } from "@/integrations/supabase/client";

export type MaritimeNewsItem = {
  title: string;
  link: string;
  publishedAt?: string;
  source: string;
  summary?: string;
};

export type MaritimeNewsResponse = {
  fetchedAt: string;
  items: MaritimeNewsItem[];
  sources?: Array<{ id: string; name: string; url: string }>;
  errors?: Array<{ source: string; error: string }>;
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

export async function fetchMaritimeNews(limit = 30): Promise<MaritimeNewsResponse> {
  const { data, error } = await supabase.functions.invoke("maritime-news", {
    body: { limit },
  });

  if (error) throw error;
  return normalizeResponse(data);
}
