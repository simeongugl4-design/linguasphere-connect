import { useState, useCallback, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, ArrowLeftRight, User, Users, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LanguageSelector } from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getLanguageByCode } from "@/lib/languages";

interface ConversationEntry {
  id: string;
  speaker: "A" | "B";
  originalText: string;
  translatedText: string;
  timestamp: Date;
}

export function ConversationMode() {
  const [languageA, setLanguageA] = useState("en");
  const [languageB, setLanguageB] = useState("es");
  const [activeSpeaker, setActiveSpeaker] = useState<"A" | "B" | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  const langAInfo = getLanguageByCode(languageA) || { name: "Unknown", flag: "❓" };
  const langBInfo = getLanguageByCode(languageB) || { name: "Unknown", flag: "❓" };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollArea = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollArea) {
        scrollArea.scrollTop = scrollArea.scrollHeight;
      }
    }
  }, [conversation]);

  const startListening = useCallback((speaker: "A" | "B") => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speaker === "A" ? languageA : languageB;

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentTranscript(transcript);

      // Check if final result
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        handleFinalTranscript(speaker, transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error !== "no-speech") {
        toast.error(`Speech recognition error: ${event.error}`);
      }
      stopListening();
    };

    recognition.onend = () => {
      if (isListening) {
        // Restart if still supposed to be listening
        recognition.start();
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
    setActiveSpeaker(speaker);
    setIsListening(true);
    setCurrentTranscript("");
  }, [languageA, languageB, isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
    setActiveSpeaker(null);
    setCurrentTranscript("");
  }, []);

  const handleFinalTranscript = async (speaker: "A" | "B", text: string) => {
    if (!text.trim()) return;

    const sourceLanguage = speaker === "A" ? languageA : languageB;
    const targetLanguage = speaker === "A" ? languageB : languageA;

    setIsTranslating(true);
    setCurrentTranscript("");

    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          text: text.trim(),
          sourceLanguage,
          targetLanguage,
        },
      });

      if (error) throw new Error(error.message);

      const entry: ConversationEntry = {
        id: crypto.randomUUID(),
        speaker,
        originalText: text.trim(),
        translatedText: data?.translatedText || text.trim(),
        timestamp: new Date(),
      };

      setConversation((prev) => [...prev, entry]);

      // Auto-speak the translation
      speakText(entry.translatedText, targetLanguage);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate");
    } finally {
      setIsTranslating(false);
    }
  };

  const speakText = (text: string, lang: string) => {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const swapLanguages = () => {
    setLanguageA(languageB);
    setLanguageB(languageA);
  };

  const clearConversation = () => {
    setConversation([]);
    toast.success("Conversation cleared");
  };

  const toggleSpeaker = (speaker: "A" | "B") => {
    if (isListening && activeSpeaker === speaker) {
      stopListening();
    } else {
      if (isListening) {
        stopListening();
      }
      startListening(speaker);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-accent" />
            Conversation Mode
          </CardTitle>
          {conversation.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearConversation}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <User className="h-3 w-3" /> Person A
            </div>
            <LanguageSelector
              value={languageA}
              onChange={setLanguageA}
              label=""
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={swapLanguages}
            className="mt-4"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <User className="h-3 w-3" /> Person B
            </div>
            <LanguageSelector
              value={languageB}
              onChange={setLanguageB}
              label=""
            />
          </div>
        </div>

        {/* Speaker Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={() => toggleSpeaker("A")}
            className={cn(
              "h-20 flex-col gap-2 transition-all",
              activeSpeaker === "A" && isListening
                ? "bg-accent text-accent-foreground animate-pulse"
                : "bg-muted hover:bg-muted/80"
            )}
            variant="ghost"
          >
            {activeSpeaker === "A" && isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
            <span className="text-sm">
              {langAInfo.flag} {langAInfo.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {activeSpeaker === "A" && isListening ? "Tap to stop" : "Tap to speak"}
            </span>
          </Button>
          <Button
            onClick={() => toggleSpeaker("B")}
            className={cn(
              "h-20 flex-col gap-2 transition-all",
              activeSpeaker === "B" && isListening
                ? "bg-primary text-primary-foreground animate-pulse"
                : "bg-muted hover:bg-muted/80"
            )}
            variant="ghost"
          >
            {activeSpeaker === "B" && isListening ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
            <span className="text-sm">
              {langBInfo.flag} {langBInfo.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {activeSpeaker === "B" && isListening ? "Tap to stop" : "Tap to speak"}
            </span>
          </Button>
        </div>

        {/* Current Transcript */}
        {(currentTranscript || isTranslating) && (
          <div className="rounded-lg bg-muted/50 p-3 flex items-center gap-2">
            {isTranslating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Translating...</span>
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 text-accent animate-pulse" />
                <span className="text-sm italic">{currentTranscript}</span>
              </>
            )}
          </div>
        )}

        {/* Conversation History */}
        <ScrollArea ref={scrollRef} className="h-[300px] rounded-lg border">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Users className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Start speaking to begin the conversation</p>
              <p className="text-xs mt-1">Each person taps their button to speak</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {conversation.map((entry) => (
                <div
                  key={entry.id}
                  className={cn(
                    "flex flex-col gap-1 max-w-[85%]",
                    entry.speaker === "A" ? "items-start" : "items-end ml-auto"
                  )}
                >
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Person {entry.speaker} • {entry.speaker === "A" ? langAInfo.name : langBInfo.name}
                  </span>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2",
                      entry.speaker === "A"
                        ? "bg-muted rounded-tl-none"
                        : "bg-primary text-primary-foreground rounded-tr-none"
                    )}
                  >
                    <p className="text-sm">{entry.originalText}</p>
                  </div>
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 border-2",
                      entry.speaker === "A"
                        ? "border-muted bg-background rounded-tl-none"
                        : "border-primary/30 bg-primary/10 rounded-tr-none"
                    )}
                  >
                    <div className="flex items-center gap-1 mb-1">
                      <Volume2 className="h-3 w-3 text-accent" />
                      <span className="text-xs text-muted-foreground">
                        {entry.speaker === "A" ? langBInfo.name : langAInfo.name}
                      </span>
                    </div>
                    <p className="text-sm">{entry.translatedText}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => speakText(
                      entry.translatedText,
                      entry.speaker === "A" ? languageB : languageA
                    )}
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    Listen
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
