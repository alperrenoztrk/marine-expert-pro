import { offlineDataMeta } from "@/data/offlineDataMeta";

type OfflineResourceMeta = {
  lastUpdated: string;
  notes?: string;
  bundleUrl?: string;
  checksum?: string;
};

export type OfflineSyncResult = {
  status: "offline" | "skipped" | "current" | "updated" | "error";
  meta?: OfflineResourceMeta;
  error?: string;
};

const STORAGE_KEY = "marine.offline-resource-meta";
const META_URL = import.meta.env.VITE_OFFLINE_RESOURCE_META_URL as string | undefined;

function parseDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function isRemoteNewer(remote: OfflineResourceMeta) {
  const remoteDate = parseDate(remote.lastUpdated);
  const localDate = parseDate(offlineDataMeta.lastUpdated);
  if (!remoteDate || !localDate) return false;
  return remoteDate.getTime() > localDate.getTime();
}

async function prefetchBundle(meta: OfflineResourceMeta) {
  if (!meta.bundleUrl) return;
  try {
    await fetch(meta.bundleUrl, { cache: "no-store" });
  } catch (error) {
    console.warn("[OfflineSync] Bundle prefetch failed:", error);
  }
}

export async function syncOfflineResources(): Promise<OfflineSyncResult> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { status: "offline" };
  }

  if (!META_URL) {
    return { status: "skipped" };
  }

  try {
    const res = await fetch(META_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Meta fetch failed (${res.status})`);
    const meta = (await res.json()) as OfflineResourceMeta;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...meta, fetchedAt: new Date().toISOString() })
    );

    await prefetchBundle(meta);

    return { status: isRemoteNewer(meta) ? "updated" : "current", meta };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    console.warn("[OfflineSync] Meta sync failed:", message);
    return { status: "error", error: message };
  }
}
