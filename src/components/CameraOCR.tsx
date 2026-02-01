import { useState, useRef, useCallback } from "react";
import { Camera, Upload, X, Loader2, Copy, Check, Languages, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LanguageSelector } from "@/components/LanguageSelector";
import { supabase } from "@/integrations/supabase/client";

interface CameraOCRProps {
  onTextExtracted?: (text: string, translatedText?: string) => void;
}

export function CameraOCR({ onTextExtracted }: CameraOCRProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [copied, setCopied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCapturing(true);
    } catch (error) {
      console.error("Camera access error:", error);
      toast.error("Could not access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      setCapturedImage(imageData);
      stopCamera();
      processImage(imageData);
    }
  }, [stopCamera]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setCapturedImage(imageData);
      processImage(imageData);
    };
    reader.readAsDataURL(file);
  }, []);

  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    setExtractedText("");
    setTranslatedText("");

    try {
      const { data, error } = await supabase.functions.invoke("ocr-translate", {
        body: {
          image: imageData,
          targetLanguage,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.extractedText) {
        setExtractedText(data.extractedText);
        if (data.translatedText) {
          setTranslatedText(data.translatedText);
        }
        onTextExtracted?.(data.extractedText, data.translatedText);
        toast.success("Text extracted successfully!");
      } else {
        toast.info("No text detected in the image");
      }
    } catch (error) {
      console.error("OCR error:", error);
      toast.error("Failed to extract text from image");
    } finally {
      setIsProcessing(false);
    }
  };

  const translateExtractedText = async () => {
    if (!extractedText) return;

    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          text: extractedText,
          sourceLanguage: "auto",
          targetLanguage,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.translatedText) {
        setTranslatedText(data.translatedText);
        toast.success("Translation complete!");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate text");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setExtractedText("");
    setTranslatedText("");
    stopCamera();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-accent" />
          Camera & Image Translation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Language Selection */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Translate to:</span>
          <div className="flex-1">
            <LanguageSelector
              value={targetLanguage}
              onChange={setTargetLanguage}
              label=""
            />
          </div>
        </div>

        {/* Camera/Upload Section */}
        {!capturedImage && !isCapturing && (
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={startCamera}
              className="flex-1 gap-2"
              variant="outline"
            >
              <Camera className="h-4 w-4" />
              Open Camera
            </Button>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 gap-2"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Camera Preview */}
        {isCapturing && (
          <div className="relative rounded-lg overflow-hidden bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full aspect-video object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button
                onClick={capturePhoto}
                size="lg"
                className="rounded-full h-16 w-16 gradient-primary"
              >
                <Camera className="h-6 w-6" />
              </Button>
              <Button
                onClick={stopCamera}
                size="lg"
                variant="destructive"
                className="rounded-full h-16 w-16"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}

        {/* Captured Image Preview */}
        {capturedImage && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full max-h-64 object-contain bg-muted"
              />
              <Button
                onClick={reset}
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {isProcessing && (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Extracting text from image...</span>
              </div>
            )}

            {/* Extracted Text */}
            {extractedText && (
              <div className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Extracted Text
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(extractedText)}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{extractedText}</p>
                </div>

                {/* Translate Button */}
                {!translatedText && (
                  <Button
                    onClick={translateExtractedText}
                    disabled={isTranslating}
                    className="w-full gap-2"
                  >
                    {isTranslating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Languages className="h-4 w-4" />
                    )}
                    Translate Text
                  </Button>
                )}

                {/* Translated Text */}
                {translatedText && (
                  <div className="rounded-lg bg-accent/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Languages className="h-4 w-4 text-accent" />
                        Translated Text
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(translatedText)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{translatedText}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}
