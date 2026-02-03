import { useState } from "react";
import { Home, PlusSquare, MessageCircle, User, TrendingUp, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SocialFeed } from "./SocialFeed";
import { CreatePost } from "./CreatePost";
import { DirectMessages } from "./DirectMessages";
import { SocialProfile } from "./SocialProfile";
import { SocialDiscover } from "./SocialDiscover";
import { AuthModal } from "./AuthModal";
import { NotificationsBell } from "./NotificationsBell";
import { useAuth } from "@/hooks/useAuth";

type SocialTab = "feed" | "create" | "chat" | "profile" | "discover";

export function SocialLayout() {
  const [activeTab, setActiveTab] = useState<SocialTab>("feed");
  const [showAuth, setShowAuth] = useState(false);
  const { user, loading } = useAuth();

  const tabs: { id: SocialTab; label: string; icon: React.ReactNode; requiresAuth: boolean }[] = [
    { id: "feed", label: "Feed", icon: <Home className="h-5 w-5" />, requiresAuth: false },
    { id: "discover", label: "Discover", icon: <TrendingUp className="h-5 w-5" />, requiresAuth: false },
    { id: "create", label: "Create", icon: <PlusSquare className="h-5 w-5" />, requiresAuth: true },
    { id: "chat", label: "Chat", icon: <MessageCircle className="h-5 w-5" />, requiresAuth: true },
    { id: "profile", label: "Profile", icon: <User className="h-5 w-5" />, requiresAuth: true },
  ];

  const handleTabChange = (tab: SocialTab) => {
    const tabConfig = tabs.find(t => t.id === tab);
    if (tabConfig?.requiresAuth && !user) {
      setShowAuth(true);
      return;
    }
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <SocialFeed />;
      case "discover":
        return <SocialDiscover />;
      case "create":
        return user ? <CreatePost onPostCreated={() => setActiveTab("feed")} /> : null;
      case "chat":
        return user ? <DirectMessages /> : null;
      case "profile":
        return user ? <SocialProfile /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Sub-header for Social */}
      <div className="border-b border-border/40 bg-muted/30">
        <div className="container flex h-12 items-center justify-between">
          <h2 className="font-display font-semibold text-sm tracking-tight">
            LINGUAONE <span className="text-gradient">SOCIAL</span>
          </h2>
          <div className="flex items-center gap-2">
            {user && <NotificationsBell />}
            {!user && !loading && (
              <Button variant="outline" size="sm" onClick={() => setShowAuth(true)}>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container py-4 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur z-50">
        <div className="container flex items-center justify-around py-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex flex-col items-center gap-1 h-auto py-2 px-4",
                activeTab === tab.id && "text-primary"
              )}
            >
              {tab.icon}
              <span className="text-xs">{tab.label}</span>
            </Button>
          ))}
        </div>
      </nav>

      <AuthModal open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}
