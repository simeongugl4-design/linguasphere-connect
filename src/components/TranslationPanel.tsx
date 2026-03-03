import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Copy, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface TranslationPanelProps {
  type: "source" | "target";
  text: string;
  onTextChange?: (text: string) => void;
  languageCode: string;
  languageName: string;
  languageFlag: string;
  isLoading?: boolean;
  onVoiceInput?: () => void;
  isRecording?: boolean;
  readOnly?: boolean;
}

export function TranslationPanel({
  type,
  text,
  onTextChange,
  languageCode,
  languageName,
  languageFlag,
  isLoading = false,
  onVoiceInput,
  isRecording = false,
  readOnly = false,
}: TranslationPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleSpeak = () => {
    if (!text || !("speechSynthesis" in window)) {
      toast.error("Speech synthesis not supported");
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = languageCode;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => { setIsSpeaking(false); toast.error("Failed to speak text"); };
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => { if (onTextChange) onTextChange(""); };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(100, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl sm:rounded-2xl border transition-all",
        type === "source" ? "bg-source-bg border-border/30" : "bg-target-bg border-accent/20",
        isLoading && "animate-pulse"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 sm:p-4 border-b border-border/30">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl">{languageFlag}</span>
          <span className="font-medium text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">{languageName}</span>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1">
          {type === "source" && onVoiceInput && (
            <Button variant="ghost" size="icon" onClick={onVoiceInput}
              className={cn("h-7 w-7 sm:h-8 sm:w-8 rounded-full transition-all", isRecording && "bg-destructive text-destructive-foreground animate-voice-pulse")}>
              {isRecording ? <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </Button>
          )}
          {text && (
            <>
              <Button variant="ghost" size="icon" onClick={handleSpeak}
                className={cn("h-7 w-7 sm:h-8 sm:w-8 rounded-full", isSpeaking && "text-accent")}>
                <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopy} className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                {copied ? <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent" /> : <Copy className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
              </Button>
              {type === "source" && !readOnly && (
                <Button variant="ghost" size="icon" onClick={handleClear} className="h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-3 sm:p-4 min-h-[100px] sm:min-h-[150px]">
        {isLoading && type === "target" ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs sm:text-sm">Translating...</span>
          </div>
        ) : readOnly ? (
          <p className={cn("text-sm sm:text-lg leading-relaxed whitespace-pre-wrap", !text && "text-muted-foreground italic")}>
            {text || "Translation will appear here..."}
          </p>
        ) : (
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange?.(e.target.value)}
            placeholder="Enter text to translate..."
            className="w-full min-h-[80px] sm:min-h-[120px] resize-none border-0 bg-transparent p-0 text-sm sm:text-lg leading-relaxed placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        )}
        {type === "source" && text && (
          <div className="absolute bottom-1.5 right-3 sm:bottom-2 sm:right-4 text-[10px] sm:text-xs text-muted-foreground">
            {text.length} chars
          </div>
        )}
      </div>
    </div>
  );
}
