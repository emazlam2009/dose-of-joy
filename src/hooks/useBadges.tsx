import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
}

export interface UserBadge {
  id: string;
  badge_id: string;
  earned_at: string;
  badges: Badge;
}

export const useBadges = (userId: string | undefined) => {
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      const { data: badges } = await supabase.from("badges").select("*");
      setAllBadges(badges || []);
    };

    fetchBadges();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchUserBadges = async () => {
      const { data, error } = await supabase
        .from("user_badges")
        .select("*, badges(*)")
        .eq("user_id", userId);

      if (error) {
        console.error(error);
      } else {
        setUserBadges(data || []);
      }
      setLoading(false);
    };

    fetchUserBadges();

    // Set up realtime subscription
    const channel = supabase
      .channel("user-badges-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_badges",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchUserBadges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const checkAndAwardBadges = async (stats: {
    medicationsTaken: number;
    streakDays: number;
    moodLogs: number;
  }) => {
    if (!userId) return;

    const earnedBadgeIds = new Set(userBadges.map((ub) => ub.badge_id));

    for (const badge of allBadges) {
      if (earnedBadgeIds.has(badge.id)) continue;

      let shouldAward = false;
      if (badge.requirement_type === "medications_taken" && stats.medicationsTaken >= badge.requirement_value) {
        shouldAward = true;
      } else if (badge.requirement_type === "streak_days" && stats.streakDays >= badge.requirement_value) {
        shouldAward = true;
      } else if (badge.requirement_type === "mood_logs" && stats.moodLogs >= badge.requirement_value) {
        shouldAward = true;
      }

      if (shouldAward) {
        const { error } = await supabase.from("user_badges").insert({
          user_id: userId,
          badge_id: badge.id,
        });

        if (!error) {
          toast.success(`🏆 Badge earned: ${badge.name}!`);
        }
      }
    }
  };

  return { allBadges, userBadges, loading, checkAndAwardBadges };
};