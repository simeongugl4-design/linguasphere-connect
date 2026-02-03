import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { MessageCircle, UserPlus, UserMinus, Loader2, Globe, MapPin } from "lucide-react";

interface UserProfile {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  country: string | null;
  country_flag: string | null;
  preferred_language: string | null;
  language_skills: string[] | null;
}

interface UserProfileSheetProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartChat?: (userId: string) => void;
}

export function UserProfileSheet({
  userId,
  open,
  onOpenChange,
  onStartChat,
}: UserProfileSheetProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (open && userId) {
      fetchProfile();
      fetchStats();
      if (user) {
        checkFollowStatus();
      }
    }
  }, [open, userId, user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setProfile(data as UserProfile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    const [followers, following, posts] = await Promise.all([
      supabase.from("follows").select("id", { count: "exact" }).eq("following_id", userId),
      supabase.from("follows").select("id", { count: "exact" }).eq("follower_id", userId),
      supabase.from("posts").select("id", { count: "exact" }).eq("user_id", userId),
    ]);

    setFollowerCount(followers.count || 0);
    setFollowingCount(following.count || 0);
    setPostCount(posts.count || 0);
  };

  const checkFollowStatus = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", user.id)
      .eq("following_id", userId)
      .single();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!user) {
      toast.error("Please sign in to follow users");
      return;
    }

    setActionLoading(true);
    try {
      if (isFollowing) {
        await supabase
          .from("follows")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", userId);
        setIsFollowing(false);
        setFollowerCount((prev) => prev - 1);
        toast.success("Unfollowed");
      } else {
        await supabase.from("follows").insert({
          follower_id: user.id,
          following_id: userId,
        });
        setIsFollowing(true);
        setFollowerCount((prev) => prev + 1);
        toast.success("Following!");
      }
    } catch (error) {
      toast.error("Failed to update follow status");
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessage = () => {
    onOpenChange(false);
    onStartChat?.(userId);
  };

  const initials = (profile?.display_name || profile?.username || "U")
    .substring(0, 2)
    .toUpperCase();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Profile</SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : profile ? (
          <div className="mt-6 space-y-6">
            {/* Avatar and name */}
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                  {profile.display_name || profile.username || "Anonymous"}
                  {profile.country_flag && <span>{profile.country_flag}</span>}
                </h2>
                {profile.username && (
                  <p className="text-muted-foreground">@{profile.username}</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-6 text-center">
              <div>
                <div className="font-semibold">{postCount}</div>
                <div className="text-xs text-muted-foreground">Posts</div>
              </div>
              <div>
                <div className="font-semibold">{followerCount}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </div>
              <div>
                <div className="font-semibold">{followingCount}</div>
                <div className="text-xs text-muted-foreground">Following</div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-center text-sm text-muted-foreground">
                {profile.bio}
              </p>
            )}

            {/* Info */}
            <div className="space-y-2">
              {profile.preferred_language && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Language:</span>
                  <Badge variant="secondary">
                    {profile.preferred_language.toUpperCase()}
                  </Badge>
                </div>
              )}
              {profile.country && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Country:</span>
                  <span>
                    {profile.country_flag} {profile.country}
                  </span>
                </div>
              )}
              {profile.language_skills && profile.language_skills.length > 0 && (
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Speaks:</span>
                  {profile.language_skills.map((lang) => (
                    <Badge key={lang} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {user && user.id !== userId && (
              <div className="flex gap-2">
                <Button
                  onClick={handleFollow}
                  disabled={actionLoading}
                  variant={isFollowing ? "outline" : "default"}
                  className="flex-1"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
                <Button onClick={handleMessage} variant="secondary" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <p>User not found</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
