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
            <div className="text-center mb-4 sm:mb-10">
              <h1 className="font-display font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-3 tracking-tight">
                Translate <span className="text-gradient">Instantly</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-lg max-w-2xl mx-auto px-4">
                AI-powered translations across 100+ languages.
              </p>
            </div>
            <TranslationView />
          </div>
        );
      case "camera":
        return (
          <div className="animate-fade-in-up">
            <div className="text-center mb-4 sm:mb-10">
              <h1 className="font-display font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-3 tracking-tight">
                Camera <span className="text-gradient">Translation</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-lg max-w-2xl mx-auto px-4">
                Point your camera at any text to translate instantly.
              </p>
            </div>
            <CameraOCR />
          </div>
        );
      case "conversation":
        return (
          <div className="animate-fade-in-up">
            <div className="text-center mb-4 sm:mb-10">
              <h1 className="font-display font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl mb-1 sm:mb-3 tracking-tight">
                Conversation <span className="text-gradient">Mode</span>
              </h1>
              <p className="text-muted-foreground text-xs sm:text-lg max-w-2xl mx-auto px-4">
                Real-time translated conversations with anyone.
              </p>
            </div>
            <ConversationMode />
          </div>
        );
      case "social":
        return <SocialLayout />;
      case "chat":
        return <div className="animate-fade-in-up"><ChatInterface /></div>;
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
        <main className="relative z-10">{renderContent()}</main>
        <footer className="relative z-10 border-t border-border/40 py-4 sm:py-8 mt-auto bg-muted/20">
          <div className="container px-4">
            <div className="flex flex-col items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground text-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full gradient-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-[8px] sm:text-xs font-bold">L</span>
                </div>
                <div>
                  <span className="font-display font-semibold text-foreground text-xs sm:text-base">LINGUAONE</span>
                  <span className="ml-1 sm:ml-2">•</span>
                  <span className="ml-1 sm:ml-2">AI Translation</span>
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border/40 text-center text-[10px] sm:text-xs text-muted-foreground">
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
      <main className="container py-3 sm:py-8 px-3 sm:px-6">{renderContent()}</main>
      <footer className="border-t border-border/40 py-3 sm:py-6 mt-auto">
        <div className="container px-4">
          <div className="flex flex-col items-center gap-2 text-[10px] sm:text-sm text-muted-foreground text-center">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-foreground">LINGUAONE AI</span>
              <span>•</span>
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
