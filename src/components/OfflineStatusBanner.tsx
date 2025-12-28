import { useEffect, useState } from "react";
import { offlineDataMeta } from "@/data/offlineDataMeta";
import { AlertTriangle, WifiOff } from "lucide-react";

export function OfflineStatusBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

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
