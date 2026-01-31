import { Globe, MessageCircle, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeTab: "translate" | "chat";
  onTabChange: (tab: "translate" | "chat") => void;
}

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
          <Button
            variant="ghost"
            onClick={() => onTabChange("translate")}
            className={cn(
              "rounded-full px-6 transition-all",
              activeTab === "translate" && "bg-card shadow-soft"
            )}
          >
            <Globe className="h-4 w-4 mr-2" />
            Translate
          </Button>
          <Button
            variant="ghost"
            onClick={() => onTabChange("chat")}
            className={cn(
              "rounded-full px-6 transition-all",
              activeTab === "chat" && "bg-card shadow-soft"
            )}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </nav>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 mt-8">
              <Button
                variant={activeTab === "translate" ? "default" : "ghost"}
                onClick={() => onTabChange("translate")}
                className="justify-start"
              >
                <Globe className="h-4 w-4 mr-3" />
                Translate
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => onTabChange("chat")}
                className="justify-start"
              >
                <MessageCircle className="h-4 w-4 mr-3" />
                AI Assistant
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
