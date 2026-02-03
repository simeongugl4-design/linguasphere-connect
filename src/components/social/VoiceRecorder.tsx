import { Button } from "@/components/ui/button";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { Mic, Square, Pause, Play, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, url: string) => void;
  onCancel: () => void;
}

export function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const {
    isRecording,
    isPaused,
    recordingTime,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useVoiceRecording();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleConfirm = () => {
    if (audioBlob && audioUrl) {
      onRecordingComplete(audioBlob, audioUrl);
    }
  };

  const handleReset = () => {
    resetRecording();
  };

  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-4">
      {/* Recording controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording && !audioBlob && (
          <Button
            variant="default"
            size="lg"
            onClick={startRecording}
            className="rounded-full h-16 w-16"
          >
            <Mic className="h-6 w-6" />
          </Button>
        )}

        {isRecording && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={isPaused ? resumeRecording : pauseRecording}
              className="h-12 w-12 rounded-full"
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>

            <div
              className={cn(
                "flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10",
                !isPaused && "animate-pulse"
              )}
            >
              <div className="text-lg font-mono text-destructive">
                {formatTime(recordingTime)}
              </div>
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={stopRecording}
              className="h-12 w-12 rounded-full"
            >
              <Square className="h-5 w-5" />
            </Button>
          </>
        )}

        {audioBlob && !isRecording && (
          <div className="flex items-center gap-4 w-full">
            <audio src={audioUrl || undefined} controls className="flex-1 h-10" />
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="default" size="icon" onClick={handleConfirm}>
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Info text */}
      <div className="text-center text-sm text-muted-foreground">
        {!isRecording && !audioBlob && "Tap to start recording"}
        {isRecording && !isPaused && "Recording... Tap square to stop"}
        {isRecording && isPaused && "Paused. Tap play to resume"}
        {audioBlob && !isRecording && "Review your recording"}
      </div>

      {/* Cancel button */}
      <Button variant="ghost" size="sm" onClick={onCancel} className="w-full">
        Cancel
      </Button>
    </div>
  );
}
