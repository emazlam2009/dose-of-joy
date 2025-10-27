import { useState } from "react";
import { StreakCounter } from "@/components/StreakCounter";
import { MedicationCard } from "@/components/MedicationCard";
import { AvatarDisplay } from "@/components/AvatarDisplay";
import { EncouragementCard } from "@/components/EncouragementCard";
import { ProgressRing } from "@/components/ProgressRing";
import { Heart, Moon, Sun } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

const Index = () => {
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "Vitamin D", dosage: "1000 IU", time: "8:00 AM", taken: false },
    { id: "2", name: "Omega-3", dosage: "1200mg", time: "8:00 AM", taken: false },
    { id: "3", name: "Magnesium", dosage: "400mg", time: "9:00 PM", taken: false },
  ]);

  const [streak, setStreak] = useState(7);
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(45);
  const maxXp = 100;

  const handleTakeMedication = (id: string) => {
    setMedications(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: true } : med
      )
    );
    
    // Add XP
    setXp(prev => {
      const newXp = prev + 15;
      if (newXp >= maxXp) {
        setLevel(l => l + 1);
        return newXp - maxXp;
      }
      return newXp;
    });
  };

  const takenCount = medications.filter(m => m.taken).length;
  const totalCount = medications.length;
  const progress = totalCount > 0 ? (takenCount / totalCount) * 100 : 0;

  const getEncouragementMessage = () => {
    if (takenCount === totalCount) {
      return "Amazing! You've completed all your medications today. You're taking great care of yourself! 🎉";
    }
    if (takenCount > 0) {
      return `You're doing great! ${totalCount - takenCount} more to go. Every step counts! 💪`;
    }
    return "Good morning! Ready to start your wellness journey today? You've got this! 🌟";
  };

  return (
    <div className="min-h-screen bg-[length:100%_300px] bg-[image:var(--gradient-subtle)] bg-no-repeat">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">Welcome back!</h1>
              <p className="text-muted-foreground">Let's keep your wellness journey going</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-accent transition-colors">
              <Heart className="w-6 h-6 text-primary" fill="currentColor" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <StreakCounter count={streak} maxStreak={12} />
          <AvatarDisplay level={level} xp={xp} maxXp={maxXp} />
        </div>

        {/* Today's Progress */}
        <div className="mb-8 flex justify-center">
          <ProgressRing progress={progress} />
        </div>

        {/* AI Encouragement */}
        <div className="mb-8">
          <EncouragementCard 
            message={getEncouragementMessage()}
            type={takenCount === totalCount ? "celebration" : "default"}
          />
        </div>

        {/* Medications List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Today's Medications</h2>
            <span className="text-sm text-muted-foreground">
              {takenCount} of {totalCount} taken
            </span>
          </div>
          
          <div className="space-y-3">
            {medications.map(med => (
              <MedicationCard
                key={med.id}
                name={med.name}
                dosage={med.dosage}
                time={med.time}
                taken={med.taken}
                onTake={() => handleTakeMedication(med.id)}
              />
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        {takenCount === totalCount && (
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Moon className="w-5 h-5 text-success" />
              Evening Reminder
            </h3>
            <p className="text-sm text-muted-foreground">
              Great job today! Remember to take your evening dose at 9:00 PM. Setting a reminder can help you maintain your streak! 
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
