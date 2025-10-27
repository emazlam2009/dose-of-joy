import { Flame } from "lucide-react";

interface StreakCounterProps {
  count: number;
  maxStreak?: number;
}

export const StreakCounter = ({ count, maxStreak = 0 }: StreakCounterProps) => {
  return (
    <div className="flex items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
      <div className="relative">
        <Flame 
          className={`w-12 h-12 transition-all duration-300 ${
            count > 0 ? "text-primary animate-pulse-soft" : "text-muted-foreground"
          }`}
          fill={count > 0 ? "currentColor" : "none"}
        />
        {count > 7 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full animate-pulse-soft" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-foreground">{count}</span>
          <span className="text-sm text-muted-foreground">day streak</span>
        </div>
        {maxStreak > count && (
          <p className="text-xs text-muted-foreground mt-1">
            Best: {maxStreak} days
          </p>
        )}
      </div>
    </div>
  );
};
