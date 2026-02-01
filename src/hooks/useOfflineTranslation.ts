import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  cacheTranslation,
  getCachedTranslation,
  addPendingTranslation,
  getPendingTranslations,
  removePendingTranslation,
  isOnline,
  getCacheStats,
} from '@/lib/offlineStorage';

interface UseOfflineTranslationOptions {
  onTranslationComplete?: (translatedText: string) => void;
}

export function useOfflineTranslation(options: UseOfflineTranslationOptions = {}) {
  const [isOffline, setIsOffline] = useState(!isOnline());
  const [isSyncing, setIsSyncing] = useState(false);
  const [stats, setStats] = useState({
    translationCount: 0,
    languagePackCount: 0,
    pendingCount: 0,
  });

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('You are back online');
      syncPendingTranslations();
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning('You are offline. Translations will be cached.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const cacheStats = await getCacheStats();
      setStats(cacheStats);
    } catch (error) {
      console.error('Failed to load cache stats:', error);
    }
  };

  // Translate with offline support
  const translate = useCallback(
    async (
      text: string,
      sourceLanguage: string,
      targetLanguage: string
    ): Promise<string | null> => {
      if (!text.trim()) return null;

      // Check cache first
      const cached = await getCachedTranslation(text, sourceLanguage, targetLanguage);
      if (cached) {
        options.onTranslationComplete?.(cached);
        return cached;
      }

      // If offline, queue for later
      if (!isOnline()) {
        await addPendingTranslation(text, sourceLanguage, targetLanguage);
        await loadStats();
        toast.info('Translation queued for when you are online');
        return null;
      }

      // Translate online
      try {
        const { data, error } = await supabase.functions.invoke('translate', {
          body: {
            text: text.trim(),
            sourceLanguage,
            targetLanguage,
          },
        });

        if (error) throw new Error(error.message);

        if (data?.translatedText) {
          // Cache the result
          await cacheTranslation(text, sourceLanguage, targetLanguage, data.translatedText);
          await loadStats();
          options.onTranslationComplete?.(data.translatedText);
          return data.translatedText;
        }

        return null;
      } catch (error) {
        console.error('Translation error:', error);

        // Queue for later if network error
        await addPendingTranslation(text, sourceLanguage, targetLanguage);
        await loadStats();
        toast.error('Translation failed. Queued for retry.');
        return null;
      }
    },
    [options]
  );

  // Sync pending translations
  const syncPendingTranslations = useCallback(async () => {
    if (!isOnline()) return;

    setIsSyncing(true);
    try {
      const pending = await getPendingTranslations();
      if (pending.length === 0) {
        setIsSyncing(false);
        return;
      }

      toast.info(`Syncing ${pending.length} pending translations...`);

      for (const item of pending) {
        try {
          const { data, error } = await supabase.functions.invoke('translate', {
            body: {
              text: item.text,
              sourceLanguage: item.sourceLanguage,
              targetLanguage: item.targetLanguage,
            },
          });

          if (!error && data?.translatedText) {
            await cacheTranslation(
              item.text,
              item.sourceLanguage,
              item.targetLanguage,
              data.translatedText
            );
            await removePendingTranslation(item.id);
          }
        } catch (error) {
          console.error('Failed to sync translation:', error);
        }
      }

      await loadStats();
      toast.success('Pending translations synced');
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    translate,
    isOffline,
    isSyncing,
    syncPendingTranslations,
    stats,
    refreshStats: loadStats,
  };
}
