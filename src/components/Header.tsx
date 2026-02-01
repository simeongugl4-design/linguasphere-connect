import { Globe, MessageCircle, Camera, Users, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { OfflineIndicator } from "@/components/OfflineIndicator";

type TabType = "translate" | "chat" | "camera" | "conversation";

interface HeaderProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
  { id: "translate", label: "Translate", icon: <Globe className="h-4 w-4" /> },
  { id: "camera", label: "Camera", icon: <Camera className="h-4 w-4" /> },
  { id: "conversation", label: "Conversation", icon: <Users className="h-4 w-4" /> },
  { id: "chat", label: "AI Assistant", icon: <MessageCircle className="h-4 w-4" /> },
];

export function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-accent/20 animate-pulse-ring" />
            <div className="relative h-10 w-10 rounded-full gradient-primary flex items-center justify-center shadow-glow">
              <Globe className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg tracking-tight">LINGUAONE</span>
            <span className="text-[10px] text-accent font-medium tracking-widest -mt-1">AI TRANSLATOR</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-full bg-muted/50">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "rounded-full px-4 transition-all",
                activeTab === tab.id && "bg-card shadow-soft"
              )}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <OfflineIndicator />
          
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-4 mt-8">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => onTabChange(tab.id)}
                    className="justify-start"
                  >
                    {tab.icon}
                    <span className="ml-3">{tab.label}</span>
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
