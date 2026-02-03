import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  Loader2,
  Globe,
  User,
} from "lucide-react";

interface Conversation {
  id: string;
  participant_1: string;
  participant_2: string;
  last_message_at: string;
  other_user_profile?: {
    user_id: string;
    username: string | null;
    display_name: string | null;
    avatar_url: string | null;
    country_flag: string | null;
  };
  last_message?: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  original_language: string | null;
  is_read: boolean;
  created_at: string;
  translated_content?: string;
}

export function DirectMessages() {
  const { user, profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("conversations")
        .select("*")
        .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
        .order("last_message_at", { ascending: false });

      if (error) throw error;

      // Fetch other user profiles and last messages
      const conversationsWithProfiles = await Promise.all(
        (data || []).map(async (conv) => {
          const otherUserId =
            conv.participant_1 === user.id ? conv.participant_2 : conv.participant_1;

          const { data: profileData } = await supabase
            .from("profiles")
            .select("user_id, username, display_name, avatar_url, country_flag")
            .eq("user_id", otherUserId)
            .single();

          const { data: lastMessage } = await supabase
            .from("messages")
            .select("content")
            .eq("conversation_id", conv.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            ...conv,
            other_user_profile: profileData,
            last_message: lastMessage?.content,
          } as Conversation;
        })
      );

      setConversations(conversationsWithProfiles);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }

    setMessages(data || []);

    // Mark messages as read
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", user?.id || "");
  };

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation.id);

      // Subscribe to new messages
      const channel = supabase
        .channel(`messages-${activeConversation.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${activeConversation.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeConversation]);

  const handleSearchUsers = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, username, display_name, avatar_url, country_flag")
        .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
        .neq("user_id", user?.id || "")
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setSearching(false);
    }
  };

  const startConversation = async (otherUserId: string) => {
    if (!user) return;

    // Check if conversation already exists
    const existing = conversations.find(
      (c) =>
        (c.participant_1 === user.id && c.participant_2 === otherUserId) ||
        (c.participant_1 === otherUserId && c.participant_2 === user.id)
    );

    if (existing) {
      setActiveConversation(existing);
      setSearchQuery("");
      setSearchResults([]);
      return;
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        participant_1: user.id,
        participant_2: otherUserId,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to start conversation");
      return;
    }

    // Fetch other user profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("user_id, username, display_name, avatar_url, country_flag")
      .eq("user_id", otherUserId)
      .single();

    const newConversation = {
      ...data,
      other_user_profile: profileData,
    } as Conversation;

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversation(newConversation);
    setSearchQuery("");
    setSearchResults([]);
  };

  const sendMessage = async () => {
    if (!user || !activeConversation || !newMessage.trim()) return;

    setSendingMessage(true);
    try {
      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConversation.id,
        sender_id: user.id,
        content: newMessage.trim(),
        original_language: profile?.preferred_language || "en",
      });

      if (error) throw error;

      // Update last_message_at
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", activeConversation.id);

      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSendingMessage(false);
    }
  };

  const translateMessage = async (messageId: string, content: string) => {
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

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, translated_content: data.translatedText }
            : msg
        )
      );
    } catch (err) {
      toast.error("Failed to translate");
    }
  };

  // Conversation list view
  if (!activeConversation) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Messages
          </h2>
        </div>

        {/* Search users */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users to message..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleSearchUsers(e.target.value);
            }}
            className="pl-9"
          />
        </div>

        {/* Search results */}
        {searchResults.length > 0 && (
          <Card>
            <CardContent className="p-2">
              {searchResults.map((userProfile) => {
                const initials = (
                  userProfile.display_name ||
                  userProfile.username ||
                  "U"
                )
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <Button
                    key={userProfile.user_id}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-auto py-2"
                    onClick={() => startConversation(userProfile.user_id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {userProfile.display_name || userProfile.username}
                        </span>
                        {userProfile.country_flag && (
                          <span>{userProfile.country_flag}</span>
                        )}
                      </div>
                      {userProfile.username && (
                        <span className="text-xs text-muted-foreground">
                          @{userProfile.username}
                        </span>
                      )}
                    </div>
                  </Button>
                );
              })}
            </CardContent>
          </Card>
        )}

        {/* Conversations list */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : conversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm mt-2">
                Search for users above to start chatting
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              const otherUser = conv.other_user_profile;
              const initials = (
                otherUser?.display_name ||
                otherUser?.username ||
                "U"
              )
                .substring(0, 2)
                .toUpperCase();

              return (
                <Card
                  key={conv.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setActiveConversation(conv)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={otherUser?.avatar_url || undefined} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-medium truncate">
                          {otherUser?.display_name || otherUser?.username}
                        </span>
                        {otherUser?.country_flag && (
                          <span>{otherUser.country_flag}</span>
                        )}
                      </div>
                      {conv.last_message && (
                        <p className="text-sm text-muted-foreground truncate">
                          {conv.last_message}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conv.last_message_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Active conversation view
  const otherUser = activeConversation.other_user_profile;
  const otherUserInitials = (
    otherUser?.display_name ||
    otherUser?.username ||
    "U"
  )
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col h-[calc(100vh-220px)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b">
        <Button variant="ghost" size="icon" onClick={() => setActiveConversation(null)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Avatar className="h-10 w-10">
          <AvatarImage src={otherUser?.avatar_url || undefined} />
          <AvatarFallback>{otherUserInitials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-1">
            <span className="font-medium">
              {otherUser?.display_name || otherUser?.username}
            </span>
            {otherUser?.country_flag && <span>{otherUser.country_flag}</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-4">
        <div className="space-y-3">
          {messages.map((message) => {
            const isOwn = message.sender_id === user?.id;
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  {message.translated_content && (
                    <div className="mt-2 pt-2 border-t border-current/20">
                      <div className="flex items-center gap-1 text-xs opacity-70 mb-1">
                        <Globe className="h-3 w-3" />
                        Translated
                      </div>
                      <p className="text-sm">{message.translated_content}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs opacity-70">
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {!isOwn && !message.translated_content && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => translateMessage(message.id, message.content)}
                      >
                        <Globe className="h-3 w-3 mr-1" />
                        Translate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="pt-3 border-t flex gap-2">
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <Button onClick={sendMessage} disabled={sendingMessage || !newMessage.trim()}>
          {sendingMessage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
