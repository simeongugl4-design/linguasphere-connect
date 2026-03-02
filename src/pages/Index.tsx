import { useState } from "react";
import { Header } from "@/components/Header";
import { TranslationView } from "@/components/TranslationView";
import { ChatInterface } from "@/components/ChatInterface";
import { CameraOCR } from "@/components/CameraOCR";
import { ConversationMode } from "@/components/ConversationMode";
import { SocialLayout } from "@/components/social/SocialLayout";
import { HeroSection } from "@/components/HeroSection";
import ShaderBackground from "@/components/ui/shader-background";

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
            <div className="text-center mb-6 sm:mb-10">
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 tracking-tight">
                Translate <span className="text-gradient">Instantly</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4">
                Break language barriers with AI-powered translations across 100+ languages.
              </p>
            </div>
            <TranslationView />
          </div>
        );
      case "camera":
        return (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6 sm:mb-10">
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 tracking-tight">
                Camera <span className="text-gradient">Translation</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4">
                Point your camera at any text to instantly extract and translate it.
              </p>
            </div>
            <CameraOCR />
          </div>
        );
      case "conversation":
        return (
          <div className="animate-fade-in-up">
            <div className="text-center mb-6 sm:mb-10">
              <h1 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-2 sm:mb-3 tracking-tight">
                Conversation <span className="text-gradient">Mode</span>
              </h1>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto px-4">
                Have real-time translated conversations with anyone.
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

  if (activeTab === "social") {
    return (
      <div className="min-h-screen bg-background">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <SocialLayout />
      </div>
    );
  }

  if (activeTab === "home") {
    return (
      <div className="min-h-screen bg-background relative">
        <ShaderBackground />
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="relative z-10">
          {renderContent()}
        </main>
        <footer className="relative z-10 border-t border-border/40 py-6 sm:py-8 mt-auto bg-muted/20">
          <div className="container px-4">
            <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground text-center">
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
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <span>100+ Languages</span>
                <span>•</span>
                <span>Real-time Translation</span>
                <span>•</span>
                <span>Global Social Platform</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
              © 2026 LINGUAONE. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container py-4 sm:py-8 px-3 sm:px-6">
        {renderContent()}
      </main>

      <footer className="border-t border-border/40 py-4 sm:py-6 mt-auto">
        <div className="container px-4">
          <div className="flex flex-col items-center gap-3 text-xs sm:text-sm text-muted-foreground text-center">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-foreground">LINGUAONE AI</span>
              <span>•</span>
              <span>Powered by advanced AI</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
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
