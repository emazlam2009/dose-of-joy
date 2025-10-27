import { Sparkles } from "lucide-react";

interface AvatarDisplayProps {
  level: number;
  xp: number;
  maxXp: number;
}

export const AvatarDisplay = ({ level, xp, maxXp }: AvatarDisplayProps) => {
  const progress = (xp / maxXp) * 100;

  return (
    <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-gradient-to-br from-accent to-background border border-border">
      <div className="relative">
        {/* Simple avatar representation - can be enhanced with actual avatar graphics */}
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center animate-float shadow-[var(--shadow-glow)]">
          <Sparkles className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
          {level}
        </div>
      </div>
      <div className="w-full">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Level {level}</span>
          <span>{xp}/{maxXp} XP</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary-glow transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
