import { Globe, Languages, MessageSquare, Camera, Users, Mic, Zap, Shield, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onGetStarted: () => void;
  onExplore: () => void;
}

export function HeroSection({ onGetStarted, onExplore }: HeroSectionProps) {
  const features = [
    {
      icon: <Languages className="h-6 w-6" />,
      title: "100+ Languages",
      description: "Translate text and speech across over 100 languages instantly",
    },
    {
      icon: <Mic className="h-6 w-6" />,
      title: "Voice Translation",
      description: "Speak naturally and hear translations in real-time",
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Camera OCR",
      description: "Point your camera at any text to translate instantly",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Connect",
      description: "Join a global community with auto-translated posts",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Direct Messaging",
      description: "Chat with anyone in their language, we translate for you",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "AI Powered",
      description: "Advanced AI ensures accurate, context-aware translations",
    },
  ];

  const stats = [
    { value: "100+", label: "Languages" },
    { value: "50M+", label: "Translations" },
    { value: "1M+", label: "Users" },
    { value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 gradient-hero opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl" />
      
      {/* Main Hero */}
      <section className="relative py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8 animate-fade-in-up">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">AI-Powered Translation Platform</span>
            </div>
            
            {/* Main Headline */}
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Break Language
              <br />
              <span className="text-gradient">Barriers Instantly</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Translate text, voice, and images across 100+ languages. 
              Connect with the world through our AI-powered social platform 
              where every message is understood.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Button 
                size="lg" 
                onClick={onGetStarted}
                className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity px-8 py-6 text-lg"
              >
                <Globe className="mr-2 h-5 w-5" />
                Start Translating
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={onExplore}
                className="px-8 py-6 text-lg"
              >
                <Users className="mr-2 h-5 w-5" />
                Explore Social
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display font-bold text-3xl md:text-4xl text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Everything You Need to <span className="text-gradient">Communicate</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed to make global communication effortless
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300 border border-border/50 hover:border-accent/30"
              >
                <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white mb-4 shadow-glow">
                    {feature.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-16 md:py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Privacy First</h3>
                <p className="text-sm text-muted-foreground">
                  Your conversations are secure and never stored without consent
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time translations powered by advanced AI technology
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Wifi className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">Works Offline</h3>
                <p className="text-sm text-muted-foreground">
                  Download languages for offline translation anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
