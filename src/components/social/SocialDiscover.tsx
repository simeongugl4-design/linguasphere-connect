import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { TrendingUp, Search, Users, Hash, Loader2, UserPlus, UserMinus } from "lucide-react";

interface TrendingHashtag {
  hashtag: string;
  count: number;
}

interface SuggestedUser {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  country_flag: string | null;
  preferred_language: string;
}

export function SocialDiscover() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [trendingHashtags, setTrendingHashtags] = useState<TrendingHashtag[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrending();
    fetchSuggestions();
    if (user) {
      fetchFollowing();
    }
  }, [user]);

  const fetchTrending = async () => {
    // Get posts with hashtags from last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data } = await supabase
      .from("posts")
      .select("hashtags")
      .gte("created_at", weekAgo.toISOString())
      .not("hashtags", "is", null);

    // Count hashtags
    const hashtagCounts: Record<string, number> = {};
    data?.forEach((post) => {
      post.hashtags?.forEach((tag: string) => {
        hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
      });
    });

    const sorted = Object.entries(hashtagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([hashtag, count]) => ({ hashtag, count }));

    setTrendingHashtags(sorted);
  };

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .limit(10);

      if (error) throw error;
      setSuggestedUsers((data as SuggestedUser[]) || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowing = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("follows")
      .select("following_id")
      .eq("follower_id", user.id);

    setFollowing(new Set(data?.map((f) => f.following_id) || []));
  };

  const handleFollow = async (targetUserId: string) => {
    if (!user) {
      toast.error("Please sign in to follow users");
      return;
    }

    if (targetUserId === user.id) {
      toast.error("You can't follow yourself");
      return;
    }

    const isFollowing = following.has(targetUserId);

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", targetUserId);
      setFollowing((prev) => {
        const next = new Set(prev);
        next.delete(targetUserId);
        return next;
      });
      toast.success("Unfollowed");
    } else {
      await supabase.from("follows").insert({
        follower_id: user.id,
        following_id: targetUserId,
      });
      setFollowing((prev) => new Set(prev).add(targetUserId));
      toast.success("Following!");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Discover
      </h2>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users, hashtags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Trending Hashtags */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          {trendingHashtags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {trendingHashtags.map((item) => (
                <Badge key={item.hashtag} variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  #{item.hashtag}
                  <span className="ml-1 text-xs text-muted-foreground">({item.count})</span>
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No trending hashtags yet</p>
          )}
        </CardContent>
      </Card>

      {/* Suggested Users */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            People to Follow
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : suggestedUsers.length > 0 ? (
            <div className="space-y-3">
              {suggestedUsers
                .filter((u) => u.user_id !== user?.id)
                .map((profile) => {
                  const displayName = profile.display_name || profile.username || "Anonymous";
                  const initials = displayName.substring(0, 2).toUpperCase();
                  const isFollowing = following.has(profile.user_id);

                  return (
                    <div key={profile.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={profile.avatar_url || undefined} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-1 font-medium text-sm">
                            {displayName}
                            {profile.country_flag && <span>{profile.country_flag}</span>}
                          </div>
                          {profile.username && (
                            <p className="text-xs text-muted-foreground">@{profile.username}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={isFollowing ? "outline" : "default"}
                        size="sm"
                        onClick={() => handleFollow(profile.user_id)}
                      >
                        {isFollowing ? (
                          <>
                            <UserMinus className="h-3 w-3 mr-1" />
                            Unfollow
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3 mr-1" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No suggestions yet. Be the first to join!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
