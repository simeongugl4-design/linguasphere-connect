 import { Globe, Languages, MessageSquare, Camera, Users, Mic, Zap, Shield, Wifi } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { totalLanguages, allRegions } from "@/lib/languages";
 import { memo, useMemo } from "react";
 
 interface HeroSectionProps {
   onGetStarted: () => void;
   onExplore: () => void;
 }
 
 const FeatureCard = memo(({ icon, title, description, index }: { 
   icon: React.ReactNode; 
   title: string; 
   description: string; 
   index: number;
 }) => (
   <div 
     className="group relative bg-card rounded-2xl p-6 shadow-card hover:shadow-soft transition-all duration-300 border border-border/50 hover:border-accent/30 animate-fade-in-up"
     style={{ animationDelay: `${0.1 * index}s` }}
   >
     <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
     <div className="relative">
       <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center text-white mb-4 shadow-glow">
         {icon}
       </div>
       <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
       <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
     </div>
   </div>
 ));
 FeatureCard.displayName = "FeatureCard";
 
 const StatItem = memo(({ value, label }: { value: string; label: string }) => (
   <div className="text-center">
     <div className="font-display font-bold text-3xl md:text-4xl text-foreground mb-1">{value}</div>
     <div className="text-sm text-muted-foreground">{label}</div>
   </div>
 ));
 StatItem.displayName = "StatItem";
 
 const FloatingBadge = memo(({ flag, name, delay, position }: { 
   flag: string; 
   name: string; 
   delay: number;
   position: string;
 }) => (
   <div 
     className={`absolute ${position} hidden lg:flex items-center gap-2 px-3 py-2 bg-card/90 backdrop-blur-sm rounded-full shadow-soft border border-border/30 animate-fade-in-up animate-float`}
     style={{ animationDelay: `${delay}s` }}
   >
     <span className="text-xl">{flag}</span>
     <span className="text-xs font-medium text-muted-foreground">{name}</span>
   </div>
 ));
 FloatingBadge.displayName = "FloatingBadge";
 
 export const HeroSection = memo(function HeroSection({ onGetStarted, onExplore }: HeroSectionProps) {
   const features = useMemo(() => [
     {
       icon: <Languages className="h-6 w-6" />,
       title: `${totalLanguages}+ Languages`,
       description: `Translate text and speech across ${totalLanguages}+ languages from ${allRegions.length} regions worldwide`,
     },
     {
       icon: <Mic className="h-6 w-6" />,
       title: "Voice Translation",
       description: "Speak naturally and hear translations in real-time with native accents",
     },
     {
       icon: <Camera className="h-6 w-6" />,
       title: "Camera OCR",
       description: "Point your camera at any text to translate instantly on the go",
     },
     {
       icon: <Users className="h-6 w-6" />,
       title: "Social Connect",
       description: "Join a global community with auto-translated posts and comments",
     },
     {
       icon: <MessageSquare className="h-6 w-6" />,
       title: "Direct Messaging",
       description: "Chat with anyone in their language, we translate for you instantly",
     },
     {
       icon: <Zap className="h-6 w-6" />,
       title: "AI Powered",
       description: "Advanced AI ensures accurate, context-aware translations every time",
     },
   ], []);
 
   const stats = useMemo(() => [
     { value: `${totalLanguages}+`, label: "Languages" },
     { value: "50M+", label: "Translations" },
     { value: "1M+", label: "Users" },
     { value: "99.9%", label: "Uptime" },
   ], []);
 
   const floatingLanguages = useMemo(() => [
     { flag: "🇵🇬", name: "Tok Pisin", delay: 0.5, position: "top-32 left-8" },
     { flag: "🇯🇵", name: "日本語", delay: 0.7, position: "top-48 right-12" },
     { flag: "🇸🇦", name: "العربية", delay: 0.9, position: "bottom-48 left-16" },
     { flag: "🇰🇪", name: "Kiswahili", delay: 1.1, position: "bottom-32 right-8" },
     { flag: "🇧🇷", name: "Português", delay: 1.3, position: "top-64 left-24" },
     { flag: "🇫🇷", name: "Français", delay: 1.5, position: "bottom-64 right-20" },
   ], []);
 
   return (
     <div className="relative overflow-hidden">
       {/* Hero Background */}
       <div className="absolute inset-0 gradient-hero opacity-5" />
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-3xl" />
       
       {/* Animated floating language badges */}
       {floatingLanguages.map((lang, i) => (
         <FloatingBadge key={i} {...lang} />
       ))}
       
       {/* Main Hero */}
       <section className="relative py-16 md:py-24">
         <div className="container">
           <div className="max-w-4xl mx-auto text-center">
             {/* Badge */}
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-8 animate-fade-in-up">
               <Zap className="h-4 w-4" />
               <span className="text-sm font-medium">AI-Powered • {totalLanguages}+ Languages • {allRegions.length} Regions</span>
             </div>
             
             {/* Main Headline */}
             <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
               Break Language
               <br />
               <span className="text-gradient">Barriers Instantly</span>
             </h1>
             
             {/* Subheadline */}
             <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
               Translate text, voice, and images across {totalLanguages}+ languages. 
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
                 <StatItem key={index} {...stat} />
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
               <FeatureCard key={index} {...feature} index={index} />
             ))}
           </div>
           
           {/* Region coverage */}
           <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
             {allRegions.slice(0, 8).map((region, index) => (
               <span 
                 key={region} 
                 className="px-4 py-2 bg-card rounded-full text-sm font-medium text-muted-foreground border border-border/50 animate-fade-in-up"
                 style={{ animationDelay: `${0.1 * index}s` }}
               >
                 {region}
               </span>
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
 });