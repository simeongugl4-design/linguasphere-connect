import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2, Bookmark, Globe, Volume2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { CommentsSheet } from "./CommentsSheet";
import { useRef } from "react";

interface PostCardProps {
  post: {
    id: string;
    user_id: string;
    content: string | null;
    original_language: string | null;
    media_urls: string[] | null;
    media_type: string | null;
    location: string | null;
    hashtags: string[] | null;
    is_voice_post: boolean;
    voice_transcription: string | null;
    likes_count: number;
    comments_count: number;
    shares_count: number;
    created_at: string;
    profiles?: {
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
      country_flag: string | null;
    };
  };
  onUpdate?: () => void;
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { user, profile } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedContent, setTranslatedContent] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (user) {
      checkLikeStatus();
      checkSaveStatus();
    }
  }, [user, post.id]);

  const checkLikeStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .single();
    setIsLiked(!!data);
  };

  const checkSaveStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("saved_posts")
      .select("id")
      .eq("post_id", post.id)
      .eq("user_id", user.id)
      .single();
    setIsSaved(!!data);
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please sign in to like posts");
      return;
    }

    if (isLiked) {
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      await supabase
        .from("likes")
        .insert({ post_id: post.id, user_id: user.id });
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast.error("Please sign in to save posts");
      return;
    }

    if (isSaved) {
      await supabase
        .from("saved_posts")
        .delete()
        .eq("post_id", post.id)
        .eq("user_id", user.id);
      setIsSaved(false);
      toast.success("Post removed from saved");
    } else {
      await supabase
        .from("saved_posts")
        .insert({ post_id: post.id, user_id: user.id });
      setIsSaved(true);
      toast.success("Post saved");
    }
  };

  const handleTranslate = async () => {
    if (!post.content) return;

    const targetLang = profile?.preferred_language || "en";
    if (post.original_language === targetLang) {
      toast.info("This post is already in your preferred language");
      return;
    }

    // Check cache first
    const { data: cached } = await supabase
      .from("post_translations")
      .select("translated_content")
      .eq("post_id", post.id)
      .eq("target_language", targetLang)
      .single();

    if (cached?.translated_content) {
      setTranslatedContent(cached.translated_content);
      setShowTranslation(true);
      return;
    }

    setTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          text: post.content,
          sourceLanguage: post.original_language || "auto",
          targetLanguage: targetLang,
        },
      });

      if (error) throw error;

      // Cache the translation
      await supabase.from("post_translations").insert({
        post_id: post.id,
        target_language: targetLang,
        translated_content: data.translatedText,
      });

      setTranslatedContent(data.translatedText);
      setShowTranslation(true);
    } catch (err) {
      toast.error("Failed to translate");
    } finally {
      setTranslating(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + `/post/${post.id}`);
    toast.success("Link copied to clipboard");
  };

  const toggleVoicePlay = () => {
    if (audioRef.current) {
      if (isPlayingVoice) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayingVoice(!isPlayingVoice);
    }
  };

  const displayName = post.profiles?.display_name || post.profiles?.username || "Anonymous";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.profiles?.avatar_url || undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{displayName}</span>
                {post.profiles?.country_flag && (
                  <span className="text-lg">{post.profiles.country_flag}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                {post.location && (
                  <>
                    <span>•</span>
                    <span>{post.location}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Content */}
          <div className="space-y-2">
            <p className="whitespace-pre-wrap">{post.content}</p>
            {showTranslation && translatedContent && (
              <div className="bg-muted/50 rounded-lg p-3 border-l-2 border-accent">
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Globe className="h-3 w-3" />
                  Translated
                </div>
                <p className="whitespace-pre-wrap">{translatedContent}</p>
              </div>
            )}
          </div>

          {/* Media */}
          {post.media_urls && post.media_urls.length > 0 && (
            <div className="grid gap-2">
              {post.media_urls.map((url, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden">
                  {post.media_type === "image" && (
                    <img src={url} alt="" className="w-full max-h-96 object-cover" />
                  )}
                  {post.media_type === "video" && (
                    <video src={url} controls className="w-full max-h-96" />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Voice post player */}
          {post.is_voice_post && post.media_urls && post.media_urls.length > 0 && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full"
                onClick={toggleVoicePlay}
              >
                {isPlayingVoice ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Voice Message</span>
                </div>
                {post.voice_transcription && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {post.voice_transcription}
                  </p>
                )}
              </div>
              <audio
                ref={audioRef}
                src={post.media_urls[0]}
                onEnded={() => setIsPlayingVoice(false)}
                className="hidden"
              />
            </div>
          )}

          {/* Voice post indicator (for posts without audio URL) */}
          {post.is_voice_post && (!post.media_urls || post.media_urls.length === 0) && (
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
              <Volume2 className="h-5 w-5 text-accent" />
              <span className="text-sm text-muted-foreground">Voice post</span>
            </div>
          )}

          {/* Hashtags */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.hashtags.map((tag, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t pt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? "fill-destructive text-destructive" : ""}`} />
              <span className="ml-1 text-xs">{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowComments(true)}>
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1 text-xs">{post.comments_count}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTranslate}
              disabled={translating}
            >
              <Globe className={`h-4 w-4 ${showTranslation ? "text-accent" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Bookmark className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <CommentsSheet
        postId={post.id}
        open={showComments}
        onOpenChange={setShowComments}
      />
    </>
  );
}
