import { Heart, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

interface EncouragementCardProps {
  message: string;
  type?: "default" | "celebration" | "reminder";
}

export const EncouragementCard = ({ message, type = "default" }: EncouragementCardProps) => {
  const bgStyles = {
    default: "bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20",
    celebration: "bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20",
    reminder: "bg-gradient-to-br from-accent to-background border-border",
  };

  const iconStyles = {
    default: "text-primary",
    celebration: "text-secondary",
    reminder: "text-muted-foreground",
  };

  return (
    <Card className={`p-4 animate-slide-up ${bgStyles[type]}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconStyles[type]}`}>
          {type === "celebration" ? (
            <Sparkles className="w-5 h-5" />
          ) : (
            <Heart className="w-5 h-5" fill={type === "default" ? "currentColor" : "none"} />
          )}
        </div>
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
      </div>
    </Card>
  );
};
