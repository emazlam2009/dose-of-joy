import { useState, useEffect } from "react";
import { StreakCounter } from "@/components/StreakCounter";
import { MedicationCard } from "@/components/MedicationCard";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { EncouragementCard } from "@/components/EncouragementCard";
import { ProgressRing } from "@/components/ProgressRing";
import { AdherenceChart } from "@/components/AdherenceChart";
import { BadgeDisplay } from "@/components/BadgeDisplay";
import { MoodDiary } from "@/components/MoodDiary";
import { SideEffectsTracker } from "@/components/SideEffectsTracker";
import { AddMedicationDialog } from "@/components/AddMedicationDialog";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useMedications } from "@/hooks/useMedications";
import { useMedicationLogs } from "@/hooks/useMedicationLogs";
import { useBadges } from "@/hooks/useBadges";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { user, signOut } = useAuth();
  const { profile, updateXP, updateStreak } = useProfile(user?.id);
  const { medications, addMedication } = useMedications(user?.id);
  const { logs, logMedication } = useMedicationLogs(user?.id);
  const { userBadges, checkAndAwardBadges } = useBadges(user?.id);
  const [encouragementMessage, setEncouragementMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const takenToday = logs.length;
  const totalCount = medications.length;
  const progress = totalCount > 0 ? (takenToday / totalCount) * 100 : 0;

  // Generate adherence chart data (last 7 days)
  const adherenceData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      taken: i < 6 ? Math.floor(Math.random() * totalCount) : takenToday,
      total: totalCount,
    };
  });

  const handleTakeMedication = async (medicationId: string) => {
    const now = new Date();
    await logMedication(medicationId, now);
    await updateXP(15);
    
    // Check and award badges
    if (profile) {
      await checkAndAwardBadges({
        medicationsTaken: takenToday + 1,
        streakDays: profile.current_streak,
        moodLogs: 0, // TODO: Track mood logs count
      });
    }
  };

  const isMedicationTakenToday = (medicationId: string) => {
    return logs.some((log) => log.medication_id === medicationId);
  };

  const fetchAIEncouragement = async (context: string) => {
    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-encouragement", {
        body: {
          context,
          takenCount: takenToday,
          totalCount,
          streak: profile?.current_streak || 0,
        },
      });

      if (error) throw error;
      setEncouragementMessage(data.message);
    } catch (error) {
      console.error(error);
      setEncouragementMessage(getDefaultEncouragement());
    } finally {
      setAiLoading(false);
    }
  };

  const getDefaultEncouragement = () => {
    if (takenToday === totalCount) {
      return "Amazing! You've completed all your medications today. You're taking great care of yourself! 🎉";
    }
    if (takenToday > 0) {
      return `You're doing great! ${totalCount - takenToday} more to go. Every step counts! 💪`;
    }
    return "Good morning! Ready to start your wellness journey today? You've got this! 🌟";
  };

  useEffect(() => {
    if (user && profile) {
      fetchAIEncouragement("daily_summary");
    }
  }, [user, profile, takenToday]);

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[length:100%_300px] bg-[image:var(--gradient-subtle)] bg-no-repeat">
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Welcome back, {profile.display_name || "Friend"}!
              </h1>
              <p className="text-muted-foreground">Let's keep your wellness journey going</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Heart className="w-6 h-6 text-primary" fill="currentColor" />
              </button>
              <Button variant="ghost" size="icon" onClick={signOut}>
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="diary">Diary</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="caregiver">Caregiver</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <StreakCounter count={profile.current_streak} maxStreak={profile.max_streak} />
              <AvatarDisplay
                level={profile.avatar_level}
                xp={profile.avatar_xp}
                maxXp={100}
              />
            </div>

            {/* Today's Progress */}
            <div className="flex justify-center">
              <ProgressRing progress={progress} />
            </div>

            {/* AI Encouragement */}
            <EncouragementCard
              message={aiLoading ? "Thinking..." : encouragementMessage}
              type={takenToday === totalCount ? "celebration" : "default"}
            />

            {/* Medications List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Today's Medications</h2>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {takenToday} of {totalCount} taken
                  </span>
                  <AddMedicationDialog onAdd={addMedication} />
                </div>
              </div>

              <div className="space-y-3">
                {medications.map((med) => (
                  <MedicationCard
                    key={med.id}
                    name={med.name}
                    dosage={med.dosage}
                    time={med.time_of_day}
                    taken={isMedicationTakenToday(med.id)}
                    onTake={() => handleTakeMedication(med.id)}
                  />
                ))}
              </div>
            </div>

            {/* Badges */}
            <BadgeDisplay badges={userBadges} />
          </TabsContent>

          <TabsContent value="diary" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <MoodDiary userId={user!.id} />
              <SideEffectsTracker userId={user!.id} medications={medications} />
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <AdherenceChart data={adherenceData} />
            <BadgeDisplay badges={userBadges} />
          </TabsContent>

          <TabsContent value="caregiver" className="space-y-6">
            <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl">
              <h3 className="text-lg font-semibold mb-2">Caregiver Features</h3>
              <p className="text-muted-foreground">
                Invite family members or caregivers to help manage medications and track progress.
                Coming soon!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
