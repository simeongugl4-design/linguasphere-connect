import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      }
    } catch (err) {
      console.error("Translation error:", err);
      toast.error("Failed to translate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced translation
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!sourceText.trim()) {
      setTranslatedText("");
      return;
    }

    debounceRef.current = setTimeout(() => {
      translate(sourceText, sourceLanguage, targetLanguage);
    }, 150);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
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
