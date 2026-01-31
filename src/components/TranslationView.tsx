import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslationPanel } from "@/components/TranslationPanel";
import { SwapButton } from "@/components/SwapButton";
import { useTranslation } from "@/hooks/useTranslation";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { getLanguageByCode } from "@/lib/languages";

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

  const sourceLang = sourceLanguage === "auto" 
    ? { name: "Auto Detect", flag: "🌍", code: "auto" }
    : getLanguageByCode(sourceLanguage) || { name: "Unknown", flag: "❓", code: sourceLanguage };
  
  const targetLang = getLanguageByCode(targetLanguage) || { name: "Unknown", flag: "❓", code: targetLanguage };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Language Selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <LanguageSelector
            value={sourceLanguage}
            onChange={setSourceLanguage}
            label="From"
            showAutoDetect
          />
        </div>
        
        <div className="hidden sm:flex items-center justify-center py-6">
          <SwapButton
            onClick={swapLanguages}
            disabled={sourceLanguage === "auto"}
          />
        </div>

        <div className="flex-1 w-full">
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            label="To"
          />
        </div>

        {/* Mobile Swap Button */}
        <div className="sm:hidden">
          <SwapButton
            onClick={swapLanguages}
            disabled={sourceLanguage === "auto"}
          />
        </div>
      </div>

      {/* Translation Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
          Real-time translation
        </span>
        <span>•</span>
        <span>100+ languages</span>
        <span>•</span>
        <span>Voice input</span>
        <span>•</span>
        <span>AI-powered</span>
      </div>
    </div>
  );
}
