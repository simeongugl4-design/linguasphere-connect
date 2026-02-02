import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Settings, LogOut, Globe, MapPin, Loader2, Camera } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import { countryLanguageMap } from "@/lib/countryLanguages";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SocialProfile() {
  const { user, profile, signOut, updateProfile, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [country, setCountry] = useState(profile?.country || "");
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || "en");

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setCountry(profile.country || "");
      setPreferredLanguage(profile.preferred_language || "en");
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const [followers, following, posts] = await Promise.all([
      supabase.from("follows").select("id", { count: "exact" }).eq("following_id", user.id),
      supabase.from("follows").select("id", { count: "exact" }).eq("follower_id", user.id),
      supabase.from("posts").select("id", { count: "exact" }).eq("user_id", user.id),
    ]);

    setFollowerCount(followers.count || 0);
    setFollowingCount(following.count || 0);
    setPostCount(posts.count || 0);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("social-media")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("social-media")
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: publicUrl });
      toast.success("Avatar updated!");
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const countryData = countryLanguageMap[country];
      await updateProfile({
        display_name: displayName,
        bio,
        country,
        country_flag: countryData?.flag || null,
        preferred_language: preferredLanguage,
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };

  const initials = (displayName || profile?.username || "U").substring(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:opacity-80 transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                />
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
            </div>

            {/* Name and username */}
            <div className="text-center">
              <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                {profile?.display_name || profile?.username || "Anonymous"}
                {profile?.country_flag && <span>{profile.country_flag}</span>}
              </h2>
              {profile?.username && (
                <p className="text-muted-foreground">@{profile.username}</p>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-center">
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
            {profile?.bio && (
              <p className="text-center text-sm text-muted-foreground max-w-xs">
                {profile.bio}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Settings className="h-5 w-5" />
            {editing ? "Edit Profile" : "Settings"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {Object.entries(countryLanguageMap).map(([countryName, data]) => (
                      <SelectItem key={countryName} value={countryName}>
                        {data.flag} {countryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred Language</Label>
                <LanguageSelector
                  value={preferredLanguage}
                  onChange={setPreferredLanguage}
                  showAutoDetect={false}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  Save
                </Button>
                <Button variant="outline" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Preferred Language:</span>
                  <Badge variant="secondary">{preferredLanguage.toUpperCase()}</Badge>
                </div>
                {profile?.country && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Country:</span>
                    <span>{profile.country_flag} {profile.country}</span>
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setEditing(true)} className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="destructive" onClick={handleSignOut} className="w-full">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
