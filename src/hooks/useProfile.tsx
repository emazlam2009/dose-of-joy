import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_level: number;
  avatar_xp: number;
  current_streak: number;
  max_streak: number;
}

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error(error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const updateXP = async (xpGain: number) => {
    if (!profile || !userId) return;

    const maxXp = 100;
    let newXp = profile.avatar_xp + xpGain;
    let newLevel = profile.avatar_level;

    if (newXp >= maxXp) {
      newLevel += 1;
      newXp = newXp - maxXp;
      toast.success(`Level up! You're now level ${newLevel}! 🎉`);
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        avatar_xp: newXp,
        avatar_level: newLevel,
      })
      .eq("id", userId);

    if (error) {
      console.error(error);
    } else {
      setProfile({ ...profile, avatar_xp: newXp, avatar_level: newLevel });
    }
  };

  const updateStreak = async (newStreak: number) => {
    if (!profile || !userId) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
        max_streak: Math.max(newStreak, profile.max_streak),
      })
      .eq("id", userId);

    if (error) {
      console.error(error);
    } else {
      setProfile({
        ...profile,
        current_streak: newStreak,
        max_streak: Math.max(newStreak, profile.max_streak),
      });
    }
  };

  return { profile, loading, updateXP, updateStreak };
};