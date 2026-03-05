import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "./PostCard";
import { StoriesBar } from "./StoriesBar";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Post {
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
}

export function SocialFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      
      // Fetch profiles separately for each post
      const postsWithProfiles = await Promise.all(
        (data || []).map(async (post) => {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username, display_name, avatar_url, country_flag")
            .eq("user_id", post.user_id)
            .single();
          return { ...post, profiles: profileData } as Post;
        })
      );
      
      setPosts(postsWithProfiles);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("posts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        () => {
          fetchPosts(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stories */}
      <StoriesBar />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Global Feed</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchPosts(true)}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No posts yet. Be the first to share something!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpdate={() => fetchPosts(true)} />
          ))}
        </div>
      )}
    </div>
  );
}
