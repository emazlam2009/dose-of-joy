import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Smile, Meh, Frown } from "lucide-react";

const moodOptions = [
  { value: "great", label: "Great", icon: Smile, color: "text-success" },
  { value: "okay", label: "Okay", icon: Meh, color: "text-primary" },
  { value: "struggling", label: "Struggling", icon: Frown, color: "text-destructive" },
];

interface MoodDiaryProps {
  userId: string;
}

export const MoodDiary = ({ userId }: MoodDiaryProps) => {
  const [mood, setMood] = useState<string>("");
  const [energyLevel, setEnergyLevel] = useState<number>(3);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!mood) {
      toast.error("Please select a mood");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("mood_logs").insert({
      user_id: userId,
      mood,
      energy_level: energyLevel,
      notes,
    });

    if (error) {
      toast.error("Failed to save mood log");
      console.error(error);
    } else {
      toast.success("Mood logged successfully!");
      setMood("");
      setNotes("");
      setEnergyLevel(3);
    }
    setLoading(false);
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">How are you feeling today?</h3>
      
      <div className="space-y-4">
        <div>
          <Label>Mood</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {moodOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setMood(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    mood === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto ${option.color}`} />
                  <p className="text-sm mt-2">{option.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label>Energy Level: {energyLevel}/5</Label>
          <input
            type="range"
            min="1"
            max="5"
            value={energyLevel}
            onChange={(e) => setEnergyLevel(Number(e.target.value))}
            className="w-full mt-2"
          />
        </div>

        <div>
          <Label>Notes (optional)</Label>
          <Textarea
            placeholder="How are you feeling? Any thoughts to share?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2"
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Saving..." : "Log Mood"}
        </Button>
      </div>
    </Card>
  );
};