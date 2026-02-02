import { useState } from "react";
import { Header } from "@/components/Header";
import { TranslationView } from "@/components/TranslationView";
import { ChatInterface } from "@/components/ChatInterface";
import { CameraOCR } from "@/components/CameraOCR";
import { ConversationMode } from "@/components/ConversationMode";
import { SocialLayout } from "@/components/social/SocialLayout";

type TabType = "translate" | "chat" | "camera" | "conversation" | "social";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("translate");

  const renderContent = () => {
    switch (activeTab) {
      case "translate":
        return (
          <div className="animate-fade-in-up">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">
                Translate <span className="text-gradient">Instantly</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Break language barriers with AI-powered translations across 100+ languages.
                Text, voice, and conversations — all in real time.
              </p>
            </div>
            <TranslationView />
          </div>
        );
      case "camera":
        return (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">
                Camera <span className="text-gradient">Translation</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Point your camera at any text to instantly extract and translate it.
                Perfect for signs, menus, documents, and more.
              </p>
            </div>
            <CameraOCR />
          </div>
        );
      case "conversation":
        return (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h1 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-3 tracking-tight">
                Conversation <span className="text-gradient">Mode</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Have real-time translated conversations with anyone.
                Each person speaks their language — we translate both ways.
              </p>
            </div>
            <ConversationMode />
          </div>
        );
      case "social":
        return <SocialLayout />;
      case "chat":
        return (
          <div className="animate-fade-in-up">
            <ChatInterface />
          </div>
        );
      default:
        return null;
    }
  };

  // Social tab has its own layout with header/footer
  if (activeTab === "social") {
    return (
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <SocialLayout />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 mt-auto">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-foreground">LINGUAONE AI</span>
              <span>•</span>
              <span>Powered by advanced AI</span>
            </div>
            <div className="flex items-center gap-4">
              <span>100+ Languages</span>
              <span>•</span>
              <span>Real-time Translation</span>
              <span>•</span>
              <span>Offline Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
