import { offlineDataMeta } from "@/data/offlineDataMeta";
import { AlertTriangle, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export function OfflineStatusBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="flex flex-wrap items-center gap-2 font-medium">
        <WifiOff className="h-4 w-4" />
        Offline mod: yerel veri setleri kullanılıyor.
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs opacity-90">
        <AlertTriangle className="h-3 w-3" />
        Veri güncellik tarihi: {offlineDataMeta.lastUpdated} · {offlineDataMeta.notes}
      </div>
    </div>
  );
}
