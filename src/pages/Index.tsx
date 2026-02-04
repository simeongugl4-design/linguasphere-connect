import { useState } from "react";
import { Header } from "@/components/Header";
import { TranslationView } from "@/components/TranslationView";
import { ChatInterface } from "@/components/ChatInterface";
import { CameraOCR } from "@/components/CameraOCR";
import { ConversationMode } from "@/components/ConversationMode";
import { SocialLayout } from "@/components/social/SocialLayout";
import { HeroSection } from "@/components/HeroSection";

type TabType = "translate" | "chat" | "camera" | "conversation" | "social" | "home";

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>("home");

  const handleGetStarted = () => setActiveTab("translate");
  const handleExplore = () => setActiveTab("social");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HeroSection onGetStarted={handleGetStarted} onExplore={handleExplore} />;
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

  // Home page has special layout
  if (activeTab === "home") {
    return (
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main>
          {renderContent()}
        </main>
        {/* Footer */}
        <footer className="border-t border-border/40 py-8 mt-auto bg-muted/20">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs font-bold">L</span>
                </div>
                <div>
                  <span className="font-display font-semibold text-foreground">LINGUAONE</span>
                  <span className="ml-2">•</span>
                  <span className="ml-2">AI-Powered Translation</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <span>100+ Languages</span>
                <span className="hidden sm:inline">•</span>
                <span>Real-time Translation</span>
                <span className="hidden sm:inline">•</span>
                <span>Global Social Platform</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border/40 text-center text-xs text-muted-foreground">
              © 2026 LINGUAONE. All rights reserved. Connecting the world through language.
            </div>
          </div>
        </footer>
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
