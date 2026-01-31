import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SwapButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function SwapButton({ onClick, disabled = false, className }: SwapButtonProps) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "h-12 w-12 rounded-full border-2 border-accent/30 bg-card shadow-soft",
        "hover:border-accent hover:bg-accent/10 hover:shadow-glow",
        "transition-all duration-300 ease-out",
        "disabled:opacity-50 disabled:hover:border-accent/30 disabled:hover:bg-card",
        className
      )}
    >
      <ArrowLeftRight className="h-5 w-5 text-accent" />
    </Button>
  );
}
