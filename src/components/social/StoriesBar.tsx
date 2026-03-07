import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Plus, X, ChevronLeft, ChevronRight, Loader2, Image, Type, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Story {
  id: string;
  user_id: string;
  content: string | null;
  media_url: string | null;
  media_type: string;
  background_color: string;
  created_at: string;
  expires_at: string;
}

interface GroupedStories {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  stories: Story[];
}

const STORY_COLORS = [
  "#0d9488", "#6366f1", "#e11d48", "#ea580c",
  "#16a34a", "#9333ea", "#0284c7", "#d97706",
];

export function StoriesBar() {
  const { user } = useAuth();
  const [groupedStories, setGroupedStories] = useState<GroupedStories[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [activeGroup, setActiveGroup] = useState<number>(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Create story state
  const [storyContent, setStoryContent] = useState("");
  const [storyColor, setStoryColor] = useState(STORY_COLORS[0]);
  const [storyMediaFile, setStoryMediaFile] = useState<File | null>(null);
  const [storyMediaPreview, setStoryMediaPreview] = useState<string | null>(null);
  const [storyType, setStoryType] = useState<"text" | "image">("text");
  const [posting, setPosting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reaction state
  const REACTION_EMOJIS = ["❤️", "😂", "😮", "😢", "🔥", "👏"];
  const [reactions, setReactions] = useState<Record<string, { emoji: string; count: number }[]>>({});
  const [myReaction, setMyReaction] = useState<Record<string, string | null>>({});
  const [showReactions, setShowReactions] = useState(false);

  // View count state
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Group by user and fetch profiles
      const userMap = new Map<string, Story[]>();
      (data || []).forEach((story: Story) => {
        const existing = userMap.get(story.user_id) || [];
        existing.push(story);
        userMap.set(story.user_id, existing);
      });

      const groups: GroupedStories[] = [];
      for (const [userId, stories] of userMap) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, display_name, avatar_url")
          .eq("user_id", userId)
          .single();

        groups.push({
          user_id: userId,
          username: profile?.username || null,
          display_name: profile?.display_name || null,
          avatar_url: profile?.avatar_url || null,
          stories,
        });
      }

      // Put current user's stories first
      if (user) {
        groups.sort((a, b) => {
          if (a.user_id === user.id) return -1;
          if (b.user_id === user.id) return 1;
          return 0;
        });
      }

      setGroupedStories(groups);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();

    const channel = supabase
      .channel("stories-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "stories" }, () => {
        fetchStories();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStoryMediaFile(file);
    setStoryType("image");
    const reader = new FileReader();
    reader.onload = (ev) => setStoryMediaPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreateStory = async () => {
    if (!user) { toast.error("Please sign in to post a story"); return; }
    if (!storyContent.trim() && !storyMediaFile) { toast.error("Add text or an image"); return; }

    setPosting(true);
    try {
      let mediaUrl: string | null = null;

      if (storyMediaFile) {
        const ext = storyMediaFile.name.split(".").pop();
        const fileName = `stories/${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("social-media")
          .upload(fileName, storyMediaFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("social-media")
          .getPublicUrl(fileName);
        mediaUrl = publicUrl;
      }

      const { error } = await supabase.from("stories").insert({
        user_id: user.id,
        content: storyContent.trim() || null,
        media_url: mediaUrl,
        media_type: storyType,
        background_color: storyColor,
      });

      if (error) throw error;

      toast.success("Story posted!");
      setShowCreate(false);
      setStoryContent("");
      setStoryMediaFile(null);
      setStoryMediaPreview(null);
      setStoryType("text");
      setStoryColor(STORY_COLORS[0]);
    } catch (error) {
      console.error("Error creating story:", error);
      toast.error("Failed to post story");
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteStory = async (storyId: string) => {
    try {
      const { error } = await supabase.from("stories").delete().eq("id", storyId);
      if (error) throw error;
      toast.success("Story deleted");
      setShowViewer(false);
    } catch { toast.error("Failed to delete story"); }
  };

  const fetchReactions = async (storyId: string) => {
    const { data } = await supabase
      .from("story_reactions")
      .select("emoji, user_id")
      .eq("story_id", storyId);
    if (!data) return;

    const counts: Record<string, number> = {};
    let mine: string | null = null;
    data.forEach((r: { emoji: string; user_id: string }) => {
      counts[r.emoji] = (counts[r.emoji] || 0) + 1;
      if (r.user_id === user?.id) mine = r.emoji;
    });

    setReactions((prev) => ({
      ...prev,
      [storyId]: Object.entries(counts).map(([emoji, count]) => ({ emoji, count })),
    }));
    setMyReaction((prev) => ({ ...prev, [storyId]: mine }));
  };

  const handleReact = async (storyId: string, emoji: string) => {
    if (!user) { toast.error("Sign in to react"); return; }

    const current = myReaction[storyId];
    try {
      if (current === emoji) {
        // Remove reaction
        await supabase.from("story_reactions").delete().eq("story_id", storyId).eq("user_id", user.id);
        setMyReaction((prev) => ({ ...prev, [storyId]: null }));
      } else if (current) {
        // Update reaction
        await supabase.from("story_reactions").update({ emoji }).eq("story_id", storyId).eq("user_id", user.id);
        setMyReaction((prev) => ({ ...prev, [storyId]: emoji }));
      } else {
        // Insert reaction
        await supabase.from("story_reactions").insert({ story_id: storyId, user_id: user.id, emoji });
        setMyReaction((prev) => ({ ...prev, [storyId]: emoji }));
      }
      fetchReactions(storyId);
      setShowReactions(false);
    } catch { toast.error("Failed to react"); }
  };

  const openStoryGroup = (groupIndex: number) => {
    setActiveGroup(groupIndex);
    setActiveStoryIndex(0);
    setShowViewer(true);
    setShowReactions(false);
  };

  const recordView = async (storyId: string) => {
    if (!user) return;
    await supabase.from("story_views").upsert(
      { story_id: storyId, viewer_id: user.id },
      { onConflict: "story_id,viewer_id" }
    );
  };

  const fetchViewCount = async (storyId: string) => {
    const { count } = await supabase
      .from("story_views")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId);
    setViewCounts((prev) => ({ ...prev, [storyId]: count || 0 }));
  };

  // Fetch reactions/views and record view when active story changes
  useEffect(() => {
    if (showViewer && groupedStories[activeGroup]?.stories[activeStoryIndex]) {
      const storyId = groupedStories[activeGroup].stories[activeStoryIndex].id;
      fetchReactions(storyId);
      fetchViewCount(storyId);
      recordView(storyId);
    }
  }, [showViewer, activeGroup, activeStoryIndex]);

  const nextStory = () => {
    const group = groupedStories[activeGroup];
    if (activeStoryIndex < group.stories.length - 1) {
      setActiveStoryIndex((i) => i + 1);
    } else if (activeGroup < groupedStories.length - 1) {
      setActiveGroup((g) => g + 1);
      setActiveStoryIndex(0);
    } else {
      setShowViewer(false);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex((i) => i - 1);
    } else if (activeGroup > 0) {
      setActiveGroup((g) => g - 1);
      const prevGroup = groupedStories[activeGroup - 1];
      setActiveStoryIndex(prevGroup.stories.length - 1);
    }
  };

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  const currentUserHasStory = groupedStories.some((g) => g.user_id === user?.id);
  const currentStory = showViewer ? groupedStories[activeGroup]?.stories[activeStoryIndex] : null;
  const currentGroup = showViewer ? groupedStories[activeGroup] : null;

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return `${Math.floor(diff / 60000)}m ago`;
    return `${hours}h ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 overflow-hidden py-3 px-1">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 animate-pulse">
            <div className="w-16 h-16 rounded-full bg-muted" />
            <div className="w-12 h-2 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Stories Scroll Bar */}
      <div className="relative group mb-4">
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background/80 shadow-md hidden group-hover:flex"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 h-8 w-8 rounded-full bg-background/80 shadow-md hidden group-hover:flex"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        <div ref={scrollRef} className="flex items-start gap-3 overflow-x-auto scrollbar-hide py-2 px-1">
          {/* Add Story Button */}
          {user && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 group/add"
            >
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border-2 border-dashed border-accent/50 group-hover/add:border-accent transition-colors">
                {currentUserHasStory ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={groupedStories.find(g => g.user_id === user.id)?.avatar_url || undefined} />
                    <AvatarFallback className="bg-accent/20 text-accent">
                      <Plus className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Plus className="h-6 w-6 text-accent" />
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Plus className="h-3 w-3 text-accent-foreground" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium truncate w-16 text-center">
                Your Story
              </span>
            </button>
          )}

          {/* User Story Circles */}
          {groupedStories.map((group, index) => {
            if (group.user_id === user?.id && currentUserHasStory) {
              return (
                <button
                  key={group.user_id}
                  onClick={() => openStoryGroup(index)}
                  className="flex flex-col items-center gap-1.5 flex-shrink-0"
                >
                  <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-accent via-primary to-accent animate-gradient-slow">
                    <Avatar className="w-full h-full border-2 border-background rounded-full">
                      <AvatarImage src={group.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">{(group.display_name || group.username || "?")[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-medium truncate w-16 text-center">
                    You
                  </span>
                </button>
              );
            }
            return (
              <button
                key={group.user_id}
                onClick={() => openStoryGroup(index)}
                className="flex flex-col items-center gap-1.5 flex-shrink-0"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-br from-accent via-primary to-accent">
                  <Avatar className="w-full h-full border-2 border-background rounded-full">
                    <AvatarImage src={group.avatar_url || undefined} />
                    <AvatarFallback className="text-xs">{(group.display_name || group.username || "?")[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium truncate w-16 text-center">
                  {group.display_name || group.username || "User"}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Create Story Dialog */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Story</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Type Toggle */}
            <div className="flex gap-2">
              <Button
                variant={storyType === "text" ? "default" : "outline"}
                size="sm"
                onClick={() => { setStoryType("text"); setStoryMediaFile(null); setStoryMediaPreview(null); }}
              >
                <Type className="h-4 w-4 mr-1" /> Text
              </Button>
              <Button
                variant={storyType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Image className="h-4 w-4 mr-1" /> Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            {/* Preview */}
            <div
              className="relative w-full aspect-[9/16] max-h-[400px] rounded-xl overflow-hidden flex items-center justify-center"
              style={{
                backgroundColor: storyType === "text" ? storyColor : "#000",
              }}
            >
              {storyType === "image" && storyMediaPreview ? (
                <>
                  <img src={storyMediaPreview} alt="Story" className="w-full h-full object-cover" />
                  {storyContent && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4">
                      <p className="text-white text-sm text-center">{storyContent}</p>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-white text-xl font-bold text-center px-6 leading-relaxed break-words">
                  {storyContent || "Your story..."}
                </p>
              )}
            </div>

            {/* Color Picker (text mode) */}
            {storyType === "text" && (
              <div className="flex items-center gap-2 justify-center">
                {STORY_COLORS.map((color) => (
                  <button
                    key={color}
                    className={cn(
                      "w-7 h-7 rounded-full transition-transform",
                      storyColor === color && "ring-2 ring-offset-2 ring-accent scale-110"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setStoryColor(color)}
                  />
                ))}
              </div>
            )}

            {/* Text Input */}
            <Textarea
              placeholder={storyType === "image" ? "Add a caption..." : "What's your status?"}
              value={storyContent}
              onChange={(e) => setStoryContent(e.target.value)}
              rows={2}
              className="resize-none"
              maxLength={280}
            />
            <p className="text-xs text-muted-foreground text-right">{storyContent.length}/280</p>

            <Button
              className="w-full"
              onClick={handleCreateStory}
              disabled={posting || (!storyContent.trim() && !storyMediaFile)}
            >
              {posting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Share Story
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Story Viewer */}
      <Dialog open={showViewer} onOpenChange={setShowViewer}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-black border-0">
          {currentStory && currentGroup && (
            <div className="relative w-full aspect-[9/16] max-h-[80vh] flex flex-col">
              {/* Progress bars */}
              <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-2">
                {currentGroup.stories.map((_, i) => (
                  <div key={i} className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full bg-white transition-all duration-300",
                        i < activeStoryIndex ? "w-full" : i === activeStoryIndex ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                ))}
              </div>

              {/* Header */}
              <div className="absolute top-4 left-0 right-0 z-30 flex items-center justify-between px-3 pt-2">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8 border border-white/30">
                    <AvatarImage src={currentGroup.avatar_url || undefined} />
                    <AvatarFallback className="text-xs text-white bg-white/20">
                      {(currentGroup.display_name || currentGroup.username || "?")[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white text-xs font-semibold">{currentGroup.display_name || currentGroup.username}</p>
                    <p className="text-white/60 text-[10px]">{timeAgo(currentStory.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {currentStory.user_id === user?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white/20"
                      onClick={() => handleDeleteStory(currentStory.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/20"
                    onClick={() => setShowViewer(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Story Content */}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  backgroundColor: currentStory.media_type === "text" ? currentStory.background_color : "#000",
                }}
              >
                {currentStory.media_type === "image" && currentStory.media_url ? (
                  <>
                    <img src={currentStory.media_url} alt="" className="w-full h-full object-cover" />
                    {currentStory.content && (
                      <div className="absolute bottom-16 left-0 right-0 bg-black/60 p-4">
                        <p className="text-white text-sm text-center">{currentStory.content}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-white text-xl font-bold text-center px-8 leading-relaxed break-words">
                    {currentStory.content}
                  </p>
                )}
              </div>

              {/* Reaction Bar */}
              <div className="absolute bottom-2 left-0 right-0 z-30 flex flex-col items-center gap-2 px-4">
                {/* Existing reactions display */}
                {reactions[currentStory.id]?.length > 0 && (
                  <div className="flex gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5">
                    {reactions[currentStory.id].map((r) => (
                      <button
                        key={r.emoji}
                        onClick={() => handleReact(currentStory.id, r.emoji)}
                        className={cn(
                          "flex items-center gap-0.5 text-sm transition-transform hover:scale-110",
                          myReaction[currentStory.id] === r.emoji && "scale-110"
                        )}
                      >
                        <span>{r.emoji}</span>
                        <span className="text-[10px] text-white/80">{r.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Emoji picker toggle */}
                {showReactions ? (
                  <div className="flex gap-2 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {REACTION_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReact(currentStory.id, emoji)}
                        className={cn(
                          "text-2xl transition-transform hover:scale-125 active:scale-90",
                          myReaction[currentStory.id] === emoji && "scale-125 ring-2 ring-white/40 rounded-full"
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1"
                    onClick={() => setShowReactions(true)}
                  >
                    😊 React
                  </Button>
                )}
              </div>

              {/* Navigation areas */}
              <button
                className="absolute left-0 top-16 bottom-24 w-1/3 z-20"
                onClick={prevStory}
              />
              <button
                className="absolute right-0 top-16 bottom-24 w-1/3 z-20"
                onClick={nextStory}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
