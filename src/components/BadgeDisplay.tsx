import { Card } from "@/components/ui/card";
import { Badge as BadgeType } from "@/hooks/useBadges";
import { Star, Flame, Trophy, Crown, Medal, Heart, Sparkles } from "lucide-react";

const iconMap: Record<string, any> = {
  star: Star,
  flame: Flame,
  trophy: Trophy,
  crown: Crown,
  medal: Medal,
  heart: Heart,
  sparkles: Sparkles,
};

interface BadgeDisplayProps {
  badges: Array<{ badges: BadgeType; earned_at: string }>;
}

export const BadgeDisplay = ({ badges }: BadgeDisplayProps) => {
  if (badges.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-2">Badges</h3>
        <p className="text-sm text-muted-foreground">
          Keep logging medications to earn your first badge!
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Badges Earned</h3>
      <div className="grid grid-cols-3 gap-4">
        {badges.map(({ badges: badge }) => {
          const Icon = iconMap[badge.icon] || Star;
          return (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 p-3 rounded-lg bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20"
            >
              <Icon className="w-8 h-8 text-secondary" fill="currentColor" />
              <span className="text-xs font-medium text-center">{badge.name}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};