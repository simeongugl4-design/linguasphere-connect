import { Globe, Languages, MessageSquare, Camera, Users, Mic, Zap, Shield, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { totalLanguages, allRegions } from "@/lib/languages";
import { memo, useMemo } from "react";

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

const FeatureCard = memo(({ icon, title, description, index }: { 
  icon: React.ReactNode; title: string; description: string; index: number;
}) => (
  <div 
    className="group relative bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-card hover:shadow-soft transition-all duration-300 border border-border/50 hover:border-accent/30 animate-fade-in-up"
    style={{ animationDelay: `${0.1 * index}s` }}
  >
    <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl gradient-accent flex items-center justify-center text-white mb-3 sm:mb-4 shadow-glow">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-sm sm:text-lg mb-1 sm:mb-2">{title}</h3>
      <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{description}</p>
    </div>
  </div>
));
FeatureCard.displayName = "FeatureCard";

const StatItem = memo(({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-foreground mb-0.5">{value}</div>
    <div className="text-[10px] sm:text-sm text-muted-foreground">{label}</div>
  </div>
));
StatItem.displayName = "StatItem";

export const HeroSection = memo(function HeroSection({ onGetStarted, onExplore }: HeroSectionProps) {
  const features = useMemo(() => [
    { icon: <Languages className="h-5 w-5 sm:h-6 sm:w-6" />, title: `${totalLanguages}+ Languages`, description: `Translate across ${totalLanguages}+ languages from ${allRegions.length} regions` },
    { icon: <Mic className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Voice Translation", description: "Speak naturally and hear translations in real-time" },
    { icon: <Camera className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Camera OCR", description: "Point your camera at any text to translate instantly" },
    { icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Social Connect", description: "Join a global community with auto-translated posts" },
    { icon: <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />, title: "Direct Messaging", description: "Chat with anyone in their language instantly" },
    { icon: <Zap className="h-5 w-5 sm:h-6 sm:w-6" />, title: "AI Powered", description: "Advanced AI for accurate, context-aware translations" },
  ], []);

  const stats = useMemo(() => [
    { value: `${totalLanguages}+`, label: "Languages" },
    { value: "50M+", label: "Translations" },
    { value: "1M+", label: "Users" },
    { value: "99.9%", label: "Uptime" },
  ], []);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-accent/10 rounded-full blur-3xl" />

      {/* Main Hero */}
      <section className="relative py-10 sm:py-16 md:py-24">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent/10 text-accent mb-5 sm:mb-8 animate-fade-in-up">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-[10px] sm:text-sm font-medium">AI-Powered • {totalLanguages}+ Languages</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-4 sm:mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Break Language
              <br />
              <span className="text-gradient">Barriers Instantly</span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-10 animate-fade-in-up px-2" style={{ animationDelay: "0.2s" }}>
              Translate text, voice, and images across {totalLanguages}+ languages.
              Connect with the world through our AI-powered platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button size="lg" onClick={onGetStarted}
                className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-lg w-full sm:w-auto">
                <Globe className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Start Translating
              </Button>
              <Button size="lg" variant="outline" onClick={onExplore}
                className="px-6 py-5 sm:px-8 sm:py-6 text-sm sm:text-lg w-full sm:w-auto">
                <Users className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                Explore Social
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-6 md:gap-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, i) => <StatItem key={i} {...stat} />)}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-10 sm:py-16 md:py-24 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-display font-bold text-xl sm:text-3xl md:text-4xl mb-2 sm:mb-4">
              Everything You Need to <span className="text-gradient">Communicate</span>
            </h2>
            <p className="text-muted-foreground text-xs sm:text-lg max-w-2xl mx-auto">
              Powerful features for effortless global communication
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {features.map((f, i) => <FeatureCard key={i} {...f} index={i} />)}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="relative py-10 sm:py-16 md:py-20">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 sm:gap-8 text-center">
            {[
              { icon: <Shield className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />, title: "Privacy First", desc: "Conversations secure and never stored without consent" },
              { icon: <Zap className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />, title: "Lightning Fast", desc: "Real-time translations powered by advanced AI" },
              { icon: <Wifi className="h-5 w-5 sm:h-7 sm:w-7 text-primary" />, title: "Works Offline", desc: "Download languages for offline translation" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-4">
                  {item.icon}
                </div>
                <h3 className="font-display font-semibold text-xs sm:text-base mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-[10px] sm:text-sm text-muted-foreground hidden sm:block">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
});
