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
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error("Failed to speak text");
    };

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleClear = () => {
    if (onTextChange) {
      onTextChange("");
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [text]);

  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border transition-all",
        type === "source"
          ? "bg-source-bg border-border/30"
          : "bg-target-bg border-accent/20",
        isLoading && "animate-pulse"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <span className="text-xl">{languageFlag}</span>
          <span className="font-medium text-sm">{languageName}</span>
        </div>
        <div className="flex items-center gap-1">
          {type === "source" && onVoiceInput && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onVoiceInput}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                isRecording && "bg-destructive text-destructive-foreground animate-voice-pulse"
              )}
            >
              {isRecording ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          {text && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSpeak}
                className={cn(
                  "h-8 w-8 rounded-full",
                  isSpeaking && "text-accent"
                )}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 rounded-full"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              {type === "source" && !readOnly && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  className="h-8 w-8 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative p-4 min-h-[150px]">
        {isLoading && type === "target" ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Translating...</span>
          </div>
        ) : readOnly ? (
          <p className={cn(
            "text-lg leading-relaxed whitespace-pre-wrap",
            !text && "text-muted-foreground italic"
          )}>
            {text || "Translation will appear here..."}
          </p>
        ) : (
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onTextChange?.(e.target.value)}
            placeholder={type === "source" ? "Enter text to translate..." : "Translation will appear here..."}
            className={cn(
              "w-full min-h-[120px] resize-none border-0 bg-transparent p-0 text-lg leading-relaxed",
              "placeholder:text-muted-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            )}
          />
        )}

        {/* Character count for source */}
        {type === "source" && text && (
          <div className="absolute bottom-2 right-4 text-xs text-muted-foreground">
            {text.length} characters
          </div>
        )}
      </div>
    </div>
  );
}
