import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  cacheTranslation,
  getCachedTranslation,
  addPendingTranslation,
  isOnline,
} from "@/lib/offlineStorage";

interface TranslationResult {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export function useTranslation() {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const translate = useCallback(async (text: string, source: string, target: string) => {
    if (!text.trim()) {
      setTranslatedText("");
      return;
    }

    setIsLoading(true);
    try {
      // Check cache first
      const cached = await getCachedTranslation(text, source, target);
      if (cached) {
        setTranslatedText(cached);
        setIsLoading(false);
        return;
      }

      // If offline, queue and notify
      if (!isOnline()) {
        await addPendingTranslation(text, source, target);
        toast.info("You're offline. Translation queued for later.");
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke<TranslationResult>("translate", {
        body: {
          text: text.trim(),
          sourceLanguage: source,
          targetLanguage: target,
        },
      });

      if (error) {
        console.error("Translation error:", error);
        toast.error(error.message || "Translation failed");
        return;
      }

      if (data?.translatedText) {
        setTranslatedText(data.translatedText);
        // Cache the result
        await cacheTranslation(text, source, target, data.translatedText);
      }
    } catch (err) {
      console.error("Translation error:", err);
      // On network failure, queue for later
      await addPendingTranslation(text, source, target);
      toast.error("Translation failed. Queued for when you're back online.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!sourceText.trim()) { setTranslatedText(""); return; }
    debounceRef.current = setTimeout(() => {
      translate(sourceText, sourceLanguage, targetLanguage);
    }, 150);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [sourceText, sourceLanguage, targetLanguage, translate]);

  const swapLanguages = useCallback(() => {
    if (sourceLanguage === "auto") {
      toast.info("Cannot swap when source is auto-detect");
      return;
    }
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLanguage, targetLanguage, sourceText, translatedText]);

  const clearAll = useCallback(() => {
    setSourceText("");
    setTranslatedText("");
  }, []);

  return {
    sourceText,
    setSourceText,
    translatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isLoading,
    swapLanguages,
    clearAll,
    translate,
  };
}
