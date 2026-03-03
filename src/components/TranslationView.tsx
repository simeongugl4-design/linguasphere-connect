import { useCallback, useEffect, useState } from "react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslationPanel } from "@/components/TranslationPanel";
import { SwapButton } from "@/components/SwapButton";
import { CountrySearch } from "@/components/CountrySearch";
import { useTranslation } from "@/hooks/useTranslation";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useCountryDetection } from "@/hooks/useCountryDetection";
import { getLanguageByCode } from "@/lib/languages";
import { MapPin } from "lucide-react";

export function TranslationView() {
  const {
    sourceText,
    setSourceText,
    translatedText,
    sourceLanguage,
    setSourceLanguage,
    targetLanguage,
    setTargetLanguage,
    isLoading,
    swapLanguages,
  } = useTranslation();

  const { isRecording, toggleRecording } = useVoiceInput(
    (text) => setSourceText((prev) => prev + " " + text),
    sourceLanguage
  );

  const { detectedCountry } = useCountryDetection();
  const [autoApplied, setAutoApplied] = useState(false);

  useEffect(() => {
    if (detectedCountry && !autoApplied) {
      setSourceLanguage(detectedCountry.code);
      setAutoApplied(true);
    }
  }, [detectedCountry, autoApplied, setSourceLanguage]);

  const handleCountrySelect = useCallback(
    (countryData: { country: string; language: string; code: string; flag: string }) => {
      setSourceLanguage(countryData.code);
    },
    [setSourceLanguage]
  );

  const sourceLang =
    sourceLanguage === "auto"
      ? { name: "Auto Detect", flag: "🌍", code: "auto" }
      : getLanguageByCode(sourceLanguage) || { name: "Unknown", flag: "❓", code: sourceLanguage };

  const targetLang = getLanguageByCode(targetLanguage) || { name: "Unknown", flag: "❓", code: targetLanguage };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4">
      {/* Detected Country Banner */}
      {detectedCountry && (
        <div className="mb-3 flex items-center gap-2 justify-center text-xs sm:text-sm text-muted-foreground animate-fade-in-up">
          <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          <span>Detected: {detectedCountry.flag} {detectedCountry.country} — {detectedCountry.language}</span>
        </div>
      )}

      {/* Country Search Bar */}
      <div className="mb-3 sm:mb-6">
        <CountrySearch onCountrySelect={handleCountrySelect} />
      </div>

      {/* Language Selectors - stacked on mobile */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
        <div className="flex-1 w-full">
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            label="From"
            showAutoDetect
          />
        </div>

        <div className="flex items-center justify-center py-1 sm:py-6">
          <SwapButton onClick={swapLanguages} disabled={sourceLanguage === "auto"} className="h-10 w-10 sm:h-12 sm:w-12" />
        </div>

        <div className="flex-1 w-full">
          <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} label="To" />
        </div>
      </div>

      {/* Translation Panels - stacked */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
        <TranslationPanel
          type="source"
          text={sourceText}
          onTextChange={setSourceText}
          languageCode={sourceLang.code}
          languageName={sourceLang.name}
          languageFlag={sourceLang.flag}
          onVoiceInput={toggleRecording}
          isRecording={isRecording}
        />

        <TranslationPanel
          type="target"
          text={translatedText}
          languageCode={targetLang.code}
          languageName={targetLang.name}
          languageFlag={targetLang.flag}
          isLoading={isLoading}
          readOnly
        />
      </div>

      {/* Features hint */}
      <div className="mt-3 sm:mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-accent animate-pulse" />
          Instant translation
        </span>
        <span>•</span>
        <span>195+ countries</span>
        <span>•</span>
        <span>Voice input</span>
      </div>
    </div>
  );
}
