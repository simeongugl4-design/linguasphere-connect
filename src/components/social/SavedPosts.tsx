import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Bookmark, Loader2, Trash2, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SavedPost {
  id: string;
  created_at: string;
  post: {
    id: string;
    content: string | null;
    created_at: string;
    profiles?: {
      username: string | null;
      display_name: string | null;
      avatar_url: string | null;
    };
  };
}

export function SavedPosts() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedPosts = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("saved_posts")
        .select(`
          id,
          created_at,
          post_id
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch posts and profiles separately
      const postsWithDetails = await Promise.all(
        (data || []).map(async (saved) => {
          const { data: postData } = await supabase
            .from("posts")
            .select("id, content, created_at, user_id")
            .eq("id", saved.post_id)
            .single();

          if (!postData) return null;

          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, display_name, avatar_url")
            .eq("user_id", postData.user_id)
            .single();

          return {
            id: saved.id,
            created_at: saved.created_at,
            post: {
              ...postData,
              profiles: profileData,
            },
          };
        })
      );

      setSavedPosts(postsWithDetails.filter(Boolean) as SavedPost[]);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSavedPosts();
    }
  }, [user]);

  const handleRemove = async (savedId: string) => {
    try {
      await supabase.from("saved_posts").delete().eq("id", savedId);
      setSavedPosts((prev) => prev.filter((p) => p.id !== savedId));
      toast.success("Removed from saved");
    } catch (error) {
      toast.error("Failed to remove");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" />
          Saved Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        {savedPosts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No saved posts yet</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {savedPosts.map((saved) => {
                const displayName =
                  saved.post.profiles?.display_name ||
                  saved.post.profiles?.username ||
                  "Anonymous";
                const initials = displayName.substring(0, 2).toUpperCase();

                return (
                  <div
                    key={saved.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={saved.post.profiles?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{displayName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {saved.post.content || "No text content"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Saved{" "}
                        {formatDistanceToNow(new Date(saved.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(saved.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
