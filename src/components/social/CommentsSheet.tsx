import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Send, Globe } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  original_language: string | null;
  created_at: string;
  user_id: string;
  profiles?: {
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    country_flag: string | null;
  };
}

interface CommentsSheetProps {
  postId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommentsSheet({ postId, open, onOpenChange }: CommentsSheetProps) {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      
      // Fetch profiles separately
      const commentsWithProfiles = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, display_name, avatar_url, country_flag")
            .eq("user_id", comment.user_id)
            .single();
          return { ...comment, profiles: profileData } as Comment;
        })
      );
      
      setComments(commentsWithProfiles);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, postId]);

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        user_id: user.id,
        content: newComment.trim(),
        original_language: profile?.preferred_language || "en",
      });

      if (error) throw error;

      setNewComment("");
      fetchComments();
      toast.success("Comment posted");
    } catch (error) {
      toast.error("Failed to post comment");
    } finally {
      setPosting(false);
    }
  };

  const translateComment = async (commentId: string, content: string) => {
    const targetLang = profile?.preferred_language || "en";

    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: {
          text: content,
          sourceLanguage: "auto",
          targetLanguage: targetLang,
        },
      });

      if (error) throw error;

      setTranslations((prev) => ({
        ...prev,
        [commentId]: data.translatedText,
      }));
    } catch (err) {
      toast.error("Failed to translate");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto py-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No comments yet. Be the first!
            </p>
          ) : (
            comments.map((comment) => {
              const displayName =
                comment.profiles?.display_name ||
                comment.profiles?.username ||
                "Anonymous";
              const initials = displayName.substring(0, 2).toUpperCase();

              return (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.profiles?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{displayName}</span>
                      {comment.profiles?.country_flag && (
                        <span className="text-sm">{comment.profiles.country_flag}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    {translations[comment.id] && (
                      <div className="bg-muted/50 rounded p-2 mt-1 border-l-2 border-accent">
                        <p className="text-sm">{translations[comment.id]}</p>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => translateComment(comment.id, comment.content)}
                    >
                      <Globe className="h-3 w-3 mr-1" />
                      Translate
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Comment input */}
        <div className="border-t pt-4 space-y-2">
          <Textarea
            placeholder={user ? "Write a comment..." : "Sign in to comment"}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!user}
            rows={2}
          />
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!user || !newComment.trim() || posting}
          >
            {posting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Post Comment
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
