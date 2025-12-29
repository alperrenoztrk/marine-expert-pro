import { AlertTriangle } from "lucide-react";
import { offlineDataMeta } from "@/data/offlineDataMeta";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

type OfflineLimitedNoticeProps = {
  title?: string;
  description?: string;
};

export function OfflineLimitedNotice({
  title = "Offline modda sınırlı içerik",
  description = "Bu bölümdeki bazı otomatik veri kaynakları internet bağlantısı gerektirir.",
}: OfflineLimitedNoticeProps) {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="flex items-center gap-2 font-medium">
        <AlertTriangle className="h-4 w-4" />
        {title}
      </div>
      <p className="mt-1 text-xs opacity-90">{description}</p>
      <p className="mt-1 text-xs opacity-80">Son güncelleme: {offlineDataMeta.lastUpdated}</p>
    </div>
  );
}
