import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Image, Video, Mic, MapPin, Hash, X, Loader2, Send } from "lucide-react";
import { VoiceRecorder } from "./VoiceRecorder";

interface CreatePostProps {
  onPostCreated?: () => void;
}

export function CreatePost({ onPostCreated }: CreatePostProps) {
  const { user, profile } = useAuth();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [location, setLocation] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreview, setMediaPreview] = useState<string[]>([]);
  const [mediaType, setMediaType] = useState<"image" | "video" | "voice" | null>(null);
  const [posting, setPosting] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setMediaFiles([file]);
    setMediaType(type);

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setMediaPreview([e.target.result as string]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMediaFiles([]);
    setMediaPreview([]);
    setMediaType(null);
    setVoiceBlob(null);
    setVoiceUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleVoiceRecordingComplete = (blob: Blob, url: string) => {
    setVoiceBlob(blob);
    setVoiceUrl(url);
    setMediaType("voice");
    setShowVoiceRecorder(false);
  };

  const handleSubmit = async () => {
    if (!user) return;
    if (!content.trim() && mediaFiles.length === 0 && !voiceBlob) {
      toast.error("Please add some content or media");
      return;
    }

    setPosting(true);
    try {
      // Run content moderation if there's text
      if (content.trim()) {
        const { data: moderationResult } = await supabase.functions.invoke("moderate", {
          body: { content: content.trim(), type: "post" },
        });

        if (moderationResult && !moderationResult.safe) {
          toast.error(`Content flagged: ${moderationResult.reason || "Please review your post"}`);
          setPosting(false);
          return;
        }
      }

      let mediaUrls: string[] = [];
      let isVoicePost = false;
      let voiceTranscription: string | null = null;

      // Upload voice recording if present
      if (voiceBlob) {
        const fileName = `${user.id}/${Date.now()}.webm`;
        const { error: uploadError } = await supabase.storage
          .from("social-media")
          .upload(fileName, voiceBlob);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("social-media")
          .getPublicUrl(fileName);

        mediaUrls.push(publicUrl);
        isVoicePost = true;

        // Transcribe the audio using translate function with transcription mode
        // For now, just mark it as a voice post
        voiceTranscription = content.trim() || "Voice message";
      }

      // Upload media if present
      if (mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from("social-media")
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from("social-media")
            .getPublicUrl(fileName);

          mediaUrls.push(publicUrl);
        }
      }

      // Parse hashtags
      const parsedHashtags = hashtags
        .split(/[,\s#]+/)
        .filter((tag) => tag.trim())
        .map((tag) => tag.trim().toLowerCase());

      // Create post
      const { error: postError } = await supabase.from("posts").insert({
        user_id: user.id,
        content: content.trim() || null,
        original_language: profile?.preferred_language || "en",
        media_urls: mediaUrls.length > 0 ? mediaUrls : null,
        media_type: isVoicePost ? "voice" : mediaType,
        location: location.trim() || null,
        hashtags: parsedHashtags.length > 0 ? parsedHashtags : null,
        is_voice_post: isVoicePost,
        voice_transcription: voiceTranscription,
      });

      if (postError) throw postError;

      toast.success("Post created successfully!");
      setContent("");
      setHashtags("");
      setLocation("");
      removeMedia();
      onPostCreated?.();
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setPosting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Create Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="What's on your mind? Share in your language..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="resize-none"
          />
        </div>

        {/* Voice Recorder */}
        {showVoiceRecorder && (
          <VoiceRecorder
            onRecordingComplete={handleVoiceRecordingComplete}
            onCancel={() => setShowVoiceRecorder(false)}
          />
        )}

        {/* Voice Preview */}
        {voiceUrl && !showVoiceRecorder && (
          <div className="relative bg-muted/50 rounded-lg p-4">
            <audio src={voiceUrl} controls className="w-full" />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeMedia}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Media preview */}
        {mediaPreview.length > 0 && (
          <div className="relative">
            {mediaType === "image" && (
              <img
                src={mediaPreview[0]}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
            )}
            {mediaType === "video" && (
              <video
                src={mediaPreview[0]}
                controls
                className="w-full max-h-64 rounded-lg"
              />
            )}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={removeMedia}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Media buttons */}
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, "image")}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "image/*";
                fileInputRef.current.click();
              }
            }}
          >
            <Image className="h-4 w-4 mr-2" />
            Image
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = "video/*";
                fileInputRef.current.click();
              }
            }}
          >
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVoiceRecorder(true)}
            disabled={showVoiceRecorder || voiceBlob !== null}
          >
            <Mic className="h-4 w-4 mr-2" />
            Voice
          </Button>
        </div>

        {/* Location and hashtags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Location (optional)
            </Label>
            <Input
              id="location"
              placeholder="Where are you?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hashtags" className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              Hashtags (optional)
            </Label>
            <Input
              id="hashtags"
              placeholder="travel, food, culture"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={posting || (!content.trim() && mediaFiles.length === 0 && !voiceBlob)}
        >
          {posting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Post
        </Button>
      </CardContent>
    </Card>
  );
}
