import { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, Database, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { isOnline, getCacheStats, clearAllCache } from "@/lib/offlineStorage";
import { useOfflineTranslation } from "@/hooks/useOfflineTranslation";

export function OfflineIndicator() {
  const [online, setOnline] = useState(isOnline());
  const { isSyncing, syncPendingTranslations, stats, refreshStats } = useOfflineTranslation();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    refreshStats();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [refreshStats]);

  const handleClearCache = async () => {
    try {
      await clearAllCache();
      await refreshStats();
      toast.success("Cache cleared");
    } catch (error) {
      toast.error("Failed to clear cache");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full transition-colors",
            !online && "text-destructive"
          )}
        >
          {online ? (
            <Wifi className="h-4 w-4" />
          ) : (
            <WifiOff className="h-4 w-4 animate-pulse" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end">
        <div className="space-y-4">
          {/* Status Header */}
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                online ? "bg-green-500" : "bg-red-500"
              )}
            />
            <div>
              <p className="font-medium text-sm">
                {online ? "Online" : "Offline"}
              </p>
              <p className="text-xs text-muted-foreground">
                {online
                  ? "Translations work normally"
                  : "Using cached translations"}
              </p>
            </div>
          </div>

          {/* Cache Stats */}
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Database className="h-4 w-4 text-muted-foreground" />
              <span>Cache Statistics</span>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Cached translations</span>
                <span className="font-medium">{stats.translationCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Language packs</span>
                <span className="font-medium">{stats.languagePackCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending sync</span>
                <span
                  className={cn(
                    "font-medium",
                    stats.pendingCount > 0 && "text-amber-500"
                  )}
                >
                  {stats.pendingCount}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            {stats.pendingCount > 0 && online && (
              <Button
                size="sm"
                variant="outline"
                onClick={syncPendingTranslations}
                disabled={isSyncing}
                className="flex-1"
              >
                <RefreshCw
                  className={cn("h-3 w-3 mr-1", isSyncing && "animate-spin")}
                />
                Sync Now
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={handleClearCache}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          </div>

          {/* Offline Mode Info */}
          {!online && (
            <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
              <p>
                While offline, previously translated text will work from cache.
                New translations will be queued and synced when you're back
                online.
              </p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
